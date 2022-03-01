// 灾情研判指挥调度
import Util from '../../Util';
import SymbolMap from './SymbolMap';
import StyleUtils from './styleUtils';
import publishObjectPath from '@/util/configRegistry';
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    map: null,
    service: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    highLightId: 'WindWaterRainWork', // 高亮id
    popupId: 'WindWaterRainWork_popup_id',
    popupEventId: 'WindWaterRainWork_popup', // 添加弹窗后执行事件id
    status: 'add', // 状态
    isClear: true, // 是否与其他的互斥，默认true 互斥，不同时显示
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    this.map = options.map;
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.symbolConfig = options.symbolConfig;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.featureLocate = options.GISComponents.featureLocate;
    (this.popupManager = options.GISComponents.popupManager),
      (this.service = options.service),
      (this.featureTypeSet = {});
    this.regionCache = {};
    // 创建一个overlayWare
    this.overlayWare = new g2.widget.OverlayWare({
      map: this.map,
    });
  },
  //  销毁
  destroy() {
    this.unload();
    this.simpleRenderMgr = null;
    this.symbolConfig = null;
    this.featureLocate = null;
    this.featureHighlight.clearHighlight();
    this.featureHighlight = null;
    this.featureTypeSet = null;
    this.map.off('resolutionchanged', this._mapResolutionchanged, this);
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load() {
    ComponentBase.prototype.load.call(this);
  },

  /**
   * 卸载
   */
  unload() {
    this._clear();
    this.map.off('resolutionchanged', this._mapResolutionchanged, this);
    ComponentBase.prototype.unload.call(this);
  },
  /**
   * 获取堰闸站点列表
   * @param opts {Object}
   * @param [opts.keyWord] {string} 关键字
   * @param [opts.overThreshold] {boolean} 是否筛选超阈值站点，默认false（全部站点）
   * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
   */
   addResource_monitorstation(opts: any, isClear: boolean = true) {
    // this.options.isClear = isClear;
    this.queryResource('countweirGateWater', opts);
  },
  /**
   * 获取风情站点列表
   * @param opts {Object}
   * @param [opts.keyWord] {string} 关键字
   * @param [opts.overThreshold] {boolean} 是否筛选超阈值站点，默认false（全部站点）
   * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
   */
  addResource_Wind(opts: any, isClear: boolean = true) {
    // this.options.isClear = isClear;
    this.queryResource('wind', opts);
  },
  blankGeom: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 90],
        [180, 90],
        [180, 0],
        [0, 0],
      ],
    ],
  },
  /**
   * 获取雨情站点列表
   * @param opts {Object}
   * @param [opts.keyWord] 关键字
   * @param [opts.level] 告警级别 rain: 暴雨告警; heavyRain: 大暴雨告警; superRain: 特大暴雨告警
   * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
   */
  addResource_Rain(opts: any, isClear: boolean = false) {
    this.options.isClear = isClear;
    this.queryResource('rain', opts);
  },
  /**
   * 获取水情站点列表
   * @param opts {Object}
   * @param [opts.keyWord] 关键字
   * @param [opts.type] 监测站类型 river: 河流监测站; reservoir: 水库监测站
   * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
   */
  addResource_Water(opts: any, isClear: boolean = false) {
    this.options.isClear = isClear;
    if (opts.type[0].type === 'warning') {
      this.GJ = true;
    } else {
      this.GJ = false;
    }
    this.queryResource('water', opts);
  },
  // 河流面板筛选数据上图
  addResource_River(opts: any, isClear: boolean = false) {
    this.options.isClear = isClear;
    this.queryResource('river', opts);
  },
   // 河流面板筛选数据上图
   addResource_Reservoir(opts: any, isClear: boolean = false) {
    this.options.isClear = isClear;
    this.queryResource('reservoir', opts);
  },
  // 大型水库面板筛选上图
   addResource_ReservoirCountdx(opts: any, isClear: boolean = false) {
    //  alert('1');
    // this.options.isClear = isClear;
     this.queryResource('reservoirCountdx', opts);
  },
   // 中型水库面板筛选上图
   addResource_ReservoirCountzx(opts: any, isClear: boolean = false) {
    // this.options.isClear = isClear;
    // alert('2');
    this.queryResource('reservoirCountzx', opts);
  },
   // 小型水库面板筛选上图
   addResource_ReservoirCountxx(opts: any, isClear: boolean = false) {
    // alert('3');
    // this.options.isClear = isClear;
    this.queryResource('reservoirCountxx', opts);
  },
  addResource_Floodvillage(opts: any, isClear: boolean = false) {
    this.options.isClear = isClear;
    this.queryResource('floodvillage', opts);
  },
  /**
   * 获取工情站点列表
   * @param opts {Object}
   * @param [opts.type] 类型 tanta: 坍塌; dianpaizhan: 电排站; chuanzha: 船闸；shuidianzhan: 水电站，shuizha: 水闸，bundpitch：堤防
   * @param [opts.keyWord] 关键字
   * @param {boolean} isClear 是否与其他的互斥，默认true 互斥，不同时显示
   */
  addResource_Work(opts: any, isClear: boolean = true) {
    // this.options.isClear = isClear;
    this.queryResource('work', opts);
  },

  // 移除某一个图层（rain, water, wind, work）
  removeResource(type: any) {
    this.options.status = 'remove';
    const featureType = this._getFeatureInfo(type).featureType;
    this.simpleRenderMgr.remove(featureType);
    this._removeHighlight();
    this.closePopup();
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    if (voronoiLayer) {
      voronoiLayer.clear();
    }
  },
  // 移除所有
  removeAll() {
    this._clear();
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    if (voronoiLayer) {
      voronoiLayer.clear();
      this.map.removeLayer(voronoiLayer);
    }
  },
  /**
   * 列表点击地图定位时调用
   * @param type 类型 | 风情：wind；|雨情：rain；|水情：water；|工情：work；|
   * @param field 字段名称
   * @param value 字段值
   */
  locate(type: any, field: any, value: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    const self = this;
    const layer = this.simpleRenderMgr.getLayer(featureType);
    if (!layer) {
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(
          element.attributeSet,
        );
        if (attributeObj[field] === value) {
          this.map.setCenter({ x: attributeObj.x, y: attributeObj.y });
          this.closePopup(); // 关闭弹窗
          this._addHighlight(type, element);
          const server = self._getService(type);
          if (attributeObj.type === 'shuizha') {
            const opt = {
              resourceKey: 'sluice',
              id: 'ytshuizha_000' + attributeObj.id,
            };
            server.getDetailInfo(opt).then((res: any) => {
              const data = res;
              data.b_type = attributeObj.type;
              this.addPopup(
                data,
                [element.geometry.x, element.geometry.y],
                false,
                type,
              );
            });
          } else {
            if (type === 'countweirGateWater') {
              server
              .getWeirgateDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoir') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoirCountdx') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoirCountzx') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoirCountxx') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'floodvillage') {
              server
              .getFloodvillageDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else {
              server
              .getStationDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            }
          }

          break;
        }
      }
    }
  },

  /**
   * 新增图层
   * @param opts.type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water；|工情：work
   * @param opts.list 数据列表
   */
  _addResource(opts: any) {
    if (this.options.isClear) {
      this._clear();
    }
    if (this.geomPan) {
      this.options.featureLocate.fit({
        type: 'geojson',
        geom: JSON.parse(this.geomPan),
      });
    } else {
      this.map.fullExtent();
    }
    this.optsParams = opts;
    const featureInfo = this._getFeatureInfo(opts.type, opts.list);
    const level = this.map.getZoomLevel();
    if (this.GJ && opts.type === 'water') {
      this._showResourcesOnMapGJ(opts.type, featureInfo);
    } else {
      this._showResourcesOnMap(opts.type, featureInfo);
    }

    // 临时显示图例（对接泰森后删掉这行）
    if (opts.type === 'wind' || opts.type === 'rain') {
      this.fire('RainWindLengend', { type: opts.type, visible: false });
    }
    // 暂时注释掉（泰森多边形需要对接新的）
    // if (opts.type === 'wind' || opts.type === 'rain') {
    //   this._addVoronoi(opts.type);
    //   this.setLayerVisibleBylevel(level);
    //   this.map.listen('resolutionchanged', this._mapResolutionchanged, this);
    // } else if (opts.type === 'water' || opts.type === 'work') {
    //   this.map.off('resolutionchanged', this._mapResolutionchanged, this);
    // }
  },
  /**
   * 搜索方法
   * @param type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water；|工情：work
   * @param opts server服务的参数
   */
  queryResource(type: any, opts: any) {
    // console.log('进来了11', type);
    // console.log('进来了22', opts);
    this.options.status = 'add';
    const self = this;
    const server = this._getService(type);
    let promise: any = null;
    opts.nowPage = 1;
    opts.pageSize = 10000000;
    if (type === 'reservoirCountdx') {
      opts.scalename = '大型';
    } else if (type === 'reservoirCountzx') {
      opts.scalename = '中型';
    } else {
      opts.scalename = '小型';
    }
    if (opts.geometry === '') {
      self.geomPan = null;
    } else if (opts.geometry === JSON.stringify(self.blankGeom)) {
      self.geomPan = null;
    } else {
      self.geomPan = opts.geometry;
    }
    if (type === 'river') {
      promise = server.getRiverStationsList(opts);
    } else if (type === 'countweirGateWater') {
      promise = server.getWeirgateStationsList(opts);
    } else if (type === 'floodvillage') {
      promise = server.getFloodvillageList(opts);
    } else {
      promise = server.getStationsList(opts);
    }
    promise.then((res: any) => {
      const result = res.data;
      const list: any = [];
      result.forEach((item: any) => {
        const obj = {
          _id: item.id,
          longitude: item.x,
          latitude: item.y,
          ...item,
        };
        list.push(obj);
      });
      const param = {
        type,
        list,
      };
      if (self.options.status === 'add') {
        self._addResource(param);
      }
    });
  },
  // 根据type 获取服务
  _getService(type: any) {
    const self = this;
    const service: any = {
      rain() {
        return self.service.rainSituationServer;
      },
      wind() {
        return self.service.windSituationServer;
      },
      water() {
        return self.service.waterSituationServer;
      },
      work() {
        return self.service.engineeringSituationServer;
      },
      countweirGateWater() {
        return self.service.waterSituationServer;
      },
      river() {
        return self.service.waterSituationServer;
      },
      reservoir() {
        return self.service.waterSituationServer;
      },
      reservoirCountdx() {
        return self.service.waterSituationServer;
      },
      reservoirCountzx() {
        return self.service.waterSituationServer;
      },
      reservoirCountxx() {
        return self.service.waterSituationServer;
      },
      floodvillage() {
        return self.service.waterSituationServer;
      },
    };
    const server = service[type]();
    return server;
  },
  // 监听地图等级变化
  _mapResolutionchanged(e: any) {
    const level = this.map.getZoomLevel();
    this.setLayerVisibleBylevel(level);
  },
  // 根据地图等级设置地图显隐（风情和雨情）
  setLayerVisibleBylevel(level: any) {
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    const featureInfo = this._getFeatureInfo(
      this.optsParams.type,
      this.optsParams.list,
    );
    if (level >= 10.5) {
      voronoiLayer.setVisible(false);
      this.simpleRenderMgr.setVisible(featureInfo.featureType, true);
      this.fire('RainWindLengend', {
        type: this.optsParams.type,
        visible: false,
      });
    } else {
      if (this.optsParams.type === 'wind' || this.optsParams.type === 'rain') {
        this.simpleRenderMgr.setVisible(featureInfo.featureType, false);
      }
      voronoiLayer.setVisible(true);
      this.fire('RainWindLengend', {
        type: this.optsParams.type,
        visible: true,
      });
    }
  },

  clearHighlight() {
    this._removeHighlight();
    this.featureHighlight.removeHighlight('gj');
  },

  _clear() {
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
    this.featureHighlight.clearHighlight();
    this.closePopup();
    this._removeHighlight();
  },
  /**
   * 添加数据到图层
   * @param dataCol
   * @param type
   */
  _showResourcesOnMap(type: any, featureInfo: any) {
    const self = this;
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource
      .cluster;
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
          symbolMapper.iconFn(builddata.type, builddata)
        ];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
      buildClusterStyle: (data: any) => {
        return clusterSymbol;
      },
    });
    const opts = {
      featureType: featureInfo.featureType,
      featureName: '防汛防台-风雨水工情图层',
      idField: '_id',
      list: featureInfo.data,
      type: 0, // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        // geometryField: ['geom'],
        // 后端没定义gemo字段，暂时解决
        geometryField: ['x', 'y'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        // 注册点击事件
        click: (data: any) => {
          this.closePopup(); // 关闭弹窗
          self._addHighlight(type, data[0].element);
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(
            element.attributeSet,
          );
          // tslint:disable-next-line:no-empty
          const server = self._getService(type);
          if (attributeObj.type === 'shuizha') {
            const opt = {
              resourceKey: 'sluice',
              id: 'ytshuizha_000' + attributeObj.id,
            };
            server.getDetailInfo(opt).then((res: any) => {
              const data1 = res;
              data1.b_type = attributeObj.type;
              this.addPopup(
                data1,
                [element.geometry.x, element.geometry.y],
                false,
                type,
              );
            });
          } else {
            if (type === 'countweirGateWater') {
              server
              .getWeirgateDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoir') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoirCountdx') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoirCountzx') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoirCountxx') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'floodvillage') {
              server
              .getFloodvillageDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else {
              server
              .getStationDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            }
          }
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['longitude', 'latitude'],
    });
    this.simpleRenderMgr.add(opts);
    // 记录展示的数据类型
    this.featureTypeSet[opts.featureType] = {};
    // 视野定位
    // this._fitBounds(type);
  },

  _showResourcesOnMapGJ(type: any, featureInfo: any) {
    const self = this;
    this.featureHighlight.removeHighlight('gj');
    const feitoubu: any = featureInfo.data;
    const toubu: any = [];
    featureInfo.data.map((item: any) => {
      if (
        item.typeName.indexOf('头顶') !== -1 &&
        item.typeName.indexOf('非头顶') === -1
      ) {
        toubu.push(item);
      } else {
        // feitoubu.push(item);
      }
    });
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource
      .cluster;
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
          symbolMapper.iconFn(builddata.type, builddata)
        ];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
      buildClusterStyle: (data: any) => {
        return clusterSymbol;
      },
    });
    const opts = {
      featureType: featureInfo.featureType,
      featureName: '防汛防台-风雨水工情图层',
      idField: '_id',
      list: feitoubu,
      type: 0, // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        // 注册点击事件
        click: (data: any) => {
          this.closePopup(); // 关闭弹窗
          self._addHighlight(type, data[0].element);
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(
            element.attributeSet,
          );
          // tslint:disable-next-line:no-empty
          const server = self._getService(type);
          if (attributeObj.type === 'shuizha') {
            const opt = {
              resourceKey: 'sluice',
              id: 'ytshuizha_000' + attributeObj.id,
            };
            server.getDetailInfo(opt).then((res: any) => {
              const data1 = res;
              data1.b_type = attributeObj.type;
              this.addPopup(
                data1,
                [element.geometry.x, element.geometry.y],
                false,
                type,
              );
            });
          } else {
            if (type === 'countweirGateWater') {
              server
              .getWeirgateDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'reservoir') {
              server
              .getreservoirDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else if (type === 'floodvillage') {
              server
              .getFloodvillageDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            } else {
              server
              .getStationDetail({ id: attributeObj.id })
              .then((res: any) => {
                for (const key of Object.keys(res.data)) {
                  const val: any = res.data[key];
                  if (val === null || val === undefined) {
                    continue;
                  }
                  attributeObj[key] = res.data[key];
                }
                this.addPopup(
                  attributeObj,
                  [element.geometry.x, element.geometry.y],
                  false,
                  type,
                );
              });
            }
          }
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['longitude', 'latitude'],
    });
    this.simpleRenderMgr.add(opts);
    // 记录展示的数据类型
    this.featureTypeSet[opts.featureType] = {};
    // 视野定位
    // this._fitBounds(type);

    toubu.map((item: any) => {
      const _id = item._id;
      const options = {
        data: {
          type: 'wkt',
          geom: 'POINT(' + item.x + ' ' + item.y + ')',
        },
        style: {
          type: 'Custom',
          options: {
            // 自定义dom结构
            content:
              `<div id='" + _id + "'><img src='./imgs/normal.gif'/></div>`,
            offsetx: -32,
            offsety: -68,
          },
        },
      };
      self.featureHighlight.addHighlight(_id, options);
      $('#' + _id).on('click', (event: any) => {
        toubu.map((item1: any) => {
          if (item1._id === event.target.parentElement.id) {
            self.closePopup(); // 关闭弹窗
            const server = self._getService(type);
            server.getStationDetail({ id: item1.id }).then((res: any) => {
              for (const key of Object.keys(res.data)) {
                const value: any = res.data[key];
                if (value === null || value === undefined) {
                  continue;
                }
                item1[key] = res.data[key];
              }
              this.addPopup(item1, [item1.x, item1.y], false, type);
              const options2 = {
                data: {
                  type: 'wkt',
                  geom: 'POINT(' + item1.x + ' ' + item1.y + ')',
                },
                style: {
                  type: 'Custom',
                  options: {
                    // 自定义dom结构
                    content: `<div><img src='./imgs/hover.gif'/></div>`,
                    offsetx: -25,
                    offsety: -28,
                  },
                },
              };
              self.featureHighlight.addHighlight('gj', options2);
              self.hideGJ = item1._id;
              $('#' + item1._id).hide();
              this.map.pan(
                new g2.sfs.Point({
                  x: item1.x,
                  y: item1.y,
                  spatialReference: this.map.spatialReference,
                }),
              );
              this.map.zoomTo(13);
            });
          }
        });
      });
    });
  },
  // 是否非地图点击触发，点击地图触发时不居中定位 type: rain|wind|water|work
  addPopup(data: any, coordinate: any, noneMouseClick: any = true, type: any) {
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
  // 设置图层名称
  _getFeatureInfo(type: any, data: any) {
    const featureType = 'monitorWarning_' + type;
    if (!data) {
      return {
        featureType,
      };
    }
    const icon = 'monitorWarning_' + type + '_img';
    return {
      featureType,
      data,
      icon,
    };
  },
  // 添加泰森多边形 type:rain wind
  _addVoronoi(type: any) {
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    if (voronoiLayer && voronoiLayer.getCount() < 1) {
      const server = this._getService(type);
      server.getStationsList({}).then((res: any) => {
        const result = res.data;
        const features: any = [];
        result.forEach((ele: any) => {
          const point = turf.point([ele.x, ele.y], ele);
          features.push(point);
        });
        const pointCollection = turf.featureCollection(features);
        if (this.options.status === 'add') {
          this._voronoi(type, pointCollection);
        }
      });
    }
  },
  // 配置泰森多边形颜色
  _setVoronoiSymbol(type: any, properties: any) {
    const areaSymbol = new g2.sfs.SimpleFillSymbol({
      borderColor: new (g2 as any).sfs.Color({
        a: 255,
        r: 205,
        g: 255,
        b: 251,
      }),
      borderThickness: 1,
      fillColor: new (g2 as any).sfs.Color({ a: 51, r: 96, g: 233, b: 255 }),
    });
    const rainLevel: any = {
      无雨: 'level_0',
      小雨: 'level_1',
      中雨: 'level_2',
      大雨: 'level_3',
      暴雨: 'level_4',
      大暴雨: 'level_5',
      特大暴雨: 'level_6',
    };
    let level: any = 'level_0';
    if (type === 'rain' && properties.level && properties.level !== '') {
      level = rainLevel[properties.level];
    } else if (type === 'wind') {
      level = 'level_' + this._getWindLevelByWindSpeed(properties.windSpeed);
    }
    areaSymbol.borderThickness = StyleUtils[type][level].stroke.width;
    const fill = StyleUtils[type][level].fill.split(',');
    const a = parseFloat(fill[3].split(')')[0]) * 255;
    const r = parseInt(fill[0].split('(')[1], 10);
    const g = parseInt(fill[1], 10);
    const b = parseInt(fill[2], 10);
    areaSymbol.fillColor = new (g2 as any).sfs.Color({ a, r, g, b });
    return areaSymbol;
  },
  _getWindLevelByWindSpeed(windSpeed: any) {
    const speed: any = [
      [0, 0.2],
      [0.3, 1.5],
      [1.6, 3.3],
      [3.4, 5.4],
      [5.5, 7.9],
      [8.0, 10.7],
      [10.8, 13.8],
      [13.9, 17.1],
      [17.2, 20.7],
      [20.8, 24.4],
      [24.5, 28.4],
      [28.5, 32.6],
      [32.7, 36.9],
    ];
    const level: any = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < speed.length; i++) {
      if (speed[i][0] <= windSpeed && windSpeed <= speed[i][1]) {
        return level[i];
      }
    }
  },
  // 根据轮廓裁剪生成泰森多边形
  _voronoi(type: any, points: any) {
    const options = {
      bbox: [73.66, 3.86, 135.05, 53.55], // 中国bbox
      // bbox: [114.81367139203708, 34.3785341364328, 122.7111007285469, 38.40166677597448],// 山东省bbox
      // bbox: [119.55271459088603, 36.261809523661995, 121.92947661705712, 38.40166677597448], // 烟台市bbox
    };
    const voronoiPolygons = turf.voronoi(points, options);
    let voronoiLayer = this.map.getLayerById('voronoiLayer');
    if (!voronoiLayer) {
      voronoiLayer = new (g2 as any).carto.ElementLayer({
        map: this.map,
        id: 'voronoiLayer',
      });
      this.map.addLayer(voronoiLayer);
    }
    this._getRegionData(publishObjectPath.value.district.root).then(
      (data: any) => {
        const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(
          data.wkt,
          4326,
        );
        const boundary = (G as any).utils.GeometryUtil.toJstsGeometry(polygon); // 将轮廓转为jsts对象
        turf.featureEach(
          voronoiPolygons,
          (currentFeature: any, featureIndex: any) => {
            if (currentFeature) {
              turf.featureEach(points, (point: any, index: any) => {
                if (
                  turf.booleanPointInPolygon(
                    point.geometry,
                    currentFeature.geometry,
                  )
                ) {
                  currentFeature.properties = point.properties;
                }
              });
              const voronoiPolygon = (G as any).utils.GeometryUtil.toJstsGeometry(
                currentFeature.geometry,
              ); // 将每一个多边形转为jsts对象
              const intersection = boundary.intersection(voronoiPolygon);
              if (
                !intersection.geometries ||
                intersection.geometries.length > 0
              ) {
                const geomes = (G as any).utils.GeometryUtil.fromJstsGeometry({
                  jstsGeom: intersection,
                  type: 'g2geom',
                  spatialReference: 4326,
                });
                const areaSymbol = this._setVoronoiSymbol(
                  type,
                  currentFeature.properties,
                );
                const polygonEle = new g2.sfs.Element({
                  geometry: geomes,
                  symbol: areaSymbol,
                });
                voronoiLayer.add(polygonEle);
              }
            }
          },
        );
      },
    );
  },
  _addHighlight(type: any, element: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
    symbolObj.options.source = this.options.symbolConfig.icons[
      symbolMapper.iconHlFn(featureType, attributeObj)
    ];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
    const self = this;
    const point = new g2.sfs.Point({
      x: element.geometry.x,
      y: element.geometry.y,
      spatialReference: this.map.spatialReference,
    });
    this.map.pan(point);
    this.map.zoomTo(13);
    this.timeout = setTimeout(() => {
      _setbink();
    }, 3500);
    function _setbink() {
      clearTimeout(self.timeout);
      self.timeout = null;
      self.featureHighlight.removeHighlight(self.options.highLightId);
      const options2 = options;
      options2.blink.enable = false;
      self.featureHighlight.addHighlight(self.options.highLightId, options2);
    }
  },
  // 移除高亮
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
    this.featureHighlight.removeHighlight('gj');
    $('#' + this.hideGJ).show();
  },
  // 关闭弹窗
  closePopup() {
    // 清除上一次的高亮
    this._removeHighlight();
    this.popupManager.remove(this.options.popupId);
  },
  /**
   * 获取区域数据
   * @param code  烟台市：370600 山东省370000
   */
  _getRegionData(code: any) {
    const self = this;
    const opt = {
      districtcode: code,
    };
    return new Promise((resolve, reject) => {
      if (self.regionCache[code]) {
        resolve(self.regionCache[code]);
      }
      self.service.regionSelectionServer
        .getDistrictByCode(opt)
        .then((data: any) => {
          self.regionCache[code] = data.data;
          resolve(self.regionCache[code]);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  },
  // 视野定位
  _fitBounds(type: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    const extent: any = this.simpleRenderMgr.getExtent(featureType);
    this.options.featureLocate.fit({
      type: 'geojson',
      geom: extent.asGeoJson(),
    });
  },
});
export default component;
