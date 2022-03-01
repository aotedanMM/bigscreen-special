/**
 * 所有iframe间通信的事件名称
 */
export const MessageNames: any = {
    // 大屏发出的事件
    bigScreen: {
        // 切换预警信息显示隐藏
        TOGGLE_EARLYWARNING: 'TOGGLE_EARLYWARNING',
        // 切换天气信息显示隐藏
        TOGGLE_WEATHER: 'TOGGLE_WEATHER',
        // 衍生事件列表点击事件
        DERIVE_ONCLICK: 'DERIVE_ONCLICK',
        // 大屏监听推送屏后跳转专题时发给16：9
        ADDEVENT_EVENT: 'ADDEVENT_EVENT',
    },
    // 中间地图发出的事件
    eads: {
    },
};

