// 推送位置配置

export const  pushPositionConfig: any = {
  crowdedPlace: 'zqypyc-rymjcs', // 灾情研判右侧-人员密集场所
  knownDisasterSituation: ['CASUALTIES', 'HOUSESH', 'RESCERTRANSFER', 'SIZEUP'],  // 非常态左侧-实时灾情(1.死亡、受伤 2.房屋受损 3.救出、转移 4.预估人/万间)
  teamAssignment: ['SEND_FIELDTEAM', 'SEND_HURRYTEAM'], // 队伍调派(1.现场队伍 2.赶赴队伍、待命队伍)
  materialAllocation: 'EQUIPMENT_DISPATCH', // 物资调拨
  progress: 'SEND_PROGRESS', // 进展情况、领导批示
  localGovernment: 'SEND_PERSON_INFO', // 当地政府
  CASUALTIES: 'CASUALTIES', // 右侧-灾损统计 人员伤亡
  HOUSESH: 'HOUSESH', // 右侧-灾损统计 房屋损毁
  teamNeed: ['SEND_FIELDTEAM', 'SEND_RESCUEDEMAND'], // 右侧-救援救助 队伍需求（1.现场队伍人数 2.需要队伍人数）
  keyMaterialDemand: 'GOODS_DISPATCH', // 右侧-救援救助 重点物资需求
  SEND_PERSONNELPLACEMENT: 'SEND_PERSONNELPLACEMENT', // 右侧-救援救助 人员安置
};
