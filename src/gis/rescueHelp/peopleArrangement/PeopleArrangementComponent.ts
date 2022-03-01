// 人员安置
import Util from '../../Util';
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    service: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    symbolConfig: null,
    highLightId: 'rescue_help_people_arrangement', // 高亮id
    popupId: 'popup_rescue_people_arrangement', // 点击弹窗的id
    fireAddPopupEventId: 'firePopup_rescue_people_arrangement', // 添加弹窗后执行事件id
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
    this.featureTypeSet = {};
    this.borderColor = { alpha: 255, r: 39, g: 161, b: 250 };
    this.fillColor = {
      three: { alpha: 180, r: 210, g: 58, b: 31 },
      two: { alpha: 180, r: 188, g: 95, b: 40 },
      one: { alpha: 180, r: 210, g: 140, b: 30 },
    };
    this.receivedDistricts = null;
    this.areaLevelCount = [];
  },
  /**
   * 卸载
   */
  unload() {
    // todo 清除所有图层、数据
    this.clearDistricts();
    this.receivedDistricts = null;
    this.areaLevelCount = [];
    this.simpleRenderMgr.off('click');
    ComponentBase.prototype.unload.call(this);
  },
  //  销毁
  destroy() {
    this.unload();
    this.eventInfo = null;
    this.simpleRenderMgr = null;
    this.symbolConfig = null;
    this.popupManager = null;
    this.featureLocate = null;
    this.featureHighlight.clearHighlight();
    this.featureHighlight = null;
    this.featureTypeSet = null;
    this.borderColor = null;
    this.fillColor = null;
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   * @param opts
   * @param opts.list 推送的数据
   */
  load(opts: any) {
    // todo
    // 根据推送的区划编码查询边界；
    if (!opts) {
      return;
    }
    const districtCodeArr: any[] = [];
    opts.event.list.forEach((element: any) => {
      districtCodeArr.push(element.districtCode);
    });
    const promise = this.options.service.getDistrictsByCodes({
      code: districtCodeArr,
      returnGeom: true,
    });
    const self = this;
    promise.then((districtArr: any) => {
      for (const district of districtArr) {
        for (const pushDistrict of opts.event.list) {
          if (district.code === pushDistrict.districtCode) {
            pushDistrict.geom = district.geom;
            pushDistrict.totalCapacityLeft = pushDistrict.totalCapacity - pushDistrict.totalCapacityPlaced;
            pushDistrict.totalPlacementLeft = pushDistrict.totalPlacement - pushDistrict.totalPlacementVictims;
            pushDistrict.placementPercentage = self._toPercent(pushDistrict.totalPlacement, pushDistrict.totalPlacementVictims);
          }
        }
      }
      self.areaLevelCount = opts.event.list;
      function compare(property: any) {
        return (obj1: any, obj2: any) => {
          const value1 = parseInt(obj1[property], 10);
          const value2 = parseInt(obj2[property], 10);
          return value1 - value2;
        };
      }
      self.areaLevelCount.sort(compare('totalPlacementLeft'));
      self.receivedDistricts = opts;
      self.addDistrictsOnMap(opts);
      self.locateDistricts();
    });
  },
  /**
   * 打开区县弹框
   * @param id 区县id
   */
  openPopup(id: any) {
    //
    this.popupManager.remove(this.options.popupId);
    this.hideDefaultPopup(id);
    const ele = this._findElement(id);
    const attributeObj: any = Util.attributeSet2Object(ele.attributeSet);
    const jtsPoint = G.utils.GeometryUtil.getGeoJSONReader().read(attributeObj.geom).getCentroid();
    this.popupManager.addSimple({
      id: this.options.popupId,
      anchor: [jtsPoint.coordinate.x, jtsPoint.coordinate.y],
      className: 'PeopleArrangement-tooltip',
      offset: [-265, -180],   // 详情框的位置，根据面板vue的宽高来确定
    }).then((content: any) => {
      this.fire(this.options.fireAddPopupEventId, {
        data: attributeObj, // data[0].element.attributeSet.find('title').value,
        containerId: content.containerId,
      });
    });
  },
  // 关闭区县弹框,还原展示效果
  closePopup() {
    //
    this.popupManager.remove(this.options.popupId);
    this.clearDistrictHl();
    this.hideDefaultPopup();
  },

  // 加载区县面数据
  addDistrictsOnMap(districts: any) {
    const self = this;
    this.clearDistricts();
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (district: any) => {
        const levelSymbol = self._generateSymbol(district);
        const finalSymbol = (G as any).utils.RenderUtil.object2Symbol(levelSymbol);
        // if (!!this.selectedDistrict && this.selectedDistrict.id === district.id) {
        //   finalSymbol.borderColor = new g2.sfs.Color({ r: 0, g: 255, b: 255, a: 255 });
        //   finalSymbol.borderThickness = 3;
        // }
        return finalSymbol;
      },
    });
    const opts = {
      featureType: districts.key,
      featureName: '人员安置点',
      idField: 'id',
      list: districts.event.list,
      geometryBuilder: new (G as any).utils.GeometryBuilder({ geometryField: ['geom'] }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (clickdata: any) => {
          const attributeObj: any = Util.attributeSet2Object(clickdata[0].element.attributeSet);
          // 点击时高亮显示面数据
          self.highLightDistrict(attributeObj.id);
          self.openPopup(attributeObj.id);
          // self.locateSingleDistrict(attributeObj.id);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[opts.featureType] = {};
    for (const district of districts.event.list) {
      const jtsPoint = G.utils.GeometryUtil.getGeoJSONReader().read(district.geom).getCentroid();
      this.popupManager.addSimple({
        id: 'default_popup_' + district.id,
        anchor: [jtsPoint.coordinate.x, jtsPoint.coordinate.y],
        // anchor: [district.x, district.y],
        className: 'PeopleArrangement-default-tooltip',
        offset: [-80, -40],   // 根据弹框box的宽高来确定
      }).then((content: any) => {
        // 这里根据弹出框的容器id来添加内容
        jQuery('#' + content.containerId).append('<p>' + '<span title=' + district.district + '>' +  district.district + '</span></p>' + ' 待安置' + district.totalPlacementLeft + '人');
      });
    }
  },
  // 清除行政区划面
  clearDistricts() {
    // todo
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
    this.clearDistrictHl();
    this.popupManager.clear();
  },
  // 查找满足条件的元素
  _findElement(id: string) {
    const type = this.receivedDistricts.key;
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

  // 定位到所有行政区划面
  locateDistricts() {
    // todo
    const type = this.receivedDistricts.key;
    const layer = this.simpleRenderMgr.getLayer(type);
    if (!layer) {
      return;
    }
    const arr = [];
    // 图层类型为聚类图层或者元素图层
    if (layer.getLayerType() === 8 || layer.getLayerType() === 4) {
      for (const k of layer.elements) {
        if (!!k.geometry) {
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

  // 根据行政区id定位指定的面
  locateSingleDistrict(id: string) {
    const element = this._findElement(id);
    if (!!element) {
      const locateObj = {
        type: 'wkt',
        geom: element.geometry.asWkt(),
      };
      this.featureLocate.fit([locateObj]);
    }
  },
  // 设置默认popup的显隐
  hideDefaultPopup(id: string) {
    const defaultPopupId = 'default_popup_' + id;
    for (const tooltip of this.popupManager.tooltipWare.tooltips) {
      if (tooltip.id === defaultPopupId) {
        this.popupManager.tooltipWare.show(tooltip.id, false);
      } else {
        this.popupManager.tooltipWare.show(tooltip.id, true);
      }
    }
  },
  // 高亮行政区划面
  highLightDistrict(districtId: string) {
    this.clearDistrictHl(); // 清除高亮显示
    const element = this._findElement(districtId);
    const options = {
      data: {
        type: 'wkt',
        geom: element.geometry.asWkt(),
      },
      style: {
        type: 'SimpleFillSymbol',
        options: {
          borderColor: {
            a: 255,
            r: 0,
            g: 255,
            b: 255,
          },
          fillColor: {
            a: element.symbol.fillColor.a,
            r: element.symbol.fillColor.r,
            g: element.symbol.fillColor.g,
            b: element.symbol.fillColor.b,
          },
          borderThickness: 3,
          style: 5,
          opacity: 1,
        },
      },
      // 不闪烁
      blink: {
        enable: false,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },

  // 清除高亮显示的面
  clearDistrictHl() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  _generateSymbol(district: any) {
    let symbol;
    const color = this._generateColor(parseInt(district.totalPlacementLeft, 10));
    const opts = {
      borderColor: this.borderColor,
      fillColor: color,
      borderThickness: 1,
      opacity: 1,
    };
    symbol = {
      type: 'SimpleFillSymbol',
      options: opts,
    };
    return symbol;
  },

  // 生成颜色值
  _generateColor(value: number) {
    let color; let start; let step; let max;
    start = parseInt(this.areaLevelCount[0].totalPlacementLeft, 10);
    max = parseInt(this.areaLevelCount[this.areaLevelCount.length - 1].totalPlacementLeft, 10);
    step = (max - start) / 3;
    if (value < (start + step)) {
      color = this.fillColor.one;
    } else if ((start + step) <= value && value <= (start + step * 2)) {
      color = this.fillColor.two;
    } else if ((start + step * 2) < value) {
      color = this.fillColor.three;
    }
    return color;
  },

  // 已安置人数的比例
  _toPercent(total: number, portion: number) {
    if (total === 0) {
      return;
    }
    const point = portion / total;
    let str = Number(point * 100).toFixed();
    str += '%';
    return str;
  },

});
export default component;
