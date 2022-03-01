/**
 *
 **/
// import { messsageBus } from '@/util/message';
// 房屋损毁
// tslint:disable-next-line:variable-name
const Hous_damage_type: any = {
  // 乡镇
  name: '暂无标题',
    unitObj: {
      // distance: '公里',
      // eClass: 'M',
      // eDeep: 'Km',
    },
  dataFilter: ['yazhongsunhuai', 'yibansunhuai', 'damage'],
  labelObj: {
    yazhongsunhuai: '严重受损',
    yibansunhuai: '一般受损',
    damage: '房屋倒塌',
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

export { Hous_damage_type };
