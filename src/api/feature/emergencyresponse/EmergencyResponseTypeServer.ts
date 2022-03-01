import { RequestServerClass } from '../../../util/request';
export default class EmergencyResponseTypeServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   *
   * @param opts eventType类型转换
   */
  public changeEventType(opts?: any) {
    const url = '/api/eventdsssttyperel/' + opts.dsstypeid + '/sttypecode/v1';
    return new Promise((resolve, reject) => {
       this.rSerivce.serverObj.get(url).then(
         (response: any) => {
           const result = response.data;
           resolve(result);
         },
         (err: any) => {
           reject(err);
         },
       );
     });
  }
}
