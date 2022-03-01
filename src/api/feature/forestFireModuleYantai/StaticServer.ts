import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 防汛服务
export class StaticServer {
    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 获取山东省geoJson
    public getGeoJson() {
      const url = './json/forestFire/geoJson.json';
      return this.rSerivce.serverObj.get(url);

    }
}

