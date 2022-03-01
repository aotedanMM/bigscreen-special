/**
 *缺少行政区划字段（病床数责任人需求暂未确定）
 **/
// import { messsageBus } from '@/util/message';

const metalnonmetal: any = {
  // 医院
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: [
    'districtname',
    'address',
  ],
  labelObj: {
    districtname: '行政区划',
    address: '地址',
  },
  popHeight: 470,
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
};

export { metalnonmetal };
