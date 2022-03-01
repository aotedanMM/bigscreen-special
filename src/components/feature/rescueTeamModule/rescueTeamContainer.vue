<!--力量调度的总控制页面，也是入口页面-->
<template>
  <div class="RescueTeamsHome-box" :class="{ isHidden }">
    <span
      v-if="
            $store.state.eventPushStore.eventLocation.EventType.toString() === '10'
            &&
            $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
          "
      class="closeAndback"
      @click="closeAndbackFn"
    ></span>
    <RescueTeamsHome
      v-show="!compName"
      :parentHandleClickNumFn="handleClickNumFn"
      :openPopup="openPopup"
      :activeTab="parentActiveTab"
      :getJsonKey="getJsonKey"
    ></RescueTeamsHome>
    <!-- <DisasterPowerDispatch v-if="!rescueTeamHomeShow"
                               :isShow="isShow"
                               :rescueTeamHomeData = "rescueTeamHomeData"
                               v-on:backParent="backParent"
                               @activeTab="getActiveTab"
    class="animated flipInY"></DisasterPowerDispatch>-->
    <!-- <RescueTeamsDispatched :parentHandleClickNumFn="handleClickNumFn"></RescueTeamsDispatched> -->
    <div v-if="compName">
      <component
        :is="compName"
        :rescueTeamHomeData="rescueTeamHomeData"
        v-on:backParent="backParent"
        @activeTab="getActiveTab"
        class="animated flipInY"
        :parentHandleClickNumFn="handleClickNumFn"
        :openPopup="openPopup"
      ></component>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import RescueTeamsHome from '@/components/feature/rescueTeamModule/RescueTeamsHome.vue';
// import DisasterPowerDispatch from "@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterPowerDispatch.vue";
import RescueTeamsDispatched from './RescueTeamsDispatched.vue';
import SiteFeedback from './SiteFeedback.vue';
import TeamDetailsPopup from './TeamDetailsPopup.vue'; // 救援队伍的详情
import DispatchTeamDetail from './DispatchTeamDetail.vue'; // 出动队伍的列表
import RescueTeamsDispatchedDetail from './RescueTeamsDispatchedDetail.vue'; // 出动小分队的详情
import DispatchTeamDetailsPopup from '../RescueTeams/TeamDetailsPopup.vue'; // 出动队伍的详情

@Component({
  name: 'RescueTeamContainer',
  components: {
    RescueTeamsHome, // 力量调度首页
    // DisasterPowerDispatch,
    RescueTeamsDispatched,
    SiteFeedback, // openFeedback
    TeamDetailsPopup, // 所有队伍详情页
    DispatchTeamDetail, // 出动队伍所有情况
    // RescueTeamsAttachment,
    RescueTeamsDispatchedDetail, // 小分队详情面板
    DispatchTeamDetailsPopup, // 出动队伍的详情
  },
})
export default class RescueTeamContainer extends Vue {
  // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
  @Prop({ default: false }) public isShow!: boolean;
  @Prop() private getJsonKey: any;
  private rescueTeamHomeData: any = {};
  private parentActiveTab = '';

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
  private isHidden: boolean = false; // 面板隐藏

  /**
   * 处理队伍
   */
  private handleClickNumFn(resultData: any, compName: any) {
    this.compName = compName;
    this.rescueTeamHomeData = resultData;
    this.getTab();
  }
  private getTab() {
    if (this.compName === 'DispatchTeamDetail') {
      this.parentActiveTab = 'second';
    } else if (this.compName === 'TeamDetailsPopup') {
      this.parentActiveTab = 'first';
    }
  }
  private openPopup(resultData: any, popupName: any) {
    this.popupName = popupName;
    this.popupData = resultData;
  }
  private backParent(data?: any) {
    this.compName = '';
    if (data === 'second') {
      this.parentActiveTab = 'second';
    } else {
      this.parentActiveTab = '';
    }
  }
  private closePopup() {
    this.popupName = '';
  }
  private getActiveTab(data: any) {
    // console.log(data);
  }
  // gis方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('teamDispatch');
    return component;
  }

  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('routerPlan');
    return component;
  }
  private mounted() {
    this.getTab();
    this.getComponent().on('Team_popup', this.showPopup, this);
    this.getComponent().on('dispatchTeam_popup', this.showPopup, this);
    this.messsageBus.on('rescueTeamHomeData', (data: any) => {
        this.compName = 'TeamDetailsPopup';
        this.rescueTeamHomeData = data;
    });
    // 监听路径规划开启关闭 开始
    const self: any = this;
    this.getComponent1().on('openDialog', (id: any) => {
      console.log(id, 'id');
      self.isHidden = true;
    });
    this.getComponent().on('closeDialog', (id: any) => {
      self.isHidden = false;
    });
    this.messsageBus.on('showRescueTeam', (val: boolean) => {
      if (val) {
        self.isHidden = false;
      }
    });
    // 监听路径规划开启关闭 结束
  }

  private showPopup(event: any) {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: { showFlag: true },
    });
    const resultData = {
      parameter: event.attributeObj,
    };
    if (event.type === 'allRealTeamPopup') {
      this.compName = 'TeamDetailsPopup';
      this.rescueTeamHomeData = event.attrObj;
    } else if (event.type === 'TeamRealLocation') {
      this.compName = 'RescueTeamsDispatchedDetail';
      this.rescueTeamHomeData = resultData;
    } else if (event.type === 'zhudi') {
      this.compName = 'DispatchTeamDetailsPopup';
      this.rescueTeamHomeData = resultData;
    }
  }
 private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
     );
    return component;
  }
  private destroyed() {
    this.getComponent().off('Team_popup', this.showPopup, this);
    this.getComponent().off('dispatchTeam_popup', this.showPopup, this);
    this.getComponent().unload();
    this.getComponent_new()._clearLayerByID('rescueteam');
    this.messsageBus.off('showRescueTeam');
    // 清除路径规划
    this.getComponent1().clearRouteResults();
  }
  private closeAndbackFn() {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: { showFlag: false },
    });
    this.messsageBus.emit('closeAndBack', true);
  }
}
</script>
<style lang="less" scoped>
.RescueTeamsHome-box {
  height: 100%;
}
.isHidden {
  display: none;
}
</style>
