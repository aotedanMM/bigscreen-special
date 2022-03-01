

import { RequestServerClass } from '../../util/request';

export class GisStaticServer {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    axiosFilterFn.call(this, this.rSerivce.serverObj);
  }
  // 得到灾损研判的工具条
  public getDisasterDecide() {
    const url = './json/gisUtil/disasterDecide.json';
    return this.rSerivce.serverObj.get(url);
  }
  // 得到救援救助的工具条
  public getRescueHelp() {
    const url = './json/gisUtil/rescueHelp.json';
    return this.rSerivce.serverObj.get(url);
  }
  // 得到灾损统计的工具条
  public getDisasterStatistics() {
    const url = './json/gisUtil/disasterStatistics.json';
    return this.rSerivce.serverObj.get(url);
  }
}
