"use strict";
/**
 *缺少行政区划
 **/
// import { messsageBus } from '@/util/message';
exports.__esModule = true;
exports.buttonList = void 0;
var buttonList = {
    // 按钮列表
    // 路径规划
    pathPlanningBtn: {
        name: 'pathPlanningBtn',
        text: '路径规划',
        className: 'pathPlanning',
        btnClick: function (self) {
            var that = self;
            that.pathClick();
        }
    },
    // 实时监测
    realTimeBtn: {
        name: 'realTimeBtn',
        text: '实时监测',
        className: 'realTime',
        btnClick: function (self) {
            var that = self;
            that.realTimeClick();
        }
    },
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 周边分析
    // aroundAnalysisBtn: {
    //   name: 'aroundAnalysisBtn',
    //   text: '周边分析',
    //   className: 'aroundAnalysis',
    //   btnClick(self: any) {
    //     const that = self;
    //     that.aroundClick();
    //   },
    // },
    // 周边视频
    aroundVideoBtn: {
        name: 'aroundVideoBtn',
        text: '周边视频',
        className: 'aroundVideo',
        btnClick: function (self) {
            var that = self;
            that.aroundVideoClick();
        }
    },
    // 蔓延分析
    fireCreep: {
        name: 'fireCreep',
        text: '蔓延分析',
        className: 'aroundVideo',
        btnClick: function (self) {
            var that = self;
            that.fireCreepClick();
        }
    },
    // 视频监控
    videoMonitoringBtn: {
        name: 'videoMonitoringBtn',
        text: '视频监控',
        className: 'popBtn',
        btnClick: function (self) {
            var that = self;
            that.videoClick();
        }
    },
    // 危化物联
    hazardousChemicalsBtn: {
        name: 'hazardousChemicalsBtn',
        text: '危化物联',
        className: 'popBtn',
        btnClick: function (self) {
            var that = self;
            that.chemicalsClick();
        }
    },
    // 企业视频
    companyVideoBtn: {
        name: 'companyVideoBtn',
        text: '企业视频',
        className: 'companyVideo',
        btnClick: function (self) {
            var that = self;
            that.companyVideoClick();
        }
    }
};
exports.buttonList = buttonList;
