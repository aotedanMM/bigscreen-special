// 物资储备库
const MaterialFilterClass: any = {
  name: '暂无标题',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    concatemobtel: 'concateper',
  },
  telobj: {
    concatemobtel: 'concatemobtel',
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
    concatemobtel: '电话',
  },
  popHeight: 760,
  templateName: '物资储备库详情',
  listName: '物资信息',
  cb(self: any) {
    const that = self;
    //   console.log(3333, that.data);
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
};
// 森林防火物资储备库
const MaterialFilterClassTwo: any = {
  name: '暂无标题',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactpermtel: 'contactper',
    contactperotel: 'contactper',
    resppermtel: 'respper',
    respperotel: 'respper',
  },
  telobj: {
    contactpermtel: 'contactpermtel',
    contactperotel: 'contactperotel',
    resppermtel: 'resppermtel',
    respperotel: 'respperotel',
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
    concatemobtel: '联系人电话',
  },
  popHeight: 760,
  templateName: '物资储备库详情',
  listName: '物资信息',
  cb(self: any) {
    const that = self;
    //   console.log(3333, that.data);
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
};
// 救援队伍
const RescueTeamClass: any = {
  name: '暂无标题',
  unitObj: {
    totalpernum: '人',
  },
  telPelope: { // 电话拨打后对应人名
    phone: 'captain',
    chargecontel: 'chargeconper',
  },
  telobj: {
    phone: 'phone',
    chargecontel: 'chargecontel',
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
    chargecontel: '主管单位联系电话',
  },
  btnFilter: [
    //   'aroundAnalysisBtn', //  周边分析
    //   'aroundVideoBtn', //  周边分析
  ],
  popHeight: 760,
  cb(self: any) {
    const that = self;
    // 电话字段返回为'2784197、2782788'处理
    const phoneStr = self.data.phone;
    if (phoneStr && phoneStr.split('、').length > 1) {
      // debugger
      phoneStr.split('、').forEach((element: any, index: number) => {
        if (index === 0) {
          self.data.phone = element;
        } else {
          self.labelObj['phone' + index] = '电话' + index;
          self.data['phone' + index] = element;
          self.telobj['phone' + index] = 'phone' + index;
          if (self.dataFilter[7] === 'phone1') { return; }
          self.dataFilter.splice(7, 0, 'phone' + index);
        }
      });
    }

    const rescuegrade: any = {
      0: '国家级',
      1: '地方',
    };
    if (self.data.rescuegrade) {
      self.data.rescuegrade = rescuegrade[self.data.rescuegrade] || '- -';
    }
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
};

const materialTypesFilter: any = [
  'Nearbyfireteam', // 周边分析中救援队伍查询
  'ANJIAN_REPERTORY※01', // 物资储备库
  'generalrepository', // 通用防护物资库
  'floodrepository', // 防汛抗旱物资库
  'cityrepository', // 城市防汛物资库
  'firerepository', // 消防设施物资库
  'firepreventionrepository', // 防火物资库
  'firepreventionrepository', // 防火物资库
  'powerrepository', // 电力设施物资库
  'communicationrepository', // 通讯物资库
  'biologyrepository', // 生物防疫物资库
  'airrepository', // 机场消防设施库
  'oilrepository', // 溢油防治物资库
  'earthrepository', // 港口救援物资库
  'pottrepository', // 防震物资库
  // 周边查询 -> 救援队伍
  'Nearbyfloodteam', // 周边查询-防汛抗旱队
  'Nearbyfireteam', // 周边查询-消防队
  'Nearbyforestfireteam', // 周边查询-森林消防救援
  'Nearbyhazardousteam', // 周边查询-危化品救援队
  'Nearbymineteam', // 周边查询-煤矿救援队
  'Nearbynonmineteam', // 周边查询-非煤矿山救援队
  'Nearbycorecompetenceteam', // 周边查询-商贸流通救援队
  'Nearbytransportationteam', // 周边查询-交通运输救援队
  'Nearbypowerteam', // 周边查询-应急供电救援队
  'Nearbymobileteam', // 周边查询-移动通讯救援队
  'Nearbygasteam', // 周边查询-燃气救援队
  'Nearbyenvironmentteam', // 周边查询-环境救援队
  'Nearbysalvageteam', // 周边查询-打捞救援队
  'Nearbysearescueteam', // 周边查询-海上救援队
  'Nearbyshipspillteam', // 周边查询-船舶溢油救援队
  'Nearbyhealthyteam', // 周边查询-医疗卫生队
  'Nearbyportrescueteam', // 周边查询-港口码头抢险队
  'Nearbyportpassengerteam', // 周边查询-港口客运场站应急队
  'Nearbyportconstructionteam', // 周边查询-港口施工安全队
  'Nearbybuildingemergencyteam', // 周边查询-建筑应急救援
  'Nearbypassengeremergencyteam', // 周边查询-客运应急救援队
  'Nearbyemergencytransportteam', // 周边查询-应急运力队
  'Nearbysnowteam', // 周边查询-清雪队伍
  'Nearbyequipteam', // 周边查询-机械设备社会力量
  'Nearbycivilianteam', // 周边查询-民间救援队
  'rescueteam',
  'floodteam', // 防汛抗旱队
  'fireteam', // 消防队
  'forestfireteam', // 森林消防救援
  'forest_citysenlin', // 市级森林消防应急队伍
  'forest_countysenlin', // 区县级森林消防应急队伍
  'forestfireteam', // 森林消防救援
  'hazardousteam', // 危化品救援队
  'mineteam', // 煤矿救援队
  'nonmineteam', // 非煤矿山救援队
  'corecompetenceteam', // 商贸流通救援队
  'transportationteam', // 交通运输救援队
  'powerteam', // 应急供电救援队
  'mobileteam', // 移动通讯救援队
  'gasteam', // 燃气救援队
  'environmentteam', // 环境救援队

  'salvageteam', // 打捞救援队
  'searescueteam', // 海上救援队
  'shipspillteam', // 船舶溢油救援队
  'healthyteam', // 医疗卫生队
  'portrescueteam', // 港口码头抢险队
  'portpassengerteam', // 港口客运场站应急队
  'portconstructionteam', // 港口施工安全队
  'buildingemergencyteam', // 建筑应急救援
  'passengeremergencyteam', // 客运应急救援队
  'emergencytransportteam', // 应急运力队
  'snowteam', // 清雪队伍
  'equipteam', // 机械设备社会力量
  'civilianteam', // 民间救援队
  'forestfireteamcity', // 市级森林消防救援队
  'forestfireteamcounty', // 区县级森林消防救援队
  'fireteamgovernment',  // 政府消防救援队
  'fireteamcompany', // 企业消防救援队
  'hazardousteamgovernment', // 政府危化品救援队
  'hazardousteamcompany', // 企业危化品救援队
  'mineteamgovernment',  // 政府煤矿救援队
  'mineteamcompany',  // 企业煤矿救援队
  'powerteamgovernment',  // 政府应急供电救援队
  'powerteamcompany',  // 企业应急供电救援队
  'mobileteamgovernment', // 政府移动通信救援队
  'mobileteamcompany',   // 企业移动通信救援队
  'healthyteamgovernment', // 政府医疗卫生救援队
  'healthyteamcompany',  // 企业医疗卫生救援队
  'civilianteamgovernment',   // 政府其他救援队伍
  'civilianteamcompany', // 企业其他救援队伍
  'localrepository',
  'entrustrepository',
];
const materialTypesPopUpRule: any = {
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
  'localrepository': MaterialFilterClass,
  'entrustrepository': MaterialFilterClass,
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
  'forest_countysenlin': RescueTeamClass,
};
export { materialTypesFilter, materialTypesPopUpRule };
