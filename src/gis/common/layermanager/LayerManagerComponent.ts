const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        layerManager: null,
        // 过滤掉的图层id
        filterIdMap: {

        },
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        const self = this;
        // 监听图层变化的事件
        this.options.layerManager.on('layer_changed', function(event: { list: any; }) {
            self.updateLayerList(event.list);
        });
    },
    /**
     * 图层数组更新(图层数组传给vue的方法)
     * @param list 图层数组
     */
    updateLayerList(list: any) {
        this.fire('layerManager', {layerList: list});
    },
    /**
     * 设置图层显示隐藏
     * @param layerId 图层id
     * @param isVisible true:显示  false:隐藏
     */
    setLayerShow(layerId: any, isVisible: any) {
        this.options.layerManager.setLayerVisible({
            id: layerId,
            visible: isVisible,
        });
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    // 图层管理初始化
    load() {
        componentBase.prototype.load.call(this);
        const self = this;
        // 监听图层变化的事件
        this.options.layerManager.on('layer_changed', function(event: { list: any; }) {
            self.updateLayerList(event.list);
        });

        this.options.layerManager.getLayerList({
            // 过滤图层
            filter(layer: { name: any; id: any; }) {
                if (self.options.filterIdMap.hasOwnProperty(layer.id)) {
                    return false;
                }
                if (!(/.*[\u4e00-\u9fa5]+.*$/.test(layer.name))) {
                    return false;
                }
                return layer.name && layer.id;
            },
        }).then(function(list: any) {
            self.updateLayerList(list);
        });
    },

    addListeners() {
        this.options.layerManager.on('layer_changed', this.onLayerChange, this);
    },

    unload() {
        componentBase.prototype.unload.call(this);
    },

    removeListeners() {
        // 移除事件监听，unload调用时父类触发
        this.options.layerManager.off('layer_changed', this.onLayerChange, this);
    },

    onLayerChange(event: any) {
        this.updateLayerList(event.list);
    },
});

export default component;
