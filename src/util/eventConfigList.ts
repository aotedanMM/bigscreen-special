const EventConfigList: any = {
  1: {
    name: '地震',
    key: 'earthQuake',
    speciaTopicKey: 'earthQuake',
  },
  2: {
    name: '煤矿', // 属于安全生产专题
    key: 'colliery',
    speciaTopicKey: 'dangerousChemicalTradeAccident',
  },
  // 3: {
  //     name: '地质灾害', // 属于防汛专题
  //     key: 'dizhizaihai',
  //     speciaTopicKey: 'flood',
  // },
  4: {
    name: '非煤矿山', // 属于安全生产事故
    key: 'noncoalMine',
    speciaTopicKey: 'dangerousChemicalTradeAccident',
  },
  5: {
    name: '危险品和工贸', // 属于安全生产事故
    key: 'dangerousChemicalTradeAccident',
    speciaTopicKey: 'dangerousChemicalTradeAccident',
  },
  24: {
    name: '洪涝', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'flood',
    speciaTopicKey: 'flood',
  },
  9: {
    name: '森林火灾', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'forestFire',
    speciaTopicKey: 'forestFire',
  },
  10: {
    name: '台风', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'typhoon',
    speciaTopicKey: 'flood',
  },
  11: {
    name: '草原火灾', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'caoyuanhuozai',
    speciaTopicKey: 'forestFire',
  },
  16: {
    name: '暴雨事件', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'rainstorm',
    speciaTopicKey: 'flood',
  },
  17: {
    name: '泥石流事件', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'nishiliu',
    speciaTopicKey: 'flood',
  },
  18: {
    name: '滑坡事件', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'huapo',
    speciaTopicKey: 'flood',
  },
  // 19: {
  //     name: '堰塞湖事件', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
  //     key: 'yansehu',
  //     speciaTopicKey: 'flood',
  // },
  20: {
    name: '水库溃坝', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'shuikukuiba',
    speciaTopicKey: 'flood',
  },
  21: {
    name: '内涝', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'neilao',
    speciaTopicKey: 'flood',
  },
  25: {
    name: '水库重大险情', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'shuikuzhongda',
    speciaTopicKey: 'flood',
  },
  26: {
    name: '堤防重大险情', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'difangzhongda',
    speciaTopicKey: 'flood',
  },
  27: {
    name: '凌汛', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'lingxun',
    speciaTopicKey: 'flood',
  },
  28: {
    name: '山洪', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'shanhong',
    speciaTopicKey: 'flood',
  },
  0: {
    name: '其它', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'other',
    speciaTopicKey: 'other',
  },
  10000: {
    name: '常态默认', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
    key: 'default',
    speciaTopicKey: 'common',
  },
};

export { EventConfigList };
