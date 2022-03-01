import { RequestServerClass } from '../../../util/request';
import $ from 'jquery';
const publicPath = require('../../../config/index').jsonPath;

// 水库详情服务
export default class ReservoirServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    opt.headers = { 'Content-Type': 'application/json' };
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   * 获取当前水库描述信息
   * @param opts {Object}
   * @returns {Object} {}
   */
  public getReservoirDetail(opts?: any) {
    const url = '/tSwsshc/v1/reservoir/detail?id=' + opts.id;
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取烟台地图json
   * @param opts {Object}
   * @returns {Object} {}
   */
  public getJsonCallback() {
    let yantaiMap: any = null;
    $.ajax({
      url: publicPath + 'json/yantaiMap.json',
      async: false,
      success(data: any) {
        yantaiMap = data;
      },
    });
    return yantaiMap;
  }
  /**
   * 获取当前水库降水情况信息
   * @param opts {Object}
   * @returns {Object} {}
   */
  public getStatRainfallInfo(opts?: any) {
    const url = '/tSwsshc/v1/statRainfallInfo?id=' + opts.id;
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取当前水位- 24小时
   * @param opts {Object}
   * @returns {Object} {}
   */
  public getwaterLevelInfo(opts?: any) {
    const url = '/tSwsshc/v1/reservoir/detail/one?reservoirId=' + opts.id + '&type=' + opts.type;
    return this.rSerivce.serverObj.get(url);
  }

  /**
   * 获取当前水位- 30天
   * @param opts {Object}
   * @returns {Object} {}
   */
  public getwaterLevelInfoTwo(opts?: any) {
    const url = '/tSwsshc/v1/reservoir/detail/two?reservoirId=' + opts.id;
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取去年同期蓄水量
   * @param id 水库id
   */
  public getReservoirLast(id: string) {
    const url = '/tSwsshc/v1/reservoir/last?id=' + id;
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 获取未来24小时降雨趋势
   * @param districtCode 水库所在区市code
   */
  public getFutureRainFall(districtCode: string) {
    const url = 'api/tRainData/v1/statReservoirFutureRainFall?districtCode=' + districtCode;
    return this.rSerivce.serverObj.get(url);
  }
  // 获取水库降水量
  public statRainfallInfo(opts?: any) {
    const url = 'tSwsshc/v1/statReservoirRainfall?id=' + opts.id;
    return this.rSerivce.serverObj.get(url);
  }
}
