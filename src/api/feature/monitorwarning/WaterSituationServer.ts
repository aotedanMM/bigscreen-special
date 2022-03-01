import { RequestServerClass } from '../../../util/request';

// 水情服务
export default class WaterSituationServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    opt.headers = { 'Content-Type': 'application/json' };
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   * 获取当前水情描述信息
   * @param opts {Object}
   * @returns {Object} {超警戒水位站点数量: 0, 超历史最高水位站点数量: 0, 城市内涝积水点数量: 0, 更新时间: '2020-05-04 12:00:00'}
   */
  public getCurrentInfo(opts?: any) {
    const url = '/tSwsshc/v1/getOverrunObtNow';
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取当前河道描述信息
   * @param opts {Object}
   * @returns {Object} {超警戒水位站点数量: 0, 超历史最高水位站点数量: 0, 城市内涝积水点数量: 0, 更新时间: '2020-05-04 12:00:00'}
   */
  public getCurrentRiverInfo(opts?: any) {
    const url = '/tSwsshc/v1/statRiverInfo';
    return this.rSerivce.serverObj.post(url, opts);
  }
  /**
   * 获取当前水库描述信息
   * @param opts {Object}
   * @returns {Object}
   */
  public getCurrentReservoirInfo(opts?: any) {
    const url = '/tSwsshc/v1/statReservoirInfo';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj
        .post(url, opts)
        .then((res: any) => {
          resolve(res);
        });
    });
  }
  /**
   * 获取水库-增降统计
   * @param opts {Object}
   */
  public getStat(opts?: any) {
    const url = '/tSwsshc/v1/getReservoirRiseAndRetreat';
    return this.rSerivce.serverObj.get(url);
  }

  /**
   * 获取河流-增降统计
   * @param opts {Object}
   */
  public getRiverRiseAndRetreat(opts?: any) {
    const url = '/tSwsshc/v1/getRiverRiseAndRetreat';
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取河道-最大积水站点信息
   * @param opts {Object}
   */
  public getMaxWaterInfo(opts?: any) {
    const url = '/tSwsshc/v1/getMaxRiverInfo';
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取水库-最大积水站点信息
   * @param opts {Object}
   */
  public getMaxReservoirInfo(opts?: any) {
    const url = '/tSwsshc/v1/getMaxReservoirInfo';
    return this.rSerivce.serverObj.get(url);
  }
  /*山洪受灾村列表*/
  public getFloodvillageList(opts?: any) {
    const obj = JSON.parse(JSON.stringify(opts));
    // const url = '/tSwsshc/v1/page';
    const url = '/tSwsshc/v1/findFloodVillage'; //  山洪受灾村数据
    const self = this;
    if (obj.pageIndex && !obj.nowPage) {
      obj.nowPage = obj.pageIndex;
    }
    if (obj.villagename) {
      const arr = [];
      for (let index = 0; index < obj.villagename.length; index++) {
        const word = obj.villagename.charAt(index);
        if (word === '%') {
          arr.push('\\' + word);
          continue;
        }
        arr.push(word);
      }
      obj.villagename = arr.join('');
    }
    obj.pageSize = obj.pageSize || 100000;
    const result: any = {
      data: [],
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj
        .post(url, JSON.stringify(obj))
        .then((res: any) => {
          const resData = res.data.list;
          result.total = res.data.total;
          resData.forEach((record: any) => {
            let station: any = {};
            station = record;
            station.name = record.villagename;
            station.x = record.longitude;
            station.y = record.latitude;
            result.data.push(station);
          });
          resolve(result);
        });
    });
  }
  /**山洪灾害村详 */
  public getFloodvillageDetail(opts?: any) {
    const self = this;
    const urlDetail = '/tSwsshc/v1/findFloodVillageById?id=' + opts.id;
    const result: any = {
      data: {},
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(urlDetail).then((resDetail: any) => {
        const resDetaildata = resDetail.data.data;
        result.data = resDetaildata;
      });
      resolve(result);
    });
  }
  /**
   * 获取水库列表
   * @param opts {Object}
   * @param [opts.keyWord] 关键字
   * @param [opts.type] 监测站类型 river: 河流监测站; reservoir: 水库监测站
   * @param [opts.level] 可传多个，逗号隔开，取并集
   * 水库：超汛限(overLimit)、超正常(overNormal)、超设计(overDesign)、超历史最高(overHighest) ||| 河道站：超警戒(overWarning)、超保证(overGuarantee)、超历史最高(overHighest)
   * @param [opts.pageIndex]
   */
  public getStationsList(opts?: any) {
    const obj = JSON.parse(JSON.stringify(opts));
    // const url = '/tSwsshc/v1/page';
    const url = '/tSwsshc/v1/findReservoir'; //  水库列表数据
    const self = this;
    if (obj.pageIndex && !obj.nowPage) {
      obj.nowPage = obj.pageIndex;
    }
    if (obj.fullname) {
      const arr = [];
      for (let index = 0; index < obj.fullname.length; index++) {
        const word = obj.fullname.charAt(index);
        if (word === '%') {
          arr.push('\\' + word);
          continue;
        }
        arr.push(word);
      }
      obj.fullname = arr.join('');
    }
    obj.pageSize = obj.pageSize || 100000;
    const result: any = {
      data: [],
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj
        .post(url, JSON.stringify(obj))
        .then((res: any) => {
          const resData = res.data.list;
          result.total = res.data.total;
          resData.forEach((record: any) => {
            let station: any = {};
            station = record;
            station.name = record.fullname;
            station.x = record.longitude;
            station.y = record.latitude;
            result.data.push(station);
          });
          resolve(result);
        });
    });
  }
  /**
   * 获取水库详情
   * @param opts {Object}
   */
  public getreservoirDetail(opts?: any) {
    const self = this;
    const urlDetail = '/tSwsshc/v1/findReservoirByIdNew?id=' + opts.id;
    const result: any = {
      data: {},
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(urlDetail).then((resDetail: any) => {
        const resDetaildata = resDetail.data.data;
        result.data = resDetaildata;
      });
      resolve(result);
    });
  }
  /**
   * 获取河流详情
   * @param opts {Object}
   * @param opts.id {string}
   * @param [opts.starttime] {string} 开始时间
   */
  public getStationDetail(opts?: any) {
    const self = this;
    const urlDetail = 'tSwsshc/v1/detail?id=' + opts.id;
    const urlHistory = 'tSwsshc/v1/river/detail?id=' + opts.id;
    // const urlHistory = 'tSwsshc/v1/getThreeDaysRealTimeWaterInfo?id=' + opts.id;
    const result: any = {
      data: {},
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(urlDetail).then((resDetail: any) => {
        const detailData = resDetail.data.data || {};
        result.data.id = opts.id;
        result.data.name = detailData.name;
        result.data.x = detailData.x;
        result.data.y = detailData.y;
        result.data.waterLevel = detailData.waterLevel;
        result.data.type = detailData.type;
        result.data.trend = detailData.trend; // todo
        result.data.analogalertwa = detailData.analogalertwa;
        result.data.analogtopwa = detailData.analogtopwa;
        result.data.warning = self.getWarning(detailData.warning); // todo

        result.data.riverBasini = detailData.riverBasini; // 所在流域
        result.data.address = detailData.address; // 地址
        result.data.equipment = detailData.equipment; // 设备型号
        result.data.stationSetTime = detailData.stationSetTime; // 设站时间
        // result.data.list = detailData.dataList;
        this.rSerivce.serverObj.get(urlHistory).then((resHistory: any) => {
          result.data.belongRiver = resHistory.data.data.belongRiver; // 所在河流
          result.data.list = resHistory.data.data.dataList;
          resolve(result);
        });
      });
    });
  }

  /**
   * 获取河道列表数据
   * @param opts {Object}
   * @param [opts.keyWord] 关键字
   * @param [opts.level] 可传多个，逗号隔开，取并集
   * 水库：超汛限(overLimit)、超正常(overNormal)、超设计(overDesign)、超历史最高(overHighest) ||| 河道站：超警戒(overWarning)、超保证(overGuarantee)、超历史最高(overHighest)
   * @param [opts.pageIndex]
   */
  public getRiverStationsList(opts?: any) {
    // tslint:disable-next-line: no-debugger
    // debugger;
    const url = '/tSwsshc/v1/river/page';
    const self = this;
    if (opts.pageIndex && !opts.nowPage) {
      opts.nowPage = opts.pageIndex;
    }
    if (opts.keyWord) {
      const arr = [];
      for (let index = 0; index < opts.keyWord.length; index++) {
        const word = opts.keyWord.charAt(index);
        if (word === '%') {
          arr.push('\\' + word);
          continue;
        }
        arr.push(word);
      }
      opts.keyWord = arr.join('');
    }
    opts.pageSize = opts.pageSize || 100000;
    const result: any = {
      data: [],
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj
        .post(url, JSON.stringify(opts))
        .then((res: any) => {
          const resData = res.data.list;
          result.total = res.data.total;
          resData.forEach((record: any) => {
            const station: any = {};
            station.id = record.id;
            station.name = record.name;
            station.x = record.x;
            station.y = record.y;
            const waterLevel = parseFloat(record.waterLevel + '');
            station.waterLevel = record.waterLevel;
            // let trend = '不变';
            // if (waterLevel > 0) {
            //   trend = '涨';
            // } else if (waterLevel < 0) {
            //   trend = '退';
            // }
            // station.trend = trend;
            const trend: any = {
              涨: '涨',
              不变: '平',
              退: '落',
            };
            station.trend = trend[record.trend];
            station.isValid = record.isValid;
            station.warning = self.getWarning(record.warning);
            station.type = record.type;
            result.data.push(station);
          });
          resolve(result);
        });
    });
  }
