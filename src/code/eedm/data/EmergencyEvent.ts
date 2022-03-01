import BasicInfo from './BasicInfo';
/**
 * 突发事件
 */
export default abstract class EmergencyEvent {
    // 基本信息
    public basicInfo: BasicInfo | null = null;

    /**
     * 获取事件影响范围
     */
    public abstract getAffectedArea(): any;
}
