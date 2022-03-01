import {IFrameMessageBus} from './IFrameMessageBus';
import {MessageNames} from './IFrameMessageNames';
import {
    ToggleEarlyWarning,
    ToggleWeather,
} from './IFrameMessageInterface';
import Vue from 'vue';
/**
 * IFrame消息监听，触发不同的动作
 */
export class IFrameMessageListeners {
    private bus: IFrameMessageBus;
    private app: Vue; // App.vue 实例
    constructor(bus: IFrameMessageBus, app: Vue) {
        this.bus = bus;
        this.app = app;
    }

    public bind() {
        const messageBus: any = (this.app as any).messsageBus;
        const store: any = (this.app as any).$store;
        // 大屏触发的切换预警信息显示隐藏
        this.bus.listen(MessageNames.bigScreen.TOGGLE_EARLYWARNING, (data: ToggleEarlyWarning) => {
          // 这里通过messageBus或者store来通知到预警模块，控制显隐
        });
        // 大屏触发的切换天气信息显示隐藏
        this.bus.listen(MessageNames.bigScreen.TOGGLE_WEATHER, (data: ToggleWeather) => {
          // todo
        });
        this.bus.listen(MessageNames.bigScreen.DERIVE_ONCLICK, (data: ToggleEarlyWarning) => {
          // 这里通过messageBus或者store来通知到衍生事件模块，控制显隐
          messageBus.emit('openDeriveVie', data);
        });
        // 其他消息往后补充……
    }
}
