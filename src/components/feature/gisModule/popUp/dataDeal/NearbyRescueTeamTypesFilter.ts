// 周边分析对应弹窗规则
// 学校
const school = {
  name: '学校',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    STUDENTNUM: '人',
    FACULTYNUM: '人',
    BUILDAREA: '平方米',
  },
  telPelope: { // 电话拨打后对应人名
    CONTACTMTEL: 'CONTACTPER',
  },
  telobj: {
    CONTACTMTEL: 'CONTACTMTEL',
  },
  popHeight: 756,
  dataFilter: [
    'name',
    'DEFOBJTYPECODE',
    'address',
    'CONTACTPER',
    'CONTACTMTEL',
    'STUDENTNUM',
    'FACULTYNUM',
    'BUILDAREA',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    DEFOBJTYPECODE: '类型',
    address: '地址',
    CONTACTPER: '联系人',
    CONTACTMTEL: '电话',
    STUDENTNUM: '在校生数',
    FACULTYNUM: '教职工数',
    BUILDAREA: '建筑面积',
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
  name: '医院',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    BEDNUM: '张',
    NURSENUM: '人',
  },
  telPelope: { // 电话拨打后对应人名
    CONTACTMTEL: 'CONTACTPER',
  },
  telobj: {
    CONTACTMTEL: 'CONTACTMTEL',
  },
  popHeight: 756,
  dataFilter: [
    'name',
    'address',
    'CONTACTPER',
    'CONTACTMTEL',
    'BEDNUM',
    'NURSENUM',
    'ORGGRADECODE',
    'ORGTYPENAME',
    'districtname',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    CONTACTPER: '联系人',
    CONTACTMTEL: '电话',
    BEDNUM: '病床数',
    NURSENUM: '护士数',
    ORGGRADECODE: '医院等级',
    ORGTYPENAME: '卫生机构类别',
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

// 党政机关
const government = {
  name: '党政机关',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    CONTACTMTEL: 'CONTACTPER',
  },
  telobj: {
    CONTACTMTEL: 'CONTACTMTEL',
  },
  popHeight: 656,
  dataFilter: ['name', 'address', 'CONTACTPER', 'CONTACTMTEL', 'districtname'],
  labelObj: {
    name: '名称',
    address: '地址',
    CONTACTPER: '联系人',
    CONTACTMTEL: '电话',
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

// 公共聚集场所
const publicgathering = {
  name: '公共聚集场所',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    RESTLEVELCODE: '级',
    SERVECAP: '人',
    EXITDESC: '个',
  },
  telPelope: { // 电话拨打后对应人名
    RESPMTEL: 'CONTACTPER',
  },
  telobj: {
    RESPMTEL: 'RESPMTEL',
  },
  popHeight: 650,
  dataFilter: [
    'name',
    'address',
    'CONTACTPER',
    'RESPMTEL',
    'CONTACTMTEL',
    'RESTLEVELCODE',
    'SERVECAP',
    'FIREFACILITIES',
    'EXITDESC',
    'DISTRICTCODE',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    CONTACTPER: '联系人',
    RESPMTEL: '电话',
    CONTACTMTEL: '办公电话',
    RESTLEVELCODE: '宾馆星级',
    SERVECAP: '接待能力',
    FIREFACILITIES: '消防设施配备情况',
    EXITDESC: '安全出口数量',
    DISTRICTCODE: '行政区划',
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

// 生命线设施
const powerfacilities = {
  name: '供电设施',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
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
  dataFilter: ['name', 'address', 'person', 'mobiletel', 'DISTRICTCODE'],
  labelObj: {
    name: '名称',
    address: '地址',
    person: '联系人',
    mobiletel: '电话',
    DISTRICTCODE: '行政区划',
  },
  cb(self: any) {
    const that = self;
    if (that.data.PERSONINFO && JSON.parse(that.data.PERSONINFO)[0]) {
      that.data.person = JSON.parse(that.data.PERSONINFO)[0].name;
      that.data.mobiletel = JSON.parse(that.data.PERSONINFO)[0].mobiletel || JSON.parse(that.data.PERSONINFO)[0].mobiletel2 || '';
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
  name: '水闸工程',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    GATENUM: '个',
    CLEARHEIGHT: '米',
    CLEARWIDE: '米',
    GATEHEIGHT: '米',
    GATELIMIT: '米',
  },
  telPelope: { // 电话拨打后对应人名
    LXDH: 'ZHZH',
  },
  telobj: {
    LXDH: 'LXDH',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'ZHZH',
    'LXDH',
    'USESTATUS',
    'GLDWBH',
    'DISTRICTCODE',
    'SLUICENO',
    'SLUICETYPE',
    'FACTORY',
    'GATEMODEL',
    'GATEHEIGHT',
    'CLEARHEIGHT',
    'CLEARWIDE',
    'GATENUM',
    'GATELIMIT',
    'GATEMATERIAL',
    'OPENCLOFORM',
    'COVERAREA',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    ZHZH: '联系人',
    LXDH: '电话',
    USESTATUS: '使用状态',
    GLDWBH: '管理单位',
    DISTRICTCODE: '行政区划',
    SLUICENO: '水闸编码',
    SLUICETYPE: '水闸类别',
    FACTORY: '生产厂家',
    GATEMODEL: '闸门型号',
    GATEHEIGHT: '闸门高程',
    CLEARHEIGHT: '闸门净高',
    CLEARWIDE: '闸门净宽',
    GATENUM: '闸门个数',
    GATELIMIT: '开闸限程',
    GATEMATERIAL: '闸体材质',
    OPENCLOFORM: '启闭形式',
    COVERAREA: '占地面积',
  },
  cb(self: any) {
    const that = self;
    if (that.data.COVERAREA) {
      that.data.COVERAREA = that.data.COVERAREA + '平方米';
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

// 经营企业
const conductEnterprise = {
  name: '经营企业',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
  },
  telPelope: { // 电话拨打后对应人名
    SAFETYMAGERTEL: 'SAFETYMAGER',
  },
  telobj: {
    SAFETYMAGERTEL: 'SAFETYMAGERTEL',
  },
  dataFilter: [
    'name',
    'address',
    'ARTIFICIALPER',
    'SAFETYMAGER',
    'SAFETYMAGERTEL',
    'JYFW',
    'OPERATIONMODE',
    'CERTIFICATIME',
    // ,
    'XZXKYXQXJSRQ',
    'XZXKZBH',
    'DANGERLEVEL',
    'HIGHLYTOXICCHEMICALS',
    'EXPLOSIVECHEMICALS',
    'PRECURSORCHEMICALS',
  ],
  labelObj: {
    name: '名称',
    address: '详细地址',
    ARTIFICIALPER: '法定代表人',
    SAFETYMAGER: '联系人',
    SAFETYMAGERTEL: '联系电话',
    JYFW: '经营范围',
    OPERATIONMODE: '经营方式',
    CERTIFICATIME: '发证日期',
    XZXKYXQXJSRQ: '许可有效期',
    XZXKZBH: '发证编号',
    DANGERLEVEL: '重大危险源等级',
    HIGHLYTOXICCHEMICALS: '涉及剧毒品经营品种',
    EXPLOSIVECHEMICALS: '涉及易制爆化学品经营品种',
    PRECURSORCHEMICALS: '涉及易制毒化学品经营品种',
  },
  popHeight: 860,
  cb(self: any) {
    // 处理时间
    if (self.data.CERTIFICATIME) {
      // 时间转化，提取年月日
      const date = new Date(self.data.CERTIFICATIME);
      self.data.CERTIFICATIME = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    // 处理时间
    if (self.data.XZXKYXQXJSRQ && self.data.XZXKYXQXKSRQ) {
      // 时间转化，提取年月日
      const startDate = new Date(self.data.XZXKYXQXKSRQ);
      const endDate = new Date(self.data.XZXKYXQXJSRQ);
      self.data.XZXKYXQXJSRQ = `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()} — ${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`;
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

// 加油站
const gasstation = {
  name: '加油站',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    RESPMTEL: 'RESPPER',
  },
  telobj: {
    RESPMTEL: 'RESPMTEL',
  },
  popHeight: 600,
  dataFilter: ['name', 'address', 'RESPPER', 'RESPMTEL', 'DISTRICTCODE'],
  labelObj: {
    name: '名称',
    address: '地址',
    RESPPER: '负责人',
    RESPMTEL: '负责人电话',
    DISTRICTCODE: '行政区划',
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
  name: '大型商贸',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    CONTACTMTEL: 'CONTACTPER',
  },
  telobj: {
    CONTACTMTEL: 'CONTACTMTEL',
  },
  popHeight: 600,
  dataFilter: ['name', 'address', 'CONTACTPER', 'CONTACTMTEL', 'DISTRICTCODE'],
  labelObj: {
    name: '名称',
    address: '地址',
    CONTACTPER: '联系人',
    CONTACTMTEL: '电话',
    DISTRICTCODE: '行政区划',
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

// 救援队伍为单独样式弹窗，走单独弹窗
// renderpopUpTemplate.ts  -->  new zhanbaoBasePop(popRender)

// 避难场所
const FilterClass: any = {
  name: '避难场所',
  unitObj: {},
  telPelope: {
    // 电话拨打后对应人名
  },
  telobj: {},
  dataFilter: [
    'name',
    'LEVELNAME',
    'address',
    'CHARGEDEPT',
  ],
  btnFilter: [
    'aroundVideoBtn', //  周边视频
  ],
  labelObj: {
    name: '名称',
    LEVELNAME: '等级',
    address: '具体地址',
    CHARGEDEPT: '责任单位',
  },
  popHeight: 430,
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
  name: '集贸市场',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {
    EXITDESC: '个',
  },
  telPelope: { // 电话拨打后对应人名
    CONTACTMTEL: 'CONTACTPER',
  },
  telobj: {
    CONTACTMTEL: 'CONTACTMTEL',
  },
  popHeight: 820,
  dataFilter: [
    'name',
    'address',
    'CONTACTPER',
    'CONTACTMTEL',
    'DEFOBJTYPECODE',
    'DISTRICTCODE',
    'BUSINESSAREA',
    'MATERIAL',
    'EXITDESC',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    CONTACTPER: '联系人',
    CONTACTMTEL: '电话',
    DEFOBJTYPECODE: '类型',
    DISTRICTCODE: '行政区划',
    BUSINESSAREA: '经营面积',
    MATERIAL: '消防设施情况',
    EXITDESC: '安全出口情况',
  },
  cb(self: any) {
    const that = self;
    if (that.data.BUSINESSAREA) {
      that.data.BUSINESSAREA = that.data.BUSINESSAREA + '平方米';
    }
    if (that.data) {
      that.data.DEFOBJTYPECODE = '农贸市场';
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
  name: '旅游景区',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
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
  popHeight: 600,
  dataFilter: [
    'name',
    'address',
    'person',
    'mobiletel',
    'LEVELCODE',
    'AREA',
    'EXITDESC',
    'DISTRICTCODE',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    person: '联系人',
    mobiletel: '电话',
    LEVELCODE: '级别',
    AREA: '占地面积',
    EXITDESC: '出入口情况',
    DISTRICTCODE: '行政区划',
  },
  cb(self: any) {

    // 解析PERSONINFO数据
    const that = self;
    if (that.data.PERSONINFO) {
      that.data.person = JSON.parse(JSON.stringify(that.data.PERSONINFO)).name;
      that.data.mobiletel = JSON.parse(
        JSON.stringify(that.data.PERSONINFO),
      ).mobiletel;
    }

    if (that.data) {
      that.data.AREA = that.data.AREA + '平方米';
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
  name: '文化场馆',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  unitObj: {},
  telPelope: { // 电话拨打后对应人名
    mobiletel: 'infoPersonName',
  },
  telobj: {
    mobiletel: 'mobiletel',
  },
  popHeight: 600,
  dataFilter: [
    'name',
    'address',
    'infoPersonName',
    'mobiletel',
    'DISTRICTCODE',
  ],
  labelObj: {
    name: '名称',
    address: '地址',
    infoPersonName: '联系人',
    mobiletel: '电话',
    DISTRICTCODE: '行政区划',
  },
  cb(self: any) {
    // 处理字段返回json问题
    if (self.data.PERSONINFO) {
      const personinfoJson = JSON.parse(self.data.PERSONINFO);
      if (personinfoJson instanceof Array) {
        let num = 0;
        personinfoJson.forEach((item: any) => {
          if (!item) {
            return;
          }
          self.data.mobiletel = item.mobiletel;
          self.data.infoPersonName = item.name;
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

const NearbyRescueTeamTypesFilter = [
  'Nearbybas_school', // 学校
  'Nearbyhospital', // 医院
  'Nearbygovernment',  // 党政机关
  'Nearbymarket', // 大型商贸
  'Nearbybazaar', // 集贸市场
  'NearbyGymnasium', // 大型文化体育场所
  'Nearbytourist', // 旅游景区
  'Nearbyculturalvenues', // 文化场馆
  'Nearbypowerfacilities', // 供电设施
  'Nearbysupwatfacil', // 供水设施
  'Nearbypowerfacil', // 大型能源动力设施
  'Nearbygasfacil', // 燃气供应设施
  'Nearbysluice', // 水闸工程
  'Nearbygasstation', // 加油站
  'Nearbyshelter',  // 避难场所
];

const NearbyRescueTeamTypesPopUpRule: any = {
  Nearbybas_school: school, // 学校
  Nearbyhospital: hospital, // 医院
  Nearbygovernment: government, // 党政机关
  Nearbymarket: market, // 大型商贸
  Nearbybazaar: pedlars,
  NearbyGymnasium: market,
  Nearbytourist: tourist,
  Nearbyculturalvenues: cultural,
  Nearbypowerfacil: powerfacilities,
  Nearbygasfacil: powerfacilities,
  Nearbysluice: sluice,
  Nearbyshelter: FilterClass,
  Nearbysupwatfacil: powerfacilities, // 生命线设施
  Nearbypowerfacilities: powerfacilities,
  Nearbygasstation: gasstation, // 加油站
};

export { NearbyRescueTeamTypesFilter, NearbyRescueTeamTypesPopUpRule };
