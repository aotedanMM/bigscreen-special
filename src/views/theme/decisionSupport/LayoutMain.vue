<template>
  <div class="layoutMain">
    <Map3D class="map-wrap" targetId="map3d" :style="visibility3d"></Map3D>
    <MapMessage></MapMessage>

    <!-- 经纬度 三维 v-if='mapDimensionality=="3d"'-->
    <!--<div class="coordinate-box" v-if='mapDimensionality==="3d"'>
      <Coordinate3d></Coordinate3d>
    </div>-->

    <Landform v-if="mapDimensionality === '3d'" />

    <!-- 16:9 右侧的功能性工具条 -->
    <div style="positon:absolute;">
      <FuncToolHalf></FuncToolHalf>
    </div>

    <!-- 16:9 左侧的功能性工具条 -->
    <div v-if="$store.state.configModel.config.researchPanel.length">
      <!-- <TimePlus v-if="normalState !== ''"></TimePlus> -->
      <!---demo-->
      <!-- <StudyToolHalf v-if="!$store.state.TyphoonModule.viewConfig.isTyphoonShow"></StudyToolHalf> -->
      <!-- 台风面板不显示 -->
      <StudyToolHalf></StudyToolHalf>
      <div v-if="monitorIconShow" class="monitor_icon_active" @click="minimizeVideoMapPopControl"></div>
    </div>
    <!--   台风影响范围列表 -->
    <AreaInfluenceList v-if="isShowAreaInfluenceList"></AreaInfluenceList>
    <!--   查询方式面板-->
    <WindCircleSearch></WindCircleSearch>
    <!--   进展情况详情  -->
    <ProgressDetails></ProgressDetails>
    <gis-plot ref="gisPlot" :options="plotOptions"></gis-plot>

    <!-- 正计时 -->
    <TestGIS @changeVisibility="changeVisible"></TestGIS>
    <!-- <DemoGIS></DemoGIS> -->
    <!--<Legend  v-slot="{slotProps}">
         {{slotProps.iconClass}}
    </Legend>-->
    <div class="cmp-legend-wrap">
      <!-- <div class="cmp-legend-wrap" v-if="normalState"> -->
      <MapLegendView></MapLegendView>
    </div>
    <!-- 距离量测弹框 -->
    <DistenceBox v-if="isShowDiatence"></DistenceBox>
    <!---一键搜索  资源面板---->
    <GisMapMenuSearch></GisMapMenuSearch>
    <GisEventHandling v-if="$store.state.gisMenuSearch.isGisDetail"></GisEventHandling>
    <!--行政区划按钮，周边查询按钮-->
    <!--<div :class="{'search-tool-containerNomal':  normalState ,'search-tool-container' : !normalState , 'search-tool-containerNomal_reset': GisMapContainerReset }">
        城市列表按钮
        <div class="district-select-btn"
             v-if="districtShowName"
            @click="onRegionSelectionBtnClick">
          <span>{{districtShowName}}</span>
        </div>
         周边查询按钮 
        <div id='PeripheralQuery' class="buffer-query-btn"
            @click="onNearByBtnClick" ref="PeripheralQuery" v-show="isShowPeripheralQuery">
          <img src="../../../assets/img/layout/huanchong_01.png">
        </div>
    </div>-->
    <!-- <RegionSelection v-if="$store.state.mapTools.regionPanelVisible"
      class="district-select-panel"
      :style='cityListLocation'
      :option="regionSelectionOption"
      @change="onRegionSelectionChange"
      @close="onRegionSelectionClose">
    </RegionSelection>-->

    <!-- 区域选择高亮地图并更新研判数据 -->
    <CitySelectShowInfo
      v-if="$store.state.mapTools.citySelectVisible"
      class="city-select-panel"
      :style="cityListLocation"
      :option="citySelectShowInfoOption"
      @change="onCitySelectShowInfoChange"
      @close="onCitySelectShowInfoClose"
    ></CitySelectShowInfo>

    <!-- 周边查询的位置 -->
    <NearByQuery
      :class="{
        'nearby-query-panelNomal': normalState,
        'nearby-query-panel': !normalState,
      }"
      :style="peripheralQueryLocation"
      v-if="
        $store.state.mapTools.nearbyQueryVisible &&
          !$store.state.gisMenuSearch.showResultPanel
      "
      @change="onNearbyChange"
      @close="onNearbyClose"
    ></NearByQuery>

    <!-- 推送事件标题 -->
    <EventInfoTitle v-if="normalState"></EventInfoTitle>
    <!-- 推送事件描述 -->
    <EventInfoDetail v-if="normalState && !$store.state.controlMoudle.screen2rdFlag"></EventInfoDetail>
    <EmergencyResponse
      v-if="$store.state.configModel.config.EmergencyResponse && $store.state.configModel.config.EmergencyResponse.isShow"
    ></EmergencyResponse>
    <!-- 路径规划模块 -->
    <GisPathAnalysis ref="showPathAnalysis"></GisPathAnalysis>
    <!-- 气象要素：卫星云图，降水-->
    <div>
      <components :is="meteorologicalElements"></components>
    </div>
    <!---监测预警常态--->
    <!-- <MonitorWarningNormal></MonitorWarningNormal> -->
    <!--新图层-->
    <NewLayerPanel v-if="$store.state.configModel.config.LayerPanelConfig"></NewLayerPanel>
    <!--图层图例播放轴-->
    <NewLayerPlay v-if="$store.state.mapTools.showLayerPlay"></NewLayerPlay>
    <OnlyPlayShaft v-if="$store.state.mapTools.showOnlyLayerPlay.isShow"></OnlyPlayShaft>
    <!--河流列表-->
    <RiverListBox v-if="$store.state.mapTools.showRiverList.isShow"></RiverListBox>
    <RiverzListBox v-if="$store.state.mapTools.showRiverListz.isShow"></RiverzListBox>
    <!--河流详情-->
    <RiverDetailBox v-show="showRiverDetail"></RiverDetailBox>
    <!-- 监测预警-水库列表 -->
    <ReservoirList v-if="$store.state.mapTools.showReservoirList.isShow"></ReservoirList>
    <ReservoirList v-if="$store.state.mapTools.showReservoirCountdxList.isShow"></ReservoirList>
    <ReservoirList v-if="$store.state.mapTools.showReservoirCountzxList.isShow"></ReservoirList>
    <ReservoirList v-if="$store.state.mapTools.showReservoirCountxxList.isShow"></ReservoirList>
    <FloodvillageList v-if="$store.state.mapTools.showFloodvillageList.isShow"></FloodvillageList>
    <!-- 监测预警-雨情列表 -->
    <RainMonitorList v-if="$store.state.mapTools.showRainMonitorList.isShow"></RainMonitorList>
    <WeirgateMonitorList v-if="$store.state.mapTools.showWeirgateMonitorList.isShow"></WeirgateMonitorList>
    
    <!-- 监测预警-历史火情列表 -->
    <FireListTable v-if="$store.state.mapTools.showFireList.isShow"></FireListTable>
    <!-- 监测预警-企业监测列表 -->
    <FireListTable2 v-if="$store.state.mapTools.showFireList2.isShow"></FireListTable2>
    <!--视频监控图例---->
    <VideoMonitorView v-if="VideoMonitorViewShow" :style="onlineBoxAndVideoViewLocation"></VideoMonitorView>

    <VideoMapPop v-show="VideoMapPopShow" :videoMapPopList="videoMapPopList"></VideoMapPop>
    <!--在线终端图例---->
    <div class="onlineBox" :style="onlineBoxAndVideoViewLocation">
      <onlinePawn v-if="onlinePawnShow"></onlinePawn>
      <OnlineTerminal v-if="onlineViewShow"></OnlineTerminal>
    </div>

    <!-- 视频通话弹窗 -->
    <VideoCallPop v-if="showVideoCallBox" :path="path" :config="config"></VideoCallPop>
    <!-- 多方视频会商 -->
    <!-- <OnlineConsultation v-if="showOnlineConsultation" :path="path"></OnlineConsultation> -->
    <!-- <RescueTeamsAttachment v-show=false></RescueTeamsAttachment> -->
    <div id="aidDecisionMakingLayoutMain" :style="visibility">
      <!-- 坐标 start -->
      <!-- 级别 -->
      <div
        class="coordinate-box"
        :class="normalState ? 'coordinate-box_left' : ''"
        v-if="mapDimensionality === '2d'"
      >
        <Level />
      </div>
      <!--鼠标 经纬度 二维-->
      <div
        class="coordinate-box"
        :class="normalState ? 'coordinate-box_left' : ''"
        v-if="mapDimensionality === '2d'"
      >
        <Coordinate :longitude="114" :latitude="41"></Coordinate>
      </div>

      <!-- 坐标 end -->
      <Map2D
        class="map-wrap"
        :class="{
          'unnormal-scale-line-inner': normalState,
          isShowquanjing_baidu: isShowquanjing,
        }"
        targetId="map"
      ></Map2D>
      <!-- 热力图图例start -->
      <!-- <div
        v-show="false"
        class="tuliiiili"
        v-if="tuliIsshow.length"
        :class="{
          tuliiiili_li: $store.state.controlMoudle.screen2rdFlag === true,
        }"
        :style="lengedLoca"
      >
        <LegendPlanel></LegendPlanel>
      </div> -->
      <!-- <div
        class="tuliiiili"
        v-if="
          false &&
            $store.state.eventInfoType.eventInfoType.toString() ===
              '3,8,10,16,17,18,19,20,21' &&
            $store.state.eventPushStore.eventId === ''
        "
        :class="{
          tuliiiili_li: $store.state.controlMoudle.screen2rdFlag === true,
        }"
        :style="lengedLoca"
      >
        <FloodLegendPanel></FloodLegendPanel>
      </div>-->
      <!-- 热力图图例end-->
      <!-- 地图左侧点击面板start-->
      <template v-if="normalState">
        <!-- 点击工具条之后的地图弹窗组件 -->
        <components :is="maptoolBtnMapComponent"></components>
      </template>
      <!-- 地图左侧点击面板end-->
      <RealtimeVideoHalf v-if="false"></RealtimeVideoHalf>
      <LocalWeather v-if="isOpen"></LocalWeather>
    </div>
    <!---非悬浮地图的地图详情框容器-->
    <div id="ns-popup-container" class="ns-popup-container"></div>

    <!--村庄详情页，因返回数据需要gis修改，所以暂时这样写，后期改为共用弹框-->
    <VillageDetails v-if="villageDetailsParams.show" :villageDetailsParams="villageDetailsParams"></VillageDetails>
    <!--台风事件时间轴-->
    <TyphoonTimerShaft
      v-if="
        normalState &&
          $store.state.eventPushStore.eventLocation.EventType.toString() ===
            '10'
      "
    ></TyphoonTimerShaft>
    <!-- 河网水系的面处置弹窗面板 -->
    <div class="hwsx-as-prop">
      <RiverNetwork
        v-if="selectedLayersIdArr.includes('RiverLayer')"
        :visible="true"
        :eventComp="'AreaSelection.RiverNetwork'"
      ></RiverNetwork>
    </div>
    <ForestTimebar  v-if="$store.state.forestFireModule.showSpreadTimeBar"></ForestTimebar>
   <RealTime v-if="isShowRealTime"></RealTime>
    <!-- <CompanyVideoA v-if="isshowcompanyVideoPop" :companyVideoPopList="companyVideoPopList"></CompanyVideoA> -->

  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Map2D from '../../common/Map2D.vue';
