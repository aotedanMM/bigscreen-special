import {RequestServerClass} from '../../util/request';
import { IEventinfoParam } from '@/interface/feature/earthquake/Eventinfo.interface';

export class EventInfoServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        // console.log(opt);
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getListData() {
        const url = './5dccb8d641d4297859eab1ad/JCYFJS2019007/eventinfo';
        return this.rSerivce.serverObj.post(url);
    }
    public getEventInfo(data: any) {
        const url = '/api/event/accident/express/list/v3';
        // return this.rSerivce.serverObj.post(url, data);
        const self = this;
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((res: any) => {
                // if (data.pageSize && data.nowPage) {
                //     data.pageSize = parseInt(data.pageSize + '', 10);
                //     data.nowPage = parseInt(data.nowPage + '', 10);
                //     res.data = self.processPage(res.data, data.pageSize, data.nowPage);
                // }
                resolve(res);
            });
        });
    }
    public getEventInfoList(data: any) {
        const url = '/api/event/accident/express/page/list/v1';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 获取收藏列表的数据
    public getCollectionList(data: any) {
        const url = '/api/event/v1/collect/list';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 收藏事件
    public getAddCollection(data: any) {
        const url = '/api/event/v1/collect/addEventInfo';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 删除事件
    public getDeleteCollection(data: any) {
        const url = '/api/event/v1/collect/deleteEventInfo';
        return this.rSerivce.serverObj.post(url, data);
    }
    // 收藏查询
    public getSearchCollection(data: any) {
        const url = '/api/event/getEventInfoCollect/v1';
        return this.rSerivce.serverObj.post(url, data);
    }

    /**
     * 分页信息处理
     * @param data
     */
    private processPage(data: any, pageSize: number, pageIndex: number) {
        const total = data.length;
        const starter = pageSize * (pageIndex - 1);
        let ender = pageSize * pageIndex;
        ender = ender > total ? total : ender;
        const res = data.slice(starter, ender);
        data = {
            list: res,
            total,
        };
        return data;
    }
}
