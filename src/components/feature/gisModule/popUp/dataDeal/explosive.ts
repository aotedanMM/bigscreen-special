/**
 *缺少单位类型(DEPTTYPENAME) 法定代表人(ARTIFICIALPER) 联系电话 作业人数(WORKERNUM) 产品质量检验信息(QUALITYINFO)
 **/
// import { messsageBus } from '@/util/message';

const explosive: any = {
  // 烟花爆竹
  name: '暂无标题',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'legalperson',
  },
  telobj: {
    phone: 'phone',
  },
  dataFilter: ['unittype', 'legalperson', 'phone', 'staffnum', 'qualityinfo'],
  labelObj: {
    unittype: '单位类型',
    legalperson: '法定代表人',
    phone: '联系电话',
    staffnum: '作业人数',
    qualityinfo: '产品质量检验信息',
  },
  // 要显示的按钮
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
};

export { explosive };
