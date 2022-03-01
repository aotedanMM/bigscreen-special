/**
 *缺少安全风险等级（ HAZARDLEVELCODE RISKLEVEL VARCHAR2(12) ）企业负责人(PRINCIPAL) 职工人数(EMPNUM) 总生产量(SUMOUTPUT) 总存储量(TOTALSTORCAP) 主要产品及生产规模(MAINPROTANDSCALE MAINPROTANDSCALESTR)
 **/
// import { messsageBus } from '@/util/message';

const hazardous: any = {
  // 危化企业
  name: '暂无标题',
  unitObj: {
  },
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

export { hazardous };
