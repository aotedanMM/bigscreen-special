// 模块的GIS逻辑
import SymbolMap from './SymbolMap';
import Util from '../../../Util';
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
    popupId: 'push_event',
    highLightId: 'push_event_hl', // 高亮id
    fireAddPopupEventId: 'push_event_popup',
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
  load(opts: any) {
    this._update(opts);
  },

  // 更新事件位置
  update(opts: any) {
    this._update(opts);
  },
  closePopup() {
    this.options.popupManager.remove('SafeProductEventPop');
  },

  openPopup(type: any, data: any) {
    const self = this;
    self.options.GISComponents.popupManager.clear();
    self.options.GISComponents.popupManager.addSimple({
      id: 'SafeProductEventPop',
      // anchor: [center.x, center.y],
      className: 'default-detail-popup',
      autoPanTimeout: 1000,
      autoPanMargin: 100,
    }).then((content: any) => {
      self.fire('SafeProductEventPop', {
        type,
        isEventBtn: true,
        data: data || {},
        content,
      });
      self.options.GISComponents.eventDispatcher.dispatch('SafeProductEventPop', {
        type,
        isEventBtn: true,
        data: data || {},
        content,
      });
    });
  },
  /**
   * 卸载
   */
  unload() {
    this._removeWaveEffect();
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
  _update(opts: any) {
    if (opts.type !== '16') {
      this._removeWaveEffect();
    }
    if (opts.autoPan !== false) {
      const point: string = 'POINT(' + opts.x + ' ' + opts.y + ')';
      const pointdata: any = {
        type: 'wkt',
        geom: point,
      };
      const options: any = {};
      if (opts.changeZoom === false) {
        options.maxZoom = this.map.getZoomLevel();
      }
      this.options.featureLocate.fit(pointdata, options);
    }
    // 根据不同事件类型 切换不同图标效果
    switch (opts.type) {
      case '1': // 地震
      case 1: // 地震
        this._waveEffect(opts);
        break;
      case '5': // 危化品工贸
      case 5: // 危化品工贸
        this._fireEffect(opts);
        break;
      case '9': // 森林火灾
      case 9: // 森林火灾
        this._fireEffect(opts);
        break;
      case '10': // 台风
      case 10: // 台风
        this._typhoonEffect(opts);
        break;
      case '16': // 台风
      case 16: // 台风
        this._commonEvent(opts);
        break;
      default:
        this._fireEffect(opts);
        break;
    }
  },
  // 设置wave效果
  _waveEffect(point: any) {
    const self = this;
    // 创建一个overlayWare
    const overlayWare = new g2.widget.OverlayWare({
      map: self.map,
    });
    // 创建一个div 存放水波纹效果
    $('body').append('<div id="gifDiv">' +
      '<div style=""  class="taper"></div>' +
      '<div style="" class="wave_container wave_red">\n' +
      '    <div class="_wave _wave1"></div>\n' +
      // '    <div class="_wave _wave2"></div>\n' +
      // '    <div class="_wave _wave3"></div>\n' +
      '</div>' +
      '</div>');
    const contentTemplate11 = document.getElementById('gifDiv');
    const positionpoint: any = {
      x: point.x * 1,
      y: point.y * 1,
    };
    const overlay = new g2.widget.OverLay({
      id: 'earCenterLayer',
      stopEvent: false,
      element: contentTemplate11, // dom元素对象
      position: positionpoint, // 覆盖物在地图上停靠的位置
      offset: [-14, -60], // 位置偏移量，根据覆盖物上展示的图标符号的大小来确定
    });
    overlayWare.add(overlay);
  },
  // 清除水波纹效果
  _removeWaveEffect() {
    $('#gifDiv').remove();
  },
  _fireEffect(point: any) {
    const self = this;
    // 创建一个overlayWare
    const overlayWare = new g2.widget.OverlayWare({
      map: self.map,
    });
    // 创建一个div 存放火点效果
    $('body').append('<div id="gifDiv">' +
      '<div style=""  class="taper"></div>' +
      '</div>');
    const contentTemplate11 = document.getElementById('gifDiv');
    const positionpoint: any = {
      x: point.x * 1,
      y: point.y * 1,
    };
    const overlay = new g2.widget.OverLay({
      id: 'earCenterLayer',
      stopEvent: false,
      element: contentTemplate11, // dom元素对象
      position: positionpoint, // 覆盖物在地图上停靠的位置
      offset: [-14, -60], // 位置偏移量，根据覆盖物上展示的图标符号的大小来确定
    });
    overlayWare.add(overlay);
  },
  _typhoonEffect(point: any) {
    const self = this;
    // 创建一个overlayWare
    const overlayWare = new g2.widget.OverlayWare({
      map: self.map,
    });
    // 创建一个div 存放火点效果
    $('body').append('<div id="gifDiv">' +
      '<div style=""  class="typhoonicon"></div>' +
      '</div>');
    const contentTemplate11 = document.getElementById('gifDiv');
    const positionpoint: any = {
      x: point.x * 1,
      y: point.y * 1,
    };
    const overlay = new g2.widget.OverLay({
      id: 'earCenterLayer',
      stopEvent: false,
      element: contentTemplate11, // dom元素对象
      position: positionpoint, // 覆盖物在地图上停靠的位置
      offset: [-10, -10], // 位置偏移量，根据覆盖物上展示的图标符号的大小来确定
    });
    overlayWare.add(overlay);
  },
  _commonEvent(opts: any) {
    this._showResourcesOnMap('event', opts.item);
  },
  // 地图上叠加数据
  _showResourcesOnMap(key: string, dataCol: any) {
    const self: any = this;
    this.options.simpleRenderMgr.remove('push_' + key);
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
      featureType: 'push_' + key,
      featureName: 'push_' + key,
      idField: 'eventid',
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
  _clearLayers() {
    this.options.simpleRenderMgr.remove('push_event');
    this._clearPopup();
  },
});

export default component;
