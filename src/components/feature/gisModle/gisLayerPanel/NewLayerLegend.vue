<template>
  <!-- 新图层 图例 -->
  <div class="layer-legend">
    <div class="legend_title">
      <span :title="title">{{ title }}</span>
      <span
        @click="changeLable"
        v-show="(legendList && legendList.length > 1) || !$store.state.configModel.config.LayerPanelConfig.isShow"
      ></span>
    </div>
    <div class="changeBox" v-show="showOptions">
      <el-scrollbar style="height: 137px" class="">
        <div v-show="!$store.state.configModel.config.LayerPanelConfig.isShow">
          <!-- NewLayerPanelSelect这个组件完全是为了实现功能将代码抽出去的 实现原理就是通过发送事件在该vue文件来进行对应的功能 -->
          <NewLayerPanelSelect @changeClickLi='click' @handleDayNight="handleDayNight" :layerList="layerList" :isNight='isNight'></NewLayerPanelSelect>
        </div>
        <ul>
          <li
            v-for="(item, index) in legendList"
            :key="index"
            @click="changeOptions(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <el-scrollbar>
        <component
        class="legendBox"
        :is="component"
        :tabtitle="title"
        :componentParam="componentParam"
        ></component>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import NewLayerPanelSelect from '@/components/feature/gisModle/gisLayerPanel/NewLayerPanelSelect.vue'; // 新图例
import LayerRainFall from '@/components/feature/gisModle/gisLayerPanel/legendVariety/LayerRainFall.vue'; // 降雨
import ShipLegend from '@/components/feature/gisModle/gisLayerPanel/legendVariety/ShipLegend.vue'; // 船舶
import Radar from '@/components/feature/gisModle/gisLayerPanel/legendVariety/Radar.vue'; // 雷达图
import Wind from '@/components/feature/gisModle/gisLayerPanel/legendVariety/Wind.vue'; // 风速风向
import Typhoon from '@/components/feature/gisModle/gisLayerPanel/legendVariety/Typhoon.vue'; // 台风
import Traffic from '@/components/feature/gisModle/gisLayerPanel/legendVariety/Traffic.vue'; // 交通路况
import Population from '@/components/feature/gisModle/gisLayerPanel/legendVariety/Population.vue'; // 人口热力
import RainForest from '@/components/feature/gisModle/gisLayerPanel/legendVariety/RainForest.vue'; // 降水
import satilliteCloud from '@/components/feature/gisModle/gisLayerPanel/legendVariety/SatelliteCloud.vue'; // 卫星云图
import radarMap from '@/components/feature/gisModle/gisLayerPanel/legendVariety/RadarMap.vue'; // 雷达回波
import WindDirect from '@/components/feature/gisModle/gisLayerPanel/legendVariety/WindDirect.vue'; // 风速风向
import RainStation from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/RainStation.vue'; // 雨量站
import Reservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Reservoir.vue'; // 水库测站
import Riverway from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Riverway.vue'; // 河道站
import LiftMonitoring from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/LiftMonitoring.vue'; // 工情监测站
import WindMonitoring from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/WindMonitoring.vue'; // 风力监测站
import FloodForecast from '@/components/feature/gisModle/gisLayerPanel/legendVariety/FloodForecast.vue'; // 洪水径流预测
import FallRisk from '@/components/feature/gisModle/gisLayerPanel/legendVariety/FallRisk.vue'; // 暴雨风险评估
import WindThwartwise from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/WindThwartwise.vue'; // 风力横向
import RainfallThwartwise from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/RainfallThwartwise.vue'; // 降雨横向
import bigReservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/bigReservoir.vue'; // 水库测站-大型水库
import middleReservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/middleReservoir.vue'; // 水库测站-中型水库
import smallOneTopReservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/smallOneTopReservoir.vue'; // 水库测站-头顶库
import smallOneReservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/smallOneReservoir.vue'; // 水库测站-非头顶库
import warning from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/warning.vue'; // 水库测站-告警水库
import allReservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/allReservoir.vue'; // 水库测站-全部水库
import normalReservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/reservoirAll/normalReservoir.vue'; // 水库测站-new水库
import ForestResources from '@/components/feature/gisModle/gisLayerPanel/legendVariety/ForestResources.vue'; // 森防图层-森林资源图例
import TreeStructure from '@/components/feature/gisModle/gisLayerPanel/legendVariety/TreeStructure.vue'; // 森防图层-树种结构图例
import EarthQuakeModel from '@/components/feature/gisModle/gisLayerPanel/earthQuakeModel/EarthQuakeModel.vue'; // 地震专题模型图例

