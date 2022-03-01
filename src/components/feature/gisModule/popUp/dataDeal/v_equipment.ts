/**
 *
 **/
// 救援装备下的字段
export const equipment: any = {
  'equipment※01': {
    name: '暂无标题',
    unitObj: {
    },
    dataFilter: [
      'UNITNAME',
      'CONTACTPER',
      'DUTYTEL',
      'address',
      'NAME',
      'COREPARAMS',
    ],
    telPelope: { // 电话拨打后对应人名
      DUTYTEL: 'CONTACTPER',
    },
    telobj: {
      DUTYTEL: 'DUTYTEL',
    },
    labelObj: {
      UNITNAME: '所属单位',
      CONTACTPER: '联系人',
      DUTYTEL: '联系电话',
      address: '地址',
      NAME: '主要装备',
      COREPARAMS: '核心参数',
    },
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
