<template>
  <div class="halflist animated flipInY">
    <div class="loading" v-if="loading">
      <p class="title-panel" style="font-style:italic;">
        {{ sourceObj.title }}分布
      </p>
    </div>
    <span
      class="halflist-back"
      @click="removeHalflist"
      v-if="sourceObj.closed === false ? false : true"
    ></span>
    <div
      :class="{
        halfhide: loading,
        notShowTab: true
      }"
    >
      <component
        :is="tongjiComponent"
        ref="halfBox"
        :tabList="tabList"
        :sourceObj="sourceObj"
        :rescueTeamHomeData="paramObj"
      ></component>
      <div class="half-popupAssist-wrap" v-if="listComponent">
        <component
          :is="listComponent"
          :sourceObj="sourceObj"
          @queryHeightFn="queryHeightFn()"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// 人口分布 左侧面板
import PopulationFeverBox from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PopulationFeverBox/PopulationFeverBox.vue';
// 人口分布 右侧列表
import PopulationFeverList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PopulationFeverBox/PopulationFeverList.vue';
// 行政区划分布 左侧面板
import DistrictLeftDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterDistrict/districtStatistics.vue';
// 行政区划分布 右侧列表
import DistrictRightDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterDistrict/districtList.vue';

// 煤矿企业分布 左侧面板
import DisasterCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCoal/DisasterCoal.vue';
// 煤矿企业分布 右侧列表
import DisasterCoalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCoal/DisasterCoalList.vue';


// 金属非金属分布 左侧面板
import DisasteMetalnonmetalCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMetalnonmetal/DisasteMetalnonmetalCoal.vue';
// 金属非金属 右侧列表
import DisasteMetalnonmetalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMetalnonmetal/DisasteMetalnonmetalList.vue';


// 专家分布 左侧面板
import ExpiewertViewTotal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/ExpiewertView/ExpiewertViewTotal.vue';
// 专家 右侧列表
import ExpiewertViewList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/ExpiewertView/ExpiewertViewList.vue';


// 地震下工贸企业 左侧面板
import IndustryViewTotal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/IndustryView/IndustryViewTotal.vue';
// 地震下工贸企业 右侧列表
import IndustryViewList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/IndustryView/IndustryViewList.vue';


// 避难场所 左侧面板
import ShelterViewTotal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/ShelterView/ShelterViewTotal.vue';
// 专避难场所 右侧列表
import ShelterViewList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/ShelterView/ShelterViewList.vue';

// 救援装备 左侧面板
import vEquipmentViewTotal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/vEquipmentView/vEquipmentViewTotal.vue';
// 救援装备 右侧列表
import vEquipmentViewList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/vEquipmentView/vEquipmentViewList.vue';

// 物资储备库 左侧面板
import materialReserveViewTotal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/materialReserveView/materialReserveViewTotal.vue';
// 物资储备库 右侧列表
import materialReserveViewList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/materialReserveView/materialReserveViewList.vue';

// 非煤矿企业分布 左侧面板
import DisasterNoCoal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNoCoal/DisasterNoCoal.vue';
// 非煤矿企业分布 右侧列表
import DisasterNoCoalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNoCoal/DisasterNoCoalList.vue';

// 危化企业分布 左侧面板
import DisasterCompany from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCompany/DisasterCompany.vue';
// 危化企业分布 右侧列表
import DisasterCompanyList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterCompany/DisasterCompanyList.vue';

// 机场分布 左侧面板
import DisasterPlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterPlane/DisasterPlane.vue';
// 机场 右侧列表
import DisasterPlaneList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterPlane/DisasterPlaneList.vue';

// 水库大坝分布 左侧面板
import DisasterReservoir from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterReservoir/DisasterReservoir.vue';
// 水库大坝分布 右侧列表
import DisasterReservoirList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterReservoir/DisasterReservoirList.vue';