@Component({
  name: 'LayerLegend',
  components: {
    LayerRainFall,
    Radar,
    Wind,
    Typhoon,
    Traffic,
    Population,
    ShipLegend,
    RainForest,
    satilliteCloud,
    radarMap,
    WindDirect,
    RainStation,
    Reservoir,
    Riverway,
    LiftMonitoring,
    WindMonitoring,
    FloodForecast,
    FallRisk,
    WindThwartwise,
    RainfallThwartwise,
    bigReservoir,
    middleReservoir,
    smallOneTopReservoir,
    smallOneReservoir,
    warning,
    allReservoir,
    normalReservoir,
    ForestResources,
    TreeStructure,
    EarthQuakeModel,
    NewLayerPanelSelect,
  },
})
export default class LayerLegend extends Vue {
  @Prop() private layerList: any;
  @Prop() private isNight?: any; // 是否黑夜
  private title: any = '';
  private component: any = '';
  private showOptions: any = false;
  private legendList: any = [];
  private componentParam: any = {};
  @Watch('$store.state.earthQuake.chemicalBlastLegend', {deep: true})
  private chemicalBlastIsShow(val: boolean) {
    if (this.$store.state.earthQuake.isShowChemicalBlastLegend) {
      this.legendList = this.$store.state.earthQuake.chemicalBlastLegend.data;
      this.title = this.legendList[0].label;
      this.component = this.legendList[0].component;
    }
  }
  /**
   * 更新图例系限时
   */
  @Watch('$store.state.mapTools.selectedLayers', { deep: true })
  private onLayerChanged(val: any) {
    this.$store.commit('mapTools/changeShowLayerPlay', false);
    this.updateLegend();
  }
  @Watch('$store.state.mapTools.curSelectLayer', { deep: true })
  private onLPlayChanged() {
    const isPlay = this.$store.state.mapTools.curSelectLayer.play;
    this.$store.commit('mapTools/changeShowLayerPlay', isPlay);
  }
  private mounted() {
    this.updateLegend();
  }
private handleDayNight(item: any) {
  this.showOptions = false;
  this.$emit('handleDayNight', item);
}
private click(item: any) {
  this.showOptions = false;
  this.$emit('changeClickLi', item);
}
  private updateLegend() {
    const selectedLayers: any = this.$store.state.mapTools.selectedLayers;
    this.$emit('cancelShowLegend', selectedLayers);
    this.legendList = [];
    if (selectedLayers.length === 0) {
      this.title = '';
      this.component = '';
      return;
    }
    for (const item of selectedLayers) {
      if (item.legend && item.legend.component) {
        this.legendList.push({
          id: item.id,
          label: item.name,
          component: item.legend.component,
          play: item.play,
        });
      }
      this.component = item.legend.component;
      this.title = item.name;
      this.componentParam = this.$store.state.configModel.config.legendConfig[
        item.id
      ];
      const legendParams = {
        id: item.id,
        label: item.name,
        component: item.legend.component,
        play: item.play,
      };
      this.setCurSelectLayer(legendParams);
    }
  }
  private changeLable() {
    this.showOptions = !this.showOptions;
    if (this.$store.state.earthQuake.isShowChemicalBlastLegend) {
      this.legendList = this.$store.state.earthQuake.chemicalBlastLegend.data;
    }
  }
  private changeOptions(item: any) {
    this.title = item.label;
    this.component = item.component;
    this.componentParam = this.$store.state.configModel.config.legendConfig[
      item.id
    ];
    this.$store.commit('earthQuake/setCurrentSelectLegend', this.title);
    this.showOptions = false;
    this.setCurSelectLayer(item);
  }
  // 切换图例，更新当前选中项
  private setCurSelectLayer(item: any) {
    const legendParams = {
      id: item.id,
      name: item.label,
      legend: {
        component: item.component,
      },
      play: item.play,
    };
    this.$store.commit('mapTools/changeCurSelectLayer', legendParams);
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../assets/img/gisModule/legendPlanel';
.layer-legend {
  color: #fff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 25px 15px 20px 35px;
  .legend_title {
    color: #67e1fb;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // background: url('@{imgPath}/legend_title.png') no-repeat 0 0;
    // background-size: 100% 100%;
    // position: absolute;
    // top: -7px;
    // left: 12px;
    display: flex;
    align-items: center;
    span:nth-child(1) {
      width: 147px;
      font-size: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
    span:nth-child(2) {
      width: 28px;
      height: 28px;
      // margin-left: 10px;
      background: url('@{imgPath}/legendChange.png') no-repeat 0 0;
      background-size: 100% 100%;
      display: inline-block;
      &:hover {
        width: 28px;
        height: 28px;
        background: url('@{imgPath}/changeHover.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
  .changeBox {
    width: 218px;
    height: 137px;
    background: url('@{imgPath}/optionBg.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: 57px;
    left: 16px;
    z-index: 2;
    padding: 15px 0;
    ul {
      li {
        text-align: center;
        height: 42px;
        font-size: 26px;
        line-height: 42px;
        color: #fff7cd;
        cursor: pointer;
        &:hover {
          height: 42px;
          background: url('@{imgPath}/options.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
    }
  }
  .changeBoxTwo {
    width: 240px;
    height: 137px;
    background: url('@{imgPath}/optionBg.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: 57px;
    left: 150px;
    z-index: 2;
    padding: 15px 0;
  }
  .el-scrollbar {
      height: 295px;
      .legendBox {
        width: 100%;
        box-sizing: border-box;
    }
  }
}
.smallBtn {
  width: 63px;
  height: 63px;
  cursor: pointer;
  background-image: url('@{imgPath}/legend.png');
  background-size: contain;
  position: absolute;
  bottom: 120px;
  z-index: 3;
  &:hover {
    background-image: url('@{imgPath}/legendhover.png');
    z-index: 3;
  }
}
</style>
