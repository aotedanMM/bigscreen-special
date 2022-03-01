// 应急资源--避难场所
const FilterClass: any = {
  name: '避难场所详情',
  unitObj: {
    abacusarea: '万平方米',
    maxpersonnum: '人',
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
    notes: '备注',
  },
  btnFilter: [
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 760,
  cb(self: any) {
    const that = self;
    if (that.data.longitude && Number(that.data.longitude)) {
      that.data.longitude = Number(that.data.longitude).toFixed(5);
    }
    if (that.data.latitude && Number(that.data.latitude)) {
      that.data.latitude = Number(that.data.latitude).toFixed(5);
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
// 专家详情
const ExpertClass: any = {
  name: '专家详情',
  unitObj: {},
  telPelope: {
    // 电话拨打后对应人名
    tel: 'name',
  },
  telobj: {
    tel: 'tel',
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
    harvest: '专业奖励情况',
  },
  btnFilter: [
    // 'aroundVideoBtn', //  周边视频
  ],
  popHeight: 760,
  cb(self: any) {
    const that = self;
    const sexcode: any = {
      0: '女',
      1: '男',
    };
    if (self.data.sexcode) {
      self.data.sexcode = sexcode[self.data.sexcode] || '- -';
    }

    // 电话字段返回为'2784197，2782788'处理
    const phoneStr = self.data.tel;
    if (phoneStr && phoneStr.split('、').length > 1) {
      phoneStr.split('、').forEach((element: any, index: number) => {
        if (index === 0) {
          self.data.tel = element;
        } else {
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
  },
};

const RescueTeamClass: any = {
  name: '暂无标题',
  unitObj: {
    totalpernum: '人',
  },
  telPelope: {
    // 电话拨打后对应人名
    phone: 'captain',
    chargecontel: 'chargeconper',
  },
  telobj: {
    phone: 'phone',
    chargecontel: 'chargecontel',
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
    chargecontel: '主管单位联系电话',
  },
  btnFilter: [
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 760,
  cb(self: any) {
    const that = self;
    // 电话字段返回为'2784197、2782788'处理
    const phoneStr = self.data.phone;
    if (phoneStr && phoneStr.split('、').length > 1) {
      phoneStr.split('、').forEach((element: any, index: number) => {
        if (index === 0) {
          self.data.phone = element;
        } else {
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

    const foresteamtype: any = {
      0: '专职',
      1: '兼职',
    };
    if (self.data.foresteamtype) {
      self.data.foresteamtype = foresteamtype[self.data.foresteamtype] || '- -';
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

// 救援装备
const teamEquipment = {
  name: '救援装备详情',
  unitObj: {},
  telPelope: {
    // 电话拨打后对应人名
    leadermtel: 'leader',
  },
  telobj: {
    leadermtel: 'leadermtel',
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
    leadermtel: '电话',
  },
  btnFilter: [
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 600,
  cb(self: any) {
    const that = self;
    for (const item in self.labelObj) {
      if (item === 'contactpertwo') {
        delete self.labelobj[item];
      } else if (item === 'dutyteltwo') {
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
    const rescuegrade: any = {
      1: '国家级',
      2: '地方',
    };
    if (self.data.rescuegrade) {
      self.data.rescuegrade = rescuegrade[self.data.rescuegrade] || '- -';
    }
    const foresteamtype: any = {
      0: '专职',
      1: '兼职',
    };
    if (self.data.dutytel && self.data.dutytel.split('、').length > 1) {
      self.data.dutytel = self.data.dutytel.split('、')[0];
    }
    if (
      self.data.contactper &&
      self.data.contactper.split(',').length > 1 &&
      self.data.dutytel &&
      self.data.dutytel.split(',').length > 1
    ) {
      const list = self.data.contactper.split(',');
      const listTwo = self.data.dutytel.split(',');
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

// (应急资源--救援装备详情弹窗配置 毕东方  2021.11.23 )
// 应急电力保障设备详情
const telectricitysafeguardequipme: any = {
  name: '应急电力保障设备详情',
  unitObj: {},
  telPelope: {
    // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  templateType: 2,
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
    // 'aroundVideoBtn', //  周边视频
  ],
  popHeight: 760,
  cb(self: any) {
    // cb
  },
};

// 应急救援吊装设备详情
const tliftingequipment = {
  name: '应急救援吊装设备详情',
  unitObj: {},
 // 以下重新完善电话拨打后对应人名 毕东方 2021.12.6
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'equipment_name',
      'type',
      'number',
      'working_range',
      'boom_reach',
      'radius',
      'weight',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
  ],
  labelObj: {
    equipment_name: '设备名称',
    type: '型号',
    number: '数量(辆)',
    working_range: '工作范围',
    boom_reach: '起重臂长度(米)',
    radius: '吊臂旋转半径(米)',
    weight: '吊装重量(吨)',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
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

// 防火设备详情
const tfirefightingequipment = {
  name: '防火设备详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'device_name',
      'number',
      'effective_jet_distance',
      'effective_jet_time',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
  ],
  labelObj: {
    device_name: '设备名称',
    number: '数量(个)',
    effective_jet_distance: '有效喷射距离(米)',
    effective_jet_time: '有效喷射时间',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
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

// 应急救援监测设备详情
const tmonitorequipment = {
  name: '应急救援监测设备详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'equipment_name',
      'type',
      'number',
      'applied_range',
      'monitor_mode',
      'monitor_distance',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
  ],
  labelObj: {
    equipment_name: '设备名称',
    type: '型号',
    number: '数量(台)',
    applied_range: '适用范围',
    monitor_mode: '监测方式',
    monitor_distance: '监测距离',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
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
// 应急救援破拆设备详情
const tforcibleentryequipment = {
  name: '应急救援破拆设备详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'equipment_name',
      'type',
      'number',
      'applied_range',
      'application_environment',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
  ],
  labelObj: {
    equipment_name: '设备名称',
    type: '型号',
    number: '数量(台)',
    applied_range: '适用范围',
    application_environment: '适用环境',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
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

// 应急救援人身防护设备详情
const tpersonprotectiveequipment = {
  name: '应急救援人身防护设备详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'equipment_name',
      'type',
      'number',
      'protective_part',
      'protective_function',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
  ],
  labelObj: {
    equipment_name: '设备名称',
    type: '型号',
    number: '数量(套/件)',
    protective_part: '防护部位',
    protective_function: '防护功能',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
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

// 应急救援喷水设备详情
const tspraywaterequiment = {
  name: '应急救援喷水设备详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'equipment_name',
      'type',
      'number',
      'rated_head',
      'volume',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
      'use_type',
  ],
  labelObj: {
    equipment_name: '设备名称',
    type: '型号',
    number: '数量(辆)',
    rated_head: '扬程(米)',
    volume: '罐体容积(立方米)',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
    use_type: '类型',
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

// 排水设备详情
const tpumpingequiment = {
  name: '排水设备详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    phone: 'principal',
    duty_phone: 'principal',
  },
  telobj: {
    phone: 'phone',
    duty_phone: 'duty_phone',
  },
  dataFilter: [
      'equipment_name',
      'type',
      'number',
      'rated_head',
      'rated_flow',
      'drain_pipe_type',
      'electrical_machinery_type',
      'rated_power',
      'nominal_voltage',
      'contact_department',
      'address',
      'principal',
      'phone',
      'duty_phone',
  ],
  labelObj: {
    equipment_name: '设备名称',
    type: '型号',
    number: '数量(台)',
    rated_head: '额定扬程(米)',
    rated_flow: '额定流量(立方米/小时)',
    drain_pipe_type: '排水管型号',
    electrical_machinery_type: '配备电机(型号)',
    rated_power: '额定功率(千瓦)',
    nominal_voltage: '额定电压(伏)',
    contact_department: '联系单位',
    address: '单位地址',
    principal: '主管负责人',
    phone: '联系电话',
    duty_phone: '单位值班电话',
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

// 应急局救援装备详情
const emergencydepartmentequipment = {
  name: '应急局救援装备详情',
  unitObj: {},
  telPelope: {
   // 电话拨打后对应人名
  },
  telobj: {
    // tel
  },
  dataFilter: [
    'name',
    'classes',
    'type',
    'numbers',
    'section',
    'remark',
  ],
  labelObj: {
    name: '名称',
    classes: '类别',
    type: '型号',
    numbers: '数量',
    section: '处室',
    remark: '备注',
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

// 传感器类型代码表详情
const codedetectortype = {
  name: '传感器类型代码表详情',
  unitObj: {},
  telPelope: {
   // 电话拨打后对应人名
  },
  telobj: {
    // tel
  },
  dataFilter: [
    'detector_type_name',
    'id',
  ],
  labelObj: {
    detector_type_name: '传感器类型名称',
    id: '传感器类型代码',
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

// 传感器详情
const enterprisedetector = {
  name: '传感器详情',
  unitObj: {},
  telPelope: {
   // 电话拨打后对应人名
  },
  telobj: {
    // tel
  },
  dataFilter: [
    'name',
    'code',
    'type',
    'des',
    'facility_code',
    'facility_id',
    'latitude',
    'longitude',
    'manufacturer',
    'model',
    'max_meas',
    'min_meas',
    'meas_unit',
    'qy_id',
    'create_time',
    'update_time',
    'create_user',
    'update_user',
    'del_flag',
  ],
  labelObj: {
    name: '名称',
    code: '编码',
    type: '传感器类型代码',
    des: '简介',
    facility_code: '设备编码',
    facility_id: '所属设施id',
    latitude: '纬度',
    longitude: '经度',
    manufacturer: '',
    model: '规格型号',
    max_meas: '测量上限',
    min_meas: '测量下限',
    meas_unit: '测量单位',
    qy_id: '企业id',
    create_time: '创建时间',
    update_time: '修改时间',
    create_user: '创建人',
    update_user: '修改人',
    del_flag: '删除标识(0:未删除;1:已删除)',
  },
  btnFilter: [
    // btn
  ],
  popHeight: 720,
  cb(self: any) {
    const that = self;
    if (that.data.create_time !== '' || that.data.create_time) {
      const dateee = new Date(that.data.create_time).toJSON();
      that.data.create_time = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    }
  },
};

// 网关设备详情
const enterprisefacility = {
  name: '网关设备详情',
  unitObj: {},
  telPelope: {
   // 电话拨打后对应人名
  },
  telobj: {
    // tel
  },
  dataFilter: [
    'facility_name',
    'facility_code',
    'facility_type',
    'facility_number',
    'des',
    'address',
    'longitude',
    'latitude',
    'hazard_code',
    'hazard_level',
    'is_major_hazard',
    'qy_id',
    'create_user',
    'create_time',
    'update_user',
    'update_time',
    'del_flag',
  ],
  labelObj: {
    facility_name: '名称',
    facility_code: '设施编码',
    facility_type: '设施类型',
    facility_number: '编号',
    des: '简介',
    address: '地址',
    longitude: '经度',
    latitude: '纬度',
    hazard_code: '危险源编码',
    hazard_level: '危险源级别',
    is_major_hazard: '是否重大危险源(1: 是; 0: 不是)',
    qy_id: '企业id',
    create_user: '创建人',
    create_time: '创建时间',
    update_user: '修改人',
    update_time: '修改时间',
    del_flag: '删除标识(0: 未删除; 1: 已删除)',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    // 'aroundVideoBtn', //  周边视频
  ],
  popHeight: 720,
  cb(self: any) {
    // 对创建事假和修改时间做格式化处理
    const that = self;
    if (that.data.create_time !== '' || that.data.create_time) {
      const dateee = new Date(that.data.create_time).toJSON();
      that.data.create_time = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    }
    if (that.data.update_time !== '' || that.data.update_time) {
      const dateee = new Date(that.data.update_time).toJSON();
      that.data.update_time = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
    }

  },
};

// 减灾委成员详情
const reducedisastercommitteemembe = {
  name: '减灾委成员详情',
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    on_duty_phone: 'list_name',
    office_phone: 'list_name',
    cell_phone: 'list_name',
  },
  telobj: {
    on_duty_phone: 'on_duty_phone',
    office_phone: 'office_phone',
    cell_phone: 'cell_phone',
  },
  dataFilter: [
    'name',
    'organization',
    'duty',
    'office_phone',
    'on_duty_phone',
    'cell_phone',
    'list_name',
    'fax',
  ],
  labelObj: {
    name: '姓名',
    organization: '单位',
    duty: '职务',
    office_phone: '办公电话',
    on_duty_phone: '值班电话',
    cell_phone: '手机',
    list_name: '通讯录名称',
    fax: '传真',
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

// 地震地质救援指挥部成员详情
const theadquartersmemberaddressb = {
  name: '地震地质救援指挥部成员详情',
  unitObj: {},
  telPelope: {  // 电话拨打后对应人名
    member_phone_number: 'member_name',
    member_office_telephone: 'member_name',
    liaison_office_telephone: 'liaison_name',
    liaison_phone_number: 'liaison_name',
  },
  telobj: {
    member_office_telephone: 'member_office_telephone',
    member_phone_number: 'member_phone_number',
    liaison_office_telephone: 'liaison_office_telephone',
    liaison_phone_number: 'liaison_phone_number',
  },
  dataFilter: [
    'member_name',
    'member_type',
    'unit_name',
    'member_office_telephone',
    'member_phone_number',
    'liaison_name',
    'office_fax',
    'liaison_office_telephone',
    'liaison_phone_number',
    'address_book_type',
    'title_name',
  ],
  labelObj: {
    member_name: '姓名',
    member_type: '人员类型(指挥长/副指挥长/成员)',
    unit_name: '单位名称',
    member_office_telephone: '领导办公室电话',
    member_phone_number: '领导手机号码',
    liaison_name: '联络员姓名',
    office_fax: '单位值班电话,传真',
    liaison_office_telephone: '联络人员办公室电话',
    liaison_phone_number: '联络人员手机号码',
    address_book_type: '通讯录类型(earthRelief: 抗震救灾 ; geologicHazard: 地址灾害)',
    title_name: '职务名称',
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

// 尾矿库基本信息及包保信息详情
const ttailingspondandgovernment = {
  name: '尾矿库基本信息及包保信息详情',
  unitObj: {},
  telPelope: {
    // 电话拨打后对应人名,
  },
  telobj: {
    // tel
  },
  dataFilter: [
    'tailings_pond_name',
    'address',
    'company',
    'pr_name',
    'pr_company',
    'pr_post',
    'pr_name_two',
    'pr_company_two',
    'pr_post_two',
  ],
  labelObj: {
    tailings_pond_name: '尾矿库名称',
    address: '地址',
    company: '单位',
    pr_name: '姓名',
    pr_company: '领导工作单位',
    pr_post: '职位',
    pr_name_two: '姓名/(复数)',
    pr_company_two: '领导工作单位/(复数)',
    pr_post_two: '职位/(复数)',
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
const teamForeHeliport = {
  name: '直升机起降点详情',
  unitObj: {
    altitude: '米',
    helicopternum: '架',
  },
  telPelope: { // 电话拨打后对应人名
    adminorgtel: 'adminorg',
  },
  telobj: {
    adminorgtel: 'adminorgtel',
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
    latitude: '纬度',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 720,
  cb(self: any) {
    // cb
  },
};

// 直升机取水点
const FORWATERSOURCE3 = {
  name: '直升机取水点详情',
  unitObj: {
    capacity: '万立方米',
    altitude: '米',
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
    latitude: '纬度',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 720,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '直升机取水点';
    }
  },
};

// 远程输水取水码头
const FORWATERSOURCE2 = {
  name: '远程输水取水码头',
  unitObj: {
    capacity: '万立方米',
    altitude: '米',
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
    capacity: '库容',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 720,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '远程输水取水码头';
    }
  },
};

// 取水点加取水码头
const FORWATERSOURCE4 = {
  name: '取水点加取水码头详情',
  unitObj: {
    capacity: '万立方米',
    altitude: '米',
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
    capacity: '库容',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 720,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '取水点加取水码头';
    }
  },
};

// 全市国有林场
const FORESTFARM = {
  name: '全市国有林场详情',
  unitObj: {
    businessarea: '亩',
    personnum: '人',
  },
  telPelope: {
    // 电话拨打后对应人名
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
    businessarea: '面积',
  },
  btnFilter: [],
  popHeight: 720,
  cb(self: any) {
    // cb
  },
};

// 全市自然保护区
const NatureReserve = {
  name: '全市自然保护区详情',
  unitObj: {
    area: '公顷',
    forestcoverage: '%',
  },
  telPelope: {
    // 电话拨打后对应人名
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
    forestcoverage: '森林覆盖率',
  },
  btnFilter: [],
  popHeight: 720,
  cb(self: any) {
    // cb
  },
};

// 机场
const airport = {
  name: '机场详情',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    altitude: '米',
    runwaywidth: '米',
    runwaylength: '米',
    parkingapronnum: '个',
  },
  telPelope: {
    // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
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
    parkingapronnum: '停机位数量',
  },
  popHeight: 730,
  cb(self: any) {
    const that = self;
    if (that.data.longitude && Number(that.data.longitude)) {
      that.data.longitude = Number(that.data.longitude).toFixed(5);
    }
    if (that.data.latitude && Number(that.data.latitude)) {
      that.data.latitude = Number(that.data.latitude).toFixed(5);
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

// 防火检查站
const FIREINSPECTIONSTATION = {
  name: '防火检查站详情',
  unitObj: {
    capacity: '万立方米',
    altitude: '米',
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
    contacts_cell: '联系电话',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 500,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '防火检查站';
    }
  },
};

// 防火瞭望塔
const LOOKOUTTOWER = {
  name: '防火瞭望塔详情',
  unitObj: {
    capacity: '万立方米',
    altitude: '米',
  },
  telPelope: { // 电话拨打后对应人名
    contacts_cell: 'contacts',
  },
  telobj: {
    contacts_cell: 'contacts_cell',
  },
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
    contacts_cell: '联系电话',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 500,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '防火瞭望塔';
    }
  },
};

// 邯郸市林业防火自然保护地
const foresfirepreventionimportantplace = {
  name: '防火自然保护地详情',
  unitObj: {
  },
  telPelope: {
  },
  telobj: {
  },
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
    district: '行政区划',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 600,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '防火自然保护地';
    }
  },
};

// 邯郸市林业防火重点部位
const forestfirepreventionnaturalreserve = {
  name: '防火重点部位详情',
  unitObj: {
  },
  telPelope: {
    firechiefphone: 'firechief',
  },
  telobj: {
    firechiefphone: 'firechiefphone',
  },
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
    firechief: '负责人',
    firechiefphone: '联系电话',
    district: '行政区划',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 600,
  cb(self: any) {
    // 对电话返回格式15533043222.0进行处理 毕东方 2021.12.6
    const that = self;
    if (that.data.firechiefphone && that.data.firechiefphone.includes('.')) {
      return that.data.firechiefphone = that.data.firechiefphone.substring(0, that.data.firechiefphone.indexOf('.'));
    }
  },
};
// 邯郸市林业防火装备
const forestfireprevention = {
  name: '防火装备详情',
  unitObj: {
  },
  telPelope: {
  },
  telobj: {
  },
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
    district: '行政区划',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 600,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '防火装备';
    }
  },
};
// 邯郸市林业防火阻隔带信息
const forestfirepreventionbarrierstrip = {
  name: '防火阻隔带信息详情',
  unitObj: {
  },
  telPelope: {
  },
  telobj: {
  },
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
    district: '行政区划',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 600,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '防火阻隔带信息';
    }
  },
};
// 邯郸市林业防火气象监测站
const forestfirepreventionmeteorologicalmonitoringstation = {
  name: '防火气象监测站详情',
  unitObj: {
  },
  telPelope: {
  },
  telobj: {
  },
  dataFilter: [
    'monitoringstationname',
    'principalandphone',
    'district',
  ],
  labelObj: {
    monitoringstationname: '监测站名称',
    principalandphone: '联系人及电话',
    district: '行政区划',
  },
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', //  周边视频
  ],
  popHeight: 600,
  cb(self: any) {
    // cb
    if (self.data && self.data.watersourcetypecode) {
      self.data.watersourcetypecode = '防火气象监测站';
    }
  },
};
const emResourcePopUpTypesFilter = [
  'shelter', // 避难场所
  // 专家
  'invitedxpert',
  'safetycultureexpert',
  'comprehensiveexpert',
  'investigationexpert',
  'mitigationexpert',
  'coalexpert', // 煤矿专家
  'nonmineexpert', // 非煤矿山
  'chemicalexpert', // 危险化学品
  'tradexpert', // 工商贸
  'emergenceexpert', // 应急救援
  'fireexpert', // 火灾防治
  'floodexpert', // 防汛防旱
  'earthquakeexpert', // 地质灾害
  'fireworkexpert', // 烟花爆竹
  'lawexpert', // 政策法规
  'infomationexpert', // 宣教与信息化
  'Expert※13', // 气象专业
  'Expert※14', // 应急救援
  'Expert※15', // 自然灾害
  'Expert※16', // 电力抢修
  'Expert※17', // 医疗救助
  'Expert※18', // 危险化学品
  'Expert※19', // 防汛抗旱
  'Expert※20', // 工商贸
  'Expert※21', // 通信抢险
  'Expert※22', // 工程抢险
  'Expert※23', // 非煤矿山
  'Expert※24', // 地震地质
  'Expert※25', // 森火救援
  'Expert※26', // 煤矿
  'Expert※27', // 地质勘测
  'Expert※28', // 心理咨询
  'Expert※29', // 政策法规
  'Expert※30', // 交通运输
  'Expert※31', // 消防救援
  // 救援装备
  't_electricity_safeguard_equipme', // 应急电力保障设备
  't_lifting_equipment', // 应急救援吊装设备
  't_fire_fighting_equipment', // 防火设备
  't_monitor_equipment', // 应急救援监测设备
  't_forcible_entry_equipment',  // 应急救援破拆设备
  't_person_protective_equipment', // 应急救援人身防护设备
  't_spray_water_equiment', // 应急救援喷水设备
  'reduce_disaster_committee_membe', // 减灾委成员
  't_headquarters_member_address_b', // 地震地质救援指挥部成员
  't_tailings_pond_and_government', // 尾矿库基本信息及包保信息
  'emergency_department_equipment', // 应急局救援装备
  'code_detector_type', // 传感器类型代码表
  'enterprise_detector', // 传感器
  'enterprise_facility', // 网关设备
  't_pumping_equiment', // 排水设备
  'v_equipment※06', // 挖掘机机械
  'v_equipment※07', // 推土机
  'v_equipment※08', // 吊装设备
  'v_equipment※09', // 转载机
  'v_equipment※10', // 大流量排水设备
  'v_equipment※11', // 发电设备
  'v_equipment※12', // 机动船只
  'v_equipment※13', // 橡皮艇
  'v_equipment※14', // 泵车
  'v_equipment※15', // 运输车辆
  // 消防车辆
  'v_equipment※24', // 指挥车
  'v_equipment※25', // 举高喷射消防车
  'v_equipment※26', // 泡沫消防车
  'v_equipment※27', // 水罐消防车
  'v_equipment※28', // 干粉消防车
  'v_equipment※29', // 压缩空气消防车
  'v_equipment※30', // 排烟消防车
  'v_equipment※31', // 抢险救援车
  'v_equipment※32', // 后援保障车
  'v_equipment※33', // 登高平台
  'v_equipment※34', // 云梯
  // 医疗救援车辆
  'v_equipment※36', // 救护车
  'v_equipment※37', // 矿山救护车
  'v_equipment※38', // 救护装备车
  // 抢通抢修车辆
  'v_equipment※40', // 应急通信车
  'v_equipment※41', // 应急发电车
  'v_equipment※42', // 配电抢修车
  'v_equipment※43', // 燃气抢修车
  // 人员运输车
  'v_equipment※45', // 公交车
  'v_equipment※46', // 客车
  // 其他车辆
  'v_equipment※48', // 洒水车
  'v_equipment※49', // 吸污车
  'for_watersourceport', // 直升机起降点
  'for_heliport', // 停机坪
  'for_watersource',
  'for_waterport',
  'FOR_WATERSOURCE※04',
  'watersource_air',
  'watersource',
  'watersource_puf',
  'heliport',
  'airport', // 机场
  'for_forestfarm', // 全市国有林场
  'forest_fire_prevention_natural_reserve', // 邯郸市林业防火重点部位
  'fores_fire_prevention_important_place', // 邯郸市林业防火自然保护地
  'forest_fire_prevention', // 邯郸市林业防火装备
  'forest_fire_prevention_barrier_strip', // 邯郸市林业防火阻隔带信息
  'forest_fire_prevention_meteorological_monitoring_station', // 邯郸市林业防火气象监测站
  'for_naturalreserve',
  'v_equipment※02', // 左侧救援装备
  'equipment', // 切换PG库，通用装备详情
  'fireinspectionstation', // 防火检查站
  'lookouttower',  // 防火瞭望塔
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

const emResourceTypesPopUpRule: any = {
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
  // 救援装备
  't_electricity_safeguard_equipme': telectricitysafeguardequipme, // 应急电力保障设备
  't_lifting_equipment': tliftingequipment, // 应急救援吊装设备
  't_fire_fighting_equipment': tfirefightingequipment, // 防火设备
  't_monitor_equipment': tmonitorequipment, // 应急救援监测设备
  't_forcible_entry_equipment': tforcibleentryequipment, // 应急救援破拆设备
  't_person_protective_equipment': tpersonprotectiveequipment,  // 应急救援人身防护设备
  't_spray_water_equiment': tspraywaterequiment, // 应急救援喷水设备
  't_pumping_equiment': tpumpingequiment, // 排水设备
  'reduce_disaster_committee_membe': reducedisastercommitteemembe,  // 减灾委成员
  'emergency_department_equipment': emergencydepartmentequipment, // 应急局救援装备
  'code_detector_type': codedetectortype, // 传感器类型代码表
  'enterprise_detector': enterprisedetector, // 传感器
  'enterprise_facility': enterprisefacility, // 网关设备
  't_headquarters_member_address_b': theadquartersmemberaddressb, // 地震地质救援指挥部成员
  't_tailings_pond_and_government': ttailingspondandgovernment, // 尾矿库基本信息及包保信息
  'v_equipment※03': teamEquipment, // 直升机
  'v_equipment※04': teamEquipment, // 无人机
  'v_equipment※06': teamEquipment, // 挖掘机机械
  'v_equipment※07': teamEquipment, // 推土机
  'v_equipment※08': teamEquipment, // 吊装设备
  'v_equipment※09': teamEquipment, // 转载机
  'v_equipment※10': teamEquipment, // 大流量排水设备
  'v_equipment※11': teamEquipment, // 发电设备
  'v_equipment※12': teamEquipment, // 机动船只
  'v_equipment※13': teamEquipment, // 橡皮艇
  'v_equipment※14': teamEquipment, // 泵车
  'v_equipment※15': teamEquipment, // 运输车辆
  // 消防车辆
  'v_equipment※24': teamEquipment, // 指挥车
  'v_equipment※25': teamEquipment, // 举高喷射消防车
  'v_equipment※26': teamEquipment, // 泡沫消防车
  'v_equipment※27': teamEquipment, // 水罐消防车
  'v_equipment※28': teamEquipment, // 干粉消防车
  'v_equipment※29': teamEquipment, // 压缩空气消防车
  'v_equipment※30': teamEquipment, // 排烟消防车
  'v_equipment※31': teamEquipment, // 抢险救援车
  'v_equipment※32': teamEquipment, // 后援保障车
  'v_equipment※33': teamEquipment, // 登高平台
  'v_equipment※34': teamEquipment, // 云梯
  // 医疗救援车辆
  'v_equipment※36': teamEquipment, // 救护车
  'v_equipment※37': teamEquipment, // 矿山救护车
  'v_equipment※38': teamEquipment, // 救护装备车
  // 抢通抢修车辆
  'v_equipment※40': teamEquipment, // 应急通信车
  'v_equipment※41': teamEquipment, // 应急发电车
  'v_equipment※42': teamEquipment, // 配电抢修车
  'v_equipment※43': teamEquipment, // 燃气抢修车
  // 人员运输车
  'v_equipment※45': teamEquipment, // 公交车
  'v_equipment※46': teamEquipment, // 客车
  // 其他车辆
  'v_equipment※48': teamEquipment, // 洒水车
  'v_equipment※49': teamEquipment, // 吸污车
  'equipment': teamEquipment, // 换PG库，通用装备详情
  'for_watersourceport': teamForeHeliport, // 直升机起降点
  'for_heliport': teamForeHeliport, // 停机坪
  'for_waterport': FORWATERSOURCE2,
  'for_watersource': FORWATERSOURCE3,
  'FOR_WATERSOURCE※04': FORWATERSOURCE4,
  'watersource_air': FORWATERSOURCE3,
  'watersource': FORWATERSOURCE2,
  'watersource_puf': FORWATERSOURCE4,
  'heliport': teamForeHeliport,
  'for_forestfarm': FORESTFARM, // 全市国有林场
  'forest_fire_prevention_natural_reserve': forestfirepreventionnaturalreserve, // 邯郸市林业防火重点部位
  'fores_fire_prevention_important_place': foresfirepreventionimportantplace, // 邯郸市林业防火自然保护地
  'forest_fire_prevention': forestfireprevention, // 邯郸市林业防火装备
  'forest_fire_prevention_barrier_strip': forestfirepreventionbarrierstrip, // 邯郸市林业防火阻隔带信息
  'forest_fire_prevention_meteorological_monitoring_station': forestfirepreventionmeteorologicalmonitoringstation, // 邯郸市林业防火气象监测站
  'for_naturalreserve': NatureReserve, // 自然保护区
  'fireinspectionstation': FIREINSPECTIONSTATION, // 防火检查站
  'lookouttower': LOOKOUTTOWER, // 防火瞭望塔
};

export { emResourcePopUpTypesFilter, emResourceTypesPopUpRule };
