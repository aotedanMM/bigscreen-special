// 灾损统计行政区划
import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  options: {
    service: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.currrentDistrictData = null;
    this.districtList = null;

    this.map = options.map;
    this.mapConfig = options.mapConfig;
    this.symbolConfig = options.symbolConfig;
    this.toolTipWare = new g2.widget.TooltipWare({
      map: this.map,
    });
    this.service = options.service;
    //
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.type = ''; // 判断是乡镇、区县标识
    // do sth
  },
  /**
   *
   * @param country 行政区划数组
   * @param type country:区县，town:乡镇
   */
  // tslint:disable-next-line:no-empty
  load(country: any[], type: any) {
  },
  // 卸载
  unload() {
    this.clearAll();
    componentBase.prototype.unload.call(this);
  },
  getdem(opt: any) {
    return new Promise((resolve, reject) => {
      const layernames = [this.options.service.DEMLayer];
      let finishCount = 0;
      const result = {};
      const queryCallback = (dataObj: any, idx: any) => {
        finishCount++;
        if (dataObj.entities && dataObj.entities.length > 0) {
          (result as any).haiba = dataObj.entities[0].properties[0].value;
        }
        if (finishCount === layernames.length) {
          this.tmpHaiBaResult = result;
          resolve(result);
        }
      };
      let index: any = 0;
      layernames.forEach(async (layername: any) => {
        const ep = opt;
        const restHttp = new g2.core.RestHttp();
        this.RestWMSService = new g2.ews.RestWMSService({
          url: layername.tileLayer.url.split('/wms')[0],
          http: restHttp,
          deserializer: new g2.core.Deserializer(),
        });
        const screenPt = this.map.getPixelFromCoordinate(ep);
        const viewSize = this.map.getViewSize();
        const featureInfoInput = new g2.ews.FeatureInfoInput({
          layers: layername.tileLayer.layers,
          crs: 'EPSG:4326',
          bbox: this.map.getExtent().miny + ',' + this.map.getExtent().minx + ',' + this.map.getExtent().maxy + ',' + this.map.getExtent().maxx,
          // bbox: '123.2666015625,43.21289040148258,132.1435546875,52.08984352648258',
          width: viewSize[0],
          height: viewSize[1],
          query_layers: layername.tileLayer.layers,
          info_format: 'application/json',
          i: Math.ceil(screenPt[0]),
          j: Math.ceil(screenPt[1]),
        });
        const indexTemp: any = index;
        this.RestWMSService.getFeatureInfo(featureInfoInput).then(function(data: any) {
          console.log(data);
          queryCallback(data, indexTemp);
        });
        index++;
      });
    });
  },
});
export default component;
