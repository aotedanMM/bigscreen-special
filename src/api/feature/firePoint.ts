import {RequestServerClass} from '../../util/request';

/* 危化企业基本信息html模板*/
export class FirePointServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 获取火点列表数据
    public getFirePointListDataServer(obj: any) {
        const url = '/api/monitoring/v1/getMonitoringHotspotList';
        return this.rSerivce.serverObj.post(url, obj);
    }

    // 获取火点统计数据
    public getFirePointcountServer() {
        const url = '/api/monitoring/v1/getMonitoringHotspotStatistical';
        return this.rSerivce.serverObj.post(url);
    }

}
