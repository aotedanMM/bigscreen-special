import EComponent from '../../../../emap/component/EComponent';
import DistrictModel from './model/DistrictModel';
export default class DistrictComponent extends EComponent<DistrictModel> {
    constructor() {
        super();
    }

    public load(param: any): any {
        //
        this.bind(param.districtPanel);
        const model = new DistrictModel();
        model.setCountList([
            {
                name: '朝阳',
                geometry: {
                    type: 'Point',
                    coordinates: [116, 39],
                },
            },
            {
                name: '海淀',
                geometry: {
                    type: 'Point',
                    coordinates: [118, 39],
                },
            },
        ]);
        this.setModel(model);
    }

    public locate(param: any) {
        //
        (console as any).log('地图定位： ', JSON.stringify(param));
    }

    public unload(): any {
        //
    }
}
