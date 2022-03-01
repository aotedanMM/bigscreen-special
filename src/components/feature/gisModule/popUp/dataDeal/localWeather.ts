/**
 *
 **/
// import { messsageBus } from '@/util/message';


const  localWeather: any = {// 当地天气
    name: '暂无标题',
    unitObj: {
        distance: '公里',
        eClass: 'M',
        eDeep: 'Km',
    },
    dataFilter: [
        'NAME',
        'DESC',
        'TEL',
        'DISTRICT',
        'address',
    ],
    labelObj: {
        NAME: '名称',
        DESC: '描述',
        TEL: '电话',
        DISTRICT: '行政区划',
        address: '地址',
      },
      cb(self: any) {
        const that = self;
        // tslint:disable-next-line:no-debugger
        // debugger;
        if (that.data && that.data.attributeSet && that.data.attributeSet.attributes) {
            that.dataAttributes = that.data.attributeSet.attributes;
            that.getData();
        } else if (that.data && that.popUpType  && that.popUpType === 'disaster_sta_feature_type') {
            that.dataChild = that.data;
            that.getDataChild();
        } else if (that.data) {
           that.dataTag = that.data;
           that.getDataTag();
        }
      },
      /* pathTypeFilter: ['RescueTeam※03'],
      aroundTypeFilter: ['school', 'hospital', 'airport', 'portwharf',
        'railwaystation', '_RealShip'],
      isShowPathPlanningBtn: false,
      isAroundAnalysisBtn: false, */
};

export {
  localWeather,
};