import Map3D from '../../common/Map3D.vue';
import MapMessage from '@/gis/Message.vue';
import publishObjectPath from '@/util/configRegistry';
// import DemoGIS from '../decisionSupport/module/demoGISModule/DemoGIS.vue';
import TestGIS from '@/gis/TestGIS.vue';
import gisPlot from '@/components/feature/GIS/GisPlot/GisPlot.vue';
import MapLegendView from '@/views/common/gisUI/MapLegendView.vue';
import LegendPlanel from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/LegendPlanel.vue'; // t通用图例
import FloodLegendPanel from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/flood/FloodLegendPanel.vue'; // 防汛专题图例
import DistenceBox from '@/views/common/gisUI/DistenceBox.vue';
import Coordinate from '@/views/theme/decisionSupport/module/gisModel/common/coordinate/Coordinate.vue';
// 原来的三维左下角坐标 换到landform 中了  可以删除 暂时注释掉
// import Coordinate3d from '@/views/theme/decisionSupport/module/gisModel/common/coordinate/Coordinate3d.vue';
import Level from '@/views/theme/decisionSupport/module/gisModel/common/level/level.vue';
// 地图搜索菜单功能
import GisMapMenuSearch from '@/components/feature/GIS/GisMenuSearch/GisMapMenuSearch.vue';
import GisEventHandling from '@/components/feature/GIS/GisMenuSearch/GisEventHandling.vue';
import TimePlus from '@/views/theme/decisionSupport/common/timePlus.vue';
import EventInfoTitle from '@/views/theme/decisionSupport/module/gisModule/enentInfo/EventInfoTitle.vue';
import EventInfoDetail from '@/views/theme/decisionSupport/module/gisModule/enentInfo/EventInfoDetail.vue';
import GisPathAnalysis from '@/components/feature/GIS/GisPathAnalysis/GisPathAnalysis.vue';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
// 气象要素
import SatelliteCloudPicture from '@/components/feature/SatelliteCloudPicture/SatelliteCloudPicture.vue';
import PrecipitationForecastMap from '@/components/feature/PrecipitationForecastMap/PrecipitationForecastMap.vue';

