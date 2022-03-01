// 事件回显到新的支撑屏

import {RequestServerClass} from '../../../util/request';

/* 预警信息*/
export class EventPushServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    public pushEventToServe(eventParam: any ) {
        const url = '/api/msg/push/v1';
        return this.rSerivce.serverObj.post(url, eventParam);
    }

    // 获取事件类型
    public getInfotypeCode() {
        const url = '/api/event/type/list/v1';
        return this.rSerivce.serverObj.get(url);
    }
}
