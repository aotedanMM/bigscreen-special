import Util from '../../Util';
// 灾损统计行政区划
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    options: {
        map: null,
        service: null,
        simpleRenderMgr: null,
        symbolConfig: null,
        district: {
            root: '',
        }, // 默认行政区划代码
        featureType_border: 'districtHome_border',
        featureType_country: 'districtCountry',
        featureType_country_label: 'districtCountry_label',
        featureType_country_border: 'districtCountry_border',
        featureType_town_border: 'districtTown_border_page',
        featureType_town_label: 'districtTown_label_page',
        featureName: '系统行政区划图层',
        popupId: 'district_popup_id', // 弹窗唯一标识
        highLightId: 'district_hl', // 高亮id
        popupEventId: 'district_popup', // 添加弹窗后执行事件id
        status: 'add', // add|remove，此时是添加数据状态还是移除数据状态。
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.symbolConfig = options.symbolConfig;
        this.service = options.service;
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.featureLocate = options.featureLocate;
    },
    //  销毁
    destroy() {
        this.unload();
        this.simpleRenderMgr = null;
        this.symbolConfig = null;
        this.featureLocate = null;
        componentBase.prototype.destroy.call(this);
    },

    /**
     * 加载
     */
    load() {
        componentBase.prototype.load.call(this);
        this.addDistrict();
        this.showDistrictLayer();
    },
    addListeners() {
        //
        this.map.listen('resolutionchanged', this._onResolutionChanged, this);
    },
    removeListeners() {
        this.map.off('resolutionchanged', this._onResolutionChanged, this);
    },
    /**
     * 卸载
     */
    unload() {
        this.removeDistrict();
        componentBase.prototype.unload.call(this);
    },
    /**
     * 设置区县显示隐藏
     * @param visible
     */
    setCountyVisible(visible: any) {
        const level = this.map.getZoomLevel();
        console.log('setCountryVisible');
        if (visible) {
            this.addListeners();
            this.setVisibleByleve(level);
            this.simpleRenderMgr.setVisible(this.conf.featureType, visible);
            this.simpleRenderMgr.setVisible(this.confPlygon.featureType, visible);
        } else {
            this.removeListeners();
            this.simpleRenderMgr.setVisible(this.options.featureType_country, visible);
            this.simpleRenderMgr.setVisible(this.options.featureType_country_label, visible);
            this.simpleRenderMgr.setVisible(this.options.featureType_country_border, visible);
            this.simpleRenderMgr.setVisible(this.options.featureType_town_border, visible);
            this.simpleRenderMgr.setVisible(this.options.featureType_town_label, visible);
            this.simpleRenderMgr.setVisible(this.conf.featureType, visible);
            this.simpleRenderMgr.setVisible(this.confPlygon.featureType, visible);
        }
    },
    // 添加烟台市行政区划
    addDistrict() {
        this.options.status = 'add';
        this.service.getDistrictTreeByCode({ districtcode: [this.options.district.root] }).then((res: any) => {
            if (this.options.status === 'add') {
                const districts = res.data.children;
                // this._showDistrictCountryBorder(districts);
                // this._showDistrictCountry(districts);
                this._showDistrictCountryLabel(districts);
                // this._showOuterBorder(res.data);
            }
        });
        this.service.getTowns({ districtcode: this.options.district.root }).then((res: any) => {
            // this._showDistrictTownBorder(res);
            this._showDistrictTownLabel(res);
        });
    },
    // 移除行政区划
    removeDistrict() {
        this.options.status = 'remove';
        this.simpleRenderMgr.remove(this.options.featureType_border);
        this.simpleRenderMgr.remove(this.options.featureType_country);
        this.simpleRenderMgr.remove(this.options.featureType_country_label);
        this.simpleRenderMgr.remove(this.options.featureType_country_border);
        this.simpleRenderMgr.remove(this.options.featureType_town_border);
        this.simpleRenderMgr.remove(this.options.featureType_town_label);
    },
    // 分辨率变化
    _onResolutionChanged(event: any) {
        const level: number = Math.round(event.level);
        this.setVisibleByleve(level);
    },
    setVisibleByleve(level: any) {
        if (level >= 12.5) {
            this.simpleRenderMgr.setVisible(this.options.featureType_country, false);
            this.simpleRenderMgr.setVisible(this.options.featureType_country_border, false);
        } else {
            this.simpleRenderMgr.setVisible(this.options.featureType_country, true);
            this.simpleRenderMgr.setVisible(this.options.featureType_country_border, true);
        }
        if (level >= 12.5) {
            this.simpleRenderMgr.setVisible(this.options.featureType_town_border, true);
            this.simpleRenderMgr.setVisible(this.options.featureType_town_label, true);
            this.simpleRenderMgr.setVisible(this.options.featureType_country_label, false);
        } else {
            this.simpleRenderMgr.setVisible(this.options.featureType_town_border, false);
            this.simpleRenderMgr.setVisible(this.options.featureType_town_label, false);
            this.simpleRenderMgr.setVisible(this.options.featureType_country_label, true);
        }
    },
    // 绘制整个行政区划边界(烟台外层轮廓)
    _showOuterBorder(district: any) {
        const list: any = [];
        list.push({
            districtcode: this.options.district.root,
            wkt: district.wkt,
        });
        //
        const ploylineSymbolRed1: any = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 18,
                    g: 171,
                    b: 199,
                },
                width: 4,
            },
        };
        const ploylineSymbolHighLight1 = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 255,
                    g: 255,
                    b: 255,
                },
                style: 5,
                width: 2,
            },
        };
        const ploylineSymbolHighLight = G.utils.RenderUtil.object2Symbol(ploylineSymbolHighLight1);
        const ploylineSymbolRed = G.utils.RenderUtil.object2Symbol(ploylineSymbolRed1);
        const ploylineCombSymbolRed = new g2.sfs.LineCombinedSymbol({
            lineSymbols: [ploylineSymbolHighLight, ploylineSymbolRed],
        });
        const SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: (data: any) => {
                return ploylineCombSymbolRed;
            },
        });
        const opts = {
            featureType: this.options.featureType_border,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list,
            geometryBuilder: new G.utils.GeometryBuilder({
                geometryField: ['wkt'],
                geometryType: 'polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {},
        };
        this.simpleRenderMgr.add(opts);
    },
    // 绘制行政区划面
    _showDistrictCountry(district: any) {
        this.districtsList = district;
        const borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        const symbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({ r: 0, g: 240, b: 255, a: 12 }),
            // opacity: 0.9,
            borderThickness: 1,
            style: 5,
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                return symbol;
                // const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                //     fillSymbol: symbol,
                // });
                // return currencySymbol;
            },
        });
        const opts = {
            featureType: this.options.featureType_country,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list: district,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['wkt'],
                geometryType: 'polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.simpleRenderMgr.add(opts);
    },
    // 绘制行政区划标注
    _showDistrictCountryLabel(district: any) {
        this.districtsList = district;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.districtname,
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

                const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                    textSymbol: textSym,
                });
                return currencySymbol;
            },
        });
        const opts = {
            featureType: this.options.featureType_country_label,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list: district,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['wkt'],
                geometryType: 'polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.simpleRenderMgr.add(opts);
        this.map.getLayerById(this.options.featureType_country_label).setZIndex(12);
    },
    // 绘制行政区划内部区县边界
    _showDistrictCountryBorder(district: any) {
        const ploylineSymbolRed1: any = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 18,
                    g: 171,
                    b: 199,
                },
                width: 1,
                style: 0,
            },
        };
        const ploylineSymbolHighLight1 = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 255,
                    g: 255,
                    b: 255,
                },
                style: 0,
                width: 4,
            },
        };
        const ploylineSymbolHighLight = (G as any).utils.RenderUtil.object2Symbol(ploylineSymbolHighLight1);
        const ploylineSymbolRed = (G as any).utils.RenderUtil.object2Symbol(ploylineSymbolRed1);
        const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
            lineSymbols: [ploylineSymbolHighLight, ploylineSymbolRed],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                return ploylineCombSymbolRed;
            },
        });
        const opts = {
            featureType: this.options.featureType_country_border,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list: district,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['wkt'],
                geometryType: 'polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {},
        };
        this.simpleRenderMgr.add(opts);
    },
    // 绘制乡镇边界
    _showDistrictTownBorder(res: any) {
        const geometryBuilder = new G.utils.GeometryBuilder({ geometryType: 'polygon' });
        const symbolBuilder = new G.utils.SymbolBuilder({});
        const featureBuilder = new G.utils.FeatureBuilder({
            geometryBuilder,
            symbolBuilder,
        });
        const list: any = [];
        const arr = res.entities;
        arr.forEach((element: any) => {
            element = featureBuilder.buildElementFromGFeature(element);
            if (element) {
                element.geometry.spatialReference = this.map.spatialReference;
                const geom = element.geometry.asGeoJson();
                list.push({ geom });
            }
        });
        const ploylineSymbolRed1: any = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 18,
                    g: 171,
                    b: 199,
                },
                width: 3,
                style: 5,
            },
        };
        const ploylineSymbolHighLight1 = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 255,
                    g: 255,
                    b: 255,
                },
                style: 5,
                width: 7,
            },
        };
        const ploylineSymbolHighLight = (G as any).utils.RenderUtil.object2Symbol(ploylineSymbolHighLight1);
        const ploylineSymbolRed = (G as any).utils.RenderUtil.object2Symbol(ploylineSymbolRed1);
        const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
            lineSymbols: [ploylineSymbolHighLight, ploylineSymbolRed],
            // lineSymbols: [ploylineSymbolRed],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                return ploylineCombSymbolRed;
            },
        });
        const opts = {
            featureType: this.options.featureType_town_border,
            featureName: this.options.featureName,
            list,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {},
        };
        this.simpleRenderMgr.add(opts);
        const level = this.map.getZoomLevel();
        if (level < 13) {
            this.simpleRenderMgr.setVisible(this.options.featureType_town_border, false);
        }
        this.map.getLayerById(this.options.featureType_town_border).setZIndex(12);
    },
    // 绘制乡镇标注
    _showDistrictTownLabel(res: any) {
        const geometryBuilder = new G.utils.GeometryBuilder({ geometryType: 'polygon' });
        const symbolBuilder = new G.utils.SymbolBuilder({});
        const featureBuilder = new G.utils.FeatureBuilder({
            geometryBuilder,
            symbolBuilder,
        });
        const list: any = [];
        const arr = res.entities;
        arr.forEach((element: any) => {
            element = featureBuilder.buildElementFromGFeature(element);
            if (element) {
                element.geometry.spatialReference = this.map.spatialReference;
                const geom = element.geometry.asGeoJson();
                const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                const data = Object.assign({}, { geom }, attributeObj);
                list.push(data);
            }
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.name,
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

                const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                    textSymbol: textSym,
                });
                return currencySymbol;
            },
        });
        const opts = {
            featureType: this.options.featureType_town_label,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.simpleRenderMgr.add(opts);
        const level = this.map.getZoomLevel();
        if (level < 13) {
            this.simpleRenderMgr.setVisible(this.options.featureType_town_label, false);
        }
    },
    showDistrictLayer() {
        const conf = this.conf = this.options.serviceConfig.DistrictLayerBorder.tileLayer;
        const confPlygon = this.confPlygon = this.options.serviceConfig.DistrictLayerPolygon.tileLayer;
        this._initLayer(conf);
        this._initLayer(confPlygon);
    },
    _initLayer(params: any) {
        const opts = {
            featureType: params.featureType, // 指定数据类型
            featureName: params.featureType, // 数据类型说明
            geometryType: params.geometryType,
            layerOptions: {
                id: params.id || 'WMSLayer',
                name: params.id || 'WMSLayer',
                url: params.url,
                layers: params.layers,
                opacity: params.opacity || 1,
                tileType: params.tileType || 101,
                projection: 'EPSG:4326',
                visible: true,
            },
        };
        this.simpleRenderMgr.remove(params.featureType);
        if (this.clickEventName) {
            this.unbindClickEvent();
        }
        this.simpleRenderMgr.addWMS(opts);
    },
});
export default component;
