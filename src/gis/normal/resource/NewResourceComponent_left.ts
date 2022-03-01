import Util from '../../Util';
import MultiuleQueryParamConfig from './MultiuleQueryParamConfig';
import MultiuleQueryDateilConfig from './MultiuleQueryDetilConfig';
import ResourceSymbolMap from './SymbolMap';
import { equipment } from '@/components/feature/gisModule/popUp/dataDeal/v_equipment';
//
/**
 * 新增数据模块  通用
 */
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        // 资源类型
        type: null,
        eventInfo: null,
        map: null,
        mapConfig: null,
        symbolConfig: null,
        service: null,
        highLightId: 'disasterJudge_disaster_hl', // 高亮id
        popupId: 'normal_resource', // 弹窗唯一标识
        fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id
        popUpfeatureType: null,
        popUptype: null,
        popUpelement: null,
        popUpattrObj: null,
        clusterlevel: 10,
        vilagelevel: 7,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.service = options.service;
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
        this.featureTypeSet = {};
        this.keysNotShow = {};
        this.dataCol = {};
        this.groupBaseMapData = {};
        this.tmppoint = '';
        this.tmptypes = [];
        this.tmprangestr = '';
        this.key = '';
        const serviceConfig = this.options.publishObjectPath.value;
        this.WRGSService = new g2.ews.RestWRGSService({
            url: serviceConfig.egis.server + 'egis/base/v1',
            authType: 'Token',
            tokenUrl: serviceConfig.egis.tokenServer,
            clientId: serviceConfig.egis.clientId,
            clientSecret: serviceConfig.egis.clientSecret,
            deserializer: new g2.core.Deserializer(),
        });
        this.emapServiceFilter = '000000';
    },
    load() {
        componentBase.prototype.load.call(this);
    },
    getSessionDistrict() {
        this.emapServiceFilter = sessionStorage.getItem('districtCode') || '000000'; // sessionStorage内取code 没有赋值000000 全国
        if ('000000' === this.emapServiceFilter) { // 全国不过滤
            this.emapServiceFilter = '';
        } else if (/^\d{2}0000$/.test(this.emapServiceFilter)) {
            this.emapServiceFilter = this.emapServiceFilter.substr(0, 2);
        } else if (/^\d{4}00$/.test(this.emapServiceFilter)) {
            this.emapServiceFilter = this.emapServiceFilter.substr(0, 4);
        }
    },
    showExtentData(type: any, extent?: any) {
        const self = this;
        // 特殊处理装备
        let equipWhere = '';
        let equipCode = '';
        let centerPoint = 'POINT(121.372732 37.31182)';
        if (type.indexOf('equipment') >= 0) {
            equipCode = type.split('_')[1];
            type = type.split('_')[0];
            equipWhere = ' and a.equiptypecode=' + '\'' + equipCode + '\'';
        }
        self.keysNotShow[type + equipCode] = false;
        if (extent) {
            // todo 查询视野范围内的数据并进行标注
            const tempgeo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(extent);
            const center = tempgeo.getBaryCenter();
            centerPoint = 'POINT(' + center.x + ' ' + ' ' + center.y + ')';
            const field = MultiuleQueryParamConfig[type.split('__')[0]].fileFn({ centerPoint }); // 配置查询条件
            const where: any = '';
            const data = {
                field,
                latitude: '',
                longitude: '',
                polygon: extent.asWkt(),
                rad: '',
                tableName: type,
                type: '2',
                where,
            };
            data.tableName = MultiuleQueryParamConfig[type.split('__')[0]].tableName();
            data.where = MultiuleQueryParamConfig[type.split('__')[0]].where();
            if (this.emapServiceFilter !== '') {
                data.where += ' and ' + MultiuleQueryParamConfig[type.split('__')[0]].group() + ' like (\'' + this.emapServiceFilter + '\'||\'%\')ESCAPE\'/\'';
            }
            this.getMultiuleData(data).then((response: any) => {
                if (self.keysNotShow[type + equipCode]) {
                    return;
                }
                const res = response.data.data;
                this._showPoint(res, type, equipCode);
                self.keysNotShow[type + equipCode] = false;
            });
            // layer.setVisible(true);
            this.simpleRenderMgr.setVisible(type, true);
        } else {
            const field = MultiuleQueryParamConfig[type.split('__')[0]].fileFn({ centerPoint }); // 配置查询条件
            const where: any = '';
            const data = {
                field,
                tableName: type,
                type: '3',
                where,
            };
            data.tableName = MultiuleQueryParamConfig[type.split('__')[0]].tableName();
            data.where = MultiuleQueryParamConfig[type.split('__')[0]].where() + equipWhere;
            this.getMultiuleData(data).then((response: any) => {
                if (self.keysNotShow[type + equipCode]) {
                    return;
                }
                const res = response.data.data;
                this._showPoint(res, type, equipCode);
                self.keysNotShow[type + equipCode] = false;
            });
            this.simpleRenderMgr.setVisible(type, true);
        }

    },
    // 前端获取统计结果
    async getMultiuleAllNum(param: any, levelArr: any, geo?: any, districtcode?: any) {
        this.getSessionDistrict();
        let ranges: any = null;
        ranges = this.options.eventInfo.getRanges();
        if (this.options.eventInfo.getCurrentStatus() === 1) {
            levelArr = ranges;
        }
        let polygon: any = null;
        this.queryData = {};
        let finishCount = 0;
        const self: any = this;
        return await new Promise(async (resolve, reject) => {
            const tmpdata: any = {};
            const tmpoildata = {};
            const queryCallback = (dataObj: any, itemLevel: any, index: any) => {
                finishCount++;
                // tmpdata.push(dataObj);
                tmpdata[itemLevel] = dataObj;
                if (levelArr && levelArr.length > 0) {
                    if (finishCount === levelArr.length) {
                        resolve(tmpdata);
                    }
                } else {
                    resolve(dataObj);
                }
            };
            if (!geo && levelArr && levelArr.length > 0) {
                levelArr.forEach((level: any) => {
                    for (const item of ranges) {
                        if (item.level.toString() === level.level.toString()) {
                            polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(item.geometry).asWkt();
                            const opts: any = {
                                field: '',
                                latitude: '',
                                longitude: '',
                                polygon,
                                rad: '',
                                tableName: param,
                                type: '2',
                                where: '',
                                index: 1,
                            };
                            let tmpparam = [];
                            tmpparam = param.split(',');
                            opts.alias = param;
                            opts.where = opts.where.replace(new RegExp(',', 'gm'), '-');
                            if (tmpparam.length > 1 && opts.where.split(',').length !== tmpparam.length) {
                                const finalarr = [];
                                const tmparr = tmpparam;
                                opts.alias = '';
                                for (const tmpitem of tmparr) {
                                    if (opts.alias.length > 0) {
                                        opts.alias = opts.alias + ',' + tmpitem;
                                    } else {
                                        opts.alias = tmpitem;
                                    }
                                    finalarr.push(MultiuleQueryParamConfig[tmpitem].tableName());
                                    if (MultiuleQueryParamConfig[tmpitem] && MultiuleQueryParamConfig[tmpitem].where()) {
                                        if (opts.where.length === 0) {
                                            opts.where = MultiuleQueryParamConfig[tmpitem].where('0');
                                        } else {
                                            if (self.options.eventInfo.getCurrentStatus() === '0' && 'bas_hotelbas_theaterbas_school'.indexOf(tmpitem) !== -1) {
                                                opts.where = opts.where + '- ' + MultiuleQueryParamConfig[tmpitem].where('0');
                                            } else {
                                                opts.where = opts.where + '- ' + MultiuleQueryParamConfig[tmpitem].where();
                                            }
                                        }
                                        if (this.emapServiceFilter !== '') {
                                            opts.where += ' and ' + MultiuleQueryParamConfig[tmpitem].group() + ' like (\'' + this.emapServiceFilter + '\'||\'%\')ESCAPE\'/\'';
                                        }
                                    }
                                }
                                opts.tableName = finalarr.join(',');
                            }
                            this.options.service.multiuGetAllNum(opts).then((response: any) => {
                                queryCallback(response.data.data[0], item.level, opts.index);
                            });
                        }
                    }
                });
            } else {
                const opts: any = {
                    field: '',
                    latitude: '',
                    longitude: '',
                    polygon,
                    rad: '',
                    tableName: param,
                    type: '2',
                    where: '',
                    index: 1,
                };
                let tmpparam = [];
                tmpparam = param.split(',');
                opts.alias = param;
                if (geo) {
                    polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geo).asWkt();
                    opts.polygon = polygon;
                }
                opts.where = opts.where.replace(new RegExp(',', 'gm'), '-');
                if (tmpparam.length > 1 && opts.where.split(',').length !== tmpparam.length) {
                    const finalarr = [];
                    const tmparr = tmpparam;
                    opts.alias = '';
                    for (const tmpitem of tmparr) {
                        if (opts.alias.length > 0) {
                            opts.alias = opts.alias + ',' + tmpitem;
                        } else {
                            opts.alias = tmpitem;
                        }
                        finalarr.push(MultiuleQueryParamConfig[tmpitem].tableName());
                        if (MultiuleQueryParamConfig[tmpitem] && MultiuleQueryParamConfig[tmpitem].where()) {
                            if (opts.where.length === 0) {
                                opts.where = MultiuleQueryParamConfig[tmpitem].where('0');
                            } else {
                                if (self.options.eventInfo.getCurrentStatus() === '0') {
                                    opts.where = opts.where + '- ' + MultiuleQueryParamConfig[tmpitem].where('0');
                                } else {
                                    opts.where = opts.where + '- ' + MultiuleQueryParamConfig[tmpitem].where();
                                }
                            }
                            if (districtcode) {
                                const arrDistrict = districtcode.split(',');
                                if (arrDistrict.length === 1) {
                                    if (districtcode.substring(districtcode.length - 2) === '00') {
                                        districtcode = districtcode.substr(0, 4);
                                    }
                                    opts.where += ' and ' + MultiuleQueryParamConfig[tmpitem].group() + ' like  \'' + districtcode + '\'||\'%\'';
                                } else if (arrDistrict.length > 1) {
                                    opts.where += ' and ' + MultiuleQueryParamConfig[tmpitem].group() + ' in(' + districtcode + ')';
                                }
                            }
                        }
                    }
                    opts.tableName = finalarr.join(',');
                }
                this.options.service.multiuGetAllNum(opts).then((response: any) => {
                    queryCallback(response.data.data[0], '', opts.index);
                });
            }
        });
    },
    // 前端获取统计结果
    async getMultiuleAllNumEquip(param: any, levelArr: any) {
        let ranges: any = null;
        ranges = this.options.eventInfo.getRanges();
        if (ranges.length === 0 && this.options.eventInfo.getGeometry()) {
            ranges.push({ level: '0', geometry: this.options.eventInfo.getGeometry() });
        }
        let polygon: any = null;
        this.queryData = {};
        let finishCount = 0;
        const self: any = this;
        return await new Promise(async (resolve, reject) => {
            const tmpdata: any = {};
            let tmpindex = 0;
            const tmpoildata = {};
            const queryCallback = (dataObj: any, itemLevel: any, index: any) => {
                finishCount++;
                // tmpdata.push(dataObj);
                tmpdata[itemLevel] = dataObj;
                if (levelArr) {
                    if (finishCount === levelArr.length) {
                        dataObj = Object.assign(dataObj, tmpoildata);
                        if (tmpindex + index === 3) {
                            tmpdata[itemLevel] = dataObj;
                            resolve(tmpdata);
                        }
                    } else {
                        resolve(tmpdata);
                    }
                    tmpindex = index;
                } else {
                    resolve(dataObj);
                }
            };
            if (levelArr) {
                levelArr.forEach((level: any) => {
                    for (const item of ranges) {
                        if (item.level.toString() === level.level.toString()) {
                            if (this.options.eventInfo.getCurrentStatus() !== '0') {
                                const eventType = this.options.eventInfo.getType();
                                const ep = this.options.eventInfo.getPoint().join(',');
                                if ((eventType === '20') || (eventType === 20) || (eventType === '17') || (eventType === 17) || (eventType === '3') || (eventType === 3) || (eventType === '8') || (eventType === 8) || (eventType === '10') || (eventType === 10) || (eventType === '16') || (eventType === 16) || (eventType === 18) || (eventType === '18') || (eventType === 19) || (eventType === '19') || (eventType === 21) || (eventType === 21)) {
                                    if (param === 'egis_gas_station') {
                                        const layer = this.simpleRenderMgr.getLayer('drawEventPolygonmodel');
                                        if (layer && ep === '114.797,26.449') {
                                            item.geometry = this.modeldata.wanan;
                                        }
                                        if (layer && ep === '115.135861,26.598167') {
                                            item.geometry = this.modeldata.laoyingpan;
                                        }
                                        if (layer && ep === '113.263362,25.935671') {
                                            item.geometry = this.modeldata.dongjiang;
                                        }
                                        if (layer && ep === '94.608397,42.722257') { // 射月沟水库
                                            item.geometry = this.modeldata.sheyuegou;
                                        }
                                    }
                                }
                            }
                            polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(item.geometry).asWkt();
                            const opts: any = {
                                field: '',
                                latitude: '',
                                longitude: '',
                                polygon,
                                rad: '',
                                tableName: param,
                                type: '2',
                                where: '',
                                index: 1,
                            };
                            let tmpparam = [];
                            tmpparam = param.split(',');
                            opts.alias = param;
                            opts.where = opts.where.replace(new RegExp(',', 'gm'), '-');
                            if (tmpparam.length > 1 && opts.where.split(',').length !== tmpparam.length) {
                                const finalarr = [];
                                const tmparr = tmpparam;
                                opts.alias = '';
                                for (const tmpitem of tmparr) {
                                    if (opts.alias.length > 0) {
                                        opts.alias = opts.alias + ',' + tmpitem;
                                    } else {
                                        opts.alias = tmpitem;
                                    }
                                    finalarr.push(MultiuleQueryParamConfig[tmpitem].tableName());
                                    if (MultiuleQueryParamConfig[tmpitem] && MultiuleQueryParamConfig[tmpitem].where()) {
                                        if (opts.where.length === 0) {
                                            opts.where = MultiuleQueryParamConfig[tmpitem].where('0');
                                        } else {
                                            if (self.options.eventInfo.getCurrentStatus() === '0' && 'bas_hotelbas_theaterbas_school'.indexOf(tmpitem) !== -1) {
                                                opts.where = opts.where + '- ' + MultiuleQueryParamConfig[tmpitem].where('0');
                                            } else {
                                                opts.where = opts.where + '- ' + MultiuleQueryParamConfig[tmpitem].where();
                                            }
                                        }
                                        if (this.emapServiceFilter !== '') {
                                            opts.where += ' and ' + MultiuleQueryParamConfig[tmpitem].group() + ' like (\'' + this.emapServiceFilter + '\'||\'%\')ESCAPE\'/\'';
                                        }
                                    }
                                }
                                opts.tableName = finalarr.join(',');
                            }
                            this.options.service.multiuGetAllNum(opts).then((response: any) => {
                                queryCallback(response.data.data[0], item.level, opts.index);
                            });
                        }
                    }
                });
            } else {
                const opts: any = {
                    field: 'sum(a.equipnum),a.equiptypecode',
                    tableName: '',
                    type: '3',
                    where: '',
                    index: 1,
                    group: '',
                };
                opts.alias = param;
                opts.tableName = MultiuleQueryParamConfig[param].tableName();
                opts.where = MultiuleQueryParamConfig[param].where('0') + ' group by ' + MultiuleQueryParamConfig[param].group();
                this.options.service.multiuleInterGetData(opts).then((response: any) => {
                    queryCallback(response.data.data, '', opts.index);
                });
            }
        });
    },
    // 前端获取统计结果
    async getMultiuleOneNum(param: any, geo?: any, districtcode?: any) {
        // param ='firework'
        let ranges: any = null;
        ranges = this.options.eventInfo.getRanges();
        let levelArr: any = null;
        if (this.options.eventInfo.getCurrentStatus() === 1) {
            levelArr = ranges;
        }
        let polygon: any = null;
        this.queryData = {};
        let finishCount = 0;
        const self: any = this;
        return await new Promise(async (resolve, reject) => {
            const tmpdata: any = {};
            const tmpoildata = {};
            const queryCallback = (dataObj: any, itemLevel: any, index: any) => {
                finishCount++;
                // tmpdata.push(dataObj);
                tmpdata[itemLevel] = {};
                tmpdata[itemLevel].list = dataObj;
                tmpdata[itemLevel].count = dataObj.length;
                tmpdata[itemLevel].icons = param + '_' + itemLevel;
                tmpdata[itemLevel].title = itemLevel;
                if (levelArr && levelArr.length > 0) {
                    if (finishCount === levelArr.length) {
                        resolve(tmpdata);
                    }
                } else {
                    resolve(dataObj);
                }
            };
            if (!geo && levelArr && levelArr.length > 0) {
                const centerPoint = 'POINT(' + this.options.eventInfo.getPoint()[0] + '\ ' + this.options.eventInfo.getPoint()[1] + ')';
                levelArr.forEach((level: any) => {
                    for (const item of ranges) {
                        if (item.level.toString() === level.level.toString()) {
                            if (this.options.eventInfo.getCurrentStatus() !== '0') {
                                const eventType = this.options.eventInfo.getType();
                                const ep = this.options.eventInfo.getPoint().join(',');
                            }
                            polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(item.geometry).asWkt();
                            const opts: any = {
                                field: '',
                                polygon,
                                tableName: param,
                                type: '2',
                                where: '',
                                index: 1,
                            };
                            opts.alias = param;
                            opts.where = opts.where.replace(new RegExp(',', 'gm'), '-');
                            opts.alias = param;
                            opts.field = MultiuleQueryParamConfig[param].fileFn({ centerPoint });
                            opts.where = MultiuleQueryParamConfig[param].where('0');
                            opts.tableName = MultiuleQueryParamConfig[param].tableName();
                            if (districtcode) {
                                const arrDistrict = districtcode.split(',');
                                if (arrDistrict.length === 1) {
                                    if (districtcode.substring(districtcode.length - 2) === '00') {
                                        districtcode = districtcode.substr(0, 4);
                                    }
                                    opts.where += ' and ' + MultiuleQueryParamConfig[param].group() + ' like  \'' + districtcode + '\'||\'%\'';
                                } else if (arrDistrict.length > 1) {
                                    opts.where += ' and ' + MultiuleQueryParamConfig[param].group() + ' in(' + districtcode + ')';
                                }
                            }
                            this.options.service.multiuleInterGetData(opts).then((response: any) => {
                                queryCallback(response.data.data, item.level, opts.index);
                            });
                        }
                    }
                });
            } else {
                let centerPoint = 'POINT(121.372732 37.31182)';
                const opts: any = {
                    field: '',
                    polygon,
                    tableName: param,
                    type: '2',
                    where: '',
                    index: 1,
                };
                opts.alias = param;
                if (geo) {
                    const tempgeo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geo);
                    const center = tempgeo.getBaryCenter();
                    centerPoint = 'POINT(' + center.x + ' ' + ' ' + center.y + ')';
                    polygon = tempgeo.asWkt();
                    opts.polygon = polygon;

                }
                opts.alias = param;
                opts.where = opts.where.replace(new RegExp(',', 'gm'), '-');
                opts.alias = param;
                opts.field = MultiuleQueryParamConfig[param].fileFn({ centerPoint });
                opts.where = MultiuleQueryParamConfig[param].where('0');
                opts.tableName = MultiuleQueryParamConfig[param].tableName();
                if (districtcode) {
                    const arrDistrict = districtcode.split(',');
                    if (arrDistrict.length === 1) {
                        if (districtcode.substring(districtcode.length - 2) === '00') {
                            districtcode = districtcode.substr(0, 4);
                        }
                        opts.where += ' and ' + MultiuleQueryParamConfig[param].group() + ' like  \'' + districtcode + '\'||\'%\'';
                    } else if (arrDistrict.length > 1) {
                        opts.where += ' and ' + MultiuleQueryParamConfig[param].group() + ' in(' + districtcode + ')';
                    }
                }
                this.options.service.multiuleInterGetData(opts).then((response: any) => {
                    queryCallback(response.data.data, 1, opts.index);
                });
            }
        });
    },
    getMultiuleData(param: any) {
        return this.options.service.multiuleInterGetData(param);
    },
    getLimitDataList(param: any) {
        return this.options.service.getLimitDataList(param);
    },
    unload() {
        // todo
        this.clearPopup();
        this._clearLayers();
        this.dataCol = {};
        this.tmppoint = '';
        this.tmptypes = [];
        this.tmprangestr = '';
        componentBase.prototype.unload.call(this);
    },
    _showPoint(dataList: any, featureType: any, equipCode: any) {
        let symbolMapper: any = null;
        if (ResourceSymbolMap[featureType]) {
            symbolMapper = ResourceSymbolMap[featureType];
        } else {
            symbolMapper = ResourceSymbolMap.default;
        }
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                const symbolObj: any = Util.toJSON(symbolMapper.symbol);
                symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(featureType + equipCode, builddata)];
                return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        const opts = {
            featureType: 'disaster_' + featureType + equipCode,
            featureName: 'disaster_' + featureType + equipCode,
            idField: 'id',
            list: dataList,
            type: 1,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['longitude', 'latitude'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                click: (clickdata: any) => {
                    const element = clickdata[0].element;
                    const attrObj: any = Util.attributeSet2Object(element.attributeSet);
                    this.options.popUpfeatureType = featureType;
                    this.options.popUptype = featureType;
                    this.options.popUpelement = element;
                    this.options.popUpattrObj = element;
                    this.addPopup(featureType, element);
                    this._showHighlight(featureType + equipCode,
                        [element.geometry.x, element.geometry.y], element);
                },
            },
        };
        this.simpleRenderMgr.add(opts);
        this.featureTypeSet[featureType + equipCode] = true;
        // if (this.options.eventInfo.getCurrentStatus() === '0' && dataList.length > 100) {
        //     this.simpleRenderMgr.setVisible(featureType, false);
        // }
    },
    /**
    *
    * 获取不同对应级别的图层
    */
    _getFeatureType(type: any, level: any) {
        const featureType = `${type}__${level}`;
        return featureType;
    },
    /**
    * 隐藏对应级别的数据
    * @param levelArr 烈度级别数组
    */
    hideResource(typeArr: any, level: any) {
        // todo
        // 地图清除烈度数组对应范围内的数据
        // 默认不传类型时  清除所有图层  不传等级 清除模糊匹配的所有图层
        if (this.options.DistrictStaticComponent) {
            this.options.DistrictStaticComponent._clearLayers();
        }
        if (!typeArr) {
            for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
                this.simpleRenderMgr.remove(featureTypeKey);
                delete this.featureTypeSet[featureTypeKey];
            }
        } else {
            if (level) {
                typeArr.forEach(async (typeTableName: any) => {
                    level.forEach(async (item: any) => {
                        const typeName: any = typeTableName;
                        const typeTable: any = this._getFeatureType(typeName, item);
                        this.simpleRenderMgr.remove(typeTable);
                        delete this.featureTypeSet[typeTable];
                    });
                });
            } else {
                typeArr.forEach(async (typeTableName: any) => {
                    for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
                        if (featureTypeKey.indexOf(typeTableName) !== -1) {
                            this.simpleRenderMgr.remove(featureTypeKey);
                            delete this.featureTypeSet[featureTypeKey];
                        }
                    }
                });
            }
        }
        // 隐藏的同时,清除弹窗及高亮
        this.closePopup();
        this.hideHighlight();
    },
    /**
     *
     * @param data
     * @param coordinate
     * @param noneMouseClick 是否非地图点击触发，点击地图触发时不居中定位；点击列表触发时，不设置弹出框autoPan
     */
    addPopup(featureType: any, element: any, noneMouseClick: any = true, addFlag: any) {
        let geometry: any;
        let attrObj: any;
        this.addListeners();
        if (!addFlag) {
            geometry = element.geometry;
            attrObj = Util.attributeSet2Object(element.attributeSet);
        } else {
            geometry = {};
            geometry.x = element.longitude;
            geometry.y = element.latitude;
            attrObj = element;
        }
        const popupOptions: any = {
            id: this.options.popupId,
            anchor: [geometry.x, geometry.y],
            className: '',
        };
        if (noneMouseClick) {
            // 点击列表触发时，设置自动调整视野的延迟
            popupOptions.autoPanTimeout = 1200;
        }
        this.popupManager.clear();
        this.popupManager
            .addSimple(popupOptions)
            .then((content: any) => {
                // 处理坐标，属性名统一为x y，提供周边查询、路径规划使用
                if (attrObj.longitude || attrObj.latitude) {
                    attrObj.x = attrObj.longitude;
                    attrObj.y = attrObj.latitude;
                }
                this.fire(this.options.fireAddPopupEventId, {
                    featureType,
                    type: featureType,
                    data: attrObj,
                    content,
                });
            });
    },
    clear() {
        // this.dataCol = {};
        this.clearPopup();
        this._clearLayers();
        this.hideHighlight();
        this.tmppoint = '';
        this.tmptypes = [];
        this.tmprangestr = '';
    },
    /**
     * 清除弹出框
     */
    clearPopup() {
        this.popupManager.remove(this.options.popupId);
        this.popupManager.clear();
        this._clearHighlight();
    },
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this.popupManager.clear();
    },
    _clearHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    /**
     * 页面取消选中时的方法
     */
    _clearLayers() {
        // todo
        const resource = this.simpleRenderMgr.featureTypeList.filter((itme: any) => {
            return itme.featureType.indexOf('disaster_') !== -1;
        });
        resource.forEach((item: any) => {
            const featureType = item.featureType;
            this.simpleRenderMgr.remove(featureType);
            this.simpleRenderMgr.remove(featureType + '_polygon');
        });
        this.map.un('resolutionchanged', this.event);
        this.map.un('click', this.click_event);
        this.cacheData = null;
        this.clearPopup();
    },
    _clearLayerByID(key: any) {
        let equipCode = '';
        if (!key) {
            return;
        }
        if (key.indexOf('equipment') >= 0) {
            equipCode = key.split('_')[1];
            key = key.split('_')[0];
        }
        this.keysNotShow[key + equipCode] = true;
        this.simpleRenderMgr.remove('disaster_' + key + equipCode);
        this.simpleRenderMgr.remove('disaster_' + key + equipCode + '_polygon');
        this.clearPopup();
    },
    _showHighlight(eventType: string, coordinate: any, element: any, addFlag: any) {
        let attrObj: any;
        if (addFlag) {
            attrObj = element;
        } else {
            attrObj = Util.attributeSet2Object(element.attributeSet);
        }
        let symbolObj: any = null;
        const symbolType = eventType.split('__')[0];
        let symbolMapper: any = null;
        if (ResourceSymbolMap[eventType]) {
            symbolMapper = ResourceSymbolMap[eventType];
        } else {
            symbolMapper = ResourceSymbolMap.default;
        }
        symbolObj = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(eventType, attrObj)];
        const options: any = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
                },
            },
            style: symbolObj,
            blink: {
                enable: false,
            },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 用于右下角点击按钮调整地图视野
    fitMap(type: any) {
        // 根据展示的资源数据调整地图视野
        const ep = this.options.eventInfo.getPoint().join(',');
        if (type === 'BestMap') {
            const layer = this.simpleRenderMgr.getLayer('drawEventPolygonmodel');
            if (layer && ep === '114.797,26.449') {
                this.options.featureLocate.fit({
                    type: 'geojson',
                    geom: this.modeldata.wanan,
                }, {
                    maxZoom: this.map.getZoomLevel(),
                });
                return;
            }
            if (layer && ep === '115.135861,26.598167') {
                this.options.featureLocate.fit({
                    type: 'geojson',
                    geom: this.modeldata.laoyingpan,
                }, {
                    maxZoom: this.map.getZoomLevel(),
                });
                return;
            }
            if (layer && ep === '113.263362,25.935671') {
                this.options.featureLocate.fit({
                    type: 'geojson',
                    geom: this.modeldata.dongjiang,
                }, {
                    maxZoom: this.map.getZoomLevel(),
                });
                return;
            }
            if (layer && ep === '94.608397,42.722257') { // 射月沟水库
                this.options.featureLocate.fit({
                    type: 'geojson',
                    geom: this.modeldata.sheyuegou,
                }, {
                    maxZoom: this.map.getZoomLevel(),
                });
                return;
            }
            if (this.options.eventInfo.getMaxRangeGeometry) {
                this.options.featureLocate.fit({
                    type: 'geojson',
                    geom: this.options.eventInfo.getMaxRangeGeometry(),
                }, {
                    maxZoom: this.map.getZoomLevel(),
                });
            } else {
                return;
            }
        } else if (type === 'NationalMap') {
            const strArrAll = [];
            const str1: any = ['73.66,3.86', '135.05,3.86', '135.05,53.55', '73.66,53.55', '73.66,3.86'];
            for (const range of str1) {
                const strArr = [];
                strArr[0] = range.split(',')[0] * 1;
                strArr[1] = range.split(',')[1] * 1;
                strArrAll.push(strArr);
            }
            const geometry = {
                type: 'MultiPolygon',
                coordinates: [],
            };
            (geometry.coordinates as any) = [[strArrAll]];
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: geometry,
            }, {
                maxZoom: this.map.getZoomLevel(),
            });
        } else if (type === 'zoomIn') {
            (window as any).map.zoomIn();
        } else if (type === 'zoomOut') {
            (window as any).map.zoomOut();
        }
    },
    /**
 * 定位、弹出框架、高亮
 * @param id
 * @param noneMouseClick 是否非地图点击触发，点击地图触发时不居中定位；
 */
    locationCenter(key: string, id: string, noneMouseClick: any = true) {
        const self = this;
        let equipWhere = '';
        let equipCode = '';
        let centerPoint = 'POINT(121.372732 37.31182)';
        // 获取当前是常态还是非常态的，非常态要计算点位到事件的距离，非常态计算到烟台市中心点的距离
        if (this.options.eventInfo.getCurrentStatus() === 1) {
            centerPoint = 'POINT(' + this.options.eventInfo.getPoint()[0] + '\ ' + this.options.eventInfo.getPoint()[1] + ')';
        }
        if (key.indexOf('equipment') >= 0) {
            equipCode = key.split('_')[1];
            key = key.split('_')[0];
            equipWhere = ' and a.equiptypecode=' + '\'' + equipCode + '\'';
        }
        const field = MultiuleQueryParamConfig[key.split('__')[0]].fileFn({ centerPoint }); // 配置查询条件
        const where: any = '';
        const data = {
            field,
            tableName: key,
            type: '3',
            where,
        };
        data.tableName = MultiuleQueryParamConfig[key.split('__')[0]].tableName();
        data.where = MultiuleQueryParamConfig[key.split('__')[0]].where() + equipWhere;
        data.where += MultiuleQueryParamConfig[key.split('__')[0]].id(id);
        this.getMultiuleData(data).then((res: any) => {
            // tslint:disable-next-line:no-shadowed-variable
            const data = res.data.data[0];
            if (!data) {
                return;
            }
            if (key.indexOf('Oce_pasture') !== -1) {
                const Geometry1 = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(data.geom, '4326');
                const center1 = Geometry1.getBaryCenter();
                data.geom = {
                    type: 'Point',
                    coordinates: [
                        center1.x,
                        center1.y,
                    ],
                };
            }
            this.clearPopup();
            data.x = data.longitude;
            data.y = data.latitude;
            const popupOptions: any = {
                id: this.options.popupId,
                anchor: [data.x, data.y],
                className: 'g2-tooltip',
            };
            if (noneMouseClick) {
                // 点击列表触发时，设置自动调整视野的延迟
                popupOptions.autoPanTimeout = 1200;
                popupOptions.autoPanMargin = 60;

            }
            console.debug(`popup  type = ${this.key}`);
            this.popupManager
                .addSimple(popupOptions)
                .then((content: any) => {
                    this.fire(this.options.fireAddPopupEventId, {
                        data,
                        content,
                        type: key,
                    });
                });
            this._showHighlight(key, [data.x, data.y], data, true);
        });
    },
});
export default component;


