/**
 * 救援救助调拨建议普通框的对应字段
 **/

export const dispatchAdvice: any = {
  name: '暂无标题',
  unitObj: {
    contact: '',
    telephone: '',
    address: '',
  },
  dataFilter: [
      'contact',
      'telephone',
      'address',
  ],
  labelObj: {
    contact: '联系人',
    telephone: '电话',
    address: '地址',
  },
  btnFilter: [],
  cb(self: any) {
      const that = self;
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
      that.isShowPathPlanningBtn = false;
      that.isAroundAnalysisBtn = false;
    },
};


