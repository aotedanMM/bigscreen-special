
import {RequestServerClass} from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class NewWeatherServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
    // 未来24小时精细预报(第二个接口)
    public getJXYBDatas(type: any, districtCode: any) {
        const url = '/weatherdata/catchdata/weather/' + type + '?districtCode=' + districtCode ;
        return this.rSerivce.serverObj.get(url);
    }
}
