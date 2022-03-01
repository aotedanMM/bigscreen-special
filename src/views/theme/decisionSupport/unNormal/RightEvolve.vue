
<!--救援进展-->
<template>
    <div class="layoutAssist">
       <div class="cu-flex">
            <div class="layoutSidebar_A cu-flex-average">
                <div style="height:33.333%;">
                   <PanelView title="人员救助" class="cmp-panel-cnt--bg">
                     <ResourcePeople></ResourcePeople>
                   </PanelView>
                </div>
                <div style="height:33.333%">
                  <PanelView title="队伍覆盖" class="cmp-panel-cnt--bg">
                      <TeamCoverage></TeamCoverage>
                  </PanelView>      
                </div>
                <div style="height:33.333%">
                  <PanelView title="抢修速率" class="cmp-panel-cnt--bg">
                    <RushRepairRate></RushRepairRate>
                  </PanelView>      
                </div>
            </div>
            <div class="layoutSidebar_B cu-flex-average">
               <PanelView title="风险隐患排查" class="RiskHazardHome-box">
                 <HiddenTroubleInvestigation></HiddenTroubleInvestigation>
               </PanelView>
            </div> 
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import HiddenTroubleInvestigation from '@/views/common/echarts/HiddenTroubleInvestigation.vue';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import ResourcePeople from '@/views/common/echarts/ResourcePeople.vue';
import RushRepairRate from '@/views/common/echarts/RushRepairRate.vue';
import TeamCoverage from '@/views/common/echarts/TeamCoverageView.vue';
@Component({
    name: 'RightEvolve',
    components: {
        HiddenTroubleInvestigation,
        PanelView,
        ResourcePeople,
        RushRepairRate,
        TeamCoverage,
    },
})
export default class RightEvolve extends Vue {}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/LayoutAssist.less');
@decisionSupport: '../../../../assets/img/decisionSupport/panel';

</style>