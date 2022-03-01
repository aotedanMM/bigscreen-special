<template>
  <div class="layoutSidebar">
    <div class="cu-flex">
      <!--左侧 第一列-->
      <div class="layoutSidebar_A cu-flex-average">
        <div v-for="(item,index) in layout.left.children" :style="item.style" :key="index">
          <!--左右都复用-->
          <DragPanal :slotName="item.slotName" class="heightPercent100">
            <div slot="sjxy" class="heightPercent100">
              <PanelView title="事件信息" titleType="eventInfo" class="cmp-panel-cnt--bg">
                <EventContainer />
              </PanelView>
            </div>
            <div slot="sjsp" class="heightPercent100">
              <PanelView title="新闻报道" class="cmp-panel-cnt--bg">
                <!--<Vedio :url="url"></Vedio>-->
                <!--<vedio></vedio>-->
              </PanelView>
            </div>
            <div slot="zbxy" class="heightPercent100">
              <PanelView title="值班信息" class="cmp-panel-cnt--bg">
                <DutyInfo></DutyInfo>
                <!-- <ManagementOnDuty /> -->
                <!-- <AffectedArea :data="severelyAffectedAreaData"
                :geoJson="geoJson" />-->
              </PanelView>
            </div>
            <div slot="yjxy" class="heightPercent100">
              <PanelView title="预警信息" class="cmp-panel-cnt--bg">
                <el-scrollbar class="cmp-scrollbar-y" style="height:100%;">
                  <earlywarningInfo></earlywarningInfo>
                </el-scrollbar>
              </PanelView>
            </div>
            <div slot="yjzy" class="heightPercent100">
              <!-- <PanelView title="应急资源"></PanelView> -->
              <emergency-resources class="emergencyResources_bg" />
            </div>
          </DragPanal>
        </div>

        <!--v-draggable="draggableValue"-->
        <!--
        <div style="height:70%;outline:1px solid red "  >
           <DragPanal slotName="sb">
            <div slot="sb">
                <PanelView title="事件信息" >  
                <EventInfo :eventInfoData="eventInfoData"
                          :clickPerItemData="clickPerItemData"></EventInfo>
                </PanelView>
            </div>
            <div slot="sa"> 
                <PanelView title="新闻报道" >
                 <Vedio :url="url"> </Vedio>  
                </PanelView>
              </div>
            </DragPanal>
        </div>
        <div style="height:30%;outline:1px solid red">
            <DragPanal slotName="sa">
              <div slot="sa"> 
                <PanelView title="新闻报道" >
                 <Vedio :url="url"> </Vedio>  
                </PanelView>
              </div>
              <div slot="sb">
                <PanelView title="事件信息" >  
                <EventInfo :eventInfoData="eventInfoData"
                          :clickPerItemData="clickPerItemData"></EventInfo>
                </PanelView>
            </div>
           </DragPanal>
        </div>
        -->
      </div>
      <!--左侧 第二列-->
      <div class="layoutSidebar_B cu-flex-average">
        <div v-for="(item,index) in layout.right.children" :style="item.style" :key="index">
          <!--左右都复用-->
          <DragPanal :slotName="item.slotName" class="heightPercent100">
            <div slot="sjxy" class="heightPercent100">
              <PanelView title="事件信息" class="cmp-panel-cnt--bg">
                <EventContainer />
              </PanelView>
            </div>
            <div slot="sjsp" class="heightPercent100">
              <PanelView title="新闻报道" class="cmp-panel-cnt--bg">
                <!--<Vedio :url="url"></Vedio>-->
                <!--<vedio></vedio>-->
              </PanelView>
            </div>
            <div slot="zbxy" class="heightPercent100">
              <PanelView title="值班信息" class="cmp-panel-cnt--bg">
                <!-- <ManagementOnDuty v-bind="managementDutyData" /> -->
                <DutyInfo></DutyInfo>
              </PanelView>
            </div>
            <div slot="yjxy" class="heightPercent100">
              <PanelView title="预警信息" class="cmp-panel-cnt--bg">
                <earlywarningInfo></earlywarningInfo>
              </PanelView>
            </div>
            <div slot="yjzy" class="heightPercent100">
              <!-- <PanelView title="应急资源"> -->
              <emergency-resources class="emergencyResources_bg" />
              <!-- </PanelView> -->
            </div>
          </DragPanal>
        </div>
      </div>

      <!--
      <div class="layoutSidebar_B cu-flex-average"   >
        <div style="height:42%;">
          <PanelView title="值班信息">  
            
           <AffectedArea :data="severelyAffectedAreaData"
                          :geoJson="geoJson" /
            
          </PanelView>
        </div>
        <div style="height:29%;outline:1px solid red;">
          <PanelView title="预警信息">
            <el-scrollbar class="cmp-scrollbar-y" style="height:100%;">
              <WarningInfo :warningInfoData="warningInfoData" :clickItemWarning="clickItemWarning"></WarningInfo>
            </el-scrollbar>
          </PanelView>
        </div>
        <div style="height:29%;outline:1px solid red;">
          <PanelView title="应急资源"></PanelView>
        </div>
      </div>
      -->
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WarningInfo from '@/components/feature/common/warningInfo/WarningInfo.feature.vue';
import EventContainer from '@/views/theme/decisionSupport/module/normalLeft/eventContainer.vue';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import DutyInfo from '@/components/feature/managementOnDuty/dutyInfo.vue';
// import Vedio from '@/components/feature/vedio/Vedio.common.vue';
import Vedio from '@/components/feature/vedio/realtimeVideo.vue';
// import AffectedArea from '@/components/feature/earthquake/severelyAffectedArea/SeverelyAffectedArea.feature.vue';
// import { severelyAffectedAreaServer } from '@/api/installServer';
import { Draggable } from 'draggable-vue-directive';
import DragPanal from '@/components/common/drag/drag.commont.vue';
// import Panel from '@/views/earthquake/layout/Panel.primary.vue';
import { IManagementDuty } from '@/interface/feature/earthquake/ManagementDuty.interface';
import EmergencyResources from '@/views/theme/decisionSupport/module/normalLeft/emergencyResources.vue';
import earlywarningInfo from '@/components/feature/common/warningInfo/earlywarningInfo.vue';
import {
  warningInfoServer,
  managementOnDutyServer,
  weatherServer,
} from '@/api/installServer';

