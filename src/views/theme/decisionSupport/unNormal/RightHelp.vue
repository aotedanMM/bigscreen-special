<!-- 救援救助 -->
<template>
  <div class="layoutAssist">
    <div class="cu-flex">
      <div class="layoutSidebar_A cu-flex-average">
        <div style="height:34%;">
          <PanelView title="队伍需求" class="cmp-panel-cnt--bg">
            <!-- <TeamNeedView></TeamNeedView> -->
            <TeamNeed></TeamNeed>
          </PanelView>
        </div>
        <div style="height:33%;">
          <PanelView title="现场队伍" class="cmp-panel-cnt--bg">
            <FieldTeamView></FieldTeamView>
          </PanelView>
        </div>
        <div style="height:33%;">
          <PanelView title="人员安置" class="cmp-panel-cnt--bg">
            <PersonnelPlacement></PersonnelPlacement>
          </PanelView>
        </div>  
      </div>
      <div class="layoutSidebar_B cu-flex-average">
        <div style="height:34%;">
          <PanelView title="重点物资需求" class="cmp-panel-cnt--longBg">
            <KeyMaterialDemand/>
          </PanelView>
        </div>
        <div style="height:66%;">
          <PanelView title="物资需求估算" class="cmp-panel-cnt--longBg">
            <MaterialDemandEstimation/>
          </PanelView>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
  // import TeamNeedView from '@/views/common/echarts/TeamNeedView.vue';
  import TeamNeed from '@/views/theme/decisionSupport/module/rescueAidRight/TeamNeed.vue';
  import FieldTeamView from '@/views/common/echarts/FieldTeamView.vue';
  import PersonnelPlacement from '@/views/common/echarts/PersonnelPlacement.vue';
  import KeyMaterialDemand from '@/views/theme/decisionSupport/module/rescueAidRight/KeyMaterialDemand.vue';
  import MaterialDemandEstimation from '@/views/theme/decisionSupport/module/rescueAidRight/MaterialDemandEstimation.vue';
  @Component({
    name: 'RightHelp',
    components: {
      PanelView,
      // TeamNeedView,
      TeamNeed,
      FieldTeamView,
      PersonnelPlacement,
      KeyMaterialDemand,
      MaterialDemandEstimation,
    },
  })
  export default class RightHelp extends Vue {}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/LayoutAssist.less');
</style>