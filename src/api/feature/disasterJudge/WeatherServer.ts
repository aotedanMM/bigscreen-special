
import {RequestServerClass} from '../../../util/request';

// 预警信息服务
export class WeatherServer {

    public rSerivce: any;

    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
     * 获取事件信息
     * @param opts
     * @param opts.eventType {String}
     * @param opts.startTime {String}
     * @param opts.endTime {String}
     */
    public getEvents(opts: any) {
        // test data
        return new Promise((resolve, reject) => {
            const data: any = [];
            resolve(data);
        });
    }

    /**
     * 获取灾损区覆盖的区县的天气
     * @param opts
     * @param opts.point {Array}
     * @param opts.geometry {GeoJSON}
     */
    public getDistrictsWeather(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
              self.getCounties(opts).then((data: any) => {
                const discodeArray = [];
                const geomMap: any = {};
                for (const key in data.COUNTY) {
                    if (data.COUNTY.hasOwnProperty(key)) {
                        const districtcode = data.COUNTY[key].tag.adcode;
                        discodeArray.push(districtcode);
                        const districtCodeNumber = parseInt(districtcode, 0);
                        geomMap[districtCodeNumber] = data.COUNTY[key].geom;
                    }
                }
                const discodes = discodeArray.join(',');
                const param = {code: discodes};
                this.getWeatherByDistrictCodes(param).then((response: any) => {
                    const dataResult = response.data.data;
                    const result: any = {};


                    for (const key in dataResult) {
                        if (dataResult.hasOwnProperty(key)) {
                            const code = Object.keys(dataResult[key])[0];
                            const element = dataResult[key][code];
                            result[code] = {};
                            result[code].weather = element;
                            result[code].geom = geomMap[code];
                        }
                    }
                    resolve(result);
                });
            });
        });
    }
    /**
     * 获取灾损区覆盖的区县
     * @param opts
     * @param opts.code {String}
     */
    public getWeatherByDistrictCodes(opts: any) {
        const self = this;
        const url = 'api/weatherData/weatherbydiscode/v1';
        return new Promise((resolve, reject) => {
            self.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response);
            });
        });
    }
    /**
     * 获取天气详情
     * @param opts
     * @param opts.code {String}
     */
    public getWeatherDetail(opts: any) {
        const self = this;
        const url = 'api/weatherData/weatherbydiscode24H/v1';
        return new Promise((resolve, reject) => {
            self.rSerivce.serverObj.post(url, opts).then((response: any) => {
                resolve(response.data);
            });
        });
    }
    /**
     * 获取灾损区覆盖的区县
     * @param opts
     * @param opts.point {Array}
     * @param opts.geometry {GeoJSON}
     */
    private getCounties(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            (window as any).EMapServerV2.queryservice._queryDistrictPolygon(opts.point, opts.geometry, function(data: any) {
                resolve(data);
              }, this);
        });
    }
}

