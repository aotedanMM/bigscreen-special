import { RequestServerClass } from '@/util/request';
import publishObjectPath from '@/util/configRegistry';

export class SubstanceInfo {
  public rSerivce: any;
  public substanceService: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.substanceService = publishObjectPath.value.substanceModelServer;
  }
  public getDataForSubstance(parms: any) {
    const url: any = this.substanceService + '/emergdemand';
    const parmstemp: any = 'params=' + encodeURIComponent(JSON.stringify(parms));
    const config: any = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    return this.rSerivce.serverObj.post(url, parmstemp, config);
  }
}
