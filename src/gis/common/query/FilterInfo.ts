
/**
 * 搜索功能的过滤条件实体
 */
export default class FilterInfo {
    /**
     * 事件点
     */
    private eventPoint: any = null;

    /**
     * 事件类型
     */
    private eventType: any = null;
    /**
     * 过滤类型： 1 = 缓冲  ， 2 = 行政区划
     */
    private filterType: any = null;
    /**
     * 行政区划编码，多个逗号分隔
     */
    private districtCode: any = [];

    /**
     * 缓冲的空间坐标
     */
    private bufferGeometry: any = null;

    /**
     * 缓冲半径
     */
    private bufferRadius: any = null;

    /**
     * 空间过滤条件
     */
    private filterGeometry: any = null;

    constructor() {
        //
    }

    public reset() {
        this.filterGeometry = null;
        this.resetDistriCode();
        this.filterType = null;
    }
    public getEventPoint() {
        return this.eventPoint;
    }

    public setEventPoint(eventPoint: any) {
        this.eventPoint = eventPoint;
    }

    public getEventType() {
        return this.eventType;
    }

    public setEventType(eventType: any) {
        this.eventType = eventType;
    }

    public getFilterType() {
        return this.filterType;
    }

    public setFilterType(filterType: any) {
        this.filterType = filterType;
    }

    public getDistrictCode() {
        return this.districtCode;
    }

    public setDistrictCode(districtCode: any) {
        this.districtCode.push(districtCode);
    }

    public removeDistricCode(districtCode: any) {
        for (let i = 0; i < this.districtCode.length; i++) {
            if (this.districtCode[i] === districtCode) {
                this.districtCode.splice(i, 1);
            }
        }
    }

    public resetDistriCode() {
        this.districtCode = [];
    }

    public getBufferGeometry() {
        return this.bufferGeometry;
    }

    public setBufferGeometry(bufferGeometry: any) {
        this.bufferGeometry = bufferGeometry;
    }

    public getBufferRadius() {
        return this.bufferRadius;
    }

    public setBufferRadius(bufferRadius: any) {
        this.bufferRadius = bufferRadius;
    }

    public getFilterGeometry() {
        return this.filterGeometry;
    }

    public setFilterGeometry(filterGeometry: any) {
        this.filterGeometry = filterGeometry;
    }
}
