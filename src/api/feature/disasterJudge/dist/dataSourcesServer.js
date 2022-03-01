"use strict";
exports.__esModule = true;
exports.DataSourcesServer = void 0;
var request_1 = require("@/util/request");
var configRegistry_1 = require("@/util/configRegistry");
var DataSourcesServer = /** @class */ (function () {
    function DataSourcesServer(opt, axiosFilterFn) {
        this.rSerivce = new request_1.RequestServerClass(opt);
        this.baseURL = opt.baseURL;
        this.rSerivce2 = new request_1.RequestServerClass({ baseURL: configRegistry_1["default"].value.floodServerPath });
    }
    // 数据来源
    DataSourcesServer.prototype.getDataSourceServer = function (data) {
        var url = '/api/vdateSource/v1/getDataSource?typeCode=' + data.typeCode;
        return this.rSerivce.serverObj.get(url);
    };
    // 列表分页接口
    DataSourcesServer.prototype.getLimitDataList = function (opts) {
        var _this = this;
        var url = '/api/universal/getUniversalLimitSql/v1';
        return new Promise(function (resolve, reject) {
            _this.rSerivce2.serverObj.post(url, opts).then(function (data) {
                resolve(data);
            });
        });
    };
    return DataSourcesServer;
}());
exports.DataSourcesServer = DataSourcesServer;
