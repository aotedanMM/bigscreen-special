
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
import MultiuleQueryParamConfigList_yt from '@/gis/normal/resource/MultiuleQueryParamConfigList_yt';

// 灾情研判服务
export class RescueTeamServer {

    public rSerivce: any;
    public rSerivce1: any;
    public rescueTeamService: any;
    public queryService: any;
    public emapServiceFilter: any;
    public teamDispatch: any; // 力量调度服务
    constructor(opt: any, axiosFilterFn?: any) {
        opt.baseURL = (window as any).EMAP_CONFIG.common.resourceServer;
        this.rSerivce1 = new RequestServerClass(opt);
        this.rSerivce = new RequestServerClass(opt);
        this.teamDispatch = new RequestServerClass({ baseURL: publishObjectPath.value.misServerPath });
        //
        const httpRequest: any = new G.base.HttpRequest();
        this.queryService = new G.servicev2.ResourceQueryServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 获取救援队统计
     * @param opts
     * @param opts.districtCode {Array}
     */
    public getRescueTeamStatistics(opts: any) {
        if (!this.rescueTeamService) {
            this.rescueTeamService = new (window as any).EMapServerV2.RescueTeamService({});
        }
        return new Promise((resolve, reject) => {
            this.rescueTeamService.getStatisticsByFilter(opts, function(err: any, data: any) {
                resolve(data);
            }, this);
        });
    }

    /**
     * 获取救援队列表
    * @param opts
    * @param opts.resourceKey，多个逗号分隔
    * @param opts.pageSize
    * @param opts.pageIndex
    * @param opts.districtCode
     */
    public getRescueTeamList(opts: any) {
        if (!this.rescueTeamService) {
            this.rescueTeamService = new (window as any).EMapServerV2.RescueTeamService({});
        }
        return new Promise((resolve, reject) => {
            this.rescueTeamService.getDataList(opts, function(err: any, data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 获取救援物资详情
     * @param opts
     * @param opts.id {String}
     */
    public getRescueTeamDetail(opts: any) {
        const detailInfoService = new (window as any).EMapServerV2.DetailInfoServices({});
        return new Promise((resolve, reject) => {
            detailInfoService.getRescueTeamDetail(opts.id, function(data: any) {
                resolve(data);
            }, this);
        });
    }
    /**
     * 根据救援队id查询装备
     * @param opts
     * @param opts.id 必填
     * @param opts.pageSize 每页记录数，默认为10
     * @param opts.pageNo 页数，从1开始计数
     * @param opts.select 可选
     */
    public getEquipmentByTeamId(param: any) {
        const text: any = param.keyWord ? param.keyWord : null;
        const id: any = param.id ? param.id : null;
        const objname = param.resourceKey;
        const obj: any = {
            field: MultiuleQueryParamConfigList_yt[objname].fileFn('0'),
            group: MultiuleQueryParamConfigList_yt[objname].group(),
            nowPage: param.pageNo,
            pageSize: param.pageSize,
            tableName: MultiuleQueryParamConfigList_yt[objname].tableName(),
            where: MultiuleQueryParamConfigList_yt[objname].where(text, id),
            type: '3',
          };
        const url = '/api/universal/getUniversalLimitSql/v1';
        return new Promise((resolve, reject) => {
          this.rSerivce1.serverObj.post(url, obj).then((data: any) => {
            resolve(data);
          });
        });
    }

    // ==================================================================


    /**
    * 根据类型获取救援队统计
    * @param opts
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param opts.districtCode 行政区划
    * @param [opts.rescueTypecodes]  [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
    * @param [opts.keyWord] 关键字
    */
    public getRescueTeamTypeStatistics(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const self = this;
        const fields = ['name', 'rescuetypecode', 'peoplenum'];
        opts.fields = fields;
        return new Promise((resolve, reject) => {
            self.getRescueTeamMapData(opts).then((data: any) => {
                const teamList = data.list;
                const result: any = {};
                const stat: any = {};
                let peopleNumTotal = 0;
                let teamNumTotal = 0;
                teamList.forEach((team: any) => {
                    const peoplenum = team.peoplenum || 0;
                    const type = team.rescuetypecode;
                    peopleNumTotal += peoplenum;
                    teamNumTotal++;
                    if (stat[type]) {
                        stat[type].teamnum++;
                        stat[type].peoplenum += peoplenum;
                    } else {
                        stat[type] = {};
                        stat[type].teamnum = 1;
                        stat[type].peoplenum = peoplenum;
                    }
                });
                result.data = stat;
                result.teamnum = teamNumTotal;
                result.peoplenum = peopleNumTotal;
                resolve(result);
            });
        });
    }
    /**
    * 根据类型获取前突救援队统计
    * @param opts
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param [opts.rescueTypecodes]  [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
    * @param [opts.keyWord] 关键字
    *///
    public getForwardRescueTeamTypeStatistics(opts: any) {
        const url = '/api/rtdAddrperrel/v1/getForwardRescueTeamTypeStatistics';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // const keyWords = [];
        // keyWords.push('（前突）');
        // if (opts.keyWord) {
        //     if (Array.isArray(opts.keyWord)) {
        //         opts.keyWord.forEach((key: any) => {
        //             keyWords.push(key);
        //         });
        //     } else if (typeof(opts.keyWord) === 'string') {
        //         keyWords.push(opts.keyWord);
        //     }
        // }
        // opts.keyWord = keyWords;
        // return new Promise((resolve, reject) => {
        // this.getRescueTeamTypeStatistics(opts).then((data: any) => {
        //     resolve(data);
        // });
        // });
    }


    /**
    * 获取航空装备列表数据
    *///
    public getAviationEquipment(opts: any) {
        const url = '/api/forestProtectionStanding/v1/getEquipmentListByRescueid';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // const keyWords = [];
        // keyWords.push('（前突）');
        // if (opts.keyWord) {
        //     if (Array.isArray(opts.keyWord)) {
        //         opts.keyWord.forEach((key: any) => {
        //             keyWords.push(key);
        //         });
        //     } else if (typeof(opts.keyWord) === 'string') {
        //         keyWords.push(opts.keyWord);
        //     }
        // }
        // opts.keyWord = keyWords;
        // return new Promise((resolve, reject) => {
        // this.getRescueTeamTypeStatistics(opts).then((data: any) => {
        //     resolve(data);
        // });
        // });
    }

    /**
     * 根据类型获取救援队列表（分页）烟台用，可通过装备关键字查询
    * @param opts
    * @param opts.point 事故点位
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param opts.districtCode 行政区划
    * @param [opts.rescueTypecodes] [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    */
   public async getRescueTeamDataList(opts: any) {
        const keyWord = opts.keyWord;
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const typecode = 'RescueTeam※03';
        opts.typecode = typecode;
        if (opts.rescueTypecodes && opts.rescueTypecodes.length > 0) {
            opts.query = this.getQueryByRescueTypecodes(opts.rescueTypecodes);
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
                keyWord: opts.keyWord,
                rescueTypecodes: opts.rescueTypecodes,
                level: opts.level,
                geometry: opts.geometry,
                districtCode: opts.districtCode,
            };
            const res: any = await this.getRescueTeamTypeStatistics(statOpt);
            return new Promise((resolve, reject) => {
                const result: any = {};
                self.getData(opts).then((arr: any) => {
                    result.list = arr;
                    result.total = res.teamnum;
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
                        select: 'RESCUEID',
                    };
                    self.getEquipment(equiOpt).then((equipList: any) => {
                        const ids: any = [];
                        equipList.forEach((equip: any) => {
                            ids.push(equip.RESCUEID);
                        });
                        const result = self.aggregateResult(allList, ids, opts);
                        resolve(result);
                    });
                });
            });
        }

    }

    /**
     * 根据类型获取救援队列表（分页）
    * @param opts
    * @param opts.point 事故点位
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param opts.districtCode 行政区划
    * @param [opts.rescueTypecodes] [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    */
    public async getRescueTeamDataListNormal(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const typecode = 'RescueTeam※03';
        opts.typecode = typecode;
        if (opts.rescueTypecodes && opts.rescueTypecodes.length > 0) {
            opts.query = this.getQueryByRescueTypecodes(opts.rescueTypecodes);
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
            rescueTypecodes: opts.rescueTypecodes,
            level: opts.level,
            geometry: opts.geometry,
            districtCode: opts.districtCode,
        };
        const res: any = await this.getRescueTeamTypeStatistics(statOpt);
        return new Promise((resolve, reject) => {
            const result: any = {};
            self.getData(opts).then((arr: any) => {
                result.list = arr;
                result.total = res.teamnum;
                resolve(result);
            });
        });
    }
    /**
     * 根据类型获取前突救援队列表（分页）
    * @param opts
    * @param opts.point 事故点位
    * @param opts.level 级别描述
    * @param opts.geometry 几何范围
    * @param [opts.rescueTypecodes] [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
    */
    public getForwardRescueTeamDataList(opts: any) {
        const url = '/api/rtdAddrperrel/v1/selectJyxxTeaRescueList';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // const keyWords = [];
        // keyWords.push('（前突）');
        // if (opts.keyWord) {
        //     if (Array.isArray(opts.keyWord)) {
        //         opts.keyWord.forEach((key: any) => {
        //             keyWords.push(key);
        //         });
        //     } else if (typeof(opts.keyWord) === 'string') {
        //         keyWords.push(opts.keyWord);
        //     }
        // }
        // opts.keyWord = keyWords;
        // return new Promise((resolve, reject) => {
        //     this.getRescueTeamDataList(opts).then((data: any) => {
        //         resolve(data);
        //     });
        // });
    }
    /**
     * 根据类型获取地图数据
     * @param opts
     * @param opts.level
     * @param opts.geometry 几何对象（geojson）
     * @param opts.districtCode 行政区划
     * @param [opts.rescueTypecodes] [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
     * @param [opts.fields] 字段列表（筛选字段）
     * @param [opts.keyWord] 关键字
     */
    public getRescueTeamMapData(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.districtCode = this.emapServiceFilter.root;
        }
        const typecode = 'RescueTeam※03';
        opts.typecode = typecode;
        opts.flatTag = true;
        if (opts.rescueTypecodes && opts.rescueTypecodes.length > 0) {
            opts.query = this.getQueryByRescueTypecodes(opts.rescueTypecodes);
        }
        return new Promise((resolve, reject) => {
            // (window as any).EMapServerV2.queryservice.getMapDataList(opts, (err: any, data: any) => {
            //     if (err) {
            //         reject(err);
            //     } else {
            //         resolve({
            //             layerName: opts.typecode + '_' + opts.level, // 图层名用类型和烈度圈级别构成
            //             list: data,
            //             icons: opts.typecode + '_img',
            //         });
            //     }
            // }, this);
        });
    }
    /**
     * 根据类型获取前突地图数据
     * @param opts
     * @param opts.keyWord
     * @param opts.level
     * @param opts.geometry 几何对象（geojson）
     * @param [opts.rescueTypecodes] [Array] // 队伍类型数组 ['T004', 'T016']，默认为空-全部
     * @param [opts.fields] 字段列表（筛选字段）
     * @param [opts.keyWord] 关键字
     */
    public getForwardRescueTeamMapData(opts: any) {
        const url = '/api/rtdAddrperrel/v1/getForwardRescueTeamMapData';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
        // const keyWords = [];
        // keyWords.push('（前突）');
        // if (opts.keyWord) {
        //     if (Array.isArray(opts.keyWord)) {
        //         opts.keyWord.forEach((key: any) => {
        //             keyWords.push(key);
        //         });
        //     } else if (typeof(opts.keyWord) === 'string') {
        //         keyWords.push(opts.keyWord);
        //     }
        // }
        // opts.keyWord = keyWords;
        // return new Promise((resolve, reject) => {
        //     this.getRescueTeamMapData(opts).then((data: any) => {
        //         resolve(data);
        //     });
        // });
    }
    /**
     * 获取详细数据
     * @param opts
     * @param opts.id
     * @param opts.point
     */
    public getDetailInfo(opts: any) {
        const typecode = 'RescueTeam※03';
        opts.typecode = typecode;
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


    /**
     * 力量调度：统计出动情况的个数（出动的救援队列表）
     * @param opts
     * @param opts.eventId  事件ID
     */
    public dispatchTeam(opts: any) {
        const url = '/gemp-event/api/gemp/event/cimdispatchcase/dispatch/team/v1';
        // opts.eventId = 'ff80808170ab44680170ad963afd0002';
        // return this.teamDispatch.serverObj.post(url, opts);
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 力量调度：出动情况列表查询
     * @param opts
     * @param opts.eventId  事件ID
     * @param opts.dispatchTaskid: "string",
     * @param opts.endFillTime": "2020-05-25T06:31:31.081Z",
     * @param opts.nowPage": 0,
     * @param opts.orgName": "string",
     * @param opts.pageSize": 0,
     * @param opts.startFillTime": "2020-05-25T06:31:31.081Z",
     * @param opts.teamId": "string"
     */
    public dispatchTeamList(opts: any) {
        const url = 'gemp-event/api/gemp/event/cimdispatchcase/all/v1';
        // opts.eventId = '8a83939e70609fa001708b37a5c2001a';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                const detailData = response.data || {};
                resolve(detailData);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 力量调度 查询 支队详情
     * @param opts
     * @param opts.dispatchcaseId 行动id
     */
    public getDispatchTeamDetail(opts: any) {
        const url = '/gemp-event/api/gemp/event/cimdispatchcase/detail/v1';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 任务反馈，分页条件查询任务反馈列表
     * @param opts
     * @param opts.backState": "string",
     * @param opts.eventId": "string",
     * @param opts.execState": "string",
     * @param opts.feedbackEndTime": "2020-05-25T07:00:52.854Z",
     * @param opts.feedbackStartTime": "2020-05-25T07:00:52.854Z",
     * @param opts.nowPage": 0,
     * @param opts.pageSize": 0,
     * @param opts.taskId": "string",
     * @param opts.taskTitle": "string"
     */
    public getDispatchtaskback(opts: any) {
        const url = '/gemp-event/api/gemp/event/dispatchtaskback/list/v1';
        // opts.eventId = 'ff808081729be00e01729ccb665e000e';
        // opts.taskId = '8a8a8ad8723fdfb201723fe20aa20000';
        // return this.teamDispatch.serverObj.post(url, opts);
        const opt: any = {
            eventId : 'ff808081729be00e01729ccb665e000e',
        };
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opt).then((response: any) => {
                const result = response.data.data.list;
                resolve(result);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 力量调度：根据任务反馈id 查询附件列表
     * @param opts
     * @param opts.taskbackId
     */
    public getDispatchAttachmentList(opts: any) {
        const url = '/gemp-event/api/gemp/event/dispatchtaskback/listAttach/v2';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 任务反馈，根据id查询某个任务反馈详情
     * @param opts
     * @param opts.taskbackId
     */
    public getDispatchtaskbackFindOne(opts: any) {
        const url = '/gemp-event/api/gemp/event/dispatchtaskback/findOne/v1';
        // return this.teamDispatch.serverObj.post(url, opts);
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
    * 根据出动任务id，需求提取列表查询
    * @param opts
    * @param opts.taskbackId
    */
    public getQueryPresentationList(opts: any) {
        const url = '/gemp-event/api/base/event/demand/presentation/queryPresentationList';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    // 出动队伍的队伍类型
    public getDispatchTeamType() {
        const url = '/gemp-data/api/gemp/resource/rescueteam/type/list/v1';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url).then((response: any) => {
                resolve(response.data);
            });
        });
    }
    /**
     * 力量调度：查询出动队伍详情
     * @param opts
     * @param opts.teamId": "string"
     */
    public getDispatchResidenceDetail(opts: any) {
        const url = '/gemp-data/api/gemp/resource/rescueteam/team/detail/v1';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                response.data.data.type = 'zhudi';
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
     * 装备查询
     * @param opts
     * @param opts.keyWord 关键字
     * @param opts.select 可选
     */
    public getEquipment(opts?: any) {
        return new Promise(async (resolve, reject) => {
            const params: any = {};
            params.table = 'V_EQUIPMENT';
            if (opts.keyWord) {
                params.where = `EQUIPNAME like \'%${opts.keyWord}%\'`;
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
     * 获取救援队伍类型
     */
    public getRescueteamType(opts?: any) {
        const list = [{
            RESCUETYPECODE: '120301130000',
            RESCUETYPENAME: '防汛抗旱队',
        }, {
            RESCUETYPECODE: '120301010000',
            RESCUETYPENAME: '消防救援队',
        }, {
            RESCUETYPECODE: '120301030000',
            RESCUETYPENAME: '森林消防队',
        }, {
            RESCUETYPECODE: '120301050000',
            RESCUETYPENAME: '危化品救援队',
        }, {
            RESCUETYPECODE: '120301040000',
            RESCUETYPENAME: '煤矿救援队',
        }, {
            RESCUETYPECODE: '120301450000',
            RESCUETYPENAME: '非煤矿山救援队',
        }, {
            RESCUETYPECODE: '120301460000',
            RESCUETYPENAME: '商贸流通救援队',
        }, {
            RESCUETYPECODE: '120301140000',
            RESCUETYPENAME: '交通运输救援队',
        }, {
            RESCUETYPECODE: '120301180000',
            RESCUETYPENAME: '应急供电救援队',
        }, {
            RESCUETYPECODE: '120301170000',
            RESCUETYPENAME: '移动通讯救援队',
        }, {
            RESCUETYPECODE: '120301290000',
            RESCUETYPENAME: '燃气救援队',
        }, {
            RESCUETYPECODE: '120301200000',
            RESCUETYPENAME: '环境救援队',
        }, {
            RESCUETYPECODE: '120301230000',
            RESCUETYPENAME: '打捞救援队',
        }, {
            RESCUETYPECODE: '120301090000',
            RESCUETYPENAME: '海上救援队',
        }, {
            RESCUETYPECODE: '120301470000',
            RESCUETYPENAME: '船舶溢油救援队',
        }, {
            RESCUETYPECODE: '120301210000',
            RESCUETYPENAME: '医疗卫生队',
        }, {
            RESCUETYPECODE: '120301480000',
            RESCUETYPENAME: '港口码头抢险队',
        }, {
            RESCUETYPECODE: '120301490000',
            RESCUETYPENAME: '港口客运场站应急队',
        }, {
            RESCUETYPECODE: '120301500000',
            RESCUETYPENAME: '港口施工安全队',
        }, {
            RESCUETYPECODE: '120301120000',
            RESCUETYPENAME: '建筑应急救援队',
        }, {
            RESCUETYPECODE: '120301510000',
            RESCUETYPENAME: '客运应急救援队',
        }, {
            RESCUETYPECODE: '120301520000',
            RESCUETYPENAME: '应急运力队',
        },
        // {
        //     RESCUETYPECODE: '120301530000',
        //     RESCUETYPENAME: '清雪队伍',
        // },
         {
            RESCUETYPECODE: '120301540000',
            RESCUETYPENAME: '机械设备社会力量',
        }, {
            RESCUETYPECODE: '120301420000',
            RESCUETYPENAME: '民间救援队',
        }];
        return new Promise(async (resolve, reject) => {
            resolve({
                list,
            });
        });
        // return new Promise(async (resolve, reject) => {
        //     const params: any = {};
        //     params.table = 'EQUIP_RESCUETYPE';
        //     this.queryService.getList(params).then( (result: any) => {
        //         resolve(result);
        //     });
        // });
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

    private getQueryByRescueTypecodes(rescueTypecodes: any) {
        const query: any = {};
        if (rescueTypecodes && rescueTypecodes.length > 0) {
            const column = 'tag.RESCUETYPECODE';
            const expression = rescueTypecodes.join('|');
            query[column] = {
                $regex: expression,
            };
        }
        return query;
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
}

