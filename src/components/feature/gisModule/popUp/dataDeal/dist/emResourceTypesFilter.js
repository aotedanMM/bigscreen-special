"use strict";
exports.__esModule = true;
exports.emResourceTypesPopUpRule = exports.emResourcePopUpTypesFilter = void 0;
// 应急资源--避难场所
var FilterClass = {
    name: '避难场所详情',
    unitObj: {
        abacusarea: '万平方米',
        maxpersonnum: '人'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {},
    dataFilter: [
        'name',
        'sheltertype',
        'levelname',
        'districtname',
        'address',
        'maxpersonnum',
        'chargedept',
        'abacusarea',
        'longitude',
        'latitude',
        'notes',
    ],
    labelObj: {
        name: '名称',
        sheltertype: '类型',
        levelname: '级别',
        districtname: '行政区划',
        address: '地址',
        maxpersonnum: '可容纳人数',
        chargedept: '日常维护单位',
        abacusarea: '有效面积',
        longitude: '经度',
        latitude: '纬度',
        notes: '备注'
    },
    btnFilter: [
        'aroundVideoBtn',
    ],
    popHeight: 760,
    cb: function (self) {
        var that = self;
        if (that.data.longitude && Number(that.data.longitude)) {
            that.data.longitude = Number(that.data.longitude).toFixed(5);
        }
        if (that.data.latitude && Number(that.data.latitude)) {
            that.data.latitude = Number(that.data.latitude).toFixed(5);
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
// 专家详情
var ExpertClass = {
    name: '专家详情',
    unitObj: {},
    telPelope: {
        // 电话拨打后对应人名
        tel: 'name'
    },
    telobj: {
        tel: 'tel'
    },
    dataFilter: [
        'name',
        'sexcode',
        'deptname',
        'goodatind',
        'tel',
        'currentmajor',
        'groupname',
        'levelname',
        'duties',
        'protitle',
        'address',
        'achihonor',
        'harvest',
    ],
    labelObj: {
        name: '专家姓名',
        sexcode: '性别',
        deptname: '工作单位',
        goodatind: '擅长领域',
        tel: '电话',
        currentmajor: '行业类别',
        groupname: '专家分组',
        levelname: '专家等级',
        duties: '职务',
        protitle: '职称',
        address: '详细地址',
        achihonor: '主要救援业绩',
        harvest: '专业奖励情况'
    },
    btnFilter: [
    // 'aroundVideoBtn', //  周边视频
    ],
    popHeight: 760,
    cb: function (self) {
        var that = self;
        var sexcode = {
            0: '女',
            1: '男'
        };
        if (self.data.sexcode) {
            self.data.sexcode = sexcode[self.data.sexcode] || '- -';
        }
        // 电话字段返回为'2784197，2782788'处理
        var phoneStr = self.data.tel;
        if (phoneStr && phoneStr.split('、').length > 1) {
            phoneStr.split('、').forEach(function (element, index) {
                if (index === 0) {
                    self.data.tel = element;
                }
                else {
                    self.labelObj['tel' + index] = '电话' + index;
                    self.data['tel' + index] = element;
                    self.telobj['tel' + index] = 'tel' + index;
                    if (self.datafilter[13] === 'tel1') {
                        return;
                    }
                    self.datafilter.splice(5, 0, 'tel' + index);
                }
            });
        }
    }
};
var RescueTeamClass = {
    name: '暂无标题',
    unitObj: {
        totalpernum: '人'
    },
    telPelope: {
        // 电话拨打后对应人名
        phone: 'captain',
        chargecontel: 'chargeconper'
    },
    telobj: {
        phone: 'phone',
        chargecontel: 'chargecontel'
    },
    dataFilter: [
        'name',
        'rescuegrade',
        'foresteamtype',
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
        rescuegrade: '等级',
        foresteamtype: '专/兼职',
        totalpernum: '人员数',
        address: '地址',
        captain: '联系人',
        phone: '联系方式',
        chargedept: '管理单位',
        chargeconper: '主管单位联系人',
        chargecontel: '主管单位联系电话'
    },
    btnFilter: [
        'aroundVideoBtn',
    ],
    popHeight: 760,
    cb: function (self) {
        var that = self;
        // 电话字段返回为'2784197、2782788'处理
        var phoneStr = self.data.phone;
        if (phoneStr && phoneStr.split('、').length > 1) {
            phoneStr.split('、').forEach(function (element, index) {
                if (index === 0) {
                    self.data.phone = element;
                }
                else {
                    self.labelObj['phone' + index] = '电话' + index;
                    self.data['phone' + index] = element;
                    self.telobj['phone' + index] = 'phone' + index;
                    if (self.datafilter[7] === 'phone1') {
                        return;
                    }
                    self.datafilter.splice(7, 0, 'phone' + index);
                }
            });
        }
        var foresteamtype = {
            0: '专职',
            1: '兼职'
        };
        if (self.data.foresteamtype) {
            self.data.foresteamtype = foresteamtype[self.data.foresteamtype] || '- -';
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
// 救援装备
var teamEquipment = {
    name: '救援装备详情',
    unitObj: {},
    telPelope: {
        // 电话拨打后对应人名
        leadermtel: 'leader'
    },
    telobj: {
        leadermtel: 'leadermtel'
    },
    dataFilter: [
        'name',
        'rescuename',
        'address',
        'equipnum',
        'chaagedept',
        'leader',
        'leadermtel',
    ],
    labelObj: {
        name: '名称',
        rescuename: '所属队伍',
        address: '地址',
        equipnum: '数量',
        chaagedept: '主管单位',
        leader: '负责人',
        leadermtel: '电话'
    },
    btnFilter: [
        'aroundVideoBtn',
    ],
    popHeight: 600,
    cb: function (self) {
        var that = self;
        for (var item in self.labelObj) {
            if (item === 'contactpertwo') {
                delete self.labelobj[item];
            }
            else if (item === 'dutyteltwo') {
                delete self.labelobj[item];
            }
        }
        self.datafilter = [
            'name',
            'rescuename',
            'address',
            'equipnum',
            'chaagedept',
            'contactper',
            'dutytel',
        ];
        var rescuegrade = {
            1: '国家级',
            2: '地方'
        };
        if (self.data.rescuegrade) {
            self.data.rescuegrade = rescuegrade[self.data.rescuegrade] || '- -';
        }
        var foresteamtype = {
            0: '专职',
            1: '兼职'
        };
        if (self.data.dutytel && self.data.dutytel.split('、').length > 1) {
            self.data.dutytel = self.data.dutytel.split('、')[0];
        }
        if (self.data.contactper &&
            self.data.contactper.split(',').length > 1 &&
            self.data.dutytel &&
            self.data.dutytel.split(',').length > 1) {
            var list = self.data.contactper.split(',');
            var listTwo = self.data.dutytel.split(',');
            self.labelobj.contactpertwo = '负责人2';
            self.labelobj.dutyteltwo = '电话2';
            self.datafilter.push('contactpertwo');
            self.datafilter.push('dutyteltwo');
            self.telobj.dutyteltwo = 'dutyteltwo';
            self.telpelope.dutyteltwo = 'contactpertwo';
            self.data.contactper = list[0];
            self.data.contactpertwo = list[1];
            self.data.dutytel = listTwo[0];
            self.data.dutyteltwo = listTwo[1];
        }
        if (self.data.foresteamtype) {
            self.data.foresteamtype = foresteamtype[self.data.foresteamtype] || '- -';
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
// 应急电力保障设备详情
const telectricitysafeguardequipme = {
    name: '应急电力保障设备详情',
    telPelope: { // 电话拨打后对应人名
        // tel
    },
    telobj: {
    phone: phone,
    duty_phone: 'duty_phone',
    },
    dataFilter: [
        'device_name',
        'principal',
        'phone',
        'duty_phone',
        'address',
        'type',
        'number',
        'rated_power',
        'nominal_voltage',
        'rated_current',
        'contact_department',
    ],
    labelObj: {
      device_name: '设备名称',
      principal: '主管负责人',
      phone: '联系电话',
      duty_phone: '单位值班电话',
      address: '单位地址',
      type: '型号',
      number: '数量',
      rated_power: '额定功率(KW)',
      nominal_voltage: '额定电压(V)',
      rated_current: '额定电流(A)',
      contact_department: '联系单位',
    },
    btnFilter: [
      //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
      // 'aroundAnalysisBtn', // 周边分析
      // 'aroundVideoBtn', //  周边视频
    ],
    popHeight: 720,
    cb(self: any) {
      // cb
    },
  };
// 直升机起降点
var teamForeHeliport = {
    name: '直升机起降点详情',
    unitObj: {
        altitude: '米',
        helicopternum: '架'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {
        adminorgtel: 'adminorgtel'
    },
    dataFilter: [
        'name',
        'districtname',
        'address',
        'adminorg',
        'adminorgtel',
        'area',
        'condition',
        'clearance',
        'helicopternum',
        'altitude',
        'longitude',
        'latitude',
    ],
    labelObj: {
        name: '名称',
        districtname: '行政区划',
        address: '地址',
        adminorg: '管理机构',
        adminorgtel: '管理机构电话',
        area: '场地面积',
        condition: '场地状况',
        clearance: '净空条件',
        helicopternum: '可停机数量',
        altitude: '海拔高度',
        longitude: '经度',
        latitude: '纬度'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 720,
    cb: function (self) {
        // cb
    }
};
// 直升机取水点
var FORWATERSOURCE3 = {
    name: '直升机取水点详情',
    unitObj: {
        capacity: '万立方米',
        altitude: '米'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {},
    dataFilter: [
        'name',
        'districtname',
        'address',
        'altitude',
        'airline',
        'watersourcetypecode',
        'longitude',
        'latitude',
    ],
    labelObj: {
        name: '名称',
        districtname: '行政区划',
        address: '地址',
        altitude: '海拔高度',
        airline: '所属航线',
        watersourcetypecode: '类型',
        longitude: '经度',
        latitude: '纬度'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 720,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '直升机取水点';
        }
    }
};
// 远程输水取水码头
var FORWATERSOURCE2 = {
    name: '远程输水取水码头',
    unitObj: {
        capacity: '万立方米',
        altitude: '米'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {},
    dataFilter: [
        'name',
        'districtname',
        'address',
        'watersourcetypecode',
        'longitude',
        'latitude',
        'capacity',
    ],
    labelObj: {
        name: '名称',
        districtname: '行政区划',
        address: '地址',
        watersourcetypecode: '类型',
        longitude: '经度',
        latitude: '纬度',
        capacity: '库容'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 720,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '远程输水取水码头';
        }
    }
};
// 取水点加取水码头
var FORWATERSOURCE4 = {
    name: '取水点加取水码头详情',
    unitObj: {
        capacity: '万立方米',
        altitude: '米'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {},
    dataFilter: [
        'name',
        'fullname',
        'address',
        'airline',
        'altitude',
        'waterdepth',
        'watersourcetypecode',
        'longitude',
        'latitude',
        'capacity',
    ],
    labelObj: {
        name: '名称',
        fullname: '行政区划',
        address: '地址',
        airline: '所属航线',
        altitude: '海拔高度',
        waterdepth: '水深',
        watersourcetypecode: '类型',
        longitude: '经度',
        latitude: '纬度',
        capacity: '库容'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 720,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '取水点加取水码头';
        }
    }
};
// 全市国有林场
var FORESTFARM = {
    name: '全市国有林场详情',
    unitObj: {
        businessarea: '亩',
        personnum: '人'
    },
    telPelope: {
        // 电话拨打后对应人名
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
    dataFilter: [
        'name',
        'fullname',
        'address',
        'contactper',
        'contactpermtel',
        'contactperotel',
        'respper',
        'resppermtel',
        'respperotel',
        'businesstype',
        'personnum',
        'businessarea',
    ],
    labelObj: {
        name: '名称',
        fullname: '行政区划',
        address: '地址',
        contactper: '联系人',
        contactpermtel: '联系人移动电话',
        contactperotel: '联系人办公电话',
        respper: '负责人',
        resppermtel: '负责人移动电话',
        respperotel: '负责人办公电话',
        businesstype: '林场类型',
        personnum: '人数',
        businessarea: '面积'
    },
    btnFilter: [],
    popHeight: 720,
    cb: function (self) {
        // cb
    }
};
// 自然保护区
var NatureReserve = {
    name: '自然保护区详情',
    unitObj: {
        area: '公顷',
        forestcoverage: '%'
    },
    telPelope: {
        // 电话拨打后对应人名
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
    dataFilter: [
        'name',
        'longitude',
        'latitude',
        'area',
        'chargedept',
        'contactper',
        'contactpermtel',
        'contactperotel',
        'respper',
        'resppermtel',
        'respperotel',
        'address',
        'approvalauthority',
        'approvalnumber',
        'naturalreservetype',
        'forestcoverage',
    ],
    labelObj: {
        name: '名称',
        longitude: '经度',
        latitude: '纬度',
        area: '面积',
        chargedept: '主管部门',
        contactper: '联系人',
        contactpermtel: '联系人移动电话',
        contactperotel: '联系人办公电话',
        respper: '负责人',
        resppermtel: '负责人移动电话',
        respperotel: '负责人办公电话',
        address: '所在地',
        approvalauthority: '批准机关',
        approvalnumber: '批准文号',
        naturalreservetype: '保护类型',
        forestcoverage: '森林覆盖率'
    },
    btnFilter: [],
    popHeight: 720,
    cb: function (self) {
        // cb
    }
};
// 机场
var airport = {
    name: '机场详情',
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    unitObj: {
        altitude: '米',
        runwaywidth: '米',
        runwaylength: '米',
        parkingapronnum: '个'
    },
    telPelope: {
        // 电话拨打后对应人名
        contactmtel: 'contactper'
    },
    telobj: {
        contactmtel: 'contactmtel'
    },
    dataFilter: [
        'name',
        'county',
        'address',
        'longitude',
        'latitude',
        'contactper',
        'contactmtel',
        'altitude',
        'runwaylength',
        'runwaywidth',
        'runwaydirection',
        'parkingapronnum',
    ],
    labelObj: {
        name: '名称',
        county: '行政区划',
        address: '地址',
        longitude: '经度',
        latitude: '纬度',
        contactper: '负责人',
        contactmtel: '负责人办公电话',
        altitude: '机场海拔',
        runwaylength: '跑道长',
        runwaywidth: '跑道宽',
        runwaydirection: '跑道方向',
        parkingapronnum: '停机位数量'
    },
    popHeight: 730,
    cb: function (self) {
        var that = self;
        if (that.data.longitude && Number(that.data.longitude)) {
            that.data.longitude = Number(that.data.longitude).toFixed(5);
        }
        if (that.data.latitude && Number(that.data.latitude)) {
            that.data.latitude = Number(that.data.latitude).toFixed(5);
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
// 防火检查站
var FIREINSPECTIONSTATION = {
    name: '防火检查站详情',
    unitObj: {
        capacity: '万立方米',
        altitude: '米'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {},
    dataFilter: [
        'name',
        'stationtype',
        'districtname',
        'contacts',
        'contacts_cell',
    ],
    labelObj: {
        name: '名称',
        stationtype: '类型',
        districtname: '行政区划',
        contacts: '负责人',
        contacts_cell: '联系电话'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 500,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火检查站';
        }
    }
};
// 防火瞭望塔
var LOOKOUTTOWER = {
    name: '防火瞭望塔详情',
    unitObj: {
        capacity: '万立方米',
        altitude: '米'
    },
    telPelope: {
    // 电话拨打后对应人名
    },
    telobj: {},
    dataFilter: [
        'name',
        'districtname',
        'contacts',
        'contacts_cell',
    ],
    labelObj: {
        name: '名称',
        districtname: '行政区划',
        contacts: '联系人',
        contacts_cell: '联系人'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 500,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火瞭望塔';
        }
    }
};
// 邯郸市林业防火自然保护地
var forestfirepreventionnaturalreserve = {
    name: '防火自然保护地详情',
    unitObj: {},
    telPelope: {},
    telobj: {},
    dataFilter: [
        'name',
        'type',
        'firechief',
        'firechiefphone',
        'district',
    ],
    labelObj: {
        name: '名称',
        type: '类型',
        firechief: '联系人',
        firechiefphone: '电话',
        district: '行政区划'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 600,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火自然保护地';
        }
    }
};
// 邯郸市林业防火重点部位
var foresfirepreventionimportantplace = {
    name: '防火重点部位详情',
    unitObj: {},
    telPelope: {},
    telobj: {},
    dataFilter: [
        'name',
        'type',
        'contactsandphone',
        'district',
    ],
    labelObj: {
        name: '名称',
        type: '类型',
        contactsandphone: '联系人及电话',
        district: '行政区划'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 600,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火重点部位';
        }
    }
};
// 邯郸市林业防火装备
var forestfireprevention = {
    name: '防火装备详情',
    unitObj: {},
    telPelope: {},
    telobj: {},
    dataFilter: [
        'equipmentname',
        'principal',
        'phone',
        'district',
    ],
    labelObj: {
        equipmentname: '装备名称',
        principal: '负责人',
        phone: '联系电话',
        district: '行政区划'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 600,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火装备';
        }
    }
};
// 邯郸市林业防火阻隔带信息
var forestfirepreventionbarrierstrip = {
    name: '防火阻隔带信息详情',
    unitObj: {},
    telPelope: {},
    telobj: {},
    dataFilter: [
        'type',
        'length',
        'breadth',
        'district',
    ],
    labelObj: {
        type: '阻隔带类型',
        length: '长度',
        breadth: '宽度',
        district: '行政区划'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 600,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火阻隔带信息';
        }
    }
};
// 邯郸市林业防火气象监测站
var forestfirepreventionmeteorologicalmonitoringstation = {
    name: '防火气象监测站详情',
    unitObj: {},
    telPelope: {},
    telobj: {},
    dataFilter: [
        'monitoringstationname',
        'principalandphone',
        'district',
    ],
    labelObj: {
        monitoringstationname: '监测站名称',
        principalandphone: '联系人及电话',
        district: '行政区划'
    },
    btnFilter: [
        //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
        // 'aroundAnalysisBtn', // 周边分析
        'aroundVideoBtn',
    ],
    popHeight: 600,
    cb: function (self) {
        // cb
        if (self.data && self.data.watersourcetypecode) {
            self.data.watersourcetypecode = '防火气象监测站';
        }
    }
};
var emResourcePopUpTypesFilter = [
    'shelter',
    // 专家
    'invitedxpert',
    'safetycultureexpert',
    'comprehensiveexpert',
    'investigationexpert',
    'mitigationexpert',
    'coalexpert',
    'nonmineexpert',
    'chemicalexpert',
    'tradexpert',
    'emergenceexpert',
    'fireexpert',
    'floodexpert',
    'earthquakeexpert',
    'fireworkexpert',
    'lawexpert',
    'infomationexpert',
    'Expert※13',
    'Expert※14',
    'Expert※15',
    'Expert※16',
    'Expert※17',
    'Expert※18',
    'Expert※19',
    'Expert※20',
    'Expert※21',
    'Expert※22',
    'Expert※23',
    'Expert※24',
    'Expert※25',
    'Expert※26',
    'Expert※27',
    'Expert※28',
    'Expert※29',
    'Expert※30',
    'Expert※31',
    // 救援装备
    't_electricity_safeguard_equipme', // 应急电力保障设备
    't_lifting_equipment', // 应急救援吊装设备
    'v_equipment※06',
    'v_equipment※07',
    'v_equipment※08',
    'v_equipment※09',
    'v_equipment※10',
    'v_equipment※11',
    'v_equipment※12',
    'v_equipment※13',
    'v_equipment※14',
    'v_equipment※15',
    // 消防车辆
    'v_equipment※24',
    'v_equipment※25',
    'v_equipment※26',
    'v_equipment※27',
    'v_equipment※28',
    'v_equipment※29',
    'v_equipment※30',
    'v_equipment※31',
    'v_equipment※32',
    'v_equipment※33',
    'v_equipment※34',
    // 医疗救援车辆
    'v_equipment※36',
    'v_equipment※37',
    'v_equipment※38',
    // 抢通抢修车辆
    'v_equipment※40',
    'v_equipment※41',
    'v_equipment※42',
    'v_equipment※43',
    // 人员运输车
    'v_equipment※45',
    'v_equipment※46',
    // 其他车辆
    'v_equipment※48',
    'v_equipment※49',
    'for_watersourceport',
    'for_heliport',
    'for_watersource',
    'for_waterport',
    'FOR_WATERSOURCE※04',
    'watersource_air',
    'watersource',
    'watersource_puf',
    'heliport',
    'airport',
    'for_forestfarm',
    'forest_fire_prevention_natural_reserve',
    'fores_fire_prevention_important_place',
    'forest_fire_prevention',
    'forest_fire_prevention_barrier_strip',
    'forest_fire_prevention_meteorological_monitoring_station',
    'for_naturalreserve',
    'v_equipment※02',
    'equipment',
    'fireinspectionstation',
    'lookouttower',
    'provincesafetycultureexpert',
    'provincetradexpert',
    'provincenonmineexpert',
    'provincecoalexpert',
    'provincechemicalexpert',
    'provincefireexpert',
    'provincecomprehensiveexpert',
    'provinceemergenceexpert',
    'provinceinfomationexpert',
    'provincefireworkexpert',
    'provincefloodexpert',
    'provinceearthquakeexpert',
    'provincemitigationexpert',
    'provincelawexpert',
    'professional',
    'chemicalexpertg',
    'tradexpertg',
];
exports.emResourcePopUpTypesFilter = emResourcePopUpTypesFilter;
var emResourceTypesPopUpRule = {
    'shelter': FilterClass,
    'airport': airport,
    'nonmineexpert': ExpertClass,
    'chemicalexpert': ExpertClass,
    'tradexpert': ExpertClass,
    'emergenceexpert': ExpertClass,
    'fireexpert': ExpertClass,
    'floodexpert': ExpertClass,
    'earthquakeexpert': ExpertClass,
    'fireworkexpert': ExpertClass,
    'lawexpert': ExpertClass,
    'infomationexpert': ExpertClass,
    'invitedxpert': ExpertClass,
    'safetycultureexpert': ExpertClass,
    'comprehensiveexpert': ExpertClass,
    'investigationexpert': ExpertClass,
    'mitigationexpert': ExpertClass,
    'coalexpert': ExpertClass,
    'provincesafetycultureexpert': ExpertClass,
    'provincetradexpert': ExpertClass,
    'provincenonmineexpert': ExpertClass,
    'provincecoalexpert': ExpertClass,
    'provincechemicalexpert': ExpertClass,
    'provincefireexpert': ExpertClass,
    'provincecomprehensiveexpert': ExpertClass,
    'provinceemergenceexpert': ExpertClass,
    'provinceinfomationexpert': ExpertClass,
    'provincefireworkexpert': ExpertClass,
    'provincefloodexpert': ExpertClass,
    'provinceearthquakeexpert': ExpertClass,
    'provincemitigationexpert': ExpertClass,
    'provincelawexpert': ExpertClass,
    'professional': ExpertClass,
    'chemicalexpertg': ExpertClass,
    'tradexpertg': ExpertClass,
    'Expert※13': ExpertClass,
    'Expert※14': ExpertClass,
    'Expert※15': ExpertClass,
    'Expert※16': ExpertClass,
    'Expert※17': ExpertClass,
    'Expert※18': ExpertClass,
    'Expert※19': ExpertClass,
    'Expert※20': ExpertClass,
    'Expert※21': ExpertClass,
    'Expert※22': ExpertClass,
    'Expert※23': ExpertClass,
    'Expert※24': ExpertClass,
    'Expert※25': ExpertClass,
    'Expert※26': ExpertClass,
    'Expert※27': ExpertClass,
    'Expert※28': ExpertClass,
    'Expert※29': ExpertClass,
    'Expert※30': ExpertClass,
    'Expert※31': ExpertClass,
    't_electricity_safeguard_equipme': telectricitysafeguardequipme, // 应急电力保障设备
    'v_equipment※03': teamEquipment,
    'v_equipment※04': teamEquipment,
    'v_equipment※06': teamEquipment,
    'v_equipment※07': teamEquipment,
    'v_equipment※08': teamEquipment,
    'v_equipment※09': teamEquipment,
    'v_equipment※10': teamEquipment,
    'v_equipment※11': teamEquipment,
    'v_equipment※12': teamEquipment,
    'v_equipment※13': teamEquipment,
    'v_equipment※14': teamEquipment,
    'v_equipment※15': teamEquipment,
    // 消防车辆
    'v_equipment※24': teamEquipment,
    'v_equipment※25': teamEquipment,
    'v_equipment※26': teamEquipment,
    'v_equipment※27': teamEquipment,
    'v_equipment※28': teamEquipment,
    'v_equipment※29': teamEquipment,
    'v_equipment※30': teamEquipment,
    'v_equipment※31': teamEquipment,
    'v_equipment※32': teamEquipment,
    'v_equipment※33': teamEquipment,
    'v_equipment※34': teamEquipment,
    // 医疗救援车辆
    'v_equipment※36': teamEquipment,
    'v_equipment※37': teamEquipment,
    'v_equipment※38': teamEquipment,
    // 抢通抢修车辆
    'v_equipment※40': teamEquipment,
    'v_equipment※41': teamEquipment,
    'v_equipment※42': teamEquipment,
    'v_equipment※43': teamEquipment,
    // 人员运输车
    'v_equipment※45': teamEquipment,
    'v_equipment※46': teamEquipment,
    // 其他车辆
    'v_equipment※48': teamEquipment,
    'v_equipment※49': teamEquipment,
    'equipment': teamEquipment,
    'for_watersourceport': teamForeHeliport,
    'for_heliport': teamForeHeliport,
    'for_waterport': FORWATERSOURCE2,
    'for_watersource': FORWATERSOURCE3,
    'FOR_WATERSOURCE※04': FORWATERSOURCE4,
    'watersource_air': FORWATERSOURCE3,
    'watersource': FORWATERSOURCE2,
    'watersource_puf': FORWATERSOURCE4,
    'heliport': teamForeHeliport,
    'for_forestfarm': FORESTFARM,
    'forest_fire_prevention_natural_reserve': forestfirepreventionnaturalreserve,
    'fores_fire_prevention_important_place': foresfirepreventionimportantplace,
    'forest_fire_prevention': forestfireprevention,
    'forest_fire_prevention_barrier_strip': forestfirepreventionbarrierstrip,
    'forest_fire_prevention_meteorological_monitoring_station': forestfirepreventionmeteorologicalmonitoringstation,
    'for_naturalreserve': NatureReserve,
    'fireinspectionstation': FIREINSPECTIONSTATION,
    'lookouttower': LOOKOUTTOWER
};
exports.emResourceTypesPopUpRule = emResourceTypesPopUpRule;
