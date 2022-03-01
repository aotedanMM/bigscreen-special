import EventInfo from '../event/EventInfo';
export default interface IMessageHandler {

    /**
     * 创建事件信息
     */
    createEventInfo(): EventInfo;

    /**
     * 事件推送
     * @param event {Object}
     * @param eventDispatcher {Object}
     */
    onPushEvent(event: any, eventDispatcher: any, backfunc: any): void;

    /**
     * 重置状态
     */
    reset(): void;
}
