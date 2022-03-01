
import MessageHandler from './MessageHandler';
import DefaultEventInfo from '../event/DefaultEventInfo';
import EventInfo from '../event/EventInfo';
/**
 * 默认消息处理
 */
export default class DefaultMessageHandler extends MessageHandler {

    constructor() {
        super();
    }

    public createEventInfo(): EventInfo {
        return new DefaultEventInfo(null, null);
    }

    // 重置所有状态
    public reset() {
        // todo 清理事件的相关状态
        // 触发父类重置方法
        super.reset();
    }

    /**
     * 事件定位
     * @param event
     */
    public onLocateEvent(event: any) {
        // 定位组件
        const locateComponent = this.components.commonFactory.getComponent('locateComp');
        const lng: any = parseFloat(event.EventLon);
        const lat: any = parseFloat(event.EventLat);
        const eventtype: any = event.EventType;
        if ( lng && lat) {
            // 事件定位
            locateComponent.load({
                x: lng,
                y: lat,
                changeZoom: false,
                type: eventtype,
            });
        }
    }


    /**
     * 事件推送
     * @param event
     */
    public onPushEvent(event: any, eventDispatcher: any): void {
        this.updateEventInfo(event, eventDispatcher);
        // 烈度圈组件
        const influence = this.components.commonFactory.getComponent('influence');
        // 重置显示的范围类型
        influence.reset();
        influence.reload();
    }

    /**
     * 事件推送的清理
     * @param event
     * @param eventDispatcher
     */
    public clearOnPushEvent() {
        return new Promise((resolve, reject) => {
            // 所有事件统一清空处理逻辑
            // 清空所有视野调整
            this.tools.featureLocate.clear();
            // 事件信息
            const eventListComponent = this.components.normalFactory.getComponent('newsEventLocate');
            // eventListComponent.clear();
            // 为了保证进入事件后，不再显示事件信息点，隐藏图层！！！！！！！！！！！！！！！！！！！
            eventListComponent.setVisible(false);
            console.debug('>>>>>>>>地图隐藏事件信息!');
            //
        });
    }
}
