import { RequestServerClass } from '../../util/request';
import { ITreeDetailsParam } from '../../interface/feature/earthquake/TreeDetail.inerface';

/* 预警信息*/
export class TreeDetailServerServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getData(data: ITreeDetailsParam) {
        const url = '/api/event/type/statistics/v1';
        return this.rSerivce.serverObj.post(url, data);
    }
}
