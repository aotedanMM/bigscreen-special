<!--视频通话-->
<template>
    <div>
      <div class="videoBox" id="videoBox" :style="`position:absolute;left:${left}px;top:${top}px;z-index:50;width:${width}px;height:${height}px;`">
          <div class="videoTitle">
            <span>视频通话</span>
            <!-- <div class="close" @click="closevideoCall"></div> -->
            <div class="btn">
              <i v-if="expanded" class="narrow-on" @click="expanded = !expanded"></i>
              <i v-else class="narrow" @click="expanded = !expanded"></i>
              <i class="close" @click="Hangup"></i>
            </div>
          </div>
          <div ref="content" class="content" v-show="expanded">
            <iframe :src="path" ref="iframeId" frameborder="0" id="iframeId"></iframe>
          </div>
          <div class="bottom" v-if="expanded"></div>
          <!-- 拖拽改变大小 -->
          <div class="s-move-content-direction-n" @mousedown="down($event, 'n')"></div>
          <div class="s-move-content-direction-ne" @mousedown="down($event, 'ne')"></div>
          <div class="s-move-content-direction-e" @mousedown="down($event, 'e')"></div>
          <div class="s-move-content-direction-se" @mousedown="down($event, 'se')"></div>
          <div class="s-move-content-direction-s" @mousedown="down($event, 's')"></div>
          <div class="s-move-content-direction-sw" @mousedown="down($event, 'sw')"></div>
          <div class="s-move-content-direction-w" @mousedown="down($event, 'w')"></div>
          <div class="s-move-content-direction-nw" @mousedown="down($event, 'nw')"></div>
      </div>
    </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
