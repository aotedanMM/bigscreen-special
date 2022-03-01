
import { RequestServerClass } from '../../../../util/request';
import RequestBuffer from '@/util/buffer/requestBuffer';
import publishObjectPath from '@/util/configRegistry';
const res = new RequestBuffer();
export class PathServer {

    public rSerivce: any;
    public opt: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.opt = opt;
    }
}
