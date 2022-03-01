import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';

/**
 * 森林资源图层
 */
export default class ForestResourceLayer extends SimpleRenderMgrLayer {
    public load(params: any): void {
        const conf = this.options.serviceConfig.mapservice.forestResourceLayer.tileLayer || {};
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
