/**
 *
 **/
// import { messsageBus } from '@/util/message';

// 人员伤亡
// tslint:disable-next-line:variable-name
const Casualties_type: any = {
  name: '暂无标题',
  unitObj: {
    // distance: '公里',
    // eClass: 'M',
    // eDeep: 'Km',
  },
  dataFilter: ['death', 'injured', 'miss'],
  labelObj: {
    death: '死亡人数',
    injured: '受伤人数',
    miss: '失踪人数',
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
  /* pathTypeFilter: ['RescueTeam※03'],
      aroundTypeFilter: ['school', 'hospital', 'airport', 'portwharf',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { Casualties_type };
