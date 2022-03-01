import { RequestServerClass } from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class GisStorageTankServer {
  public rSerivce: any;
  public GisStorageTankSerivce: any;
  public GisStorageTankSerivceTwo: any;
  // public weatherSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.GisStorageTankSerivce = publishObjectPath.value.chemicaloutfire;
    this.GisStorageTankSerivceTwo = publishObjectPath.value.chemicalfire;
    // this.weatherSerivce = publishObjectPath.value.jieyangQixiang;
  }

  // 大型储罐火灾消防分析模型
  public getLargeTankFireAnalysisModel(params: any) {
    const url = this.GisStorageTankSerivce + '/gsafety/model/chemicaloutfire?params=' +
      encodeURIComponent(JSON.stringify(params.params)) +
      '&validDays=' +
      encodeURIComponent(JSON.stringify(params.validDays));
    return this.rSerivce.serverObj.post(url, params);
  }
    // 大型储罐火灾分析模型
    public getLargeTankFireModel(params: any) {
        const url = this.GisStorageTankSerivceTwo + '/gsafety/model/chemicalfire?params=' +
        encodeURIComponent(JSON.stringify(params.params)) +
          '&modelId=' +
          encodeURIComponent('chemicalfire');
        return this.rSerivce.serverObj.post(url);
      }
    // 大型储罐火灾最新分析模型
    // public getLargeTankFireModelTwo(params: any) {
    //   const url = this.weatherSerivce + '/api/dangerPage/getPolygonArea?params=' +
    //     encodeURIComponent(JSON.stringify(params.params));
    //   return this.rSerivce.serverObj.post(url, params);
    // }
}
