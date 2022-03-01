/**
 * 轨迹的路径规划
 */
export default interface ITrackRouter {

    /**
     * 更新
     * @param opts {Object}
     * @param opts.startPoint {Array} 起点 [x, y]
     * @param opts.midPoints {Array} 途径点数组
     * @param opts.endPoint {Array} 终点 [x, y]
     */
    update(opts: any): void;

    /**
     * 清除
     */
    clear(): void;
}
