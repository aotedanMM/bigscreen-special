<template>
  <!-- gis工具容器 -->
  <div class="GisMapContainer" :style = "topToolbarLocation" >
    <ul class="GisMapContainer_ul">
      <!-- <li class="GisMapContainer_ul_li">
        <GisSwitchMap
          v-if="baseLayers.length"
          style="top:5px;right:10px;"
          :options="{ mapId: 'map', baseLayers: baseLayers }"
        />
      </li>-->
      <li class="GisMapContainer_ul_li" v-for="(item,key) in gisToolList" :key="key">
        <components
          :title="item.name"
          @clickHandler="clickHandler"
          :options="item.options || []"
          :is="item.component"
          :ref="item.component"
          v-if="item.component"
        />
        <div
          class="GisMapContainer_ul_li_div"
          :class="['gisMapTool-'+item.class,!item.component&&'fixed',(item.isOpen && 'toolActive')]"
          v-else
          :title="item.title"
          @click="clickHandler(item,key)"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// 灾情动态
import ToolCompared from '@/views/theme/decisionSupport/gisUI/ToolCompared.vue';
// 天气交通
import ToolEventOverview from '@/views/theme/decisionSupport/gisUI/ToolEventOverview.vue';
// 现场情况

import GisVideoSurveillance from '@/components/feature/GIS/GisMenuSearch/GisVideoSurveillance.vue';
import GisOnlineTerminal from '@/components/feature/GIS/GisMenuSearch/GisOnlineTerminal.vue';
import GisOnlinePawn from '@/components/feature/GIS/GisMenuSearch/GisOnlinePawn.vue';
// 切换底图
import GisSwitchMap from '@/components/feature/GIS/GisSwitchMap/GisSwitchMap.vue';
// 工具箱(测量标绘截屏清屏)
import CommonTools from '@/views/commonTool/commonTools.vue';
// 灾情研判
// import disasterDecide from '@/views/disasterDecide/disasterDecide.vue';

// 区域选择
import GisAreaSelection from '@/components/feature/GIS/GisAreaSelection/GisAreaSelection.vue';

// 图层
import GisLayerPanelBtn from '@/components/feature/gisModle/gisLayerPanel/LayerPanelBtn.vue';

// 标绘
import GisPlotControlBtn from '@/components/feature/toolContainer/GisPlotControlBtn.vue';
// 标绘
import GisPlotAroundBtn from '@/components/feature/toolContainer/GisPlotAroundBtn.vue';

@Component({
  name: 'GisMapContainer',
  components: {
    GisSwitchMap,
    ToolCompared,
    ToolEventOverview,
    CommonTools,  // 右侧顶部工具箱集成
    GisVideoSurveillance,  // 右侧顶部工具栏视频监控
    GisOnlineTerminal,  // 右侧顶部工具在线终端
    GisOnlinePawn, // 右侧顶部工具在线单兵
    // disasterDecide,
    GisAreaSelection,
    GisLayerPanelBtn,
    GisPlotControlBtn, // 移出来的标绘按钮
    GisPlotAroundBtn, // 周边查询按钮
  },
})
export default class GisMapContainer extends Vue {
  @Prop({
    default: () => [],
  })
  public gisToolList?: any;
  public right?: number = 0;

  private topToolbarLocation: any = '';

  private clickHandler(item: any, index: number) {
    // 给对应点击的事件 vuex 中赋值
    /**
     * 暂时没有红点  所以这段暂时用不上
     * */
    if (item.pushLocationKeyArr && item.pushLocationKeyArr.length) {
      item.pushLocationKeyArr.forEach((key: string) => {
        // 清除对应total
        this.$store.commit('eventPushStore/setLocationKey', key);
      });
    }
  }

  @Watch('$store.state.panelPositionChangeModule.topToolbarLocation', {deep: true})
  private topToolbarLocationFun() {
    this.topToolbarLocation = this.$store.state.panelPositionChangeModule.topToolbarLocation.ToolbarLocation;
  }

  private created() {
    // 当面板存在时gis工具容器以及周边查询位置
    this.topToolbarLocationFun();
  }
}
</script>

<style lang="less" scoped>
.GisMapContainer {
  position: absolute;
  top: 96px;
  right: 50px;
  z-index: 1;
  height: 60px;
  &_ul {
    margin: 0;
    padding: 0;
    list-style: none;
    &_li {
      float: left;
      position: relative;
      margin-right: -10px;
      &:last-child {
        margin-right: 10px;
      }
      &_div {
        width: 60px;
        min-height: 60px;
        cursor: pointer;
        position: relative;
        margin-left: -11px;
      }
      &.fixed {
        height: 60px;
      }
      &.yingxiang {
        &:hover {
          background: yellow;
        }
      }
      &.sousuo {
        &:hover {
          background: black;
        }
      }
      &.tianyan {
        &:hover {
          background: blue;
        }
      }
      &.qingpin {
        &:hover {
          background: pink;
        }
      }
      &.ziyuanfenxi {
        &:hover {
          background: green;
        }
      }
    }
  }
}
</style>
