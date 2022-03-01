"use strict";
exports.__esModule = true;
exports.WarningInfoServer = void 0;
var request_1 = require("../../util/request");
var configRegistry_1 = require("@/util/configRegistry");
/* 预警信息*/
var WarningInfoServer = /** @class */ (function () {
    function WarningInfoServer(opt, axiosFilterFn) {
        this.rSerivce = new request_1.RequestServerClass(opt);
        this.rSerivce2 = new request_1.RequestServerClass({
            baseURL: configRegistry_1["default"].value.floodServerPath
        });
        this.emapServiceFilter = configRegistry_1["default"].value.district;
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
    WarningInfoServer.prototype.getConfig = function (url) {
        // const url = './json/map.json';
        return this.rSerivce.serverObj.get(url);
    };
    /**
     * 获取预警信息统计
     * @param opts
     * @param opts.type {String} 预警类型，逗号隔开
     * @param opts.startTime {String} 开始时间
     * @param opts.endTime {String} 结束时间
     * @param opts.districtCode {String} 行政区划编码，逗号隔开
     */
    WarningInfoServer.prototype.getData = function (opts) {
        if (!opts.districtCode) {
            opts.searchType = '1';
        }
        else {
            opts.searchType = '2';
        }
        var url = '/api/event/weathercount/list/v1';
        return this.rSerivce.serverObj.post(url, opts);
    };
    /**
     * 获取预警信息统计,返回对应的所有类型
     * @param opts
     * @param opts.type {String} 预警类型，逗号隔开
     * @param opts.startTime {String} 开始时间
     * @param opts.endTime {String} 结束时间
     * @param opts.districtCode {String} 行政区划编码，逗号隔开
     */
    WarningInfoServer.prototype.getDataHas = function (opts) {
        if (!opts.districtCode) {
            opts.searchType = '1';
        }
        else {
            opts.searchType = '1';
        }
        this.emapServiceFilter = configRegistry_1["default"].value.district;
        var self = this;
        if (!opts.districtCode &&
            self.emapServiceFilter &&
            self.emapServiceFilter.root) {
            opts.districtCode = self.emapServiceFilter.root;
        }
        var url = '/api/event/weathercounts/include/zero/list/v1';
        return this.rSerivce.serverObj.post(url, opts);
    };
    /**
     * 获取预警信息
     * @param opts
     * @param opts.type {String} 预警类型
     * @param opts.startTime {String} 开始时间
     * @param opts.endTime {String} 结束时间
     * @param opts.districtCode {String} 行政区划编码，逗号隔开
     * @param opts.nowPage {integer} 当前页数
     * @param opts.pageSize {integer} 每页记录数
     */
    WarningInfoServer.prototype.getTypeData = function (opts) {
        if (!opts.districtCode) {
            opts.searchType = '1';
        }
        else {
            opts.searchType = '1';
        }
        this.emapServiceFilter = configRegistry_1["default"].value.district;
        var self = this;
        if (!opts.districtCode &&
            self.emapServiceFilter &&
            self.emapServiceFilter.root) {
            opts.districtCode = self.emapServiceFilter.root;
        }
        var url = '/api/event/weather/list/v1';
        if (opts.nowPage && opts.pageSize) {
            url = '/api/event/weather/page/list/v1';
        }
        return this.rSerivce.serverObj.post(url, opts);
    };
    /**
     * 预警类型统计
     * @param opts
     * @param opts.type  预警类型:（大风：11B06，暴雨：11B03，台风：11B01，雷电：11B14，地灾：11B37）(多个逗号隔开)
     * @param opts.startTime {String} 开始时间
     * @param opts.endTime {String} 结束时间
     * @param opts.districtCode {String} 行政区划编码
     * @param opts.searchType {String} 匹配方式。1：区域编码父子级别匹配，2：区域编码精准匹配
     */
    WarningInfoServer.prototype.getWeatherWarningStatic = function (opts) {
        var _this = this;
        var url = '/api/event/weather/SignalTypeLevel/list/v1';
        var result = {};
        return new Promise(function (resolve, reject) {
            _this.rSerivce2.serverObj.post(url, opts).then(function (res) {
                var data = JSON.parse(res.data.data.levelList);
                result.data = data;
                result.total = res.data.data.total;
                resolve(result);
            });
        });
    };
    /**
     * 预警信息查询
     * @param opts
     * @param {Array} opts.type   type:[{code:'11B06',level:'红色，橙色'}，{code:'11B03',level:'红色，橙色'}] 预警类型:（大风：11B06，暴雨：11B03，台风：11B01，雷电：11B14，地灾：11B37）
     * @param opts.nowPage  1
     * @param opts.pageSize 10
     * @param opts.startTime {String} 开始时间
     * @param opts.endTime {String} 结束时间
     * @param opts.districtCode {String} 行政区划编码
     * @param opts.searchType {String} 匹配方式。1：区域编码父子级别匹配，2：区域编码精准匹配
     */
    WarningInfoServer.prototype.getWeatherWarningList = function (opts) {
        var _this = this;
        var url = '/api/event/weather/weatherLevelPageList/list/v1';
        var result = {};
        return new Promise(function (resolve, reject) {
            _this.rSerivce2.serverObj.post(url, opts).then(function (res) {
                result.data = res.data.data.weatherRespList;
                result.total = res.data.data.total;
                resolve(result);
            });
        });
    };
    return WarningInfoServer;
}());
exports.WarningInfoServer = WarningInfoServer;
