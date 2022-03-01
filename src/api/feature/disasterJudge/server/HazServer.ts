
import { RequestServerClass } from '../../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class HazServer {

    public rSerivce: any;
    public param: any;
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
    * 按照烈度范围查询企业数据
    * @param opts
    * @param opts.earthLevel
    * @param opts.point
    * @param opts.typecode
    * @param opts.dataA
    */
    public queryResourceByRanges(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (opts.point) {
            opts.near = JSON.stringify(opts.point);
        }
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        return new Promise((resolve, reject) => {
            (window as any).EMapServerV2.queryservice.getCurrencyData(opts, (data: any) => {
                const arr: any[] = [];
                const str = '_id';
                if (data && data[opts.typecode] && data[opts.typecode].length > 0) {
                    data[opts.typecode].forEach((item: any) => {
                        const tag: any = item.tag;
                        for (const key of Object.keys(tag)) {
                            item[key] = tag[key];
                        }
                        item.level = opts.earthLevel;
                        delete item.tag;
                        item._distance = parseFloat((parseFloat(item._distance) / 1000).toFixed(2));
                        arr.push(item);
                    });
                }
                let layerName = '';
                if (opts.earthLevel) {
                    layerName = opts.typecode + '_' + opts.earthLevel;
                } else {
                    layerName = opts.typecode;
                }
                resolve({
                    layerName, // 图层名用类型和烈度圈级别构成
                    list: arr,
                    icons: opts.typecode + '_img',
                    count: arr.length,
                });
            });
        });
    }

    /**
     * 百度标签查询
     * @param opts
     * @param opts.name [String] 企业名称
     */
    public getBaiduLabel(opts: any) {
        const url = (window as any).EMAP_CONFIG.common.baidulabel;
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type : 'POST',
                data: {query_name: opts.name},
                success: (result) => {
                    resolve(result);
                },
                error: (e) => {
                    reject(e);
                },
            });
        });
    }
}
