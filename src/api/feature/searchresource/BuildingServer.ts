
import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
import { resourceanalysisServer } from '../normal/installNormalServer';
// 一键搜-房屋服务
export class BuildingServer {

    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
    }

    /**
     * 获取房屋结构
     * @param opts
     * @param opts.districtCode {Array} 可选
     * @param opts.geometry {GeoJSON} 可选
     */
    public getHouseStructure(opts: any) {
        // todo
        // 测试数据
        // const url = './json/gisModule/query/buildStructure.json';
        const url = publishObjectPath.value.buildingStructure + `?districtcode=${opts.districtCode}`;
        return this.rSerivce.serverObj.post(url);
    }

    /**
     * 获取房屋分布统计--前端展示
     * @param opts
     * @param opts.geometry {Object} geojson
     * @param opts.districtCode {String} 行政区编码，逗号隔开
     */
    public getHouseDistribution(opts: any) {
        const aggregateList: any = [];
        const aggregateObj: any = {};
        const aggregate: any = [];
        const query: any = {};
        const or: any = [];
        const districtCodeArr = opts.districtCode.split(',');
        districtCodeArr.forEach((districtCode: any) => {
        if ('000000' === districtCode) {// 全国不过滤
            districtCode = '.*';
        } else if (/^\d{2}0000$/.test(districtCode)) {
            districtCode = districtCode.substr(0, 2) + '.*';
        } else if (/^\d{4}00$/.test(districtCode)) {
            districtCode = districtCode.substr(0, 4) + '.*';
        }
        or.push({
            'tag.COUNTRYCODE': {
            $regex: '^' + districtCode + '$',
            },
        });
        });

        aggregate.push(
        {
            $group: {
            _id: {},
            count: {
                $sum: 1,
            },
            },
        },
        );
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = query;
        aggregateObj.searchId = 'BAS_HOUSEDIST';
        aggregateObj.dataSetId = 'BAS_HOUSEDIST';
        aggregateList.push(aggregateObj);
        if (or.length > 0) {
        query.$or = or;
        }
        if (opts.geometry) {
        aggregate.push({
            $match: {
            geom: {
                $geoIntersects: {
                $geometry: opts.geometry,
                },
            },
            },
        });
        }

        return new Promise((resolve, reject) => {
        $.ajax({
            url: (window as any).EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti',
            dataType: 'json',
            type: 'POST',
            data: {
            eId: 'safety',
            data: JSON.stringify(aggregateList),
            },
            success: (data) => {
            resolve(data);
            },
            error: (err) => {
            reject(err);
            },
        });
        });
    }

    /**
     * 获取房屋分布的wms参数
     * @param opts
     * @param opts.geometry {Object} geojson
     * @param opts.districtCode {String} 行政区编码，逗号隔开
     */
    public getHouseDistributionWms(opts: any) {
        return new Promise((resolve, reject) => {
            // todo 根据参数获取对应区划的服务参数
            const wmsParams: any = {
                URL: publishObjectPath.value.buildingWMS,
                LAYERS: 'guiyangshipoint,liupanshuishipoint,zunyishipoint,anshunshipoint,bijieshipoint,tongrenshipoint,qianxinanzhoupoint,qiandongnanzhoupoint,qiannanzhoupoint',
                TILED: true,
                VERSION: '1.1.1',
            };
            resolve(wmsParams);
        });
    }

}

