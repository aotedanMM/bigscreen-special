// 地图下载
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    serverUrl: '',
    progressInterval: 3000,
    progressEventName: 'progress',
    finishEventName: 'finish',
    errorEventName: 'error',
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    this.WMPSService = new g2.ews.RestWMPSService({
      http: new g2.core.RestHttp({ token: 'Bearer d277145' }),
      authType: 'Basic',
      url: this.options.serverUrl,
    });
    this.timer = null;
    this.layoutPapers = null;
    // this.WMPSService.getCapabilities('default').then((data: any) => {
    //   // 获取地图打印所有模板的paper信息
    //   this.layoutPapers = data.layouts;
    // })
  },
  //  销毁
  destroy() {
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   *
   * @param opts
   * @param opts.dpi
   * @param opts.layout
   * @param opts.extent
   * @param opts.outputFormat
   * @param opts.useSuggestedDPI
   * @param opts.producer
   * @param opts.unit
   * @param opts.mapDownLevel
   * @param opts.layerIdSet
   * @param callback
   */
  load(opts: any, callback: any) {
    if (!opts.extent) {
      const extent: any = this.map.getExtent();
      opts.extent = [extent.minx, extent.miny, extent.maxx, extent.maxy];
    }
    opts.mapDownLevel = opts.mapDownLevel === undefined ? this.map.getZoomLevel() : opts.mapDownLevel;
    return this.print(opts, callback);
  },

  /**
   * 卸载
   */
  unload() {
    this._clearTimer();
  },

  /**
   * @param opts
   */
  print(opts: any, callback: any) {
    return new Promise(async (resolve, reject) => {
      this._clearTimer();
      const pageLayout: any = new g2.them.EGISPageLayout({
        defaultExtent: {
          projection: `EPSG:{this.map.spatialReference}`,
        },
        layout: opts.layout,
        dpi: parseInt(opts.dpi, 10),
        map: this.map,
        outputFormat: opts.outputFormat,
        // 是否采用建议DPI，默认为true
        // useSuggestedDPI: opts.useSuggestedDPI,
        // layoutName: opts.layout,
        // producer: opts.producer || '',
        producer: '',
        unit: opts.unit || '应急管理指挥中心',
      });
      // if (this.layoutPapers) {
      //   for (var i = 0; i < this.layoutPapers.length; ++i) {
      //     var layoutObj = this.layoutPapers[i];
      //     // 根据选中的地图打印模板，给EGISPageLayout对象赋值paper属性
      //     if (opts.layout === layoutObj.name) {
      //       pageLayout.paper = layoutObj.paper;
      //       break;
      //     }
      //   }
      // }
      // if (!opts.dpi) {
      //   pageLayout.dpi = pageLayout.getSuggestedDPI();
      // }
      // pageLayout.paper = {
      //   name: opts.layout.split(' ')[0],
      //   landscape: true,
      // }
      this._addLayers(pageLayout, opts);
      if (callback) {
        callback(pageLayout);
      }
      const formatData: any = await pageLayout.format(opts.title, opts.extent);
      // console.log(formatData);
      const createResult: any = await this.WMPSService.create('default', opts.outputFormat, formatData);
      this.timer = setInterval(async () => {
        const status: any = await this.WMPSService.getStatus(createResult.result);
        if (status.result.printJobStatus === 5) {
          this._clearTimer();
          this.fire(this.options.errorEventName, {});
          reject(new Error('打印失败'));
        } else if (status.result.printJobStatus === 2) {
          this._clearTimer();
          const blobData: any = await this.WMPSService.download(createResult.result);
          this._export(blobData, opts.title, opts.outputFormat);
          this.fire(this.options.finishEventName, {});
          resolve();
        }
        this.fire(this.options.progressEventName, {});
      }, this.options.progressInterval);
    });
  },
  /**
  *打印图层
  */
  _addLayers(pageLayout: any, opts: any) {
    const OldMaplayers = (window as any).map.layers;
    const bbox = (window as any).map.getExtent();
    this._addPrintBaseLayer(pageLayout, opts); // 底图
    for (const i of Object.keys(OldMaplayers)) {
      const OldMaplayer = OldMaplayers[i];
      if (OldMaplayer._type && OldMaplayer._type === '_base_layer_tag') {
        continue;
      } else {
        if (OldMaplayer.id === 'superrest' && OldMaplayer._visible) {// 超图
          const level: any = parseInt(opts.mapDownLevel, 10);
          OldMaplayer.printMaxZoom = level;
          pageLayout.addLayer(OldMaplayer);
        }
        if (OldMaplayer._type !== '_base_layer_tag' && OldMaplayer.id && OldMaplayer.id.indexOf('plot-layer') !== -1) {
          if (OldMaplayer.elements && OldMaplayer.elements.length > 0) {
            if (OldMaplayer.id.indexOf('plot-layer') !== -1) {
              this._addPlotOverlays(OldMaplayer, pageLayout, bbox);
            }

            pageLayout.addLayer(OldMaplayer); // 只加入标绘图层
          }
        } else if (OldMaplayer.id && OldMaplayer.id === 'networkLayer') {
          continue;
        } else {
          if (OldMaplayer.groupLayers && OldMaplayer.groupLayers.length > 0) {
            this._addFeatureLayers(OldMaplayer, 'featurelayer' + i, bbox, this.map, pageLayout); // 加载FeatureLayer图层;
          } else if (OldMaplayer.elements && OldMaplayer.elements.length > 0) {
            if (OldMaplayer.id && (OldMaplayer.id === 'popLayer' || OldMaplayer.id === 'populationLayer')) {
              continue;
            } else {
              if (OldMaplayer._visible) {
                const ElementLayerid = OldMaplayer.id + i || 'elementLayer' + i;
                const ElementLayer = this._addElementLayer(OldMaplayer, ElementLayerid, bbox, this.map); // 加载ElementLayer图层;
                pageLayout.addLayer(ElementLayer);
              }
            }
          }
        }
      }
    }
  },
  /**
   * 添加标绘 overlay
   * @param pageLayout
   */
  _addPlotOverlays(layer: any, pageLayout: any, bbox: any) {
    const elementLayer: any = new g2.carto.ElementLayer({
      id: layer.id + '_overlay',
      map: (window as any).Newmap,
    });
    if ((window as any).Newmap) {
      (window as any).Newmap.addLayer(elementLayer);
    }
    layer.elements.forEach((element: any, index: any) => {
      if (element.name && element.name.indexOf('森林火') !== -1) { // 森林火打印特殊处理
        const plotElements = element;
        const plotLayerid = layer.id + 0 || 'plotLayer' + 0;
        const plotLayer = this._addElementLayer(plotElements, plotLayerid, bbox, (window as any).Newmap); // 加载ElementLayer图层;
        pageLayout.addLayer(plotLayer); // 只加入标绘图层
        layer.elements.splice(index, 1); // plot理必须得去掉才行
      } else {
        if (element.kind === 'overlay') {
          const options = JSON.parse(element.overlayAttr);
          const urlstr = options.options.source;
          // if (urlstr.indexOf('.html'))
          // const url = urlstr[0] + '.png';
          const symbolObj = {
            type: 'PictureMarkerSymbol',
            options: {
              source: options.options.base64,
              width: options.options.width,
              height: options.options.height,
              scale: 1,
            },
          };
          const symbol = new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
          const ele = new g2.sfs.Element({
            geometry: new g2.sfs.Point({
              x: options.point.x,
              y: options.point.y,
              spatialReference: 4326,
            }),
            symbol,
          });
          elementLayer.add(ele);
        }
      }
    });
    if (pageLayout) {
      pageLayout.addLayer(elementLayer); // 只加入标绘图层
    }
  },
  /**
 *打印预览其他图层
 */
  _addPrintViewLayer() {
    const OldMaplayers = (window as any).map.layers;
    const mapExtent = (window as any).map.getExtent();
    for (const i of Object.keys(OldMaplayers)) {
      const OldMaplayer = OldMaplayers[i];
      if (OldMaplayer._type && OldMaplayer._type === '_base_layer_tag') {
        continue;
      } else {
        // 房屋分布
        if (OldMaplayer.id && OldMaplayer.id === 'superrest' && OldMaplayer._visible) {
          const resolutions = [0.11883962612831167, 0.059419813064155835, 0.028521510270795945, 0.014260755135397114, 0.0038028680361059733, 0.0036840284099776657, 0.0019014340180529866, 9.507170090264933E-4, 4.7535850451324666E-4, 2.3767925225662333E-4, 1.1883962612831167E-4, 5.941981306415583E-5, 2.8521510270794802E-5, 1.4260755135397401E-5];
          const wmsLayer = new g2.carto.TileLayer({
            id: OldMaplayer.id,
            name: '超图rest服务',
            projection: 'EPSG:4326',
            layerType: 1,
            tileType: 208,
            opacity: 1.0,
            visible: true,
            url: 'http://218.205.198.56:8090/iserver/services/map-ugcv5-guizhou/rest/maps/guizhou',
            extent: [101.2674327562775, 24.46036667854562, 111.90047424331063, 29.34972568123576],
            resolutions,
          });
          // map.addLayer(superRest);
          (window as any).Newmap.addLayer(wmsLayer);
        } else if (OldMaplayer._type !== '_base_layer_tag' && OldMaplayer.id && OldMaplayer.id.indexOf('plot-layer') !== -1) {
          if (OldMaplayer.id.indexOf('plot-layer') !== -1) {
            this._addPlotOverlays(OldMaplayer);
          }
          (window as any).Newmap.addLayer(OldMaplayer); // 只加入标绘图层
        } else if (OldMaplayer.id && OldMaplayer.id === 'networkLayer') {
          continue;
        } else {
          if (OldMaplayer.groupLayers && OldMaplayer.groupLayers.length > 0) {
            this._addFeatureLayers(OldMaplayer, 'featurelayer' + i, mapExtent, (window as any).Newmap, false);
          } else if (OldMaplayer.elements && OldMaplayer.elements.length > 0) {
            if (OldMaplayer.id && (OldMaplayer.id === 'popLayer' || OldMaplayer.id === 'populationLayer')) {
              continue;
            } else {
              if (OldMaplayer._visible) {
                const ElementLayerid = OldMaplayer.id + i || 'elementLayer' + i;
                const ElementLayer = this._addElementLayer(OldMaplayer, ElementLayerid, mapExtent, (window as any).Newmap); // 加载ElementLayer图层;
                (window as any).Newmap.addLayer(ElementLayer);
              }
            }
          }
        }
      }
    }
  },
  /**
   * 带groupLayers
   */
  _addFeatureLayers(layers: any, layerid: string, bbox: any, map: any, pageLayout: any) {
    const groupLayers = layers.groupLayers;
    let featurelayerid = layers.id || layerid;
    let featurelayername = layers.name || '';
    if (groupLayers && groupLayers.length > 0) {// 父级图层
      let featurelayers: any = null;
      for (const i of Object.keys(groupLayers)) {
        const layer = groupLayers[i];
        if (layer.id && (layer.id === 'FireCarPoints')) {
          continue;
        } else {
          if (layer._visible) {
            const itemgroupLayers = layer.groupLayers;
            const elements = layer.elements;
            const features = layer.features;
            if (itemgroupLayers && itemgroupLayers.length > 0) {// 具体图层
              featurelayerid = layers.id + i || layerid;
              featurelayername = layers.name || '';
              for (const j of Object.keys(itemgroupLayers)) {
                const featurelayer = itemgroupLayers[j]; // 分不同图标的图层
                if (featurelayer._visible) {
                  featurelayers = this._addFeatureLayerItem(featurelayer, bbox, featurelayerid, map);
                  this._addLayerToMap(featurelayers, pageLayout, map);
                }
              }
            } else {
              if (elements && elements.length > 0) {
                if (((elements && elements[0] && elements[0].id === 'bufferDrawTool') || featurelayername === '缓冲区') && pageLayout) {
                  featurelayers = this._addElementLayer(layer, featurelayerid, bbox, map, featurelayername, pageLayout); // 加载ElementLayer图层;
                } else {
                  featurelayers = this._addElementLayer(layer, featurelayerid, bbox, map); // 加载ElementLayer图层;
                }
              } else if (features && features.length > 0) {
                featurelayers = layer;
              }
              this._addLayerToMap(featurelayers, pageLayout, map);
            }
          }
        }
      }
    }
  },
  _addLayerToMap(featurelayers: any, pageLayout: any, map: any) {
    if (featurelayers && featurelayers !== null) {
      if (featurelayers.elements && featurelayers.elements.length === 0) {
        return;
      }
      if (pageLayout) {
        pageLayout.addLayer(featurelayers);
      } else {
        map.addLayer(featurelayers);
      }
    }
  },
  _addFeatureLayerItem(featurelayer: any, bbox: any, featurelayerid: any, map: any) {
    const elementLayer = new g2.carto.ElementLayer({ id: featurelayerid, map });
    const sym = featurelayer.featureRenders[0];
    const features = featurelayer.features;
    if (map && !map.id && features[0] && features[0].geometry && features[0].geometry.$type.indexOf('Point') !== -1 && features.length > 0) {
      const featureLayer = this._addResource(featurelayerid, featurelayer, bbox, map);
      return featureLayer;
    } else {
      if (features && features.length > 0) {
        for (const i of Object.keys(features)) {
          let geom: any = null;
          let geomitem: any = null;
          if (features[i].properties[0] && features[i].properties[0].geometry) {
            geom = features[i].properties[0].geometry;
          } else if (features[i].geometry && features[i].geometry) {
            geomitem = features[i].geometry;
          }
          if (geomitem) {
            const ele = new g2.sfs.Element({ geometry: geomitem, symbol: sym.symbol });
            if (geom.x >= bbox.minx && geom.x <= bbox.maxx && geom.y >= bbox.miny && geom.y <= bbox.maxy) {
              elementLayer.add(ele);
            }
          }
        }
      }
      return elementLayer;
    }
  },
  /**
   *重构FeatureLayer
   * @param param
   */
  _createFeatureMarker(param: any) {
    const featureLayer = new g2.carto.FeatureLayer({
      map: param.map,
      id: param.id,
    });
    const fields = new g2.sfs.Fields();
    fields.add(new g2.sfs.Field({ name: 'direction', dataType: 1 }));
    fields.add(new g2.sfs.Field({ name: 'shap', dataType: 102 }));
    const gFeatureCollection = new g2.sfs.GFeatureCollection({
      fields,
    });
    const layer = param.arrData;
    let arrData;
    let symboltype;
    let pictureSymbol;
    let Symbol;
    if (layer.elements) {
      arrData = layer.elements;
      if (param.symbol) {
        Symbol = param.symbol;
        symboltype = param.symbol.$type;

      } else {
        Symbol = arrData[0].symbol;
        symboltype = Symbol.$type;
      }
      // symboltype = arrData[0].symbol.$type;
      pictureSymbol = this._dealCurrencySymbol(symboltype, Symbol);
    } else if (layer.features) {
      arrData = layer.features;
      symboltype = layer.featureRenders[0].symbol.$type;
      pictureSymbol = this._dealCurrencySymbol(symboltype, layer.featureRenders[0].symbol);
    }
    for (const i of Object.keys(arrData)) {
      const geometry = arrData[i].geometry;
      if (geometry) {
        if (geometry.x >= param.bbox.minx && geometry.x <= param.bbox.maxx && geometry.y >= param.bbox.miny && geometry.y <= param.bbox.maxy) {
          const gfeature = new g2.sfs.GFeature({ fields });
          gfeature.setValue('shap', geometry);
          gfeature.setValue('direction', param.id + i);
          gFeatureCollection.add(gfeature);
        }
      }
    }
    featureLayer.addFeatureCollection(gFeatureCollection);
    const sim = new g2.render.SimpleRenderer({ symbol: pictureSymbol });
    featureLayer.render(sim);
    return featureLayer;
  },
  _addResource(type: any, layer: any, bbox: any, map: any, MultiPolygonsymbol: any) {
    const param: any = { arrData: layer, id: type, bbox, map, symbol: null };
    if (MultiPolygonsymbol) {
      param.symbol = MultiPolygonsymbol;
    }
    const featureLayer = this._createFeatureMarker(param);
    return featureLayer;
  },
  // 原图层是element的情况
  _addElementLayer(layer: any, layerid: string, bbox: any, map: any, featurelayername: any, pageLayout: any) {
    const elements = layer.elements;
    if (map && !map.id && elements[0] && elements[0].geometry && elements[0].geometry.$type &&
      elements[0].geometry.$type.indexOf('Point') !== -1 && layer.id !== 'measure-layer' &&
      featurelayername !== '缓冲区' && layerid.indexOf('plot-layer') === -1 &&
      (elements && elements[0] && elements[0].id !== 'bufferDrawTool') && layer.id !== 'districtCountry_border' &&
      layer.id !== 'districtCountry' && layer.id !== 'districtCountry_label' && layer.id !== 'districtHome_border') {
      const featureLayer = this._addResource(layerid, layer, bbox, map);
      return featureLayer;
    } else {
      const elementLayer = new g2.carto.ElementLayer({
        id: layer.id ? layer.id : layerid,
        map,
      });
      if (layer.id && layer.id === 'measure-layer') {
        for (const f of Object.keys(elements)) {
          if (map && map.id && map.id === 'newMap') {
            elementLayer.add(elements[f]);
          } else {
            const sym = elements[f].symbol;
            if (sym && sym.$type && sym.$type.indexOf('SimpleFillSymbol') === -1) {
              elementLayer.add(elements[f]);
            } else {
              const elementM = elements[f];
              const geometryM = elementM.geometry;
              if (geometryM && geometryM.$type && geometryM.$type.indexOf('Polygon') !== -1) {
                const points = geometryM.shell.points;
                let poinwkt = '';
                for (const nn of Object.keys(points)) {
                  const pointitem = points[nn];
                  const poin = pointitem.x * 1 + ' ' + pointitem.y * 1 + ',';
                  poinwkt = poinwkt + poin;
                }
                poinwkt = poinwkt + points[0].x * 1 + ' ' + points[0].y * 1;
                const wkt = 'POLYGON((' + poinwkt + '))';
                const polygon = g2.sfs.GeometryFactory.createGeometryFromWkt(wkt, map.spatialReference);
                const ele = new g2.sfs.Element({
                  geometry: polygon,
                  symbol: elementM.symbol,
                });
                elementLayer.add(ele);
              }
            }
          }
        }
      } else {
        let flagPoint = 0;
        let flagPolyline = 0;
        let flagPolygon = 0;
        let elementsitem;
        for (const m of Object.keys(elements)) {
          const geom = elements[m].geometry;
          const geometryType = geom.$type;
          const symboltype = elements[m].symbol.$type;
          if (map && map.id && map.id === 'newMap') {
            elementsitem = elements[m];
          } else {
            if (((elements && elements[0] && elements[0].id === 'bufferDrawTool') || featurelayername === '缓冲区') && pageLayout) {
              if (geometryType && geometryType === 'Point,http://www.Gs.com') {
                if (flagPoint === 1) {
                  elementsitem = elements[m];
                }
                flagPoint++;
              } else if (geometryType && geometryType === 'Polyline,http://www.Gs.com') {
                if (flagPolyline === 0) {
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: elements[m].symbol });
                }
                flagPolyline++;
              } else if (geometryType && geometryType === 'Polygon,http://www.Gs.com') {
                if (flagPolygon === 0) {
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: elements[m].symbol });
                }
                flagPolygon++;
              }
            } else {
              if (layerid.indexOf('plot-layer') !== -1) {
                if (geometryType && geometryType === 'Point,http://www.Gs.com') {
                  let symbols;
                  if (symboltype && symboltype.indexOf('VectorMarkerSymbol') !== -1) {
                    // symbols = new g2.sfs.VectorMarkerSymbol(
                    //   {
                    //     source: elements[m].symbol.source,
                    //     width: elements[m].symbol.width || 30,
                    //     height: elements[m].symbol.height || 30,
                    //     offsetX: elements[m].symbol.offsetX || 0.5,
                    //     offsetY: elements[m].symbol.offsetY || 0.5,
                    //     scale: elements[m].symbol.scale || 1,
                    //     opacity: elements[m].symbol.opacity || 1,
                    //     rotation: elements[m].symbol.rotation || 0,
                    //   });
                    const symbolObj = { // 森林火
                      type: 'PictureMarkerSymbol',
                      options: {
                        source: 'data:image/png;base64,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',
                        width: elements[m].symbol.width,
                        height: elements[m].symbol.height,
                        offsetX: elements[m].symbol.offsetX || 0.5,
                        offsetY: elements[m].symbol.offsetY || 0.5,
                        scale: elements[m].symbol.scale || 1,
                        opacity: elements[m].symbol.opacity || 1,
                        rotation: elements[m].symbol.rotation || 0,
                      },
                    };
                    symbols = new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
                  } else {
                    symbols = elements[m].symbol;
                  }
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: symbols });
                } else if (geometryType && geometryType === 'Polygon,http://www.Gs.com') {
                  if (elements[m].symbol && elements[m].symbol.$type === 'LineCombinedSymbol,http://www.Gs.com') {
                    elementsitem.symbol = null;
                  }
                  elementsitem = elements[m];
                } else {
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: elements[m].symbol });
                }
              } else {
                let newgeometry;
                const newsymbol = this._dealCurrencySymbol(symboltype, elements[m].symbol);
                if (geometryType && geometryType === 'Point,http://www.Gs.com') {
                  if (geom && geom.x >= bbox.minx && geom.x <= bbox.maxx && geom.y >= bbox.miny && geom.y <= bbox.maxy) {
                    newgeometry = new g2.sfs.Point({
                      x: geom.x * 1,
                      y: geom.y * 1,
                      spatialReference: 4326,
                    });
                    if (newsymbol) {
                      elementsitem = new g2.sfs.Element({ geometry: newgeometry, symbol: newsymbol });
                    }
                    if (elementsitem && elementsitem.symbol) {
                      elementLayer.add(elementsitem);
                    }
                  }
                } else if (geometryType && geometryType === 'MultiPolygon,http://www.Gs.com') {
                  geom.geometries.forEach((item: any, index: any) => {
                    if (newsymbol) {
                      const elementsitemM = new g2.sfs.Element({ geometry: item, symbol: newsymbol });
                      elementLayer.add(elementsitemM);
                    }
                  });
                } else {
                  newgeometry = geom;
                  if (newsymbol) {
                    elementsitem = new g2.sfs.Element({ geometry: newgeometry, symbol: newsymbol });
                  }
                }
              }
            }
          }
          if (elementsitem && elementsitem.symbol) {
            elementLayer.add(elementsitem);
          }
        }
      }

      return elementLayer;
    }
  },
  /**
   * 特殊处理CurrencySymbol，只能加markerSymbol，暂不支持textSymbol打印
   * @param symboltype 符号类型
   * @param elements 对应elements
   * @param newElement 新element变量
   */
  _dealCurrencySymbol(symboltype: any, symbol: any) {
    if (symboltype && symboltype === 'LineCombinedSymbol,http://www.Gs.com') {
      symbol.lineSymbols[0].color = symbol.lineSymbols[1].color;
      // symbol =this._dealCurrencySymbol(Linesymbol.$type,Linesymbol);
      symbol = symbol.lineSymbols[0];
    } else {
      symbol = symbol;
    }
    return symbol;
  },
  /*  if (symbol.textSymbol) {
   symbol = symbol.textSymbol;
 } else  */
  /**
   * 加载打印底图
   * @param pageLayout 需要打印的图层
   * @param opts
   */
  _addPrintBaseLayer(pageLayout: any, opts: any) {
    const baseLayers: any = G.utils.LayerUtil.getBaseLayer(this.map);
    for (const baseLayer of baseLayers) {
      if (baseLayer instanceof g2.carto.GroupLayer) {
        for (const baseLayer0 of baseLayer.groupLayers) {
          this._eachBaseLayer(baseLayer0, pageLayout, opts, baseLayers);
        }
      } else {
        this._eachBaseLayer(baseLayer, pageLayout, opts, baseLayers);
      }
    }
  },
  /**
   * 向pageLayout加每个底图
   * @param layer 底图（子）
   * @param pageLayout 需要打印的图层
   * @param opts
   * @param baseLayers 底图（父）
   */
  _eachBaseLayer(layer: any, pageLayout: any, opts: any, baseLayers: any) {
    const level: any = parseInt(opts.mapDownLevel, 10);
    if ((layer.getVisible && layer.getVisible()) || layer.visible) {
      let printLayer: any = null;
      if (this._isEgisLayer(layer) && !(layer instanceof g2.carto.MBTileLayer)) { // 处理egis底图
        const tempOpts: any = {
          id: layer.id,
          name: layer.name,
          layer: layer.layers,
          matrix: 21,
          matrixSet: layer.matrixSet,
          matrixPrefix: '',
          format: 'tiles',
          projection: 'EPSG:4490',
          layerType: 1,
          tileType: 102,
          opacity: 1.0,
          visible: true,
          crossOrigin: 'anonymous',
          style: 'default',
          extent: { minx: -180, miny: -90, maxx: 180, maxy: 90 },
          wrapX: true,
          url: layer.url,
          clientId: layer.clientId,
          clientSecret: layer.clientSecret,
          newUrl: layer.url,
        };
        printLayer = new g2.carto.MBTileLayer(tempOpts);
      } else {
        printLayer = layer;
      }
      if (printLayer) {
        if (baseLayers[0].id && baseLayers[0].id === 'image_hd') {
          if (layer.id && layer.id === 'guojiexian_gaoqing') {
            printLayer.level = level; // 非谷歌底图加level
          } else {
            printLayer.printMaxZoom = level; // 谷歌底图加printMaxZoom
          }
          pageLayout.setPrintTransform(true);
          // pageLayout.setTransformProj('jgc02');
        } else {
          printLayer.level = level; // 非谷歌底图加level
          pageLayout.setPrintTransform(false);
        }
        pageLayout.addLayer(printLayer);
      }
    }
  },
  /**
  * 打印预览地图图层
  */
  printViewMapLayer(baseLayers: any) {
    this._addPrintViewBaseLayer(baseLayers);
    this._addPrintViewLayer((window as any).Newmap);
  },
  /**
   * 打印预览底图
   */
  _addPrintViewBaseLayer(baseLayers: any, map: any) {
    const baseMapname = $('.mode-img .mode-wrap_text').html();
    for (const i of Object.keys(baseLayers)) {
      if (baseLayers[i].title === baseMapname) {
        const baseLayer = baseLayers[i];
        const layer = G.utils.LayerUtil.createBaseLayer(baseLayer);
        (window as any).Newmap.addLayer(layer);
      }
    }
  },

  _isEgisLayer(layer: any) {
    return layer.url.indexOf('egis/base/v1/wmts') >= 0;
  },
  _clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  _export(data: any, name: any, format: any) {
    const url: any = window.URL.createObjectURL(data);
    const link: any = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name + '.' + format);
    document.body.appendChild(link);
    link.click();
  },
});
export default component;
