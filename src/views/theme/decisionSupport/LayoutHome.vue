<template>
  <!-- <div class="layout-grid-3cols" :class="[!mapFullBig ? 'gisScreen-full '   : ' ']"> -->
  <div class="layout-grid-3cols">
    <!-- <div style="position:absolute;left:0;right:0;bottom:0;top:90px;background-color:red;z-index:5 "></div> -->
    <!---暂时注释，联调时放开-->
    <!-- <gis-plot ref="gisPlot" :options="plotOptions"></gis-plot> -->
    <!-- <el-button
      type="button"
      @click="switchModelNormal('unNormal')"
      style="position:absolute;z-index:2;left:900px;top:0px;"
    >切换</el-button> -->
    <!-- 切换皮肤按钮 start -->
    <div class="skinSwitch-btn" v-if="false" @click="swithSkin()">
      <span class="skinSwitch-btn-img"></span>
    </div>
    <!-- 切换皮肤按钮 end -->

    <!-- 全屏/3分之一屏，2分之一屏，点击按钮 start -->
    <!-- <div type="button" class="gisScreen-box">
      <template v-if="mapFullBig">
        <span class="gisScreen-box_btn--3rd" @click="switchGisScreen('3rd')"></span>
        <span class="gisScreen-box_btn--2rd" @click="switchGisScreen('2rd')"></span>
      </template>
      <span
        :class="[!mapFullBig ? 'gisScreen-box_btn' : 'gisScreen-box_btnFull']"
        @click="swithModel"
      ></span>
    </div> -->
    <!-- 全屏点击按钮 end -->
    <div class="cols3_1" v-show="mapFullBig" v-if="false">
      <!--left start
      <layout-sidebar></layout-sidebar>-->
      <components :is="leftComponent"></components>
      <!--left end-->
    </div>
    <!-- 地图打印预览 -->
    <PreviewPrint v-if="mapPrintPreviewFlag" :data="previewPrintData" @closePrintPreviewEmit="closePrintPreviewEmit"></PreviewPrint>
    <!-- 点击视频 地图预览 -->
    <template>
      <VideoPreview v-if="previewVideoShow" :previewUrl="previewVideoUrl" @previewVideoEmit="previewVideoEmit"></VideoPreview>
    </template>

    <!-- 天眼iframe弹框 -->
    <DayEye v-if="dayEyeShow" @dayEyeShowEmit="dayEyeShowEmit" :iframeSrc="iframeSrc" :styleObj="styleObj"></DayEye>
    <!--main start-->
    <div class="cols3_2">
      <div class="main-map-box-bg"></div>
      <div class="main-map-box-bg2"></div>
      <!-- 地图容器 -->
      <div class=""></div>
      <div class="main-map-box-bg2"></div>
      <!-- 地图容器 -->
      <div class="main-map-box">
        <layout-main ref="layoutMain"></layout-main>
        <!-- 预警信息详情页  -->
        <ListEarlyWarninginfo ref="listEarlyWarninginfoBox" :type="earlyWarninginfo.type" :earlyWarninginfo="earlyWarninginfo"></ListEarlyWarninginfo>
        <!-- 地图两边的动画start -->
        <div class="animate-map-door animate-map-door1" v-show="mapFullBig"></div>
        <div class="animate-map-door animate-map-door2" v-show="mapFullBig"></div>
        <div class="animate-bottom-flash" v-show="mapFullBig"></div>
        <!-- 地图两边的动画end -->
        <!-- 指挥调度图片与视频弹出框 start  -->
        <DialogCommandDispatch></DialogCommandDispatch>
        <!-- 指挥调度图片与视频弹出框 end -->
        <!-- 余震 -->
        <Aftershock v-if="aftershockShow" @aftershockShowEmit="aftershockShowEmit"></Aftershock>
        <!-- 搜索框 -->
        <!-- <SearchBox></SearchBox> -->
        <!-- 距离量测弹框 -->
        <!-- 互联网情报-->
        <InternetIntelligence :pictures="pictures" v-if="picturesShow"></InternetIntelligence>

        <!-- 地图打印 -->
        <!-- <MapPrint v-if="mapPrintFlag"></MapPrint> -->
        <!-- 应急物资tab,弹出框内容 start -->
        <!-- <div style="position:absolute;left:15%; bottom:36px;width:1000px;"> -->
          <EmergencyResourcesList :emerencyResourcesNum="emerencyResourcesNum" :isShow="visibleFlag" v-if="visibleFlag"></EmergencyResourcesList>
        <!-- </div> -->
        <!-- 应急物资tab,弹出框内容 end -->
        <!-- 工具条的组件-->
        <GisMapUtil @getToolCount="getToolCount" />
        <!-- 经验圈设置 -->
        <div v-if="updateExperienceCircleObj.isShow" class="update_experienceCircleSetting_wrap" :style="UpdateExperienceCircleSettingLeft">
          <UpdateExperienceCircle></UpdateExperienceCircle>
        </div>
        <!--  首页天气      -->
        <div v-if="false" :class="isWeatherRight ? 'weatherdqskright' : 'weatherdqsk'" :style="{ right: weatherPanelRight }">
          <WeatherToday v-if="$store.state.eventPushStore.eventId && isShowWeather" @changeOtherEvent="changeOtherEvent"></WeatherToday>
        </div>
        <div class="weatherMore">
          <WeatherMore v-if="$store.state.eventPushStore.eventId && isShowWeatherMore" :adminCodeChn="adminCodeChn" :weatherList="weatherList" @closeWeatherMorePanel="closeWeatherMorePanel"></WeatherMore>
        </div>
        <!-- <template v-if="!normalState"> &lt;!&ndash;   地图上左侧列表,移动到 layoutMain   &ndash;&gt;
          &lt;!&ndash; 显示推送 工具条 &ndash;&gt;
          <div style="position:absolute;top:9%;right:3%;">
            &lt;!&ndash; <ToolMore
              :toolMoreConfigData="unNormalMapObj.toolMoreConfigData"
              @clickHandler="clickToolItemPush"
            ></ToolMore>&ndash;&gt;
          </div>
          &lt;!&ndash; 点击工具条之后的地图弹窗组件 &ndash;&gt;
          <components :is="unNormalMapObj.maptoolBtnMapComponent"></components>
        </template>-->
        <!-- 热力图图例start -->
        <!-- <div style="position:absolute;bottom:90px;right:30px;pointer-events: initial;">
          <LegendPlanel v-if="!normalState"></LegendPlanel>
        </div>-->
        <!-- 热力图图例end-->
      </div>
      <!-- <div style="position:absolute;top:9%;right:6%">
        <gis-map-resource @isShowPopupResouce="isShowPopupResouce" ref="childHideResource"></gis-map-resource>
      </div>-->
      <gis-map-resouce-popup v-if="gisResoucePopupShow" @isHidePopupResouce="isHidePopupResouce"></gis-map-resouce-popup>
      <!-- <div style="position:absolute;top:9%;right:10%">
        <ToolEventOverview></ToolEventOverview>
      </div>
      <div style="position:absolute;top:9%;right:14%">
        <ToolCompared></ToolCompared>
      </div>-->

      <template v-if="false">
        <!--nva文件勿删-->
        <div class="nav-box" v-show="!$store.state.controlMoudle.screen2rdFlag">
          <Nav @clickNavItem="clickNavItem"></Nav>
        </div>
      </template>
    </div>

    <!--main end-->
    <div class="cols3_3" v-show="mapFullBig">
      <!--right start
            <layout-assist></layout-assist>
      -->
      <components :is="rigthComponent"></components>
      <!--right end-->
    </div>

    <!-- 地图上工具条在右侧的弹出框 开始 v-if="!normalState" -->
    <div class="popupAssist-wrap">
      <components :is="unNormalMapObj.maptoolBtnRightComponent"></components>
    </div>
    <!-- 地图上工具条在右侧的弹出框 结束-->

    <!-- 视频监控右侧弹窗 开始 -->
    <div class="popupAssist-wrap" style="z-index:4">
      <components :is="videoMonitorComponent.name" :tempData="videoMonitorComponent.tempData"></components>
    </div>
    <!-- 视频监控右侧弹窗 结束-->

    <!-- 企业详情 -->
    <CompanyDetail v-if="companyDetailType !== ''" :companyDetailData="companyDetailData" :companyDetailType="companyDetailType"></CompanyDetail>

    <!-- 常态左侧 值班信息table -->
    <ManagementTab />
    <!-- 打电话面板 -->
    <Callup v-if="callupObj.showFlag" :sourceObj="callupObj"></Callup>

    <!-- 灾情统计弹窗 -->
    <StatisticsBox v-if="showFlag" :compParam="dialogData" :compParamData="dialogData1"></StatisticsBox>
    <!-- 企业视频弹窗 -->
    <!-- <companyVideo></companyVideo> -->
    <!-- <div class="popupAssist-wrap" style="z-index:4">
      <components :is="companyVideoComponent.name" :tempData="companyVideoComponent.tempData"></components>
    </div> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import layoutAssist from '@/views/theme/decisionSupport/LayoutAssist.vue';
