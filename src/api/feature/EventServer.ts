import { RequestServerClass } from '@/util/request';
// 关于事件的
export class EventServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }

  public getPointEventData() {
    const url = './json/event/keyEvent.json';
    return this.rSerivce.serverObj.get(url);
  }
  public getEventListData(data: any) {
    const url = '/api/event/weaear/list/v1';
    const self = this;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((res: any) => {
        if (data.pageSize && data.nowPage) {
          data.pageSize = parseInt(data.pageSize + '', 10);
          data.nowPage = parseInt(data.nowPage + '', 10);
          res.data = self.processPage(res.data, data.pageSize, data.nowPage);
        }
        resolve(res);
      });
    });
  }
  /**
   * 分页信息处理
   * @param data
   */
  private processPage(data: any, pageSize: number, pageIndex: number) {
    const total = data.length;
    const starter = pageSize * (pageIndex - 1);
    let ender = pageSize * pageIndex;
    ender = ender > total ? total : ender;
    const res = data.slice(starter, ender);
    data = {
      list: res,
      total,
    };
    return data;
  }
}
