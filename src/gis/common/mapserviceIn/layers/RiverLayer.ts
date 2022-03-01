import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';
import Util from '@/gis/Util';
import {RequestServerClass} from '@/util/request';

/**
 * 流域图层
 */
export default class RiverLayer extends SimpleRenderMgrLayer {
    private radiusMap: any = {
        1: 20,
        2: 10,
        3: 5,
        4: 3,
        5: 2,
    };
    public load(params: any): void {
        const conf = this.options.serviceConfig.mapservice.riverLayer.tileLayer || {};
        this.featureType = conf.featureType;
        this.clickEventName = params.clickEventName;
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
        this.initLayer(conf);
        if (params.clickEventName) {
            this.clickEventName = params.clickEventName;
            this.initEvent();
            const opt = {
                baseURL: this.options.serviceConfig.serverPath,
            };
            this.rSerivce = new RequestServerClass(opt);
        }
    }
    public initEvent() {
        const self = this;
        this.clickListener = function(event: any) {
            let result = event.list;
            if (result && result.length > 0) {
                const element = result[0].element;
                const geometry = element.geometry.geometry || element.geometry;
                const geom = geometry.asGeoJson();
                const attrObj: any = Util.attributeSet2Object(element.attributeSet);
                result = {
                    id: attrObj.riverid,
                    name: attrObj.hhmc,
                    geom,
                };
                self.fire(self.clickEventName, result);
            }
        };
        this.simpleRenderMgr.on('click', this.clickListener);
    }
}
