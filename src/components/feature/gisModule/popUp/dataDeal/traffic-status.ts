/**
 *
 **/
// import { messsageBus } from '@/util/message';
// 交通管制
// 道路损毁
// 绿色通道
// tslint:disable-next-line:variable-name
export const trafficStatus: any = {'traffic-status': {
// const traffic-status:
  name: '暂无标题',
    unitObj: {
      distance: '公里',
    },
  dataFilter: ['distance'],
  labelObj: {
    distance: '长度',
  },
  popHeight: 233,
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
},
};

// export { traffic-status };
