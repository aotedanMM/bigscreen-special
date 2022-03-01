// 模块的GIS逻辑
import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        service: null,
        simpleRenderMgr: null,
        bufferDraw: null,
        popupManager: null,
        PointGeometryBuilder: null,
        symbolConfig: null,
        featureTypePrefix: 'nearby_',
        targetFeatureType: 'nearby_target_feature',
        popupId: 'nearby-popup',
        popupEventName: 'popup',
        highlightId: 'nearby-highlight',
        query: {
            bufferRadius: 3000,
            resourceKeys: [
                'bas_school',
                'hospital',
                'government',
                'market',
                'bazaar',
                'Gymnasium',
                'tourist',
                'culturalvenues',
                'powerfacilities',
                'supwatfacil',
                'powerfacil',
                'gasfacil',
                'sluice',
                'gasstation',
                'floodteam',
                'fireteam',
                'transportationteam',
                'forestfireteam',
                'hazardousteam',
                'mineteam',
                'nonmineteam',
                'corecompetenceteam',
                'transportationteam',
                'powerteam',
                'mobileteam',
                'gasteam',
                'environmentteam',
                'salvageteam',
                'searescueteam',
                'shipspillteam',
                'healthyteam',
                'portrescueteam',
                'portpassengerteam',
                'portconstructionteam',
                'buildingemergencyteam',
                'passengeremergencyteam',
                'emergencytransportteam',
                'snowteam',
                'equipteam',
                'civilianteam',
                'shelter',
            ],
        },
        riskQuery: {
            bufferRadius: 3000,
            resourceKeys: [
                'bas_school',
                'hospital',
                'government',
                'market',
                'bazaar',
                'Gymnasium',
                'tourist',
                'culturalvenues',
                'powerfacilities',
                'supwatfacil',
                'powerfacil',
                'gasfacil',
                'sluice',
                'gasstation',
                'floodteam',
                'fireteam',
                'transportationteam',
                'forestfireteam',
                'hazardousteam',
                'mineteam',
                'nonmineteam',
                'corecompetenceteam',
                'transportationteam',
                'powerteam',
                'mobileteam',
                'gasteam',
                'environmentteam',
                'salvageteam',
                'searescueteam',
                'shipspillteam',
                'healthyteam',
                'portrescueteam',
                'portpassengerteam',
                'portconstructionteam',
                'buildingemergencyteam',
                'passengeremergencyteam',
                'emergencytransportteam',
                'snowteam',
                'equipteam',
                'civilianteam',
                'shelter',
            ],
        },
        defenceQuery: {
            bufferRadius: 3000,
            resourceKeys: [
                'floodteam',
                'fireteam',
                'transportationteam',
                'forestfireteam',
                'hazardousteam',
                'mineteam',
                'nonmineteam',
                'corecompetenceteam',
                'transportationteam',
                'powerteam',
                'mobileteam',
                'gasteam',
                'environmentteam',
                'salvageteam',
                'searescueteam',
                'shipspillteam',
                'healthyteam',
                'portrescueteam',
                'portpassengerteam',
                'portconstructionteam',
                'buildingemergencyteam',
                'passengeremergencyteam',
                'emergencytransportteam',
                'snowteam',
                'equipteam',
                'civilianteam',
                'shelter',
            ],
        },
        resourceSymbolMap: {
            'RescueTeam※03': SymbolMap.RESCUETEAM,
            'DisasterPer※01': SymbolMap.DISASTERPER,
            'default': SymbolMap.DEFAULT,
        },
        defence: [
            'portwharf', // 港口码头
            'bas_school', // 学校
            'hospital', // 医院
            'culturalrelicunit', // 文物保护单位
            'Hotel※00',
            'hotel', // 宾馆
            'airport', // 机场
            'railwaystation', // 火车站
            'coachstation', // 汽车站
            'government※00',
            'government', // 政府机关
            'archives', // 档案馆
            'Newscast※00',
            'tvcast', // 电视台
            'newscast', // 广播电台
            'Resins※00',
            'researchinstitution', // 国防科研
            'Resins※02', // 科研单位
            'financialins', // 银行金融机构
            'market', // 大型商贸
            'bazaar', // 集贸市场
            'Gymnasium', // 大型文化体育场所
            'tourist', // 旅游景区
            'culturalvenues', // 文化场馆
            'gasfacil', // 大型能源动力设施
            'powerfacil', // 燃气供应设施
            'supwatfacil', // 供水设施
            'Powerfacilities※00',
            'powerfacilities', // 供电设施
            'Communication※01', // 通讯社
            'sluice', // 水闸
            'ocepasture', // 海阳牧场
            'farm',
            'gasstation',
        ],
        risk: [
            'NAH_GEO_GEOLOGICHAZ_P※01', // 地质隐患
            'mountaincollapse',
            'landslide',
            'debrisflow',
            'miningcollapse',
            'bottomcollapse',
            'ANJIAN_DAGCHEMENT※DangerousChemical', // 危化企业
            'productionindustry',
            'runeddustry',
            'useddustry',
            'otherdustry',

            'majordanger', // 危险源
            'tailingpond', // 尾矿库
            'firework', // 烟花爆竹企业
            'metalnonmetal',
            'coal',
            'ANJIAN_ENT_WHSMYHBZ※01',
            'metallurgical',
            'nonferrous',
            'mechanical',
            'dust',
            'refrigeration',
        ],
        bufferId: 'nearbyByQuery',
        // 缓冲参数
        drag: {
            visible: true,
            style: {
                type: 'PictureMarkerSymbol',
                options: {
                    source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzdCRTQ5OTYzRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzdCRTQ5OTczRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDN0JFNDk5NDNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDN0JFNDk5NTNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpA7b9wAAAPDSURBVHjarFZbTxNREJ7d7ba7lbaAgqBUMETEW9OggCYiYIyKJhp+gA/6B4wPhGhMjET9CaivXggxXogkaqLxQXxofCCKFRSjQohRgZa2WLbXXWfWs02tB2ONk3xJe2Z25pvvzDm7Ql9fH3BMQEigaeWQTu8Cw9iB/0sQ1fA3ZhgGCMIs/gojXiGeg8czzwu1cQrbIJWqhETiOOj6YX9LS+X6hga3Q1Gk0rIyB/ylLcZiqaV4PPN5evr7i5GROYhEhpDUFSQS/qVgngJUXIFkcgsWP9dx4IC/pa2t2m63S8bPrqBoEwQzKT5pvHj27Mvj4eGXuHYKSUwWKkBxKmQyjVj8Uld397amnTurdF2HbDYL/8GE5ra2NStcLnloYKAfotFjSOJLPgHZ3F9NO7m3q2uzv7W1KpPJwH81bGaTz1eRTCS2PLx79yKunKBlkaEU9313jdfb3NrevjaLxal7Hvb1BE0U6yNkUE2cqaqtTU17UIUOi4AdUYkE9qCznDon2XkJ9veO5zX0u98yiuOSwLyU37d9+0qcqSMWAdUkoOt1NXV1nmw6bQYW4uDpt7kCDy5s4MbQumUUz4shdau9XjeGNFsEFEQZMnKqTqecpcErwKGz73OJh/vqgRdjgfyW0XOFftoGUZJErFWC2+CysQFUkIAoCoJAAcYfjpxe5KngxRtIRLbbRS2RUMTcMRTFBF4caYPtVT7unfXmHj56foorrQXyW0bPFfpZfiMWiWjgdoeIAFFMIoHw/Oxs3MDLgyft7TNrc4m7L8xwY2jdMornxZC2USouCNMkhmgWx5sTZHn6XTC4INtswFOBcKu36hdpC2EZxfH8lNeG+SffvAkhgadEgGZgCTEHDsfE2Oior76hwbOmtnYVXhjcWRjsqcwdw2J8OF5gk2UIzc1FR548mQRFGbJOASnwDfEVVDVwb2DgYyQcjuKQmHItd6kUA2qEiqeSyaWbV6++B0m6jA2HiIDU2dlJdTLmIEqSDanqrwMBtaa21rGyosJpsARFg3UtoeSKqkIkFIpc6+9/h1t9HUpK7rDGc++CBGLGvBUd+MYVxfjQ4GB8q9+/rtHnK3N7PKq7tFQ1ONIu+/YRRdDi8eRiNKqNjo8vjAYCnzD3DVT5Ptt2I5+Abg4iwAdEClnGaCiDExMbg2Nj61FHD8L9D6/jRWwmhJM3Bi7XI/xN+SPs5P32QUKLMUZiAbEaGU8h3Oy2lIq5f5iq1FTInK+fX0dLzLfsF5HOgpLsASfCweKEIghYc5VCaAzcK/SHAAMA4XIlf6DGCVoAAAAASUVORK5CYII=',
                    width: 32,
                    height: 20,
                    opacity: 1,
                    rotation: 0,
                },
            },
        },
        axis: {
            visible: true,
            style: {
                type: 'SimpleLineSymbol',
                options: {
                    color: {
                        a: 153,
                        r: 123,
                        g: 0,
                        b: 11,
                    },
                    style: 5,
                    width: 2,
                },
            },
        },
        label: {
            visible: true,
            position: 'center',
            style: {
                type: 'TextSymbol',
                options: {
                    text: '',
                    foreground: {
                        r: 255, g: 0, b: 0, a: 255,
                    },
                    borderColor: {
                        a: 150, r: 255, g: 255, b: 255,
                    },
                    borderThickness: 0,
                    fontSize: 20,
                    fontWeight: 500,
                    offsetX: 0,
                    offsetY: 0,
                },
            },
        },
        fill: {
            visible: true,
            style: {
                type: 'SimpleFillSymbol',
                options: {
                    borderColor: {
                        a: 255, r: 51, g: 255, b: 173,
                    },
                    fillColor: {
                        a: 38, r: 144, g: 247, b: 227,
                    },
                    style: 5,
                    borderThickness: 2,
                },
            },
        },
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
        this.featureTypeSet = {};
        // 查询
        this.queryId = null;
        // 保存当前缓冲的要素对象
        this.targetFeatureInfo = null;
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    /**
     * 加载
     * @param opts
     * @param opts.point {Array}
     * @param opts.radius {Number}
     */
    load(opts: any, key?: any) {
        this._getQueryParam(key);
        componentBase.prototype.load.call(this, opts);
        this._load(opts).then(() => {
            this._loadTargetFeature();
        });
    },
    unload() {
        this._clear();
        componentBase.prototype.unload.call(this);
    },

    /**
     * 设置当前缓冲的要素对象
     * @param featureInfo {Object}
     * @param featureInfo.type  类型标识，提供详情框使用
     * @param featureInfo.featureType 要素类型
     * @param featureInfo.data
     * @param featureInfo.symbol
     */
    setTargetFeature(featureInfo: any) {
        this.targetFeatureInfo = featureInfo;
    },

    addListeners() {
        this.options.simpleRenderMgr.on('click', this._onClick, this);
    },

    removeListeners() {
        this.options.simpleRenderMgr.off('click', this._onClick, this);
    },
    closePopup() {
        this._closePopup();
        this._clearHighlight();
    },
    // 绘制缓冲区域
    _load(opts: any) {
        this._setResourceVisible(false);
        return new Promise((resolve, reject) => {
            let radius: any = this.options.query.bufferRadius;
            if (opts && opts.radius) {
                radius = opts.radius;
            }
            const param = {
                id: this.options.bufferId,
                name: 'bufferPolygon',
                data: {
                    type: 'geojson',
                    geom: {
                        type: 'Point',
                        coordinates: opts.point,
                    },
                },
                buffer: {
                    radius,
                    callback: async (bufferGeom: any, queryRadius: any) => {
                        this._clearResult();
                        this._fit(bufferGeom);
                        const result = await this._query({
                            point: opts.point,
                            // radius: queryRadius,
                            geometry: bufferGeom,
                            resourceKeys: this.options.query.resourceKeys,
                        });
                        if (result) {
                            this._showReuslt(result.list);
                        }
                        resolve();
                    },
                    drag: this.options.drag,
                    axis: this.options.axis,
                    label: this.options.label,
                    fill: this.options.fill,
                    // 关闭按钮点击
                    onClose: () => {
                        this.fire('closeNearByClick');
                        this.unload();
                        this._setResourceVisible(true);
                    },
                },
            };
            this.options.bufferDraw.buffer(param);
        });
    },

    /**
     *
     * @param opts
     */
    _query(opts: any) {
        const resourceKeys = opts.resourceKeys;
        const resLen = resourceKeys.length;
        let counter = 0;
        const queryId = G.utils.CommonUtil.newUUID32();
        this.queryId = queryId;
        const self = this;
        const res: any = {
            list: [],
            total: 0,
        };
        return new Promise((resolve, reject) => {
            resourceKeys.forEach((element: any) => {
                const option = JSON.parse(JSON.stringify(opts));
                option.resourceKeys = [element];
                if (self.options.eventInfo && self.options.eventInfo.getPoint) {
                    // option.point = self.options.eventInfo.getPoint();
                }
                self.options.service.getNearbyListByGeometry(option).then((result: any) => {
                    counter++;
                    res.list.push(result.list[0]);
                    res.total += result.total;
                    if (self.isLoaded() && self.queryId === queryId && counter === resLen) { // 检查状态，防止多次查询结果冲突
                        resolve(res);
                    }
                }).catch((error: any) => {
                    reject(error);
                });
            });

        });
    },

    _fit(geometry: any) {
        const data = {
            type: 'geojson',
            geom: geometry,
        };
        this.options.featureLocate.fit(data);
    },

    _loadTargetFeature() {
        if (this.targetFeatureInfo) {
            const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
                build: (data: any) => {
                    return this.targetFeatureInfo.symbol;
                },
            });
            const opts = {
                featureType: this.options.targetFeatureType,
                featureName: '周边查询对象要素',
                idField: '_id',
                list: [this.targetFeatureInfo.data],
                type: 0,
                geometryBuilder: new this.options.PointGeometryBuilder({ geometryField: ['x', 'y'] }),
                symbolBuilder: new SymbolBuilder(),
                // listeners: {
                //     click: (event: any) => {
                //         this._closePopup();
                //         const element: any = event[0].element;
                //         this.options.popupManager.addSimple({
                //             id: this.options.popupId,
                //             anchor: [element.geometry.x, element.geometry.y],
                //             className: '',
                //         }).then((content: any) => {
                //             const data: any = Util.attributeSet2Object(element.attributeSet);
                //             const eventData: any = {
                //                 type: this.targetFeatureInfo.type,
                //                 featureType: this.targetFeatureInfo.featureType,
                //                 content,
                //                 data,
                //                 hideButtons: true,
                //             };
                //             console.debug(eventData);
                //             this.fire(this.options.popupEventName, eventData);
                //         });
                //     },
                // },
            };
            this.options.simpleRenderMgr.add(opts);
        }
    },

    _unloadTargetFeature() {
        // this.targetFeatureInfo = null;
        this.options.simpleRenderMgr.remove(this.options.targetFeatureType);
    },

    _clear() {
        this._clearResult();
        this.options.bufferDraw.removeBuffer(this.options.bufferId);
        this._unloadTargetFeature();
    },
    _clearResource() {
        const resource = this.options.simpleRenderMgr.featureTypeList.filter((itme: any) => {
            return itme.featureType.indexOf('resource_') !== -1;
        });
        resource.forEach((item: any) => {
            const featureType = item.featureType;
            this.options.simpleRenderMgr.remove(featureType);
        });
    },
    _setResourceVisible(bVisible: boolean) {
        const resource = this.options.simpleRenderMgr.featureTypeList.filter((itme: any) => {
            return itme.featureType.indexOf('resource_') !== -1;
        });
        resource.forEach((item: any) => {
            const featureType = item.featureType;
            this.options.simpleRenderMgr.setVisible(featureType, bVisible);
        });
    },
    _getQueryParam(key: any) {
        if (this.options.risk.indexOf(key) > -1) {
            this.options.query = this.options.riskQuery;
        } else if (this.options.defence.indexOf(key) > -1) {
            this.options.query = this.options.defenceQuery;
        } else {
            this.options.query = this.options.riskQuery;
        }
    },
    _clearResult() {
        for (const featureType of Object.keys(this.featureTypeSet)) {
            this.options.simpleRenderMgr.remove(featureType);
            delete this.featureTypeSet[featureType];
        }
        this._closePopup();
        this._clearHighlight();
        this._setResourceVisible(true);
    },
    _showReuslt(dataCol: any) {
        for (const item of dataCol) {
            this._showSingleResult(item);
        }
    },
    // 绘制数据点
    _showSingleResult(data: any) {
        const key: any = data.codeKey;
        const featureType: any = this.options.featureTypePrefix + key;
        const SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: (item: any) => {
                return this._getSymbol(item, key);
            },
        });
        const opts = {
            featureType,
            featureName: data.title,
            idField: '_id',
            list: data.data,
            type: 0,
            geometryBuilder: new this.options.PointGeometryBuilder({ geometryField: ['geom'] }),
            symbolBuilder: new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
        this.featureTypeSet[featureType] = {
            key,
        };
    },

    _onClick(result: any) {
        let count: any = 0;
        let targetFeature: any = null;
        for (const data of result.list) {
            //
            if (data.featureType === this.options.targetFeatureType) {
                targetFeature = data;
            }
            for (const key of Object.keys(this.featureTypeSet)) {
                if (key === data.featureType) {
                    count++;
                    const element: any = data.element;
                    const coordinates: any = [element.geometry.x, element.geometry.y];
                    this._closePopup();
                    this._openPopup(element, data.featureType);
                    this._addHighlight(coordinates, Util.attributeSet2Object(element.attributeSet), data.featureType);
                    break;
                }
            }
            if (count > 0) {
                break;
            }
        }
        if (count === 0 && targetFeature) { // 缓冲要素的点击事件处理
            this._closePopup();
            this._clearHighlight();
            const element: any = targetFeature.element;
            this.options.popupManager.addSimple({
                id: this.options.popupId,
                anchor: [element.geometry.x, element.geometry.y],
                className: '',
            }).then((content: any) => {
                const data: any = Util.attributeSet2Object(element.attributeSet);
                const eventData: any = {
                    type: this.targetFeatureInfo.type,
                    featureType: this.targetFeatureInfo.featureType,
                    content,
                    data,
                    hideButtons: true,
                };
                console.debug(eventData);
                this.fire(this.options.popupEventName, eventData);
            });
        }
    },
    _addHighlight(coordinate: any, data: any, featureType: any) {
        const key: any = this.featureTypeSet[featureType].key;
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
            },
            style: this._getHlSymbol(data, key),
            blink: {
                enable: false,
            },
        };
        this.options.featureHighlight.addHighlight(this.options.highlightId, options);
    },

    _clearHighlight() {
        this.options.featureHighlight.removeHighlight(this.options.highlightId);
    },

    _openPopup(element: any, featureType: any) {
        this.options.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [element.geometry.x, element.geometry.y],
            className: '',
        }).then((content: any) => {
            const data: any = Util.attributeSet2Object(element.attributeSet);
            const eventData: any = {
                type: 'Nearby' + this.featureTypeSet[featureType].key,
                content,
                data,
            };
            console.debug(eventData);
            this.fire(this.options.popupEventName, eventData);
        });
    },

    _closePopup() {
        this.options.popupManager.remove(this.options.popupId);
    },

    _getSymbol(data: any, key: any) {
        let symbolMapper: any = null;
        if (this.options.resourceSymbolMap[key]) {
            symbolMapper = this.options.resourceSymbolMap[key];
        } else {
            symbolMapper = this.options.resourceSymbolMap.default;
        }
        let symbolObj: any = Util.toJSON(symbolMapper.symbol);
        if (data.rescuetypecode && data.rescuetypecode === 'T004') { // 特殊处理森防国家
            symbolObj = Util.toJSON(symbolMapper.countrySymbol);
        }
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(key, data)];
        const symbol = G.utils.RenderUtil.object2Symbol(symbolObj);
        return symbol;
    },

    _getHlSymbol(data: any, key: any) {
        let symbolMapper: any = null;
        if (this.options.resourceSymbolMap[key]) {
            symbolMapper = this.options.resourceSymbolMap[key];
        } else {
            symbolMapper = this.options.resourceSymbolMap.default;
        }
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(key, data)];
        return symbolObj;
    },
});
export default component;
