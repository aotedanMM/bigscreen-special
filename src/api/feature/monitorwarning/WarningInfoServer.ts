import { RequestServerClass } from '../../../util/request';

// 气象监测
export default class WarningInfoServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    axiosFilterFn.call(this, this.rSerivce.serverObj);
  }

  /**
   * 获取预警信息统计
   * @param opts
   * @param opts.type {String} 预警类型，逗号隔开
   * @param opts.startTime {String} 开始时间
   * @param opts.endTime {String} 结束时间
   * @param opts.districtCode {String} 行政区划编码，逗号隔开
   */
  public getData(opts: any) {
    if (!opts.districtCode) {
      opts.searchType = '1';
    } else {
      opts.searchType = '2';
    }
    const url = '/api/event/weathercount/list/v1';
    return this.rSerivce.serverObj.post(url, opts);
  }
  /**
   * 获取预警信息统计,返回对应的所有类型
   * @param opts
   * @param opts.type {String} 预警类型，逗号隔开
   * @param opts.startTime {String} 开始时间
   * @param opts.endTime {String} 结束时间
   * @param opts.districtCode {String} 行政区划编码，逗号隔开
   */
  public getDataHas(opts: any) {
    if (!opts.districtCode) {
      opts.searchType = '1';
    } else {
      opts.searchType = '2';
    }
    const url = '/api/event/weathercounts/include/zero/list/v1';
    return this.rSerivce.serverObj.post(url, opts);
  }
  /**
   * 获取预警信息
   * @param opts
   * @param opts.type {String} 预警类型
   * @param opts.startTime {String} 开始时间
   * @param opts.endTime {String} 结束时间
   * @param opts.districtCode {String} 行政区划编码，逗号隔开
   * @param opts.nowPage {integer} 当前页数
   * @param opts.pageSize {integer} 每页记录数
   */
  public getTypeData(opts: any) {
    if (!opts.districtCode) {
      opts.searchType = '1';
    } else {
      opts.searchType = '2';
    }
    let url = '/api/event/weather/list/v1';
    if (opts.nowPage && opts.pageSize) {
      url = '/api/event/weather/page/list/v1';
    }
    return this.rSerivce.serverObj.post(url, opts);
  }
}
