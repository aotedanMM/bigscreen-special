
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 物资储备库服务
export class RepositoryServer {

    public rSerivce: any;
    public RepositoryService: any;
    public queryService: any;
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        //
        const httpRequest: any = new G.base.HttpRequest();
        this.queryService = new G.servicev2.ResourceQueryServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
        this.emapServiceFilter = publishObjectPath.value.district;
    }
    /**
    * 根据类型获取物资储备库统计
    * @param opts
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param opts.districtCode 行政区划
    * @param [opts.repositoryTypecodes]  [Array] // 队伍类型数组 ['1', '2']，默认为空-全部
    * @param [opts.keyWord] 关键字
    */
    public getRepositoryStatistics(opts: any) {
        const self = this;
        const fields = ['name', 'REPERTORYTYPECODE'];
        opts.fields = fields;
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        return new Promise((resolve, reject) => {
            self.getRepositoryMapData(opts).then((data: any) => {
                const dataList = data.list;
                const result: any = {};
                const stat: any = {};
                let dataNumTotal = 0;
                dataList.forEach((team: any) => {
                    const type = team.REPERTORYTYPECODE;
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
     * 根据类型获取物资储备库列表（分页）烟台用，可通过物资关键字查询
    * @param opts
    * @param opts.point 事故点位
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param opts.districtCode 行政区划
    * @param [opts.repositoryTypecodes] [Array] // 队伍类型数组 ['1', '2']，默认为空-全部
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    */
    public async getRepositoryDataList(opts: any) {
        const keyWord = opts.keyWord;
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const typecode = 'repository';
        opts.typecode = typecode;
        if (opts.repositoryTypecodes && opts.repositoryTypecodes.length > 0) {
            opts.query = this.getQueryByRepositoryTypecodes(opts.repositoryTypecodes);
        }
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
        if (!keyWord) {
            const statOpt = {
                typecode: opts.typecode,
                repositoryTypecodes: opts.repositoryTypecodes,
                level: opts.level,
                geometry: opts.geometry,
                districtCode: opts.districtCode,
            };
            const res: any = await this.getRepositoryStatistics(statOpt);
            return new Promise((resolve, reject) => {
                const result: any = {};
                self.getData(opts).then((arr: any) => {
                    result.list = arr;
                    result.total = res.total;
                    resolve(result);
                });
            });
        } else {
            const optFull = JSON.parse(JSON.stringify(opts));
            optFull.paging = false;
            if (optFull.keyWord) {
                delete optFull.keyWord;
            }
            if (optFull.pageIndex) {
                delete optFull.pageIndex;
            }
            if (optFull.pageSize) {
                delete optFull.pageSize;
            }
            console.log(optFull);
            return new Promise((resolve, reject) => {
                self.getData(optFull).then((arr: any) => {
                    const allList = arr;
                    const equiOpt = {
                        keyWord,
                        select: 'REPERTORYID',
                    };
                    self.getMaterial(equiOpt).then((equipList: any) => {
                        const ids: any = [];
                        equipList.forEach((equip: any) => {
                            ids.push(equip.REPERTORYID);
                        });
                        const result = self.aggregateResult(allList, ids, opts);
                        resolve(result);
                    });
                });
            });
        }
    }
    /**
     * 根据类型获取物资储备库列表（分页）
    * @param opts
    * @param opts.point 事故点位
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param opts.districtCode 行政区划
    * @param [opts.repositoryTypecodes] [Array] // 队伍类型数组 ['1', '2']，默认为空-全部
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    */
   public async getRepositoryDataListNormal(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const typecode = 'repository';
        opts.typecode = typecode;
        if (opts.repositoryTypecodes && opts.repositoryTypecodes.length > 0) {
            opts.query = this.getQueryByRepositoryTypecodes(opts.repositoryTypecodes);
        }
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
            repositoryTypecodes: opts.repositoryTypecodes,
            level: opts.level,
            geometry: opts.geometry,
            districtCode: opts.districtCode,
        };
        const res: any = await this.getRepositoryStatistics(statOpt);
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
     * @param opts.level
     * @param opts.geometry 几何对象（geojson）
     * @param opts.districtCode 行政区划
     * @param [opts.repositoryTypecodes] [Array] // 队伍类型数组 ['1', '2']，默认为空-全部
     * @param [opts.fields] 字段列表（筛选字段）
     * @param [opts.keyWord] 关键字
     */
    public getRepositoryMapData(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const typecode = 'repository';
        opts.typecode = typecode;
        opts.flatTag = true;
        if (opts.repositoryTypecodes && opts.repositoryTypecodes.length > 0) {
            opts.query = this.getQueryByRepositoryTypecodes(opts.repositoryTypecodes);
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
     * @param opts.id
     * @param opts.point
     */
    public getDetailInfo(opts: any) {
        const self = this;
        const typecode = 'repository';
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
                    self.getMaterialByReposityId({id}).then((materials: any) => {
                        res.materials = materials;
                        resolve(res);
                    });
                } else {
                    resolve({});
                }
            });
        });
    }

    /**
     * 根据储备库id查询物资
     * @param opts
     * @param opts.id 必填
     * @param opts.pageSize 每页记录数，默认为10
     * @param opts.pageNo 页数，从1开始计数
     * @param opts.select 可选
     */
    public getMaterialByReposityId(opts: any) {
        return new Promise(async (resolve, reject) => {
            const materialSet: any = {
                TP001: {
                  label: '救灾帐篷',
                  unit: '顶',
                },
                TP002: {
                  label: '救灾被服',
                  unit: '件',
                },
                TP003: {
                  label: '救灾食品',
                  unit: '件',
                },
                TP004: {
                  label: '生活用品',
                  unit: '件',
                },
                TP005: {
                  label: '照明用具',
                  unit: '件',
                },
                TP006: {
                  label: '能源动力',
                  unit: '件',
                },
                TP007: {
                  label: '应急救生',
                  unit: '件',
                },
                TP008: {
                  label: '交通工具',
                  unit: '台',
                },
                TP009: {
                  label: '彩条苫布',
                  unit: '件',
                },
                TP010: {
                  label: '卫生设施',
                  unit: '件',
                },
                TP011: {
                  label: '生活家具',
                  unit: '件',
                },
                TP012: {
                  label: '装备工具',
                  unit: '件',
                },
                TP013: {
                  label: '个体防护',
                  unit: '件',
                },
                TP014: {
                  label: '侦测与搜寻',
                  unit: '件',
                },
                TP015: {
                    label: '材料工具',
                    unit: '件',
                  },
                TP016: {
                    label: '动力燃料',
                    unit: '件',
                },
                TP017: {
                    label: '工程材料 ',
                    unit: '件',
                },
                TP018: {
                    label: '工程设备',
                    unit: '件',
                },
                TP019: {
                    label: '照明设备',
                    unit: '件',
                },
                TP020: {
                    label: '通讯广播',
                    unit: '件',
                },
              };
            const params: any = {};
            params.table = 'JC_MATERIAL_INFO';
            params.where = `REPERTORYID=\'${opts.id}\'`;
            params.pageSize = opts.pageSize;
            params.pageNo = opts.pageNo;
            this.queryService.getList(params).then( (result: any) => {
                const list: any = [];
                for (const item of result.list) {
                    const temp: any = {};
                    temp.name = item.MATERIALNAME;
                    temp.value = item.MATERIALNUM || 0;
                    const config: any = materialSet[item.MATERIALTYPE];
                    if (config) {
                        temp.unit = config.unit;
                    } else {
                        temp.unit = '件';
                    }
                    temp.unit = item.MEASUREUNIT || temp.unit;
                    list.push(temp);
                }
                resolve(list);
            });
        });
    }
    /**
     * 物资查询
     * @param opts
     * @param opts.keyWord 关键字
     * @param opts.select 可选
     */
    public getMaterial(opts?: any) {
        return new Promise(async (resolve, reject) => {
            const params: any = {};
            params.table = 'JC_MATERIAL_INFO';
            if (opts.keyWord) {
                params.where = `MATERIALNAME like \'%${opts.keyWord}%\'`;
            }
            if (opts.select) {
                params.select = opts.select;
            }
            if (opts.pageSize) {
                params.pageSize = opts.pageSize;
            }
            if (opts.pageNo) {
                params.pageNo = opts.pageNo;
            }
            this.queryService.getList(params).then( (result: any) => {
                resolve(result.list);
            });
        });
    }
    /**
     * 获取储备库类型
     */
    public getRepositoryType(opts?: any) {
        return new Promise(async (resolve, reject) => {
            const params: any = {};
            params.table = 'CODE_REP_TYPE';
            this.queryService.getList(params).then( (result: any) => {
                resolve(result);
            });
        });
    }
    private aggregateResult(fullList: any, extraIds: any, opts: any) {
        function checkKeyword(rec: any) {
            const index = rec.name.indexOf(opts.keyWord);
            const id = rec._id;
            const isInIds = extraIds.includes(id);
            return (index >= 0) || isInIds;
        }
        let result = fullList.filter(checkKeyword);
        const total = result.length;
        if (opts.pageIndex && opts.pageSize) {
            const pageIndex = parseInt(opts.pageIndex + '', 10);
            const pageSize = parseInt(opts.pageSize + '', 10);
            const starter = pageSize * (pageIndex - 1);
            const ender = pageSize * pageIndex;
            result = result.splice(starter, ender);
        }
        return {
            total,
            list: result,
        };
    }
    private getData(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
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

    private getQueryByRepositoryTypecodes(repositoryTypecodes: any) {
        const query: any = {};
        if (repositoryTypecodes && repositoryTypecodes.length > 0) {
            const column = 'tag.REPERTORYTYPECODE';
            // const expression = repositoryTypecodes.join('|');
            query[column] = {
                $regex: repositoryTypecodes,
            };
        }
        return query;
    }
}

