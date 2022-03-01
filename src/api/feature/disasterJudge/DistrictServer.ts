
import {RequestServerClass} from '../../../util/request';
import {disasterJudgeServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class DistrictServer {

    public rSerivce: any;
    public rSerivce2: any;
    public emapServiceFilter: any;
    // public urlWebService: any;
    private baseURL: any;
    private population: any;
    private cacheTown: any = {};
    private cacheChildrenCounties: any = {};
    private blankGeom = {
        type: 'Polygon',
        coordinates: [
            [
              [0, 0],
              [0, 90],
              [180, 90],
              [180, 0],
              [0, 0],
            ],
          ],
    };
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.baseURL = opt.baseURL;
        this.emapServiceFilter = publishObjectPath.value.district;
        this.rSerivce2 = new RequestServerClass({ baseURL: publishObjectPath.value.serverPath });
        // const urlWebOpt = {
        //     baseURL: (window as any).EMAP_CONFIG.common.urlWeb,
        //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
        // };
        // this.urlWebService = new RequestServerClass(urlWebOpt);
    }

    /**
     * 获取灾损区覆盖的区县
     * @param opts
     * @param opts.point {Array}
     * @param opts.geometry {GeoJSON}
     */
    public getCounties(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.pac = self.emapServiceFilter.root;
        }
        const url = '/api/public/dlgbouaxian/bypac/v1';
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
        const polygon = Geometry.asWkt();
        const center = opts.point[0] + ' ' + opts.point[1];
        const data: any = {
            polygon,
            center,
        };
        if (JSON.stringify(opts.geometry) === JSON.stringify(this.blankGeom)) {
            delete data.polygon;
        }
        if (opts.pac) {
            data.pac = self.getMatchCode(opts.pac);
        }
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                const result = self.dealCountyData(response.data.data);
                resolve(result);
            }).catch((e: any) => {
                reject(e);
            });
        });
    }
      // data.level: 1,
  // data.name: '',
  // data.adcode: '',
  // data.sub: 2,
  // data.polygon: false,
  // data.eId: 'siptea'
    /**
     * 获取行政区划
     * @param opts
     * @param opts.level {String} 级别 默认为3
     * @param opts.name {String} 名称
     * @param opts.adcode {String} 行政编码
     * @param [opts.sub] {Integer} 向下层级，默认为2
     * @param [opts.polygon] {Boolean} 是否查询geom，默认为true
     * @param [opts.eId] {String} 默认为 siptea
     */
    public getDistrictTreeByCode2(opts: any) {
        opts.level = opts.level || '3';
        opts.sub = opts.sub || 2;
        opts.polygon = opts.polygon || true;
        opts.eId = opts.eId || 'siptea';
        opts.districtCodes = opts.adcode;
        return new Promise((resolve, reject) => {
            (window as any).EMapServerV2.DistrictUtil.search(opts, (result: any) => {
              resolve(result);
            });
          });
    }

    /**
     * 获取乡镇点
     * @param opts
     * @param opts.point {Array}
     * @param opts.geometry {GeoJSON}
     */
    public getTownList(opts: any, unit?: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.pac = self.emapServiceFilter.root;
        }
        const url = 'api/public/dlgbouaxiang/bypac/v1';
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
        const polygon = Geometry.asWkt();
        // const center = opts.point[0] + ' ' + opts.point[1];
        const data: any = {
            polygon,
            // center,
        };
        opts.point = [120.8, 37.2];
        if (opts.point) {
            data.center = opts.point[0] + ' ' + opts.point[1];
        }
        if (JSON.stringify(opts.geometry) === JSON.stringify(this.blankGeom)) {
            delete data.polygon;
        }
        if (opts.pac) {
            data.pac = self.getMatchCode(opts.pac);
        }
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                const result = self.dealTownData(response.data.data, unit);
                resolve(result);
            }).catch((e: any) => {
                reject(e);
            });
        });
    }
     /**
     * 获取区县点
     * @param opts {Object}
     * @param opts.code {String}
     * @param opts.point {Array}
     */
    public getTownListByCounty(opts: any) {
        const url = '/api/public/dlgbouaxiang/bypac/v1';
        const data = {
            center: opts.point[0] + ' ' + opts.point[1],
            pac: opts.code,
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                const result = response.data;
                let index = 1;
                result.data.forEach((town: any) => {
                    town.lon = town.geom.coordinates[0];
                    town.lat = town.geom.coordinates[1];
                    town._id = town.id;
                    town.area = parseFloat((town.tag.arear / (1000 * 1000)).toFixed(3));
                    town.population = town.tag.pouplationNum ? (town.tag.pouplationNum / 10000).toFixed(6) : 0;
                    town.shape_area = town.tag.arear;
                    town.index = index;
                    town.name = town.tag.name;
                    town.shortName = town.tag.shortname;
                    town.popdensity = ((town.population * 10000) / (town.area * 1)).toFixed(2);
                    town._distance = (parseFloat(town.distance)).toFixed(2);
                    index ++;
                });
                const compare = function(a: any, b: any) {
                    return (a._distance < b._distance) ? -1 : 0;
                };
                const beforeSorted = result.data;
                const sortedData = beforeSorted.sort(compare);
                result.data = sortedData;
                resolve(result);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
     /**
     * 获取区县点
     * @param opts {Object}
     * @param opts.overlay {geojson} //{"type":"Point","coordinates":[117.0457149785012,39.77592956542969]}
     * @param opts.dataSetId {String} //province0.01
     * @param opts.eId {String} //siptea
     * @param opts.select {String} //_id tag.adcode tag.name
     * @param opts.query {Object}
     *
     */
    public getOverlaysThatIntersects(opts: any) {
        let url = (window as any).EMAP_CONFIG.common.mongoService + '/dataSpQuery/getOverlaysThatIntersects?';
        for (const key in opts) {
            if (opts.hasOwnProperty(key)) {
                let element = opts[key];
                if (typeof(element) !== 'string') {
                    element = JSON.stringify(element);
                }
                url += (key + '=' + element + '&');
            }
        }
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.get(url).then((response: any) => {
                    resolve(response.data);
                }, (err: any) => {
                    reject(err);
            });
        });
    // test data
    // return new Promise((resolve, reject) => {
    //     // test data
    //     const data = [
    //         {
    //             id: '1',
    //             geometry: {
    //                 type: 'Point',
    //                 coordinates: [113, 20 ],
    //             },
    //         },
    //     ];
    //     resolve(data);
    // });
    }
     /**
     * 根据经纬度获取区县
     * @param opts {Object}
     * @param opts.location {Array}
     * @param opts.level {String}
     *
     */
    public getDistrictByLonLat(opts: any) {
        const self = this;
        const url = '/api/district/querydistrictbylonlat/v1';
        const lonlat = opts.location.join(',');
        const data = {
            longitude: opts.location[0] + '',
            latitude: opts.location[1] + '',
            level: opts.level + '',
        };
        const param = 'lonlat=' + lonlat + '&level=' + opts.level;
        return new Promise((resolve, reject) => {
            self.rSerivce.serverObj.post(url, data).then((response: any) => {
                const result = response.data;
                resolve(result);
                }, (err: any) => {
                    reject(err);
            });
        });
    }

    /**
     * 根据code获取地区(单个)
     * @param opts {Object}
     * @param opts.districtcode {String}
     *
     */
    public getDistrictByCode(opts: any) {
        const self = this;
        const url = '/api/district/' + opts.districtcode + '/selectonedis/v1';
        return new Promise((resolve, reject) => {
            self.rSerivce.serverObj.get(url).then((response: any) => {
                const result = response.data;
                resolve(result);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
     /**
     * 获取行政区划(多个)
     * @param opts
     * @param opts.code {Array}
     * @param opts.returnGeom {Boolean} 是否返回边界，默认为true
     */
    public getDistrictsByCodes(opts: any) {
        const httpRequest = new (G as any).base.HttpRequest();
        const service = new (G as any).servicev2.DistrictServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
        return service.getDistrict({
            code: opts.code,
            returnGeom: opts.returnGeom === false ? false : true,
        });
    }
    /**
     * 根据code获取地区及其子地区
     * @param opts {Object}
     * @param opts.districtcode {Array}
     *
     */
    public getDistrictTreeByCode(opts: any) {
        const self = this;
        const url = '/api/district/' + opts.districtcode + '/childs/v1';
        return new Promise((resolve, reject) => {
            if (self.cacheChildrenCounties[opts.districtcode]) {
                resolve(self.cacheChildrenCounties[opts.districtcode]);
            }
            self.rSerivce.serverObj.get(url).then((response: any) => {
                const result = response.data;
                self.cacheChildrenCounties[opts.districtcode] = result;
                resolve(result);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
    /**
     * 根据code获取地区及其子地区
     * @param opts {Object}
     * @param opts.districtcode {Array}
     *
     */
     public getTowns(opts: any) {
        const WFSService = new (g2 as any).ews.RestWFSService({
            url: publishObjectPath.value.egis.server + 'egis/base/v1',
            clientId: publishObjectPath.value.egis.clientId,
            clientSecret: publishObjectPath.value.egis.clientSecret,
            authType: 'Token',
            tokenUrl: publishObjectPath.value.egis.tokenServer,
        });
        const filterOutput = new (g2 as any).ews.FilterOutput();
        const match = this.getMatchCode(opts.districtcode) + '*';
        const filterLike = filterOutput.like('pac', match);
        const wfsInput = new (g2 as any).ews.FeatureInput({
            typenames: 'dlg_boua_xiang',
            filter: filterLike,
        });
        return new Promise((resolve, reject) => {
            if (this.cacheTown[opts.districtcode]) {
                resolve(this.cacheTown[opts.districtcode]);
             }
            const result =  WFSService.getFeature(wfsInput);
            result.then((data: any) => {
                this.cacheTown[opts.districtcode] = data;
                resolve(data);
            });
        });
     }
     /**
     * 获取灾损区覆盖的省份
     * @param opts
     * @param opts.point {Array}
     * @param opts.geometry {GeoJSON}
     */
    public getProAndCitys(opts: any) {
        const url = '/api/public/dlgbouasheng/bypac/v1';
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
        const polygon = Geometry.asWkt();
        const center = opts.point[0] + ' ' + opts.point[1];
        const data: any = {
            polygon,
            center,
        };
        // if (opts.pac) {
        //     data.pac = self.getMatchCode(opts.pac);
        // }
        return new Promise((resolve, reject) => {
            this.rSerivce2.serverObj.post(url, data).then((response: any) => {
                const res = response.data;
                const result: any = [];
                let totalpeoplenum = 0;
                const record = {provincenum: res.data.length,
            citynum: '', countynum: '', totalpeoplenum: 0};
                res.data.forEach((province: any) => {
                    totalpeoplenum = totalpeoplenum + province.tag.pouplationNum;
                });
                record.totalpeoplenum = totalpeoplenum;
                const url1 = '/api/public/getDlgBouaCount/bypac/v1';
                this.rSerivce2.serverObj.post(url1, data).then((response1: any) => {
                    record.citynum = response1.data.data ?  response1.data.data.citynum : 0;
                    record.countynum = response1.data.data ? response1.data.data.countynum : 0;
                    resolve(record);
                });
            }).catch((e: any) => {
                reject(e);
            });
        });
    }
    /**
     * 获取灾损区覆盖的城市
     * @param opts
     * @param opts.point {Array}
     * @param opts.geometry {GeoJSON}
     */
    public getCities(opts: any) {
        const self = this;
        const url = '/api/public/dlgbouashi/bypac/v1';
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
        const polygon = Geometry.asWkt();
        const center = opts.point[0] + ' ' + opts.point[1];
        const data: any = {
            polygon,
            center,
        };
        return new Promise((resolve, reject) => {
            this.rSerivce2.serverObj.post(url, data).then((response: any) => {
                const result = self.dealCityData(response.data.data);
                resolve(result);
            }).catch((e: any) => {
                reject(e);
            });
        });
    }
    private getAdministrativeArea(geom: any) {
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({projectService});
        const areatotal: number = measureService.area(Geometry);
        const areaData = (areatotal / 1000000).toFixed(3);
        return areaData;
    }

    private dealTownData(data: any, unit?: any) {
        const resultList: any = [];
        let index = 1;
        data.forEach((town: any) => {
            town.lon = town.geom.coordinates[0];
            town.lat = town.geom.coordinates[1];
            town.index = index;
            town._id = town.id;
            town.area = parseFloat((town.tag.arear / (1000 * 1000)).toFixed(3));
            town.population = town.tag.pouplationNum ? (town.tag.pouplationNum / 10000).toFixed(6) : 0;
            town.name = town.tag.name;
            town.shortName = town.tag.shortname;
            if (unit && unit === 'm') {
                town._distance = 1000 * parseFloat(town.distance);
            } else {
                town._distance = parseFloat(town.distance);
            }
            index ++;
            resultList.push(town);
        });
        return resultList;
    }

    private dealCountyData(data: any) {
        const countyList = data;
        let index = 1;
        const resultList: any = [];
        countyList.forEach((county: any) => {
            const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(county.tag.wkt, 4326);
            const projectService = new g2.sfs.CoordinateTransform();
            const measureService = new g2.sfs.MeasureService({projectService});
            const geomArea = measureService.area(polygon);
            // county.lon = parseFloat(polygon.getBaryCenter().x);
            // county.lat = parseFloat(polygon.getBaryCenter().y);
            county.lon = county.geom.coordinates[0];
            county.lat = county.geom.coordinates[1];
            county.index = index;
            county._id = county.id;
            index ++;
            county.tag.arear = county.tag.arear > 0 ? county.tag.arear : geomArea;
            county.area = parseFloat((county.tag.arear / (1000 * 1000)).toFixed(2));
            county.population = county.tag.pouplationNum ? (county.tag.pouplationNum / 10000).toFixed(6) : 0;
            county.popdensity = ((county.population * 10000) / (county.area * 1)).toFixed(2);
            county._distance = (parseFloat(county.tag.distance)).toFixed(2);
            county.geom = polygon.asGeoJson();
            county.name = county.tag.name;
            county.shortName = county.tag.shortname;
            county.xiangnumber = county.tag.xiangnumber;
            county.tag.gov = county.lon + ',' + county.lat;
            resultList.push(county);
        });
        const result: any = {};
        result.COUNTY = resultList;
        return result;
    }

    private getRegionPopulation(adcode: any) {
        let pouplationNum = 0;
        if ( this.population ) {
            for (const i in this.population) {
                if (this.population.hasOwnProperty(i)) {
                    const data = this.population[i];
                    const code = data.tag.distcode;
                    if ( code === adcode) {
                        pouplationNum += parseInt( data.tag.poptotal, 10);
                    }
                }
            }
        }
        return pouplationNum;
    }

    private getPopulation(opts: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (!this.population) {
                disasterJudgeServer.getPop(opts).then((res: any) => {
                    const population = res.POPU_DISTPOPU;
                    self.population = population;
                    resolve(population);
                });
            } else {
                resolve(this.population);
            }
        });
    }

    private getCurrentTime() {
        const fullDate = new Date();
        const year = fullDate.getFullYear();
        const month = fullDate.getMonth() + 1;
        const day = fullDate.getDate();
        const hour = fullDate.getHours();
        const minutes = fullDate.getMinutes();
        const dateStr = year + '年' + month + '月' + day + '日' + hour + '时' + minutes + '分';
        return dateStr;
    }
    private getMatchCode(districtCode: string) {
        const code = districtCode.replace(/(0+)$/g, '');
        return code;
    }
    private dealCityData(data: any) {
        const countyList = data;
        let index = 1;
        const resultList: any = [];
        countyList.forEach((county: any) => {
            const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(county.tag.wkt, 4326);
            county.lon = county.geom.coordinates[0];
            county.lat = county.geom.coordinates[1];
            county.index = index;
            county._id = county.id;
            index ++;
            county.area = parseFloat((county.tag.arear / (1000 * 1000)).toFixed(2));
            county.population = county.tag.pouplationNum ? (county.tag.pouplationNum / 10000).toFixed(6) : 0;
            county.popdensity = ((county.population * 10000) / (county.area * 1)).toFixed(2);
            county._distance = (parseFloat(county.tag.distance)).toFixed(2);
            county.geom = county.geom;
            county.name = county.tag.name;
            county.shengname = county.tag.shengname;
            county.tag.gov = county.lon + ',' + county.lat;
            resultList.push(county);
        });
        return resultList;
    }
}