import layoutMain from '@/views/theme/decisionSupport/LayoutMain.vue';
import layoutSidebar from '@/views/theme/decisionSupport/LayoutSidebar.vue';
import { messsageBus } from '@/util/message';
import Nav from '@/views/theme/decisionSupport/common/Nav.common.vue';
// import LeftUnNormal from '@/views/theme/decisionSupport/unNormal/LeftUnNormal.vue';
// import RightUnNormal from '@/views/theme/decisionSupport/unNormal/RightUnNormal.vue';
// 灾损统计
import RightCensus from '@/views/theme/decisionSupport/unNormal/RightCensus.vue';
// 人员密集场所等 右侧公用面板
import StudyAndJudgmentOfaPicture from '@/components/feature/StudyAndJudgmentOfaPicture/StudyAndJudgmentOfaPicture.vue';
// 救援进展 右侧列表
import RightEvolve from '@/views/theme/decisionSupport/unNormal/RightEvolve.vue';
// 救援救助 右侧列表
import RightHelp from '@/views/theme/decisionSupport/unNormal/RightHelp.vue';
// 地图工具箱（事件概况）(当地天气，舆情监控，互联网情报，测量工具，交通管制，道路损毁，回传图像，绿色通道)
import ToolEventOverview from '@/views/theme/decisionSupport/gisUI/ToolEventOverview.vue';
// 地图工具箱
import ToolCompared from '@/views/theme/decisionSupport/gisUI/ToolCompared.vue';
// 导航的地图工具箱
import ToolMore from '@/views/theme/decisionSupport/gisUI/ToolMore.vue';
// import LegendPlanel from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/LegendPanel.vue';
// 行政区划分布 右侧列表
import DistrictRightDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterDistrict/districtList.vue';
// 人口分布 右侧列表
import PopulationFeverList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PopulationFeverBox/PopulationFeverList.vue';
// 住宅区分布 右侧列表
import DisasterHouseList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHouse/DisasterHouseList.vue';
// 学校分布 右侧列表
import DisaterSchoolList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterSchool/DisasterSchoolList.vue';
// 医院分布 右侧列表
import DisasterHospitalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHospital/DisasterHospitalList.vue';
// 机场 右侧列表
import DisasterPlaneList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterPlane/DisasterPlaneList.vue';
// 码头分布 右侧列表
import DisasterWharfList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterWharf/DisasterWharfList.vue';
// 火车站分布 右侧列表
import DisasterTrainList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterTrain/DisasterTrainList.vue';
// 灾情预估分布 右侧列表
import DisasterPredictionBoxList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/DisasterPredictionBox/DisasterPredictionBoxList.vue';
// 京东物资储备库 右侧列表
import DisasterJdReserveList from '@/views/jdReserve/disasterJdReserveList.vue';
// 救援队分布 右侧列表
import DisasterRescueTeamsList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterRescueTeamsList.vue';
// 应急管理机构分布 右侧列表
import DisasterEmergencypartList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterEmergencypart/DisasterEmergencypartList.vue';
// 船舶信息分布 右侧列表
import DisasterShipList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterShip/DisasterShipLIst.vue';
// 危化企业分布 右侧列表
import DisasterCompanyList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCompany/DisasterCompanyList.vue';
// 煤矿企业分布 右侧列表
import DisasterCoalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCoal/DisasterCoalList.vue';
// 非煤企业分布 右侧列表
import DisasterNoCoalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNoCoal/DisasterNoCoalList.vue';
// 烟花爆竹分布 右侧列表
import DisasterFireworksList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterFireworks/DisasterFireworksList.vue';
// 工贸企业分布 右侧列表
import DisasterIndusterList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterIndustry/DisasterIndustryList.vue';
// 地质灾害隐患点分布 右侧列表
import DisasterGeologyList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterGeology/DisasterGeologyList.vue';
// 水库大坝分布 右侧列表
import DisasterReservoirList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterReservoir/DisasterReservoirList.vue';
// 核设施分布 右侧列表
import DisasterNucleusList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNucleus/DisasterNucleusList.vue';
// 灾情信息员分布 右侧列表
import DisasterMessengerList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMessenger/DisasterMessengerList.vue';
// 资源查询组件
import gisMapResoucePopup from '@/views/theme/decisionSupport/gisUI/gisMapResoucePopup.vue';
// 常态工具条最右侧按钮(暂时没用)
import GisMapResource from '@/views/theme/decisionSupport/gisUI/GIsMapResource.vue';
// 应急资源列表
import EmergencyResourcesList from '@/views/theme/decisionSupport/module/normalLeft/emergencyResourcesList.vue';
// 指挥调度 右侧面板
import CommandDispatchView from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/CommandDispatch.vue';

