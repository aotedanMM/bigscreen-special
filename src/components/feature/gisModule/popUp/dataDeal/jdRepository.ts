/**
 *
 **/
// import { messsageBus } from '@/util/message';

const jdRepository: any = {
  // 京东储备库
  name: '暂无标题',
  unitObj: {
  },
  dataFilter: [
    'address',
    'districtname',
    'CONCATEMOBTEL',
  ],
  telobj: {
    CONCATEMOBTEL: 'CONCATEMOBTEL',
  },
  labelObj: {
    address: '地址',
    districtname: '行政区划',
    CONCATEMOBTEL: '联系电话',
  },
  // 要显示的按钮
  btnFilter : [],
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

export { jdRepository };
