// 城市选择器组件
const componentBase = (G as any).base.ComponentBase;
const drawUtils = componentBase.extend({
    options: {

    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
    },
    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    selectDisAllByCode(distcode: any) {
        alert(distcode);
    },
});
export default drawUtils;
