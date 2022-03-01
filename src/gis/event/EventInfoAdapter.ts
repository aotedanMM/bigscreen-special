export default class EventInfoAdapter {
    // 数据适配
    public static adapt(event: any): any {
        const eventObj: any = JSON.parse(JSON.stringify(event));
        // 设置属性
        eventObj.setValue = (key: string, value: any) => {
            eventObj[key] = value;
            event[key] = value;
        };
        return eventObj;
    }
}
