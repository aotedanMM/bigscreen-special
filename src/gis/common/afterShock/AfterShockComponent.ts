// 模块的GIS逻辑
// 资源分析公共组件
import Util from '../../Util';
import { SymbolMap } from '../../SymbolConfig';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        simpleRenderMgr: null,
        popupManager: null,
        symbolConfig: null,
        featureLocate: null,
        locateData: null,
        featureType: 'postShockPoint',
        popupId: 'postShockPoint',
        popupEvent: 'popup',
        highLightId: 'postShockPointHl',
    },

    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
    },
    //  销毁
    destroy() {
        this.simpleRenderMgr = null;
        // 取消监听事件
        this.simpleRenderMgr.off('click');
        this.simpleRenderMgr = null;
        // 清除弹窗
        this.popupManager.clear();
        this.popupManager = null;
        componentBase.prototype.destroy.call(this);
    },

    load(shockData: any) {
        this.list = shockData;
        this.options.locateData = shockData;
        this._addShockIconOnMap(this.list);
    },

    unload() {
        this._closePopup();
        this._removeLayer();
        this._removeHighlight();
    },

    openPopup(id: any) {
        this._locate(id);
    },

    closePopup() {
        this._closePopup();
    },

    _addShockIconOnMap(DataList1: any) {
        const symbolMapper: any = SymbolMap.AFTERSHOCK;
        const self = this;
        self.options.simpleRenderMgr.remove(this.options.featureType);
        const opts1: any = {};
        opts1.featureType = this.options.featureType; // 指定数据类型
        opts1.featureName = '地震中心'; // 数据类型说明
        opts1.idField = 'id'; // 数据唯一标识的属性
        opts1.list = DataList1.event.list; // 数据列表
        opts1.type = 1; // 使用feature渲染
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                // 根据数据属性控制不同的显示效果
                const symbolObj: any = Util.toJSON(symbolMapper.symbol);
                symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn('AfterShock')];
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opts1.symbolBuilder = new SymbolBuilder(),
        opts1.listeners = {
            click: (data: any) => {
                // this指向监听时的context变量
                const center: any = data[0].element.geometry;
                const popupData: any = Util.attributeSet2Object(data[0].element.attributeSet);
                this._openPopup(center, popupData);
                this._addHighLight([center.x, center.y]);
            },
        },
        self.options.simpleRenderMgr.add(opts1);
    },

    _locate(id: any) {
        const list = this.options.locateData.event.list;
        let data: any = null;
        for (const listdata of list) {
            if (listdata.id === id) {
                data = listdata;
                break;
            }
        }
        const sim = {
            type: 'wkt',
            geom: 'POINT(' + data.epiLon + ' ' + data.epiLat + ')',
        };
        this.options.featureLocate.fit(sim, {
            maxZoom: this.map.getZoomLevel(),
        });
        const center: any = {
            x: data.epiLon,
            y: data.epiLat,
        };
        const popupMessage: any = {
            address: data.address,
            eClass: data.eClass,
            eDeep: data.eDeep,
            date: data.date,
            time: data.time,
        };
        this._openPopup(center, popupMessage);
        this._addHighLight([center.x, center.y]);
    },
    _closePopup() {
        this.options.popupManager.remove(this.options.popupId);
    },

    _openPopup(center: any, popupMessage: any) {
        const self = this;
        self.options.popupManager.clear();
        self.options.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [center.x, center.y],
            className: 'g2-tooltip',
        }).then((content: any) => {
            const fireData: any = {
                type: this.options.featureType,
                content,
                data: popupMessage,
            };
            console.debug(fireData);
            self.fire('popup', fireData);
        });
    },

    _removeLayer() {
        this.options.simpleRenderMgr.remove(this.options.featureType);
    },

    _addHighLight(coordinate: any) {
        const symbolMapper: any = SymbolMap.AFTERSHOCK;
        const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn('AfterShock')];
        this._removeHighlight();
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
            },
            style: symbolObj,
        };
        // this.featureHighlight.addHighlight(Type, options);
        this.options.featureHighlight.addHighlight(this.options.highLightId, options);
    },

    _removeHighlight() {
        this.options.featureHighlight.removeHighlight(this.options.highLightId);
    },

});

export default component;
