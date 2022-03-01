import {RequestServerClass} from '../../util/request';
// （图片）
export class PushDataRequestServe {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
          axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    public getPushDataByIds(eventId: string , locationId: string ) {
        const url = '/api/msg/' + eventId + '/' + locationId + '/v1';
        // localhost:8081/api/msg/8a8a8af96ef8b61c016ef8bdbe0c0000/key-event/v1
        // const url = 'http://192.168.0.138:8081/api/msg/test1215/zqypyc-rymjcs/v1'
        // return this.rSerivce.serverObj.get(url);
        const self = this;
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.get(url).then((res: any) => {
                const content = res.data.content ? JSON.parse(res.data.content) : null;
                if (content && content.length > 0) {
                  if (typeof content[0].data === 'string') {
                    const eventData = JSON.parse(content[0].data);
                    content[0].data = JSON.stringify(eventData);
                  } else if (typeof content[0].data === 'object') {
                    content[0].data = JSON.stringify(content[0].data);
                  }
                  res.data.content = JSON.stringify(content);
                  resolve(res);
                    // if (eventData.event && eventData.event.originalEventId) {
                    //     const originalEventId = eventData.event.originalEventId;
                    //     self.getMisEventIdByReceiveId(originalEventId).then((misEventId: any) => {
                    //         // if (misEventId) {
                    //         //     // const reg = new RegExp( originalEventId , 'g' );
                    //         //     // res.data.content.replace(reg, misEventId);
                    //         //     eventData.event.originalEventId = misEventId;
                    //         //     content[0].data = JSON.stringify(eventData);
                    //         //     res.data.content = JSON.stringify(content);
                    //         // }
                    //         eventData.event.originalEventId = misEventId || '';
                    //         content[0].data = JSON.stringify(eventData);
                    //         res.data.content = JSON.stringify(content);
                    //         resolve(res);
                    //     }).catch((err: any) => {
                    //         resolve(res);
                    //     });
                    // } else {
                    //     resolve(res);
                    // }
                } else {
                    resolve(res);
                }
            });
        });
    }
    public getAllData(paramsObj: any) {
        const url = '/api/eventDynamic/v3/findAllByType';
        return this.rSerivce.serverObj.post(url, paramsObj);
    }
    // 根据事件id获取mis系统事件id
    private getMisEventIdByReceiveId(receiveId: string) {
        const url = '/api/eventbase/getEventidByOriginid/v1?originid=' + receiveId;
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url).then((res: any) => {
                resolve(res.data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}
