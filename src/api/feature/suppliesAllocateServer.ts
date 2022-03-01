import {RequestServerClass} from '../../util/request';

/* 预警信息*/
export class SuppliesAllocateServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }

    public getData() {
        const url = './json/suppliesAllocate.json';
        return this.rSerivce.serverObj.get(url);
    }

}
