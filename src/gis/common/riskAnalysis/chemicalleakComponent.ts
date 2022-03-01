import { Object } from 'core-js';
import { SymbolMap } from '../../SymbolConfig';
import Util from '../../Util';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        GISComponents: null,
        simpleRenderMgr: null,
        areaObj: {
            feel: null,
            minorWound: null,
            seriousInjury: null,
            death: null,
            five: null,
        },
        fireAddPopupEventId: 'ChemicalLeakId',
        popupId: 'popup_EventPoints', // 弹窗唯一标识
        highLightId: 'ChemicalLeakComponentHL', // 高亮id
        tankPositionId: 'TankPositionId', // 模型定位id
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.featureHighlight = options.GISComponents.featureHighlight;
        // this.popupManager = options.GISComponents.popupManager;
        // this.options.simpleRenderMgr.visitFeature('mousemove', this.ss);

        this.layerManager = new G.common.LayerManager({
            map: this.map,
        });
        this.layerManager.load();
        this.simpleRenderMgr = new (G as any).render.SimpleRenderMgr({
            map: this.map,
        });
        this.simpleRenderMgr.load();
        // this.map.on('mousemove', this.ss, this);
        this.map.off('click', this.ss, this);
        this.fistNum = 1;
        this.mousePosition = new G.common.MousePosition({
            map: this.map, // 地图对象
            eventName: 'mousePositionChange',
            format: '{x}, {y}', // 展示格式
            precision: 6, // 坐标精度
            formatType: '1', // 展示类型，1：带方向，如：E 117, N 43
            lnglatFormat: 'DMS', // 坐标格式，DD：经纬度小数，DMS：度分秒
        });
        G.that1 = this;

        // 创建着火点位
        this.InitIgnitionPoint();
        this.ignitionPointArr = []; // 着火点位数组
    },
    // 监听方法，弹出面板
    ss(button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) {
        let elelayer;
        const allLayer = G.that1.map.getLayers();
        for (const i in allLayer) {
            if (allLayer[i].id === 'default-point-group') {
                elelayer = allLayer[i];
            }
        }
        if (elelayer) {
            if (G.that.fistNum === 1) {
                G.that1.fistNum = G.that1.fistNum + 1;
                elelayer.groupLayers = elelayer.groupLayers.reverse();
            }
            // tslint:disable-next-line: forin
            for (const i in elelayer.groupLayers) {
                const ele = elelayer.groupLayers[i].hitTest(screenX, screenY);
                if (ele && elelayer.groupLayers[i].name === '模型地图数据') {
                    // G.that1.setMapText(ele.element);
                    G.that1.closePopup();
                    // $('.RiskAnalysis-tooltip').remove();
                    const areaObj = G.that1.getArea();
                    ele.element.attributeSet.attributes[3].value = areaObj[ele.element.attributeSet.attributes[4].value];
                    // const point = {x : mapX, y : mapY};
                    const pointArr = ele.element.attributeSet.attributes[0].value.coordinates[0][0].length > 3 ? ele.element.attributeSet.attributes[0].value.coordinates[0][0] : ele.element.attributeSet.attributes[0].value.coordinates[0];
                    const num = Math.round(pointArr.length / 4);
                    const point = { x: pointArr[num][0], y: pointArr[num][1] };
                    // G.that1.addPopup(ele.element, point);
                }
            }
        } else {
            $('.RiskAnalysis-tooltip').remove();
            G.that1.closePopup();
        }
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
        // this.simpleRenderMgr = null;
    },
    // 初始化
    load() {
        componentBase.prototype.load.call(this);
    },
    // 关闭地图面板详情方法
    closePopup() {
        // if (this.options.popupId) {
        //     this.popupManager.remove(this.options.popupId);
        // }
        if (this.popupComprehenseveId) {
            this.popupManager.remove(this.popupComprehenseveId);
        }
        if ($('.RiskAnalysis-tooltip')) {
            $('.RiskAnalysis-tooltip').remove();
        }
    },
    // 弹出地图详情面板方法
    addPopup(data: any, point: any) {
        const popupManager = new G.common.PopupManager({
            map: this.map,
        });
        this.popupManager = popupManager;
        this.popupManager.load();
        this.popupComprehenseveId = this.options.popupId + data.id;
        // const point = this.pointTest;
        this.closePopup();
        const typeName = data.attributeSet.attributes[1].value;
        // const point = data.geometry.geometries[0].shell.points[Math.ceil(data.geometry.geometries[0].shell.points.length / 2)];
        this.popupManager.addSimple({
            id: this.popupComprehenseveId,
            anchor: [point.x, point.y],
            className: 'RiskAnalysis-tooltip',
            autoPan: false,
            autoPanTimeout: 200,
            offset: [0, -100],
        }).then((content: any) => {
            data.x = point.x;
            data.y = point.y;
            data.typeName = typeName;
            this.fire(this.options.fireAddPopupEventId, {
                data,
                containerId: content.containerId,
            });
        });
    },
    // 模型数据处理
    getList(data: any, type: any, eventInfo: any) {
        this.clear();
        this.closePopup();
        this.options.areaObj = {
            feel: null,
            minorWound: null,
            seriousInjury: null,
            death: null,
            five: null,
        };
        const dataObj = data.data.data.Model_Infos.GModel_Fire_Chemical.Result_Info;
        let lengthNum = 4;
        // 一般伤亡等级
        if (type === 'Harm') {
            lengthNum = 4;
            this.legendData = {
                list: [
                    { name: '有感区', color: { a: 153, r: 68, g: 114, b: 196 } },
                    { name: '轻伤区', color: { a: 153, r: 0, g: 176, b: 80 } },
                    { name: '重伤区', color: { a: 153, r: 255, g: 192, b: 0 } },
                    { name: '死亡区', color: { a: 153, r: 255, g: 0, b: 45 } },
                ],
                type: 'Harm',
            };
        }
        // 无防护伤亡概率
        if (type === 'UnProtect') {
            lengthNum = 4;
            this.legendData = {
                list: [
                    { name: '低风险区', color: { a: 153, r: 0, g: 176, b: 80 } },
                    { name: '中风险区', color: { a: 153, r: 255, g: 192, b: 0 } },
                    { name: '高风险区', color: { a: 153, r: 255, g: 0, b: 45 } },
                ],
                type: 'UnProtect',
            };
        }
        // 有防护伤亡概率
        if (type === 'Protect') {
            lengthNum = 4;
            this.legendData = {
                list: [
                    { name: '低风险区', color: { a: 153, r: 0, g: 176, b: 80 } },
                    { name: '中风险区', color: { a: 153, r: 255, g: 192, b: 0 } },
                    { name: '高风险区', color: { a: 153, r: 255, g: 0, b: 45 } },
                ],
                type: 'Protect',
            };
        }
        // 一般设备
        if (type === 'Build') {
            // tslint:disable-next-line: variable-name
            const type_list1: any = [
                { name: '薄钢失效区', bcolor: { a: 200, r: 0, g: 255, b: 0 }, fcolor: { a: 200, r: 0, g: 255, b: 0 } },
                { name: '塑料起火区', color: { a: 200, r: 0, g: 0, b: 255 }, fcolor: { a: 200, r: 0, g: 0, b: 255 } },
                { name: '木材起火区', color: { a: 200, r: 238, g: 238, b: 0 }, folor: { a: 200, r: 238, g: 238, b: 0 } },
                { name: '钢材失效区', color: { a: 200, r: 238, g: 173, b: 14 }, fcolor: { a: 200, r: 238, g: 173, b: 14 } },
                { name: '建筑起火区', color: { a: 200, r: 255, g: 0, b: 0 }, fcolor: { a: 200, r: 255, g: 0, b: 0 } },
            ];
            // tslint:disable-next-line: variable-name
            const type_list: any = [];
            for (let i = 1; i <= type_list1.length; i++) {
                if (dataObj.indexOf(type) !== 0) {
                    type_list.push(type_list1[i - 1]);
                }
            }
            lengthNum = 5;
            this.legendData = {
                list: type_list,
                type: 'Build',
            };
        }
        // 常压储罐
        if (type === 'CommonStorage') {
            lengthNum = 2;
            this.legendData = {
                list: [
                    { name: '中风险区', color: { a: 153, r: 255, g: 192, b: 0 } },
                    { name: '高风险区', color: { a: 153, r: 255, g: 0, b: 45 } },
                ],
                type: 'CommonStorage',
            };
        }
        // 压力储罐
        if (type === 'PressureStorage') {
            lengthNum = 2;
            this.legendData = {
                list: [
                    { name: '中风险区', color: { a: 153, r: 255, g: 192, b: 0 } },
                    { name: '高风险区', color: { a: 153, r: 255, g: 0, b: 45 } },
                ],
                type: 'PressureStorage',
            };
        }
        // 消防安全区等级（指挥作战分区）C
        if (type === 'Combat') {
            lengthNum = 4;
            this.legendData = {
                list: [
                    { name: '警戒区', bcolor: { a: 200, r: 0, g: 255, b: 0 }, fcolor: { a: 200, r: 0, g: 255, b: 0 } },
                    { name: '消防员可停留区', bcolor: { a: 200, r: 0, g: 0, b: 255 }, fcolor: { a: 200, r: 0, g: 0, b: 255 } },
                    { name: '消防员停靠边界', bcolor: { a: 200, r: 255, g: 185, b: 15 }, fcolor: { a: 200, r: 255, g: 185, b: 15 } },
                    { name: '消防员禁入区', bcolor: { a: 200, r: 255, g: 45, b: 45 }, fcolor: { a: 200, r: 255, g: 45, b: 45 } },
                ],
                type: 'Combat',
            };
        }
        this.lengthNum = lengthNum;
        let radius = 0;
        // for (let i = 1; i <= this.legendData.list.length; i++) {
        //     // for (let i = this.legendData.list.length; i > 0; i--) {
        //     if (type === 'UnProtect' || type === 'Protect') {
        //         if (dataObj[type + '_Lv' + i + '-1-600']) {
        //             this.setRing(dataObj[type + '_Lv' + i + '-1-600'], i, type, this.legendData.list[i - 1], eventInfo);
        //             if (i === 1) {
        //                 radius = dataObj[type + '_Lv' + i + '-1-600'].Attribute.MaxRadius;
        //             }
        //         }
        //     }
        // }
        for (const key of Object.keys(dataObj)) {
            if (key.indexOf(type) !== -1) {
                const tempSplit = key.split('-');
                const t = tempSplit[0];
                const index: any = t.substring(t.length - 1, t.length);
                this.setRing(dataObj[key], type, index, this.legendData.list[index - 1], tempSplit[1]);
                if (index === 1) {
                    radius = dataObj[key].Attribute.MaxRadius;
                }
            }
        }
        this.setPoint(data.data.data.Model_Infos.GModel_Fire_Chemical.Parms_Return.ParmsInfo['110530']);

        const windDirection = data.data.data.Model_Infos.GModel_Fire_Chemical.Parms_Return.ParmsInfo['103001'];
        const windSpeed = data.data.data.Model_Infos.GModel_Fire_Chemical.Parms_Return.ParmsInfo['103004']; // 风速
        if (windDirection !== '无风') {
            this.removeLayerIfExist();
            const windLevel = this.getWindGrade(windSpeed);
            const obj = {
                deriction: windDirection, // 风向
                windpower: windLevel, //  级数
                point: [data.data.data.Model_Infos.GModel_Fire_Chemical.Parms_Return.ParmsInfo['110530'][1] * 1, data.data.data.Model_Infos.GModel_Fire_Chemical.Parms_Return.ParmsInfo['110530'][2] * 1],
                radius,
            };
            this.addwindSpeedDirection(obj, true);
        }
    },
    // 获取图例列表
    getLegendData() {
        return this.legendData;
    },
    // 标点
    setPoint(data: any) {
        // $('#gifDiv1').remove();
        // const point = new g2.sfs.Point({
        //     x: data[1],
        //     y: data[2],
        //     spatialReference: this.map.spatialReference,
        // });
        // let html = '';
        // html += '<div id="gifDiv1">';
        // html += '<div style=""  class="taper"></div>';
        // html += '<div style="" class="wave_container wave_red">';
        // // html += '    <div class="_wave _wave1"></div>';
        // // html += '    <div class="_wave _wave2"></div>';
        // // html += '    <div class="_wave _wave3"></div>';
        // html += '</div>';
        // html += '</div>';
        // const tooltip = new g2.widget.Tooltip({
        //     anchor: point,     // 提示在地图上停靠位置
        //     content: html,  // 提示内容
        //     layerId: 'fxfxPointLayer', // 提示所在图层ID
        //     offset: [-32, -32],     // 位置偏移量
        // });

        // const toolTipWare = new g2.widget.TooltipWare({map: this.map });
        // toolTipWare.add(tooltip);
        // $('.ol-popup').css('pointer-events', 'none');
        // 构造多边形实例
        const areaPolygon = new (g2 as any).sfs.Polygon({ spatialReference: this.map.spatialReference });
        // 构造环实例
        const areaRing = new (g2 as any).sfs.Ring({ spatialReference: this.map.spatialReference });
        // for (let i = 0; i < this.ignitionPointArr.length; i++) {
        //     areaRing.addPoint(this.ignitionPointArr[i]);
        // }
        for (const item of this.ignitionPointArr) {
            areaRing.addPoint(item);
        }
        areaPolygon.addGeometry(areaRing);
        this.map.pan(areaPolygon);
        this.map.zoomTo(16);
    },
    calculatedArea(geom: any) {
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({ projectService });
        const areatotal: number = measureService.area(Geometry);
        const areaData = (areatotal * 10000);
        return areaData.toFixed(2);
    },
    // 标面
    setRing(data: any, type: any, num: any, dataPoint: any, pointNum: any) {
        // 构造多边形实例
        const areaPolygon = new (g2 as any).sfs.Polygon({ spatialReference: this.map.spatialReference });
        // 构造环实例
        const areaRing = new (g2 as any).sfs.Ring({ spatialReference: this.map.spatialReference });
        const tLayerDataList = data.GeoJson;
        areaPolygon.addGeometry(areaRing);
        const projectService = new (g2 as any).sfs.CoordinateTransform();
        const measureService = new (g2 as any).sfs.MeasureService({ projectService });
        const area = this.calculatedArea(data.GeoJson);
        const areaType = 'feel';
        const dataObj = {
            // geom: {
            //     coordinates: [[arr]], // data.GeoJson.coordinates.length > 1 ? tLayerDataList :
            //     type: 'MultiPolygon',
            // },
            geom: tLayerDataList,
            name: dataPoint.name,
            tag: data,
            area,
            areaType,
        };
        const dataList = [dataObj];
        const bColor = dataPoint.bcolor; // {a: 153, r: 222, g: 70, b: 98};
        const fColor = dataPoint.bcolor; // dataPoint.color;
        // fColor.a = 200;
        const symbolObj = {
            borderColor: bColor,
            fillColor: fColor,
            borderThickness: 5,
            opacity: 1,
        };
        const symbol = G.utils.RenderUtil.object2Symbol('SimpleFillSymbol', symbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            // tslint:disable-next-line: no-shadowed-variable
            build: (data: any) => {
                return symbol;
            },
        });
        // tslint:disable-next-line: no-shadowed-variable
        const opts = {
            featureType: 'mxMapDataLayer_' + '_' + type + '_' + num + '_' + pointNum,
            featureName: '模型地图数据1',
            idField: 'id' + type + num + pointNum,
            list: dataList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
            }),
            listeners: {
            },
            symbolBuilder: new SymbolBuilder(),
        };

        this.options.simpleRenderMgr.add(opts);
    },
    // 清理图层
    clear() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.options.simpleRenderMgr.featureTypeList.length; i++) {
            if (this.options.simpleRenderMgr.featureTypeList[i].featureType.includes('mxMapDataLayer')) {
                this.options.simpleRenderMgr.clear(this.options.simpleRenderMgr.featureTypeList[i].featureType);
            }
        }
    },
    // 获取面积
    getArea() {
        const arr = [this.options.areaObj.feel, this.options.areaObj.minorWound, this.options.areaObj.seriousInjury, this.options.areaObj.death, this.options.areaObj.five];
        arr.sort(
            (a, b) => {
                return a > b ? 1 : -1;
            },
        );
        this.areaArr = arr;
        this.options.areaObj.feel = arr[4];
        this.options.areaObj.minorWound = arr[3];
        this.options.areaObj.seriousInjury = arr[2];
        this.options.areaObj.death = arr[1];
        this.options.areaObj.five = arr[0];
        return this.options.areaObj;
    },
    // 设置地图模型数据显隐
    setModuleIsShow(type: any, isShow: any) {
        for (let i = 1; i <= this.lengthNum; i++) {
            this.layerManager.setLayerVisible({
                id: 'mxMapDataLayer' + i + type,
                visible: isShow,
            });
        }
    },
    // 模型地图面上标注文字的方法
    setMapText(data: any) {
        let typeName = '';
        typeName = data.attributeSet.attributes[1].value;
        // 创建弹出框管理器
        const point = data.geometry.geometries[0].shell.points[0];
        const popupManager = new G.common.PopupManager({
            map: this.map,
        });
        this.popupManager = popupManager;
        if (jQuery('#popupId')) {
            // this.popupManager.remove('popupId');
            jQuery('#popupId').html('');
        }
        // 加载
        popupManager.load();
        popupManager.addSimple({
            id: 'popupId',
            anchor: [point.x, point.y],
            className: 'g2-tooltip',
            // tslint:disable-next-line: no-shadowed-variable
        }).then((data: any) => {
            // 这里根据弹出框的容器id来添加内容
            jQuery('#' + data.containerId).html('<b>' + typeName + '</b>');
        });
    },
    addListeners() {
        // 添加事件监听，unload调用时父类触发
        //  this.options.simpleRenderMgr.on('feature-change', this.ss, this);
    },

    unload() {
        componentBase.prototype.unload.call(this);
    },

    removeListeners() {
        // 移除事件监听，unload调用时父类触发
        // this.options.simpleRenderMgr.off('feature-change', this.ss, this);
    },
    // 移除图层
    removeLayerIfExist() {
        if (this.layer) {
            this.map.removeLayer(this.layer);
        }
        this.layer = null;
    },
    // 模型在地图上标注风向风速级别信息
    addwindSpeedDirection(params: any, autoPan: boolean = false) {
        // console.log(params);
        // let r = -2.5; // params.affactRadius[params.affactRadius.length - 1];
        // if (this.areaArr) {
        //     r = Math.sqrt(this.areaArr[this.areaArr.length - 1] / Math.PI) / 1000;
        // }
        const r = params.radius / 1000;
        const base64 = this.options.symbolConfig.icons.wind_img_png;
        // const base64=res.data.icons['markPoint'];
        // 0 南 80 100 x50 y-80,45西南80 100  120 -90，90 西100 -10 50 -80，135 西北 50 -70 50 -80，180 北-10 -60 50 -80 ，225 东北 -50 -5 50 -80，270 东 -50 60 50 -80，315 东南 0 110 50 -80
        // const derictiondata = params.deriction;
        const speeddata = params.windpower;
        // const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风', '北风'];
        const direction = params.deriction;
        let rotations = 0;
        let xX = 0;
        let yY = 0;
        let radius = r * 1000;
        let textAligna = 'center';
        let offsetYa = 55 / 2;
        let offsetXa = 55 / 2;
        let height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
        if (direction === '南风') { // 0 南 80 100 x50 y-80
            radius = r * 1000;
            rotations = 0;
            offsetYa = -20;
            textAligna = 'end';
            xX = params.point[0];
            yY = params.point[1] - this.meter2degree(radius);

        } else if (direction === '西南风') { // 45西南80 100  120 -90
            rotations = 45;
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] - this.meter2degree(height45);
            yY = params.point[1] - this.meter2degree(height45);
        } else if (direction === '西风') { // 90 西100 -10 50 -80
            rotations = 90;
            offsetXa = -10;
            xX = params.point[0] - this.meter2degree(radius);
            yY = params.point[1];
        } else if (direction === '西北风') {// 135 西北 50 -70 50 -80
            rotations = 135;
            offsetYa = -20;
            textAligna = 'end';
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] - this.meter2degree(height45);
            yY = params.point[1] + this.meter2degree(height45);
        } else if (direction === '北风') {// 180 北-10 -60 50 -80
            rotations = 180;
            offsetYa = -20;
            radius = r * 1000;
            textAligna = 'end';
            xX = params.point[0];
            yY = params.point[1] + this.meter2degree(radius);

        } else if (direction === '东北风') {// 225 东北 -50 -5 50 -80
            rotations = 225;
            // textAlign='end';
            offsetYa = 40;
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] + this.meter2degree(height45);
            yY = params.point[1] + this.meter2degree(height45);
        } else if (direction === '东风') {// 270 东 -50 60 50 -80
            rotations = 270;
            xX = params.point[0] + this.meter2degree(radius);
            yY = params.point[1];
        } else if (direction === '东南风') {// 315 东南 0 110 50 -80
            rotations = 315;
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] + this.meter2degree(height45);
            yY = params.point[1] - this.meter2degree(height45);
        }

        const symbols = new g2.sfs.PictureMarkerSymbol({
            source: base64,
            width: 55,
            height: 55,
            rotation: rotations,
            opacity: 1,
            offsetX: 55 / 2,
            offsetY: 55 / 2,
            scale: 2,
        });
        const texsymbol = new g2.sfs.TextSymbol({
            text: direction + speeddata,
            borderColor: new g2.sfs.Color({
                alpha: 255, r: 0, g: 0, b: 0,
            }),
            borderThickness: 2,
            fontSize: 28,
            fontWeight: 'Yes',
            fontFamilyName: '微软雅黑',
            foreground: new g2.sfs.Color({ alpha: 255, r: 255, g: 255, b: 255 }),
            offsetX: offsetXa,
            offsetY: offsetYa,
            textAlign: textAligna,
            textBaseline: 'top',
        });
        const currencySymbol = new g2.sfs.CurrencySymbol({
            markerSymbol: symbols,
            textSymbol: texsymbol,
        });

        const elementLayer = new g2.carto.ElementLayer({
            id: 'WindLayer',
            map: this.map,
        });
        let point: any;
        point = new g2.sfs.Point({
            x: xX,
            y: yY,
            spatialReference: this.map.spatialReference,
        });
        this.point = point;
        const ele = new g2.sfs.Element({ geometry: point, symbol: currencySymbol });
        elementLayer.add(ele);
        this.layer = elementLayer;
        this.map.addLayer(elementLayer);
        elementLayer.setZIndex(13);
        // if (autoPan) {
        //     // 适配视野，保证能看见箭头
        //     try {
        //         const maxRange: any = this.options.eventInfo.getMaxRangeGeometry();
        //         const fitOpts = {
        //             type: 'geojson',
        //             geom: maxRange,
        //         };
        //         this.options.featureLocate.clear();
        //         this.options.featureLocate.fit(fitOpts, {
        //             // top, right, bottom and left
        //             padding: [150 + 55, 500 + 55, 50 + 55, 500 + 55],
        //             duration: {
        //                 move: 0,
        //                 zoom: 0,
        //             },
        //         });
        //     } catch (e) {
        //         console.debug(e);
        //     }
        // }
    },
    // 设置风向风速级别信息标注位置
    meter2degree(meters: any) {
        const cliometter = 0.0089932202929999989;
        const dis = meters / 1000 * cliometter;
        return dis;
    },
    // 获取风速级别判断
    getWindGrade(speed: any) {
        let level = '1级';
        if (speed >= 0 && speed < 0.2) {
            level = '0级';
        }
        if (speed >= 0.2 && speed < 1.5) {
            level = '1级';
        }
        if (speed >= 1.5 && speed < 3.3) {
            level = '2级';
        }
        if (speed >= 3.3 && speed < 5.4) {
            level = '3级';
        }
        if (speed >= 5.4 && speed < 7.9) {
            level = '4级';
        }
        if (speed >= 7.9 && speed < 10.7) {
            level = '5级';
        }
        if (speed >= 10.7 && speed < 13.8) {
            level = '6级';
        }
        if (speed >= 13.8 && speed < 17.1) {
            level = '7级';
        }
        if (speed >= 17.1 && speed < 20.7) {
            level = '8级';
        }
        if (speed >= 20.7 && speed < 24.4) {
            level = '9级';
        }
        if (speed >= 24.4 && speed < 28.4) {
            level = '10级';
        }
        if (speed >= 28.4 && speed < 32.6) {
            level = '11级';
        }
        if (speed >= 32.6 && speed < 36.9) {
            level = '12级';
        }
        if (speed >= 36.9 && speed < 41.4) {
            level = '13级';
        }
        if (speed >= 41.4 && speed < 46.1) {
            level = '14级';
        }
        if (speed >= 46.1 && speed < 50.9) {
            level = '15级';
        }
        if (speed >= 50.9 && speed < 56) {
            level = '16级';
        }
        if (speed >= 56 && speed < 61.2) {
            level = '17级';
        }
        if (speed >= 61.2) {
            level = '17级以上';
        }
        return level;
    },
    // 定位着火点初始化
    InitIgnitionPoint() {
        // 4.创建组件
        const self = this;
        this.mousemoveOverlay = new G.interact.MousemoveOverlay({
            map: this.map,
            content: '<div style="display:none;color: #fff;margin-left:-30px;margin-top:-35px;" class="initIgnitionPoint_cla">找火点</div>',
            keep: true, // 左键点击后是否保留overlay
            // clearlast: true,
            offset: [-16, -49],
            callback(evt: any) {
                evt.num = self.number;
                // $('.initIgnitionPoint_cla').css('display', 'block');
                // $('.initIgnitionPoint_cla').text(this.text_val);tankPositionId
                self.fire(self.options.tankPositionId, {
                    evt,
                });
                const symbols = new g2.sfs.PictureMarkerSymbol({
                    source: self.options.symbolConfig.icons.catch_fire_img_blue,
                    width: 48,
                    height: 48,
                    opacity: 1,
                    offsetX: 55 / 2,
                    offsetY: 55 / 2,
                    scale: 1,
                });
                const texsymbol = new g2.sfs.TextSymbol({
                    text: self.text_val,
                    borderColor: new g2.sfs.Color({
                        alpha: 255, r: 0, g: 0, b: 0,
                    }),
                    borderThickness: 2,
                    fontSize: 18,
                    fontWeight: 'Yes',
                    fontFamilyName: '微软雅黑',
                    foreground: new g2.sfs.Color({ alpha: 255, r: 255, g: 255, b: 255 }),
                    offsetX: -18,
                    offsetY: -60,
                    textAlign: 'center',
                    textBaseline: 'top',
                });
                const currencySymbol = new g2.sfs.CurrencySymbol({
                    markerSymbol: symbols,
                    textSymbol: texsymbol,
                });
                const elementLayer = new g2.carto.ElementLayer({
                    id: self.layer_id,
                    map: self.map,
                });
                let point: any;
                point = new g2.sfs.Point({
                    x: evt.mapX,
                    y: evt.mapY,
                    spatialReference: self.map.spatialReference,
                });
                self.point = point;
                self.ignitionPointArr.push(point);
                const ele = new g2.sfs.Element({ geometry: point, symbol: currencySymbol });
                elementLayer.add(ele);
                // self.layer = elementLayer;
                self.map.addLayer(elementLayer);
                elementLayer.setZIndex(15);
                self.fire('chemicalLeak', point);
            },
        });
    },
    // 定位着火点
    setIgnitionPoint(value: any, layerId: any, num: any) {
        this.number = num;
        this.removeIgnitionPointLayer(layerId);
        const self = this;
        this.text_val = value;
        this.layer_id = layerId;
        this.mousemoveOverlay.load();
    },
    removeIgnitionPointLayer(layerId: any) {
        const allLayer = this.map.getLayers();
        // tslint:disable-next-line: forin
        for (const i in allLayer) {
            if (allLayer[i].id === layerId) {
                this.map.removeLayer(allLayer[i]);
            }
        }
    },
    // tslint:disable-next-line:no-empty
    showExplordResult(result: any, type: any) {
        this.clear();
        this.closePopup();
        // tslint:disable-next-line:variable-name
        const model_res: any = result.data.data.Model_Infos.GModel_Explode_Chemical.Result_Info;
        if (type === 'Harm' || type === 'Debris') {
            this.legendData = {
                list: [
                    { name: '轻伤', bcolor: { a: 200, r: 0, g: 0, b: 255 }, fcolor: { a: 200, r: 0, g: 0, b: 255 } },
                    { name: '中伤', bcolor: { a: 200, r: 255, g: 255, b: 0 }, fcolor: { a: 200, r: 255, g: 255, b: 0 } },
                    { name: '重伤', bcolor: { a: 200, r: 255, g: 165, b: 0 }, fcolor: { a: 200, r: 255, g: 165, b: 0 } },
                    { name: '致死', bcolor: { a: 200, r: 255, g: 0, b: 0 }, fcolor: { a: 200, r: 255, g: 0, b: 0 } },
                ],
                type,
            };
        } else if (type === 'Damage') {
            this.legendData = {
                list: [
                    { name: '基本完好', bcolor: { a: 200, r: 0, g: 0, b: 255 }, fcolor: { a: 200, r: 0, g: 0, b: 255 } },
                    { name: '轻微损坏', bcolor: { a: 200, r: 255, g: 255, b: 0 }, fcolor: { a: 200, r: 255, g: 255, b: 0 } },
                    { name: '中等破坏', bcolor: { a: 200, r: 255, g: 215, b: 0 }, fcolor: { a: 200, r: 255, g: 215, b: 0 } },
                    { name: '严重破坏', bcolor: { a: 200, r: 255, g: 165, b: 0 }, fcolor: { a: 200, r: 255, g: 165, b: 0 } },
                    { name: '损毁', bcolor: { a: 200, r: 255, g: 0, b: 0 }, fcolor: { a: 200, r: 255, g: 0, b: 0 } },
                ],
                type,
            };
        }

        for (const key of Object.keys(model_res)) {
            if (key.indexOf(type) !== -1) {
                const tempSplit = key.split('-');
                const t = tempSplit[0];
                const index: any = t.substring(t.length - 1, t.length);
                if (type === 'Debris') {
                    this.setRing(model_res[key], type, index, this.legendData.list[index], tempSplit[1]);
                } else {
                    this.setRing(model_res[key], type, index, this.legendData.list[index - 1], tempSplit[1]);
                }

            }
        }
        const point = new g2.sfs.Point({
            x: result.data.data.Model_Infos.GModel_Explode_Chemical.Parms_Return.ParmsInfo['110530'][1],
            y: result.data.data.Model_Infos.GModel_Explode_Chemical.Parms_Return.ParmsInfo['110530'][2],
            spatialReference: this.map.spatialReference,
        });
        this.setZoomLever(point, 19);
    },
    getLeakData(data: any) {
        this.result = data.data.data.result.data.Model_Infos.GModel_Leak_Chemical.Result_Info;
        this.arrBreak = this.result.Indexes.Vector_StepIndexes;
        this.stepData = data.data.data.result.data.Model_Infos.GModel_Leak_Chemical.Result_Info_Step;
        this.type = ['Slight', 'Serious', 'Death', 'Explod_L', 'Explod_H'];
        const leakPoint = new g2.sfs.Point({
            x: data.data.data.result.data.Model_Infos.GModel_Leak_Chemical.Parms_Return.ParmsInfo['103045'][1],
            y: data.data.data.result.data.Model_Infos.GModel_Leak_Chemical.Parms_Return.ParmsInfo['103045'][2],
            spatialReference: this.map.spatialReference,
        });
        this.setZoomLever(leakPoint, 16);
    },
    // tslint:disable-next-line:no-empty
    playLeak(index: number) {
        this.clear();
        const stepResult = this.stepData[index].Info;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.type.length; i++) {
            if (stepResult[this.type[i]] && stepResult[this.type[i]].GeoJson) {
                const tempResult = stepResult[this.type[i]].GeoJson;
                this.drawLeak(tempResult, this.type[i]);
            }
        }
    },
    getColor(type: any) {
        const fcolor: any = {
            Slight: { a: 200, r: 0, g: 0, b: 255 },
            Serious: { a: 200, r: 255, g: 255, b: 0 },
            Death: { a: 200, r: 255, g: 215, b: 0 },
            Explod_L: { a: 200, r: 255, g: 165, b: 0 },
            Explod_H: { a: 200, r: 255, g: 0, b: 0 },
        };
        return fcolor[type];
    },
    drawLeak(geo: any, type: any) {
        const areaPolygon = new (g2 as any).sfs.Polygon({ spatialReference: this.map.spatialReference });
        // 构造环实例
        const areaRing = new (g2 as any).sfs.Ring({ spatialReference: this.map.spatialReference });
        const tLayerDataList = geo;
        areaPolygon.addGeometry(areaRing);
        const projectService = new (g2 as any).sfs.CoordinateTransform();
        const measureService = new (g2 as any).sfs.MeasureService({ projectService });
        const area = this.calculatedArea(geo);
        const areaType = 'feel';
        const dataObj = {
            // geom: {
            //     coordinates: [[arr]], // data.GeoJson.coordinates.length > 1 ? tLayerDataList :
            //     type: 'MultiPolygon',
            // },
            geom: tLayerDataList,
            name: type,
            tag: type,
            area,
            areaType,
        };
        const dataList = [dataObj];
        const bColor = this.getColor(type); // {a: 153, r: 222, g: 70, b: 98};
        const fColor = this.getColor(type); // dataPoint.color;
        // fColor.a = 200;
        const symbolObj = {
            borderColor: bColor,
            fillColor: fColor,
            borderThickness: 5,
            opacity: 1,
        };
        const symbol = G.utils.RenderUtil.object2Symbol('SimpleFillSymbol', symbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            // tslint:disable-next-line: no-shadowed-variable
            build: (data: any) => {
                return symbol;
            },
        });
        // tslint:disable-next-line: no-shadowed-variable
        const opts = {
            featureType: 'mxMapDataLayer_leak' + type,
            featureName: '模型地图数据' + type,
            idField: type,
            list: dataList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
            }),
            listeners: {
            },
            symbolBuilder: new SymbolBuilder(),
        };

        this.options.simpleRenderMgr.add(opts);
    },
    setZoomLever(point: any, zoom: any) {
        this.map.pan(point);
        this.map.zoomTo(zoom);
    },
});

export default component;

