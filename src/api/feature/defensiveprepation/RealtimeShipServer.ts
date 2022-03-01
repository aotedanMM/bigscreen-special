import { RequestServerClass } from '../../../util/request';

// ais船舶数据
export default class RealtimeShipServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    opt.headers = { 'Content-Type': 'application/json' };
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 获取船舶数据分页列表
   * @param opts {Object}
   * @param opts.pageIndex {number}
   * @param opts.pageSize {number}
   */
  public getShipPagelist(opts: any) {
    if (!opts.nowPage && opts.pageIndex) {
      opts.nowPage = opts.pageIndex;
    }
    const url = '/api/realTimeShip/queryPageRealTimeShip/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        const result = res.data.data;
        result.data = [];
        result.list.forEach((element: any) => {
          if (element.longitude && element.latitude) {
            element.longitude = parseFloat((element.longitude || '') + '');
            element.latitude = parseFloat((element.latitude || '') + '');
            if (element.longitude && element.latitude) {
              result.data.push(element);
            }
          }
        });
        delete result.list;
        resolve(result);
      });
    });
  }

  /**
   * 根据时间获取船舶数据列表
   * @param opts {Object}
   * @param opts.startTime {string}
   */
  public getShipListByTime(opts: any) {
    const url = '/api/realTimeShip/getRealTimeShipList/v1?startTime=' + opts.startTime;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const data: any = res.data;
        const result: any = [];
        data.data.forEach((values: any) => {
          if (values[1] && values[2]) {
            const item: any = {};
            item.id = values[0];
            item.type = values[3];
            if (values[1].indexOf('度') > 0 && values[2].indexOf('度') > 0) {
              item.lng = this.DuFenMiao2LonLat(values[1].split(' ')[1]);
              item.lat = this.DuFenMiao2LonLat(values[2].split(' ')[1]);
            } else {
              item.lng = parseFloat((values[1] || '') + '');
              item.lat = parseFloat((values[2] || '') + '');
            }
            item.direction = parseInt(values[4], 10) - 90 + '';
            const str = values[5].split('/');
            item.state = str[0];
            item.speed = str[1];
            if (item.lng && item.lat) {
              result.push(item);
            }
          }
        });
        data.data = result;
        resolve(data);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
  /**
   * 根据半径获取船舶数据列表
   * @param opts {Object}
   * @param opts.longitude {string}
   * @param opts.latitude {string}
   * @param opts.radius {string}
   */
  public getShipListByRadius(opts: any) {
    // const url = '/api/realTimeShip/getRealTimeShipList/v1?longitude=' + opts.longitude + '&latitude=' + opts.latitude + '&radius=' + opts.radius;
    const url = '/api/realTimeShip/getRealTimeShipList/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, JSON.stringify(opts)).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
  /**
   * 根据id获取船舶详情数据
   * @param opts {Object}
   * @param opts.id {string}
   */
  public getShipDetail(opts: any) {
    const url = '/api/realTimeShip/getRealTimeShip/v1?id=' + opts.id;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
  // 度分秒转为经纬度 // 114度57.6630分30秒
  private DuFenMiao2LonLat(dfm: any) {
    const arr1 = dfm.split('度');
    const d = arr1[0];
    const arr2 = arr1[1].split('分');
    let f: any = parseFloat(arr2[0]) || 0;
    const arr3 = arr2[1].split('秒');
    const m: any = parseFloat(arr3[0]) || 0;
    f = f + m / 60;
    const du = f / 60 + parseFloat(d);
    return du;
  }
}
