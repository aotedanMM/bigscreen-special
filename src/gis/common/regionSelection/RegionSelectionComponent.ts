// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  options: {
    map: null,
    service: null,
    featureLocate: null,
    featureHighlight: null,
    simpleRenderMgr: null,
    district: {
      root: '',
    }, // 默认行政区划代码
  },
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.service = options.service;
    this.featureLocate = options.featureLocate;
    this.featureHighlight = options.featureHighlight;
    this.simpleRenderMgr = options.simpleRenderMgr;
    this.regionCache = {};
    this.toolTipWare = new g2.widget.TooltipWare({
      map: this.map,
  });
  },

  load() {
    componentBase.prototype.load.call(this);
  },
  unload() {
    this.clearAll();
    componentBase.prototype.unload.call(this);
  },

/**
 * 根据code绘制区域
 * @param code
 */
  drawRegion(code: any) {
    const self = this;
    self.clearAll();
    this._getRegionData(code).then((data: any) => {
      self.drawRegionFromData(data);
    });
  },
  drawRegionFromData(data: any) {
    // 绘制多边形
    this._showPolygon(data);
    // 绘制标注(烟台市或者烟台市下属的区县都不显示标注)
    if (this.options.district.root !== data.districtcode && this.options.district.root !== data.parentcode) {
      this._showLabel(data);
    }
    this._locateRegion(data);
  },
  clear() {
    this.clearAll();
  },
  clearAll() {
    this.toolTipWare.clear();
    this.simpleRenderMgr.remove('region_border');
  },
  fullExtent() {
    this.map.fullExtent();
  },
  /**
   * 获取区域数据
   * @param code
   */
  _getRegionData(code: any) {
    const self = this;
    const opt = {
      districtcode: code,
    };
    return new Promise((resolve, reject) => {
      if (self.regionCache[code]) {
        resolve(self.regionCache[code]);
      }
      self.service.getDistrictByCode(opt).then((data: any) => {
        self.regionCache[code] = data.data;
        resolve(self.regionCache[code]);
      }).catch((err: any) => {
        reject(err);
      });
    });
  },

  /**
   * 绘制多边形
   * @param data
   */
  _showPolygon(data: any) {
    const symbol = new g2.sfs.SimpleFillSymbol({
      borderColor: new g2.sfs.Color({
          r: 0,
          g: 222,
          b: 255,
          a: 255,
      }),
      fillColor: new g2.sfs.Color({
          r: 0,
          g: 222,
          b: 255,
          a: 50,
      }),
      opacity: 0.9,
      borderThickness: 2,
      style: 5,
    });
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (res: any) => {
        return symbol;
      },
    });
    const geometryBuilder = new (G as any).utils.GeometryBuilder({
      geometryField: ['wkt'],
      geometryType: 'Polygon',
    });
    const opts = {
      featureType: 'region_border',
      featureName: '区划面',
      idField: 'districtcode',
      list: [data],
      geometryBuilder,
      symbolBuilder: new SymbolBuilder(),
    };
    this.simpleRenderMgr.add(opts);
  },

  /**
   * 绘制标注
   * @param data
   */
  _showLabel(data: any) {
    const center = { x: data.longitude, y: data.latitude};
    const name = data.districtname;
    const contentTemplate = '<div>' +
        '<label style=" width:auto; text-align: center;height: 45px;color: #fefefe;padding: 1px 10px 1px 10px; background: rgba(24, 62, 80, 0.60); border: solid 2px #37e0f5; border-radius: 5px;font-size: 24px;font-family: "Microsoft Yahei" , "Arial", "Simsun";">' +
        name +
        '</label>' +
        '</div>';
    // 创建提示框
    const tooltip = new g2.widget.Tooltip({
        anchor: center, // 提示工具在地图上停靠的位置
        content: contentTemplate, // 提示的内容
        layerId: this.map, // 提示工具所在图层ID
        offset: [-44, 0], // 位置偏移量
    });
    // 将提示框加入到信息管理类对象中，显示提示信息
    this.toolTipWare.add(tooltip);
  },
  /**
   * 区域定位
   * @param data
   */
  _locateRegion(data: any) {
    const fitOpts = {
      type: 'wkt',
      geom: data.wkt,
    };
    this.featureLocate.fit(fitOpts);
  },
});
export default component;
