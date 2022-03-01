/**
 *缺少行政区划
 **/
// import { messsageBus } from '@/util/message';

const reservoir: any = {
  // 水库
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: ['districtname', 'address', 'phone', '_distance'],
  labelObj: {
    districtname: '行政区划',
    address: '地址',
    phone: '电话',
    _distance: '距事发地',
  },
  popHeight: 383,
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
      aroundTypeFilter: ['school', 'hospital', 'airport', 'reservoir',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { reservoir };
