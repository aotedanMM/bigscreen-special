/**
 *
 **/
// import { messsageBus } from '@/util/message';

const County: any = {
  // 乡村
  name: '暂无标题',
  // 单位
  unitObj: {
    population: '万人',
    area: '平方公里',
    _distance: 'km',
  },
  // 渲染属性的字段名以及顺序
  dataFilter: ['area', '_distance', 'population'],
  // 标题
  labelObj: {
    area: '面积',
    _distance: '距事发地',
    population: '人口数量',
  },
  popHeight: 333,
  // 回调函数
  cb(self: any) {

    const that = self;
    // tslint:disable-next-line:no-debugger
    // debugger;
    // that.data.population_unit = Math.round(that.data.population / 10000 * 100) / 100;
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

export { County };
