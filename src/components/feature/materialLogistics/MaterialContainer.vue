<!--物资保障的总控制页面，也是入口页面-->
<template>
    <div>
        <MaterialHome v-if="rescueTeamHomeShow" :parentHandleClickNumFn="handleClickNumFn"></MaterialHome>
        <DisasterPowerDispatch v-if="!rescueTeamHomeShow"
                               :rescueTeamHomeData = "rescueTeamHomeData"
                               v-on:backParent="backParent"
                               class="animated flipInY"></DisasterPowerDispatch>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import MaterialHome from '@/components/feature/materialLogistics/MaterialHome.vue';
import DisasterPowerDispatch from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterRescueTeams/DisasterPowerDispatch.vue';
@Component({
    name: 'MaterialContainer',
    components: {
        MaterialHome, // 物资保障首页
        DisasterPowerDispatch,
    },
})
export default class MaterialContainer extends Vue  {
    private rescueTeamHomeData: any = {};
    // const paramObj = {
    //         curNumItem: slsItem, // 当前选中的数字那一个对象
    //         curActiveTab: this.tabList, // 当前的队伍首页上边的那个tablist数组
    //          curMapParam: 'disasterJudgeNewTeam', // 地图的参数
    //         curStatisticsItem: slItem, // 当前选中的队伍分布或者前突队伍的那个大的对象
    //         curActiveStatistics: this.curActiveStatistics, // 当前高亮的一级标题
    //         curStatisticsListCache: this.statisticsListCache, // 缓存二级标题的高亮
    //     };
    private rescueTeamHomeShow: boolean = true;

    /**
     * 处理队伍首页数字的点击
    */
   private handleClickNumFn(resultData: any) {
        this.rescueTeamHomeData = resultData;
        this.rescueTeamHomeShow = false;
   }
   private backParent() {
       this.rescueTeamHomeShow = true;
   }
}
</script>
<style lang="less" scoped>

</style>