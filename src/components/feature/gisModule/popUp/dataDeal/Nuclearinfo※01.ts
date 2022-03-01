/**
 *
 **/
// import { messsageBus } from '@/util/message';

const nuclear01: any = {
    'Nuclearinfo※01': {
        // 核设施 承灾体
        name: '暂无标题',
        unitObj: {
            _distance: 'km',
        },
        dataFilter: ['_distance', 'address', 'districtname' ],
        labelObj: {
            address: '地址',
            districtname: '行政区划',
            _distance: '距事发地',
        },
        popHeight: 333,
        cb(self: any) {
            const that = self;
            // tslint:disable-next-line:no-debugger
            // debugger;
            if (
                that.data &&
                that.data.attributeSet &&
                that.data.attributeSet.attributes
            ) {
                that.dataAttributes = that.data.attributeSet.attributes;
                that.getpopData(that.dealAttributes());
            } else {
                that.getpopData(that.data);
            }
        },
    },
};

export { nuclear01 };
