<template>
  <div style="height:100%">
    <StudyAndJudgmentOfaPictureHalf
      @tabListAll="tabListAll"
      v-show="status"
    ></StudyAndJudgmentOfaPictureHalf>

    <div v-if="showRain" style="height:100%">
      <span @click="backCurrentTab" class="panelPublicDefault_toBack"></span>
      <component :is="currentWarningTab" :isShowModal="isShowModal" />
    </div>

    <!-- 16:9 组合面板（统计+列表） -->
    <div class="tabLists-box">
      <HalfList
        :tabList="tabList"
        :isShow="isShow"
        v-if="HalfListObj.componentName"
        :sourceObj="HalfListObj.changeItem"
      ></HalfList>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import HalfList from '@/components/feature/halfList/HalfList.feature.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import StudyAndJudgmentOfaPictureHalf from '@/components/feature/StudyAndJudgmentOfaPicture/StudyAndJudgmentOfaPictureHalf.vue';
import RainMonitor from '@/components/feature/flood/MonitorWarning/RainMonitor.vue';
import WindMonitor from '@/components/feature/flood/MonitorWarning/WindMonitor.vue';
import RiverMonitor from '@/components/feature/flood/MonitorWarning/RiverMonitor.vue';
import SurroundVideoList from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/SurroundVideoList.vue';
import HistoryEarthquakeList from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/HistoryEarthquakeList.vue';
@Component({
  name: 'StudyAndJudgmentContainer',
  components: {
    HalfList,
    StudyAndJudgmentOfaPictureHalf,
    RainMonitor,
    WindMonitor,
    RiverMonitor,
    SurroundVideoList,
    HistoryEarthquakeList,
  },
})
export default class StudyAndJudgmentContainer extends Vue {
  // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
  @Prop({ default: false }) public isShow!: boolean;
  private currentWarningTab: any; // 监测站点列表名对应的组件名
  private isShowModal: any = false; // 从综合研判进入监测站点页面，隐藏echartModal
  private tabList: any = '';
  private status = true;
  private showRain: any = false;
  private HalfListObj: any = {
    componentName: '',
    changeItem: '',
  };
  // 接收经验圈和烈度圈选中状态的变化
  private tabListAll(item: any) {
    this.tabList = item;
  }
  private backCurrentTab() {
    this.status = true;
    this.showRain = false;
  }
  private created() {
    // 监听侧边栏点击情况
    const self = this;
    this.messsageBus.on('moreDetails', (item: any) => {
      this.status = true;
      if (item) {
        this.status = false;
        self.showRain = false;
        self.HalfListObj.componentName = 'HalfList';
        self.HalfListObj.changeItem = item;
      } else {
        this.status = true;
        self.HalfListObj.componentName = '';
        self.HalfListObj.changeItem = '';
      }
    });
    this.messsageBus.on('showRain', (item: any) => {
      this.status = false;
      self.HalfListObj.componentName = '';
      self.HalfListObj.changeItem = '';
      self.currentWarningTab = item.component;
      self.showRain = true;
    });
    this.messsageBus.on('showHistoryEarthquake', (item: any) => {
      this.status = false;
      self.HalfListObj.componentName = '';
      self.HalfListObj.changeItem = '';
      self.currentWarningTab = item.component;
      self.showRain = true;
    });
    this.messsageBus.on('showVideoMonitorPop', (item: any) => {
     if (this.currentWarningTab === 'SurroundVideoList') {
       this.backCurrentTab();
     }
    });
    this.messsageBus.on('openPawn', (item: any) => {
     if (this.currentWarningTab === 'SurroundVideoList') {
       this.backCurrentTab();
     }
    });
  }
  private beforeDestroy() {
    // 关闭河流研判弹框列表
    const params = {
      isShow: false,
      isMajorRiver: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowRiverList', params);
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/decisionSupport/Statistic.half.less';
.tabLists-box {
  height: 100%;
}
</style>
