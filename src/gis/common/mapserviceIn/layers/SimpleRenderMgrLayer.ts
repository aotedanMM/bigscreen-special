import BaseLayer from './BaseLayer';
import Util from '@/gis/Util';
/**
 * tsemap  SimpleRenderMgr图层
 */
export default class SimpleRenderMgrLayer extends BaseLayer {
    // 加载资源名称
    public featureType: any = null;
    // 点击事件名称
    public clickEventName: any = null;
    public load(params: any): void {
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
    }
    public unload(): void {
        if (this.clickEventName) {
            this.unbindClickEvent();
        }
        this.simpleRenderMgr.remove(this.featureType);
        this.simpleRenderMgr.unload();
    }

    public setVisible(visible: boolean): void {
        this.simpleRenderMgr.setVisible(this.featureType, visible);
    }
    public createRenderer(params?: any) {
        const simpleRenderMgr = new G.render.SimpleRenderMgr({
            map: this.map,
        });
        return simpleRenderMgr;
    }

    public initLayer(params: any) {
        const opts = {
            featureType: params.featureType, // 指定数据类型
            featureName: params.featureType, // 数据类型说明
            geometryType: params.geometryType,
            layerOptions: {
                id: params.id || 'WMSLayer',
                name: params.id || 'WMSLayer',
                url: params.url,
                layers: params.layers,
                opacity: params.opacity || 1,
                tileType: params.tileType || 101,
                projection: 'EPSG:4326',
                visible: true,
            },
        };
        this.simpleRenderMgr.remove(params.featureType);
        if (this.clickEventName) {
            this.unbindClickEvent();
        }
        this.simpleRenderMgr.addWMS(opts);
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
                    id: element.id,
                    name: attrObj.name || attrObj.NAME,
                    level: attrObj.LEVEL,
                    geom,
                };
                self.fire(self.clickEventName, result);
            }
        };
        this.simpleRenderMgr.on('click', this.clickListener);
    }

    public unbindClickEvent() {
        this.simpleRenderMgr.off('click', this.clickListener);
    }
}
