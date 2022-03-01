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
      // pageLayout.paper = {
      //                   name: 'A2',
      //                   landscape: true,
      //               };
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
              this._addPlotOverlays(OldMaplayer, pageLayout);
            }
            pageLayout.addLayer(OldMaplayer); // 只加入标绘图层
            // for (const o of Object.keys(OldMaplayer.elements)) {
            //   const plotElements = OldMaplayer.elements[o];
            //   const plotLayerid = OldMaplayer.id + o || 'plotLayer' + o;
            //   const plotLayer = this._addElementLayer(plotElements, plotLayerid, bbox, (window as any).Newmap); // 加载ElementLayer图层;
            //   pageLayout.addLayer(plotLayer); // 只加入标绘图层
            // }
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
                if (ElementLayer) {
                  pageLayout.addLayer(ElementLayer);
                }
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
  _addPlotOverlays(layer: any, pageLayout: any) {
    const elementLayer: any = new g2.carto.ElementLayer({
      id: layer.id + '_overlay',
      map: (window as any).Newmap,
    });
    if ((window as any).Newmap) {
      (window as any).Newmap.addLayer(elementLayer);
    }
    layer.elements.forEach((element: any) => {
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
        if (layer.id && layer.id === 'FireCarPoints') {
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
              if (featurelayers) {
                this._addLayerToMap(featurelayers, pageLayout, map);
              }
            }
          }
        }
      }
    }
  },
  _addLayerToMap(featurelayers: any, pageLayout: any, map: any) {
    if (featurelayers && featurelayers !== null) {
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
    if (layer.elements) {
      arrData = layer.elements;
      symboltype = arrData[0].symbol.$type;
      pictureSymbol = this._dealCurrencySymbol(symboltype, arrData[0].symbol);
    } else if (layer.features) {
      arrData = layer.features;
      symboltype = layer.featureRenders[0].symbol.$type;
      pictureSymbol = this._dealCurrencySymbol(symboltype, layer.featureRenders[0].symbol);
    }
    for (const i of Object.keys(arrData)) {
      const geometry = arrData[i].geometry;
      if (geometry) {
        geometry.x = geometry.x * 1;
        geometry.y = geometry.y * 1;
        if (geometry.x >= param.bbox.minx && geometry.x <= param.bbox.maxx && geometry.y >= param.bbox.miny && geometry.y <= param.bbox.maxy) {
          const gfeature = new g2.sfs.GFeature({ fields });
          gfeature.setValue('shap', geometry);
          gfeature.setValue('direction', param.id + i);
          gFeatureCollection.add(gfeature);
        }
      }
    }
    if (pictureSymbol) { // 不支持打印textSymbol
      featureLayer.addFeatureCollection(gFeatureCollection);
      const sim = new g2.render.SimpleRenderer({ symbol: pictureSymbol });
      featureLayer.render(sim);
      return featureLayer;
    }
  },
  _addResource(type: any, layer: any, bbox: any, map: any) {
    const param: any = { arrData: layer, id: type, bbox, map };
    const featureLayer = this._createFeatureMarker(param);
    if (featureLayer) {
      return featureLayer;
    }
  },
  // 原图层是element的情况
  _addElementLayer(layer: any, layerid: string, bbox: any, map: any, featurelayername: any, pageLayout: any) {
    const elements = layer.elements;
    if (map && !map.id && elements[0] && elements[0].geometry && elements[0].geometry.$type && elements[0].geometry.$type.indexOf('Point') !== -1 && layer.id !== 'measure-layer' && featurelayername !== '缓冲区' && layerid.indexOf('plot-layer') === -1 && (elements && elements[0] && elements[0].id !== 'bufferDrawTool') && layer.id.indexOf('Project_') === -1) {
      const featureLayer = this._addResource(layerid, layer, bbox, map);
      if (featureLayer) {
        return featureLayer;
      }
    } else {
      const elementLayer = new g2.carto.ElementLayer({
        id: layerid,
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
                    symbols = new g2.sfs.VectorMarkerSymbol(
                      {
                        source: elements[m].symbol.source,
                        width: elements[m].symbol.width || 30,
                        height: elements[m].symbol.height || 30,
                        offsetX: elements[m].symbol.offsetX || 0.5,
                        offsetY: elements[m].symbol.offsetY || 0.5,
                        scale: elements[m].symbol.scale || 1,
                        opacity: elements[m].symbol.opacity || 1,
                        rotation: elements[m].symbol.rotation || 0,
                      });
                  } else {
                    symbols = elements[m].symbol;
                  }
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: symbols });
                } else if (geometryType && geometryType === 'Polygon,http://www.Gs.com') {
                  elementsitem = elements[m];
                } else {
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: elements[m].symbol });
                }
              } else {
                let newsymbol: any;
                if (geometryType && geometryType === 'Point,http://www.Gs.com') {
                  if (geom && geom.x >= bbox.minx && geom.x <= bbox.maxx && geom.y >= bbox.miny && geom.y <= bbox.maxy) {
                    newsymbol = this._dealCurrencySymbol(symboltype, elements[m].symbol);
                    elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: newsymbol });
                  }
                } else if (geometryType && geometryType === 'MultiLineString,http://www.Gs.com') {
                  geom.geometries.forEach((item: any, index: any) => {
                    newsymbol = this._dealCurrencySymbol(symboltype, elements[m].symbol);
                    if (newsymbol) {
                      elementsitem = new g2.sfs.Element({ geometry: item, symbol: newsymbol });
                    }
                  });
                } else if (geometryType && geometryType === 'MultiPolygon,http://www.Gs.com') {
                  if (layer.id.indexOf('Project_') !== -1) {
                    //  continue;
                  }
                  geom.geometries.forEach((item: any, index: any) => {
                    item.close();
                    newsymbol = this._dealCurrencySymbol(symboltype, elements[m].symbol);
                    if (newsymbol) {
                      elementsitem = new g2.sfs.Element({ geometry: item, symbol: newsymbol });
                    }
                  });
                } else {
                  newsymbol = this._dealCurrencySymbol(symboltype, elements[m].symbol);
                  elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: newsymbol });
                }
                // elementsitem = new g2.sfs.Element({ geometry: elements[m].geometry, symbol: newsymbol });
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
    if (symboltype && symboltype === 'CurrencySymbol,http://www.Gs.com') {
      if (symbol.markerSymbol) {
        symbol = symbol;
      } else {
        symbol = symbol;
      }
    } else if (symboltype && symboltype === 'TextSymbol,http://www.Gs.com') {
      symbol = symbol;
    } else {
      symbol = symbol;
    }
    return symbol;
  },
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
          if (baseLayer0 instanceof g2.carto.MVTVectorTileLayer) { // 先屏蔽掉矢量切片图层
            continue;
          } else {
            this._eachBaseLayer(baseLayer0, pageLayout, opts, baseLayers);
          }
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
      let mapLevel: any;
      if (printLayer) {
        if (baseLayers[0].id && baseLayers[0].id === 'image_hd') {
          mapLevel = level + 2;
          if (mapLevel > 20) {
            mapLevel = 21;
          }
          printLayer.printMaxZoom = mapLevel;
          // 谷歌底图加printMaxZoom
          pageLayout.setPrintTransform(true);
          pageLayout.setTransformProj('gjc02');
        } else if (baseLayers[0].id && baseLayers[0].id === 'emap_img') {
          mapLevel = level + 2;
          if (mapLevel > 20) {
            mapLevel = 20;
          }
          printLayer.level = mapLevel;
          pageLayout.setPrintTransform(false);
        } else {
          printLayer.level = level;
          // 非谷歌底图加level
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
