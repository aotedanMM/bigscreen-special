import { RequestServerClass } from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class GisEarthQuakeIntensity {
  public rSerivce: any;
  public IntensityService: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.IntensityService = publishObjectPath.value.EarthQuakeIntensity;
  }
  // 获取区县数据
  public getAreaData() {
    const url = './json/gisEarthQuakeIntensity/areaData.json';
    return this.rSerivce.serverObj.get(url);
  }
  // 点击开始分析触发扩散模型方法
  public getDataForIntensity(parms: any) {
    const url: any = this.IntensityService + '/earthquakeintensity';
    const parmstemp: any = 'params=' + encodeURIComponent(JSON.stringify(parms)) + '&validDays=' + encodeURIComponent(JSON.stringify(1000));
    const config: any = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.rSerivce.serverObj.post(url, parmstemp, config);
  }
}
