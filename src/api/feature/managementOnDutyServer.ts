import {RequestServerClass} from '../../util/request';

/* 值班信息的接口*/
export class ManagementOnDutyServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getData(date: string) {
        // const url = `/api/duty/${date}/info/v1`
        // const url = './json/dutyInfo.json';
        const url = '/api/duty/' + date + '/info/v1';
        return this.rSerivce.serverObj.get(url);
    }

    public getDataHall(date: string) {
        // const url = `/api/duty/${date}/info/v1`
        const url = './json/dutyInfoSub.json';
        return this.rSerivce.serverObj.get(url);
    }
}
