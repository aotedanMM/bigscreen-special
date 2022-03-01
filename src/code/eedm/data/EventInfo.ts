
import EmergencyEvent from './EmergencyEvent';
/**
 * 事件信息
 */
export default abstract class EventInfo {
    constructor() {
        //
    }

    /**
     * 补全消息信息
     * @param event
     */
    public abstract attach(event: EmergencyEvent): void;
}
