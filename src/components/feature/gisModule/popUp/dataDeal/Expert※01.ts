/**
 * 专家
 **/
// import { messsageBus } from '@/util/message';

export const Expert: any = {'Expert※01': {
  name: '暂无标题',
  unitObj: {
  },
  telobj: {
    TEL: 'TEL',
  },
  dataFilter: [
      // 'NAME',
      'DEPTNAME',
      'EXPERTISE',
      'DESC',
      'districtname',
      'TEL',

  ],
  labelObj: {
    // NAME: '名称',
    DEPTNAME: '工作单位',
    EXPERTISE: '专业专长',
    DESC: '职称',
    districtname: '行政区划',
    TEL: '联系电话',
  },
  popHeight: 433,
    cb(self: any) {
      const that = self;
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
      that.isShowPathPlanningBtn = false;
      that.isAroundAnalysisBtn = false;
    },

},
};


