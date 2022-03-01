import { RequestServerClass } from '../../util/request';
import publishObjectPath from '@/util/configRegistry';

/* 历史地震的接口*/
export class HistoricalEarthquakeServer {

    public rSerivce: any;
    public rSerivceTwo: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.rSerivceTwo = new RequestServerClass({ baseURL: publishObjectPath.value.floodServerPath });
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getData(date: string) {
        const url = '/api/historyEarthquake/v1/getHistoryEarthquakeMap';
        return this.rSerivce.serverObj.post(url, date);
    }

    /**
  * 获取历史地震统计信息 带geometry
  * @param opts {Object}
  * @param opts.districtCode 行政区划代码
  * @returns {Promise}
  */
    public getEarthquake(opts: any) {
        const url = '/api/earthquake/history/statistic';
        return new Promise((resolve, reject) => {
            this.rSerivceTwo.serverObj.post(url, opts).then((res: any) => {
                resolve(res.data);
            });
        });
    }
    /**
   * 查询历史地震列表分页
   * @param opts
   * @param opts.pageSize: 10,
   * @param opts.nowPage: 1,
   * @param opts.districtCode: '370686', // 非必填，行政区划编码
   * @param opts.type: 'gongan' // 非必填，统计接口返回的类型code
   * @param opts.sortDesc:  // 非必填，排序方式
   * @param opts.sortField:  // 非必填，排序字段
   * @returns {Promise}
   */
    public getEarthquakePageList(opts: any) {
        const url = '/api/earthquake/history/list/page';
        return new Promise((resolve, reject) => {
            this.rSerivceTwo.serverObj.post(url, opts).then((res: any) => {
                resolve(res.data);
            });
        });
    }

    /**
 * 查询历史地震列表
 * @param opts
 * @param opts.pageSize: 10,
 * @param opts.nowPage: 1,
 * @param opts.districtCode: '370686', // 非必填，行政区划编码
 * @param opts.type: 'gongan' // 非必填，统计接口返回的类型code
 * @param opts.sortDesc:  // 非必填，排序方式
 * @param opts.sortField:  // 非必填，排序字段
 * @returns {Promise}
 */
    public getEarthquakeList(opts: any) {
        const url = '/api/earthquake/history/list/';
        return new Promise((resolve, reject) => {
            this.rSerivceTwo.serverObj.post(url, opts).then((res: any) => {
                resolve(res.data);
            });
        });
    }
}
