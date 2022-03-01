import { RequestServerClass } from '../../../util/request';

// 灾情研判服务
export class DisasterJudgeResourceServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

  /**
    * 获取资源统计
    * @param opts
    * @param opts.typecode
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param [opts.keyWord] [String] 关键字
    * @param [opts.filter] [Object] 类型过滤
    * @param [opts.filter[i]] [Object] 类型过滤对象 {RESCUETYPECODE: ['T004', 'T016']}
   */
    public getStatistics(opts: any) {
        const self = this;
        const fields: any = [];
        if (opts.filter) {
            for (const key in opts.filter) {
                if (opts.filter.hasOwnProperty(key)) {
                    fields.push(key);
                }
            }
        }
        opts.fields = fields;
        return new Promise((resolve, reject) => {
            self.getMapDataList(opts).then((data: any) => {
                const dataList = data.list;
                const result: any = {};
                if (fields.length === 1) {
                    const stat: any = {};
                    dataList.forEach((team: any) => {
                        const typeColumn = fields[0];
                        const type = team[typeColumn];
                        if (stat[type]) {
                            stat[type].count ++;
                        } else {
                            stat[type] = {};
                            stat[type].count = 1;
                        }
                    });
                    result.data = stat;
                }
                result.total = dataList.length;
                resolve(result);
            });
        });
    }
    /**
     * 获取列表信息
    * @param opts
    * @param opts.typecode
    * @param opts.point
    * @param opts.level
    * @param opts.geometry
    * @param [opts.keyWord]
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    * @param [opts.filter] [Object] 类型过滤
    * @param [opts.filter[i]] [Object] 类型过滤对象 {RESCUETYPECODE: ['T004', 'T016']}
     */
    public async getDataList(opts: any) {
        const self = this;
        if (opts.filter) {
            opts.query = this.getQueryByFilter(opts.filter);
        }
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
            filter: opts.filter,
            level: opts.level,
            geometry: opts.geometry,
        };
        const res: any = await this.getStatistics(statOpt);
        return new Promise((resolve, reject) => {
            const result: any = {};
            self.getData(opts).then((arr: any) => {
                result.list = arr;
                result.total = res.total;
                resolve(result);
            });
        });
    }

    public getData(opts: any) {
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
                        arr.push(item);
                    });
                }
                resolve(arr);
            });
        });
    }
    /**
     * 获取地图数据
     * @param opts
     * @param opts.level
     * @param opts.typecode
     * @param opts.geometry 几何对象（geojson）
     * @param [opts.fields] 字段列表（筛选字段）
     * @param [opts.keyWord] 关键字
     * @param [opts.filter] [Object] 类型过滤
     * @param [opts.filter[i]] [Object] 类型过滤对象 {RESCUETYPECODE: ['T004', 'T016']}
     */
    public getMapDataList(opts: any) {
        opts.flatTag = true;
        if (opts.filter) {
            opts.query = this.getQueryByFilter(opts.filter);
        }
        return new Promise((resolve, reject) => {
            (window as any).EMapServerV2.queryservice.getMapDataList(opts, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
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
     * @param opts.typecode
     * @param opts.id
     * @param opts.point
     */
    public getDetailInfo(opts: any) {
        opts.flatTag = true;
        if (opts.point) {
            opts.near = JSON.stringify(opts.point);
            opts.distanceField = opts.distanceField || '_distance';
        }
        return new Promise((resolve, reject) => {
            this.getData(opts).then((data: any) => {
                if (data && data.length > 0) {
                    resolve(data[0]);
                } else {
                    resolve({});
                }
            });
        });
    }
    private getQueryByFilter(filter: any) {
        const query: any = {};
        for (const key in filter) {
            if (filter.hasOwnProperty(key)) {
                const column = 'tag.' + key;
                let values = filter[key] || [];
                if (typeof(values) === 'string') {
                    values = [values];
                }
                const expression = values.join('|');
                if (!expression) {
                    continue;
                }
                query[column] = {
                    $regex: expression,
                };
            }
        }
        return query;
    }
}
