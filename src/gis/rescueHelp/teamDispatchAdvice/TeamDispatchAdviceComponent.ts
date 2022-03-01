// 调拨建议
import Util from '../../Util';
import SymbolMap from './SymbolMap';
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    service: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    highLightId: 'rescue_help_rescue_dispatch_advice', // 高亮id
    popupEventId: 'popup_rescue_dispatch_advice', // 弹框id
    fireAddPopupEventId: 'firePopup_rescue_dispatch_advice', // 添加弹窗后执行事件id
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    this.eventInfo = options.eventInfo;
    this.symbolConfig = options.symbolConfig;
    this.simpleRenderMgr = options.simpleRenderMgr;
    this.popupManager = options.popupManager;
    this.featureLocate = options.featureLocate;
    this.featureHighlight = options.featureHighlight;
    this.pointGeometryBuilder = options.pointGeometryBuilder;
    this.simpleRouter = options.simpleRouter;
    this.featureTypeSet = {};
  },
  //  销毁
  destroy() {
    this.unload();
    this.eventInfo = null;
    this.simpleRenderMgr = null;
    this.symbolConfig = null;
    this.popupManager.clear();
    this.popupManager = null;
    this.featureLocate = null;
    this.featureHighlight.clearHighlight();
    this.featureHighlight = null;
    this.pointGeometryBuilder = null;
    this.featureTypeSet = null;
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load() {
    // todo
  },

  /**
   * 卸载
   */
  unload() {
    // todo
    this.clear();
    this.simpleRenderMgr.off('click');
    ComponentBase.prototype.unload.call(this);
  },

  // 地图添加队伍数据
  addTeamOnMap(team: any, batchNumber: number) {
    const self = this;
    this.removeTeam(team, batchNumber);
    const dataList = team.val;
    let symbolMapper: any = null;
    // if (SymbolMap[team]) {
    //   symbolMapper = SymbolMap[team];
    // } else {
    //   symbolMapper = SymbolMap.default;
    // }
    symbolMapper = SymbolMap.rescueteam;
    // const symbolObj = {
    //   width: 36,
    //   height: 48,
    //   offsetX: 0,
    //   offsetY: 0,
    //   opacity: 1,
    //   rotation: 0,
    //   // source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0Q1MkQ3MEEwRDk0MTFFNzk2NUM5MzQzODlFMzUxNjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q1MkQ3MEIwRDk0MTFFNzk2NUM5MzQzODlFMzUxNjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRDUyRDcwODBEOTQxMUU3OTY1QzkzNDM4OUUzNTE2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRDUyRDcwOTBEOTQxMUU3OTY1QzkzNDM4OUUzNTE2NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhNIWT8AAALVSURBVHjalFVNSxtRFD3REoiaCEIkTSJR6cZIEEyL1IpuVFyIpKZxl3/QtcH+gFLrtv0TndCmInWhgp+IaAzUbSVREiO4UYkLxWDveZ0ZJjJKPXB5b2buPe+++zWOu7s73Mfs7KxTlpgur0X8IjciRZGcyA+Rn6lU6ua+reM+oZC9leWzyAuPx4NAIICmpib1rVKpoFQq4fLyko9/RIQz9d2WUIjqZfkoMu3z+TA0NIT29nbYoVAoYG1tDaenp9AP/yDEVT48s+gpsr6+PgwODqKurg4PgQeFQiFFurOzM62/TpkeinfvZK/19vZiZGQET8HS0hL29/e5TYiX6XqXy8UE/GptbfVMTk7C4XAoxc3NTSwsLKCtrc2MIVGtVrG8vIxcLodwOIzOzk4cHh4yvm+2tra+8F4JkSBjZpCtrKygv78ffr8f29vbNR7t7e0pMq/X+y8JYkNbQUBkijGMNTQ0oKOjwzQ6OjpCOp3G+fk55AZgWGhYLBaxu7uLsbExRCIRU5/xbGxsxNXVVYwevmKQDe+IWCwGHuJ2u3FycoLFxUVcXFxgfn4e8XgcPT09NUmjLUkFL+mhj/VmRUtLC8bHx9We8cpms2qfTCbVIXbQOZ7zmBsG2g7X19eKPBqN4uDgABsbG7DrLCNZRh2WJUNuOzJN01RnjI6OKlJ6enZ2prwZGBgwE2N0Ebno4e/j4+Oak61kwWAQ3d3dGB4eVvvb21sVs0wmY+rTlhwsAhJmJDvI5/OmApUNskQiAafTqd6zHpubmzExMYGurq6aqiAHTUmocYqwjQwv6QWzZiUjWJssJSlgdWXDu/X1dW5L5DJaj8X9jXHi1Z4CSxVMSetpqpi4kWWOH1ZXVx/MpBXUoa5ONqdz1EybGRGXTI/3DDAnzmPji9csl8t8/KrbPjhg47J8+s8BO8MJ8+jEtvwCGFdO76je+Ebgs/ovQLP7BfwVYAD8dVci8Kr4dgAAAABJRU5ErkJggg==',
    // };
    // const symbol = (G as any).utils.RenderUtil.object2Symbol('PictureMarkerSymbol', symbolObj);
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn('', data)];
        // symbol.source = self.symbolConfig.icons['RescueTeam' + data.rescuetypecode + '_img'];
        if (!symbolObj.options.source) {
          console.log(data.rescuetypecode);
        }
        const symbol = (G as any).utils.RenderUtil.object2Symbol(symbolObj);
        symbol.typeCode = data.rescuetypecode;
        return symbol;
      },
    });
    const opts = {
      featureType: 'team_dispatch_advice' + batchNumber + '' + team.key,
      featureName: '队伍调拨建议',
      idField: 'id',
      list: dataList,
      geometryBuilder: new this.pointGeometryBuilder({ geometryField: ['longitude', 'latitude'] }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const attributeObj: any = Util.attributeSet2Object(data[0].element.attributeSet);
          self.locateSingleTeam(team.key, batchNumber, attributeObj.id);
          self.addHighlight(team.key, batchNumber, attributeObj.id);
          self.showPopup(team.key, batchNumber, attributeObj.id);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    // 记录展示的数据类型
    this.featureTypeSet[opts.featureType] = {};
  },
  // 查找满足条件的元素
  _findElement(teamKey: any, batchNumber: number, id: any) {
    const type = 'team_dispatch_advice' + batchNumber + '' + teamKey;
    const layer = this.simpleRenderMgr.getLayer(type);
    if (!layer) {
      return null;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj.id === id) {
          return element;
        }
      }
    }
  },
  // 添加元素高亮
  addHighlight(teamKey: any, batchNumber: number, id: any) {
    this.removeHighlight();   // 清除上一次的高亮
    const element = this._findElement(teamKey, batchNumber, id);
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.rescueteam;
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn('', element.symbol, 'typeCode')];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: symbolObj,
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },
  // 隐藏高亮
  removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },

  showPopup(teamKey: any, batchNumber: number, id: any) {
    const element = this._findElement(teamKey, batchNumber, id);
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
    const center = element.geometry.getBaryCenter();
    this.popupManager.clear();
    this.popupManager.addSimple({
      id: this.options.popupEventId,
      anchor: [center.x, center.y],
      className: 'TeamDispatchAdvice-tooltip',
    }).then((content: any) => {
      this.fire(this.options.fireAddPopupEventId, {
        data: attributeObj, // data[0].element.attributeSet.find('title').value,
        containerId: content.containerId,
        type: 'dispatchAdvice',
      });
    });
  },
  // 关闭弹框
  closePopup() {
    this.popupManager.remove(this.options.popupEventId);
    this.removeHighlight();
  },

  // 地图移除队伍类型数据
  removeTeam(teamKey: any, batchNumber: number) {
    // todo
    const type = 'team_dispatch_advice' + batchNumber + '' + teamKey;
    this.simpleRenderMgr.remove(type);
    delete this.featureTypeSet[type];
    // 清除高亮
    this.removeHighlight();
  },

  // 清空地图队伍数据
  clear() {
    // todo
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
    this.removeHighlight();
  },

  // 调整地图视野,在数据添加或移除完毕后调用
  fitMapView() {
    const arr = [];
    for (const featureType of Object.keys(this.featureTypeSet)) {
      const layer = this.simpleRenderMgr.getLayer(featureType);
      if (!layer) {
        continue;
      }
      if (layer.getLayerType() === 8 || layer.getLayerType() === 4) {
        for (const k of layer.elements) {
          if (!!k.geometry && !!k.geometry.x && !!k.geometry.y) {
            const sim = {
              type: 'wkt',
              geom: k.geometry.asWkt(),
            };
            arr.push(sim);
          }
        }
      }
    }
    if (arr.length > 0) {
      this.featureLocate.fit(arr);
    }
  },
  // 按批次类型定位队伍数据
  locateTeam(teamKey: any, batchNumber: number) {
    // todo
    const type = 'team_dispatch_advice' + batchNumber + '' + teamKey;
    const layer = this.simpleRenderMgr.getLayer(type);
    if (!layer) {
      return;
    }
    const arr = [];
    if (layer.getLayerType() === 8 || layer.getLayerType() === 4) {
      for (const k of layer.elements) {
        if (!!k.geometry && !!k.geometry.x && !!k.geometry.y) {
          const sim = {
            type: 'wkt',
            geom: k.geometry.asWkt(),
          };
          arr.push(sim);
        }
      }
    }
    if (arr.length > 0) {
      this.featureLocate.fit(arr);
    }
  },

  // 定位单一队伍数据
  locateSingleTeam(teamKey: any, batchNumber: number, id: any) {
    // todo
    const element = this._findElement(teamKey, batchNumber, id);
    if (!!element) {
      const locateObj = {
        type: 'wkt',
        geom: element.geometry.asWkt(),
      };
      this.featureLocate.fit([locateObj]);
    }
  },
  // 添加到事件点的路径规划
  addRoutePlan(teamKey: any, batchNumber: number, id: any) {
    const element = this._findElement(teamKey, batchNumber, id);
    const routeId = teamKey + '_' + batchNumber + '_' + id;
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
    this.simpleRouter.addRoute({
      startPoint: [attributeObj.longitude, attributeObj.latitude],
      endPoint: [this.eventInfo.getPoint()[0], this.eventInfo.getPoint()[1]],
      id: routeId,
    }); // 添加一个路径
  },

  // 移除到事件点的路径规划
  removeRoutePlan(teamKey: any, batchNumber: number, id: any) {
    const routeId = teamKey + '_' + batchNumber + '_' + id;
    this.simpleRouter.removeRoute(routeId);  // 移除一个路径
  },

  // 清除所有路径规划
  clearRoutePlans() {
    this.simpleRouter.clear(); // 清空所有
  },
});
export default component;
