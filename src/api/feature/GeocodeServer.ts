
import {RequestServerClass} from '@/util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class GeocodeServer {
    public rSerivce: any;
    public gaodeSerivce: any;
    public egisService: any;
    public egisOpts: object = {};
    public gaodeOpts: object = {};
    public emapServiceFilter: any;
    constructor(opt: any, axiosFilterFn?: any) {
        // opt.baseURL = (window as any).EMAP_CONFIG.common.tempurl;
        this.rSerivce = new RequestServerClass(opt);
        this.gaodeOpts = publishObjectPath.value.amap;
        this.gaodeSerivce = new RequestServerClass({});
        this.egisOpts = publishObjectPath.value.egis;
        this.egisService = new RequestServerClass({});
        this.emapServiceFilter = publishObjectPath.value.district;
    }

    /**
     * 获取高德-数据库资源组合地名列表
     * @param opts
     * @param opts.keyWord {String}
     * @param [opts.gaodePageSize] {number}  列表中高德地图最大记录数，默认10
     * @param [opts.totalPageSize] {number} 列表最大记录数，默认50
     */
    public getAddressByKeyword(opts: any) {
        const gaodePageSize = opts.gaodePageSize || 10;
        const dbPageSize = opts.totalPageSize || 50;
        const pageNum = 1;
        const keyWord = opts.keyWord;
        const optsGaode: any = {
            keyWord,
            pageSize: gaodePageSize,
            pageNum,
        };
        const optsDB: any = {
            keyWord,
            pageSize: dbPageSize,
            pageNum,
        };
        const optsEGIS: any = {
            keyWord,
        };
        return new Promise((resolve, reject) => {
                this.getDatabaseAddressByKeyword(optsDB).then((dbData: any) => {
                    this.getGaodeAddressByKeyword(optsGaode).then((gaodeData: any) => {
                        this.getEGISAddressByKeyword(optsEGIS).then((egisData: any) => {
                        let queryGaodeAddr: any[] = [];
                        let queryDataBaseAddr = [];
                        let queryEgisAddr = [];
                        const dataarrTest = egisData.length + gaodeData.length + dbData.length;
                        queryGaodeAddr = gaodeData;
                        queryEgisAddr = egisData;
                        const egislength: number = queryEgisAddr.length;
                        queryGaodeAddr.splice(queryGaodeAddr.length - egislength, egislength);
                        queryGaodeAddr.unshift.apply(queryGaodeAddr, queryEgisAddr);
                        if (dataarrTest > 50) {
                            const length = 50 - gaodeData.length;
                            queryDataBaseAddr = dbData.slice(0, length);
                        } else {
                            queryDataBaseAddr = dbData;
                        }
                        const dataarrS = queryDataBaseAddr;
                        dataarrS.push.apply(dataarrS, queryGaodeAddr); // 合并数组
                        resolve(dataarrS); //
                    });
                    });
                });
        });
    }
    /**
     * 获取数据库资源地名
     * @param opts
     * @param opts.keyWord {String}
     * @param [opts.pageSize] {Integer} ，默认10
     * @param opts.pageNum {Integer}
     */
    public getGaodeAddressByKeyword(opts: any) {
        const pageSize = opts.pageSize || 10;
        const keyWord = opts.keyWord;
        const pageNum = opts.pageNum;
        const queryGaodeAddr: any[] = [];
        return new Promise((resolve, reject) => {
            resolve(queryGaodeAddr);
            // const temp: any = this.gaodeOpts;
            // if (keyWord === '北京' || keyWord === '北京市') {
            //     const url1 = `${temp.server}place/text?key=` + temp.key + '&keywords=' + keyWord + '&offset=1&page=' + pageNum + '&city=110000&types=190102';
            //     const url2 = `${temp.server}place/text?key=` + temp.key + '&keywords=' + keyWord + '&offset=' + (pageSize - 1) + '&page=' + pageNum;
            //     this.gaodeSerivce.serverObj.get(url1).then((response: any) => {
            //         if (response.data.count >= 0) {
            //             for (var k = 0; k <= response.data.pois.length - 1; k++) {
            //                 response.data.pois[k].icontype = 'gaode';
            //                 const loc = G.utils.CRSTransformUtil.gcj02towgs84(response.data.pois[k].location);
            //                 response.data.pois[k].location = loc;
            //             }
            //             queryGaodeAddr = response.data.pois;
            //         }
            //         this.gaodeSerivce.serverObj.get(url2).then((response2: any) => {
            //             if (response2.data.count >= 0) {
            //                 for (var l = 0; l <= response2.data.pois.length - 1; l++) {
            //                     response2.data.pois[l].icontype = 'gaode';
            //                     const loc = G.utils.CRSTransformUtil.gcj02towgs84(response2.data.pois[l].location);
            //                     response2.data.pois[l].location = loc;
            //                 }
            //                 const data2 = response2.data.pois;
            //                 queryGaodeAddr.push.apply(queryGaodeAddr, data2);
            //             }
            //             resolve(queryGaodeAddr);
            //         });
            //     });
            // } else {
            //     const url = `${temp.server}place/text?key=` + temp.key + '&keywords=' + keyWord + '&offset=' + pageSize + '&page=' + pageNum;
            //     this.gaodeSerivce.serverObj.get(url).then((response: any) => {
            //         if (response.data.count >= 0) {
            //             for (var k = 0; k <= response.data.pois.length - 1; k++) {
            //                 response.data.pois[k].icontype = 'gaode';
            //                 const loc = G.utils.CRSTransformUtil.gcj02towgs84(response.data.pois[k].location);
            //                 response.data.pois[k].location = loc;
            //             }
            //             const data = response.data.pois;
            //             queryGaodeAddr = data;
            //         }
            //         resolve(queryGaodeAddr);
            //     });
            // }
        });
    }
    /**
     * 获取EGIS地名
     * @param opts
     * @param opts.keyWord {String}
     * @param [opts.pageSize] {Integer} ，默认2
     * @param opts.pageNum {Integer}
     * egis接口取百度数据，如果百度没有数据取天地图数据
     */
    public getEGISAddressByKeyword(opts: any) {
        const pageSize = opts.pageSize || 2;
        const keyWord = opts.keyWord;
        const pageNum = opts.pageNum;
        let queryEgisAddr: any;
        return new Promise((resolve, reject) => { // keydatapoi
                const temp: any = this.egisOpts;
                const url1 = `${temp.tokenServer}?client_id=${temp.clientId}&client_secret=${temp.clientSecret}`;
                let url2 = `${temp.server}/egis/base/v1/wpss/keyword?keyword=`
                + keyWord +
                '&bounds=63.712376836679894,-6.164659444224398,147.91159558667988,64.3236218057756&page_size=' + pageSize + `&page_num=0&layer=baidu&format=json&scope=1&level=4&query_type=2&region=全国&client_id=${temp.clientId}&access_token=`;
                this.egisService.serverObj.get(url1).then((response: any) => {
                    if (response.data.access_token) {
                        url2 = url2 + response.data.access_token + '';
                        this.egisService.serverObj.get(url2).then((res: any) => {
                            res = res.data;
                            if (res.status === 0 && res.result.baidu.type === 3 && res.result.baidu.total !== '0') {
                                const data: any = res.result.baidu.pois;
                                if ((data instanceof Array) && data.length > 0) {
                                    let i: number;
                                    for (i = 0; i < data.length; i++ ) {
                                        data[i].id = data[i].uid;
                                        data[i].icontype = 'baidu';
                                        data[i].pathPlanLocation = {};
                                        data[i].pathPlanLocation.lat = data[i].location.lat;
                                        data[i].pathPlanLocation.lon = data[i].location.lng;
                                        data[i].location = data[i].location.lng + ',' + data[i].location.lat;
                                        data[i].cityaddress = data[i].address;
                                        data[i].citytell = data[i].citytell ? data[i].citytell : '暂无数据';
                                        data[i].type = res.result.baidu.type;
                                    }
                                    queryEgisAddr = data;
                                } else {
                                    queryEgisAddr = [];
                                }
                            } else if (res.status === 0 && res.result.baidu.type === 4 && res.result.baidu.total !== '0') {
                                const arr = [];
                                const data: any = res.result.baidu.admin;
                                data.type = res.result.baidu.type;
                                data.location = data.lonlat;
                                data.pathPlanLocation = {};
                                data.pathPlanLocation.lat = data.lonlat.split(',')[1];
                                data.pathPlanLocation.lon = data.lonlat.split(',')[0];
                                data.icontype = 'baidu';
                                data.cityaddress = data.name;
                                arr.push(data);
                                queryEgisAddr = arr;
                            } else if (res.status === 0 && res.result.baidu.total === '0' && res.result.tianditu.type === 3 ) {
                                const data: any = res.result.tianditu.pois;
                                if ((data instanceof Array) && data.length > 0) {
                                    let i: number;
                                    for (i = 0; i < data.length; i++ ) {
                                        data[i].id = data[i].uid;
                                        data[i].icontype = 'tianditu';
                                        data[i].pathPlanLocation = {};
                                        data[i].pathPlanLocation.lat = data[i].location.lat;
                                        data[i].pathPlanLocation.lon = data[i].location.lng;
                                        data[i].location = data[i].location.lng + ',' + data[i].location.lat;
                                        data[i].cityaddress = data[i].address;
                                        data[i].citytell = data[i].citytell ? data[i].citytell : '暂无数据';
                                        data[i].type = res.result.tianditu.type;
                                    }
                                    queryEgisAddr = data;
                                } else {
                                    queryEgisAddr = [];
                                }
                            } else if (res.status === 0 && res.result.baidu.total === '0' && res.result.tianditu.type === 4) {
                                const arr = [];
                                const data: any = res.result.tianditu.admin;
                                data.type = res.result.tianditu.type;
                                data.location = data.lonlat;
                                data.pathPlanLocation = {};
                                data.pathPlanLocation.lat = data.lonlat.split(',')[1];
                                data.pathPlanLocation.lon = data.lonlat.split(',')[0];
                                data.icontype = 'tianditu';
                                data.cityaddress = data.name;
                                arr.push(data);
                                queryEgisAddr = arr;
                            } else {
                                queryEgisAddr = [];
                            }
                            resolve(queryEgisAddr);
                        });
                    }
                });
        });
    }
    /**
     * 获取数据库资源地名
     * @param opts
     * @param opts.keyWord {String}
     * @param opts.discode {String}
     * @param [opts.pageSize] {Integer} ，默认50
     * @param opts.pageNum {Integer}
     */
    public getDatabaseAddressByKeyword(opts: any) {
        this.emapServiceFilter = publishObjectPath.value.district;
        const self = this;
        if (!opts.discode && self.emapServiceFilter && self.emapServiceFilter.root) {
            opts.discode = self.emapServiceFilter.root;
        }
        const pageSize = opts.pageSize || 50;
        const keyWord = opts.keyWord;
        let pageNum = opts.pageNum;
        if (!pageNum) {
            pageNum = 1;
        }
        let discode = opts.discode;
        if (discode == null || !discode || discode === 'undefined') {
            discode = '';
        }
        if ('000000' === discode) {// 全国不过滤
            discode = '';
        } else if (/^\d{2}0000$/.test(discode)) {
            discode = discode.substr(0, 2);
        } else if (/^\d{4}00$/.test(discode)) {
            discode = discode.substr(0, 4);
        }
        const param = {
            discode,
            name: keyWord,
            nowPage: pageNum,
            pageSize,
        };
        // const url = 'myTest/selectVAlldabase?vname=' + keyWord + '&pagesize=' + pageSize + '&pageNum=' + pageNum + '&discode=' + discode;
        const url = '/api/public/selectresdata/v1';
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, param).then((response: any) => {
                const res = response.data.data.list;
                if (res.length > 0) {
                    const data: any = [];
                    for (var k = 0; k <= res.length - 1; k++) {
                        const obj: any = {};
                        obj.name = res[k].name;
                        obj.location = res[k].longitude + ',' + res[k].latitude;
                        obj.id = res[k].vid;
                        obj.icontype = 'database';
                        if (res[k].typeCode) {
                            obj.layercode = res[k].tableName + '※' + self.jugeLayercode(res[k].typeCode);
                        } else {
                            obj.layercode = res[k].tableName + '※01';
                        }
                        data.push(obj);
                    }
                    data.count = res[res.length - 1].count;
                    data.totalPage = res[res.length - 1].totalPage;
                    resolve(data);
                } else {
                    resolve([]);
                }
                }, (err: any) => {
                    reject(err);
            });
        });

    }

    /**
     * 获取数据库资源地名
     * @param opts
     * @param opts.location {Array}
     * @param [opts.radius] {number} ，默认1000
     */
    public getGaodeAddressByLocation(opts: any) {
        const radius = opts.radius || 1000;
        const temp: any = this.gaodeOpts;
        const url = temp.server + 'geocode/regeo?key=' + temp.key + '&location=' + opts.location.join(',') + '&radius=' + radius + '&extensions=base';
        return new Promise((resolve, reject) => {
            this.gaodeSerivce.serverObj.get(url).then((response: any) => {
                const address = {
                    address: response.data.regeocode.formatted_address,
                };
                resolve(address);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    /**
     * @Description:  推荐词条
     * @date 2020/4/20
    */
    public getSearchRecommendation(opts: any) {
        const keyWord = opts.keyWord;
        return new Promise((resolve, reject) => {
            const temp: any = this.egisOpts;
            const url1 = `${temp.tokenServer}?client_id=${temp.clientId}&client_secret=${temp.clientSecret}`;
            let url2 = `${temp.server}/egis/base/v1/wpss/keyword?keyword=`
                + keyWord +
                '&bounds=45.59318143301197,-5.414709680834733,169.84591750389015,64.47745435903424&level=5&query_type=1&region=全国&client_id=' + temp.clientId + '&access_token=';
            this.egisService.serverObj.get(url1).then((response: any) => {
                if (response.data.access_token) {
                    url2 = url2 + response.data.access_token + '';
                    this.egisService.serverObj.get(url2).then((res: any) => {
                        res = res.data;
                        resolve(res);
                    }).catch((err: any) => {
                        reject(err);
                    });
                }
            });
        });
    }
    // 救援队伍类型判断
    private jugeLayercode(code: string) {
        switch (code) {
            case 'T001':
            case '1001':
                return '01';
            case 'T002':
            case '1002':
                return '02';
            case 'T003':
            case '1009':
                return '09';
            case 'T004':
            case 'T016':
            case '1004':
                return '04';
            case 'T005':
            case '1005':
                return '05';
            case 'T006':
            case 'T014':
            case '1006':
                return '06';
            case 'T007':
            case 'T008':
            case 'T009':
            case 'T010':
            case 'T022':
            case '1007':
                return '07';
            case 'T011':
            case '1008':
            case 'T018':
            case 'T020':
            case 'T021':
                return '08';
            case '1003':
                return '03';
            case '1010':
                return '10';
            case '1011':
                return '11';
            case '1014':
                return '14';
            case '1015':
                return '15';
            case '1016':
                return '16';
            case '1017':
                return '17';
            case '1018':
                return '18';
            case '1019':
                return '19';
            case '1020':
                return '20';
        }
    }
}

