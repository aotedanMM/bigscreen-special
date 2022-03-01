import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';

/**
 * 树种结构图层
 */
export default class ForestTreeStructureLayer extends SimpleRenderMgrLayer {
    public load(params: any): void {
        const conf = this.options.serviceConfig.mapservice.forestTreeStructureLayer.tileLayer || {};
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
