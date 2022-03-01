"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var request_1 = require("../../../util/request");
var configRegistry_1 = require("@/util/configRegistry");
var tools_1 = require("@/util/tools");
// 风情服务
var MonitorWarningServer = /** @class */ (function () {
    function MonitorWarningServer(opt, axiosFilterFn) {
        opt.headers = { 'Content-Type': 'application/json' };
        this.rSerivce = new request_1.RequestServerClass(opt);
        this.rSerivce2 = new request_1.RequestServerClass({
            baseURL: configRegistry_1["default"].value.serverPath
        });
        this.emapServiceFilter = configRegistry_1["default"].value.district;
    }
    /**
     * 获取面板统计信息
     * @param opts {Object}
     * @returns {Object}
     */
    MonitorWarningServer.prototype.getStatistics = function (opts) {
        var _this = this;
        // tslint:disable-next-line: no-debugger
        // debugger;
        var url = '/tSwsshc/v1/getRealTimeInfoCount';
        var result = {
            data: {
                weatherNum: null,
                windNum: null,
                rainNum: null,
                waterNum: null,
                engineeringNum: null,
                cameraNum: null,
                riverNum: null,
                reservoirNum: null,
                countweirGateWater: null,
                floodvillage: null,
                reservoirCountdx: null,
                reservoirCountzx: null,
                reservoirCountxx: null
            }
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url, opts).then(function (res) {
                var data = res.data.data;
                result.data.weatherNum = data.weatherNum;
                result.data.windNum = data.windNum;
                result.data.rainNum = data.rainNum;
                result.data.waterNum = data.waterNum;
                result.data.engineeringNum = data.engineeringNum;
                result.data.cameraNum = data.cameraNum;
                result.data.riverNum = data.riverNum;
                result.data.reservoirNum = data.reservoirNum;
                result.data.countweirGateWater = data.countweirGateWater;
                result.data.floodvillage = data.floodvillage;
                result.data.reservoirCountdx = data.reservoirCountdx;
                result.data.reservoirCountzx = data.reservoirCountzx;
                result.data.reservoirCountxx = data.reservoirCountxx;
                resolve(result);
            });
        });
        // return this.rSerivce.serverObj.post(url, opts);
    };
    /**
     * 获取面板统计信息
     * @param opts {Object}
     * @returns {Object}
     */
    MonitorWarningServer.prototype.getWarningStatistics = function (opts) {
        var _this = this;
        var url = '/tSwsshc/v1/getOverCountInfo';
        var result = {
            data: {
                windWarningNum: null,
                rainWarningNum: null,
                waterWarningNum: null,
                engineeringNum: null,
                weatherWarningNum: null,
                fireTotalNum: null,
                fireWeatherWarningNum: null,
                earthWeatherWarningNum: null
            }
        };
        // console.log(this.rSerivce, 88888888888888888);
        // console.log(this, 6666666666);
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.get(url).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var data, opt, fireOpt, earthOpt, optss, fireWres, dartt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = res.data.data;
                            // result.data = data;
                            result.data = Object.assign(result.data, data);
                            opt = ['11B06', '11B03', '11B01', '11B14', '11B15', '11B37'];
                            fireOpt = ['11B25', '11B06', '11B14'];
                            earthOpt = ['11B06', '11B03', '11B14', '11B09', '11B37'];
                            optss = {
                                // type: '11B06,11B03,11B01,11B14,11B15,11B37,11B25,11B09',
                                type: '11B01,11B03,11B09,11B25,11D00,11B04,11B56,11B05,11B16,11B21,11B17,11B22,11A01,11B14,11B19,11B15,11B51,11B06',
                                startTime: tools_1.getDateFormat({ last: 'week' }),
                                endTime: tools_1.getDateFormat(),
                                districtCode: configRegistry_1["default"].value.district.root,
                                searchType: '1'
                            };
                            return [4 /*yield*/, this.getFireStatisticsTotal()];
                        case 1:
                            fireWres = _a.sent();
                            return [4 /*yield*/, this.getWeatherWarningStatic(optss)];
                        case 2:
                            dartt = _a.sent();
                            result.data.fireWeatherWarningNum = dartt.total;
                            result.data.weatherWarningNum = this.getTotal(opt, dartt.data);
                            result.data.earthWeatherWarningNum = this.getTotal(earthOpt, dartt.data);
                            result.data.fireTotalNum = fireWres.data.today;
                            resolve(result);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        // return this.rSerivce.serverObj.post(url, opts);
    };
    //  预警报告 导出
    MonitorWarningServer.prototype.getDownLoad = function (opts) {
        var _this = this;
        var url = '/api/tRainData/v1/exportWarnReport';
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj
                .post(url, opts, { responseType: 'blob' })
                .then(function (res) {
                resolve(res);
            });
        });
    };
    MonitorWarningServer.prototype.formatDate = function (str) {
        // const result = (new Date(str) as any).format('yyyy-MM-dd hh:mm:ss');
        return str;
    };
    /**
     * 获取统计-火点统计
     */
    MonitorWarningServer.prototype.getFireStatisticsTotal = function (opts) {
        var _this = this;
        var url = '/api/forestfire/count';
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url).then(function (res) {
                resolve(res.data);
            });
        });
    };
    MonitorWarningServer.prototype.getTotal = function (array, searchData) {
        var allDatatt = Object.keys(searchData);
        var total = 0;
        array.forEach(function (item) {
            if (allDatatt.includes(item)) {
                if (searchData[item].length > 0) {
                    searchData[item].forEach(function (key) {
                        total += key.count;
                    });
                }
            }
        });
        return total;
    };
    MonitorWarningServer.prototype.getWeatherWarningStatic = function (opts) {
        var _this = this;
        var url = '/api/event/weather/SignalTypeLevel/list/v1';
        var result = {};
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.post(url, opts).then(function (res) {
                // console.log('吼吼', res);
                var data = JSON.parse(res.data.data.levelList);
                result.data = data;
                result.total = res.data.data.total;
                resolve(result);
            });
        });
    };
    return MonitorWarningServer;
}());
exports["default"] = MonitorWarningServer;
