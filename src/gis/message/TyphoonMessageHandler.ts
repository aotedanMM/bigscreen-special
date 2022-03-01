
import TyphoonEventInfo from '../event/TyphoonEventInfo';
import EventInfo from '../event/EventInfo';
import MessageHandler from './MessageHandler';
/**
 * 台风时间
 */
export default class TyphoonMessageHandler extends MessageHandler {

    constructor() {
        super();
    }

    public createEventInfo(): EventInfo {
        return new TyphoonEventInfo(null, null);
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
        // const influence = this.components.commonFactory.getComponent('influence');
        // // 重置显示的范围类型
        // influence.reset();
        // influence.reload();
        // 烈度圈组件
        const drawEventPolygon = this.components.commonFactory.getComponent('drawEventPolygon');
        drawEventPolygon.reload(true);
    }

    /**
     * 事件处理后的统一处理
     * @param event
     * @param eventDispatcher
     */
    public postPushEvent(event: any, eventDispatcher: any): void {
        //
    }
}
