/**
 *缺少负责人 码头 承灾体
 **/
// import { messsageBus } from '@/util/message';

const Portwharf01: any = {
    portwharf: {
        // 码头 承灾体
        name: '暂无标题',
        unitObj: {
            _distance: 'km',
        },
        dataFilter: [ 'address', 'chargeperson', '_distance'],
        labelObj: {
            address: '地址',
            chargeperson: '负责人',
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

export { Portwharf01 };
