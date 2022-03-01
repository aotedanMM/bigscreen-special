/**
 *缺少 行政区划 职务
 **/
// import { messsageBus } from '@/util/message';

const disinfoper: any = {
  // 灾情信息员
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: ['districtname', 'duty', 'phone'],  // '_distance'
  labelObj: {
    districtname: '地址',
    duty: '职务',
    phone: '电话',
    // _distance: '距事发地',
  },
  // 下方的按钮
  btnFilter : [
    // 'pathPlanningBtn', // 路径规划
    // 'aroundAnalysisBtn', // 周边分析
    // 'videoMonitoringBtn', // 视频监控
    // 'hazardousChemicalsBtn', // 危化物联
  ],
  popHeight: 400, // 经新民总确认，去掉滚动条，地址默认给2行
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
      aroundTypeFilter: ['school', 'hospital', 'airport', 'disinfoper',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { disinfoper };
