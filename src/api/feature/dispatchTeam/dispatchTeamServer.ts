import {RequestServerClass} from '../../../util/request';
// 队伍调派接口
export class DispatchTeamServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 队伍调派接口
    public getLatentDangera() {
        const url = './json/dispatchTeam.json';
        return this.rSerivce.serverObj.get(url);
    }


}
