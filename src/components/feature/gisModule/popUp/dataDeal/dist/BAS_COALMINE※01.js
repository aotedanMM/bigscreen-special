"use strict";
/**
 *缺少煤矿企业状态(COALSTATECODE) 设计生产能力(DESIGN_OUTPUT) 法人(LEGAL_NAME) 职工人数(WORERNUM) 调度室电话(CONTROLCENTERTEL) 上级企业(PARENTNAME) 瓦斯等级(WS_GRADENAME) 投产时间(PRODUCT_DATE) 开拓方式(MINESTYLENAME)
 **/
// import { messsageBus } from '@/util/message';
exports.__esModule = true;
exports.BAS_COALMINE01 = void 0;
var BAS_COALMINE01 = {
    // 煤矿企业 承灾体
    coal: {
        name: '暂无标题',
        unitObj: {
            capability: '万吨'
        },
        telobj: {
            controlphone: 'controlphone'
        },
        btnFilter: [
            //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
            // 'aroundAnalysisBtn', // 周边分析
            'aroundVideoBtn',
        ],
        dataFilter: [
            'minestatus',
            'address',
            'capability',
            'legalperson',
            'legalpersonphone',
            'staffnum',
            'controlphone',
            'superiorenterprise',
            'gaslevel',
            'productiondate',
            'miningtype',
        ],
        labelObj: {
            minestatus: '矿井状态',
            address: '地址',
            capability: '设计生产能力',
            legalperson: '法人',
            legalpersonphone: '法人电话',
            staffnum: '职工人数',
            controlphone: '调度室电话',
            superiorenterprise: '上级企业',
            gaslevel: '瓦斯等级',
            productiondate: '投产时间',
            miningtype: '开拓方式'
        },
        popHeight: 616,
        cb: function (self) {
            var that = self;
            // tslint:disable-next-line:no-debugger
            // debugger;
            // 判断投产时间
            if (that.data.productiondate !== '' || that.data.productiondate) {
                var dateee = new Date(that.data.productiondate).toJSON();
                that.data.productiondate = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            }
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
exports.BAS_COALMINE01 = BAS_COALMINE01;
