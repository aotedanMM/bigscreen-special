// 灾情研判指挥调度
import Util from '../../Util';
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
    serviceConfig: null,
    featureType: 'risk_Layer',
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    this.map = options.map;
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.symbolConfig = options.symbolConfig;
    this.serviceConfig = options.serviceConfig;
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
    this.featureHighlight = null;
    this.featureTypeSet = null;
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
    this._clear();
    ComponentBase.prototype.unload.call(this);
  },
  // 获取服务数据
  getServerData() {
    const self = this;
    return new Promise(async (resolve, reject) => {
      self.options.arrData = [];
      const opts = {
        num: 13,
        type: 'fourColor',
      };
      this.service.floodRiskServer.getModelData(opts).then((res: any) => {
        res.reverse();
        self.options.arrData = res;
        resolve(res);
      });
    });
  },
  getTimeInfo() {
    return this.getServerData();
  },
  // 添加imagelayer、
  _add_ImageLayer() {
    const exTend: any = this.options.arrData[0].pahe; // this.options.arrData[0].pahe;
    const imgUrl: any = this.serviceConfig.floodServer + '/' + this.options.arrData[0].img;
    const imageLayer: any = new g2.carto.ImageLayer({
      id: this.options.featureType,
      name: 1,
      imageType: 702,
      extent: exTend,
      url: imgUrl,
      opacity: 0.8,
      crossOrigin: null, // 跨域
    });
    this.map.addLayer(imageLayer);
  },
  // 播放
  _play(index: any) {
    const self = this;
    const exTend: any = this.options.arrData[index].pahe;
    const imgUrl: any = this.serviceConfig.floodServer + '/' + this.options.arrData[index].img;
    const imageLayer = self.map.findLayer(this.options.featureType);
    if (imageLayer) {
      imageLayer.setSource(new g2.carto.ImageStatic({
        extent: exTend,
        url: imgUrl,
        opacity: 0.8,
      }));
    } else {
      // 加载图片
      const newImageLayer = new g2.carto.ImageLayer({
        id: this.options.featureType,
        name: '图片图层',
        imageType: 702,
        extent: exTend,
        url: imgUrl,
        opacity: 0.8,
        crossOrigin: null, // 跨域
      });
      this.map.addLayer(newImageLayer);
    }
  },
  _clear() {
    const tempLayer = this.map.getLayerById(this.options.featureType);
    if (tempLayer) {
      this.map.removeLayer(tempLayer);
    }
  },
});
export default component;
