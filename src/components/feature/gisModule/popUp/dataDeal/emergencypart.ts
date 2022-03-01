/**
 *缺少 联系方式（暂未确认）
 **/
// import { messsageBus } from '@/util/message';

const emergencypart: any = {
  // 应急管理机构
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: ['address', 'phone', '_distance' ],
  labelObj: {
    address: '地址',
    phone: '联系方式',
    _distance: '距事发地',
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
      aroundTypeFilter: ['school', 'hospital', 'airport', 'emergencypart',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { emergencypart };
