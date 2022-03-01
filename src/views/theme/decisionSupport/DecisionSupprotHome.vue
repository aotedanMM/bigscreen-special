<template>
  <div :class="[layoutHomeStyleCur,'  decPage-layout-wrap']">
    <!---天气组件start-->
    <div class="weatherBigPanel" v-show="isShowWeather">
      <WeatherDisasterAreaPanel></WeatherDisasterAreaPanel>
    </div>
    <!---天气组件end-->
    <div class="decPage-layout-bg" style="height:100%;">
      <!-- 全屏/半屏按钮 start -->
      <div type="button" class="gisScreenBtn-box" >
        <template v-if="!isFull">
          <span
            v-if="!is2rd"
            class="gisScreenBtn-box_btn--2rd"
            @click="switchGisScreen('2rd')"
          ></span>
          <!-- <span v-else class="gisScreenBtn-box_btn--back" @click="CkNormalBehavior()"></span> -->
          <!-- <span class="gisScreenBtn-box_btn--back" @click="CkNormalBehavior()" v-show="this.$store.state.eventPushStore.eventId"></span> -->
        </template>
        <template v-if="!is2rd">
          <span v-if="isFull" class="gisScreenBtn-box_btn" @click="switchGisScreen('default')"></span>
          <span v-else class="gisScreenBtn-box_btnFull" @click="switchGisScreen('full')"></span>
        </template>

      </div>
      <!-- 全屏/半屏点击按钮 end -->
      <div class="decPage-head-wrap">
        <layoutHead></layoutHead>
      </div>
      <div class="decPage-main-body">
        <DecLayoutHome></DecLayoutHome>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import leftNav from '@/views/common/leftNav/LeftNav.vue';
import layoutHead from '@/views/theme/decisionSupport/common/LayoutHead.vue';
import { IWeather } from '@/interface/feature/common/weather/Weather.interface';
import WeatherDisasterAreaPanel from '@/views/common/weatherDisasterArea/WeatherDisasterAreaPanel.vue';
import { messsageBus } from '@/util/message';
import DecLayoutHome from '@/views/theme/decisionSupport/LayoutHome.vue';
// import { clearPeripheral , clearPathPlanning , closeRightVideo } from '@/views/common/nvaUtil/nvaUtil' ;

// import '@/assets/css/decisionSupportVal.less';
@Component({
  name: 'DecisionSupprotHome',
  components: {
    // leftNav,
    layoutHead,
    WeatherDisasterAreaPanel,
    DecLayoutHome,
  },
})
export default class DecisionSupprotHome extends Vue {
  private weatherData: IWeather = {
    address: '北京',
    temperature: 45,
    temperatureUnit: '℃',
    weatherIconName: 'iconClass',
    weatherSituation: '阴',
    windSpeed: 12,
  };
  private get isShowWeather() {
    return this.$store.getters.getShowWeatherPanel;
  }
  // 当前gis布局的样式状态集合
  private layoutHomeStyleState: any = {
    'default': 'gisScreen-default ', // 普通
    'full': 'gisScreen-full', // 全屏
    '2rd': 'gisScreen-2rd', // 半屏
  };
  // 当前gis地图布局的样式名
  private get layoutHomeStyleCur() {
    return this.layoutHomeStyleState[
      this.$store.state.controlMoudle.gisMapScreenState
    ];
  }
// 获取半屏状态
private get is2rd() {
   return this.$store.state.controlMoudle.screen2rdFlag;
}
// 获取全屏状态
private get isFull() {
    return this.$store.state.controlMoudle.screenfullFlag;
}
  private boardData = {
    boardList: [
      {
        id: '02010001',
        title: '监测报警',
      },
      {
        id: '02010003',
        title: '报警处置',
      },
      {
        id: '02010004',
        title: '监控视频',
      },
      {
        id: '02010002',
        title: '报警趋势',
      },
    ],
  };
  // 普通/半屏/全屏 切换
  private switchGisScreen(type: string) {
    this.$store.commit('controlMoudle/setGisMapScreenState', type);
    this.$nextTick(() => {
      let width: any = 0;
      let height: any = 0;
      if (type === 'default') {
        width = jQuery('#map').width();
        height = jQuery('#map').height();
        this.getComponent().resize(width, height);
        this.messsageBus.emit('default');
      } else if (type === '2rd') {
        width = jQuery('.decPage-layout-wrap').width();
        height = jQuery('.decPage-layout-wrap').height();
        this.getComponent().resize(width, height);
        this.messsageBus.emit('2rd');
      } else if (type === 'full') {
        setTimeout(() => {
          this.getComponent().resize();
        }, 1000);
      }
    });
    // const fullInter = setTimeout(this.getComponent().resize, 1200);
    // setTimeout(() => {
    //   clearInterval(fullInter);
    // }, 1600);
    // 切换半屏防止面板重叠收起周边查询面板
    this.$store.commit('mapTools/changeNearbyQueryVisible', false);
  }
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('gisToolComp');
    }
    return component;
  }

  // 点击回到常态 16：9
  private CkNormalBehavior() {
    location.reload();
    /*this.$store.dispatch('eventPushStore/callbackState');
    // 清除路径规划与周边查询视频弹框
    clearPeripheral(this);
    clearPathPlanning(this);
    closeRightVideo(this);*/
  }
}
</script>


<style lang="less" scoped>
@headBg: url('../../../assets/img/head/bg_header.png') 0% 0% no-repeat;
@headHeight: 80px;
@import url('../../../assets/css/decisionSupport/LayoutHome.less');
.decPage-layout-wrap {
  overflow: hidden;
  .layoutHome-main {
    height: 100%;
  }
  .weatherPanel {
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .weatherBigPanel {
    box-sizing: border-box;
    position: absolute;
    top: 41px;
    right: 00px;
    width: 980px;
    bottom: 10px;
    z-index: 5;
    height: 1050px;
  }
  .decPage-head-wrap {
    height: @headHeight;
  }
  .decPage-head-bg {
    background: @headBg;
  }
  .decPage-main-body {
    height: calc(100% - @headHeight);
  }
}
</style>
