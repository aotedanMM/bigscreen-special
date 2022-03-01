/**
 *缺少 运行状况(RUNSTATUSNAME) 主要负责人(WKKFZR) 联系电话 是否属于重大危险源(0是,1否,9未知 SFSYZDWXY) 尾矿库型式(CODE_TAILINGPOND_TYPE) 尾矿库等级(CODE_TAILINGPOND_GRADE)  尾矿库现状安全度(WKKAQDNAME) 目前主坝长(MQZBC) 目前堆积坝高度(MQDJBGD)
 **/
// import { messsageBus } from '@/util/message';

const mine: any = {
  // 非煤矿山
  name: '暂无标题',
  unitObj: {},
  dataFilter: [
    'runingstatus',
    'address',
    'chargeperson',
    'phone',
    'ismajordanger',
    'ganguetype',
    'ganguelevel',
    'ganguesafety',
    'damlength',
    'damheight',
  ],
  labelObj: {
    runingstatus: '运行状况',
    address: '地址',
    chargeperson: '主要负责人',
    phone: '联系电话',
    ismajordanger: '是否属于重大危险源',
    ganguetype: '尾矿库型式',
    ganguelevel: '尾矿库等级',
    ganguesafety: '尾矿库现状安全度',
    damlength: '目前主坝长',
    damheight: '目前堆积坝高度',
  },
  telPelope: { // 电话拨打后对应人名
    phone: 'chargeperson',
  },
  telobj: {
    phone: 'phone',
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

    if (that.data.damlength && that.data.damlength.toString().indexOf('米') === -1) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (that.data.ismajordanger !== '否' || that.data.ismajordanger !== '是' || that.data.ismajordanger !== '未知') {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
    }

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
      aroundTypeFilter: ['school', 'hospital', 'airport', 'mine',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { mine };
