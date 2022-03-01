import EventInfo from './EventInfo';
/**
 * 安全生产事故信息，根据消息推送逐步补全
 */
export default class SafeProductionEventInfo extends EventInfo {
    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    constructor(id: any, opts: any) {
        super(id, opts);
    }
}
