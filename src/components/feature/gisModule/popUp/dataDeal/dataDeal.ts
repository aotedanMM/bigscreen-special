/**
 *
 **/
// import { messsageBus } from '@/util/message';
import { majorDanger } from './majorDanger';
import { County } from './County';
import { Town } from './Town';
import { school } from './school';
import { School01 } from './School※01';
import { hospital } from './hospital';
import { metalnonmetal } from './metalnonmetal';
import { Hospital01 } from './Hospital※01';
import { Airport01 } from './Airport※01';
import { Resrrvoir01 } from './Resrrvoir※01';
import { ANJIAN_FIREWORKENT01 } from './ANJIAN_FIREWORKENT※01';
import { emergencypart01 } from './emergencypart※01';
import { ANJIAN_DAGCHEMENT01 } from './ANJIAN_DAGCHEMENT※01';
import { ANJIAN_ENT_WHSMYHBZ01 } from './ANJIAN_ENT_WHSMYHBZ※01';
import { BAS_COALMINE01 } from './BAS_COALMINE※01';
import { Station01 } from './Station※01';
import { nuclear } from './nuclear';
import { nuclear01 } from './Nuclearinfo※01';
import { explosive } from './explosive';
import { coalMine } from './coalMine';
import { hazardous } from './hazardous';
import { railwaystation } from './railwaystation';
import { portwharf } from './portwharf';
import { Portwharf01 } from './Portwharf※01';
import { mine } from './mine';
import { reservoir } from './reservoir';
import { emergencypart } from './emergencypart';
import { disinfoper } from './disinfoper';
import { NearbyDisinfoper } from './NearbyDisasterPer※01';
import { development } from './development';
import { industry } from './industry';
import { airport } from './airport';
import { Expert } from './Expert※01';
import { DangerousChemical } from './ANJIAN_DAGCHEMENT※DangerousChemical';
import { RescueTeam } from './RescueTeam※03';
import { NearbyRescueTeam } from './NearbyRescueTeam※03';
import { ANJIAN_REPERTORY } from './ANJIAN_REPERTORY※01';
import { localWeather } from './localWeather';
import { disaster_sta_feature_type } from './disaster_sta_feature_type';
import { disaster_sta_point_type } from './disaster_sta_point_type';
import { Casualties_type } from './Casualties_type';
import { Hous_damage_type } from './Hous_damage_type';
import { Lost_zone_type } from './Lost_zone_type';
import { Power_damage_type } from './Power_damage_type';
import { trafficStatus } from './traffic-status';
import { Shelter01 } from './Shelter※01';
import { JC_WARBASE01 } from './JC_WARBASE※01';
// import { equipment } from './v_equipment';
import { fireCar } from './fireCar';
import { dispatchAdvice } from './dispatchAdvice';
import { repository } from './repository';
import { jdRepository } from './jdRepository';
import { ANJIAN_METALNONMETAL01 } from './ANJIAN_METALNONMETAL※01';
import { ANJIAN_OILGASFIELD01 } from './ANJIAN_OILGASFIELD※01';
import { ANJIAN_OILGASFIELD02 } from './ANJIAN_OILGASFIELD※02';
import { hiddendisastersites } from './hiddendisastersites';
import { hazardousTypesPopUpRule } from './hazardousTypesFilter';
import { firePointTypesPopUpRule } from './firePointFilter';
import { deriveTypesPopUpRule } from './deriveFilter';
import { emResourceTypesPopUpRule } from './emResourceTypesFilter';
import { NearbyRescueTeamTypesPopUpRule } from './NearbyRescueTeamTypesFilter';  // 周边分析对应弹窗规则
import { materialTypesPopUpRule } from './materialReserveTypeFilter';
import { defenseObjectTypesPopUpRule } from './defenseObjectTypesFilter';
import {countyCount} from './countyCount';
import {townCount} from './townCount';
import {cunCount} from './cunCount';
/* const  school: any = {// 学校
    name: '暂无标题',
    unitObj: {
        distance: '公里',
        eClass: 'M',
        eDeep: 'Km',
    },
    dataFilter: [
        'NAME',
        'DESC',
        'TEL',
        'DISTRICT',
        'address',
    ],
    labelObj: {
        NAME: '名称',
        DESC: '描述',
        TEL: '电话',
        DISTRICT: '行政区划',
        address: '地址',
      },
      cb(self: any) {
        const that = self;
        if (that.data && that.data.attributeSet && that.data.attributeSet.attributes) {
            that.dataAttributes = that.data.attributeSet.attributes;
            that.getData();
        }
      },
};

const hospital: any = {// 学校
  name: '暂无标题',
  unitObj: {
      distance: '公里',
      eClass: 'M',
      eDeep: 'Km',
  },
  dataFilter: [
      'NAME',
      'DESC',
      'TEL',
      'DISTRICT',
      'address',
  ],
  labelObj: {
      NAME: '名称',
      DESC: '描述',
      TEL: '电话',
      DISTRICT: '行政区划',
      address: '地址',
    },
    cb(self: any) {
      const that = self;
      if (that.data && that.data.attributeSet && that.data.attributeSet.attributes) {
          that.dataAttributes = that.data.attributeSet.attributes;
          that.getData();
      }
    },

}; */

