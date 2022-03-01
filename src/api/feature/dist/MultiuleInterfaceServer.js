"use strict";
exports.__esModule = true;
exports.MultiuleInterfaceServer = void 0;
var request_1 = require("../../util/request");
var configRegistry_1 = require("@/util/configRegistry");
var MultiuleQueryParamConfigList_yt_1 = require("@/gis/normal/resource/MultiuleQueryParamConfigList_yt");
var MultiuleInterfaceServer = /** @class */ (function () {
    function MultiuleInterfaceServer(opt, axiosFilterFn) {
        this.egisOpts = {};
        opt.baseURL = window.EMAP_CONFIG.common.resourceServer;
        this.rSerivce = new request_1.RequestServerClass(opt);
        this.egisOpts = configRegistry_1["default"].value.egis;
        this.eadsService = configRegistry_1["default"].value.serverPathNew;
    }
    /**
     * 展示屏信息 发送到 推送屏
     * @param opts
     */
    MultiuleInterfaceServer.prototype.multiuleInterGetData = function (opts) {
        var _this = this;
        // tslint:disable-next-line: no-debugger
        // debugger;
        var url = '/api/universal/getUniversalSql/v1';
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url, opts).then(function (data) {
                resolve(data);
            });
        });
    };
    // 列表分页接口
    MultiuleInterfaceServer.prototype.getLimitDataList = function (opts) {
        var _this = this;
        var url = '/api/universal/getUniversalLimitSql/v1';
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url, opts).then(function (data) {
                resolve(data);
            });
        });
    };
    /**
     * 展示屏信息 发送到 推送屏
     * @param opts   查询总数
     */
    MultiuleInterfaceServer.prototype.multiuGetAllNum = function (opts) {
        var _this = this;
        var url = '/api/universal/getUniversalEquipmentCountSql/v1';
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url, opts).then(function (data) {
                resolve(data);
            });
        });
    };
    /**
     * 获取火场列表标绘元素
     * @param fireId   火场id
     */
    MultiuleInterfaceServer.prototype.getFireParam = function (fireId) {
        var _this = this;
        var url = this.eadsService + 'fireData/v1/getFirePlot?id=' + fireId;
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url).then(function (data) {
                resolve(data);
            });
        });
    };
    /**
     * 获取火场详情
     * @param fireId   火场id
     */
    MultiuleInterfaceServer.prototype.getFireSourceParam = function (fireId) {
        var _this = this;
        var url = this.eadsService + 'fireData/v1/getFireDetails?id=' + fireId;
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url).then(function (data) {
                resolve(data);
            });
        });
    };
    // 获取倾斜摄影列表的方法
    MultiuleInterfaceServer.prototype.getWopsList = function () {
        var temp = this.egisOpts;
        var wopsService = new g2.ews.RestWOPSService({
            url: temp.server + 'egis/base/v1',
            clientId: '28524d8c65844630a3427270c9a16323',
            clientSecret: '84bc17650bb04491aa8475b9cbe3d1c4',
            authType: 'Basic',
            tokenUrl: 'http://120.52.31.31:590/oauth/token',
            deserializer: new g2.core.Deserializer()
        });
        return new Promise(function (resolve, reject) {
            wopsService.getCapabilities().then(function (res) {
                resolve(res);
            });
        });
    };
    /**
     * 获取单项数据
     * @param opts
     * @param opts.keyword 关键字
     * @param opts.resourceKey，多个逗号分隔
     * @param opts.pageSize
     * @param opts.pageIndex
     * @param opts.districtCode
     */
    MultiuleInterfaceServer.prototype.getDataList = function (param) {
        var _this = this;
        // this.$store.state.dataFilterControl.zhypGeoType.key
        // 右侧点击数字展开列表 -> 风险隐患请求
        /*
        * objname 要寻找的对象
        * where 要查询的code
        * text 关键字
        * centerPoint 中心点
        */
        var objname = param.resourceKey;
        // 装备特殊处理，因为22个装备type用的一个查询条件
        var equipWhere = '';
        var equipCode = '';
        if (objname.indexOf('equipment') >= 0) {
            equipCode = objname.split('_')[1];
            objname = objname.split('_')[0];
            equipWhere = ' and a.equiptypecode=' + '\'' + equipCode + '\'';
        }
        var text = param.keyword ? param.keyword : '';
        var typecode = param.typecode;
        var btnflags = param.btnflags;
        if (param.id) {
            var typeid = param.id ? param.id : '';
            var obj_1 = {
                field: MultiuleQueryParamConfigList_yt_1["default"][objname].fileFn('0'),
                group: MultiuleQueryParamConfigList_yt_1["default"][objname].group(),
                nowPage: param.pageIndex,
                pageSize: param.pageSize,
                typecode: typecode ? typecode : '',
                polygon: '',
                tableName: MultiuleQueryParamConfigList_yt_1["default"][objname].tableName(),
                type: '3',
                // orderBy: this.$store.state.eventPushStore.eventId ? MultiuleQueryParamConfigList_yt[objname].orderBy() : '',
                where: MultiuleQueryParamConfigList_yt_1["default"][objname].where(text, typeid) + equipWhere
            };
            // param.districtCode = '3706'
            if (param.districtCode) { // 行政区划过滤
                if (param.districtCode.substring(param.districtCode.length - 2) === '00') {
                    param.districtCode = param.districtCode.substr(0, 4);
                }
                obj_1.where += ' and ' + obj_1.group + ' like  \'' + param.districtCode + '\'||\'%\'';
            }
            var url_1 = '/api/universal/getUniversalLimitSql/v1';
            return new Promise(function (resolve, reject) {
                _this.rSerivce.serverObj.post(url_1, obj_1).then(function (data) {
                    resolve(data.data.data);
                });
            });
        }
        else if (param.btnflags !== '') {
            var obj_2 = {
                field: MultiuleQueryParamConfigList_yt_1["default"][objname].fileFn('0'),
                group: MultiuleQueryParamConfigList_yt_1["default"][objname].group(),
                nowPage: param.pageIndex,
                pageSize: param.pageSize,
                polygon: param.polygon ? param.polygon : '',
                tableName: MultiuleQueryParamConfigList_yt_1["default"][objname].tableName(),
                type: param.type ? param.type : '3',
                where: MultiuleQueryParamConfigList_yt_1["default"][objname].where(text, btnflags) + equipWhere
            };
            // param.districtCode = '3706'
            if (param.districtCode) { // 行政区划过滤
                var arrDistrict = param.districtCode.split(',');
                if (arrDistrict.length === 1) {
                    if (param.districtCode.substring(param.districtCode.length - 2) === '00') {
                        param.districtCode = param.districtCode.substr(0, 4);
                    }
                    obj_2.where += ' and ' + obj_2.group + ' like  \'' + param.districtCode + '\'||\'%\'';
                }
                else if (arrDistrict.length > 1) {
                    obj_2.where += ' and ' + obj_2.group + ' in(' + param.districtCode + ')';
                }
            }
            var url_2 = '/api/universal/getUniversalLimitSql/v1';
            // console.log(obj);
            return new Promise(function (resolve, reject) {
                _this.rSerivce.serverObj.post(url_2, obj_2).then(function (data) {
                    resolve(data.data.data);
                });
            });
        }
        else {
            var obj_3 = {
                field: MultiuleQueryParamConfigList_yt_1["default"][objname].fileFn('0'),
                group: MultiuleQueryParamConfigList_yt_1["default"][objname].group(),
                nowPage: param.pageIndex,
                pageSize: param.pageSize,
                polygon: param.polygon ? param.polygon : '',
                tableName: MultiuleQueryParamConfigList_yt_1["default"][objname].tableName(),
                type: param.type ? param.type : '3',
                where: MultiuleQueryParamConfigList_yt_1["default"][objname].where(text, typecode) + equipWhere
            };
            // param.districtCode = '3706'
            if (param.districtCode) { // 行政区划过滤
                var arrDistrict = param.districtCode.split(',');
                if (arrDistrict.length === 1) {
                    if (param.districtCode.substring(param.districtCode.length - 2) === '00') {
                        param.districtCode = param.districtCode.substr(0, 4);
                    }
                    obj_3.where += ' and ' + obj_3.group + ' like  \'' + param.districtCode + '\'||\'%\'';
                }
                else if (arrDistrict.length > 1) {
                    obj_3.where += ' and ' + obj_3.group + ' in(' + param.districtCode + ')';
                }
            }
            var url_3 = '/api/universal/getUniversalLimitSql/v1';
            // console.log(obj);
            return new Promise(function (resolve, reject) {
                _this.rSerivce.serverObj.post(url_3, obj_3).then(function (data) {
                    resolve(data.data.data);
                });
            });
        }
        // const text: any = param.keyword ? param.keyword : '';
        // if (this.homeData.curNumItem.isHasSelect) {
        //   this.whereconfig[MultiuleQueryParamConfigList_yt[objname].giscodeConfig] = this.checkedOption;
        //   this.whereconfig.all = JSON.parse(JSON.stringify(this.homeData.curNumItem.selectArr));
        // }
        // if (this.moduleType[0] === 'sjzlpt_dm_tfsjjb_sjdcrwlb') {  // 兼容 E键通
        //   obj.polygon = '';
        //   obj.type = '3';
        // 1 中心距离
        // 2 缓冲区
        // 3 普通
    };
    return MultiuleInterfaceServer;
}());
exports.MultiuleInterfaceServer = MultiuleInterfaceServer;
