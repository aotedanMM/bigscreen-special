
import {RequestServerClass} from '../../../util/request';

// 预警信息服务
export default class EarlyWarningServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
    /**
     * 获取统计
     * @param opts {Object}
     */
    public getStatistics(opts?: any) {
        //
    }
    /**
     * 获取列表
     * @param opts {Object}
     */
    public getPageList(opts?: any) {
        //
    }
    /**
     * 获取地图数据
     * @param opts {Object}
     */
    public getList(opts?: any) {
        //
    }
}

