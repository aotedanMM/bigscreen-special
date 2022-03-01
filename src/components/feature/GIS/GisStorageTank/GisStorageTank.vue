/** author: chenyu time:2020-03-25 **/
<template>
  <div class="GisStorageTank">
    <div style="height: 100%;">
      <div class="header">
        <div class="title-panel">
        <span>大型储罐火灾专题</span>
      </div>
      </div>
      <span class="halflist-back" @click="handleBackParent"></span>
      <div class="content">
        <el-row v-show="loadingFlag1 !== true && loadingFlag2 !== true">
          <el-col :span="24">
            <div class="tabbar">
              <div
                class=" tabbar_pie"
                :class="[
                  componentNames === 'MaterialProperties' ? 'heightlight' : '',
                ]"
              >
                <div
                  @click="FnClickTabBar(1)"
                  :class="[
                    componentNames === 'MaterialProperties'
                      ? 'tabbar_pie_materialProperties_click'
                      : 'tabbar_pie_materialProperties',
                  ]"
                ></div>
              </div>
              <div
                class=" tabbar_pie"
                :class="[
                  componentNames === 'FlameDetails' ? 'heightlight' : '',
                ]"
              >
                <div
                  @click="FnClickTabBar(2)"
                  :class="[
                    componentNames === 'FlameDetails'
                      ? 'tabbar_pie_FlameDetails_click'
                      : 'tabbar_pie_FlameDetails',
                  ]"
                ></div>
              </div>
              <div
                class=" tabbar_pie"
                :class="[
                  componentNames === 'RiskDistribution' ? 'heightlight' : '',
                ]"
              >
                <div
                  @click="FnClickTabBar(3)"
                  :class="[
                    componentNames === 'RiskDistribution'
                      ? 'tabbar_pie_RiskDistribution_click'
                      : 'tabbar_pie_RiskDistribution',
                  ]"
                ></div>
              </div>
              <div
                class=" tabbar_pie"
                :class="[
                  componentNames === 'FireControlPlan' ? 'heightlight' : '',
                ]"
              >
                <div
                  @click="FnClickTabBar(4)"
                  :class="[
                    componentNames === 'FireControlPlan'
                      ? 'tabbar_pie_FireControlPlan_click'
                      : 'tabbar_pie_FireControlPlan',
                  ]"
                ></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="height: 100%;"  :class="componentNames === 'GisInputPanle' ? '' : 'GisInputPanlePage'">
          <el-col :span="24" style="height: 100%;">
            <!-- <div class="loadingBox" v-if="loadingFlag1 == true && loadingFlag2 == true">
              <div class="loading"></div>
            </div> -->
            <div style="height: 100%;">
              <transition
                name="custom-classes-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
              >
              <!-- :GetLargeTankFireModelDataTwo="GetLargeTankFireModelDataTwo" -->
                <component
                  :is="componentNames"
                  :GetLargeTankFireModelData="GetLargeTankFireModelData"
                  style="height: 100%;"
                  :GetLargeTankFireAnalysisModelData="
                    GetLargeTankFireAnalysisModelData
                  "
                ></component>
              </transition>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import FireControlPlan from './compontents/FireControlPlan.vue';
