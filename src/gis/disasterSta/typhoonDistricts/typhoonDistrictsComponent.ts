// 模块的GIS逻辑
import Util from '../../Util';
import SymbolMap from './SymbolMap';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        districtServer: null,
        map: null,
        simpleRenderMgr: null,
        featureHighlight: null,
        featureLocate: null,
        popupManager: null,
        symbolConfig: null,
        popupId: 'typhoondis_popup_id',
        highLightId: 'typhoondis_highlight_id',
        // 行政区划
        featureType: 'district_city_border',
        TooltipIdArray: [],
    },
    featureTypeSet: {
        district_city_border: {
            type: 'district_city_border',
            name: '区划边界',
        },
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
        this.map = options.map;
        this.toolTipWare = new g2.widget.TooltipWare({
            map: this.map,
        });
        this.districtList = [];
        this.currentHl = null;
        // 类型： 失联区域 Lost_zone_type  人员伤亡 Casualties_type  房屋损毁 Hous_damage_type 电力损毁 Power_damage_type
        this.type = null;
    },
    //  销毁
    destroy() {
        // dosth
        componentBase.prototype.destroy.call(this);
    },

    /**
     * 加载数据
     * @param opts
     * @param opts.type
     * @param opts.list
     */
    load(opts: any) {
        this.map.listen('resolutionchanged', this._mapResolutionchanged, this);
        this.type = null;
        this._clear();
        // 清空图层上的事件
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        componentBase.prototype.load.call(this);
        const self = this;
        return new Promise(async (resolve, reject) => {
            this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
            const point = this.options.eventInfo.getPoint();
            const optsTest = {
                location: point,
                level: '2',
            };
            let address = '';
            this.options.service.getDistrictByLonLat(optsTest).then((data: any) => {
                if (data.data && data.data.length > 0) {
                    address = data.data[0].name;
                }
            });
            const ranges = this.options.eventInfo.getRanges();
            // const point = this.options.eventInfo.getPoint();
            const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
            let geometry: any = null;
            const selectranges: any = {};
            // const self = this;
            switch (rangeType) {
                case '0': // 经验圈，取选中的
                    for (const item of ranges) {
                        geometry = item.geometry;
                        if (geometry.coordinates.length > 0) {
                            geometry = {
                                type: geometry.type,
                                coordinates: [geometry.coordinates[0]],
                            };
                        }
                    }
                    break;
                case '1': // 烈度圈，合并
                    geometry = null;
                    const geomArr = [];
                    const labelArr = [];
                    for (const range of ranges) {
                        selectranges[range.level + ''] = range.geometry;
                        geomArr.push(range.geometry);
                        labelArr.push(range.level + '');
                    }
                    geometry = G.utils.SpatialOPUtil.unionGeometry(geomArr);
                    //   levelArr = [labelArr.join(',')];
                    break;
            }
            if (opts && opts.geoms) {
                let finishCount = 0;
                let dataCol: any = [];
                const resultdata: any = {};
                const queryCallback = (dataObj: any, idx: any) => {
                    // for (const iitem of dataObj) {
                    //     iitem.level = idx;
                    // }
                    finishCount++;
                    resultdata[idx] = dataObj;
                    if (finishCount === opts.geoms.length) {
                        // 需要从高里面把中的排除，低里面把高的排除
                        const highids = [];
                        const highdata = resultdata.high;
                        for (const item of highdata) {
                            item.level = 'high';
                            highids.push(item.id);
                        }
                        const middledata = [];
                        for (const mitem of resultdata.middle) {
                            if (mitem.id && highids.indexOf(mitem.id) !== -1) {
                                // resultdata.middle.splice(highids.indexOf(mitem.id), 1);
                            } else {
                                mitem.level = 'middle';
                                middledata.push(mitem);
                            }
                        }
                        resultdata.middle = middledata;
                        const lowdata = [];
                        for (const mitem of resultdata.low) {
                            if (mitem.id && highids.indexOf(mitem.id) !== -1) {
                                // resultdata.low.splice(highids.indexOf(mitem.id), 1);
                            } else {
                                mitem.level = 'low';
                                lowdata.push(mitem);
                            }
                        }
                        resultdata.low = lowdata;
                        dataCol = resultdata.high.concat(resultdata.middle);
                        dataCol = dataCol.concat(resultdata.low);
                        self._showPolygon(dataCol);
                        self._showPolygonName(dataCol);
                        const result = resultdata.high.concat(resultdata.middle).concat(resultdata.low);
                        const flag = result.filter((res: any) => {
                            if ( res.name === '烟台市') {
                                return true;
                            }
                        });
                        if (flag.length > 0) {
                            self.loadStatics(point, opts.geoms).then((res: any) => {
                                resultdata.statics = res;
                                resultdata.centerpoint = point;
                                if (address !== '') {
                                    resultdata.centerpoint = address;
                                }
                                resolve(resultdata);
                            });
                        } else {
                            resultdata.centerpoint = point;
                            if (address !== '') {
                                resultdata.centerpoint = address;
                            }
                            resultdata.statics = {
                                citynum: 0,
                                countynum: 0,
                                provincenum: 0,
                                totalpeoplenum: 0,
                            };
                            resultdata.high = [];
                            resultdata.middle = [];
                            resultdata.low = [];
                            resolve(resultdata);
                        }
                    }
                };
                let index: any = 1;
                const typecodes: any = {
                    1: 'high',
                    2: 'middle',
                    3: 'low',
                };
                for (const item of opts.geoms) {
                    const indexTemp: any = index;
                    this.options.service
                        .getCities({
                            point,
                            geometry: item,
                        })
                        .then((data: any) => {
                          queryCallback(data, typecodes[indexTemp]);
                        }).catch( (error: any) => {
                            // TODO  fry
                            // queryCallback('error', typecodes[indexTemp]);
                        });
                    index++;
                }
            } else {
                // 改写为查询接口得到设置高中低风险后的数据
                this.options.service
                    .getCities({
                        point,
                        geometry,
                    })
                    .then((data: any) => {
                        const flag = data.filter((res: any) => {
                           if (res.shengname === '山东省' && res.name === '烟台市') {
                                return true;
                            } else {
                              return false;
                            }
                        });
                        if (flag.length < 0) {
                            data.centerpoint = point;
                            if (address !== '') {
                                data.centerpoint = address;
                            }
                            data.statics = {
                                citynum: 0,
                                countynum: 0,
                                provincenum: 0,
                                totalpeoplenum: 0,
                            };
                            data.high = [];
                            data.middle = [];
                            data.low = [];
                        }
                        resolve(data);
                        self._showPolygon(data);
                    });
            }
        });
    },
    loadStatics(point: any, geomArr: any) {
        return new Promise(async (resolve, reject) => {
            const tmpgeometry = G.utils.SpatialOPUtil.unionGeometry(geomArr);
            this.options.service
                .getProAndCitys({
                    point,
                    geometry: tmpgeometry,
                })
                .then((data: any) => {
                    resolve(data);
                });
        });
    },
    /**
     * 清除所有
     */
    unload() {
        this.type = null;
        this._clear();
        // 清空图层上的事件
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        this.map.off('resolutionchanged', this._mapResolutionchanged, this);
        componentBase.prototype.unload.call(this);
    },
    // 关闭信息框
    closePopup() {
        this.options.popupManager.remove(this.options.popupId);
        this._clearHighlight();
    },
    // 加载面数据
    _showPolygon(districts: any) {
        const self = this;
        this.options.simpleRenderMgr.remove(
            this.featureTypeSet.district_city_border.type,
        );
        const dataList = districts;
        this.districtList = districts;
        const borderColor = new (g2 as any).sfs.Color({
            r: 242,
            g: 255,
            b: 155,
            a: 255,
        });
        // if (this.map.getLayerById('basemap')) {
        //     borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        // } else if (this.map.getLayerById('tiandituLayer_img')) {
        //     borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 255, a: 153 });
        // } else if (this.map.getLayerById('tiandituLayer_vec')) {
        //     borderColor = new (g2 as any).sfs.Color({ r: 255, g: 55, b: 1, a: 255 });
        // } else if (this.map.getLayerById('tiandituLayer_ter')) {
        //     borderColor = new (g2 as any).sfs.Color({ r: 12, g: 0, b: 255, a: 255 });
        // }
        const symbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({
                r: 0,
                g: 255,
                b: 255,
                a: 30,
            }),
            opacity: 0.9,
            borderThickness: 2,
            style: 5,
        });
        const highsymbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({
                r: 231,
                g: 50,
                b: 32,
                a: 96,
            }),
            opacity: 0.5,
            borderThickness: 2,
            style: 5,
        });
        const middlesymbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({
                r: 255,
                g: 150,
                b: 48,
                a: 96,
            }),
            opacity: 0.5,
            borderThickness: 2,
            style: 5,
        });
        const lowsymbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({
                r: 253,
                g: 253,
                b: 87,
                a: 96,
            }),
            opacity: 0.5,
            borderThickness: 2,
            style: 5,
        });
        const updateSymbolObj = {
            borderColor: {
                a: 255,
                r: 255,
                g: 255,
                b: 196,
            },
            fillColor: {
                r: 255,
                g: 150,
                b: 48,
                a: 38,
            },
            opacity: 0.9,
            borderThickness: 4,
            style: 5,
        };
        const updateSymbolObj1 = {
            borderColor: {
                a: 0,
                r: 255,
                g: 255,
                b: 196,
            },
            fillColor: {
                r: 255,
                g: 150,
                b: 48,
                a: 0,
            },
            opacity: 0.9,
            borderThickness: 4,
            style: 5,
        };
        // const symbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', symbolObj);
        const updateSymbol = (G as any).utils.RenderUtil.object2Symbol(
            'SimpleFillSymbol',
            updateSymbolObj,
        );
        const updateSymbol1 = (G as any).utils.RenderUtil.object2Symbol(
            'SimpleFillSymbol',
            updateSymbolObj1,
        );
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                if (this.currrentDistrictData) {
                    if (this.currrentDistrictData.id === data.id) {
                        return updateSymbol;
                    } else {
                        return updateSymbol1;
                    }
                } else {
                    let tmpsymbol = symbol;
                    switch (data.level) {
                        case 'high':
                            tmpsymbol = highsymbol;
                            break;
                        case 'middle':
                            tmpsymbol = middlesymbol;
                            break;
                        case 'low':
                            tmpsymbol = lowsymbol;
                            break;
                    }
                    return tmpsymbol;
                }
            },
        });
        const opts = {
            featureType: this.featureTypeSet.district_city_border.type,
            featureName: this.featureTypeSet.district_city_border.name,
            idField: 'id',
            list: dataList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
                geometryType: 'Polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
        // 显示面数据的name名称
       // this._fitBounds();
    },
    // 面定位
    _locatePolygon(polygon: any) {
        if (polygon) {
            const center = polygon.getBaryCenter() || {};
            this.locatePoint(center.x, center.y);
        }
    },
    _fitPolygon(polygon: any) {
        if (polygon) {
            const geojson = polygon.asGeoJson();
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: geojson,
            });
        }
    },
    // 省行政区划图层点击统一处理
    _onLayerClick(features: any) {
        this.closePopup();
        let provinceFeature: any = null;
        const pointFeature: any = null;
        const list = features.list;
        for (const item of list) {
            if (item.featureType === this.options.featureType) {
                provinceFeature = item;
            }
        }
        // 优先实现点的点击识别事件
        if (provinceFeature) {
            // 省行政区划点击识别事件
            SymbolMap.default.hlSymbol.options.source = this.options.symbolConfig.icons[
                SymbolMap.default.iconHlFn('district_point_town')
            ];
            const symbolObj: any = Util.toJSON(SymbolMap.default.hlSymbol);
            // 清除高亮和弹出框
            this._clearClick();
            const featureObj: any = provinceFeature;
            // 行政区划定位
            const polygon = featureObj.element.geometry;
            // this._fitPolygon(polygon);
            // 点击时行政区划高亮,并弹出面识别弹出框
            this._Districtclick(
                featureObj.element,
                this.options.featureType,
                this.options.featureType,
            );
            const centerPoint = this.options.eventInfo.getPoint();
            const point = new g2.sfs.Point({
                x: centerPoint[0] * 1,
                y: centerPoint[1] * 1,
                spatialReference: 4326,
            });
            const geo = {
                geometry: polygon.asGeoJson(),
                geom: point.asGeoJson(),
                name: '',
                address: '',
                _id: '',
                type: 'district',
                district: this.currrentDistrictData.tag.adcode,
            };
            this.fire('clickForhandle', geo); // 调用前端进入处置
        }
    },

    _fitBounds() {
        const extent: any = this.options.simpleRenderMgr.getExtent(
            this.options.featureType,
        );
        if (extent) {
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: extent.asGeoJson(),
            });
        }
    },

    // 清除所有
    _clear() {
        // 清空行政区划图层
        this.toolTipWare.clear();
        this.options.simpleRenderMgr.remove('typhoondistricthl');
        this.options.simpleRenderMgr.remove(this.options.featureType);
        this._clearClick();
    },

    _clearClick() {
        // 删除弹出框
        this.closePopup();
        this._clearHighlight();
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
    },

    // 行政区划面点击
    _Districtclick(element: any, name: any, featureType: any) {
        // 弹出框
        this._clickTip(element, name, featureType);
        // 高亮
        this._highlight(element);
    },
    // 显示面数据的name名称
    _showPolygonName(polygons: any) {
        for (let i = 0, len = polygons.length; i < len; i++) {
            const center = { x: polygons[i].lon, y: polygons[i].lat };
            const name = polygons[i].tag.name;
            // const distance = Math.round(polygons[i].tag.distance * 1);
            const contentTemplate =
                '<div class="district-county-box f-txt-com">' +
                '<span class="district-county-name">' +
                name +
                '</span>' +
                '</div>';
            // 创建提示框
            const tooltip = new g2.widget.Tooltip({
                anchor: center, // 提示工具在地图上停靠的位置
                content: contentTemplate, // 提示的内容
                layerId: this.map, // 提示工具所在图层ID
                offset: [-44, 0], // 位置偏移量
                id: 'PolygonName_' + name + '_' + i,
            });
            this.options.TooltipIdArray.push('PolygonName_' + name + '_' + i);
            this.toolTipWare.add(tooltip);
        }
    },
    //
    _clickTip(element: any, name: any, featureType: any) {
        const point: any = element.geometry.getBaryCenter();
        this.options.popupManager
            .addSimple({
                id: this.options.popupId,
                anchor: [point.x, point.y],
                className: name,
            })
            .then((content: any) => {
                const data: any = Util.attributeSet2Object(element.attributeSet);
                const eventData: any = {
                    featureType,
                    // 当前的统计类型：、，区分人员、建筑等
                    type: this.type,
                    content,
                    data,
                };
                this.fire('disasterSta_popup', eventData);
            });
    },

    // 面高亮
    _highlight(element: any) {
        this.currentHlId = element.id;
        this._updateForHl(element.id);
    },
    // 清除面高亮，恢复图层原有的渲染
    _clearHighlight() {
        if (this.currentHlId) {
            const id: any = this.currentHlId;
            this.currentHlId = null;
            this._clearDistrictHl();
        }
    },
    // 清除行政区划高亮
    _clearDistrictHl() {
        this.options.simpleRenderMgr.remove('typhoondistricthl');
        if (this.currrentDistrictData) {
            this.currrentDistrictData = null;
            this.options.simpleRenderMgr.update({
                featureType: this.featureTypeSet.district_city_border.type,
                list: this.districtList,
            });
        }
    },

    // 更新面
    _updateForHl(id: any) {
        let data: any = null;
        for (const item of this.districtList) {
            if (item.id === id) {
                data = item;
                this.currrentDistrictData = data;
                break;
            }
        }
        this.toolTipWare.clear();
        this._showPolygonName([data]);
        const opts: any = {};
        opts.featureType = this.options.featureType;
        opts.list = this.districtList;
        this.options.simpleRenderMgr.update(opts);
    },
    // 高亮选中的多个行政区划面
    showHlDistricts(ids: any) {
        this.options.simpleRenderMgr.remove('typhoondistricthl');
        const hldata = [];
        for (const item of this.districtList) {
            if (ids.indexOf(item.tag.adcode) !== -1) {
                hldata.push(item);
            }
        }
        if (hldata.length > 0) {
            const updateSymbolObj = {
                borderColor: {
                    a: 255,
                    r: 255,
                    g: 255,
                    b: 196,
                },
                fillColor: {
                    r: 255,
                    g: 150,
                    b: 48,
                    a: 38,
                },
                opacity: 0.9,
                borderThickness: 4,
                style: 5,
            };
            const updateSymbol = (G as any).utils.RenderUtil.object2Symbol(
                'SimpleFillSymbol',
                updateSymbolObj,
            );
            const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
                build: (data: any) => {
                    return updateSymbol;
                },
            });
            const opts = {
                featureType: 'typhoondistricthl',
                featureName: '台风影响区域高亮',
                idField: 'id',
                list: hldata,
                geometryBuilder: new (G as any).utils.GeometryBuilder({
                    geometryField: ['geom'],
                    geometryType: 'Polygon',
                }),
                symbolBuilder: new SymbolBuilder(),
            };
            this.options.simpleRenderMgr.add(opts);
        }
    },
    // 点击列表中的面
    clickDistrictItem(id: any) {
        this._clearDistrictHl();
        this._updateForHl(id);
        const centerPoint = this.options.eventInfo.getPoint();
        const point = new g2.sfs.Point({
            x: centerPoint[0] * 1,
            y: centerPoint[1] * 1,
            spatialReference: 4326,
        });
        const geo = {
            geometry: this.currrentDistrictData.geom,
            geom: point.asGeoJson(),
            name: '',
            address: '',
            _id: '',
            type: 'district',
            district: this.currrentDistrictData.tag.adcode,
        };
        this.fire('clickForhandle', geo); // 调用前端进入处置
    },
    // 显示隐藏影响的行政区划
    showhideDistricts(visible: boolean = false) {
        this._clearDistrictHl();
        this.options.simpleRenderMgr.setVisible(this.options.featureType, visible);
        this.toolTipWare.clear();
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        if (visible) {
            this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
            this._showPolygonName(this.districtList);
            this._fitBounds();
        }
    },
    // 显示隐藏影响的风圈
    showhideCircle(visible: boolean = false) {
        this.options.simpleRenderMgr.setVisible('drawEventPolygon', visible);
        if (visible) {
            this.toolTipWare.clear();
        }
    },
    fitcircle() {
        const extent: any = this.options.simpleRenderMgr.getExtent(
            'drawEventPolygon',
        );
        if (extent) {
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: extent.asGeoJson(),
            });
        }
    },
    // 监听地图等级变化
    _mapResolutionchanged(e: any) {
        const level = this.map.getZoomLevel();
        const self = this;
        const idArray = this.options.TooltipIdArray;
        if (level >= 10) {
            _setVisible(true);
        } else {
            _setVisible(false);
        }
        function _setVisible(visible: boolean) {
            idArray.forEach((ele: any) => {
                self.toolTipWare.show(ele, visible);
            });
        }
    },
});
export default component;
