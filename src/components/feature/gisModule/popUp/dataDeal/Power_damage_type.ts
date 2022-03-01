/**
 *
 **/
// import { messsageBus } from '@/util/message';
// 电力损毁
// tslint:disable-next-line:variable-name
const Power_damage_type: any = {
  name: '暂无标题',
    unitObj: {
      dianxianhao: '个',
      dianzhancount: '座',
    },
  dataFilter: ['dianxianhao', 'dianzhancount'],
  labelObj: {
    dianxianhao: '输电线路',
    dianzhancount: '变电站',
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

export { Power_damage_type };