@Component({
  name: 'LayoutSidebar',
  components: {
    WarningInfo,
    EventContainer,
    PanelView,
    DragPanal,
    DutyInfo,
    // AffectedArea,
    Vedio,
    EmergencyResources,
    // Panel,
    earlywarningInfo,
  },
})
export default class LayoutSidebar extends Vue {
  // 布局动态实现
  private layout = {
    left: {
      class: 'layoutSidebar_A cu-flex-average',
      children: [
        {
          style: 'height:68%;',
          // 事件信息的key
          slotName: 'sjxy',
        },
        {
          style: 'height:32%;',
          // 新闻报道的key
          slotName: 'sjsp',
        },
      ],
    },
    right: {
      class: 'layoutSidebar_A cu-flex-average',
      children: [
        {
          style: 'height:44%;',
          // 值班信息的key
          slotName: 'zbxy',
        },
        {
          style: 'height:27%;',
          // 预警信息的key
          slotName: 'yjxy',
        },
        {
          style: 'height:29%;',
          // 应急资源的key
          slotName: 'yjzy',
        },
      ],
    },
  };
  // 定义应急资源面板的列表内容 结束

  private afectedAreaFlag = false;
  private draggableValue = {
    onPositionChange: undefined,
  };

  // 视频组件
  // private url = './vedio/b.mp4';
  // 事件信息列表
  private warningInfoData = [];

  private severelyAffectedAreaData = [
    { name: '峨山彝族自治县', value: [102.567345, 24.103843] },
    { name: '江川县', value: [102.637615996094, 24.3504201484375] },
    { name: '易门县', value: [101.958070097656, 24.4683083320313] },
  ];

  private geoJson: any = null;

  private clickItemWarning(item: any) {
    warningInfoServer
      .getTypeData({
        type: '11B16',
        startTime: '2019-12-11 15:28:55',
        endTime: '2019-12-14 09:28:55',
      })
      .then((res: any) => {
        // console.log('res=>', res);
      });
  }

  private clickPerItemData(item: any) {
    //  console.log(item);
  }
  // 获取预警信息
  private getWarningInfo() {
    warningInfoServer
      .getData({
        type: '11B01,11B03,11B09,11B25,11B37',
        startTime: '2019-12-11 15:28:55',
        endTime: '2019-12-14 09:28:55',
      })
      .then((res: any) => {
        this.warningInfoData = res.data;
      });
  }

  private created() {
    // this.initResource();
    this.getWarningInfo();
    /*severelyAffectedAreaServer.getMapJSON().then((res: any) => {
      this.geoJson = res;
      this.afectedAreaFlag = true;
      });*/
  }
}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport//LayoutSidebar.less');
</style>

<style lang="less">
  @import url('../../../assets/css/theme.default.less');
</style>
