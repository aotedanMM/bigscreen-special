import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';

const componentBase = (G as any).base.ComponentBase;


const Weather = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        symbolConfig: null,
        eventInfo: null,
        simpleRenderMgr: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        featureType: 'weatherpoints',
        featureHlId: 'weatherHighlight',
        popupEventId: 'popup',
        service: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.featureLocate = options.featureLocate;
        this.featureHighlight = options.featureHighlight;
        this.popupManager = options.popupManager;
        this.symbolConfig = options.symbolConfig;
        this.weatherService = options.service;
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
        this.showWeather();
    },
    // 销毁
    destroy() {
        this.simpleRenderMgr = null;
        this.featureLocate = null;
        this.featureHighlight = null;
        this.symbolConfig = null;
        this.popupManager = null;
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        this.clear();
        componentBase.prototype.unload.call(this);
    },

    clear() {
        this.simpleRenderMgr.remove(this.options.featureType);
        this.featureHighlight.removeHighlight(this.options.featureHlId);
        this.closePopup();
    },

    searchWeather(opt: any) {
        return this.weatherService.getDistrictsWeather(opt);
    },

    // 转换数据格式
    transferWeatherList(weatherList: any) {
        const keys = Object.keys(weatherList);
        const datas: any = [];
        keys.forEach((key: any) => {
            const polygon: any = new g2.sfs.Polygon({ spatialReference: 4490 });
            const ring: any = new g2.sfs.LinearRing({ spatialReference: 4490 });
            const value: any = weatherList[key];
            const geojsonGeo = value.geom;
            const coordinates = geojsonGeo.coordinates[0][0];
            for (let i = 0, len = coordinates.length; i < len; i++) {
                const point = new g2.sfs.Point({
                    x: coordinates[i][0],
                    y: coordinates[i][1],
                    spatialReference: 4326,
                });
                ring.addPoint(point);
            }
            polygon.addGeometry(ring);
            const center = polygon.getBaryCenter();
            value.lon = center.x;
            value.lat = center.y;
            value.districtCode = key;
            datas.push(value);  // 返回每一个行政区划中心点与每一个行政区划的id
        });
        return datas;
    },

    /**
     * 显示所有天气
     * @param point
     * @param range
     */
    showWeather() {
        const that = this;
        // 天气接口测试
        const point: any = this.options.eventInfo.getPoint();
        const geojson: any = this.options.eventInfo.getMaxRangeGeometry();
        // const geojsonStr = JSON.str
        const opt: any = {
            point,
            geometry: geojson,
        };
        const symbolMapper: any = SymbolMap.WEATHER;
        this.searchWeather(opt).then((weatherList: any) => {
            that.simpleRenderMgr.remove(this.options.featureType);
            const opt11: any = {};
            opt11.featureType = this.options.featureType; // 指定数据类型
            opt11.featureName = '天气点'; // 数据类型说明
            // opt11.idField = 'id'; // 数据唯一标识的属性------待根据天气结果而定
            const newList = this.transferWeatherList(weatherList);
            opt11.list = newList; // 数据列表
            opt11.type = 0; // 使用元素渲染
            opt11.idField = 'districtCode';
            opt11.geometryBuilder = new (G as any).utils.GeometryBuilder({
                geometryField: ['lon', 'lat'],
            });
            const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
                build: (builddata: any) => {
                    // console.log(builddata.weather);
                    let weatherkey = builddata.weather;
                    let symbolObj: any = null;
                    // console.debug(builddata);
                    // 根据数据属性控制不同的显示效果
                    if (builddata.weather === '该行政区划无对应气象信息！') {
                        weatherkey = 'weather_img';
                    } else if (weatherkey[0] !== 'd') {
                        weatherkey = 'd' + weatherkey;
                    }
                    symbolObj = Util.toJSON(symbolMapper.symbol);
                    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(weatherkey)];
                    return G.utils.RenderUtil.object2Symbol(symbolObj);
                },
            });
            opt11.symbolBuilder = new SymbolBuilder();
            opt11.listeners = {
                click: (clickdata: any) => {
                    const element = clickdata[0].element;
                    this._showHighlight([element.geometry.x, element.geometry.y], Util.attributeSet2Object(element.attributeSet)); // 高亮显示
                    // this指向监听时的context变量
                    const attributeSet: any = element.attributeSet;
                    const data: any = {};
                    for (let i = 0; i < attributeSet.getCount(); i++) {
                        const attribute = attributeSet.getItem(i);
                        data[attribute.name] = attribute.value;
                    }
                    data.layerId = 'weatherpoints';
                    this._openPopup(data, [element.geometry.x, element.geometry.y]);
                },
            };
            that.simpleRenderMgr.add(opt11);
        });
    },


    openPopup(id: any) {
        let data: any = null;
        this.simpleRenderMgr.visitFeature(this.options.featureType, {
            visit: (element: any, layer: any) => {
                if (element.id === id) {
                    data = Util.attributeSet2Object(element.attributeSet);
                    return false;
                }
                return true;
            },
        });
        if (data) {
            const geom = {
                type: 'Point',
                coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
            };
            const pointdata: any = {
                type: 'geojson',
                geom,
            };
            this.featureLocate.fit(pointdata); // 实现定位
            this._showHighlight(geom.coordinates, data); // 显示动画
            this._openPopup(data, geom.coordinates); // 添加弹出框
        }
    },

    closePopup() {
        this.popupManager.remove('popup_WeatherPoints');
    },

    _showHighlight(coordinate: any, data: any) {
        const symbolMapper: any = SymbolMap.WEATHER;
        let weatherkey = data.weather;
        // let symbolObj: any = null;
        // console.debug(builddata);
        // 根据数据属性控制不同的显示效果
        if (data.weather === '该行政区划无对应气象信息！') {
            weatherkey = 'weather_img';
        } else if (weatherkey[0] !== 'd') {
            weatherkey = 'd' + weatherkey;
        }
        const symbolObj = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(weatherkey)];
        const options = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
                },
            },
            style: symbolObj,
        };
        this.featureHighlight.addHighlight(this.options.featureHlId, options);
    },

    _openPopup(data: any, coordinate: any) {
        this.closePopup();
        this.popupManager.addSimple({
            id: 'popup_WeatherPoints',
            // anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            anchor: null,
            className: 'WeatherPoints-tooltip',
            layerId: data.layerId,
        }).then((content: any) => {
            this.fire(this.options.popupEventId, {
                type: 'localWeather',
                data,
                content,
            });
        });
    },

});
export default Weather;

