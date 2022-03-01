<!--
<template>
  <div class="GisMapUtil">
    &lt;!&ndash; <components :is="rightComponentName" @gisHandler="item=>$emit('gisHandler',item)"></components> &ndash;&gt;
    <components
      v-if="currentStatus != 'normal' && leftComponentName"
      :is="leftComponentName"
      @gisHandler="(item) => $emit('gisHandler', item)"
    ></components>
    &lt;!&ndash;非常态的显示上面的&ndash;&gt;
    <components
      v-for="(item, key) in compontents"
      :key="key"
      :is="item.componentName"
      v-bind="item.bind || {}"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

// 灾情研判组件 S
import DisasterHouse from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHouse/DisasterHouse.vue';
import DisasterCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCoal/DisasterCoal.vue';
import DisasterCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCompany/DisasterCompany.vue';
import DisasterPlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterPlane/DisasterPlane.vue';
import DisasterReservoir from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterReservoir/DisasterReservoir.vue';
import DisasterSchool from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterSchool/DisasterSchool.vue';
import DisasterShip from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterShip/DisasterShip.vue';
import DisasterTrain from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterTrain/DisasterTrain.vue';
import DisasterWharf from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterWharf/DisasterWharf.vue';
import DisasterFireworks from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterFireworks/DisasterFireworks.vue';
import DisasterGeology from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterGeology/DisasterGeology.vue';
import DisasterHospital from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHospital/DisasterHospital.vue';
import DisasterIndustry from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterIndustry/DisasterIndustry.vue';
import DisasterMessenger from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMessenger/DisasterMessenger.vue';
import DisasterNoCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNoCoal/DisasterNoCoal.vue';
import DisasterNucleus from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNucleus/DisasterNucleus.vue';
import DisasterPredictionBox from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/DisasterPredictionBox/DisasterPredictionBox.vue';
import DisasterRescueTeams from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterRescueTeams.vue';
import DisasterEmergencypart from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterEmergencypart/DisasterEmergencypart.vue';
import PopulationFeverBox from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PopulationFeverBox/PopulationFeverBox.vue';
// 行政规划左侧列表
import DistrictLeftDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterDistrict/districtStatistics.vue';
// 行政规划右侧列表
import DistrictRightDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterDistrict/districtList.vue';
import CrowdedPlace from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/earthQuakeAll/crowdedPlace.vue'; // 人员
import GeneralCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/earthQuakeAll/generalCompany.vue'; // 企业
import MajarCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/earthQuakeAll/majarCompany.vue'; // 重要设施
// 灾情研判组件 E
// 资源查询组件 S
import GisMapResoucePopup from '@/views/theme/decisionSupport/gisUI/gisMapResoucePopup.vue';
// import GisMapResource from '@/views/theme/decisionSupport/gisUI/GIsMapResource.vue';
// 资源查询组件 E
// 灾损统计
import CasualtiesGIS from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/casualties/CasualtiesGIS.vue';
import HousesDamagedGis from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/housesDamaged/HousesDamagedGis.vue';
import ElectricDamagedGis from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/electricDamaged/ElectricDamagedGis.vue';
import MissingFlight from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/missingFlightNew/MissingFlight.vue';
// 其它工具 S
import GreenRoadGis from '@/views/theme/decisionSupport/module/gisModule/otherTool/greenRoad/greenRoadGis.vue';
import RoadDamageGis from '@/views/theme/decisionSupport/module/gisModule/otherTool/roadDamage/roadDamageGis.vue';
import TraffivControlGis from '@/views/theme/decisionSupport/module/gisModule/otherTool/trafficControl/traffivControlGis.vue';
// 其它工具 E

/** 救援救助 S */
import Deployment from '@/views/theme/decisionSupport/module/gisModule/rescueAid/deployment/Deployment.vue';
import RescueDemand from '@/views/theme/decisionSupport/module/gisModule/rescueAid/rescueDemand/RescueDemand.vue';
// 调拨建议
import DispatchAdvice from '@/views/theme/decisionSupport/module/gisModule/rescueAid/dispatchAdvice/DispatchAdvice.vue';
/** 救援救助 E */

/** 安置点 S */
import Shleter from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/Shleter.vue';
import ShleterLeft from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/ShleterLeft.vue';
/** 安置点 E */
@Component({
  name: 'GisMapPopList',
  components: {
    GreenRoadGis,
    RoadDamageGis,
    TraffivControlGis,
    DistrictLeftDialog, // 左侧 行政规划列表 灾情研判
    DistrictRightDialog, // 右侧 行政规划列表 灾情研判
    // GisMapResource,
    GisMapResoucePopup,
    DisasterHouse, // 住宅区分布左侧列表
    DisasterCoal, // 煤矿企业分布左侧列表 灾情研判
    DisasterCompany, // 危化企业分布左侧列表 灾情研判
    DisasterPlane, // 机场分布左侧列表 灾情研判
    DisasterReservoir, // 水库大坝分布左侧列表 灾情研判
    DisasterSchool, // 学校左侧 灾情研判
    DisasterShip, // 船舶分布 左侧 灾情研判
    DisasterTrain, // 火车站分布 左侧 灾情研判
    DisasterWharf, // 码头分布 左侧 灾情研判
    DisasterFireworks, // 烟花爆竹分布 左侧 灾情研判
    DisasterGeology, // 地质灾害隐患点分布 左侧
    DisasterHospital, // 医院分布 左侧 灾情研判
    DisasterIndustry, // 工贸企业分布 左侧 灾情研判
    DisasterMessenger, // 灾情信息员分布 左侧 灾情研判
    DisasterNoCoal, // 非煤企业分布 左侧 灾情研判
    DisasterNucleus, // 核设施分布 左侧 灾情研判
    DisasterPredictionBox, // 灾情评估分布 左侧 灾情研判
    DisasterRescueTeams, // 力量调度分布 左侧 灾情研判
    DisasterEmergencypart, // 应急管理机构分布 左侧 灾情研判
    PopulationFeverBox, // 左侧 人口分布列表 灾情研判
    CasualtiesGIS, // 灾损统计 人员伤亡 左侧
    HousesDamagedGis, // 灾损统计 房屋损毁 左侧
    ElectricDamagedGis, // 灾损统计 电力损毁 左侧
    MissingFlight, // 灾损统计 失联区域 左侧
    Deployment, // 救援救助 调度部署 左侧
    RescueDemand, // 救援救助 救援需求 左侧
    Shleter, // 救援救助 安置点 左侧
    ShleterLeft, // 救援救助 安置点 左侧
    DispatchAdvice, // 救援救助 调拨建议 左侧
    CrowdedPlace, // 灾情研判 人员密集场所 左侧
    GeneralCompany, // 灾情研判 企业 左侧
    MajarCompany, // 灾情研判 重要设施 左侧
  },
})
export default class GisMapUtil extends Vue {
  // 当前页面的状态
  @Prop({
    default: '',
  })
  public currentStatus?: string;

  @Prop({
    default: () => [],
  })
  public compontents?: any[];

  // 左边组件的名字
  // @Prop({
  //   default: '',
  // })
  // public rightComponentName?: string;

  // 右边组件的名字
  @Prop({
    default: '',
  })
  public leftComponentName?: string;
}
</script>
-->