let dataDeal: any = {
  majorDanger,
  County,
  repository,
  jdRepository,
  Town,
  school,
  hospital,
  metalnonmetal,
  nuclear,
  emergencypart,
  disinfoper,
  explosive,
  coalMine,
  hazardous,
  railwaystation,
  portwharf,
  mine,
  reservoir,
  hiddendisastersites,
  development,
  industry,
  airport,
  Casualties_type,
  Hous_damage_type,
  Lost_zone_type,
  Power_damage_type,
  disaster_sta_feature_type,
  disaster_sta_point_type,
  dispatchAdvice,
  'NearbyDisasterPer※01': NearbyDisinfoper['NearbyDisasterPer※01'], // 周边分析弹窗
  'traffic-status': trafficStatus['traffic-status'],
  'Expert※01': Expert['Expert※01'],
  'School※01': School01['School※01'],
  'Hospital※01': Hospital01['Hospital※01'],
  'Airport※01': Airport01['Airport※01'],
  'Station※01': Station01['Station※01'],
  'emergencypart※01': emergencypart01['emergencypart※01'],
  'Resrrvoir※01': Resrrvoir01['Resrrvoir※01'],
  'ANJIAN_FIREWORKENT※01': ANJIAN_FIREWORKENT01['ANJIAN_FIREWORKENT※01'],
  'ANJIAN_FIREWORKENT※1': ANJIAN_FIREWORKENT01['ANJIAN_FIREWORKENT※01'],
  'ANJIAN_DAGCHEMENT※01': ANJIAN_DAGCHEMENT01['ANJIAN_DAGCHEMENT※01'],
  'ANJIAN_ENT_WHSMYHBZ※01': ANJIAN_ENT_WHSMYHBZ01['ANJIAN_ENT_WHSMYHBZ※01'],
  'BAS_COALMINE※01': BAS_COALMINE01['BAS_COALMINE※01'],
  'ANJIAN_DAGCHEMENT※DangerousChemical':
    DangerousChemical['ANJIAN_DAGCHEMENT※DangerousChemical'],
  //   'RescueTeam※03': RescueTeam['RescueTeam※03'],
  'NearbyRescueTeam※03': NearbyRescueTeam['NearbyRescueTeam※03'], // 周边分析的弹窗
  'ANJIAN_REPERTORY※01': ANJIAN_REPERTORY['ANJIAN_REPERTORY※01'],
  localWeather,
  'Shelter※01': Shelter01['Shelter※01'],
  'JC_WARBASE※01': JC_WARBASE01['JC_WARBASE※01'],
  // 'equipment': equipment['equipment※01'],
  fireCar,
  // 'Portwharf※01': Portwharf01['Portwharf※01'],
  'Nuclearinfo※01': nuclear01['Nuclearinfo※01'],
  'ANJIAN_METALNONMETAL※01': ANJIAN_METALNONMETAL01['ANJIAN_METALNONMETAL※01'],
  'ANJIAN_OILGASFIELD※01': ANJIAN_OILGASFIELD01['ANJIAN_OILGASFIELD※01'],
  'ANJIAN_OILGASFIELD※02': ANJIAN_OILGASFIELD02['ANJIAN_OILGASFIELD※02'],
  countyCount, // 行政区划的数据配置
  townCount, // 乡镇
  cunCount, // 村庄
};

dataDeal = Object.assign(dataDeal, hazardousTypesPopUpRule);  // 风险隐患
dataDeal = Object.assign(dataDeal, firePointTypesPopUpRule);  // 火点信息
dataDeal = Object.assign(dataDeal, deriveTypesPopUpRule);  // 此生衍生
dataDeal = Object.assign(dataDeal, emResourceTypesPopUpRule);  // 应急资源
dataDeal = Object.assign(dataDeal, materialTypesPopUpRule); // 物资装备
dataDeal = Object.assign(dataDeal, defenseObjectTypesPopUpRule);  // 防护目标
dataDeal = Object.assign(dataDeal, NearbyRescueTeamTypesPopUpRule);  // 周边分析对应弹窗规则
export { dataDeal };
