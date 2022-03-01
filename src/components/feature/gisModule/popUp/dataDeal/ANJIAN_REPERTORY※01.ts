/**
 *
 **/
// 储备库


export const ANJIAN_REPERTORY: any = {'ANJIAN_REPERTORY※01': {
  name: '暂无标题',
  unitObj: {
      distance: '公里',
      eClass: 'M',
      eDeep: 'Km',
  },
  dataFilter: [
      'TEL',
      'districtname',
      'DISTRICT',
      'address',
      'ORGNAME',
      'LEVELNAME',
      'CONCATEPER',
      'CONCATEMOBTEL',
  ],
  telPelope: { // 电话拨打后对应人名
    CONCATEMOBTEL: 'CONCATEPER',
  },
  telobj: {
    CONCATEMOBTEL: 'CONCATEMOBTEL',
  },
  labelObj: {
      ORGNAME: '管理机构',
      LEVELNAME: '级别',
      districtname: '行政区划',
      DISTRICT: '行政区划编码',
      address: '地址',
      TEL: '办公电话',
      CONCATEPER: '联系人',
      CONCATEMOBTEL: '联系电话',

    },
    popHeight: 619,
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


