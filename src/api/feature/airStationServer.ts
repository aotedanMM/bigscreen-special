import {RequestServerClass} from '../../util/request';

/* 航空站的接口*/
export class AirStationServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        axiosFilterFn.call(this, this.rSerivce.serverObj);
    }

    public getData(date: string) {
        const url = '/api/forestProtectionStanding/v1/getForestProtectionStandingList';
        return this.rSerivce.serverObj.post(url, date);
    }
    /**
     * 查询地图数据
     * @param opts 查询地图数据
     */
    public getMapData(opts: any) {
        const url = '/api/forestProtectionStanding/v1/getForestProtectionStandingList';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
              resolve(response.data);
            }, (err: any) => {
              reject(err);
            });
          });
    }
    /**
     * 查询详情数据
     * @param opts 查
     */
    public getDetailInfo(opts: any) {
        const url = '/api/forestProtectionStanding/v1/getForestProtectionStandingById';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
              resolve(response.data);
            }, (err: any) => {
              reject(err);
            });
          });
    }
}
