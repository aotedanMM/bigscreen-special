<!--力量调度的总控制页面，也是入口页面-->
<template>
  <div>
    <RescueTeamsHome
      v-show="!compName && !popupName"
      :parentHandleClickNumFn="handleClickNumFn"
      :openPopup="openPopup"
    ></RescueTeamsHome>
    <div v-show="compName && !popupName">
      <component
        :is="compName"
        :isShow="isShow && compName && !popupName"
        :rescueTeamHomeData="rescueTeamHomeData"
        v-on:backParent="backParent"
        @activeTab="getActiveTab"
        class="animated flipInY"
        :parentHandleClickNumFn="handleClickNumFn"
        :openPopup="openPopup"
      ></component>
    </div>
    <component
      :is="popupName"
      :isShow="isShow && popupName"
      :rescueTeamHomeData="popupData"
      v-on:backParent="closePopup"
      @activeTab="getActiveTab"
      class="animated flipInY"
      :popupFlag="true"
      :parentHandleClickNumFn="openPopup"
    ></component>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import RescueTeamsHome from '@/components/feature/RescueTeams/RescueTeamsHome.vue';
import DisasterPowerDispatch from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterPowerDispatch.vue';
import RescueTeamsDispatched from './RescueTeamsDispatched.vue';
import SiteFeedback from './SiteFeedback.vue';
import TeamDetailsPopup from './TeamDetailsPopup.vue';
import RescueTeamsDispatchedDetail from './RescueTeamsDispatchedDetail.vue';
// import RescueTeamsAttachment from './RescueTeamsAttachment.vue';

@Component({
  name: 'RescueTeamsContainer',
  components: {
    RescueTeamsHome, // 力量调度首页
    DisasterPowerDispatch,
    RescueTeamsDispatched,
    SiteFeedback,
    TeamDetailsPopup,
    RescueTeamsDispatchedDetail,
    // RescueTeamsAttachment,
  },
})
export default class RescueTeamsContainer extends Vue {
  // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
  @Prop({ default: false }) public isShow!: boolean;
  private rescueTeamHomeData: any = {};
  // const paramObj = {
  //         curNumItem: slsItem, // 当前选中的数字那一个对象
  //         curActiveTab: this.tabList, // 当前的队伍首页上边的那个tablist数组
  //          curMapParam: 'disasterJudgeNewTeam', // 地图的参数
  //         curStatisticsItem: slItem, // 当前选中的队伍分布或者前突队伍的那个大的对象
  //         curActiveStatistics: this.curActiveStatistics, // 当前高亮的一级标题
  //         curStatisticsListCache: this.statisticsListCache, // 缓存二级标题的高亮
  //     };
  private compName: any = ''; // 当前激活的下钻组件
  private popupName: any = ''; // 当前弹窗
  private popupData: any = {}; // 弹窗数据

  /**
   * 处理队伍首页数字的点击
   */
  private handleClickNumFn(resultData: any, compName: any) {
    this.compName = compName;
    this.rescueTeamHomeData = resultData;
    console.log(this.compName);
    console.log(this.rescueTeamHomeData);
  }
  private openPopup(resultData: any, popupName: any) {
    this.popupName = popupName;
    this.popupData = resultData;
  }
  private backParent() {
    this.compName = '';
  }
  private closePopup() {
    this.popupName = '';
  }
  private getActiveTab(data: any) {
    // console.log(data);
  }
}
</script>
<style lang="less" scoped>
</style>
