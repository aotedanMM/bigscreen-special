import {RequestServerClass} from '../../util/request';
import Qs from 'qs';
/* 实时队伍的接口服务 */
export class RealtimeTeam {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 回传信息的接口服务
    public getreturnMesssageServer(obj: any) {
        const url = '/api/equipment/rtd/termtoterm/page/list/v1';
        return this.rSerivce.serverObj.post(url, obj);
    }
    // 装备列表数据的接口服务
    public getEquipmentListServer(param: any) {
        const url = '/api/rtdAddrperrel/v1/selectAddrperrelListByTeamids';
        // const data = Qs.stringify(param);
        const data = {
          params: param,
        };
        return this.rSerivce.serverObj.post(url, param);
    }
    // 历史轨迹的接口服务
    public getEquipmentHistoryServer(param: any) {
      const url = '/api/equipment/equipmentbyidhis/list/v1';
      return this.rSerivce.serverObj.post(url, param);
    }
    // 回传信息的更新状态接口服务
    public getUpdataReiceveServer(obj: any) {
      const url = '/api/equipment/rtd/termtoterm/updateReceive/v1';
      return this.rSerivce.serverObj.post(url, obj);
    }

    // 获取短报文数量的接口服务

    public NumberOfShortMessages(obj: any) {
      const url = '/api/equipment/rtd/termtoterm/v1/count';
      return this.rSerivce.serverObj.post(url, obj);
    }

}
