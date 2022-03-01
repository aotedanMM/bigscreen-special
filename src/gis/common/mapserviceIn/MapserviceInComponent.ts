const componentBase = G.base.ComponentBase;
import BaseLayer from './layers/BaseLayer';
import Layers from './layers/index';
const MapserviceInComponent = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        serviceConfig: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.layerCol = {};
        this.configLayer = {};
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
    },

    unload() {
        // this.clear(); // 清所有图层
        componentBase.prototype.unload.call(this);
    },

    /**
     * 添加图层
     * @param id {String} 必填
     * @param params {Object} 可选
     * @param params.clickEventName {string} 可选
     */
    addLayer(id: any, params: any) {
        const self = this;
        console.debug(`叠加图层：${id}`, params);
        this._removeLayerIfExist(id);
        const Clazz: any = Layers[id];
        if (Clazz) {
            const layer: BaseLayer = new Clazz(this.map, this.options);
            if (params && params.clickEventName) {
                layer.on(params.clickEventName, (res: any) => {
                    self.fire(params.clickEventName, res);
                });
            }
            const paramTemp: any = {};
            Object.assign(paramTemp, params || {});
            paramTemp.serviceConfig = this.options.serviceConfig;
            layer.load(paramTemp);
            this.layerCol[id] = layer;
            this.configLayer[id] = layer;
        }
    },
    /**
     * 移除图层
     * @param id {String} 必填
     */
    removeLayer(id: any) {
        console.debug(`移除图层：${id}`);
        this._removeLayerIfExist(id);
    },

    /**
     * 控制显隐
     * @param id {String}
     * @param visible {Boolean}
     */
    setVisible(id: any, visible: boolean) {
        const layerInstance: BaseLayer = this.layerCol[id];
        if (layerInstance) {
            layerInstance.setVisible(visible);
        }
    },
    /**
     * 获取图层实例
     * @param id {String}
     */
    getLayer(id: string) {
        const layerInstance: BaseLayer = this.layerCol[id];
        if (layerInstance) {
            return layerInstance;
        }
        return null;
    },
    /**
     * 移除所有图层
     */
    clear() {
        console.debug('清除所有图层！');
        for (const layerId of Object.keys(this.layerCol)) {
            const layerInstance: BaseLayer = this.layerCol[layerId];
            if (layerInstance) {
                if (layerInstance.clickEventName) {
                    layerInstance.off(layerInstance.clickEventName);
                }
                layerInstance.destroy();
            }
        }
        this.layerCol = {};
    },
    _removeLayerIfExist(layerId: any) {
        const layerInstance: BaseLayer = this.layerCol[layerId];
        if (layerInstance) {
            if (layerInstance.clickEventName) {
                layerInstance.off(layerInstance.clickEventName);
            }
            layerInstance.destroy();
        }
        delete this.layerCol[layerId];
    },
});
export default MapserviceInComponent;

