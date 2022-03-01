

// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        wmsUrl: '', // wms服务地址
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        // do sth
        this.overlayWare = new g2.widget.OverlayWare({
            map: this.map,
        });
        this.list = [];
        this.layers = {};
        // this.simpleRenderMgr = options.simpleRenderMgr;
        // this.simrg = options.GISComponents.
        // this.popupManager = options.popupManager;

    },
    // 添加查询到的影像数据
    load() {
        const locationOps: any = {
            lon: this.options.eventInfo.getPoint()[0],
            lat: this.options.eventInfo.getPoint()[1],
        };
        this.options.service.getImageDatas(locationOps).then((list: any) => {
            this.list = list;
            for (const item of list) {
                console.log('image list:', list);

                this._addTileLayer(item);
            }
            //
            // this._fit(list);
            this._addTransparentImage(list);
        });
        this.options.simpleRenderMgr.on('mouseover', this._onLayerClick, this);
        this.options.simpleRenderMgr.on('mouseout', this._onLayerMouseout, this);
    },
    /**
     * 清除地图叠加的图层和弹窗
     */
    unload() {
        componentBase.prototype.unload.call(this);
        this.removeAll();
        this.overlayWare.clear();
        this.options.simpleRenderMgr.off('mouseover', this._onLayerClick, this);
        this.options.simpleRenderMgr.off('mouseout', this._onLayerMouseout, this);
        this.clearInvisible();
    },
    //  销毁
    destroy() {
        // dosth
        this.unload();
        this.options.tileLayerIds = null;
        this.overlayWare = null;
        componentBase.prototype.destroy.call(this);
    },

    clearInvisible() {
        // this.options.simpleRenderMgr.clearAll();
        if (jQuery('#image_time')) {
            jQuery('#image_time').css('display', 'none');
        }
    },

    addLayer(id: any) {
        this.removeLayer(id);
        for (const item of this.list) {
            if (item.layer_id === id) {
                this._addTileLayer(item);
                break;
            }
        }
    },
    removeLayer(id: any) {
        if (this.layers.hasOwnProperty(id)) {
            const layer: any = this.layers[id];
            this.map.removeLayer(layer);
            delete this.layers[id];
        }
    },
    setVisible(id: any, visible: boolean) {
        if (this.layers.hasOwnProperty(id)) {
            const layer: any = this.layers[id];
            layer.setVisible(!!visible);
        }
    },
    // 清楚所有的影像图层
    removeAll() {
        for (const id of Object.keys(this.layers)) {
            this.removeLayer(id);
        }
        this.layers = {};
    },
    // 添加影像图层
    _addTileLayer(data: any) {
        const layerid = 'TileLayer' + data.layer_id;
        const urlarry = data.layer_url.split('?');
        const dataurl = this.options.wmsUrl.replace('${id}', data.data_id) + '?' + urlarry[1];
        // const dataurl = 'https://service.siweiearth.com/seis/v3/wmts_rest/image_tile/' + data.data_id + '/1/all/GoogleCRS84Quad/{z}/{y}/{x}.png?' + urlarry[1];
        const testLayer = new g2.carto.TileLayer({
            id: layerid,
            name: 'lasted-imgage-' + data.layer_id,
            // "matrix": 22, //"切图级别小于等于切图级别",
            projection: 'EPSG:4326', // "投影参考",
            layerType: 1, // "图层类型",
            tileType: 104, // "瓦片类型",
            opacity: 1.0, // "透明度",
            visible: true, // "是否显示",
            crossOrigin: 'anonymous',
            // "extent":[data.rect_minx,data.rect_miny,data.rect_maxx,data.rect_maxy],
            url: dataurl,
            // "url": "https://service.siweiearth.com/seis/v3/wmts_rest/image_tile/403494/1/all/GoogleCRS84Quad/{z}/{y}/{x}.png?access_token=2874c4143ef72e74d0e01a03f2e29e20&product_id=101"

        });
        this.map.addLayer(testLayer);
        this.layers[data.layer_id] = testLayer;
    },
    // 添加影像图层信息框
    _addTileLayerInfo(layerid: string, point: any, time: string) {
        $('.QH-defendGis #map').append('<div id="' + layerid + '" class="customdislayer" >' +
            '<div class="customdislayerNAMETime">' + time + '</div>' +
            '</div>');
        const anchor = new g2.sfs.Point({
            x: point.x,
            y: point.y,
            spatialReference: this.map.getSrid(),
        });
        const overlay = new g2.widget.OverLay({
            id: layerid,
            offset: [0, 20],
            element: window.document.getElementById(layerid),
            stopEvent: false,
            positioning: 'center-center',
            position: anchor,
        });
        this.overlayWare.add(overlay);
    },
    // 调整视野
    _fit(list: any) {
        // let rect: any = null;
        // for (const item of list) {
        //     const temp: any = new g2.sfs.Envelope({
        //         minx: item.rect_minx,
        //         maxx: item.rect_maxx,
        //         miny: item.rect_miny,
        //         maxy: item.rect_maxy,
        //     });
        //     if (rect === null) {
        //         rect = temp;
        //     } else {
        //         rect = rect.union(temp);
        //     }
        // }
        // const geoJson: any = {
        //     type: 'Polygon',
        //     coordinates: [
        //         [
        //             [rect.minx, rect.miny],
        //             [rect.maxx, rect.miny],
        //             [rect.maxx, rect.maxy],
        //             [rect.minx, rect.maxy],
        //             [rect.minx, rect.miny],
        //         ],
        //     ],
        // };
        // this.options.featureLocate.fit({
        //     type: 'geojson',
        //     geom: geoJson,
        // });
        if (this.options.eventInfo.getMaxRangeGeometry()) {
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: this.options.eventInfo.getMaxRangeGeometry(),
            });
        }
    },

    _addTransparentImage(list: any) {
        const resultList: any = [];
        let polygonArr: any = [];
        for (const item of list) {
            const minrec: any = item.min_rect;
            polygonArr = [];
            for (const coordi of minrec) {
                const tem = [coordi.x, coordi.y];
                polygonArr.push(tem);
            }
            const geoJson: any = {
                geom: {
                    type: 'Polygon',
                    coordinates: [
                        polygonArr,
                    ],
                },
                time: item.image_time,
            };
            resultList.push(geoJson);
        }
        const updateSymbolObj = {
            borderColor: {
                a: 0,
                r: 95,
                g: 234,
                b: 255,
            },
            fillColor: {
                r: 0,
                g: 255,
                b: 255,
                a: 0,
            },
            opacity: 0,
            borderThickness: 5,
            style: 5,
        };
        const updateSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', updateSymbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                return updateSymbol;
            },
        });
        const opts = {
            featureType: 'image',
            featureName: '影响透明边框',
            idField: 'id',
            list: resultList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
                geometryType: 'Polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
    },

    _onLayerClick(features: any) {
        let fea: any;
        let time: any;
        if (features) {
            features.list.forEach((feat: any) => {
                if (feat.featureType === 'image') { fea = feat; }
            });
            if (fea) {
                fea.element.attributeSet.attributes.forEach((element: any) => {
                    if (element.name === 'time') { time = element.value; }
                });
                var dom = document.getElementById('image_time');
                if (!dom) {
                    jQuery('.layoutMain').append('<div class="image_time" id="image_time" style="position: absolute;z-index: 1000;color: white;font-size: 30px;background: #ebeef573; left: 36%; bottom: 10%;">影像最新时间：' + time + '</div>');
                    dom = document.getElementById('image_time');
                } else {
                    dom.innerHTML = '影像最新时间：' + time;
                    jQuery('#image_time').css('display', 'block');
                }
            } else {
                jQuery('#image_time').css('display', 'none');
            }
        } else {
            jQuery('#image_time').css('display', 'none');
        }
    },

    _onLayerMouseout(event: any) {
        if (jQuery('#image_time')) {
            jQuery('#image_time').css('display', 'none');
        }
    },

});
export default component;
