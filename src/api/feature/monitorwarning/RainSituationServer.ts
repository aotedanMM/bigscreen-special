import { RequestServerClass } from '../../../util/request';

// 雨情服务
export default class RainSituationServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   * 获取当前雨情描述信息
   * @param opts {Object}
   * @param opts.type {string} // 0: 12小时，1:24小时，2:48小时，3:近一周，4:近一月
   * @returns {Object} {超阈值站点数量: 0, 最大监测站点: 'XXX', 降雨量: '120mm', 更新时间: '2020-05-04 12:00:00'}
   */
  public getCurrentInfo(opts: any) {
    opts.type = opts.type || 1;
    // const url = '/api/tRainData/v1/countrainwarning/type?type=' + opts.type;
    const result = {
        data: {},
    };
    // return this.rSerivce.serverObj.post(url);
    const url = '/api/tRainData/v1/countrainwarning/type';
    return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url, opts).then((res: any) => {
            result.data = res.data;
            resolve(result);
        });
    });
  }
  /**
   * 获取雨情分区县统计
   * @param opts {Object}
   * @param opts.type {string} // 1:24小时，2:48小时，3:近一周，4:近一月
   */
  public getDistrictStat(opts: any) {
    opts.type = opts.type || 1;
    const url = '/api/tRainData/v1/statSumAndAvg/distName?type=' + opts.type;
    return this.rSerivce.serverObj.get(url, opts);
  }

  /**
   * 获取雨情降水量统计
   */
  public getStatTownSum(opts: any) {
    opts.type = opts.type || 1;
    const url = '/api/tRainData/v1/statTownSum?type=' + opts.type;
    return this.rSerivce.serverObj.get(url);
  }

  /**
   * 获取雨情降水量统计
   */
  public getStatSum(opts: any) {
    // opts.type = opts.type || 1;
    const url = '/api/tRainData/v1/statTownSumByTime';
    return this.rSerivce.serverObj.post(url, opts);
  }

  /**
   * 获取雨情站点列表
   * @param opts {Object}
   * @param [opts.keyWord] 关键字
   * @param [opts.level] 告警级别 rain: 暴雨告警; heavyRain: 大暴雨告警; superRain: 特大暴雨告警
   * @param [opts.geometry]
   * @param [opts.pageSize]
   * @param [opts.pageIndex]
   */
  public getStationsList(opts: any) {
    if (opts.keyWord && !opts.name) {
      opts.name = opts.keyWord;
      delete opts.keyWord;
    }
    if (opts.name) {
      const arr = [];
      for (let index = 0; index < opts.name.length; index++) {
          const word = opts.name.charAt(index);
          if (word === '%') {
              arr.push('\\' + word);
              continue;
          }
          arr.push(word);
      }
      opts.name = arr.join('');
    }
    const url = '/api/tRainData/v1/page';
    if (opts.pageIndex && !opts.nowPage) {
      opts.nowPage = opts.pageIndex;
    }
    opts.pageSize = opts.pageSize || 100000;
    const result: any = {
      data: [],
      total: 0,
    };
    return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url, opts).then((res: any) => {
            result.total = res.data.total;
            const list = res.data.list;
            list.forEach((element: any) => {
                const record: any = {};
                record.id = element.id;
                record.name = element.name;
                record.x = element.x;
                record.y = element.y;
                record.isValid = element.isValid;
                record.rainfall = element.rainfall;
                record.rainOneHour = element.rainOneHour;
                record.level = element.level;
                record.warningSign = element.warningSign;
                result.data.push(record);
            });
            resolve(result);
        });
    });
  }
  /**
   * 获取雨情站点详情
   * @param opts {Object}
   * @param opts.id {string}
   * @param [opts.starttime] {string} 开始时间
   */
  public getStationDetail(opts: any) {
    let url = '/api/tRainData/v1/detail?id=' + opts.id;
    if (opts.starttime) {
      url += '&dateTime=' + opts.starttime;
    }
    const result = {
      data: {
        id: opts.id,
        name: null,
        x: null,
        y: null,
        rainfall: null,
        level: null,
        prec24h: null,
        updateTime: null,
        list: [], // starttime至今雨情记录
      },
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const data = res.data.data;
        result.data.name = data.name;
        result.data.x = data.x;
        result.data.y = data.y;
        result.data.prec24h = data.prec24h;
        result.data.updateTime = data.updateTime;
        result.data.list = data.dataList;
        resolve(result);
      });
    });
  }

    /**
   * 导出Excel
   */
  public getDownload(opts: any) {
    const url = '/api/tRainData/v1/downloadTownSumByTime';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts, { responseType: 'blob' }).then((res: any) => {
        resolve(res);
      });
    });
  }

  /**
   * 获取当前雨情预警信息报告
   * @param opts {Object}
   * @returns {Object}
   */
  public getWarningInfo(opts?: any) {
    const url = '/api/tRainData/v1/warning/page?nowPage=' + opts.nowPage + '&pageSize=' + opts.pageSize;
    return this.rSerivce.serverObj.post(url, opts);
  }

  public getWarningStatInfo(opts?: any) {
    const url = '/api/tRainData/v1/statRainWarning';
    return this.rSerivce.serverObj.get(url, opts);
  }
}
