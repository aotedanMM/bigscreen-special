"use strict";
exports.__esModule = true;
exports.materialTypesPopUpRule = exports.materialTypesFilter = void 0;
// 物资储备库
var MaterialFilterClass = {
    name: '暂无标题',
    unitObj: {},
    telPelope: {
        concatemobtel: 'concateper'
    },
    telobj: {
        concatemobtel: 'concatemobtel'
    },
    templateType: 1,
    dataFilter: [
        'name',
        'repertorytypename',
        'chargedept',
        'levelname',
        'address',
        'concateper',
        'concatemobtel',
    ],
    labelObj: {
        name: '名称',
        repertorytypename: '储备物资类型',
        chargedept: '管理机构',
        levelname: '级别',
        address: '地址',
        concateper: '负责人',
        concatemobtel: '电话'
    },
    popHeight: 760,
    templateName: '物资储备库详情',
    listName: '物资信息',
    cb: function (self) {
        var that = self;
        //   console.log(3333, that.data);
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
};
// 森林防火物资储备库
var MaterialFilterClassTwo = {
    name: '暂无标题',
    unitObj: {},
    telPelope: {
        contactpermtel: 'contactper',
        contactperotel: 'contactper',
        resppermtel: 'respper',
        respperotel: 'respper'
    },
    telobj: {
        contactpermtel: 'contactpermtel',
        contactperotel: 'contactperotel',
        resppermtel: 'resppermtel',
        respperotel: 'respperotel'
    },
    templateType: 1,
    dataFilter: [
        'name',
        'repertorytypename',
        'chargedept',
        'levelname',
        'address',
        'contactper',
        'contactpermtel',
        'contactperotel',
        'respper',
        'resppermtel',
        'respperotel',
    ],
    labelObj: {
        name: '名称',
        repertorytypename: '储备物资类型',
        chargedept: '管理机构',
        levelname: '级别',
        address: '地址',
        contactper: '联系人',
        contactpermtel: '联系人移动电话',
        contactperotel: '联系人办公电话',
        respper: '负责人',
        resppermtel: '负责人移动电话',
        respperotel: '负责人办公电话',
        concatemobtel: '联系人电话'
    },
    popHeight: 760,
    templateName: '物资储备库详情',
    listName: '物资信息',
    cb: function (self) {
        var that = self;
        //   console.log(3333, that.data);
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
};
// 救援队伍
var RescueTeamClass = {
    name: '暂无标题',
    unitObj: {
        totalpernum: '人'
    },
    telPelope: {
        phone: 'captain',
        chargecontel: 'chargeconper'
    },
    telobj: {
        phone: 'phone',
        chargecontel: 'chargecontel'
    },
    templateType: 2,
    templateName: '救援队伍详情',
    listName: '主要装备',
    dataFilter: [
        'name',
        'rescuegrade',
        'timequality',
        'totalpernum',
        'address',
        'captain',
        'phone',
        'chargedept',
        'chargeconper',
        'chargecontel',
    ],
    labelObj: {
        name: '名称',
        rescuegrade: '队伍等级',
        timequality: '专/兼职',
        totalpernum: '人员数',
        address: '地址',
        captain: '联系人',
        phone: '联系方式',
        chargedept: '管理单位',
        chargeconper: '主管单位联系人',
        chargecontel: '主管单位联系电话'
    },
    btnFilter: [
    //   'aroundAnalysisBtn', //  周边分析
    //   'aroundVideoBtn', //  周边分析
    ],
    popHeight: 760,
    cb: function (self) {
        var that = self;
        // 电话字段返回为'2784197、2782788'处理
        var phoneStr = self.data.phone;
        if (phoneStr && phoneStr.split('、').length > 1) {
            // debugger
            phoneStr.split('、').forEach(function (element, index) {
                if (index === 0) {
                    self.data.phone = element;
                }
                else {
                    self.labelObj['phone' + index] = '电话' + index;
                    self.data['phone' + index] = element;
                    self.telobj['phone' + index] = 'phone' + index;
                    if (self.dataFilter[7] === 'phone1') {
                        return;
                    }
                    self.dataFilter.splice(7, 0, 'phone' + index);
                }
            });
        }
        var rescuegrade = {
            0: '国家级',
            1: '地方'
        };
        if (self.data.rescuegrade) {
            self.data.rescuegrade = rescuegrade[self.data.rescuegrade] || '- -';
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
var materialTypesFilter = [
    'Nearbyfireteam',
    'ANJIAN_REPERTORY※01',
    'generalrepository',
    'floodrepository',
    'cityrepository',
    'firerepository',
    'firepreventionrepository',
    'firepreventionrepository',
    'powerrepository',
    'communicationrepository',
    'biologyrepository',
    'airrepository',
    'oilrepository',
    'earthrepository',
    'pottrepository',
    // 周边查询 -> 救援队伍
    'Nearbyfloodteam',
    'Nearbyfireteam',
    'Nearbyforestfireteam',
    'Nearbyhazardousteam',
    'Nearbymineteam',
    'Nearbynonmineteam',
    'Nearbycorecompetenceteam',
    'Nearbytransportationteam',
    'Nearbypowerteam',
    'Nearbymobileteam',
    'Nearbygasteam',
    'Nearbyenvironmentteam',
    'Nearbysalvageteam',
    'Nearbysearescueteam',
    'Nearbyshipspillteam',
    'Nearbyhealthyteam',
    'Nearbyportrescueteam',
    'Nearbyportpassengerteam',
    'Nearbyportconstructionteam',
    'Nearbybuildingemergencyteam',
    'Nearbypassengeremergencyteam',
    'Nearbyemergencytransportteam',
    'Nearbysnowteam',
    'Nearbyequipteam',
    'Nearbycivilianteam',
    'rescueteam',
    'floodteam',
    'fireteam',
    'forestfireteam',
    'forest_citysenlin',
    'forest_countysenlin',
    'forestfireteam',
    'hazardousteam',
    'mineteam',
    'nonmineteam',
    'corecompetenceteam',
    'transportationteam',
    'powerteam',
    'mobileteam',
    'gasteam',
    'environmentteam',
    'salvageteam',
    'searescueteam',
    'shipspillteam',
    'healthyteam',
    'portrescueteam',
    'portpassengerteam',
    'portconstructionteam',
    'buildingemergencyteam',
    'passengeremergencyteam',
    'emergencytransportteam',
    'snowteam',
    'equipteam',
    'civilianteam',
    'forestfireteamcity',
    'forestfireteamcounty',
    'fireteamgovernment',
    'fireteamcompany',
    'hazardousteamgovernment',
    'hazardousteamcompany',
    'mineteamgovernment',
    'mineteamcompany',
    'powerteamgovernment',
    'powerteamcompany',
    'mobileteamgovernment',
    'mobileteamcompany',
    'healthyteamgovernment',
    'healthyteamcompany',
    'civilianteamgovernment',
    'civilianteamcompany',
];
exports.materialTypesFilter = materialTypesFilter;
var materialTypesPopUpRule = {
    'ANJIAN_REPERTORY※01': MaterialFilterClass,
    'generalrepository': MaterialFilterClass,
    'floodrepository': MaterialFilterClass,
    'cityrepository': MaterialFilterClass,
    'firerepository': MaterialFilterClass,
    'firepreventionrepository': MaterialFilterClass,
    // 'firepreventionrepository': MaterialFilterClassTwo,
    'powerrepository': MaterialFilterClass,
    'communicationrepository': MaterialFilterClass,
    'biologyrepository': MaterialFilterClass,
    'airrepository': MaterialFilterClass,
    'oilrepository': MaterialFilterClass,
    'earthrepository': MaterialFilterClass,
    'pottrepository': MaterialFilterClass,
    'floodteam': RescueTeamClass,
    'fireteam': RescueTeamClass,
    'RescueTeam※03': RescueTeamClass,
    'forestfireteam': RescueTeamClass,
    'hazardousteam': RescueTeamClass,
    'mineteam': RescueTeamClass,
    'nonmineteam': RescueTeamClass,
    'corecompetenceteam': RescueTeamClass,
    'transportationteam': RescueTeamClass,
    'rescueteam': RescueTeamClass,
    'powerteam': RescueTeamClass,
    'mobileteam': RescueTeamClass,
    'gasteam': RescueTeamClass,
    'environmentteam': RescueTeamClass,
    'salvageteam': RescueTeamClass,
    'searescueteam': RescueTeamClass,
    'shipspillteam': RescueTeamClass,
    'healthyteam': RescueTeamClass,
    'portrescueteam': RescueTeamClass,
    'portpassengerteam': RescueTeamClass,
    'portconstructionteam': RescueTeamClass,
    'buildingemergencyteam': RescueTeamClass,
    'passengeremergencyteam': RescueTeamClass,
    'emergencytransportteam': RescueTeamClass,
    'snowteam': RescueTeamClass,
    'equipteam': RescueTeamClass,
    'civilianteam': RescueTeamClass,
    'forestfireteamcity': RescueTeamClass,
    'forestfireteamcounty': RescueTeamClass,
    'fireteamgovernment': RescueTeamClass,
    'fireteamcompany': RescueTeamClass,
    'hazardousteamgovernment': RescueTeamClass,
    'hazardousteamcompany': RescueTeamClass,
    'mineteamgovernment': RescueTeamClass,
    'mineteamcompany': RescueTeamClass,
    'powerteamgovernment': RescueTeamClass,
    'powerteamcompany': RescueTeamClass,
    'mobileteamgovernment': RescueTeamClass,
    'mobileteamcompany': RescueTeamClass,
    'healthyteamgovernment': RescueTeamClass,
    'healthyteamcompany': RescueTeamClass,
    'civilianteamgovernment': RescueTeamClass,
    'civilianteamcompany': RescueTeamClass,
    // 周边查询 -> 救援队伍
    'Nearbyfloodteam': RescueTeamClass,
    'Nearbyfireteam': RescueTeamClass,
    'NearbyRescueTeam※03': RescueTeamClass,
    'Nearbyforestfireteam': RescueTeamClass,
    'Nearbyhazardousteam': RescueTeamClass,
    'Nearbymineteam': RescueTeamClass,
    'Nearbynonmineteam': RescueTeamClass,
    'Nearbycorecompetenceteam': RescueTeamClass,
    'Nearbytransportationteam': RescueTeamClass,
    'Nearbypowerteam': RescueTeamClass,
    'Nearbymobileteam': RescueTeamClass,
    'Nearbygasteam': RescueTeamClass,
    'Nearbyenvironmentteam': RescueTeamClass,
    'Nearbysalvageteam': RescueTeamClass,
    'Nearbysearescueteam': RescueTeamClass,
    'Nearbyshipspillteam': RescueTeamClass,
    'Nearbyhealthyteam': RescueTeamClass,
    'Nearbyportrescueteam': RescueTeamClass,
    'Nearbyportpassengerteam': RescueTeamClass,
    'Nearbyportconstructionteam': RescueTeamClass,
    'Nearbybuildingemergencyteam': RescueTeamClass,
    'Nearbypassengeremergencyteam': RescueTeamClass,
    'Nearbyemergencytransportteam': RescueTeamClass,
    'Nearbysnowteam': RescueTeamClass,
    'Nearbyequipteam': RescueTeamClass,
    'Nearbycivilianteam': RescueTeamClass,
    'forest_citysenlin': RescueTeamClass,
    'forest_countysenlin': RescueTeamClass
};
exports.materialTypesPopUpRule = materialTypesPopUpRule;
