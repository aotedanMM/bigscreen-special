import EventInfo from './EventInfo';
/**
 * 地震事故信息，根据消息推送逐步补全
 */
export default class EarthQuakeEventInfo extends EventInfo {
    /**
     * 模型计算的烈度范围，由小到大，级别由大到小
     */
    private modelRanges: any[] = [];

    /**
     * 上报的烈度范围，由小到大，级别由大到小
     */
    private reportRanges = [];

    /**
     * 地震烈度
     */
    private level!: number ;

    /**
     * 0 = 根据半径计算的影响圈    1 = 模型烈度圈
     */
    // private currentRangeType: any = 0;


    /**
     * @param opts
     * @param opts.point
     * @param opts.title
     */
    constructor(id: any, opts: any) {
        super(id, opts);
        // 模拟事件数据
        // this._mock();
    }


    public getModelRanges() {
        return this.modelRanges;
    }

    public setModelRanges(modelRanges: any) {
        this.modelRanges = modelRanges;
    }

    public getReportRanges() {
        return this.reportRanges;
    }

    public setReportRanges(reportRanges: any) {
        this.reportRanges = reportRanges;
    }

    public getLevel() {
        return this.level;
    }

    public setLevel(level: any) {
        this.level = level;
    }

    /**
     * 获取范围
     * @param type 0 = 根据半径计算的影像圈    1 = 烈度范围
     */
    public getRanges(type: any = null) {
        type = (type === null || type === undefined ) ? this.currentRangeType : type;
        let ranges: any = null;
        switch (type + '') {
            case '0': {
                ranges = this.getAffactRanges();
                break;
            }
            case '1': {
                ranges = this.getModelRanges();
                break;
            }
            case '2': {
                ranges = this.getReportRanges();
                break;
            }
            default: {
                break;
            }
        }
        return this.cloneRanges(ranges);
    }
    // /**
    //  * 返回最终使用的灾损圈数组
    //  */
    // public getRangesO() {
    //     if ( this.reportRanges.length > 0 && this.level > 5 ) { // 大于5级的地震，优先使用上传的烈度
    //         return this.reportRanges;
    //     } else if (this.modelRanges.length > 0 ) { // 模型计算的烈度圈
    //         return this.modelRanges;
    //     } else if ( this.affactRadius.length > 0 ) {// 影响范围半径计算
    //         return this.affectRanges;
    //     }
    // }

    private _mock() {
        this.setPoint([116.35, 39.87]);
        this.setAffactRadius (['5', '10', '30', '60']);
        this.setLevel( 8);
        // this.ranges = [{
        //     level: '50',
        //     title: '50公里',
        //     geometry: {
        //         type: 'Polygon',
        //         coordinates: [
        //             [
        //                 [115, 21],
        //                 [115, 22],
        //                 [111, 22],
        //                 [111, 21],
        //                 [115, 21],
        //             ],
        //         ],
        //     },
        // }];
    }

}
