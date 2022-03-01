/**
 *缺少行政区划字段（病床数责任人需求暂未确定）
 **/
// import { messsageBus } from '@/util/message';

const hospital: any = {
  // 医院
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  telPelope: { // 电话拨打后对应人名
    phone: 'chargeperson',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: [
    'districtname',
    'address',
    'phone',
    '_distance',
    'bednum',
    'chargeperson',
  ],
  labelObj: {
    districtname: '行政区划',
    address: '地址',
    phone: '电话',
    _distance: '距事发地',
    bednum: '病床数',
    chargeperson: '责任人',
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

export { hospital };
