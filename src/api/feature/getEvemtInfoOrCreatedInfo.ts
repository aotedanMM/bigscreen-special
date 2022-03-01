import {RequestServerClass} from '../../util/request';
// （图片）
export class GetEvemtInfoOrCreatedInfo {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  /**
   * 根据事件id 和 userName 获取事件信息
   * 此处针对事件列表中的 接报 和 地震速报
   * */
  public getEventInfoByIdAndUserName(data: any) {
    const url = `/api/event/getByIdAndUserNameInfo/v1?id=${data.id}&userName=${data.userName}`;
    // const url = '/api/event/getByIdAndUserNameInfo/v1?id=' + data.id +'&userName=' + data.userName;
    // return this.rSerivce.serverObj.post(url);
    const self = this;
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((res: any) => {
        const originalEventId = res.data.eventId;
        self.getMisEventIdByReceiveId(originalEventId).then((misEventId: any) => {
            if (misEventId) {
              res.data.eventId = misEventId;
            }
            resolve(res);
        }).catch((err: any) => {
            resolve(res);
        });
      });
    });
  }

  /**
   * 传参数 新建并获取事件信息
   * 此处针对一键搜进入处置
   * */
  public getCreatedEventInfo(data: any) {
    const url = '/api/event/v1/display/addCommonSpecialSubjectEvent';
    return this.rSerivce.serverObj.post(url, data);
  }

    /**
   * 传参数 森火专题
   *
   * */
  public getfirepointdEventInfo(data: any) {
    const url = '/api/event/v1/display/forestFire/addCommonSpecialSubjectEvent';
    return this.rSerivce.serverObj.post(url, data);
  }
  // 根据事件id获取mis系统事件id
  private getMisEventIdByReceiveId(receiveId: string) {
    const url = '/api/eventbase/getEventidByOriginid/v1?originid=' + receiveId;
    return new Promise((resolve, reject) => {
      if (!receiveId) {
        resolve('');
      }
      this.rSerivce.serverObj.post(url).then((res: any) => {
          resolve(res.data);
      }).catch((err: any) => {
          reject(err);
      });
    });
  }
}
