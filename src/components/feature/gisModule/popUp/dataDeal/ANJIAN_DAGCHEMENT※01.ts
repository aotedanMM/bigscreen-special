/**
 *缺少
 **/
// import { messsageBus } from '@/util/message';

const ANJIAN_DAGCHEMENT01: any = {
  // 危化企业 承灾体
  productionindustry: {
    name: '暂无标题',
    unitObj: {},
    dataFilter: [
      'safetylevel',
      'address',
      'chargeperson',
      'staffnum',
      'totalproduction',
      'totalstorage',
      'mainproduct',
    ],
    labelObj: {
      safetylevel: '安全风险等级',
      address: '地址',
      chargeperson: '企业负责人',
      staffnum: '职工人数',
      totalproduction: '总生产量',
      totalstorage: '总存储量',
      mainproduct: '主要产品及生产规模',
    },
    // 下方的按钮
    btnFilter : [
      // 'pathPlanningBtn', // 路径规划
      // 'aroundAnalysisBtn', // 周边分析
      'videoMonitoringBtn', // 视频监控
      'hazardousChemicalsBtn', // 危化物联
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
  },
};
export { ANJIAN_DAGCHEMENT01 };
