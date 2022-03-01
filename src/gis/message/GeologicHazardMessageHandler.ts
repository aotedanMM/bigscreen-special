
import GeologicHazardEventInfo from '../event/GeologicHazardEventInfo';
import EventInfo from '../event/EventInfo';
import MessageHandler from './MessageHandler';
/**
 * 地址灾害事件处理
 */
export default class GeologicHazardMessageHandler extends MessageHandler {

    constructor() {
        super();
    }

    public createEventInfo(): EventInfo {
        return new GeologicHazardEventInfo(null, null);
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
}
