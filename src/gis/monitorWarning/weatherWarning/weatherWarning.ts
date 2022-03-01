import SymbolMap from '../windWaterRainWork/SymbolMap';
import Util from '../../Util';
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    map: null,
    mapConfig: null,
    symbolConfig: null,
    toolTipWare: null,
    weatherInfo: null, // 气象预警信息
    popupManager: null, // 信息弹窗
    service: null,
    commonDistrictServer: null,
    simpleRenderMgr: null,
    featureLocate: null,
    featureType: 'weatherWarningLayer',
    highLightId: 'weatherWarningLayerHL', // 高亮id
    popupId: 'weatherWarningLayer_popup_id', // 弹窗id
    popupEventId: 'weatherWarningLayer_popup', // 添加弹窗后执行事件id
  },

  /**
   * 初始化
   * @param options 参数
   */
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.map = options.map;
    this.mapConfig = options.mapConfig;
    this.symbolConfig = options.symbolConfig;
    this.toolTipWare = options.toolTipWare;
    this.service = options.service;
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
  },

  /**
   * 加载
   */
  load() {
    componentBase.prototype.load.call(this);

  },

  // 卸载
  unload() {
    // 清理所有地图数据，地图监听
    this.clearAll();
    componentBase.prototype.unload.call(this);
  },

  /**
   * 新增图层
   * @param opts
   * @param opts.type 预警类型（大风：11B06，暴雨：11B03，台风：11B01，雷电：11B14，地灾：11B37）
   * @param opts.level 预警级别，red,orange,yellow,blue
   */
  addResource(opts: any, data: any) {
    this.clearAll();
    this._getWeatherWarningList(opts);
  },
  // 移除图层
  removeResource() {
    this.clearAll();
  },
  // 获取气象预警数据
  _getWeatherWarningList(opts: any) {
    this.service.getWeatherWarningList(opts).then((res: any) => {
      this._showPointOnMap('weatherWarning', res.data);
    });
  },
  // 显示点数据
  _showPointOnMap(type: any, datalist: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    datalist.forEach((res: any) => {
      res.longitude = res.longitude * 1;
      res.latitude = res.latitude * 1;
    });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.symbolConfig.icons[symbolMapper.iconFn(builddata)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
      // buildClusterStyle: (builddata: any) => {
      //   return {
      //     clusterScatterSize: 10,
      //     clusterScatterLineSymbol: new g2.sfs.SimpleLineSymbol({
      //       color: new g2.sfs.Color({r: 255, g: 255, b: 0}),
      //       width: 3,
      //     }),
      //     // 是否点击散开
      //     clusterScatterOnClick: true,
      //     // 是否鼠标滑过散开
      //     clusterScatterOnMousemove: false,
      //     clusterLevel: 20,
      //     distance: 50,
      //   };
      // },
      // buildClusterStyleFn: () => {
      //   return (radius: any, size: any, maxFeatureCount: any, eles: any) => {
      //     // 创建通用符号
      //     const Distance = self._getDistance();
      //     let newRadius;
      //     let strokecolor;
      //     let fillcolor;
      //     if (Distance <= 160) {
      //       if (size > 1) {
      //         newRadius = 15;
      //         strokecolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 230 }); // 0.6
      //         fillcolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 250 }); // 0.6
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, true);
      //       }
      //     } else {
      //       if (size > 1 && size <= 10) {
      //         newRadius = 15;
      //         strokecolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 250 });
      //         fillcolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 170 }); // 0.4
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 10 && size <= 50) {
      //         newRadius = 18;
      //         strokecolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 250 });
      //         fillcolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 170 }); // 0.5
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 50 && size <= 100) {
      //         newRadius = 21;
      //         strokecolor = new g2.sfs.Color({r: 30, g: 144, b: 255, a: 250 });
      //         fillcolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 170 });  // 0.6
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 100 && size <= 200) {
      //         newRadius = 24;
      //         strokecolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 250 }); // 0.6
      //         fillcolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 170 }); // 0.7
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 200) {
      //         newRadius = 30;
      //         strokecolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 250 });
      //         fillcolor = new g2.sfs.Color({ r: 30, g: 144, b: 255, a: 170 }); // 0.8
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       }
      //     }
      //   };
      // },
    });
    const opts = {
      featureType: this.options.featureType,
      featureName: '气象预警监测图层',
      idField: 'id',
      list: datalist,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          this.closePopup(); // 关闭弹窗
          self._addHighlight(type, data[0].element);
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          // console.log(attributeObj);
          this.map.setCenter({ x: element.geometry.x, y: element.geometry.y });
          self.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
  },
  // 获取聚类点像素聚类
  _getDistance() {
    const clusterLayer = this.simpleRenderMgr.getLayer(this.options.featureType);
    const envelope = clusterLayer.getExtent();
    const minxPixel = this.map.getPixelFromCoordinate([envelope.minx, envelope.maxy]);
    const maxxPixel = this.map.getPixelFromCoordinate([envelope.maxx, envelope.miny]);
    const Distance = maxxPixel[0] - minxPixel[0];
    return Distance;
  },
  // 创建聚类符号
  _addclusterSymbol(size: number, radius: number, strokecolor: any, fillcolor: any, flag: boolean) {
    let image;
    if (flag) {
      image = new g2.sfs.SimpleMarkerSymbol({
        style: 'square',
        fillColor: fillcolor,
        size: radius,
        borderColor: strokecolor,
        borderThickness: 3,
      });
    } else {
      image = new g2.sfs.SimpleMarkerSymbol({
        size: radius,
        style: 'circle',
        fillColor: fillcolor,
        borderColor: strokecolor,
        borderThickness: 3,
      });
    }
    const style = new g2.sfs.CurrencySymbol({
      markerSymbol: image,
      textSymbol: new g2.sfs.TextSymbol({
        text: size.toString(),
        foreground: new g2.sfs.Color({ r: 255, g: 255, b: 255, a: 255 }),
        borderColor: new g2.sfs.Color({ r: 255, g: 255, b: 255, a: 255 }),
        fontFamilyName: '黑体',
        fontSize: 20,
        borderThickness: 1,
      }),
    });
    return style;
  },
  locatePoint(field: any, value: any) {
    const self = this;
    const type = 'weatherWarning';
    const layer = this.simpleRenderMgr.getLayer(this.options.featureType);
    if (!layer) {
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj[field] === value) {
          this.closePopup(); // 关闭弹窗
          this._addHighlight(type, element);
          this.addPopup(attributeObj, [element.geometry.x, element.geometry.y], false, type);
          this.map.setCenter({ x: element.geometry.x, y: element.geometry.y });
          break;
        }
      }
    }
  },

  // 是否非地图点击触发，点击地图触发时不居中定位
  addPopup(data: any, coordinate: any, noneMouseClick: any = true, type: any) {
    this.popupManager
      .addSimple({
        id: this.options.popupId,
        anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
        className: '',
        autoPan: !noneMouseClick,
      })
      .then((content: any) => {
        this.fire('weatherWarningLayer_popup', {
          data,
          containerId: content.containerId,
          id: content.containerId,
          type,
        });
      });
  },
  _addHighlight(type: any, element: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn()];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },
  // 移除高亮
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  /**
   *  清除所有
   */
  clearAll() {
    this.closePopup();
    this.clearLayers();
  },

  /**
   * 关闭弹窗
   */
  closePopup() {
    this._removeHighlight();
    this.popupManager.remove(this.options.popupId);
  },

  // 清除图层
  clearLayers() {
    this.simpleRenderMgr.remove(this.options.featureType);
  },

  /**
   * 根据图层id删除图层
   * @param id
   */
  removeLayer(id: string) {
    const layer = (G as any).utils.LayerUtil.getLayerById(this.map, id);
    if (layer) {
      this.map.removeLayer(layer);
    }
  },
});
export default component;
