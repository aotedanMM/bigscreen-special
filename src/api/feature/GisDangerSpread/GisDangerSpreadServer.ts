import { RequestServerClass } from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class GisDangerSpreadServer {
  public rSerivce: any;
  public GisDangerSpreadService: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.GisDangerSpreadService = publishObjectPath.value.DangerSpread;
  }
  // 获取泄漏物质
  public getLevealMatter() {
    const url = './json/gisDangerSpread/levealMatter.json';
    return this.rSerivce.serverObj.get(url);
  }
  // 点击开始分析触发扩散模型方法
  public getDataForChemicalleak(parms: any) {
    const url: any = this.GisDangerSpreadService + '/gsafety/model/task/chemicalleak';
    const parmstemp: any = 'params=' + encodeURIComponent(JSON.stringify(parms)) + '&validDays=' + encodeURIComponent(JSON.stringify(1000));
    const config: any = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.rSerivce.serverObj.post(url, parmstemp, config);
  }
  // 从task中获取数据
  public getDataFromTaskForChemicalleak(id: any) {
    const url: any = this.GisDangerSpreadService + '/gsafety/model/task/' + id;
    return this.rSerivce.serverObj.get(url);
  }
}
