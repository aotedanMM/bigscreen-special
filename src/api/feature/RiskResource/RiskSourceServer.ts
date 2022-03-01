
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class RiskSourceServer {

    public rSerivce: any;
    public riskService: any;
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.riskService = null;
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 获取统计数据
     * @param opts
     */
    public getStatistics(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!this.riskService) {
            this.riskService = new (window as any).EMapServerV2.RiskSourceService({});
        }
        return new Promise((resolve, reject) => {
            if (this.emapServiceFilter) {
                this.riskService.getStatisticsByFilter(this.emapServiceFilter, function(err: any, data: any) {
                    resolve(data);
                }, this);
            } else {
                this.riskService.getStatistics({}, function(err: any, data: any) {
                    resolve(data);
                }, this);
            }

        });
    }
    /**
     * 获取单项数据
    * @param opts
    * @param opts.keyword 关键字
    * @param opts.resourceKey，多个逗号分隔
    * @param opts.pageSize
    * @param opts.pageIndex
    * @param opts.districtCode
     */
    public getDataList(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.districtCode = self.emapServiceFilter.root;
        }
        if (!this.riskService) {
            this.riskService = new (window as any).EMapServerV2.RiskSourceService({});
        }
        return new Promise((resolve, reject) => {
            const option: any = {
                resourceKey: opts.resourceKey,
                districtCode: opts.districtCode,
            };
            if (opts.keyword) {
                option.keyword = opts.keyword;
                self.riskService.getDataList(option, function(err1: any, data1: any) {
                    const total = data1[opts.resourceKey].length;
                    self.riskService.getDataList(opts, function(err: any, data: any) {
                        data.total = total;
                        resolve(data);
                    }, self);
                }, self);
            } else {
                self.riskService.getStatisticsByFilter({
                    resourceKeys: [opts.resourceKey],
                    districtCode: opts.districtCode,
                }, function(err: any, data: any) {
                    const list = data.list;
                    let total: any = 0;
                    list.forEach((element: any) => {
                        if (element.codeKey === opts.resourceKey) {
                            total = element.tabNumber;
                        }
                    });
                    self.riskService.getDataList(opts, function(err2: any, data2: any) {
                        data2.total = total;
                        resolve(data2);
                    }, self);
                });
            }
        });
    }
}

