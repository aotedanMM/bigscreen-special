// 人口热力模块
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {},
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.disasterJudgeServer = options.service; // 根据几何类型获取热力点数据,调用getPop方法
    this.simpleRenderMgr = options.simpleRenderMgr;
    this.featureLocate = options.featureLocate;
    //
    this.projectService = new g2.sfs.CoordinateTransform();
    this.measureService = new g2.sfs.MeasureService({
      projectService: this.projectService,
    });
    // 记录地图级别
    this.mapLevel = -1;
  },
  //  销毁
  destroy() {
    this.simpleRenderMgr = null;
    this.disasterJudgeServer = null;
    this.cacheData = false;
    this.featureLocate = null;
    componentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load(geometry: any, isNight: boolean) {
    componentBase.prototype.load.call(this);
    return new Promise(async (resolve, reject) => {
      this._createLayer();
      this.getHeats(geometry, isNight);
      resolve();
    });
  },

  /**
   * 卸载
   */
  unload() {
    this._clear();
    componentBase.prototype.unload.call(this);
  },
  /**
   * 加载更新热力图数据
   */
  getHeats(geometry: any, isNight: boolean = false) {
    // 处理多次调用的结果问题
    const taskId: string = G.utils.CommonUtil.newUUID32();
    this.taskId = taskId;
    return new Promise(async (resolve, reject) => {
      // 每次更新热力图数据时，清空图层
      this._clearLayer();
      await this._getPopData(geometry, isNight);
      if (this.taskId === taskId) {
        this._showPopup();
        resolve();
      }
    });
  },
  /**
   * 创建热力图图层、pop图层
   */
  _createLayer() {
    this._clear();
    // 添加热力图层
    this.heatMapLayers = new g2.carto.HeatMapLayer({
      blur: 1, // 模糊值
      radius: 1, // 圆半径
      id: 'populationLayer',
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], // 颜色数组
      zIndex: 9,
    });
    this.popLayer = new g2.carto.ElementLayer({
      id: 'popLayer',
      name: 'popLayer',
      map: this.map,
    });
    this.map.addLayer(this.heatMapLayers);
    this.map.addLayer(this.popLayer);
    this.popLayer.setVisible(false);
    this.cacheData = false;

    // 初始化
    this.heatMapLayers.setBlur(10);
    this.heatMapLayers.setRadius(5);
    this.popLayer.setVisible(false);

    this.map.listen('resolutionchanged', this.heatMapLayerResolutionchanged, this);
  },
  _clear() {
    this.mapLevel = -1;
    this._clearLayer();
    if (this.heatMapLayers) {
      this.map.removeLayer(this.heatMapLayers);
    }
    if (this.popLayer) {
      this.map.removeLayer(this.popLayer);
    }
    this.map.off('resolutionchanged', this.heatMapLayerResolutionchanged, this);
    //
    //
  },
  _clearLayer() {
    if (this.heatMapLayers) {
      this.heatMapLayers.clear();
    }
    if (this.popLayer) {
      this.popLayer.clear();
    }
    this.cacheData = false;
  },
  // 处理文字图层
  _showPopup() {
    const currentLevel = parseInt(this.map.getZoomLevel(), 10);
    if (currentLevel && currentLevel > 14) {
      this.popLayer.setVisible(true);
    }
  },
  _getPopData(geometry: any, isNight: boolean) {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.cacheData) {
        //
      } else {
        const opts = {
          geometry,
          time: (new Date() as any).format('yyyy年MM月dd日hh时mm分'), // 日期
          isNight,
        };
        // 定位geometry
        // self._location(geometry);
        // 根据几何类型获取热力点数据
        const opt: any = {
          field: 'a.poptotal,a.longitude,a.latitude',
          tableName: '',
          type: '2',
          where: '',
          index: 1,
          group: '',
        };
        opt.alias = 'popheat';
        opt.tableName = isNight ? 'popu_fever_night a' : 'popu_fever a';
        opt.where = 'and 1=1';
        const polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geometry).asWkt();
        opt.polygon = polygon;
        self.disasterJudgeServer.multiuleInterGetData(opt).then((response: any) => {
          self.cacheData = true;
          // 展示热力点数据
          self._dealData(response.data.data);
          resolve(response.data.data);
        });
      }
    });
  },
  _dealData(result: any[]) {
    const self = this;
    const heats = [];
    const popLayers = [];

    for (const item of result) {
      // 创建热力点
      const point = new g2.sfs.Point({
        x: item.longitude,
        y: item.latitude,
        spatialReference: this.map.spatialReference,
      });

      const poptotal: number = item.poptotal || 0;
      const heat = new g2.carto.Heat({
        geometry: point, // 热力点的坐标
        weight: Math.log(poptotal) / 10,
      });
      heats.push(heat);

      const symbol = new g2.sfs.SimpleMarkerSymbol({
        size: 1,
        borderThickness: 1,
        fillColor: new g2.sfs.Color({ alpha: 0, r: 255, g: 255, b: 255 }),
        borderColor: new g2.sfs.Color({ alpha: 0, r: 255, g: 255, b: 255 }),
        offsetX: -10,
        offsetY: 10,
      });

      let text: string = '';
      if (poptotal > 9999) {
        text = String((poptotal / 10000).toFixed(2) + '万');
      } else {
        text = String(poptotal);
      }
      const textSymbol = new g2.sfs.TextSymbol({
        text: text + '人',
        borderColor: new g2.sfs.Color({ alpha: 1, r: 255, g: 255, b: 255 }),
        borderThickness: 3,
        fontSize: 16,
        fontWeight: 700,
        foreground: new g2.sfs.Color({ r: 255, g: 0, b: 0, a: 255 }),
        offsetX: 0,
        offsetY: 0,
      });
      // 复合符号
      const currencySymbol = new g2.sfs.CurrencySymbol({
        markerSymbol: symbol,
        textSymbol,
      });
      const ele = new g2.sfs.Element({
        geometry: point,
        symbol: currencySymbol,
      });
      popLayers.push(ele);
    }
    this._clearLayer();
    // 添加热力点集合
    this.heatMapLayers.addHeats(heats);
    this.popLayer.addElements(popLayers);
    (window as any).map.zoomIn();
    (window as any).map.zoomOut();
  },
  heatMapLayerResolutionchanged() {
    // 只处理整数级别变化，减少缩放时的处理频率
    const mapCurrentZoom: number = Math.round(this.map.getZoomLevel());
    if (mapCurrentZoom !== this.mapLevel && this.heatMapLayers && this.heatMapLayers.visible) {
      console.log('>>>>>>>>>>>>');
      const currentLevel = parseInt(this.map.getZoomLevel(), 10);
      switch (currentLevel) {
        case 3:
          this.blur = 0.2;
          this.radius = 0.1;
          this.popLayer.setVisible(false);
          break;
        case 4:
          this.blur = 0.5;
          this.radius = 0.2;
          this.popLayer.setVisible(false);
          break;
        case 5:
          this.blur = 1;
          this.radius = 0.5;
          this.popLayer.setVisible(false);
          break;
        case 6:
          this.blur = 3;
          this.radius = 1;
          this.popLayer.setVisible(false);
          break;
        case 7:
          this.blur = 5;
          this.radius = 2;
          this.popLayer.setVisible(false);
          break;
        case 8:
          this.blur = 7;
          this.radius = 3;
          this.popLayer.setVisible(false);
          break;
        case 9:
          this.blur = 10;
          this.radius = 5;
          this.popLayer.setVisible(false);
          break;
        case 10:
          this.blur = 15;
          this.radius = 7;
          this.popLayer.setVisible(false);
          break;
        case 11:
          this.blur = 25;
          this.radius = 13;
          this.popLayer.setVisible(false);
          break;
        case 12:
          this.blur = 40;
          this.radius = 25;
          this.popLayer.setVisible(false);
          break;
        case 13:
          this.blur = 60;
          this.radius = 35;
          this.popLayer.setVisible(false);
          break;
        case 14:
          this.blur = 80;
          this.radius = 40;
          this.popLayer.setVisible(true);
          break;
        case 15:
          this.blur = 90;
          this.radius = 55;
          this.popLayer.setVisible(true);
          break;
        case 16:
          this.blur = 110;
          this.radius = 70;
          this.popLayer.setVisible(true);
          break;
        case 17:
        case 18:
          this.blur = 100;
          this.radius = 85;
          this.popLayer.setVisible(true);
          break;
        default:
          this.blur = 3;
          this.radius = 1;
        ///
      }
      this.heatMapLayers.setBlur(this.blur);
      this.heatMapLayers.setRadius(this.radius);
    }
    // 更新地图级别
    this.mapLevel = mapCurrentZoom;
  },
  // 定位
  _location(geometry: any) {
    const data = {
      type: 'geojson',
      geom: geometry,
    };
    this.featureLocate.fit(data, {
      duration: {
        move: 1,
        zoom: 1,
      },
    });
  },
});
export default component;
