import { RequestServerClass } from '@/util/request';
import qs from 'qs';
import publishObjectPath from '@/util/configRegistry';

const BASEURL = publishObjectPath.value.ForestFireServer;


export class WildlandFireServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public analysis(param: string) {
        const data = { params: param, token: '44' };
        const url = `${BASEURL}gsafety/model/fireforest`;
        return this.rSerivce.serverObj.post(url, qs.stringify(data));
    }

    public getCase(url: string = './json/defaultCase.json') {
        return new Promise(async (resolve: any, reject: any) => {
            const res: any = await this.rSerivce.serverObj.get(url);
            resolve(res);
        });
    }
}







