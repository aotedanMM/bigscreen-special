// 灾情研判指挥调度
import Util from '../../Util';
import SymbolMap from './SymbolMap';
import StyleUtils from './StyleUtils';
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
    highLightId: 'ResourceQuery', // 高亮id
    popupId: 'ResourceQuery_popup_id',
    popupEventId: 'ResourceQuery_popup', // 添加弹窗后执行事件id
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    this.map = options.map;
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.symbolConfig = options.symbolConfig;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.featureLocate = options.GISComponents.featureLocate;
    this.popupManager = options.GISComponents.popupManager,
    this.service = options.service,
    this.featureTypeSet = {};
    this.displayedFeature = {};
    this.regionCache = {};
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
   * 新增图层
   * @param opts.type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water；|工情：work；|全部（all）
   * @param opts.list 数据列表
   */
  _addResource(opts: any) {
    if (typeof (opts.bClear) === 'undefined') {
      this._clear();
    }
    if (!this.displayedFeature[opts.type]) {
      return;
    }
    this.optsParams = opts;
    const featureInfo = this._getFeatureInfo(opts.type, opts.list);
    const level = this.map.getZoomLevel();
    this._showResourcesOnMap(opts.type, featureInfo);
    // this._addHeatMap(featureInfo);
    // this._addClusterOnMap(opts.type, featureInfo);
  },
  removeResource(type: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    this.simpleRenderMgr.remove(featureType);
    this._removeHighlight();
    this.closePopup();
    this.displayedFeature[type] = false;
  },
  // 根据类型清空图层
  removeResoureByType(type: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    this.simpleRenderMgr.remove(featureType);
  },
  // 添加热力图层
  _addHeatMap(type: any) {
    const self = this;
    const heats: any = [];
    this._createHeatLayer();
    const server: any = this._getServiceByType(type);
    const opts: any = {
      fxyh: 'prh_dangerbuliding,nah_fld_mountainflood,100103000000,nah_fld_waterlogroad,acd_prh_buildingsite,puf_wcf_culvertgate,nah_fld_waterlogsite',
      fhmb: 'puf_powerfacilities,puf_comfacilities',
    };
    server.getAllDataByName(opts[type]).then((res: any) => {
      res.forEach(function(item: any) {
        const point = new g2.sfs.Point({
          x: item.feature.properties[2].value,
          y: item.feature.properties[3].value,
          spatialReference: self.map.spatialReference,
        });
        const heat = new g2.carto.Heat({
          geometry: point, // 热力点的坐标
          weight: Math.random(),
        });
        heats.push(heat);
      });
      self.heatMapLayers.addHeats(heats);
    });
  },
  /**
 * 创建热力图图层
 */
  _createHeatLayer() {
    this._clearHeatlayer();
    // 添加热力图层
    this.heatMapLayers = new g2.carto.HeatMapLayer({
      blur: 1, // 模糊值
      radius: 1, // 圆半径
      id: 'resoubeHeatLayer',
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'], // 颜色数组
      zIndex: 9,
    });
    this.map.addLayer(this.heatMapLayers);

    // 初始化
    this.heatMapLayers.setBlur(25);
    this.heatMapLayers.setRadius(20);
  },
  _clearHeatlayer() {
    const heatLayer = this.map.getLayerById('resoubeHeatLayer');
    if (heatLayer) {
      this.map.removeLayer(heatLayer);
    }
  }
  ,
  /**
 * 列表点击地图定位时调用
 * @param type 类型 [String] 危险建筑：wxjz；|地灾隐患：dzyh；|山洪隐患：shyh；|易涝路段：ylld；|建筑工地:jzgd;|
     * 涵闸:hz;|内涝点:nld;|电力设施:dlss;|通讯设施：txss;|
 * @param field 字段名称
 * @param value 字段值
 */
  locate(type: any, field: any, value: any) {
    const featureType = this._getFeatureInfo(type, value).featureType;
    const self = this;
    const layer = this.simpleRenderMgr.getLayer(featureType);
    if (!layer) {
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj[field] === value) {
          const locateObj = {
            type: 'wkt',
            geom: element.geometry.asWkt(),
          };
          const nLevel: any = self.map.getZoomLevel();
          self.map.pan(element.geometry);
          self.map.zoomTo(nLevel);
          this.closePopup(); // 关闭弹窗
          this._addHighlight(type, element);
          const server = self._getService(type);
          const layerID = self._getLayerID(type);
          const opt: any = {
            layerId: layerID,
            dataId: attributeObj.id,
          };
          server.getDetail(opt).then((res: any) => {
            // attributeObj = Object.assign(attributeObj, res.data);
            res.attirbutes.push({xy : [element.geometry.x, element.geometry.y]});
            this.addPopup(res.attirbutes, [element.geometry.x, element.geometry.y], false, type);
          });
          break;
        }
      }
    }
  },
  /**
   * 搜索方法
   * @param type 业务类型类型标识 [String] 危险建筑：wxjz；|地灾隐患：dzyh；|山洪隐患：shyh；|易涝路段：ylld；|建筑工地:jzgd;|
   * 涵闸:hz;|内涝点:nld;|电力设施:dlss;|通讯设施：txss;|
   * @param opts server服务的参数
   * @param bClear 是否清除之前的图层
   */
  queryResource(type: any, opts: any, bClear?: boolean) {
    const server = this._getService(type);
    server.getList(opts).then((res: any) => {
      const result = res.list;
      const list: any = [];
      result.forEach((item: any) => {
        const obj = {
          _id: item.id,
          longitude: item.longitude,
          latitude: item.latitude,
          ...item,
        };
        list.push(obj);
      });
      const param = {
        type,
        list,
        bClear,
      };
      this._addResource(param);
    });
    this.displayedFeature[type] = true;
  },
  // 根据type 获取服务
  _getService(type: any) {
    const self = this;
    const service: any = {
      wxjz() {
        return self.service.riskServer;
      },
      shyh() {
        return self.service.riskServer;
      },
      dzyh() {
        return self.service.riskServer;
      },
      ylld() {
        return self.service.riskServer;
      },
      jzgd() {
        return self.service.riskServer;
      },
      hz() {
        return self.service.riskServer;
      },
      nld() {
        return self.service.riskServer;
      },
      dlss() {
        return self.service.protectTargetServer;
      },
      txss() {
        return self.service.protectTargetServer;
      },
    };
    const server = service[type]();
    return server;
  },
  // 根据type 获取服务
  _getServiceByType(type: any) {
    const self = this;
    const service: any = {
      fxyh() {
        return self.service.riskServer;
      },
      fhmb() {
        return self.service.protectTargetServer;
      },
    };
    const server = service[type]();
    return server;
  },
  // 根据类型获取layerID(表名)
  _getLayerID(type: any) {
    const self = this;
    const tableName: any = {
      wxjz() {
        return 'prh_dangerbuliding';
      },
      shyh() {
        return 'nah_fld_mountainflood';
      },
      dzyh() {
        return '100103000000';
      },
      ylld() {
        return 'nah_fld_waterlogroad';
      },
      jzgd() {
        return 'acd_prh_buildingsite';
      },
      hz() {
        return 'puf_wcf_culvertgate';
      },
      nld() {
        return 'nah_fld_waterlogsite';
      },
      dlss() {
        return 'puf_powerfacilities';
      },
      txss() {
        return 'puf_comfacilities';
      },
    };
    const layerId = tableName[type]();
    return layerId;
  },
  // 监听地图等级变化
  _mapResolutionchanged(e: any) {
    const level = this.map.getZoomLevel();
    // this.setLayerVisibleBylevel(level);
  },
  // 根据地图等级设置地图显隐（风情和雨情）
  setLayerVisibleBylevel(level: any) {
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    const featureInfo = this._getFeatureInfo(this.optsParams.type, this.optsParams.list);
    if (level >= 8) {
      voronoiLayer.setVisible(false);
      this.simpleRenderMgr.setVisible(featureInfo.featureType, true);
      this.fire('RainWindLengend', { type: this.optsParams.type, visible: false });
    } else if (level < 8) {
      if (this.optsParams.type === 'wind' || this.optsParams.type === 'rain') {
        this.simpleRenderMgr.setVisible(featureInfo.featureType, false);
      }
      voronoiLayer.setVisible(true);
      this.fire('RainWindLengend', { type: this.optsParams.type, visible: true });
    }
  },

  clearHighlight() {
    this._removeHighlight();
  },

  _clear() {
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    if (voronoiLayer) {
      voronoiLayer.clear();
    }
    this.closePopup();
    this._removeHighlight();
  },
  /**
   * 添加数据到图层
   * @param type 类型
   * @param featureInfo 符号
   */
  _showResourcesOnMap(type: any, featureInfo: any) {
    const self = this;
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource.cluster;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = self.symbolConfig.icons[symbolMapper.iconFn(type)];
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
      type: 0,   // 使用元素图层
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
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          const server = self._getService(type);
          const layerID = self._getLayerID(type);
          const opt: any = {
            layerId: layerID,
            dataId: attributeObj.id,
          };
          server.getDetail(opt).then((res: any) => {
            // attributeObj = Object.assign(attributeObj, res.attirbutes);
            res.attirbutes.push({xy : [element.geometry.x, element.geometry.y]});
            this.addPopup(res.attirbutes, [element.geometry.x, element.geometry.y], false, type);
          });
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
    // 记录展示的数据类型
    this.featureTypeSet[opts.featureType] = {};
  },
  // 添加聚类图层
  _addClusterOnMap(type: any, featureInfo: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        // 根据数据属性控制不同的显示效果
        const symbolObj: any = {
          width: symbolMapper.symbol.options.width,
          height: symbolMapper.symbol.options.height,
          offsetX: symbolMapper.symbol.options.height,
          offsetY: symbolMapper.symbol.options.offsetY,
          opacity: symbolMapper.symbol.options.offsetX,
          rotation: symbolMapper.symbol.options.rotation,
          source: self.symbolConfig.icons[symbolMapper.iconFn()],
        };
        return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', symbolObj);
      },
      buildClusterStyle: (builddata: any) => {
        // 根据数据属性控制不同的显示效果
        return {
          distance: 30,
          textFillColor: [255, 255, 255, 1],
          fillColor: [0, 0, 255, 0.2],
          fillStrokeColor: [0, 0, 255, 0.2],
          fillStrokeWidth: 10,
          visible: true,
          opacity: 1,
          zIndex: 0,
          clusterLevel: 10,
        };
      },
    });
    const opt: any = {
      featureType: featureInfo.featureType,
      featureName: '聚类图层',
      idField: '_id',
      list: featureInfo.data,
      type: 3,   // 聚合图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['longitude', 'latitude'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        // 注册点击事件
        click: (data: any) => {
          this.closePopup(); // 关闭弹窗
          self._addHighlight(type, data[0].element);
          const result: any = data[0];
          const element: any = result.element;
          let attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          const server = self._getService(type);
          const opts: any = {
            layerId: 'bas_geologichazard',
            dataId: attributeObj.objectid,
          };
          server.getDetail(opts).then((res: any) => {
            attributeObj = Object.assign(attributeObj, res.data);
            this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
          });
        },
      },
    };
    this.simpleRenderMgr.add(opt);
    this.featureTypeSet[opt.featureType] = {};
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
    const featureType = 'defensiveResource_' + type;
    if (!data) {
      return {
        featureType,
      };
    }
    // const key = Object.keys(res.data)[0];
    // const data = res.data[key];
    const icon = 'defensiveResource' + type + '_img';
    return {
      featureType,
      data,
      icon,
    };
  },
  _addHighlight(type: any, element: any) {
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(type, null)];
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

  // 移除高亮
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 关闭弹窗
  closePopup() {
    // 清除上一次的高亮
    this._removeHighlight();
    this.popupManager.remove(this.options.popupId);
  },
});
export default component;