const globalPath = require('../../../config/index.js');
import publishObjectPath from '@/util/configRegistry';
// 救援救助组件
// 指挥调度
import CommandDispatch from '@/views/theme/decisionSupport/module/gisModule/rescueAid/commandDispatch/CommandDispatch.vue';
/**
 * 标绘工具箱参数
 */
// import gisPlot from '@/components/feature/GIS/GisPlot/GisPlot.vue';
// 新闻报道点击地图播放
import VideoPreview from '@/components/feature/videoPreview/VideoPreview.vue';
// 预警信息
import ListEarlyWarninginfo from '@/components/feature/gisModule/list/ListEarlyWarninginfo.vue';
// 工具条
import GisMapUtil from '@/components/feature/gisModle/gisMapTool/GisMapUtil.vue';
// 天眼弹框
import DayEye from '@/components/feature/dayEye/DayEye.vue';
// 指挥调度图片与视频的弹出框
import DialogCommandDispatch from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/dialog/DialogCommandDispatch.vue';
// 余震弹框
import Aftershock from '@/components/feature/aftershock/Aftershock.vue';
// 互联网情报
import InternetIntelligence from '@/components/feature/earthquake/internetIntelligence/InternetIntelligence.vue';
// 地图打印
import MapPrint from '@/components/feature/mapPrint/MapPrint.vue';
// 地图打印预览弹框
import PreviewPrint from '@/components/feature/mapPrint/PreviewPrint.vue';

