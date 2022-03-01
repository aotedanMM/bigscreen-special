/**
 * 物资储备库
 **/
// import { messsageBus } from '@/util/message';

export const repository: any = {
  // 物资储备库
  name: '暂无标题',
  unitObj: {
  },
  dataFilter: [
    'ORGNAME',
    'LEVELNAME',
    'districtname',
    'address',
    'TEL',
    'CONCATEPER',
    'phone',
  ],
  labelObj: {
    ORGNAME: '管理机构',
    LEVELNAME: '级别',
    districtname: '行政区划',
    address: '地址',
    TEL: '办公电话',
    CONCATEPER: '联系人',
    phone: '联系电话',
  },
  telPelope: { // 电话拨打后对应人名
    phone: 'CONCATEPER',
  },
  telobj: {
    phone: 'phone',
    TEL: 'TEL',
  },
  popHeight: 489,
  cb(self: any) {
    const that = self;
    // tslint:disable-next-line:no-debugger
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