// 地灾隐患点 左侧面板
import HiddenDisasterSites from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/hiddenDisasterSites/HiddenDisasterSites.vue';
// 地灾隐患点 右侧列表
import HiddenDisasterSitesList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/hiddenDisasterSites/HiddenDisasterSitesList.vue';

// 学校分布 左侧面板
import DisasterSchool from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterSchool/DisasterSchool.vue';
// 学校分布 右侧列表
import DisaterSchoolList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterSchool/DisasterSchoolList.vue';

// 大型商贸统计 左侧面板
import LargeTradeStatistics from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/LargeTradeStatistics/LargeTradeStatistics.vue';
// 大型商贸统计列表 左侧面板
import LargeTradeStatisticsList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/LargeTradeStatistics/LargeTradeStatisticsList.vue';

// 集贸市场统计 左侧面板
import PedlarsMarket from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PedlarsMarket/PedlarsMarket.vue';
// 集贸市场统计列表 左侧面板
import PedlarsMarketList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/PedlarsMarket/PedlarsMarketList.vue';

// 大型文化体育场所 左侧面板
import LargeCulturalAndSports from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/LargeCulturalAndSports/LargeCulturalAndSports.vue';
// 大型文化体育场所列表 左侧面板
import LargeCulturalAndSportsList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/LargeCulturalAndSports/LargeCulturalAndSportsList.vue';

// 文化场馆统计 左侧面板
import CulturalValues from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/CulturalValues/CulturalValues.vue';
// 文化场馆统计列表 左侧面板
import CulturalValuesList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/CulturalValues/CulturalValuesList.vue';

// 宾馆饭店 左侧面板
import Hotels from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/Hotels/Hotels.vue';
// 宾馆饭店列表 左侧面板
import HotelsList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/Hotels/HotelsList.vue';

// 直升机取水点 左侧面板
import WatersourceAirPlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/watersourceAirPlane.vue';
// 直升机取水点 右侧列表
import WatersourceAirPlaneList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/watersourceAirPlaneList.vue';

// 取水码头 左侧面板
import WatersourcePlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/watersourcePlane.vue';
// 取水码头 右侧列表
import WatersourcePlaneList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/watersourcePlaneList.vue';

// 取水码头加取水点 左侧面板
import WatersourcePufPlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/watersourcePufPlane.vue';
// 取水码头加取水点 右侧列表
import WatersourcePufPlaneList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/watersourcePufPlaneList.vue';

// 直升机起降点 左侧面板
import HeliportPlane from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/heliportPlane.vue';
// 直升机起降点 右侧列表
import HeliportPlaneList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/watersourceAir/heliportPlaneList.vue';

// 火车站分布 左侧面板
import DisasterTrain from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterTrain/DisasterTrain.vue';
// 火车站分布 右侧列表
import DisasterTrainList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterTrain/DisasterTrainList.vue';

// 码头分布 左侧面板
import DisasterWharf from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterWharf/DisasterWharf.vue';
// 码头分布 右侧列表
import DisasterWharfList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterWharf/DisasterWharfList.vue';

// 烟花爆竹分布 左侧面板
import DisasterFireworks from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterFireworks/DisasterFireworks.vue';
// 烟花爆竹分布 右侧列表
import DisasterFireworksList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterFireworks/DisasterFireworksList.vue';

// 烟花爆竹仓库 左侧面板
import FIREWORKWAREHOUSE from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/FIREWORKWAREHOUSE/FIREWORKWAREHOUSE.vue';
// 烟花爆竹仓库 右侧列表
import FIREWORKWAREHOUSEList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/FIREWORKWAREHOUSE/FIREWORKWAREHOUSEList.vue';

// 地质灾害隐患点分布 左侧面板
import DisasterGeology from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterGeology/DisasterGeology.vue';
// 地质灾害隐患点分布 右侧列表
import DisasterGeologyList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterGeology/DisasterGeologyList.vue';