// 灾损统计地图弹窗右侧
import CasualtiesRight from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/casualties/CasualtiesRight.vue';
// 房屋损毁地图弹窗右侧
import HousesDamagedRight from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/housesDamaged/HousesDamagedRight.vue';
// 电力受损地图弹窗右侧
import ElectricDamagedRight from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/electricDamaged/ElectricDamagedRight.vue';
// 失联区域地图弹窗右侧
import MissingFlightRight from '@/views/theme/decisionSupport/module/gisModule/damageStatistics/missingFlightNew/MissingFlightRight.vue';
// 调度部署右侧 救援救助
import DeploymentRight from '@/views/theme//decisionSupport/module/gisModule/rescueAid/deployment/DeploymentRight.vue';
// 救援需求 右侧列表 救援救助
import RescueDemandRight from '@/views/theme//decisionSupport/module/gisModule/rescueAid/rescueDemand/RescueDemandRight.vue';
// 绿色通道 右侧
import GreenRoadRight from '@/views/theme/decisionSupport/module/gisModule/otherTool/greenRoad/greenRoadRight.vue';
// 道路损毁 右侧列表
import RoadDamageRight from '@/views/theme/decisionSupport/module/gisModule/otherTool/roadDamage/roadDamageRight.vue';
// 交通管制 右侧列表
import TraffivControlRight from '@/views/theme/decisionSupport/module/gisModule/otherTool/trafficControl/trafficControlRight.vue';
// 调拨建议 右侧列表 救援救助
import DispatchAdviceRightBox from '@/views/theme/decisionSupport/module/gisModule/rescueAid/dispatchAdvice/DispatchAdviceRightBox.vue';
// import SearchBox from '@/components/feature/searchBtnList/SearchBox.vue';
// 非常态右侧 视频监控右侧弹窗
import videoMonitor from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/dialogVideoMonitor/videoMonitor.vue';
// 待安置左侧列表 救援救助
import Shleter from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/Shleter.vue';
// 安置点右边弹框 救援救助
import ShelterRight from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/ShleterRight.vue';
// 企业详情
import CompanyDetail from '@/components/feature/common/companyDetail/CompanyDetail.vue';
// 值班信息 table
import ManagementTab from '@/components/feature/managementOnDuty/ManagementTab.vue';

// 打电话面板
import Callup from '@/components/feature/gisModule/callup/Callup.vue';
// 灾情研判 工具条
import DisasterDecide from '@/views/disasterDecide/disasterDecide.vue';

// 经验圈设置
import UpdateExperienceCircle from '@/components/feature/updateExperienceCircle/UpdateExperienceCircle.vue';
// 气象信息
import WeatherToday from '@/components/feature/common/weatherDisasterArea/weatherDQSK/WeatherToday.vue';
import WeatherMore from '@/components/feature/common/weatherDisasterArea/weatherDQSK/WeatherMore.vue';
import StatisticsBox from '@/components/feature/flood/DisasterStatistics/StatisticsBox.vue';
// 引入企业视频组件
// import CompanyVideoA from '@/components/feature/forestFire/operationalDeployment/CompanyVideoA.vue';

