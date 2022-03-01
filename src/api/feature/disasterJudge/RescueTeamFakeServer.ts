
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class RescueTeamFakeServer {

    public rSerivce: any;
    public rescueTeamService: any;
    public emapServiceFilter: any;
    public teamDispatch: any; // 力量调度服务
    private locationHash: any = {};
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.teamDispatch = new RequestServerClass({ baseURL: publishObjectPath.value.misServerPath });
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 力量调度：统计出动情况的个数
     * @param opts
     * @param opts.eventId  事件ID
     */
    public dispatchTeam(opts: any) {
        return new Promise((resolve, reject) => {
            const result = this.getJson('dispatchTeamStat.json');
            resolve(result);
        });
    }
    /**
     * 力量调度：出动情况列表查询
     * @param opts
     * @param opts.eventId  事件ID
     * @param opts.dispatchTaskid: "string",
     * @param opts.endFillTime": "2020-05-25T06:31:31.081Z",
     * @param opts.nowPage": 0,
     * @param opts.orgName": "string",
     * @param opts.pageSize": 0,
     * @param opts.startFillTime": "2020-05-25T06:31:31.081Z",
     * @param opts.teamId": "string"
     */
    public dispatchTeamList(opts: any) {
        const self = this;
        const endPoints = opts.endPoints;
        return new Promise((resolve, reject) => {
            const result: any = this.getJson('dispatchTeamList.json') || {};
            let list = result.data.list;
            list = self.dynamicData(list, endPoints);
            if (opts.teamId) {
                const newList: any = [];
                list.forEach((element: any) => {
                    if (element.orgCode === opts.teamId) {
                        newList.push(element);
                    }
                });
                result.data.list = newList;
            }
            console.log(result.data.list);
            resolve(result);
        });
    }
    /**
     * 力量调度 查询 支队详情
     * @param opts
     * @param opts.dispatchcaseId 行动id
     */
    public getDispatchTeamDetail(opts: any) {
        const self = this;
        const endPoints = opts.endPoints;
        return new Promise((resolve, reject) => {
            const result: any = this.getJson('dispatchTeamList.json') || {};
            let list = result.data.list;
            list = self.dynamicData(list, endPoints);
            if (opts.dispatchcaseId) {
                let data: any = {};
                list.forEach((element: any) => {
                    if (element.dispatchcaseId === opts.dispatchcaseId) {
                        data = element;
                    }
                });
                result.data = data;
            }
            resolve(result);
        });
    }
    /**
     * 任务反馈，分页条件查询任务反馈列表
     * @param opts
     * @param opts.backState": "string",
     * @param opts.eventId": "string",
     * @param opts.execState": "string",
     * @param opts.feedbackEndTime": "2020-05-25T07:00:52.854Z",
     * @param opts.feedbackStartTime": "2020-05-25T07:00:52.854Z",
     * @param opts.nowPage": 0,
     * @param opts.pageSize": 0,
     * @param opts.taskId": "string",
     * @param opts.taskTitle": "string"
     */
    public getDispatchtaskback(opts: any) {
        opts.eventId = 'ff808081729d9fc00172a1f94d820030';
        opts.taskId = 'ff808081729d9fc00172a20e82880034';
        const url = '/gemp-event/api/gemp/event/dispatchtaskback/list/v1';
        // opts.eventId = 'ff80808171e810710172069dee790008';
        // opts.taskId = '8a8a8ad8723fdfb201723fe20aa20000';
        // return this.teamDispatch.serverObj.post(url, opts);
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                    const result = response.data.data.list;
                    resolve(result);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
    /**
     * 力量调度：根据任务反馈id 查询附件列表
     * @param opts
     * @param opts.taskbackId
     */
    public getDispatchAttachmentList(opts: any) {
        const url = '/gemp-event/api/gemp/event/dispatchtaskback/listAttach/v2';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                    resolve(response.data.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
    /**
     * 任务反馈，根据id查询某个任务反馈详情
     * @param opts
     * @param opts.taskbackId
     */
    public getDispatchtaskbackFindOne(opts: any) {
        const url = '/gemp-event/api/gemp/event/dispatchtaskback/findOne/v1';
        // return this.teamDispatch.serverObj.post(url, opts);
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                    resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
     /**
     * 根据出动任务id，需求提取列表查询
     * @param opts
     * @param opts.taskbackId
     */
    public getQueryPresentationList(opts: any) {
        opts.taskbackId = 'ff808081729d9fc00172a2157a020036';
        const url = '/gemp-event/api/base/event/demand/presentation/queryPresentationList';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                    resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
    /**
     * 力量调度：查询出动队伍详情
     * @param opts
     * @param opts.teamId": "string"
     */
    public getDispatchResidenceDetail(opts: any) {
        opts.teamId = 'ff808081720df0e601721170861e0001';
        const url = '/gemp-data/api/gemp/resource/rescueteam/team/detail/v1';
        return new Promise((resolve, reject) => {
            this.teamDispatch.serverObj.post(url, opts).then((response: any) => {
                response.data.data.type = 'zhudi';
                resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }

    private getJson(jsonName: string) {
        const publicPath = require('@/config/index').jsonPath;
        let result = null;
        $.ajax({
            url : publicPath + 'json/data/dispatch/' + jsonName,
            async : false,
            success(data: any) {
               result = data;
            },
        });
        return result;
    }

    private dynamicData(list: any, endPoints: any) {
        const self = this;
        list.forEach((element: any) => {
            if (!!self.locationHash[element.dispatchcaseId]) {
                self.locationHash[element.dispatchcaseId] ++;
                if (self.locationHash[element.dispatchcaseId] > 120) {
                    self.locationHash[element.dispatchcaseId] = 1;
                }
            } else {
                self.locationHash[element.dispatchcaseId] = 1;
            }
            const x = parseFloat(element.longitude + '');
            const y = parseFloat(element.latitude + '');
            const xEnd = parseFloat(endPoints[0] + '');
            const yEnd = parseFloat(endPoints[1] + '');
            const xIncrease = (xEnd - x) / 120;
            const yIncrease = (yEnd - y) / 120;
            element.longitude = x + xIncrease * (self.locationHash[element.dispatchcaseId] - 1);
            element.latitude = y + yIncrease * (self.locationHash[element.dispatchcaseId] - 1);
            element.track.push({
                longitude: element.longitude,
                latitude: element.latitude,
            });
        });
        return list;
    }
}

