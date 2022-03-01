import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';

/**
 * 地震带
 */
export default class EarthQuakeZoneLayer extends SimpleRenderMgrLayer {
    public load(params: any): void {
        const conf = this.options.serviceConfig.mapservice.earthQuakeZoneLayer.tileLayer || {};
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
