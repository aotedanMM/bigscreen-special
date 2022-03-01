/**
 *缺少
 **/
// import { messsageBus } from '@/util/message';

const Station01: any = {
  // 火车站 承灾体
  railwaystation : {
    name: '暂无标题',
    unitObj: {
      _distance: 'km',
    },
    dataFilter: ['districtname', 'address', 'phone', '_distance'],
    labelObj: {
      districtname: '行政区划',
      address: '地址',
      phone: '电话',
      _distance: '距事发地',
    },
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

export { Station01 };
