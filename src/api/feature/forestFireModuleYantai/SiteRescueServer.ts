import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 防汛服务
export class SiteRescueServer {
    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }

    // 事件动态-救援阶段-扑火救援接口-根据事件id查询
    public getRescueFireInfoByEventId(opts: any) {
      const url = '/rescueFire/v1/findAll';
      return this.rSerivce.serverObj.post(url, opts);
    }
    // 事件动态-救援阶段-人员转移接口-根据事件id查询
    public getRescueDisplacementInfoByEventId(opts: any) {
      const url = '/rescueDisplacement/v1/findAll';
      return this.rSerivce.serverObj.post(url, opts);
    }
    // 事件动态-救援阶段-医疗救助接口-根据事件id查询
    public getRescueMedicalHelpInfoByEventId(opts: any) {
      const url = '/rescueMedicalHelp/v1/findAll';
      return this.rSerivce.serverObj.post(url, opts);
    }
    // 事件动态-救援阶段-火场清理接口-根据事件id查询
    public getFireInfoByEventId(eventId: string) {
      const url = '/fire/clear/find/eventid?eventId=' + eventId;
      return this.rSerivce.serverObj.get(url);
    }
    // 事件动态-救援阶段-社会安全接口-根据事件id查询
    public getEventbaseInfoByEventId(eventId: string) {
      const url = '/eventbase/find/relevance/event?eventId=' + eventId;
      return this.rSerivce.serverObj.get(url);
    }
    /*事件动态列表 */
    public getDynamicLists(opts: any): Promise<any> {
      const url = '/eventDynamic/v2/pageSelect';
      return this.rSerivce.serverObj.post(url, opts);
    }
}
