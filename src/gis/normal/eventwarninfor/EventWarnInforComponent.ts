import { SymbolMap} from '../../SymbolConfig';
import Util from '../../Util';
/**
 * 事件预警信息
 */
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        // 资源类型
        type: null,
        eventInfo: null,
        map: null,
        mapConfig : null,
        symbolConfig: null,
        toolTipWare: null,
        service: null,
        commonDistrictServer: null,
        highLightId: 'hl_eventWarnInfor', // 高亮id
        popupId: 'popup_eventWarnInfo', // 弹窗唯一标识
        fireAddPopupEventId: 'EventPointspopup', // 添加弹窗后执行事件id
        fireShowResourceEventId: 'popup', // 显示数据后执行事件id
    },
    provinceDistrictData: {
        province: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        const self = this;

        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.toolTipWare = options.toolTipWare;
        this.service = options.service;
        this.commonDistrictServer = options.commonDistrictServer;
        // do sth
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;

        // this.map.listen('extentchanged', this._mapExtendChanged, this);
        // this.map.listen('resolutionchanged', this._mapResolutionchanged, this);
    },
    load() {
        componentBase.prototype.load.call(this);
        // do sth
        // this.commonDistrictServer.getProvinces({}).then((data: any) => {
        //     console.log(data);
        //     provinceDistrictData.province=data;
        // });
    },
    unload() {
        // todo
        // 清理所有地图数据，地图监听
        this.clearPopup();
        this._clearLayers();
        //
        componentBase.prototype.unload.call(this);
    },
    _mapResolutionchanged(e: any) {
        // console.log('_mapResolutionchanged');
        // console.log(e);
        // 特殊处理 按省市聚合缩放的处理
        const level = this.map.getZoomLevel();
        if (this.map.getLayerById('provinceDistrictDataLayer')) {
            if (level === 8 || level > 8) {
                this.map.getLayerById('provinceDistrictDataLayer').setVisible(false);
                if (level < 11) {
                    this.map.getLayerById('cityDistrictDataLayer').setVisible(true);
                } else {
                    this.map.getLayerById('cityDistrictDataLayer').setVisible(false);
                }
            } else {
                this.map.getLayerById('cityDistrictDataLayer').setVisible(false);
                this.map.getLayerById('provinceDistrictDataLayer').setVisible(true);
            }
        }

        const datacolor = ['orange', 'red', 'yellow', 'blue', 'gray'];
        if (this.map.getLayerById('yujingDistrictDataLayer')) {
            if (level === 8 || level < 8) {
                for (const i in datacolor) {
                    if (this.map.getLayerById(datacolor[i] + 'Layer')) {
                        this.map.getLayerById(datacolor[i] + 'Layer').setVisible(false);
                    }
                }
                if (this.map.getLayerById('yujingDistrictDataLayer')) {
                    this.map.getLayerById('yujingDistrictDataLayer').setVisible(true);
                }
            } else {
                for (const i in datacolor) {
                    if (this.map.getLayerById(datacolor[i] + 'Layer')) {
                        this.map.getLayerById(datacolor[i] + 'Layer').setVisible(true);
                    }
                }
                if (this.map.getLayerById('yujingDistrictDataLayer')) {
                    this.map.getLayerById('yujingDistrictDataLayer').setVisible(false);
                }
            }
        }

        if (level === 11 || level > 11) {
            if (this.map.getLayerById('districtLabelLayer')) {
                this.map.getLayerById('districtLabelLayer').setVisible(false);
            }
        } else {
            if (this.map.getLayerById('districtLabelLayer')) {
                this.map.getLayerById('districtLabelLayer').setVisible(false);
            }
        }
    },


    /**
     * 显示对应级别的数据 DEMO
     * @param levelArr 烈度级别数组
     */
    showResource(levelArr: any[]) {
        //
    },
    // 地图上叠加数据 线一移植
    addResource(data: any) {
        this._getsetdata(data);
        // this.addPointGaoWenLocation(data);
        this._showResourcesOnMap2(data);
    },
    // 聚合使用数据处理
    _getsetdata(data: any) {
        const dataCount = this._districtStatistics(data);
        const provinceDataCount = dataCount.dest;

        this.commonDistrictServer.getProvinces({}).then((dataProv: any) => {
            console.log(dataProv);
            const provinceDataStr = JSON.stringify(dataProv);
            // const provinceDataStr = JSON.stringify((EMapServerV2 as any).provinceDistrictData);
            const provinceData = JSON.parse(provinceDataStr);
            for (const i in provinceDataCount) {
                if (provinceDataCount.hasOwnProperty(i)) {
                    for (const j in provinceData) {
                        if (provinceDataCount[i].districtcode === provinceData[j].code) {
                            provinceData[j].count = provinceDataCount[i].count;
                        }
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
            this._addEarlyWarning(dataResult);
        });
    },
    // 行政区划统计
    _districtStatistics(data: any) {
        // 拆分数据类型
        const maps = [];
        const dest = [] ;
        // const citydest = [];
        if (!!data) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const ai = data[key];
                    // const ai = data[i];
                    if (!!ai.districtcode) {
                        const district = ai.districtcode.substring(0, 2) + '0000'; // 省
                        if (maps.indexOf(district) < 0) {
                            dest.push({
                                districtcode: district,
                                count: 1,
                            });
                            maps.push(district);
                        } else {
                            dest.forEach((dj) => {
                                const district1 = ai.districtcode.substring(0, 2) + '0000';
                                if (dj.districtcode.substring(0, 2) + '0000' === district1) {
                                    dj.count++;
                                }
                            });
                        }
                    }
                }
            }
        }
        const alldest = {
            dest: {},
        };
        alldest.dest = dest;
        // 分好的组
        return alldest;
    },
     // 聚合图层点位添加
    _addEarlyWarning(dataArr: any) {
        if (this.map.getLayerById('yujingDistrictDataLayer')) {
            this.map.getLayerById('yujingDistrictDataLayer').clear();
        }
        const self = this;
        this.hideHighlight();
        let layer = (G as any).utils.LayerUtil.getLayerById(this.map, 'yujingDistrictDataLayer');
        if (!layer) {
            layer = new (g2 as any).carto.ElementLayer({
                id: 'yujingDistrictDataLayer',
                name: 'yujingDistrictDataLayer',
                map: this.map,
            });
            this.map.addLayer(layer);
        }
        const level = this.map.getZoomLevel();
        if (level === 8 || level > 8) {
            layer.setVisible(false);
        } else {
            layer.setVisible(true);
        }
        layer.clear();
        this.hideHighlight();
        // (G as any).options.toolTipWare.clear();
        for (const i in dataArr) {
            if (dataArr.hasOwnProperty(i)) {
                const point = new (g2 as any).sfs.Point({
                    x: parseFloat(dataArr[i].lng),
                    y: parseFloat(dataArr[i].lat),
                    spatialReference: 4326,
                });
                const symbol = new (g2 as any).sfs.SimpleMarkerSymbol({
                    offsetX: 0,
                    offsetY: 0,
                    fillColor: new g2.sfs.Color({a: 150, r: 200, g: 0, b: 0}),
                    borderColor: new g2.sfs.Color({a: 150, r: 200, g: 0, b: 0}),
                    borderThickness: 4,
                    size: 16,
                });
                const textSymbol = new (g2 as any).sfs.TextSymbol({
                    text: dataArr[i].count + '',
                    borderColor: new g2.sfs.Color({a: 255, r: 255, g: 255, b: 255}),
                    borderThickness: 1,
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontFamilyName: '宋体',
                    foreground: new g2.sfs.Color({a: 255, r: 255, g: 255, b: 255}),
                    offsetX: 0,
                    offsetY: 0,
                });
                // 复合符号
                const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                    markerSymbol: symbol,
                    textSymbol,
                });
                const ele = new (g2 as any).sfs.Element({geometry: point, symbol: currencySymbol});
                layer.add(ele);
            }
        }
    },
    _showResourcesOnMap2(dataList: any) {
        this.simpleRenderMgr.remove('warnInfor');
        const opt11: any = {};
        opt11.featureType = 'warnInfor'; // 指定数据类型
        opt11.featureName = '预警信息'; // 数据类型说明
        opt11.idField = 'id'; // 数据唯一标识的属性
        opt11.list = dataList; // 数据列表
        opt11.type = 1; // 使用feature渲染
        opt11.geometryBuilder = new this.options.PointGeometryBuilder({
            geometryField: ['longitude', 'latitude'],
        });
        const symbolMapper: any = SymbolMap.EARLYWARNING;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const symbolObj: any = Util.toJSON(symbolMapper.symbol);
                symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(null, data)];
                return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opt11.symbolBuilder = new SymbolBuilder(),
        opt11.listeners = {
            click: (clickdata: any) => {
                const element = clickdata[0].element;
                this._showHighlight(element.attributeSet.getItem(8).value,
                 [element.geometry.x, element.geometry.y], element);
                // this指向监听时的context变量
                const attributeSet: any = element.attributeSet;
                const data: any = {};
                for (let i = 0 ; i < attributeSet.getCount(); i++) {
                    const attribute = attributeSet.getItem(i);
                    data[attribute.name] = attribute.value;
                }
                this.addPopup(data, [element.geometry.x, element.geometry.y], false);
            },
        },
        this.simpleRenderMgr.add(opt11);
        const level = this.map.getZoomLevel();
        if (level > 8) {
            this.simpleRenderMgr.setVisible('warnInfor', true);
        } else {
            this.simpleRenderMgr.setVisible('warnInfor', false);
        }
    },

    // Gis地图标点
    addPointGaoWenLocation(data: any, type: any) {
        let flag = false;
        // this.map.fullExtent();
        const level = this.map.getZoomLevel();
        if (level === 8 || level > 8) {
            flag = true;
        }
        if (!type) {
            this.hideHighlight();
            // (G as any).options.toolTipWare.clear();
            this._clearGisMapPoint(); // 清除地图点
        }
        // if (G.newModule['RiskAndResourceModule']) {
        //     G.newModule['RiskAndResourceModule'].onClose();
        // }
        // (G as any).CloseTreeDetail(); // 关闭右侧树
        this.hideHighlight();
        let layerID = '';
        let icon = '';
        for (const i in data) {
            if (data[i].latitude === '' || data[i].longitude === ''
            || data[i].latitude === undefined || data[i].longitude === undefined) {
                continue;
            } else {
                if (data[i].signallevel === '橙色') {
                    layerID = 'orangeLayer';
                    icon = this.symbolConfig.icons[('orange_img') as any];
                } else if (data[i].signallevel === '红色') {
                    layerID = 'redLayer';
                    icon = this.symbolConfig.icons[('red_img') as any];
                } else if (data[i].signallevel === '黄色') {
                    layerID = 'yellowLayer';
                    icon = this.symbolConfig.icons[('yellow_img') as any];
                } else if (data[i].signallevel === '蓝色') {
                    layerID = 'blueLayer';
                    icon = this.symbolConfig.icons[('blue_img') as any];
                } else if (data[i].signallevel === '未知' || data[i].signallevel === '') {
                    layerID = 'grayLayer';
                    icon = this.symbolConfig.icons[('gray_img') as any];
                }
                const parma = {
                    layerID,
                    pointX: data[i].longitude,
                    pointY: data[i].latitude,
                    htmlSelf: '<div class="popup-content popup-content-yujing" style="width: 125%;height: 190px;"> ' +
                    '<div class="popup-detail-div alert_dialogStyle1">' +
                    '<div class="detail-title-yujing"><img class="tubiaoxianshi" src="' + 'webApp' + 'src/modules/ContentModule/ModulePanel/weatherInfoModule/img/warnimg/' + data[i].typeCode + '_' +  'colorlevel[data[i].signallevel]' + '.png"><span>' + data[i].sender + '</span><a class="detail_hd_close" style="margin-top:0"></a></div>' +
                    '<ul style="color: white">' + '<p style="text-indent:2em">' + data[i].cont + '</p>' + '</ul><p' +
                    ' class="jiantou_yujing"></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                    width: '38',
                    height: '44',
                    offset: [100, 155],
                    attr: {
                        pointX: data[i].longitude,
                        pointY: data[i].latitude,
                        offset: [100, 155],
                        width: '38',
                        height: '44',
                    },
                    tag: data[i],
                    icon,
                    flag,
                };
                if (data.length > 1) {
                    this._createMarker(parma);
                } else {
                    this._createMarker(parma);
                    let signallevelLayer = '';
                    this.map.map.getView().animate(
                        {center: [data[i].longitude, data[i].latitude], duration: 500},
                        {zoom: 9, duration: 1000});
                    if (data[i].signallevel === '橙色') {
                        signallevelLayer = 'orangeLayer';
                    } else if (data[i].signallevel === '红色') {
                        signallevelLayer = 'redLayer';
                    } else if (data[i].signallevel === '黄色') {
                        signallevelLayer = 'yellowLayer';
                    } else if (data[i].signallevel === '蓝色') {
                        signallevelLayer = 'blueLayer';
                    } else if (data[i].signallevel === '未知' || data[i].signallevel === '') {
                        signallevelLayer = 'grayLayer';
                    }
                    // setTimeout( () => {
                    //     this._openPopupBlinck(signallevelLayer, parma, parma);
                    // }, 1500);
                }
            }
        }
        const datacolor = ['orange', 'red', 'yellow', 'blue', 'gray'];
        if (flag) {
            for (const i in datacolor) {
                if (this.map.getLayerById( datacolor[i] + 'Layer')) {
                    this.map.getLayerById(datacolor[i] + 'Layer').setVisible(true);
                }
            }
            if (this.map.getLayerById('yujingDistrictDataLayer')) {
                this.map.getLayerById('yujingDistrictDataLayer').setVisible(false);
            }
        } else {
            for (const j in datacolor) {
                if (this.map.getLayerById( datacolor[j] + 'Layer')) {
                    this.map.getLayerById(datacolor[j] + 'Layer').setVisible(false);
                }
            }
            if (this.map.getLayerById('yujingDistrictDataLayer')) {
                this.map.getLayerById('yujingDistrictDataLayer').setVisible(true);
            }
        }
    },
    _openPopupBlinck(layerid: string, parma: any, eleInf: any) {
        const self = this;
        const planearr = ['RESSLHKHL0002',
            'RESSLHKHL0006',
            'RESSLHKHL0007',
            'RESSLHKHL0008',
            'RESSLHKHL0011',
            'RESSLHKHL0015',
            'RESSLHKHL0018',
            'RESSLHKHL0019',
            'RESSLHKHL0021',
            'RESSLHKHL0025',
            'RESSLHKHL0026',
            'RESSLHKHL0028',
            'RESSLHKHL0001',
            'RESSLHKHL0029',
            'RESSLHKHL0030',
            'RESSLHKHL0032',
            'RESSLHKHL0038',
            'RESSLHKHL0040',
            'RESSLHKHL0004',
            'RESSLHKHL0023',
            'RESSLHKHL0033',
            'RESSLHKHL0036',
            'RESSLSLJCZD0011'];

        if (layerid !== 'rescueteamAroundLayer' && layerid !== 'disinfoperAroundLayer') {
            // this.options.toolTipWare.clear();
        }
        let pointX: any = '';
        let pointY: any = '';
        if (parma.geom) {
            if (parma.geom.type === 'Point') {
                pointX = parma.geom.coordinates[0];
                pointY = parma.geom.coordinates[1];
            } else if (parma.geom.type.indexOf('LineString') !== -1) {
                // pointX = G.options.mapEvent.data.mapX;
                // pointY = G.options.mapEvent.data.mapY;
            }
        } else {
            pointX = parma.pointX;
            pointY = parma.pointY;
        }
        if (eleInf) {
            if (eleInf.isWarmInfo || layerid === 'townLayer') {
                // 预警信息不闪烁
            } else {
                if (layerid === 'reserveHouse11Layer' && parma.tag.RESCUEID_) {
                    if (planearr.indexOf(parma.tag.RESCUEID_) > -1) {
                        layerid = 'RescueTeamT004PORTLayer';
                    } else {
                        layerid = 'reserveHouse11Layer';
                    }
                }
                if (layerid === 'resourceTeamLayer' && parma.tag.id) {
                    if (planearr.indexOf(parma.tag.id) > -1) {
                        layerid = 'RescueTeamT004PORTLayer';
                    } else {
                        layerid = 'resourceTeamLayer';
                    }
                }
                // G.options.commonGIS._blinkHighlight(layerid, pointX, pointY, parma.center, parma.id);
            }
        } else {
            // G.options.commonGIS._blinkHighlight(layerid, pointX, pointY, parma.center);
        }

        const point = this._createPoint(pointX, pointY);
        if (parma.view) {
            const level = this.map.getZoomLevel();
            if (level < 11) {
                this.map.zoomTo(11);
            }
            // this._adjustCenter(point);
        }
        const detailObj = {
            point: null,

        };
        if (parma._distance) {
            parma.tag.distance = (parma._distance / 1000).toFixed(2);
        }
        // detailObj.point = point;
        // detailObj.layerid = layerid;
        // detailObj.id = parma.id;
        // detailObj.tag = parma.tag;
        // detailObj.center = parma.center;
        // detailObj.offset = parma.offset;
        // if (eleInf) {
        //     detailObj.htmlSelf = eleInf.htmlSelf;
        //     detailObj.isSelfMoreInf = eleInf.isSelfMoreInf;
        //     detailObj.isDetailMoreInf = eleInf.isDetailMoreInf;
        //     detailObj.isWarmInfo = eleInf.isWarmInfo;
        //     detailObj.isMouseHover = eleInf.isMouseHover;
        // }
        // //显示详情
        // if (layerid.replace('Layer', '') == "weatherstation" || layerid.replace('Layer', '') == "environmentChecked") {
        //     this._openPopupweatherDetaills(detailObj);//气象站详情特殊处理
        // } else if (layerid.replace('Layer', '') == "nearEnterprise") {
        //     //this._openPopupweatherDetaills(detailObj);
        // }
        // else if (layerid.replace('Layer', '') == "rescueArea_disoatch_town" || layerid.replace('Layer', '') == "rescueArea_disoatch_county"|| layerid.replace('Layer', '') == "rescueArea_disoatch_town_part") {
        //     mapToolTipAsDialog.addTooltip(detailObj)
        // } else {
        //     if (layerid == "townLayer") {
        //         if ($('#' + detailObj.tag.id).length > 0)//已存在
        //         {
        //             return
        //         }
        //         $('.gse').append('<div id="' + detailObj.tag.id + '"  class="gis_flag"><p class="gis_flagArea">' + detailObj.tag.name + '</p><p class="gis_flagNum">' + detailObj.tag.pop + '</p></div>');
        //         var contentTemplate11 = window.document.getElementById(detailObj.tag.id);
        //         var point_overlay = new ol.Overlay({
        //             id: 'Affareatip',
        //             offset: [0, 0],
        //             element: contentTemplate11,
        //             stopEvent: false,
        //             positioning: 'center-center'
        //         });
        //         G.options.map.map.addOverlay(point_overlay);
        //         point_overlay.setPosition([detailObj.tag.geom.coordinates[0] * 1, detailObj.tag.geom.coordinates[1] * 1]);
        //     } else {
        //         detailObj.isListClick = parma.isListClick;
        //         this._openPopupDetaills(detailObj);
        //     }
        // }
    },
    _createMarker(param: any) {
        // console.log(param.layerID);
        const layer = this._createLayer(param.layerID);
        layer.setVisible(true);
        if (param.isNotPic) {
            return layer;
        }
        const pictureSymbol = new (g2 as any).sfs.PictureMarkerSymbol({
            source: param.icon || this.options.iconConfig[param.layerID] || this.symbolConfig.icons[param.layerID],
            width: param.width || 64,
            height: param.height || 70,
            offsetX: param.offsetX || 32,
            offsetY: param.offsetY || 20,
            opacity: param.opacity || 1,
            rotation: param.rotation || '0',
            size: param.scale || 2,
        });
        let pointX;
        let pointY;
        if (param.geom) {
            if (param.geom.type === 'Point') {
                pointX = param.geom.coordinates[0];
                pointY = param.geom.coordinates[1];
            } else if (param.geom.type.indexOf('LineString') !== -1) {
                const arrCoord = param.geom.coordinates;
                const road = new (g2 as any).sfs.Polyline({spatialReference: this.map.spatialReference});

                arrCoord.forEach((element: any) => {
                    const path = new (g2 as any).sfs.Path({spatialReference: this.map.spatialReference});
                    // element.forEach((ele2: any) => {
                    //     const tempPoint = this._createPoint(ele2[0], ele2[1]);
                    //     path.addPoint(tempPoint);
                    // });
                    road.addGeometry(path);
                });
                const ploylineSymbol = new (g2 as any).sfs.SimpleLineSymbol({
                    color: new g2.sfs.Color({a: 153, r: 0, g: 0, b: 255}),
                    width: 7,
                });
                const ele = new (g2 as any).sfs.Element({geometry: road, symbol: ploylineSymbol});
                ele.tag = param.tag;
                ele.geom = param.geom;
                ele.roadnames = param.tag.name !== '' ? param.tag.name : '无名道路';
                layer.add(ele);
                return ele;
            }
        } else {
            pointX = param.pointX;
            pointY = param.pointY;
        }

        const point = this._createPoint(parseFloat(pointX), parseFloat(pointY));
        const pointEle = new (g2 as any).sfs.Element({geometry: point, symbol: pictureSymbol});
        pointEle.attr = param.attr || '';
        pointEle.tag = param.tag || '';
        pointEle.geom = param.geom || '';
        pointEle.imgsLength = param.imgsLength || '';
        pointEle.pointX = param.pointX || '';
        pointEle.pointY = param.pointY || '';
        pointEle.center = param.center || false;
        pointEle._distance = param._distance || '';
        pointEle.id = param.id || '';
        pointEle.videoId = param.Id || '';
        pointEle.layer = param.layerID || '';
        pointEle.theme = param.theme || param.layerID;
        pointEle.isZdfx = param.isZdfx || false;
        pointEle.toolTipTem = param.toolTipTem || 'defaultTemp';
        pointEle.title = param.title || '详情查看';
        pointEle.offset = param.offset || false;
        pointEle.view = param.view || false; // 移动地图视野
        pointEle.htmlSelf = param.htmlSelf || false;
        pointEle.isSelfMoreInf = param.isSelfMoreInf || false;
        pointEle.isDetailMoreInf = param.isDetailMoreInf || false;
        pointEle.isWarmInfo = param.isWarmInfo || false;
        pointEle.attributeSet = param.tag;
        layer.add(pointEle);
        return pointEle;
    },
    /**
     * 根据x,y坐标创建点元素
     * @param x
     * @param y
     * @returns {*}
     * @public
     */
    _createPoint(x: any, y: any) {
        const point = new (g2 as any).sfs.Point({
            x: parseFloat(x),
            y: parseFloat(y),
            spatialReference: this.map.spatialReference,
        });
        return point;
    },
     /**
     * 创建缓冲区图层
     * @private
     */
    _createLayer(id: string) {
        var layer = (G as any).utils.LayerUtil.getLayerById(this.map, id);
        if (!layer) {
            layer = new (g2 as any).carto.ElementLayer({
                id,
                name: id,
                map: this.map,
            });
            this.map.addLayer(layer);
        }
        layer.setZIndex(5);
        return layer;
    },
    /**
     * 清空标绘图层
     * id  图层ID
     */
    _clearMarkerLayer() {
        // let arrLayers = this.options.markerLayers;
        // let _layersIdArr = G._layersIdArr || [];
        // for (var i = 0; i < arrLayers.length; i++) {
        //     const layer0 = (G as any).utils.LayerUtil.getLayerById(this.map, arrLayers[i]);
        //     if (layer0) {
        //         layer0.clear();
        //     }
        // }
        // for (var i = 0; i < _layersIdArr.length; i++) {
        //     const layer1 = (G as any).utils.LayerUtil.getLayerById(this.map, _layersIdArr[i]);
        //     if (layer1) {
        //         layer1.clear();
        //     }
        // }
        // this.options.toolTipWare.clear();
    },
    // 清除地图图层点
    _clearGisMapPoint() {
        const data = ['orange', 'red', 'yellow', 'blue', 'gray'];
        for (const i in data) {
            if (this.map.getLayerById( data[i] + 'Layer')) {
                this.map.getLayerById(data[i] + 'Layer').clear();
            }
        }
    },

     /**
     * 隐藏对应级别的数据
     * @param levelArr 烈度级别数组
     */
    hideResource(levelArr: any[]) {
        // todo
        // 地图清除烈度数组对应范围内的数据
        const visible = this.simpleRenderMgr.getVisible('warnInfor');
        this.simpleRenderMgr.setVisible('warnInfor', !visible);
        // this._fitMap();
    },

    /**
     * 显示资源的名称
     * @param id 资源id
     */
    showResourceTip(id: any) {
        // todo
        // 根据数据id，在图标上弹出改资源的名称文本
    },
    locateEvent(opts: any) {
        const coordinates: any =  [ parseFloat(opts.x), parseFloat(opts.y)];
        if (G.utils.CoordUtil.withinChina(coordinates, 4326)) {
            const geom = {
                type: 'Point',
                coordinates,
            };
            const pointdata: any = {
                type: 'geojson',
                geom,
            };
            this.featureLocate.fit(pointdata, { maxZoom: this.map.getZoomLevel()});
            this.addPopup(opts, [geom.coordinates[0], geom.coordinates[1]]);
            let element: any = null;
            this.simpleRenderMgr.visitFeature('warnInfor',
                {
                    visit: (ele: any, layerTmp: any) => {
                        if (ele.id === opts.id) {
                            element = ele;
                            return false;
                        }
                        return true;
                    },
                },
            );
            if (element) {
                this._showHighlight(opts.eventType, geom.coordinates, element);
            }
        } else {
            console.warn('坐标错误:' + JSON.stringify(opts));
        }
    },
    /**
     *
     * @param data
     * @param coordinate
     * @param noneMouseClick 是否非地图点击触发，点击地图触发时不居中定位；点击列表触发时，不设置弹出框autoPan
     */
    addPopup(data: any, coordinate: any, noneMouseClick: any = true) {
        this.closePopup();
        this.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: 'EventPoints-tooltip',
            autoPan: !noneMouseClick,
        }).then((content: any) => {
            this.fire(this.options.fireAddPopupEventId, {
                data,
                containerId: content.containerId,
                id: content.containerId,
                mapClick: !noneMouseClick,
            });
        });
    },
     /**
     * 显示资源的弹框
     * @param id 资源id
     */
    showPopup(id: any) {
        // todo
        // 弹出框，视野定位，高亮
    },

    clearAll() {
        this.clearPopup();
        this._clearLayers();
        this.hideHighlight();
    },
    /**
     * 清除弹出框
     */
    clearPopup() {
        // todo
        this.popupManager.remove(this.options.popupId);
    },
    closePopup() {
        this.popupManager.remove(this.options.popupId);
    },

    _clearLayers() {
        // todo
        this.simpleRenderMgr.remove('warnInfor');
        if (this.map.getLayerById('yujingDistrictDataLayer')) {
            this.map.getLayerById('yujingDistrictDataLayer').clear();
        }
    },
    /**
     * 删除图层
     * @param id
     * @private
     */
    _removeLayer(id: string) {
        const layer = (G as any).utils.LayerUtil.getLayerById(this.map, id);
        if (layer) {
            this.map.removeLayer(layer);
        }
    },
    _showHighlight(eventType: string, coordinate: any, element: any) {
        const data: any =  Util.attributeSet2Object(element.attributeSet) ;
        const symbolMapper: any = SymbolMap.EARLYWARNING;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(null, data)];
        const options = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [ parseFloat(coordinate[0]), parseFloat(coordinate[1])],
                },
            },
            style: symbolObj,
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 地图上数据变化时，需要重新调整地图视野，适配数据
    _fitMap(array: any) {
        // todo
        // 根据展示的资源数据调整地图视野
        const layer = this.simpleRenderMgr.getLayer('warnInfor');
        const arr = [];
        for ( const i of array) {
            for ( const k of layer.elements) {
                for ( const m of k.attributeSet.attributes) {
                    const sim = {
                        type: 'wkt',
                        geom: k.geometry.asWkt(),
                    };
                    arr.push(sim);
                }
            }
        }
        this.featureLocate.fit(arr);
    },
});
export default component;
