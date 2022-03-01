/**
 *
 **/
// 战保基地  此处后台表格数据需请求接口  上面列表数据也是调接口返回的

export const JC_WARBASE01: any = {
  'JC_WARBASE※01': {
    name: '暂无标题',
    unitObj: {
    },
    dataFilter: [
      'address',
      'districtname',
      'PEOPLENUM',
      'CAR',
      'CONTACTS',
      'DUTYTEL',
    ],
    telPelope: { // 电话拨打后对应人名
      DUTYTEL: 'CONTACTS',
    },
    telobj: {
      DUTYTEL: 'DUTYTEL',
    },
    labelObj: {
      address: '地址',
      districtname: '行政区划',
      PEOPLENUM: '总人数（人）',
      CAR: '车辆总数（辆）',
      CONTACTS: '联系人',
      DUTYTEL: '联系电话',
    },
    popHeight: 619,
    cb(self: any) {
      const that = self;
      if (
        that.data &&
        that.data.attributeSet &&
        that.data.attributeSet.attributes
      ) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData();
      } else if (
        that.data &&
        that.popUpType &&
        that.popUpType === 'disaster_sta_feature_type'
      ) {
        that.dataChild = that.data;
        that.getDataChild();
      } else if (that.data) {
        that.dataTag = that.data;
        that.isShowPathPlanningBtn = false,
        that.isAroundAnalysisBtn = false,
        that.getDataTag();
      }
    },
  },
};
