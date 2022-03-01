
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class DistrictServer {

    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
     * 获取行政区划边界
     * @param opts
     * @param opts.code {Array}
     */
    public getDistrictBorder(opts: any) {
        const httpRequest = new (G as any).base.HttpRequest();
        const service = new (G as any).servicev2.DistrictServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
        return service.getDistrict({
            code: opts.code,
        });
    }

}

