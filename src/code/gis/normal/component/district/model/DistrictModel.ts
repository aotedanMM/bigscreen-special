import DataModel from '../../../../../emap/component/DataModel';
export default class DistrictModel extends DataModel {

    /**
     * 当前行政区划
     */
    public currentDistrict: any = {
        type: '',
        id: '',
    };
    /**
     * 区县列表
     */
    public countyList: any[] = new Array();
    /**
     * 乡镇列表
     */
    public townList: any[] = new Array();

    constructor() {
        super();
    }

    public setCountList(list: any[]): void {
        this.countyList = list;
    }

    public setTownList(list: any[]): void {
        this.townList = list;
    }
}
