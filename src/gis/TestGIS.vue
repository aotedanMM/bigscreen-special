<template>
	<!--GIS 逻辑组件测试入口--->
	<div class='todolistyouknow'>
		<!---服务测试--->
		<!-- <ServiceTest></ServiceTest> -->
		<!--三维地图-->
		<!-- <Map3dTest></Map3dTest> -->
		<!-- 地图服务接入 -->
		<!-- <MapserviceInComponentTest></MapserviceInComponentTest> -->
		<!---地图打印--->
		<!-- <MapPrintComponentTest></MapPrintComponentTest> -->
		<!--灾情研判行政区划-->
		<!-- <DisasterJudgeDistrictComponentTest></DisasterJudgeDistrictComponentTest> -->
		<!--灾情研判资源-->
		<!-- <DisasterJudgeResourceComponentTest></DisasterJudgeResourceComponentTest> -->
		<!--救援力量-->
		<!-- <RescueTeamInforComponentTest></RescueTeamInforComponentTest> -->
		<!--灾情研判人口-->
		<!-- <DisasterJudgePopComponentTest></DisasterJudgePopComponentTest> -->
		<!--地震影响圈-->
		<!-- <InfluenceComponentTest></InfluenceComponentTest> -->
		<!--定位-->
		<!-- <LocateComponentTest></LocateComponentTest> -->
		<!--当地天气-->
		<!-- <WeatherTest></WeatherTest> -->
		<!--灾情统计--->
		<!-- <DisasterStaComponentTest></DisasterStaComponentTest> -->
		<!--道路情况：道路损毁、绿色通道、交通管制-->
		<!-- <TrafficStatusCmponentTest></TrafficStatusCmponentTest> -->
		<!---风险隐患--->
		<!-- <RiskTroubleCmponentTest></RiskTroubleCmponentTest> -->
		<!----人口热力-->
		<!-- <PopHeatCompnentTest></PopHeatCompnentTest> -->
		<!----周边查询--->
		<!-- <NearQueryComponentTest></NearQueryComponentTest> -->
		<!---余震-->
		<!-- <AfterShockComponentTest></AfterShockComponentTest> -->
		<!---指挥调度--->
		<!-- <CommandDispatchTest></CommandDispatchTest> -->
		<!----最新影像---->
		<!-- <LatestImageCompoentTest></LatestImageCompoentTest> -->
		<!-----一键搜------->
		<!---搜索---->
		<!-- <SearchComponentTest></SearchComponentTest> -->
		<!--搜索-资源-->
		<!-- <QueryResourceComponentTest></QueryResourceComponentTest> -->
		<!----实时车辆-->
		<!-- <FireCarHistoryCmponentTest></FireCarHistoryCmponentTest> -->
		<!---历史轨迹---->
		<!-- <HistoryTrackComponentTest></HistoryTrackComponentTest> -->
		<!--路径规划-->
		<!-- <RouterPlanComponentTest></RouterPlanComponentTest> -->
		<!-----简单路径规划--->
		<!-- <SimpleRouterPlanComponentTest></SimpleRouterPlanComponentTest> -->
		<!----房屋分布房屋结构--->
		<!-- <QueryHouseComponentTest></QueryHouseComponentTest> -->
		<!--救援需求--->
		<!-- <RescueNeedComponentTest></RescueNeedComponentTest> -->
		<!--调度态势--->
		<!-- <RescueSituationComponentTest></RescueSituationComponentTest> -->
		<!--调度部署---->
		<!-- <TeamDispatchComponentTest></TeamDispatchComponentTest> -->
		<!---调拨建议--->
		<!-- <TeamDispatchAdviceComponentTest></TeamDispatchAdviceComponentTest> -->
		<!---人员安置-->
		<!-- <PeopleArrangementComponentTest></PeopleArrangementComponentTest> -->
		<!---物资需求-->
		<!-- <MaterialNeedComponentTest></MaterialNeedComponentTest> -->
		<!----物资调派--->
		<!-- <MaterialDispatchComponentTest></MaterialDispatchComponentTest> -->
		<!--常态资源-->
		<!-- <ResourceComponentTest></ResourceComponentTest> -->
		<!--降水预报-->
		<!-- <RainForecastComponentTest></RainForecastComponentTest> -->
		<!--卫星云图-->
		<!-- <SatilliteCloudComponentTest></SatilliteCloudComponentTest> -->
		<!---实时路径-->
		<!-- <RealtimeTrackComponentTest></RealtimeTrackComponentTest> -->
		<!-- 区域选择 -->
		<!-- <RegionSelection style="z-index:999; left:400px"
      v-if="$store.state.mapModule.showRegionPanel" 
      :option="regionSelectionOption" 
      @change="onRegionSelectionChange" @close="onRegionSelectionClose">
    </RegionSelection> -->
		<!-- 周边查询 -->
		<!-- <NearByQuery style="z-index:999"
      v-if ="$store.state.mapTools.nearbyQueryVisible &&!$store.state.gisMenuSearch.showResultPanel" 
      @change="onNearbyChange" @close="onNearbyClose">
    </NearByQuery> -->
		<!-- 图层管理 -->
		<!-- <LayerManagerComponentTest></LayerManagerComponentTest> -->

		<!-- 风情雨情水情工情 -->
		<!-- <WindWaterRainWorkTest></WindWaterRainWorkTest> -->
		<!-- 视频监控点 -->
		<!-- <videoLayerTest></videoLayerTest> -->
		<!-- <nearbyvideoLayerTest></nearbyvideoLayerTest> -->
		<!-- <ResourceQueryTest></ResourceQueryTest> -->
		<!-- 人口转移安置船舶归港 -->
		<!-- <PopulationShipTest></PopulationShipTest> -->
		<!--灾情统计-->
		<!-- <disasterSatistics></disasterSatistics> -->
		<!-- <FloodModelTest></FloodModelTest> -->
		<!-- <weaterWarningTest></weaterWarningTest> -->
	</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