@Component({
  name: 'DecLayoutHome',
  components: {
    layoutAssist,
    layoutMain,
    layoutSidebar,
    Nav,
    // LeftUnNormal,
    RightCensus,
    StudyAndJudgmentOfaPicture,
    // RightUnNormal,
    RightHelp,
    RightEvolve,
    // LegendPlanel,
    ToolEventOverview,
    ToolCompared,
    ToolMore,
    DistrictRightDialog, // 行政区划分布 右侧列表
    GisMapResource, // 未知
    gisMapResoucePopup,
    EmergencyResourcesList,
    VideoPreview,
    ListEarlyWarninginfo,
    GisMapUtil, // gis地图工具存放的容器 - All
    DayEye,
    Aftershock,
    InternetIntelligence,
    PopulationFeverList, // 人口分布右侧列表
    DisasterHouseList, // 住宅区右侧列表
    DisaterSchoolList, // 学校分布右侧列表
    DisasterHospitalList,
    DisasterPlaneList,
    DisasterWharfList,
    DisasterTrainList,
    DisasterPredictionBoxList,
    DisasterJdReserveList, // 京东物资储备库 右侧列表
    DisasterRescueTeamsList,
    DisasterEmergencypartList,
    DisasterShipList,
    DisasterCompanyList,
    DisasterCoalList,
    DisasterNoCoalList,
    DisasterFireworksList,
    DisasterIndusterList,
    DisasterGeologyList,
    DisasterReservoirList,
    DisasterNucleusList,
    DisasterMessengerList,
    CommandDispatch,
    // SearchBox,
    CasualtiesRight, // 灾损统计人员伤亡地图右侧弹窗
    HousesDamagedRight, // 灾损统计房屋损毁地图右侧弹窗
    MissingFlightRight, // 灾损统计失联区域地图右侧弹窗
    ElectricDamagedRight, // 灾损统计电力受损地图右侧弹窗
    GreenRoadRight,
    RoadDamageRight,
    TraffivControlRight,
    MapPrint,
    PreviewPrint,
    CommandDispatchView,
    DialogCommandDispatch,
    DeploymentRight, // 调度部署右侧
    videoMonitor, // 非常态右侧 视频监控弹出层
    RescueDemandRight,
    ShelterRight,
    DispatchAdviceRightBox, // 调拨建议右侧弹窗
    CompanyDetail, // 企业详情
    ManagementTab, // 值班信息表
    Callup, // 打电话面板
    DisasterDecide,
    Shleter, // 待安置左侧列表
    UpdateExperienceCircle, // 经验圈设置
    WeatherToday, // 首页天气详情
    WeatherMore, // 更多气象信息
    StatisticsBox, // 灾情统计弹窗
    // CompanyVideoA, // 企业视频
  },
})
export default class DecLayoutHome extends Vue {
  private companyDetailData: any;
  private companyDetailType: any = '';
  private earlyWarninginfo = {};
  private isLocalWeather: any = '';
  private UpdateExperienceCircleSettingLeft: any = '';
  private showFlag = false;
  private dialogData: any;
  private dialogData1: any;
  private DisasterShow = false;
  private disasterData = false;
  // 打电话的对象
  private callupObj: any = {
    showFlag: false,
    listObj: {},
    telVal: '',
    telEvent: {},
    telName: '',
  };
  // 当前的样式状态变量。
  // 视频播放变量
  private previewVideoShow = false;
  private dayEyeShow = false;
  private aftershockShow = false;
  private previewVideoUrl: any;
  private iframeSrc: any;
  private styleObj: any;
  private picturesShow: boolean = false;
  private mapPrintFlag: boolean = false;
  private mapPrintPreviewFlag: boolean = false;
  private localWeatherData: any = '';
  // 地图打印预览参数
  private previewPrintData: any = {};
  private pictures: any = [];
  // 标绘
  private plotShow = false;
  // 地图全屏的变量控制
  private mapFullBig = true;
  // 地图二分之一屏的控制
  private mapScreenHalf = true;
  private normalState = true; // 代表处于常态
  private gisResoucePopupShow = false;
  private unNormalMapObj = {
    maptoolBtnRightComponent: '', // 点击工具条 弹出的右侧组件
    maptoolBtnMapComponent: '', // 点击工具条 弹出的地图组件
    toolMoreConfigData: '', // push的那个工具条的数据
  };
  // 获取搜索框弹窗数据的条件

  // 对比变量存储
  private dataArr: any = [];
  // 搜索框弹窗显隐
  private visibleFlag = false;
  private emerencyResourcesNum: any = null; // // 常态左侧 应急资源
  private isShowWeather: boolean = false; // 是否展示天气条
  private isShowWeatherMore: boolean = false; // 是否展示更多气象信息
  private isWeatherRight: boolean = false; // 是否有右侧菜单
  private adminCodeChn: any = ''; // 气象传来的行政区划编码给气象详情用
  private weatherList: any = ''; // 气象数据
  private flagData = '';
  private getToolCountCache: any = 0; // 缓存工具条显示的个数
  // 视频监控右侧弹窗
  private videoMonitorComponent: any = {
    name: '',
    tempData: {},
  };
  // 企业视频右侧弹窗
  private companyVideoComponent: any = {
    name: '',
    tempData: {},
  };

  // 控制经验圈设置的显隐
  private updateExperienceCircleObj: any = {};

  //
  private visibleFlagType = '';

