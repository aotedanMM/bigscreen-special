<template>
  <div class="RealTimeVideo" @click="isShowVideo">
    <div class="imgIcon" :class="{'RealTimeVideo_active':showVideo}"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {  } from '@/api/installServer';
import { mapUtilFun } from '@/views/common/nvaUtil/nvaUtil';

@Component({
  name: 'GisVideoSurveillance',
  components: {},
})
export default class GisVideoSurveillance extends Vue {
  private showVideo: any = false;
  private isShowVideo() {
    this.messsageBus.emit('showleftList' , false);
    // 关闭弹框
    const obj = [
          {
            iconName: 'gisMapTool-realTimePlotting',
            title: '标绘',
            key: 'realTimePlotting',
            isOpen: false,
          },
          {
            iconName: 'gisMapTool-onlinePren',
            title: '在线单兵',
            key: 'onlinePawn',
            isOpen: false,
          },
          // {
          //   iconName: 'gisMapTool-PeripheralQuery',
          //   title: '周边查询',
          //   key: 'PeripheralQuery',
          //   isOpen: false,
          // },
    ];
    const tempFun: any = mapUtilFun;
    obj.forEach((item: any) => {
      if (tempFun[item.key]) {
        tempFun[item.key](this, item);
      }
    });
    this.showVideo = !this.showVideo;
    this.messsageBus.emit('showVideoMonitorPop', this.showVideo);
    this.messsageBus.emit('closeVideoMapPop', false);
    this.$store.commit('configModel/setVideoShow', this.showVideo);
    // console.log(this.showVideo);
  }
  private created(): void {
    const self = this;
    this.messsageBus.on('closeVideoMonitorPop', (data: any) => {
      this.showVideo = data;
      this.$store.commit('configModel/setVideoShow', this.showVideo);
    });
    this.messsageBus.on('openPawn', (data: any) => {
      this.showVideo = false;
      self.messsageBus.emit('closeVideoMonitorPop', false);
    });
    this.messsageBus.on('openPlot', (data: any) => {
      this.showVideo = false;
      self.messsageBus.emit('closeVideoMonitorPop', false);
    });
    this.messsageBus.on('openTerminal', (data: any) => {
      this.showVideo = false;
      self.messsageBus.emit('closeVideoMonitorPop', false);
    });
    // 周边查询/缓冲区查询 取消互斥操作   后期需要加上互斥，解开注释即可
    // this.messsageBus.on('PeripheralQuery', (data: any) => {
    //   this.showVideo = false;
    //   self.messsageBus.emit('closeVideoMonitorPop', false);
    // });
  }
   private beforeDestroy() {
     this.messsageBus.emit('closeVideoMonitorPop', false);
   }
}
</script>
<style lang="less" scoped>
@icons: '../../../../assets/img/gisModule/gisLayerPanel/';
.RealTimeVideo {
  .imgIcon {
    height: 60px;
    display: block;
    width: 60px;
    height: 60px;
    line-height: 1;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background: url('@{icons}video.png') no-repeat center center;
    background-size: 100% 100%;
    &:hover{
      background: url('@{icons}video_active.png') no-repeat center center;
      background-size: 100% 100%;      
    }
    &.RealTimeVideo_active{
      background: url('@{icons}video_active.png') no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
