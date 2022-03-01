<template>
  <!-- 图层 -->
  <!-- 现场视频弹窗 -->
  <div :class="activeclass" ref="videoChatBox" id="phonePop">
    <div class="title">
      <span>现场视频</span>
      <div class="btn">
        <i class="close" @click="close"></i>
      </div>
    </div>
    <CompanyVideoA v-show="isshowcompanyVideoPop"></CompanyVideoA>
    <head></head>
    <div id="playWind" style="width: 100%; height: 100%">
      <iframe v-for="(item , index) in videoMapPopList" :key="index"
              :src="item.url" frameborder="0" width="1100px" height="560px" id="iframeplay">
      </iframe>
      <!-- <iframe  :key="index"  :src="videoMapPopList[0].url" frameborder="0" width="1100px" height="560px" id="iframeplay">
      </iframe> -->
      <!-- <video  ref="videoRef" width="100%" height="87%" autoplay="autoplay" controls controls></video> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {} from '@/api/feature/monitorwarning/installServer';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import { videoSituationServer } from '@/api/feature/monitorwarning/installServer';
import publishObjectPath from '@/util/configRegistry';
import BaseVideo from '@/components/feature/vedio/Vedio.common.vue';
import Hls from 'hls.js';
// 企业视频
import CompanyVideoA from '@/components/feature/forestFire/operationalDeployment/CompanyVideoB.vue';
/**
 * 图层
 */
@Component({
  name: 'VideoMapPop',
  components: { BaseVideo , CompanyVideoA },
})
export default class VideoMapPop extends Vue {
  @Prop() private videoMapPopList: any;
  @Prop() private isVideoWin: any;

  private amplifierShow: any = false;
  private amplifieVideoUrl: any = {};
  private activeIndex: any = 0;
  private scaleSwitch: boolean = false;
  private showIframe: boolean = false;
  private isshowcompanyVideoPop: any = false;  // 是否显示企业视频弹窗
  private activeclass: any = 'layer-panel-hh';
  private activestyle: any = '.layer-panel-hh';
  private iWindwidth: any = '1100px';
  private iWindheight: any = '560px';
  private enterprise: any = false;
  private iframeurl: any = '';
  private NewHls: any;
  @Watch('videoMapPopList')
  private getVideoMapPopList(val: any) {
    this.getVideoListURL();
  }
  // 最小化显示容器
  private minimizeShow() {
    this.messsageBus.emit('closeVideoMapPop', false);
    this.reduction();
    this.scaleSwitch = false;
  }
  private close() {
    this.messsageBus.emit('closeVideoMapPop', false);
    this.reduction();
    this.VideoClose();
    this.scaleSwitch = false; // 关闭后默认最小显示
  }
  private VideoClose() {
      (this as any).$refs.videoRef.pause();
      try {
         this.NewHls.destroy();
      } catch {
        //
      }
      this.NewHls = null;
  }
  private onScaleSwitch() {
    // // 根据scaleSwitch参数放大或者缩小
    this.scaleSwitch = !this.scaleSwitch;
    this.scaleSwitch ? this.fullScreen() : this.reduction();
    if (this.activeclass === 'layer-panel-bb') {
      if (this.scaleSwitch === true) {
        this.messsageBus.emit('changeliststyle' , 'enlarge');
      } else {
        this.messsageBus.emit('changeliststyle' , 'narrow');
      }
    }
  }
  private fullScreen() {
    const box = document.querySelector(this.activestyle) as HTMLVideoElement;
    box.style.setProperty('width', '1620px', 'important');
    box.style.setProperty('height', '870px', 'important');
    box.style.setProperty('left', '70px', 'important');
    box.style.setProperty('top', '80px', 'important');
    box.style.setProperty('z-index', '1000', 'important');
    // 添加背景图
    const boxTitle = box.querySelector('.btn') as HTMLVideoElement;
    boxTitle.classList.add('full_screenBg_bg');
  }
  private reduction() {
    const box = document.querySelector(this.activestyle) as HTMLVideoElement;
    box.style.setProperty('position', 'fixed', 'important');
    box.style.setProperty('width', '1137.38px', 'important'); // 840
    box.style.setProperty('height', '640px', 'important');
    box.style.setProperty('left', '350px', 'important');
    box.style.setProperty('top', '177px', 'important');
    // 移除背景图
    const boxTitle = box.querySelector('.btn') as HTMLVideoElement;
    boxTitle.classList.remove('full_screenBg_bg');
    const domiframe: any = document.getElementById('iframeplay');
    // domiframe.contentWindow.StopRealPlayAll();
    this.videoMapPopList = [];
  }
  private delect(item: any) {
    this.messsageBus.emit('delectList', item);
    this.getComponent().removeHighlight();
  }

