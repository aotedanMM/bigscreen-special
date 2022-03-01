import EventInfo from './EventInfo';
import EmergencyEvent from './EmergencyEvent';
export default class BasicInfo extends EventInfo {

    // 事件标题
    public title: string = '';
    // 经度
    public x: number = 0 ;
    // 纬度
    public y: number = 0 ;
    // 地址
    public address: string = '';
    // 行政区划
    public district: string = '';
    // 事件级别
    public level: number = -1;

    public setTitle(title: string) {
        this.title = title;
    }

    public setPoint(coordinate: number[]) {
        if (coordinate && coordinate.length === 2) {
            this.x = coordinate[0];
            this.y = coordinate[1];
        }
    }

    public setAddress(address: string) {
        this.address = address;
    }

    public setDistrict(district: string) {
        this.district = district;
    }

    public setLevel(level: number) {
        this.level = level;
    }

    /**
     * 补全消息信息
     * @param event
     */
    public attach(event: EmergencyEvent): void {
        if (event) {
            event.basicInfo = this;
        }
    }
}
