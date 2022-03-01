<!--山洪风险的总控制页面，也是入口页面-->
<template>
  <div style="position:relative;height:100%;">
    <div class="rescueTeamsHome_hd title-panel">
      <div class="newDetailsProtrusion_title-panel">山洪风险预警</div>
      <span class="halflist-back" @click="handleBackParent"></span>
    </div>
    <TorrentialFlood
      @getTimeParam="getTimeParam"
      @backParent="backParent"
      :parentHandleClickNumFn="handleClickNumFn"
      :activeTab="parentActiveTab"
    ></TorrentialFlood>
    <!-- <VillageDetails
      style="position:fixed;top:150px;left:500px;"
      v-if="compName"
      :rescueTeamHomeData="rescueTeamHomeData"
      :timeData="timeData"
      @backParent="backParent"
      class="animated flipInY"
    ></VillageDetails>-->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import TorrentialFlood from '@/components/feature/flood/FastAssessment/TorrentialFlood.vue'; // 暴雨风险评估
import VillageDetails from '@/components/feature/flood/FastAssessment/VillageDetails.vue'; // 村庄详情页

@Component({
  name: 'Rainstorm',
  components: {
    TorrentialFlood, // 山洪风险首页
    VillageDetails,
  },
})
export default class RescueTeamContainer extends Vue {
  private rescueTeamHomeData: any = {};
  private parentActiveTab = '';
  private compName: any = ''; // 当前激活的下钻组件
  private popupName: any = ''; // 当前弹窗
  private popupData: any = {}; // 弹窗数据
  private timeData: any = {}; // 当前选择的时间
  // 返回一级页面
  private handleBackParent() {
    this.$emit('tobackParent');
  }

  /**
   * 处理点击
   */
  private handleClickNumFn(resultData: any, compName: any) {
    this.compName = compName;
    this.rescueTeamHomeData = resultData;
  }
  private backParent() {
    this.compName = '';
  }
  // 获取当前选择的时间
  private getTimeParam(params: any) {
    this.timeData = params;
  }
}
</script>
<style lang="less" scoped>
.newDetailsProtrusion_title-panel {
  margin-top: -4px;
  font-style: italic;
  font-weight: 600;
  font-family: 'myHeiti';
  font-size: calc(20px * 1.4);
  color: 00e4ff;
  background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  padding-right: 20px;
  margin-left: 20px;
  line-height: 36px;
  font-family: 'Microsoft Ya Hei';
  filter: drop-shadow(3px 0px 3.5px rgba(0, 0, 0, 0.35));
}
.halflist-back {
  width: 61px;
  height: 25px;
  position: absolute;
  top: 14px;
  right: 4px;
  color: #338af8;
  cursor: pointer;
  z-index: 1;
  background: url('../../../../assets/img/default/panel/toBack.png') no-repeat
    0px 70%;
  background-size: 100% 100%;
  &:hover {
    background-image: url('../../../../assets/img/default/panel/toBack_h.png');
  }
}
</style>
