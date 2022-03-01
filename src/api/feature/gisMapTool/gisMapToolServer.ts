import {RequestServerClass} from '@/util/request';
// 地图上的工具箱
export class GisToolServer {
    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
      this.rSerivce = new RequestServerClass(opt);
      if (axiosFilterFn) {
        axiosFilterFn.call(this, this.rSerivce.serverObj);
      }
  }
    // 地图上的工具箱数据
    public getMapToolIconData(url: string) {
      // const url = './json/mapToolIcon.json';
      return this.rSerivce.serverObj.get(url);
    }
}
