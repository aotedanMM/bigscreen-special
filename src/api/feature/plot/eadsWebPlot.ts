import {RequestServerClass} from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class EadsWebPlot {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
    // 支撑屏点击保存后的保存接口
    public save(data: any) {
        const url = '/api/eventDynamic/v1/saveEvent';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 推送并保存
    public addDataPush(data: any) {
        const url = '/api/eventDynamic/v1/saveEventAndPush';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 编辑后保存
    public editSave(data: any) {
        const url = '/api/eventDynamic/v1/updateEvent';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 删除
    public deletFn(data: any) {
        const url = '/api/eventDynamic/v1/deleteById';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 列表
    public queryList(data: any) {
        const url = '/api/eventDynamic/v3/findAllByType';
        return this.rSerivce.serverObj.post(url, data);
    }
}
