<template>
  <Panel :title="videoText">
    <div :class="{ LiveMonitorModule1_on: flag, NewRescueForce_off: !flag }">
      <p class="NewRescueForce_button" @click="videoPlay"></p>
      <p class="LiveMonitor-videoList1_button" @click="helpPower"></p>
    </div>
    <base-video :url="BaseVideo.url" v-show="flag"></base-video>
    <div v-show="!flag" class="helpPower-content">
      <el-select v-model="valueText" filterable>
        <el-option
          v-for="item in optionsData"
          :key="item.value"
          :lable="item.lable"
          :value="item.lable"
        >
          <span style="float: left">{{ item.lable }}</span>
          <span style="float: right">{{ item.value }}</span>
        </el-option>
      </el-select>
    </div>
  </Panel>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import BaseVideo from '@/components/feature/vedio/Vedio.common.vue';
import Panel from '@/components/common/panel/Panel.common.vue';
@Component({
  name: 'videoBackhaul',
  components: {
    BaseVideo,
    Panel,
  },
})
export default class VideoBackhaul extends Vue {
  @Prop(Object) public BaseVideo!: any;
  @Prop(Array) public optionsData!: any;
  private flag: boolean = true;
  private videoText: string = '视频监控';
  private valueText: string = '北京';
  private videoPlay() {
    this.flag = true;
    this.videoText = '视频监控';
  }
  private helpPower() {
    this.flag = false;
    this.videoText = '救援力量';
  }
}
</script>
<style scoped lang="less">
.LiveMonitorModule1_on {
  width: 351px;
  height: 521px;
  // background: url('../../../assets/img/videoBackhaul/video_live1.png') no-repeat;
  background-size: 100%;
  position: absolute;
  top: 25px;
  right: 35px;
  z-index: 1;
    cursor: pointer;
  .LiveMonitor-videoList1_button {
    top: 0px;
    position: absolute;
    left: 0px;
    width: 50%;
    height: 100%;
  }
  .NewRescueForce_button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    margin: 0;
  }
}
.NewRescueForce_off {
  width: 128px;
  height: 26px;
  background: url('../../../assets/img/videoBackhaul/chaxuan_rescue.png')
    no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 25px;
  right: 35px;
  z-index: 1;
    cursor: pointer;
  .NewRescueForce_button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    margin: 0;
  }
  .LiveMonitor-videoList1_button {
    top: 0px;
    position: absolute;
    left: 0px;
    width: 50%;
    height: 100%;
  }
}
.helpPower-content {
  width: 100%;
  .el-select {
    width: 98%;
  }
}
</style>