// 医院分布 左侧面板
import DisasterHospital from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHospital/DisasterHospital.vue';
// 医院分布 右侧列表
import DisasterHospitalList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterHospital/DisasterHospitalList.vue';

// 工贸企业分布 左侧面板
import DisasterIndustry from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterIndustry/DisasterIndustry.vue';
// 工贸企业分布 右侧列表
import DisasterIndusterList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterIndustry/DisasterIndustryList.vue';

// 灾情信息员分布 左侧面板
import DisasterMessenger from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMessenger/DisasterMessenger.vue';
// 灾情信息员分布 右侧列表
import DisasterMessengerList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMessenger/DisasterMessengerList.vue';

// 核设施分布 左侧面板
import DisasterNucleus from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNucleus/DisasterNucleus.vue';
// 核设施分布 右侧列表
import DisasterNucleusList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterNucleus/DisasterNucleusList.vue';

// 灾情评估分布 左侧面板
import DisasterPredictionBox from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/DisasterPredictionBox/DisasterPredictionBox.vue';
// 灾情预估分布 右侧列表
import DisasterPredictionBoxList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/DisasterPredictionBox/DisasterPredictionBoxList.vue';

// 应急管理机构分布 左侧面板
import DisasterEmergencypart from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterEmergencypart/DisasterEmergencypart.vue';
// 应急管理机构分布 右侧列表
import DisasterEmergencypartList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterEmergencypart/DisasterEmergencypartList.vue';

// 重大危险源分布 左侧面板
import DisasterMajorDanger from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMajorDanger/DisasterMajorDanger.vue';
// 重大危险源分布 右侧列表
import DisasterMajorDangerList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterMajorDanger/DisasterMajorDangerList.vue';

// 重要设施 左侧面板
import GasstationDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/gasstationDialog/GasstationDialog.vue';
import GasstationList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/gasstationDialog/GasstationList.vue';
// 水闸工程 左侧面板
import SluiceDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/sluiceDialog/SluiceDialog.vue';
import SluiceList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/sluiceDialog/SluiceList.vue';
// 供电设施 左侧面板
import PowerfacilitiesDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/powerfacilitiesDialog/PowerfacilitiesDialog.vue';
import PowerfacilitiesList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/powerfacilitiesDialog/PowerfacilitiesList.vue';
// 供水设施 左侧面板
import SupwatfacilDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/supwatfacilDialog/SupwatfacilDialog.vue';
import SupwatfacilList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/supwatfacilDialog/SupwatfacilList.vue';
// 燃气供应设施 左侧面板
import GasfacilDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/gasfacilDialog/GasfacilDialog.vue';
import GasfacilList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/gasfacilDialog/GasfacilList.vue';

// 大型能源供应设施分布统计 左侧面板
import BigGasfacilDialog from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/bigGasfacilDialog/BigGasfacilDialog.vue';
import BigGasfacilList from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/bigGasfacilDialog/BigGasfacilList.vue';


// 油气管线分布 左侧面板
// import OilGas from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/oilGas/oilGas.vue';

