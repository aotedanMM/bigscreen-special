import {RequestServerClass} from '../../util/request';
// （图片）
export class UpdateEadsEaffectRange {

  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    if (axiosFilterFn) {
      axiosFilterFn.call(this, this.rSerivce.serverObj);
    }
  }
  /**
   * 当修改经验圈之后,通知支撑屏 同步信息
   * data: {
        "eventExtra": {
          "affectRange": "string" // 经验圈  '5,10,20,50'
        },
        id: '', // 事件id
   * }
   * */
  public postUpdateEadsEaffectRange(data: any) {
    const url = `/api/event/updateEadsEaffectRange/v1`;
    return this.rSerivce.serverObj.post(url, data);
  }
}
