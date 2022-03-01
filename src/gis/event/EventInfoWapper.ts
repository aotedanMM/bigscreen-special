
import EventInfo from './EventInfo';
/**
 * 事件信息包装类
 */
export default class EventInfoWapper {

    private eventInfo!: EventInfo;

    constructor() {
        //
        this.eventInfo = new EventInfo('');
    }

    // 绑定
    public bind(evnetInfo: EventInfo) {
        this.unbind();
        this.eventInfo = evnetInfo;
        this._bind();
    }

    // 解绑
    public unbind() {
        const blankEvent = new EventInfo('');
        if (this.eventInfo && (JSON.stringify(this.eventInfo) !== JSON.stringify(this.eventInfo))) {
            const temp: any = this.eventInfo;
            const self: any = this;
            for (const key in temp) {
                if ( temp [key]) {
                    const val: any = temp[key];
                    if (Object.prototype.toString.call(val) === '[object Function]') {
                        delete self[key];
                    }
                }
            }
            self.eventInfo = null;
        }
    }

    public getEventInfo() {
        return this.eventInfo;
    }


    /**
     *
     */
    private _bind() {
        const temp: any = this.eventInfo;
        const self: any = this;
        for (const key in temp) {
            if ( temp [key]) {
                const val: any = temp[key];
                if (Object.prototype.toString.call(val) === '[object Function]') {
                    self[key] = temp[key].bind(temp);
                }
            }
        }
    }
}
