import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class NormalResourceServer {

    public rSerivce: any;
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 获取详细数据
     * @param opt
     * @param opt.resourceKey
     * @param opt.id
     */
    public getDetailInfo(opt: any) {
        opt.flatTag = true;
        const serve = new EMapServerV2.CommonService();
        return new Promise((resolve, reject) => {
            serve.getDataList(opt, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    if (data && data[opt.resourceKey]) {
                        resolve(data[opt.resourceKey][0]);
                    } else {
                        resolve(null);
                    }
                }

            }, this);
        });
    }

    /**
     * 获取地图数据
     * @param opts
     * @param opts.resourceKey
     * @param opts.fields 字段列表（筛选字段）
     * @param [opts.geometry] 几何对象（geojson）
     * @param [opts.keyWord] 关键字 todo
     * @param [opts.districtCode] 行政区划编码,以逗号隔开
     */
    public getMapDataList(opts: any) {
        opts.flatTag = true;
        if (!opts.resourceKey && opts.resourceKeys) {
            opts.resourceKey = opts.resourceKeys;
        }
        if (!opts.keyWord && opts.keyword) {
            opts.keyWord = opts.keyword;
        }
        if (!opts.geometry && opts.buffer) {
            opts.geometry = opts.buffer;
        }
        if (!opts.districtCode && opts.districtCodes) {
            opts.districtCode = opts.districtCodes;
        }
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const serve = new EMapServerV2.CommonService();
        return new Promise((resolve, reject) => {
            serve.getMapDataList(opts, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }, this);
        });
    }

    // 查询城市
    public queryCity(cb: any) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: (window as any).EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
                dataType: 'json',
                type: 'post',
                data: {
                    eId: 'safety',
                    data: JSON.stringify({
                        BAS_CITY: {
                            query: {},
                        },
                    }),
                },
                success: (da: any) => {
                    const data = da.data;
                    const list = data[Object.keys(data)[0]];
                    resolve(list);
                },
                error: (err) => {
                    reject(err);
                },
            });
        });

    }
}
