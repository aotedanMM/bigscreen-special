
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';

// 灾情研判服务
export class RescueAssistanceServer {

    public rSerivce: any;
    private rescueAssistanceService: any;
    private rescueHelpService: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.rescueAssistanceService = new (window as any).EMapServerV2.RescueAssistanceService();
        this.rescueHelpService = new (window as any).EMapServerV2.RescueHelpService();
    }

    /**
    * 获取区县
    * @param opts
    * @param opts.geometry {GeoJSON} 可选，地震灾损区，geojson格式
    * @param opts.code {Array} 可选，行政区划编码
    */
    public getCounties(opts: any) {
        const self = this;
        opts.codeList = opts.code;
        return new Promise((resolve, reject) => {
            this.rescueAssistanceService.getCounties(opts, function(err: any, data: any) {
                if (err === null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
    * 根据队伍类型、需求点、队伍需求人数查询救援队列表
    * @param opts
    * @param opts.point {Array} 必填，需求点
    * @param opts.needSet {Object} 必填，需求量
    * @param opts.needSet[key] key为队伍类型，value为需求人数
     */
    public getRescueByTypeAndNeedLoc(opts: any) {
        const getSingle: any = (params: any) => {
            return new Promise((resolve, reject) => {
                this.rescueAssistanceService.getRescueByTypeAndNeedLoc(params, function(err: any, data: any) {
                    if (err === null) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        };
        return new Promise(async (resolve, reject) => {
            const result: any = [];
            for (const type of Object.keys(opts.needSet)) {
                const needNum: number = parseInt(opts.needSet[type], 10);
                const singleResult: any = await getSingle({
                    point: opts.point,
                    typeList: type.split(','),
                    num: needNum,
                });
                const item: any = {};
                item.type = type;
                item.list = singleResult;
                result.push(item);
            }
            resolve(result);
        });
    }

    /**
     * 获取梯队信息
    * @param opts
    * @param opts.point {Array} 必填，事故点
    * @param opts.typeList {Array} 可选，救援队类型过滤
    * @param opts.limit {Num} 可选，数据量限制
     */
    public getRescueCol(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.rescueAssistanceService.getRescueCol(opts, function(err: any, data: any) {
                if (err === null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取周边储备库
     * @param opts
     * @param opts.point
     * @param opts.materialSet {Object} 必填
     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
     */
    public getNearbyReposity(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.rescueAssistanceService.getNearbyReposity(opts, function(err: any, data: any) {
                if (err === null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取调配方案
     * @param opts.point
     * @param opts.materialSet {Object} 必填
     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
     */
    public getReposityDispatch(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.rescueAssistanceService.getReposityDispatch(opts, function(err: any, data: any) {
                if (err === null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取储备库
     * @param opts
     * @param opts.point
     * @param opts.query
     */
    public getReposity(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.rescueHelpService.getReposity(opts, function(err: any, data: any) {
                data = self.processReposity(data);
                if (err === null) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }
    /**
     * 导航
     * @param opts
     * @param opts.start
     * @param opts.end
     */
    public getNavigation(opts: any) {
        const self = this;
        const startTemp = opts.start[1] + ',' + opts.start[0];
        const start = (window as any).EMapServerV2.CoordTransformUtil.wgs84togcj02(startTemp);
        const endTemp = opts.end[1] + ',' + opts.end[0];
        const end = (window as any).EMapServerV2.CoordTransformUtil.wgs84togcj02(endTemp);
        const url = (window as any).EMAP_CONFIG.common.GaoDeService +
            'direction/driving?origin='
            + start + '&destination='
            + end +
            '&extensions=all&strategy=10&waypoints=&avoidpolygons=&output=json&key=' +
            (window as any).EMAP_CONFIG.common.GaoDeKey;
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                dataType: 'jsonp',
                success: (res) => {
                    resolve(res);
                },
                error: (err) => {
                    reject(err);
                },
            });
        });
    }
    /**
     * 调拨建议
    * @param opts
    * @param opts.typecode {String} 类型编码
    * @param opts.point {Array} 经纬度点
    * @param opts.adcode {String} 行政区编码
     */
    public getScheduling(opts: any) {
        return new Promise((resolve, reject) => {
            $.ajax({
                // url: (window as any).EMAP_CONFIG.common.Schedulurl,
                url: publishObjectPath.value.Schedulurl,
                type: 'POST',
                dataType: 'JSON',
                data: {param: '{"TYPECODE":"' + opts.typecode + '","LATITUDE":' + opts.point[1] + ',"LONGITUDE":' + opts.point[0] + ',"RESPROVINCIAL":"","INITIALDISTRICT":' + opts.adcode + '}'},
                success: (data) =>  {
                    if (data.success) {
                        resolve(data.data);
                    } else {
                        reject(data);
                    }
                },
                error: (err) => {
                    reject(err);
                },
            });
        });
    }

    private processReposity(data: any) {
        data.forEach((obj: any) => {
            const districts = obj.districts;
            obj.districts = this.extractAttr(districts, 'tag');
            const levels = obj.levels;
            obj.levels = this.extractAttr(levels, 'tag');
            const materials = obj.materials;
            obj.materials = this.extractAttr(materials, 'tag');
        });
        return data;
    }

    private extractAttr(objArr: any, attr: string) {
        objArr.forEach((obj: any) => {
            const target = obj[attr];
            for (const key in target) {
                if (target.hasOwnProperty(key)) {
                    const attrValue = target[key];
                    obj[key.toLowerCase()] = attrValue;
                }
            }
            delete obj[attr];
        });
        return objArr;
    }
}

