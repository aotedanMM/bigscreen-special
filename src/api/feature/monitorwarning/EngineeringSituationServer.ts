
import {RequestServerClass} from '../../../util/request';

// 工情服务
export default class EngineeringSituationServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        opt.headers = { 'Content-Type': 'application/json' };
        this.rSerivce = new RequestServerClass(opt);
    }
    /**
     * 获取工情分类统计
    * @param opts {Object}
     */
    public getStat(opts?: any) {
        const url = '/api/typhoon/sf/getcount';
        const result = {
            data: {
                all: null, // 全部
                tanta: null, // 坍塌
                dianpaizhan: null, // 电排站
                chuanzha: null, // 船闸
                shuidianzhan: null, // 水电站
                shuizha: null, // 水闸
                bundpitch: null, // 堤防
            },
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.get(url).then((res: any) => {
                result.data = res.data.data;
                result.data.shuidianzhan = res.data.data.dianzhan;
                result.data.bundpitch = res.data.data.bundpitch;
                resolve(result);
            });
        });
    }
      /**
     * 获取详细数据
     * @param opt
     * @param opt.resourceKey
     * @param opt.id
     */
    public getDetailInfo(opt: any) {
        opt.flatTag = true;
        const serve = new EMapServerV2.CommonService();
        return new Promise((resolve, reject) => {
            serve.getDataList(opt, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    if (data && data[opt.resourceKey]) {
                        resolve(data[opt.resourceKey][0]);
                    } else {
                        resolve(null);
                    }
                }

            }, this);
        });
    }
    /**
     * 获取工情站点列表
    * @param opts {Object}
    * @param [opts.type] 类型 tanta: 坍塌; dianpaizhan: 电排站; chuanzha: 船闸；shuidianzhan: 水电站，shuizha: 水闸，bundpitch：堤防
    * @param [opts.keyWord] 关键字
    * @param [opts.pageSize]
    * @param [opts.pageIndex]
     */
    public getStationsList(opts: any) {
        const url = '/api/typhoon/sf/workcondition/page';
        if (opts.pageIndex && !opts.nowPage) {
            opts.nowPage = opts.pageIndex;
        }
        opts.pageSize = opts.pageSize || 100000;
        if (opts.type === 'shuidianzhan') {
            opts.type = 'dianzhan';
        }
        if (opts.keyWord) {
            const arr = [];
            for (let index = 0; index < opts.keyWord.length; index++) {
                const word = opts.keyWord.charAt(index);
                if (word === '%') {
                    arr.push('\\' + word);
                    continue;
                }
                arr.push(word);
            }
            opts.keyWord = arr.join('');
        }
        const result: any = {
            data: [],
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, JSON.stringify(opts)).then((res: any) => {
                const resData = res.data.list;
                result.total = res.data.total;
                resData.forEach((record: any) => {
                    const station: any = {};
                    station.id = record.id;
                    station.name = record.name;
                    station.x = record.lon;
                    station.y = record.lat;
                    station.address = record.address;
                    if (record.type === 'dianzhan') {
                        record.type = 'shuidianzhan';
                    }
                    station.type = record.type;
                    result.data.push(station);
                });
                resolve(result);
            });
        });
    }
    /**
     * 获取工情站点详情
    * @param opts {Object}
    * @param opts.id {string}
    * @param [opts.type] {string}，电排站：dianpaizhan，水闸：shuizha，水电站：shuidianzhan或dianzhan，堤防：bundpitch，船闸：chuanzha
     */
    public getStationDetail(opts: any) {
        const urlDetail = '/api/typhoon/sf/workcondition/detail?id=' + opts.id;
        let urlDetailType = '/api/typhoon/sf/workcondition/details?id=' + opts.id;
        if (opts.type === 'shuidianzhan') {
            opts.type = 'dianzhan';
        }
        const result = {
            data: {
                id: null,
                name: null,
                x: null,
                y: null,
                address: null,
                type: null,
            },
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(urlDetail).then((res: any) => {
                const resData = res.data.data;
                result.data.id = resData.id;
                result.data.name = resData.name;
                result.data.x = resData.lon;
                result.data.y = resData.lat;
                result.data.address = resData.address;
                if (resData.type === 'shuidianzhan') {
                    resData.type = 'dianzhan';
                }
                result.data.type = resData.type;

                const optType = {
                    id: opts.id,
                    type: opts.type || resData.type,
                };
                urlDetailType += '&type=' +  optType.type;
                this.rSerivce.serverObj.post(urlDetailType).then((resType: any) => {
                    Object.assign(result.data, resType.data.data);
                    resolve(result);
                });
            });
        });
    }
}