@Component({
  name: 'VideoCallPop',
  components: {},
})
export default class VideoCallPop extends Vue {
  @Prop() private path?: any;
  private expanded: boolean = true;
  private width: number = 530;
  private height: number = 760;
  private minWidth: number = 400;
  private minHeight: number = 560;
  private x: any = '';
  private y: any = '';
  private top: number = 150;
  private left: number = 650;
  private mounted() {
    const eMapPanelDrag: any = new Drag('#videoBox', '.videoTitle', {
      container: '.layoutMain',
    });
    eMapPanelDrag.toDrag();
    const self = this;
    const win: any = window;
    win.iframeId = () => {
        self.closevideoCall();
    };
  }
  private down(e: any, type: any) {
    console.log(e, 'down');
    e.stopPropagation();
    e.preventDefault();
    this.x = e.pageX;
    this.y = e.pageY;
    const iframe = (this.$refs.iframeId as any);
    document.onmouseup = function() {
      console.log(document, 222);
      document.onmousemove = null;
      document.onmouseup = null;
      iframe.contentWindow.document.onmousemove = null;
      iframe.contentWindow.document.onmouseup = null;
    };
    document.onmousemove = (data: any) => {
      console.log(data.pageX, data.pageY, 'eeee');
      if (data.pageX > 1920 || data.pageY > 1080 || data.pageX < 0 || data.pageY < 50) {
        document.onmousemove = null;
        document.onmouseup = null;
        return;
      }
      const ev = data || window.event;
      switch (type) {
        case 'n' : this.moven(ev); // 上
                   break;
        case 's' : this.moves(ev); // 下
                   break;
        case 'e' : this.movee(ev); // 右
                   break;
        case 'w' : this.movew(ev); // 左
                   break;
        case 'ne' : this.moven(ev);
                    this.movee(ev);
                    break;
        case 'nw' : this.moven(ev);
                    this.movew(ev);
                    break;
        case 'se' : this.movee(ev);
                    this.moves(ev);
                    break;
        case 'sw' : this.moves(ev);
                    this.movew(ev);
                    break;
      }
      // this.moves(ev);
    };
    iframe.contentWindow.document.onmousemove = document.onmousemove;
    iframe.contentWindow.document.onmouseup = function() {
      console.log(document, 333);
      iframe.contentWindow.document.onmousemove = null;
      iframe.contentWindow.document.onmouseup = null;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  private moven(e: any) {
    this.height = this.height - e.movementY;
    if (this.height <= this.minHeight) {
      this.height = this.minHeight;
    } else {
      this.top = this.top + e.movementY;
    }
  }
  private moves(e: any) {
    this.height = this.height + e.movementY;
    if (this.height < this.minHeight) {
      this.height = this.minHeight;
    }
  }
  private movew(e: any) {
    this.width = this.width - e.movementX;
    // this.width = this.width - e.pageX + this.x;
    // this.x = e.pageX;
    if (this.width <= this.minWidth) {
      this.width = this.minWidth;
    } else {
      this.left = this.left + e.movementX;
    }
  }
  private movee(e: any) {
    this.width = this.width + e.movementX;
    if (this.width <= this.minWidth) {
      this.width = this.minWidth;
    }
  }
  // private movenw (e: any) {
  //   this.height = this.height + this.y - e.pageY;
  //   this.y = e.pageY;
  //   this.width = this.width - e.pageX + this.x;
  //   this.x = e.pageX;
  //   if (this.height <= this.minHeight) {
  //     this.height = this.minHeight;
  //   } else {
  //     this.top = e.pageY - 50;
  //   }
  //   if (this.width <= this.minWidth) {
  //     this.width = this.minWidth;
  //   } else {
  //     this.left = e.pageX;
  //   }
  // }
  // private movene (e: any) {
  //   this.height = this.height + this.y - e.pageY;
  //   this.y = e.pageY;
  //   this.width = this.width + e.pageX - this.x;
  //   this.x = e.pageX;
  //   if (this.height <= this.minHeight) {
  //     this.height = this.minHeight;
  //   } else {
  //     this.top = e.pageY - 50;
  //   }
  //   if (this.width <= this.minWidth) {
  //     this.width = this.minWidth;
  //   }
  // }
  // private movesw (e: any) {
  //   this.height = this.height + e.pageY - this.y;
  //   this.y = e.pageY;
  //   this.width = this.width - e.pageX + this.x;
  //   this.x = e.pageX;
  //   if (this.height <= this.minHeight) {
  //     this.height = this.minHeight;
  //   }
  //   if (this.width <= this.minWidth) {
  //     this.width = this.minWidth;
  //   } else {
  //     this.left = e.pageX;
  //   }
  // }
  // private movese (e: any) {
  //   this.height = this.height + e.pageY - this.y;
  //   this.y = e.pageY;
  //   this.width = this.width + e.pageX - this.x;
  //   this.x = e.pageX;
  //   if (this.height <= this.minHeight) {
  //     this.height = this.minHeight;
  //   }
  //   if (this.width <= this.minWidth) {
  //     this.width = this.minWidth;
  //   }
  // }
  private Hangup() {
    const iframe = (this.$refs.iframeId as any);
    iframe.contentWindow.AnyChatVideoCallComponent.anyChatVideoCallComponentInstance.hangupVideoCall();
    // this.closevideoCall();
  }
  // 传给子页面的关闭视频通话弹窗的方法
  private closevideoCall() {
    this.messsageBus.emit('closeVideoCallBox');
    console.log('关闭弹窗');
  }

}
</script>

<style lang="less" scoped>
@imgPath: '../../../assets/img/gisModule/PopulationFeverBox';
@btn: "../../../assets/img/gisPlot";
.videoBox {
        // position: absolute;
        // width: 530px;
        // height: 765px;
        .videoTitle {
          position: relative;
          padding: 15px 30px;
          width: 100%;
          height: 60px;
          background-image: url("@{imgPath}/topbg.png");
          background-position: center bottom;
          background-size: 105% 121%;
          box-sizing: border-box;
          span {
            margin: 20px 0 0 20px;
            font-weight: 600;
            font-family: 'myHeiti';
            font-size: calc(20px * 1.2);
            color: 00e4ff;
            background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .btn {
            position: absolute;
            display: flex;
            top: -6px;
            right: -14px;
            display: flex;
            .narrow {
              position: absolute;
              right: 68px;
              width: 68px;
              height: 48px;
              cursor: pointer;
              background: url("@{btn}/eventAndTopics_down_normal.png") no-repeat
                center / 100% 100%;
              &:hover {
                top: 1px;
                background: url("@{btn}/eventAndTopics_down_highlight.png") no-repeat
                  center / 100% 100%;
              }
            }
            .narrow-on {
              position: absolute;
              right: 68px;
              width: 68px;
              height: 48px;
              cursor: pointer;
              background: url("@{btn}/eventAndTopics_up_normal.png") no-repeat center /
                100% 100%;
              &:hover {
                top: 1px;
                background: url("@{btn}/eventAndTopics_up_highlight.png") no-repeat
                  center / 100% 100%;
              }
            }
            .close {
              position: absolute;
              right: 0;
              width: 68px;
              height: 48px;
              cursor: pointer;
              background: url("@{btn}/eventAndTopics_close_normal.png") no-repeat
                center / 100% 100%;
              &:hover {
                top: 1px;
                background: url("@{btn}/eventAndTopics_close_highlight.png") no-repeat
                  center / 100% 100%;
              }
            }
          }
        }
        .content {
          position: relative;
          width: 100%;
          height: calc(100% - 109px);
          padding: 5px 10px 0;
          background-image: url("@{imgPath}/centerBg.png");
          background-position: center top;
          background-size: 105% 100%;
          box-sizing: border-box;
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            margin-left: 13px;
            margin-top: 10px;
            width: calc(100% - 26px);
            height: calc(100% + 23px);
            border: 1px solid #2c5562;
            // border-radius: 16px;
          }
        }
        .bottom {
          width: 100%;
          height: 49px;
          background: url("@{imgPath}/botBg.png");
          background-position: center top;
          background-size: 105% 161%;
        }
        .s-move-content-direction-n {
          position: absolute;
          width: 100%;
          height: 4px;
          left: 0;
          top: -2px;
          cursor: n-resize;
          // background: red;
        }
        .s-move-content-direction-ne {
          position: absolute;
          width: 8px;
          height: 8px;
          right: 0;
          top: -2px;
          cursor: ne-resize;
          // background: orange;
        }
        .s-move-content-direction-nw {
          position: absolute;
          width: 10px;
          height: 10px;
          left: 0;
          top: -2px;
          cursor: nw-resize;
          // background: orange;
        }
        .s-move-content-direction-e {
          position: absolute;
          width: 4px;
          height: 100%;
          right: 0;
          top: 0;
          cursor: e-resize;
          // background: red;
        }
        .s-move-content-direction-s {
          position: absolute;
          width: 100%;
          height: 4px;
          right: 0;
          bottom: -3px;
          cursor:s-resize;
          // background: red;
        }
        .s-move-content-direction-w {
          position: absolute;
          width: 4px;
          height: 100%;
          left: 0;
          top: 0;
          cursor: w-resize;
          // background: red;
        }
        .s-move-content-direction-se {
          position: absolute;
          width: 8px;
          height: 8px;
          right: 0;
          bottom: -2px;
          cursor: se-resize;
          // background: orange;
          z-index: 100;
        }
        .s-move-content-direction-sw {
          position: absolute;
          width: 10px;
          height: 10px;
          left: 0;
          bottom: -3px;
          cursor: sw-resize;
          // background: orange;
        }
}
</style>
