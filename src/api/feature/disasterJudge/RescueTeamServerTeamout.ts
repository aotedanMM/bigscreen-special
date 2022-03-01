
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class RescueTeamServerTeamout {

    public rSerivce: any;
    public rescueTeamService: any;
    public queryService: any;
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        //
        const httpRequest: any = new G.base.HttpRequest();
        this.queryService = new G.servicev2.ResourceQueryServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
        // this.emapServiceFilter = publishObjectPath.value.emapServiceFilter; // 权限
        this.emapServiceFilter = '000000'; // sessionStorage内取code 没有赋值000000 全国
    }
    /**
    * 根据类型获取队伍出动统计
    *///
    public getTeamOutData(opts: any) {
        const url = '/reacueSetOut/v1/findTeamSetOut';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
    /**
    * 根据类型获取队伍出动统计
    *///
    public getTeamOutStatic() {
        const url = '/reacueTeam/v1/findTeamCode';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.get(url).then((response: any) => {
                resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    }



    // 获取台风的数据
    public gettyphoonData(opts: any) {
        const url = '/typhoon/v1/dealWith?typhoonNum=' + opts.typhoonNum + '&userName=' + opts.userName;
        return this.rSerivce.serverObj.get(url);
    }

    // 获取台风的详细信息
    public gettyphoonDetail(id: any) {
        const url = publishObjectPath.value.typhoonServer.infoUrl.replace('{typhoonid}', id);
        return this.rSerivce.serverObj.get(url);
    }

}

