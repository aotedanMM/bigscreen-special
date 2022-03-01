
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 地质灾害隐患点
export class GeologicHazardServer {

    public rSerivce: any;
    public queryService: any;
    private typecodeMap: any = {
        landslide: ['20104.0100'], // 滑坡
        debrisflow: ['20104.0200'], // 泥石流
        mountaincollapse: ['20104.0300'], // 山体崩塌
        bottomcollapse: ['20104.0400'], // 地面塌陷
        groundfissure: ['20104.0500'], // 地裂缝
        landsubsidence: ['20104.0600'], // 地面沉降
        unstableslopes: ['20104.0800'], // 不稳定斜坡
    };
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        const httpRequest: any = new G.base.HttpRequest();
        this.queryService = new G.servicev2.ResourceQueryServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
    }
    /**
    * 根据类型获取地质灾害隐患点统计
    * @param opts
    * @param [opts.level] 级别描述
    * @param opts.geometry 几何范围
    * @param [opts.geologicHazardTypecodes]  [Array] // 地质灾害隐患点类型数组 ['landslide', 'debrisflow']，默认为空-全部
    * @param [opts.keyWord] 关键字
    */
    public getGeologicHazardStatistics(opts: any) {
        const self = this;
        const fields = ['name', 'GEOHAZARDTYPECODE'];
        opts.fields = fields;
        return new Promise((resolve, reject) => {
            self.getGeologicHazardMapData(opts).then((data: any) => {
                const dataList = data.list;
                const result: any = {};
                const stat: any = {};
                let dataNumTotal = 0;
                dataList.forEach((team: any) => {
                    const type = team.GEOHAZARDTYPECODE;
                    dataNumTotal ++;
                    if (stat[type]) {
                        stat[type].count ++;
                    } else {
                        stat[type] = {};
                        stat[type].count = 1;
                    }
                });
                result.data = stat;
                result.total = dataNumTotal;
                resolve(result);
            });
        });
    }
    /**
     * 根据类型获取地质灾害隐患点列表（分页）
    * @param opts
    * @param opts.point 点位
    * @param [opts.level] 级别描述
    * @param opts.geometry 几何范围
    * @param [opts.geologicHazardTypecodes] [Array] // 地质灾害隐患点类型数组 ['landslide', 'debrisflow']，默认为空-全部
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    */
   public async getGeologicHazardDataList(opts: any) {
        const typecode = 'geologichazard';
        opts.typecode = typecode;
        opts.query = this.getQueryByGeologicHazardTypecodes(opts.geologicHazardTypecodes);
        const self = this;
        opts.earthLevel = opts.earthLevel || opts.level;
        opts.dataA = opts.dataA || opts.geometry;
        if (opts.point) {
            opts.near = JSON.stringify(opts.point);
            opts.distanceField = opts.distanceField || '_distance';
        }
        if (opts.pageSize && opts.pageIndex && !opts.paging) {
            opts.paging = true;
        }

        const statOpt = {
            typecode: opts.typecode,
            keyWord: opts.keyWord,
            geologicHazardTypecodes: opts.geologicHazardTypecodes,
            level: opts.level,
            geometry: opts.geometry,
        };
        const res: any = await this.getGeologicHazardStatistics(statOpt);
        return new Promise((resolve, reject) => {
            const result: any = {};
            self.getData(opts).then((arr: any) => {
                result.list = arr;
                result.total = res.total;
                resolve(result);
            });
        });
    }
    /**
     * 根据类型获取地图数据
     * @param opts
     * @param [opts.level] 级别描述
     * @param opts.geometry 几何对象（geojson）
     * @param [opts.geologicHazardTypecodes] [Array] // 地质灾害隐患点类型数组 ['landslide', 'debrisflow']，默认为空-全部
     * @param [opts.fields] 字段列表（筛选字段）
     * @param [opts.keyWord] 关键字
     */
    public getGeologicHazardMapData(opts: any) {
        const typecode = 'geologichazard';
        opts.typecode = typecode;
        opts.flatTag = true;
        opts.query = this.getQueryByGeologicHazardTypecodes(opts.geologicHazardTypecodes);
        return new Promise((resolve, reject) => {
            (window as any).EMapServerV2.queryservice.getMapDataList(opts, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    data = this.processResultTypecode(data);
                    resolve({
                        layerName: opts.typecode + '_' + opts.level, // 图层名用类型和烈度圈级别构成
                        list: data,
                        icons: opts.typecode + '_img',
                    });
                }
            }, this);
        });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id
     * @param [opts.point] //计算距离时需要该参数
     */
    public getDetailInfo(opts: any) {
        const self = this;
        const typecode = 'geologichazard';
        opts.typecode = typecode;
        opts.flatTag = true;
        if (opts.point) {
            opts.near = JSON.stringify(opts.point);
            opts.distanceField = opts.distanceField || '_distance';
        }
        return new Promise((resolve, reject) => {
            this.getData(opts).then((data: any) => {
                if (data && data.length > 0) {
                    const res = data[0];
                    const id = res._id;
                    resolve(res);
                } else {
                    resolve({});
                }
            });
        });
    }
    // 获取数据
    private getData(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            (window as any).EMapServerV2.queryservice.getCurrencyData(opts, (data: any) => {
                const result: any = {};
                const arr: any[] = [];
                const str = '_id';
                if (data && data[opts.typecode] && data[opts.typecode].length > 0) {
                    data[opts.typecode].forEach((item: any) => {
                        const tag: any = item.tag;
                        for (const key of Object.keys(tag)) {
                            item[key] = tag[key];
                        }
                        item.level = opts.level;
                        delete item.tag;
                        item._distance = parseFloat((parseFloat(item._distance) / 1000).toFixed(2));

                        const typecode = item.GEOHAZARDTYPECODE;
                        if (typecode) {
                            const mappedTypecode = self.getMappedTypecode(typecode);
                            item.GEOHAZARDTYPECODE = mappedTypecode;
                        }
                        arr.push(item);
                    });
                }
                resolve(arr);
            });
        });
    }

    // 获取查询参数
    private getQueryByGeologicHazardTypecodes(geologicHazardTypecodes: any) {
        const geologicHazardTypecodesOrigin = JSON.parse(JSON.stringify(geologicHazardTypecodes));
        const query: any = {};
        if (!geologicHazardTypecodes || geologicHazardTypecodes.length === 0) {
            geologicHazardTypecodes = [];
            for (const key in this.typecodeMap) {
                if (this.typecodeMap.hasOwnProperty(key)) {
                    geologicHazardTypecodes.push(key);
                }
            }
        }
        geologicHazardTypecodes = this.getRealTypecodes(geologicHazardTypecodes);
        const column = 'tag.GEOHAZARDTYPECODE';
        let expression = geologicHazardTypecodes.join('|');
        if (!expression) {
            expression = geologicHazardTypecodesOrigin.join('|');
        }
        query[column] = {
            $regex: expression,
        };
        return query;
    }

    // 获取映射前code
    private getRealTypecodes(geologicHazardTypecodes: any) {
        let res: any = [];
        geologicHazardTypecodes.forEach((code: string) => {
            const realCodeArr: any = this.typecodeMap[code];
            if (realCodeArr) {
                res = res.concat(realCodeArr);
            }
        });
        return Array.from(new Set(res));
    }
    // 结果处理
    private processResultTypecode(data: any) {
        data.forEach((record: any) => {
            const typecode = record.GEOHAZARDTYPECODE;
            if (typecode) {
                const mappedTypecode = this.getMappedTypecode(typecode);
                record.GEOHAZARDTYPECODE = mappedTypecode;
            }
        });
        return data;
    }
    // 获取映射后code
    private getMappedTypecode(typecode: string) {
        let mappedTypecode = typecode;
        for (const key in this.typecodeMap) {
            if (this.typecodeMap.hasOwnProperty(key)) {
                const value = this.typecodeMap[key];
                if (value.includes(typecode)) {
                    mappedTypecode = key;
                    break;
                }
            }
        }
        return mappedTypecode;
    }
}

