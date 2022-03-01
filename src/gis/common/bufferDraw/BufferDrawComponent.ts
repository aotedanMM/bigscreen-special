// 缓冲绘制组件
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        bufferComponent: null,
        bufferId: 'bufferDrawTool',
        bufferEventName: 'buffer',
        buffer: {
            // 缓冲参数
            drag: {
                visible: true,
                style: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        width: 32,
                        height: 20,
                        opacity: 1,
                        rotation: 0,
                    },
                },
            },
            axis: {
                visible: true,
                style: {
                    type: 'SimpleLineSymbol',
                    options: {
                        color: { r: 255, g: 0, b: 0, a: 255 },
                        style: 5,
                        width: 2,
                    },
                },
            },
            label: {
                visible: true,
                position: 'center',
                style: {
                    type: 'TextSymbol',
                    options: {
                        text: '距离',
                        fontFamilyName: '黑体',
                        fontSize: 20,
                        fontWeight: 500,
                        foreground: {
                            r: 255, g: 0, b: 0, a: 255,
                        },
                        borderColor: {
                            r: 150, g: 0, b: 0, a: 255,
                        },
                        borderThickness: 0,
                        rotation: 0,
                        offsetX: 0,
                        offsetY: 10,
                    },
                },
            },
            fill: {
                visible: true,
                style: {
                    type: 'SimpleFillSymbol',
                    options: {
                        borderColor: {
                            a: 255, r: 255, g: 0, b: 0,
                        },
                        fillColor: {
                            a: 13, r: 255, g: 0, b: 0,
                        },
                        borderThickness: 2,
                        style: 5,
                        // opacity: 0.9,
                    },
                },
            },
            draw: {
                visible: true,
                style: {
                    type: 'SimpleFillSymbol',
                    options: {
                        borderColor: {
                            a: 255, r: 51, g: 255, b: 173,
                        },
                        fillColor: {
                            a: 40, r: 144, g: 247, b: 227,
                        },
                        borderThickness: 2,
                        style: 5,
                        opacity: 0.9,
                    },
                },
            },
            close: {
                visible: false,
                style: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        width: 41,
                        height: 41,
                        opacity: 1,
                        rotation: 0,
                        offsetX: 0,
                        offsetY: 0,
                    },
                },
            },
        },
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.PlotComponent = new G.plot.PlotComponent({
            map: this.map,
            layerId: 'buffer_freePolygon_Sector',
            id: 'buffer_freePolygon_Sector',
        });
    },
    /**
     * 加载
     * @param opts
     */
    load(opts: any) {
        this.clear();
        // this.addListeners();
        const options: any = {
            buffer: {},
        };
        for (const key of Object.keys(opts)) {
            options[key] = opts[key];
        }
        for (const key of Object.keys(this.options.buffer)) {
            options.buffer[key] = this.options.buffer[key];
        }
        options.id = this.options.bufferId;
        options.buffer.callback = (bufferGeom: any, radius: any, drag: boolean) => {
            this.fire(this.options.bufferEventName, {
                geometry: bufferGeom,
                radius,
                type: options.type,
            });
            if (!drag) {
                this.fit(bufferGeom);
            }
        };
        if (options.type === 'polygon') { // 多边形
            options.buffer.radius = 0;
            options.buffer.draw = {
                visible: false,
                style: this.options.buffer.draw.style,
            };
            options.buffer.drag = {
                visible: false,
            };
            options.buffer.axis = {
                visible: false,
            };
            options.buffer.label = {
                visible: false,
            };
            options.buffer.close = {
                visible: false,
            };
        }
        this.options.bufferDraw.drawBuffer(options);
    },
    clear() {
        this.SectorGeojson = null;
        this.options.bufferDraw.cancelDraw();
        this.options.bufferDraw.removeBuffer(this.options.bufferId);
        this.PlotComponent.clearPlotElements();
        let polygonlayer = this.map.getLayerById('freePolygon_Sector');
        if (!polygonlayer) {
            polygonlayer = new (g2 as any).carto.ElementLayer({
            map: this.map,
            id: 'freePolygon_Sector',
          });
            this.map.addLayer(polygonlayer);
        }
        polygonlayer.clear();
        this.map.removeLayer(polygonlayer);
        const lengthlayer = this.map.getLayerById('radius_Sector');
        if (lengthlayer) {
            lengthlayer.clear();
            this.map.removeLayer(lengthlayer);
        }
    },
    unload() {
        this.clear();
        this.PlotComponent.cancelPlot();
        this.removeListeners();
    },
    setRadius(radius: any) {
        this.options.bufferDraw.setRadius(radius, this.options.bufferId);
    },
    fit(geometry: any) {
        this.options.featureLocate.fit({
            type: 'geojson',
            geom: geometry,
        });
    },
    addListeners() {
        this.options.bufferDraw.on('error', this.onError, this);
        // this.map.on('mouseup', this.onUpdatePlot, this);
        this.PlotComponent.on(window.G.misc.AppEvents.PLOT_MOUSEUP, this.onUpdatePlot, this);
        this.PlotComponent.on(window.G.misc.AppEvents.PLOT_UPDATED, this._plotCompleteListener, this);
    },
    removeListeners() {
        this.options.bufferDraw.off('error', this.onError, this);
        // this.map.un('mouseup', this.onUpdatePlot, this);
        this.PlotComponent.off(window.G.misc.AppEvents.PLOT_MOUSEUP, this.onUpdatePlot, this);
        this.PlotComponent.off(window.G.misc.AppEvents.PLOT_UPDATED, this._plotCompleteListener, this);
    },
    onError(err: any) {
        this.fire('error', err);
    },
    // 自由绘制面、绘制扇形 type: FreePolygon | Sector
    plotPolygonBytype(type: any) {
        this.clear();
        this.addListeners();
        const self = this;
        const opts: any = {
            callback(res: any) {
                let geojson: any = null;
                if (type === 'FreePolygon') {
                    geojson = res;
                    // const geom = (res.elements && res.elements[0] && res.elements[0].geometry) || null;
                    // geojson = geom ? geom.asGeoJson() : null;
                    geojson = self._bufferGeometry(geojson, 0);
                    self.fire(self.options.bufferEventName, {
                        geometry: geojson,
                        radius: 0,
                        type,
                    });
                    const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(geojson, 4326);
                    self.clear();
                    self.drawPolygon(polygon);
                } else if (type === 'Sector') {
                    geojson = res.elements[0].geometry.asGeoJson();
                    self.SectorGeojson = geojson;
                    self._drawLength(self.PlotComponent.getPlotElements()[0]);
                    self.fire(self.options.bufferEventName, {
                        geometry: geojson,
                        radius: 0,
                        type,
                    });
                }
            },
        };
        opts.symbol = {
            type: 'SimpleFillSymbol',
            options: {
                borderColor: {
                    a: 255, r: 255, g: 0, b: 0,
                },
                fillColor: {
                    a: 13, r: 255, g: 0, b: 0,
                },
                borderThickness: 2,
                style: 5,
                // opacity: 0.9,
            },
        };
        if (type === 'FreePolygon') {
            opts.type = G.plot.TYPES.FreePolygon;
            // this.PlotComponent.plot(opts);
            this.PlotComponent.plotFreeDrawPolygon(opts);
        } else if (type === 'Sector') {
            opts.type = G.plot.TYPES.Sector;
            this.PlotComponent.plot(opts);
        }
        const lyr = this.PlotComponent.getLayer();
        lyr.setZIndex(40);
    },
    drawPolygon(geomes: any) {
        let polygonlayer = this.map.getLayerById('freePolygon_Sector');
        if (!polygonlayer) {
            polygonlayer = new (g2 as any).carto.ElementLayer({
            map: this.map,
            id: 'freePolygon_Sector',
          });
            this.map.addLayer(polygonlayer);
        }
        polygonlayer.clear();
        const areaSymbol = new g2.sfs.SimpleFillSymbol({
            borderColor: new (g2 as any).sfs.Color({a: 255, r: 255, g: 0, b: 0}),
            borderThickness: 2,
            fillColor: new (g2 as any).sfs.Color({ a: 13, r: 255, g: 0, b: 0 }),
            style: 5,
          });
        const polygonEle = new g2.sfs.Element({geometry: geomes, symbol: areaSymbol});
        polygonlayer.add(polygonEle);
        polygonlayer.setZIndex(999);
    },
    onUpdatePlot() {
        const self = this;
        self._drawLength(self.PlotComponent.getPlotElements()[0]);
        if (self.SectorGeojson
            && (JSON.stringify(self.SectorGeojson) !== JSON.stringify(self.PlotComponent.getLayer().elements[0].elements[0].geometry.asGeoJson()))) {
                let geom1 = self.PlotComponent.getLayer().elements[0].elements[0].geometry.asGeoJson();
                geom1 = self._bufferGeometry(geom1, 0);
                self.SectorGeojson = geom1;
                this.fire(this.options.bufferEventName, {
                    geometry: geom1,
                    radius: 0,
                    type: 'Sector',
                });
        }
    },
    // 监听标绘
    _plotCompleteListener(data: any) {
        this._drawLength(this.PlotComponent.getPlotElements()[0]);
        const geojson = data.element.elements[0].geometry.asGeoJson();
        this.fire(this.options.bufferEventName, {
            geometry: geojson,
            radius: 0,
            type: 'Sector',
        });
    },
    _bufferGeometry(geometry: any, radius: number) {
        if (geometry) { // 缓冲解决不规则多边形问题
            const reader = new (jsts as any).io.GeoJSONReader();
            var input = reader.read(geometry);
            input = input.buffer(radius);
            geometry = new (jsts as any).io.GeoJSONWriter().write(input);
        }
        return geometry;
    },
    _getLength(startPoint: any, endPoint: any) {
        // 构造缓冲距离轴线geom
        const path = new g2.sfs.Path({ spatialReference: this.map.getSrid() });
        path.addPoint(startPoint);
        path.addPoint(endPoint);
        const polyline = new g2.sfs.Polyline({
            spatialReference: this.map.spatialReference,
        });
        polyline.addGeometry(path);
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({ projectService });
        const length = measureService.length(polyline);
        return length;
    },
    _drawLength(plotElement: any) {
        let lengthlayer = this.map.getLayerById('radius_Sector');
        if (!lengthlayer) {
            lengthlayer = new (g2 as any).carto.ElementLayer({
                map: this.map,
                id: 'radius_Sector',
            });
            this.map.addLayer(lengthlayer);
        }
        lengthlayer.clear();
        if (!plotElement || !plotElement.plot || !plotElement.plot.controlPoints) {
            return;
        }
        const startPoint = plotElement.plot.controlPoints[0];
        const endPoint = plotElement.plot.controlPoints[1];
        const point = new g2.sfs.Point({
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2,
        });
        const length =  this._getLength(startPoint, endPoint);
        const lengthStr = (length / 1000).toFixed(2) + 'km';
        const textSym = new (g2 as any).sfs.TextSymbol({
            text: lengthStr,
            fontFamilyName: 'Microsoft Yahei',
            fontSize: 18,
            textAlign: 'center',
            textBaseline: 'middle',
            borderThickness: 0,
            textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 24, g: 62, b: 80 }),
            textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 150, r: 55, g: 224, b: 245 }),
            foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
            padding: [2, 10, 2, 10],
        });
        const lengthEle = new g2.sfs.Element({geometry: point, symbol: textSym});
        lengthlayer.add(lengthEle);
        lengthlayer.setZIndex(999);
    },
});
export default component;
