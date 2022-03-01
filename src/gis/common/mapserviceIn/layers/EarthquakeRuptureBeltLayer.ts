import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';

/**
 * 地震断裂带
 */
export default class EarthquakeRuptureBeltLayer extends SimpleRenderMgrLayer {
    public load(params: any): void {
        const conf = this.options.serviceConfig.mapservice.earthquakeRuptureBeltLayer.tileLayer || {};
        this.featureType = conf.featureType;
        this.clickEventName = params.clickEventName;
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
        this.initLayer(conf);
        this.map.getLayerById(conf.id).setZIndex(9);
        if (params.clickEventName) {
            this.clickEventName = params.clickEventName;
            this.initEvent();
        }
    }
}