// 左侧面板
// 人口分布 左侧面板
import PopulationFeverBox from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PopulationFeverBox/PopulationFeverBox.vue';
// 行政区划分布 左侧面板
import DistrictLeftDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterDistrict/districtStatistics.vue';
// 绿色通道 左侧面板
import GreenRoadGis from '@/views/theme/decisionSupport/module/gisModule/otherTool/greenRoad/greenRoadGis.vue';
// 道路损毁 左侧面板
import RoadDamageGis from '@/views/theme/decisionSupport/module/gisModule/otherTool/roadDamage/roadDamageGis.vue';
// 交通管制 左侧面板
import TraffivControlGis from '@/views/theme/decisionSupport/module/gisModule/otherTool/trafficControl/traffivControlGis.vue';
// 居民区分布 左侧面板
import DisasterHouse from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHouse/DisasterHouse.vue';
// 煤矿企业分布 左侧面板
import DisasterCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCoal/DisasterCoal.vue';
// 危化企业分布 左侧面板
import DisasterCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCompany/DisasterCompany.vue';
// 机场分布 左侧面板
import DisasterPlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterPlane/DisasterPlane.vue';
// 水库大坝分布 左侧面板
import DisasterReservoir from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterReservoir/DisasterReservoir.vue';
// 学校分布 左侧面板
import DisasterSchool from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterSchool/DisasterSchool.vue';
// 船舶分布 左侧面板
import DisasterShip from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterShip/DisasterShip.vue';
// 火车站分布 左侧面板
import DisasterTrain from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterTrain/DisasterTrain.vue';
// 码头分布 左侧面板
import DisasterWharf from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterWharf/DisasterWharf.vue';
// 烟花爆竹分布 左侧面板
import DisasterFireworks from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterFireworks/DisasterFireworks.vue';
// 地质灾害隐患点分布 左侧面板
import DisasterGeology from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterGeology/DisasterGeology.vue';
// 医院分布 左侧面板
import DisasterHospital from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHospital/DisasterHospital.vue';
// 工贸企业分布 左侧面板
import DisasterIndustry from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterIndustry/DisasterIndustry.vue';
// 灾情信息员分布 左侧面板
import DisasterMessenger from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMessenger/DisasterMessenger.vue';
// 非煤企业分布 左侧面板
import DisasterNoCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNoCoal/DisasterNoCoal.vue';
// 核设施分布 左侧面板
import DisasterNucleus from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNucleus/DisasterNucleus.vue';
// 灾情评估分布 左侧面板
import DisasterPredictionBox from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/DisasterPredictionBox/DisasterPredictionBox.vue';
// 京东物资储备库 左侧面板
import DisasterJdReserve from '@/views/jdReserve/disasterJdReserve.vue';
// 力量调度分布 左侧面板
import DisasterRescueTeams from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterRescueTeams.vue';
// 应急管理机构分布 左侧面板
import DisasterEmergencypart from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterEmergencypart/DisasterEmergencypart.vue';
// 人员密集场所 左侧面板
import CrowdedPlace from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/earthQuakeAll/crowdedPlace.vue'; // 人员
// 企业 左侧面板
import GeneralCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/earthQuakeAll/generalCompany.vue'; // 企业
// 重要设施 左侧面板
import MajarCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/earthQuakeAll/majarCompany.vue'; // 重要设施
// 灾损统计地图上左侧的统计面板 开始
// 人员伤亡 左侧面板
import CasualtiesGIS from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/casualties/CasualtiesGIS.vue';
// 房屋损毁 左侧面板
import HousesDamagedGis from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/housesDamaged/HousesDamagedGis.vue';
// 电力损毁 左侧面板
import ElectricDamagedGis from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/electricDamaged/ElectricDamagedGis.vue';
// 失联区域 左侧面板
import MissingFlight from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/missingFlightNew/MissingFlight.vue';
// 灾损统计地图上左侧的统计面板 结束

// 救援救助
// 救援需求 左侧列表
import RescueDemand from '@/views/theme/decisionSupport/module/gisModule/rescueAid/rescueDemand/RescueDemand.vue';
// 安置点 左侧列表
import ShleterLeft from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/ShleterLeft.vue';
// 调度部署 左侧列表
import Deployment from '@/views/theme/decisionSupport/module/gisModule/rescueAid/deployment/Deployment.vue';
// 调拨建议 左侧列表
import DispatchAdvice from '@/views/theme/decisionSupport/module/gisModule/rescueAid/dispatchAdvice/DispatchAdvice.vue';
// 半屏新闻报道
import RealtimeVideoHalf from '@/components/feature/realtimeVideoHalf/RealtimeVideoHalf.vue';
import Landform from '@/components/feature/landform/Landform.vue';
// 16:9 右侧的功能性工具条
import FuncToolHalf from '@/components/feature/funcToolHalf/FuncToolHalf.vue';
import StudyToolHalf from '@/components/feature/studyToolHalf/StudyToolHalf.vue';
import LocalWeather from '@/components/feature/localWeather/localWeather.vue';

// 行政区划选择组件
import ResourceQueryHandler from '@/components/feature/GIS/GisMenuSearch/Handler';
import RegionSelection from '@/components/feature/GIS/RegionSelection/RegionSelection.vue';
import CitySelectShowInfo from '@/components/feature/GIS/CitySelectShowInfo/CitySelectShowInfo.vue';
import NearByQuery from '@/components/feature/GIS/NearbyQuery/NearbyQuery.vue';
// 进展情况详情
import ProgressDetails from '@/views/theme/decisionSupport/module/gisModule/enentInfo/ProgressDetails.vue';
// 监测预警--防汛
import MonitorWarningNormal from '@/components/feature/flood/MonitorWarning/MonitorWarningNormal.vue';
// 监测预警-森火
import MonitorWarningForestFire from '@/components/feature/forestFireYantai/MonitorWarning/MonitorWarningForestFire.vue';
// 图层
import GisLayerPanel from '@/components/feature/gisModle/gisLayerPanel/LayerPanel.vue';
// 图例
import LayerLegend from '@/components/feature/gisModle/gisLayerPanel/LayerLegend.vue';
// 新图层
import NewLayerPanel from '@/components/feature/gisModle/gisLayerPanel/NewLayerPanel.vue';
// 图层图例播放轴
import NewLayerPlay from '@/components/feature/gisModle/gisLayerPanel/NewLayerPlay.vue';
// 单独播放轴
import OnlyPlayShaft from '@/components/feature/gisModle/gisLayerPanel/OnlyPlayShaft.vue';
// 河流名录
import RiverListBox from '@/components/feature/gisModle/gisLayerPanel/layerPopup/RiverListBox.vue';
import RiverzListBox from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/RiverzListBox.vue';
// 山洪灾害村
import FloodvillageList from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/floodvillageMonitor.vue';
// 河流详情
import RiverDetailBox from '@/components/feature/gisModle/gisLayerPanel/layerPopup/RiverDetailBox.vue';
// 水库列表
import ReservoirList from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/ReservoirList.vue';
// 监测预警-水库列表
import RainMonitorList from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/RainMonitorList.vue';
// 监测预警-水库列表
import FireListTable from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/FireListTable.vue';
import FireListTable2 from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/FireListTable2.vue';
// 防汛抗旱-堰闸列表
import WeirgateMonitorList from '@/components/feature/gisModule/popUp/monitorWarning/monitorWarningList/WeirgateMonitorList.vue';

