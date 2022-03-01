import { RequestServerClass } from '../../../util/request';

/* 实时车辆位置*/
export class RealTimeCar {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
   * 查询车辆信息列表
   * @param opts （空对象全查）
   * @param opts.polygon  wkt格式（可选）
   * @param opts.keyWord  关键字
   * @param opts.pageIndex  页码
   * @param opts.pageSize  每页条目数
   */
  public getFireEnginesInfo(opts: any) {
    // POLYGON((110.42115 32.985485,110.82865 32.65175,104.94973 25.121483,110.42115 32.985485))
    // opts.polygon = 'POLYGON((110.42115 32.985485,110.82865 32.65175,104.94973 25.121483,110.42115 32.985485))';
    if (!opts.nowPage && opts.pageIndex) {
      opts.nowPage = opts.pageIndex;
    }
    if (!opts.keyWord) {
      delete opts.keyWord;
    }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post('/api/equipment/fireengine/car/v1', opts).then((response: any) => {
        const result = response.data.data ? response.data.data.list : [];
        const data: any = {};
        // 暂时前端过滤，后期为后台过滤
        // if (opts.keyWord) {
        //   result = result.filter((item: any) => (item.cphm || '').indexOf(opts.keyWord) > -1);
        // }
        data.total = response.data.data ? response.data.data.total : 0;
        // 暂时前端手动分页，后期为后台分页
        // if (opts.pageIndex && opts.pageSize) {
        //   const start = (parseInt(opts.pageIndex, 10) - 1) * parseInt(opts.pageSize, 10);
        //   const end = (parseInt(opts.pageIndex, 10)) * parseInt(opts.pageSize, 10);
        //   result = result.slice(start, end);
        // }
        for (const kk of Object.keys(result)) {
          result[kk].geom = {};
          result[kk].geom.coordinates = [];
          result[kk].geom.coordinates.push(result[kk].longitude);
          result[kk].geom.coordinates.push(result[kk].latitude);
          result[kk].NAME = result[kk].cphm.replace('？', '');
          result[kk].LON = result[kk].longitude;
          result[kk].LAT = result[kk].latitude;
          result[kk]._id = result[kk].gpsid;
        }
        data.data = result;
        resolve(data);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  /**
   * 查询车辆信息-地图信息查询
   * @param opts （空对象全查）
   * @param opts.polygon  wkt格式（可选）
   */
  public getFireEnginesMapData(opts: any) {
    if (!opts.pageIndex) {
      opts.pageIndex = 1;
    }
    if (!opts.pageSize) {
      opts.pageSize = 1000 * 10000;
    }
    if (!opts.nowPage) {
      opts.nowPage = 1;
    }
    if (!opts.keyWord) {
      delete opts.keyWord;
    }
    return new Promise((resolve, reject) => {

      this.rSerivce.serverObj.post('/api/equipment/fireengine/car/v1', opts).then((response: any) => {
        const result = response.data.data ? response.data.data.list : [];
        const data: any = {};
        data.total = response.data.data ? response.data.data.total : 0;
        for (const kk of Object.keys(result)) {
          result[kk].geom = {};
          result[kk].geom.coordinates = [];
          result[kk].geom.coordinates.push(result[kk].longitude);
          result[kk].geom.coordinates.push(result[kk].latitude);
          result[kk].NAME = result[kk].cphm.replace('？', '');
          result[kk].LON = result[kk].longitude;
          result[kk].LAT = result[kk].latitude;
          result[kk]._id = result[kk].gpsid;
        }
        data.data = result;
        resolve(data);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  /**
   * 获取车辆历史轨迹
   * @param opts
   * @param opts.gpsid
   * @param opts.starttime
   * @param opts.endtime
   */
  public getFireEnginesInfoHistory(opts: any) {
    if (!opts.gpsId) {
      opts.gpsId = opts.gpsid;
    }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post('/api/equipment/fireengine/car/history/v1', opts).then((response: any) => {
        resolve(response.data.data);
      }, (err: any) => {
        reject(err);
      });
    });
  }
}
