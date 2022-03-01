import Util from '../../../Util';
import SymbolMap from './SymbolMap';
// 聚合图层及散点图层
//
import ResourceConfig from './ResourceConfig';
const componentBase = (G as any).base.ComponentBase;
const appEvents = (G as any).misc.AppEvents;
const component = componentBase.extend({
    // 属性
    options: {
        TYPE: null, // 大类 如'yjxx'或'czt'或'yjzy'（预警信息，承灾体，应急资源）
        type: null, // 具体的资源类型
        clusterFlag: null,
        map: null,
        service: null,
        eventInfo: null,
        clusterlevel: 11,
        vilagelevel: 8,
        symbolConfig: null,
        pictureMarkerSymbol: {
            //
        },
        cacheData: {},
        typeList: {}, // 当前已加载的小类集合
        config: null, // 当前小类对应的config
        popupId: 'ClusterDistribute_popup', // 弹窗唯一标识
        currentPopupId: '',
        highLightId: 'ClusterDistribute_hl', // 高亮id
        fireAddPopupEventId: 'ClusterDistribute_popupEvent', // 添加弹窗后执行事件id
        clickHighlightId: '',
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.service = options.normalResourceServer;
        this._initEvents();
        this._initLayers();
        this.addListeners();
    },

    addListeners() {
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery) {
            this.options.nearbyQuery.on('load', this._onNearByLoad, this);
            this.options.nearbyQuery.on('unload', this._onNearByUnLoad, this);
        }
    },
    removeListeners() {
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery) {
            this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
        }
    },
    _initLayers() {
        this.provincelayer = new g2.carto.ElementLayer({
            id: 'province_clusterlayer',
            name: 'province_clusterlayer',
            map: this.map,
        });
        this.map.addLayer(this.provincelayer);
        this.citylayer = new g2.carto.ElementLayer({
            id: 'city_clusterlayer',
            name: 'city_clusterlayer',
            map: this.map,
        });
        this.map.addLayer(this.citylayer);
    },
    _initEvents() {
        const self = this;
        this.resolutionchanged_event = () => {
            const level = self.map.getZoomLevel();
            if (level <= self.options.vilagelevel) {
                self.citylayer.setVisible(false);
                self.provincelayer.setVisible(true);
                this.options.simpleRenderMgr.setVisible('distribute_' + self.options.type, false);
            } else if (level >= self.options.clusterlevel) {
                self.citylayer.setVisible(false);
                self.provincelayer.setVisible(false);
                this.options.simpleRenderMgr.setVisible('distribute_' + self.options.type, true);
            } else {
                self.citylayer.setVisible(true);
                self.provincelayer.setVisible(false);
                this.options.simpleRenderMgr.setVisible('distribute_' + self.options.type, false);
            }
        };
        this.click_event = (button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) => {
            let ele = self.provincelayer.hitTest(screenX, screenY);
            if (!!ele) {
                self.map.pan(ele.element.geometry);
                self.map.zoomTo(9);
            } else {
                ele = self.citylayer.hitTest(screenX, screenY);
                if (!!ele) {
                    self.map.pan(ele.element.geometry);
                    self.map.zoomTo(12);
                }
            }
        };
    },
    _bindEvents(type: string) {
        switch (type) {
            default:
                if (this.resolutionchanged_event) {
                    this.map.on('resolutionchanged', this.resolutionchanged_event);
                }
            case 'click':
                this.map.on('click', this.click_event);
                break;
        }
    },
    _unbindEvents() {
        if (this.resolutionchanged_event) {
            this.map.un('resolutionchanged', this.resolutionchanged_event);
        }
        if (this.click_event) {
            this.map.un('click', this.click_event);
        }
    },
    //   /*   /**
    //      * 统一设置simplerender的可见不可见
    //      * @param flag {Boolean} true/false
    //      */
    //     _simpleRenderMgrSetVisible(flag: boolean) {
    //         Object.keys(this.options.typeList).map((key, item) => {// 清除simpleRenderMgr已加载过的所有类型
    //             this.options.simpleRenderMgr.setVisible(key, flag);
    //         });
    //     }, */
    /**
     * 加载数据
     * @param TYPE {String} 大类，如'yujing'或'chengzaiti'或'yingjiziyuan'（预警信息，承灾体，应急资源）
     * @param key {String} 类型，如：'11B11'或'RescueTeam※01'
     * @param data {Array} 数据列表
     * @param geoFilter {Boolean} 是否有几何筛选条件
     * @param opts 配置
     */
    add(TYPE: string, key: string, data: any, geoFilter: boolean, opts: any) {
        const self = this;
        this.provincelayer.clear();
        this.citylayer.clear();
        this._unbindEvents();
        this.options.config = {};
        this.options.TYPE = TYPE;
        this.options.geoFilter = geoFilter;
        this.options.type = key;
        this.options.typeList[key] = key;
        const alldataList = data;
        const tempResourceConfig: any = ResourceConfig;
        let currentConfig: any = null;
        if (tempResourceConfig[TYPE][key]) {
            this.options.config[key] = tempResourceConfig[TYPE][key];
            currentConfig = this.options.config[key];
        } else {
            if (TYPE === 'yujing') {
                this.options.config.yujing = tempResourceConfig.yujing.yujing_default;
                currentConfig = this.options.config.yujing;
            }
        }
        if ((this.options.geoFilter && TYPE !== 'yujing')) {// 有几何过滤条件时，只加散点（预警全部走聚合）
            this.options.cacheData[key] = {
                cityData: null,
                provinceData: null,
                allData: alldataList,
            };
            this.addDistributePointOnMap(key, alldataList, currentConfig, TYPE);
            this._bindEvents('click');
        } else {
            // 分布展示方式：1 = 简单打点, 2 = 像素聚合 3 = 行政区划下钻  4 = 热力图
            switch (currentConfig.dType) {
                case 1:
                    this.options.cacheData[key] = {
                        cityData: null,
                        provinceData: null,
                        allData: alldataList,
                    };
                    this.addDistributePointOnMap(key, alldataList, currentConfig, TYPE);
                    this._bindEvents('click');
                    break;
                case 2:
                    this.options.cacheData[key] = {
                        cityData: null,
                        provinceData: null,
                        allData: alldataList,
                    };
                    this.addPixelClusterOnMap(key, alldataList, currentConfig);
                    break;
                case 3:
                    this.map.fullExtent();
                    if (opts && opts.clusterlevel) {
                        this.options.clusterlevel = opts.clusterlevel;
                    }
                    if (opts && opts.vilagelevel) {
                        this.options.vilagelevel = opts.vilagelevel;
                    }
                    // this._transData(alldataList).then((res: any) => {
                    //     self.options.cacheData[key] = {
                    //         cityData: res.cityData,
                    //         provinceData: res.provinceData,
                    //         allData: alldataList,
                    //     };
                    //     self.addProvinceOnMap(self.options.cacheData[key].provinceData);
                    //     self.addCityOnMap(self.options.cacheData[key].cityData);
                    //     self.addDistributePointOnMap(key, self.options.cacheData[key].allData, currentConfig, TYPE);
                    //     this._bindEvents('all');
                    // });
                    break;
                case 4:
                    // TODO
                    console.log('TODO');
                    break;
            }
        }

    },
    load() {
        componentBase.prototype.load.call(self);
    },
    unload() {
        this.clear();
        this._unbindEvents();
        // this.removeListeners();
        componentBase.prototype.unload.call(this);
    },
    _transData(alldataList: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.options.normalResourceServer.queryCity().then((data: any) => {
                const cityData = data;
                const cityDataArr = [];
                for (const k of Object.keys(data)) {
                    cityDataArr.push(data[k].tag.DISTRICTCODE);
                }
                const dataCount = self.districtStatistics(alldataList, cityDataArr);
                const provinceDataCount = dataCount.dest;
                const provinceDataStr = JSON.stringify(
                    EMapServerV2.provinceDistrictData.province,
                );
                const provinceData = JSON.parse(provinceDataStr);
                for (const i of Object.keys(provinceDataCount)) {
                    for (const j in provinceData) {
                        if (provinceDataCount[i].districtcode === provinceData[j].code) {
                            provinceData[j].count = provinceDataCount[i].count;
                        }
                    }
                }
                // 去除统计结果为0的
                const dataResult = [];
                for (const k in provinceData) {
                    if (provinceData[k].count !== 0) {
                        dataResult.push(provinceData[k]);
                    }
                }
                // 查询城市
                const cityDataCount = dataCount.citydest;
                for (const l of Object.keys(cityDataCount)) {
                    for (const m in cityData) {
                        if (cityDataCount[l].districtcode === cityData[m].tag.DISTRICTCODE) {
                            cityData[m].count = cityDataCount[l].count;
                        }
                    }
                }
                // 去除统计结果为0的
                const dataResultCity = [];
                for (const n in cityData) {
                    if (cityData[n].count && cityData[n].count !== 0) {
                        dataResultCity.push(cityData[n]);
                    }
                }
                const returnData = {
                    provinceData: dataResult,
                    cityData: dataResultCity,
                };
                resolve(returnData);
            });
        });
    },
    addPixelClusterOnMap(key: string, dataCol: any, config: any) {
        //
    },
    addProvinceOnMap(dataArr: any) {
        const layer = this.provincelayer;
        const level = this.map.getZoomLevel();
        if (level <= this.options.vilagelevel) {
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
        layer.clear();
        const elements = [];
        for (const i of Object.keys(dataArr)) {
            const point = new g2.sfs.Point({
                x: parseFloat(dataArr[i].lng),
                y: parseFloat(dataArr[i].lat),
                spatialReference: this.map.spatialReference,
            });
            const value = dataArr[i].count;
            const symbol = this._getCurrencySymbol('circle', value, { size: 16 });
            const ele = new g2.sfs.Element({
                geometry: point,
                symbol,
            });
            elements.push(ele);
        }
        layer.addElements(elements);
    },
    addCityOnMap(dataArr: any) {
        const layer = this.citylayer;
        const level = this.map.getZoomLevel();
        if (level < this.options.clusterlevel && level > this.options.vilagelevel) {
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
        layer.clear();
        const elements: any = [];
        for (const i of dataArr) {
            const point = new g2.sfs.Point({
                x: parseFloat(i.tag.LONGITUDE),
                y: parseFloat(i.tag.LATITUDE),
                spatialReference: this.map.spatialReference,
            });
            const value = i.count;
            const symbol = this._getCurrencySymbol('circle', value, { size: 16 });
            const ele = new g2.sfs.Element({
                geometry: point,
                symbol,
            });
            elements.push(ele);
        }
        layer.addElements(elements);
    },
    /*     _getRescueTeamLevelSymbolConfig(level: any) {
            let symbolConfig = null;
            switch (level) {
                case 1:
                    symbolConfig = {
                        offsetXX: 19,
                        offsetYY: 28,
                        fontSize: 16,
                        width: 38,
                        height: 56,
                        offsetX: 19,
                        offsetY: 56,
                    };
                    break;
                case 2:
                    symbolConfig = {
                        offsetXX: 22,
                        offsetYY: 33,
                        fontSize: 17,
                        width: 45,
                        height: 66,
                        offsetX: 22,
                        offsetY: 66,
                    };
                    break;
                case 3:
                    symbolConfig = {
                        offsetXX: 25,
                        offsetYY: 37,
                        fontSize: 18,
                        width: 51,
                        height: 74,
                        offsetX: 25,
                        offsetY: 74,
                    };
                    break;
                case 4:
                    symbolConfig = {
                        offsetXX: 29,
                        offsetYY: 42,
                        fontSize: 19,
                        width: 59,
                        height: 85,
                        offsetX: 29,
                        offsetY: 85,
                    };
                    break;
            }
            return symbolConfig;
        }, */
    addDistributePointOnMap(key: string, dataCol: any, config: any, TYPE: string) {
        const self = this;
        this.options.simpleRenderMgr.remove('distribute_' + key);
        let symbolMapper: any = null;
        if (SymbolMap[key]) {
            symbolMapper = SymbolMap[key];
        } else {
            symbolMapper = SymbolMap.default;
        }
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                let symbol = null;
                let source;
                let symbolObj: any = null;
                switch (config.symbolType) {
                    case 1: // 简单图标
                        symbolObj = Util.toJSON(symbolMapper.symbol);
                        symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn(key, data)];
                        symbol = new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
                        if (!symbolObj.options.source) {
                            source = self.options.symbolConfig.icons.markPoint;
                            symbol = new g2.sfs.PictureMarkerSymbol({
                                source,
                                width: 34,
                                height: 46,
                                rotation: 0,
                                opacity: 1,
                                offsetX: 17,
                                offsetY: 23,
                            });
                        }
                        break;
                    case 2: // 图标 +文字
                        symbolMapper = SymbolMap.rescueteam;
                        const code = key.split('※')[0];
                        const codes = key.split('_')[0];
                        const text = G.utils.CommonUtil.replacePlaceHolder(data, config.text);
                        if (code === 'RescueTeam') {
                            const symbolList = symbolMapper.symbol(code, codes, text);
                            symbolList[0].options.source = self.options.symbolConfig.icons[symbolMapper.iconFn(code, codes, text)];
                            symbolList[1].options.text = text;
                            const picSymbol = new (G as any).utils.RenderUtil.object2Symbol(symbolList[0]);
                            const textSymbol = new (G as any).utils.RenderUtil.object2Symbol(symbolList[1]);
                            symbol = new g2.sfs.CurrencySymbol({
                                markerSymbol: picSymbol,
                                textSymbol,
                            });
                        }
                        break;
                    case 3: // 分级图标
                        symbolMapper = SymbolMap.yujing;
                        symbolObj = Util.toJSON(symbolMapper.symbol);
                        symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn(key, data)];
                        if (!symbolObj.options.source) {
                            symbolMapper = SymbolMap.yujingunknown;
                            symbolObj = Util.toJSON(symbolMapper.symbol);
                            symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn(key, data)];
                        }
                        symbol = new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
                        break;
                }
                return symbol;
            },
        });
        let fieldConfig = null;
        if (config.idField && config.geometryField) {
            fieldConfig = {
                idField: config.idField,
                geometryField: config.geometryField,
            };
        } else {
            fieldConfig = {
                idField: '_id',
                geometryField: ['geom'],
            };
        }
        const opts = {
            featureType: 'distribute_' + key,
            featureName: 'distribute_' + key,
            idField: fieldConfig.idField,
            list: dataCol,
            type: 0,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: fieldConfig.geometryField,
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                click: (data: any) => {
                    self.locateCenter(key, config, data[0].elementId, data[0].element, TYPE);
                },
            },
        };
        this.options.simpleRenderMgr.add(opts);
        const level = this.map.getZoomLevel();
        if (!this.options.geoFilter && level < this.options.clusterlevel && config.dType === 3) {
            this.options.simpleRenderMgr.setVisible('distribute_' + this.options.type, false);
        }
    },

    _onNearByLoad() {
        // console.log('监听周边查询加载！');
        this.options.popupManager.remove(this.options.currentPopupId);
        this.citylayer.setVisible(false);
        this.provincelayer.setVisible(false);
        this._unbindEvents();
        Object.keys(this.options.typeList).map((key, item) => {// 已加载过的所有类型
            this.options.simpleRenderMgr.setVisible('distribute_' + key, false);
        });
    },
    _onNearByUnLoad() {
        // console.log('监听周边查询卸载！');
        this._bindEvents('all');
        this.map.zoomOut();
        this.map.zoomIn();
        // for (const featureType of Object.keys(this.featureTypeSet)) {
        //   this.simpleRenderMgr.setVisible(featureType, true);
        // }
        this._clearHighLight();
    },
    // 行政区划统计
    districtStatistics(data: any, cityDataArr: any) {
        // 拆分数据类型
        const maps: any = {};
        const dest: any = [];
        const citydest: any = [];
        if (!!data) {
            for (const i of data) {
                const ai = i;
                let distField = 'districtcode';
                if (this.options.TYPE !== 'yujing') {// 预警的行政区划字段是districtcode，其他是DISTRICT
                    distField = 'DISTRICT';
                }
                if (!!ai[distField]) {
                    const district = ai[distField].substring(0, 2) + '0000'; // 省
                    let citydistrict = ai[distField].substring(0, 4) + '00'; // 市
                    if (cityDataArr.indexOf(ai[distField]) !== -1) {
                        citydistrict = ai[distField];
                    }
                    if (!maps[district]) {
                        dest.push({
                            districtcode: district,
                            count: 1,
                        });
                        maps[district] = ai;
                    } else {
                        for (const j of dest) {
                            const dj = j;
                            const dis = ai[distField].substring(0, 2) + '0000';
                            if (dj.districtcode.substring(0, 2) + '0000' === dis) {
                                dj.count++;
                                break;
                            }
                        }
                    }
                    if (!maps[citydistrict]) {
                        citydest.push({
                            districtcode: citydistrict,
                            count: 1,
                        });
                        maps[citydistrict] = ai;
                    } else {
                        for (const j of citydest) {
                            const dj = j;
                            // const citydistrict=ai.DISTRICT.substring(0,4)+"00";
                            // if(dj.DISTRICT.indexOf('0000')!=-1)
                            // {
                            //     dj.DISTRICT=dj.DISTRICT.substring(0,2)+"0100";
                            // }
                            if (dj.districtcode.substring(0, 4) + '00' === citydistrict) {
                                dj.count++;
                                break;
                            } else if (dj.districtcode === citydistrict) {
                                dj.count++;
                                break;
                            }
                        }
                    }
                }
            }
        }
        const alldest = {
            dest,
            citydest,
        };
        // 分好的组
        return alldest;
    },
    /**
     * 复合符号
     * @param type 圆还是图标 circle/picture
     * @param value 显示的文字内容
     * @param opts 图标相关参数
     */
    _getCurrencySymbol(type: string, value: any, opts: any) {
        let symbol = null;
        switch (type) {
            case 'circle':
                symbol = new g2.sfs.SimpleMarkerSymbol({
                    offsetX: 0,
                    offsetY: 0,
                    fillColor: new g2.sfs.Color({ a: 150, r: 200, g: 0, b: 0 }),
                    borderColor: new g2.sfs.Color({ a: 150, r: 200, g: 0, b: 0 }),
                    borderThickness: 4,
                    size: opts.size,
                });
                break;
            case 'picture':
                symbol = new g2.sfs.PictureMarkerSymbol({
                    offsetX: opts.offsetX,
                    offsetY: opts.offsetY,
                    source: opts.source,
                    width: opts.width || 50,
                    height: opts.height || 50,
                    scale: 1,
                });
                break;
        }
        const textSymbol = new g2.sfs.TextSymbol({
            text: value + '',
            borderColor: new g2.sfs.Color({ a: 255, r: 255, g: 255, b: 255 }),
            borderThickness: 1,
            fontSize: opts.fontSize,
            fontWeight: 'bold',
            fontFamilyName: '宋体',
            foreground: new g2.sfs.Color({ a: 255, r: 255, g: 255, b: 255 }),
            offsetX: 0,
            offsetY: -(opts.offsetYY * 1.2) || 0,
        });
        const currencySymbol = new g2.sfs.CurrencySymbol({
            markerSymbol: symbol,
            textSymbol,
        });
        return currencySymbol;
    },
    locateCenter(type: string, config: any, id: string, ele: any, TYPE: string) {
        this.options.cacheData[type].allData.forEach((item: any) => {
            let idField = '_id';
            if (config.idField) {
                idField = 'id';
            }
            if (item[idField] === id) {
                // this.options.featureLocate.fit({
                //     type: 'wkt',
                //     geom: 'POINT(' + ele.geometry.x + ' ' + ele.geometry.y + ')',
                // });
                this.clearPopup();
                this.addPopup(ele, item, type, TYPE, 300);
                if (config.blinkOnClick) {
                    const opts: any = {
                        type,
                        config,
                        coords: [ele.geometry.x, ele.geometry.y],
                        signallevel: item.signallevel,
                    };
                    if (type.split('※')[0]) {
                        const text = G.utils.CommonUtil.replacePlaceHolder(item, config.text);
                        opts.NUM = parseFloat(text);
                    }
                    this._showHighlight(opts, item);
                }
            }
        });
    },
    addPopup(ele: any, item: any, type: any, TYPE: string, autoPanTimeout: any) {
        const self = this;
        if (TYPE === 'yujing') {
            type = 'earlyWarning';
        }
        this.getDetailInfo(type, item).then((data: any) => {
            this.options.currentPopupId = this.options.popupId + '_' + type;
            this.options.popupManager.clear();
            this.options.popupManager.addSimple({
                id: this.options.currentPopupId,
                anchor: [ele.geometry.x, ele.geometry.y],
                className: '',
                autoPanTimeout: autoPanTimeout || 1200,
            }).then((content: any) => {
                // const attrObj = Util.attributeSet2Object(item);
                self.fire(self.options.fireAddPopupEventId, {
                    type,
                    isEventBtn: true,
                    data,
                    content,
                });
            });
        });
    },
    getDetailInfo(key: string, item: any) {
        return new Promise((resolve, reject) => {
            if (key === 'earlyWarning') {
                resolve(item);
            }
            const opt = {
                resourceKey: key,
                id: item._id,
            };
            this.service.getDetailInfo(opt).then((res: any) => {
                resolve(res);
            });
        });
    },
    getConfig(type: string) {
        let config = this.options.config.yujing;
        if (this.options.config[type]) {
            config = this.options.config[type];
        }
        return config;
    },
    showHighlight(ele: any, item: any, type: string) {
        const config = this.getConfig(type);
        if (config.blinkOnClick) {
            const opts: any = {
                type,
                config,
                coords: [ele.geometry.x, ele.geometry.y],
                signallevel: item.signallevel,
            };
            if (type.split('※')[0]) {
                const text = G.utils.CommonUtil.replacePlaceHolder(item, config.text);
                opts.NUM = parseFloat(text);
            }
            this._showHighlight(opts, item);
        }
    },
    _showHighlight(opts: any, data: any) {
        let source = null;
        let symbolMapper: any = null;
        let symbolObj: any = null;
        if (SymbolMap[opts.type]) {
            symbolMapper = SymbolMap[opts.type];
        } else {
            symbolMapper = SymbolMap.default;
        }
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + opts.coords[0] + ' ' + opts.coords[1] + ')',
            },
            style: {},
            blink: {
                enable: false,
            },
        };
        const config = this.options.config[opts.type];
        if (opts.signallevel) {
            symbolMapper = SymbolMap.yujing;
            symbolObj = Util.toJSON(symbolMapper.hlSymbol);
            source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(opts.type, data)];
            symbolObj.options.source = source;
            options.style = symbolObj;
        } else {
            if (opts.NUM) {// 救援队，有人数
                // let symbolConfig: any = {};
                symbolMapper = SymbolMap.rescueteam;
                const typeCode = opts.type;
                const codes = opts.type.split('_')[0];
                const hlsymbolObj = Util.toJSON(symbolMapper.hlSymbol(typeCode, codes, opts.NUM));
                source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(typeCode, codes, opts.NUM)];
                /*  const result = this._getRescueTeamSymbol(opts.NUM, typeCode, codes, 'RescueTeam');
                                symbolConfig = result.symbolConfig;
                                typeCode = result.typeCode;
                                const redcount = '';
                                source = this.options.symbolConfig.icons[redcount + typeCode + '_img_hover']; */
                hlsymbolObj.options.source = source;
                options.style = hlsymbolObj;
            } else {
                symbolObj = Util.toJSON(symbolMapper.hlSymbol);
                source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(opts.type, data)];
                symbolObj.options.source = source;
                options.style = symbolObj;
            }
        }
        if (source) {
            this.options.clickHighlightId = opts.type;
            this.options.featureHighlight.addHighlight(opts.type, options);
        }
        /*  if (!source) {
             source = this.options.symbolConfig.icons.markPoint;
             const tmpconfig = {
                 width: 34,
                 height: 46,
                 offsetX: '17',
                 offsetY: '23',
                 opacity: '1',
                 rotation: '0',
                 source,
             };
             options.style.options = tmpconfig;
         } */
    },
    _clearHighLight() {
        this.options.featureHighlight.removeHighlight(this.options.clickHighlightId);
    },
    locateToPoint(coords: any, level?: number) {
        if (!level) {
            level = 15;
        }
        if (G.utils.CoordUtil.withinChina(coords, 4326)) {
            this.options.featureLocate.fit({
                type: 'wkt',
                geom: 'POINT(' + coords[0] + ' ' + coords[1] + ')',
            }, { maxZoom: level });
        } else {
            console.warn('坐标错误:' + JSON.stringify(coords));
        }
    },
    /*     _getRescueTeamSymbol(text: string, typeCode: string, codes: string, type: string) {
            let symbolMapper: any = null;
            if (SymbolMap[type]) {
                symbolMapper = SymbolMap[type];
            } else {
                symbolMapper = SymbolMap.default;
            }
            let symbolConfig: any = {};
            const TOTALPERNUM = parseFloat(text);
            if (TOTALPERNUM) {
                if (TOTALPERNUM < 100) {
                    typeCode = codes + '_one';
                    symbolConfig = this._getRescueTeamLevelSymbolConfig(1);
                } else if (TOTALPERNUM >= 100 && TOTALPERNUM < 500) {
                    typeCode = codes + '_two';
                    symbolConfig = this._getRescueTeamLevelSymbolConfig(2);
                } else if (TOTALPERNUM >= 500 && TOTALPERNUM < 1000) {
                    typeCode = codes + '_three';
                    symbolConfig = this._getRescueTeamLevelSymbolConfig(3);
                } else if (TOTALPERNUM >= 1000) {
                    typeCode = codes + '_four';
                    symbolConfig = this._getRescueTeamLevelSymbolConfig(4);
                }
            } else {
                typeCode = codes + '_one';
                symbolConfig = this._getRescueTeamLevelSymbolConfig(1);
            }
            return { symbolConfig, typeCode };
        }, */
    clearLayers() {
        this.citylayer.clear();
        this.provincelayer.clear();
        Object.keys(this.options.typeList).map((key, item) => {// 清除simpleRenderMgr已加载过的所有类型
            this.options.simpleRenderMgr.remove('distribute_' + key);
        });
        this.options.typeList = {};
    },
    clearPopup() {
        this.options.popupManager.remove(this.options.currentPopupId);
        this._clearHighLight();
    },
    clearByType(type: string) {
        this.citylayer.clear();
        this.provincelayer.clear();
        Object.keys(this.options.typeList).map((key, item) => {// 清除simpleRenderMgr已加载过的所有类型
            if (key === type) {
                this.options.simpleRenderMgr.remove('distribute_' + key);
                delete this.options.typeList[type];
            }
        });
        this.clearPopupByType(type);
    },
    clearPopupByType(type: string) {
        this.options.popupManager.remove(this.options.popupId + '_' + type);
        this.options.featureHighlight.removeHighlight(type);
    },
    clear() {
        this.options.type = null;
        this.options.TYPE = null;
        this.options.cacheData = {};
        this.options.clusterlevel = 11;
        this.options.vilagelevel = 8;
        this.clearLayers();
        this.clearPopup();
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
});

export default component;
