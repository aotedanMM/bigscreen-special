// 模块的GIS逻辑
import Util from '../../Util';
import SymbolMap from './SymbolMap';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        districtServer: null,
        map: null,
        simpleRenderMgr: null,
        featureHighlight: null,
        featureLocate: null,
        popupManager: null,
        symbolConfig: null,
        popupId: 'disaster_sta_popup_id',
        highLightId: 'disaster_sta_highlight_id',
        // 行政区划
        featureType: 'disaster_sta_feature_type',
        // 乡镇点
        pointType: 'disaster_sta_point_type',
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
        this.list = [];
        this.currentHl = null;
        // 类型： 失联区域 Lost_zone_type  人员伤亡 Casualties_type  房屋损毁 Hous_damage_type 电力损毁 Power_damage_type
        this.type = null;
    },
    //  销毁
    destroy() {
        // dosth
        componentBase.prototype.destroy.call(this);
    },

    addListeners() {
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery) {
            this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
            this.options.nearbyQuery.on('load', this._onNearByLoad, this);
            this.options.nearbyQuery.on('unload', this._onNearByUnLoad, this);
        }
    },

    removeListeners() {
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery) {
            this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
        }
    },

    _onNearByLoad() {
        console.debug('监听周边查询加载！');
        this.closePopup();
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        this.options.simpleRenderMgr.setVisible(this.options.pointType, false);
    },

    _onNearByUnLoad() {
        console.debug('监听周边查询卸载！');
        this.options.simpleRenderMgr.setVisible(this.options.pointType, true);
        // 异步处理
        setTimeout(() => {
            this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
        }, 10);
    },

    /**
     * 加载数据
     * @param opts
     * @param opts.type
     * @param opts.list
     */
    load(opts: any) {
        componentBase.prototype.load.call(this);
        return new Promise(async (resolve, reject) => {
            this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
            this.type = opts.type;
            const codeArr: any = [];
            const listMap: any = {};
            for (const item of opts.list) {
                codeArr.push(item.id);
                listMap[item.id] = item;
            }
            // 灾情研判服务的获取行政区划边界数据
            const districtArr: any = await this.options.districtServer.getDistrictBorder({
                code: codeArr,
            });
            for (const item of districtArr) {
                const temp: any = listMap[item.code];
                temp.geometry = item.geom;
                temp.x = item.lng;
                temp.y = item.lat;
            }
            this.list = opts.list; // 省行政区划数据
            this._updateMap(opts.list, null); // 更新地图
            this._fitBounds(); // 改变地图视野
            resolve();
        });
    },
    /**
     * 清除所有
     */
    unload() {
        this.type = null;
        this._clear();
        // 清空图层上的事件
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        componentBase.prototype.unload.call(this);
    },
    // 关闭信息框
    closePopup() {
        this.options.popupManager.remove(this.options.popupId);
        this._hideHighlight();
    },
    // 界面按钮调用省行政区划点击
    provinceClick(code: any) {
        const provinceLayer = this.options.simpleRenderMgr.getLayer(this.options.featureType);
        if (provinceLayer) {
            const element = provinceLayer.find(code);
            const features: any = {};
            if (!!element) {
                features.element = element;
                features.featureType = this.options.featureType;
                const opt: any = {};
                opt.list = [features];
                this._onLayerClick(opt);
            }
        }
    },
    // 界面按钮调用乡镇点事件点击
    districPointClick(code: any) {
        const pointLayer = this.options.simpleRenderMgr.getLayer(this.options.pointType);
        if (pointLayer) {
            const pointEle = pointLayer.find(code);
            const features: any = {};
            if (pointEle) {
                features.element = pointEle;
                features.featureType = this.options.pointType;
                const opt: any = {};
                opt.list = [features];
                this._onLayerClick(opt);
            }
        }
    },
    /**
     * 显示指定行政区划统计
     * @param opts
     * @param opts.code
     */
    showDistrict(opts: any) {
        this._clear();
        this._updateMap(this.list, (item: any) => {
            return item.id === opts.code;
        });
    },

    /**
     * 显示所有
     * @param opts
     */
    showAll(opts: any) {
        this._clear();
        this._updateMap(this.list, (item: any) => {
            return true;
        });
        this._fitBounds();
    },
    locatePoint(x: any, y: any) {
        const geom = {
            type: 'Point',
            coordinates: [parseFloat(x), parseFloat(y)],
        };
        const pointdata: any = {
            type: 'geojson',
            geom,
        };
        this.options.featureLocate.fit(pointdata, {
            maxZoom: this.map.getZoomLevel(),
        });
    },
    // 添加乡镇点数据
    _addTownPointInDist(childFeatures: any) {
        let symbolMapper: any = null;
        symbolMapper = SymbolMap.default;
        const symbolObj: any = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn('district_point_town')];
        // 添加乡镇点数据
        const simpleRenOpt: any = {
            featureType: this.options.pointType,
            featureName: '灾情统计_行政区划点',
            list: childFeatures,
            type: 0, // 使用elementLayer,
            idField: 'id', // 数据唯一标识的属性
        };

        simpleRenOpt.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                // 根据数据属性控制不同的显示效果
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        simpleRenOpt.symbolBuilder = new SymbolBuilder();
        this.options.simpleRenderMgr.add(simpleRenOpt);
    },
    // 隐藏高亮
    _hideHighlight() {
        this.options.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 乡镇点动画闪烁
    _showHighLight(coordinate: number[]) {
        let symbolMapper: any = null;
        symbolMapper = SymbolMap.default;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn('district_point_town')];

        this._hideHighlight();
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
            },
            style: symbolObj,
            blink: {
                enable: false,
            },
        };
        this.options.featureHighlight.addHighlight(this.options.highLightId, options);
    },
    // 面定位
    _locatePolygon(polygon: any) {
        if (polygon) {
            const center = polygon.getBaryCenter() || {};
            this.locatePoint(center.x, center.y);
        }
    },
    _fitPolygon(polygon: any) {
        if (polygon) {
            const geojson = polygon.asGeoJson();
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: geojson,
            });
        }
    },
    // 省行政区划图层点击统一处理
    _onLayerClick(features: any) {
        this.closePopup();
        let provinceFeature: any = null;
        let pointFeature: any = null;
        const list = features.list;
        for (const item of list) {
            if (item.featureType === this.options.pointType) {
                pointFeature = item;
                break;
            } else if (item.featureType === this.options.featureType) {
                provinceFeature = item;
            }
        }
        // 优先实现点的点击识别事件
        if (pointFeature) {
            const symbolObj: any = Util.toJSON(SymbolMap.default.hlSymbol);
            const featureObj: any = pointFeature;
            const attributeObj: any = Util.attributeSet2Object(featureObj.element.attributeSet);
            const element = featureObj.element;
            // 点闪烁
            this._showHighLight([element.geometry.x, element.geometry.y]);
            // 添加点识别弹出框
            this._clickTip(element, this.options.pointType, this.options.pointType);
            // 定位点
            this.locatePoint(element.geometry.x, element.geometry.y);
            this.options.nearbyQuery.setTargetFeature({
                type: pointFeature.featureType,
                featureType: pointFeature.featureType,
                data: attributeObj,
                symbol: G.utils.RenderUtil.object2Symbol(symbolObj),
            });
            // 分发事件，传送乡镇点编码
            this.fire('disasterSta_district_point_code', {
                code: element.id,
                type: this.options.pointType,
            });

        } else if (provinceFeature) {  // 省行政区划点击识别事件
            SymbolMap.default.hlSymbol.options.source = this.options.symbolConfig.icons[SymbolMap.default.iconHlFn('district_point_town')];
            const symbolObj: any = Util.toJSON(SymbolMap.default.hlSymbol);
            // 清除高亮和弹出框
            this._clearClick();
            const featureObj: any = provinceFeature;
            const attributeObj: any = Util.attributeSet2Object(featureObj.element.attributeSet);
            const childFeatures = attributeObj.child;
            // 行政区划定位
            const polygon = featureObj.element.geometry;
            this._fitPolygon(polygon);
            // 添加乡镇点数据
            this._addTownPointInDist(childFeatures);
            // 点击时行政区划高亮,并弹出面识别弹出框
            this._Districtclick(featureObj.element, this.options.featureType, this.options.featureType);
            this.options.nearbyQuery.setTargetFeature({
                type: provinceFeature.featureType,
                featureType: provinceFeature.featureType,
                data: attributeObj,
                symbol: G.utils.RenderUtil.object2Symbol(symbolObj),
            });
            // 分发事件，传送行政区划编码
            this.fire('disasterSta_district_code', {
                code: provinceFeature.element.id,
                type: this.options.featureType,
            });
        }
    },

    // 显示省行政区划
    _updateMap(list: any, filter: any) {
        const self: any = this;
        let borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 255 });
        if (this.map.getLayerById('basemap')) {
            borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 255 });
        } else if (this.map.getLayerById('tiandituLayer_img')) {
            borderColor = new (g2 as any).sfs.Color({ r: 46, g: 239, b: 255, a: 255 });
        } else if (this.map.getLayerById('tiandituLayer_vec')) {
            borderColor = new (g2 as any).sfs.Color({ r: 255, g: 55, b: 1, a: 255 });
        } else if (this.map.getLayerById('tiandituLayer_ter')) {
            borderColor = new (g2 as any).sfs.Color({ r: 12, g: 0, b: 255, a: 255 });
        }
        const symbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({ r: 0, g: 255, b: 255, a: 0 }),
            opacity: 1,
            borderThickness: 2,
            style: 5,
        });
        const updateSymbolObj = {
            borderColor,
            fillColor: { r: 46, g: 239, b: 255, a: 70 },
            opacity: 1,
            borderThickness: 3,
            style: 5,
        };
        const hlSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', updateSymbolObj);
        const SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: (data: any) => {
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.parentName,
                    fontFamilyName: 'Microsoft Yahei',
                    fontSize: 24,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textBackgroundBorderThickness: 2,
                    textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 24, g: 62, b: 80 }),
                    textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 255, r: 55, g: 224, b: 245 }),
                    foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
                    padding: [2, 10, 2, 10],
                });
                if (data.id === self.currentHlId) {
                    const h1CurrencySymbol = new (g2 as any).sfs.CurrencySymbol({
                        textSymbol: textSym,
                        fillSymbol: hlSymbol,
                    });
                    return h1CurrencySymbol;
                } else {
                    const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                        textSymbol: textSym,
                        fillSymbol: symbol,
                    });
                    return currencySymbol;
                }
            },
        });
        let dataList: any = [];
        if (filter) {
            for (const item of list) {
                if (filter(item)) {
                    dataList.push(item);
                }
            }
        } else {
            dataList = list;
        }
        const opts = {
            featureType: this.options.featureType,
            featureName: '区划边界',
            idField: 'id',
            type: 0,
            list: dataList,
            geometryBuilder: new G.utils.GeometryBuilder({ geometryField: ['geometry'] }),
            symbolBuilder: new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
    },

    _fitBounds() {
        const extent: any = this.options.simpleRenderMgr.getExtent(this.options.featureType);
        this.options.featureLocate.fit({
            type: 'geojson',
            geom: extent.asGeoJson(),
        });
    },

    // 清除所有
    _clear() {
        // 清空行政区划图层
        this.options.simpleRenderMgr.remove(this.options.featureType);
        // 清空乡镇点图层
        this.options.simpleRenderMgr.remove(this.options.pointType);
        this._clearClick();
    },

    _clearClick() {
        // 删除弹出框
        this.closePopup();
        this._clearHighlight();
    },

    // 行政区划面点击
    _Districtclick(element: any, name: any, featureType: any) {
        // 弹出框
        this._clickTip(element, name, featureType);
        // 高亮
        this._highlight(element);
    },

    //
    _clickTip(element: any, name: any, featureType: any) {
        const point: any = element.geometry.getBaryCenter();
        this.options.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [point.x, point.y],
            className: name,
        }).then((content: any) => {
            const data: any = Util.attributeSet2Object(element.attributeSet);
            const eventData: any = {
                featureType,
                // 当前的统计类型：、，区分人员、建筑等
                type: this.type,
                content,
                data,
            };
            this.fire('disasterSta_popup', eventData);
        });
    },

    // 面高亮
    _highlight(element: any) {
        this.currentHlId = element.id;
        this._updateForHl(element.id);
    },
    // 清除面高亮，恢复图层原有的渲染
    _clearHighlight() {
        if (this.currentHlId) {
            const id: any = this.currentHlId;
            this.currentHlId = null;
            this._updateForHl(id);
        }
    },

    // 更新面
    _updateForHl(id: any) {
        let data: any = null;
        for (const item of this.list) {
            if (item.id === id) {
                data = item;
                break;
            }
        }
        const opts: any = {};
        opts.featureType = this.options.featureType;
        opts.list = [data];
        this.options.simpleRenderMgr.update(opts);
    },
});
export default component;
