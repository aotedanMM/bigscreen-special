import {RequestServerClass} from '../../util/request';
// 静态数据请求 json
export class StaticDataRequestServer {

    public rSerivce: any;

    constructor(opt?: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if ( axiosFilterFn ) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    // 请求本地静态json文件 查询的是echarts的地图json数据
    public getEchartsMapJson(distCode: number) {
        const url = 'resource/echartsJson/china-main-city/' + distCode + '.json';
        return this.rSerivce.serverObj.get(url);
    }

    public getDamageStatisticsData(locationKey: string) {
        const url = 'json/gisModule/damageStatistics/' + locationKey + '.json';
        return this.rSerivce.serverObj.get(url);
    }
    public getDisasterJudgesData(locationKey: string) {
        const url = 'json/gisModule/disasterJudge/' + locationKey + '.json';
        return this.rSerivce.serverObj.get(url);
    }
    public getMapToolData(locationKey: string) {
        const url = 'json/gisMapTool/' + locationKey + '.json';
        return this.rSerivce.serverObj.get(url);
    }

    public getStaticJsonByUrl(url: string) {
        return this.rSerivce.serverObj.get(url);
    }

}
