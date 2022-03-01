"use strict";
exports.__esModule = true;
var request_1 = require("../../../util/request");
// 水情服务
var WaterSituationServer = /** @class */ (function () {
    function WaterSituationServer(opt, axiosFilterFn) {
        opt.headers = { 'Content-Type': 'application/json' };
        this.rSerivce = new request_1.RequestServerClass(opt);
    }
    /**
     * 获取当前水情描述信息
     * @param opts {Object}
     * @returns {Object} {超警戒水位站点数量: 0, 超历史最高水位站点数量: 0, 城市内涝积水点数量: 0, 更新时间: '2020-05-04 12:00:00'}
     */
    WaterSituationServer.prototype.getCurrentInfo = function (opts) {
        var url = '/tSwsshc/v1/getOverrunObtNow';
        return this.rSerivce.serverObj.get(url);
    };
    /**
     * 获取当前河道描述信息
     * @param opts {Object}
     * @returns {Object} {超警戒水位站点数量: 0, 超历史最高水位站点数量: 0, 城市内涝积水点数量: 0, 更新时间: '2020-05-04 12:00:00'}
     */
    WaterSituationServer.prototype.getCurrentRiverInfo = function (opts) {
        var url = '/tSwsshc/v1/statRiverInfo';
        return this.rSerivce.serverObj.post(url, opts);
    };
    /**
     * 获取当前水库描述信息
     * @param opts {Object}
     * @returns {Object}
     */
    WaterSituationServer.prototype.getCurrentReservoirInfo = function (opts) {
        var _this = this;
        var url = '/tSwsshc/v1/statReservoirInfo';
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj
                .post(url, opts)
                .then(function (res) {
                resolve(res);
            });
        });
    };
    /**
     * 获取水库-增降统计
     * @param opts {Object}
     */
    WaterSituationServer.prototype.getStat = function (opts) {
        var url = '/tSwsshc/v1/getReservoirRiseAndRetreat';
        return this.rSerivce.serverObj.get(url);
    };
    /**
     * 获取河流-增降统计
     * @param opts {Object}
     */
    WaterSituationServer.prototype.getRiverRiseAndRetreat = function (opts) {
        var url = '/tSwsshc/v1/getRiverRiseAndRetreat';
        return this.rSerivce.serverObj.get(url);
    };
    /**
     * 获取河道-最大积水站点信息
     * @param opts {Object}
     */
    WaterSituationServer.prototype.getMaxWaterInfo = function (opts) {
        var url = '/tSwsshc/v1/getMaxRiverInfo';
        return this.rSerivce.serverObj.get(url);
    };
    /**
     * 获取水库-最大积水站点信息
     * @param opts {Object}
     */
    WaterSituationServer.prototype.getMaxReservoirInfo = function (opts) {
        var url = '/tSwsshc/v1/getMaxReservoirInfo';
        return this.rSerivce.serverObj.get(url);
    };
    /*山洪受灾村列表*/
    WaterSituationServer.prototype.getFloodvillageList = function (opts) {
        var _this = this;
        var obj = JSON.parse(JSON.stringify(opts));
        // const url = '/tSwsshc/v1/page';
        var url = '/tSwsshc/v1/findFloodVillage'; //  山洪受灾村数据
        var self = this;
        if (obj.pageIndex && !obj.nowPage) {
            obj.nowPage = obj.pageIndex;
        }
        if (obj.villagename) {
            var arr = [];
            for (var index = 0; index < obj.villagename.length; index++) {
                var word = obj.villagename.charAt(index);
                if (word === '%') {
                    arr.push('\\' + word);
                    continue;
                }
                arr.push(word);
            }
            obj.villagename = arr.join('');
        }
        obj.pageSize = obj.pageSize || 100000;
        var result = {
            data: []
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj
                .post(url, JSON.stringify(obj))
                .then(function (res) {
                var resData = res.data.list;
                result.total = res.data.total;
                resData.forEach(function (record) {
                    var station = {};
                    station = record;
                    station.name = record.villagename;
                    station.x = record.longitude;
                    station.y = record.latitude;
                    result.data.push(station);
                });
                resolve(result);
            });
        });
    };
    /**山洪灾害村详 */
    WaterSituationServer.prototype.getFloodvillageDetail = function (opts) {
        var _this = this;
        var self = this;
        var urlDetail = '/tSwsshc/v1/findFloodVillageById?id=' + opts.id;
        var result = {
            data: {}
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.get(urlDetail).then(function (resDetail) {
                var resDetaildata = resDetail.data.data;
                result.data = resDetaildata;
            });
            resolve(result);
        });
    };
    /**
     * 获取水库列表
     * @param opts {Object}
     * @param [opts.keyWord] 关键字
     * @param [opts.type] 监测站类型 river: 河流监测站; reservoir: 水库监测站
     * @param [opts.level] 可传多个，逗号隔开，取并集
     * 水库：超汛限(overLimit)、超正常(overNormal)、超设计(overDesign)、超历史最高(overHighest) ||| 河道站：超警戒(overWarning)、超保证(overGuarantee)、超历史最高(overHighest)
     * @param [opts.pageIndex]
     */
    WaterSituationServer.prototype.getStationsList = function (opts) {
        var _this = this;
        var obj = JSON.parse(JSON.stringify(opts));
        // const url = '/tSwsshc/v1/page';
        var url = '/tSwsshc/v1/findReservoir'; //  水库列表数据
        var self = this;
        if (obj.pageIndex && !obj.nowPage) {
            obj.nowPage = obj.pageIndex;
        }
        if (obj.fullname) {
            var arr = [];
            for (var index = 0; index < obj.fullname.length; index++) {
                var word = obj.fullname.charAt(index);
                if (word === '%') {
                    arr.push('\\' + word);
                    continue;
                }
                arr.push(word);
            }
            obj.fullname = arr.join('');
        }
        obj.pageSize = obj.pageSize || 100000;
        var result = {
            data: []
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj
                .post(url, JSON.stringify(obj))
                .then(function (res) {
                var resData = res.data.list;
                result.total = res.data.total;
                resData.forEach(function (record) {
                    var station = {};
                    station = record;
                    station.name = record.fullname;
                    station.x = record.longitude;
                    station.y = record.latitude;
                    result.data.push(station);
                });
                resolve(result);
            });
        });
    };
    /**
     * 获取水库详情
     * @param opts {Object}
     */
    WaterSituationServer.prototype.getreservoirDetail = function (opts) {
        var _this = this;
        var self = this;
        var urlDetail = '/tSwsshc/v1/findReservoirByIdNew?id=' + opts.id;
        var result = {
            data: {}
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.get(urlDetail).then(function (resDetail) {
                var resDetaildata = resDetail.data.data;
                result.data = resDetaildata;
            });
            resolve(result);
        });
    };
    /**
     * 获取河流详情
     * @param opts {Object}
     * @param opts.id {string}
     * @param [opts.starttime] {string} 开始时间
     */
    WaterSituationServer.prototype.getStationDetail = function (opts) {
        var _this = this;
        var self = this;
        var urlDetail = 'tSwsshc/v1/detail?id=' + opts.id;
        var urlHistory = 'tSwsshc/v1/river/detail?id=' + opts.id;
        // const urlHistory = 'tSwsshc/v1/getThreeDaysRealTimeWaterInfo?id=' + opts.id;
        var result = {
            data: {}
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.get(urlDetail).then(function (resDetail) {
                var detailData = resDetail.data.data || {};
                result.data.id = opts.id;
                result.data.name = detailData.name;
                result.data.x = detailData.x;
                result.data.y = detailData.y;
                result.data.waterLevel = detailData.waterLevel;
                result.data.type = detailData.type;
                result.data.trend = detailData.trend; // todo
                result.data.analogalertwa = detailData.analogalertwa;
                result.data.analogtopwa = detailData.analogtopwa;
                result.data.warning = self.getWarning(detailData.warning); // todo
                result.data.riverBasini = detailData.riverBasini; // 所在流域
                result.data.address = detailData.address; // 地址
                result.data.equipment = detailData.equipment; // 设备型号
                result.data.stationSetTime = detailData.stationSetTime; // 设站时间
                // result.data.list = detailData.dataList;
                _this.rSerivce.serverObj.get(urlHistory).then(function (resHistory) {
                    result.data.belongRiver = resHistory.data.data.belongRiver; // 所在河流
                    result.data.list = resHistory.data.data.dataList;
                    resolve(result);
                });
            });
        });
    };
    /**
     * 获取河道列表数据
     * @param opts {Object}
     * @param [opts.keyWord] 关键字
     * @param [opts.level] 可传多个，逗号隔开，取并集
     * 水库：超汛限(overLimit)、超正常(overNormal)、超设计(overDesign)、超历史最高(overHighest) ||| 河道站：超警戒(overWarning)、超保证(overGuarantee)、超历史最高(overHighest)
     * @param [opts.pageIndex]
     */
    WaterSituationServer.prototype.getRiverStationsList = function (opts) {
        var _this = this;
        // tslint:disable-next-line: no-debugger
        // debugger;
        var url = '/tSwsshc/v1/river/page';
        var self = this;
        if (opts.pageIndex && !opts.nowPage) {
            opts.nowPage = opts.pageIndex;
        }
        if (opts.keyWord) {
            var arr = [];
            for (var index = 0; index < opts.keyWord.length; index++) {
                var word = opts.keyWord.charAt(index);
                if (word === '%') {
                    arr.push('\\' + word);
                    continue;
                }
                arr.push(word);
            }
            opts.keyWord = arr.join('');
        }
        opts.pageSize = opts.pageSize || 100000;
        var result = {
            data: []
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj
                .post(url, JSON.stringify(opts))
                .then(function (res) {
                var resData = res.data.list;
                result.total = res.data.total;
                resData.forEach(function (record) {
                    var station = {};
                    station.id = record.id;
                    station.name = record.name;
                    station.x = record.x;
                    station.y = record.y;
                    var waterLevel = parseFloat(record.waterLevel + '');
                    station.waterLevel = record.waterLevel;
                    // let trend = '不变';
                    // if (waterLevel > 0) {
                    //   trend = '涨';
                    // } else if (waterLevel < 0) {
                    //   trend = '退';
                    // }
                    // station.trend = trend;
                    var trend = {
                        涨: '涨',
                        不变: '平',
                        退: '落'
                    };
                    station.trend = trend[record.trend];
                    station.isValid = record.isValid;
                    station.warning = self.getWarning(record.warning);
                    station.type = record.type;
                    result.data.push(station);
                });
                resolve(result);
            });
        });
    };
    /**
       * 获取堰闸列表数据
       * @param opts {Object}
       * @param [opts.keyWord] 关键字
       * @param [opts.level] 可传多个，逗号隔开，取并集
       * 水库：超汛限(overLimit)、超正常(overNormal)、超设计(overDesign)、超历史最高(overHighest) ||| 河道站：超警戒(overWarning)、超保证(overGuarantee)、超历史最高(overHighest)
       * @param [opts.pageIndex]
       */
    WaterSituationServer.prototype.getWeirgateStationsList = function (opts) {
        var _this = this;
        var url = '/tSwsshc/v1/findWeirGateWater';
        var self = this;
        if (opts.pageIndex && !opts.nowPage) {
            opts.nowPage = opts.pageIndex;
        }
        if (opts.keyWord) {
            var arr = [];
            for (var index = 0; index < opts.keyWord.length; index++) {
                var word = opts.keyWord.charAt(index);
                if (word === '%') {
                    arr.push('\\' + word);
                    continue;
                }
                arr.push(word);
            }
            opts.keyWord = arr.join('');
        }
        opts.pageSize = opts.pageSize || 100000;
        var result = {
            data: []
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj
                .post(url, JSON.stringify(opts))
                .then(function (res) {
                var resData = res.data.data.list;
                result.total = res.data.data.total;
                resData.forEach(function (record) {
                    var station = {};
                    station.id = record.id;
                    station.name = record.name;
                    station.x = record.longitude;
                    station.y = record.latitude;
                    result.data.push(station);
                });
                resolve(result);
            });
        });
    };
    /**
    * 获取堰闸详情
    * @param opts {Object}
    * @param opts.id {string}
    * @param [opts.starttime] {string} 开始时间
    */
    WaterSituationServer.prototype.getWeirgateDetail = function (opts) {
        var _this = this;
        var self = this;
        var urlDetail = '/tSwsshc/v1/station/detail?id=' + opts.id;
        var urlHistory = '/tSwsshc/v1/findWeirGateWaterByStcd/detail?stcd=' + opts.id;
        var result = {
            data: {}
        };
        return new Promise(function (resolve, reject) {
            _this.rSerivce.serverObj.get(urlDetail).then(function (resDetail) {
                var resDetaildata = resDetail.data.data;
                result.data = resDetaildata;
                _this.rSerivce.serverObj.get(urlHistory).then(function (resHistory) {
                    result.data.list = resHistory.data.data;
                    resolve(result);
                });
            });
        });
    };
    /**
     * 获取当前河道预警信息报告
     * @param opts {Object}
     * @returns {Object}
     */
    WaterSituationServer.prototype.getWarningInfo = function (opts) {
        var url = '/tSwsshc/v1/river/warning/page?nowPage=' +
            opts.nowPage +
            '&pageSize=' +
            opts.pageSize;
        return this.rSerivce.serverObj.post(url, opts);
    };
    WaterSituationServer.prototype.getWarningStatInfo = function (opts) {
        var url = '/tSwsshc/v1/statRiverWarning';
        return this.rSerivce.serverObj.get(url, opts);
    };
    /**
     * 获取当前水库预警信息报告
     * @param opts {Object}
     * @returns {Object}
     */
    WaterSituationServer.prototype.getReservoirWarningInfo = function (opts) {
        var url = '/tSwsshc/v1/warning/page?nowPage=' +
            opts.nowPage +
            '&pageSize=' +
            opts.pageSize;
        return this.rSerivce.serverObj.post(url, opts);
    };
    WaterSituationServer.prototype.getReservoirWarningStatInfo = function (opts) {
        var url = '/tSwsshc/v1/statReservoirWarning';
        return this.rSerivce.serverObj.get(url, opts);
    };
    WaterSituationServer.prototype.getWarning = function (warnings) {
        var result = '';
        if (warnings) {
            if (Array.isArray(warnings)) {
                var warningLen = warnings.length;
                switch (warningLen) {
                    case 0:
                        result = '';
                        break;
                    default:
                        result = warnings[warnings.length - 1];
                        break;
                }
            }
            else {
                result = warnings;
            }
        }
        return result;
    };
    return WaterSituationServer;
}());
exports["default"] = WaterSituationServer;
