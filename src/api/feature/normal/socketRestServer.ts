import { RequestServerClass } from '../../../util/request';

export class SocketRestServer {
  public rSerivce: any;
  public HazardQueryService: any;
  constructor(opt: any, axiosFilterFn?: any) {
    opt.baseURL = (window as any).EMAP_CONFIG.common.socketRestUrl;
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
  * 展示屏信息 发送到 推送屏
  * @param opts
  */
  public postEventInfo(opts: any) {
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post('/api/msg/push', opts).then((data: any) => {
        resolve(data);
      });
    });
  }
}
