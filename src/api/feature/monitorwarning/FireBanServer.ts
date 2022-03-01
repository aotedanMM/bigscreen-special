
import {RequestServerClass} from '../../../util/request';

// 禁火令服务
export default class FireBanServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
    /**
     * 获取统计-禁火期、非禁火期的区县数量
     * @param opts {Object}
     */
    public getStatistics(opts?: any) {
        return new Promise((resolve, reject) => {
            // todo
            // 模拟数据
            const data: any = {
                ban: 10, // 禁火区县数
                noban: 5, // 非禁火区县数
            };
            resolve(data);
        });
    }
    /**
     * 获取分页列表
     * @param opts {Object}
     * @param opts.districtCode 系统区县编码，如烟台 or 佛山
     * @param opts.startTime {String} 起始时间
     * @param opts.endTime {String} 结束时间
     * @param opts.pageNo {Number} 页码，从1计数
     * @param opts.pageSize {Number} 每页条数
     */
    public getPageList(opts?: any) {
        return new Promise((resolve, reject) => {
            // todo
            // 模拟数据
            const data: any = {};
            data.list = [
                {
                    id: '111', // id
                    content: 'XX区禁火令', // 内容
                    pubTime: '2020-06-06 10:10:10', // 发布时间
                },
            ];
            data.pageSize = 10;
            data.pageNo = 1;
            data.total = 1; // 总数
            resolve(data);
        });
    }

    /**
     * 获取列表 - GIS使用
     * @param opts {Object}
     * @param opts.districtCode 系统区县编码，如烟台 or 佛山
     * @param opts.startTime {String} 起始时间
     * @param opts.endTime {String} 结束时间
     */
    public getList(opts?: any) {
        return new Promise((resolve, reject) => {
            // todo
            // 模拟数据
            const data: any = {};
            data.list = [
                {
                    id: '111', // id
                    content: 'XX区禁火令', // 内容
                    pubTime: '2020-06-06 10:10:10', // 发布时间
                    district: '110000', // 区县编码
                    longitude: 120.20, // 经度
                    latitude: 38.69, // 纬度
                },
            ];
            data.total = 1; // 总数
            resolve(data);
        });
    }
    /**
     * 获取详情
     * @param opts {Object}
     * @param opts.id 禁火令id
     * @param opts.type {String} 类型，为空时查询全部，1=卫星 2=视频 3=地面 ，多个类型逗号分隔
     */
    public getDetail(opts?: any) {
        return new Promise((resolve, reject) => {
            // todo
            // 模拟数据
            const data: any = {};
            resolve(data);
        });
    }
}

