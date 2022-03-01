import { RequestServerClass } from '../../util/request';
import {
  IWarningInfoParam,
  IWarningInfoTypeParam,
} from '@/interface/feature/earthquake/WarningInfo.interface';
import publishObjectPath from '@/util/configRegistry';
/* 预警信息*/
export class WarningInfoServer {
  public rSerivce: any;
  public emapServiceFilter: any;
  public rSerivce2: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.rSerivce2 = new RequestServerClass({
      baseURL: publishObjectPath.value.floodServerPath,
    });
    this.emapServiceFilter = publishObjectPath.value.district;
    axiosFilterFn.call(this, this.rSerivce.serverObj);
  }

  public getConfig(url: string) {
    // const url = './json/map.json';
    return this.rSerivce.serverObj.get(url);
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
      opts.searchType = '1';
    }
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (
      !opts.districtCode &&
      self.emapServiceFilter &&
      self.emapServiceFilter.root
    ) {
      opts.districtCode = self.emapServiceFilter.root;
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
      opts.searchType = '1';
    }
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (
      !opts.districtCode &&
      self.emapServiceFilter &&
      self.emapServiceFilter.root
    ) {
      opts.districtCode = self.emapServiceFilter.root;
    }
    let url = '/api/event/weather/list/v1';
    if (opts.nowPage && opts.pageSize) {
      url = '/api/event/weather/page/list/v1';
    }
    return this.rSerivce.serverObj.post(url, opts);
  }
  /**
   * 预警类型统计
   * @param opts
   * @param opts.type  预警类型:（大风：11B06，暴雨：11B03，台风：11B01，雷电：11B14，地灾：11B37）(多个逗号隔开)
   * @param opts.startTime {String} 开始时间
   * @param opts.endTime {String} 结束时间
   * @param opts.districtCode {String} 行政区划编码
   * @param opts.searchType {String} 匹配方式。1：区域编码父子级别匹配，2：区域编码精准匹配
   */
  public getWeatherWarningStatic(opts: any) {
    const url = '/api/event/weather/SignalTypeLevel/list/v1';
    const result: any = {};
    return new Promise((resolve, reject) => {
      this.rSerivce2.serverObj.post(url, opts).then((res: any) => {
        const data = JSON.parse(res.data.data.levelList);
        result.data = data;
        result.total = res.data.data.total;
        resolve(result);
      });
    });
  }

  /**
   * 预警信息查询
   * @param opts
   * @param {Array} opts.type   type:[{code:'11B06',level:'红色，橙色'}，{code:'11B03',level:'红色，橙色'}] 预警类型:（大风：11B06，暴雨：11B03，台风：11B01，雷电：11B14，地灾：11B37）
   * @param opts.nowPage  1
   * @param opts.pageSize 10
   * @param opts.startTime {String} 开始时间
   * @param opts.endTime {String} 结束时间
   * @param opts.districtCode {String} 行政区划编码
   * @param opts.searchType {String} 匹配方式。1：区域编码父子级别匹配，2：区域编码精准匹配
   */
  public getWeatherWarningList(opts: any) {
    const url = '/api/event/weather/weatherLevelPageList/list/v1';
    const result: any = {};
    return new Promise((resolve, reject) => {
      this.rSerivce2.serverObj.post(url, opts).then((res: any) => {
        result.data = res.data.data.weatherRespList;
        result.total = res.data.data.total;
        resolve(result);
      });
    });
  }
}
