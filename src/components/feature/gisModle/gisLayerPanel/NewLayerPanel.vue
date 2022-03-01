<template>
  <div class="newLayerPanel">
    <!-- 新图层 -->
    <div v-show="$store.state.configModel.config.LayerPanelConfig.isShow">
      <div
        class="triggerBtn"
        @click="isHideLegend"
        v-show="!expanded"
        :style="
          $store.state.panelPositionChangeModule.topToolbarLocation
            .RegionSelection
        "
      ></div>
    </div>
    <!-- 其他状体 下显示这个 -->
    <div
      class="layer-panel"
      v-show="
        expanded || !$store.state.configModel.config.LayerPanelConfig.isShow
      "
      :style="
        $store.state.panelPositionChangeModule.topToolbarLocation
          .RegionSelection
      "
    >
      <div class="panel-legend" v-show="isShowLegend">
        <NewLayerLegend @cancelShowLegend="cancelShowLegend" @changeClickLi='click' @handleDayNight="handleDayNight" :layerList="layerList" :isNight='isNight'></NewLayerLegend>
      </div>
      <div class="panel-legend" v-show="isTyphoonShowLegend">
        <TyphoonNewLayerPanel></TyphoonNewLayerPanel>
      </div>
      <div
        class="panel-layer"
        v-show="$store.state.configModel.config.LayerPanelConfig.isShow"
        :class="$store.state.configModel.config.LayerPanelConfig.showTitle?'':'senHuoLengen'"
      >
        <div class="layer-panel-title">
          <div class="title" v-show="$store.state.configModel.config.LayerPanelConfig.showTitle">
            <i>图层</i>
          </div>
          <div class="close" @click.stop="isHideLegend"></div>
        </div>
        <NewLayerPanelSelect @changeClickLi='click' @handleDayNight="handleDayNight" :layerList="layerList" :isNight='isNight'></NewLayerPanelSelect>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import FloodLegendEvent from '@/util/FloodLegendEvent';
import NewLayerLegend from '@/components/feature/gisModle/gisLayerPanel/NewLayerLegend.vue'; // 新图例
import NewLayerPanelSelect from '@/components/feature/gisModle/gisLayerPanel/NewLayerPanelSelect.vue'; // 新图例
import TyphoonNewLayerPanel from '@/components/feature/gisModle/gisLayerPanel/TyphoonNewLayerPanel.vue'; // 新图例
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import InfluenceCircle from '@/components/feature/gisModle/gisLayerPanel/layerChild/InfluenceCircle.vue';
import IntensityCircle from '@/components/feature/gisModle/gisLayerPanel/layerChild/IntensityCircle.vue';
@Component({
  name: 'GisLayerPanel',
  components: {
    NewLayerLegend,
    TyphoonNewLayerPanel,
    InfluenceCircle,
    IntensityCircle,
    NewLayerPanelSelect,
  },
  mixins: [
    MapCommon,
    GisAreaSelectEvent,
    FloodLegendEvent,
    EventConfigRegistry,
  ],
})
export default class GisLayerPanel extends Vue {
  private isShowLegend: boolean = false; // 图例是否显示
  private isTyphoonShowLegend: boolean = false; // 图例是否显示
  private expanded: boolean = false; // 图层是否放大
  private gisComponentConfig: any = {};
  private activeId: any = ''; // 当前点击的id
  private layerList: any = [];
  private dayOrNight: any = null; // 白天黑夜的定时器
  private isNight: boolean = true; // 是否黑夜
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  @Watch('$store.state.configModel.config')
  private updateLayerListConfig() {
    this.layerList = [];
    this.expanded = false;
    if (
      this.$store.state.configModel.config.LayerPanelConfig &&
      this.$store.state.configModel.config.LayerPanelConfig.newLayerList
    ) {
      this.layerList = this.$store.state.configModel.config.LayerPanelConfig.newLayerList;
    }
  }
  // <!-- 这里的暂时将它不展示后期可能要放开就不要这个方法就好了 -->
  private getFlag(id: any) {
    switch (id) {
      case 'WindLayer':
      case 'rainForecast':
      case 'radarMap':
      case 'satilliteCloud':
      case 'WindField':
        return false;
        break;
      default:
        return true;
        break;
    }
  }
  // 监听为常态还是非常态 --> 复制
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private changeEventType(val: string) {
    if (val !== '10') {
      this.isTyphoonShowLegend = false;
    } else {
      this.isTyphoonShowLegend = true;
    }
  }
  private mounted() {
    const self = this;
    // 台风销毁时，关闭或隐藏
    this.messsageBus.on('closeTyphoonLegend', (bool: any) => {
      this.isTyphoonShowLegend = bool;
    });
    this.messsageBus.on('closePlanHeight', (data: any) => {
      self.layerList.forEach((item: any) => {
        if (item.id === data) {
          item.checked = false;
        }
      });
      });
  }

