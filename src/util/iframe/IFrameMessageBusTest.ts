import {IFrameMessageBus} from './IFrameMessageBus';
import {MessageNames} from './IFrameMessageNames';
import {
    ToggleEarlyWarning,
    ToggleWeather,
} from './IFrameMessageInterface';
// 示例
// 大屏父窗口
function parentWindowDemo() {
    // 创建
    const bus: IFrameMessageBus = new IFrameMessageBus();
    // 绑定当前窗口
    bus.bind(window);
    // 添加目标窗口
    // todo 这里的 mapIFrameId 是中间iframe的id
    const mapIFrameId: string = 'mapFrame';
    const mapFrame: any = (window as any).frames[mapIFrameId];
    if (mapFrame) {
        bus.addTargetWindow(mapFrame.contentWindow);
    }
    // 取消监听
    // bus.unlisten(MessageNames.eads.ENTER_EVENT, null);
    // 点击按钮，显示预警信息
    bus.dispatch(MessageNames.bigScreen.TOGGLE_EARLYWARNING, {
        visible: true,
    });

}
// 子窗口
function childWindowDemo() {
    // 创建
    const bus: IFrameMessageBus = new IFrameMessageBus();
    // 绑定当前窗口
    bus.bind(window);
    // 添加目标窗口
    bus.addTargetWindow((window as any).parent.window);
    // 监听事件
    bus.listen(MessageNames.bigScreen.TOGGLE_EARLYWARNING, (data: ToggleEarlyWarning, origin: string, source: any) => {
        if (data.visible) {
            // 显示
        } else {
            // 隐藏
        }
    });
    // 取消监听
    // bus.unlisten(MessageNames.bigScreen.TOGGLE_EARLYWARNING, null);

}
