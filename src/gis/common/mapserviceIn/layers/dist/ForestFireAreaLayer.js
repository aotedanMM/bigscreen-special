"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var SimpleRenderMgrLayer_1 = require("./SimpleRenderMgrLayer");
var request_1 = require("../../../../util/request");
/**
 * 森林防火区域图层
 */
var ForestFireAreaLayer = /** @class */ (function (_super) {
    __extends(ForestFireAreaLayer, _super);
    function ForestFireAreaLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForestFireAreaLayer.prototype.load = function (params) {
        var self = this;
        var conf = this.options.serviceConfig.mapservice.forestFireAreaLayer.tileLayer || {};
        this.featureType = conf.featureType;
        this.featureType_city = 'feature_city';
        this.featureType_county = 'feature_county';
        this.featureType_key_county = 'feature_key_county';
        this.featureName = '森火重点区域';
        this.clickEventName = params.clickEventName;
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
        this.initLayer(conf);
        this.map.getLayerById(conf.id).setZIndex(11);
        this.serviceConfig = params.serviceConfig;
        this.rSerivce = new request_1.RequestServerClass(this.serviceConfig);
        if (params.clickEventName) {
            this.clickEventName = params.clickEventName;
            this.initEvent();
        }
        this.getLayerNote().then(function (data) {
            self._showCityLabel(data.city, self.featureType_city);
            self._showCityLabel(data.county, self.featureType_county);
            self._showCityLabel(data.keys, self.featureType_key_county);
        });
        this.addListeners();
    };
    ForestFireAreaLayer.prototype.getLayerNote = function () {
        var _this = this;
        var self = this;
        var url = this.serviceConfig.floodServerPath + '/api/forestfire/fire/getImportantAreaPoints';
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rSerivce.serverObj.post(url)];
                    case 1:
                        res = _a.sent();
                        result = res.data;
                        resolve(result);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // 绘制行政区划标注
    ForestFireAreaLayer.prototype._showCityLabel = function (list, type) {
        this.cityList = list;
        var SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: function (data) {
                var textSym = new g2.sfs.TextSymbol({
                    text: data.name,
                    fontFamilyName: 'Microsoft Yahei',
                    fontSize: 18,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textBackgroundBorderThickness: 2,
                    textBackgroundColor: new g2.sfs.Color({ a: 152, r: 24, g: 62, b: 80 }),
                    textBackgroundBorderColor: new g2.sfs.Color({ a: 1, r: 55, g: 224, b: 245 }),
                    foreground: new g2.sfs.Color({ a: 200, r: 254, g: 0, b: 0 }),
                    padding: [2, 10, 2, 10]
                });
                var currencySymbol = new g2.sfs.CurrencySymbol({
                    textSymbol: textSym
                });
                return currencySymbol;
            }
        });
        var opts = {
            featureType: type,
            featureName: this.featureName,
            idField: '',
            list: list,
            type: 0,
            geometryBuilder: new G.utils.GeometryBuilder({
                geometryField: ['x', 'y']
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {}
        };
        this.simpleRenderMgr.add(opts);
        this.setVisibleByleve(9);
    };
    ForestFireAreaLayer.prototype.addListeners = function () {
        //
        this.map.listen('resolutionchanged', this._onResolutionChanged, this);
    };
    ForestFireAreaLayer.prototype.removeListeners = function () {
        this.map.off('resolutionchanged', this._onResolutionChanged, this);
    };
    // 分辨率变化
    ForestFireAreaLayer.prototype._onResolutionChanged = function (event) {
        var level = Math.round(event.level);
        this.setVisibleByleve(level);
    };
    ForestFireAreaLayer.prototype.setVisibleByleve = function (level) {
        if (level >= 12.5) {
            this.simpleRenderMgr.setVisible(this.featureType_city, false);
            this.simpleRenderMgr.setVisible(this.featureType_county, true);
            this.simpleRenderMgr.setVisible(this.featureType_key_county, true);
        }
        else if (level > 9 && level <= 12.5) {
            this.simpleRenderMgr.setVisible(this.featureType_city, true);
            this.simpleRenderMgr.setVisible(this.featureType_county, false);
            this.simpleRenderMgr.setVisible(this.featureType_key_county, false);
        }
        else {
            this.simpleRenderMgr.setVisible(this.featureType_city, false);
            this.simpleRenderMgr.setVisible(this.featureType_county, false);
            this.simpleRenderMgr.setVisible(this.featureType_key_county, false);
        }
    };
    // 移除森火图层
    ForestFireAreaLayer.prototype.removeLayer = function () {
        this.removeListeners();
        this.simpleRenderMgr.remove(this.featureType_city);
        this.simpleRenderMgr.remove(this.featureType_county);
        this.simpleRenderMgr.remove(this.featureType_key_county);
    };
    return ForestFireAreaLayer;
}(SimpleRenderMgrLayer_1["default"]));
exports["default"] = ForestFireAreaLayer;