  // 获取视频流地址
  private async getVideoListURL() {
    this.videoMapPopList.forEach((item: any, index: any) => {
      const opts = {
        userName: publishObjectPath.value.videoMonitorPath.userName,
        password: publishObjectPath.value.videoMonitorPath.password,
        camCode: item.id,
        indexs: index,
      };
      this.getVideoUrl(opts);
    });
  }
  // 获取视频url
  private async getVideoUrl(opts: any) {
    const that = this;
    const domiframe: any = document.getElementById('iframeplay');
    // const res: any = await videoSituationServer.getVideoUrl(opts);
    // console.log('获取视频流地址',res)
    this.videoMapPopList.forEach((item: any, index: any) => {
      if (item.id === opts.camCode) {
        // 给当前url赋值/hkvideo/playvideo.html ?width=900px&height=540px&url= http://localhost:8989/hkvideo/hkvideo/playvideo.html
        if (this.isshowcompanyVideoPop) {
          item.url = 'http://10.236.46.225:8990/haikangvideo/demo/demo_window_simple_preview1.html?ID=' + item.id;
        } else {
          item.url = 'http://10.236.46.225:8990/haikangvideo/demo/demo_window_simple_preview.html?ID=' + item.id;
        }

        // item.url = 'http://localhost:8989/hkvideo/hkvideo/playvideo.html?ID=?width=900px&height=540px&url=' + res.data.data;
        // this.VideoClose();
        // this.NewHls = new Hls()
        // this.NewHls.loadSource(res.data.data)
        // this.NewHls.attachMedia(this.$refs.videoRef)
        // this.NewHls.on(Hls.Events.MANIFEST_PARSED, function() {
        //   (that as any).$refs.videoRef.play();
        // })
      }
    });
    if (this.videoMapPopList.length > 1) {
      this.amplifierShow = true;
    } else if (this.videoMapPopList.length === 0) {
      this.amplifierShow = false;
    } else {
      this.amplifierShow = true;
      this.amplifier(this.videoMapPopList[0], 0);
    }
    this.$forceUpdate();
  }
  private created() {
    this.iframeurl = (window as any).EMAP_CONFIG.common.videoService + '?width=' + this.iWindwidth + '&height=' + this.iWindheight;
  }
  private mounted() {
    const that = this;
    const eMapPanelDrag: any = new Drag('#phonePop', '.title', {
      container: '.layoutMain',
    });
    // eMapPanelDrag.toDrag();
    this.messsageBus.on('showleftList' , (data: any ) => {
      that.isshowcompanyVideoPop = data;
      if (data === true) {
        that.activeclass = 'layer-panel-bb';
        that.activestyle = '.layer-panel-bb';
      } else {
        that.activeclass = 'layer-panel-hh';
        that.activestyle = '.layer-panel-hh';
      }
    });
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      if (data === undefined) {
        that.VideoClose();
      }
    });
  }
  private beforeDestroy() {
    this.videoMapPopList = [];
    this.amplifierShow = false;
    this.messsageBus.emit('closeVideoMapPop', false);
    this.iframeurl = 'about:blank';
  }
  private amplifier(item: any, index: any) {
    this.amplifierShow = !this.amplifierShow;
    this.activeIndex = index;
    this.amplifieVideoUrl = item;
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent('videoLayer');
    return component;
  }
}
</script>
<style lang="less" scoped>
  @url: "../../../../assets/img/gisModule/PopulationFeverBox";
  @btn: "../../../../assets/img/gisPlot";
  @icon: "../../../../assets/img/gisModule/gisLayerPanel";
  .layer-panel-bb{
    width: 1137.38px;
    background: url("@{url}/video_bg.png") no-repeat;
    background-size: 100% 100%;
    height: 640px;
    position: absolute;
    left: 350px ;
    top: 120px ;
    z-index: 9999 !important; // 让现场弹窗层级在最顶层
    padding-left: 300px;
    .style{
      width:1920px;
      height:950px;
      left:70px;
      top:80px;
      z-index:1000;
    }
    .btn {
      position: absolute;
      display: flex;
      top: -8px;
      right: -15px;
      height: 47px;
      width: 175px;

      .close {
        position: absolute;
        right: 1px;
        top: -3px;
        width: 57px;
        height: 47px;
        cursor: pointer;
        background: url("@{url}/menu_magnify_bg_active_03.png") no-repeat center /
        100% 100%;
        &:hover {
          background: url("@{url}/menu_shrink_active_03.png") no-repeat center /
          100% 100%;
        }
      }
      .fullScreen {
        position: absolute;
        right: 58px;
        top: -3px;
        width: 45px;
        height: 47px;
        cursor: pointer;
        background: url("@{url}/menu_magnify_bg_active_02.png") no-repeat center /
        100% 100%;
        &:hover {
          background: url("@{url}/menu_shrink_active_02.png") no-repeat center /
          100% 100%;
        }
      }
      .reduction {
        position: absolute;
        right: 103px;
        top: -3px;
        width: 73px;
        height: 47px;
        cursor: pointer;
        background: url("@{url}/menu_magnify_bg_active_01.png") no-repeat center /
        100% 100%;
        &:hover {
          background: url("@{url}/menu_shrink_active_01.png") no-repeat center /
          100% 100%;
        }
      }
    }
    .title {
      position: relative;
      padding: 0px 40px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30px;
      font-weight: 600;
      height: 70px;
      box-sizing: border-box;
      span {
        display: block;
        width: 340px;
        overflow: hidden;
        position: absolute;
        left: -275px;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
      }
      .full_screenBg_bg {
        .fullScreen {
          background: url("@{url}/menu_magnify_bg_02.png") no-repeat center / 100%
          100%;
          &:hover {
            background: url("@{url}/menu_magnify_active_02.png") no-repeat center /
            100% 100%;
          }
        }
      }
    }
    .paddingBox {
      padding-left: 20px;
    }
    .content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      // height: 544px;
      height: 85%;
      justify-content: center;
      // padding: 10px 24px 50px 24px;
      // // box-sizing: border-box;
      // background: url("@{url}/centerBg.png") no-repeat;
      // background-size: 100% 100%;
      .bigVideo {
        width: 98%;
        height: 100%;
        position: relative;
        border: 1px solid #059ece;
        .videoBox {
          width: 100% !important;
        }
      }
      &:hover {
        .topBar {
          display: block;
        }
      }
      .topBar {
        width: 98px;
        height: 52px;
        display: none;
        position: absolute;
        left: 45%;
        top: -4px;
        z-index: 999;
        background: url("@{icon}/bg_icon.png") no-repeat center / 100% 100%;
        .closeBtn {
          width: 18px;
          height: 18px;
          cursor: pointer;
          background: url("@{icon}/qx_btn.png") no-repeat center / 100% 100%;
          display: inline-block;
          margin: 17px 0px 0px 20px;
          &:hover {
          }
        }
        .amplifier {
          width: 18px;
          height: 18px;
          cursor: pointer;
          background: url("@{icon}/fd_btn.png") no-repeat center / 100% 100%;
          display: inline-block;
          margin: 17px 0px 0px 20px;
          &:hover {
          }
        }
        .shrink {
          width: 18px;
          height: 18px;
          cursor: pointer;
          background: url("@{icon}/sx_btn.png") no-repeat center / 100% 100%;
          display: inline-block;
          margin: 17px 0px 0px 20px;
          &:hover {
          }
        }
      }
    }
    .text {
      font-size: 16px;
      color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #059ece;
    }
    .videoBox {
      width: 48%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-left: 10px;
      // margin-top: 10px;
      &:nth-child(3),
      &:nth-child(4) {
        margin-top: 0px;
      }
      .video {
        width: 100%;
        height: 100%;
        position: relative;
        border: 1px solid #059ece;
        &:nth-child(1):hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(2):hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(3):hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(4):hover {
          .topBar {
            display: block;
          }
        }
        .topBar {
          width: 98px;
          height: 52px;
          display: none;
          position: absolute;
          left: 38%;
          top: -4px;
          z-index: 999;
          background: url("@{icon}/bg_icon.png") no-repeat center / 100% 100%;
          .closeBtn {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url("@{icon}/qx_btn.png") no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
            &:hover {
            }
          }
          .amplifier {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url("@{icon}/fd_btn.png") no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
            &:hover {
            }
          }
          .shrink {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url("@{icon}/sx_btn.png") no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
            &:hover {
            }
          }
        }
      }
    }
  }
  .enterprise{
    // box.style.setProperty('width', '1920px', 'important');
    //   box.style.setProperty('height', '950px', 'important');
    //   box.style.setProperty('left', '70px', 'important');
    //   box.style.setProperty('top', '80px', 'important');
    //   box.style.setProperty('z-index', '1000', 'important');
    width: 1920px !important;
    height: 950px !important;
    left: 70px !important;
    top: 80px !important;
    z-index: 1000 !important;
  }
  .layer-panel-hh {
    width: 1137.38px;
    background: url("@{url}/video_bg.png") no-repeat;
    background-size: 100% 100%;
    height: 640px;
    position: absolute;
    left: 350px;
    top: 120px;
    z-index: 999999999999999999 !important; // 让现场弹窗层级在最顶层

    .btn {
      position: absolute;
      display: flex;
      top: -8px;
      right: -15px;
      height: 47px;
      width: 175px;

      .close {
        position: absolute;
        right: 1px;
        top: 2px;
        width: 57px;
        height: 47px;
        cursor: pointer;
        background: url("@{url}/menu_magnify_bg_active_03.png") no-repeat center /
        100% 100%;
        &:hover {
          background: url("@{url}/menu_shrink_active_03.png") no-repeat center /
          100% 100%;
        }
      }
      .fullScreen {
        position: absolute;
        right: 58px;
        top: -3px;
        width: 45px;
        height: 47px;
        cursor: pointer;
        background: url("@{url}/menu_magnify_bg_active_02.png") no-repeat center /
        100% 100%;
        &:hover {
          background: url("@{url}/menu_shrink_active_02.png") no-repeat center /
          100% 100%;
        }
      }
      .reduction {
        position: absolute;
        right: 103px;
        top: -3px;
        width: 73px;
        height: 47px;
        cursor: pointer;
        background: url("@{url}/menu_magnify_bg_active_01.png") no-repeat center /
        100% 100%;
        &:hover {
          background: url("@{url}/menu_shrink_active_01.png") no-repeat center /
          100% 100%;
        }
      }
    }
    .title {
      position: relative;
      padding: 0px 40px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30px;
      font-weight: 600;
      height: 70px;
      box-sizing: border-box;
      span {
        display: block;
        width: 340px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
      }
      .full_screenBg_bg {
        .fullScreen {
          background: url("@{url}/menu_magnify_bg_02.png") no-repeat center / 100%
          100%;
          &:hover {
            background: url("@{url}/menu_magnify_active_02.png") no-repeat center /
            100% 100%;
          }
        }
      }
    }
    .paddingBox {
      padding-left: 20px;
    }
    .content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      // height: 544px;
      height: 85%;
      justify-content: center;
      // padding: 10px 24px 50px 24px;
      // // box-sizing: border-box;
      // background: url("@{url}/centerBg.png") no-repeat;
      // background-size: 100% 100%;
      .bigVideo {
        width: 98%;
        height: 100%;
        position: relative;
        border: 1px solid #059ece;
        .videoBox {
          width: 100% !important;
        }
      }
      &:hover {
        .topBar {
          display: block;
        }
      }
      .topBar {
        width: 98px;
        height: 52px;
        display: none;
        position: absolute;
        left: 45%;
        top: -4px;
        z-index: 999;
        background: url("@{icon}/bg_icon.png") no-repeat center / 100% 100%;
        .closeBtn {
          width: 18px;
          height: 18px;
          cursor: pointer;
          background: url("@{icon}/qx_btn.png") no-repeat center / 100% 100%;
          display: inline-block;
          margin: 17px 0px 0px 20px;
          &:hover {
          }
        }
        .amplifier {
          width: 18px;
          height: 18px;
          cursor: pointer;
          background: url("@{icon}/fd_btn.png") no-repeat center / 100% 100%;
          display: inline-block;
          margin: 17px 0px 0px 20px;
          &:hover {
          }
        }
        .shrink {
          width: 18px;
          height: 18px;
          cursor: pointer;
          background: url("@{icon}/sx_btn.png") no-repeat center / 100% 100%;
          display: inline-block;
          margin: 17px 0px 0px 20px;
          &:hover {
          }
        }
      }
    }
    .text {
      font-size: 16px;
      color: #fff;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #059ece;
    }
    .videoBox {
      width: 48%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-left: 10px;
      // margin-top: 10px;
      &:nth-child(3),
      &:nth-child(4) {
        margin-top: 0px;
      }
      .video {
        width: 100%;
        height: 100%;
        position: relative;
        border: 1px solid #059ece;
        &:nth-child(1):hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(2):hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(3):hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(4):hover {
          .topBar {
            display: block;
          }
        }
        .topBar {
          width: 98px;
          height: 52px;
          display: none;
          position: absolute;
          left: 38%;
          top: -4px;
          z-index: 999;
          background: url("@{icon}/bg_icon.png") no-repeat center / 100% 100%;
          .closeBtn {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url("@{icon}/qx_btn.png") no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
            &:hover {
            }
          }
          .amplifier {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url("@{icon}/fd_btn.png") no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
            &:hover {
            }
          }
          .shrink {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url("@{icon}/sx_btn.png") no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
            &:hover {
            }
          }
        }
      }
    }
  }
  #playWind {
    iframe {
      margin-left: 18px;
    }
  }
</style>
