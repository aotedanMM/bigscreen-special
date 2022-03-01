<template>
<div>
      <div class="layer-panel-content"  :class="!$store.state.configModel.config.LayerPanelConfig.showTitle?'panelBox_': ''">
          <el-scrollbar :style="!$store.state.configModel.config.LayerPanelConfig.showTitle?'': 'height:315px'">
            <ul>
              <!-- 这里的key 之所以要和事件绑定，是为了在 layerList重新赋值的时候，可以触发动态组件的生命周期-->
              <li
                v-for="item in layerList"
                :key="item.id + $store.state.eventPushStore.eventId"
              >
                <template v-if="!item.isSingleComp">
                  <div
                    :disabled="item.gray"
                    :class="[
                      'item',
                      { active: item.checked },
                      { gray: item.gray },
                    ]"
                    @click="click(item)"
                    v-if="getFlag(item.id)"
                  >
                    <i
                      class="layerIcon"
                      :class="[item.gray ? item.icon + '-gray' : item.icon]"
                    ></i>
                    <span>{{ item.name }}</span>
                    <i
                      v-if="item.id === 'populationHeat'"
                      :class="!isNight ? 'dayIcon' : 'nightIcon'"
                      @click.stop="handleDayNight(item)"
                    ></i>
                  </div>
                </template>
                <template v-else>
                  <!-- 把经验圈和烈度圈做成组件，这样减少本vue的代码行数和逻辑串联的压力 -->
                  <component :is="item.componetName" :compParam="item">
                    <!--这个地方用插槽是因为，组件内部的样式和其他图层的样式都是一样的，
                                  不想写重复代码，以便适应扩展-->
                    <template
                      v-if="item.isUseStyleSlot"
                      v-slot:styleContainer="slotProps"
                    >
                      <div
                        :disabled="item.gray"
                        :class="[
                          'item',
                          { active: slotProps.item.checked },
                          { gray: item.gray },
                        ]"
                      >
                        <i
                          class="layerIcon"
                          :class="[item.gray ? item.icon + '-gray' : item.icon]"
                        ></i>
                        <span>{{ item.name }}</span>
                      </div>
                    </template>
                  </component>
                </template>
              </li>
            </ul>
          </el-scrollbar>
        </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import InfluenceCircle from '@/components/feature/gisModle/gisLayerPanel/layerChild/InfluenceCircle.vue';
import IntensityCircle from '@/components/feature/gisModle/gisLayerPanel/layerChild/IntensityCircle.vue';
import MapCommon from '@/util/MapCommon';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import FloodLegendEvent from '@/util/FloodLegendEvent';
import EventConfigRegistry from '@/util/eventConfigRegistry';
/**
 * 图层
 */
@Component({
  name: 'NewLayerPanelSelect',
    components: {
    InfluenceCircle,
    IntensityCircle,
  },
  mixins: [
    MapCommon,
    GisAreaSelectEvent,
    FloodLegendEvent,
    EventConfigRegistry,
  ],
})
export default class NewLayerPanelSelect extends Vue {
  @Prop() private layerList: any;
  @Prop() private isNight?: any; // 是否黑夜
private handleDayNight(item: any) {
  this.$emit('handleDayNight', item);
}
private click(item: any) {
  this.$emit('changeClickLi', item);
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
}

</script>

<style lang="less" scoped>
@imgPath: "../../../../assets/img/gisModule/legendPlanel";
@icon: "../../../../assets/img/gisModule/gisLayerPanel/newLayerPanel";
@url: '../../../../assets/img/gisModule/gisLayerPanel';
.layer-panel-content {
  max-height: 375px;
  padding: 40px 20px 20px 20px;
  box-sizing: border-box;
  pointer-events: auto;
  // .el-scrollbar {
  //   height: 315px;
  // }
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
.panelBox_{
  padding: 0px 20px 0px 20px;
}
</style>