  // 监听河流列表是否打开，如若打开，需要监听是否点击了河流监测站
  @Watch('$store.state.mapTools.showRiverList.isShow')
  private riverListIsShow(val: boolean) {
    if (val) {
      this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    }
  }
  @Watch('$store.state.earthQuake.isShowChemicalBlastLegend')
  private chemicalBlastIsShow(val: boolean) {
    if (val) {
      this.isShowLegend = this.$store.state.earthQuake.isShowChemicalBlastLegend;
    } else {
      this.isShowLegend = false;
    }
  }
  private isHideLegend() {
    this.expanded = !this.expanded;
    // this.$store.commit('mapTools/changeShowLayerPlay', false);
  }

  // 根据配置获取对应的gis组件
  private getComponentByConfig(config: any) {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules[config.module].getComponent(config.component);
    return component;
  }
  // 监听河流研判是否高亮
  private watchHlypIsHighLight() {
    this.getComponent_AreaSelectJudgement().unload();
    this.closeRiver();
  }

  private created() {
    this.timingDayOrNight();
    this.updateLayerListConfig();
    // 这里从配置文件拿，理论上是不用进行if判断的。
    if (
      this.$store.state.configModel.config.LayerPanelConfig &&
      this.$store.state.configModel.config.LayerPanelConfig.gisComponentConfig
    ) {
      this.gisComponentConfig = this.$store.state.configModel.config.LayerPanelConfig.gisComponentConfig;
    }
    // 点击地图河流弹出河流详情，有id显示详情，没id画河不显示详情
    this.getComponent_RiverNetworkJudgement().on('riverClick', (res: any) => {
      this.$store.commit('mapTools/changeNearbyQueryVisible', false); // 清周边分析
      this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
      if (res) {
        const params = {
          isShow: res.id ? true : false,
          isEntranceList: false, // 是否列表入口
          params: res,
        };
        this.messsageBus.emit('updateRiverDetail', params);
      }
    });
    // 从河流列表画河，点击河流弹出河流详情
    this.getComponent_AreaSelectJudgement().on('riverClick', (res: any) => {
      this.$store.commit('mapTools/changeNearbyQueryVisible', false); // 清周边分析
      this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
      if (res) {
        const params = {
          isShow: true,
          isEntranceList: false, // 是否列表入口
          params: {
            id: res.riverID,
            name: res.riverName,
            geom: res.geom,
          },
        };
        this.messsageBus.emit('updateRiverDetail', params);
      }
    });
    // 点击河流区域按钮显示隐藏河流详情
    this.getComponent_AreaSelectJudgement().on(
      'showRiverPanel',
      (flagRes: any) => {
        // 1表示显示，2表示隐藏
        if (flagRes === 1) {
          // 点击河流小手，触发河流列表
          const params = {
            isShow: true,
            isMajorRiver: this.$store.state.mapTools.showRiverList.isMajorRiver,
            name: this.$store.state.mapTools.showRiverList.name,
          };
          this.$store.commit('mapTools/changeShowRiverList', params);
          this.messsageBus.emit('updateRiverList', true);
        } else {
          this.closeRiver();
        }
      },
    );

    // 重点河流事件监听
    this.getImportantRiverComponent().on('riverClick', (res: any) => {
      this.$store.commit('mapTools/changeNearbyQueryVisible', false); // 清周边分析
      this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
      if (res) {
        const params = {
          isShow: true,
          isEntranceList: false, // 是否列表入口
          params: {
            id: res.id,
            name: res.name,
            geom: res.geometry,
          },
        };
        this.messsageBus.emit('updateRiverDetail', params);
      }
    });
    this.messsageBus.off('zhypClosedHlyp', this.watchHlypIsHighLight);
    this.messsageBus.on('zhypClosedHlyp', this.watchHlypIsHighLight);
  }