  // 天气样式位置
  private weatherPanelRight: string = '0';

  private getToolCount(count: any) {
    this.getToolCountCache = count;
    this.weatherPanelRight = count * 2.6042 + '%';
  }

  get rigthComponent() {
    return this.$store.state.layoutModule.right;
  }
  get leftComponent() {
    return this.$store.state.layoutModule.left;
  }

  // 点击战时的导航条 // 暂时没有用
  /*private clickNavItem(toolConfig: any) {
    // push 工具条数据
    this.unNormalMapObj.toolMoreConfigData = toolConfig;
  }*/

  // 监听bus显示隐藏企业详情组件
  private watchCompanyDetail() {
    // this.messsageBus.off('companyDetailData');
    this.messsageBus.on('companyDetailData', (data: any, type: any) => {
      this.companyDetailData = data;
      this.companyDetailType = type;
    });
  }

  @Watch('$store.state.eventPushStore.eventId') // 监听到 对应 eventId 变化，切换到战时屏
  private switchModelNormal(eventId: string) {
    var type = '';
    if (eventId) {
      // 战时
      type = 'unNormal';
      this.normalState = false;
      this.$store.commit('layoutModule/setChange', type); // 会废掉
    } else {
      // 常态
      this.normalState = true;
    }
  }
  // 监听是否是森火专题，是的话展示顶部天气的栏目
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private watchWaterSystemKeySwitch(): void {
    const eventType: number | string = this.$store.state.eventPushStore
      .eventLocation.EventType;
    // if ( (eventType === 9) || (eventType === '9')) {
    if (
      !this.$store.state.panelMutualExclusionMudule.panelMutualExclusion
        .largeRightPanel.showFlag
    ) {
      this.isShowWeather = true;
      this.isWeatherRight = false;
    }
    // }
    // else {
    //   this.isShowWeather = false;
    //   this.isShowWeatherMore = false;
    // }
  }
  // 监听左侧面板，与气象面板互斥
  @Watch('$store.state.panelMutualExclusionMudule.panelMutualExclusion', {
    deep: true,
  })
  private changelargeRightPanel(val: any) {
    if (this.isShowWeatherMore && val.largeLeftPanel.showFlag) {
      this.isShowWeatherMore = false;
    }
  }
  //  在森火专题下切换事件气象信息回到初始位置
  private changeOtherEvent() {
    this.isWeatherRight = false;
  }
  private isShowPopupResouce() {
    this.gisResoucePopupShow = true;
  }
  private isHidePopupResouce() {
    (this.$refs as any).childHideResource.hideResourcefn();
    this.gisResoucePopupShow = false;
  }
  // 切换主题的方法 静态方法
  private swithTheme() {
    const tempTheme = localStorage.getItem('defaultTheme') || 'fuzhujuece';
    if (tempTheme === 'fuzhujuece') {
      // 当前的  fuzhujuece
      localStorage.setItem('defaultTheme', 'darkGreen');
    } else {
      // 当前的  darkGreen
      localStorage.setItem('defaultTheme', 'fuzhujuece');
    }
    location.reload();
    location.href = globalPath.jsonPath;
  }
  // 切换body的皮肤样式;
  private swithSkin() {
    const $oBody = $($('html#father body')[0]);
    if ($oBody.hasClass('skin-darkgreen')) {
      $oBody.removeClass('skin-darkgreen').addClass('skin-default');
    } else {
      $oBody.removeClass('skin-default').addClass('skin-darkgreen');
    }
  }

  // 视频弹窗关闭
  private previewVideoEmit() {
    this.previewVideoShow = false;
    this.messsageBus.emit('miniScreen', this.previewVideoUrl);
  }
  // 天眼弹窗关闭
  private dayEyeShowEmit() {
    this.dayEyeShow = false;
    this.messsageBus.emit('ToolCompared', 'tianyan', false);
    this.messsageBus.emit('ToolCompared', 'publicOpinionMonitor', false);
    this.messsageBus.emit('ToolCompared', 'imageContrast', false);
  }

