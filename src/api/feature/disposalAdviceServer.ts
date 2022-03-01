import { RequestServerClass } from '../../util/request';
import { IEventinfoParam } from '@/interface/feature/earthquake/Eventinfo.interface';

export class DisposalAdviceServer {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  public getData() {
    const url = './json/disposalAdvice.json';
    return this.rSerivce.serverObj.get(url);
  }

}
