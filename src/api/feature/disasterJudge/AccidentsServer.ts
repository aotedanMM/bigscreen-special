
import {RequestServerClass} from '../../../util/request';

// 右侧树事件服务
export default class AccidentsServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
     * 获取事件信息
     * @param opts
     * @param opts.eventType {String}
     * @param opts.startTime {String}
     * @param opts.endTime {String}
     */
    public getEvents(opts: any) {
        // test data
        return new Promise((resolve, reject) => {
            const data: any = [];
            resolve(data);
        });
    }

    /**
     * 获取突发事件信息
     * @param opts
     * @param opts.eventType {String}
     * @param opts.startTime {String}
     * @param opts.endTime {String}
     */
    public getAccidents(opts: any) {
        // test data
        const url = '/api/event/accident/express/list/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                    resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
}