  private closeRiver() {
    // 关闭列表
    this.messsageBus.emit('updateRiverList', false);
    // 关闭详情
    const params = {
      isShow: false,
      params: {},
    };
    this.messsageBus.emit('updateRiverDetail', params);
    // 取消高亮 综合研判-河流研判
    const geoStrObj = {
      filter: {
        districtCode: '', // '370686'
        geometry: '',
      },
      zhypGeoType: {},
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
  }
  private click(item: any) {
    if (item.gray) {
      return;
    }
    this.activeId = item.id;
    if (item.checked) {
      item.checked = false;
      this.remove(item);
    } else {
      item.checked = true;
      this.add(item);
    }
  }
  // 添加图层
  private add(item: any) {
    // 更新图例
    const legendParams = {
      id: item.id,
      name: item.name,
      legend: item.legend,
      play: item.isHasPaly,
    };
    if (item.legend.component) {
      if (item.legend.component === 'satilliteCloud') {
        this.isShowLegend = false;
        this.$store.commit('mapTools/changeCurSelectLayer', legendParams);
      } else {
        this.isShowLegend = true;
        this.$store.commit('mapTools/addSelectedLayer', legendParams);
        this.$store.commit('mapTools/changeCurSelectLayer', legendParams);
      }
    } else {
      this.isShowLegend = false;
      this.$store.commit('mapTools/changeShowLayerPlay', false);
    }
    // 更新图层
    const gisComponentConfig: any = this.gisComponentConfig[item.id];
    if (gisComponentConfig) {
      const component: any = this.getComponentByConfig(gisComponentConfig);
      const method: any = gisComponentConfig.add.method || 'load';
      if (item.id === 'populationHeat') {
        gisComponentConfig.add.arguments[1] = this.isNight;
        const args: any = gisComponentConfig.add.arguments || [];
        component[method].apply(component, args);
      } else {
        const args: any = gisComponentConfig.add.arguments || [];
        component[method].apply(component, args);
      }
    }
    if (item.id === 'RiverLayer') {
      this.getImportantRiverComponent()
        .addImportantRiver(false)
        .then((riverId: any) => {
          const opts = {
            rivers: riverId,
          };
          this.getComponent().on(
            'WindWaterRainWork_popup',
            this.popupData,
            this,
          );
          this.getComponent().addResource_River(opts);
        });
    }
    // 地震带
    if (item.id === 'earthQuakeZone') {
      this.getComponent1().addLayer('EarthQuakeZoneLayer');
    }
    // 华北地震带
    if (item.id === 'EarthquakeRuptureBeltLayerTwo') {
      this.getComponent1().addLayer('EarthQuakeZoneLayerHB');
    }
    // 地震断裂带
    if (item.id === 'EarthquakeRuptureBeltLayer') {
      this.getComponent1().addLayer('EarthquakeRuptureBeltLayer');
    }
    // 地震监测台站
    if (item.id === 'SeismicSonitoringStationLayer') {
      this.messsageBus.emit('closeHight', 'monitorstation');
      this.getComponent_Resource().showResourceTip(
        'monitorstation',
      );
    }

    // 避难场所
    if (item.id === 'ShelterLayer') {
      this.getComponent_Resource().showResourceTip('shelter');
    }
    // 渔港码头
    if (item.id === 'FishingPortWharfLayer') {
      this.getComponent_Resource().showResourceTip('portwharf');
    }
  }
  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
    return component;
  }
  // 移除图层
  private remove(item: any) {
    const gisComponentConfig: any = this.gisComponentConfig[item.id];
    if (gisComponentConfig) {
      const component: any = this.getComponentByConfig(gisComponentConfig);
      const method: any = gisComponentConfig.remove.method || 'unload';
      const args: any = gisComponentConfig.add.arguments || [];
      component[method].apply(component, args);
    }
    if (item.id === 'RiverLayer') {
      this.getImportantRiverComponent().removeImportantRiver();
      this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
      this.getComponent().removeResource('river');
    }
    // 移除图层地震带
    if (item.id === 'earthQuakeZone') {
      this.getComponent1().removeLayer('EarthQuakeZoneLayer');
    }
    // 华北地震带
    if (item.id === 'EarthquakeRuptureBeltLayerTwo') {
      this.getComponent1().removeLayer('EarthQuakeZoneLayerHB');
    }
    // 移除图层地震断裂带
    if (item.id === 'EarthquakeRuptureBeltLayer') {
      this.getComponent1().removeLayer('EarthquakeRuptureBeltLayer');
    }
    // 移除图层地震监测台站
    if (item.id === 'SeismicSonitoringStationLayer') {
      this.messsageBus.emit('closeHight', 'monitorstation');
      this.getComponent_Resource()._clearLayerByID(
        'monitorstation',
      );
    }
    // 移除图层避难场所
    if (item.id === 'ShelterLayer') {
      this.getComponent_Resource()._clearLayerByID('shelter');
    }
    // 移除图层渔港码头
    if (item.id === 'FishingPortWharfLayer') {
      this.getComponent_Resource()._clearLayerByID('portwharf');
    }
    // 移除图例
    this.$store.commit('mapTools/removeSelectedLayer', {
      id: item.id,
    });
    // 移除播放轴
    this.$store.commit('mapTools/changeCurSelectLayer', {});
  }
  // 移除所有图层
  private removeAllLayer() {
    this.visitLayer(this.layerList, (item: any) => {
      if (item.checked) {
        item.checked = false;
        this.remove(item);
      }
    });
  }
  // 遍历图层
  private visitLayer(data: any, visitor: any) {
    for (const typeItem of this.layerList) {
      for (const item of typeItem.children) {
        visitor(item);
      }
    }
  }
  // 获取重点河流和站点组件
  private getImportantRiverComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent(
      'importantRiverAndStations',
    );
    return component;
  }
  // 获取河流监测站点组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  //  地图组件
  private getComponent_Resource() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }
  // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'waterMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    if (event.type === 'water') {
      if (!event.data.waterLevel || event.data.waterLevel === '满库') {
        event.type = 'reservoirBrief';
      }
    }
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 关闭
  private close() {
    this.$store.commit('mapTools/changeShowLayerPanel', false);
    this.removeAllLayer();
  }
  // 取消展示图例
  private cancelShowLegend(selectedLayers: any) {
    this.isShowLegend = selectedLayers.length > 0 ? true : false;
  }
  // 计算是白天还是晚上
  private calcDayOrNight() {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    // 6:01 - 18:00 太阳    18:01 - 06.00 月亮
    if (hour >= 6 && hour < 18) {
      if (minutes >= 1) {
        this.isNight = false;
      } else {
        this.isNight = true;
      }
    } else {
      this.isNight = true;
    }
  }
  // 定时是白天还是晚上
  private timingDayOrNight() {
    this.calcDayOrNight();
    this.dayOrNight = setInterval(() => {
      this.calcDayOrNight();
    }, 6000000);
  }
  // 点击白天黑夜
  private handleDayNight(item: any) {
    clearInterval(this.dayOrNight);
    item.checked = true;
    this.isNight = !this.isNight;
    const gisComponentConfig: any = this.gisComponentConfig[item.id];
    if (gisComponentConfig) {
      const component: any = this.getComponentByConfig(gisComponentConfig);
      const method: any = gisComponentConfig.add.method || 'load';
      gisComponentConfig.add.arguments[1] = this.isNight;
      const args: any = gisComponentConfig.add.arguments || [];
      component[method].apply(component, args);
    }
  }
  // 销毁 离开页面清理地图
  private beforeDestroy() {
    this.removeAllLayer();
    this.getComponent_RiverNetworkJudgement().off('riverClick');
    this.getComponent_AreaSelectJudgement().off('riverClick');
    this.getImportantRiverComponent().off('riverClick');
  }
}
</script>

