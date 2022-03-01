import { SymbolMap } from '../../SymbolConfig';
import Util from '../../Util';
/**
 * 历史地震
 */
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        // 资源类型
        type: null,
        eventInfo: null,
        map: null,
        mapConfig: null,
        symbolConfig: null,
        toolTipWare: null,
        service: null,
        commonDistrictServer: null,
        highLightId: 'hl_historyeq', // 高亮id
        popupId: 'popup_historyeq', // 弹窗唯一标识
        fireAddPopupEventId: 'hisPointspopup', // 添加弹窗后执行事件id
        fireShowResourceEventId: 'popup', // 显示数据后执行事件id
    },
    provinceDistrictData: {
        province: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        const self = this;

        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.toolTipWare = options.toolTipWare;
        this.service = options.service;
        // do sth
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
    },
    load() {
        componentBase.prototype.load.call(this);
        const extent = this.map.getExtent();
        const opts = {
            maxLat: extent.maxy + '',
            maxLon: extent.maxx + '',
            minLat: extent.miny + '',
            minLon: extent.minx + '',
        };
        this.queue = [];
        this.eqdata = [];
        this.levelArr = ['1', '2', '3', '4']; // 默认加载全部震级
        this.hideResource();
        this.currenttime = new Date().getTime();
        // this.service.getHistoryEarthQuakeData(opts).then((data: any) => {
        //     // this.addResource(data);
        //     this.eqdata = this._classData(data);
        //     this.showResource(this.levelArr);
        // });
      //  this.map.off('extentchanged', this._mapExtendChanged, this);
       // this.map.listen('extentchanged', this._mapExtendChanged, this);
        // do sth
        // this.commonDistrictServer.getProvinces({}).then((data: any) => {
        //     console.log(data);
        //     provinceDistrictData.province=data;
        // });
    },
    /**
     * 设置选中震级
     * @param levelArr 设置选中震级
     */
    setlevelArr(levelArr: any) {
        this.levelArr = levelArr;
    },
    unload() {
        // 清理所有地图数据，地图监听
        this.clearPopup();
        this._clearLayers();
        this.queue = [];
        this.eqdata = [];
        this.levelArr = [];
        //
        componentBase.prototype.unload.call(this);
    },
    /**
     * 显示对应级别的数据 DEMO
     * @param levelArr 烈度级别数组
     */
    showResource(levelArr: any) {
        this.hideResource();
        if (levelArr) {
            let sdata: string | any[] = [];
            for (const key in this.eqdata) {
                if (levelArr.indexOf(key) !== -1) {
                    sdata = sdata.concat(this.eqdata[key]);
                }
            }
            if (sdata.length > 0) {
                this.addResource(sdata);
            }
        } else {
            this.hideResource();
        }
        // this.eqdata;
        // this.addResource(data);
    },
    // 地图上叠加数据 线一移植
    addResource(data: any) {
        // this.addPointGaoWenLocation(data);
        this.hideResource();
        if (data && data.length > 0) {
            this._showResourcesOnMap2(data);
        }
    },
    _showResourcesOnMap2(dataList: any) {
        const opt11: any = {};
        opt11.featureType = 'historyeq'; // 指定数据类型
        opt11.featureName = '历史地震'; // 数据类型说明
        opt11.idField = 'historyId'; // 数据唯一标识的属性
        opt11.list = dataList; // 数据列表
        opt11.type = 1; // 使用feature渲染
        opt11.geometryBuilder = new this.options.PointGeometryBuilder({
            geometryField: ['longitude', 'latitude'],
        });
        const symbolMapper: any = SymbolMap.HISTORYEARTH;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const symbolObj: any = Util.toJSON(symbolMapper.symbol(null, data));
                symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(null, data)];
                return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opt11.symbolBuilder = new SymbolBuilder(),
            opt11.listeners = {
                click: (clickdata: any) => {
                    const element = clickdata[0].element;
                    this._showHighlight(element.attributeSet.getItem(8).value,
                        [element.geometry.x, element.geometry.y], element);
                    // this指向监听时的context变量
                    const attributeSet: any = element.attributeSet;
                    const data: any = {};
                    for (let i = 0; i < attributeSet.getCount(); i++) {
                        const attribute = attributeSet.getItem(i);
                        data[attribute.name] = attribute.value;
                    }
                    this.addPopup(data, [element.geometry.x, element.geometry.y], false);
                },
            },
            this.simpleRenderMgr.add(opt11);
        // const level = this.map.getZoomLevel();
        // if (level > 8) {
        //     this.simpleRenderMgr.setVisible('historyeq', true);
        // } else {
        //     this.simpleRenderMgr.setVisible('historyeq', false);
        // }
    },

    /**
    * 隐藏对应级别的数据
    * @param levelArr 烈度级别数组
    */
    hideResource(levelArr: any[]) {
        // todo
        // 地图清除烈度数组对应范围内的数据
        this.simpleRenderMgr.remove('historyeq');
        // this._fitMap();
    },
    locateEvent(opts: any) {
        const coordinates: any = [parseFloat(opts.longitude), parseFloat(opts.latitude)];
        if (G.utils.CoordUtil.withinChina(coordinates, 4326)) {
            const geom = {
                type: 'Point',
                coordinates,
            };
            const pointdata: any = {
                type: 'geojson',
                geom,
            };
            this.featureLocate.fit(pointdata, { maxZoom: this.map.getZoomLevel() });
            this.addPopup(opts, [geom.coordinates[0], geom.coordinates[1]]);
            const symbolMapper: any = SymbolMap.HISTORYEARTH;
            const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol(null, opts));
            symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(null, opts)];
            const options = {
                data: {
                    type: 'geojson',
                    geom: {
                        type: 'Point',
                        coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
                    },
                },
                style: symbolObj, // 不闪烁
                blink: {
                    enable: false,
                },
            };
            this.featureHighlight.addHighlight(this.options.highLightId, options);
        } else {
            console.warn('坐标错误:' + JSON.stringify(opts));
        }
    },
    /**
     *
     * @param data
     * @param coordinate
     * @param noneMouseClick 是否非地图点击触发，点击地图触发时不居中定位；点击列表触发时，不设置弹出框autoPan
     */
    addPopup(data: any, coordinate: any, noneMouseClick: any = true) {
        // this.closePopup();
        this.popupManager.clear();
        // this.featureHighlight.clearHighlight();
        this.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: '',
            autoPan: !noneMouseClick,
        }).then((content: any) => {
            this.fire(this.options.fireAddPopupEventId, {
                featureType: 'histroyEarthQuake',
                type: 'histroyEarthQuake',
                data,
                content,
                containerId: content.containerId,
                id: content.containerId,
            });
        });
    },
    /**
    * 显示资源的弹框
    * @param id 资源id
    */
    showPopup(id: any) {
        // todo
        // 弹出框，视野定位，高亮
    },

    clearAll() {
        this.clearPopup();
        this._clearLayers();
        this.hideHighlight();
    },
    /**
     * 清除弹出框
     */
    clearPopup() {
        // todo
        this.popupManager.remove(this.options.popupId);
        this.hideHighlight();
    },
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this.hideHighlight();
    },

    _clearLayers() {
        // todo
        this.simpleRenderMgr.remove('historyeq');
    },
    _showHighlight(eventType: string, coordinate: any, element: any) {
        const data: any = Util.attributeSet2Object(element.attributeSet);
        const symbolMapper: any = SymbolMap.HISTORYEARTH;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol(null, data));
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(null, data)];
        const options = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
                },
            },
            style: symbolObj, // 不闪烁
            blink: {
                enable: false,
            },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 地图上数据变化时，需要重新调整地图视野，适配数据
    _fitMap(array: any) {
        // todo
        // 根据展示的资源数据调整地图视野
        const layer = this.simpleRenderMgr.getLayer('historyeq');
        const arr = [];
        for (const i of array) {
            for (const k of layer.elements) {
                for (const m of k.attributeSet.attributes) {
                    const sim = {
                        type: 'wkt',
                        geom: k.geometry.asWkt(),
                    };
                    arr.push(sim);
                }
            }
        }
        this.featureLocate.fit(arr);
    },
});
export default component;
