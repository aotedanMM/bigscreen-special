// 灾情研判指挥调度
import Util from '../../Util';
import SymbolMap from './SymbolMap';
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
    highLightId: 'RealtimeShip', // 高亮id
    popupId: 'RealtimeShip_popup_id',
    popupEventId: 'RealtimeShip_popup', // 添加弹窗后执行事件id
    featureType: 'realtimeShip',
    featureTypeMarker: 'realtimeShipMarker',
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
    this.service = options.service;
  },
  //  销毁
  destroy() {
    this.unload();
    this.simpleRenderMgr = null;
    this.symbolConfig = null;
    this.featureLocate = null;
    this.featureHighlight.clearHighlight();
    this.featureHighlight = null;
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load(opts: any) {
    ComponentBase.prototype.load.call(this);
    //
    this.showResource(opts);
    //
    // this.fire('updateLegend', {
    //   action: 'add',
    //   data: {
    //     id: this.options.featureType,
    //     name: '船舶',
    //     legend: {
    //         component: 'ShipLegend',
    //     },
    //   },
    // });
  },

  /**
   * 卸载
   */
  unload() {
    this.clear();
    ComponentBase.prototype.unload.call(this);
  },

  addListeners() {
    this.map.listen('resolutionchanged', this.onResolutionChanged, this);
  },

  removeListeners() {
    this.map.off('resolutionchanged', this.onResolutionChanged, this);
  },
  /**
   * @param opts {object}
   * @param opts.startTime {string} 开始时间
   */
  showResource(opts: any) {
    opts = opts || {};
    opts.startTime = opts.startTime || '2020-01-01 00:00:00';
    this._clear();
    // 先筛选部分数据，规避查询过慢问题
    const queryOpt = {
      startTime: opts.startTime,
    };
    this.service.getShipListByTime(queryOpt).then((res: any) => {
      this._showResourcesOnMap(res.data);
    });
  },
  /**
   * 清除展示
   */
  clear() {
    this._clear();
    this.fire('updateLegend', {
      action: 'remove',
      data: {
        id: this.options.featureType,
      },
    });
  },
/**
 * 清除高亮
 */
  clearHighlight() {
    this._removeHighlight();
  },
/**
 * 关闭弹框
 */
  closePopup() {
    this._removeHighlight();
    this.popupManager.remove(this.options.popupId);
  },
  /**
   * 弹框
   */
  addPopup(data: any, coordinate: any, noneMouseClick: any = true) {
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
        });
      });
  },
  onResolutionChanged(oldRes: any, newRes: any) {
    this._updateLayerVisible();
  },
  _updateLayerVisible() {
    const zoomLevel: any = this.map.getZoomLevel();
    let action: any = '';
    if (zoomLevel >= 10) {
      this.simpleRenderMgr.setVisible(this.options.featureType, true);
      this.simpleRenderMgr.setVisible(this.options.featureTypeMarker, false);
      action = 'add';
    } else {
      this.simpleRenderMgr.setVisible(this.options.featureType, false);
      this.simpleRenderMgr.setVisible(this.options.featureTypeMarker, true);
      action = 'remove';
    }
    // 这里触发根据地图展示效果更新
    this.fire('updateLegend', {
      action,
      data: {
        id: this.options.featureType,
        name: '船舶',
        legend: {
            component: 'ShipLegend',
        },
      },
    });
  },
  /**
   * 添加数据到图层
   * @param type 类型
   * @param featureInfo 符号
   */
  _showResourcesOnMap(data: any) {
    const self = this;
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.default;
    // marker
    const markerSymbol: any = G.utils.RenderUtil.object2Symbol({
      type: 'SimpleMarkerSymbol',
      options: {
        fillColor: {
          r: 0,
          g: 255,
          b: 0,
          a: 255,
        },
        borderColor: {
          r: 255,
          g: 255,
          b: 255,
          a: 1,
        },
        size: 3,
      },
    });
    const MarkerSymbolBuilder = G.utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        return markerSymbol;
      },
    });
    const opts0 = {
      featureType: this.options.featureTypeMarker,
      featureName: 'ais船舶marker',
      idField: 'id',
      list: data,
      type: 1,   // feature
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['lng', 'lat'],
      }),
      symbolBuilder: new MarkerSymbolBuilder(),
    };
    this.simpleRenderMgr.add(opts0);
    this.simpleRenderMgr.setVisible(this.options.featureTypeMarker, false);
    // icons
    const SymbolBuilder = G.utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol(builddata));
        symbolObj.options.rotation = this._getIconDirection(builddata.direction);
        symbolObj.options.source = self.symbolConfig.icons[symbolMapper.iconFn(builddata)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType: this.options.featureType,
      featureName: 'ais船舶',
      idField: 'id',
      list: data,
      type: 1,   // feature
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['lng', 'lat'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        // 注册点击事件
        click: (clickData: any) => {
          self.closePopup(); // 关闭弹窗
          self._addHighlight(clickData[0].element);
          const result: any = clickData[0];
          const element: any = result.element;
          let attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          const server = self.service;
          const opt: any = {
            id: attributeObj.id,
          };
          server.getShipDetail(opt).then((res: any) => {
            attributeObj = Object.assign(attributeObj, res.data);
            self.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false);
          });
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.simpleRenderMgr.setVisible(this.options.featureType, false);
    //
    this._updateLayerVisible();
  },
  // 清除
  _clear() {
    this.simpleRenderMgr.remove(this.options.featureType);
    this.simpleRenderMgr.remove(this.options.featureTypeMarker);
    this.closePopup();
    this._removeHighlight();
  },
  _addHighlight(element: any) {
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.default;
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol(attributeObj));
    symbolObj.options.rotation = this._getIconDirection(attributeObj.direction);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(attributeObj)];
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
  _getIconDirection(d: any) {
    // 取8个方向
    let direction: any = d - 0;
    const degreeUnit: any = 45;
    direction = Math.round(direction / degreeUnit) * degreeUnit;
    return direction + '';
  },

  // 移除高亮
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
});
export default component;
