import EventInfo from './EventInfo';
/**
 * 默认事件信息
 */
export default class DefaultEventInfo extends EventInfo {

    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    constructor(id: any, opts: any) {
        super(id, opts);
    }
}

