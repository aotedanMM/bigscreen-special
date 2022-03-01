/**
 *缺少单位类型(DEPTTYPENAME) 法定代表人(ARTIFICIALPER) 联系电话 作业人数(WORKERNUM) 产品质量检验信息(QUALITYINFO)
 **/
// import { messsageBus } from '@/util/message';

const ANJIAN_FIREWORKENT01: any = {
  // 烟花爆竹 一键搜 和 应急资源
  'ANJIAN_FIREWORKENT※01': {
    name: '暂无标题',
    unitObj: {
      _distance: '公里',
      eClass: 'M',
      eDeep: 'Km',
    },
    dataFilter: [
      'unittype',
      'legalperson',
      'phone',
      'staffnum',
      'qualityinfo',
    ],
    labelObj: {
      unittype: '单位类型',
      legalperson: '法定代表人',
      phone: '联系电话',
      staffnum: '作业人数',
      qualityinfo: '产品质量检验信息',
    },
    popHeight: 470,
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

export { ANJIAN_FIREWORKENT01 };
