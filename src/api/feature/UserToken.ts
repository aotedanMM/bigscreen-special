import {RequestServerClass} from '../../util/request';
export class UserToken {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  public postUserToken(data: any) {
    const url = `/gemp/gemp-user/api/gemp/user/baseuser/baseinfo/id/v1`;
    return this.rSerivce.serverObj.post(url, data);
  }
}
