// 洪水灾害模型
import Util from '../../Util';
import SymbolMap from './SymbolMap';
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    map: null,
    service: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    serviceConfig: null,
    featureType: 'mountainFlood_Layer',
    popupId: 'mountainFlood_popup',
    popupEventId: 'mountainFlood_popup',
    highLightId: 'mountainFlood_LayerHL',
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
    ComponentBase.prototype.destroy.call(this);
  },
  load() {
    ComponentBase.prototype.load.call(this);
  },
  unload() {
    this._clear();
    ComponentBase.prototype.unload.call(this);
  },
  /**
   * 添加图层
   * @param opts
   */
  addResource(opts: any) {
    this.service.getModelData(opts).then((res: any) => {
      const listData = res.data;
      console.log('listData', listData);
      this._showPointOnMap(listData);
    });
  },
  removeResource() {
    this.closePopup();
    this.simpleRenderMgr.remove(this.options.featureType);
  },
  // 关闭弹窗
  closePopup() {
    // 清除上一次的高亮
    this._removeHighlight();
    this.popupManager.remove(this.options.popupId);
  },
  // 是否非地图点击触发，点击地图触发时不居中定位 type: rain|wind|water|work
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
          type: 'mountainFlood',
        });
      });
  },
  locate(field: any, value: any) {
    const self = this;
    const layer = this.simpleRenderMgr.getLayer(this.options.featureType);
    if (!layer) {
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj[field] === value) {
          this.closePopup(); // 关闭弹窗
          this._addHighlight(element);
          this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false);
          this.map.setCenter({ x: attributeObj.longitude, y: attributeObj.latitude });
          break;
        }
      }
    }
  },
  // 显示点数据
  _showPointOnMap(list: any) {
    const self = this;
    const symbolMapper = SymbolMap.mountainFlood;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.symbolConfig.icons[symbolMapper.iconFn(builddata)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType: this.options.featureType,
      featureName: '山洪风险预警图层',
      idField: 'id',
      list,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const result: any = data[0];
          const element: any = result.element;
          this.closePopup(); // 关闭弹窗
          self._addHighlight(element);
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          self.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false);
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
  },
  _addHighlight(element: any) {
    const symbolMapper: any = SymbolMap.mountainFlood;
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(this.options.featureType, attributeObj)];
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
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  _clear() {
    const tempLayer = this.map.getLayerById(this.options.featureType);
    if (tempLayer) {
      this.map.removeLayer(tempLayer);
    }
  },
});
export default component;
