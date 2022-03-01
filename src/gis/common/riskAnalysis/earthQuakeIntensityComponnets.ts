import { Object } from 'core-js';
import { SymbolMap } from '../../SymbolConfig';
import Util from '../../Util';
import { ServiceMapping } from './ServiceMapping';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        GISComponents: null,
        simpleRenderMgr: null,
        egis: {
            server: '',
            tokenServer: '',
            clientId: '',
            clientSecret: '',
        },
        areaObj: {
            feel: null,
            minorWound: null,
            seriousInjury: null,
            death: null,
            five: null,
        },
        fireAddPopupEventId: 'earthquakeIntensityId',
        popupId: 'popup_EventPoints', // 弹窗唯一标识
        highLightId: 'earthquakeIntensityComponentHL', // 高亮id
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
        this.serviceMapping = new ServiceMapping(this.options.egis);
        this.options.apiPrefix = this.options.egis.server;
        this.LayerUtil = {
            wrapUrl(url: any, apiPrefix: any) {
                if (/^https?\:\/\/.*$/.test(url)) {
                    return url;
                } else {
                    if (url && url.indexOf(apiPrefix) === 0) {
                        return url;
                    } else {
                        return apiPrefix + url;
                    }
                }
            },
        };
        this._initService();
        // 创建着火点位
        this.InitIgnitionPoint();
        this.ignitionPointArr = []; // 着火点位数组
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
    // 清理图层
    clear() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.options.simpleRenderMgr.featureTypeList.length; i++) {
            if (this.options.simpleRenderMgr.featureTypeList[i].featureType.includes('mxMapDataLayer')) {
                this.options.simpleRenderMgr.clear(this.options.simpleRenderMgr.featureTypeList[i].featureType);
            }
        }
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
                    source: self.options.symbolConfig.icons.catch_fire_img,
                    width: 23,
                    height: 35,
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
                self.fire('earthquakeIntensity', point);
                elementLayer.setZIndex(15);
                self.request2({
                    x: point.x,
                    y: point.y,
                })
                    .then((res: any) => {
                        self.fire('getdistrict', res);
                    });
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
    draw(data: any) {
        this.result = data.Model_Infos.GModel_EQ_Intensity.Result_Info;
        this.type = ['Lv5-0', 'Lv6-0', 'Lv7-0', 'Lv8-0', 'Lv9-0', 'Lv10-0', 'Lv11-0'];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.type.length; i++) {
            if (this.result[this.type[i]]) {
                if (this.result[this.type[i]].GeoJson.type === 'Polyline' || this.result[this.type[i]].GeoJson.type === 'LineString' ) {
                    this.result[this.type[i]].GeoJson.type = 'Polygon';
                    this.result[this.type[i]].GeoJson.coordinates = [this.result[this.type[i]].GeoJson.coordinates];
                  }
                this.drawData(this.result[this.type[i]].GeoJson, this.type[i]);
            }
        }
    },
    calculatedArea(geom: any) {
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
        const projectService = new g2.sfs.CoordinateTransform();
        const measureService = new g2.sfs.MeasureService({ projectService });
        const areatotal: number = measureService.area(Geometry);
        const areaData = (areatotal * 10000);
        return areaData.toFixed(2);
    },
    drawData(geo: any, type: any) {
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
                geometryType: 'polygon',
            }),
            listeners: {
            },
            symbolBuilder: new SymbolBuilder(),
        };

        this.options.simpleRenderMgr.add(opts);
    },
    getColor(type: any) {
        const fcolor: any = {
            'Lv5-0': { a: 200, r: 136, g: 194, b: 234 },
            'Lv6-0': { a: 200, r: 105, g: 105, b: 255 },
            'Lv7-0': { a: 200, r: 255, g: 255, b: 105 },
            'Lv8-0': { a: 200, r: 252, g: 180, b: 111 },
            'Lv9-0': { a: 200, r: 252, g: 134, b: 111 },
            'Lv10-0': { a: 200, r: 255, g: 105, b: 105 },
            'Lv11-0': { a: 200, r: 252, g: 134, b: 105 },
        };
        return fcolor[type];
    },
    setZoomLever(point: any, zoom: any) {
        this.map.pan(point);
        this.map.zoomTo(zoom);
    },
    /**
 * 创建服务
 * @param {String} className 服务名称
 * @param {Object} opts 服务参数
 */
    createService(className: any, opts: any) {
        const conf = this.serviceMapping.conf;
        if (!conf[className]) {
            throw new Error('服务类型不存在');
        }
        return new conf[className].name(
            $.extend(
                {},
                {
                    authType: conf[className].authType,
                    tokenUrl: conf[className].tokenUrl,
                    clientId: conf[className].clientId,
                    clientSecret: conf[className].clientSecret,
                },
                opts,
            ),
        );
    },
    // 初始化服务
    _initService() {
        this.WRGSService = this.createService('RestWRGSService', {
            url: this.LayerUtil.wrapUrl('/egis/base/v1', this.options.apiPrefix),
        });
    },
    /**
    *逆向地理编码
    * @param params
    * @param params.x
    * @param params.y
    */
    request2(params: any) {
        return new Promise((
            resolve, reject) => {
            const self = this;
            const WRGSInput = new g2.ews.WRGSInput({
                location: [params.x, params.y].join(','),
            });
            self.WRGSService.regeocode(WRGSInput).then((result: any) => {
                const data: any = {};
                data.x = result.location.x;
                data.y = result.location.y;
                data.address = result.formatted_address;
                data.address_component = result.address_component;
                resolve(data);
            }, (err: any) => {
                console.error(err);
                if (err.message) {
                    reject(new Error('逆向地理编码服务调用失败: ' + err.message));
                } else if (err.response.msg) {
                    reject(new Error(err.response.msg));
                }
            });
        });
    },
});

export default component;