import { clearPeripheral } from '@/views/common/nvaUtil/nvaUtil';
@Component({
  name: 'HalfList',
  components: {
    GasfacilDialog,
    BigGasfacilDialog,
    DisasterMajorDanger,
    DisasterMajorDangerList,
    // OilGas,
    PopulationFeverBox,
    PopulationFeverList,
    DistrictLeftDialog,
    DistrictRightDialog,
    DisasterCoal,
    DisasterCoalList,
    DisasteMetalnonmetalCoal,
    DisasteMetalnonmetalList,
    ExpiewertViewTotal,
    ShelterViewTotal,
    ShelterViewList,
    vEquipmentViewTotal,
    vEquipmentViewList,
    materialReserveViewTotal,
    materialReserveViewList,
    ExpiewertViewList,
    IndustryViewList,
    IndustryViewTotal,
    DisasterNoCoal,
    DisasterNoCoalList,
    DisasterCompany,
    DisasterCompanyList,
    DisasterPlane,
    DisasterPlaneList,
    DisasterReservoir,
    DisasterReservoirList,
    HiddenDisasterSites,
    HiddenDisasterSitesList,
    DisasterSchool,
    Hotels,
    HotelsList,
    LargeTradeStatistics,
    LargeTradeStatisticsList,
    PedlarsMarket,
    PedlarsMarketList,
    LargeCulturalAndSports,
    LargeCulturalAndSportsList,
    CulturalValues,
    CulturalValuesList,
    DisaterSchoolList,
    WatersourceAirPlane,
    WatersourceAirPlaneList,
    WatersourcePlane,
    WatersourcePlaneList,
    WatersourcePufPlane,
    WatersourcePufPlaneList,
    HeliportPlane,
    HeliportPlaneList,
    DisasterTrain,
    DisasterTrainList,
    DisasterWharf,
    DisasterWharfList,
    DisasterFireworks,
    DisasterFireworksList,
    FIREWORKWAREHOUSE,
    FIREWORKWAREHOUSEList,
    DisasterGeology,
    DisasterGeologyList,
    DisasterHospital,
    DisasterHospitalList,
    DisasterIndustry,
    DisasterIndusterList,
    DisasterMessenger,
    DisasterMessengerList,
    DisasterNucleus,
    DisasterNucleusList,
    DisasterPredictionBox,
    DisasterPredictionBoxList,
    DisasterEmergencypart,
    DisasterEmergencypartList,
    GasstationDialog,
    SluiceDialog,
    SupwatfacilDialog,
    PowerfacilitiesDialog,
    GasstationList,
    SluiceList,
    PowerfacilitiesList,
    SupwatfacilList,
    GasfacilList,
    BigGasfacilList,
  },
})
export default class HalfList extends Vue {
  // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
  @Prop({ default: false }) public isShow!: boolean;
  @Prop() public sourceObj: any;
  @Prop() public tabList: any;
  private paramObj: any = '';
  private tongjiComponent: string = '';
  private listComponent: string = '';
  private loading: boolean = true;
  private halflistdom: any = '';
  private halfWrapdom: any = '';
  private halflistHeight: any = '';
  private searchDomHeight: any = '';
  private removeHalflist() {
    this.messsageBus.emit('moreDetails', ''); // 清空学校那样的面板
    this.messsageBus.emit('clickFromToolNav', 'closeThermodynamiTc');
    clearPeripheral(this);
  }
  @Watch('sourceObj')
  private changeStatus() {
    this.dealConfig(this.$store.state.configModel.config);
  }
  private dealConfig(val: any) {
    // 判断左右面板出现共用情况，目前【地灾隐患点】共用相同的左右面板，行政区划下钻
    const key = this.sourceObj.hasOwnProperty('commonKey')
      ? this.sourceObj.commonKey
      : this.sourceObj.key;
    this.tongjiComponent = val.halflist[key][0].componetName;
    this.listComponent = val.halflist[key][1] ? val.halflist[key][1].componetName : '';
  }

