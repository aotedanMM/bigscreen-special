import { RequestServerClass } from '../../../util/request';

// 企业名称查询视频
export class CompanyVideoServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    opt.baseURL = (window as any).EMAP_CONFIG.common.resourceServer;
    console.log((window as any).EMAP_CONFIG.common);
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 根据企业名称查询视频数据
   * @param opts
   * @param opts.enterName // 企业名称
   */
  public getCompanyVideo(opts: any) {
    const url = '/api/video/enter?enterName=' + opts;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }

  /**
   * 获取视频播放地址
   * @param opts
   */
   public getCompanyVideoUrl(opts: any) {
    // const url = '/api/video/getVideoUrl?camCode=' + opts;
     return new Promise((resolve, reject) => {
      const url = 'http://172.25.31.2:18084/api/video/getVideoUrlHls?camCode=' + opts;
      this.rSerivce.serverObj.get(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }
}
