import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
// 调度态势
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    rescueServer: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    needPointLayerId: 'rescue_situation_point', // 图层id
    popupId: 'rescue_situation_popup', // 弹窗唯一标识
    highLightId: 'rescue_help_rescue_situation', // 高亮id
    fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id,
    fireAddRouteEventId: 'situation_route', // 开启路径规划后执行事件id
    featureType: 'rescure_situation_feature_type', // 行政区划图层名称
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
    this.hisdata = [];
    ComponentBase.prototype.initialize.call(this, options);
  },
  //  销毁
  destroy() {
    ComponentBase.prototype.destroy.call(this);
  },
/**
 * 查询统计
 */
  queryStaticData() {
    const Staticdata: any = this.options.rescueServer.getTeamStatics();
    // console.log(Staticdata);
    return Staticdata;
  },
  /**
   * 查询集结队伍数据
   */
  queryAwaitData() {
    const AwaitData: any = this.options.rescueServer.getTeamInfoList('await');
    return AwaitData;
  },
  /**
   * 加载
   * @param type 需求点数据集合 [{id: '',x: '', y: '', district: '',workers: []}]
   */
  load(type: any) {
    // todo
    const self = this;
    return new Promise(async (resolve, reject) => {
      // 绑定点击事件
      self.options.simpleRenderMgr.on('click', self._onLayerClick, self);
      // 展示行政区划结果
      const AwaitData: any = this.queryAwaitData();
      this._addRescureNeedPoint(AwaitData);
      this.list = AwaitData;
      const StaticData: any = this.queryStaticData();
      this.fire('listData', this.list);
      this.fire('staticData', StaticData);
      resolve();
    });
  },
  // 删除点
  removePoint() {
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
    const teamLayer = this.options.simpleRenderMgr.getLayer(this.options.needPointLayerId);
    if (teamLayer) {
      const pointEle = teamLayer.find(id);
      const features: any = {};
      if (pointEle) {
        features.element = pointEle;
        features.featureType = this.options.needPointLayerId;
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
    const layer = this.options.simpleRenderMgr.getLayer(this.options.needPointLayerId);
    if (!layer) {
      return;
    }
    const element = layer.find(routeId);
    const startpoint = [116, 40];
    const point = [element.geometry.x, element.geometry.y];
    const self = this;
    this.options.simpleRouter.addRoute({ startPoint: startpoint, endPoint: point, id: routeId }).then((dataSource: any) => {
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
  openHistoryTrack(hisdata: any) {
    // console.log(hisdata);
    // 加载历史轨迹数据
    this.hisdata = hisdata;
    this.options.historyTracker.load(hisdata);
  },
  historyPlay() {
    this.options.historyTracker.play(this.hisdata);
  },
  historyPause() {
    this.options.historyTracker.pause();
  },
  historyFinish() {
    this.options.historyTracker.finish();
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
  // 根据救援队伍类型控制图层的显隐
  _setLayerVisibleByCode(typeCode: any, visible: boolean) {
    const layerId = this.currentHlId + '_' + typeCode;
    const layer = this.options.simpleRenderMgr.getLayer(layerId);
    if (layer) {
      layer.setVisible(visible);
    }
  },
  // 加载需求点点图标信息
  _addRescureNeedPoint(pointArr: any) {
    const self = this;
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.RESCUETEAM;
    const symbolObj = Util.toJSON(symbolMapper.symbol);
    // 添加点数据
    const simpleRenOpt: any = {
      featureType: this.options.needPointLayerId,
      featureName: '调度态势队伍集结点',
      list: pointArr,
      type: 0, // 使用elementLayer,
      idField: 'id', // 数据唯一标识的属性
    };

    simpleRenOpt.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
       // 根据数据属性控制不同的显示效果
       const typeCode: string = builddata.typeCode;
       symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn('', {typeCode}, 'typeCode')];
       if (!symbolObj.options.source) {
         console.log(typeCode);
       }
       return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    simpleRenOpt.symbolBuilder = new SymbolBuilder();
    this.options.simpleRenderMgr.add(simpleRenOpt);
    this.typeCodeArr.push(this.options.needPointLayerId);
  },
  // 图标点击事件处理
  _onLayerClick(features: any) {
    this.closePopup();
    let pointFeature: any = null;
    const list = features.list;
    for (const item of list) {
      // 识别队伍点数据
      pointFeature = item;
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
      // this.fire(this.options.fireAddTeamPointEventId, {
      //   id: attributeObj.id,
      //   typeCode,
      // });
    }
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
    symbolMapper = SymbolMap.RESCUETEAM;
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
