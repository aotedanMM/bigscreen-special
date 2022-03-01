import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 防汛服务
export class FloodServer {
    public rSerivce: any;
    private wfsConfWatershed: any; // 流域wfs配置
    private wfsConfRiver: any; // 河流wfs配置
    private radiusMap: any = {
        1: 50,
        2: 40,
        3: 30,
        4: 20,
        5: 10,
    };
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        this.wfsConfWatershed = publishObjectPath.value.mapservice.watershedLayer.wfs;
        this.wfsConfRiver = publishObjectPath.value.mapservice.riverLayer.wfs;
    }
    /**
     * 获取流域列表
     * @param opts
     * @param opts.keyWord {string}} // 名称
     * @param [opts.pageSize] {number}
     * @param [opts.pageIndex] {number}
     */
    public getWatershedsList(opts: any) {
        const self = this;
        const url = this.wfsConfWatershed.url;
        const typename = this.wfsConfWatershed.typename;
        const propertyname = 'NAME,LEVEL,SSLY';
        const wfsOpt: any = {
            url,
            typename,
            propertyname,
        };
        return new Promise((resolve, reject) => {
            self.wfsQuery(wfsOpt).then((data: any) => {
                if (opts.keyWord) {
                    const checkKeyword = function(obj: any) {
                        const name = obj.properties.name || obj.properties.NAME;
                        if (name != null && name !== undefined) {
                            return name.indexOf(opts.keyWord) >= 0;
                        }
                        return false;
                    };
                    const newArr = data.filter(checkKeyword);
                    data = newArr;
                }
                if (opts.pageSize && opts.pageIndex) {
                    data = self.processPage(data, opts.pageSize, opts.pageIndex);
                }
                const records: any = [];
                data.data.forEach((res: any) => {
                    const record = {
                        id: res.id,
                        name: res.properties.name || res.properties.NAME,
                        level: res.properties.LEVEL,
                    };
                    records.push(record);
                });
                data.data = records;
                resolve(data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
    // 解决不同级别流域字段不一致问题，弃用，已规范geoserver字段
    public getWatershedsListOld(opts: any) {
        const self = this;
        const url = this.wfsConfWatershed.url;
        const typenameArr = this.wfsConfWatershed.typename.split(',');
        const typename1 = typenameArr[0];
        const typename3 = typenameArr[1];
        const propertyname1 = 'NAME,LEVEL,SSLY';
        const propertyname3 = 'NAME,LEVEL,SSLY';
        const wfsOpt1: any = {
            url,
            typename: typename1,
            propertyname: propertyname1,
        };
        const wfsOpt3: any = {
            url,
            typename: typename3,
            propertyname: propertyname3,
        };
        // if (opts.keyWord) {
        //     const filter = `name like '%${opts.keyWord}%'`;
        //     wfsOpt.filter = filter;
        // }
        return new Promise((resolve, reject) => {
            self.wfsQuery(wfsOpt1).then((data1: any) => {
                self.wfsQuery(wfsOpt3).then((data3: any) => {
                    data1 = data1 || [];
                    data3 = data3 || [];
                    let data = data1.concat(data3);
                    if (opts.keyWord) {
                        const checkKeyword = function(obj: any) {
                            const name = obj.properties.name || obj.properties.NAME;
                            if (name != null && name !== undefined) {
                                return name.indexOf(opts.keyWord) >= 0;
                            }
                            return false;
                        };
                        const newArr = data.filter(checkKeyword);
                        data = newArr;
                    }
                    if (opts.pageSize && opts.pageIndex) {
                        data = self.processPage(data, opts.pageSize, opts.pageIndex);
                    }
                    const records: any = [];
                    data.data.forEach((res: any) => {
                        const record = {
                            id: res.id,
                            name: res.properties.name || res.properties.NAME,
                            level: res.properties.LEVEL,
                        };
                        records.push(record);
                    });
                    data.data = records;
                    resolve(data);
                });
            });
        });
    }
    /**
     * 获取流域
     * @param opts
     * @param opts.id {string}
     */
    public getWatershed(opts: any) {
        const self = this;
        const url = this.wfsConfWatershed.url;

        const typenameArr = this.wfsConfWatershed.typename.split(',');
        const typename1 = typenameArr[0];
        const typename3 = typenameArr[1];
        const propertyname1 = 'NAME,LEVEL,SSLY,the_geom';
        const propertyname3 = 'NAME,LEVEL,SSLY,the_geom';
        // const typename = this.wfsConfWatershed.typename;
        // const propertyname = 'name,LEVEL,SSLY,the_geom';
        const filter = `id in ('${opts.id}')`;
        return new Promise((resolve, reject) => {
            const wfsOpt1 = {
                url,
                typename: typename1,
                propertyname: propertyname1,
                filter,
            };
            const wfsOpt3 = {
                url,
                typename: typename3,
                propertyname: propertyname3,
                filter,
            };
            self.wfsQuery(wfsOpt1).then((data1: any) => {
                self.wfsQuery(wfsOpt3).then((data3: any) => {
                    data1 = data1 || [];
                    data3 = data3 || [];
                    const data = data1.concat(data3);
                    const res = data[0];
                    const result = {
                        id: res.id,
                        name: res.properties.name || res.properties.NAME,
                        level: res.properties.LEVEL,
                        geom: res.geometry,
                    };
                    resolve(result);
                });
            });
        });
    }
    /**
     * 获取河流列表
     * @param opts
     * @param opts.keyWord {string}} // 名称
     * @param [opts.pageSize] {number}
     * @param [opts.pageIndex] {number}
     */
    public getRiversList(opts: any) {
        const self = this;
        const url = this.wfsConfRiver.url;
        const typename = this.wfsConfRiver.typename;
        const propertyname = 'NAME,LEVEL';
        const wfsOpt: any = {
            url,
            typename,
            propertyname,
        };
        // if (opts.keyWord) {
        //     const filter = `NAME like '%${opts.keyWord}%'`;
        //     wfsOpt.filter = filter;
        // }
        return new Promise((resolve, reject) => {
            self.wfsQuery(wfsOpt).then((data: any) => {
                if (opts.keyWord) {
                    const checkKeyword = function(obj: any) {
                        const name = obj.properties.NAME || obj.properties.name;
                        if (name != null && name !== undefined) {
                            const index = name.indexOf(opts.keyWord);
                            return index >= 0;
                        }
                        return false;
                    };
                    const newArr = data.filter(checkKeyword);
                    data = newArr;
                }
                if (opts.pageSize && opts.pageIndex) {
                    data = self.processPage(data, opts.pageSize, opts.pageIndex);
                }
                if (data.data && data.data.length > 0) {
                    self.addProvinceAttr(data).then((result: any) => {
                        resolve(result);
                    });
                } else {
                    resolve(data);
                }
            });
        });
    }
    /**
     * 获取河流
     * @param opts
     * @param opts.id {string}}
     * @param [opts.districtCode] {string} // 行政区编码
     */
    public getRiver(opts: any) {
        const self = this;
        const url = this.wfsConfRiver.url;
        const typename = this.wfsConfRiver.typename;
        const propertyname = 'NAME,LEVEL,the_geom';
        const filter = `id in ('${opts.id}')`;
        return new Promise((resolve, reject) => {
            const wfsOpt = {
                url,
                typename,
                propertyname,
                filter,
            };
            self.wfsQuery(wfsOpt).then((data: any) => {
                if (!data[0]) {
                    resolve(data[0]);
                }
                const record = data[0];
                const result: any = {
                    id: record.id,
                    name: record.properties.NAME || record.properties.name,
                    level: record.properties.LEVEL,
                    geom: record.geometry,
                    radius: null,
                };
                if (result.level && this.radiusMap[result.level]) {
                    result.radius = this.radiusMap[result.level];
                }
                if (opts.districtCode) {
                    self.getDistrictByCode(opts).then((res: any) => {
                        const provinceWKT = res.data.wkt;
                        const provinceGeom = new g2.sfs.GeometryFactory.createGeometryFromWkt(provinceWKT, '4326');
                        const riverGeom = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(result.geom, '4326');
                        const jstsGeomProvince = (G as any).utils.GeometryUtil.toJstsGeometry(provinceGeom);
                        const jstsGeomRiver = (G as any).utils.GeometryUtil.toJstsGeometry(riverGeom);
                        // const intersection = G.utils.SpatialOPUtil.interGeom(result.geom, [provinceGeom.asGeoJson()]);
                        const intersection = jstsGeomRiver.intersection(jstsGeomProvince);
                        const geom = new (window as any).jsts.io.GeoJSONWriter().write(intersection);
                        result.geom = geom;
                        resolve(result);
                    });
                } else {
                    resolve(result);
                }
            });
        });
    }
    /**
     * wfs通用查询
     * @param opts
     * @param opts.url {string}}
     * @param opts.typename {string}}
     * @param opts.propertyname {string}}
     * @param opts.filter {string}
     */
    private wfsQuery(opts: any) {
        let wfsUrl = `${opts.url}?service=wfs&version=1.0.0&request=getfeature&typename=${opts.typename}&PROPERTYNAME=${opts.propertyname}&outputformat=application/json`;
        if (opts.filter) {
            wfsUrl += `&CQL_FILTER=${opts.filter}`;
        }
        // wfsUrl = encodeURI(wfsUrl);
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(wfsUrl).then((response: any) => {
                resolve(response.data.features);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }

    /**
     * 分页信息处理
     * @param data
     */
    private processPage(data: any, pageSize: number, pageIndex: number) {
        const total = data.length;
        const starter = pageSize * (pageIndex - 1);
        let ender = pageSize * pageIndex;
        ender = ender > total ? total : ender;
        const res = data.slice(starter, ender);
        data = {
            data: res,
            total,
        };
        return data;
    }
    /**
     * 省信息添加
     * @param data
     */
    private addProvinceAttr(data: any) {
        const self = this;
        const dataLen = data.data.length;
        let counter = 0;
        const ids: any = [];
        const records = data.data;
        records.forEach((record: any) => {
            ids.push('\'' + record.id + '\'');
        });
        const idStr = ids.join(',');
        const url = this.wfsConfRiver.url;
        const typename = this.wfsConfRiver.typename;
        const propertyname = 'NAME,LEVEL,the_geom';
        const filter = `id in (${idStr})`;
        const wfsOpt = {
            url,
            typename,
            propertyname,
            filter,
        };
        return new Promise((resolve, reject) => {
            this.wfsQuery(wfsOpt).then((result: any) => {
                const recs: any = [];
                result.forEach((river: any) => {
                    const datarec: any = {
                        id: river.id,
                        name: river.properties.NAME || river.properties.name,
                        level: river.properties.LEVEL,
                        provinces: [],
                    };
                    this.getProvinces(river.geometry).then((res: any) => {
                        datarec.provinces = res;
                        if (datarec.level && self.radiusMap[datarec.level]) {
                            datarec.radius = self.radiusMap[datarec.level];
                        }
                        recs.push(datarec);
                        counter ++;
                        if (counter === dataLen) {
                            resolve({
                                data: recs,
                                total: data.total,
                            });
                        }
                    });
                });
            });
        });
    }

    private getProvinces(geom: any) {
        const url = 'api/public/dlgbouasheng/bypac/v1';
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
        const polygon = Geometry.asWkt();
        const center = '117 35';
        const data = {
            polygon,
            center,
        };
        return new Promise((resolve, reject) => {
            this.rSerivce.serverObj.post(url, data).then((response: any) => {
                const res = response.data;
                const result: any = [];
                res.data.forEach((province: any) => {
                    const record = {
                        districtName: province.tag.name,
                        districtCode: province.tag.adcode,
                    };
                    result.push(record);
                });
                resolve(result);
            }).catch((e: any) => {
                reject(e);
            });
        });
    }

    /**
     * 根据code获取地区(单个)
     * @param opts {Object}
     * @param opts.districtCode {String}
     *
     */
    private getDistrictByCode(opts: any) {
        const self = this;
        const url = '/api/district/' + opts.districtCode + '/selectonedis/v1';
        return new Promise((resolve, reject) => {
            self.rSerivce.serverObj.get(url).then((response: any) => {
                const result = response.data;
                resolve(result);
                }, (err: any) => {
                    reject(err);
            });
        });
    }
}

