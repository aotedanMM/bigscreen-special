import {RequestServerClass} from '../../util/request';

/**监测预警*/
export class EarlyWarningServer {
    public rSerivce: any;
    private typeMap: any = {
        riverStation: {
           name: '超警河道站',
       },
       limitOfReservoir: {
           name: '超汛限水库',
       },
       superRainMeasuringStation: {
           name: '特大暴雨雨量站',
       },
       heavyRainMeasuringStation: {
           name: '大暴雨雨量站',
       },
       rainMeasuringStation: {
           name: '暴雨雨量站',
       },
    };
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }

    public getData() {
        const url = './json/earlyWarning.json';
        return this.rSerivce.serverObj.get(url);
    }
    /**
     * 预警统计
     * @param opts {object}
     * @param [opts.typeCodes] {array}
     * @param opts.geometry {object}
     * @param opts.level {string}
     */
    public getStatistics(opts?: any) {
        const result: any = {
            riverStation: {
                count: parseInt(Math.random() * 20 + '', 10),
            },
            limitOfReservoir: {
                count: parseInt(Math.random() * 20 + '', 10),
            },
            superRainMeasuringStation: {
                count: parseInt(Math.random() * 20 + '', 10),
            },
            heavyRainMeasuringStation: {
                count: parseInt(Math.random() * 20 + '', 10),
            },
            rainMeasuringStation: {
                count: parseInt(Math.random() * 20 + '', 10),
            },
        };
        $.extend( true, this.typeMap, result);
        return new Promise((resolve, reject) => {
            let res: any = null;
            let total = 0;
            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    total += result[key].count;
                }
            }
            if (opts && opts.typeCodes) {
                total = 0;
                res = {};
                for (const key in result) {
                    if (result.hasOwnProperty(key)) {
                        if (opts.typeCodes.includes(key)) {
                            res[key] = result[key];
                            total += result[key].count;
                        }
                    }
                }
            }
            resolve({
                data: res || result,
                total,
            });
        });
    }
    /**
     * 预警列表查询
     * @param opts {object}
     * @param opts.typeCodes {array} riverStation/limitOfReservoir/superRainMeasuringStation/heavyRainMeasuringStation/rainMeasuringStation
     * @param opts.geometry {object} geojson格式的几何对象
     * @param opts.level {string}
     * @param [opts.districtCode] {string} 区域编码-备用
     */
    public getDataList(opts: any) {
        const res: any = {};
        opts.typeCodes.forEach((typeCode: string) => {
            let typeCount = this.typeMap[typeCode].count;
            if (!typeCount) {
                typeCount = this.typeMap[typeCode].count = parseInt(Math.random() * 20 + '', 10);
            }
            let typeData = this.typeMap[typeCode].data;
            if (!typeData) {
                typeData = [];
                for (let index = 0; index < typeCount; index++) {
                    const id = typeCode + '_' + index;
                    const name = this.typeMap[typeCode].name + '_' + index;
                    const geom = this.getRandomGeometry(opts.geometry);
                    const riverName = '河流_' + Math.round(10 * Math.random());
                    const riverSystemName = '水系_' + Math.round(10 * Math.random());
                    const watershedName = '流域_' + Math.round(10 * Math.random());
                    const stationAddress = '站址_' + Math.round(10 * Math.random());
                    const data = {
                        id,
                        name,
                        geom,
                        type: typeCode,
                        riverName,
                        riverSystemName,
                        watershedName,
                        stationAddress,
                    };
                    this.generateDate(data);
                    typeData.push(data);
                }
                this.typeMap[typeCode].data = typeData;
            }
            res[typeCode] = this.typeMap[typeCode].data;
        });

        return new Promise((resolve, reject) => {
            resolve({
                layerName: 'earlywarning' + '_' + opts.level, // 图层名用类型和烈度圈级别构成
                list: res,
                icons: 'earlywarning' + '_img',
            });
        });
    }
    /**
     * 详情查询
     * @param opts {object}
     * @param opts.id {string}
     * @param opts.typeCode {string}
     */
    public async getDetail(opts: any) {
        let typeData = this.typeMap[opts.typeCode].data;
        if (!typeData) {
            await this.getDataList(opts);
        }
        typeData = this.typeMap[opts.typeCode].data;
        const checkId = function(obj: any) {
            return (obj.id === opts.id);
        };
        const recs = typeData.filter(checkId);
        const rec = recs[0] || {};
        return new Promise((resolve, reject) => {
            resolve({
                data: rec,
            });
        });
    }
    private getNowDate(): string {
        const date = new Date();
        let month: string | number = date.getMonth() + 1;
        let strDate: string | number = date.getDate();
        if (month <= 9) {
          month = '0' + month;
        }
        if (strDate <= 9) {
          strDate = '0' + strDate;
        }
        return date.getFullYear() + '-' + month + '-' + strDate + ' '
        + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
    private generateDate(data: any) {
        switch (data.type) {
            case 'limitOfReservoir':
                data.reservoirType = '类型_' + Math.round(Math.random() * 10);
                data.levelAbove = 20 + Math.round(Math.random() * 10);
                data.levelBelow = 20 + Math.round(Math.random() * 10);
                data.levelLimit = 20 + Math.round(Math.random() * 10);
                data.levelDesigned = 20 + Math.round(Math.random() * 10);
                data.datetime = this.getNowDate();
                break;
            case 'riverStation':
                data.reservoirType = '类型_' + Math.round(Math.random() * 10);
                data.level = 20 + Math.round(Math.random() * 10);
                data.levelWarning = 20 + Math.round(Math.random() * 10);
                data.levelGuarantee = 20 + Math.round(Math.random() * 10);
                data.levelHighest = 20 + Math.round(Math.random() * 10);
                data.datetime = this.getNowDate();
                break;
            default:
                data.dailyRainfall = Math.round(Math.random() * 400);
                break;
        }
    }
    private  getRandomGeometry(geometry?: any) {
        let geom = {};
        if (!geometry) {
            geom = {
                type: 'Point',
                coordinates: [90 + Math.random() * 20, 20 + Math.random() * 20],
            };
        } else {
            const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(geometry, 4326);
            const center = polygon.getBaryCenter();
            const extent = polygon.envelope();
            const xRange = extent.maxx - extent.minx;
            const yRange = extent.maxy - extent.miny;
            geom = {
                type: 'Point',
                coordinates: [extent.minx + Math.random() * xRange, extent.miny + Math.random() * yRange],
            };
        }
        return geom;
    }
}
