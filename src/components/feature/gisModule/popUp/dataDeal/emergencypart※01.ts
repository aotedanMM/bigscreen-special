/**
 *缺少 联系方式（暂未确认）
 **/
// import { messsageBus } from '@/util/message';

const emergencypart01: any = {
  // 应急部门 承灾体
  'emergencypart※01': {
    name: '暂无标题',
    unitObj: {
      _distance: 'km',
    },
    dataFilter: [ 'address', 'phone', '_distance'],
    labelObj: {
      address: '地址',
      phone: '联系方式',
      _distance: '距事发地',
    },
    // 下方的按钮
    btnFilter : [
      'pathPlanningBtn', // 路径规划
      'aroundAnalysisBtn', // 周边分析
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
      aroundTypeFilter: ['school', 'hospital', 'airport', 'emergencypart',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
  },
};

export { emergencypart01 };
