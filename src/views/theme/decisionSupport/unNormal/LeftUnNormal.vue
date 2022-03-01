<template>
  <div class="layoutSidebar">
    <div class="cu-flex">
      <!--左侧 第一列-->
      <div class="layoutSidebar_A cu-flex-average">
        <div v-for="(item,index) in layout.left.children" :style="item.style" :key="index">
          <!--左右都复用-->
          <DragPanal :slotName="item.slotName" class="heightPercent100">
            <div slot="yzzq" class="heightPercent100">
              <el-select
              class="constom-select-input"
                :value="leftA01"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftA01, 'leftA01')"
                style="">
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftA01.title" :class="leftA01.className">
                <!--             
                <el-scrollbar class="cmp-scrollbar-y" style="height:100%;" noresize="false"> -->
                  <component :is="leftA01.cptName"></component>
                  <!-- </el-scrollbar> -->
              </PanelView>
            </div>
            <div slot="dwdp" class="heightPercent100">
              <el-select  class="constom-select-input"
                :value="leftA02"
                value-key="cptName"
                @change="(opt) => changeComponent(opt,leftA02, 'leftA02')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftA02.title" :class="leftA02.className">
                <component :is="leftA02.cptName"></component>
              </PanelView>
            </div>
            <div slot="wzdb" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftA03"
                value-key="cptName"
                @change="(opt) => changeComponent(opt,leftA03, 'leftA03')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftA03.title" :class="leftA03.className">
                <component :is="leftA03.cptName"></component>
              </PanelView>
            </div>
            <div slot="ldps" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftB01"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftB01, 'leftB01')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftB01.title" :class="leftB01.className">
                <component :is="leftB01.cptName"></component>
              </PanelView>
            </div>
            <div slot="jzqk" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftB02"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftB02, 'leftB02')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftB02.title" :class="leftB02.className">
                <component :is="leftB02.cptName"></component>
              </PanelView>
            </div>
            <div slot="zdsj" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftB03"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftB03, 'leftB03')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftB03.title" :class="leftB03.className">
                <component :is="leftB03.cptName"></component>
              </PanelView>
            </div>
          </DragPanal>
        </div>
      </div>
      <!--左侧 第二列-->
      <div class="layoutSidebar_B cu-flex-average">
        <div v-for="(item,index) in layout.right.children" :style="item.style" :key="index">
          <!--左右都复用-->
          <DragPanal :slotName="item.slotName" class="heightPercent100">
            <div slot="yzzq" class="heightPercent100">
              <el-select
              class="constom-select-input"
                :value="leftA01"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftA01, 'leftA01')"
                style="">
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftA01.title" :class="leftA01.className">
                <!--             
                <el-scrollbar class="cmp-scrollbar-y" style="height:100%;" noresize="false"> -->
                  <component :is="leftA01.cptName"></component>
                  <!-- </el-scrollbar> -->
              </PanelView>
            </div>
            <div slot="dwdp" class="heightPercent100">
              <el-select  class="constom-select-input"
                :value="leftA02"
                value-key="cptName"
                @change="(opt) => changeComponent(opt,leftA02, 'leftA02')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftA02.title" :class="leftA02.className">
                <component :is="leftA02.cptName"></component>
              </PanelView>
            </div>
            <div slot="wzdb" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftA03"
                value-key="cptName"
                @change="(opt) => changeComponent(opt,leftA03, 'leftA03')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftA03.title" :class="leftA03.className">
                <component :is="leftA03.cptName"></component>
              </PanelView>
            </div>
            <div slot="ldps" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftB01"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftB01, 'leftB01')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftB01.title" :class="leftB01.className">
                <component :is="leftB01.cptName"></component>
              </PanelView>
            </div>
            <div slot="jzqk" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftB02"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftB02, 'leftB02')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftB02.title" :class="leftB02.className">
                <component :is="leftB02.cptName"></component>
              </PanelView>
            </div>
            <div slot="zdsj" class="heightPercent100">
              <el-select class="constom-select-input"
                :value="leftB03"
                value-key="cptName"
                @change="(opt) => changeComponent(opt, leftB03, 'leftB03')"
              >
                <el-option
                  v-for="(itm, key) in arrSelectOptionObj"
                  v-show="!itm.disabled"
                  :key="key"
                  :label="itm.title"
                  :value="itm"
                  :disabled="itm.disabled"
                ></el-option>
              </el-select>
              <PanelView :title="leftB03.title" :class="leftB03.className">
                <component :is="leftB03.cptName"></component>
              </PanelView>
            </div>
          </DragPanal>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
