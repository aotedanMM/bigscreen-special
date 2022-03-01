/**
 *缺少行政区划
 **/
// import { messsageBus } from '@/util/message';

const Airport01: any = {
  airport: {
    // 机场 承灾体
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
    labelObj: {
      districtname: '行政区划',
      address: '地址',
      phone: '电话',
      chargeperson: '负责人',
      _distance: '距事发地',
    },
    // 下方的按钮
    btnFilter : [
      'pathPlanningBtn', // 路径规划
      //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
      // 'aroundAnalysisBtn', // 周边分析
      // 'videoMonitoringBtn', // 视频监控
      // 'hazardousChemicalsBtn', // 危化物联
    ],
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

export { Airport01 };
