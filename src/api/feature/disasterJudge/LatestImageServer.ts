
import {RequestServerClass} from '../../../util/request';

// 获取最新影像服务
export class LatestImageServer {

    public rSerivce: any;
    private url: string;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.url = opt.url;
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }

    /**
     * 获取最新影像信息
     * @param opts
     * @param opts.lon {Number}
     * @param opts.lat {Number}
     */
    public getImageDatas(opts: any) {
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(this.url, opts).then((response: any) => {
                const data: any = response.data;
                if (!!data && data.status === '$SUCCESS' && data.result && data.result.length > 0) {
                    resolve(data.result);
                } else {
                    reject(new Error(''));
                }
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}

