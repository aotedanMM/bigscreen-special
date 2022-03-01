import {RequestServerClass} from '../../../util/request';

export class RiskHazardServerServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
    // 地灾隐患点
    public getLatentDangera() {
        const url = './5dccb8d641d4297859eab1ad/JCYFJS2019007/riskHazard/latentDanger';
        return this.rSerivce.serverObj.post(url);
    }

    // 重点企业
    public getEnterprise() {
        const url = './5dccb8d641d4297859eab1ad/JCYFJS2019007/riskHazard/enterprise';
        return this.rSerivce.serverObj.post(url);
    }

     // 重点设施接口
     public getInstallation() {
        const url = './5dccb8d641d4297859eab1ad/JCYFJS2019007/riskHazard/installation';
        return this.rSerivce.serverObj.post(url);
    }

}
