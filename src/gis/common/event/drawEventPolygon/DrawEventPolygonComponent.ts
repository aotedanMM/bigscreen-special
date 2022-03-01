// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {},
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    //
    this.featureType = 'drawEventPolygon';
  },
  //  销毁
  destroy() {
    // dosth
    this.simpleRenderMgr = null;
    this.featureLocate = null;
    componentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   * @param noFitView 是否不调整视野，默认为false
   */
  load(noFitView: boolean = false) {
    componentBase.prototype.load.call(this);
    this._doLoad(noFitView);
  },

  unload() {
    this.clear();
    componentBase.prototype.unload.call(this);
  },

  reload(noFitView: boolean = false) {
    // if (this.isLoaded()) {
      this._doLoad(noFitView);
    // }
  },

  _doLoad(noFitView: boolean = false) {
    this.clear();
    this._render(this.type, noFitView);
  },
  clear() {
    this.options.simpleRenderMgr.remove(this.featureType);
  },
  setVisible(visible: boolean) {
    this.options.simpleRenderMgr.setVisible(this.featureType, visible);
  },
  _render(noFitView: boolean = false) {
    if (this.options.eventInfo.getEventInfo()) {
      this.options.simpleRenderMgr.remove(this.featureType);
      const drawFn: any = (this as any)[`_drawRangesType`];
      if (drawFn) {
        drawFn.call(this);
      }
      if (noFitView !== true) {
        // fit view
        this.options.featureLocate.fit({
          type: 'geojson',
          geom: this.options.eventInfo.getGeometry(),
        });
      }
    }
  },

  /**
   * 绘制影响圈
   */
  _drawRangesType() {
    const geometry: any = this.options.eventInfo.getGeometry();
    const list = [{
      id: 'drawEventPolygon',
      geometry,
    }];
    let eventPolygonSymbol: any = this.options.symbolConfig.symbols.common
      .eventPolygon;
    if (this.options.eventInfo.getType() === '10') { // 如果是台风事件
      eventPolygonSymbol = this.options.symbolConfig.symbols.common
      .typhoonPolygon;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (content: any) => {
        return G.utils.RenderUtil.object2Symbol(eventPolygonSymbol);
      },
    });
    const opts = {
      featureType: this.featureType,
      featureName: '事件多边形',
      idField: 'id',
      list,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geometry'],
        geometryType: 'polygon',
      }),
      symbolBuilder: new SymbolBuilder(),
    };
    this.options.simpleRenderMgr.add(opts);
  },
});
export default component;
