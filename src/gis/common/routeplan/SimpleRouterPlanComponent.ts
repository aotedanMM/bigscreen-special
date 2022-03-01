import symbols from './symbols';
// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  options: {
    server: {
      server: '',
      clientId: '',
      clientSecret: '',
      tokenServer: '',
    },
    lineSymbol: {
      type: 'SimpleLineSymbol',
      options: {
          width: 8,
          color: {
              a: 255,
              r: 255,
              g: 204,
              b: 0,
          },
          style: 5,
          followModel: false,
      },
    },
    layerOptions: {
      id: 'simple-router',
      name: '简单路径规划',
      layers: [],
      zIndex: 15,
    },
  },
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    //
    this.layer = new g2.carto.GroupLayer(this.options.layerOptions);
    this.layerSet = {};
    //
    this.WRPSService = new g2.ews.RestWRPSService({
        url: this.options.server.server + 'egis/base/v1', // 服务
        clientId: this.options.server.clientId, // 用户id
        clientSecret: this.options.server.clientSecret, // 用户密码
        authType: 'Token', // 授权类型
        tokenUrl: this.options.server.tokenServer,
    });
  },

  load() {
    if (!this.isLoaded()) {
      this.map.addLayer(this.layer);
    }
    componentBase.prototype.load.call(this);
  },
  unload() {
    if (this.isLoaded()) {
      this.clear();
      this.map.removeLayer(this.layer);
    }
    componentBase.prototype.unload.call(this);
  },
  /**
   * @param opts
   * @param opts.id 唯一标识
   * @param opts.startPoint [x ,y] 起点
   * @param opts.endPoint [x ,y] 终点
   * @param opts.strategy
   * @param opts.showStartPoint {Boolean}
   * @param opts.showEndPoint {Boolean}
   */
  addRoute(opts: any) {
    return new Promise((resolve, reject) => {
      const drivingInput = new g2.ews.DrivingInput({
        origin: opts.startPoint[0] + ',' + opts.startPoint[1],
        destination: opts.endPoint[0] + ',' + opts.endPoint[1],
        strategy: opts.strategy || 1,
      });
      this.WRPSService.driving(drivingInput).then((data: any) => {
        const layer: any = new g2.carto.ElementLayer({
          id: opts.id,
          name: '',
          zIndex: this.options.layerOptions.zIndex,
        });
        const route = data.routes[0];
        const steps = route.steps;
        for (let i = 0, len = steps.length; i < len; ++i) {
          const step = steps[i];
          const path = step.path;
          const pathEle = new g2.sfs.Element({
            geometry: path,
            symbol: this._getLineSymbol(step),
          });
          layer.add(pathEle);
        }
        this.layerSet[opts.id] = layer;
        this.layer.addLayer(layer);
        // 显示起终点图标
        // this._fit();
        resolve({
          id: opts.id,
          route,
        });
      });
    });
  },
  removeRoute(id: any) {
    if (this.layerSet[id]) {
      this.layer.removeLayer(this.layerSet[id]);
      delete this.layerSet[id];
    }
  },
  // 清除所有
  clear() {
    this.layer.removeAllLayers();
    this.layerSet = {};
  },
  _getLineSymbol(step: any) {
    const color = new g2.sfs.Color({ a: 255, r: 0, g: 255, b: 36 });
    const symbol = new g2.sfs.SimpleLineSymbol({
      width: 9,
      color,
      style: 5,
    });
    // const symbol: any = G.utils.RenderUtil.object2Symbol(this.options.lineSymbol.type, this.options.lineSymbol.options);
    return symbol;
  },
  _fit() {
    const extent: any = G.utils.LayerUtil.getLayerExtent(this.layer);
    this.map.pan(extent, new Array(4).fill(100));
  },
});
export default component;
