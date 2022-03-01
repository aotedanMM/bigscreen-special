"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
// 灾情研判指挥调度
var Util_1 = require("../../Util");
var SymbolMap_1 = require("./SymbolMap");
var styleUtils_1 = require("./styleUtils");
var configRegistry_1 = require("@/util/configRegistry");
var ComponentBase = G.base.ComponentBase;
var component = ComponentBase.extend({
    options: {
        map: null,
        service: null,
        eventInfo: null,
        simpleRenderMgr: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        symbolConfig: null,
        highLightId: 'WindWaterRainWork',
        popupId: 'WindWaterRainWork_popup_id',
        popupEventId: 'WindWaterRainWork_popup',
        status: 'add',
        isClear: true
    },
    // 初始化
    initialize: function (options) {
        ComponentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.symbolConfig = options.symbolConfig;
        this.featureHighlight = options.GISComponents.featureHighlight;
        this.featureLocate = options.GISComponents.featureLocate;
        (this.popupManager = options.GISComponents.popupManager),
            (this.service = options.service),
            (this.featureTypeSet = {});
        this.regionCache = {};
        // 创建一个overlayWare
        this.overlayWare = new g2.widget.OverlayWare({
            map: this.map
        });
    },
    //  销毁
    destroy: function () {
        this.unload();
        this.simpleRenderMgr = null;
        this.symbolConfig = null;
        this.featureLocate = null;
        this.featureHighlight.clearHighlight();
        this.featureHighlight = null;
        this.featureTypeSet = null;
        this.map.off('resolutionchanged', this._mapResolutionchanged, this);
        ComponentBase.prototype.destroy.call(this);
    },
    /**
     * 加载
     */
    load: function () {
        ComponentBase.prototype.load.call(this);
    },
    /**
     * 卸载
     */
    unload: function () {
        this._clear();
        this.map.off('resolutionchanged', this._mapResolutionchanged, this);
        ComponentBase.prototype.unload.call(this);
    },
    /**
     * 获取堰闸站点列表
     * @param opts {Object}
     * @param [opts.keyWord] {string} 关键字
     * @param [opts.overThreshold] {boolean} 是否筛选超阈值站点，默认false（全部站点）
     * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
     */
    addResource_monitorstation: function (opts, isClear) {
        if (isClear === void 0) { isClear = true; }
        // this.options.isClear = isClear;
        this.queryResource('countweirGateWater', opts);
    },
    /**
     * 获取风情站点列表
     * @param opts {Object}
     * @param [opts.keyWord] {string} 关键字
     * @param [opts.overThreshold] {boolean} 是否筛选超阈值站点，默认false（全部站点）
     * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
     */
    addResource_Wind: function (opts, isClear) {
        if (isClear === void 0) { isClear = true; }
        // this.options.isClear = isClear;
        this.queryResource('wind', opts);
    },
    blankGeom: {
        type: 'Polygon',
        coordinates: [
            [
                [0, 0],
                [0, 90],
                [180, 90],
                [180, 0],
                [0, 0],
            ],
        ]
    },
    /**
     * 获取雨情站点列表
     * @param opts {Object}
     * @param [opts.keyWord] 关键字
     * @param [opts.level] 告警级别 rain: 暴雨告警; heavyRain: 大暴雨告警; superRain: 特大暴雨告警
     * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
     */
    addResource_Rain: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        this.options.isClear = isClear;
        this.queryResource('rain', opts);
    },
    /**
     * 获取水情站点列表
     * @param opts {Object}
     * @param [opts.keyWord] 关键字
     * @param [opts.type] 监测站类型 river: 河流监测站; reservoir: 水库监测站
     * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
     */
    addResource_Water: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        this.options.isClear = isClear;
        if (opts.type[0].type === 'warning') {
            this.GJ = true;
        }
        else {
            this.GJ = false;
        }
        this.queryResource('water', opts);
    },
    // 河流面板筛选数据上图
    addResource_River: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        this.options.isClear = isClear;
        this.queryResource('river', opts);
    },
    // 河流面板筛选数据上图
    addResource_Reservoir: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        this.options.isClear = isClear;
        this.queryResource('reservoir', opts);
    },
    // 大型水库面板筛选上图
    addResource_ReservoirCountdx: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        //  alert('1');
        // this.options.isClear = isClear;
        this.queryResource('reservoirCountdx', opts);
    },
    // 中型水库面板筛选上图
    addResource_ReservoirCountzx: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        // this.options.isClear = isClear;
        // alert('2');
        this.queryResource('reservoirCountzx', opts);
    },
    // 小型水库面板筛选上图
    addResource_ReservoirCountxx: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        // alert('3');
        // this.options.isClear = isClear;
        this.queryResource('reservoirCountxx', opts);
    },
    addResource_Floodvillage: function (opts, isClear) {
        if (isClear === void 0) { isClear = false; }
        this.options.isClear = isClear;
        this.queryResource('floodvillage', opts);
    },
    /**
     * 获取工情站点列表
     * @param opts {Object}
     * @param [opts.type] 类型 tanta: 坍塌; dianpaizhan: 电排站; chuanzha: 船闸；shuidianzhan: 水电站，shuizha: 水闸，bundpitch：堤防
     * @param [opts.keyWord] 关键字
     * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
     */
    addResource_Work: function (opts, isClear) {
        if (isClear === void 0) { isClear = true; }
        // this.options.isClear = isClear;
        this.queryResource('work', opts);
    },
    // 移除某一个图层（rain, water, wind, work）
    removeResource: function (type) {
        this.options.status = 'remove';
        var featureType = this._getFeatureInfo(type).featureType;
        this.simpleRenderMgr.remove(featureType);
        this._removeHighlight();
        this.closePopup();
        var voronoiLayer = this.map.getLayerById('voronoiLayer');
        if (voronoiLayer) {
            voronoiLayer.clear();
        }
    },
    // 移除所有
    removeAll: function () {
        this._clear();
        var voronoiLayer = this.map.getLayerById('voronoiLayer');
        if (voronoiLayer) {
            voronoiLayer.clear();
            this.map.removeLayer(voronoiLayer);
        }
    },
    /**
     * 列表点击地图定位时调用
     * @param type 类型 | 风情：wind；|雨情：rain；|水情：water；|工情：work；|
     * @param field 字段名称
     * @param value 字段值
     */
    locate: function (type, field, value) {
        var _this = this;
        var featureType = this._getFeatureInfo(type).featureType;
        var self = this;
        var layer = this.simpleRenderMgr.getLayer(featureType);
        if (!layer) {
            return;
        }
        if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
            var _loop_1 = function (element) {
                var attributeObj = Util_1["default"].attributeSet2Object(element.attributeSet);
                if (attributeObj[field] === value) {
                    this_1.map.setCenter({ x: attributeObj.x, y: attributeObj.y });
                    this_1.closePopup(); // 关闭弹窗
                    this_1._addHighlight(type, element);
                    var server = self._getService(type);
                    if (attributeObj.type === 'shuizha') {
                        var opt = {
                            resourceKey: 'sluice',
                            id: 'ytshuizha_000' + attributeObj.id
                        };
                        server.getDetailInfo(opt).then(function (res) {
                            var data = res;
                            data.b_type = attributeObj.type;
                            _this.addPopup(data, [element.geometry.x, element.geometry.y], false, type);
                        });
                    }
                    else {
                        if (type === 'countweirGateWater') {
                            server
                                .getWeirgateDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoir') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoirCountdx') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoirCountzx') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoirCountxx') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'floodvillage') {
                            server
                                .getFloodvillageDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else {
                            server
                                .getStationDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                    }
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = layer.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                var state_1 = _loop_1(element);
                if (state_1 === "break")
                    break;
            }
        }
    },
    /**
     * 新增图层
     * @param opts.type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water；|工情：work
     * @param opts.list 数据列表
     */
    _addResource: function (opts) {
        if (this.options.isClear) {
            this._clear();
        }
        if (this.geomPan) {
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: JSON.parse(this.geomPan)
            });
        }
        else {
            this.map.fullExtent();
        }
        this.optsParams = opts;
        var featureInfo = this._getFeatureInfo(opts.type, opts.list);
        var level = this.map.getZoomLevel();
        if (this.GJ && opts.type === 'water') {
            this._showResourcesOnMapGJ(opts.type, featureInfo);
        }
        else {
            this._showResourcesOnMap(opts.type, featureInfo);
        }
        // 临时显示图例（对接泰森后删掉这行）
        if (opts.type === 'wind' || opts.type === 'rain') {
            this.fire('RainWindLengend', { type: opts.type, visible: false });
        }
        // 暂时注释掉（泰森多边形需要对接新的）
        // if (opts.type === 'wind' || opts.type === 'rain') {
        //   this._addVoronoi(opts.type);
        //   this.setLayerVisibleBylevel(level);
        //   this.map.listen('resolutionchanged', this._mapResolutionchanged, this);
        // } else if (opts.type === 'water' || opts.type === 'work') {
        //   this.map.off('resolutionchanged', this._mapResolutionchanged, this);
        // }
    },
    /**
     * 搜索方法
     * @param type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water；|工情：work
     * @param opts server服务的参数
     */
    queryResource: function (type, opts) {
        // console.log('进来了11', type);
        // console.log('进来了22', opts);
        this.options.status = 'add';
        var self = this;
        var server = this._getService(type);
        var promise = null;
        opts.nowPage = 1;
        opts.pageSize = 10000000;
        if (type === 'reservoirCountdx') {
            opts.scalename = '大型';
        }
        else if (type === 'reservoirCountzx') {
            opts.scalename = '中型';
        }
        else {
            opts.scalename = '小型';
        }
        if (opts.geometry === '') {
            self.geomPan = null;
        }
        else if (opts.geometry === JSON.stringify(self.blankGeom)) {
            self.geomPan = null;
        }
        else {
            self.geomPan = opts.geometry;
        }
        if (type === 'river') {
            promise = server.getRiverStationsList(opts);
        }
        else if (type === 'countweirGateWater') {
            promise = server.getWeirgateStationsList(opts);
        }
        else if (type === 'floodvillage') {
            promise = server.getFloodvillageList(opts);
        }
        else {
            promise = server.getStationsList(opts);
        }
        promise.then(function (res) {
            var result = res.data;
            var list = [];
            result.forEach(function (item) {
                var obj = __assign({ _id: item.id, longitude: item.x, latitude: item.y }, item);
                list.push(obj);
            });
            var param = {
                type: type,
                list: list
            };
            if (self.options.status === 'add') {
                self._addResource(param);
            }
        });
    },
    // 根据type 获取服务
    _getService: function (type) {
        var self = this;
        var service = {
            rain: function () {
                return self.service.rainSituationServer;
            },
            wind: function () {
                return self.service.windSituationServer;
            },
            water: function () {
                return self.service.waterSituationServer;
            },
            work: function () {
                return self.service.engineeringSituationServer;
            },
            countweirGateWater: function () {
                return self.service.waterSituationServer;
            },
            river: function () {
                return self.service.waterSituationServer;
            },
            reservoir: function () {
                return self.service.waterSituationServer;
            },
            reservoirCountdx: function () {
                return self.service.waterSituationServer;
            },
            reservoirCountzx: function () {
                return self.service.waterSituationServer;
            },
            reservoirCountxx: function () {
                return self.service.waterSituationServer;
            },
            floodvillage: function () {
                return self.service.waterSituationServer;
            }
        };
        var server = service[type]();
        return server;
    },
    // 监听地图等级变化
    _mapResolutionchanged: function (e) {
        var level = this.map.getZoomLevel();
        this.setLayerVisibleBylevel(level);
    },
    // 根据地图等级设置地图显隐（风情和雨情）
    setLayerVisibleBylevel: function (level) {
        var voronoiLayer = this.map.getLayerById('voronoiLayer');
        var featureInfo = this._getFeatureInfo(this.optsParams.type, this.optsParams.list);
        if (level >= 10.5) {
            voronoiLayer.setVisible(false);
            this.simpleRenderMgr.setVisible(featureInfo.featureType, true);
            this.fire('RainWindLengend', {
                type: this.optsParams.type,
                visible: false
            });
        }
        else {
            if (this.optsParams.type === 'wind' || this.optsParams.type === 'rain') {
                this.simpleRenderMgr.setVisible(featureInfo.featureType, false);
            }
            voronoiLayer.setVisible(true);
            this.fire('RainWindLengend', {
                type: this.optsParams.type,
                visible: true
            });
        }
    },
    clearHighlight: function () {
        this._removeHighlight();
        this.featureHighlight.removeHighlight('gj');
    },
    _clear: function () {
        for (var _i = 0, _a = Object.keys(this.featureTypeSet); _i < _a.length; _i++) {
            var featureType = _a[_i];
            this.simpleRenderMgr.remove(featureType);
            delete this.featureTypeSet[featureType];
        }
        this.featureHighlight.clearHighlight();
        this.closePopup();
        this._removeHighlight();
    },
    /**
     * 添加数据到图层
     * @param dataCol
     * @param type
     */
    _showResourcesOnMap: function (type, featureInfo) {
        var _this = this;
        var self = this;
        var clusterSymbol = this.symbolConfig.symbols.disasterJudge.resource
            .cluster;
        var symbolMapper = null;
        if (SymbolMap_1["default"][type]) {
            symbolMapper = SymbolMap_1["default"][type];
        }
        else {
            symbolMapper = SymbolMap_1["default"]["default"];
        }
        var SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: function (builddata) {
                var symbolObj = Util_1["default"].toJSON(symbolMapper.symbol);
                symbolObj.options.source = _this.symbolConfig.icons[symbolMapper.iconFn(builddata.type, builddata)];
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
            buildClusterStyle: function (data) {
                return clusterSymbol;
            }
        });
        var opts = {
            featureType: featureInfo.featureType,
            featureName: '防汛防台-风雨水工情图层',
            idField: '_id',
            list: featureInfo.data,
            type: 0,
            geometryBuilder: new G.utils.GeometryBuilder({
                // geometryField: ['geom'],
                // 后端没定义gemo字段，暂时解决
                geometryField: ['x', 'y']
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                // 注册点击事件
                click: function (data) {
                    _this.closePopup(); // 关闭弹窗
                    self._addHighlight(type, data[0].element);
                    var result = data[0];
                    var element = result.element;
                    var attributeObj = Util_1["default"].attributeSet2Object(element.attributeSet);
                    // tslint:disable-next-line:no-empty
                    var server = self._getService(type);
                    if (attributeObj.type === 'shuizha') {
                        var opt = {
                            resourceKey: 'sluice',
                            id: 'ytshuizha_000' + attributeObj.id
                        };
                        server.getDetailInfo(opt).then(function (res) {
                            var data1 = res;
                            data1.b_type = attributeObj.type;
                            _this.addPopup(data1, [element.geometry.x, element.geometry.y], false, type);
                        });
                    }
                    else {
                        if (type === 'countweirGateWater') {
                            server
                                .getWeirgateDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoir') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoirCountdx') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoirCountzx') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoirCountxx') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'floodvillage') {
                            server
                                .getFloodvillageDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else {
                            server
                                .getStationDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                    }
                }
            }
        };
        opts.geometryBuilder = new G.utils.GeometryBuilder({
            geometryField: ['longitude', 'latitude']
        });
        this.simpleRenderMgr.add(opts);
        // 记录展示的数据类型
        this.featureTypeSet[opts.featureType] = {};
        // 视野定位
        // this._fitBounds(type);
    },
    _showResourcesOnMapGJ: function (type, featureInfo) {
        var _this = this;
        var self = this;
        this.featureHighlight.removeHighlight('gj');
        var feitoubu = featureInfo.data;
        var toubu = [];
        featureInfo.data.map(function (item) {
            if (item.typeName.indexOf('头顶') !== -1 &&
                item.typeName.indexOf('非头顶') === -1) {
                toubu.push(item);
            }
            else {
                // feitoubu.push(item);
            }
        });
        var clusterSymbol = this.symbolConfig.symbols.disasterJudge.resource
            .cluster;
        var symbolMapper = null;
        if (SymbolMap_1["default"][type]) {
            symbolMapper = SymbolMap_1["default"][type];
        }
        else {
            symbolMapper = SymbolMap_1["default"]["default"];
        }
        var SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: function (builddata) {
                var symbolObj = Util_1["default"].toJSON(symbolMapper.symbol);
                symbolObj.options.source = _this.symbolConfig.icons[symbolMapper.iconFn(builddata.type, builddata)];
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
            buildClusterStyle: function (data) {
                return clusterSymbol;
            }
        });
        var opts = {
            featureType: featureInfo.featureType,
            featureName: '防汛防台-风雨水工情图层',
            idField: '_id',
            list: feitoubu,
            type: 0,
            geometryBuilder: new G.utils.GeometryBuilder({
                geometryField: ['geom']
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                // 注册点击事件
                click: function (data) {
                    _this.closePopup(); // 关闭弹窗
                    self._addHighlight(type, data[0].element);
                    var result = data[0];
                    var element = result.element;
                    var attributeObj = Util_1["default"].attributeSet2Object(element.attributeSet);
                    // tslint:disable-next-line:no-empty
                    var server = self._getService(type);
                    if (attributeObj.type === 'shuizha') {
                        var opt = {
                            resourceKey: 'sluice',
                            id: 'ytshuizha_000' + attributeObj.id
                        };
                        server.getDetailInfo(opt).then(function (res) {
                            var data1 = res;
                            data1.b_type = attributeObj.type;
                            _this.addPopup(data1, [element.geometry.x, element.geometry.y], false, type);
                        });
                    }
                    else {
                        if (type === 'countweirGateWater') {
                            server
                                .getWeirgateDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'reservoir') {
                            server
                                .getreservoirDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else if (type === 'floodvillage') {
                            server
                                .getFloodvillageDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                        else {
                            server
                                .getStationDetail({ id: attributeObj.id })
                                .then(function (res) {
                                for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = res.data[key];
                                    if (val === null || val === undefined) {
                                        continue;
                                    }
                                    attributeObj[key] = res.data[key];
                                }
                                _this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
                            });
                        }
                    }
                }
            }
        };
        opts.geometryBuilder = new G.utils.GeometryBuilder({
            geometryField: ['longitude', 'latitude']
        });
        this.simpleRenderMgr.add(opts);
        // 记录展示的数据类型
        this.featureTypeSet[opts.featureType] = {};
        // 视野定位
        // this._fitBounds(type);
        toubu.map(function (item) {
            var _id = item._id;
            var options = {
                data: {
                    type: 'wkt',
                    geom: 'POINT(' + item.x + ' ' + item.y + ')'
                },
                style: {
                    type: 'Custom',
                    options: {
                        // 自定义dom结构
                        content: "<div id='\" + _id + \"'><img src='./imgs/normal.gif'/></div>",
                        offsetx: -32,
                        offsety: -68
                    }
                }
            };
            self.featureHighlight.addHighlight(_id, options);
            $('#' + _id).on('click', function (event) {
                toubu.map(function (item1) {
                    if (item1._id === event.target.parentElement.id) {
                        self.closePopup(); // 关闭弹窗
                        var server = self._getService(type);
                        server.getStationDetail({ id: item1.id }).then(function (res) {
                            for (var _i = 0, _a = Object.keys(res.data); _i < _a.length; _i++) {
                                var key = _a[_i];
                                var value = res.data[key];
                                if (value === null || value === undefined) {
                                    continue;
                                }
                                item1[key] = res.data[key];
                            }
                            _this.addPopup(item1, [item1.x, item1.y], false, type);
                            var options2 = {
                                data: {
                                    type: 'wkt',
                                    geom: 'POINT(' + item1.x + ' ' + item1.y + ')'
                                },
                                style: {
                                    type: 'Custom',
                                    options: {
                                        // 自定义dom结构
                                        content: "<div><img src='./imgs/hover.gif'/></div>",
                                        offsetx: -25,
                                        offsety: -28
                                    }
                                }
                            };
                            self.featureHighlight.addHighlight('gj', options2);
                            self.hideGJ = item1._id;
                            $('#' + item1._id).hide();
                            _this.map.pan(new g2.sfs.Point({
                                x: item1.x,
                                y: item1.y,
                                spatialReference: _this.map.spatialReference
                            }));
                            _this.map.zoomTo(13);
                        });
                    }
                });
            });
        });
    },
    // 是否非地图点击触发，点击地图触发时不居中定位 type: rain|wind|water|work
    addPopup: function (data, coordinate, noneMouseClick, type) {
        var _this = this;
        if (noneMouseClick === void 0) { noneMouseClick = true; }
        this.popupManager
            .addSimple({
            id: this.options.popupId,
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: '',
            autoPan: !noneMouseClick
        })
            .then(function (content) {
            _this.fire(_this.options.popupEventId, {
                data: data,
                containerId: content.containerId,
                id: content.containerId,
                type: type
            });
        });
    },
    // 设置图层名称
    _getFeatureInfo: function (type, data) {
        var featureType = 'monitorWarning_' + type;
        if (!data) {
            return {
                featureType: featureType
            };
        }
        var icon = 'monitorWarning_' + type + '_img';
        return {
            featureType: featureType,
            data: data,
            icon: icon
        };
    },
    // 添加泰森多边形 type:rain wind
    _addVoronoi: function (type) {
        var _this = this;
        var voronoiLayer = this.map.getLayerById('voronoiLayer');
        if (voronoiLayer && voronoiLayer.getCount() < 1) {
            var server = this._getService(type);
            server.getStationsList({}).then(function (res) {
                var result = res.data;
                var features = [];
                result.forEach(function (ele) {
                    var point = turf.point([ele.x, ele.y], ele);
                    features.push(point);
                });
                var pointCollection = turf.featureCollection(features);
                if (_this.options.status === 'add') {
                    _this._voronoi(type, pointCollection);
                }
            });
        }
    },
    // 配置泰森多边形颜色
    _setVoronoiSymbol: function (type, properties) {
        var areaSymbol = new g2.sfs.SimpleFillSymbol({
            borderColor: new g2.sfs.Color({
                a: 255,
                r: 205,
                g: 255,
                b: 251
            }),
            borderThickness: 1,
            fillColor: new g2.sfs.Color({ a: 51, r: 96, g: 233, b: 255 })
        });
        var rainLevel = {
            无雨: 'level_0',
            小雨: 'level_1',
            中雨: 'level_2',
            大雨: 'level_3',
            暴雨: 'level_4',
            大暴雨: 'level_5',
            特大暴雨: 'level_6'
        };
        var level = 'level_0';
        if (type === 'rain' && properties.level && properties.level !== '') {
            level = rainLevel[properties.level];
        }
        else if (type === 'wind') {
            level = 'level_' + this._getWindLevelByWindSpeed(properties.windSpeed);
        }
        areaSymbol.borderThickness = styleUtils_1["default"][type][level].stroke.width;
        var fill = styleUtils_1["default"][type][level].fill.split(',');
        var a = parseFloat(fill[3].split(')')[0]) * 255;
        var r = parseInt(fill[0].split('(')[1], 10);
        var g = parseInt(fill[1], 10);
        var b = parseInt(fill[2], 10);
        areaSymbol.fillColor = new g2.sfs.Color({ a: a, r: r, g: g, b: b });
        return areaSymbol;
    },
    _getWindLevelByWindSpeed: function (windSpeed) {
        var speed = [
            [0, 0.2],
            [0.3, 1.5],
            [1.6, 3.3],
            [3.4, 5.4],
            [5.5, 7.9],
            [8.0, 10.7],
            [10.8, 13.8],
            [13.9, 17.1],
            [17.2, 20.7],
            [20.8, 24.4],
            [24.5, 28.4],
            [28.5, 32.6],
            [32.7, 36.9],
        ];
        var level = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for (var i = 0; i < speed.length; i++) {
            if (speed[i][0] <= windSpeed && windSpeed <= speed[i][1]) {
                return level[i];
            }
        }
    },
    // 根据轮廓裁剪生成泰森多边形
    _voronoi: function (type, points) {
        var _this = this;
        var options = {
            bbox: [73.66, 3.86, 135.05, 53.55]
        };
        var voronoiPolygons = turf.voronoi(points, options);
        var voronoiLayer = this.map.getLayerById('voronoiLayer');
        if (!voronoiLayer) {
            voronoiLayer = new g2.carto.ElementLayer({
                map: this.map,
                id: 'voronoiLayer'
            });
            this.map.addLayer(voronoiLayer);
        }
        this._getRegionData(configRegistry_1["default"].value.district.root).then(function (data) {
            var polygon = g2.sfs.GeometryFactory.createGeometryFromWkt(data.wkt, 4326);
            var boundary = G.utils.GeometryUtil.toJstsGeometry(polygon); // 将轮廓转为jsts对象
            turf.featureEach(voronoiPolygons, function (currentFeature, featureIndex) {
                if (currentFeature) {
                    turf.featureEach(points, function (point, index) {
                        if (turf.booleanPointInPolygon(point.geometry, currentFeature.geometry)) {
                            currentFeature.properties = point.properties;
                        }
                    });
                    var voronoiPolygon = G.utils.GeometryUtil.toJstsGeometry(currentFeature.geometry); // 将每一个多边形转为jsts对象
                    var intersection = boundary.intersection(voronoiPolygon);
                    if (!intersection.geometries ||
                        intersection.geometries.length > 0) {
                        var geomes = G.utils.GeometryUtil.fromJstsGeometry({
                            jstsGeom: intersection,
                            type: 'g2geom',
                            spatialReference: 4326
                        });
                        var areaSymbol = _this._setVoronoiSymbol(type, currentFeature.properties);
                        var polygonEle = new g2.sfs.Element({
                            geometry: geomes,
                            symbol: areaSymbol
                        });
                        voronoiLayer.add(polygonEle);
                    }
                }
            });
        });
    },
    _addHighlight: function (type, element) {
        var featureType = this._getFeatureInfo(type).featureType;
        var symbolMapper = null;
        if (SymbolMap_1["default"][type]) {
            symbolMapper = SymbolMap_1["default"][type];
        }
        else {
            symbolMapper = SymbolMap_1["default"]["default"];
        }
        var symbolObj = Util_1["default"].toJSON(symbolMapper.hlSymbol);
        var attributeObj = Util_1["default"].attributeSet2Object(element.attributeSet);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(featureType, attributeObj)];
        var options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')'
            },
            style: symbolObj,
            blink: {
                enable: true
            }
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
        var self = this;
        var point = new g2.sfs.Point({
            x: element.geometry.x,
            y: element.geometry.y,
            spatialReference: this.map.spatialReference
        });
        this.map.pan(point);
        this.map.zoomTo(13);
        this.timeout = setTimeout(function () {
            _setbink();
        }, 3500);
        function _setbink() {
            clearTimeout(self.timeout);
            self.timeout = null;
            self.featureHighlight.removeHighlight(self.options.highLightId);
            var options2 = options;
            options2.blink.enable = false;
            self.featureHighlight.addHighlight(self.options.highLightId, options2);
        }
    },
    // 移除高亮
    _removeHighlight: function () {
        this.featureHighlight.removeHighlight(this.options.highLightId);
        this.featureHighlight.removeHighlight('gj');
        $('#' + this.hideGJ).show();
    },
    // 关闭弹窗
    closePopup: function () {
        // 清除上一次的高亮
        this._removeHighlight();
        this.popupManager.remove(this.options.popupId);
    },
    /**
     * 获取区域数据
     * @param code  烟台市：370600 山东省370000
     */
    _getRegionData: function (code) {
        var self = this;
        var opt = {
            districtcode: code
        };
        return new Promise(function (resolve, reject) {
            if (self.regionCache[code]) {
                resolve(self.regionCache[code]);
            }
            self.service.regionSelectionServer
                .getDistrictByCode(opt)
                .then(function (data) {
                self.regionCache[code] = data.data;
                resolve(self.regionCache[code]);
            })["catch"](function (err) {
                reject(err);
            });
        });
    },
    // 视野定位
    _fitBounds: function (type) {
        var featureType = this._getFeatureInfo(type).featureType;
        var extent = this.simpleRenderMgr.getExtent(featureType);
        this.options.featureLocate.fit({
            type: 'geojson',
            geom: extent.asGeoJson()
        });
    }
});
exports["default"] = component;
