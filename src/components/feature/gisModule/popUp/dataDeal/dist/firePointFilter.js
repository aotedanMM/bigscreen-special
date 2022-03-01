"use strict";
exports.__esModule = true;
exports.firePointTypesPopUpRule = exports.firePointPopUpTypesFilter = void 0;
// 火点都是这个配置
var firePointToday = {
    name: '火点信息',
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
        'fireCreep',
    ],
    unitObj: {
        area: '公顷'
    },
    telobj: {},
    dataFilter: [
        'address',
        'observationDatetime',
        'x',
        'y',
        'credibility',
        'area',
        'satellite',
        'wxtp',
    ],
    labelObj: {
        address: '地址',
        observationDatetime: '时间',
        x: '经度',
        y: '纬度',
        credibility: '可信度',
        area: '明火面积',
        satellite: '监测卫星',
        wxtp: '卫星图片'
    },
    popHeight: 720,
    cb: function (self) {
        // 处理字段返回json问题
        if (self.data.area) {
            self.data.area = self.data.area.toFixed(3);
        }
        if (self.data.observationDatetime) {
            self.data.observationDatetime = self.data.observationDatetime.slice(0, 16);
        }
        if (self.data &&
            self.data.attributeSet &&
            self.data.attributeSet.attributes) {
            self.dataAttributes = self.data.attributeSet.attributes;
            self.getpopData(self.dealAttributes());
        }
        else {
            self.getpopData(self.data);
        }
    }
};
// 火情信息
var historyFire = {
    name: '火情信息',
    btnFilter: [],
    unitObj: {},
    telobj: {},
    dataFilter: [
        'address',
        'occurTime',
        'info',
        'unit',
    ],
    labelObj: {
        address: '地点',
        occurTime: '时间',
        info: '火情描述',
        unit: '上报单位'
    },
    popHeight: 520,
    cb: function (self) {
        if (self.data &&
            self.data.attributeSet &&
            self.data.attributeSet.attributes) {
            self.dataAttributes = self.data.attributeSet.attributes;
            self.getpopData(self.dealAttributes());
        }
        else {
            self.getpopData(self.data);
        }
    }
};
// 匹配拦截类型
var firePointPopUpTypesFilter = [
    'firePointToday',
    'historyFire',
];
exports.firePointPopUpTypesFilter = firePointPopUpTypesFilter;
var firePointTypesPopUpRule = {
    // 地址灾害隐患点
    firePointToday: firePointToday,
    historyFire: historyFire
};
exports.firePointTypesPopUpRule = firePointTypesPopUpRule;