import VideoMonitorView from '@/components/feature/flood/VideoMonitor/VideoMonitorView.vue';
import onlinePawn from '@/components/feature/flood/VideoMonitor/onlinePawn.vue';
import VideoMapPop from '@/components/feature/flood/VideoMonitor/VideoMapPop.vue';
import OnlineTerminal from '@/components/feature/flood/VideoMonitor/OnlineTerminal.vue';
// 视频通话弹窗
import VideoCallPop from '@/components/feature/RescueTeams/VideoCallPop.vue';
// import OnlineConsultation from '@/util/OnlineConsultation/OnlineConsultation.vue';
// 救援队伍回传附件
import RescueTeamsAttachment from '@/components/feature/RescueTeams/RescueTeamsAttachment.vue';
import TyphoonTimerShaft from '@/components/feature/typhoonInfo/TyphoonTimerShaft.vue';
// 河网水系进入面处置的组件
import RiverNetwork from '@/components/feature/GIS/GisAreaSelection/RiverNetwork.vue';
// 台风影响范围列表
import AreaInfluenceList from '@/components/feature/typhoonInfo/areaInfluenceList.vue';
// 查询方式面板
import WindCircleSearch from '@/components/feature/GIS/GisMenuSearch/windCircleSearch.vue';
// 应急响应
import EmergencyResponse from '@/components/feature/flood/EmergencyResponse/EmergencyResponse.vue';
// 左侧村庄详情页面
import VillageDetails from '@/components/feature/flood/FastAssessment/VillageDetails.vue';
import ForestTimebar from '@/components/feature/forestFireYantai/spreadAnalysis/Timebar.vue';
// 实时监测
import RealTime from '@/components/feature/forestFire/operationalDeployment/RealTime.vue';
// 企业视频
import CompanyVideoA from '@/components/feature/forestFire/operationalDeployment/CompanyVideoB.vue';
// 重大危险源分布 左侧面板
import DisasterMajorDanger from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMajorDanger/DisasterMajorDanger.vue';
// 重大危险源分布 右侧列表
import DisasterMajorDangerList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMajorDanger/DisasterMajorDangerList.vue';
@Component({
  name: 'LayoutMain',
  mixins: [MapCommon, ResourceQueryHandler],
  components: {
    DisasterMajorDanger, // 重大危险源分布
    DisasterMajorDangerList, // 重大危险源分布列表
    Landform,
    Map2D,
    Map3D,
    MapMessage,
    // DemoGIS,
    TestGIS,
    MapLegendView,
    DistenceBox,
    Coordinate,
    CitySelectShowInfo, // 工具栏城市选择更新地图和研判数据
    // Coordinate3d,
    LegendPlanel, // 通用图例
    FloodLegendPanel, // 防汛专题图例
    GisMapMenuSearch,
    GisEventHandling,
    EventInfoTitle,
    TimePlus,
    EventInfoDetail,
    Level,
    GisPathAnalysis,
    gisPlot,
    SatelliteCloudPicture,
    PrecipitationForecastMap,
    // 灾情研判
    PopulationFeverBox, // 左侧面板 人口分布
    DistrictLeftDialog, // 左侧面板 行政区划分布
    GreenRoadGis, // 左侧面板 绿色通道
    RoadDamageGis, // 左侧面板 道路损毁
    TraffivControlGis, // 左侧面板 交通管制
    DisasterHouse, // 左侧面板 居民区分布(暂时没有看到在哪使用)
    DisasterCoal, // 左侧面板 煤矿企业分布
    DisasterCompany, // 左侧面板 危化企业分布
    DisasterPlane, // 左侧面板 机场分布
    DisasterReservoir, // 左侧面板 水库大坝分布
    DisasterSchool, // 左侧面板 学校分布
    DisasterShip, // 左侧面板 船舶分布
    DisasterTrain, // 左侧面板 火车站分布
    DisasterWharf, // 左侧面板 码头分布
    DisasterFireworks, // 左侧面板 烟花爆竹分布
    DisasterGeology, // 左侧面板 地质灾害隐患点分布
    DisasterHospital, // 左侧面板 医院分布
    DisasterIndustry, // 左侧面板 工贸企业分布
    DisasterMessenger, // 左侧面板 灾情信息员分布
    DisasterNoCoal, // 左侧面板 非煤企业分布
    DisasterNucleus, // 左侧面板 核设施分布
    DisasterPredictionBox, // 左侧面板 灾情评估分布
    DisasterJdReserve, // 左侧面板 京东物资储备库
    DisasterRescueTeams, // 左侧面板 力量调度分布
    DisasterEmergencypart, // 左侧面板 应急管理机构分布
    CrowdedPlace, // 左侧面板 人员密集场所
    GeneralCompany, // 左侧面板 企业信息
    MajarCompany, // 左侧面板 重要设施
    // 灾损统计
    CasualtiesGIS, // 左侧面板 人员伤亡
    HousesDamagedGis, // 左侧面板 人员伤亡
    ElectricDamagedGis, // 左侧面板 电力损毁
    MissingFlight, // 左侧面板 失联区域
    // 救援救助
    RescueDemand, // 左侧面板 救援需求
    ShleterLeft, // 左侧面板 安置点
    Deployment, // 左侧面板 调度部署
    DispatchAdvice, // 左侧面板 调拨建议
    RealtimeVideoHalf, // 半屏新闻报道
    FuncToolHalf, // 16:9 右侧的功能性工具条
    StudyToolHalf, // 16:9 左侧的功能性工具条
    LocalWeather, // 当地天气
    RegionSelection, // 行政区划
    NearByQuery, // 周边查询
    ProgressDetails, // 进展情况详情
    MonitorWarningNormal, // 监测预警常态
    MonitorWarningForestFire, // 监测预警森火
    NewLayerPanel, // 新图层
    NewLayerPlay, // 图层图例播放轴
    OnlyPlayShaft, // 单独播放轴
    RiverListBox, // 河流名录
    RiverzListBox,
    RiverDetailBox, // 河流详情
    VideoMonitorView, // 视频监控
    onlinePawn, // 在线单兵视频
    OnlineTerminal, // 在线终端
    VideoMapPop, // 视频监控地图弹框
    RescueTeamsAttachment, // 救援队伍回传附件
    TyphoonTimerShaft, // 台风事件时间轴
    RiverNetwork, // 河网水系查询面板
    AreaInfluenceList, // 台风影响范围列表
    WindCircleSearch, // 查询方式面板
    VideoCallPop, // 视频通话弹窗
    // OnlineConsultation, // 多方视频会商
    EmergencyResponse, // 应急响应
    ReservoirList, // 监测预警水库列表
    FloodvillageList, // 山洪受灾村
    RainMonitorList, // 监测预警雨情列表
    WeirgateMonitorList, // 防汛抗旱堰闸列表
    FireListTable, // 监测预警历史火情列表
    FireListTable2, // 企业监测
    VillageDetails, // 村庄详情页
    ForestTimebar, // 蔓延分析时间轴
    RealTime, // 实时监测
    CompanyVideoA, // 企业视频
  },
})
export default class LayoutMain extends Vue {
  public visibility: any = 'visibility:visible';
  public visibility3d: any = 'visibility:hidden';
  public mapDimensionality: string = ''; // 当前是二维2d 还是三维 3d
  public meteorologicalElements: any = ''; // 气象要素动态组件
  public isShowPeripheralQuery: any = false;
  public tuliIsshow: any = [];
  public isShowAreaInfluenceList: any = false;
  public showRiverDetail: boolean = false;
  public villageDetailsParams: any = {};
  // public $refs:any='';
  public tags: any = {
    isShow: false,
    title: '图例',
    data: [
      {
        iconClass: 'cmp-legend-icon-A',
        title: '救援力量',
      },
      {
        iconClass: 'cmp-legend-icon-F',
        title: '医疗保障',
      },
      {
        iconClass: 'cmp-legend-icon-C',
        title: '避难场所',
      },
      {
        iconClass: 'cmp-legend-icon-D',
        title: '通讯设施',
      },
      {
        iconClass: 'cmp-legend-icon-E',
        title: '物资仓库',
      },
      {
        iconClass: 'cmp-legend-icon-B',
        title: '电力设施',
      },
    ],
  };
  // 视频摄像头最小化控制
  private monitorIconShow: boolean = false;
  private VideoMonitorViewShow: any = false;
  private onlinePawnShow: any = false;
  private VideoMapPopShow: any = false;
  private videoMapPopList: any = [];
  private onlineViewShow: any = false;
  private flag: any = false;
  private searchVideoList: any = [];
  private normalState = '';
  private isShowDiatence = false;
  private GisMapContainerReset = false;
  private cityListLocation: any = ''; // 城市列表位置
  private peripheralQueryLocation: any = ''; // 周边查询的位置
  private onlineBoxAndVideoViewLocation: any = ''; // 视频监控在线终端的位置
  private isShowquanjing = false;
  private showVideoCallBox: boolean = false;
  private config: any = null;
  // private showOnlineConsultation: boolean = false;
  private path: any = '';

