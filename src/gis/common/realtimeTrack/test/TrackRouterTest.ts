
// 自定义路径规划示例
import ITrackRouter from '../ITrackRouter';
export default class TrackRouter implements ITrackRouter {
    /**
     * 更新
     * @param opts {Object}
     * @param opts.startPoint {Array} 起点 [x, y]
     * @param opts.midPoints {Array} 途径点数组
     * @param opts.endPoint {Array} 终点 [x, y]
     */
    public update(opts: any) {
    // 触发更新路径规划
    }
    public clear() {
    // 移除路径规划
    }
}
