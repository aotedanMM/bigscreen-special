export default interface ITrackUpdateHadnler {
    /**
     * 轨迹更新的处理
     * @param data {Object}
     * @param data.time {Date} 时间戳
     * @param data.data {Array} 轨迹数据
     * @param data.data[i] {Object}
     * @param data.data[i].startTime {Date} 开始时间
     * @param data.data[i].endTime {Date} 结束时间
     * @param data.data[i].points {Array} 轨迹数据
     */
    onTrackUpdate(data: any): void;
}

