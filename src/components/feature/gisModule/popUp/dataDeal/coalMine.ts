/**
 *缺少
 **/
// import { messsageBus } from '@/util/message';

const coalMine: any = {
  // 煤矿企业
  name: '暂无标题',
  unitObj: {
    capability: '万吨',
  },
  dataFilter: [
    'minestatus',
    'address',
    'capability',
    'legalperson',
    'legalpersonphone',
    'staffnum',
    'controlphone',
    'superiorenterprise',
    'gaslevel',
    'productiondate',
    'miningtype',
  ],
  telPelope: { // 电话拨打后对应人名
    legalpersonphone: 'legalperson',
  },
  telobj: {
    legalpersonphone: 'legalpersonphone',
    controlphone: 'controlphone',
  },
  labelObj: {
    minestatus: '矿井状态',
    address: '地址',
    capability: '设计生产能力',
    legalperson: '法人',
    legalpersonphone: '法人电话', // 返回结果没有字段名称
    staffnum: '职工人数',
    controlphone: '调度室电话',
    superiorenterprise: '上级企业',
    gaslevel: '瓦斯等级',
    productiondate: '投产时间',
    miningtype: '开拓方式',
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

export { coalMine };
