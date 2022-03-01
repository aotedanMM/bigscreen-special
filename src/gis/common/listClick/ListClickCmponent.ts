import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
// 列表点击组件
const componentBase = (G as any).base.ComponentBase;
const ListClickCmponent = componentBase.extend({
    options: {
        symbolConfig: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        // 弹出框类型
        popupType: 'ANJIAN_REPERTORY※01',
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.popupManager = options.popupManager;
        this.featureLocate = options.featureLocate;
        this.featureHighlight = options.featureHighlight;
        this.featureTypeSet = {};
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
    },
    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        //
        this.clearAllResourceLayer();
        componentBase.prototype.unload.call(this);
    },
    // 加载数据
    addPointsOnMap(data: any, codeKey: any) {
        this.simpleRenderMgr.remove(codeKey + '_layer');
        this._addPoint(data, codeKey);
        this.location(data.geom);
        // 弹出框
        this.addPopup(data, data.geom.coordinates);
    },
    _addPoint(data: any, codeKey: any) {
        const symbolMapper: any = SymbolMap.DEFAULT;
        const self = this;
        const opts1: any = {
            featureType: codeKey + '_layer',
            featureName: codeKey + '_layer',
            idField: '_id',
            list: [data],
            type: 0,
            geometryBuilder: null,
            symbolBuilder: null,
        };
        opts1.geometryBuilder = new (G as any).utils.GeometryBuilder({
            geometryField: ['geom'],
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
                this.addPopup(data2, [element.geometry.x, element.geometry.y], false);
            },
        };
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build() {
                // 根据数据属性控制不同的显示效果
                const symbolObj: any = Util.toJSON(symbolMapper.symbol);
                symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn(codeKey, data)];
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opts1.symbolBuilder = new SymbolBuilder();
        this.simpleRenderMgr.add(opts1);
        this.featureTypeSet[codeKey + '_layer'] = true;
    },
    addPopup(data: any, coordinate: any, noneMouseClick: any = true) {
        this.closePopup();
        const popupOptions: any = {
            id: 'popup_ResourcePoints',
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: 'popup_ResourcePoints',
        };
        if (noneMouseClick) {
            popupOptions.autoPanTimeout = 1200;
        }
        this.popupManager.addSimple(popupOptions).then((content: any) => {
            const event: any = {
                type: this.options.popupType,
                data,
                containerId: content.containerId,
                id: content.containerId,
            };
            console.debug(event);
            this.fire('ReposityPopup', event);
        });
    },
    closePopup() {
        this.popupManager.remove('popup_ResourcePoints');
    },
    /**
    * 清除弹出框
    */
    clearPopup() {
        // todo
        this.popupManager.remove('popup_ResourcePoints');
    },
    _showHighlight(codeKey: string, coordinate: any) {
        const symbolMapper: any = SymbolMap.DEFAULT;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(codeKey)];
        const id = 'pointClink';
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
    // 清除所有图层
    clearAllResourceLayer() {
        for (const featureType of Object.keys(this.featureTypeSet)) {
            this.options.simpleRenderMgr.remove(featureType);
        }
        this.featureTypeSet = {};
        this.closePopup();
    },
    // 清除一个图层
    clearOneLayer(codeKey: any) {
        this.simpleRenderMgr.remove(codeKey + '_layer');
        this.closePopup();
    },
    // 定位
    location(geojson: any) {
        const arr = [];
        const sim = {
            type: 'wkt',
            geom: g2.sfs.GeometryFactory.createGeometryFromGeoJson(geojson).asWkt(),
        };
        arr.push(sim);
        this.featureLocate.fit(arr);
    },

});
export default ListClickCmponent;
