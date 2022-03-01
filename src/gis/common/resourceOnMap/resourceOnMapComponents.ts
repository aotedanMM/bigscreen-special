// 模块的GIS逻辑
import SymbolMap from './SymbolMap';
import Util from '../../Util';
const componentBase = (G as any).base.ComponentBase;
const locatedata: any = {
  x: 116.35,
  y: 39.87,
  type: 'Point',
};
const component = componentBase.extend({
  // 属性
  options: {
    featureLocate: null,
    popupId: 'localResource',
    highLightId: 'localResource_hl', // 高亮id
    fireAddPopupEventId: 'localResource_popup',
  },

  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
  },
  //  销毁
  destroy() {
    componentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   * @param opts
   * @param opts.x
   * @param opts.y
   * @param opts.type
   * @param opts.autoPan 是否调整视野，默认为true
   * @param opts.changeZoom 是否缩放地图级别，默认为true
   */
  // load(opts: any) {},
  /**
   * 卸载
   */
  unload() {
    this._removeWaveEffect();
  },
  // 地图上叠加数据
  _showResourcesOnMap(key: string, dataCol: any) {
    const self: any = this;
    this.options.simpleRenderMgr.remove('resource' + key);
    let symbolMapper: any = null;
    if (SymbolMap[key]) {
      symbolMapper = SymbolMap[key];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        const symbolObj: any = Util.toJSON(symbolMapper.symbol);
        data.typeCode = '1';
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(key, data)];
        return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType: 'resource' + key,
      featureName: 'resource' + key,
      idField: 'id',
      list: dataCol,
      type: 1,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['longitude', 'latitude'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          // this指向监听时的context变量
          self._clearPopup();
          const attributeObj: any = Util.attributeSet2Object(data[0].element.attributeSet);
          self._locationCenter(key, attributeObj, true);
        },
      },
    };
    this.options.simpleRenderMgr.add(opts);
    // const level = this.map.getZoomLevel();
    // if (level < this.options.clusterlevel) {
    //   this.simpleRenderMgr.setVisible('resource_' + key, false);
    // }
  },
  /**
 * 清除弹出框
 */
  _clearPopup() {
    this.options.popupManager.remove(this.options.popupId);
    this.options.popupManager.clear();
    this._clearHighlight();
  },
  _closePopup() {
    this.options.popupManager.remove(this.options.popupId);
    this.options.popupManager.clear();
  },
  _locationCenter(key: string, data: any, noneMouseClick: any = true) {
    const self = this;
    this._clearPopup();
    data.x = data.longitude;
    data.y = data.latitude;
    const popupOptions: any = {
      id: this.options.popupId,
      anchor: [data.longitude, data.latitude],
      className: 'g2-tooltip',
    };
    if (noneMouseClick) {
      // 点击列表触发时，设置自动调整视野的延迟
      popupOptions.autoPanTimeout = 1200;
      popupOptions.autoPanMargin = 60;

    }
    console.debug(`popup  type = ${this.key}`);
    this.options.popupManager
      .addSimple(popupOptions)
      .then((content: any) => {
        this.fire(this.options.fireAddPopupEventId, {
          data,
          content,
          type: key,
        });
      });
    this._showHighlight(key, data);
  },
  _showHighlight(key: string, data: any) {
    let symbolMapper: any = null;
    if (SymbolMap[key]) {
      symbolMapper = SymbolMap[key];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    data.typeCode = '1';
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(key, data)];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + data.longitude + ' ' + data.latitude + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.options.featureHighlight.addHighlight(this.options.highLightId, options);
    const self = this;

    this.timeout = setTimeout(() => {
      _setbink();
    }, 3500);
    function _setbink() {
      clearTimeout(self.timeout);
      self.timeout = null;
      self.options.featureHighlight.removeHighlight(self.options.highLightId);
      const options2 = options;
      options2.blink.enable = false;
      self.options.featureHighlight.addHighlight(self.options.highLightId, options2);
    }
  },
  _clearHighlight() {
    this.options.featureHighlight.removeHighlight(this.options.highLightId);
  },
  /**
  * 页面取消选中时的方法
  */
  _clearLayers(key: any) {
    this.options.simpleRenderMgr.remove('resource' + key);
    this._clearPopup();
  },
});

export default component;
