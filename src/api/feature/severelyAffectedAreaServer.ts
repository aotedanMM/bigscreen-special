import { RequestServerClass } from '../../util/request';

/* 严重受损区域*/
export class SeverelyAffectedAreaServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    axiosFilterFn.call(this, this.rSerivce.serverObj);
  }

  public getMapJSON() {
    const url = 'json/electricityDamage/electricityDamage.json';
    return this.rSerivce.serverObj.get(url);
  }
}
