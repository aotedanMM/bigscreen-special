// 资源分析公共组件
const componentBase = (G as any).base.ComponentBase;
const WeatherElementCmponent = componentBase.extend({
    options: {
        symbolConfig: null,
        featureLocate: null,
        publishObjectPath: null,

    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.featureLocate = options.featureLocate;
        this.publishObjectPath = options.publishObjectPath;
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
        componentBase.prototype.unload.call(this);
    },

});
export default WeatherElementCmponent;