  @Watch('$store.state.panelPositionChangeModule.getHalflistHeight')
  private queryHeightFn() {
    // 根据5，10公里的数据（统计面板）设置列表的高度，自适应；
    this.$nextTick((): void => {
      this.loading = false;
      this.halflistdom = document.getElementsByClassName('listBox')[0];
      this.halfWrapdom = document.getElementsByClassName(
        'half-popupAssist-wrap',
      )[0];
      this.halflistHeight = $('.detail').height(); // 统计面板高
      // this.halfWrapdom.style.height = 855 - this.halflistHeight + 'px'; // 列表高
      this.searchDomHeight = $('.listDistrict-flex-box').height(); // 搜索/下拉的高
      // 滚动条的高 = 总高-统计面板高-标题/搜索/分页的高
      if (
        this.halfWrapdom &&
        this.halfWrapdom.textContent &&
        this.halfWrapdom.textContent.indexOf('行政区划') > -1
      ) {
        // 滚动条的高 = 总高-统计面板高-搜索/分页的高
        // 在develop分支下用725去减
        $('.half-popupAssist-wrap .el-scrollbar').css(
          'height',
          725 - this.halflistHeight - this.searchDomHeight - 110 + 'px',
        );
      } else {
        // 滚动条的高 = 总高-统计面板高-标题/搜索/分页的高
        $('.half-popupAssist-wrap .el-scrollbar').css(
          'height',
          725 - this.halflistHeight - this.searchDomHeight - 50 - 65 + 'px',
        );
        $('.half-popupAssist-wrap .el-select-dropdown.el-popper .el-scrollbar').css(
          'height',
          'auto',
        );
      }
    });
  }

  @Watch('isShow')
  private initQueryHeightFn(val: any): void {
    if (val) {
      this.queryHeightFn();
    }
  }
  @Watch('$store.state.controlMoudle.mapCircleQueryType')
  private changeLoading() {
    this.loading = true;
  }
  private created() {
    if (this.sourceObj.clickKey === 'oilgasLine') {
      this.paramObj = {
        curActiveTab: this.tabList, // 当前的队伍首页上边的那个tablist数组
        curMapParam: 'oilgasLine', // 地图的参数
        unit: this.sourceObj.danwei, // 单位
        curActiveTabIndex: 3, // tab的数组下标
        curStatisticsItem: this.sourceObj, // 当前选中的队伍分布或者前突队伍的那个大的对象
        notShowTabFlag: Boolean(
          this.$store.state.configModel.config.RescueTeamsContainer
            .notShowTabFlag,
        ), // 是否显示上边的列表
      };
    }
    this.dealConfig(this.$store.state.configModel.config);
    this.messsageBus.on('selectChange', () => {
      this.queryHeightFn();
    });
  }
}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/halfScreen.icon.less');
@import url('../../../assets/css/decisionSupport/halfScreen.statistic.less');
@url: '../../.././assets/img/halfScreen/nav';
// 救援队特殊处理
.right_function_box .halflist {
  top: 70px;
}
.halflist {
   /deep/.notShowTab{
    .statisticList{
    // .statisticCount{
     // display: none!important;
    }
    // .cmp-scrollbar-y.el-scrollbar{
    //   height: 530px!important;
    // }
    .listBox .tooltip._distance{
      // display: none!important;
    }
  }

  /*左统计strat*/
  .DisasterView {
    z-index: 0;
    width: 100%;
  }
  // 行政区划特殊处理
  /deep/ .DisasterHospital + .half-popupAssist-wrap .el-scrollbar {
    height: 270px;
  }
  /deep/ .DisasterMessenger + .half-popupAssist-wrap .el-scrollbar {
    height: 270px;
  }
  /deep/ .el-scrollbar__bar.is-vertical > div {
    background-image: linear-gradient(
      0deg,
      #0a7ccc 0%,
      #06b4d1 52%,
      #02ebd5 100%
    );
  }
  /deep/ .el-scrollbar__thumb:hover {
    background-image: linear-gradient(
      0deg,
      #0a7ccc 0%,
      #06b4d1 52%,
      #02ebd5 100%
    );
  }
  /*左统计end*/
  /*右列表start*/
  .half-popupAssist-wrap {
    width: 100%;
    height: 500px;
  }
  .half-popupAssist-wrap > div {
    height: 100%;
  }
  .cmp-scrollbar-y {
    height: 345px;
  }
}
.halflist {
  height: 100%;
  .notShowTab {
    height: 100%;
    display: flex;
    flex-direction: column;
    .half-popupAssist-wrap {
      flex: 1;
    }
  }
}
</style>
