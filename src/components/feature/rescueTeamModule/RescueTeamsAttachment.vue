<template >
  <div class="rescueteamAttachment-wrap">
    <h1 class="title-panel" @click="showEmergency = false">
      信息
      <span class="close-icon" @click='close'></span>
    </h1>
    <div class="swapper-box">
      <div class="vueGallery">
        <div class="activePhoto">
          <img
            v-if="photos[activePhoto].type == 'photo'"
            :src="photos[activePhoto].url"
            alt=""
          />
          <video
            v-if="photos[activePhoto].type == 'video'"
            :src="photos[activePhoto].url"
            controls="controls"
          ></video>
          <div class="audio-wrapper" v-if="photos[activePhoto].type == 'audio'">
            <audio res="audio" id="audio">
              <source :src="photos[activePhoto].url" type="audio/mp3" />
            </audio>
            <div class="audio-box">
              <div :class="flag?'audiopause':'audioplay'" @click="play"></div>

              <div class="audio-right">
                <!-- <p style="max-width: 536px;">Beta-B_Kan R. Gao.mp3</p> -->
                <div class="progress-bar-bg" id="progressBarBg">
                  <span id="progressDot"></span>
                  <div class="progress-bar" id="progressBar"></div>
                </div>
                <!-- <div class="audio-time">
                  <span class="audio-length-current" id="audioCurTime"
                    >00:00</span
                  ><span class="audio-length-total">01:06</span>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="thumbnails">
          <span
            aria-label="Previous Photo"
            class="previous"
            @click="previousPhoto()"
          >
          </span>
          <span aria-label="Next Photo" class="next" @click="nextPhoto()">
          </span>
          <div class="thumb-box">
            <div class="item-wrap" :style="{ left: leftVal + 'px' }">
              <div
                class="item"
                v-for="(item, index) in photos"
                :key="index"
                @click="changePhoto(index)"
                :class="{ actived: activePhoto == index }"
              >
                <img v-if="item.type == 'photo'" :src="item.thumb" alt="" />
                <video v-if="item.type == 'video'" :src="item.thumb"></video>
                <img v-if="item.type == 'audio'" :src="item.thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// import image from '~@/assets/img/powerdispatch/audio-img.png';
@Component({
  name: 'RescueTeamsAttachment',
  components: {},
})
export default class RescueTeamsAttachment extends Vue {
  // @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
  @Prop() private rescueTeamHomeData?: any; // 父组件传的数据
  private activePhoto: any = 0;
  private Iindex: any = 0;
  private isMove: any = false;
  private leftVal: number = 0;
  private flag = true;
  private photos = [
    // {
    //   type: 'photo',
    //   url:
    //     'https://img.alicdn.com/imgextra/i3/113/TB2o18uzUhnpuFjSZFpXXcpuXXa_!!113-0-luban.jpg_q100.jpg',
    //   thumb:
    //     'https://img.alicdn.com/imgextra/i3/113/TB2o18uzUhnpuFjSZFpXXcpuXXa_!!113-0-luban.jpg_q100.jpg',
    // },
    // {
    //   type: 'audio',
    //   url: 'http://up_mp4.t57.cn/2017/1/05m/09/298092245364.m4a',
    //   thumb: require('../../../assets/img/powerdispatch/audio-img.png'),
    // },
    // {
    //   type: 'photo',
    //   url: 'https://img.alicdn.com/tps/i4/TB1vHgyRVXXXXbJaXXXSutbFXXX.jpg',
    //   thumb: 'https://img.alicdn.com/tps/i4/TB1vHgyRVXXXXbJaXXXSutbFXXX.jpg',
    // },
    // {
    //   type: 'video',
    //   url: 'http://vfx.mtime.cn/Video/2019/03/18/mp4/190318231014076505.mp4',
    //   thumb: 'http://vfx.mtime.cn/Video/2019/03/18/mp4/190318231014076505.mp4',
    // },
    // {
    //   type: 'photo',
    //   url: 'https://aecpm.alicdn.com/simba/img/TB1_JXrLVXXXXbZXVXXSutbFXXX.jpg',
    //   thumb:
    //     'https://aecpm.alicdn.com/simba/img/TB1_JXrLVXXXXbZXVXXSutbFXXX.jpg',
    // },
    // {
    //   type: 'photo',
    //   url:
    //     'https://img.alicdn.com/imgextra/i3/113/TB2o18uzUhnpuFjSZFpXXcpuXXa_!!113-0-luban.jpg_q100.jpg',
    //   thumb:
    //     'https://img.alicdn.com/imgextra/i3/113/TB2o18uzUhnpuFjSZFpXXcpuXXa_!!113-0-luban.jpg_q100.jpg',
    // },
    // {
    //   type: 'audio',
    //   url: 'http://up_mp4.t57.cn/2017/1/05m/09/298092245364.m4a',
    //   thumb: require('../../../assets/img/powerdispatch/audio-img.png'),
    // },
    // {
    //   type: 'photo',
    //   url: 'https://img.alicdn.com/tps/i4/TB1vHgyRVXXXXbJaXXXSutbFXXX.jpg',
    //   thumb: 'https://img.alicdn.com/tps/i4/TB1vHgyRVXXXXbJaXXXSutbFXXX.jpg',
    // },
    // {
    //   type: 'video',
    //   url: 'http://vfx.mtime.cn/Video/2019/03/18/mp4/190318231014076505.mp4',
    //   thumb: 'http://vfx.mtime.cn/Video/2019/03/18/mp4/190318231014076505.mp4',
    // },
    // {
    //   type: 'photo',
    //   url: 'https://aecpm.alicdn.com/simba/img/TB1_JXrLVXXXXbZXVXXSutbFXXX.jpg',
    //   thumb:
    //     'https://aecpm.alicdn.com/simba/img/TB1_JXrLVXXXXbZXVXXSutbFXXX.jpg',
    // },
  ];
  private close() {
    this.$emit('close');
    // 返回现场回传页面
        // if (this.parentHandleClickNumFn) {
        //     this.parentHandleClickNumFn(JSON.parse(JSON.stringify(this.rescueTeamHomeData)), 'SiteFeedback');
        // }
  }
  // private created() {
  //   this.photos = this.rescueTeamHomeData || [];
  //   console.log(this.photos, 'this.photos');
  // }


