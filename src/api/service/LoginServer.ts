import { RequestServerClass } from '../../util/request';

export class LoginServer {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
      this.rSerivce = new RequestServerClass(opt);
      axiosFilterFn.call(this, this.rSerivce.serverObj);
  }

  public login(parma: any) {
      const url = 'api/gemp/duty/info/user/login';
      return this.rSerivce.serverObj.post(url , parma);
  }
  public token(parma: any) {
    const url = 'api/gemp/user/baseuser/baseinfo/id/v1';
    return this.rSerivce.serverObj.post(url , parma);
}

  // public getUserNameServer(obj: any) {
  //   const url = '/api/gemp/user/baseuser/baseinfo/id/v1';
  //   // return this.rSerivce.serverObj.post(url, obj);
  //   return this.rSerivce.serverObj.post(url,{
  //       "userId":obj.userId
  //   },{
  //       'headers':{'token':obj.token}
  //   }
  //   )
  // }
}
