"use strict";
exports.__esModule = true;
exports.hazardousTypesPopUpRule = exports.hazardousPopUpTypesFilter = void 0;
// 风险隐患
var geologicHazard = {
    name: '地质灾害隐患点详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {
        thrproperty: '万元',
        risknum: '人'
    },
    telPelope: {
        mobiletel: 'infopersonname'
    },
    telobj: {
        mobiletel: 'mobiletel'
    },
    dataFilter: [
        'name',
        'featurename',
        'fullname',
        'disasterscale',
        'hazardlevelname',
        'risknum',
        'thrproperty',
        'inducingfactors',
        'chargedept',
        'infopersonname',
        'mobiletel',
        'protection',
    ],
    labelObj: {
        name: '名称',
        featurename: '类型',
        fullname: '所在行政区域',
        disasterscale: '规模等级',
        hazardlevelname: '险情等级',
        // '威胁情况',
        risknum: '威胁人数',
        thrproperty: '威胁财产',
        inducingfactors: '形成原因',
        chargedept: '责任主体',
        // '群测群防员',
        infopersonname: '群测群防员',
        mobiletel: '群测群防联系方式',
        protection: '处置建议'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理字段返回json问题
        if (self.data.personinfo) {
            var personinfoJson = JSON.parse(self.data.personinfo);
            if (personinfoJson instanceof Array) {
                var num_1 = 0;
                personinfoJson.forEach(function (item) {
                    if (!item) {
                        return;
                    }
                    self.data.infopersonname = item.name;
                    self.data.mobiletel = item.mobiletel;
                    num_1++;
                });
            }
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
var theteamObj = {
    name: '现场队伍详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {
        teamSize: '人'
    },
    telPelope: {
        phone: 'captain'
    },
    telobj: {
        phone: 'phone'
    },
    dataFilter: [
        'teamName',
        'address',
        'captain',
        'phone',
        'dataTime',
        'equipment',
        'teamSize',
    ],
    labelObj: {
        teamName: '队伍名称',
        address: '地址',
        captain: '队长姓名',
        phone: '电话',
        dataTime: '到底时间',
        equipment: '主要装备',
        teamSize: '队伍人数'
    },
    popHeight: 720,
    cb: function (self) {
        // 处理字段返回json问题
    }
};
// 尾矿库
var tailingsPond = {
    name: '尾矿库详情',
    unitObj: {
        designservlife: '年',
        servlife: '年',
        xzqkr: '万立方米',
        designcapa: '万立方米',
        mqdjbgd: '米',
        designdamht: '米'
    },
    telPelope: {
        wkkfzrbgsdh: 'wkkfzr',
        wkkfzryddh: 'wkkfzr'
    },
    telobj: {
        wkkfzrbgsdh: 'wkkfzrbgsdh',
        wkkfzryddh: 'wkkfzryddh'
    },
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    dataFilter: [
        'name',
        'address',
        'runstatusname',
        'countyrespper',
        'countyrespperduty',
        'wkkaqdname',
        'wkkdbname',
        'isoverlibrary',
        'affectnum',
        'mineralspe',
        'designservlife',
        'servlife',
        'isdilatation',
        'sfazzxjcxt',
        'designdamht',
        'mqdjbgd',
        'designcapa',
        'xzqkr',
        'dammethod',
        'noncoalentname',
        'wkkfzr',
        'wkkfzrbgsdh',
        'wkkfzryddh',
        'sfaqscxkz',
        'aqscxkzjzrq',
    ],
    labelObj: {
        name: '名称',
        address: '详细地址',
        runstatusname: '运营状况',
        countyrespper: '地方政府包保责任人姓名',
        countyrespperduty: '职务',
        wkkaqdname: '安全度',
        wkkdbname: '尾矿库等别',
        isoverlibrary: '是否头顶库',
        affectnum: '下游1000米受影响人数或设施',
        mineralspe: '矿种',
        designservlife: '设计服务年限',
        servlife: '已服务年限',
        isdilatation: '是否经过扩容',
        sfazzxjcxt: '是否安装在线监测',
        designdamht: '设计坝高',
        mqdjbgd: '现状坝高',
        designcapa: '设计库容',
        xzqkr: '现状库容',
        dammethod: '筑坝方式',
        noncoalentname: '所属企业',
        wkkfzr: '单位主要负责人',
        wkkfzrbgsdh: '负责人办公电话',
        wkkfzryddh: '负责人移动电话',
        sfaqscxkz: '是否有安全生产许可证',
        aqscxkzjzrq: '安全许可证有效期'
    },
    popHeight: 760,
    cb: function (self) {
        var isoverlibrary = {
            0: '否',
            1: '是'
        };
        var isdilatation = {
            0: '否',
            1: '是'
        };
        var sfaqscxkz = {
            0: '是',
            1: '否',
            9: '未知'
        };
        // 是否为“头顶库”
        if (self.data.isoverlibrary) {
            self.data.isoverlibrary = isoverlibrary[self.data.isoverlibrary] || '- -';
        }
        // 是否经过扩容
        if (self.data.isdilatation) {
            self.data.isdilatation = isdilatation[self.data.isdilatation] || '- -';
        }
        // 是否有安全生产许可证(
        if (self.data.sfaqscxkz) {
            self.data.sfaqscxkz = sfaqscxkz[self.data.sfaqscxkz] || '- -';
        }
        // 是否安装在线监测(
        if (self.data.sfazzxjcxt) {
            self.data.sfazzxjcxt = sfaqscxkz[self.data.sfazzxjcxt] || '- -';
        }
        // 处理时间
        if (self.data.aqscxkzjzrq) {
            // 时间转化，提取年月日
            var date = new Date(self.data.aqscxkzjzrq);
            self.data.aqscxkzjzrq = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        if (self.data) {
            self.getpopData(self.data);
        }
    }
};
// 烟花爆竹企业
var fireworksCrackers = {
    name: '烟花爆竹企业详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {
        warnum: '个',
        workernum: '人',
        trancar: '辆',
        designarea: '平方米',
        usablearea: '平方米'
    },
    telPelope: {
        tel: 'artificialper'
    },
    telobj: {
        tel: 'tel'
    },
    dataFilter: [
        'name',
        'busilicvaliddate',
        'busscope',
        'address',
        'waraddress',
        'warnum',
        'wararea',
        'designstock',
        'peakstock',
        'showloc',
        'artificialper',
        'tel',
        'workernum',
        'trancar',
    ],
    labelObj: {
        name: '名称',
        busilicvaliddate: '详细标准化有效期',
        busscope: '经营范围',
        address: '注册地址',
        waraddress: '仓库地址',
        warnum: '仓库个数',
        wararea: '面积',
        designstock: '设计存量',
        peakstock: '旺季存量',
        showloc: '展厅位置',
        artificialper: '负责人',
        tel: '联系电话',
        workernum: '从业人员',
        trancar: '运输车辆'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.busilicvaliddate) {
            // 时间转化，提取年月日
            var date = new Date(self.data.busilicvaliddate);
            self.data.busilicvaliddate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
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
// 烟花爆竹仓库
var fireworksCrackersWarehouse = {
    name: '烟花爆竹仓库详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {
        warnum: '个',
        workernum: '人',
        trancar: '辆',
        designarea: '平方米',
        usablearea: '平方米'
    },
    telPelope: {
        contactmtel: 'contactper'
    },
    telobj: {
        contactmtel: 'contactmtel'
    },
    dataFilter: [
        'name',
        'fireworkentname',
        'fullname',
        'address',
        'longitude',
        'latitude',
        'contactper',
        'contacttel',
    ],
    labelObj: {
        name: '名称',
        fireworkentname: '烟花爆竹企业',
        fullname: '行政区划',
        address: '地址',
        longitude: '经度',
        latitude: '纬度',
        contactper: '负责人',
        contacttel: '负责人移动电话'
    },
    popHeight: 760,
    cb: function (self) {
        if (self.data.longitude && Number(self.data.longitude)) {
            self.data.longitude = Number(self.data.longitude).toFixed(5);
        }
        if (self.data.latitude && Number(self.data.latitude)) {
            self.data.latitude = Number(self.data.latitude).toFixed(5);
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
// 金属非金属矿山/非煤矿山
var metalMine = {
    name: '非煤矿山详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        ksfzryddh: 'ksfzr',
        aqfzryddh: 'aqfzr'
    },
    telobj: {
        ksfzryddh: 'ksfzryddh',
        aqfzryddh: 'aqfzryddh'
    },
    dataFilter: [
        'name',
        'address',
        'industryminename',
        'desproscale',
        'nowtailpond',
        'ksfzr',
        'ksfzryddh',
        'aqfzr',
        'aqfzryddh',
        'economytypename',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        industryminename: '开采矿种',
        desproscale: '设计生产规模',
        nowtailpond: '现有尾矿库',
        economytypename: '主管企业性质',
        ksfzr: '主要负责人',
        ksfzryddh: '主要负责人电话',
        aqfzr: '分管负责人',
        aqfzryddh: '分管负责人电话'
    },
    popHeight: 786,
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
// 煤矿企业
var coalMineEnterprise = {
    name: '煤矿企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {
        worernum: '人',
        minearea: '平方公里',
        approved_mine_depth: '米',
        design_output: '万吨/年'
    },
    telPelope: {
        principal_cell: 'principal'
    },
    telobj: {
        principal_cell: 'principal_cell'
    },
    dataFilter: [
        'name',
        'chargedept',
        'address',
        'minearea',
        'worernum',
        'legal_name',
        'approved_mine_depth',
        'design_output',
        'service_years',
        'product_date',
        'ws_grade',
        'a_mine_firedescrip',
        'a_grime_explosivedescrip',
        'rockburst',
        'principal_cell',
        'principal',
        'hydrogeological',
    ],
    labelObj: {
        name: '名称',
        chargedept: '主管单位',
        address: '地址',
        minearea: '井田面积',
        worernum: '员工',
        legal_name: '法定代表人',
        approved_mine_depth: '允许开采深度',
        design_output: '设计生产能力',
        service_years: '设计服务年限',
        product_date: '投产日期',
        ws_grade: '瓦斯等级',
        a_mine_firedescrip: '煤层自然倾向性说明',
        a_grime_explosivedescrip: '煤层爆炸性说明',
        rockburst: '冲击地压类型',
        principal_cell: '联系电话',
        principal: '主要负责人',
        hydrogeological: '水文地质类型'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.product_date) {
            // 时间转化，提取年月日
            var startDate = new Date(self.data.product_date);
            var endDate = new Date(self.data.product_date);
            self.data.product_date = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate();
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
var noncoallMineEnterprise = {
    name: '非煤企业详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
        'realTimeBtn',
    ],
    unitObj: {
        worernum: '人',
        minearea: '平方公里',
        approved_mine_depth: '米',
        design_output: '万吨/年'
    },
    telPelope: {
        artificialper: 'artificialper'
    },
    telobj: {
        artificialperotel: 'artificialperotel',
        artificialpermtel: 'artificialpermtel'
    },
    dataFilter: [
        'name',
        'address',
        'artificialper',
        'artificialperotel',
        'artificialpermtel',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        artificialper: '法人姓名',
        artificialperotel: '办公室电话',
        artificialpermtel: '移动电话'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.product_date) {
            // 时间转化，提取年月日
            var startDate = new Date(self.data.product_date);
            var endDate = new Date(self.data.product_date);
            self.data.product_date = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate();
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
// 工贸企业
// 冶金行业-有色金属
var industryTrading1 = {
    name: '工贸企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 建材行业
var buildingmaterial = {
    name: '建材行业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 轻工行业
var lightindustry = {
    name: '轻工行业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 纺织行业
var spin = {
    name: '纺织行业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 烟草行业
var tobacco = {
    name: '烟草行业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 商贸行业
var commerce = {
    name: '商贸行业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 机械铸造
var industryTrading3 = {
    name: '机械铸造详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {
        outvalue: '万元'
    },
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'address',
        'mianprd',
        'ishavtemequ',
        'outvalue',
        'county',
        'contactper',
        'contactpertel',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        ishavtemequ: '是否有高温熔融设备',
        outvalue: '产值',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 726,
    cb: function (self) {
        var ishavtemequ = {
            0: '是',
            1: '否'
        };
        if (self.data.ishavtemequ) {
            self.data.ishavtemequ = ishavtemequ[self.data.ishavtemequ] || '- -';
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
// 涉氨制冷
var industryTrading4 = {
    name: '涉氨制冷详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {
        singlefreezer: '台',
        liquidrese: '吨',
        invflournum: '吨',
        quickfreezer: '套'
    },
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'address',
        'liquidrese',
        'singlefreezer',
        'isamrefaircond',
        'runtype',
        'issepworkshop',
        'county',
        'contactper',
        'contactpertel',
        'quickfreezer',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        liquidrese: '液氨储量',
        quickfreezer: '快速冻结装置',
        singlefreezer: '单冻机',
        isamrefaircond: '是否采用氨直接蒸发制冷空调',
        runtype: '运行方式',
        issepworkshop: '快速冻结装置是否设置在单独作业间内',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
    cb: function (self) {
        var isamrefaircond = {
            1: '是',
            0: '否'
        };
        if (self.data.isamrefaircond) {
            self.data.isamrefaircond = isamrefaircond[self.data.isamrefaircond] || '- -';
        }
        if (self.data.issepworkshop) {
            self.data.issepworkshop = isamrefaircond[self.data.issepworkshop] || '- -';
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
// 粉尘涉爆
var industryTrading5 = {
    name: '工贸企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {
        invflournum: '人'
    },
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'address',
        'mianprd',
        'indsmalltype',
        'county',
        'invflournum',
        'contactper',
        'contactpertel',
    ],
    labelObj: {
        name: '名称',
        address: '注册地址',
        mianprd: '主要产品',
        indsmalltype: '粉尘种类',
        invflournum: '每班最多涉粉作业人数',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
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
// 涉氨制冷
var industryTrading7 = {
    name: '工贸企业详情详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'mianprd',
        'capaprd',
        'county',
        'contactper',
        'contactpertel',
        'address',
    ],
    labelObj: {
        name: '名称',
        address: '地址',
        mianprd: '主要产品',
        capaprd: '产能',
        county: '所属区市',
        contactper: '安全负责人',
        contactpertel: '联系电话'
    },
    popHeight: 760,
    cb: function (self) {
        if (self.data.county && self.data.county.FULLNAME) {
            self.data.county = self.data.county.FULLNAME || '- -';
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
// 重大危险源
var majorHazard = {
    name: '重大危险源详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {
    // danmatnum: '吨',
    },
    telPelope: {
        chargepertel: 'chargeper'
    },
    telobj: {
        chargepertel: 'chargepertel'
    },
    dataFilter: [
        'firmname',
        'hazardlevelcode',
        'dangertypename',
        'cindustryclass',
        'name',
        'danmatname',
        'danmatnum',
        'stoorprd',
        'address',
        'districtname',
        'dsispark',
        'competdep',
        'chargeper',
        'chargepertel',
    ],
    labelObj: {
        firmname: '法人单位名称',
        hazardlevelcode: '重大危险源等级',
        dangertypename: '危险源类型名称',
        cindustryclass: '行业类别名',
        name: '名称',
        danmatname: '涉及危险化学品',
        danmatnum: '涉及危险化学品数量',
        stoorprd: '储存场所或生产装置',
        address: '地址',
        districtname: '所在地（县市区）',
        dsispark: '是否在化工园区',
        competdep: '备案部门',
        chargeper: '联系人',
        chargepertel: '联系电话'
    },
    popHeight: 773,
    cb: function (self) {
        var hazardlevelcode = {
            1: '一级',
            2: '二级',
            3: '三级',
            4: '四级'
        };
        // 危险等级代码
        if (self.data.hazardlevelcode) {
            self.data.hazardlevelcode = hazardlevelcode[self.data.hazardlevelcode] || '- -';
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
// 生产企业
var manufacturing = {
    name: '生产企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        safetymagertel: 'safetymager'
    },
    telobj: {
        safetymagertel: 'safetymagertel'
    },
    dataFilter: [
        'name',
        'propertyname',
        'address',
        'principal',
        'safetymager',
        'safetymagertel',
        'jyfw',
        'xzxkyxqxksrq',
        'regstartdate',
        'xzxkzbh',
        'changeinfo',
    ],
    labelObj: {
        name: '名称',
        propertyname: '类型',
        address: '详细地址',
        principal: '主要负责人',
        safetymager: '安全负责人',
        safetymagertel: '联系电话',
        jyfw: '许可范围',
        xzxkyxqxksrq: '许可有效期',
        regstartdate: '登记有效期',
        xzxkzbh: '发证编号',
        changeinfo: '变更信息'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.xzxkyxqxksrq) {
            // 时间转化，提取年月日
            var startDate = new Date(self.data.xzxkyxqxksrq);
            var endDate = new Date(self.data.xzxkyxqxjsrq);
            self.data.xzxkyxqxksrq = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " \u2014 " + endDate.getFullYear() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getDate();
        }
        // 处理时间
        if (self.data.regstartdate) {
            // 时间转化，提取年月日
            var date = new Date(self.data.regstartdate);
            self.data.regstartdate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
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
// 经营企业
var conductEnterprise = {
    name: '经营企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        safetymagertel: 'safetymager'
    },
    telobj: {
        safetymagertel: 'safetymagertel'
    },
    dataFilter: [
        'name',
        'address',
        'artificialper',
        'safetymager',
        'safetymagertel',
        'jyfw',
        'operationmode',
        'certificatime',
        // ,
        'xzxkyxqxjsrq',
        'xzxkzbh',
        'dangerlevel',
        'highlytoxicchemicals',
        'explosivechemicals',
        'precursorchemicals',
    ],
    labelObj: {
        name: '名称',
        address: '详细地址',
        artificialper: '法定代表人',
        safetymager: '联系人',
        safetymagertel: '联系电话',
        jyfw: '经营范围',
        operationmode: '经营方式',
        certificatime: '发证日期',
        xzxkyxqxjsrq: '许可有效期',
        xzxkzbh: '发证编号',
        dangerlevel: '重大危险源等级',
        highlytoxicchemicals: '涉及剧毒品经营品种',
        explosivechemicals: '涉及易制爆化学品经营品种',
        precursorchemicals: '涉及易制毒化学品经营品种'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.certificatime) {
            // 时间转化，提取年月日
            var date = new Date(self.data.certificatime);
            self.data.certificatime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        // 处理时间
        if (self.data.xzxkyxqxjsrq && self.data.xzxkyxqxksrq) {
            // 时间转化，提取年月日
            var startDate = new Date(self.data.xzxkyxqxksrq);
            var endDate = new Date(self.data.xzxkyxqxjsrq);
            self.data.xzxkyxqxjsrq = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " \u2014 " + endDate.getFullYear() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getDate();
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
// 供电设施
var powerfacilities = {
    name: '供电设施详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        mobiletel: 'person'
    },
    telobj: {
        mobiletel: 'mobiletel'
    },
    popHeight: 650,
    dataFilter: ['name', 'address', 'person', 'mobiletel', 'districtname'],
    labelObj: {
        name: '名称',
        address: '地址',
        person: '联系人',
        mobiletel: '电话',
        districtname: '行政区划'
    },
    cb: function (self) {
        var that = self;
        if (that.data.pac && that.data.pac.FULLNAME) {
            that.data.districtname = that.data.pac.FULLNAME;
        }
        if (that.data.FULLNAME) {
            that.data.districtname = that.data.FULLNAME;
        }
        if (that.data.personinfo && JSON.parse(that.data.personinfo)[0]) {
            that.data.person = JSON.parse(that.data.personinfo)[0].name;
            that.data.mobiletel = JSON.parse(that.data.personinfo)[0].mobiletel || JSON.parse(that.data.personinfo)[0].mobiletel2 || '';
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
};
// 供水设施
var powerfacilitiesTwo = {
    name: '供水设施详情',
    btnFilter: [
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        mobiletel: 'person'
    },
    telobj: {
        mobiletel: 'mobiletel'
    },
    popHeight: 650,
    dataFilter: ['name', 'address', 'person', 'mobiletel', 'districtname'],
    labelObj: {
        name: '名称',
        address: '地址',
        person: '联系人',
        mobiletel: '电话',
        districtname: '行政区划'
    },
    cb: function (self) {
        var that = self;
        if (that.data.pac && that.data.pac.FULLNAME) {
            that.data.districtname = that.data.pac.FULLNAME;
        }
        if (that.data.FULLNAME) {
            that.data.districtname = that.data.FULLNAME;
        }
        if (that.data.personinfo && JSON.parse(that.data.personinfo)[0]) {
            that.data.person = JSON.parse(that.data.personinfo)[0].name;
            that.data.mobiletel = JSON.parse(that.data.personinfo)[0].mobiletel || JSON.parse(that.data.personinfo)[0].mobiletel2 || '';
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
};
// 危化企业
var dangerousEnterprise = {
    name: '危化企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        safetymagertel: 'safetymager'
    },
    telobj: {
        safetymagertel: 'safetymagertel'
    },
    dataFilter: [
        'name',
        'address',
        'artificialper',
        'safetymager',
        'safetymagertel',
        'jyfw',
        'operationmode',
        'certificatime',
        // ,
        'xzxkyxqxjsrq',
        'xzxkzbh',
        'dangerlevel',
        'highlytoxicchemicals',
        'explosivechemicals',
        'precursorchemicals',
    ],
    labelObj: {
        name: '名称',
        address: '详细地址',
        artificialper: '法定代表人',
        safetymager: '联系人',
        safetymagertel: '联系电话',
        jyfw: '经营范围',
        operationmode: '经营方式',
        certificatime: '发证日期',
        xzxkyxqxjsrq: '许可有效期',
        xzxkzbh: '发证编号',
        dangerlevel: '重大危险源等级',
        highlytoxicchemicals: '涉及剧毒品经营品种',
        explosivechemicals: '涉及易制爆化学品经营品种',
        precursorchemicals: '涉及易制毒化学品经营品种'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.certificatime) {
            // 时间转化，提取年月日
            var date = new Date(self.data.certificatime);
            self.data.certificatime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        // 处理时间
        if (self.data.xzxkyxqxjsrq && self.data.xzxkyxqxksrq) {
            // 时间转化，提取年月日
            var startDate = new Date(self.data.xzxkyxqxksrq);
            var endDate = new Date(self.data.xzxkyxqxjsrq);
            self.data.xzxkyxqxjsrq = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate() + " \u2014 " + endDate.getFullYear() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getDate();
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
// 使用企业
var usingEnterprise = {
    name: '使用企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        safetymagertel: 'safetymager'
    },
    telobj: {
        safetymagertel: 'safetymagertel'
    },
    dataFilter: [
        'name',
        'propertyname',
        'address',
        'artificialper',
        'principal',
        'safetymager',
        'safetymagertel',
        'jyfw',
        'certificatime',
        'xzxkyxqxksrq',
        'xzxkyxqxjsrq',
        'xzxkzbh',
    ],
    labelObj: {
        name: '名称',
        propertyname: '类型',
        address: '详细地址',
        artificialper: '法定代表人',
        principal: '主要负责人',
        safetymager: '联系人',
        safetymagertel: '联系电话',
        jyfw: '许可范围',
        // '': '经营方式',
        certificatime: '发证日期',
        xzxkyxqxksrq: '许可有效期',
        xzxkyxqxjsrq: '许可结束期',
        xzxkzbh: '发证编号'
    },
    popHeight: 760,
    cb: function (self) {
        // 处理时间
        if (self.data.certificatime) {
            // 时间转化，提取年月日
            var date = new Date(self.data.certificatime);
            self.data.certificatime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        var hazardlevelcode = {
            1: '一级',
            2: '二级',
            3: '三级',
            4: '四级'
        };
        // 危险等级代码
        if (self.data.hazardlevelcode) {
            self.data.hazardlevelcode = hazardlevelcode[self.data.hazardlevelcode] || '- -';
        }
        // 处理时间
        if (self.data.xzxkyxqxjsrq) {
            // 时间转化，提取年月日
            var date = new Date(self.data.xzxkyxqxjsrq);
            self.data.xzxkyxqxjsrq = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        }
        // 处理时间
        if (self.data.xzxkyxqxksrq) {
            // 时间转化，提取年月日
            var date = new Date(self.data.xzxkyxqxksrq);
            self.data.xzxkyxqxksrq = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
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
// 其他企业
var otherEnterprises = {
    name: '其他企业详情',
    btnFilter: [
        'realTimeBtn',
        // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'companyVideoBtn',
    ],
    unitObj: {},
    telPelope: {
        contactpertel: 'contactper'
    },
    telobj: {
        contactpertel: 'contactpertel'
    },
    dataFilter: [
        'name',
        'propertyname',
        'address',
        'contactper',
        'contactpertel',
        'productstatus',
    ],
    labelObj: {
        name: '名称',
        propertyname: '类型',
        address: '详细地址',
        contactper: '联系人',
        contactpertel: '联系电话',
        productstatus: '状态'
    },
    popHeight: 556,
    cb: function (self) {
        var hazardlevelcode = {
            1: '一级',
            2: '二级',
            3: '三级',
            4: '四级'
        };
        // 危险等级代码
        if (self.data.hazardlevelcode) {
            self.data.hazardlevelcode = hazardlevelcode[self.data.hazardlevelcode] || '- -';
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
// 匹配拦截类型
var hazardousPopUpTypesFilter = [
    'theteam',
    'mountaincollapse',
    'landslide',
    'landslide',
    'emptysubside',
    'debrisflow',
    'debrisflow',
    'bottomcollapse',
    'bottomcollapse',
    'miningcollapse',
    'tailingpond',
    'mine',
    'firework',
    'fireworkhouse',
    'explosive',
    'metalnonmetal',
    'metalnonmetal',
    'coal',
    'coalMine',
    'noncoal',
    'metallurgical',
    'nonferrous',
    'mechanical',
    'buildingmaterial',
    'lightindustry',
    'spin',
    'tobacco',
    'commerce',
    'dust',
    'refrigeration',
    'majordanger',
    'nuclear',
    'productionindustry',
    'runeddustry',
    'useddustry',
    'otherdustry',
    'hazardous',
    'ANJIAN_ENT_WHSMYHBZ※07',
    'powerfacilities',
    'supwatfacil',
    'gasfacil',
    'powerfacil',
    'groundfissure',
];
exports.hazardousPopUpTypesFilter = hazardousPopUpTypesFilter;
var hazardousTypesPopUpRule = {
    // 地址灾害隐患点
    'theteam': theteamObj,
    'mountaincollapse': geologicHazard,
    'landslide': geologicHazard,
    'debrisflow': geologicHazard,
    'bottomcollapse': geologicHazard,
    'emptysubside': geologicHazard,
    'miningcollapse': geologicHazard,
    'groundfissure': geologicHazard,
    // 尾矿库
    'tailingpond': tailingsPond,
    'mine': tailingsPond,
    // 烟花爆竹企业
    'fireworkhouse': fireworksCrackersWarehouse,
    'firework': fireworksCrackers,
    'explosive': fireworksCrackers,
    // 金属非金属矿山
    'metalnonmetal': metalMine,
    // 煤矿企业
    'coal': coalMineEnterprise,
    'coalMine': coalMineEnterprise,
    'noncoal': noncoallMineEnterprise,
    'nonferrous': industryTrading1,
    'mechanical': industryTrading3,
    'buildingmaterial': buildingmaterial,
    'lightindustry': lightindustry,
    'spin': spin,
    'tobacco': tobacco,
    'commerce': commerce,
    'dust': industryTrading5,
    'refrigeration': industryTrading4,
    'ANJIAN_ENT_WHSMYHBZ※07': industryTrading7,
    'majordanger': majorHazard,
    'nuclear': majorHazard,
    'productionindustry': manufacturing,
    'runeddustry': conductEnterprise,
    'useddustry': usingEnterprise,
    'otherdustry': otherEnterprises,
    'hazardous': dangerousEnterprise,
    'metallurgical': industryTrading1,
    'powerfacilities': powerfacilities,
    'supwatfacil': powerfacilitiesTwo,
    'gasfacil': powerfacilities,
    'powerfacil': powerfacilities
};
exports.hazardousTypesPopUpRule = hazardousTypesPopUpRule;
