<!--作战部署的总控制页面，也是入口页面-->
<template>
  <div>
    <span
          v-if="
            $store.state.eventPushStore.eventLocation.EventType.toString() === '10'
            &&
            $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
          "
          class="closeAndback"
          @click="closeAndbackFn"
      ></span>
    <operationalDeployment
      v-if="!compName"
      :parentHandleClickNumFn="handleClickNumFn"
      :openPopup="openPopup"
      :activeTab="parentActiveTab"
      :notitle="notitle"
    ></operationalDeployment>
    <div v-else>
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
import operationalDeployment from './operationalDeployment.vue';


@Component({
  name: 'OperationalDeploymentContainer',
  components: {
    operationalDeployment, // 作战部署首页
  },
})
export default class OperationalDeploymentContainer extends Vue {
  // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
  @Prop({ default: false }) public isShow!: boolean;
  @Prop() private notitle: any;
  private rescueTeamHomeData: any = {};
  private parentActiveTab = '';

  private compName: any = ''; // 当前激活的下钻组件
  private popupName: any = ''; // 当前弹窗
  private popupData: any = {}; // 弹窗数据

  /**
   * 处理队伍
   */
  private handleClickNumFn(resultData: any, compName: any) {
      console.log( this.compName );
      this.compName = compName;
      this.rescueTeamHomeData = resultData;
      this.getTab();
  }
  private getTab() {
      console.log(this.compName);
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

  private mounted() {
      this.getTab();
      this.getComponent().on('Team_popup', this.showPopup, this);
      this.getComponent().on('dispatchTeam_popup', this.showPopup, this);
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

  private destroyed() {
    this.getComponent().off('Team_popup', this.showPopup, this);
    this.getComponent().off('dispatchTeam_popup', this.showPopup, this);
    this.getComponent().unload();
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
</style>
