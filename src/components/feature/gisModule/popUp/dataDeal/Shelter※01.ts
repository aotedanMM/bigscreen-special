/**
 *
 **/
// 避难场所

export const Shelter01: any = {
  shelter : {
    name: '暂无标题',
    unitObj: {

    },
    dataFilter: [
      'name',
      'SHELTERTYPE',
      'LEVELNAME',
      'districtname',
      'address',
      'MAXPERSONNUM',
      'CHARGEDEPT',
      'ABACUSAREA',
      'LONGITUDE',
      'LATITUDE',
      'NOTES',
    ],
    labelObj: {
      name: '名称',
      SHELTERTYPE: '类型',
      LEVELNAME: '级别',
      districtname: '行政区划',
      address: '地址',
      MAXPERSONNUM: '可容纳人数',
      CHARGEDEPT: '日常维护单位',
      ABACUSAREA: '有效面积',
      LONGITUDE: '经度',
      LATITUDE: '纬度',
      NOTES: '备注',
    },
    // 下方的按钮
    btnFilter: [
      // 'pathPlanningBtn', // 路径规划
      // 'aroundAnalysisBtn', // 周边分析
      // 'videoMonitoringBtn', // 视频监控
      // 'hazardousChemicalsBtn', // 危化物联
    ],
    popHeight: 330,
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
    },
  },
};
