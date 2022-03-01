/**
 *缺少安全风险等级（ HAZARDLEVELCODE RISKLEVEL VARCHAR2(12) ）企业负责人(PRINCIPAL) 职工人数(EMPNUM) 总生产量(SUMOUTPUT) 总存储量(TOTALSTORCAP) 主要产品及生产规模(MAINPROTANDSCALE MAINPROTANDSCALESTR)
 **/
// import { messsageBus } from '@/util/message';

const majorDanger: any = {
  // 危化企业
  name: '暂无标题',
  unitObj: {
    _distance: 'km',
  },
  dataFilter: [
    'dangertypename',
    'dangerlevelname',
    'districtname',
    'address',
    'parentunit',
    '_distance',
  ],
  labelObj: {
    dangertypename: '危险源类型',
    dangerlevelname: '危险源等级',
    districtname: '所属区域',
    address: '地址',
    parentunit: '隶属单位',
    _distance: '距事发地',
  },
  // 下方的按钮
  btnFilter : [
    // 'pathPlanningBtn', // 路径规划
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
  //  'aroundAnalysisBtn', // 周边分析
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
};

export { majorDanger };
