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
                    id: element.id,
                    name: attrObj.name || attrObj.NAME,
                    level: attrObj.LEVEL,
                    geom,
                };
                if (result.level && self.radiusMap[result.level]) {
                    result.radius = self.radiusMap[result.level];
                }
                self.getProvinces(geom).then((provinces: any) => {
                    result.provinces = provinces;
                    self.fire(self.clickEventName, result);
                });
                // self.fire(self.clickEventName, result);
            }
        };
        this.simpleRenderMgr.on('click', this.clickListener);
    }
    private getProvinces(geom: any) {
        const url = 'api/public/dlgbouasheng/bypac/v1';
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
        const polygon = Geometry.asWkt();
        const center = '117 35';
        const data: any = {
            polygon,
            center,
        };
        return new Promise((resolve, reject) => {
            const result: any = [];
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                const res = response.data;
                res.data.forEach((province: any) => {
                    const record = {
                        districtName: province.tag.name,
                        districtCode: province.tag.adcode,
                    };
                    result.push(record);
                });
                resolve(result);
            });
        });
    }
}
