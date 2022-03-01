/**
 *缺少行政区划
 **/
// import { messsageBus } from '@/util/message';

const hiddendisastersites: any = {
    // 地灾隐患点
    name: '暂无标题',
    unitObj: {
        _distance: 'km',
        THREATWEALTH: '万元',
    },
    dataFilter: ['DISTRICTNAME', 'ADDRESS', 'HAZARDLEVELCODE', 'THREATOBJ', 'MAXPERSONNUM', 'THREATWEALTH', '_distance'],
    labelObj: {
        DISTRICTNAME: '行政区划',
        ADDRESS: '地址',
        HAZARDLEVELCODE: '危险等级',
        THREATOBJ: '威胁对象',
        MAXPERSONNUM: '威胁人数',
        THREATWEALTH: '威胁财产',
        _distance: '距事发地距离',
    },
    popHeight: 423,
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
        aroundTypeFilter: ['school', 'hospital', 'airport', 'reservoir',
          'railwaystation', '_RealShip'],
        isShowPathPlanningBtn: false,
        isAroundAnalysisBtn: false, */
};

export {hiddendisastersites};
