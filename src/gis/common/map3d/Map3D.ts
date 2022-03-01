const componentBase = (G as any).base.ComponentBase;
const Map3D = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        symbolConfig: null,
        mapConfig: null,
        mapId: null,
        eventInfo: null,
        eventLayer3d: null,
        eventPos: null,
        terrainLayer: null,
        is3D: false, // 当前地图状态
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.eventInfo = options.eventInfo;
        this.symbolConfig = options.symbolConfig;
        //
        this.baseLayers = [];
        // 保存初始显示的地形
        this.terrianLayers2show = {};
        this.dataSource = '';
        const self: any = this;
        this._onMouseMove = async (button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) => {
            if (mapX !== 0 && mapY !== 0) {
                const data: any = {
                    x: mapX,
                    y: mapY,
                };
                data.z = await self.getAltitude([mapX, mapY]);
                self.fire('mousePosition', data);
            }
        };
        this.extentChanged = () => {
            const heading = this.getMap().camera.heading;
            this.fire('map3dextentchanged', heading);
        };
    },
    // 加载
    load() {
        if (!this.isLoaded()) {
            console.debug('初始化三维');
            // 初始化三维地图
            this.initMap();
            this.loaded = true;
        }
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
    },

    addListeners() {
        console.debug('监听三维');
        this.getMap().on('mousemove', this._onMouseMove);
        this.getMap().on('extentchanged', this.extentChanged);
        // this.map.listen(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
    },

    removeListeners() {
        console.debug('取消监听三维');
        this.getMap().un('mousemove', this._onMouseMove);
        this.getMap().un('extentchanged', this.extentChanged);
        // this.map.off(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
    },
    // 清屏事件
    onClearMap() {
        // this.clearMeasureSlope();
        // this.clearVerticalMeasure();
    },
    initMap() {
        const mapConfig3d = this.options.mapConfig.map3d;
        // 创建地图
        const map3D = new g2.carto.Globe(mapConfig3d);
        // map3D._cesiumWidget.scene.globe.depthTestAgainstTerrain = true;
        this.getMap = () => {
            return map3D;
        };
        this.getMap().init({ targetId: this.options.mapId });
        const baseLayer3dTianditu = this.options.mapConfig['baseLayers3d-tianditu'];
        if (Array.isArray(baseLayer3dTianditu)) {
            baseLayer3dTianditu.forEach((item) => {
                if (item.type === 'group') {
                    item.layers.forEach((l: any) => {
                        const layer = new g2.carto.TileLayer3D(l);
                        layer.setVisible(false);
                        this.getMap().addLayer(layer);
                        //
                        this.baseLayers.push(layer);
                    });
                } else {
                    const layer = new g2.carto.TileLayer3D(item);
                    layer.setVisible(false);
                    this.getMap().addLayer(layer);
                    //
                    this.baseLayers.push(layer);
                }
            });
        }
        this.eventLayer3d = new g2.carto.ElementLayer3D({
            id: 'earInfluenceMarkerLayer',
            name: '事件标注图层',
            map: this.getMap(),
        });
        this.getMap().addLayer(this.eventLayer3d);
        // this.initMeasure();
    },

    // 初始化地形
    initDefaultTerrian() {
        const layerName: any = this.options.mapConfig.terrainLayer3d[0].name;
        const layer: any = this.addTerrianLayer(layerName, false);
        if (layer) {
            this.terrianLayers2show[layerName] = layer;
        }
    },

    // 加载地形
    addTerrian(layerName: string) {
        this.removeTerrian();
        this.addTerrianLayer_(layerName, true);
    },

    // 移除地形
    removeTerrian() {
        this.getMap().removeLayer(this.terrainLayer);
    },

    // 添加地形图层
    addTerrianLayer_(layerName: string, addToMap: boolean = true) {
        const terrainOptions = this.options.mapConfig.terrainLayer3d;
        let layer = null;
        const map2d = this.map;
        // const envlope = map2d.getExtent();
        // this.getMap().pan(envlope);
        if (Array.isArray(terrainOptions)) {
            for (const item of terrainOptions) {
                if (item.name === layerName) {
                    layer = new g2.carto.TerrainLayer3D(item);
                    layer.description = item.description;
                    // this.fire('addTerrianLayer', layer);
                    this.dataSource = layer.description;
                    if (addToMap) {
                        this.terrainLayer = layer;
                        this.getMap().addLayer(layer);
                        console.log('发出名字：' + item.description);
                        this.fire('terrainName', { name: item.description });
                        console.log('加载图层成功' + layerName);
                    }
                    break;
                }
            }
        }
        return layer;
    },

    // 移除地形图层
    removeTerrainLayer_(layerName: string) {
        const layer: any = this.getMap().findLayer(layerName);
        if (!!layer) {
            this.getMap().removeLayer(layer);
        }
    },

    // 切换到三维时，同步二维的视野
    syncronizeViewFrom2D() {
        if (!this.is3D) {
            this.load();
            this.addListeners();
            try {
                const mapExtent: any = this.map.getExtent();
                this.getMap().camera.setView(mapExtent);
            } catch (e) {
                console.warn(e);
                this.getMap().fullExtent();
            }
            this.is3D = true;
            this.addEventMarker();
            this.initLayerVisible();
        }
    },

    // 切换到二维时，同步三维的视野
    syncronizeViewFrom3D() {
        if (this.is3D) {
            this.removeListeners();
            // try {
            //     const extent: any = this.getMap().getExtent();
            //     if (extent.minx === -180 && extent.maxx === 180 && extent.miny === -90 && extent.maxy === 90) {
            //         this.map.fullExtent();
            //     } else {
            //         this.map.pan(extent, [0, 0, 0, 0], false);
            //     }
            // } catch (e) {
            //     console.warn(e);
            //     this.map.fullExtent();
            // }
            this.removeTerrian(); // 清除地形图层
            this.is3D = false;
        }
    },
    // 初始化图层显示
    initLayerVisible() {
        for (const layer of this.baseLayers) {
            layer.setVisible(true);
        }
        // for (const layerName of Object.keys(this.terrianLayers2show)) {
        //     const layer: any = this.terrianLayers2show[layerName];
        //     this.getMap().addLayer(layer);
        //     this.terrainLayer = layer;
        // }
        // this.terrianLayers2show = {};
    },
    // 添加事件点标注
    addEventMarker() {
        const self = this;
        if (typeof this.eventInfo.getPoint === 'function') {
            const point = this.eventInfo && this.eventInfo.getPoint();
            if (point) {
                const eventPos = new g2.sfs.Point({
                    x: point[0],
                    y: point[1],
                    z: 0,
                    spatialReference: this.getMap().getSrid(),
                });
                this.getMap().getAltitude([eventPos]).then((points: any[]) => {
                    const evPos = points[0];
                    self.eventPos = evPos;
                    const pictureSymbol = new g2.sfs.PictureMarkerSymbol({
                        source: this.symbolConfig.icons.markPoint,
                        width: 34,
                        height: 34,
                        offsetX: 0,
                        offsetY: 0,
                        opacity: 1,
                        rotation: 0,
                        size: 2,
                    });
                    const eventMaekerElement = new g2.sfs.Element({
                        geometry: evPos,
                        symbol: pictureSymbol,
                    });
                    self.clearEventMarker();
                    self.eventLayer3d.add(eventMaekerElement);
                });
            }
        }
    },

    // 清除事件点标注
    clearEventMarker() {
        this.eventLayer3d.clear();
    },
    // 指北针重置
    headingNorth() {
        this.getMap().camera.heading = 360;
    },
    /**
     *  定位事件点标注
     */
    locateEvent() {
        const camera = this.getMap().camera;
        if (!!this.eventPos) {
            this.eventPos.z += 500;
            camera.flyTo(this.eventPos, 0, -90, 0);
        }
    },

    getAltitude(point: any) {
        return new Promise((resolve, reject) => {
            const position: any = new g2.sfs.Point({
                x: point[0],
                y: point[1],
                z: 0,
                spatialReference: this.getMap().getSrid(),
            });
            this.getMap().getAltitude([position]).then((points: any[]) => {
                const pos: any = points[0];
                resolve(parseFloat(pos.z.toFixed(2)));
            });
        });
    },
});
export default Map3D;

