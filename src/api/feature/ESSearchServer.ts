
import {RequestServerClass} from '@/util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class ESSearchServer {
    public rSerivce: any;
    public opt: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.opt = opt;
    }

    /**
     * @param opts
     * @param opts.keyword {String}
     * @param opts.pageSize {Integer}
     * @param opts.pageNow {Integer}
     */
    public getResourceDataByKeyword(opts: any) {
        const url = publishObjectPath.value.ESserverPath + '/api/es/v1/resource';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
}

