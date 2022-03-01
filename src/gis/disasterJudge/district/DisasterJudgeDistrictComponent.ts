// 灾损统计行政区划
import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    options: {
        service: null,
        eventInfo: null,
        simpleRenderMgr: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        symbolConfig: null,
        radius: [20, 50],
        popupId: 'disaster_judge_district', // 弹窗唯一标识
        highLightId: 'disaster_judge_district_hl', // 高亮id
        fireAddPopupEventId: 'Pointspopup', // 添加弹窗后执行事件id
        fireGetDistrictDataEventId: 'disasterDist', // 获取到缓冲数据后执行事件id
        fireshowPointsDataEventId: 'disasterXZDist', // 展示点数据后执行事件id
        popupfeatureType: null,
        popupelement: null,
    },
    eventPoint: null,
    centerShow: null,
    bufferDisLayer: null,
    districtLayerByCircleBuffer: null,
    circleBufferZoneArray: null, // 缓冲区JSON
    textPts: [],
    administrativeTowns: [], // 全部乡镇
    administrativeCountys: [], // 全部区县
    CodeTownData: [], // 当前区县下的乡镇
    initLoad: true,
    // 资源叠加类型
    featureTypeSet: {
        district_county_border: {
            type: 'district_county_border',
            name: '区划边界',
        },
        district_point_county: {
            type: 'district_point_county',
            name: '区县点',
            key: 'County',
        },
        district_line_county: {
            type: 'district_line_county',
            name: '区县点连线',
        },
        district_point_town: {
            name: '乡镇点',
            type: 'district_point_town',
            key: 'Town',
        },
        district_line_town: {
            name: '乡镇点连线',
            type: 'district_line_town',
        },
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.currrentDistrictData = null;
        this.districtList = null;

        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.toolTipWare = new g2.widget.TooltipWare({
            map: this.map,
        });
        this.service = options.service;
        //
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
        this.type = ''; // 判断是乡镇、区县标识
        // do sth
    },
    /**
     *
     * @param initLoad
     * @param autoPan 是否自动调整视野
     */
    load(initLoad: any = true, autoPan: boolean = true, geom: any) {
        this.initLoad = initLoad;
        // console.log('this.initLoad', this.initLoad);
        componentBase.prototype.load.call(this);
        // 外部调用直接 addBufferLayer();
        let ep = this.options.eventInfo.getPoint();
        ep = ep || [
            121,
            37,
        ];
        if (ep) {
            this.addBufferLayer(ep[0], ep[1], this.options.radius, autoPan);
        }
    },
    // 卸载
    unload() {
        this.clearAll();
        componentBase.prototype.unload.call(this);
    },
    addListeners() {
        this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
        // this.options.simpleRenderMgr.on('noclick', this._onLayerOtherClick, this);
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery || this.options.nearbyVideoLayer) {
            // this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            // this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
            // this.options.nearbyQuery.off('closeNearByClick', this._onNearBycloseClick, this);
            this.options.nearbyQuery.on('load', this._onNearByLoad, this);
            this.options.nearbyQuery.on('unload', this._onNearByUnLoad, this);
            this.options.nearbyQuery.on('closeNearByClick', this._onNearBycloseClick, this);
            this.options.nearbyVideoLayer.on('load', this._onNearByLoad, this);
            this.options.nearbyVideoLayer.on('unload', this._onNearByUnLoad, this);
            this.options.nearbyVideoLayer.on('closeNearByClick', this._onNearBycloseClick, this);
        }
    },
    removeListeners() {
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        // this.options.simpleRenderMgr.off('noclick', this._onLayerOtherClick, this);
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery || this.options.nearbyVideoLayer) {
            this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
            this.options.nearbyQuery.off('closeNearByClick', this._onNearBycloseClick, this);
            this.options.nearbyVideoLayer.off('load', this._onNearByLoad, this);
            this.options.nearbyVideoLayer.off('unload', this._onNearByUnLoad, this);
            this.options.nearbyVideoLayer.off('closeNearByClick', this._onNearBycloseClick, this);
        }
    },
    setRadius(radiusArr: any) {
        // 更新缓冲区半径值
        this.options.radius = radiusArr;
        this.initLoad = true;
        this.clearAll();
        // 重新加载数据
        const ep = this.options.eventInfo.getPoint();
        if (ep) {
            this.addBufferLayer(ep[0], ep[1], this.options.radius, true);
        }
    },
    // 定位到信息点
    locateToAccidentPoint() {
        const point = this.options.eventInfo.getPoint(); // 事故点
        const locatedata: any = {
            x: point[0][0],
            y: point[0][1],
        };
        this.options.locateComponent.locate(locatedata);
    },
    /**
     * 以震中位中心点，查询20KM范围内的乡镇和50KM范围内的区县
     * @param x : 震中经度
     * @param y : 震中纬度
     * @param radius : 范围半径
     * @param autoPan : {boolean} 是否自动调整视野
     */
    addBufferLayer(x: any, y: any, radius: any, autoPan: boolean) {
        this.administrativeTowns = [];
        this.administrativeCountys = [];
        this.CodeTownData = [];
        this.eventPoint = [x, y];
        this.centerShow = new (g2 as any).sfs.Point({
            x: x * 1,
            y: y * 1,
            spatialReference: this.map.spatialReference,
        });
        // 初始化圆形影响区
        if (this.map.getLayerById('circleBufferLayer')) {
            this.bufferDisLayer = this.map.getLayerById('circleBufferLayer');
        } else {
            // 缓冲查询的图层
            this.bufferDisLayer = new (g2 as any).carto.ElementLayer({
                map: this.map,
                id: 'circleBufferLayer',
            });
            this.map.addLayer(this.bufferDisLayer);
        }
        // 影响范围内的行政区划
        if (this.map.getLayerById('districtLayerByCircleBuffer')) {
            this.districtLayerByCircleBuffer = this.map.getLayerById('districtLayerByCircleBuffer');
        } else {
            this.districtLayerByCircleBuffer = new (g2 as any).carto.ElementLayer({
                map: this.map,
                id: 'districtLayerByCircleBuffer',
            });
            this.map.addLayer(this.districtLayerByCircleBuffer);
        }
        // 隐藏其他图层  圆形影响区
        if (this.map.getLayerById('circleBufferLayer')) {
            this.map.getLayerById('circleBufferLayer').clear();
        }

        this.circleBufferZoneArray = []; // 缓冲区geoJson数组
        const textPointObj = []; // 用于标注公里数的text的点位置
        const fillSymbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderThickness: 2, // 边框宽度
            fillColor: new (g2 as any).sfs.Color({ a: 1, r: 255, g: 0, b: 0 }),
            borderColor: new (g2 as any).sfs.Color({ alpha: 1, r: 255, g: 0, b: 0 }),
            style: 5,
        });
        const centerGeom = new (g2 as any).sfs.Point({
            x: x * 1,
            y: y * 1,
            spatialReference: this.map.spatialReference,
        });
        const jstsGeom = (G as any).utils.GeometryUtil.toJstsGeometry(centerGeom);
        // 进行缓冲查询
        for (const i in radius) {
            if (radius.hasOwnProperty(i)) {
                const bufferWkt = (G as any).utils.SpatialOPUtil.getBuffer({
                    geometry: jstsGeom.toString(),
                    radius: radius[i] * 1000,
                    spatialReference: this.map.spatialReference,
                });
                // 转换为tsgisGeom
                const g2geom = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(bufferWkt);
                const circleBufferZone = g2geom.asGeoJson(); // 转成GeoJson格式的数组，数组需要为一个闭合的圈
                this.circleBufferZoneArray.push(circleBufferZone);
                const ele = new (g2 as any).sfs.Element({
                    // id: 'buffer-element-id' + id[i],
                    id: 'buffer-element-id' + radius[i],
                    geometry: g2geom,
                    symbol: fillSymbol,
                });
                if (i !== '2') {
                    this.bufferDisLayer.add(ele);
                    const textPoint = {
                        x: 0,
                        y: 0,
                        srs: '',
                        angle: 0,
                        radius: 0,
                    };
                    textPoint.x = x * 1;
                    textPoint.y = y * 1;
                    textPoint.srs = '4326';
                    textPoint.angle = 90;
                    // 半径标注的文字位置
                    textPoint.radius = this.options.radius[i] * 1000;
                    textPointObj.push(textPoint);
                }
            }
        }
        this.options.featureLocate.clear();
        this._getCirclePointByAngle(textPointObj);
        this._addBufferText(this.textPts);
        this._getDistrictByCircleBuffer(this.eventPoint, autoPan);
    },
    /**
     * 通过影响面直接绘制
     * @param levelArr
     */
    addGeometryLayer(levelArr: any) {
        this.administrativeTowns = [];
        this.administrativeCountys = [];
        this.CodeTownData = [];
        // 影响范围内的行政区划
        if (this.map.getLayerById('districtLayerByCircleBuffer')) {
            this.districtLayerByCircleBuffer = this.map.getLayerById('districtLayerByCircleBuffer');
        } else {
            this.districtLayerByCircleBuffer = new (g2 as any).carto.ElementLayer({
                map: this.map,
                id: 'districtLayerByCircleBuffer',
            });
            this.map.addLayer(this.districtLayerByCircleBuffer);
        }
        // this.circleBufferZoneArray = []; // 缓冲区geoJson数组
        if (this.map.getLayerById('districtLayerByCircleBuffer')) {
            this.map.getLayerById('districtLayerByCircleBuffer').clear();
        }
        this.options.featureLocate.clear();
        levelArr.map((i: any) => {
            // this.circleBufferZoneArray.push(circleBufferZone);
            this.options.service.getTownList({
                geometry: i,
            }).then((data: any) => {
                // 每个圈的受影响乡镇
                console.log('_getDistrictByCircleBuffer', data);
                this._showDistrictPoints(data, 'County', false);
                // this.administrativeTowns = data;
                // this.CodeTownData = [];
                // if (this.administrativeTowns.length > 0 && this.administrativeCountys.length > 0) {
                //     this.fire(this.options.fireGetDistrictDataEventId, {
                //         town: this.administrativeTowns,
                //         county: this.administrativeCountys,
                //     });
                // }
            });
        });
    },
    // 图层点击统一处理
    _onLayerClick(features: any) {
        let pointFeature: any = null;
        let borderFeature: any = null;
        for (const item of features.list) {
            if (item.featureType === this.featureTypeSet.district_point_county.type
                || item.featureType === this.featureTypeSet.district_point_town.type) {
                pointFeature = item;
                break;
            } else if (item.featureType === this.featureTypeSet.district_county_border.type) {
                borderFeature = item;
            }
        }
        // 优先处理点
        if (pointFeature) { // 点点击
            const featureObj: any = pointFeature;
            this.options.popupfeatureType = featureObj.featureType;
            this.options.popupelement = featureObj.element;
            this._addPopup(featureObj.featureType, featureObj.element);
        } else if (borderFeature) { // 区县面点击
            this.closePopup();
            this._hlCountyBorderAndShowTown(borderFeature.element);
        }
    },
    //  图层没点中的回调
    _onLayerOtherClick(event: any) {
        if (this.currrentDistrictData) {
            this._clearDistrictHl(); // 清除高亮显示
            this.closePopup(); // 清除详情及高亮
            this._removeTownPoint();
        }
    },
    /**
     * 高亮区县面，显示区县内的乡镇点
     * @param element 区县面元素
     */
    _hlCountyBorderAndShowTown(element: any) {
        // 点击时高亮显示面数据
        this._addDistrictHl(element.id);
        // 点击时显示位于行政区划范围内的点数据
        const noneLine = 'noneLine';
        this._showPointsInDis(element.attributeSet.attributes[1].value.adcode, noneLine);
    },
    /**
    * 获取缓冲区的标注点
    * @param param
    * @returns {*}
    * @private
    */
    _getCirclePointByAngle(param: any) {
        this.textPts = [];
        for (const i in param) {
            if (param.hasOwnProperty(i)) {
                const radius = param[i].radius;
                const angle = param[i].angle;
                const srs = param[i].srs;
                if (srs === '4326') {
                    const projService = new (g2 as any).sfs.CoordinateTransform();
                    const ptGeom = new (g2 as any).sfs.Point({
                        x: param[i].x,
                        y: param[i].y,
                        spatialReference: srs,
                    });
                    const geom4326 = projService.transform(ptGeom, 4326);
                    // 激活tool
                    const opts = {
                        center: [geom4326.x, geom4326.y],
                        radius,
                        count: 360,
                        spatialReference: 4326,
                    };
                    const circlePoints = (G as any).utils.GeometryUtil.getCirclePonits(opts);
                    let point = {
                        type: 'Point',
                        coordinates: [circlePoints[angle][0], circlePoints[angle][1]],
                    };
                    const geom4326pts = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(point);
                    geom4326pts.spatialReference = 4326;
                    const newpoint = projService.transform(geom4326pts, srs).asGeoJson();
                    point = new (g2 as any).sfs.Point({
                        x: newpoint.coordinates[0],
                        y: newpoint.coordinates[1],
                        spatialReference: srs,
                    });
                    const pointObj = {
                        point: {},
                        radius: 0,
                        radiusShow: 0,
                    };
                    pointObj.point = point;
                    pointObj.radius = radius / 1000 * 2;
                    pointObj.radiusShow = radius / 1000;
                    this.textPts.push(pointObj);
                }
            }
        }
    },

    /**
     * 增加影响范围的标注字段
     * @param point
     * @private
     */
    _addBufferText(point: any) {
        for (const i in point) {
            if (point.hasOwnProperty(i)) {
                const center = { x: point[i].point.x, y: point[i].point.y };
                const name = point[i].radiusShow + 'km'; // polygons.COUNTY[i].tag.district;
                const contentTemplate = '<div>' +
                    '<label style=" width:auto; text-align: center;height: 45px;color: #ff0000;padding: 1px 10px 1px 10px; background: rgba(255, 255, 255, 0.6); border: solid 2px #ff0000; border-radius: 5px;font-size: 24px;font-family: "Microsoft Yahei" , "Arial", "Simsun";">' +
                    name +
                    '</label>' +
                    '</div>';
                // 创建提示框
                const tooltip = new g2.widget.Tooltip({
                    anchor: center, // 提示工具在地图上停靠的位置
                    content: contentTemplate, // 提示的内容
                    layerId: this.map, // 提示工具所在图层ID
                    offset: [0, -10], // 位置偏移量
                });
                // 将提示框加入到信息管理类对象中，显示提示信息
                this.toolTipWare.add(tooltip);
            }
        }
    },
    /**
     * 查询20KM内的乡镇
     * 查询50KM内区县
     * @param point
     */
    _getDistrictByCircleBuffer(point: any, autoPan: boolean = true) {
        const self = this;
        this.affectedDisByCircleBuffer = {};
        let dataA = this.circleBufferZoneArray[0];
        if (this.map.getLayerById('districtLayerByCircleBuffer')) {
            this.map.getLayerById('districtLayerByCircleBuffer').clear();
        }
        this.options.service.getTownList({
            point,
            geometry: dataA,
        }).then((data: any) => {
            // 每个圈的受影响乡镇
            // console.log('_getDistrictByCircleBuffer', data);
            self.administrativeTowns = data;
            self.CodeTownData = [];
            if (self.administrativeTowns.length > 0 && self.administrativeCountys.length > 0) {
                self.fire(this.options.fireGetDistrictDataEventId, {
                    town: self.administrativeTowns,
                    county: self.administrativeCountys,
                });
            }
            // 叠加乡镇点，并且显示乡镇点、以及乡镇点与事故点之间的连线
            // if (this.type === 'Town') {
            //     self._showDistrictPoints(data, 'Town');
            // }
            if (this.initLoad) {
                // self._showDistrictPoints(data, 'Town');
            }
            // this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_point_town.type, false);
            // this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_line_town.type, false);
        });
        dataA = this.circleBufferZoneArray[1];
        this.options.service.getCounties({
            point,
            geometry: dataA,
        }).then((data: any) => {
            // 每个圈的受影响区域
            // console.log(data);
            // self.countyNum = data.COUNTY.length;
            const tempD = jQuery.extend({}, data);
            self.administrativeCountys = data.COUNTY;
            if (self.administrativeTowns.length > 0 && self.administrativeCountys.length > 0) {
                self.fire(this.options.fireGetDistrictDataEventId, {
                    town: self.administrativeTowns,
                    county: self.administrativeCountys,
                });
            }
            // self.districtLayerByCircleBuffer.setZIndex(100);
            if (self.administrativeCountys.length === 0) {
                // return;
            }
            self._showPolygon(tempD);
            self._showPolygonName(tempD);
            if (this.initLoad) {
                self._showDistrictPoints(tempD.COUNTY, 'County');
            }
            // 调整视野
            if (autoPan) {
                const polygonLayer: any =
                    this.options.simpleRenderMgr.getLayer(this.featureTypeSet.district_county_border.type);
                const extent: any = G.utils.LayerUtil.getLayerExtent(polygonLayer);
                const maxRange: any = this.options.eventInfo.getMaxRangeGeometry();
                const boundList: any = [];
                if (extent) {
                    boundList.push(extent.asGeoJson());
                }
                if (maxRange) {
                    boundList.push(maxRange);
                }
                const boundGeom: any = G.utils.SpatialOPUtil.unionGeometry(boundList);
                const fitOpts = {
                    type: 'geojson',
                    geom: boundGeom,
                };
                this.options.featureLocate.fit(fitOpts, {
                    duration: {
                        move: 0,
                        zoom: 0,
                    },
                });
                // this.options.featureLocate.fit({
                //     type: 'geojson',
                //     geom: this.options.eventInfo.getMaxRangeGeometry(),
                // }, {
                //     maxZoom: this.map.getZoomLevel(),
                // });
            }
        });
    },
    /**
    * 计算行政区划面的面积
    * @param Geometry  必填 ，行政区划面的Geometry类型的数据
    * @returns {string}
    * @constructor
    */
    administrativeArea(Geometry: any) {
        const projectService = new (g2 as any).sfs.CoordinateTransform();
        const measureService = new (g2 as any).sfs.MeasureService({ projectService });
        const areatotal = measureService.area(Geometry);
        const areaData = parseFloat(areatotal / 1000000 as any).toFixed(0);  // 面积
        return areaData;
    },
    /**
     * 过滤每个行政区划的人口数
     * @param adcode 必填，行政区划code ，乡镇前9位
     * @returns {string}
     */
    addPopulation(adcode: any) {
        let pouplationNum = '';
        if (this.AllPOPUDISTPOPU) {
            for (const i in this.AllPOPUDISTPOPU) {
                if (true) {
                    const data = this.AllPOPUDISTPOPU[i];
                    const code = data.tag.distcode;
                    if (code === adcode) {
                        pouplationNum = data.tag.poptotal;
                    }
                }
            }
        }
        return pouplationNum;
    },
    // 加载面数据
    _showPolygon(districts: any) {
        const self = this;
        this.options.simpleRenderMgr.remove(this.featureTypeSet.district_county_border.type);
        const dataList = districts;
        this.districtList = districts;
        let borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        if (this.map.getLayerById('basemap')) {
            borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        } else if (this.map.getLayerById('tiandituLayer_img')) {
            borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 255, a: 153 });
        } else if (this.map.getLayerById('tiandituLayer_vec')) {
            borderColor = new (g2 as any).sfs.Color({ r: 255, g: 55, b: 1, a: 255 });
        } else if (this.map.getLayerById('tiandituLayer_ter')) {
            borderColor = new (g2 as any).sfs.Color({ r: 12, g: 0, b: 255, a: 255 });
        }
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

        const symbolObj = {
            borderColor: {
                a: 255,
                r: 255,
                g: 181,
                b: 177,
            },
            fillColor: {
                a: 122,
                r: 255,
                g: 0,
                b: 0,
            },
            borderThickness: 2,
            opacity: 0.5,
        };
        const updateSymbolObj = {
            borderColor: {
                a: 255,
                r: 95,
                g: 234,
                b: 255,
            },
            fillColor: {
                r: 0,
                g: 255,
                b: 255,
                a: 100,
            },
            opacity: 0.9,
            borderThickness: 5,
            style: 5,
        };
        // const symbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', symbolObj);
        const updateSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', updateSymbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                if (this.currrentDistrictData
                    && this.currrentDistrictData.id === data.id) {
                    return updateSymbol;
                } else {
                    return symbol;
                }
            },
        });
        const opts = {
            featureType: this.featureTypeSet.district_county_border.type,
            featureName: this.featureTypeSet.district_county_border.name,
            idField: 'id',
            list: dataList.COUNTY,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
                geometryType: 'Polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
        // 显示面数据的name名称
    },
    // 显示面数据的name名称
    _showPolygonName(polygons: any) {
        for (let i = 0, len = polygons.COUNTY.length; i < len; i++) {
            const center = { x: polygons.COUNTY[i].lon, y: polygons.COUNTY[i].lat };
            const name = polygons.COUNTY[i].tag.name;
            const distance = Math.round(polygons.COUNTY[i].tag.distance * 1);
            const contentTemplate = '<div class="district-county-box f-txt-com">' +
                '<span class="district-county-name">' +
                name +
                '</span>' +
                '<span class="district-county-distance  f-tit-h2"><a class="district-county-distance-number">' +
                distance +
                '</a><a class="district-county-distance-unit">km</a></span>' +
                '</div>';
            // 创建提示框
            const tooltip = new g2.widget.Tooltip({
                anchor: center, // 提示工具在地图上停靠的位置
                content: contentTemplate, // 提示的内容
                layerId: this.map, // 提示工具所在图层ID
                offset: [-44, 0], // 位置偏移量
            });
            this.toolTipWare.add(tooltip);
        }
    },
    // 获取并且显示指定行政区范围内的行政区划点
    _showPointsInDis(district: any, noneLine: any) {
        const self = this;
        // console.log(district);
        // 定义样式
        this.options.service.getTownListByCounty({
            point: this.eventPoint,
            code: district,
        }).then((data: any) => {
            // console.log(data);
            // self.administrativeTowns = data;
            // self.CodeTownData = [];
            // if (self.administrativeTowns.length > 0 && self.administrativeCountys.length > 0) {
            self.fire(this.options.fireshowPointsDataEventId, {
                xzTown: data.data,
            });
            // 叠加乡镇点，并且显示乡镇点、以及乡镇点与事故点之间的连线
            self._showDistrictPoints(data.data, 'Town', noneLine);
        });
    },
    /**
     * 切换乡镇点
     * @param visible 是否显示
     */
    toggleTownLayer(visible: boolean) {
        this._clearDistrictHl();
        if (visible === true) {
            //
            this.options.service.getTownList({
                geometry: this._getBuffer(),
            }).then((data: any) => {
                // 叠加行政区划
                this._showDistrictPoints(data, 'Town');
            });
        }
    },
    /**
     * 切换区县点
     * @param visible 是否显示
     */
    toggleCountyLayer(visible: boolean) {
        this._clearDistrictHl();
        if (visible === true) {
            // 获取区县点
            this.options.service.getCounties({
                // point,
                // geometry: this.circleBufferZoneArray[1],
            }).then((data: any) => {
                // 叠加行政区划，并且显示区县点、以及区县点与事故点之间的连线
                this._showDistrictPoints(data.COUNTY, 'County');
            });
        }
    },
    // 图层控制 显示隐藏
    toggleLayer(type: string, visible: boolean, data: any) {
        // console.log(type, visible);
        // this.clicktype=type;
        // this.clickvisible=visible;
        this._clearDistrictHl();
        // 清空弹窗及高亮
        this.closePopup();
        switch (type) {
            case 'Town':
                if (visible === true) {
                    // this.options.service.getTownList({
                    //     point: this.eventPoint,
                    //     geometry: this.circleBufferZoneArray[0],
                    // }).then((data: any) => {
                    //     // 叠加行政区划
                    //     this.type = 'Town';
                    //     if(!this.removeTownPoint&&this.clicktype==='County'&&!this.clickvisible){
                    //         this.removeTownPoint=true;
                    //         this._showDistrictPoints(data, 'Town');
                    //     }
                    // });
                    this._showDistrictPoints(data.allData, 'Town');
                } else {
                    this._removeTownPoint();
                    // this.options.simpleRenderMgr.setVisible(
                    //     this.featureTypeSet.district_point_town.type, visible);
                    // this.options.simpleRenderMgr.setVisible(
                    //     this.featureTypeSet.district_line_town.type, visible);
                }
                break;
            case 'County':
                if (visible === true) {
                    // 获取区县点
                    // this.options.service.getCounties({
                    //     point: this.eventPoint,
                    //     geometry: this.circleBufferZoneArray[1],
                    // }).then((data: any) => {
                    //     // 叠加行政区划，并且显示区县点、以及区县点与事故点之间的连线
                    //     this.type = 'County';
                    //     if(this.clicktype==='Town'&&!this.clickvisible){
                    //         this._showDistrictPoints(data.COUNTY, 'County');
                    //     }
                    // });
                    this._showDistrictPoints(data.allData, 'County');
                } else {
                    this._removeCountyPoints();
                    // this.options.simpleRenderMgr.setVisible(
                    //     this.featureTypeSet.district_point_county.type, visible);
                    // this.options.simpleRenderMgr.setVisible(
                    //     this.featureTypeSet.district_line_county.type, visible);
                    // this._claerDistance();
                }
                break;
            default:
                break;
        }
    },
    //
    _getBuffer() {
        const bufferGeom = G.utils.SpatialOPUtil.getBuffer({
            geometry: {
                type: 'Point',
                coordinates: this.eventPoint, // this.options.eventInfo.getPoint(),
            },
            spatialReference: 4326,
            radius: this.options.radius[1] * 1000,
        });
        return bufferGeom;
    },
    // 显示行政区  乡镇划点
    _showDistrictPoints(data: any, type: string, noneLine: any) {
        // 显示行政区划点、显示行政区划点到事故点的连线
        const self = this;
        const point = this.eventPoint;
        // 互斥时均清除
        // this._removeCountyPoints();
        // this._removeTownPoint();
        const featureTypeObj: any = this._getFeatureTypeSet(type);
        const symbolMapper: any = SymbolMap.DISTRICT;
        const symbolObj: any = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(featureTypeObj.point, data)];
        const opts1array: any[] = [type, '行政区划点', 'id', data, 0, symbolObj.options];
        const opts1 = this._showPoints(opts1array);
        // console.log('opts1', opts1);
        this.options.simpleRenderMgr.add(opts1);
        const lineData: any[] = [];
        // 显示行政区划点到事故点的连线
        const pointx = point[0];
        const pointy = point[1];
        for (let i = 0, len = data.length; i < len; i++) {
            const x = data[i].lon;
            const y = data[i].lat;
            if (x === '' || isNaN(x) || y === '' || isNaN(y)) {
                continue;
            }
            const lineCoorObj = {
                id: i,
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [x, y],
                        [pointx, pointy],
                    ],
                },
            };
            lineData.push(lineCoorObj);
        }
        if (!noneLine) {
            this._showPolyline(lineData, type);
        }
        // if (type === 'County') {
        //     this._addCountyDistance(type, point, data);
        // }
    },

    _showPoints(attribute: any) {
        const opts1: any = {};
        const featureType: any = this._getFeatureTypeSet(attribute[0]).point;
        // console.log('_showPoints', attribute);
        // const featureType: any = this._getFeatureTypeSet(this.type).point;
        // console.log('featureType', featureType);
        // const featureType: any =
        //     attribute[0] === 'County' ?
        //     this.featureTypeSet.district_point_county.type : this.featureTypeSet.district_point_town.type;
        opts1.featureType = featureType; // 指定数据类型
        opts1.featureName = attribute[1]; // 数据类型说明
        opts1.idField = attribute[2]; // 数据唯一标识的属性
        opts1.list = attribute[3]; // 数据列表
        opts1.type = attribute[4]; // 使用feature渲染
        opts1.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['lon', 'lat'] });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                // 根据数据属性控制不同的显示效果
                return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', attribute[5]);
            },
        });
        opts1.symbolBuilder = new SymbolBuilder();
        return opts1;
    },
    // 显示边线数据
    _showPolyline(data: any, layerType: string) {
        console.log('_showPolyline');
        const featureType: any = this._getFeatureTypeSet(layerType).line;
        // const featureType: any =
        //     layerType === 'County' ?
        //     this.featureTypeSet.district_line_county.type : this.featureTypeSet.district_line_town.type;
        this.options.simpleRenderMgr.remove(featureType);
        const dataList = data;
        const symbolObj = {
            color: {
                a: 255, r: 255, g: 0, b: 0,
            },
            style: 3,
            width: 3,
        };
        const symbolObjHighlight = {
            color: {
                a: 255, r: 255, g: 255, b: 255,
            },
            style: 3,
            width: 5,
        };
        const symbol = (G as any).utils.RenderUtil.object2Symbol('SimpleLineSymbol', symbolObj);
        const symbolHighlight = (G as any).utils.RenderUtil.object2Symbol('SimpleLineSymbol', symbolObjHighlight);
        const linesymbol = new g2.sfs.LineCombinedSymbol({
            lineSymbols: [symbolHighlight, symbol],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                return linesymbol;
            },
        });
        const opts = {
            featureType,
            featureName: '',
            idField: 'id',
            list: dataList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geometry'],
                geometryType: 'polyline',
            }),
            symbolBuilder: new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
    },
    // 高亮行政区划
    _addDistrictHl(districtId: string) {
        this._clearDistrictHl(); // 清除高亮显示
        let data = null;
        // 获取指定id的面数据
        for (let i = 0, len = this.districtList.COUNTY.length; i < len; i++) {
            if (this.districtList.COUNTY[i].id === districtId) {
                data = this.districtList.COUNTY[i];
                break;
            }
        }
        this.currrentDistrictData = data || null;
        // 更新面数据的样式
        if (data) {
            this.options.simpleRenderMgr.update({
                featureType: this.featureTypeSet.district_county_border.type,
                list: this.districtList.COUNTY,
            });
        }
    },
    // 清除行政区划高亮
    _clearDistrictHl() {
        if (this.currrentDistrictData) {
            this.currrentDistrictData = null;
            this.options.simpleRenderMgr.update({
                featureType: this.featureTypeSet.district_county_border.type,
                list: this.districtList.COUNTY,
            });
        }
    },
    /**
     * 定位到信息点并弹框显示信息
     * @param type {String} 'County' 区县, 'Town' 城镇
     * @param id {String}
     */
    openPopup(type: any, id: any) {
        this.closePopup();
        const typeArr: any = ['County', 'Town'];
        for (const typeStr of typeArr) {
            const typeSet: any = this._getFeatureTypeSet(typeStr);
            const featureType: any = typeSet.point;
            const layer: any = this.simpleRenderMgr.getLayer(featureType);
            if (!layer) {
                continue;
            }
            const element: any = layer.find(id);
            if (element) {
                this.options.popupfeatureType = featureType;
                this.options.popupelement = element;
                this._addPopup(featureType, element);
                // 定位
                // this._locatePoint(element.geometry);
                // 点击区县，显示区县内的乡镇
                if (type === typeArr[0]) {
                    const borderEle: any = this.simpleRenderMgr.getLayer('district_county_border').find(id);
                    if (borderEle) {
                        this._hlCountyBorderAndShowTown(borderEle);
                    }
                }
                break;
            }
        }
    },
    // 关闭信息框
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this.hideHighlight();
    },
    // 清除所有图层数据以及关闭框
    clearAll() {
        this.closePopup();
        this.toolTipWare.clear();
        if (this.map.getLayerById('circleBufferLayer')) {
            this.map.getLayerById('circleBufferLayer').clear();
            this.map.removeLayer(this.map.getLayerById('circleBufferLayer'));
        }
        if (this.map.getLayerById('districtLayerByCircleBuffer')) {
            this.map.getLayerById('districtLayerByCircleBuffer').clear();
            this.map.removeLayer(this.map.getLayerById('districtLayerByCircleBuffer'));
        }
        this._removeDistricts();
        this._removeDistritPoints();
    },
    // 显示信息框
    _addPopup(featureType: any, element: any) {
        const hlSymbol: any = this.showHighlight(featureType, [element.geometry.x, element.geometry.y]);
        const point: any = element.geometry;
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        // 处理坐标，属性名统一为x y，提供周边查询、路径规划使用
        attributeObj.x = attributeObj.lon;
        attributeObj.y = attributeObj.lat;
        const type: any = this.featureTypeSet[featureType].key;
        this.options.popupManager.clear();
        // this.featureHighlight.clearHighlight();
        this.options.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [point.x, point.y],
            className: 'DistrictPoints-tooltip',
        }).then((content: any) => {
            const event: any = {
                type,
                content,
                data: attributeObj,
            };
            console.debug(event);
            //
            this.options.nearbyQuery.setTargetFeature({
                type,
                featureType,
                data: attributeObj,
                symbol: G.utils.RenderUtil.object2Symbol(hlSymbol.symbol),
            });
            this.fire(this.options.fireAddPopupEventId, event);
        });
    },
    /**
    * 根据经纬度高亮
    * @param Type 类型
    * @param coordinate 经纬度数组
    */
    showHighlight(Type: string, coordinate: number[]) {
        const symbolMapper: any = SymbolMap.DISTRICT;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(Type, null)];
        this.hideHighlight();
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
            },
            style: symbolObj,
            // 不闪烁
            blink: {
                enable: false,
            },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
        return {
            symbol: symbolObj,
        };
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 定位
    _locatePoint(geometry: any) {
        const data = {
            type: 'geojson',
            geom: geometry.asGeoJson(),
        };
        this.map.setCenter(geometry);
        // this.options.featureLocate.fit(data);
    },
    /**
     * 清空高亮
     * @param resourceId 资源标识
     */
    clearHighlight(resourceId: string) {
        //
    },
    // 根据 type 获取对应的featureTyep
    _getFeatureTypeSet(type: any) {
        // console.log('type', type);
        const typeMap: any = {
            County: {
                point: 'district_point_county',
                line: 'district_line_county',
            },
            Town: {
                point: 'district_point_town',
                line: 'district_line_town',
            },
        };
        // console.log('typeMap[type]', typeMap[type]);
        return typeMap[type] || null;
    },
    // 移除行政区划点
    _removeDistritPoints() {
        this._removeCountyPoints();
        this._removeTownPoint();
    },
    _removeDistricts() {
        this.options.simpleRenderMgr.remove(this.featureTypeSet.district_county_border.type);
        this._clearDistrictHl(); // 清除高亮显示
    },
    _removeCountyPoints() {
        this.options.simpleRenderMgr.remove(this.featureTypeSet.district_point_county.type);
        this.options.simpleRenderMgr.remove(this.featureTypeSet.district_line_county.type);
        // this._claerDistance();
    },
    _removeTownPoint() {
        this.options.simpleRenderMgr.remove(this.featureTypeSet.district_point_town.type);
        this.options.simpleRenderMgr.remove(this.featureTypeSet.district_line_town.type);
    },
    _onNearByLoad() {
        console.debug('监听周边查询加载！');
        this.popupManager.remove(this.options.popupId);
        this.options.simpleRenderMgr.off('click', this._onLayerClick, this);
        const self = this;
        // (window as any).map.off('click', function(event: any) {
        //     self._onLayerOtherClick(event);
        // });
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_point_county.type, false);
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_line_county.type, false);
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_point_town.type, false);
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_line_town.type, false);
        // this._setVisibleclaerDistance(false);
    },
    _onNearByUnLoad() {
        console.debug('监听周边查询卸载！');
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_point_county.type, true);
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_line_county.type, true);
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_point_town.type, true);
        this.options.simpleRenderMgr.setVisible(this.featureTypeSet.district_line_town.type, true);
        // this._setVisibleclaerDistance(true);
        this.hideHighlight();
        // 异步处理
        setTimeout(() => {
            this.options.simpleRenderMgr.on('click', this._onLayerClick, this);
            const self = this;
            // (window as any).map.listen('click', function(event: any) {
            //     self._onLayerOtherClick(event);
            // });
            // 添加高亮图标
            self.showHighlight(this.options.popupfeatureType, [this.options.popupelement.geometry.x, this.options.popupelement.geometry.y]);

        }, 10);
    },
    _onNearBycloseClick() {
        this._addPopup(this.options.popupfeatureType, this.options.popupelement);
    },
});
export default component;
