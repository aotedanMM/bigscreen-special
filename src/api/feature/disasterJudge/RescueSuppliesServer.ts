
import {RequestServerClass} from '../../../util/request';
// 灾情研判服务
export class RescueSuppliesServer {

    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
     * 获取救援物资列表
     * @param opts
     * @param opts.point {Array}
     * @param [opts.radius] {number}
     */
    public getRescueSuppliesList(opts: any) {
        const emerSourceService = new (window as any).EMapServerV2.EmerSourceService({});
        opts.resourceKeys = ['ANJIAN_REPERTORY※01'];
        opts.radius = opts.radius || 2000 * 1000;
        return new Promise((resolve, reject) => {
            emerSourceService.getNearbyList(opts, function(err: any, data: any) {
                resolve(data);
            });
        });
    }
    /**
     * 获取救援物资详情
     * @param opts
     * @param opts.id {String}
     */
    public getRescueSupplyDetail(opts: any) {
        const detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        return new Promise((resolve, reject) => {
            detailInfoService.getReposityDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }

}

