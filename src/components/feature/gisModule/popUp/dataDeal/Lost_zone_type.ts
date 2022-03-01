/**
 *
 **/
// import { messsageBus } from '@/util/message';
// 失联区域
// tslint:disable-next-line:variable-name
const Lost_zone_type: any = {
  name: '暂无标题',
    unitObj: {
      // distance: '公里',
      // eClass: 'M',
      // eDeep: 'Km',
    },
  dataFilter: ['loss', 'missArea'],
  labelObj: {
    missArea: '失联区域',
    loss: '退服基站',
  },
  popHeight: 283,
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
  /* pathTypeFilter: ['RescueTeam※03'],
      aroundTypeFilter: ['school', 'hospital', 'airport', 'portwharf',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { Lost_zone_type };
