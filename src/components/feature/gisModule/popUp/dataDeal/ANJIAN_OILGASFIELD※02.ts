/**
 *缺少 运行状况(RUNSTATUSNAME) 主要负责人(WKKFZR) 联系电话 是否属于重大危险源(0是,1否,9未知 SFSYZDWXY) 尾矿库型式(CODE_TAILINGPOND_TYPE) 尾矿库等级(CODE_TAILINGPOND_GRADE)  尾矿库现状安全度(WKKAQDNAME) 目前主坝长(MQZBC) 目前堆积坝高度(MQDJBGD)
 **/
// import { messsageBus } from '@/util/message';

const ANJIAN_OILGASFIELD02: any = {
    // 尾矿库 承灾体
    'ANJIAN_OILGASFIELD※02': {
        name: '暂无标题',
        unitObj: {},
        telPelope: { // 电话拨打后对应人名
            ZYFZRBGDH: 'ZYFZR',
            ZYFZRYDDH: 'ZYFZR',
        },
        telobj: {
            ZYFZRBGDH: 'ZYFZRBGDH',
            ZYFZRYDDH: 'ZYFZRYDDH',
        },
        dataFilter: [
            'SYFLMC',
            'SEAAREANAME',
            'KCJZMC',
            'ZYFZR',
            'ZYFZRBGDH',
            'ZYFZRYDDH',
            'CYRYS',
            'TZZYRYSL',
            'AQSCXKZBH',
        ],
        labelObj: {
            SYFLMC: '汽油类型',
            SEAAREANAME: '所属海域',
            KCJZMC: '开采介质',
            ZYFZR: '主要负责人',
            ZYFZRBGDH: '负责人办公室电话',
            ZYFZRYDDH: '负责人移动电话',
            CYRYS: '从业人员数量',
            TZZYRYSL: '特种作业人员数量',
            AQSCXKZBH: '安全生产许可证编号',
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
        /* pathTypeFilter: ['RescueTeam※03'],
            aroundTypeFilter: ['school', 'hospital', 'airport', 'mine',
              'railwaystation', '_RealShip'],
            isShowPathPlanningBtn: false,
            isAroundAnalysisBtn: false, */
    },
};

export { ANJIAN_OILGASFIELD02 };
