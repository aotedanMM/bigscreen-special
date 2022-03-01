
/**
 * 事件信息
 */
export default class EventInfo {

    /**
     * 事件id
     */
    protected  id: string = '';
    /**
     * mis事件id
     */
    protected  originalEventId: string = '';
    /**
     * 事件标题
     */
    protected title: string = '';

    /**
     * 事件类型
     */
    protected type: string = '';

    /**
     * 事件位置
     */
    protected point: any;

    /**
     * 事件空间几何，点线面要素
     */
    protected geometry: any;
    /**
     * 行政区划编码筛选
     */
    protected districtCode: string = '';

    /**
     * 影响范围 格式如： [2,10,50]
     */
    protected affactRadius: string[] = new Array();
    /**
     * 影响范围，由小到大
     */
    protected affectRanges: any[] = [];

    /**
     * 信息
     */
    protected message: string = '';

    /**
     * 事件发生时间
     */
    protected eventTime: string = '';

    /**
     * 0 = 根据半径计算的影响圈（经验圈）    1 = 模型圈
     */
    protected currentRangeType: any = 0;

     /**
     * 0 常态 1非常态
     */
    protected currentStatus: any = '0';
    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    constructor(id?: any, opts?: any) {
        //
        this.id = id;
    }


    public clone(): any {
        // todo
    }


    public setId(id: any) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

    public setOriginalEventId(id: any) {
        this.originalEventId = id;
    }

    public getOriginalEventId() {
        return this.originalEventId;
    }

    public getType() {
        return this.type;
    }

    public setType(type: any) {
        this.type = type;
    }

    public getGeometry() {
        return this.geometry;
    }

    public setGeometry(geometry: any) {
        this.geometry = geometry;
        this.setAffactRadius([0]);
    }
    public getDistrictCode() {
        return this.districtCode;
    }

    public setDistrictCode(districtCode: any) {
        this.districtCode = districtCode;
    }
    public getPoint() {
        return this.point;
    }

    public setPoint(point: any) {
        this.point = point;
    }

    public getTitle() {
        return this.title;
    }

    public setTitle(title: any) {
        this.title = title;
    }

    public getEventTime() {
        return this.eventTime;
    }

    public setEventTime(eventTime: any) {
        this.eventTime = eventTime;
    }

    public getMessage() {
        return this.message;
    }

    public setMessage(message: any) {
        this.message = message;
    }

    public getAffactRanges() {
        return this.affectRanges;
    }

    public getAffactRadius() {
        return this.affactRadius;
    }

    public setAffactRadius(affactRadius: any) {
        this.affactRadius = affactRadius;
        this.affectRanges = this.buildAffectRanges(affactRadius);
    }
    public getCurrentStatus() {
        return this.currentStatus;
    }

    public setCurrentStatus(currentStatus: any) {
        this.currentStatus = currentStatus;
    }
    /**
     * 获取范围
     * @param type 0 = 根据半径计算的影像圈    1 = 烈度范围
     */
    public getRanges(type: any = null) {
        return this.cloneRanges(this.getAffactRanges());
    }

    /**
     * 获取最大灾损范围 GeoJSON
     */
    public getMaxRangeGeometry(type: any) {
        // 取最大范围的多边形
        type = (type === null || type === undefined ) ? this.currentRangeType : type;
        const ranges: any = this.getRanges(type);
        console.debug(ranges);
        let geometry: any = null;
        if (ranges.length > 0) {
            const range: any = ranges[ranges.length - 1];
            geometry = range.geometry;
            if (type === 1) {// 处理模型圈
                if (geometry.coordinates.length > 0 ) {
                    const coordiantes: any = geometry.type === 'MultiPolygon' ?
                        [ geometry.coordinates[0][0] ] : [ geometry.coordinates[0] ];
                    geometry = {
                        type: 'Polygon',
                        coordinates: coordiantes,
                    };
                }
            }
        }
        return geometry;
    }

    /**
     * 级别获取对应的灾损范围 GeoJSON
     * @param levelArr
     */
    public getRangesByLevel(levelArr: any) {
        const matchRanges: any = [];
        const ranges: any = this.getRanges();
        for (const range of ranges) {
            for (const level of levelArr) {
                if (level === range.level) {
                    matchRanges.push(range);
                }
            }
        }
        return matchRanges;
    }

    public setCurrentRangeType( type: any) {
        this.currentRangeType = type;
    }

    public getCurrentRangeType() {
        return this.currentRangeType;
    }

    protected cloneRanges(ranges: any) {
        const list: any = [];
        for (const range of ranges) {
            const item: any = {};
            item.level = range.level;
            item.title = range.title;
            item.districtCode = range.districtCode;
            item.geometry = range.geometry;
            list.push(item);
        }
        return list;
    }

    /**
     * 构建影响范围
     * 影响圈按圈查，不按环查询
     * 处理点、线面要素
     * @param affectRadius
     */
    private buildAffectRanges(affectRadius: any) {
        const affectRanges: any = [];
        let geojson: any = null;
        if (this.geometry) { // 空间坐标
            geojson = this.geometry;
        } else if (this.point) { // 点
            geojson = {
                type: 'Point',
                coordinates: this.getPoint(),
            };
        }
        if (geojson) {
            for (const radius of affectRadius) {
                const radiusNum: number = parseFloat(radius);
                let bufferGeom: any = null;
                if (radiusNum > 0) {
                    bufferGeom = G.utils.SpatialOPUtil.getBuffer({
                        geometry: geojson,
                        radius: radiusNum * 1000,
                        spatialReference: 4326,
                    });
                } else { // 如果半径为零，则不缓冲
                    // 面状要素
                    if (geojson.type === 'Polygon' || geojson.type === 'MultiPolygon' ) {
                        bufferGeom = geojson;
                    } else {
                        bufferGeom = geojson;
                        console.warn('无法生成经验圈');
                    }
                }
                const range: any = {};
                range.level = radius;
                range.title = radius;
                range.geometry = bufferGeom;
                range.districtCode = this.districtCode;
                affectRanges.push(range);
            }
        }
        return affectRanges;
    }


}
