import { RequestServerClass } from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class GisChemicalBlastServer {
  public rSerivce: any;
  public GisChemicalBlastService: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.GisChemicalBlastService = publishObjectPath.value.chemicalexplode;
  }
  // 存贮物质名
  public getSaveName(parms: any) {
    console.log(parms);
    if (parms === '固体爆炸') {
      const url = './json/gisChemicalBlast/saveNameSolid.json';
      return this.rSerivce.serverObj.get(url);
    }
    if (parms === '压力容器爆炸') {
      const url1 = './json/gisChemicalBlast/saveNameVessel.json';
      return this.rSerivce.serverObj.get(url1);
    }
    if (parms === '蒸汽云爆炸') {
      const url2 = './json/gisChemicalBlast/saveNameSteam.json';
      return this.rSerivce.serverObj.get(url2);
    }
    return {};
  }
  // 请求接口
  public getDataForChemicalBlast(params: any) {
    const config: any = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const timestamp = new Date().getTime();
    const url = this.GisChemicalBlastService + '/gsafety/model/chemicalexplode';
    const rtparm: any = 'params=' + encodeURIComponent(JSON.stringify(params)) + '&validDays=' + encodeURIComponent(JSON.stringify(1000)) + '&timestamp=' + encodeURIComponent(JSON.stringify(timestamp)) + '&token=' + encodeURIComponent('sometoken');
    return this.rSerivce.serverObj.post(url, rtparm, config);
  }
}
