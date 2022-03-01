
import {RequestServerClass} from '../../util/request';

export class ProgressSituationServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getDatas() {
        const url = 'json/moduleGJson/progressSituation.json';
        return this.rSerivce.serverObj.get(url);
    }

}
