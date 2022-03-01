import {RequestServerClass} from '../../util/request';

/* 危化企业基本信息html模板*/
export class WebsoketServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 传到一线操作屏的服务
    public websoketServerInfoServer(obj: any) {
        const url = '/api/msg/push/lineOne/v1';
        return this.rSerivce.serverObj.post(url, obj);
    }

}
