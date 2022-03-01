const componentBase = (G as any).base.ComponentBase;
const AreaLengthMeasure = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        // 三维地图
        globe: null,
    },
    // 初始化
    initialize(options: any) {
        const self = this;
        componentBase.prototype.initialize.call(this, options);
    },
    /**
     * 加载
     * @param opts {Object}
     * @param opts.globe {Object}
     */
    load(opts: any) {
        const self = this;
        if (!this.isLoaded()) {
            if (opts.globe) {
                this.options.globe = opts.globe;
                this.loaded = true;
            }
            if (!this.measureComponent) {
                const lengthTipFn: any = (type: any, length: any) => {
                    if (!isNaN(length)) {
                        length = (length / 1000).toFixed(2);
                    }
                    const createHtmlFn: any = {
                        // 起点
                        start() {
                            return '起点';
                        },
                        // 中间点
                        node(length1: any) {
                            return '<span style="color:orange">' + length1 + '</span>公里';
                        },
                        // 终点
                        end(length1: any) {
                            return '总长:<span style="color:orange">' + length1 + '</span>公里';
                        },
                    };
                    const fn = createHtmlFn[type];
                    if (Object.prototype.toString.call(fn) === '[object Function]') {
                        return createHtmlFn[(type)](length);
                    }
                };
                // 测面积的显示内容，需返回要显示的html字符串
                const areaTipFn: any = (length: any, area: any) => {
                    length = (length / 1000).toFixed(2);
                    area = (area / 1000000).toFixed(2);
                    return '周长:<span style="color:orange">'
                        + length + '</span>公里 <br/>面积:<span style="color:orange">'
                        + area + '</span>平方公里';
                };
                // 预先创建测量图层-可选
                const measureLayerId: string = 'measure-layer';
                // 测量组件
                this.measureComponent = new G.common.Measure3D({
                    layerId: measureLayerId,
                    map: this.getGlobe(),
                    styleName: ['emap-measure-node-tooltip', 'emap-measure-tooltip'],
                    lengthTipFn,
                    areaTipFn,
                });
                const measureLayer = G.utils.LayerUtil.getLayerById(this.getGlobe(), measureLayerId);
                const drawLayer = G.utils.LayerUtil.getLayerById(this.getGlobe(), measureLayerId + '-draw');
                measureLayer.setZIndex(101);
                drawLayer.setZIndex(101);
            }
            this.addListeners();
        }
    },
    // 卸载
    unload() {
        if (this.isLoaded()) {
            this.removeListeners();
            componentBase.prototype.unload.call(this);
        }
    },

    addListeners() {
        // console.debug('监听三维坡度');
        if (this.map) {
            this.map.listen(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
        }
    },

    removeListeners() {
        // console.debug('取消监听三维坡度');
        if (this.map) {
            this.map.off(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
        }
    },
    // 清屏事件
    onClearMap() {
        this.measureComponent.cancel();
        this.measureComponent.clear();
    },
    getGlobe() {
        return this.options.globe;
    },
    measureLength() {
        if (!this.isLoaded()) {
            return;
        }
        this.measureComponent.cancel();
        this.measureComponent.measureLength();
    },
    measureArea() {
        if (!this.isLoaded()) {
            return;
        }
        this.measureComponent.cancel();
        this.measureComponent.measureArea();
    },
});
export default AreaLengthMeasure;

