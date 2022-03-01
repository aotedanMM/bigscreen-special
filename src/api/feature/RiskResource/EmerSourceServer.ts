
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class EmerSourceServer {

    public rSerivce: any;
    public emergService: any;
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.emergService = null;
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 获取统计数据
     * @param opts
     */
    public getStatistics(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!this.emergService) {
            this.emergService = new (window as any).EMapServerV2.EmerSourceService({});
        }
        return new Promise((resolve, reject) => {
            if (this.emapServiceFilter) {
                this.emergService.getStatisticsByFilter(this.emapServiceFilter, function(err: any, data: any) {
                    resolve(data);
                }, this);
            } else {
                this.emergService.getStatistics({}, function(err: any, data: any) {
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
    * @param opts.fields
    * @param opts.filter
     */
    public getDataList(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.districtCode = self.emapServiceFilter.root;
        }
        if (!this.emergService) {
            this.emergService = new (window as any).EMapServerV2.EmerSourceService({});
        }
        return new Promise((resolve, reject) => {
            const option: any = {
                resourceKey: opts.resourceKey,
                districtCode: opts.districtCode,
            };
            // 解决物资库根据类型筛选问题，临时方案，待优化
            const filterObj: any = {};
            for (let key of Object.keys(opts.filter || {})) {
                let val: any = opts.filter[key];
                if (val !== undefined) {
                    if (key !== '_id' && key.indexOf('tag') < 0) {
                        key = 'tag.' + key;
                    }
                    if (val instanceof Array) {
                        val = {
                            $in: val,
                        };
                    }
                    filterObj[key] = val;
                }
            }
            if (Object.keys(filterObj).length > 0) {
                option.keyword = opts.keyword;
                option.filter = {};
                option.filter[opts.resourceKey] = filterObj;
                self.emergService.getDataList(option, function(err1: any, data1: any) {
                    // const result = filterResult(data1[opts.resourceKey], filterObj);
                    const result = data1[opts.resourceKey];
                    const total = result.length;
                    const res: any = {};
                    res.total = total;
                    res[opts.resourceKey] = result;
                    if (opts.pageSize && opts.pageIndex) {
                        const starter = opts.pageSize * (opts.pageIndex - 1);
                        const ender = opts.pageSize * opts.pageIndex;
                        res[opts.resourceKey] = result.slice(starter, ender);
                        resolve(res);
                    }
                }, self);
            } else {
                if (opts.keyword) {
                    option.keyword = opts.keyword;
                    self.emergService.getDataList(option, function(err1: any, data1: any) {
                        const total = data1[opts.resourceKey].length;
                        self.emergService.getDataList(opts, function(err: any, data: any) {
                            data.total = total;
                            resolve(data);
                        }, self);
                    }, self);
                } else {
                    self.emergService.getStatisticsByFilter({
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
                        self.emergService.getDataList(opts, function(err2: any, data2: any) {
                            data2.total = total;
                            resolve(data2);
                        }, self);
                    });
                }
            }

        });
    }
}
export const filterResult = (data: any, filter: any) => {
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      const filterValue = filter[key];
      if (Array.isArray(filterValue)) {
        data = data.filter(function(item: any) {
          return filterValue.includes(item[key]);
        });
      }
    }
  }


  return data;
};
