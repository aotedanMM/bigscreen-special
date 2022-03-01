<template>
  <!-- 快速评估入口页面 -->
  <div style="position:relative;height:100%;">
    <div
      class="panelPublicDefault FastAssessmentBox"
      v-if="componentNames === ''"
    >
      <span
        v-if="
          $store.state.eventPushStore.eventLocation.EventType.toString() ===
            '10' && $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
        "
        class="closeAndback"
        @click="closeAndbackFn"
      ></span>
      <div class="panelPublicDefault_hd">
        <span
          class="title-panel"
          style="position: relative; left: -10px; top: -1px"
          >快速评估</span
        >
        <ZoomBtn></ZoomBtn>
      </div>
      <div class="panelPublicDefault_bd">
        <div class="btnGroupList">
          <template
            v-for="(item) in btnGroupList"
          >
            <p
              v-show="item.isStartUse"
              :class="item.checked ? 'active' : ''"
              v-if="item.id !== 'GisEarthQuakeIntensity'"
              @click="handleShowLengend(item)"
            >
            <!-- v-for="(item, index) in btnGroupList"
              :key="index" -->
              <i :class="['item', item.icon]"></i>
              {{ item.name }}
            </p>
          </template>
        </div>
      </div>
    </div>
    <div
     class="popbg"
      v-if="componentNames !== ''"
      :style="componentNames==='GisStorageTank'?'width:721px;': (componentNames=== 'GisDangerSpread' ? 'width:386px;' : 'width:390px;')"
    >
      <component
        :is="componentNames"
        v-on:tobackParent="changeModule"
      ></component>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import Rainstorm from '@/components/feature/flood/FastAssessment/Rainstorm.vue'; // 暴雨风险评估
import GisStorageTank from '../../GIS/GisStorageTank/GisStorageTank.vue'; // 储罐模型
import GisDangerSpread from '../../GIS/GisDangerSpread/GisDangerSpread.vue'; // 危险品大气扩散
import GisChemicalBlast from '../../GIS/GisChemicalBlast/GisChemicalBlast.vue'; // 化学品爆炸
import GisEarthQuakeIntensity from '../../GIS/GisEarthQuakeIntensity/GisEarthQuakeIntensity.vue'; // 地震烈度
import ZoomBtn from '../ZoomBtn.vue'; // 导入最小化组件

