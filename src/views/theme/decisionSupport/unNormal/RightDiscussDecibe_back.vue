
<!--灾情研判-->
<template>
    <div class="layoutAssist">
       <div class="cu-flex">
            <div class="layoutSidebar_A cu-flex-average">
                <div style="height:50%;">
                    <PanelView title="人员密集场所" class="cmp-panel-cnt--bg">
                    <PersonalDemo></PersonalDemo>
                    </PanelView>      
                </div>
                <div style="height:50%;">
                  <PanelView title="严重受灾区域" class="cmp-panel-cnt--bg">
                    <AffectedAreaView></AffectedAreaView>
                  </PanelView>      
                </div>
            </div>
            <div class="layoutSidebar_B cu-flex-average">
               <!-- <PanelView title="风险隐患排查" :replaceBg="style">  -->
                <PanelView title="风险隐患排查" class="RiskHazardHome-box"> 
                    <RiskHazardHome></RiskHazardHome>
               </PanelView>
            </div> 
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import { severelyAffectedAreaServer } from '@/api/installServer';

import AffectedAreaView from '@/views/common/echarts/AffectedAreaView.vue';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import PersonalDemo from '@/views/common/echarts/PersonalIntensiveDemo.vue';
import RiskHazardHome from '@/views/common/echarts/RiskHazardHome.vue';
@Component({
    name: 'RightDiscussDecibe',
    components: {
        AffectedAreaView,
        PanelView,
        PersonalDemo,
        RiskHazardHome,
    },
})
export default class RightDiscussDecibe extends Vue  {

  private severelyAffectedAreaData = [
    { name: '峨山彝族自治县', value: [102.567345, 24.103843] },
    { name: '江川县', value: [102.637615996094, 24.3504201484375] },
    { name: '易门县', value: [101.958070097656, 24.4683083320313] },
  ];
  /*private bg = require(`../../../../assets/img/decisionSupport/panel/panelbg-big.png`);
  private style = {
    backgroundImage: 'url(' + this.bg + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-37px -15px',
    };*/

  private geoJson: any = null;

   private created() {
   /* severelyAffectedAreaServer.getMapJSON().then((res: any) => {
      this.geoJson = res;
      this.afectedAreaFlag = true;
      });*/
    }


}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/LayoutAssist.less');
    
  
    
</style>