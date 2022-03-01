import { RequestServerClass } from '../../../util/request';

// 受灾情况
export default class DisasterSituationServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 获取自然灾害
   * @param eventId
   */
  public getStatistics(eventId: string) {
    if (!eventId) {
      return;
    }
    const url = '/api/msg/' + eventId + '/nature_disaster/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(url).then((res: any) => {
        const content = res.data.data.content;
        let data = content ? JSON.parse(content) : null;
        if (data && data.length > 0) {
          data = data[0] && data[0].data;
          data = JSON.parse(data);
          data = data.data;
          data.renkou = data.renkou || {};
          data.fangwu = data.fangwu || {};
          data.jingji = data.jingji || {};
          data.nongye = data.nongye || {};
          if (data.counties) {
            data.counties.forEach((element: any) => {
              element.renkou = element.renkou || {};
              element.fangwu = element.fangwu || {};
              element.jingji = element.jingji || {};
              element.nongye = element.nongye || {};
            });
          }
          resolve(data);
        } else {
          resolve({});
        }
      });
    });
  }

  /**
   * 获取救灾工作情况
   * @param eventId
   */
  public getDisasterData(eventId: string) {
    if (!eventId) {
      return;
    }
    const url = '/api/msg/' + eventId + '/rescue_disaster/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(url).then((res: any) => {
        const content = res.data.data.content;
        let data = content ? JSON.parse(content) : null;
        if (data && data.length > 0) {
          data = data[0] && data[0].data;
          data = JSON.parse(data);
          data = data.data;
          data.benji = data.benji || {};
          data.xiaji = data.xiaji || {};
          if (data.counties) {
            data.counties.forEach((element: any) => {
              element.benji = element.benji || {};
              element.xiaji = element.xiaji || {};
            });
          }
          resolve(data);
        } else {
          resolve({});
        }
      });
    });
  }
}