  private mounted() {
    const itemDiv = (
      document.querySelectorAll('.thumb-box .item')[this.activePhoto]
    ) as HTMLElement;
    const itemWrap = document.querySelector('.item-wrap') as HTMLElement;
    itemWrap.style.width =
      this.photos.length * (itemDiv.getBoundingClientRect().width + 4) + 'px';
    const thumbBox = document.querySelector('.thumb-box') as HTMLElement;
    if (
      this.photos.length * (itemDiv.getBoundingClientRect().width + 4) <
      thumbBox.getBoundingClientRect().width
    ) {
      itemWrap.style.left = '50%';
      itemWrap.style.marginLeft =
        '-' +
        (this.photos.length * (itemDiv.getBoundingClientRect().width + 4)) / 2 +
        'px';
    }
    this.changePhoto(0);
    document.addEventListener('keydown', (event) => {
      if (event.which === 37) {
        this.previousPhoto();
      }
      if (event.which === 39) {
        this.nextPhoto();
      }
    });
  }
  @Watch('rescueTeamHomeData', {deep: true, immediate: true})
  private setData(val: any) {
    this.photos = val || [];
  }

  // 播放音频
  private play() {
     const audio = document.getElementById('audio') as HTMLAudioElement;
     const progressDot = document.getElementById('progressDot') as HTMLElement;
     const progressBar = document.getElementById('progressBar') as HTMLElement;

     let progressFlag;
     if (audio !== null) {
        if (audio.paused) {
          audio.play(); // 播放
          this.flag = false;
          progressFlag = setInterval(function() {
            progressDot.style.left = audio.currentTime + 'px';
            progressBar.style.width = audio.currentTime + 'px';

          }, 60);
        } else {
            this.flag = true;
            audio.pause(); // 暂停;
            clearInterval(progressFlag);
        }
      }
  }

