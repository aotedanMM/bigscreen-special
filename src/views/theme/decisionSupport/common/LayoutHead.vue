<template>
  <div class="layout-header layout-header_bg" >
    <!--logo右侧 start-->
    <div class="layout-header_right" v-show="!is2rd">
      <!-- <div class="layout-header_event layout-header_event_bg">
        <span class="layout-header_date">2019年11月19日</span>
        <span class="layout-header_second">15:42:16</span>
      </div>-->
      <SystemTime v-if="normalState" />

      <div class="layout-header_weather layout-header_weather_nr">
        <weather-area-outer-frame></weather-area-outer-frame>
      </div>
    </div>
    <!----行政区划，周边查询---->
    <div :class="{'layout-header_right': true, 'search-tool-containerNomal':  normalState ,'search-tool-container' : !normalState}">
        <div class="district-select-btn"
             v-if="$store.state.mapModule.districtShowName"
            @click="onRegionSelectionBtnClick">
          <span class="f-txt-com">{{$store.state.mapModule.districtShowName}}</span>
        </div>
    </div>
    <!--logo右侧 start-->

    <!--logo左侧 start-->
    <div class="layout-header_left">
      <div class="layout-header_time layout-header_left_bg" v-show="!is2rd">
        <div class="ylmb" @click="showPDF = !showPDF"></div>
        <div class="horseLamp-wrap" v-if="normalState!==''">
          <horse-lamp></horse-lamp>
        </div>
      </div>
      
      <div id='eventAndTopics-box' v-if='$store.state.controlMoudle.screen2rdFlag ===true' 
      :class="!$store.state.eventPushStore.eventId ? 'eventAndTopics-box-normal': 'eventAndTopics-box'">
        <EventAndTopics />
      </div> 
      <div  v-if='$store.state.controlMoudle.screen2rdFlag === false' :class="{sjlb:true, sjlbhalf:is2rd}" @click="showEventList = !showEventList">地震速报</div>
      <!-- 地震速报 S -->
      <Rendless type="eventList" v-slot="{data}">
        <EventinfoList v-model="showEventList" :list="data" />
      </Rendless>
      <!-- 地震速报 E -->
      <!-- 显示演练模板轮播 S -->
      <Rendless type="pdf" v-slot="{data}">
        <PDFBanner v-if="showPDF&&data" :pictures="data" />
      </Rendless>

      <!-- 显示演练模板轮播 E -->
    </div>
    <!--logo左侧 end-->

    <!--logo部分 start-->
    <div class="layout-header_center">
      <div class="layout-header_logo">
        <span class="layout-header_logo-img">应急辅助决策系统</span>
        <!-- <div class="layout-header-animate">
          <div class="arclineLeft animated slower infinite arclineAnimate"   v-show="!is2rd"></div>
          <div class="arclineRight animated slower infinite arclineAnimate"  v-show="!is2rd"></div>
          <i class="spot spot1 animated spot slow infinite"></i>
          <i class="spot spot2 animated spot slower infinite delay-3s"></i>
          <i class="spot spot3 animated spot slow infinite delay-1s"></i>
          <i class="spot spot4 animated spot slower infinite delay-2s"></i>
        </div> -->
      </div>
    </div>

    <!--logo部分 end-->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import WeatherAreaOuterFrame from '@/views/common/weatherDisasterArea/WeatherAreaOuterFrame.vue';
