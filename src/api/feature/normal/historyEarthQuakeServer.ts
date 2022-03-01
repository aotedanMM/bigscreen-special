// 事件回显到新的支撑屏

import {RequestServerClass} from '../../../util/request';

/* 预警信息*/
export class HistoryEarthQuakeServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
    // 获取事件类型
    public getHistoryEarthQuakeData(opts: any) {
        const url = '/api/event/earthquakeinformation/list/v3';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
              resolve(response.data.data);
            }, (err: any) => {
              reject(err);
            });
          });
    }
}
