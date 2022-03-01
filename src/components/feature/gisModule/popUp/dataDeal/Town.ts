/**
 *
 **/
// import { messsageBus } from '@/util/message';

const Town: any = {
  // 乡镇
  name: '暂无标题',
  unitObj: {
    population: '万人',
    area: '平方公里',
    _distance: 'km',
  },
  dataFilter: ['area', '_distance', 'population'], // ['name', 'area', '_distance', 'population']
  labelObj: {
    // name: '名称',
    area: '面积',
    _distance: '距事发地',
    population: '人口数量',
  },
  popHeight: 333,
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
  /* pathTypeFilter: ['RescueTeam※03'],
      aroundTypeFilter: ['school', 'hospital', 'airport', 'portwharf',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export { Town };
