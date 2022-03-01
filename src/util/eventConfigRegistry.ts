import { staticDataRequestServer } from '@/api/installServer';
import $ from 'jquery';
const publicPath = require('../config/index').jsonPath;
// 该文件是注册所有事件入口，可以查看所有事件关联和《文件名》，
// 这个其实还没想好到底使用数组还是对象，因为专题一般会有顺序的展示，所以先暂时留了一个sort字段
const SpecialTopic: any = {
  common: {
    label: '所有事件',
    value: 'common',
    sort: 1,
    icon: 'dzzh',
    jsonPath: 'default',
    specialLabel: '所有事件',
    typecode: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '24',
      '9',
      '10',
      '11',
      '12',
      '13',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '25',
      '26',
      '27',
      '28',
    ],
  },
  earthQuake: {
    label: '地震专题',
    value: 'earthQuake',
    sort: 2,
    icon: 'dzzh',
    jsonPath: 'earthQuakeDefault',
    specialLabel: '地震接报',
    typecode: ['1'],
  },
  forestFire: {
    value: 'forestFire',
    label: '森火专题',
    sort: 3,
    icon: 'shzt',
    jsonPath: 'forestFireDefaultYantai',
    specialLabel: '森火接报',
    typecode: ['9', '11'],
  },
  // dangerousChemicalTradeAccident: {
  //   value: 'dangerousChemicalTradeAccident',
  //   label: '安全生产专题',
  //   sort: 4,
  //   icon: 'whzt',
  //   jsonPath: 'default',
  //   specialLabel: '安全生产接报',
  //   typecode: ['2', '4', '5'],
  // },
  flood: {
    value: 'flood',
    label: '防汛专题',
    sort: 5,
    icon: 'fxzt',
    // 防汛的常态
    jsonPath: 'floodDefault',
    specialLabel: '洪涝接报',
    typecode: ['3', '24', '10', '16', '17', '18', '19', '20', '21', '25', '26', '27', '28'],
  },
  other: {
    value: 'other',
    label: '其它灾害',
    sort: 6,
    icon: 'fxzt',
    jsonPath: 'otherDefault',
    specialLabel: '其它事件',
    typecode: ['0', '6', '7', '12', '13', '2', '4', '5'],
  },
};

const EventDictMap: any = {
  1: {
    name: '地震',
    key: 'earthQuake',
    speciaTopicKey: 'earthQuake',
  },
  2: {
    name: '煤矿', // 属于安全生产专题
    key: 'other',
    speciaTopicKey: 'other',
  },
  // 3: {
  //     name: '地质灾害', // 属于防汛专题
  //     key: 'dizhizaihai',
  //     speciaTopicKey: 'flood',
  // },
  4: {
    name: '非煤矿山', // 属于安全生产事故
    key: 'other',
    speciaTopicKey: 'other',
  },
  5: {
    name: '危险品和工贸', // 属于安全生产事故
    key: 'other',
    speciaTopicKey: 'other',
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

// const DictMap: any = {
//   10000: 'default', // 常态默认,这个是后台没有的，是前端给常态自己配置的。
//   1: 'earthQuake', // 地震
//   2: 'colliery', // 煤矿,属于安全生产事故
//   4: 'noncoalMine', // 非煤矿山,属于安全生产事故
//   5: 'dangerousChemicalTradeAccident', // 危险品和工贸,属于安全生产事故
//   // 6: 'fire', // 火灾
//   8: 'flood', // 洪涝
//   9: 'forestFire', // 森林火灾
//   10: 'typhoon' , // 台风
//   0: 'common', // 其他
// };
const DictMap: any = {};
Object.keys(EventDictMap).forEach((item: any, index: number) => {
  DictMap[item] = EventDictMap[item].key;
});

const configJson: any = {
  jsonValue: '',
};

// const defaultGeometryStr = '{"type":"Polygon","coordinates":[[[0,0],[0,90],[180,90],[180,0],[0,0]]]}';

Object.defineProperty(configJson, 'jsonValue', {
  set(data: any) {
    this.value = data;
  },
});

function getJsonCallback(jsonName: string) {
  $.ajax({
    url: publicPath + 'json/eventConfigJson/' + jsonName + '.json',
    async: false,
    success(data: any) {
      configJson.jsonValue = data;
    },
  });
}

interface EventConfigRegistry {
  config: any; // 直接获取读到的json配置文件的值
  setConfig: any; // 根据事件类型读取json文件
  setTopicConfig: any; // 根据专题类型读取json文件
  getEventDictMap: any; // 获得根据灾种24获得在本文件的事件的配置。例如EventDictMap.24中的key的值
  getEventNum: any;
  getTopicByEventType: any; // 根据事件类型的数字24，返回所属专题的对象。例如：SpecialTopic.flood的值
  getEventByEventType: any; // 获得根据灾种24获得在本文件的事件的配置。例如EventDictMap.24的值
  getTopicByTopicKey: any; // 根据专题的关键字flood，返回所属专题的对象。例如：SpecialTopic.flood的值
  // getDefaultGeometryStr: any;
}

class EventConfigRegistry {
  constructor() {
    this.config = null;
  }
}

// 进行灾种的配置文件读取与设置
EventConfigRegistry.prototype.setConfig = function(eventType: string | number) {
  const jsonName = (EventDictMap[+eventType] || EventDictMap[0]).key;
  getJsonCallback(jsonName);
  this.config = configJson.value;
};

// 进行专题首页的配置文件读取与设置
EventConfigRegistry.prototype.setTopicConfig = function(topicKey: string) {
  const jsonName = SpecialTopic[topicKey].jsonPath;
  getJsonCallback(jsonName);
  this.config = configJson.value;
};

// 返回英文
EventConfigRegistry.prototype.getEventDictMap = function(
  eventType: string | number,
) {
  return DictMap[String(eventType)] || DictMap[String(0)];
};
// 返回数字
EventConfigRegistry.prototype.getEventNum = function(val: string | number) {
  for (const key in DictMap) {
    if (DictMap[key] === val) {
      return key;
    }
  }
};

// 根据事件类型的数字，返回所属专题的对象
EventConfigRegistry.prototype.getTopicByEventType = function(
  val: string | number,
) {
  const topicKey = (EventDictMap[val] || EventDictMap[0]).speciaTopicKey;
  return SpecialTopic[topicKey];
};

// 根据事件类型的数字，返回所属事件的信息
EventConfigRegistry.prototype.getEventByEventType = function(
  val: string | number,
) {
  return EventDictMap[val] || EventDictMap[0];
};

// 根据专题的关键字，返回所属专题的对象
EventConfigRegistry.prototype.getTopicByTopicKey = function(val?: string) {
  return val && SpecialTopic[val];
};

// 获取到默认的geometry串
// EventConfigRegistry.prototype.getDefaultGeometryStr = function() {
//   return defaultGeometryStr;
// };

const eventConfigRegistry = new EventConfigRegistry();

export default eventConfigRegistry as any;
