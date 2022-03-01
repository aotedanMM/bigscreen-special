import { RequestServerClass } from '../../util/request';
import { AxiosRequestConfig } from 'axios';

export class LeftMenuServer {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
      this.rSerivce = new RequestServerClass(opt);
      axiosFilterFn.call(this, this.rSerivce.serverObj);
  }

  public getData() {
    const url =   './json/leftnav/leftnav.json';
    return this.rSerivce.serverObj.get(url);
  }
}
