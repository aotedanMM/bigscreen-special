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
    highLightId: 'FirePointQuery', // 高亮id
    popupId: 'FirePointQuery_popup_id',
    popupEventId: 'FirePointQuery_popup', // 添加弹窗后执行事件id
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
    this._clearAll();
    ComponentBase.prototype.unload.call(this);
  },

  removeResource(type: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    this.simpleRenderMgr.remove(featureType);
    this._removeHighlight();
    this.closePopup();
    this.displayedFeature[type] = false;
  },
  _clear(type: any, featureInfo: any) {
    this.featureHighlight.removeHighlight('gj');
    if (type === 'firePointToday') {
      featureInfo.map((item: any) => {
        this.featureHighlight.removeHighlight(item.id);
      });
    } else if (type === 'historyFire') {
      this.simpleRenderMgr.remove('historyFire');
    }
  },
  /**
 * 清除弹出框
 */
  clearPopup() {
    this.popupManager.remove(this.options.popupId);
    this.popupManager.clear();
  },
  _clearAll() {
    this.simpleRenderMgr.remove('historyFire');
    this.clearPopup();
    this.featureHighlight.clearHighlight();
  },
  _showResource(type: any, featureInfo: any) {
    if (type === 'firePointToday') {
      this._showFirePoint(type, featureInfo);
    } else if (type === 'historyFire') {
      this._showResourcesOnMap(type, featureInfo);
    }
  },
  _showFirePoint(type: any, featureInfo: any) {
    const self = this;
    featureInfo.map((item: any) => {
      // tslint:disable-next-line: variable-name
      const _id = item.id;
      const options = {
        data: {
          type: 'wkt',
          geom: 'POINT(' + item.x + ' ' + item.y + ')',
        },
        style: {
          type: 'Custom',
          options: {
            // 自定义dom结构
            content: '<div id=\'' + _id + '\'><img src=\'./imgs/firePoint.gif\'/></div>',
            offsetx: -17,
            offsety: -46,
          },
        },
      };
      self.featureHighlight.addHighlight(_id, options);
      $('#' + _id).on('click', (event: any) => {
        featureInfo.map((item1: any) => {
          if (item1.id === event.target.parentElement.id) {
            self.closePopup(); // 关闭弹窗
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
                  content: '<div><img src=\'./imgs/firePoint_hover.gif\'/></div>',
                  offsetx: -17,
                  offsety: -46,
                },
              },
            };
            self.featureHighlight.addHighlight('gj', options2);
            self.hideGJ = item1.id;
            $('#' + item1.id).hide();
            this.map.pan(new g2.sfs.Point({
              x: item1.x,
              y: item1.y,
              spatialReference: this.map.spatialReference,
            }));
            this.map.zoomTo(13);
          }
        });
      });
    });
  },
  _clearFirePointToday(id: any) {
    $('#' + id).remove();
  },
  /**
   * 添加数据到图层
   * @param type 类型
   * @param featureInfo 符号
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
        symbolObj.options.source = self.symbolConfig.icons[symbolMapper.iconFn(type)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType: type,
      featureName: '火点',
      idField: 'id',
      list: featureInfo,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
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
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
    this.simpleRenderMgr.add(opts);
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
  _addItemHight(type: any, item: any) {
    if (type === 'firePointToday') {
      this.featureHighlight.removeHighlight('gj');
      const options2 = {
        data: {
          type: 'wkt',
          geom: 'POINT(' + item.x + ' ' + item.y + ')',
        },
        style: {
          type: 'Custom',
          options: {
            // 自定义dom结构
            content: '<div><img src=\'./imgs/firePoint_hover.gif\'/></div>',
            offsetx: -17,
            offsety: -46,
          },
        },
      };
      this.featureHighlight.addHighlight('gj', options2);
      this.hideGJ = this.id;
    } else if (type === 'historyFire') {
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
          geom: 'POINT(' + item.x + ' ' + item.y + ')',
        },
        style: symbolObj,
        blink: {
          enable: false,
        },
      };
      this.featureHighlight.addHighlight(this.options.highLightId, options);
    }
    this.addPopup(item, [item.x, item.y], false, type);
    this.map.pan(new g2.sfs.Point({
      x: item.x,
      y: item.y,
      spatialReference: this.map.spatialReference,
    }));
    this.map.zoomTo(13);
  },
  // 关闭弹窗
  closePopup() {
    // 清除上一次的高亮
    this._removeHighlight();
    this.popupManager.remove(this.options.popupId);
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
  // 移除高亮
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
    this.featureHighlight.removeHighlight('gj');
    $('#' + this.hideGJ).show();
  },
});
export default component;
