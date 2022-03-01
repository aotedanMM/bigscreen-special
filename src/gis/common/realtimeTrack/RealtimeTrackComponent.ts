
/**
 * 实时轨迹
 * 定义轨迹的展示流程
 * 地图上展示轨迹、起始点、驻地及实时位置等
 */
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
    options: {
        simpleRenderMgr: null,
        featureLocate: null,
        featureHighlight: null,
        popupManager: null,
        // 驻地
        station: {
            symbol: {},
            point: [0, 0],
        },
        // 初始位置
        origin: {
            symbol: {},
            point: [0, 0],
        },
        // 终点位置
        destination: {
            symbol: {},
            point: [0, 0],
        },
        // 轨迹更新器
        trackUpdater: null,
        // 路径规划
        trackRouter: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
    },
    /**
     * 加载
     */
    load() {
        componentBase.prototype.load.call(this);
        // 图层初始化
        // 轨迹更新
        this.options.trackUpdater.setHandler(this);
        this.options.trackUpdater.start();
    },

    // 卸载
    unload() {
        this.options.trackUpdater.stop();
        this.options.trackUpdater.setHandler(null);
        this.options.trackRouter.clear();
        // 图层清除
        //
        componentBase.prototype.unload.call(this);
    },


    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },

    /**
     * 轨迹定时更新的回调，实现 ITrackUpateHandler
     * @param data {Object}
     */
    onTrackUpdate(data: any) {
        // todo
        console.debug('更新轨迹 >>>> ', data);
        // 调用更新路径规划
        this.options.trackRouter.update({
            id: this.options.id,
            startPoint: [],
            endPoint: [],
        });
    },

    /**
     * 路径更新的回调处理
     * @param data {Object}
     * @param data.distance {Number} 距离
     * @param data.time {Number} 耗时
     * @param data.route {Array} 路径
     */
    onRouteUpdate(data: any) {
        // todo 这里拿到规划的路径，展示提示框
    },
});
export default component;
