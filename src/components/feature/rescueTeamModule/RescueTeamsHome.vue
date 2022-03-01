<!--力量调度的首页-->
<template>
  <div class="rescueTeamsHome">
    <div class="rescueTeamsHome_hd title-panel">
      <p>
        {{title}}
        <ZoomExportBtn v-if="title==='应急力量'&&showZoomExportBtn" @handleEmitExport="downloadFile"></ZoomExportBtn>
        <ZoomBtn v-else></ZoomBtn>
        <!-- <ZoomBtn></ZoomBtn> -->
      </p>
    </div>
    <el-tabs
      class="csmMyTabs rescueTaemModule"
      v-model="currentTab"
      style="padding:0 10px;height:calc(100% - 62px);"
    >
      <!-- <el-tab-pane label="所有队伍" name="first"> -->
      <AllTeams
        v-if="currentTab==='first'"
        :parentHandleClickNumFn="parentHandleClickNumFn"
        :rescueTeamHomeData="rescueTeamHomeData"
      ></AllTeams>
      <!-- </el-tab-pane>
      <el-tab-pane  label="出动队伍" name="second">
        <DispatchTeam  v-if="currentTab==='second'"
          :parentHandleClickNumFn="parentHandleClickNumFn"
          :rescueTeamHomeData="rescueTeamHomeData"
        ></DispatchTeam>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { districtServer } from '@/api/installServer';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer } from '@/api/installServer';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import AllTeams from '@/components/feature/rescueTeamModule/AllTeams.vue';
import DispatchTeam from '@/components/feature/rescueTeamModule/DispatchTeam.vue';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
import ZoomExportBtn from '@/components/feature/flood/ZoomExportBtn.vue'; // 最小化下载组件
import { downloadFile } from '@/util/tools';

@Component({
  name: 'RescueTeamsHome',
  components: {
    AllTeams,
    DispatchTeam,
    ZoomBtn,
    ZoomExportBtn, // 最小化下载组件
  },
})
export default class RescueTeamsHome extends Vue {
  @Prop() public rescueTeamHomeData: any;
  @Prop() public openPopup: any;
  @Prop() public activeTab: any;
  @Prop() private getJsonKey: any;
  private title: any = '';
  private currentTab = '';
  private flag = false;
  private showZoomExportBtn: any = false;
  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击列表的方法

  public mounted() {
    this.currentTab = this.activeTab ? this.activeTab : 'first';
    if (this.currentTab === 'first') {
      console.log('first');
    } else if (this.currentTab === 'second') {
      console.log('second');
    }
  }
  @Watch('getJsonKey', { deep: true, immediate: true })
  private updateTitle(val: any) {
    this.title = val.name;
    this.getShowFlag();
  }
  private getShowFlag() {
    const typecode = ['0', '6', '7', '12', '13', '2', '4', '5'];
    if (typecode.includes(this.$store.state.eventPushStore.eventLocation.EventType)) {
        this.showZoomExportBtn = false;
        } else {
          this.showZoomExportBtn = true;
        }
  }
  // 导出
  private downloadFile(type: any) {
    // 判断是否模型计算以及烈度圈计算，二者都操作之后方可下载
    if (
      !this.$store.state.earthQuake.earthQuakeIntensityData.Model_Infos ||
      this.$store.state.dataFilterControl.zhypGeoType.key !== 'ldqYp'
    ) {
      this.$message('请烈度圈和模型计算之后再导出下载');
      return;
    }
    const eventPushData: any = this.$store.state.eventPushStore.eventLocation;
    const sourceOpt = JSON.parse(
      JSON.stringify(this.$store.state.dataFilterControl.filter),
    );
    // TODO：缺少震中设防烈度
    const params: any = {
      eqLevel: String(eventPushData.EqLevel), // 震级
      eventAddr: eventPushData.EventAddr, // 事发地点
      eventLat: String(eventPushData.EventLat), // 纬度
      eventLon: String(eventPushData.EventLon), // 经度
      eventTime: eventPushData.EventTime, // 发震时间，格式：yyyy年MM月dd日HH时mm分
      eventTit: eventPushData.EventTit, // 地震事件标题
      isList: type, // 0-无列表，1-带列表-完整模式，2-带列表-精简模式（列表最多显示50条）
      schemeType: '3', // 方案类型，1-基本信息，2-风险隐患，3-应急力量，4-应急资源
      modelResult: JSON.stringify(
        this.$store.state.earthQuake.earthQuakeIntensityData,
      ), // 模型数据
      fortifyLevel: '5', // 震中设防烈度
      pac: sourceOpt.districtCode || '370600', // 行政区划编码
      geoJsonArray: JSON.stringify(
        this.$store.state.dataFilterControl.zhypGeoType.value.rangeArr,
      ),
    };
    installDisasterJudgeServer.quickJudgeServer
      .getIntensityExport(params)
      .then((res: any) => {
        const title = `${eventPushData.EventTime.substring(0, 10)}${
          eventPushData.EventAddr
        }${eventPushData.EqLevel}级地震`;
        const fileName =
          `${title} - 应急力量-烈度-` +
          (type === '2' ? `精简版` : `完整版`) +
          `.docx`;
        downloadFile(fileName, res.data);
      });
  }

  // 返回一级页面
  //   private backParent() {
  //     this.$emit('backParent');
  //   }
}
</script>

<style lang="less" scoped>
.rescueTeamsHome {
  height: 100%;
  .csmMyTabs {
    .el-tabs__content {
      height: 100%;
    }
    /deep/.el-tabs__header {
      padding: 0;
    }
  }
}
.rescueTeamsHome_hd {
  line-height: 35px;
  text-align: left;
  white-space: nowrap;
  font-style: italic;
  padding-left: 10px;
}
</style>