<style lang="less" scoped>
@imgPath: "../../../../assets/img/gisModule/legendPlanel";
@icon: "../../../../assets/img/gisModule/gisLayerPanel/newLayerPanel";
.newLayerPanel {
  .triggerBtn {
    position: fixed;
    right: 400px;
    bottom: 55px;
    width: 63px;
    height: 63px;
    cursor: pointer;
    pointer-events: auto;
    background-image: url("@{imgPath}/legend.png");
    background-size: contain;
    z-index: 2;
    &:hover {
      background-image: url("@{imgPath}/legendhover.png");
      z-index: 3;
    }
  }
  .rightClass {
    right: 594px !important;
  }
  .layer-panel {
    position: absolute;
    bottom: 45px;
    height: 390px;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
    .panel-legend {
      width: 225px;
      background: url("@{imgPath}/legendLeftBg.png") no-repeat;
      background-position: 10px 10px;
      background-size: 100% 96.5%;
    }
    .panel-layer {
      width: 254px;
      background: url("@{imgPath}/legendRightBg.png") no-repeat;
      background-position: -15px -2px;
      background-size: 100% 100%;
    }
    .layer-panel-title {
      position: absolute;
      top: -7px;
      display: flex;
      justify-content: space-between;
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 50px;
        background: url("@{imgPath}/layerTextBg.png") no-repeat;
        background-size: 128% 125%;
        background-position: -5px -4px;
        i {
          font-size: 24px;
          color: #67e1fb;
          font-style: inherit;
        }
      }
      .close {
        width: 55px;
        height: 36px;
        background: url("@{imgPath}/legendhide.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        margin: 10px 0 0 80px;
      }
    }
    .layer-panel-content {
      height: 375px;
      padding: 40px 20px 20px 20px;
      box-sizing: border-box;
      .el-scrollbar {
        height: 315px;
      }
      li {
        display: flex;
        align-items: center;
        color: #fff;
        .item {
          display: flex;
          align-items: center;
          width: 100%;
          height: 50px;
          font-size: 22px;
          line-height: 50px;
          box-sizing: border-box;
          cursor: pointer;
          &.active,
          &:hover {
            color: #fffabe;
            .fsfx {
              background: url("@{icon}/fsfx-active.png") no-repeat center / 120%
                120%;
            }
            .js {
              background: url("@{icon}/js-active.png") no-repeat center / 120%
                120%;
            }
            .ldt {
              background: url("@{icon}/ldt-active.png") no-repeat center / 100%
                100%;
            }
            .wxyt {
              background: url("@{icon}/wxyt-active.png") no-repeat center / 100%
                100%;
            }
            .lyj {
              background: url("@{icon}/lyj-active.png") no-repeat center / 100%
                100%;
            }
            .hwsx {
              background: url("@{icon}/hwsx-active.png") no-repeat center / 100%
                100%;
            }
            .khsx {
              background: url("@{icon}/khsx-active.png") no-repeat center / 100%
                100%;
            }
            .rkrl {
              background: url("@{icon}/rkrl-active.png") no-repeat center / 100%
                100%;
            }
            .jtlk {
              background: url("@{icon}/jtlk-active.png") no-repeat center / 100%
                100%;
            }
            .dzd {
              background: url("@{icon}/dzd-active.png") no-repeat center / 82%
                75%;
            }
            .dzdld {
              background: url("@{icon}/dzdld-active.png") no-repeat center / 90%
                80%;
            }
            .dzjctz {
              background: url("@{icon}/dzjctz-active.png") no-repeat center /
                90% 80%;
            }
            .dzbncs {
              background: url("@{icon}/dzbncs-active.png") no-repeat center /
                90% 80%;
            }
            .ygmt {
              background: url("@{icon}/ygmt-active.png") no-repeat center / 90%
                80%;
            }
          }
          .layerIcon {
            width: 40px;
            height: 40px;
            margin-right: 5px;
          }
          .dayIcon {
            width: 18px;
            height: 18px;
            background: url("@{imgPath}/Day.png") no-repeat center / 100% 100%;
            margin: -15px 0 0 10px;
            cursor: pointer;
          }
          .nightIcon {
            width: 18px;
            height: 18px;
            background: url("@{imgPath}/Night.png") no-repeat center / 100% 100%;
            margin: -15px 0 0 10px;
            cursor: pointer;
          }
        }
        .gray {
          -webkit-filter: grayscale(1);
          filter: gray;
          filter: grayscale(1);
          &.active,
          &:hover {
            color: #fff !important;
          }
        }
        .fsfx {
          background: url("@{icon}/fsfx.png") no-repeat center / 100% 100%;
        }
        .js {
          background: url("@{icon}/js.png") no-repeat center / 100% 100%;
        }
        .ldt {
          background: url("@{icon}/ldt.png") no-repeat center / 100% 100%;
        }
        .wxyt {
          background: url("@{icon}/wxyt.png") no-repeat center / 100% 100%;
        }
        .lyj {
          background: url("@{icon}/lyj.png") no-repeat center / 100% 100%;
        }
        .hwsx {
          background: url("@{icon}/hwsx.png") no-repeat center / 100% 100%;
        }
        .khsx {
          background: url("@{icon}/khsx.png") no-repeat center / 100% 100%;
        }
        .rkrl {
          background: url("@{icon}/rkrl.png") no-repeat center / 100% 100%;
        }
        .jtlk {
          background: url("@{icon}/jtlk.png") no-repeat center / 100% 100%;
        }
        .dzd {
          background: url("@{icon}/dzd.png") no-repeat center / 82% 75%;
        }
        .dzdld {
          background: url("@{icon}/dzdld.png") no-repeat center / 90% 80%;
        }
        .dzjctz {
          background: url("@{icon}/dzjctz.png") no-repeat center / 90% 80%;
        }
        .dzbncs {
          background: url("@{icon}/dzbncs.png") no-repeat center / 90% 80%;
        }
        .ygmt {
          background: url("@{icon}/ygmt.png") no-repeat center / 90% 80%;
        }
        .fsfx-gray {
          background: url("@{icon}/fsfx.png") no-repeat center / 100% 100%;
        }
        .js-gray {
          background: url("@{icon}/js.png") no-repeat center / 100% 100%;
        }
        .ldt-gray {
          background: url("@{icon}/ldt.png") no-repeat center / 100% 100%;
        }
        .wxyt-gray {
          background: url("@{icon}/wxyt.png") no-repeat center / 100% 100%;
        }
        .lyj-gray {
          background: url("@{icon}/lyj.png") no-repeat center / 100% 100%;
        }
        .hwsx-gray {
          background: url("@{icon}/hwsx.png") no-repeat center / 100% 100%;
        }
        .khsx-gray {
          background: url("@{icon}/khsx.png") no-repeat center / 100% 100%;
        }
        .rkrl-gray {
          background: url("@{icon}/rkrl.png") no-repeat center / 100% 100%;
        }
        .jtlk-gray {
          background: url("@{icon}/jtlk.png") no-repeat center / 100% 100%;
        }
        .influenceCircle {
          background: url("@{imgPath}/earDis.png") no-repeat center;
        }
        .intensityCircle {
          background: url("@{imgPath}/liedu.png") no-repeat center;
        }
      }
    }
  }
  .senHuoLengen{
      max-height: 190px;
      margin-top: 146px;
      padding-top: 50px;
      pointer-events: none;
      .close{
        pointer-events: auto;
        margin: 156px 0px 0 173px!important;
      }
    }
}
</style>
