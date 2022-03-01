// 火点都是这个配置
const event: any = {
  name: '次生衍生事件信息',
  unitObj: {},
  telobj: {},
  btnFilter: [
    'aroundAnalysisBtn', // 周边分析
    'aroundVideoBtn', // 周边视频
  ],
  dataFilter: [
    'place',
    'eventTime',
    'eventType',
    'longitude',
    'latitude',
    'eventDesc',
  ],
  labelObj: {
    place: '地址',
    eventtime: '事发时间',
    eventtype: '事发类型',
    longitude: '经度',
    latitude: '纬度',
    eventdesc: '事件描述',
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

// 匹配拦截类型
const derivePopUpTypesFilter = [
  'event',
];

const deriveTypesPopUpRule: any = {
  event,
};

export { derivePopUpTypesFilter, deriveTypesPopUpRule };
