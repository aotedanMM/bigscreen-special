// 张晓星
// 地质灾害隐患点详情
const geologicHazard: any = {
  name: '地质灾害隐患点详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    thrproperty: '万',
    risknum: '人',
  },
  telPelope: { // 电话拨打后对应人名
    mobiletel: 'infopersonname',
  },
  telobj: {
    mobiletel: 'mobiletel',
  },
  dataFilter: [
    'name',
    'featurecode',
    'pac',
    'disasterscale',
    'disasterlevelcode',
    'risknum',
    'thrproperty',
    'inducingfactors',
    'chargedept',
    'infopersonpersontype',
    'infopersonname',
    'mobiletel',
    'protection',
  ],
  labelObj: {
    name: '名称',
    featurecode: '类型',
    pac: '所在行政区域',
    disasterscale: '规模等级',
    disasterlevelcode: '险情等级',
    // '威胁情况',
    risknum: '威胁人数',
    thrproperty: '威胁财产',
    inducingfactors: '形成原因',
    chargedept: '责任主体',
    // '群测群防员',
    infopersonpersontype: '人员类型',
    infopersonname: '人员姓名',
    mobiletel: '群测群防联系方式',
    protection: '处置建议',
  },
  popHeight: 656,
  cb(self: any) {
    const that = self;
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

// 港口码头
const tailingsPond = {
  name: '港口码头详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    useyearnum: '年',
    berthnum: '个',
    grossarea: '万立方米',
  },
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 756,
  dataFilter: [
    'name',
    'address',
    'contactper',
    'contactpermtel',
    'defobjtypename',
    'grossarea',
    'berthnum',
    'inusedate',
    'useyearnum',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactpermtel: '电话',
    defobjtypename: '港口类型',
    grossarea: '总面积',
    berthnum: '泊位数量',
    inusedate: '投入使用年份',
    useyearnum: '设计使用年限',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    // 处理时间
    if (self.data.inusedate) {
      // 时间转化，提取年月日
      const date = new Date(self.data.inusedate);
      self.data.inusedate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }

    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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

// 机场
const airport = {
  name: '机场详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    altitude: '米',
    runwaywidth: '米',
    runwaylength: '米',
    parkingapronnum: '个',
  },
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  dataFilter: [
    'name',
    'districtname',
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
    districtname: '行政区划',
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

// 火车站
const trainStation = {
  name: '火车站详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'contactper', 'contactmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
// 汽车站
const busStation = {
  name: '汽车站详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    respmtel: 'respper',
  },
  telobj: {
    respmtel: 'respmtel',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'respper', 'respmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    respper: '联系人',
    respmtel: '电话',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
// 学校
const school = {
  name: '学校详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    studentnum: '人',
    facultynum: '人',
    buildarea: '平方米',
  },
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 756,
  dataFilter: [
    'name',
    'schooltypename',
    'address',
    'contactper',
    'contactmtel',
    'studentnum',
    'facultynum',
    'buildarea',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    schooltypename: '类型',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    studentnum: '在校生数',
    facultynum: '教职工数',
    buildarea: '建筑面积',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
// 医院
const hospital = {
  name: '医院详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    bednum: '张',
    nursenum: '人',
  },
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 756,
  dataFilter: [
    'name',
    'address',
    'contactper',
    'contactmtel',
    'bednum',
    'nursenum',
    'orggradename',
    'orgtypename',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    bednum: '病床数',
    nursenum: '护士数',
    orggradename: '医院等级',
    orgtypename: '卫生机构类别',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
// 水库大坝
const reservoir = {
  name: '水库大坝详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    telephone: 'respper',
  },
  telobj: {
    telephone: 'telephone',
  },
  popHeight: 760,
  dataFilter: [
    'fullname',
    'scalename',
    'damtype',
    'totalstorage',
    'floodregulatiostorage',
    'utilizablecapacity',
    'address',
    'river',
    'completiondate',
    'catchmentarea',
    'waterlimit',
    'management',
  ],
  labelObj: {
    fullname: '水库全称',
    scalename: '水库类型',
    damtype: '坝型',
    totalstorage: '总库容',
    floodregulatiostorage : '调洪库容（亿m3）',
    utilizablecapacity : '兴利库容（亿m3）',
    address: '水库地址',
    river: '所在河流',
    completiondate: '建成时间',
    catchmentarea: '集水面积（km2）',
    waterlimit: '汛限水位（m）',
    management: '管理单位名称',
  },

  cb(self: any) {
    const that = self;
    // 处理时间
    if (self.data.builddate) {
      // 时间转化，提取年月日
      const date = new Date(self.data.builddate);
      self.data.builddate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
const reservoirCountdx = {
  name: '大型水库详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    telephone: 'respper',
  },
  telobj: {
    telephone: 'telephone',
  },
  popHeight: 760,
  dataFilter: [
    'fullname',
    'scalename',
    'damtype',
    'totalstorage',
    'floodregulatiostorage',
    'utilizablecapacity',
    'address',
    'river',
    'completiondate',
    'catchmentarea',
    'waterlimit',
    'management',
  ],
  labelObj: {
    fullname: '水库全称',
    scalename: '水库类型',
    damtype: '坝型',
    totalstorage: '总库容',
    floodregulatiostorage : '调洪库容（亿m3）',
    utilizablecapacity : '兴利库容（亿m3）',
    address: '水库地址',
    river: '所在河流',
    completiondate: '建成时间',
    catchmentarea: '集水面积（km2）',
    waterlimit: '汛限水位（m）',
    management: '管理单位名称',
  },

  cb(self: any) {
    const that = self;
    // 处理时间
    if (self.data.builddate) {
      // 时间转化，提取年月日
      const date = new Date(self.data.builddate);
      self.data.builddate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
const reservoirCountzx = {
  name: '中型水库详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    telephone: 'respper',
  },
  telobj: {
    telephone: 'telephone',
  },
  popHeight: 760,
  dataFilter: [
    'fullname',
    'scalename',
    'damtype',
    'totalstorage',
    'floodregulatiostorage',
    'utilizablecapacity',
    'address',
    'river',
    'completiondate',
    'catchmentarea',
    'waterlimit',
    'management',
  ],
  labelObj: {
    fullname: '水库全称',
    scalename: '水库类型',
    damtype: '坝型',
    totalstorage: '总库容',
    floodregulatiostorage : '调洪库容（亿m3）',
    utilizablecapacity : '兴利库容（亿m3）',
    address: '水库地址',
    river: '所在河流',
    completiondate: '建成时间',
    catchmentarea: '集水面积（km2）',
    waterlimit: '汛限水位（m）',
    management: '管理单位名称',
  },

  cb(self: any) {
    const that = self;
    // 处理时间
    if (self.data.builddate) {
      // 时间转化，提取年月日
      const date = new Date(self.data.builddate);
      self.data.builddate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
const reservoirCountxx = {
  name: '小型水库详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    telephone: 'respper',
  },
  telobj: {
    telephone: 'telephone',
  },
  popHeight: 760,
  dataFilter: [
    'fullname',
    'scalename',
    'damtype',
    'totalstorage',
    'floodregulatiostorage',
    'utilizablecapacity',
    'address',
    'river',
    'completiondate',
    'catchmentarea',
    'waterlimit',
    'management',
  ],
  labelObj: {
    fullname: '水库全称',
    scalename: '水库类型',
    damtype: '坝型',
    totalstorage: '总库容',
    floodregulatiostorage : '调洪库容（亿m3）',
    utilizablecapacity : '兴利库容（亿m3）',
    address: '水库地址',
    river: '所在河流',
    completiondate: '建成时间',
    catchmentarea: '集水面积（km2）',
    waterlimit: '汛限水位（m）',
    management: '管理单位名称',
  },

  cb(self: any) {
    const that = self;
    // 处理时间
    if (self.data.builddate) {
      // 时间转化，提取年月日
      const date = new Date(self.data.builddate);
      self.data.builddate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
const findFloodVillage = {
  name: '山洪灾害村详情',
  btnFilter: [
    // 'aroundAnalysisBtn', // 周边分析
    // 'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    villageprphone: 'villagepr',
  },
  telobj: {
    villageprphone: 'villageprphone',
  },
  popHeight: 500,
  dataFilter: [
    'villagename',
    'county',
    'country',
    'villagepr',
    'villageprpost',
    'villageprphone',
  ],
  labelObj: {
    villagename: '村名',
    county: '所属区',
    country: '所属乡',
    villagepr: '村级负责人',
    villageprpost : '职务',
    villageprphone : '电话',
  },
  // 解决打开弹窗因找不到对应的cb函数而报错的问题
  cb(self: any) {
    const that = self;
  },
};
// 文物保护单位
const culturalrelicunit = {
  name: '文物保护单位详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    area: '平方米',
  },
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 656,
  dataFilter: [
    'name',
    'address',
    'contactper',
    'contactmtel',
    'districtname',
    'featurename',
    'area',
    'relicage',
    'relicdescrip',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
    featurename: '单位类型',
    area: '占地面积',
    relicage: '文物时代',
    relicdescrip: '主要文物介绍',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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

// 党政机关
const government = {
  name: '党政机关详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'contactper', 'contactmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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

// 档案馆
const archives = {
  name: '档案馆详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'contactper', 'contactmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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

// 电视台
const newscast = {
  name: '电视台详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactotel',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'contactper', 'contactmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
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
// 科研机构  国防科研
const resins = {
  name: '国防科研详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'contactper', 'contactmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
  },

  cb(self: any) {
    const that = self;
    if (
      that.data.damlength &&
      that.data.damlength.toString().indexOf('米') === -1
    ) {
      if (that.data.damlength !== '') {
        that.data.damlength = that.data.damlength + '米';
      }
    }
    if (
      that.data.ismajordanger !== '否' ||
      that.data.ismajordanger !== '是' ||
      that.data.ismajordanger !== '未知'
    ) {
      if (Number(that.data.ismajordanger) === 1) {
        that.data.ismajordanger = '否';
      } else if (Number(that.data.ismajordanger) === 0) {
        that.data.ismajordanger = '是';
      } else if (Number(that.data.ismajordanger) === 9) {
        that.data.ismajordanger = '未知';
      }
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
// 加油站
const gasstation = {
  name: '加油站详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    // 'aroundVideoBtn', // 周边视频
    'realTimeBtn', // 实时监测
    'companyVideoBtn', // 企业视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    respmtel: 'respper',
  },
  telobj: {
    respmtel: 'respmtel',
  },
  popHeight: 600,
  dataFilter: ['name', 'address', 'respper', 'respmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    respper: '负责人',
    respmtel: '负责人电话',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
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
// 养殖场
const farm = {
  name: '养殖场详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contacttel: 'respperson',
  },
  telobj: {
    contacttel: 'contacttel',
  },
  popHeight: 600,
  dataFilter: [
    'name',
    'address',
    'respperson',
    'contacttel',
    'breedingspecies',
    'chargedept',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    respperson: '联系人',
    contacttel: '电话',
    breedingspecies: '养殖畜种',
    chargedept: '主管部门',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
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
// 海洋牧场
const marineranching = {
  name: '海洋牧场详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    area: '平方米',
  },
  telPelope: { // 电话拨打后对应人名
    mobiletel: 'infopersonname',
  },
  telobj: {
    mobiletel: 'mobiletel',
  },
  popHeight: 810,
  dataFilter: [
    'name',
    'infopersonname',
    'mobiletel',
    'typename',
    'brespecies',
    'area',
    'superiordept',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    infopersonname: '联系人',
    mobiletel: '电话',
    districtname: '行政区划',
    typename: '牧场类型',
    brespecies: '养殖种类',
    area: '养殖面积',
    superiordept: '主管单位',
  },
  cb(self: any) {
    const that = self;
    // 处理字段返回json问题
    if (self.data.personinfo) {
      const personinfoJson = JSON.parse(self.data.personinfo);
      if (personinfoJson instanceof Array) {
        let num = 0;
        personinfoJson.forEach((item: any) => {
          if (!item) {
            return;
          }
          self.data.infopersonname = item.name;
          self.data.mobiletel = item.mobiletel;
          num++;
        });
      }
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

// 水闸工程
const sluice = {
  name: '水闸工程详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周周边视频
  ],
  unitObj: {
    gatenum: '个',
    clearheight: '米',
    clearwide: '米',
    gateheight: '米',
    gatelimit: '米',
  },
  telPelope: { // 电话拨打后对应人名
    lxdh: 'zhzh',
  },
  telobj: {
    lxdh: 'lxdh',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'zhzh',
    'lxdh',
    'usestatus',
    'gldwbh',
    'districtname',
    'sluiceno',
    'sluicetype',
    'factory',
    'gatemodel',
    'gateheight',
    'clearheight',
    'clearwide',
    'gatenum',
    'gatelimit',
    'gatematerial',
    'opencloform',
    'coverarea',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    zhzh: '联系人',
    lxdh: '电话',
    usestatus: '使用状态',
    gldwbh: '管理单位',
    districtname: '行政区划',
    sluiceno: '水闸编码',
    sluicetype: '水闸类别',
    factory: '生产厂家',
    gatemodel: '闸门型号',
    gateheight: '闸门高程',
    clearheight: '闸门净高',
    clearwide: '闸门净宽',
    gatenum: '闸门个数',
    gatelimit: '开闸限程',
    gatematerial: '闸体材质',
    opencloform: '启闭形式',
    coverarea: '占地面积',
  },
  cb(self: any) {
    const that = self;
    if (that.data.coverarea) {
      that.data.coverarea = that.data.coverarea + '平方米';
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

// 堤防工程
const bundpitch = {
  name: '堤防工程详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    gatenum: '个',
  },
  telPelope: { // 电话拨打后对应人名
    lxdh: 'zhzh',
  },
  telobj: {
    lxdh: 'lxdh',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'zhzh',
    'lxdh',
    'usestatus',
    'datasource',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    zhzh: '联系人',
    lxdh: '电话',
    usestatus: '使用状态',
    datasource: '管理单位',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (that.data.coverarea) {
      that.data.coverarea = that.data.coverarea + '平方米';
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

// 电排站
const dianpaizhan = {
  name: '电排站详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    gatenum: '个',
  },
  telPelope: { // 电话拨打后对应人名
    lxdh: 'zhzh',
  },
  telobj: {
    lxdh: 'lxdh',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'zhzh',
    'lxdh',
    'usestatus',
    'datasource',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    zhzh: '联系人',
    lxdh: '电话',
    usestatus: '使用状态',
    datasource: '管理单位',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (that.data.coverarea) {
      that.data.coverarea = that.data.coverarea + '平方米';
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

// 船闸
const chuanzha = {
  name: '船闸详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    gatenum: '个',
  },
  telPelope: { // 电话拨打后对应人名
    lxdh: 'zhzh',
  },
  telobj: {
    lxdh: 'lxdh',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'zhzh',
    'lxdh',
    'usestatus',
    'datasource',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    zhzh: '联系人',
    lxdh: '电话',
    usestatus: '使用状态',
    datasource: '管理单位',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (that.data.coverarea) {
      that.data.coverarea = that.data.coverarea + '平方米';
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

// 水电站
const dianzhan = {
  name: '水电站详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    gatenum: '个',
  },
  telPelope: { // 电话拨打后对应人名
    lxdh: 'zhzh',
  },
  telobj: {
    lxdh: 'lxdh',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'zhzh',
    'lxdh',
    'usestatus',
    'datasource',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    zhzh: '联系人',
    lxdh: '电话',
    usestatus: '使用状态',
    datasource: '管理单位',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (that.data.coverarea) {
      that.data.coverarea = that.data.coverarea + '平方米';
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

// 供电设施
const powerfacilities = {
  name: '供电设施详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    mobiletel: 'person',
  },
  telobj: {
    mobiletel: 'mobiletel',
  },
  popHeight: 650,
  dataFilter: ['name', 'address', 'person', 'mobiletel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    person: '联系人',
    mobiletel: '电话',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (that.data.PAC && that.data.PAC.fullname) {
      that.data.districtcode = that.data.PAC.fullname;
    }
    if (that.data.fullname) {
      that.data.districtcode = that.data.fullname;
    }
    if (that.data.personinfo && JSON.parse(that.data.personinfo)[0]) {
      that.data.person = JSON.parse(that.data.personinfo)[0].name;
      that.data.mobiletel = JSON.parse(that.data.personinfo)[0].mobiletel || JSON.parse(that.data.personinfo)[0].mobiletel2 || '';
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

// 公共聚集场所
const publicgathering = {
  name: '公共聚集场所详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    restlevelcode: '级',
    servecap: '人',
    exitdesc: '个',
  },
  telPelope: { // 电话拨打后对应人名
    respmtel: 'contactper',
    contactmtel: 'name',
  },
  telobj: {
    respmtel: 'respmtel',
    contactmtel: 'contactmtel',
  },
  popHeight: 650,
  dataFilter: [
    'name',
    'address',
    'contactper',
    'respmtel',
    'contactmtel',
    'restlevelcode',
    'servecap',
    'firefacilities',
    'exitdesc',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    respmtel: '电话',
    contactmtel: '办公电话',
    restlevelcode: '宾馆星级',
    servecap: '接待能力',
    firefacilities: '消防设施配备情况',
    exitdesc: '安全出口数量',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
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

// 大型商贸
const market = {
  name: '大型商贸详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 600,
  dataFilter: ['name', 'address', 'contactper', 'contactmtel', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    districtname: '行政区划',
  },
  cb(self: any) {
    const that = self;
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

// 集贸市场
const pedlars = {
  name: '集贸市场详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    exitdesc: '个',
  },
  telPelope: { // 电话拨打后对应人名
    contactmtel: 'contactper',
  },
  telobj: {
    contactmtel: 'contactmtel',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'contactper',
    'contactmtel',
    'defobjtypecode',
    'districtname',
    'businessarea',
    'material',
    'exitdesc',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    contactper: '联系人',
    contactmtel: '电话',
    defobjtypecode: '类型',
    districtname: '行政区划',
    businessarea: '经营面积',
    material: '消防设施情况',
    exitdesc: '安全出口情况',
  },
  cb(self: any) {
    const that = self;
    if (that.data.businessarea) {
      that.data.businessarea = that.data.businessarea + '平方米';
    }
    if (that.data) {
      that.data.defobjtypecode = '农贸市场';
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

// 旅游景区
const tourist = {
  name: '旅游景区详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
  },
  telPelope: { // 电话拨打后对应人名
    mobiletel: 'person',
  },
  telobj: {
    mobiletel: 'mobiletel',
  },
  // 返回数据无area占地面积字段，故去掉 毕东方 2021.11.24
  popHeight: 600,
  dataFilter: [
    'name',
    'address',
    'person',
    'mobiletel',
    'levelcode',
    'exitdesc',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    person: '联系人',
    mobiletel: '电话',
    levelcode: '级别',
    exitdesc: '出入口情况',
    districtname: '行政区划',
  },
  cb(self: any) {

    // 解析personinfo数据
    const that = self;
    if (that.data.personinfo) {
      that.data.person = JSON.parse(JSON.stringify(that.data.personinfo)).name;
      that.data.mobiletel = JSON.parse(
        JSON.stringify(that.data.personinfo),
      ).mobiletel;
    }

    if (that.data) {
      that.data.area = that.data.area + '平方米';
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

// 文化场馆
const cultural = {
  name: '文化场馆详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    mobiletel: 'infopersonname',
  },
  telobj: {
    mobiletel: 'mobiletel',
  },
  popHeight: 600,
  dataFilter: [
    'name',
    'address',
    'infopersonname',
    'mobiletel',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    infopersonname: '联系人',
    mobiletel: '电话',
    districtname: '行政区划',
  },
  cb(self: any) {
    // 处理字段返回json问题
    if (self.data.personinfo) {
      const personinfoJson = JSON.parse(self.data.personinfo);
      if (personinfoJson instanceof Array) {
        let num = 0;
        personinfoJson.forEach((item: any) => {
          if (!item) {
            return;
          }
          self.data.mobiletel = item.mobiletel;
          self.data.infopersonname = item.name;
          num++;
        });
      }
    }
    if (
      self.data &&
      self.data.attributeSet &&
      self.data.attributeSet.attributes
    ) {
      self.dataAttributes = self.data.attributeSet.attributes;
      self.getpopData(self.dealAttributes());
    } else {
      self.getpopData(self.data);
    }
  },
};

// 地震监测站台
const dizhenMonitoring = {
  name: '地震监测站台详情',
  btnFilter: [
    // 暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
  },
  telobj: {
  },
  popHeight: 600,
  dataFilter: [
    'name',
    'address',
    'fullname',
    'monitoritem',
    'stationtypecode',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    fullname: '行政区划',
    monitoritem: '测项',
    stationtypecode: '监测站台类型',
  },
  cb(self: any) {
    // 处理字段返回json问题
    const stationtypecode: any = {
      1: '测震、强震观测台（点）',
      2: '地球物理观测台（点）',
      3: '骨干观测台（点）',
    };
    if (self.data.stationtypecode) {
      self.data.stationtypecode = stationtypecode[self.data.stationtypecode] || '- -';
    }
    if (
      self.data &&
      self.data.attributeSet &&
      self.data.attributeSet.attributes
    ) {
      self.dataAttributes = self.data.attributeSet.attributes;
      self.getpopData(self.dealAttributes());
    } else {
      self.getpopData(self.data);
    }
  },
};

// 匹配拦截类型
const defenseObjectTypesFilter = [
  'portwharf', // 港口码头
  'portwharf', // 左侧港口码头
  'airport', // 机场
  'airport', // 左侧机场
  'railwaystation', // 火车站
  'railwaystation', // 左侧火车站
  'coachstation', // 汽车站
  'bas_school', // 学校
  'hospital', // 医院
  'hospital', // 左侧医院
  'Resrrvoir※01', // 水库大坝
  'reservoir', // 左侧水库大坝
  'reservoirCountdx', // 大型水库
  'reservoirCountzx', // 中型水库
  'reservoirCountxx', // 小型水库
  'culturalrelicunit', // 文物保护单位
  'government', // 党政机关
  'archives', // 档案馆
  'tvcast', // 电视台
  'newscast', // 广播电台
  'Communication※01', // 通讯社
  'researchinstitution', // 国防科研
  'Resins※02', // 科研单位
  'gasstation', // 加油站
  'farm', // 养殖场
  'ocepasture', // 海洋牧场
  'sluice', // 水闸工程
  'powerfacilities', // 供电设施
  'supwatfacil', // 供水设施
  'gasfacil', // 燃气供应设施
  'powerfacil', // 大型能源动力设施
  'hotel', // 宾馆饭店
  'market', // 大型商贸
  'bazaar', // 集贸市场
  'Gymnasium', // 大型文化体育场所
  'tourist', // 旅游景区
  'culturalvenues', // 文化场馆
  'financialins', // 银行金融
  'school', // 学校
  'bundpitch', // 提防
  'dianpaizhan', // 电排站
  'chuanzha', // 船闸
  'dianzhan', // 水电站
  'shuizha', // 水闸工程
  'monitorstation', // 地震监测站台
  'MON_MONITORSTATION_EARTHQUAKE', // 地震监测站台,
  'floodvillage',
];

const defenseObjectTypesPopUpRule: any = {
  'portwharf': tailingsPond,
  'airport': airport,
  'railwaystation': trainStation,
  'coachstation': busStation,
  'bas_school': school,
  'hospital': hospital,
  'Resrrvoir※01': reservoir,
  'reservoir': reservoir,
  'reservoirCountdx': reservoirCountdx,
  'reservoirCountzx': reservoirCountzx,
  'reservoirCountxx': reservoirCountxx,
  'floodvillage': findFloodVillage,
  'culturalrelicunit': culturalrelicunit,
  'government': government,
  'archives': archives,
  'tvcast': newscast,
  'newscast': newscast,
  'Communication※01': newscast,
  'researchinstitution': resins,
  'Resins※02': resins,
  'gasstation': gasstation,
  'farm': farm,
  'ocepasture': marineranching,
  'sluice': sluice,
  'powerfacilities': powerfacilities,
  'supwatfacil': powerfacilities,
  'gasfacil': powerfacilities,
  'powerfacil': powerfacilities,
  'hotel': publicgathering,
  'market': market,
  'bazaar': pedlars,
  'Gymnasium': market,
  'tourist': tourist,
  'culturalvenues': cultural,
  'financialins': market,
  'school': school,
  'bundpitch': bundpitch, // 堤防
  'dianpaizhan': dianpaizhan, // 电排站
  'chuanzha': chuanzha, // 船闸
  'dianzhan': dianzhan, // 水电站
  'shuizha': sluice, // 水闸工程
  'monitorstation': dizhenMonitoring, // 地震监测站台
  'MON_MONITORSTATION_EARTHQUAKE': dizhenMonitoring, // 地震监测站台
};

export { defenseObjectTypesFilter, defenseObjectTypesPopUpRule };
