const EVENT_NAMES: any = {
    // 烈度模型计算完成
    MODEL_EXECUTED: 'model-executed',
    // 影响圈生成
    INFLUENCE_READY: 'influence-ready',
    // 影响圈刷新：重新推送影响圈半径后，影响圈范围变化，需要重新查询数据
    INFLUENCE_REFRESH: 'influence-refresh',
    // 烈度上报 接收到操作屏上传矢量图后触发
    RANGES_REPORTED: 'ranges-reported',
    // 烈度圈范围刷新：操作屏上传矢量图后，地图上的烈度圈范围变化，需要重新查询数据
    RANGES_REFRESH: 'ranges-refresh',
    // 烈度圈范围刷新：操作屏上传矢量图后，地图上的烈度圈范围变化，需要重新查询数据
    EVENTTYPE_CHANGE: 'eventTypeChange',
};

export default EVENT_NAMES;