@Component({
  name: 'FastAssessment',
  components: { Rainstorm, ZoomBtn, GisStorageTank, GisDangerSpread, GisChemicalBlast, GisEarthQuakeIntensity}, //    ,
})
export default class FastAssessment extends Vue {
  private btnGroupList: any[] = []; // 按钮列表
  private btnGroupIsShow: boolean = false; // 按钮列表是否显示
  private copyItem: any = null; // 当前选中数据
  // 当前选中的组件
  private componentNames: any = '';
  private ElementBox: any = null;
  private changeModule() {
    this.ElementBox.style.width = '390px';
    this.componentNames = '';
  }
  private handleShowLengend(item: any) {
    this.copyItem = item;
    if (item.id === 'Rainstorm') {
      // 山洪风险预警,其他取消高亮以及关闭图例播放轴
      this.componentNames = 'Rainstorm';
      this.btnGroupList.map((btn: any) => {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      });
      return;
    } else if (item.id === 'GisStorageTank') {
      this.componentNames = 'GisStorageTank';
      this.ElementBox.style.width = '721px';
      this.btnGroupList.map((btn: any) => {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      });
      return;
    } else if (item.id === 'GisDangerSpread') {
      this.componentNames = 'GisDangerSpread';
      this.ElementBox.style.width = '390px';
      this.btnGroupList.map((btn: any) => {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      });
      return;
    } else if (item.id === 'GisChemicalBlast') {
      this.componentNames = 'GisChemicalBlast';
      this.ElementBox.style.width = '400px';
      this.btnGroupList.map((btn: any) => {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      });
      return;
    } else if (item.id === 'GisEarthQuakeIntensity') {
      this.componentNames = 'GisEarthQuakeIntensity';
      this.ElementBox.style.width = '400px';
      this.btnGroupList.map((btn: any) => {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      });
      return;
    } else {
      this.componentNames = '';
      this.ElementBox.style.width = '390px';
    }
    this.btnGroupList.map((btn: any) => {
      if (btn.id === item.id) {
        if (btn.checked) {
          btn.checked = false;
          this.$store.commit('mapTools/removeSelectedLayer', {
            id: btn.id,
          });
        } else {
          btn.checked = true;
          const legendParams = {
            id: btn.id,
            name: btn.name,
            legend: btn.legend,
            play: btn.isHasPaly,
          };
          this.$store.commit('mapTools/addSelectedLayer', legendParams);
        }
      } else {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      }
    });
  }
  private mounted() {
    // 获取父级元素
    this.ElementBox = document.getElementById('right_function_box');
    // 设置父级元素宽度
    this.ElementBox.style.width = '390px';
    const fastAssessmentConfig = this.$store.state.configModel.config
      .fastAssessment;
    this.btnGroupIsShow = fastAssessmentConfig.modelBtnGroup.isShow;
    this.btnGroupList = fastAssessmentConfig.modelBtnGroup.btnArr;
    this.messsageBus.on('closeLineHight', (data: any) => {
      this.componentNames = '';
      this.btnGroupList.map((btn: any) => {
      if (btn.id === this.copyItem.id) {
        if (btn.checked) {
          btn.checked = false;
          this.$store.commit('mapTools/removeSelectedLayer', {
            id: btn.id,
          });
        } else {
          btn.checked = true;
          const legendParams = {
            id: btn.id,
            name: btn.name,
            legend: btn.legend,
            play: btn.isHasPaly,
          };
          this.$store.commit('mapTools/addSelectedLayer', legendParams);
        }
      } else {
        btn.checked = false;
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: btn.id,
        });
      }
    });
    });
  }
  private beforeDestroy() {
    // 清除播放图层
    this.btnGroupList.map((item: any) => {
      item.checked = false;
      this.$store.commit('mapTools/removeSelectedLayer', {
        id: item.id,
      });
    });
    this.getComponent().removeResource();
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.ModelDisplayFactory.getComponent('mountainFlood');
    return component;
  }
  private closeAndbackFn() {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: { showFlag: false },
    });
    this.messsageBus.emit('closeAndBack', true);
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@imgPath: '../../../../assets/img/fastAssessment';
.FastAssessmentBox {
  width: 100%;
  height: 100%;
  position: relative;
  .panelPublicDefault_bd {
    padding: 0;
  }
  .btnGroupList {
    display: flex;
    flex-direction: column;
    p {
      display: flex;
      align-items: center;
      height: 110px;
      color: #fff;
      background: url('@{imgPath}/fastBtn_bg.png') no-repeat 0 0;
      background-size: 100% 100%;
      font-size: 25px;
      padding: 0px 15px;
      padding-left: 0px;
      margin: 5px 0;
      cursor: pointer;
      .item {
        display: inline-block;
        width: 124px;
        height: 96px;
      }
      .hsjlyc {
        background: url('@{imgPath}/hsjlyc.png') no-repeat;
        background-position-y: 10px;
        background-size: 100% 100%;
      }
      .byfxpg {
        background: url('@{imgPath}/byfxpg.png') no-repeat;
        background-position-y: 10px;
        background-size: 100% 100%;
      }
      .byhpyc {
        background: url('@{imgPath}/byhpyc.png') no-repeat;
        background-position-y: 10px;
        background-size: 100% 100%;
      }
      .flood {
        background: url('@{imgPath}/flood.png') no-repeat;
        background-position-y: 10px;
        background-size: 100% 100%;
      }
      &:hover,
      &.active {
        background: url('@{imgPath}/fastBtn_bg_hover.png') no-repeat 0 0;
        background-size: 100% 100%;
        color: #fcf280;
        .hsjlyc {
          background: url('@{imgPath}/hsjlyc_active.png') no-repeat;
          background-position-y: 10px;
          background-size: 100% 100%;
        }
        .byfxpg {
          background: url('@{imgPath}/byfxpg_active.png') no-repeat;
          background-position-y: 10px;
          background-size: 100% 100%;
        }
        .byhpyc {
          background: url('@{imgPath}/byhpyc_active.png') no-repeat;
          background-position-y: 10px;
          background-size: 100% 100%;
        }
        .flood {
          background: url('@{imgPath}/flood_active.png') no-repeat;
          background-position-y: 10px;
          background-size: 100% 100%;
        }
      }
    }
  }
  .popbg{
    position:absolute;
    top:0;
    left:0px;
    height:100%;
  }
}
</style>
