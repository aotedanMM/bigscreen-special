// 火点都是这个配置
const firePointToday: any = {
  name: '火点信息',
  btnFilter: [
    //  暂时将所有周边分析隐藏 (毕东方 2021.9.11)
    // 'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边分析
    'fireCreep', // 蔓延分析
  ],
  unitObj: {
    area: '公顷',
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
    wxtp: '卫星图片',
  },
  popHeight: 720,
  cb(self: any) {
    // 处理字段返回json问题
    if (self.data.area) {
      self.data.area = self.data.area.toFixed(3);
    }
    if (self.data.observationDatetime) {
      self.data.observationDatetime = self.data.observationDatetime.slice(0, 16);
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
// 火情信息
const historyFire: any = {
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
    unit: '上报单位',
  },
  popHeight: 520,
  cb(self: any) {
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
const firePointPopUpTypesFilter = [
  'firePointToday', // 今日火点
  'historyFire',
];

const firePointTypesPopUpRule: any = {
  // 地址灾害隐患点
  firePointToday,
  historyFire,
};

export { firePointPopUpTypesFilter, firePointTypesPopUpRule };
