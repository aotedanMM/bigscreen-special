import { RequestServerClass } from '../../../util/request';
export default class EmergencyResponseServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   * 查预案数据
   * @param opts 查
   */
  public getDetailInfo(opts: any) {
    const url = '/gemp-plan/api/gemp/node/emergency/all/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then(
        (response: any) => {
          resolve(response.data);
        },
        (err: any) => {
          reject(err);
        },
      );
    });
  }
  /**
   * 查预案手册
   * @param opts 查
   */
  public getPlanInfo(opts: any) {
    const url = '/gemp-plan/api/gemp/plan/emergency/plan/manual/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then(
        (response: any) => {
          resolve(response.data);
        },
        (err: any) => {
          reject(err);
        },
      );
    });
  }
  /**
   * 查响应级别
   * @param opts 查
   */
  public getLeverInfo(opts: any) {
    const url = '/gemp-plan/api/gemp/plan/digital/id/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then(
        (response: any) => {
          resolve(response.data);
        },
        (err: any) => {
          reject(err);
        },
      );
    });
  }


}
