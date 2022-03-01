
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';

// 森火下相关接口
export default class FirePointMonitorServer {

    public rSerivce: any;

    /**
     * 三类数据来源
     */
    public dataConfig: any = {
        // 卫星
        1: {
            layer: 'mon_monitordata_firep',
        },
        // 视频
        2: {
            layer: 'mon_monitordata_firevideo',
        },
        // 地面
        3: {
            layer: 'mon_monitordata_fireground',
        },
    };

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        // test
        (window as any).firePointMonitorServer = this;
    }

    //
    public formatDate(str: string): string {
        // const result = (new Date(str) as any).format('yyyy-MM-dd hh:mm:ss');
        return str;
    }

    /**
     * 获取统计-火点统计
     * @param opts {Object}
     * @param opts.startTime {String} 起始时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.endTime {String} 结束时间，格式yyyy-MM-dd hh:mm:ss
     */
    public getStatistics(opts?: any) {
        return new Promise(async (resolve, reject) => {
            const nowDate: Date = new Date();
            // todo 临时验证用查询10天，实际使用要注释掉
            // nowDate.setDate(nowDate.getDate() - 100);
            nowDate.setHours(0);
            nowDate.setMinutes(0);
            nowDate.setSeconds(0);
            const data: any = await this.getStatisticsTotal({
                startTime: (nowDate as any).format('yyyy-MM-dd hh:mm:ss'),
                endTime: (new Date() as any).format('yyyy-MM-dd hh:mm:ss'),
            });
            resolve(data);
        });
    }

    /**
     * 获取分页列表
     * @param opts {Object}
     * @param opts.type {String} 类型，为空时查询全部，1=卫星 2=视频 3=地面 ，多个类型逗号分隔
     * @param opts.startTime {String} 起始时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.endTime {String} 结束时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.pageNo {Number} 页码，从1计数
     * @param opts.pageSize {Number} 每页条数
     * firePointMonitorServer.getPageList({
            startTime:'2020-06-10 14:26:19',
            endTime:'2020-06-15 14:26:19',
            pageSize:5,
            pageNo:1,
            type: 2,
        });
     */
    public getPageList(opts?: any) {
        return new Promise(async (resolve, reject) => {
            opts.pageNo = opts.pageNo || 1;
            opts.startTime = this.formatDate(opts.startTime);
            opts.endTime = this.formatDate(opts.endTime);
            const data: any = {
                list: [],
                pageSize: opts.pageSize,
                pageNo: opts.pageNo,
                total: 0,
            };
            if (opts.type) { // 1=卫星 2=视频 3=地面
                const config: any = this.dataConfig[opts.type];
                const url: string = `${publishObjectPath.value.dataServer}/egis/business/v1/wrms/pageQuery?layer=${config.layer}&page=${opts.pageNo - 1}&size=${opts.pageSize}`;
                const resultData: any = await this.rSerivce.serverObj.post(url, {
                    filter: {
                        subFields: 'id,observationdatetime,address,longitude,latitude',
                        where: `observationdatetime >= \'${opts.startTime}\' and observationdatetime <= \'${opts.endTime}\'`,
                        orderBy: 'observationdatetime desc',
                    },
                });
                const entities: any = resultData.data.result.entities.resourceEntities;
                data.total = resultData.data.result.count;
                if (entities.length > 0) {
                    const fields: any = resultData.data.result.entities.featureFields.fields;
                    for (const entity of entities) {
                        const item: any = {};
                        let index: number = 0;
                        for (const field of fields) {
                            item[field.name] = entity.feature.properties[index].value;
                            index++;
                        }
                        item.type = opts.type;
                        data.list.push(item);
                    }
                }
                resolve(data);
            } else { // 全部
                // 总数
                const staData: any = await this.getStatisticsTotal({
                    startTime: opts.startTime,
                    endTime: opts.endTime,
                });
                data.total = staData.today;
                // 列表
                const url: string = `${publishObjectPath.value.dataServer}/egis/business/v1/sqlcall/execute?sqlName=pageQueryFirePoint`;
                const resultData: any = await this.rSerivce.serverObj.post(url, {
                    starttime: opts.startTime,
                    endtime: opts.endTime,
                    pageSize: opts.pageSize,
                    page: opts.pageNo,
                });
                if (resultData.data.status === -1) {
                    reject(new Error(`数据服务错误：${resultData.data.msg}`));
                } else {
                    const result: any = resultData.data.result;
                    const columns: any = result.sortedColumns;
                    const dataArr: any = result.result;
                    for (const dataItem of dataArr) {
                        const item: any = {};
                        let index: number = 0;
                        for (const field of columns) {
                            item[field] = dataItem[index];
                            index++;
                        }
                        item.type = item.montype;
                        delete item.montype;
                        data.list.push(item);
                    }
                    resolve(data);
                }
            }
        });
    }

    /**
     * 获取列表 - GIS使用
     * @param opts {Object}
     * @param opts.type {String} 类型，为空时查询全部，1=卫星 2=视频 3=地面 ，多个类型逗号分隔
     * @param opts.startTime {String} 起始时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.endTime {String} 结束时间，格式yyyy-MM-dd hh:mm:ss
     * firePointMonitorServer.getList({
            startTime:'2020-06-01 14:26:19',
            endTime:'2020-06-15 14:26:19',
            type:2,
        }).then(function(data){
            console.log(data);
        });
     */
    public getList(opts?: any) {
        return new Promise(async (resolve, reject) => {
            opts.pageNo = opts.pageNo || 1;
            opts.startTime = this.formatDate(opts.startTime);
            opts.endTime = this.formatDate(opts.endTime);
            const data: any = {
                list: [],
            };
            if (opts.type) { // 1=卫星 2=视频 3=地面
                const config: any = this.dataConfig[opts.type];
                const url: string = `${publishObjectPath.value.dataServer}/egis/business/v1/wrms/find?layer=${config.layer}`;
                const resultData: any = await this.rSerivce.serverObj.post(url, {
                    filter: {
                        subFields: 'id,observationdatetime,address,longitude,latitude',
                        where: `observationdatetime >= \'${opts.startTime}\' and observationdatetime <= \'${opts.endTime}\'`,
                        orderBy: 'observationdatetime desc',
                    },
                });
                const entities: any = resultData.data.result.resourceEntities;
                if (entities.length > 0) {
                    const fields: any = resultData.data.result.featureFields.fields;
                    for (const entity of entities) {
                        const item: any = {};
                        let index: number = 0;
                        for (const field of fields) {
                            item[field.name] = entity.feature.properties[index].value;
                            index++;
                        }
                        item.type = opts.type;
                        data.list.push(item);
                    }
                }
                resolve(data);
            } else { // 全部
                // 列表
                const url: string = `${publishObjectPath.value.dataServer}/egis/business/v1/sqlcall/execute?sqlName=queryAllFirePoint`;
                const resultData: any = await this.rSerivce.serverObj.post(url, {
                    starttime: opts.startTime,
                    endtime: opts.endTime,
                });
                if (resultData.data.status === -1) {
                    reject(new Error(`数据服务错误：${resultData.data.msg}`));
                } else {
                    const result: any = resultData.data.result;
                    const columns: any = result.sortedColumns;
                    const dataArr: any = result.result;
                    for (const dataItem of dataArr) {
                        const item: any = {};
                        let index: number = 0;
                        for (const field of columns) {
                            item[field] = dataItem[index];
                            index++;
                        }
                        item.type = item.montype;
                        delete item.montype;
                        data.list.push(item);
                    }
                    resolve(data);
                }
            }
        });
    }

    /**
     * 获取详情
     * @param opts {Object}
     * @param opts.id 监测点id，多个逗号分隔
     * @param opts.type {String} 类型，1=卫星 2=视频 3=地面
     */
    public getDetail(opts?: any) {
        return new Promise(async (resolve, reject) => {
            const config: any = this.dataConfig[opts.type];
            const url: string = `${publishObjectPath.value.dataServer}/egis/business/v1/wrms/findById?layer=${config.layer}&id=${opts.id}`;
            const resultData: any = await this.rSerivce.serverObj.get(url, {});
            const feature: any = resultData.data.result.feature;
            const fields: any = feature.fields.fields;
            const properties: any = feature.properties;
            const data: any = {};
            let index: number = 0;
            for (const field of fields) {
                data[field.name] = properties[index].value;
                index++;
            }
            // 附件
            data.relInfo = [];
            const attachUrl: string = `${publishObjectPath.value.dataServer}/egis/business/v1/sqlcall/execute?sqlName=queryFirePointRel`;
            const attachData: any = await this.rSerivce.serverObj.post(attachUrl, {
                montype: opts.type,
                stationid: `\'${opts.id}\'`,
            });
            if (attachData.data.status !== -1) {
                const relFields: any = attachData.data.result.sortedColumns;
                const dataArr: any = attachData.data.result.result;
                for (const dataItem of dataArr) {
                    const item: any = {};
                    let index1: number = 0;
                    for (const field of relFields) {
                        item[field] = dataItem[index1];
                        index1++;
                    }
                    data.relInfo.push(item);
                }
            }
            resolve(data);
        });
    }

    /**
     * 获取统计-火点统计
     * @param opts {Object}
     * @param opts.startTime {String} 起始时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.endTime {String} 结束时间，格式yyyy-MM-dd hh:mm:ss
     */
    public getStatisticsTotal(opts?: any) {
        return new Promise(async (resolve, reject) => {
            opts.startTime = this.formatDate(opts.startTime);
            opts.endTime = this.formatDate(opts.endTime);
            const data: any = {
                today: 0, // 当日火点数
                new: 0, // 今日新增火点数
                standing: 0, // 延续火点数
            };
            const districtCode: any = publishObjectPath.value.district.root;
            const url: string
                = `${publishObjectPath.value.dataServer}/egis/business/v1/sqlcall/execute?sqlName=statByFireContinue`;
            const resultData: any = await this.rSerivce.serverObj.post(url, {
                starttime: opts.startTime,
                endtime: opts.endTime,
            });
            if (resultData.data.status === -1) {
                reject(new Error(`数据服务错误：${resultData.data.msg}`));
            } else {
                const resultArr: any = resultData.data.result.result;
                for (const item of resultArr) {
                    if (item[0] === '1') {
                        data.standing = item[1];
                    } else {
                        data.new = item[1];
                    }
                }
                data.today = data.new + data.standing;
                resolve(data);
            }
        });
    }




  // 吴恩2020/8/18 替换新的接口
    /**
     * 统计今日火点、延续火点数量
     */
  public getFireStatisticsTotal() {
       const url = '/api/tfirepoint/count';
       return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url).then((res: any) => {
          resolve(res.data);
        });
      });
  }
    /**
     * 获取分页列表
     * @param opts {Object}
     * @param opts.startTime {String} 起始时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.endTime {String} 结束时间，格式yyyy-MM-dd hh:mm:ss
     * @param opts.nowPage {Number} 页码，从1计数
     * @param opts.pageSize {Number} 每页条数
     * @param opts.key {Number} 每页条数
     * @param opts.keyWord: '查询内容', //非必填，关键字
     * firePointMonitorServer.getPageList({
            startTime:'2020-08-19 14:26:19',
            endTime:'2020-07-20 14:26:19',
            pageSize:5,
            nowPage:1,
            type: 2,
            keyWord:'',
        });
     */
  public getFirePageList(opts: any) {
    const url = '/api/tfirepoint/list';
    const data = {
      total: 10,
      list: [
        {
          address: '莱山区通伸街道西杜家村 北100米发生火情',
          time: '2020/3/25 15:30:00',
          longitude: '111',
          latitude: '11',
          id: '11111111111',
        },
      ],
    };
    return new Promise((resolve, reject) => {
      // resolve(data);
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const result = data;
        // result.data.url = 'https://v-cdn.zjol.com.cn/277002.mp4';
        resolve(result);
      });
    });
  }
  // 今日火点，延续火点数据
  public getFireListPonit() {
    const url = '/api/forestfire/list';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }
    /**
   * 查询列表详情
   * @param opts
   * @param opts.id 对应点位id

   */
  public getFireStationDetail(opts: any) {
    const url = `/api/forestfire/info?id=${opts.id}`;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  // 火情列表信息
  /**
   * 查询列表详情
   * @param opts
   * @param opts.startTime
   * @param opts.endTime
   * @param opts.pageSize
   * @param opts.nowPage
   * @param opts.keyWord
   */
  public getFireBehaviorList(opts: any) {
    const url = '/api/forestfire/fire/info';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  /**
   * 查询全部列表详情
   * @param opts
   * @param opts.startTime
   * @param opts.endTime
   * @param opts.keyWord
   */
  public getFireBehaviorAllList(opts: any) {
    const url = '/api/forestfire/fire/allInfo';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  // 获取历史火点数据
  public getHistoryFireData(opts: any) {
    const url = '/api/tfirepoint/fire/info';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  // 获取历史火点数据
  public getHistoryFireAllData(opts: any) {
    const url = '/api/forestfire/firep/history/list';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  // 火情列表对应详情信息
    /**
   * 查询列表详情
   * @param opts
   * @param opts.id
   */
  public getFireBehaviorDetail(opts: any) {
    const url = `/api/tfirepoint/info?id=${opts.id}`;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  // 确认火点
  public modifyFireInformation(opts: any) {
    const url = `/api/forestfire/fire/modify?sflag=${opts.sflag}&sid=${opts.sid}`;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  /**
   * 森防图层重点乡镇接口
   */
  public getFocusOnCity() {
    const url = '/api/forestfire/forKeytown/list';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }

  // 段龙龙添加  -----同步iframe分支内容 王智 2022年1月12日
  // 监测预警 》 企业监测
  public enterpriseAlarm() {
    const url = '/api/resEnterprise/getCount';
    return new Promise((resolve, reject) => {
     this.rSerivce.serverObj.post(url).then((res: any) => {
       resolve(res.data);
     });
   });
  }
  // 监测预警》企业监测>列表数据
  public enterpriseAlarmList(opts: any) {
    const url = '/api/resEnterprise/listByStatus';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }

}

