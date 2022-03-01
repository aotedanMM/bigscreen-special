import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
import { getDateFormat } from '@/util/tools';
// 风情服务
export default class MonitorWarningServer {
  public rSerivce: any;
  public rSerivce2: any;
  public emapServiceFilter: any;
  constructor(opt: any, axiosFilterFn?: any) {
    opt.headers = { 'Content-Type': 'application/json' };
    this.rSerivce = new RequestServerClass(opt);
    this.rSerivce2 = new RequestServerClass({
      baseURL: publishObjectPath.value.serverPath,
    });
    this.emapServiceFilter = publishObjectPath.value.district;
  }
  /**
   * 获取面板统计信息
   * @param opts {Object}
   * @returns {Object}
   */
  public getStatistics(opts?: any) {
    // tslint:disable-next-line: no-debugger
    // debugger;
    const url = '/tSwsshc/v1/getRealTimeInfoCount';
    const result = {
      data: {
        weatherNum: null, // 气象监测站数量
        windNum: null, // 风情监测站数量
        rainNum: null, // 雨情监测站数量
        waterNum: null, // 水情监测站数量
        engineeringNum: null, // 工情监测站数量
        cameraNum: null, // 视频监控数量
        riverNum: null, // 河流监测站点数量
        reservoirNum: null, // 水库数量
        countweirGateWater: null, // 堰闸监测站数量
        floodvillage: null, // 山洪受灾村数量
        reservoirCountdx: null, // 大型水库数量
        reservoirCountzx: null, // 中型水库数量
        reservoirCountxx: null, // 小型水库数量
      },
    };
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        const data = res.data.data;
        result.data.weatherNum = data.weatherNum;
        result.data.windNum = data.windNum;
        result.data.rainNum = data.rainNum;
        result.data.waterNum = data.waterNum;
        result.data.engineeringNum = data.engineeringNum;
        result.data.cameraNum = data.cameraNum;
        result.data.riverNum = data.riverNum;
        result.data.reservoirNum = data.reservoirNum;
        result.data.countweirGateWater = data.countweirGateWater;
        result.data.floodvillage = data.floodvillage;
        result.data.reservoirCountdx =  data.reservoirCountdx;
        result.data.reservoirCountzx = data.reservoirCountzx;
        result.data.reservoirCountxx = data.reservoirCountxx;
        resolve(result);
      });
    });
    // return this.rSerivce.serverObj.post(url, opts);
  }
  /**
   * 获取面板统计信息
   * @param opts {Object}
   * @returns {Object}
   */
  public getWarningStatistics(opts?: any) {
    const url = '/tSwsshc/v1/getOverCountInfo';
    const result: any = {
      data: {
        windWarningNum: null, // 风情监测站预警数量
        rainWarningNum: null, // 雨情监测站预警数量
        waterWarningNum: null, // 水情监测站预警数量
        engineeringNum: null, // 工情监测站数量
        weatherWarningNum: null, // 气象预警数量
        fireTotalNum: null, // 火点统计
        fireWeatherWarningNum: null, // 森火预警信息
        earthWeatherWarningNum: null, // 地震预警信息
      },
    };
    // console.log(this.rSerivce, 88888888888888888);
    // console.log(this, 6666666666);
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.get(url).then(async (res: any) => {
        const data = res.data.data;
        // result.data = data;
        result.data = Object.assign(result.data, data);
        const opt = ['11B06', '11B03', '11B01', '11B14', '11B15', '11B37'];
        const fireOpt = ['11B25', '11B06', '11B14'];
        const earthOpt = ['11B06', '11B03', '11B14', '11B09', '11B37'];
        const optss = {
          // type: '11B06,11B03,11B01,11B14,11B15,11B37,11B25,11B09',
          type: '11B01,11B03,11B09,11B25,11D00,11B04,11B56,11B05,11B16,11B21,11B17,11B22,11A01,11B14,11B19,11B15,11B51,11B06',
          startTime: getDateFormat({ last: 'week' }), //  oneDay
          endTime: getDateFormat(),
          districtCode: publishObjectPath.value.district.root,
          searchType: '1',
        };
        const fireWres: any = await this.getFireStatisticsTotal();
        const dartt: any = await this.getWeatherWarningStatic(optss); // 预警信息
        result.data.fireWeatherWarningNum = dartt.total;
        result.data.weatherWarningNum = this.getTotal(opt, dartt.data);
        result.data.earthWeatherWarningNum = this.getTotal(earthOpt, dartt.data);
        result.data.fireTotalNum = fireWres.data.today;
        resolve(result);
      });
    });
    // return this.rSerivce.serverObj.post(url, opts);
  }
  //  预警报告 导出
  public getDownLoad(opts: any) {
    const url = '/api/tRainData/v1/exportWarnReport';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj
        .post(url, opts, { responseType: 'blob' })
        .then((res: any) => {
          resolve(res);
        });
    });
  }

  public formatDate(str: string): string {
    // const result = (new Date(str) as any).format('yyyy-MM-dd hh:mm:ss');
    return str;
  }
  /**
   * 获取统计-火点统计
   */
  private getFireStatisticsTotal(opts?: any) {
    const url = '/api/forestfire/count';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  private getTotal(array: any, searchData: any) {
    const allDatatt = Object.keys(searchData);
    let total = 0;
    array.forEach((item: any) => {
      if (allDatatt.includes(item)) {
        if (searchData[item].length > 0) {
          searchData[item].forEach((key: any) => {
            total += key.count;
          });
        }
      }
    });
    return total;
  }

  private getWeatherWarningStatic(opts: any) {
    const url = '/api/event/weather/SignalTypeLevel/list/v1';
    const result: any = {};
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((res: any) => {
        // console.log('吼吼', res);
        const data = JSON.parse(res.data.data.levelList);
        result.data = data;
        result.total = res.data.data.total;
        resolve(result);
      });
    });
  }

}
