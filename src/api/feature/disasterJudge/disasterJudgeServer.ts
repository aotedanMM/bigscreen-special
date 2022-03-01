
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
import {districtServer} from '@/api/installServer';
// 灾情研判服务
export class DisasterJudgeServer {

    public rSerivce: any;
    public emapServiceFilter: any;
    private baseURL: any;
    private queryService: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.baseURL = opt.baseURL;
        //
        const httpRequest: any = new G.base.HttpRequest();
        this.queryService = new G.servicev2.ResourceQueryServiceImpl({
            httpRequest,
            url: publishObjectPath.value.emapService,
        });
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 获取烈度范围人口热力
     * @param opts
     * @param opts.geometry {GeoJSON}
     * @param [opts.time] {string} '2019年12月17日13时42分'
     * @param [opts.isNight] {boolean} 是否为晚上，默认为false
     */
    public getPop(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.districtCode = self.emapServiceFilter.root;
        }
        return new Promise(async (resolve, reject) => {
            let peopletable = 'POPU_FEVER';
            const EventTime: any = opts.time;
            // if (EventTime.indexOf('时') !== -1) {
            //     const currenttime: any = EventTime.split('日')[1].split('时')[0] * 1;
            //     if (currenttime >= 6 && currenttime <= 18) {
            //         peopletable = 'POPU_FEVER';
            //     } else {
            //         peopletable = 'POPU_FEVER_NIGHT';
            //     }
            // }
            if (opts.isNight === true) {
                peopletable = 'POPU_FEVER_NIGHT';
            } else {
                peopletable = 'POPU_FEVER';
            }
            const params: any = {};
            params.table = peopletable;
            const selectFields: any = ['POPTOTAL', 'DISTRICT', 'geom'];
            params.select = opts.select || selectFields.join(',');
            params.geometry = opts.geometry;
            if (opts.districtCode) {
                const matchCode = self.getMatchCode(opts.districtCode);
                params.where = `DISTCODE like '${matchCode}%'`;
            }
            this.queryService.getList(params).then( (result: any) => {
                resolve(result.list);
            });
        });
    }

    /**
     * 按照烈度范围统计资源
     * @param opts
     * @param opts.type 资源类型
     * @param opts.ranges 烈度范围数组
     */
    public statResourceByRanges(opts: any) {
        return new Promise((resolve, reject) => {
            // todo
            // 根据烈度范围、离事故点的距离排序
            const data: any = {};
            data.total = 1000;
            data.list = [
                {
                    level: 'Level8',
                    count: 100,
                },
                {
                    level: 'Level6',
                    count: 200,
                },
            ];
            resolve(data);
        });
    }

    /**
     * 缓冲查询
     * @param opts
     * @param opts.point [x,y]
     * @param opts.radius  缓冲半径，单位m
     */
    public bufferQuery(opts: any) {
        return new Promise((resolve, reject) => {
            const data: any = [];
            data.push({
                type: 'Team1',
                list: [
                    {
                        id: 'team1',
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                116 + Math.random(),
                                39 + Math.random(),
                            ],
                        },
                    },
                ],
            });
            resolve(data);
        });
    }
    /**
     * 人口查询
     * @param opts
     * @param [opts.point] [Array]
     * @param opts.ranges [Array]  //[{level:"Ⅵ级", geometry:{}},{level:"Ⅶ级", geometry:{}}}
     */
    public getPopulationInfo(opts: any) {
        if (!opts.point) {
            opts.point = [116.35, 39.87];
        }
        const self  = this;
        return new Promise((resolve, reject) => {
            const result: any = [];
            let counter = 0;
            for (const key in opts.ranges) {
                if (opts.ranges.hasOwnProperty(key)) {
                    const range = opts.ranges[key];
                    const intensityDesc = range.level;
                    const geometry = range.geometry;
                    const param = {
                        point: opts.point,
                        geometry,
                        level: intensityDesc,
                    };
                    self.getPopulationDistribution(param).then((res: any) => {
                        counter ++;
                        res.range = intensityDesc;
                        result[key] = res;
                        if (counter === (opts.ranges.length)) {
                            resolve(result);
                        }
                    });
                }
            }
        });

    }
    /**
     * 人口查询
     * @param opts
     * @param opts.geometry {GeoJSON}
     * @param opts.point [Array]
     * @param opts.level [String]
     */
    public getPopulationDistribution(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.districtCode = self.emapServiceFilter.root;
        }
        const result: any = {};
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({projectService});
        const area = measureService.area(g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, 4326));
        result.area = ( area / 1000000 ).toFixed(0);
        return new Promise((resolve, reject) => {
            districtServer.getCounties(opts).then((countyData: any) => {
                countyData.COUNTY.forEach((element: any) => {
                    element.level = opts.level;
                });
                result.county = {
                    data: countyData.COUNTY,
                    total: countyData.COUNTY.length,
                };
                districtServer.getTownList(opts, 'm').then((townData: any) => {
                    townData.forEach((element: any) => {
                        element.level = opts.level;
                    });
                    result.town = {
                        data: townData,
                        total: townData.length,
                    };
                    (window as any).EMapServerV2.queryservice._querypeopleTotaldata(opts.geometry, opts.districtCode, function( data3: any) {
                        const peoplenum = data3; // 受灾总人口
                        result.population = peoplenum;
                        resolve(result);
                    });
                });
            });
        });
    }

    private dealTownData(data: any, level: any) {
        const resultList: any = [];
        let index = 1;
        data.forEach((town: any) => {
            let lonlat = town.centerid;
            lonlat = lonlat.substring(lonlat.indexOf('(') + 1, lonlat.indexOf(')'));
            town.lon = parseFloat(lonlat.split(' ')[0]);
            town.lat = parseFloat(lonlat.split(' ')[1]);
            town.index = index;
            town.area = (town.shape_area * 12100).toFixed(3);
            town.level = level;
            index ++;
            resultList.push(town);
        });
        return resultList;
    }
    private dealCountyData(data: any, level: any) {
        const countyList = data.COUNTY;
        let index = 1;
        const resultList: any = [];
        countyList.forEach((county: any) => {
            county.lon = parseFloat(county.tag.gov.split(',')[0]);
            county.lat = parseFloat(county.tag.gov.split(',')[1]);
            county.index = index;
            county.level = level;
            index ++;
            county.area = this.getAdministrativeArea(county.geom);
            resultList.push(county);
        });
        const result: any = {};
        result.COUNTY = resultList;
        return result;
    }

    private getAdministrativeArea(geom: any) {
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({projectService});
        const areatotal: number = measureService.area(Geometry);
        const areaData = (areatotal / 1000000).toFixed(3);
        return areaData;
    }

    private getMatchCode(districtCode: string) {
        const code = districtCode.replace(/(0+)$/g, '');
        return code;
    }
}