  private changePhoto(index: any) {
    this.activePhoto = index;
    // const box = <HTMLElement>document.querySelectorAll('.thumb-box .item')[index];
    // console.log(box.offsetLeft)

    // this.changeLeft(1);
  }
  private nextPhoto() {
    this.changePhoto(
      this.activePhoto + 1 < this.photos.length ? this.activePhoto + 1 : 0,
    );
    this.changeRight();
  }
  private previousPhoto() {
    this.changePhoto(
      this.activePhoto - 1 >= 0 ? this.activePhoto - 1 : this.photos.length - 1,
    );
    this.changeLeft();
  }
  // 右切换缩略图滚动判断
  private changeRight() {
    console.log(this.activePhoto, this.photos.length);
    const itemDiv = (
      document.querySelectorAll('.thumb-box .item')[this.activePhoto]
    ) as HTMLElement;
    const thumbBoxDiv = document.querySelector('.thumb-box') as HTMLElement;
    const thumbBoxDivLeft = thumbBoxDiv.getBoundingClientRect().left;
    const thumbBoxDivWidth = thumbBoxDiv.getBoundingClientRect().width;
    const itemDivLeft = itemDiv.getBoundingClientRect().left;
    console.log(
      itemDivLeft,
      thumbBoxDivLeft,
      thumbBoxDivWidth,
      itemDiv.getBoundingClientRect().width + 4,
      itemDivLeft - thumbBoxDivLeft - thumbBoxDivWidth,
    );
    if (this.photos.length > 5) {
      if (this.activePhoto > 4) {
        if (
          Math.abs(itemDivLeft - thumbBoxDivLeft - thumbBoxDivWidth) >
          itemDiv.getBoundingClientRect().width + 4
        ) {
          console.log('大于5');
        } else {
          this.leftVal =
            (this.activePhoto - 4) *
            (-itemDiv.getBoundingClientRect().width - 4);
        }
      } else {
        console.log(this.activePhoto);
        if (this.activePhoto === 0) {
          this.leftVal = 0;
        }
        // this.leftVal=(this.activePhoto-4)*(-134)+this.leftVal;
      }
    }
  }
  // 左切换缩略图滚动判断
  private changeLeft() {
    console.log(this.activePhoto, this.photos.length);
    const itemDiv = (
      document.querySelectorAll('.thumb-box .item')[this.activePhoto]
    ) as HTMLElement;
    const thumbBoxDiv = document.querySelector('.thumb-box') as HTMLElement;
    // this.leftVal = box.offsetLeft;
    const thumbBoxDivLeft = thumbBoxDiv.getBoundingClientRect().left;
    const thumbBoxDivWidth = thumbBoxDiv.getBoundingClientRect().width;
    const itemDivLeft = itemDiv.getBoundingClientRect().left;
    //  console.log(itemDivLeft,thumbBoxDivLeft,thumbBoxDivWidth,itemDiv.getBoundingClientRect().width+4,(itemDivLeft-thumbBoxDivLeft)-thumbBoxDivWidth);
    if (this.photos.length > 5) {
      if (this.activePhoto > 4) {
        //     console.log(">4", this.activePhoto);
        this.leftVal =
          (this.activePhoto - 4) * (-itemDiv.getBoundingClientRect().width - 4);
      } else {
        console.log('else', this.activePhoto);
        if (this.activePhoto === 0) {
          this.leftVal = 0;
        }
        // this.leftVal=(this.activePhoto-4)*(-134)+this.leftVal;
      }
    }
  }
}
</script>
<style lang="less" scoped>
@urlPath: "../../../assets/img/powerdispatch";
@url: "../../../assets/img/halfScreen/eventAndTopics";
* {
  padding: 0;
  margin: 0;
}
.rescueteamAttachment-wrap {
  position: absolute;
  height: 669px;
  width: 879px;
  left: 500px;
  top: 100px;
  background: url("@{urlPath}/box-bg.png") no-repeat 0 0;
  background-size: 100% 100%;
  z-index: 20;
  h1 {
    position: relative;
    margin: 36px 0 0 53px;
  }
  .close-icon {
    position: absolute;
    top: -15px;
    right: 19px;
    width: 80px;
    height: 35px;
    background: url("@{url}/eventAndTopics_close.png") no-repeat 0 0;
    z-index: 1;
    cursor: pointer;
    pointer-events: auto;
  }
  .close-icon:hover {
    background-image: url("@{url}/eventAndTopics_close_h.png");
  }
  .swapper-box {
    padding: 25px;
    .heading {
      text-align: center;
    }
    .heading h1 {
      background: -webkit-linear-gradient(#fff, #8f70ba);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
      margin: 0 0 5px 0;
      font-weight: 900;
      font-size: 4rem;
      color: #fff;
    }
    .heading h4 {
      color: #8f70ba;
      text-align: center;
      margin: 0 0 35px 0;
      font-weight: 400;
      font-size: 24px;
    }
    .container {
      padding: 6px;
      background-color: #fff;
      border-radius: 8px;
      max-width: 800px;
      box-shadow: 0 5px 8px #0000007a;
    }

    .vueGallery .activePhoto {
      width: 760px;
      height: 427px;
      margin: 0 auto;
      // position: relative;
      // border: 1px solid #284d5b;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        // object-fit: contain;
        text-align: center;
        vertical-align: middle;
      }
      video {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }

    .vueGallery .thumbnails {
      width: 99%;
      height: 87px;
      margin-top: 23px;
      position: relative;
      .previous {
        display: inline-block;
        width: 45px;
        height: 90px;
        position: absolute;
        top: 15%;
        left: 32px;
        cursor: pointer;
        background: url("@{urlPath}/previous.png") no-repeat 0 0;
        background-size: 60% 60%;
      }
      .previous:hover {
        background: url("@{urlPath}/previous-active.png") no-repeat 0 0;
          background-size: 60% 60%;
      }
      .next {
        display: inline-block;
        width: 45px;
        height: 90px;
        position: absolute;
        top: 15%;
        right: 8px;
        cursor: pointer;
        background: url("@{urlPath}/next.png") no-repeat 0 0;
        background-size: 60% 60%;
      }
      .next:hover {
        background: url("@{urlPath}/next-active.png") no-repeat 0 0;
          background-size: 60% 60%;
      }
      .thumb-box {
        width: 670px;
        height: inherit;
        margin: 0 auto;
        // display: flex;
        /* overflow-x: scroll; */
        overflow: hidden;
        position: relative;

        .item-wrap {
          width: 1353px!important;
          position: absolute;
          left: 0;
          transition: left ease 0.2s;
          .item {
            display: inline-block;
            width: 128px;
            height: 76px;
            margin-right: 4px;
            border: 1px solid #2c5562;
            border-radius: 5px;
            overflow: hidden;
            cursor: pointer;
            img {
              width: 100%;
              height: 80px;
              object-fit: scale-down;
              border-radius: 5px;
            }
            video {
              width: 128px;
              height: 80px;
              border-radius: 5px;
            }
          }
          div:hover {
            opacity: 0.6;
          }
          div:active {
            border: 1px solid #fef551;
            opacity: 1;
          }
          div:visited {
            border: 1px solid #fef551;
            opacity: 1;
          }
          .actived {
            border: 1px solid #fef551;
            opacity: 1;
          }
        }
      }
    }
  }
  .audio-wrapper {
    width: 622px;
    height: 400px;
    background-color: #040a13;
    margin: 10px auto;
    max-width: 670px;
    border: 1px solid #284d5a;
    background: url("@{urlPath}/audio-bg.png") no-repeat 0 0;
    position: relative;
  }
  .audio-box {
    width: 622px;
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    border-top: 1px solid #2c5562;
  }
  .audiopause {
    float: left;
    text-align: center;
    width: 18%;
    height: 100%;
    width: 25px;
    height: 25px;
    margin: 12px;
    background: url("@{urlPath}/audio-pause.png") no-repeat 0 0;
  }
   .audioplay {
    float: left;
    text-align: center;
    width: 18%;
    height: 100%;
    width: 25px;
    height: 25px;
    margin: 12px;
    background: url("@{urlPath}/audio-play.png") no-repeat 0 0;
  }

  .audio-left img {
    width: 40px;
    position: relative;
    top: 15px;
    margin: 0;
    display: initial; /* 解除与app的样式冲突 */
    cursor: pointer;
  }

  .audio-right {
    margin-right: 2%;
    float: right;
    width: 87%;
    height: 100%;
    margin-top: 22px;
  }

  .audio-right p {
    font-size: 15px;
    /* 歌曲名称只显示在一行，超出部分显示为省略号 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 243px; /* 要适配小屏幕手机，所以最大宽度先设小一点，后面js根据屏幕大小重新设置 */
  }

  .progress-bar-bg {
    background-color: #224556;
    position: relative;
    height: 4px;
    cursor: pointer;
  }

  .progress-bar {
    background-color: #649fec;
    width: 0;
    height: 2px;
  }

  .progress-bar-bg span {
    content: " ";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    background-color: #3e87e8;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -5px;
    margin-left: -5px;
    cursor: pointer;
  }

  .audio-time {
    overflow: hidden;
    margin-top: -1px;
  }

  .audio-length-total {
    float: right;
    font-size: 12px;
  }

  .audio-length-current {
    float: left;
    font-size: 12px;
  }
}
</style>