import PdfPreview from '@/components/common/pdfPreview/pdfPreview.vue';
import PDFBanner from '@/components/feature/earthquake/PDFBanner/PDFBanner.vue';
import HorseLamp from '@/components/feature/earthquake/horseLamp/HorseLamp.vue';
import EventinfoList from '@/components/feature/earthquake/eventinfolist/EventinfoList.vue';
import SystemTime from '@/components/feature/common/systemTime/SystemTime.vue';
import Rendless from '@/components/common/rander/Rendless.vue';
import EventAndTopics from '@/components/feature/eventAndTopics/EventAndTopics.vue';
import {messsageBus} from '@/util/message';
// 行政区划选择组件
import ResourceQueryHandler from '@/components/feature/GIS/GisMenuSearch/Handler';
@Component({
  name: 'LayoutHeader',
  mixins: [ResourceQueryHandler],
  components: {
    WeatherAreaOuterFrame,
    PdfPreview,
    PDFBanner,
    HorseLamp,
    EventinfoList,
    Rendless,
    SystemTime,
    EventAndTopics,
  },
})
export default class LayoutHeader extends Vue {
  private showPDF = false;
  private showEventList = false;
  private pdfUrl = './pdf/1.pdf';
  private pdfFlag = false;
  private normalState = '';
  private pdfClick() {
    this.pdfFlag = !this.pdfFlag;
  }
  // 获取半屏状态
  private get is2rd() {
      return this.$store.state.controlMoudle.screen2rdFlag;
  }
  // 监听为常态还是非常态
  @Watch('$store.state.eventPushStore.eventId')
  private changeNormalState() {
    this.normalState = this.$store.state.eventPushStore.eventId;
  }
  private created() {
       this.normalState = this.$store.state.eventPushStore.eventId;
       // 获取当前行政区划
      // this.initCurrentDistrict();
  }
}
</script>
<style lang="less" scoped>
@leftWidth: 27%;
@rightWidth: 27%;
@eventInfoImgUrl: '../../../../assets/img/eventInfo';
@headImgUrl: '../../../../assets/img/decisionSupport/head';
@logoText: '../../../../assets/img/default/layout/logo_text.png';
.horseLamp-wrap{
  margin:10px 0 10px 0;
  width:710px;
}
.layout-header {
  width: 100%;
  height:80px;
  position: relative;
  z-index: 10;
  .eventAndTopics-box{
    position:absolute;top:12px; left:80px;z-index:4
  }
  
  .eventAndTopics-box-normal{
    position:absolute;
    top: 11px;
    left: 14px;
    z-index:4
  }
  > div {
    height: 100%;
  }
  .layout-header_left {
    float: left;
    width: @leftWidth;
  }
  .layout-header_right {
    float: right;
    /*width: 17%;*/
    display: flex;
  }
  .layout-header_center {
    margin-left: @leftWidth;
    margin-right: @rightWidth;
  }

  .layout-header_logo {
    font-size: 48px;
    text-align: center;
    line-height: 80px;
    color: #fcffbc;
    user-select: none;
    font-family: 'HanYi'
  }
  
  .layout-header_logo-img{
    display: block;
    height:100%;
    // background: url('@{logoText}') no-repeat 60% 0%;
    font-size:0;
    transform: scale(1.2);
    background-size: 50% 120%;
  }
  .layout-header_time {
    box-sizing: border-box;
    vertical-align: middle;
    margin-left: 30px;
    height: 75px;
    padding-left: 62px;
    display: -webkit-box;
    display: flex;
    position: relative;
    padding-top: 27px;
    > .ylmb {
      cursor: pointer;
      opacity: 0.5;
      content: '';
      background: url('@{eventInfoImgUrl}/shijianbg.gif')
        no-repeat center / 100% 100%;
      width: 43px;
      height: 43px;
      position: absolute;
      left: 12px;
      top: 17px;
    }
  }
   .sjlb {
        position:absolute;
        left:760px;
        top:23px;
        margin-top:6px;
        width: 255px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('@{eventInfoImgUrl}/eventbg.png') no-repeat
            center / 139px 34px;
        font-size: 20px;
        color: #d2e1dc;
        cursor: pointer;
        height: 37px;
        &::before {
            content: '';
            width: 20px;
            height: 17px;
            background: url('@{eventInfoImgUrl}/eventicon.png')
            no-repeat center / 100% 100%;
            margin-right: 10px;
        }
    }
  .sjlbhalf{
    left:0;
  }
  .layout-header_date {
    display: inline-block;
    font-size: 22px;
    vertical-align: middle;
    color: #fff;
    padding-right: 20px;
  }
  .layout-header_weather {
    box-sizing: border-box;
  }
  .layout-header_weather_nr {
    float: right;
    position:absolute;
    right:137px;
    height: 98px;
    background: url('@{headImgUrl}/head3bg.png')
      no-repeat 0 0;
    padding-left: 40px;
    padding-right:40px;
    padding-top: 28px;
    background-size: 100% 100%;
    box-sizing: border-box;
  }
  .layout-header_second {
    display: inline-block;
    font-size: 44px;
    vertical-align: middle;
    color: #45ff77;
  }
  .layout-header_event {
    width: 50%;
    height: 98px;
    padding-left: 60px;
    padding-top: 23px;
    box-sizing: border-box;
  }
  .layout-header_event_bg {
    background: url('@{headImgUrl}/head2bg.png')
      no-repeat 0 -5px;
    background-size: 100% 100%;
  }

  .search-tool-containerNomal.search-tool-containerNomal_reset {
      right: 305px;
  }
  .search-tool-container.search-tool-containerNomal_reset{
      right: 185px;
  }
  .search-tool-container {
    height: 42px;
    position: absolute;
    right: 10px;
    // top: 23px;
    top: 11px;
    // top: 27px;
    // z-index: 100;
    z-index: 99;
    cursor: pointer;
  }
  .search-tool-containerNomal {
      height: 42px;
      position: absolute;
      right: 10px;
      top: 11px;
      z-index: 3;
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
    background:url(../../../../assets/img/layout/location_xingzheng.png) no-repeat;
    background-size:100% 100%;
    text-align: center;
    color: #fff;
    // margin-top: 10px;
    box-sizing: border-box;
    height: 42px;
    line-height: 42px;
    // width: 159px;
    padding: 0 45px 0 45px;
    box-sizing: border-box;
    span:after{
      content:"";
      width:9px;
      height:6px;
      display: inline-block;
      // background:url(../../../../assets/img/layout/xiasanjiao.png) no-repeat;
      // background-size: 100% 100%;
      margin-left: 5px;
    }
    span:before{
      content:"";
      width:17px;
      height:20px;
      display: inline-block;
      background:url(../../../../assets/img/layout/location_new.png) no-repeat;
      background-size: 100% 100%;
      margin-right: 5px;
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translate(0px,-50%);
    }
  }
}

</style>