// GIS模块
// 灾情研判行政区划
import DisasterJudgeDistrictComponentTest from './disasterJudge/district/DisasterJudgeDistrictComponentTest.vue';
import EventWarnInforComponentTest from './normal/eventwarninfor/EventWarnInforComponentTest.vue';
import ResourceComponentTest from './normal/resource/ResourceComponnetTest.vue';
import RescueTeamInforComponentTest from './rescueHelp/rescueTeam/RescueTeamInforComponentTest.vue';
import DisasterJudgeResourceComponentTest from './disasterJudge/resoure/DisasterJudgeResourceComponentTest.vue';
import DisasterJudgePopComponentTest from './disasterJudge/popup/DisasterJudgePopComponentTest.vue';
import InfluenceComponentTest from './common/event/influence/InfluenceComponentTest.vue';
import Map3dTest from './common/map3d/Map3DTest.vue';
import LocateComponentTest from './common/event/locate/LocateComponentTest.vue';
import WeatherTest from './common/weather/WeatherTest.vue';
import DisasterStaComponentTest from './disasterSta/sta/DisasterStaComponentTest.vue';
import TrafficStatusCmponentTest from './common/traffic/TrafficStatusCmponentTest.vue';
import RouterPlanComponentTest from './common/routeplan/RouterPlanComponentTest.vue';
import SimpleRouterPlanComponentTest from './common/routeplan/SimpleRouterPlanComponentTest.vue';
import SearchComponentTest from './common/query/search/SearchComponentTest.vue';
import QueryResourceComponentTest from './common/query/resources/QueryResourceComponentTest.vue';
import RiskTroubleCmponentTest from './disasterJudge/riskTrouble/RiskTroubleCmponentTest.vue';
import PopHeatCompnentTest from './common/popheat/PopHeatCompnentTest.vue';
import AfterShockComponentTest from './common/afterShock/AfterShockComponentTEST.vue';
import FireCarHistoryCmponentTest from './common/query/resources/FireCarHistory/FireCarHistoryCmponentTest.vue';
import CommandDispatchTest from './disasterJudge/commandDispatch/CommandDispatchTest.vue';
import HistoryTrackComponentTest from './common/histroyTrack/HistoryTrackComponentTest.vue';
import LatestImageCompoentTest from './common/latestimage/LatestImageCompoentTest.vue';
import QueryHouseComponentTest from './common/query/resources/QueryHouseComponentTest.vue';
import RescueNeedComponentTest from './rescueHelp/rescueNeed/RescueNeedComponentTest.vue';
import TeamDispatchComponentTest from './rescueHelp/teamDispatch/TeamDispatchComponentTest.vue';
import RescueSituationComponentTest from './rescueHelp/rescueSituation/RescueSituationComponentTest.vue';
import TeamDispatchAdviceComponentTest from './rescueHelp/teamDispatchAdvice/TeamDispatchAdviceComponentTest.vue';
import PeopleArrangementComponentTest from './rescueHelp/peopleArrangement/PeopleArrangementComponentTest.vue';
import MaterialNeedComponentTest from './rescueHelp/materialNeed/MaterialNeedComponentTest.vue';
import MaterialDispatchComponentTest from './rescueHelp/materialDispatch/MaterialDispatchComponentTest.vue';
import NearQueryComponentTest from './common/nearby/NearQueryComponentTest.vue';
import MapPrintComponentTest from './common/mapPrint/MapPrintComponentTest.vue';
import RainForecastComponentTest from './common/rainForecast/RainForecastComponentTest.vue';
import SatilliteCloudComponentTest from './common/satilliteCloud/SatilliteCloudComponentTest.vue';
import ServiceTest from './service/ServiceTest.vue';
import LayerManagerComponentTest from './common/layermanager/LayerManagerComponentTest.vue';
import MapserviceInComponentTest from './common/mapserviceIn/MapserviceInComponentTest.vue';
import RealtimeTrackComponentTest from './common/realtimeTrack/RealtimeTrackComponentTest.vue';
import WindWaterRainWorkTest from './monitorWarning/windWaterRainWork/WindWaterRainWorkTest.vue'; // 风雨水工情
import videoLayerTest from './monitorWarning/videoLayer/videoLayerTest.vue'; // 视频监控点
import ResourceQueryTest from './defensivePreparation/defensiveResourceQuery/ResourceQueryTest.vue'; // 风雨水工情
import PopulationShipTest from './defensivePreparation/populationShip/PopulationShipTest.vue'; // 风雨水工情
import FloodModelTest from './model/floodModel/FloodModelTest.vue'; // 风雨水工情
import weaterWarningTest from './monitorWarning/weatherWarning/weaterWarning.vue'; // 风雨水工情
// import ResourceQueryHandler from '@/components/feature/GIS/GisMenuSearch/Handler';
// import RegionSelection from '@/components/feature/GIS/RegionSelection/RegionSelection.vue';
// import NearByQuery from '@/components/feature/GIS/NearbyQuery/NearbyQuery.vue';
// import { locationServer, regionSelectionServer } from '@/api/installServer';
import disasterSatistics from './disasterStatistics/disasterSatistics/disasterSatisticsComponentsTest.vue'; // 灾情统计
import {monitorWarningServer, windSituationServer, waterSituationServer, engineeringSituationServer} from '@/api/feature/monitorwarning/installServer';
import {districtServer} from '@/api/installServer';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
@Component({
  name: 'TestGIS',
  mixins: [],
  components: {
    Map3dTest,
    DisasterJudgeDistrictComponentTest,
    EventWarnInforComponentTest,
    ResourceComponentTest,
    RescueTeamInforComponentTest,
    DisasterJudgeResourceComponentTest,
    DisasterJudgePopComponentTest,
    InfluenceComponentTest,
    LocateComponentTest,
    WeatherTest,
    DisasterStaComponentTest,
    TrafficStatusCmponentTest,
    RouterPlanComponentTest,
    SearchComponentTest,
    QueryResourceComponentTest,
    RiskTroubleCmponentTest,
    PopHeatCompnentTest,
    AfterShockComponentTest,
    FireCarHistoryCmponentTest,
    CommandDispatchTest,
    HistoryTrackComponentTest,
    LatestImageCompoentTest,
    QueryHouseComponentTest,
    RescueNeedComponentTest,
    RescueSituationComponentTest,
    TeamDispatchComponentTest,
    TeamDispatchAdviceComponentTest,
    NearQueryComponentTest,
    PeopleArrangementComponentTest,
    MaterialNeedComponentTest,
    MaterialDispatchComponentTest,
    MapPrintComponentTest,
    ServiceTest,
    SimpleRouterPlanComponentTest,
    RainForecastComponentTest,
    SatilliteCloudComponentTest,
    LayerManagerComponentTest,
    MapserviceInComponentTest,
    RealtimeTrackComponentTest,
    // RegionSelection,
    // NearByQuery,
  WindWaterRainWorkTest,
  videoLayerTest,
  ResourceQueryTest,
  PopulationShipTest,
  FloodModelTest,
  disasterSatistics,
  weaterWarningTest,
  },
})
export default class TestGIS extends Vue {
  // private regionSelectionOption: any = {
  //   districtCode: '000000',
  //   service: regionSelectionServer,
  // };
//   private mounted() {
// 	  const opts = {
// 		pageSize: 3,
// 		pageNo: 1,
// 		id:'ytyjj20200527012',// ytyjj20200531023
// 	  }
// 	  installDisasterJudgeServer.repositoryServer.getMaterialByReposityId(opts).then((res:any) => {
// 		  console.log('物资装备',res);
// 	  })
// 	  const opts2 = {
// 		id:'ytyjj20200527012',// ytyjj20200531023
// 	  }
// 	  installDisasterJudgeServer.repositoryServer.getDetailInfo(opts2).then((res:any) => {
// 		  console.log('物资详情',res);
// 	  })
//   }
}
</script>
<style lang='less' scoped>
</style>