import RiskDistribution from './compontents/RiskDistribution.vue';
import FlameDetails from './compontents/FlameDetails.vue';
import MaterialProperties from './compontents/MaterialProperties.vue';
import GisInputPanle from './compontents/GisInputPanle.vue';
import { gisStorageTankServer } from '@/api/installServer';
@Component({
  name: 'GisStorageTank',
  components: {
    FireControlPlan,
    RiskDistribution,
    FlameDetails,
    MaterialProperties,
    GisInputPanle,
  },
})
export default class GisStorageTank extends Vue {
  private msg: any = '储罐火处辅助决策';
  private componentNames: any = 'GisInputPanle';
  private activeName: any = 'first';
  private GetLargeTankFireModelData: any = ''; // 用于获取其他信息
  private GetLargeTankFireModelDataTwo: any = ''; // 用于获取面积
  private GetLargeTankFireAnalysisModelData: any = '';
  private loadingFlag1: any = true;
  private loadingFlag2: any = true;
  private Num: any = 0;
  private eventinfo: any = this.$store.state.eventPushStore.eventDataList;
    // 返回一级页面
  private handleBackParent() {
    this.$emit('tobackParent');
  }
  // 测试信息
  private FnTest(): void {
    const key: any = this.$store.state.controlMoudle.mapCircleQueryType;
    // console.log('测试信息：', key, this.$store.state.eventPushStore.eventDataList);
  }
  private FnClickTabBar(value: any): void {
    switch (value) {
      case 1:
        this.componentNames = 'MaterialProperties';
        break;
      case 2:
        this.componentNames = 'FlameDetails';
        break;
      case 3:
        this.componentNames = 'RiskDistribution';
        break;
      case 4:
      this.componentNames = 'FireControlPlan';
      break;
    }
  }
  @Watch('Num')
  private FnShowFirePlane(): any {
    if (this.Num >= 2) {
      this.FnClickTabBar(4);
    }
  }
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('riskAnalysis');
    return component;
  }
  private created() {
    this.FnTest();
    // console.log('eventinfo:', this.eventinfo);
    this.messsageBus.on('TankFireModel', (data: any) => {
      this.GetLargeTankFireModelData = data;
      this.loadingFlag1 = false;
      this.Num = this.Num + 1;
      console.log('监听到的数据：' , this.GetLargeTankFireModelData);
    });
    // this.messsageBus.on('TankFireModelTwo', (data: any) => {
    //   this.GetLargeTankFireModelDataTwo = data;
    // });
    this.messsageBus.on('TankFireAnalysisModel', (data: any) => {
      this.GetLargeTankFireAnalysisModelData = data;
      this.loadingFlag2 = false;
      this.Num = this.Num + 1 ;
      console.log('监听到的数据：' , this.GetLargeTankFireAnalysisModelData);
    });
    if (this.Num >= 1) {
      this.FnClickTabBar(2);
    }
    this.messsageBus.on('recount', (data: any) => {
      this.getComponent().clear();
      const mapLayers: any = Object.assign([], this.getComponent().map.layers); // 深拷贝防止漏删点
      mapLayers.forEach((item: any, index: any) => {
        if (item.id && (item.id.trim().indexOf('IgnitionPoint_layer') >= 0 || item.id.trim().indexOf('PeripheralTankPoint_layer') >= 0 )) {
          this.getComponent().removeIgnitionPointLayer(item.id);
        }
      });
      this.loadingFlag1 = true;
      this.loadingFlag2 = true;
      this.componentNames = data;
    });
  }
  private beforeDestroy() {
    this.getComponent().clear();
    const mapLayers: any = Object.assign([], this.getComponent().map.layers);
    mapLayers.forEach((item: any, index: any) => {
      if (item.id && (item.id.trim().indexOf('IgnitionPoint_layer') >= 0 || item.id.trim().indexOf('PeripheralTankPoint_layer') >= 0 )) {
        this.getComponent().removeIgnitionPointLayer(item.id);
      }
    });
        // 获取父级元素
    const el: any = document.getElementById('right_function_box');
    if (el) {
      // 设置父级元素宽度
      el.style.width = '390px';
    }
  }
}
</script>
<style scoped lang="less">
@import url('../../../../assets/css/animate.min.css');
.GisStorageTank {
  position: absolute;
  top: -4px;
  left: 0px;
  z-index: 99999;
  height: 100%;
  .header {
    width: 721px;
    height: 35px;
    text-indent: 22px;
    .title-panel {
      font-size: calc(16px * 1.5);
      font-style: italic;
    }
    background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_title.png');
    background-repeat: no-repeat;
  }
.halflist-back {
  width: 61px;
  height: 25px;
  position: absolute;
  top: 10px;
  right: 1px;
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
  .content {
    width: 721px;
    height: calc(100% - 40px);
    background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport.png');
    background-repeat: no-repeat;
    box-shadow: 0 0 6px #000;
    .tabbar {
      width: 100%;
      height: 55px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('../../../../assets/img/gisModule/GisStorageTank/tabBarBg.png');
      background-position: 0px 0px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .tabbar_pie {
        width: 25%;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .heightlight {
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/lightHeght.png');
        background-position: 0px 29px;
        background-repeat: no-repeat;
      }
      .tabbar_pie_materialProperties {
        width: 80%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_Properties.png');
        background-position: -4px 2px;
      }
      .tabbar_pie_materialProperties_click {
        width: 80%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_Properties.png');
        background-position: -4px -35px;
      }
      .tabbar_pie_FlameDetails {
        width: 100%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_FlameDetails.png');
        background-position: -4px 2px;
      }
      .tabbar_pie_FlameDetails_click {
        width: 100%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_FlameDetails.png');
        background-position: -4px -35px;
      }
      .tabbar_pie_RiskDistribution {
        width: 100%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_risk.png');
        background-position: -4px 2px;
      }
      .tabbar_pie_RiskDistribution_click {
        width: 100%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_risk.png');
        background-position: -4px -35px;
      }
      .tabbar_pie_FireControlPlan {
        width: 100%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_FirePanel.png');
        background-position: -4px 2px;
      }
      .tabbar_pie_FireControlPlan_click {
        width: 100%;
        height: 38px;
        margin: 0 22px;
        background-image: url('../../../../assets/img/gisModule/GisStorageTank/decisionSupport_FirePanel.png');
        background-position: -4px -35px;
      }
    }
  }
  .GisInputPanlePage {
    height: calc(100% - 55px) !important;
  }
  .loadingBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading {
    color: #fff;
    font-size: 36px;
    background: url(../../../../assets/img/halfScreen/halflist/searchOne.gif)
      no-repeat 33px 255px;
    color: #d2e1ec;
    height: 800px;
    width: 390px;
  }
}
</style>
