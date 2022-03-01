import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
/* 航空站的接口*/
export class JiesiruiServer {

    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass({ baseURL: publishObjectPath.value.jieruisiPath.url });
    }

    /**
     * 群拨号
     * @param opts
     * @param opts.strDisMembersList 多个号码，用逗号隔开
     */
    public jiesiruiGroupCall(opts: any) {
      const url = '/api/gemp/dispatcher/jiesirui/group/call/v1';
      this.rSerivce.serverObj.post(url, opts);
    }
    // 挂断电话
    public jiesiruiHangUp() {
      const url = '/api/gemp/dispatcher/jiesirui/hangUp/v1';
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url).then((res: any) => {
          const data = res.data;
          resolve(data);
        }).catch((err: any) => {
          resolve('error');
        });
      });
    }
    // 登出
    public jiesiruiLogout() {
      const url = '/api/gemp/dispatcher/jiesirui/logout/v1';
      this.rSerivce.serverObj.post(url);
    }
    // 获取成员状态
    public jiesiruiMemberStatus() {
      const url = '/api/gemp/dispatcher/jiesirui/member/data/v1';
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url).then((res: any) => {
          const data = res.data;
          resolve(data);
        });
      });
    }
    /**
     * 单拨号
     * @param opts
     * @param opts.mobilePhone 号码
     */
    public jiesiruiSingllCall(opts: any) {
      const url = '/api/gemp/dispatcher/jiesirui/single/call/v1';
      opts.user = publishObjectPath.value.jieruisiPath.user;
      opts.pwd = publishObjectPath.value.jieruisiPath.pwd;
      return new Promise((resolve, reject) => {
        this.rSerivce.serverObj.post(url, opts).then((res: any) => {
          const data = res.data;
          resolve(data);
        });
      });
    }
    // 成员数据添加
    public jiesiruiMemberDataAdd() {
      const url = '/api/gemp/dispatcher/jiesirui/test/member/v1';
      this.rSerivce.serverObj.post(url);
    }

}