/**
   * 获取堰闸列表数据
   * @param opts {Object}
   * @param [opts.keyWord] 关键字
   * @param [opts.level] 可传多个，逗号隔开，取并集
   * 水库：超汛限(overLimit)、超正常(overNormal)、超设计(overDesign)、超历史最高(overHighest) ||| 河道站：超警戒(overWarning)、超保证(overGuarantee)、超历史最高(overHighest)
   * @param [opts.pageIndex]
   */
  public getWeirgateStationsList(opts?: any) {
  const url = '/tSwsshc/v1/findWeirGateWater';
  const self = this;
  if (opts.pageIndex && !opts.nowPage) {
    opts.nowPage = opts.pageIndex;
  }
  if (opts.keyWord) {
    const arr = [];
    for (let index = 0; index < opts.keyWord.length; index++) {
      const word = opts.keyWord.charAt(index);
      if (word === '%') {
        arr.push('\\' + word);
        continue;
      }
      arr.push(word);
    }
    opts.keyWord = arr.join('');
  }
  opts.pageSize = opts.pageSize || 100000;
  const result: any = {
    data: [],
  };
  return new Promise((resolve, reject) => {
    this.rSerivce.serverObj
      .post(url, JSON.stringify(opts))
      .then((res: any) => {
        const resData = res.data.data.list;
        result.total = res.data.data.total;
        resData.forEach((record: any) => {
          const station: any = {};
          station.id = record.id;
          station.name = record.name;
          station.x = record.longitude;
          station.y = record.latitude;
          result.data.push(station);
        });
        resolve(result);
      });
  });
  }
   /**
   * 获取堰闸详情
   * @param opts {Object}
   * @param opts.id {string}
   * @param [opts.starttime] {string} 开始时间
   */
    public getWeirgateDetail(opts?: any) {
      const self = this;
      const urlDetail = '/tSwsshc/v1/station/detail?id=' + opts.id;
      const urlHistory = '/tSwsshc/v1/findWeirGateWaterByStcd/detail?stcd=' + opts.id;
      const result: any = {
        data: {},
      };
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.get(urlDetail).then((resDetail: any) => {
          const resDetaildata = resDetail.data.data;
          result.data = resDetaildata;
          this.rSerivce.serverObj.get(urlHistory).then((resHistory: any) => {
            result.data.list = resHistory.data.data;
            resolve(result);
          });
        });
      });
    }
  /**
   * 获取当前河道预警信息报告
   * @param opts {Object}
   * @returns {Object}
   */
  public getWarningInfo(opts?: any) {
    const url =
      '/tSwsshc/v1/river/warning/page?nowPage=' +
      opts.nowPage +
      '&pageSize=' +
      opts.pageSize;
    return this.rSerivce.serverObj.post(url, opts);
  }

  public getWarningStatInfo(opts?: any) {
    const url = '/tSwsshc/v1/statRiverWarning';
    return this.rSerivce.serverObj.get(url, opts);
  }

  /**
   * 获取当前水库预警信息报告
   * @param opts {Object}
   * @returns {Object}
   */
  public getReservoirWarningInfo(opts?: any) {
    const url =
      '/tSwsshc/v1/warning/page?nowPage=' +
      opts.nowPage +
      '&pageSize=' +
      opts.pageSize;
    return this.rSerivce.serverObj.post(url, opts);
  }

  public getReservoirWarningStatInfo(opts?: any) {
    const url = '/tSwsshc/v1/statReservoirWarning';
    return this.rSerivce.serverObj.get(url, opts);
  }

  private getWarning(warnings: any) {
    let result = '';
    if (warnings) {
      if (Array.isArray(warnings)) {
        const warningLen = warnings.length;
        switch (warningLen) {
          case 0:
            result = '';
            break;
          default:
            result = warnings[warnings.length - 1];
            break;
        }
      } else {
        result = warnings;
      }
    }
    return result;
  }
}
