// 所有GIS 逻辑类

import DisasterJudgeDistrictComponent from './district/DisasterJudgeDistrictComponent';
import YTDisasterJudgeDistrictComponent from './district/YTDisasterJudgeDistrictComponent';
import DisasterJudgePopComponent from './popup/DisasterJudgePopComponent';
import DisasterJudgeResourceComponent from './resoure/DisasterJudgeResourceComponent';
import DisasterJudgeShipComponent from './resoure/DisasterJudgeShipComponent';
import ResourceComponent from '../normal/resource/ResourceComponent';
import CommandDispatch from './commandDispatch/CommandDispatch';
import DisasterJudgeNewTeamComponent from './resoure/DisasterJudgeNewTeamComponent';
import DisasterJudgeNewRepertoryComponent from './resoure/DisasterJudgeNewRepertoryComponent';
import DisasterJudgeEarlyWarningComponent from './resoure/DisasterJudgeEarlyWarningComponent';
import DisasterJudgeRealTimeTeamComponent from './resoure/DisasterJudgeRealTimeTeamComponent';
import DisasterJudgeAirTeamComponent from './resoure/DisasterJudgeAirTeamComponent';
import TeamDispatchComponent from './teamDispatch/TeamDispatchComponent2';
import SimpleRouterPlanComponent from './teamDispatch/SimpleRouterPlanComponent';
import RegionSelectionComponent from './regionSelection/RegionSelectionComponent';
import GetDemComponent from './dem/GetDemComponent';
import EquipComponent from './resoure/EquipComponent';
export default {
    // 行政区划
    DisasterJudgeDistrictComponent,
    YTDisasterJudgeDistrictComponent,
    // 人口
    DisasterJudgePopComponent,
    // 资源
    DisasterJudgeResourceComponent,
    DisasterJudgeShipComponent,
    ResourceComponent,
    // 指挥调度
    CommandDispatch,
    // 力量调度
    DisasterJudgeNewTeamComponent,
    DisasterJudgeRealTimeTeamComponent, // 前突队伍
    DisasterJudgeNewRepertoryComponent, // 物资保障
    DisasterJudgeEarlyWarningComponent, // 防汛监测预警
    DisasterJudgeAirTeamComponent, // 航空护林站
    TeamDispatchComponent, // 防汛专题-力量调度
    SimpleRouterPlanComponent, // 防汛专题-力量调度-路径规划
    RegionSelectionComponent, // 综合研判_行政区划选择
    GetDemComponent, // 震中海波
    EquipComponent, // 装备
};
