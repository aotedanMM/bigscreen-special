
import Util from '../../../../Util';
import SymbolMap from '../SymbolMap';
const componentBase = (G as any).base.ComponentBase;
const FireCarHistoryCmponent = componentBase.extend({
    options: {
        symbolConfig: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        simpleRenderMgr: null,
        popupId: 'popup_FireCarPoints', // 弹窗唯一标识
        highLightId: 'FireCarPoints_hl', // 高亮id
        fireAddPopupEventId: 'popup_FireCarPoints', // 添加弹窗后执行事件id
        featureType: 'FireCarPoints',

    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.popupManager = options.popupManager;
        this.featureLocate = options.featureLocate;
        this.featureHighlight = options.featureHighlight;
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.realTimeCar = options.realTimeCar;
    },
    addPoint(data: any) {
        this.load(data);
    },
    // 加载{}
    load(data: any) {
        componentBase.prototype.load.call(this);
        this._addPointsOnMap(data, 'FireCar');
    },
    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        this.removeFireCarLayer();
        this.hideHighlight();
        this.closePopup();
        componentBase.prototype.unload.call(this);
    },
    openPopup(id: any) {
        const layer: any = this.options.simpleRenderMgr.getLayer(this.options.featureType);
        const ele: any = layer.find(id);
        if (ele) {
            const data: any = Util.attributeSet2Object(ele.attributeSet);
            const coordinate: any = [ele.geometry.x, ele.geometry.y];
            this._location(coordinate);
            this._openPopup(data, coordinate);
        }
    },
    // 关闭弹窗
    closePopup() {
        this.popupManager.remove(this.options.popupId);
    },

    // 加载数据
    _addPointsOnMap(data: any, codeKey: any) {
        this.simpleRenderMgr.remove(this.options.featureType);
        const symbolMapper: any = SymbolMap.firecar;
        const self = this;
        const opts1: any = {
            featureType: this.options.featureType,
            featureName: 'FireCar_layer',
            idField: '_id',
            list: data,
            type: 3,
        };
        opts1.geometryBuilder = new (G as any).utils.GeometryBuilder({
            geometryField: ['LON', 'LAT'],
        });
        opts1.listeners = {
            click: (clickdata: any) => {
                const element = clickdata[0].element;
                this._showHighlight(codeKey, [element.geometry.x, element.geometry.y]);
                // this指向监听时的context变量
                const attributeSet: any = element.attributeSet;
                const data2: any = {};
                for (let i = 0; i < attributeSet.getCount(); i++) {
                    const attribute = attributeSet.getItem(i);
                    data2[attribute.name] = attribute.value;
                }
                this._openPopup(data2, [element.geometry.x, element.geometry.y]);
            },
        };
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build() {
                console.log(codeKey + '_img');
                // 根据数据属性控制不同的显示效果
                const symbolObj = Util.toJSON(symbolMapper.symbol);
                symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn(codeKey)];
                // symbol = new (G as any).utils.RenderUtil.object2Symbol(symbolObj);

                // const iconKey = self.options.symbolConfig.icons[codeKey + '_img'];
                // const symbolObj = {
                //     width: 80,
                //     height: 80,
                //     offsetX: 40,
                //     offsetY: 0,
                //     opacity: '1',
                //     rotation: '0',
                //     source: iconKey,
                // };
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
            buildClusterStyle() {
                // 根据数据属性控制不同的显示效果
                return {
                    distance: 30,
                    textFillColor: [255, 255, 255, 1],
                    fillColor: [200, 0, 0, 0.5],
                    fillStrokeColor: [200, 0, 0, 0.5],
                    fillStrokeWidth: 10,
                    visible: true,
                    opacity: 1,
                    zIndex: 0,
                    clusterLevel: 10,
                };
            },
        });
        opts1.symbolBuilder = new SymbolBuilder();
        this.simpleRenderMgr.add(opts1);
    },
    // 打开弹窗
    _openPopup(data: any, coordinate: any) {
        this.closePopup();
        this.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: '',
            autoPanTimeout: 1200,
            autoPanMargin: 90,
        }).then((content: any) => {
            const event: any = {
                type: 'fireCar',
                data,
                containerId: content.containerId,
                id: content.containerId,
            };
            console.debug(event);
            this.fire(this.options.fireAddPopupEventId, event);
        });
    },
    // 高亮
    _showHighlight(codeKey: string, coordinate: any) {
        const symbolMapper: any = SymbolMap.firecar;
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(codeKey)];
        // const iconKey = this.options.symbolConfig.icons[codeKey + '_img'];
        const id = this.options.highLightId;
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
        this.featureHighlight.addHighlight(id, options);
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 清除实时车辆图层一个图层
    removeFireCarLayer() {
        this.simpleRenderMgr.remove(this.options.featureType);
    },
    locate(coordinate: any) {
        this._location(coordinate);
    },
    // 定位
    _location(coordinate: any) {
        const arr = [];
        const sim = {
            type: 'geojson',
            geom: {
                type: 'Point',
                coordinates: coordinate,
            },
        };
        arr.push(sim);
        this.options.featureLocate.fit(arr, {
            maxZoom: 15, // this.map.getZoomLevel(),
        });
    },
    remove() {
        this.removeFireCarLayer();
    },
});
export default FireCarHistoryCmponent;
