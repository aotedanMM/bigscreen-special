import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
import qs from 'qs';

const url: string = publishObjectPath.value.ForestFireServer;

// 林火模型服务
export class ForestFireModelServer {
  public rSerivce: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  /**
   * 查询森林火灾预报信息列表
   * @param opts
   * @param opts.modelId {string} // 所要执行的模型ID(model_config表中模型的id，如危化品爆炸为chemicalexplode、森火为fireforest)
   * @param [opts.token] {string} // 调用者标识
   * @param [opts.params] {string} //
   * @param [opts.validDays] {string} // 任务有效天数(模型运算完成后开始计时；默认-1（表示永久保留）)
   * 接口：POST /gsafety/model/{modelId}
   */
//   public analysis(param: string) {
//     const data = { params: param, token: "44" };
//     const pathUrl = `/gsafety/model/fireforest`;
//     return this.rSerivce.serverObj.post(pathUrl, qs.stringify(data));
//   }

  // 根据火点开始时间和分析时长，获取风场信息
  public getDefaultWind(opts: any) {
    const urlPath = '/api/gsemergency/emergency/use/getWindInfoList/v1';
    return this.rSerivce.serverObj.post(urlPath, opts);
  }

  public analysis(opts: any) {
    const urlPath = '/api/gsemergency/emergency/use/makeFireForecastPng/v1';
    const data = { params: opts};
    return this.rSerivce.serverObj.post(urlPath, data);
  }


}
