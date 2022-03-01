"use strict";
/**
 *缺少 运行状况(RUNSTATUSNAME) 主要负责人(WKKFZR) 联系电话 是否属于重大危险源(0是,1否,9未知 SFSYZDWXY) 尾矿库型式(CODE_TAILINGPOND_TYPE) 尾矿库等级(CODE_TAILINGPOND_GRADE)  尾矿库现状安全度(WKKAQDNAME) 目前主坝长(MQZBC) 目前堆积坝高度(MQDJBGD)
 **/
// import { messsageBus } from '@/util/message';
exports.__esModule = true;
exports.ANJIAN_METALNONMETAL01 = void 0;
var ANJIAN_METALNONMETAL01 = {
    // 金属非金属矿山
    metalnonmetal: {
        name: '暂无标题',
        unitObj: {},
        telPelope: {
            KSFZRBGSDH: 'KSFZR',
            KSFZRYDDH: 'KSFZR'
        },
        telobj: {
            KSFZRBGSDH: 'KSFZRBGSDH',
            KSFZRYDDH: 'KSFZRYDDH'
        },
        btnFilter: [
            //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
            //   'aroundAnalysisBtn', // 周边分析
            'aroundVideoBtn',
        ],
        dataFilter: [
            'INDUSTRYNAME',
            'MINENAME',
            'KCFSMC',
            'STGRADENAME',
            'KSFZR',
            'KSFZRBGSDH',
            'KSFZRYDDH',
            'TZZYRYSL',
            'AQSCXKZ',
        ],
        labelObj: {
            INDUSTRYNAME: '所属行业',
            MINENAME: '所属矿种',
            KCFSMC: '开采方式',
            STGRADENAME: '标准化等级',
            KSFZR: '负责人',
            KSFZRBGSDH: '负责人办公室电话',
            KSFZRYDDH: '负责人移动电话',
            TZZYRYSL: '特种作业人员数量',
            AQSCXKZ: '安全生产许可证编号'
        },
        popHeight: 616,
        cb: function (self) {
            var that = self;
            // tslint:disable-next-line:no-debugger
            // debugger;
            if (that.data &&
                that.data.attributeSet &&
                that.data.attributeSet.attributes) {
                that.dataAttributes = that.data.attributeSet.attributes;
                that.getpopData(that.dealAttributes());
            }
            else {
                that.getpopData(that.data);
            }
        }
    }
};
exports.ANJIAN_METALNONMETAL01 = ANJIAN_METALNONMETAL01;
