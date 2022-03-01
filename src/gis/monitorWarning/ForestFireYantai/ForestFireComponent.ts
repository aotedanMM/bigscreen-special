// import Service from '../../../service/ServiceFactory';
import FireUtil from './FireUtil';
import server from '@/api/feature/forestFireModuleYantai/installForestFireServer';
const wildlandFireServer = server.wildlandFireServer;
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  options: {
    bufferName: 'ForestFireBuffer',
    isolation: 'isolationDrawEnd',
    drawFire: 'drawFire',
    currentIndex: 0,
  },
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.featureHighlight = options.GISComponents.featureHighlight;
    this._initializePointDrawCommand();
    // 临时增加 定位至佛山
    // setTimeout(() => {
    //     this.panTo();
    // }, 2500);
  },

  /**
   * 初始化地图标点命令
   */
  _initializePointDrawCommand() {
    const self = this;
    const srid = 4326;

    /**
     * 线模板
     */
    // onst path = new g2.sfs.Path({ spatialReference: this.map.getSrid() });
    // path.addPoint(startPoint);
    // path.addPoint(endPoint);
    // const polyline = new g2.sfs.Polyline({
    //     spatialReference: this.map.spatialReference,
    // });

    // 构建一个空的线对象
    const gsLineSymbol = new g2.sfs.SimpleLineSymbol({ color: new g2.sfs.Color({ a: 153, b: 200, g: 0, r: 19 }), width: 8 });
    const path = new g2.sfs.Path({ spatialReference: srid });
    const polyline = new g2.sfs.Polyline({ spatialReference: srid });
    polyline.addGeometry(path);
    const polylineEle = new g2.sfs.Element({ geometry: polyline, symbol: gsLineSymbol });

    /**
     * 面模板
     */
    const ring = new g2.sfs.Ring({ spatialReference: srid });
    ring.addPoint(new g2.sfs.Point({ x: 1, y: 3, spatialReference: srid }));
    ring.addPoint(new g2.sfs.Point({ x: 2, y: 5, spatialReference: srid }));
    ring.addPoint(new g2.sfs.Point({ x: 0, y: 0, spatialReference: srid }));
    ring.addPoint(new g2.sfs.Point({ x: 0, y: 0, spatialReference: srid }));

    const polygon = new g2.sfs.Polygon({ spatialReference: srid });
    polygon.addGeometry(ring);

    const simpleFillSymbol = new g2.sfs.SimpleFillSymbol({
      fillColor: new g2.sfs.Color({ a: 155, r: 0, g: 0, b: 255 }),
    });

    const polygonEle = new g2.sfs.Element({
      geometry: polygon, // 加入几何图形
      symbol: simpleFillSymbol, // 加入符号样式
    });

    // 创建标绘图层
    const plotLayer = new g2.carto.CanvasLayer({
      controlSymbol: new g2.sfs.SimpleMarkerSymbol(), // 控制点符号
      centerSymbol: new g2.sfs.SimpleMarkerSymbol(), // 中心点符号
      rotateSymbol: new g2.sfs.SimpleMarkerSymbol(), // 旋转符号
      middleSymbol: new g2.sfs.SimpleMarkerSymbol(), // 中心点符号
      rotatelineSymbol: new g2.sfs.SimpleLineSymbol(), // 旋转线颜色
    });

    this.map.addLayer(plotLayer);

    // 创建标绘图层
    const plotSaveLayer = new g2.carto.ElementLayer({
      id: 'plotSaveLayer',
      name: 'plotSaveLayer',
    });

    this.map.addLayer(plotSaveLayer);
    this.plotLayer = plotSaveLayer;

    // 创建标绘图层
    const networkLayerOpts = {
      id: 'networkLayer',
      name: '路径分析图层',
      zIndex: 26,
      opacity: 1.0, // 透明度
      visible: true, // 是否显示
    };
    const plotLayerPoint = new g2.carto.ElementLayer(networkLayerOpts);

    this.map.addLayer(plotLayerPoint);
    this.plotLayer_point = plotLayerPoint;
    const commandManager = new (window as any).egis.gdm.CommandManager();
    // 创建命令通知器，用于命令之间的相互通知
    const commandNotify = new (window as any).egis.gdm.CommandNotify({
      manager: commandManager,
    });
    this.commandNotify = commandNotify;
    /**
     * 构建 标绘命令
     */
    const freePolyLine = new g2.plot.PlotTool({
      id: 'freePolyLine', // 标绘的ID
      drawTemplate: polylineEle, // 标绘的模板
      algorithm: new g2.plot.PolylineAlgorithm(), // 标绘算法
      activeCommandName: 'NoopTool',
      elements: [polylineEle], // 标绘符号element数组
      name: '自由线标绘', // 标绘符号名称
      plotLayer, // 标绘图层
    });
    this.polyline = freePolyLine;
    const freePolygon = new g2.plot.PlotTool({
      id: 'freePolygon', // 标绘的ID
      drawTemplate: polygonEle, // 标绘的模板
      algorithm: new g2.plot.FreePolygonAlgorithm(), // 标绘算法
      elements: [polygonEle], // 标绘符号element数组
      name: '自由面标绘', // 标绘符号名称
      plotLayer, // 标绘图层
    });
    freePolyLine.onEndDraw = function(ele: any) {
      commandNotify.activeCommand('NoopTool');
      ele.elements[0].id = self.options.plotIndex;
      self.plotLayer.add(ele.elements[0]);
      plotLayer.clear();
      const geo = ele.elements[0].geometry;
      const level = Math.round(this.map.getZoomLevel());
      self._addBuffer(geo, 800 / level);
    };
    freePolygon.onEndDraw = function(ele: any) {
      commandNotify.activeCommand('NoopTool');
      ele.elements[0].id = self.options.plotIndex;
      self.plotLayer.add(ele.elements[0]);
      plotLayer.clear();
      const geo = ele.elements[0].geometry;
      let data: any = [];
      geo.asGeoJson().coordinates[0].forEach((value: any) => {
        data = data.concat(value);
        data.push(0);
      });
      data.unshift(4326);
      self.fire(self.options.isolation, data);
    };
    const nooptool = new g2.interact.NoopTool({
      id: 'NoopTool',
      cursor: 'pointer',
    });

    // 创建一个空的点对象
    const point = new g2.sfs.Point({
      spatialReference: this.map.spatialReference,
    });
    // 创建一个空的点对象
    const markerSymbol = new g2.sfs.SimpleMarkerSymbol({
      offsetX: 0,
      offsetY: 0,
      fillColor: new g2.sfs.Color({ a: 255, r: 0, g: 0, b: 0 }),
      size: 6,
    });
    // 构造一个空的点元素对象
    const pointElement = new g2.sfs.Element({
      geometry: point,
      symbol: markerSymbol,
    });
    /**
     * 构建点标绘的命令
     * @param id 标绘的ID，要与界面的绑定保持一致
     * @param drawTemplate 标绘的模板
     * @param algorithm  符号标绘算法
     * @param elements   标绘符号element数组
     * @param name   标绘符号名称
     * @param plotLayer  标绘图层
     * @returns {*}
     */
    const pointPlot = new g2.plot.PlotTool({
      id: 'pointPlot_fire', // 标绘的ID
      drawTemplate: pointElement, // 标绘的模板
      algorithm: new g2.plot.PointAlgorithm(), // 标绘算法
      elements: [pointElement], // 标绘符号element数组
      name: '点', // 标绘符号名称
      plotLayer: plotLayerPoint, // 标绘图层
    });
    pointPlot.onEndDraw = function(plotElement: any) {
      commandNotify.activeCommand('NoopTool');
      const id = 'firePoint';
      if (self.plotLayer_point.contains(id)) {
        self.plotLayer_point.remove(self.plotLayer_point.find(id));
      }

      self.plotLayer_point.remove(plotElement);
      self.featureHighlight.removeHighlight('firePoint');
      const opts = {
        x: plotElement.elements[0].geometry.x,
        y: plotElement.elements[0].geometry.y,
      };
      self._showFirePoint(opts);
      const parama = {
        x: plotElement.elements[0].geometry.x,
        y: plotElement.elements[0].geometry.y,
        address: '',
      };
      self.fire('getAddress', parama);
    };
    // // 先取消上一个编辑
    // if (this.plotEditTool) {
    //     this.plotEditTool.deactivate();
    //     this.plotEditTool = null;
    // }
    // const plotEditTool = new g2.plot.PlotEditTool({
    //     id: 'plotEditTool',
    //     layer: this.networkLayer,
    // });
    // this.plotEditTool = plotEditTool;

    // 将命令放到命令管理中统一管理
    commandManager.add(freePolyLine);
    commandManager.add(freePolygon);
    commandManager.add(pointPlot);
    commandManager.add(nooptool);
    // this.options.commandManager3D.add(plotEditTool);
    // 标绘编辑采用的选中绘制集合
    const graphicSet = new g2.carto.GraphicSelectionSet();
    // 命令构造器
    commandManager.onCreate({
      map: this.map,
      commandNotify,
      graphicSelectionSet: graphicSet,
      spatialRef: {
        srid: this.map.getSrid(),
      },
    });
  },

  _initBuffer(radius: number) {
    if (!this.bufferlayer) {
      this.bufferlayer = new g2.carto.ElementLayer({
        id: 'buffer',
        name: 'buffer',
      });
      this.map.addLayer(this.bufferlayer);
    }
  },
  _initHighBuffer(radius: number) {
    if (!this.bufferlayerHigh) {
      this.bufferlayerHigh = new g2.carto.ElementLayer({
        id: 'bufferHigh',
        name: 'bufferHigh',
      });
      this.map.addLayer(this.bufferlayerHigh);
    }
  },
  _addBuffer(geo: string, radius: number) {
    if (!!geo && !!radius) {
      this._initBuffer();
      const topoFillSymbol = new g2.sfs.SimpleFillSymbol({
        fillColor: new g2.sfs.Color({ a: 155, r: 0, g: 0, b: 255 }),
      });
      const TopoOperation = new g2.sfs.TopoOperation({
        projectService: new g2.sfs.CoordinateTransform(),
      });
      const bufferGeom = TopoOperation.buffer(geo, radius);
      const bufferElement = new g2.sfs.Element({
        geometry: bufferGeom,
        symbol: topoFillSymbol,
        id: this.options.plotIndex,
      });
      this.bufferlayer.add(bufferElement);
      let da: any[] = [];
      bufferGeom.asGeoJson().coordinates[0].map((value: any) => {
        da = da.concat(value);
        da.push(0);
      });
      da.unshift(4326);
      this.fire(this.options.isolation, da);
    }
  },
  _HighBuffer(geo: string, radius: number) {
    if (!!geo && !!radius) {
      const srid = 4326;
      this._initHighBuffer();
      const gsLineSymbol = new g2.sfs.SimpleLineSymbol({ color: new g2.sfs.Color({ a: 153, b: 200, g: 0, r: 19 }), width: 11 });
      const polylineEle = new g2.sfs.Element({ geometry: geo, symbol: gsLineSymbol });
      this.bufferlayerHigh.add(polylineEle);
    }
  },
  removeBuffer(index: number) {
    if (this.bufferlayerHigh) {
      this.bufferlayerHigh.clear();
    }
    if (this.bufferlayer) {
      this.bufferlayer.remove(this.bufferlayer.get(index));
    }
    if (this.plotLayer) {
      this.plotLayer.remove(this.plotLayer.get(index));
    }
  },
  clearHighLight() {
    if (this.bufferlayerHigh) {
      this.bufferlayerHigh.clear();
    }
  },
  clearPoint() {
    this.featureHighlight.clearHighlight();
  },
  highLightBuffer(index: number) {
    if (this.bufferlayerHigh) {
      this.bufferlayerHigh.clear();
    }
    if (this.bufferlayer) {
      const ele = this.bufferlayer.get(index);
      const level = Math.round(this.map.getZoomLevel());
      if (level > 11) {
        this._HighBuffer(ele.geometry, 800 / level);
      } else if (level >= 9 && level <= 11) {
        this._HighBuffer(ele.geometry, 2500 / level);
      } else if (level <= 9) {
        this._HighBuffer(ele.geometry, 4000 / level);
      }

    }
  },
  clear_analyze_result() {
    if (this.bufferlayer) {
      this.map.removeLayer(this.bufferlayer);
    }
    this.plotLayer.clear();
  },
  load() {
    componentBase.prototype.load.call(this);
  },
  unload() {
    componentBase.prototype.unload.call(this);
    this.clear_analyze_result();
    this.plotLayer_point.clear();
    if (this.imgLayer) {
      this.map.removeLayer(this.imgLayer);
    }
  },

  panTo(point: any) {
    // 现在默认写死佛山
    const envelope = new g2.sfs.Envelope({
      spatialReference: g2.sfs.EnumSpatialReference.EPSG4326, // 坐标系
      minx: 111.18531353144309,
      maxx: 114.8771397788154,
      miny: 22.30811545160713,
      maxy: 23.91288116663364,
      minz: 0,
      maxz: 0,
    });
    this.map.camera.setView(envelope);
  },

  /**
   * 展示或者隐藏火点图标
   * @param visible 可见性
   */
  show_hide_firepoint(visible: boolean) {
    const imgLayer = this.map.findLayer('sh_Layer');
    if (imgLayer) {
      this.map.removeLayer(imgLayer);
    }
  },
  _showFirePoint(item: any) {
    const self = this;
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + item.x + ' ' + item.y + ')',
      },
      style: {
        type: 'Custom',
        options: {
          // 自定义dom结构
          content: '<div id=\'firePoint\'><img src=\'./imgs/firePoint.gif\'/></div>',
          offsetx: -17,
          offsety: -46,
        },
      },
    };
    self.featureHighlight.addHighlight('firePoint', options);
  },
  /**
   * 显示预置的起火点
   * @param array geometry array
   */
  add_fire_point(array: any[]) {
    // debugger
    if (array && array.length > 0) {
      this.show_hide_firepoint(true);
      this.plotLayer_point.clear();
      const point = new g2.sfs.Point({
        spatialReference: g2.sfs.EnumSpatialReference.EPSG4326,
        x: array[0],
        y: array[1],
      });
      const pictureMarkerSymbol = new g2.sfs.PictureMarkerSymbol({
        source: this.options.symbolConfig.icons.sjc_jb,
        width: 40,
        height: 40,
        offsetX: 20,
        offsetY: 40,
        opacity: 1,
        rotation: 0,
      });
      // 构造一个空的点元素对象
      const pointElement = new g2.sfs.Element({
        geometry: point,
        symbol: pictureMarkerSymbol,
      });
      this.plotLayer_point.add(pointElement);
    }
  },
  addIsolation(list: any[]) {
    if (list && list.length > 0) {
      list.forEach((element: any, index: number) => {
        const geoJson = FireUtil.geoJson_parser('polygon', element);
        const polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(
          geoJson,
          4326,
        );
        const simpleFillSymbol = new g2.sfs.SimpleFillSymbol({
          fillColor: new g2.sfs.Color({ a: 155, r: 0, g: 0, b: 255 }),
        });
        const polygonEle = new g2.sfs.Element({
          geometry: polygon, // 加入几何图形
          symbol: simpleFillSymbol, // 加入符号样式
          id: index,
        });
        this.plotLayer.add(polygonEle);
      });
    }
  },

  draw_isolation(type: string, index: number) {
    this.options.plotIndex = index;
    switch (type) {
      case 'line':
        const ele = this._createNewPolyline();
        this.polyline.drawElement.elements = [ele];
        this.commandNotify.activeCommand('freePolyLine');
        break;
      case 'polygon':
        this.commandNotify.activeCommand('freePolygon');
        break;
    }
  },
  _createNewPolyline() {
    const srid = 4326;
    const gsLineSymbol = new g2.sfs.SimpleLineSymbol({ color: new g2.sfs.Color({ a: 153, b: 200, g: 0, r: 19 }), width: 8 });
    const path = new g2.sfs.Path({ spatialReference: srid });
    const polyline = new g2.sfs.Polyline({ spatialReference: srid });
    polyline.addGeometry(path);
    const polylineEle = new g2.sfs.Element({ geometry: polyline, symbol: gsLineSymbol });
    return polylineEle;
  },
  draw_point() {
    if (this.plotLayer_point) {
      this.plotLayer_point.clear();
      this.plotLayer_point.setVisible(true);
    }
    this.commandNotify.activeCommand('pointPlot_fire');
  },
  /**
   * 分析
   * @param {Object} opts 分析参数
   * @param {string} opts.location 火源位置的中文地名
   * @param {Array} opts.sourceInfo 火源信息
   * @param {Object} opts.sourceInfo.fireSourceInfo 火源点位信息
   * @param {String}opts.sourceInfo.fireSourceInfo.startTime 着火时间 e.g. yyyy-MM-dd HH:mm:ss.fff    1900-00-00 00:00:00.000
   * @param {}opts.sourceInfo.fireSourceInfo.
   */

  analyze(opts: any) {
    return new Promise((resolve: any, reject: any) => {
      // opts = {
      //     location: '广东.佛山',
      //     weatherInfo: {
      //         windInfo: {
      //             windArr: [
      //                 {
      //                     windType: '东北风',
      //                     windSpeed: 6,
      //                     windStartTime: '2017-10-10 12:30:30.000',
      //                     windLast: 36000,
      //                 },
      //                 {
      //                     windType: '西风',
      //                     windSpeed: 7,
      //                     windStartTime: '2017-10-10 15:30:30.000',
      //                     windLast: 3600,
      //                 },
      //             ],
      //         },
      //     },
      //     analysisTime: 36000,
      //     analysisStep: 3600,
      //     sourceInfo: [
      //         {
      //             startTime: '2017-10-10 14:30:31.000',
      //             fireSourceInfo: {
      //                 geoType: 0,
      //                 geometry: [4326, 112.77736, 22.76297, 0],
      //             },
      //         },
      //     ],
      //     isolationInfo: [
      //         [
      //             4326, 117.644, 35.273, 0, 117.601, 35.216, 0, 117.557, 35.159, 0]
      //     ],
      // };
      const parsedResult: any = {};
      FireUtil.parse(opts, parsedResult);
      wildlandFireServer
        .analysis(JSON.stringify(parsedResult))
        .then((res: any) => {
          if (
            res &&
            res.data &&
            !res.data.Model_Infos.GModel_Fire_Forest.Error_Info
              .Err_Params_Check_Auto
          ) {
            this.savedResult = res.data;
            resolve('分析成功');
          } else {
            reject(
              res.data.Model_Infos.GModel_Fire_Forest.Error_Info
                .Err_Params_Check_Auto,
            );
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  },

  getCase() {
    return new Promise(async (res: any, rej: any) => {
      const data: any = await wildlandFireServer.getCase();
      res(data);
    });
  },

  show_result(index: number) {
    if (index >= 0) {
      const extent = this._generateExtent(index);
      // const png =
      const exTend: any = [112, 32, 125, 41];
      const imgLayer = this.map.findLayer('sh_Layer');
      if (imgLayer) {
        if (!imgLayer.visible) {
          imgLayer.setVisible(true);
        }
        imgLayer.setSource(
          new g2.carto.ImageStatic({
            extent,
            url: this._generateUrl(index),
            opacity: 0.8,
          }),
        );
      } else {
        // 加载图片
        const newImageLayer = this.imgLayer = new g2.carto.ImageLayer({
          id: 'sh_Layer',
          name: '图片图层',
          imageType: 702,
          extent,
          url: this._generateUrl(index),
          opacity: 0.8,
          crossOrigin: null, // 跨域
        });
        this.map.addLayer(newImageLayer);
        newImageLayer.setZIndex(99);
        const extentfull = this._fixEnvelope();
        const extentfulls: any = [
          extentfull.minx,
          extentfull.miny,
          extentfull.maxx,
          extentfull.maxy,
        ];
        this.map.map.getView().fit(extentfulls);
      }
      // this.map.zoomTo(15);
      // const envelope = new g2.sfs.Envelope({
      //     spatialReference: g2.sfs.EnumSpatialReference.EPSG4326, // 坐标系
      //     minx: extent[0],  // x最小值
      //     miny: extent[1],  // y最小值
      //     maxx: extent[2],  // x最大值
      //     maxy: extent[3], // y最大值
      // });
      // this.map.camera.setView(this._fixEnvelope(data));
    }
  },

  _generateUrl(index: number) {
    let base = this.options.serviceConfig.ForestFireModuleServer;
    base += '/output/';
    const routePath =
      G.savedResult.Model_Infos.GModel_Fire_Forest.Result_Info.Indexes.Dir_Info
        .Path_Route;
    const imgName =
      G.savedResult.Model_Infos.GModel_Fire_Forest.Result_Info_Step[index]
        .Raster.Fire_Forest.Attribute.ImageName;
    return `${base}${routePath}${imgName}`;
  },
  _generateExtent(index: number, data: any) {
    return G.savedResult.Model_Infos.GModel_Fire_Forest.Result_Info_Step[index]
      .Raster.Fire_Forest.Extent;
  },
  _fixEnvelope() {
    const center =
      G.savedResult.Model_Infos.GModel_Fire_Forest.Parms_Return.ParmsInfo[
      '112120'
      ][0]['112105']['102204'];
    const x = center[1];
    const y = center[2];
    const envelope = new g2.sfs.Envelope({
      spatialReference: g2.sfs.EnumSpatialReference.EPSG4326, // 坐标系
      minx: x - 0.05, // x最小值
      miny: y - 0.05, // y最小值
      maxx: x + 0.05, // x最大值
      maxy: y + 0.05, // y最大值
    });
    return envelope;
    console.log(envelope);
  },
});
export default component;