  // 关闭指挥调度的弹出框
  private closeDialogCommandDispatch() {
    this.messsageBus.emit('closeDialog', false);
  }
  // 关闭预览
  private closePrintPreviewEmit(val: any) {
    this.mapPrintPreviewFlag = val.isShow;
  }
  // 余震弹框关闭
  private aftershockShowEmit() {
    this.aftershockShow = false;
  }
  // 关闭气象数据弹框
  private closeWeatherMorePanel(val: any) {
    this.isShowWeatherMore = val;
  }
  // 设置经验圈面板的位置
  @Watch('$store.state.panelPositionChangeModule.topToolbarLocation', {
    deep: true,
  })
  private experienceCirclePositionFun() {
    this.UpdateExperienceCircleSettingLeft = this.$store.state.panelPositionChangeModule.topToolbarLocation.experienceCirclePosition;
  }
  private created() {
    this.experienceCirclePositionFun(); // 设置经验圈面板的位置
    // messsageBus.$off('POPULATIONFEVE');
    messsageBus.$on('POPULATIONFEVE', () => {
      this.normalState = false;
      this.$store.commit('layoutModule/setChange', 'unNormal');
    });
    // this.messsageBus.on('surroundingWeathers', (data: any) => {
    //   this.isLocalWeather = 'LocalWeather';
    // })
    //
    this.watchCompanyDetail();
    // 常态左侧 应急资源
    // this.messsageBus.off('clickEmerencyResourcesNum');
    this.messsageBus.on(
      'clickEmerencyResourcesNum',
      (data: any, isShow: boolean) => {
        this.visibleFlag = isShow;
        /**
         * 判断是不是显示弹窗 显示获取最新数据 不显示 清空查询条件 模板内不查询
         * */
        this.emerencyResourcesNum = isShow ? data : null;
      },
    );
    // messsageBus.$on('clickINumber', (data: any) => {
    //   this.visibleFlag = false;
    // });
    // 点击视频弹窗
    // this.messsageBus.off('SsspPreview');
    this.messsageBus.on('SsspPreview', (data: any) => {
      this.previewVideoShow = true;
      this.previewVideoUrl = data;
    });
    // 预警信息弹窗
    // this.messsageBus.off('listEarlyWarninginfoEmit');
    this.messsageBus.on('listEarlyWarninginfoEmit', (data: any) => {
      const that = this;
      that.earlyWarninginfo = data;
    });
    // 天眼弹窗
    // this.messsageBus.off('dayEyeShowEmit');
    this.messsageBus.on('dayEyeShowEmit', (data: any) => {
      this.dayEyeShow = data.isOpen;
      this.iframeSrc = data.url;
      this.styleObj = data.styleObj;
    });
    // 这里原来是事件信息进入专题，现在改为通过监听事件id
    // this.messsageBus.on('EventInfoPreview', (data: any) => {
    //   this.switchModelNormal('unNormal');
    // });
    // 关闭弹窗
    // this.messsageBus.on('handleClickClosedPanel', (data: any) => {
    //   this.visibleFlag = !data;
    // });
    /* 标绘 */
    // this.messsageBus.off('plotShowEvent');
    this.messsageBus.on('plotShowEvent', (data: any) => {
      this.plotShow = true;
    });
    // 互联网监控
    // this.messsageBus.off('internetEvent');
    this.messsageBus.on('internetEvent', (data: any) => {
      this.picturesShow = data.isShow;
      this.pictures = data.data;
    });
    // 余震弹框
    // this.messsageBus.off('aftershockShowEmit');
    this.messsageBus.on('aftershockShowEmit', (data: any) => {
      this.aftershockShow = data;
    });
    // 地图打印
    // this.messsageBus.off('mapPrintEmit');
    this.messsageBus.on('mapPrintEmit', (data: any) => {
      this.mapPrintFlag = data.isShow;
      if (!this.mapPrintFlag) {
        this.messsageBus.emit('commonTools', 'mapPrint', true);
      }
    });
    // 地图打印预览
    // this.messsageBus.off('printPreviewEmit');
    this.messsageBus.on('printPreviewEmit', (data: any) => {
      this.mapPrintPreviewFlag = data.isShow;
      this.previewPrintData = data.data;
    });
    // 视频监控右侧弹窗接收事件
    // this.messsageBus.off('openVideoMonitor');
    this.messsageBus.on('openVideoMonitor', (name: any, tempData: any) => {
      this.videoMonitorComponent.name = name;
      this.videoMonitorComponent.tempData = tempData;
    });
    // 企业视频监控右侧弹窗接收事件
    // this.messsageBus.on('openCompanyVideopop', (name: any, tempData: any) => {
    //   // console.log(tempData);
    // });

    // 弹出打电话面板
    // flag 是否显示面板
    // listobj 源数据对象
    // val 电话号码
    // 事件源
    // this.messsageBus.off('showCallup');
    this.messsageBus.on(
      'showCallup',
      (flag: boolean, listObj: any, val: any, event: any, name: any) => {
        // console.log('ssss', this.callupObj);
        this.callupObj.showFlag = flag;
        this.callupObj.telObj = listObj;
        this.callupObj.telVal = val;
        this.callupObj.telEvent = event;
        this.callupObj.telName = name;
      },
    );
    // 测试行政区划
    // this.messsageBus.off('DisasterDecideRigth');
    this.messsageBus.on('DisasterDecideRigth', (right: any, left: any) => {
      // 给layoutMain发送左侧面板组件名称
      this.messsageBus.emit('maptoolBtnMapComponent', left);
      // this.unNormalMapObj.maptoolBtnMapComponent = left ;
      this.unNormalMapObj.maptoolBtnRightComponent = right;
    });

    // this.messsageBus.off('updateExperienceCircle');
    this.messsageBus.on('updateExperienceCircle', (stateObj: any) => {
      this.updateExperienceCircleObj = stateObj;
    });

    this.messsageBus.on(
      'DisasterOpen',
      (showFlag: any, item: any, item1: any) => {
        this.showFlag = showFlag;
        this.dialogData = item;
        this.dialogData1 = item1;
      },
    );
    this.messsageBus.on('DisasterOpentuli', (showFlag: any, item: any) => {
      this.DisasterShow = showFlag;
      this.disasterData = item;
    });
    // 右侧面板展开天气条收起
    // this.messsageBus.off('weatherPanelHide');
    this.messsageBus.on('weatherPanelHide', (data: any) => {
      const eventType: number | string = this.$store.state.eventPushStore
        .eventLocation.EventType;
      // if ( (eventType === 9) || (eventType === '9')) {
      this.isShowWeather = data;
      this.isWeatherRight = true;
      // }
    });
    // this.messsageBus.off('weatherPanelOpen');
    this.messsageBus.on('weatherPanelOpen', (data: any) => {
      const eventType: number | string = this.$store.state.eventPushStore
        .eventLocation.EventType;
      this.isShowWeather = data;
      this.isWeatherRight = false;
      if (data) {
        if (eventType === 8 || eventType === '8') {
          this.weatherPanelRight = 13 + '%';
        } else {
          // this.weatherPanelRight = 10.6 + '%';
          this.weatherPanelRight = this.getToolCountCache * 2.6042 + '%';
        }
      }
    });
    // 如果在森火专题下，右侧窗口全部关闭则气象气息打开，否则关闭
    // this.messsageBus.off('isShowWeatherRight');
    this.messsageBus.on('isShowWeatherRight', (data: any) => {
      const eventType: number | string = this.$store.state.eventPushStore
        .eventLocation.EventType;
      this.isShowWeather = data;
      this.isWeatherRight = true;
      if (data) {
        if (eventType === 8 || eventType === '8') {
          this.weatherPanelRight = 16.8 + '%';
        } else {
          // this.weatherPanelRight = 14 + '%';
          this.weatherPanelRight = (this.getToolCountCache * 2.6042 + 4) + '%';
        }
      }
    });
    this.messsageBus.on(
      'queryWeatherMore',
      (isShow: any, code: any, list: any) => {
        this.isShowWeatherMore = isShow;
        this.adminCodeChn = code;
        this.weatherList = list;
      },
    );
    this.messsageBus.on('EventInfoToTree', () => {
      this.isShowWeatherMore = false;
    });
  }
  /*private destroyed(): void {
    this.messsageBus.off('isShowWeatherRight');
    this.messsageBus.off('weatherPanelOpen');
    this.messsageBus.off('weatherPanelHide');
    this.messsageBus.off('updateExperienceCircle');
    this.messsageBus.off('DisasterDecideRigth');
    this.messsageBus.off('showCallup');
    this.messsageBus.off('openVideoMonitor');
    this.messsageBus.off('printPreviewEmit');
    this.messsageBus.off('mapPrintEmit');
    this.messsageBus.off('aftershockShowEmit');
    this.messsageBus.off('internetEvent');
    this.messsageBus.off('plotShowEvent');
    this.messsageBus.off('dayEyeShowEmit');
    this.messsageBus.off('listEarlyWarninginfoEmit');
    this.messsageBus.off('SsspPreview');
    this.messsageBus.off('clickEmerencyResourcesNum');
    messsageBus.$off('POPULATIONFEVE');
    this.messsageBus.off('companyDetailData');
  }*/
}
</script>
<style>
@import url("../../../assets/css/animateSelf.css");
</style>
<style lang="less">
@import url("../../../assets/css/theme.default.less");
</style>
<style lang="less" scoped>
@import url("../../../assets/css/decisionSupport/LayoutHome.less");
.cols3_2 {
  z-index: 2;
}
.main-map-box {
  transition: all 2s;
  &.full,
  .main-map-box-bg2 {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
  }
}
.layoutMain {
  width: 100%;
  position: relative;
}
.update_experienceCircleSetting_wrap {
  position: absolute;
  top: 9%;
  right: 37.5%;
}
.weatherdqsk {
  position: absolute;
  z-index: 20;
  margin-right: 12px;
  top: 27px;
}
.weatherdqskright {
  position: absolute;
  z-index: 20;
  right: 14%;
  top: 27px;
}
.weatherMore {
  position: fixed;
  z-index: 20;
  left: 50%;
  top: 144px;
  transform: translateX(-50%);
}
</style>
