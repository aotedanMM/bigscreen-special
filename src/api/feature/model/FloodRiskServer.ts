import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';

// 资源服务-对接中台数据服务
export default class FloodRiskServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    // test
    // (window as any).resourceServer = this;
  }
   /**
   * 根据行政区划统计
   * @param opts
   * @param opts.layerId
   * resourceServer.getStaticByDistrict({layerId:'bas_geologichazard'})
   */
  public getModelData(opt: any) {
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.floodServer + `/api/gsemergency/natural/gpmeltpngmessage/getNumMeltPngMessage/v1?num=${opt.num}&type=${opt.type}`;
      const res: any = await this.rSerivce.serverObj.get(url);
      const result1: any = res.data.data || {};
      resolve(result1);
    });
  }
}
