/**
 *缺少行政区划、类型字段
 **/
// import { messsageBus } from '@/util/message';

const school: any = {
  // 学校
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: [ 'type', 'districtname', 'address', 'phone', '_distance'],
  labelObj: {
    name: '名称',
    type: '类型',
    districtname: '行政区划',
    address: '地址',
    phone: '电话',
    _distance: '距事发地',
  },
  popHeight: 433,
  cb(self: any) {
    const that = self;
    // tslint:disable-next-line:no-debugger
    // debugger;
    // that.calcHeight();
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

export { school };