  /**
   * 标绘工具箱参数
   */
  private plotOptions = {
    // 地图容器唯一标识
    mapId: 'map',
    // 配置文件目录
    configDir: './json/plot/',
    // 图片资源目录
    iconImageDir: './imgs/gisPlot/',
    // 服务配置
    service: {
      RestPlotService: 'NOSQL',
      serverUrl: publishObjectPath.value.floodServerPath,
      // serverUrl: 'http://localhost:8081',
    },
    // 左侧tab配置，根据事件类型自动切换
    tabConfig: {
      // 默认
      default: [
        {
          label: '常用标绘', // 显示名称
          value: 'common', // 唯一标识
        },
        {
          label: '应急标绘符号',
          value: 'emergency',
        },
        {
          label: '基础标绘符号',
          value: 'basic',
        },
        {
          label: '管理标绘',
          value: 'manage',
        },
      ],
      // 森火
      9: [
        {
          label: '常用标绘',
          value: 'common',
        },
        {
          label: '应急标绘符号',
          value: 'emergency',
        },
        {
          label: '基础标绘符号',
          value: 'basic',
        },
        {
          label: '管理标绘',
          value: 'manage',
        },
      ],
    },
    // 面板样式
    panelStyle: {
      position: 'absolute',
      // left: '1380px',
      top: '160px',
      display: 'none',
      right: '77px',
    },
    // 编辑框
    editorStyle: {
      position: 'absolute',
      // left: '1380px',
      top: '100px',
      left: '1418px',
    },
    // 拖拽参数
    drag: {
      container: '.layoutMain',
    },
  };

  private maptoolBtnMapComponent: string = '';
  private isOpen: boolean = false; // 是否显示当地天气弹窗
  private lengedLoca: boolean = false;
  private selectedLayersIdArr: any = []; // 当前选中的图层的id的数组
  private positionAddress: any = {
    position: 'absolute',
    top: '160px',
    right: '77px',
    zIndex: 50,
  };
  private isShowRealTime: boolean = false; // 是否显示实时监测弹窗
  private isshowcompanyVideoPop: boolean = false; // 是否显示企业视频弹窗
  private companyVideoPopList: any = null; // 是否显示企业视频弹窗
  // 最大化按钮控制
  private minimizeVideoMapPopControl() {
    if (this.monitorIconShow) {
      this.messsageBus.$emit('minimizeVideoMapPopShow', true);
    }
  }

  @Watch('$store.state.configModel.config.legend')
  private updateTuliIsshow() {
    let result = [];
    if (
      this.$store.state.configModel.config.legend &&
      this.$store.state.configModel.config.legend.length
    ) {
      result = this.$store.state.configModel.config.legend.filter(
        (item: any, index: number) => {
          return item.isShow;
        },
      );
    }
    this.tuliIsshow = result;
  }
  @Watch('$store.state.configModel.config')
  private closeMapPop() {
    // 关闭未关闭的弹框
    this.messsageBus.emit('closeVideoMonitorPop', false);
  }

  // 监听为常态还是非常态
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private changeEventType(val: string) {
    if (val !== '10') {
      this.$store.dispatch('TyphoonModule/setTyphoonIsShow', false);
      this.$store.dispatch('TyphoonModule/setIsShow', false);
      this.isShowAreaInfluenceList = false;
    } else {
      this.isShowAreaInfluenceList = false;
      this.$store.dispatch('TyphoonModule/setTyphoonIsShow', true);
      this.$store.dispatch('TyphoonModule/setIsShow', true);
    }
  }

  // 监听为常态还是非常态
  @Watch('$store.state.eventPushStore.eventId')
  private changeNormalState() {
    this.normalState = '';
    this.$nextTick(() => {
      this.normalState = this.$store.state.eventPushStore.eventId;
    });
  }

  // 监听地图是三维还是二维
  @Watch('$store.state.controlMoudle.mapDimensionality')
  private changeMapDimensionality(flag: string) {
    this.mapDimensionality = flag;
    if (flag === '3d') {
      // 到三维
      this.visibility = 'visibility:hidden';
      this.visibility3d = 'visibility:visible';
    } else {
      this.visibility = 'visibility:visible';
      this.visibility3d = 'visibility:hidden';
      // this.visibility3d = 'visibility:visible;right: 150px !important;top: -105px !important;';
    }
  }

  // 监听图例的位置
  @Watch('$store.state.panelPositionChangeModule.botLegendLocation')
  private changeLegendLocation() {
    this.lengedLoca = this.$store.state.panelPositionChangeModule.botLegendLocation;
  }

  // 监听当右侧面板消失时，城市列表、周边查询等的面板的位置
  @Watch('$store.state.panelPositionChangeModule.topToolbarLocation', {
    deep: true,
  })
  private panelPosition(val: any) {
    this.cityListLocation = val.cityListLocation; // 城市列表面板位置
    this.peripheralQueryLocation = val.peripheralQueryLocation; // 周边查询面板的位置
    this.onlineBoxAndVideoViewLocation = val.onlineBoxAndVideoViewLocation; // 在线会商与视频监控
    this.isShowquanjing = !val.isShowquanjing; // 百度全景按钮
    this.plotOptions.panelStyle.right = val.plottingLocation;
    // console.log(this.plotOptions.panelStyle, 9999999);
  }

