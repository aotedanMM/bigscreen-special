
import {RequestServerClass} from '../../../util/request';

// 灾情研判服务
export class CommonDistrictServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
     * 获取省
     * @param opts
     */
    public getProvinces(opts: any) {
        return new Promise((resolve, reject) => {
            const data = EMapServerV2.provinceDistrictData.province;
            resolve(data);
        });
    }
}

