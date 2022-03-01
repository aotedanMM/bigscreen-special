/**
 *缺少行政区划
 **/
// import { messsageBus } from '@/util/message';

const airport: any = {
  // 机场
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  dataFilter: [
    'districtname',
    'address',
    'phone',
    'chargeperson',
    '_distance',
  ],
  telPelope: { // 电话拨打后对应人名
    phone: 'chargeperson',
  },
  telobj: {
    phone: 'phone',
  },
  labelObj: {
    districtname: '行政区划',
    address: '地址',
    phone: '电话',
    chargeperson: '负责人',
    _distance: '距事发地',
  },
  popHeight: 433,
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

export { airport };
