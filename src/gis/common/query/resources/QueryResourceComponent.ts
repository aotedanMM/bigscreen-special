
// 监测预警、承载体、应急资源
import ClusterDistributeLayerComponent from './ClusterDistributeLayerComponent';

const componentBase = (G as any).base.ComponentBase;
const appEvents = (G as any).misc.AppEvents;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        fireAddPopupEventId_house: 'housePopup',
        fireAddPopupEventId_car: 'popup_FireCarPoints',
        fireAddPopupEventId_cd: 'ClusterDistribute_popupEvent', // 添加弹窗后执行事件id
        searchDistrictLayerIds: ['search-district-layer', 'region_border'], // 条件里的行政区划边界图层id
    },

    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.cdLayerComponent = new ClusterDistributeLayerComponent(options);
        this.queryHouseComponent = options.queryHouseComponent;
        this.queryHouseComponent.load();
        // this.queryHouseComponent.on('housePopup', (data: any) => {
        //     jQuery('#house_popup_id').append('<b>省分发付付付付付付付付付付付付付</b>');
        // });

        this.popHeatComponent = options.popHeatComponent;
        this.fireCarHistoryCmponent = options.fireCarHistoryCmponent;
        this.warningInfoServer = options.warningInfoServer;
        this.normalResourceServer = options.normalResourceServer;
        this.resourceanalysisServer = options.resourceanalysisServer;
        this._initEvent();
    },
    _initEvent() {
        const self = this;
        this.removeEvents();
        this.cdLayerComponent.on(self.options.fireAddPopupEventId_cd, (data: any) => {
            self.fire(self.options.fireAddPopupEventId_cd, data);
        });
        this.fireCarHistoryCmponent.on(self.options.fireAddPopupEventId_car, (data: any) => {
            self.fire(self.options.fireAddPopupEventId_cd, data);
        });
        this.fireCarHistoryCmponent.on('carTrackMoveEvent', (data: any) => {
            self.fire('carTrackMoveEvent', data);
        });
        this.queryHouseComponent.on(self.options.fireAddPopupEventId_house, (data: any) => {
            self.fire(self.options.fireAddPopupEventId_cd, data);
        });
    },
    removeEvents() {
        const self = this;
        this.cdLayerComponent.off(self.options.fireAddPopupEventId_cd);
        this.fireCarHistoryCmponent.off(self.options.fireAddPopupEventId_car);
        this.fireCarHistoryCmponent.off('carTrackMoveEvent');
        this.queryHouseComponent.off(self.options.fireAddPopupEventId_house);
    },
    //  销毁
    destroy() {
        this.removeEvents();
        componentBase.prototype.destroy.call(this);
    },

    load() {
        componentBase.prototype.load.call(this);
        //
    },

    clearByType(type: string) {
        switch (type) {
            case '房屋分布': // TODO 编的type
                this.queryHouseComponent.deleteHouseDistr();
                break;
            case '房屋结构': // TODO 编的type
                this.queryHouseComponent.deleteHouseStruc();
                break;
            case 'clsswz': // TODO 编的type
                this.fireCarHistoryCmponent.remove();
                break;
            case '人口热力':
                this.popHeatComponent.unload();
                break;
            default:
                this.cdLayerComponent.clearByType(type);
                break;
        }
    },
    /**
     * 清除数据
     */
    clearData() {
        this.map.fullExtent();
        this.cdLayerComponent.clear(); // 互斥的情况下，先清除再加数据
    },
    geojsonToWkt(geojson: any) {
        const wkt = G.utils.GeometryUtil.getWktWriter().write(G.utils.GeometryUtil.getGeoJSONReader().read(geojson));
        return wkt;
    },
    /**
     * 加载数据
     * @param options.TYPE {String} 大类，如'yujing'或'chengzaiti'或'yingjiziyuan'（预警信息，承灾体，应急资源）
     * @param options.type {String} 类型，如：'11B11'或'floodteam'
     * @param options.geoFilter {Boolean} 是否有几何筛选条件
     * @param options.opts {Object} 查询条件
     * @param options.opts.data {Array} 大部分情况下传数据
     * @param options.opts.geometry {Object} 几何信息（人口热力的情况下）
     * @param options.opts.districtcode {Object} 行政区划（房屋结构的情况下）
     */
    addData(options: any) {
        const TYPE = options.TYPE;
        const type = options.type;
        const opts = options.opts;
        const geoFilter = options.geoFilter;
        console.log(type);
        if (TYPE === 'yujing') {
            // opts.opts.startTime = '2019-08-01 00:00:00';
            this.warningInfoServer.getTypeData(opts.opts).then((res: any) => {
                this.cdLayerComponent.add(TYPE, type, res.data, geoFilter);
            });
        } else {
            switch (type) {
                case '房屋分布': // TODO 编的type
                    this.queryHouseComponent.addHouseDistr();
                    break;
                case '房屋结构': // TODO 编的type
                    this.queryHouseComponent.addHouseStruc(opts.districtCode);
                    break;
                case 'clsswz': // TODO 编的type
                    this.fireCarHistoryCmponent.addPoint(opts.data);

                    break;
                case '人口热力':
                    let geometry: any = opts.geometry || null;
                    if (geometry === null && options.opts.districtCode) {
                        let elements: any = [];
                        for (const layerId of this.options.searchDistrictLayerIds) {
                            const layer: any = G.utils.LayerUtil.getLayerById(this.map, layerId);
                            if (layer && layer.elements.length > 0) {
                                elements = layer.elements;
                                break;
                            }
                        }
                        const geometries: any = [];
                        elements.forEach((ele: any) => {
                            geometries.push(ele.geometry);
                        });
                        geometry = G.utils.SpatialOPUtil.unionGeometry(geometries).asGeoJson();
                    }
                    if (geometry) {
                        this.popHeatComponent.load(geometry);
                    }
                    break;
                default:
                    let geometry1: any = opts.geometry || null;
                    if (geometry1 === null && options.opts.districtCode) {
                        let elements: any = [];
                        for (const layerId of this.options.searchDistrictLayerIds) {
                            const layer: any = G.utils.LayerUtil.getLayerById(this.map, layerId);
                            if (layer && layer.elements.length > 0) {
                                elements = layer.elements;
                                break;
                            }
                        }
                        const geometries: any = [];
                        elements.forEach((ele: any) => {
                            geometries.push(ele.geometry);
                        });
                        geometry1 = G.utils.SpatialOPUtil.unionGeometry(geometries).asGeoJson();
                    }
                    if (geometry1) {
                        this.options.featureLocate.fit({
                            type: 'geojson',
                            geom: geometry1,
                        });
                    } else {
                        const coordinates1: any = [];
                        for (const item of opts.data) {
                            if (item.geom) {
                                coordinates1.push(item.geom.coordinates);
                            }
                        }
                        const geoJson: any = {
                            type: 'MultiPoint',
                            coordinates: coordinates1,
                        };
                        this.options.featureLocate.fit({
                            type: 'geojson',
                            geom: geoJson,
                        });
                        // this.map.fullExtent();
                    }
                    this.cdLayerComponent.add(TYPE, type, opts.data, geoFilter);
                    break;
            }
        }
    },
    unionGeometry(arr: any) {
        return G.utils.SpatialOPUtil.unionGeometry(arr);
    },
    locateToYujingPoint(item: any) {
        this.closePopup();
        const coords = [parseFloat(item.longitude), parseFloat(item.latitude)];
        this.cdLayerComponent.locateToPoint(coords, this.map.getZoomLevel());
        this.cdLayerComponent.addPopup({geometry: { x: item.longitude, y: item.latitude}}, item, 'earlyWarning');
    },
    locateToCYPoint(item: any, type: any) {
        this.closePopup();
        const geometry = {
            x: item.geom.coordinates[0],
            y: item.geom.coordinates[1],
        };
        switch (type) {
            case 'fireCar':
                this.fireCarHistoryCmponent.locate([geometry.x, geometry.y]);
                this.fireCarHistoryCmponent.openPopup(item.gpsid);
                break;
            default:
                this.cdLayerComponent.locateToPoint([geometry.x, geometry.y]);
                this.cdLayerComponent.showHighlight({ geometry }, item, type);
                this.cdLayerComponent.addPopup({ geometry }, item, type);
                break;
        }
    },
    closePopup() {
        this.queryHouseComponent.closePopup();
        this.fireCarHistoryCmponent.closePopup();
        this.cdLayerComponent.clearPopup();
    },
    unload() {
        // this.map.fullExtent();
        this.queryHouseComponent.deleteHouseDistr();
        this.queryHouseComponent.deleteHouseStruc();
        this.popHeatComponent.unload();
        this.fireCarHistoryCmponent.unload();
        this.cdLayerComponent.unload();
        componentBase.prototype.unload.call(this);
        //
    },
});

export default component;
