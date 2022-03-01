
import {RequestServerClass} from '../../../util/request';

// 风情服务
export default class WindSituationServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }
    /**
     * 获取当前风情描述信息
    * @param opts {Object}
    * @returns {Object} {超阈值站点数量: 0, 最大风力站点: 'XXX', 当前最大风力: '12m/s', 更新时间: '2020-05-04 12:00:00'}
     */
    public getCurrentInfo(opts?: any) {
        opts.limitValue = opts.limitValue || 13.8;
        // const url = '/api/tWindData/v1/getOverrunLimitValueAndMaxObt?limitValue=' + opts.limitValue;
        const result = {
            data: {},
        };
        // return this.rSerivce.serverObj.post(url);
        const url = '/api/tWindData/v1/getOverrunLimitValueAndMaxObt';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((res: any) => {
                result.data = res.data;
                resolve(result);
            });
        });

    }
    /**
     * 获取风情分区县统计
    * @param opts {Object}
     */
    public getDistrictStat() {
        const url = '/api/tWindData/v1/getRegionalWindSpeed';
        return this.rSerivce.serverObj.post(url);
    }
    /**
     * 获取风情站点列表
    * @param opts {Object}
    * @param [opts.keyWord] {string} 关键字
    * @param [opts.overThreshold] {boolean} 是否筛选超阈值站点，默认false（全部站点）
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
     */
    public getStationsList(opts?: any) {
        if (opts.keyWord && !opts.name) {
            opts.name = opts.keyWord;
            delete opts.keyWord;
        }
        if (opts.name) {
            const arr = [];
            for (let index = 0; index < opts.name.length; index++) {
                const word = opts.name.charAt(index);
                if (word === '%') {
                    arr.push('\\' + word);
                    continue;
                }
                arr.push(word);
            }
            opts.name = arr.join('');
        }
        const url = '/api/tWindData/v1/page';
        if (opts.pageIndex && !opts.nowPage) {
            opts.nowPage = opts.pageIndex;
        }
        opts.pageSize = opts.pageSize || 100000;
        const result: any = {
            data: [],
            total: 0,
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, opts).then((res: any) => {
                result.total = res.data.total;
                const list = res.data.list;
                list.forEach((element: any) => {
                    const record: any = {};
                    record.id = element.id;
                    record.name = element.name;
                    record.x = element.x;
                    record.y = element.y;
                    record.isValid = element.isValid;
                    record.windSpeed = element.windSpeed;
                    record.overThreshold = element.overThreshold;
                    record.windDirection = element.windDirection;
                    result.data.push(record);
                });
                resolve(result);
            });
        });
    }
    /**
     * 获取风情站点详情
    * @param opts {Object}
    * @param opts.id {string}
    * @param [opts.starttime] {string} 开始时间
     */
    public getStationDetail(opts: any) {
        let url = '/api/tWindData/v1/detail?id=' + opts.id;
        if (opts.starttime) {
            url += '&dateTime=' + opts.starttime;
        }
        const result: any = {
            data: {
                id: opts.id,
                name: null,
                x: null,
                y: null,
                windSpeed: null,
                windDirection: null,
                list: [], // starttime至今风情记录
            },
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url).then((res: any) => {
                const data = res.data.data;
                result.data.name = data.name;
                result.data.x = data.x;
                result.data.y = data.y;
                result.data.list = data.dataList;
                resolve(result);
            });
        });
    }
}

