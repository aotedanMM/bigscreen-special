import { RequestServerClass } from '../../../util/request';
export default class EmergencyResponseEventServer {
    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
     /**
      * 查最新预案
      * @param opts 查
      */
      public getNewInfo(opts: any) {
        const url = '/gemp-event/api/gemp/event/eventplan/plan/lastone/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
    /**
    * 启动响应
    * @param opts 查
    */
    public getDetailInfo(opts: any) {
        const url = '/gemp-event/api/gemp/event/eventplan/plan/start/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            }, (err: any) => {
                reject(err);
            });
        });
    }
   /**
   * 查工作组
   * @param opts 查
   */
  public getDutyInfo(opts: any) {
    const url = '/gemp-event/api/gemp/event/eventcommander/list/findbyevent/v1';
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