  /**
   * 获得layerList选中的项
   */
  @Watch('$store.state.mapTools.selectedLayers')
  private updateLayerList(val: any) {
    const selectedLayers = JSON.parse(JSON.stringify(val));
    this.selectedLayersIdArr = [];
    selectedLayers.forEach((item: any, index: number) => {
      this.selectedLayersIdArr.push(item.id);
    });
  }
  private created() {
    this.updateTuliIsshow();
    this.normalState = this.$store.state.eventPushStore.eventId;
    this.changeMapDimensionality(
      this.$store.state.controlMoudle.mapDimensionality,
    );
    this.changeLegendLocation();
    this.panelPosition(
      this.$store.state.panelPositionChangeModule.topToolbarLocation,
    );
    // this.messsageBus.off('showDistenceBox');
    this.messsageBus.on('showDistenceBox', (data: any) => {
      this.isShowDiatence = data;
    });
    // this.messsageBus.off('satelliteCloudPicture');
    this.messsageBus.on('satelliteCloudPicture', (icon: any, label: any) => {
      if (icon === 'icon1') {
        this.meteorologicalElements = 'SatelliteCloudPicture';
      } else if (icon === 'icon2') {
        this.meteorologicalElements = 'PrecipitationForecastMap';
      }
    });
    // 清除卫星和降水组件
    // this.messsageBus.off('closeSatelliteCloudPicture');
    this.messsageBus.on('closeSatelliteCloudPicture', () => {
      this.meteorologicalElements = '';
    });
    // this.messsageBus.off('reverseElectionClose');
    this.messsageBus.on('reverseElectionClose', () => {
      this.meteorologicalElements = '';
    });
    // 从LayoutMain接收左侧地图面板组件名称
    // this.messsageBus.off('maptoolBtnMapComponent');
    this.messsageBus.on('maptoolBtnMapComponent', (leftName: string): void => {
      // console.log('地图左侧面板名称', leftName);
      this.maptoolBtnMapComponent = leftName;
    });
    // this.messsageBus.off('surroundingWeather');
    this.messsageBus.on('surroundingWeather', (data: any) => {
      this.isOpen = data.isOpen;
    });
    // 视频监控
    this.messsageBus.on('showVideoMonitorPop', (data: any) => {
      // console.log(data);
      this.VideoMonitorViewShow = data;
      this.flag = false;
      if (data) {
        this.onlineViewShow = false;
        this.onlinePawnShow = false;
        this.messsageBus.emit('GisonlineTerminal', 'OnlineTerminal', true);
        this.messsageBus.emit('GisonlinePawn', 'onlinePawn', true);
      }
    });
    // 在线单兵
    this.messsageBus.on('openPawn', (data: any) => {
      this.onlinePawnShow = data;
      this.flag = false;
      // this.onlineViewShow = false;
    });
    // 在线单兵
    this.messsageBus.on('closePawn', (data: any) => {
      this.onlinePawnShow = false;
      this.messsageBus.emit('GisonlinePawn', 'onlinePawn', true);
      // this.onlineViewShow = false;
    });
    // 视频监控窗口显示
    this.messsageBus.on('minimizeVideoMapPopShow', (data: any) => {
      this.VideoMapPopShow = data; // 视频窗 口是否最小化
      this.monitorIconShow = !data; // 视频按钮是否高亮
    });
    // 企业视频弹窗显示
    this.messsageBus.on('openCompanyVideopop', (data: any) => {
      console.log(data);
      if (data) {
        // this.isshowcompanyVideoPop = true; // 视频窗口是否显示
        this.companyVideoPopList = data;
      }
    });
    // 企业视频弹窗关闭
    this.messsageBus.on('closeCompanyVideoPop', (data: any) => {
      // console.log(data);
      this.isshowcompanyVideoPop = false;
    });
    this.messsageBus.on('closeVideoMonitorPop', (data: any) => {
      this.VideoMonitorViewShow = false;
      // this.onlinePawnShow = false;
    });
    this.messsageBus.on('showVideoMapPop', (data: any) => {
      this.videoMapPopList = data;
      this.VideoMapPopShow = true;
      if (data && data.length > 0) {
        this.VideoMapPopShow = true;
      } else {
        this.VideoMapPopShow = false;
      }
    });
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      this.VideoMapPopShow = false;
      this.videoMapPopList = [];
    });
    // 在线终端
    this.messsageBus.on('openTerminal', (data: any) => {
      this.onlineViewShow = true;
      this.VideoMonitorViewShow = false;
    });
    // 在线终端
    this.messsageBus.on('closeTerminal', (data: any) => {
      this.onlineViewShow = false;
      this.messsageBus.emit('GisonlineTerminal', 'OnlineTerminal', true);
    });
    this.messsageBus.on('showVideoCallBox', (data: any, config: any) => {
      this.showVideoCallBox = true;
      this.path = data;
      this.config = config;
    });
    this.messsageBus.on('closeVideoCallBox', (data: any) => {
      this.showVideoCallBox = false;
      this.path = '';
    });
    // this.messsageBus.on('showOnlineConsultation', (data: any) => {
    //   this.showOnlineConsultation = true;
    //   this.path = data;
    // });
    // this.messsageBus.on('closeOnlineConsultation', (data: any) => {
    //   this.showOnlineConsultation = false;
    //   this.path = '';
    // });
    // this.messsageBus.on('changeTo3Or2', (flag: string) => {
    //   if (flag === '3d') {
    //     // 到三维
    //     this.visibility = 'visibility:hidden';
    //     this.visibility3d = 'visibility:visible';
    //   } else {
    //     this.visibility = 'visibility:visible';
    //     this.visibility3d = 'visibility:hidden';
    //   }
    // });

    // 多选区县-点击触发该函数
    this.messsageBus.on('CitySelectShow', (btnItemFlag: any): void => {
      this.$store.state.mapTools.citySelectVisible = btnItemFlag;
      if (!btnItemFlag) {
        this.messsageBus.emit('commonTools', 'CitySelectShow', true);
      }
    });

    // 获取当前行政区划
    this.messsageBus.on('PeripheralQuery', (btnItem: any): void => {
      // 工具栏-周边选择器
      this.$store.commit('mapTools/changeNearbyQueryVisible', btnItem.isShow);
      if (!btnItem.isShow) {
        this.messsageBus.emit('commonTools', 'PeripheralQuery', true);
      }
    });
    // 监听河流详情
    this.messsageBus.on('updateRiverDetail', (data: any) => {
      this.showRiverDetail = data.isShow;
    });
    // 监听村庄详情
    this.messsageBus.on('updateVillageDetails', (data: any) => {
      this.villageDetailsParams = data;
    });
  }
  //  获取地图功能
  private getVideoComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('nearbyVideoLayer');
    return component;
  }
  private showVideoplayer(event: any) {
    this.flag = true;
    if (!this.videoMapPopList.includes(event.data.id)) {
      if (this.videoMapPopList.length > 3) {
        this.$message({
          message: '最多只能播放四路视频，请关闭一路视频后再次点击播放',
          type: 'warning',
          duration: 1000,
        });
        this.getVideoComponent().removeHighlight();
        return;
      }
      this.videoMapPopList.push(event.data);
    } else {
      this.getVideoComponent().removeHighlight();
    }
    this.VideoMapPopShow = true;
  }
  private closeNearByClick() {
    this.VideoMapPopShow = false;
    this.videoMapPopList = [];
  }
  private mounted() {
    // 监听地图弹框视频组件点击删除同步信息
    const that = this;
    this.messsageBus.on('delectList', (data: any) => {
      if (this.flag) {
        // 删去数据
        that.videoMapPopList.forEach((key: any, index: any) => {
          if (key.id === data.id) {
            that.videoMapPopList.splice(index, 1);
          }
        });
      }
    });
    this.messsageBus.on('closePopTyphoon', (data: any) => {
      this.isShowAreaInfluenceList = data;
    });
    // 地图容器id
    (this as any).resolveMap(this.plotOptions.mapId).then((data: any) => {
      /**
       * 这里是周边分析的详情框
       * */
      this.getNearQueryComponent().off('popup');
      this.getNearQueryComponent().on('popup', (event: any) => {
        this.onShowPopup(event, 'nearQuery');
      });

      this.getVideoComponent().off('VideoLayer_popup');
      this.getVideoComponent().on(
        'VideoLayer_popup',
        this.showVideoplayer,
        this,
      );
      this.getVideoComponent().off('closeNearByClick');
      this.getVideoComponent().on(
        'closeNearByClick',
        this.closeNearByClick,
        this,
      );
      /**
       * 加载弹窗监听事件
       * 这里是除了行政区划,周边分析以外的详情框
       * */
      // 卸载
      this.getComponent().off('popup');
      this.getComponent().on('popup', (event: any) => {
        if (event.type === 'majordanger') {
          // 重大危险源的弹窗类型
          event.type = 'majorDanger';
        }
        // 危化企业类型判断
        if (event.type === 'hazardous') {
          switch (event.data.PROPERTYNAME) {
            case '生产企业':
              event.type = 'productionindustry';
              break;
            case '经营企业':
              event.type = 'runeddustry';
              break;
            case '使用企业':
              event.type = 'useddustry';
              break;
            default:
              event.type = 'otherdustry';
              break;
          }
        }
        this.onShowPopup(event, 'NewResourceComponent_left');
      });

      /**
       * 加载弹窗监听事件
       * 这里是行政区划,周边分析的详情框
       * */
      const eventLocation = [
        this.$store.state.eventPushStore.eventLocation.EventLon,
        this.$store.state.eventPushStore.eventLocation.EventLat,
      ];
      const param = {
        that: this,
        eventLocation, // 添加事故点定位经纬度
        popupId: 'Pointspopup', // 监听弹出层id，必须
        moduleTypeID: 'districtComp', // 实体类资源模块id，必须
        // getComponenContext: this.getComponent(),  // 地图模板
      };

      // 创建弹框模板
      const popUpTemplate = new renderpopUpTemplate();
      // 传入渲染信息
      popUpTemplate.getParams(param);
      // 接收监听事件
      this.getComponentNew().off('Pointspopup');
      this.getComponentNew().on('Pointspopup', (event: any) => {
        // 显示弹框
        popUpTemplate.onShowPopup(event);
      });

      /**
       * 加载弹窗监听事件
       * 队伍
       * */
      // 卸载
      this.getComponentNewTeam().off('popup');
      this.getComponentNewTeam().on('popup', (event: any) => {
        this.onShowPopup(event, 'disasterJudgeResource');
      });

      /**
       * 加载弹窗监听事件
       * 航空护林队
       * */
      // 卸载
      this.getComponentAirTeam().off('airPointspopup');
      this.getComponentAirTeam().on('airPointspopup', (event: any) => {
        this.onShowPopup(event, 'disasterJudgeAirTeam');
      });
      /**
       * 加载弹窗监听事件   getmaterial()
       * 物资
       * */
      // 卸载
      //   this.getmaterial().off('popup');
      // this.getmaterial().on('popup', (event: any) => {
      //   this.onShowPopup(event , 'disasterJudgeResource');
      // });

      /**
       * 加载弹窗监听事件
       * 航空护林队
       * */
      // 卸载
      this.getComponentAirTeam().off('airPointspopup');
      this.getComponentAirTeam().on('airPointspopup', (event: any) => {
        this.onShowPopup(event, 'disasterJudgeAirTeam');
      });
      /**
       * 加载弹窗监听事件   getmaterial()
       * 物资
       * */
      // 卸载
      // this.getmaterial().off('popup');
      // this.getmaterial().on('popup', (event: any) => {
      //   this.onShowPopup(event, 'disasterJudgeResource');
      // });

      /**
       * 加载弹窗监听事件   gethistoryEarthQuake()
       * 历史地震
       * */
      // 卸载
      this.gethistoryEarthQuake().off('hisPointspopup');
      this.gethistoryEarthQuake().on('hisPointspopup', (event: any) => {
        this.onShowPopup(event, 'hisPointspopup');
        this.messsageBus.emit('EarthQuakePlanel', true);
      });
      // 原来常态的那个地图弹窗，现在的右侧的地图弹窗点击事件的监听
      const emergencyParam = {
        popupId: 'popup',
        moduleTypeID: 'NewResourceComponent',
        that: this,
        // getComponenContext: this.getComponent(),
      };
      new renderpopUpTemplate().clickHandler(emergencyParam);
    });
    this.messsageBus.on('closerealForParent', () => {
      const self: any = this;
      self.$store.commit('realTimeUrlModule/SET_ISSHOWDIALOGS', false);
    });
    /*// 这里接收显示安全生产事件详情窗
    this.messsageBus.off('SafeProductEventPop');
    this.messsageBus.on('SafeProductEventPop', (event: any) => {
        this.onShowPopup(event, 'locateComp');
      });*/
  }

  /**
   * 创建模板
   * @param: event : 事件信息
   * @param: moduleTypeID : 实体类资源模块id，必须
   * */
  private onShowPopup(event: any, moduleTypeID: string) {
    /**
     * 这里用来找出救援队伍里面带前突的队伍,展示不同弹窗
     * 救援队伍类型 且名字中有前突字段 那么修改详情框类型 展示不同详情窗
     * */
    if (
      event.type === 'RescueTeam※03' &&
      this.$store.state.eventPushStore.eventId
    ) {
      // 有事件的 进入战时救援队伍弹窗 里面区分前突和一般
      event.type = 'allRealTeamPopup';
      event.data.realpopuptimer = this.$store.state.eventPushStore.eventLocation.EventTimes;
    }
    if (event.id && event.id === 'popup_historyeq') {
      // 历史地震弹窗没有type   前端自己加type
      event.type = 'hisPointspopup';
    }
    // 处理水库
    if (event.type === 'reservoir') {
      event.type = 'reservoir';
      // event.data.id = event.data._id; 暂时隐藏掉，防止覆盖自身id
    }
    const eventLocation = [
      this.$store.state.eventPushStore.eventLocation.EventLon,
      this.$store.state.eventPushStore.eventLocation.EventLat,
    ];
    const self = this;
    const param = {
      that: self,
      eventLocation, // 添加事故点定位经纬度
      popupId: 'popup', //  监听id，必须
      moduleTypeID, //  实体类资源模块id，必须
    };
    event.data.realpopuptimer = this.$store.state.eventPushStore.eventLocation.EventTimes; // 事件进入  把事件的时间加上
    event.data.typecodeStr = this.$store.state.eventPushStore.eventLocation.EventType; // 加上 专题类型
    // 是否卸载之前的弹框  true是不卸载
    // event.noUnloadAround = true;
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(event);
  }
  private changeVisible(data: string) {
    this.visibility = data;
    if (this.visibility === 'visibility:visible') {
      this.visibility3d = 'visibility:hidden';
    } else {
      this.visibility3d = 'visibility:visible';
    }
  }

  // 这里放弹窗接收  除了行政区划, 周边分析的统计面板
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
    );
    return component;
  }

  // 这里放行政区划弹窗接收
  private getComponentNew() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('districtCompYT');
    return component;
  }

  // 这里放救援队伍弹窗接收
  private getComponentNewTeam() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewTeam',
    );
    return component;
  }
  // 洪涝灾害 的力量调度
  private getComponentteamDispatch() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('teamDispatch');
    return component;
  }

  // 这里放航空护林队弹窗接收
  private getComponentAirTeam() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeAirTeam',
    );
    return component;
  }

  // 这里放物资弹窗弹窗接收
  private getmaterial() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewRepertory',
    );
    return component;
  }

  // 这里放历史地震弹窗弹窗接收
  private gethistoryEarthQuake() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('historyEarthQuake');
    return component;
  }

  // 监听周边分析点位事件
  private getNearQueryComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('nearQuery');
    return component;
  }
  // private destroyed(): void {
  //   this.messsageBus.off('showDistenceBox');
  //   this.messsageBus.off('satelliteCloudPicture');
  //   this.messsageBus.off('maptoolBtnMapComponent');
  //   this.messsageBus.off('surroundingWeather');
  //   this.messsageBus.off('PeripheralQuery');
  //   this.getNearQueryComponent().off('popup');
  //   this.getComponent().off('popup');
  //   this.getComponentNewTeam().off('popup');
  // }
  @Watch('$store.state.realTimeUrlModule.isShowDialogs')
  private getisShowDialogs(data: boolean) {
    this.isShowRealTime = data;
  }
}
</script>
<style lang="less" scoped>
// 视频弹窗最小化展示开关
.monitor_icon_active {
  position: absolute;
  height: 90px;
  width: 90px;
  bottom: 5px;
  right: 28%;
  z-index: 2;
  cursor: pointer;
  background: url('../../../assets/img/gisModule/gisLayerPanel/monitorIcon.png')
    no-repeat center / 100% 100%;
  &:hover {
    background: url('../../../assets/img/gisModule/gisLayerPanel/monitorIconActive.png')
      no-repeat center / 100% 100%;
  }
}
.ns-popup-container {
  position: absolute;
  z-index: 300;
  top: 0;
  margin-top: 115px;
  margin-left: 77px;
}
.tuliiiili {
  position: absolute;
  bottom: 90px;
  right: 30px;
  pointer-events: initial;
}
.tuliiiili.tuliiiili_li {
  bottom: 83px;
  right: 509px;
}
.layoutMain {
  height: 100%;
  position: relative;
}
#aidDecisionMakingLayoutMain {
  height: 100%;
  position: relative;
}
.map-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.cmp-legend-wrap {
  position: absolute;
  left: 10px;
  bottom: 65px;
  width: 170px;
}
.coordinate-box.coordinate-box_left {
  left: 80px;
}
.coordinate-box {
  position: absolute;
  bottom: 5px;
  left: 75px;
  pointer-events: initial;
  z-index: 1;
}

