import { SymbolMap} from '../../SymbolConfig';
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
        mapConfig : null,
        symbolConfig: null,
        toolTipWare: null,
        service: null,
        commonDistrictServer: null,
        highLightId: 'hl_airteam', // 高亮id
        popupId: 'popup_airteam', // 弹窗唯一标识
        fireAddPopupEventId: 'airPointspopup', // 添加弹窗后执行事件id
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
        const point = this.options.eventInfo.getPoint(); // ['116', '40']; //
        const opts = {
            latitude: point[1],
            longitude: point[0],
            typeCode: 'T018',
          };
        this.service.getMapData(opts).then((data: any) => {
            if (data.subList.length > 0) {
                this.addResource(data.subList);
            }
        });
        // do sth
        // this.commonDistrictServer.getProvinces({}).then((data: any) => {
        //     console.log(data);
        //     provinceDistrictData.province=data;
        // });
    },
    unload() {
        // todo
        // 清理所有地图数据，地图监听
        this.clearPopup();
        this._clearLayers();
        //
        componentBase.prototype.unload.call(this);
    },
    // 地图上叠加数据 线一移植
    addResource(data: any) {
        // this.addPointGaoWenLocation(data);
        this.hideResource();
        if ( data && data.length > 0 ) {
            this._showResourcesOnMap2(data);
        }
    },
    _showResourcesOnMap2(dataList: any) {
        const opt11: any = {};
        opt11.featureType = 'airteam'; // 指定数据类型
        opt11.featureName = '航空护林站'; // 数据类型说明
        opt11.idField = 'id'; // 数据唯一标识的属性
        opt11.list = dataList; // 数据列表
        opt11.type = 0; // 使用feature渲染
        opt11.geometryBuilder = new this.options.PointGeometryBuilder({
            geometryField: ['longitude', 'latitude'],
        });
        const symbolMapper: any = SymbolMap.AIRTEAM;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const symbolObj: any = Util.toJSON(symbolMapper.symbol);
                symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(null, data)];
                return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opt11.symbolBuilder = new SymbolBuilder(),
        opt11.listeners = {
            click: (clickdata: any) => {
                const element = clickdata[0].element;
                this._showHighlight('airteam',
                 [element.geometry.x, element.geometry.y], element);
                // this指向监听时的context变量
                const opts = {
                    rescueid: element.id,
                  };
                this.service.getDetailInfo(opts).then((res: any) => {
                    (res as any).id = element.id;
                    this.addPopup(res, [element.geometry.x, element.geometry.y], false);
                });
            },
        },
        this.simpleRenderMgr.add(opt11);
    },

     /**
     * 隐藏对应级别的数据
     * @param levelArr 烈度级别数组
     */
    hideResource(levelArr: any[]) {
        // todo
        // 地图清除烈度数组对应范围内的数据
        this.simpleRenderMgr.remove('airteam');
        // this._fitMap();
    },
    locateEvent(opts: any) {
        const coordinates: any =  [ parseFloat(opts.x), parseFloat(opts.y)];
        if (G.utils.CoordUtil.withinChina(coordinates, 4326)) {
            const geom = {
                type: 'Point',
                coordinates,
            };
            const pointdata: any = {
                type: 'geojson',
                geom,
            };
            this.featureLocate.fit(pointdata, { maxZoom: this.map.getZoomLevel()});
            this.addPopup(opts, [geom.coordinates[0], geom.coordinates[1]]);
            const element: any = this.simpleRenderMgr.getLayer('airteam').find(opts.id);
            this._showHighlight(opts.eventType, geom.coordinates, element);
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
        this.closePopup();
        const layer = this.simpleRenderMgr.getLayer('airteam');
        for ( const k of layer.elements) {
                if (k.id === data.id) {
                    const coor = [k.geometry.x, k.geometry.y];
                    this._showHighlight('', coor, '');
                }
            }
        this.popupManager.addSimple({
            id: this.options.popupId,
            // anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: '',
            autoPan: !noneMouseClick,
        }).then((content: any) => {
            this.fire(this.options.fireAddPopupEventId, {
                data,
                type: 'airteamPopup',
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
        const opts = {
            rescueid: id,
          };
        this.service.getDetailInfo(opts).then((data: any) => {
            (data as any).id = id;
            this.addPopup(data, null, true);
        });
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
    },
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this.hideHighlight();
    },

    _clearLayers() {
        // todo
        this.simpleRenderMgr.remove('airteam');
    },
    _showHighlight(eventType: string, coordinate: any, element: any) {
        // const data: any =  Util.attributeSet2Object(element.attributeSet) ;
        const symbolMapper: any = SymbolMap.AIRTEAM;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons.Airteam_img_hover;
        const options = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [ parseFloat(coordinate[0]), parseFloat(coordinate[1])],
                },
            },
            style: symbolObj,
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
        const layer = this.simpleRenderMgr.getLayer('airteam');
        const arr = [];
        for ( const i of array) {
            for ( const k of layer.elements) {
                for ( const m of k.attributeSet.attributes) {
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