declare module 'vue/types/vue' {
    interface Vue {
        [key: string]: any;
    }
}
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { modulesOption } from '@/config/modules';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import KeyEvents from '@/views/theme/decisionSupport/module/unNormalLeft/keyEvents.vue';
import TeamAssignment from '@/views/theme/decisionSupport/module/unNormalLeft/teamAssignment.vue';
import Progress from '@/views/theme/decisionSupport/module/unNormalLeft/progress.vue';
import LeaderInstruction from '@/views/theme/decisionSupport/module/unNormalLeft/leadershipInstructions.vue';
import SuppliesAllocate from '@/components/feature/earthquake/suppliesAllocate/SuppliesAllocate.vue';
import MaterialAllocation from '@/views/theme/decisionSupport/module/unNormalLeft/materialAllocation.vue';

import KnownDisaster from '@/views/theme/decisionSupport/module/unNormalLeft/knownDisasterSituation.vue';
import Rendless from '@/components/common/rander/Rendless.vue';
// <!--灾损统计-->
import HouseDamagedAndLegend from '@/views/common/echarts/HouseDamagedAndLegend.vue';
import CasualtiesAndLegend from '@/views/common/echarts/CasualtiesAndLegend.vue';
import PowerDamageView from '@/views/common/echarts/PowerDamageView.vue';
import TrafficState from '@/views/theme/decisionSupport/module/disasterCensusRIght/TrafficState.vue';
// <!--灾情研判-->
import AffectedAreaView from '@/views/common/echarts/AffectedAreaView.vue';
import PersonalDemo from '@/views/common/echarts/PersonalIntensiveDemo.vue';
import RiskHazardHome from '@/views/common/echarts/RiskHazardHome.vue';
// // 救援进展
import HiddenTroubleInvestigation from '@/views/common/echarts/HiddenTroubleInvestigation.vue';
import ResourcePeople from '@/views/common/echarts/ResourcePeople.vue';
import RushRepairRate from '@/views/common/echarts/RushRepairRate.vue';
import TeamCoverage from '@/views/common/echarts/TeamCoverageView.vue';
// // <!-- 救援救助 -->
import TeamNeed from '@/views/theme/decisionSupport/module/rescueAidRight/TeamNeed.vue';
import FieldTeamView from '@/views/common/echarts/FieldTeamView.vue';
import PersonnelPlacement from '@/views/common/echarts/PersonnelPlacement.vue';
import KeyMaterialDemand from '@/views/theme/decisionSupport/module/rescueAidRight/KeyMaterialDemand.vue';
import MaterialDemandEstimation from '@/views/theme/decisionSupport/module/rescueAidRight/MaterialDemandEstimation.vue';
import { Draggable } from 'draggable-vue-directive' ;
import DragPanal from '@/components/common/drag/drag.commont.vue';
@Component({
  name: 'LeftUnNormal',
  components: {
    PanelView,
    KeyEvents,
    TeamAssignment,
    LeaderInstruction,
    KnownDisaster,
    Progress,
    SuppliesAllocate,
    MaterialAllocation,
    Rendless,
    HouseDamagedAndLegend,
    CasualtiesAndLegend,
    PowerDamageView,
    TrafficState,
    AffectedAreaView,
    PersonalDemo,
    RiskHazardHome,
    HiddenTroubleInvestigation,
    ResourcePeople,
    RushRepairRate,
    TeamCoverage,
    TeamNeed,
    FieldTeamView,
    PersonnelPlacement,
    KeyMaterialDemand,
    MaterialDemandEstimation,
    DragPanal,
  },
})
export default class LeftUnNormal extends Vue {
  // 布局动态实现
  private layout = {
    left : {
      class : 'layoutSidebar_A cu-flex-average',
      children : [
        {
          style : 'height:45%',
          // 实时灾情的key
          slotName : 'yzzq',
        },
        {
          style : 'height:30%',
          // 队伍调派的key
          slotName : 'dwdp',
        },
        {
          style : 'height:25%',
          // 物资调拨的key
          slotName : 'wzdb',
        },
      ],
    },
    right : {
      class : 'layoutSidebar_A cu-flex-average',
      children : [
        {
          style : 'height:30%;',
          // 领导批示的key
          slotName :  'ldps',
        },
        {
          style : 'height:40%;',
          // 进展情况的key
          slotName : 'jzqk',
        },
        {
          style : 'height:30%',
          // 重点事件的key
          slotName : 'zdsj',
        },
      ],
    },
  };
  private show = {
    knownDisaster: false,
    keyPointEvent: false,
    dispatchTeam: false,
    leaderInstruction: false,
    progressSituation: false,
    suppliesAllocate: false,
  };

//   get newArrSelectOptionObj(){
//     const obj = {};
//     Object.keys(this.arrSelectOptionObj).forEach((item,index)=>{
//         if(!this.arrSelectOptionObj[item].disabled){
// obj[item] = this.arrSelectOptionObj[item];
//         }
//     })

//     return obj;
//   }

