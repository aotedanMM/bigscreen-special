import Util from '../../Util';
import SymbolMap from './SymbolMap';
// 调度部署
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
    highLightId: 'rescue_help_rescue_dispatch', // 高亮id
    popupId: 'rescue_dispatch_popup', // 弹窗唯一标识
    fireAddTeamPointEventId: 'dispatch_team_point', // 点击救援队伍点后执行事件id
    fireAddPopupEventId: 'team_popup', // 添加弹窗后执行事件id,
    fireAddRouteEventId: 'route', // 路径规划展示后执行事件id
    simpleRouter: null,
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    // 迁徙图数量，根据传入数据中的typeCode进行管理
    this.echartArr = [];
    // 管理传入数据中typeCode
    this.typeCodeArr = [];
    // 路径规划图层id数组
    this.routeIdArr = [];
    // 当前队伍类型
    this.currentCode = null;
    // 当前救援队图层id
    this.currentLayerId = null;
  },
  //  销毁
  destroy() {
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load() {
    // todo
    this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
    this.eventPoint = this.options.eventInfo.getPoint();
    ComponentBase.prototype.load.call(this);
  },
  /**
  * 添加队伍数据
  * @param code 队伍类型，0:现场队伍，1:赶赴队伍，2:待命队伍
  * @param pointList 队伍数据，数据格式为[{typeCode: 类型，data：数据}]
 */
  addTeam(code: any, pointList: any) {
    this.removeTeam();
    this.typeCodeArr = [];
    this.currentCode = code;
    // 对传入的队伍数据根据typeCode进行分类，前端传入值对象为：
    for (const item of pointList) {
      const typeCode = item.typeCode;
      const data = item.data;
      const layerId = code + '_' + typeCode;
      this.typeCodeArr.push(layerId);
      this._addPointToMap(layerId, data);
    }
    this._fitTeamBounds();
  },
  // 移除队伍数据
  removeTeam() {
    this._clearAll();
  },
  /**
  * 根据救援队类型添加数据
  * @param typeCode 救援队类型
  * @param pointList 队伍数据，数据格式为数组[]
  * @param code 队伍类型，0:现场队伍，1:赶赴队伍，2:待命队伍
 */
  // addTeamByTypeCode(typeCode: any, pointList: any, code: any) {
  addTeamByTypeCode(typeCode: any, code: any) {
    const layerId = code + '_' + typeCode;
    const layer = this.options.simpleRenderMgr.getLayer(layerId);
    if (layer) {
      layer.setVisible(true);
    }
    this._controlEchart();
  },
  /**
  * 根据救援队类型删除数据
  * @param typeCode 救援队类型
  * @param code 队伍类型，0:现场队伍，1:赶赴队伍，2:待命队伍
  */
  removeTeamByTypeCode(typeCode: any, code: any) {
    const layerId = code + '_' + typeCode;
    // 根据图层id清除详情框
    if (this.currentLayerId === layerId) {
      // 关闭弹出框信息
      this.closePopup();
    }
    // 删除该图层中对应的路径规划结果
    const layer = this.options.simpleRenderMgr.getLayer(layerId);
    if (layer) {
      for (let i = 0, len = layer.getCount(); i < len; ++i) {
        const ele = layer.get(i);
        if (ele) {
          this.closeRoutePlan(layer.get(i).id);
        }
      }
    }
    // 隐藏图层
    const rescueLayer = this.options.simpleRenderMgr.getLayer(layerId);
    if (rescueLayer) {
      rescueLayer.setVisible(false);
    }
    // 控制所有图层的迁徙图展示逻辑
    this._controlEchart();
  },
  /**
   * 卸载
   */
  unload() {
    // todo
    this.options.simpleRenderMgr.off('click', this._onLayerClick, self);
    this._clearAll();
    ComponentBase.prototype.unload.call(this);
  },
  // 关闭信息框
  closePopup() {
    // 清除弹出框
    this.options.popupManager.remove(this.options.popupId);
    // 清除高亮闪烁
    this._hideHighlight();

  },
  /**
  * 界面按钮调用救援队事件点击,根据id查找数据
  * @param id 数据中的id字段
  * @param typeCode 救援队类型
  */
  openPopup(id: any, typeCode: any) {
    const layerId = this.currentCode + '_' + typeCode;
    const pointLayer = this.options.simpleRenderMgr.getLayer(layerId);
    if (pointLayer) {
      const pointEle = pointLayer.find(id);
      const features: any = {};
      if (pointEle) {
        features.element = pointEle;
        features.featureType = layerId;
        const opt: any = {};
        opt.list = [features];
        this._onLayerClick(opt);
      }
    }
  },
  /**
  * 开启路径规划
  * @param routeId 救援队伍唯一id标识
  * @param typeCode 救援队类型
  */
  openRoutePlan(routeId: any, typeCode: any) {
    // todo
    // 根据id添加一个路径规划结果
    // 起始点为事件点，终点根据id查询元素获取
    const layerId = this.currentCode + '_' + typeCode;
    const layer = this.options.simpleRenderMgr.getLayer(layerId);
    if (!layer) {
      return;
    }
    const element = layer.find(routeId);
    const point = [element.geometry.x, element.geometry.y];
    const self = this;
    this.options.simpleRouter.addRoute({ startPoint: this.eventPoint, endPoint: point, id: routeId }).then((data: any) => {
      const eventData: any = {
        type: data.id,
        routeData: data.route,
      };
      // 将路径规划结果返回给前端
      self.fire(self.options.fireAddRouteEventId, eventData);
    });
    this.routeIdArr.push(routeId);

    // 展示路径规划时，隐藏所有迁徙图
    this._setAllEchartVisible(false);
  },
  /**
  * 关闭路径规划，界面上可以同时显示多个路径规划结果(通过id清除路径规划结果)
  * @param routeId 救援队伍唯一id标识
  */
  closeRoutePlan(routeId: any) {
    // 根据图层id删除路径规划结果
    this.options.simpleRouter.removeRoute(routeId);

    // this.routeIdArr = this.routeIdArr.filter((item: any) => item !== routeId);
    for (let i = 0, len = this.routeIdArr.length; i < len; ++i) {
      if (this.routeIdArr[i] === routeId) {
        this.routeIdArr.splice(i, 1);
      }
    }
    this._controlEchart();
  },
  // 控制迁徙图的显隐逻辑
  _controlEchart() {
    for (const item of this.typeCodeArr) {
      const rescueLayer = this.options.simpleRenderMgr.getLayer(item);
      if ((rescueLayer.visible && this.routeIdArr.length > 0) || (!rescueLayer.visible && this.routeIdArr.length === 0) || (!rescueLayer.visible && this.routeIdArr.length > 0)) {
        this._setEchartVisible(item, false);
      } else if ((rescueLayer.visible && this.routeIdArr.length === 0)) {
        this._setEchartVisible(item, true);
      }
    }
  },
  // 定位点
  fitPointLocation(x: any, y: any) {
    const geom = {
      type: 'Point',
      coordinates: [parseFloat(x), parseFloat(y)],
    };
    const pointdata: any = {
      type: 'geojson',
      geom,
    };
    this.options.featureLocate.fit(pointdata, {
      maxZoom: this.map.getZoomLevel(),
    });
  },

  // 根据救援队图层来定位
  _fitTeamBounds() {
    // const locateData = [];
    const envelope = new g2.sfs.Envelope({ spatialReference: this.map.spatialReference });
    for (const item of this.typeCodeArr) {
      const extent: any = this.options.simpleRenderMgr.getExtent(item);
      if (extent) {
        envelope.union(extent.envelope());
      }
    }
    this.map.setCenter(envelope.center());
    this.map.zoomTo(11);
  },
  // 删除图层、echart、弹出框
  _clearAll() {
    this.closePopup();
    // 清空所有的迁徙图
    this._closeAllEchart();
    // 清空根据救援队类型创建的所有图层
    if (this.typeCodeArr) {
      for (const item of this.typeCodeArr) {
        if (item) {
          this._clearRescueLayerByCode(item);
        }
      }
    }
    // 删除路径规划结果
    this.options.simpleRouter.clear();
    this.typeCodeArr = [];
    this.echartArr = [];
    this.routeIdArr = [];
  },
  // 控制所有迁徙图的显隐
  _setAllEchartVisible(visible: boolean) {
    for (const item of this.echartArr) {
      if (item) {
        item.echart.setVisible(visible);
      }
    }
  },
  // 根据图层id控制迁徙图的显隐
  _setEchartVisible(layerId: any, visible: boolean) {
    for (const item of this.echartArr) {
      if (item.id === layerId) {
        item.echart.setVisible(visible);
      }
    }
  },
  // 根据图层id删除迁徙图
  _closeEchart(layerId: any) {
    for (const item of this.echartArr) {
      if (item.id === layerId) {
        item.echart.unbind();
      }
    }
  },
  // 删除所有的迁徙图
  _closeAllEchart() {
    if (this.echartArr) {
      for (const item of this.echartArr) {
        if (item) {
          item.echart.unbind();
        }
      }
      this.echartArr = [];
    }
  },
  // 图层点击事件
  _onLayerClick(features: any) {
    this.closePopup();
    let pointFeature: any = null;
    const list = features.list;
    for (const item of list) {
      for (const layerId of this.typeCodeArr) {
        if (item.featureType === layerId) {
          pointFeature = item;
          this.currentLayerId = item.featureType;
          break;
        }
      }

      // if (item) {
      //         pointFeature = item;
      //         this.currentLayerId = item.featureType;
      //         break;
      // }
    }
    // 优先实现点的点击识别事件
    if (pointFeature) {
      const featureObj: any = pointFeature;
      const attributeObj: any = Util.attributeSet2Object(featureObj.element.attributeSet);
      const element = featureObj.element;
      // 队伍进程
      const teamjc = attributeObj.teamjc;
      const typeCode = attributeObj.typeCode;
      this._clickTip(element, pointFeature.featureType);

      // 点闪烁
      this._showHighLight([element.geometry.x, element.geometry.y], typeCode);
      // 定位点
      this.fitPointLocation(element.geometry.x, element.geometry.y);
      this.fire(this.options.fireAddTeamPointEventId, {
        id: attributeObj.id,
        typeCode,
      });
    }
  },

  // 根据救援队类型清空删除图层
  _clearRescueLayerByCode(typeCode: any) {
    // 清空救援队点图层
    this.options.simpleRenderMgr.remove(typeCode);
  },
  // 添加点数据到图层，根据layerId创建图层,layerId由typeCode和code组成
  _addPointToMap(layerId: any, pointArr: any) {
    const self = this;
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.rescueteam;
    const symbolObj = Util.toJSON(symbolMapper.symbol);

    // 添加点数据
    // const symbolObj: any = {
    //   width: 34,
    //   height: 46,
    //   offsetX: '17',
    //   offsetY: '46',
    //   opacity: '1',
    //   rotation: '0',
    // };
    // 添加点数据
    const simpleRenOpt: any = {
      featureType: layerId,
      featureName: '调度部署_救援队伍',
      list: pointArr,
      type: 0, // 使用elementLayer,
      idField: 'id', // 数据唯一标识的属性
    };

    simpleRenOpt.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        // 根据数据属性控制不同的显示效果
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn('', builddata, 'typeCode')];
        if (!symbolObj.options.source) {
          console.log(builddata.rescuetypecode);
        }
        // symbolObj.source = self.options.symbolConfig.icons['RescueTeam' + builddata.typeCode + '_img'];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    simpleRenOpt.symbolBuilder = new SymbolBuilder();
    this.options.simpleRenderMgr.add(simpleRenOpt);
    const teamjc = pointArr[0].teamjc;
    if (teamjc === '赶赴救援队' || teamjc === '待命救援队') {
      // 展示迁徙图
      this._addSlideLine(pointArr, layerId);
    }
  },
  // 添加迁徙图，根据救援队类型创建迁徙图
  _addSlideLine(dataArr: any, layerId: any) {
    const multPontsGeo: any = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:' + this.map.spatialReference,
        },
      },
      features: [],
    };
    const features: any[] = [];
    for (const item of dataArr) {
      features.push({
        type: 'Feature',
        properties: {
          id: item.name,
          to: '事故点',
        },
        geometry: {
          type: 'Point',
          coordinates: [item.x, item.y],
        },
      });
    }
    features.push({
      type: 'Feature',
      properties: {
        id: '事故点',
      },
      geometry: {
        type: 'Point',
        coordinates: this.eventPoint,
      },
    });
    multPontsGeo.features = features;
    const geoSource = new gv.source.GeoJsonSource(multPontsGeo);
    const myChart = new gv.chart.QianXiIconChart(geoSource, {
      fieldName: {
        id: 'id',
        to: 'to',
      },
      pointStyle: {
        symbol: 'none',
      },
      strokeStyle: 'rgba(255,0,0,0.8)',
      shadowColor: 'rgba(255,0,0,0)',
      lineWidth: 2,
      curveness: 0.2,
      flowAnimation: {
        symbol: 'pin',
        size: 10,
        trails: 0.04,
        period: 4,
        fillStyle: 'red',
      },
    });
    myChart.bind(this.map, gv.chart.MapType.TSMap);
    myChart.render();
    // 一个救援队类型图层对应一个迁徙图
    this.echartArr.push({
      echart: myChart,
      id: layerId,
    });
  },
  // 隐藏高亮
  _hideHighlight() {
    this.options.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 点动画闪烁
  _showHighLight(coordinate: number[], typeCode: any) {
    this._hideHighlight();
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.rescueteam;
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn('', {typeCode}, 'typeCode')];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
      },
      style: symbolObj,
    };
    this.options.featureHighlight.addHighlight(this.options.highLightId, options);
  },
  /**
    * 弹出对话框
    * @param element 点识别元素
    * @param layerId 图层id
   */

  _clickTip(element: any, layerId: any) {
    const self = this;
    const point: any = element.geometry.getBaryCenter();
    this.options.popupManager.addSimple({
      id: this.options.popupId,
      anchor: [point.x, point.y],
      className: this.options.popupId,
    }).then((content: any) => {
      const data: any = Util.attributeSet2Object(element.attributeSet);
      const eventData: any = {
        type: layerId,
        content,
        data,
      };
      self.fire(self.options.fireAddPopupEventId, eventData);
    });
  },
});
export default component;
