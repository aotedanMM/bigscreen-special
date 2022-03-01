
import {RequestServerClass} from '../../../util/request';
// 灾情研判服务
export class RiskTroubleQueryServer {
    public rSerivce: any;
    public riskTroubleQueryService: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
    /**
     * 风险隐患排查 数据获取
     * @param opts.type dz，qy，ss。地灾隐患点，重点企业，重点设施。
     * @param opts.point
     * @param opts.geometry
     */
    public getRiskTroubleQueryServer(opts: any) {
        if (!this.riskTroubleQueryService) {
            this.riskTroubleQueryService = new (window as any).EMapServerV2.RiskTroubleQueryService({});
        }
        return new Promise((resolve, reject) => {
            this.riskTroubleQueryService.queryData(opts, function(data: any, err: any) {
                resolve(data);
            });
        });
    }
}
