"use strict";
/**
 *缺少行政区划
 **/
// import { messsageBus } from '@/util/message';
exports.__esModule = true;
exports.Airport01 = void 0;
var Airport01 = {
    airport: {
        // 机场 承灾体
        name: '暂无标题',
        unitObj: {
            _distance: 'km'
        },
        dataFilter: [
            'districtname',
            'address',
            'phone',
            'chargeperson',
            '_distance',
        ],
        labelObj: {
            districtname: '行政区划',
            address: '地址',
            phone: '电话',
            chargeperson: '负责人',
            _distance: '距事发地'
        },
        // 下方的按钮
        btnFilter: [
            'pathPlanningBtn',
        ],
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
exports.Airport01 = Airport01;
