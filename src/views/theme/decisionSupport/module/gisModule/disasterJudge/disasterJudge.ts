// 处理统计面板单位（公里、度区）以及罗马数字
export const setUnit: any = (val: any, circleType: any) => {
  if (circleType === 0) {
    return val + 'm';
  } else if (circleType === 1) {
    let unit: any;
    switch (val) {
      case 5:
        unit = 'Ⅴ';
        break;
      case 6:
        unit = 'Ⅵ';
        break;
      case 7:
        unit = 'Ⅶ';
        break;
      case 8:
        unit = 'Ⅷ';
        break;
      case 9:
        unit = 'Ⅸ';
        break;
      case 10:
        unit = 'X';
        break;
    }
    return unit + '度区';
  }
};
export const populationSetTitle: any = (circleType: any) => {
  if (circleType === 0) {
    return 'km';
  } else if (circleType === 1) {
    return '度区';
  }
};
export const populationSetUnit: any = (val: any, circleType: any) => {
  if (circleType === 0) {
    return val;
  } else if (circleType === 1) {
    let unit: any;
    switch (val) {
      case 5:
        unit = 'Ⅴ';
        break;
      case 6:
        unit = 'Ⅵ';
        break;
      case 7:
        unit = 'Ⅶ';
        break;
      case 8:
        unit = 'Ⅷ';
        break;
      case 9:
        unit = 'Ⅸ';
        break;
      case 10:
        unit = 'X';
        break;
    }
    return unit;
  }
};
export const dataSourceConfig: any = (val: any) => {
  let rturnData: any;
  switch (val) {
    case 'House': // 房屋分布
      rturnData = {
        typeCode: 'basHousedesign',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DistrictRightDialog': // 行政区划
      rturnData = {
        typeCode: 'codeBasDistrict',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'PopulationFeverList': // 人口分布
      rturnData = {
        typeCode: 'popuFever',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisaterSchoolList': // 学校
      rturnData = {
        typeCode: 'basSchool',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterHospitalList': // 医院
      rturnData = {
        typeCode: 'basHealthorg',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterPlaneList': // 机场
      rturnData = {
        typeCode: 'basAirport',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterTrainList': // 火车站
      rturnData = {
        typeCode: 'basRailwaystation',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterCompanyList': // 危化企业
      rturnData = {
        typeCode: 'anjianDagchement',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterCoalList': // 煤矿企业
      rturnData = {
        typeCode: 'anjianCoal',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterNoCoalList': // 非煤企业
      rturnData = {
        typeCode: 'anjianTailingpond',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterRescueTeamsList': // 应急管理结构
      rturnData = {
        typeCode: 'jcHuawVdt',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterFireworksList': // 烟花爆竹
      rturnData = {
        typeCode: 'anjianFireworkent',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterMessengerList': // 灾情信息员分布
      rturnData = {
        typeCode: 'jcDisinfoper',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterNucleusList': // 核设施
      rturnData = {
        typeCode: 'basNuclearinfo',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterRescueTeamsList': // 救援队伍
      rturnData = {
        typeCode: 'jyxxTeaRescue',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterReservoirList': // 水库大坝
      rturnData = {
        typeCode: 'basDam',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'HiddenDisasterSitesList': // 地灾隐患点
          rturnData = {
              typeCode: 'basGeologichazard',
              sourceData: '',
              isShow: true,
          };
          break;
    case 'DisasterWharfList': // 码头
      rturnData = {
        typeCode: 'basPortwharf',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DispatchAdviceRightBox': // 调拨建议
      rturnData = {
        typeCode: 'jyxxTeaRescue',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterJdReserveList': // 物资储备库
      rturnData = {
        typeCode: 'jcRepertory',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'DisasterMajorDangerList': // 重大危险源
      rturnData = {
        typeCode: 'anjianDanger',
        sourceData: '',
        isShow: true,
      };
      break;
    case 'oilgasLine': // 油气管线
      rturnData = {
        typeCode: 'pufPbulicfacilL',
        sourceData: '',
        isShow: true,
      };
      break;
      case 'realTimeShip': // 船舶
      rturnData = {
        typeCode: 'realTimeShip',
        sourceData: '',
        isShow: true,
      };
      break;
  }
  return rturnData;
};