  private originDate = modulesOption;
  private arrSelectOptionObj = this.initSelectOptionArr(
    JSON.parse(JSON.stringify(this.originDate)),
  );
  private leftA01 = {
    cptName: 'KnownDisaster',
    title: '实时灾情',
    className: 'cmp-panel-cnt--bg',
    disabled: false,
  };

  private leftA02 = {
    cptName: 'TeamAssignment',
    title: '队伍调派',
    className: 'cmp-panel-cnt--bg',
    disabled: false,
  };

  private leftA03 = {
    cptName: 'MaterialAllocation',
    title: '物资调拨',
    className: 'cmp-panel-cnt--bg',
    disabled: false,
  };

  private leftB01 = {
    cptName: 'LeaderInstruction',
    title: '领导批示',
    className: 'cmp-panel-cnt--bg',
    disabled: false,
  };
  private leftB02 = {
    cptName: 'Progress',
    title: '进展情况',
    className: 'cmp-panel-cnt--bg',
    disabled: false,
  };
  private leftB03 = {
    cptName: 'KeyEvents',
    title: '重点事件',
    className: 'cmp-panel-cnt--bg',
    disabled: false,
  };
  private initSelectOptionArr(originDate: any) {
    modulesOption.KnownDisaster.disabled = true;
    modulesOption.TeamAssignment.disabled = true;
    modulesOption.MaterialAllocation.disabled = true;
    modulesOption.LeaderInstruction.disabled = true;
    modulesOption.Progress.disabled = true;
    modulesOption.KeyEvents.disabled = true;
    return modulesOption;
  }

// 新选中的对象与原对象进行交换
  private changeComponent(cur: any, obj: any, key: any) {
    this.arrSelectOptionObj[cur.cptName].disabled = true;
    this.arrSelectOptionObj[obj.cptName].disabled = false;
    this[key] = JSON.parse(JSON.stringify(this.arrSelectOptionObj[cur.cptName]));
  }

  private created() {
    this.arrSelectOptionObj = this.initSelectOptionArr(JSON.parse(JSON.stringify(this.originDate)));
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/LayoutSidebar.less');
</style>