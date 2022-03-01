import EventInfo from './EventInfo';
/**
 * 草原火灾事故信息，根据消息推送逐步补全
 */
export default class GrasslandFireEventInfo extends EventInfo {
    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    constructor(id: any, opts: any) {
        super(id, opts);
    }
}
