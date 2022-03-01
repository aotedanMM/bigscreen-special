import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';

// 资源服务-对接中台数据服务--山洪风险
export default class GsemergencyServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    // test
    // (window as any).resourceServer = this;
  }

  /**
  * 山洪告警数量汇总
  * @param opts
  * @param opts.time 时间 60 | 120。60表示1小时，120表示2小时
  */
  public getRiskCount(opt: any) {

    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.floodServer + `/api/gsemergency/natural/mountainTorrentRisk/getAllRiskCount/v1?time=${opt.time}&mark=${opt.mark}`;
      const res: any = await this.rSerivce.serverObj.get(url);
      const result1: any = res.data.data || {};
      resolve(result1);
    });
  }
  /**
 * 山洪风险告列表
 * @param opts
 * @param opts.time 必填。时间 60 | 120。60表示1小时，120表示2小时
 * @param opts.state 非必填。转移状态：0 | 1。0是准备转移。1是立即转移。
 * @param opts.districtCode 非必填。行政区划编码。
 */

  public getModelData(opt: any) {
    //   let  params = 'time=' + opt.time;
    //   if (opt.state) {
    //   params += '&state=' + opt.state;
    //  }
    //   if (opt.districtCode) {
    //   params += '&districtCode=' + opt.districtCode;
    //  }
    //  return new Promise(async (resolve, reject) => {
    //   const url: string = publishObjectPath.value.floodServer + `/api/gsemergency/natural/mountainTorrentRisk/getLiveRiskList/v1?` + params;
    //   const res: any = await this.rSerivce.serverObj.get(url);
    //   const result1: any = res.data.data || {};
    //   resolve(result1);
    // });
    const url = '/api/gsemergency/natural/mountainTorrentRisk/getAllRiskList/v1';
    // return this.rSerivce.serverObj.post(url, data);
    const self = this;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opt).then((res: any) => {
        resolve(res.data);
      });
    });
  }
  /**
 * 详情
 * @param opts
 * @param opts.id 必填。村庄id。
 * @param opts.state 必填。转移状态：0 | 1。0是准备转移。1是立即转移。
 */
  public getModelDetail(opt: any) {
    const result: any = {
      data: {
        id: 'cun_0005',  // 村庄id
        name: '上李家', // 村庄名称
        people: '17', // 影响人数
        house: '2', // 影响房屋数
        contacts: '李三',
        telephone: '13244561238', // 联系人 、电话
        state: '0', // 0准备转移，1立即转移
        county: '海阳市',
        basin: 'WDD21201E0000000', // 流域代码
        floodcrtl: 55.0,  // 防洪能力  年
      },
    };
    // return new Promise(async (resolve, reject) => {
    //   resolve(result);
    // });
    let params = 'id=' + opt.id;
    if (opt.state) {
      params += '&state=' + opt.state + '&time=' + opt.time + '&mark=' + opt.mark;
    }
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.floodServer + `/api/gsemergency/natural/mountainTorrentRisk/getRiskDetail/v1?` + params;
      const res: any = await this.rSerivce.serverObj.get(url);
      const result1: any = res.data.data || {};
      resolve(result1);
    });
  }
}
