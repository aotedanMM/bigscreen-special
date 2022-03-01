// 视频监控组件
import SymbolMap from '../windWaterRainWork/SymbolMap';
import Util from '../../Util';
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    map: null,
    eventInfo: null,
    symbolConfig: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    featureType: 'TerminalLayer', // TerminalLayer
    highLightId: 'TerminalLayerHL', // 高亮id
    popupId: 'TerminalLayer_popup_id', // 弹窗id
    popupEventId: 'TerminalLayer_popup', // 添加弹窗后执行事件id
    TerminalHisTrackLayer: null, // 历史轨迹图层
    TerminalPassLayer: null, // 播放已经走过的轨迹图层
    TerminalLocationLayer: null, // 历史轨迹终端位置图层
    TerminalTrackInterval: null, // 定时器
    isRun: true, // 播放状态
    status: 'add', // 状态
  },
  /**
   * 初始化
   * @param options 参数
   */
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.map = options.map;
    this.symbolConfig = options.symbolConfig;
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.service = options.service;
    this.trackLayer = {};
  },
  /**
   * 加载
   */
  load() {
    componentBase.prototype.load.call(this);
    this.initTerinalLayer('terminal'); // 初始化图层
    this._CreateLineLayer();
  },
  destroy() {
    componentBase.prototype.destroy.call(this);
  },
  // 卸载
  unload() {
    this.clearAll();
    this.clearHistoryLayer();
    componentBase.prototype.unload.call(this);
  },

  /**
   * 新增图层
   * @param opts array
   * @param opts 终端对象
   * @param opts.userName
   * @param opts.orgName
   * @param opts.address: '福山区****街道',
   * @param opts.telnumber: '13503043342', // 电话号码
   * @param opts.longitude: 117,
   * @param opts.latitude: 30,
   * @param opts.userId: '1', // 用户id
   */
  showResource(opts: any, bPan?: boolean) {
    const layer = this.simpleRenderMgr.getLayer(this.options.featureType);
    if (opts.length === 1 && opts[0].checked === false) {
      layer.remove(layer.find(opts[0].userId));
      return;
    }
    layer.clear();
    let symbolMapper: any = null;
    const type = 'terminal';
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj = Util.toJSON(symbolMapper.symbol);
    symbolObj.options.source = this.symbolConfig.icons[symbolMapper.iconFn()];
    if (!layer) {
      return;
    }
    opts.map((item: any) => {
      if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
        const point = new g2.sfs.Point({ x: item.longitude, y: item.latitude });
        const ele = new g2.sfs.Element({
          id: item.userId,
          geometry: point,
          symbol: G.utils.RenderUtil.object2Symbol(symbolObj),
        });
        for (const key of Object.keys(item)) {
          const Attribute = new g2.sfs.Attribute({
            name: key,
            value: item[key],
          });
          ele.attributeSet.add(Attribute);
        }
        layer.add(ele);
      }
    });
    if (bPan) {
      if (opts.length > 1) {
        const arr = [];
        for (const k of layer.elements) {
            for (const m of k.attributeSet.attributes) {
                if (k.geometry.x && k.geometry.y) {
                    const sim = {
                        type: 'wkt',
                        geom: k.geometry.asWkt(),
                    };
                    arr.push(sim);
                }
            }
        }
        this.featureLocate.fit(arr);
      } else {
        this.map.pan(layer.elements[0].geometry);
        this.map.zoomTo(10);
      }
    }
  },
  // 移除元素
  hideResource(opts: any) {
    const layer = this.simpleRenderMgr.getLayer(this.options.featureType);
    if (!layer) {
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      const ele = layer.find(opts.userId);
      layer.remove(ele);
    }
  },
  removeResource() {
    this.options.status = 'remove';
    this.clearAll();
  },
  // 暂停、继续 播放
  paused() {
    if (this.TerminalTrackInterval) {
      this.options.isRun = !this.options.isRun;
    }
  },
  // 重新播放
  restartPlay() {
    this.clearHistoryLayer();
    this.options.isRun = true;
    this.showHistoryTrack();
  },
  getTimeInfo() {
    return new Promise((resolve, reject) => {
      this.service.getHistoricalRoute({ userId: '' }).then((res: any) => {
        const dataArr = res.data;
        resolve(dataArr);
      });
    });
  },
  // 开始播放 显示历史轨迹 opts.userId: 对应用户id
  showHistoryTrack(opts: any) {
    this.service.getHistoricalRoute({ userId: opts.userId }).then((res: any) => {
      const dataArr = res.data;
      this.addTrajectory(dataArr);
    });
  },
  addTrajectory(pointArr: any) {
    this.clearHistoryLayer();
    this.markHisRoute(pointArr);
  },
  // 创建轨迹图层(轨迹，和走过的轨迹)
  _CreateLineLayer() {
    if (!this.map.getLayerById('TerminalHisTrackLayer')) {
      this.TerminalHisTrackLayer = new g2.carto.ElementLayer({
        id: 'TerminalHisTrackLayer',
        name: '历史轨迹图层',
      });
      this.map.addLayer(this.TerminalHisTrackLayer);
    }
    if (!this.map.getLayerById('TerminalPassLayer')) {
      this.TerminalPassLayer = new g2.carto.ElementLayer({
        id: 'TerminalPassLayer',
        name: '历史轨迹走过图层',
      });
      this.map.addLayer(this.TerminalPassLayer);
    }
    if (!this.map.getLayerById('TerminalLocationLayer')) {
      this.TerminalLocationLayer = new g2.carto.ElementLayer({
        id: 'TerminalLocationLayer',
        name: '终端位置',
      });
      this.map.addLayer(this.TerminalLocationLayer);
    }
  },
  // 开始绘制整条轨迹
  markHisRoute(pointArr: any) {
    const self = this;
    const polylineSymbol = new g2.sfs.SimpleLineSymbol({
      width: 6,
      color: new g2.sfs.Color({ a: 255, r: 96, g: 255, b: 96 }),
    });
    const path = new g2.sfs.Path({ spatialReference: 4326 });
    const polyline = new g2.sfs.Polyline({
      spatialReference: this.map.spatialReference,
    });
    if (pointArr.length > 0) {
      pointArr.forEach((ele: any, index: any) => {
        const endPoint = new g2.sfs.Point({
          x: pointArr[index].longitude,
          y: pointArr[index].latitude,
          spatialReference: this.map.spatialReference,
        });
        path.addPoint(endPoint);
        this.map.setCenter(endPoint);
      });
      polyline.addGeometry(path);
      const polylineElement = new g2.sfs.Element({
        id: 'polylineElement',
        geometry: polyline,
        symbol: polylineSymbol,
      });
      this.TerminalHisTrackLayer.add(polylineElement);
      let carindex = pointArr.length - 1;
      this.TerminalTrackInterval = setInterval(() => {
        // 暂停
        if (!this.options.isRun) {
          return;
        }
        if (carindex < 1) {
          clearInterval(self.TerminalTrackInterval);
          return;
        }
        self.ThroughRoute(pointArr[carindex], pointArr[carindex - 1]);
        self.addTerminalLoc(pointArr[carindex - 1]);
        carindex--;
      }, 300);
    }

    // const padding = [100, 100, 100, 100];
    // this.map.pan(polyline, padding);
  },
  // 绘制已经走过的轨迹
  ThroughRoute(point1: any, point2: any) {
    const AlpolylineSymbol = new g2.sfs.SimpleLineSymbol({
      width: 6,
      color: new g2.sfs.Color({ a: 255, r: 255, g: 0, b: 0 }),
    });
    const Point1 = new g2.sfs.Point({
      x: point1.longitude,
      y: point1.latitude,
      spatialReference: this.map.spatialReference,
    });
    const Point2 = new g2.sfs.Point({
      x: point2.longitude,
      y: point2.latitude,
      spatialReference: this.map.spatialReference,
    });
    const Alpath = new g2.sfs.Path({ spatialReference: 4326 });
    const Alpolyline = new g2.sfs.Polyline({
      spatialReference: this.map.spatialReference,
    });
    Alpath.addPoint(Point1);
    Alpath.addPoint(Point2);
    Alpolyline.addGeometry(Alpath);
    const polylineElement = new g2.sfs.Element({
      id: 'polylineElement2',
      geometry: Alpolyline,
      symbol: AlpolylineSymbol,
    });
    this.TerminalPassLayer.add(polylineElement);
  },
  // 添加车辆位置
  addTerminalLoc(data: any) {
    this.TerminalLocationLayer.clear();
    const tmpPoint = new g2.sfs.Point({
      x: data.longitude,
      y: data.latitude,
      spatialReference: this.map.spatialReference,
    });
    const pictureSymbol = new g2.sfs.PictureMarkerSymbol({
      source: 'data:image/png;base64,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',
      width: 48,
      height: 48,
      offsetX: 24,
      offsetY: 24,
      opacity: 1,
      size: 1,
    });
    const pointEle = new g2.sfs.Element({
      geometry: tmpPoint,
      symbol: pictureSymbol,
    });
    this.TerminalLocationLayer.add(pointEle);
    // this.map.setCenter(tmpPoint);
  },
  // 清除图层数据
  clearHistoryLayer() {
    clearInterval(this.TerminalTrackInterval);
    this.options.isRun = true;
    this.TerminalHisTrackLayer.clear();
    this.TerminalPassLayer.clear();
    this.TerminalLocationLayer.clear();
  },
  // 移除高亮
  removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 初始化图层
  initTerinalLayer(type: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.symbolConfig.icons[
          symbolMapper.iconFn()
        ];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType: this.options.featureType,
      featureName: '在线终端图层',
      idField: 'userId',
      list: [],
      type: 0, // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          self.closePopup(); // 关闭弹窗
          self._addHighlight(type, data[0].element);
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(
            element.attributeSet,
          );
          this._addPopup(
            attributeObj,
            [element.geometry.x, element.geometry.y],
            false,
            type,
          );
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['longitude', 'latitude'],
    });
    this.simpleRenderMgr.add(opts);
  },
  _addHighlight(type: any, element: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    symbolObj.options.source = this.options.symbolConfig.icons[
      symbolMapper.iconHlFn()
    ];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: symbolObj,
      blink: {
        enable: false,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },
  _addPopup(data: any, coordinate: any, noneMouseClick: any = true, type: any) {
    this.popupManager
      .addSimple({
        id: this.options.popupId,
        anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
        className: '',
        autoPan: !noneMouseClick,
      })
      .then((content: any) => {
        this.fire(this.options.popupEventId, {
          data,
          containerId: content.containerId,
          id: content.containerId,
          type,
        });
      });
  },
  // 关闭弹窗
  closePopup() {
    // 清除上一次的高亮
    this.removeHighlight();
    this.popupManager.remove(this.options.popupId);
  },
  // 清除所有
  clearAll() {
    this.clearLayers();
    this.closePopup();
  },
  // 清除图层
  clearLayers() {
    this.simpleRenderMgr.remove(this.options.featureType);
  },
});
export default component;
