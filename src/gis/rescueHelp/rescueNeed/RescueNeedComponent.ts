import Util from '../../Util';
import SymbolMap from './SymbolMap';
import { rescueAssistanceServer } from '@/api/feature/RescueAssistance/installRescueAssistanceServer';
import data from '../../disasterSta/sta/data';
// 救援需求
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    rescueNeedServer: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    needPointLayerId: 'rescue_need_point', // 需求点图层id
    popupId: 'rescue_need_popup', // 弹窗唯一标识
    highLightId: 'rescue_help_rescue_need', // 高亮id
    fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id,
    fireQueryTeamPointEventId: 'query_team_point', // 需求点查询队伍点数据后执行事件id
    fireAddNeedPointEventId: 'need_point', // 点击需求点后执行事件id
    fireAddTeamPointEventId: 'team_point', // 点击救援队伍点后执行事件id
    fireAddRouteEventId: 'need_route', // 开启路径规划后执行事件id
    featureType: 'rescure_need_feature_type', // 行政区划图层名称
    symbolSet: {  // 存储所有的图标符号
      needPointSymbol: {   // 需求点图标符号
        width: 40,
        height: 50,
        offsetX: 20,
        offsetY: 50,
        opacity: 1,
        rotation: 0,
        source: 'data:image/png;base64,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',
      },
      needPointUpdateSymbol: {  // // 需求点高亮图标符号
        width: 66,
        height: 80,
        offsetX: 32,
        offsetY: 65,
        opacity: 1,
        rotation: 0,
        source: 'data:image/png;base64,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',
      },
    },
  },
  // 初始化
  initialize(options: any) {
    // 管理传入数据中typeCode,图层名称
    this.typeCodeArr = [];
    // 当前救援队图层id
    this.currentLayerId = null;
    // 当前高亮的需求点对象id
    this.currentHlId = null;
    // 需求点数据集合
    this.list = [];
    ComponentBase.prototype.initialize.call(this, options);
  },
  //  销毁
  destroy() {
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   * @param typeList 需求点数据集合 [{id: '',x: '', y: '', district: '',workers: []}]
   */
  load(typeList: any) {
    // todo
    const self = this;
    return new Promise(async (resolve, reject) => {
      this.eventPoint = this.options.eventInfo.getPoint();
      self.options.simpleRenderMgr.on('click', self._onLayerClick, self);
      // 展示行政区划结果
      const affectCircle = this.options.eventInfo.getMaxRangeGeometry();
      self._showDistric(affectCircle);
      // 创建并加载所有的需求点信息
      this._addRescureNeedPoint(typeList);
      this.list = typeList;
      resolve();
    });
  },
  /**
   * 界面上点击需求点条目调用的方法，识别需求点，并查询所需救援队队伍数据
   * @param id 需求点唯一标识
   */
  needPointClick(id: any) {
    // 将需求点信息展示在地图上
    // 删除需求点
    this.removeNeedPoint();
    // 获取需求点数据图层
    const needLayer = this.options.simpleRenderMgr.getLayer(this.options.needPointLayerId);
    if (needLayer) {
      const needEle = needLayer.find(id);
      // 高亮需求点图标
      this._highlight(needEle);
      // 查询救援队伍数据
      const attributeObj: any = Util.attributeSet2Object(needEle.attributeSet);
      this.queryAroundTeam(attributeObj);
    }
  },
  // 删除需求点
  removeNeedPoint() {
    // 删除需求点高亮
    this._clearHighlight();
    // 删除救援队伍点高亮和详情框
    this.closePopup();
    // 同时删除查询得到的救援队伍图层
    for (const item of this.typeCodeArr) {
      if (item) {
        this.options.simpleRenderMgr.remove(item);
      }
    }
    // 删除路径规划结果
    this.options.simpleRouter.clear();
    this.typeCodeArr = [];
    this.currentHlId = null;
    this.currentLayerId = null;
  },
  /**
  * 根据救援队类型添加,对应左侧菜单列表子项的勾选
  * @param typeCode 救援队伍类型编码
  */
  addRescureTeamByCode(typeCode: any) {
    // 将对应类型的救援队图层显示
    this._setLayerVisibleByCode(typeCode, true);
  },
  /**
   * 根据救援队类型删除,对应左侧菜单列表子项的反选
   * @param typeCode 救援队伍类型编码
  */
  removeRescureTeamByCode(typeCode: any) {
    // 将对应类型的救援队图层隐藏
    this._setLayerVisibleByCode(typeCode, false);
    const layerId = this.currentHlId + '_' + typeCode;
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
  },
  /**
  * 界面右侧救援队条目信息点击事件调用方法，根据救援类队伍型编码识别救援队伍数据
  * @param id 救援队伍唯一标识id
  * @param typeCode 救援队伍类型编码
  */
  teamPointClick(id: any, typeCode: any) {
    const layerId = this.currentHlId + '_' + typeCode;
    const teamLayer = this.options.simpleRenderMgr.getLayer(layerId);
    if (teamLayer) {
      const pointEle = teamLayer.find(id);
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
  * 查询所有救援队伍
  * @param needData 服务数据 {x,y,district,workers}
  */
  queryAroundTeam(needData: any) {
    const workers = needData.workers;
    const needList: any = {};
    if (workers) {
      for (const item of workers) {
        needList[item.typeCode] = item.num * 1;
      }
    }
    const opt = {
      point: [needData.x * 1, needData.y * 1],
      needSet: needList,
    };
    const self = this;
    rescueAssistanceServer.getRescueByTypeAndNeedLoc(opt).then((queryData: any) => {
      // 将需求点查询的数据添加到地图上，同时将数据返回给前端
      for (const item of queryData) {
        const typeCode = item.type;
        self._addRescureTeamPoint(item.list, typeCode);
      }
      self._fitTeamBounds();
      this.fire(this.options.fireQueryTeamPointEventId, {
        id: needData.id,
        data: queryData,
      });
    });
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
    const layerId = this.currentHlId + '_' + typeCode;
    const layer = this.options.simpleRenderMgr.getLayer(layerId);
    if (!layer) {
      return;
    }
    const element = layer.find(routeId);
    const point = [element.geometry.x, element.geometry.y];
    const self = this;
    this.options.simpleRouter.addRoute({ startPoint: this.eventPoint, endPoint: point, id: routeId }).then((dataSource: any) => {
      const eventData: any = {
        type: dataSource.id,
        routeData: dataSource.route,
      };
      // 将路径规划结果返回给前端
      self.fire(self.options.fireAddRouteEventId, eventData);
    });
  },
  /**
  * 关闭路径规划，界面上可以同时显示多个路径规划结果(通过id清除路径规划结果)
  * @param routeId 救援队伍唯一id标识
  */
  closeRoutePlan(routeId: any) {
    // 根据图层id删除路径规划结果
    this.options.simpleRouter.removeRoute(routeId);
  },
  // 关闭信息框
  closePopup() {
    // 清除弹出框
    this.options.popupManager.remove(this.options.popupId);
    // 清除高亮闪烁
    this._hideHighlight();
  },
  /**
   * 卸载
   */
  unload() {
    // todo
    this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
    // 删除需求点图层
    this.options.simpleRenderMgr.remove(this.options.needPointLayerId);
    // 清空行政区划图层
    this.options.simpleRenderMgr.remove(this.options.featureType);
    this.removeNeedPoint();
    this.list = [];
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
  // 根据救援队伍类型控制图层的显隐
  _setLayerVisibleByCode(typeCode: any, visible: boolean) {
    const layerId = this.currentHlId + '_' + typeCode;
    const layer = this.options.simpleRenderMgr.getLayer(layerId);
    if (layer) {
      layer.setVisible(visible);
    }
  },
  // 定位矩形
  _fitBounds() {
    const extent: any = this.options.simpleRenderMgr.getExtent(this.options.featureType);
    this.options.featureLocate.fit({
      type: 'geojson',
      geom: extent.asGeoJson(),
    });
  },
  // 展示行政区划边界
  _showDistric(affectCircle: any) {
    const self = this;
    this.options.rescueNeedServer.getCounties({
      point: self.eventPoint,
      geometry: affectCircle,
    }).then((districtData: any) => {
      console.log('行政区划信息');
      console.log(districtData);
      self._addDistricPolygon(districtData);
      self._fitBounds();
    });
  },
  // 加载需求点点图标信息
  _addRescureNeedPoint(pointArr: any) {
    const self = this;
    // 添加点数据
    const simpleRenOpt: any = {
      featureType: this.options.needPointLayerId,
      featureName: '救援需求_需求点',
      list: pointArr,
      type: 0, // 使用elementLayer,
      idField: 'id', // 数据唯一标识的属性
    };

    simpleRenOpt.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        // 根据数据属性控制不同的显示效果
        // symbolObj.source = this.options.symbolConfig.icons['RescueTeam' + builddata.typeCode + '_img'];
        if (builddata.id === self.currentHlId) {
          return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', this.options.symbolSet.needPointUpdateSymbol);
        } else {
          return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', this.options.symbolSet.needPointSymbol);
        }
      },
    });
    simpleRenOpt.symbolBuilder = new SymbolBuilder();
    this.options.simpleRenderMgr.add(simpleRenOpt);
  },
  // 加载救援队点图标信息
  _addRescureTeamPoint(pointArr: any, typeCode: any) {
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.rescueteam;
    const symbolObj = Util.toJSON(symbolMapper.symbol);
    const layerId = this.currentHlId + '_' + typeCode;
    this.typeCodeArr.push(layerId);
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
      featureName: '救援需求_救援队点',
      list: pointArr,
      type: 0, // 使用elementLayer,
      idField: 'id', // 数据唯一标识的属性
    };

    simpleRenOpt.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        // 根据数据属性控制不同的显示效果
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn('', {typeCode}, 'typeCode')];
        if (!symbolObj.options.source) {
          console.log(typeCode);
        }
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    simpleRenOpt.symbolBuilder = new SymbolBuilder();
    this.options.simpleRenderMgr.add(simpleRenOpt);
  },
  // 图标点击事件处理
  _onLayerClick(features: any) {
    this.closePopup();
    let pointFeature: any = null;
    let needFeature: any = null;
    const list = features.list;
    for (const item of list) {
      // 识别队伍点数据
      if (item && item.featureType !== this.options.featureType && item.featureType !== this.options.needPointLayerId) {
        for (const layerId of this.typeCodeArr) {
          if (item.featureType === layerId) {
            pointFeature = item;
            this.currentLayerId = item.featureType;
            break;
          }
        }

        // pointFeature = item;
        // this.currentLayerId = item.featureType;
        // break;
      } else if (item.featureType === this.options.needPointLayerId) { // 识别需求点数据
        needFeature = item;
      }
    }
    // 优先实现队伍点的点击识别事件
    if (pointFeature) {   // 实现救援队伍点的点击识别事件
      const featureObj: any = pointFeature;
      const attributeObj: any = Util.attributeSet2Object(featureObj.element.attributeSet);
      const element = featureObj.element;
      const typeCode = attributeObj.typeCode;
      // 点闪烁
      this._showHighLight([element.geometry.x, element.geometry.y], typeCode);
      // 添加点识别弹出框
      this._clickTip(element);
      // 定位点
      this.fitPointLocation(element.geometry.x, element.geometry.y);
      this.fire(this.options.fireAddTeamPointEventId, {
        id: attributeObj.id,
        typeCode,
      });
    } else if (needFeature) {
      const featureObj: any = needFeature;
      const attributeObj: any = Util.attributeSet2Object(featureObj.element.attributeSet);
      // 定位点
      this.fitPointLocation(attributeObj.x, attributeObj.y);
      this.fire(this.options.fireAddNeedPointEventId, {
        id: attributeObj.id,
      });
    }
  },
  // 添加行政区划边界
  _addDistricPolygon(polygonList: any) {
    let borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 255, a: 153 });
    if (this.map.getLayerById('basemap')) {
      borderColor = new (g2 as any).sfs.Color({ r: 246, g: 255, b: 0, a: 255 });
    } else if (this.map.getLayerById('tiandituLayer_img')) {
      borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 255, a: 153 });
    } else if (this.map.getLayerById('tiandituLayer_vec')) {
      borderColor = new (g2 as any).sfs.Color({ r: 255, g: 55, b: 1, a: 255 });
    } else if (this.map.getLayerById('tiandituLayer_ter')) {
      borderColor = new (g2 as any).sfs.Color({ r: 12, g: 0, b: 255, a: 255 });
    }
    const symbol = new (g2 as any).sfs.SimpleFillSymbol({
      borderColor,
      fillColor: new (g2 as any).sfs.Color({ r: 49, g: 118, b: 162, a: 1 }),
      opacity: 0.5,
      borderThickness: 2,
      style: 5,
    });
    const SymbolBuilder = G.utils.SymbolBuilder.extend({
      build: () => {
        return symbol;
      },
    });
    const opts = {
      featureType: this.options.featureType,
      featureName: '区划边界',
      idField: 'code',
      type: 0,
      list: polygonList,
      geometryBuilder: new G.utils.GeometryBuilder({ geometryField: ['geom'] }),
      symbolBuilder: new SymbolBuilder(),
    };
    this.options.simpleRenderMgr.add(opts);
  },
  // 隐藏高亮
  _hideHighlight() {
    this.options.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 需求点高亮
  _highlight(element: any) {
    this.currentHlId = element.id;
    this._updateForHl(element.id);
  },
  // 清除需求点高亮，恢复图层原有的渲染
  _clearHighlight() {
    if (this.currentHlId) {
      const id: any = this.currentHlId;
      this.currentHlId = null;
      this._updateForHl(id);
    }
  },
  // 更新需求点样式
  _updateForHl(id: any) {
    let needData: any = null;
    for (const item of this.list) {
      if (item.id === id) {
        needData = item;
        break;
      }
    }
    const opts: any = {};
    opts.featureType = this.options.needPointLayerId;
    opts.list = [needData];
    this.options.simpleRenderMgr.update(opts);
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
  // 弹出对话框
  _clickTip(element: any) {
    const point: any = element.geometry.getBaryCenter();
    const self = this;
    this.options.popupManager.addSimple({
      id: this.options.popupId,
      anchor: [point.x, point.y],
      className: this.options.popupId,
    }).then((content: any) => {
      const dataObj: any = Util.attributeSet2Object(element.attributeSet);
      const eventData: any = {
        type: self.currentHlId + '_' + dataObj.typeCode,
        content,
        data: dataObj,
      };
      self.fire(this.options.fireAddPopupEventId, eventData);
    });
  },
});
export default component;
