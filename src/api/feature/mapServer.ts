
import {RequestServerClass} from '../../util/request';

export class MapServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }



    public getConfig(url: string) {
        return this.rSerivce.serverObj.get(url);
    }

}
