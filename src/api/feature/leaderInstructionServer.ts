import {RequestServerClass} from '../../util/request';

/* 领导批示信息*/
export class LeaderInstructionServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }

    public getData() {
        const url = './json/leaderInstruction.json';
        return this.rSerivce.serverObj.get(url);
    }

}
