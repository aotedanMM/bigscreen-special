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
    this.toolTipWare = new (g2 as any).widget.TooltipWare({
      map: this.map,
    });
    this.eventInfo = options.eventInfo;
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
    ComponentBase.prototype.unload.call(this);
  },
  addResource_Wind() {
    this.queryResource('wind', {overThreshold: true});
  },
  addResource_Rain() {
    this.queryResource('rain', {level: 'rain,heavyRain,superRain'});
  },
  // 水库和河流的报警数据
  addResource_Water() {
    this.queryResource('water', { level: 'overLimit,overNormal,overDesign,overHighest,overWarning,overGuarantee,overHighest'});
  },
  // 河流
  addResource_Water_river() {
    this.queryResource('river', {type: 'warning'});
  },
  // 水库
  addResource_Water_reservoir() {
    this.queryResource('water', {type: 'warning'});
  },

  /**
   * 搜索方法
   * @param type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water；|工情：work；|全部（all）
   * @param opts server服务的参数
   */
  queryResource(type: any, opts: any) {
    this.options.status = 'add';
    const featureType = this._getFeatureInfo(type).featureType;
    const layer = this.simpleRenderMgr.getLayer(featureType);
    if (layer) {
      return;
    }
    let promise: any = null;
    opts.nowPage = 1;
    opts.pageSize = 10000000;
    const server = this._getService(type);
    if (type === 'river') {
      promise = server.getRiverStationsList(opts);
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
      if (this.options.status === 'add') {
        this._addResource(param);
      }
    });
  },
  /**
   * 新增图层
   * @param opts.type 业务类型类型标识 [String] 风情：wind；|雨情：rain；|水情：water
   * @param opts.list 数据列表
   */
  _addResource(opts: any) {
    this.optsParams = opts;
    if (this.eventInfo.getEventInfo() === null) {
      this.map.fullExtent();
    }
    const featureInfo = this._getFeatureInfo(opts.type, opts.list);
    this._showResourcesOnMap(opts.type, featureInfo);
    if (opts.type === 'rain') {
      // 暂时注释掉
      // this._addVoronoi(opts.type);
      // this.fire('RainWindLengend', {type: opts.type, visible: true});
    }
  },
  // 根据类型移除 [String] 风情：wind；|雨情：rain；|水情：water
  removeResource(type: any) {
    this.options.status = 'remove';
    const featureType = this._getFeatureInfo(type).featureType;
    this.simpleRenderMgr.remove(featureType);
    this._removeHighlight();
    this.closePopup();
    if (type === 'rain') {
      this.toolTipWare.clear();
    }
    const voronoiLayer = this.map.getLayerById('voronoiLayer');
    if (voronoiLayer) {
      voronoiLayer.clear();
      this.fire('RainWindLengend', {type, visible: false});
    }
  },
  // 移除所有
  removeAll() {
    this._clear();
    this.fire('RainWindLengend', {type: 'rain', visible: false});
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
      reservoir() {
        return self.service.waterSituationServer;
      },
      river() {
        return self.service.waterSituationServer;
      },
    };
    const server = service[type]();
    return server;
  },
  clearHighlight() {
    this._removeHighlight();
  },

  _clear() {
    this.options.status = 'remove';
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
    this.toolTipWare.clear();
  },
  /**
   * 添加数据到图层
   * @param dataCol
   * @param type
   */
  _showResourcesOnMap(type: any, featureInfo: any) {
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
          symbolMapper.iconFn(builddata.type, builddata)
        ];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType: featureInfo.featureType,
      featureName: '防汛防台-风雨水工情图层',
      zIndex: 88,
      idField: '_id',
      list: featureInfo.data,
      type: 0, // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
        geometryType: 'point',
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
          const server = self._getService(type);
          server.getStationDetail({ id: attributeObj.id }).then((res: any) => {
            for (const key of Object.keys(res.data)) {
              const value: any = res.data[key];
              if (value === null || value === undefined) {
                continue;
              }
              attributeObj[key] = res.data[key];
            }
            this.addPopup(attributeObj, [element.geometry.x,  element.geometry.y], false, type);
          });
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['longitude', 'latitude'],
    });
    this.simpleRenderMgr.add(opts);
    if (type === 'rain') {
      this._addToolTips();
    }
    // 记录展示的数据类型
    this.featureTypeSet[opts.featureType] = {};
    // 视野定位
    // this._fitBounds(type);
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
    let featureType = 'monitorWarning_' + type;
    if (type === 'rain') {
      featureType = 'monitorWarningRain_' + type;
    }
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
  // 添加泰森多边形 type: rain wind
  _addVoronoi(type: any) {
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
  },
  // 配置泰森多边形颜色
  _setVoronoiSymbol(type: any, properties: any) {
    const areaSymbol = new g2.sfs.SimpleFillSymbol({
      borderColor: new (g2 as any).sfs.Color({a: 255, r: 205, g: 255, b: 251}),
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
    const speed: any = [[0, 0.2], [0.3, 1.5], [1.6, 3.3], [3.4, 5.4], [5.5, 7.9], [8.0, 10.7], [10.8, 13.8], [13.9, 17.1], [17.2, 20.7], [20.8, 24.4], [24.5, 28.4], [28.5, 32.6], [32.7, 36.9]];
    const level: any = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < speed.length; i++) {
      if (speed[i][0] <= windSpeed && windSpeed <= speed[i][1]) {
        return level[i];
      }
    }
  },
  // 根据轮廓裁剪生成泰森多边形
  _voronoi(type: any, points: any) {
    const self = this;
    const options = {
      // bbox: [-180, -90, 180, 90], // 全球
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
    this._getRegionData(publishObjectPath.value.district.root).then((data: any) => {
      // this.options.featureLocate.fit({type: 'wkt', geom: data.wkt});
      const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(data.wkt, 4326);
      const boundary = (G as any).utils.GeometryUtil.toJstsGeometry(polygon); // 将轮廓转为jsts对象
      turf.featureEach(voronoiPolygons, (currentFeature: any, featureIndex: any) => {
          if (currentFeature) {
            turf.featureEach(points, (point: any, index: any) => {
              if (turf.booleanPointInPolygon(point.geometry, currentFeature.geometry)) {
                currentFeature.properties = point.properties;
              }
            });
            // const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(currentFeature.geometry, 4326);
            const voronoiPolygon = (G as any).utils.GeometryUtil.toJstsGeometry(currentFeature.geometry); // 将每一个多边形转为jsts对象
            const intersection = boundary.intersection(voronoiPolygon);
            if (!intersection.geometries || intersection.geometries.length > 0) {
              const geomes = (G as any).utils.GeometryUtil.fromJstsGeometry({jstsGeom: intersection, type: 'g2geom', spatialReference : 4326});
              const areaSymbol = this._setVoronoiSymbol(type, currentFeature.properties);
              const polygonEle = new g2.sfs.Element({geometry: geomes, symbol: areaSymbol});
              voronoiLayer.add(polygonEle);
            }
          }
       },
      );
    });
  },
  // 添加小tooltip
  _addToolTips() {
    this.simpleRenderMgr.visitFeature('monitorWarningRain_rain', {
      visit: (element: any, layer: any) => {
        const attributeObj: any = Util.attributeSet2Object(
          element.attributeSet,
        );
        let rainfall = attributeObj.rainfall === null ? 0 : attributeObj.rainfall;
        if (!rainfall && typeof(rainfall) !== 'undefined' && rainfall !== 0) {
          rainfall = 0;
        }
        let className = '';
        switch (attributeObj.level) {
          case '暴雨':
            className = 'pointTip3';
            break;
          case '大暴雨':
            className = 'pointTip2';
            break;
          case '特大暴雨':
            className = 'pointTip1';
            break;
          default:
            className = 'pointTip4';
            break;
        }
        const tooltip = new (g2 as any).widget.Tooltip({
          anchor: element.geometry, // 提示在地图上停靠位置
          content: `<div class="${className}">${rainfall + ' mm'}</div>`, // 提示内容
          layerId: 'rain_tooltip', // 提示所在图层ID
          id: 'carRisk',
          title: '',
          offset: [-110, -130],
          className: 'g2-tooltip',
          autoPan: false,
        });
        this.toolTipWare.add(tooltip, false);
        return true;
      },
    });

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
