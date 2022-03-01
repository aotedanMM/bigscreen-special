
import { RequestServerClass } from '../../util/request';
import RequestBuffer from '@/util/buffer/requestBuffer';
import publishObjectPath from '@/util/configRegistry';
const res = new RequestBuffer();
export class DizhenServer {

    public rSerivce: any;
    public opt: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.opt = opt;
    }

    public getData(cb: any) {
        const url = './json/weather.json';
        const that = this;
        /**
        *  @param url 请求路径
        *  @param that 请求的this
        *  @param cb 回调
        *  @param methods 请求的方法, 默认为get
        *  @param header 请求根路径
        *  @param leval 缓冲等级;
        * */
        res.getData(url, this, cb);
    }

    public getMapConfig() {
        const url = './json/map.json';
        return this.rSerivce.serverObj.get(url);
    }

    public getModelData() {
        return new Promise((resolve, reject) => {
            const url = './json/data/demo_model_data.json';
            this.rSerivce.serverObj.get(url).then((result: any) => {
                resolve(result.data.data);
            });
        });
    }

    /**
     * 获取上传的烈度范围
     */
    public getReportRanges(eventId: any) {
        return new Promise(async (resolve, reject) => {
            const url = `${publishObjectPath.value.serverPath}api/msg/${eventId}/UPLOADSHP/v1`;
            const result: any = await this.rSerivce.serverObj.get(url);
            const arr: any = JSON.parse(result.data.data.content);
            if (arr.length > 0) {
                const temp: any  = arr[arr.length - 1];
                const temp1: any = JSON.parse(temp.data);
                if (Object.prototype.toString.call(temp1.event) === '[object String]') {// 兼容
                    temp1.event = JSON.parse(temp1.event);
                }
                const ranges: any = temp1.event.features;
                resolve({
                    data: ranges,
                });
            } else {
                reject(new Error('无烈度圈！'));
            }
        });
        // return new Promise(async (resolve, reject) => {
        //     const url = './json/data/demo_upload_ranges.json';
        //     const result: any = await this.rSerivce.serverObj.get(url);
        //     const arr: any = result.data.event.features;
        //     if (arr.length > 0) {
        //         resolve({
        //             data: arr,
        //         });
        //     } else {
        //         reject(new Error('无烈度圈！'));
        //     }
        // });
    }

    /**
     * 执行烈度模型
     * @param opts
     * @param opts.point
     * @param opts.date
     * @param opts.level
     */
    public executeModel(opts: any) {
        return new Promise(async (resolve, reject) => {
            const districtData: any = await this.getDistrictByLnglat(opts.point);
            const districtName: any = districtData.tag.name;
            const param = {
                105201: [4326, opts.point[0], opts.point[1], 0],
                105202: districtName,
                105203: (opts.date as any).format('yyyy-MM-dd hh:mm:ss') + '.000' + '.000',
                111010: opts.level,
                111001: true,
                111021: true,
                111022: true,
            };
            $.ajax({
                url: publishObjectPath.value.modelService + '/earthquakeintensity',
                type: 'POST',
                dataType: 'json',
                data: {
                    timestamp: new Date().getTime(),
                    token: 'sometoken',
                    params: JSON.stringify(param),
                    validDays: 1000 || null,
                },
                timeout: 20000,
                success: (data) => {
                    // todo
                    // 处理格式
                    // const ranges: any = [];
                    // const result = data.data.Model_Infos.GModel_EQ_Intensity.Result_Info;
                    // for (const i in result) {
                    //     if (result[i].GeoJson) {
                    //         ranges.push(result[i]);
                    //     }
                    // }
                    // ranges.reverse();
                    resolve(data.data);
                },
                error: (err: any) => {
                    reject(new Error(err));
                },
            });
        });
    }

    /**
     *
     * @param lnglat
     */
    public getDistrictByLnglat(lnglat: any) {
        return new Promise((resolve, reject) => {
            const serviceUrl =
                publishObjectPath.value.emapService + '/dataSpQuery/getOverlaysThatIntersects';
            const overlay = JSON.stringify({
                type: 'Point',
                coordinates: [lnglat[0], lnglat[1]],
            });
            // 行政区划级别，查询省级、市级、还是县级；
            const districtTables: any = {
                province: 'province0.01',
                city: 'city0.03',
                county: 'county0.12',
            };
            const data = {
                overlay,
                dataSetId: districtTables.province,
                eId: 'siptea',
                select: '_id tag.adcode tag.name',
                query: JSON.stringify({}),
            };
            jQuery.ajax({
                type: 'GET',
                url: serviceUrl,
                data,
                success(result: any) {
                    if (result.success) {
                        if (result.data[0]) {
                            resolve(result.data[0]);
                        } else {
                            reject(new Error('获取地震模型参数【行政区划】失败！'));
                        }
                    } else {
                        reject(new Error(result.msg));
                    }
                },
                error(err: any) {
                    reject(err);
                },
            });
        });
    }

}
