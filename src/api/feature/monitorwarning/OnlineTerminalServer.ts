import { RequestServerClass } from '../../../util/request';
// 在线终端服务
export default class OnlineTerminalServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    opt.headers = { 'Content-Type': 'application/json' };
    this.rSerivce = new RequestServerClass(opt);
  }
  /**
   * 分页查询在线终端列表
   * @param opts
   * @param opts.pageSize: 10,
   * @param opts.nowPage: 1,
   * @param opts.keyWord: '', //非必填，关键字：终端所在位置，用户名，所在队伍
   * @returns {Promise}
   */
  public getOnlineStationsList(opts: any) {
    const url = '/gemp-user/api/gemp/user/onlineTerminal/list/v1';
    const result = {
      data: {
        list: [
          {
            userName: '张三',
            orgName: '所属单位1 ',
            address: '福山区****街道',
            telnumber: '13503043342', // 电话号码
            longitude: 117,
            latitude: 30,
            userId: '1', // 用户id
          },
          {
            userName: '张三',
            orgName: '所属单位2',
            checked: false,
            address: '福山区****街道',
            telnumber: '13503043342', // 电话号码
            longitude: 116,
            latitude: 31,
            userId: '2', // 用户id
          },
          {
            userName: '张三',
            orgName: '所属单位3',
            address: '福山区****街道',
            telnumber: '13503043342', // 电话号码
            longitude: 118,
            latitude: 30,
            userId: '3', // 用户id
          },
          {
            userName: '张三',
            orgName: '所属单位4',
            address: '福山区****街道',
            telnumber: '13503043342', // 电话号码
            longitude: 119,
            latitude: 30,
            userId: '4', // 用户id
          },
          {
            userName: '张三',
            orgName: '所属单位5',
            address: '福山区****街道',
            telnumber: '13503043342', // 电话号码
            longitude: 120,
            latitude: 30,
            userId: '5', // 用户id
          },
        ],
        total: 20,
      },
    };
    // return new Promise((resolve, reject) => {
    //   resolve(result);
    // });
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
        // resolve(result);
      });
    });
  }
  /**
   * 获取经纬度
   */
  public getOnlineXY(opts: any) {
    const url = '/gemp-user/api/gemp/user/onlineTerminal/detail/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  /**
   * 历史轨迹查询通过id
   * @param opts
   * @param opts.userId: 对应历史轨迹id
   * @returns {Promise}
   */
  public getHistoricalRoute(opts: any) {
    const url = '/gemp-user/api/user/findUserGpsList/v1';
    const result = this.mockTrack();
    // return new Promise((resolve, reject) => {
    //   resolve(result);
    // });
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
        // resolve(result);
      });
    });
  }
  /**
   * 在线终端详情查询
   * @param opts
   * @param opts.userId: 用户id
   * @returns {Promise}
   */
  public getTerminalDetail(opts: any) {
    const url = '/gemp-user/api/gemp/user/onlineTerminal/detail/v1?userId=' + opts.userId;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(url).then((res: any) => {
        resolve(res);
      });
    });
  }
  // 历史轨迹坐标数据模拟
  public mockTrack() {
    const result: any = { data: [] };
    const x = 112.73806;
    const y = 30.61686;
    for (let i = 0; i < 20; i++) {
      const item = {
        id: i,
        longitude: x + Math.random() * 1,
        latitude: y + Math.random() * 1,
        datetime: '2020-05-10 12:00:00',
      };
      result.data.push(item);
    }
    return result;
  }
}