.search-tool-containerNomal.search-tool-containerNomal_reset {
  right: 305px;
}
.search-tool-container.search-tool-containerNomal_reset {
  right: 185px;
}
.search-tool-container {
  height: 42px;
  position: absolute;
  right: 610px;
  // top: 23px;
  top: 27px;
  // top: 27px;
  // z-index: 100;
  z-index: 3;

  cursor: pointer;
}
.search-tool-containerNomal {
  height: 42px;
  position: absolute;
  right: 729px;
  top: 27px;
  z-index: 4;
  vertical-align: middle;
  cursor: pointer;
}

.district-select-btn {
  display: inline-block;
  // border-radius:5px;
  // border: 1px solid #41c1ff;
  // box-shadow: inset 5px 2px 10px 5px
  // rgba(116, 143, 156, 0.3);
  // background: rgba(22,94,177,0.7);
  background: url(../../../assets/img/layout/location_weather.png) no-repeat;
  background-size: 100% 100%;
  text-align: center;
  padding: 0px 10px;
  color: #d0e5f5;
  // margin-top: 10px;
  box-sizing: border-box;
  height: 60px;
  line-height: 60px;
  // width: 159px;
  padding: 0 20px;
  box-sizing: border-box;
  span:after {
    content: '';
    width: 9px;
    height: 6px;
    display: inline-block;
    background: url(../../../assets/img/layout/xiasanjiao.png) no-repeat;
    background-size: 100% 100%;
    margin-left: 5px;
  }
  span:before {
    content: '';
    width: 14px;
    height: 17px;
    display: inline-block;
    background: url(../../../assets/img/layout/location.png) no-repeat;
    background-size: 100% 100%;
    margin-right: 5px;
  }
}
.buffer-query-btn {
  display: inline-block;
  /*background: #fff;*/
  /*border-radius:7px;*/
  /*  border: 1px solid #41c1ff;*/
  /*  box-shadow: 5px 2px 10px 5px*/
  /*  rgba(65,193,255, 0.3);*/
  /*  background: rgba(22,94,177,0.7);*/
  // height: 100%;
  text-align: center;
  vertical-align: middle;
  padding: 0px 10px 0 0px;
}
.district-select-panel {
  z-index: 100;
  right: 474px;
  top: 145px;
  left: auto;
}
// 更新需求-多选
.city-select-panel {
  position: fixed;
  z-index: 2;
  right: 24px;
  top: 160px;
  left: auto;
}

.nearby-query-panel.nearby-query-panel_left {
  right: 85px;
}
.nearby-query-panelNomal.nearby-query-panel_left {
  right: 85px;
}
.nearby-query-panel {
  width: 420px;
  height: 292px;
  z-index: 100;
  // right: 490px;
  left: 452px;
  background: url(../../../assets/img/bufferquery/bg.png) no-repeat;
  background-size: 100% 100%;
}
.nearby-query-panelNomal {
  width: 420px;
  height: 292px;
  z-index: 100;
  right: 490px;
  left: auto;
  background: url(../../../assets/img/bufferquery/bg.png) no-repeat;
  background-size: 100% 100%;
}
.hwsx-as-prop {
  position: absolute;
  width: 470px;
  top: 220px;
  left: 720px;
  color: #fff;
  z-index: 2;
}
.onlineBox {
  position: fixed;
  top: 136px; // develop分支上的样式
  right: 20px;
  z-index: 20;
  display: flex;
}
</style>
