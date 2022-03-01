<!--力量调度的总控制页面，也是入口页面-->
<template>
    <div>
        <RescueTeamsHome v-if="rescueTeamHomeShow" :parentHandleClickNumFn="handleClickNumFn"></RescueTeamsHome>
        <template v-else>
            <component
                :is="disasterComName"
                :isShow="isShow"
                :FnHoverItemEvent="FnHoverItemEvent"
                :FnMouserLeave="FnMouserLeave"
                :rescueTeamHomeData = "rescueTeamHomeData"
                v-on:backParent="backParent"
                class="animated flipInY"></component>
        </template>
</div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import RescueTeamsHome from '@/components/feature/EmergencyPower/RescueTeamsHome.vue';
import DisasterPowerDispatch from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterPowerDispatch.vue';
import DisasterEquipComp from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterEquipComp.vue';
@Component({
    name: 'RescueTeamsContainer',
    components: {
        RescueTeamsHome, // 力量调度首页
        DisasterPowerDispatch, // 队伍下钻页
        DisasterEquipComp, // 装备下钻页
    },
})
export default class RescueTeamsContainer extends Vue  {
    // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
    @Prop({ default: false }) public isShow!: boolean;
    private rescueTeamHomeData: any = {};
    private rescueTeamHomeShow: boolean = true;
    private disasterComName: string = '';
    /**
     * 首页数字的点击事件
    */
   private handleClickNumFn(resultData: any, flag: any) {
        if (resultData.curStatisticsItem.key === 'TeamDistribution') {
            this.disasterComName = 'DisasterPowerDispatch';
        } else {
            this.disasterComName = 'DisasterEquipComp';
        }
        this.rescueTeamHomeData = resultData;
        this.rescueTeamHomeShow = false;
    }
   private backParent() {
        this.rescueTeamHomeShow = true;
   }

   private FnHoverItemEvent(type: any, item: any, forward: any, compnentType: any) {
        if (compnentType === 'team') {
            const type1 = 'disaster_team__' + type + '__' + item.level + '__' + forward;
            this.getComponent1().addHover(type1, item.id);
        } else {
            const featureType = 'equip__' + item.equiptypecode;
            this.getComponent1().addHover(featureType, item.equipmentid);
        }

    }
    private FnMouserLeave(): void {
        this.getComponent1().clearHover();
    }

    private getComponent1() {
      let component1 = null;
      const factory1 = this.$ioc.resolve('GISFactory-map');
      if (factory1) {
            component1 = factory1.commonFactory.getComponent('commonInteract');
        }
      return component1;
    }
    // 历史轨迹地图组件
    private getComponentHistory() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('routerPlan');
        return component;
    }
    private beforeDestroy() {
        // 清除路径规划
        this.getComponentHistory().clearRouteResults();
    }
}
</script>
<style lang="less" scoped>

</style>
