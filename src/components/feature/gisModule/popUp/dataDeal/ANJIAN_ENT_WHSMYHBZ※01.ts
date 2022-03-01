/**
 *缺少
 **/
// import { messsageBus } from '@/util/message';

const ANJIAN_ENT_WHSMYHBZ01: any = {
  // 工贸企业 承灾体
  'ANJIAN_ENT_WHSMYHBZ※01': {
    name: '暂无标题',
    unitObj: {
      _distance: 'km',
    },
    dataFilter: ['phone', 'districtname', 'address', '_distance'],
    labelObj: {
      phone: '电话',
      districtname: '行政区划',
      address: '地址',
      _distance: '距事发地',
    },
    // 下方的按钮
    btnFilter : [
      // 'pathPlanningBtn', // 路径规划
      // 'aroundAnalysisBtn', // 周边分析
      // 'videoMonitoringBtn', // 视频监控
      // 'hazardousChemicalsBtn', // 危化物联
    ],
    popHeight: 616,
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
  },
};

export { ANJIAN_ENT_WHSMYHBZ01 };
