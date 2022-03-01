import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';

/**
 * 流域图层
 */
export default class WatershedLayer extends SimpleRenderMgrLayer {
    public load(params: any): void {
        const conf = this.options.serviceConfig.mapservice.watershedLayer.tileLayer || {};
        this.featureType = conf.featureType;
        this.clickEventName = params.clickEventName;
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
        this.initLayer(conf);
        if (params.clickEventName) {
            this.clickEventName = params.clickEventName;
            this.initEvent();
        }
    }
}
