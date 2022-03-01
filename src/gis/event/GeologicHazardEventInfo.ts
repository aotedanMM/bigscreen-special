import EventInfo from './EventInfo';
/**
 * 地质灾害事故信息，根据消息推送逐步补全
 */
export default class GeologicHazardEventInfo extends EventInfo {
    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    constructor(id: any, opts: any) {
        super(id, opts);
    }
}
