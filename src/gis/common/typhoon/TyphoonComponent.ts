import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
const componentBase = (G as any).base.ComponentBase;
const TyphoonComponent = componentBase.extend({
    options: {
        typhoonAlertLineOptions: {
            id: 'typhoon_alertline',
            name: '台风警戒线',
            zIndex: 100,
            pic24_xy: [127, 30],
            pic48_xy: [132, 30],
            lineStyle48h: 3,
            lineStyle24h: 5,
            points_24h: [
                [126.993568, 34.005024],
                [126.993568, 21.971252],
                [118.995521, 17.96586],
                [118.995521, 10.97105],
                [113.018959, 4.48627],
                [104.998939, -0.035506],
            ],
            points_48h: [
                [131.981361, 33.959474],
                [131.981361, 14.96886],
                [119.962318, -0.035506],
                [104.998939, -0.035506],
            ],
            color_24h: '#FFFF00',
            color_48h: '#160DFF',
            pic_base24: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAByCAYAAABA87G+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACPElEQVRoge2aQW7EIAxFIaqUG4y67KrqEXr/4/QCo9kMXcxEIdQ23zaJwpS/adJkeBgMNpCYUgpHajqUNoCnBaY0pZQmyPveagXl9zHeo6diIQgWLrAY73EBUVagllWBiLQwEZhbJsG0zQxZaC3cBKRgngpEaS6VCub6r1YJFljCEDhiMdSkkjfmzxCvFZt0D/U5lw5gP0BN3GsCbKEBZPvN2p9mC6W0wwysRQELFEqipAK0UBLYMqUoRealWpDm/fMNi+6B4tpikXfCzjVymn8OtESMcwwLqtat5lVyWOSTt6bJkEpBA58rzBJVzuWlZXPunpeWTWXNY2DgHoKdZpF3eKj6sIVUfdhC1SSqNVTdhyH4mnpE/BcHPubO97Ref6XtM73zVDf3VIV5NvfWH1+y68/Nc8t4dVmYZwQoUFgffj/vLs+/y/0M7aFyEqe2R4E/TIVWCzVgcWqj9rnL/6sXr1LWphUCP3wuVZ09cdI06+tbCAVgrkCLc401/gCq1SRNPGx9aFlNmSykoPD7XUQLz44xkCZOqbz2yD0stBWBNoa257wfLivhY3Vps6jffRpOZdam6UfTyYz27D6X6DRU/sl9wYAKHvhcIsxV0A1spT68tCsglAjTTjKHEG6Bei7pPBGfm0c5qBtY100cm5zgFONvlJhDjFd1xK9uX1JWeCK/yUupykjvbd5BPzOjACikCqx9JLeMwxiv6o0hV5pYVgTR4RG/Og5rXto04kug3SO+pBHxB3AAXfoFW1EPwh6Vf8EAAAAASUVORK5CYII=',
            pic_base48: 'data:image/png;base64,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',
        },
        typhoonTrackOptions: {
            spatialReference: 4326,
            projection: 1,
            tfbh: null,
            picSymbol: {
                typhoonIcon: 'data:image/gif;base64,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',
            },
            interfaceMsg: {
                forecastPoint: [{
                    name: 'mousemoveForecastPoint',
                    enable: 1,
                    event: 'mousemove',
                },
                { /*鼠标移动获取台风真实轨迹点事件*/
                    name: 'clickForecastPoint',
                    enable: 1,
                    event: 'click',
                }],
                trackPoint: [{
                    name: 'mouseoverTrackPoint',
                    enable: 1,
                    event: 'mousemove',
                },
                { /*鼠标移动获取台风真实轨迹点事件*/
                    name: 'clickTrackPoint',
                    enable: 1,
                    event: 'click',
                }],
                landPoint: [
                    {
                        /*鼠标移动获取台风登陆点事件*/
                        name: 'mousemoveLandPoint',
                        enable: 1,
                        event: 'mousemove',
                    },
                    {
                        /*鼠标移动获取台风登陆点事件*/
                        name: 'clickLandPoint',
                        enable: 1,
                        event: 'click',
                    },
                ],
            },
            layerOrder: {
                trackLine: {
                    id: 'typhoon_line',
                    name: '台风路径线图层',
                    zIndex: 101,
                },
                trackPoint: {
                    id: 'typhoon_point',
                    name: '台风路径点图层',
                    zIndex: 102,
                },
                focusPoint: {
                    id: 'typhoon_focus_point',
                    name: '台风路径点焦点图层',
                    zIndex: 200,
                },
                trackLabel: {
                    id: 'typhoon_label',
                    name: '台风路径文本',
                    zIndex: 100,
                },
                typhoonRing: {
                    id: 'typhoon_ring',
                    name: '台风路径风圈',
                    zIndex: 100,
                },
                typhoonForecast: {
                    id: 'typhoon_forecast',
                    name: '预报图层',
                    zIndex: 101,
                },
                typhoonIcon: {
                    id: 'typhoon_icon_Layer',
                    name: '台风风眼图标',
                    zIndex: 100,
                },
            },
            typhoon: {
                landPointSymbol: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        source: 'data:image/png;base64,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',
                        width: 34, height: 46,
                        rotation: 0,
                        opacity: 1,
                        offsetX: 17,
                        offsetY: 46,
                    },
                },
                landPointSymbolHover: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        source: 'data:image/png;base64,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',
                        width: 64, height: 70,
                        rotation: 0,
                        opacity: 1,
                        offsetX: 32,
                        offsetY: 70,
                    },
                },
                lineColor: { a: 153, r: 255, g: 255, b: 255 },
                lineSingleColorFlag: 0,
                nameTextSymbol: {
                    fontSize: 20,
                    fontWeight: 'normal',
                    fontFamilyName: '宋体',
                    foreground: { a: 255, r: 255, g: 0, b: 0 },
                    borderColor: { a: 255, r: 0, g: 0, b: 0 },
                    offsetY: 30,
                    borderThickness: 1,
                },
                focusPointSymbol: {
                    fillColor: '#FFFFFF',
                    fillOpacity: 153,
                    borderColor: '#80808C',
                    opacity: 153,
                    weight: 0.5,
                    radius: 12,
                },
                typhoonSpeeds: [
                    [0.1, 10.7],
                    [10.8, 17.1],
                    [17.2, 24.4],
                    [24.5, 32.6],
                    [32.7, 41.4],
                    [41.5, 50.9],
                    [51, 120],
                ],
                typhoonLevel: ['常态气压', '热带低压', '热带风暴', '强热带风暴', '台风', '强台风', '超强台风'],
                typhoonPointColor: ['#000000', '#02FF02', '#39C7CF', '#FBF9CC', '#FFDE75', '#FF8515', '#FF5252'],
                radius7_style: {
                    color: '#42A53C',
                    fillColor: '#42A53C',
                    opacity: 153,
                    fillOpacity: 153,
                    weight: 1,
                },
                radius10_style: {
                    color: '#42A53C',
                    fillColor: '#42A53C',
                    opacity: 153,
                    fillOpacity: 153,
                    weight: 1,
                },
                radius12_style: {
                    color: '#42A53C',
                    fillColor: '#42A53C',
                    opacity: 153,
                    fillOpacity: 153,
                    weight: 1,
                },
            },
            forecast: {
                clickShowPolygon: { flag: false }, // 是否点击显示预测面
                polygonStyle: {// 预测面样式
                    type: 'SimpleFillSymbol',
                    options: {
                        borderThickness: 2,
                        style: 3,
                        fillColor: { r: 250, g: 224, b: 2, a: 56 },
                        borderColor: { r: 255, g: 192, b: 11, a: 255 },
                    },
                },
                lineStyle: {
                    opacity: 153,
                    width: 2,
                    style: 2,
                },
                org: {
                    中国: {
                        rgb: '#FF0000',
                        display: 1,
                    },
                    中国香港: {
                        rgb: '#FFA500',
                        display: 1,
                    },
                    中国台湾: {
                        rgb: '#FFFF00',
                        display: 0,
                    },
                    日本: {
                        rgb: '#00FF00',
                        display: 1,
                    },
                    美国: {
                        rgb: '#0000FF',
                        display: 1,
                    },
                    韩国: {
                        rgb: '#B97A57',
                        display: 0,
                    },
                    南海: {
                        rgb: '#800080',
                        display: 0,
                    },
                    浙江: {
                        rgb: '#FFC0CB',
                        display: 0,
                    },
                    菲律宾: {
                        rgb: '#22B14C',
                        display: 0,
                    },
                    广东: {
                        rgb: '#4B0082',
                        display: 0,
                    },
                    欧洲: {
                        rgb: '#B5E61D',
                        display: 0,
                    },
                    null: {
                        rgb: '#000000',
                        display: 0,
                    },
                },
            },
            popup: {
                display: 1,
                offset: [-50, 10],
                divStyle: 'display:none;font-size:12px;color:#000 ;background: transparent; margin-top: 8px;margin-left: 10px; margin-right: 0px;',
                liStyle: 'height:20px;margin:2px;',
                pointEPSG: 4326,
                pointPrecision: 3,
                typhoonName: {
                    display: 1,
                    label: '台风名称：',
                    unit: '',
                },
                typhoonNameEn: {
                    display: 1,
                    label: '英文名称：',
                    unit: '',
                },
                typhoonBh: {
                    display: 1,
                    label: '台风编号：',
                    unit: '',
                },
                passTime: {
                    display: 1,
                    label: '过去时间：',
                    unit: '',
                },
                centerPoint: {
                    display: 1,
                    label: '中心位置：',
                    x: '#lon#',
                    y: '#lat#',
                    format: '#lon#E,#lat#N',
                    unit: '',
                },
                centerPressure: {
                    display: 1,
                    label: '中心气压：&nbsp;',
                    unit: '&nbsp;百帕',
                },
                power: {
                    display: 1,
                    label: '最大风力：&nbsp;',
                    unit: '&nbsp;级',
                },
                speed: {
                    display: 1,
                    label: '最大风速：&nbsp;',
                    unit: '米/秒',
                },
                moveSpeed: {
                    display: 1,
                    label: '移动速度：&nbsp;',
                    unit: '公里/小时',
                },
                moveDir: {
                    display: 1,
                    label: '移动方向：&nbsp;',
                    unit: '',
                },
                sevenRingRadius: {
                    display: 1,
                    label: '七级(Km):&nbsp;&nbsp;&nbsp;&nbsp;',
                    unit: '公里',
                },
                tenRingRadius: {
                    display: 1,
                    label: '十级(Km):&nbsp;&nbsp;&nbsp;&nbsp;',
                    unit: '公里',
                },
                twelveRingRadius: {
                    display: 1,
                    label: '十二级(Km):&thinsp;',
                    unit: '公里',
                },
            },
            popupForecast: {
                display: 1,
                offset: [-200, 100],
                divStyle: 'display:none;font-size:12px;color:#000 ;background: transparent; margin-top: 8px;margin-left: 10px; margin-right: 0px;',
                liStyle: 'height:20px;margin:2px;',
                pointEPSG: 4326,
                typhoonName: {
                    display: 1,
                    label: '台风名称：',
                    unit: '',
                },
                typhoonBh: {
                    display: 1,
                    label: '台风编号：',
                    unit: '',
                },
                typhoonNameEn: {
                    display: 1,
                    label: '英文名称：',
                    unit: '',
                },
                org: {
                    display: 1,
                    label: '预报机构：',
                    unit: '',
                },
                arrivalTime: {
                    display: 1,
                    label: '到达时间：',
                    unit: '',
                },
                centerPoint: {
                    display: 1,
                    label: '中心位置：',
                    x: '#lon#',
                    y: '#lat#',
                    format: '#lon#,#lat#',
                    unit: '',
                },
                power: {
                    display: 1,
                    label: '最大风力：&nbsp;',
                    unit: '&nbsp;级',
                },
                speed: {
                    display: 1,
                    label: '最大风速：&nbsp;',
                    unit: '米/秒',
                },
                moveSpeed: {
                    display: 1,
                    label: '移动速度：&nbsp;',
                    unit: '公里/小时',
                },
                moveDir: {
                    display: 1,
                    label: '移动方向：&nbsp;',
                    unit: '',
                },
                centralPressure: {
                    display: 1,
                    label: '中心气压：&nbsp;',
                    unit: '&nbsp;百帕',
                },
            },
            popupLand: {
                display: 1,
                offset: [-200, 100],
                divStyle: 'display:none;font-size:12px;color:#000 ;background: transparent; margin-top: 8px;margin-left: 10px; margin-right: 0px;',
                liStyle: 'height:20px;margin:2px;',
                info: {
                    display: 0,
                    label: '详情：',
                    unit: '',
                },
                landtime: {
                    display: 0,
                    label: '登陆时间：',
                    unit: '',
                },
                landaddress: {
                    display: 0,
                    label: '登陆地址：',
                    unit: '',
                },
                strong: {
                    display: 0,
                    label: '强度：',
                    unit: '',
                },
                lat: {
                    display: 0,
                    label: '纬度：',
                    unit: '',
                },
                lng: {
                    display: 0,
                    label: '经度：',
                    unit: '',
                },
            },
        },
    },
    // 构造
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
    },
    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    loadTyphoonTrack() {
        componentBase.prototype.load.call(this);
        this.initLoadTyphoonTrack();
        //   this.addTyphoonWarningLine();
    },
    unloadTyphoonTrack() {
        this.typhoonDestroy();
        // this.destroyTyphoonWarningLine();
        componentBase.prototype.unload.call(this);
    },
    loadWarningLine() {
        this.addTyphoonWarningLine();
    },
    unloadWarningLine() {
        this.destroyTyphoonWarningLine();
    },
    clear() {
        if (this.typhoonTrack) {
            this.typhoonTrack.clearAll();
        }
        const pLayer = this.map.getLayerById('drawEventPolygon');
        if (pLayer) {
            pLayer.clear();
        }
        $('#gifDiv').remove();
    },
    unload() {
        this.clear();
        // this.unloadTyphoonTrack();
        // this.unloadWarningLine();
        componentBase.prototype.unload.call(this);
    },
    addListeners() {
        console.log('添加监听');
    },
    removeListeners() {
        console.log('移除监听');
    },
    // 获取台风预计影响范围
    getTyphoonInfluence(id: any) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.typhoonTrack.service.getTyphoonInfo({ typhoonid: id }).then(function(tmdata: any) {
                // console.log(tmdata);
                // 最新的预报数据
                const length = tmdata[0].features.length;
                const current = tmdata[0].features[length - 1];
                self.r7radius = 270;
                const pastpointArr = [];
                let itemindex = 0;
                for (const onestep of tmdata[0].features) {
                    if (onestep.properties.radius7_quad &&
                        onestep.properties.radius7_quad.ne > 0) {
                        const RadiusArr = [onestep.properties.radius7_quad.ne,
                        onestep.properties.radius7_quad.se,
                        onestep.properties.radius7_quad.sw,
                        onestep.properties.radius7_quad.nw];
                        self.r7radius = Math.max.apply(null, RadiusArr);
                    }
                    const pastcenter = {
                        x: onestep.geometry.coordinates[0],
                        y: onestep.geometry.coordinates[1],
                    };
                    itemindex++;
                    if (itemindex > 4) {
                        pastpointArr.push(pastcenter);
                    }
                }
                const currentcenter = {
                    x: current.geometry.coordinates[0],
                    y: current.geometry.coordinates[1],
                };
                // if (self._judgeCrossWarnLine(currentcenter)) {// 如果穿过24小时警戒线
                //     console.log('穿过了24小时警戒线');
                // } else {
                //     console.log('没穿过24小时警戒线');
                // }
                const cnforecast = current.properties.forecast.filter((item: any, index: number) => {
                    return item.region === '中国';
                });
                const pointArr = [];
                const forecastpointArr = [];
                for (const item of cnforecast[0].features) {
                    const forecenter = {
                        x: item.geometry.coordinates[0],
                        y: item.geometry.coordinates[1],
                    };
                    forecastpointArr.push(forecenter);
                }
                pointArr.push(currentcenter);
                const center = {
                    type: 'Point',
                    coordinates: [currentcenter.x, currentcenter.y],
                };
                const geom = self._createForecastArea(pointArr, self.r7radius);
                const foregeom = self._createForecastArea(forecastpointArr, self.r7radius);
                const pastgeom = self._createForecastArea(pastpointArr, self.r7radius);
                const geo = {
                    geometry: geom,
                    foregeometry: foregeom,
                    pastgeometry: pastgeom,
                    typhoonRadius: self.r7radius,
                    geom: center,
                    name: tmdata[0].name,
                    address: '',
                    _id: tmdata[0].tfbh,
                };
                resolve(geo);
                self.lastforecast = current.properties.forecast;
                self.currentreporttime = new Date(current.properties.time.replace('T', ' '));
                self.current = current;
            });
        });
    },
    // // 获取点击预测点后的影响面
    // getForecastInfluence(point: any) {
    //     const geom = this._createForecastArea([point]);
    //     return geom;
    // },
    _createForecastArea(pointArr: any, radius: any) {
        const self = this;
        let bufferOpt = {
            geometry: '',
            radius: 270 * 1000,
        };
        if (pointArr.length === 1) {
            const point = new g2.sfs.Point({
                x: pointArr[0].x * 1,
                y: pointArr[0].y * 1,
                spatialReference: 4326,
            });
            bufferOpt = {
                geometry: point.asWkt(),
                radius: radius * 1000,
            };
        } else {
            const polyline = self._createPolyline(pointArr);
            const tmpgeo = polyline.asWkt();
            bufferOpt = {
                geometry: tmpgeo,
                radius: radius * 1000,
            };
        }
        const geom = G.utils.SpatialOPUtil.getBuffer(bufferOpt);
        return (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(geom).asGeoJson();
    },
    _createPolyline(pointArr: any) {
        const polyline = new g2.sfs.Polyline({
            spatialReference: 4326,
        });
        const path = new g2.sfs.Path({
            spatialReference: 4326,
        });
        for (let i = pointArr.length - 1; i >= 0; --i) {
            const point = new g2.sfs.Point({
                x: pointArr[i].x * 1,
                y: pointArr[i].y * 1,
                spatialReference: 4326,
            });
            path.addPoint(point);
        }
        polyline.addGeometry(path);
        return polyline;
    },
    // 判断是否越过24小时警戒线
    _judgeCrossWarnLine(currentpoi: any) {
        const points = this.options.typhoonAlertLineOptions.points_24h;
        const p1 = currentpoi;
        for (let i = 0; i < points.length - 1; i++) {
            points[i].x = points[i][0];
            points[i].y = points[i][1];
        }
        let judgebool = false;
        // 对每条边都和射线作对比
        for (let i = 0; i < points.length - 1; i++) {
            const p3 = points[i];
            const p4 = points[i + 1];
            if (this._crossJudge(p1, p3, p4) === true) {
                judgebool = true;
            }
            return judgebool;
        }
    },
    // 判断在线段的左侧还是右侧
    _crossJudge(p1: any, p3: any, p4: any) {
        // 计算向量叉乘
        const crossMul = function(v1x: any, v2x: any) {
            return v1x.x * v2x.y - v1x.y * v2x.x;
        };
        const v1 = { x: p1.x - p3.x, y: p1.y - p3.y };
        const v3 = { x: p4.x - p3.x, y: p4.y - p3.y };
        const v = crossMul(v1, v3);
        return v > 0;
    },
    // 加载警戒线
    addTyphoonWarningLine() {
        const options = this.options.typhoonAlertLineOptions;
        const tymap = this.map;
        // 初始化台风预警线
        this.typhoonWariningLine = new (G as any).biz.TyphoonWarningLine({
            map: tymap,
            warningLineParm: options, // 台风警戒线参数
        });
        this.typhoonWariningLine.load();
    },
    // 台风组件初始化,和加载
    initLoadTyphoonTrack() {
        const options = this.options.typhoonTrackOptions;
        options.map = this.map;
        const typhoonService = this.options.service;
        options.service = typhoonService;
        options.pop = typhoonService;
        this.typhoonTrack = new (G as any).biz.TyphoonTrack(options);
        if (this.typhoonTrack && this.typhoonTrack.enable === true) {
            console.log('台风轨迹组件已初始化');
        } else {
            console.log('台风轨迹组件未初始化');
        }
        this.typhoonTrack.load();
        this.registerPopupListner();
    },
    // 注册台风 事件
    registerPopupListner() {
        const self = this;
        // 轨迹点鼠标悬浮事件
        this.typhoonTrack.on('mouseoverTrackPoint', (event: any) => {
            const id = event.id; // popup domid
            const data = event.data;
            // 使用自定义html
            const popupContent = this.getTrackPopUpContent(data, id);
            $('#' + id).replaceWith(popupContent);
            $('#' + id).parents('.ol-overlay-container').css('z-index', '1');
            //   self.fire('focuslistitem', event.data);
        },
        );
        this.typhoonTrack.on('clickTrackPoint', function(event: any) {
            const id = event.id; // popup domid
            const data = event.data;
            self.fire('focuslistitem', event.data);
        });
        // 预测点鼠标悬浮事件
        this.typhoonTrack.on('mousemoveForecastPoint', (event: any) => {
            const id = event.id; // popup domid
            const data = event.data;
            // 使用自定义html
            const popupContent = this.getForecastPopUpContent(data, id);
            $('#' + id).replaceWith(popupContent);
            $('#' + id).parents('.ol-overlay-container').css('z-index', '1');
            //   self.fire('focuslistitem', event.data);
        },
        );
        // 预测点鼠标点击事件
        this.typhoonTrack.on('clickForecastPoint', function(event: any) {
            // 点击预测点后绘制圆圈。调用进入处置。
            // const point = new g2.sfs.Point({
            //     x: event.data.centerPoint.data[0] * 1,
            //     y: event.data.centerPoint.data[1] * 1,
            //     spatialReference: 4326,
            // });
            // self._disposeHandle(point);
            // self.fire('focuslistitem', event.data);
        });
        // 台风播放完成
        this.typhoonTrack.on('typhoonMoveEnd', (event: any) => {
            self.fire('typhoonMoveEnd'); // 前端重新调用进入处置。
            // self.showhighlight([116, 40]);
            // self.changeTimeSlider('12');
        },
        );
        // 登陆点鼠标悬浮事件
        this.typhoonTrack.on('clickLandPoint', (event: any) => {
            const id = event.id; // popup domid
            const data = event.data;
            // self.fire('LandpointPop', {
            //     data, // data[0].element.attributeSet.find('title').value,
            //     containerId: id,
            //     type: 'LandpointPop',
            //   });
            // 使用自定义html
            // 使用自定义html
            //  添加小旗子窗口详情
            const popupContent = this.LoginDetailsBox(data, id);
            $('#' + id).replaceWith(popupContent);
            $('#' + id).parents('.ol-overlay-container').css('z-index', '1');
            // 关闭小旗子窗口
            this.closeLoginDetailsBox();
            const point = new g2.sfs.Point({
                x: event.data.lng.data * 1,
                y: event.data.lat.data * 1,
                spatialReference: 4326,
            });
            self._disposeHandle(point);
        },
        );
        // 登陆点鼠标悬浮事件
        this.typhoonTrack.on('mousemoveLandPoint', (event: any) => {
            const id = event.id; // popup domid
            const data = event.data;
            // 使用自定义html
            // const popupContent = this.LoginDetailsBox(data, id);
            // $('#' + id).replaceWith(popupContent);
        },
        );
    },
    changeTimeSlider(time: any) {
        // 获取时间轴对应的预测点。
        // this.currentreporttime;
        const cnforecast = this.lastforecast.filter((item: any, index: number) => {
            return item.region === '中国';
        });
        const pointArr = [];
        if (cnforecast[0] && time > 0) {
            for (const item of cnforecast[0].features) {
                const tmptime = new Date(item.properties.time.replace('T', ' '));
                const timeDiff = ((tmptime as any) - this.currentreporttime) / (1000 * 60 * 60);
                if (timeDiff > time) {
                    pointArr.push(item);
                }
            }
        } else if (time === 0) {
            pointArr.push(this.current);
        }
        if (pointArr[0]) {
            // 进入处置
            const point = new g2.sfs.Point({
                x: pointArr[0].geometry.coordinates[0] * 1,
                y: pointArr[0].geometry.coordinates[1] * 1,
                spatialReference: 4326,
            });
            this._disposeHandle(point);
        } else {
            this.fire('nodata');
        }
    },
    // 进入处置
    _disposeHandle(xy: any) {
        // const point = new g2.sfs.Point({
        //     x: xy.x * 1,
        //     y: xy.y * 1,
        //     spatialReference: 4326,
        // });
        // const geom = this._createForecastArea([point], this.r7radius);
        // const geo = {
        //     geometry: geom,
        //     geom: point.asGeoJson(),
        //       name: '',
        //       address: '',
        //       _id: '',
        //   };
        // this.fire('clickForecastPoint', geo); // 前端重新调用进入处置。
    },
    showPopup(id: any) {
        this.popupManager.clear();
        this.popupManager.addSimple({
            id: this.options.popupEventId,
            anchor: null,
            className: 'com-typhoon-detail',
        }).then((content: any) => {
            this.fire(this.options.fireAddPopupEventId, {
                data: 'attributeObj', // data[0].element.attributeSet.find('title').value,
                containerId: content.containerId,
                type: 'dispatchAdvice',
            });
        });
    },
    showhighlight(xy: any) {
        const symbolMapper: any = SymbolMap.TYPHOONFOCUS;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        const id = 'pointClink';
        const options = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [parseFloat(xy[0]), parseFloat(xy[1])],
                },
            },
            style: symbolObj,
            blink: {
                enable: false,
            },
        };
        this.options.featureHighlight.addHighlight(id, options);
    },
    hidehighlight() {
        console.log();
        this.options.featureHighlight.clearHighlight();
    },
    // 台风点弹窗
    getTrackPopUpContent(data: any, id: any) {
        const obj = {
            windNameList: {
                label: '风圈半径：&nbsp;&nbsp;',
                data: { ne: '东北', se: '东南', nw: '西北', sw: '西南' },
            },
        };
        // if (data.radius7.label.indexOf('七级风圈半径') !== -1) {
        //     data.radius7.label = '七级(Km)';
        // }
        // if (data.radius10.label.indexOf('十级风圈半径') !== -1) {
        //     data.radius10.label = '十级(Km)';
        // }
        // if (data.radius12.label.indexOf('十二级风圈半径') !== -1) {
        //     data.radius12.label = '十二级(Km)';
        // }
        data.windNameList = obj.windNameList;
        let popupContent = '<div class="com-typhoon-detail" id="' + id + '"><div class="com-typhoon-detail_yuCeTitle"><div>台风信息</div></div>' + '<ul >';
        // popupContent += this.getLiHtml(data.typhoonBh); // 台风编号
        // popupContent += this.getLiHtml(data.typhoonName); // 台风名称
        popupContent += this.getLiHtmlListName(data);
        popupContent += this.getLiHtml(data.passTime); // 过去时间
        popupContent += this.getLiHtml(data.centerPoint); // 中心位置
        popupContent += this.getLiHtml(data.power); // 最大风力
        popupContent += this.getLiHtml(data.speed); // 最大风速
        popupContent += this.getLiHtml(data.centerPressure); // 中心气压
        popupContent += this.getLiHtml(data.moveSpeed); // 移动速度
        popupContent += this.getLiHtml(data.moveDir); // "移动方向
        popupContent += this.getLiHtmlList(data.windNameList); // "七级风圈半径
        popupContent += this.getLiHtmlList(data.radius7); // "七级风圈半径
        popupContent += this.getLiHtmlList(data.radius10); // "十级风圈半径
        popupContent += this.getLiHtmlList(data.radius12); // "十级风圈半径
        popupContent += '</ul ><div class="com-typhoon-detail_footer"></div></div>';
        return popupContent;
    },
    // 预测点弹窗
    getForecastPopUpContent(data: any, id: any) {
        console.log(data);
        let popupContent = '<div class="com-typhoon-detail" id="' + id + '"><div class="com-typhoon-detail_yuCeTitle"><div>台风信息</div></div>' + '<ul >';
        const typhoonName = this.getLiHtmlListName(data);
        const forecastOrg = this.getLiHtml(data.forecastOrg); // 预报机构
        const arrivalTime = this.getLiHtml(data.arrivalTime); // 到达时间
        const centerPoint = this.getLiHtml(data.centerPoint); // 中心位置
        const power = this.getLiHtml(data.power); // 最大风力
        const speed = this.getLiHtml(data.speed); // 最大风速
        const centralPressure = this.getLiHtml(data.centralPressure); // 中心气压
        const moveSpeed = this.getLiHtml(data.moveSpeed); // 移动速度
        const moveDir = this.getLiHtml(data.moveDir); // 移动方向
        popupContent = popupContent + typhoonName + forecastOrg + arrivalTime + centerPoint + power + speed + centralPressure + moveSpeed + moveDir + '</ul ><div class="com-typhoon-detail_footer"></div></div>';
        return popupContent;
    },
    // 小旗子窗口
    LoginDetailsBox(data: any, id: any) {
        // console.log(data);
        const dialongName = data.landaddress.data;
        let popupContent = '<div class="com-typhoon-detail-DetailsBox" id="' + id + '"><div class="com-typhoon-detail_yuCeTitle"><div><span>登陆点：</span><span class="title_sy" title=' + dialongName + '>' + dialongName + '</span></div><i id="close-enterprise-dialog" class="close-enterprise-dialog"></i></div>' + '<ul >';
        popupContent += this.getLiHtmlName(data.landtime); // 过去时间
        popupContent += this.getLiHtmlName(data.landaddress); // 中心位置
        popupContent += '</ul ><div class="com-typhoon-detail_footer"></div></div>';
        return popupContent;
    },
    closeLoginDetailsBox() {
        // 关闭小旗子窗口
        $('#close-enterprise-dialog.close-enterprise-dialog').off('click');
        $('#close-enterprise-dialog.close-enterprise-dialog').on('click', function() {
            // console.debug('小旗子关闭进来了');
            $('.com-typhoon-detail-DetailsBox').hide();
            // console.debug('小旗子关闭出来了');
        });
    },
    getLiHtml(data: any) {
        let unit = data.unit ? data.unit : '';
        const dataList = data.data ? data.data : '暂无数据';
        if (dataList === '暂无数据') {
            unit = '';
        }
        const context = '<li>' + data.label + dataList + unit + '</li>';
        return context;
    },
    getLiHtmlName(data: any) {
        let unit = data.unit ? data.unit : '';
        const dataList = data.data ? data.data : '暂无数据';
        if (dataList === '暂无数据') {
            unit = '';
        }
        const context = '<li class="listSpecial"><div class="listName_label">' + data.label + '</div><div class="listName">' + dataList + '</div>' + '</li>';
        return context;
    },
    getLiHtmlList(data: any) {
        const unit = data.unit ? data.unit : '';
        const context = '<li>' + data.label + '<span>' + data.data.ne + '</span>' + '<span>' + data.data.se + '</span>' + '<span>' + data.data.sw + '</span>' + '<span>' + data.data.nw + '</span>' + '</li>';
        return context;
    },
    getLiHtmlListName(data: any) {
        const typhoonBh = data.typhoonBh.data ? data.typhoonBh.data : '';
        const typhoonName = data.typhoonName.data ? data.typhoonName.data : '';
        const typhoonNameEn = data.typhoonNameEn.data ? data.typhoonNameEn.data : '';
        const context = '<li class="listName">' + '<span>' + typhoonBh + '</span>' + '<span>' + typhoonName + '</span>' + '<span>' + typhoonNameEn + '</span>' + '</li>';
        return context;
    },
    // 获取年度台风列表
    getTyphoonList(year: string) {
        this.typhoonTrack.service.getTyphoonsByYear({ year: '2018' }).then(function(data: any) {
            console.log(data);
        });
    },
    // 加载指定当前台风
    addTyphoon(id: string, isSelect: boolean) {
        if (isSelect) {
            //   this.getTyphoonInfluence(id).then((data: any) => {
            //     console.log(data, '台风影响面');
            //   });
            this.typhoonTrack.loadOneTyphoon(id, true, false, { land: { show: true }, showForecast: { show: true } }).then(() => {
                this.typhoonTrack.getExtentById(id).then((extent: any) => {
                    const newextent = new g2.sfs.Envelope({});
                    newextent.minx = extent[0];
                    newextent.maxx = extent[2];
                    newextent.miny = extent[1];
                    newextent.maxy = extent[3];
                    this.map.pan(newextent, [200, 200, 500, 200]);
                });
                this.typhoonTrack.playOneTyphoon(id, null, null, null, { show: true, type: '中国' }); // 播放台风
            });
        } else {
            this.typhoonTrack.removeOneTyphoon(id);
        }
    },
    playoneTyphoon(id: any) {
        this.typhoonTrack.getExtentById(id).then((extent: any) => {
            const newextent = new g2.sfs.Envelope({});
            newextent.minx = extent[0];
            newextent.maxx = extent[2];
            newextent.miny = extent[1];
            newextent.maxy = extent[3];
            this.map.pan(newextent, [200, 200, 500, 200]);
        });
        this.typhoonTrack.playOneTyphoon(id, 100, null, null, { show: false, type: '中国' });
    },
    pauseTyphoon(id: any, playflag: any) {
        this.typhoonTrack.pausePlay(playflag, id);
    },
    clearAll() {
        if (this.typhoonTrack) {
            this.typhoonTrack.clearAll();
        }
    },
    // 台风组件销毁
    typhoonDestroy() {
        if (this.typhoonTrack) {
            this.typhoonTrack.destroy();
        }
    },
    // 警戒线组件销毁
    destroyTyphoonWarningLine() {
        if (this.typhoonWariningLine) {
            this.typhoonWariningLine.destroy();
        }
        this.typhoonWariningLine = null;
    },
    // 显示隐藏影响的风圈
    showhideCircle(visible: boolean = false) {
        this.options.simpleRenderMgr.setVisible('drawEventPolygon', visible);
        if (visible) {
            this.toolTipWare.clear();
        }
    },
});
export default TyphoonComponent;
