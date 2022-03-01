import {RequestServerClass} from '../../util/request';

/* 危化企业基本信息html模板*/
export class HazardoubaseinfoServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 获取危化企业的详情
    public getHazardoubaseinfoServer(id: string|number) {
        const url = '/api/decisionProgram/v1/getDangerEntInfoHtml?entId=' + id;
        return this.rSerivce.serverObj.get(url);
    }

    // 获取监控视频列表
    public getHazardouvideolistServer(param: any) {
        const url = 'api/hikVideo/v1/v1/getMonitoryPointListByRegCode?cameraindexcode=' + param.code + '&firmtype=' + param.firmtype;
        return this.rSerivce.serverObj.get(url);
    }


}
