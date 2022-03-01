import {RequestServerClass} from '../../../util/request';
// 重点物资需求
export class GoodsNeedServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
    // 重点物资需求
    public getGoodsNeedData() {
        const url = './5dccb8d641d4297859eab1ad/JCYFJS2019007/earthquake/goodsNeed';
        return this.rSerivce.serverObj.get(url);
    }
    // 重点物资需求预估
    public getGoodsneedPredictData() {
        const url = './5dccb8d641d4297859eab1ad/JCYFJS2019007/earthquake/goodsneedPredict';
        return this.rSerivce.serverObj.get(url);
    }
}
