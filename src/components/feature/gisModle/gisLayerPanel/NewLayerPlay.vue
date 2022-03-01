<template>
  <!-- 播放轴 -->
  <div>
    <!-- <div class="play_shrink" :title="title" v-show="!isShow" @click="handleShowLengend" :style="$store.state.panelPositionChangeModule.topToolbarLocation.playShaftLayer"></div> -->
    <div
      class="play_unfold"
      v-show="isShow"
      :style="
        $store.state.panelPositionChangeModule.topToolbarLocation.playShaftLayer
      "
    >
      <div class="legend_title">
        <span>{{ title }}</span>
      </div>
      <span class="legend_closeBtn" @click="handleShowLengend"></span>
      <div class="legend_play">
        <component :is="component"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import WindDirect from '@/components/feature/gisModle/gisLayerPanel/playShaft/WindDirect.vue'; // 风速风向
import RainForest from '@/components/feature/gisModle/gisLayerPanel/playShaft/RainForest.vue'; // 降水
import radarMap from '@/components/feature/gisModle/gisLayerPanel/playShaft/RadarMap.vue'; // 雷达回波
import satilliteCloud from '@/components/feature/gisModle/gisLayerPanel/playShaft/SatelliteCloud.vue'; // 卫星云图
import FloodForecast from '@/components/feature/gisModle/gisLayerPanel/playShaft/FloodForecast.vue'; // 洪水径流预测
import FallRisk from '@/components/feature/gisModle/gisLayerPanel/playShaft/FallRisk.vue'; // 暴雨风险评估
@Component({
  name: 'LayerPlayShaft',
  components: {
    WindDirect,
    RainForest,
    radarMap,
    satilliteCloud,
    FloodForecast,
    FallRisk,
  },
})
export default class LayerPlayShaft extends Vue {
  private isShow: any = true;
  private title: any = '';
  private component: any = '';
  @Watch('$store.state.mapTools.curSelectLayer')
  private onLayerChanged() {
    this.title = this.$store.state.mapTools.curSelectLayer.name;
    this.component = this.$store.state.mapTools.curSelectLayer.legend.component;
  }
  // 单独播放轴展示，图层图例播放轴隐藏
  @Watch('$store.state.mapTools.showOnlyLayerPlay.isShow')
  private changeLayerPlayShow(val: boolean) {
    if (val) {
      this.$store.commit('mapTools/changeShowLayerPlay', false);
    }
  }
  private created(): void {
    this.onLayerChanged();
  }
  // 播放收起展开
  private handleShowLengend() {
    // this.isShow = !this.isShow;
    this.messsageBus.emit('closeLineHight');
    this.$store.commit('mapTools/changeShowLayerPlay', false);
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../assets/img/gisModule/legendPlanel';
.play_unfold {
  color: #fff;
  width: 950px;
  height: 150px;
  z-index: 1000;
  bottom: 55px;
  position: absolute;
  background: url('@{imgPath}/legendbg.png') no-repeat 0 0;
  background-size: 100% 100%;
  .legend_title {
    color: #67e1fb;
    width: 220px;
    height: 58px;
    line-height: 58px;
    font-size: 24px;
    text-align: center;
    background: url('@{imgPath}/legend_title.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: -18px;
    left: 14px;
  }
  .legend_closeBtn {
    width: 80px;
    height: 35px;
    cursor: pointer;
    background: url('@{imgPath}/closeIcon.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    right: 28px;
    top: 0px;
  }
  .legend_play {
    height: 100%;
    box-sizing: border-box;
    padding: 30px 48px 15px 45px;
  }
}
.play_shrink {
  width: 63px;
  height: 63px;
  cursor: pointer;
  background-image: url('@{imgPath}/legend_modelplay.png');
  background-size: contain;
  position: absolute;
  right: 600px;
  bottom: 51px;
  z-index: 3;
  &:hover {
    background-image: url('@{imgPath}/legend_modelplay_hover.png');
  }
}
</style>
