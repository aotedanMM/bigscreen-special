
import SafeProductionEventInfo from '../event/SafeProductionEventInfo';
import EventInfo from '../event/EventInfo';
import MessageHandler from './MessageHandler';
/**
 * 安全生产件处理
 */
export default class SafeProductionMessageHandler extends MessageHandler {

    constructor() {
        super();
    }

    public createEventInfo(): EventInfo {
        return new SafeProductionEventInfo(null, null);
    }

    // 重置所有状态
    public reset() {
        // todo 清理事件的相关状态
        // 触发父类重置方法
        super.reset();
    }

    /**
     * 定位推送
     * @param event
     */
    public onPushEvent( event: any, eventDispatcher: any) {
        this.updateEventInfo(event, eventDispatcher);
        // 烈度圈组件
        const influence = this.components.commonFactory.getComponent('influence');
        console.debug('eventInfo: ');
        // 重置显示的范围类型
        influence.reset();
        influence.reload();
    }

    /**
     * 事件处理后的统一处理
     * @param event
     * @param eventDispatcher
     */
    public postPushEvent(event: any, eventDispatcher: any): void {
        eventDispatcher.dispatch('showGisSwitchMap', 1); // 切换到高清
    }

    public adddangerpoint() {
        const disasterJudgeResource = this.components.disasterJudgeFactory.getComponent('disasterJudgeResource');
        const eventInfo: any = this.eventWapper.getEventInfo();
        const ranges = eventInfo.getRanges();
        const maxlevel = ranges[ranges.length - 1].level; // 'hazardous', 'explosive',
        disasterJudgeResource.load(['majorDanger']).then((data: any) => {
            if ( data && data[0].total > 0) {
                disasterJudgeResource.showResource('majorDanger', [maxlevel]);
            }
        });
    }
}
