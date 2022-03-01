export default interface ITrackUpdateHadnler {
    /**
     * 路径规划更新
     * @param data {Object}
     * @param data.distance {Number} 距离
     * @param data.time {Number} 耗时
     * @param data.route {Array} 路径
     */
    onRouteUpdate(data: any): void;
}

