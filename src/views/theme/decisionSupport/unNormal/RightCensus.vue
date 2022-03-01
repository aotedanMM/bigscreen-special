<!--灾损统计-->
<template>
    <div class="layoutAssist">
       <div class="cu-flex">
            <div class="layoutSidebar_A cu-flex-average">
                <div style="height:60%;">
                    <PanelView title="人员伤亡"  class="cmp-panel-cnt--bg">
                            <!-- <CasualtiesAndLegend/> -->
                        <Casualties></Casualties>
                    </PanelView>      
                </div>
                <div style="height:40%">
                  <PanelView title="房屋损毁" class="cmp-panel-cnt--bg">
                      <HouseDamagedAndLegend></HouseDamagedAndLegend>
                      <!-- <HouseDamagedAndLegend/> -->
                    </PanelView>
                </div>
            </div>
            <div class="layoutSidebar_B cu-flex-average">
                <div style="height:45%">
                    <PanelView title="交通情况" class="cmp-panel-cnt--bg">
                        <TrafficState/>
                    </PanelView>                
                </div>
                <div style="height:55%">
                    <PanelView title="电力受损" class="cmp-panel-cnt--bg"> 
                        <PowerDamageView/>
                    </PanelView>
                </div>
            </div> 
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import HouseDamagedAndLegend from '@/views/common/echarts/HouseDamagedAndLegend.vue';
// import CasualtiesAndLegend from '@/views/common/echarts/CasualtiesAndLegend.vue';
import Casualties from '@/views/casualties/Casualties.vue';
import PowerDamageView from '@/views/common/echarts/PowerDamageView.vue';
import TrafficState from '@/views/theme/decisionSupport/module/disasterCensusRIght/TrafficState.vue';
@Component({
    name: 'RightCensus',
    components: {
        PanelView,
        HouseDamagedAndLegend,
        // CasualtiesAndLegend,
        Casualties,
        PowerDamageView,
        TrafficState,
    },
})
export default class RightCensus extends Vue  {



}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/LayoutAssist.less');
    
</style>