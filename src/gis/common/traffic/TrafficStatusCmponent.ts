// 资源分析公共组件
import Util from '../../Util';
const componentBase = (G as any).base.ComponentBase;
const TrafficStatusCmponent = componentBase.extend({
    options: {
        map: null,
        symbolConfig: null,
        simpleRenderMgr: null,
        featureLocate: null,
        popupManager: null,
        featureType: 'traffic-status',
        popupId: 'traffic-status-popup',
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
        this.list = [];
    },
    /**
     *
     * @param type {String} jtgz = 交通管制，dlsh = 道路损毁，lstd = 绿色通道，
     * @param data
     */
    load(type: any, data: any) {
        componentBase.prototype.load.call(this);
        //
        this.list = data;
        let index: any = 0;
        for (const item of this.list) {
            item.lineId = index;
            index++;
        }
        this._add(type, this.list);
        this._fitBounds();
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
        //
        this.options.simpleRenderMgr.remove(this.options.featureType);
        this._closePopup();
    },
    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    /**
     * 定位、弹出详情框
     * @param index  道路的索引号，从0开始
     */
    locate(index: any) {
        this._closePopup();
        const layer: any = this.options.simpleRenderMgr.getLayer(this.options.featureType);
        const element: any = layer.get(index);
        if (element) {
            const arr = [];
            const sim = {
                type: 'wkt',
                geom: element.geometry.asWkt(),
            };
            arr.push(sim);
            this.options.featureLocate.fit(arr);

            this._openPopup(element);
        }
    },

    _add(type: any , data: any) {
        const symbolObj: any = this.options.symbolConfig.symbols.common.roadStatus[type];
        const ploylineSymbolHighLight = (G as any).utils.RenderUtil.object2Symbol(symbolObj.ploylineSymbolHighLight);
        const ploylineSymbolRed = (G as any).utils.RenderUtil.object2Symbol(symbolObj.ploylineSymbolRed);
        const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
            lineSymbols: [ ploylineSymbolHighLight, ploylineSymbolRed ],
        });
        const dataList: any = data;
        const SymbolBuilder = G.utils.SymbolBuilder.extend({
            build: () => {
                return ploylineCombSymbolRed;
            },
        });
        const opts = {
            featureType: this.options.featureType,
            featureName: '交通情况',
            idField: 'id',
            list: dataList,
            geometryBuilder: new G.utils.GeometryBuilder({ geometryField: ['geom'] }),
            symbolBuilder:  new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
    },

    _fitBounds() {
        const extent: any = this.options.simpleRenderMgr.getExtent(this.options.featureType);
        const sim: any = {
            type: 'geojson',
            geom: extent.asGeoJson(),
        };
        this.options.featureLocate.fit(sim, {
            maxZoom: this.map.getZoomLevel(),
        });
    },

    _openPopup(element: any) {
        const json: any = element.geometry.asGeoJson();
        let line: any = null;
        if (json.type === 'MultiLineString') {
            line = json.coordinates[0];
        } else {
            line = json.coordinates;
        }
        const point: any = line[Math.ceil(line.length / 2)];
        this.options.popupManager.addSimple({
            id: this.options.popupId,
            anchor: point,
            className: '',
        }).then((content: any) => {
            const data: any = Util.attributeSet2Object(element.attributeSet);
            const eventData: any = {
                type: this.options.featureType,
                content,
                data,
            };
            this.fire('popup', eventData);
            // 测试
            // jQuery('#' + content.containerId).append('<b>省分发付付付付付付付付付付付付付</b>');
        });
    },

    _closePopup() {
        this.options.popupManager.remove(this.options.popupId);
    },

    closePopup() {
        this.options.popupManager.remove(this.options.popupId);
    },
});
export default TrafficStatusCmponent;
