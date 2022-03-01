<template>
  <!-- 卫星云图播放 -->
  <div class="playShaftBox">
        <div class="timeSteps">
          <i :class="isPlay ? 'openBtn' : 'closeBtn'" @click="playFn"></i>
          <ul>
            <li
              v-for="(item, index) in timeSteps"
              :key="index"
              :class="item.checked ? 'active' : ''"
            >
              <span :class="item.checked ? 'activeIndex' : ''">{{item.value}}</span>
              <i @click="nextFn(item, index)" :class="item.checked ? 'activei' : ''"></i>
            </li>
          </ul>
        </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'RainForest',
})
export default class RainForest extends Vue {
  private time: any = '';
  private isPlay: boolean = false;
  private activeIndex: number = 0;
  private active: any = '';
  private activei: any = '';
  private autoPlay: any = '';
  private timeSteps: any = [];
  public getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
    return component;
  }
  // 点击开始/关闭按钮
  private playFn() {
    this.isPlay = !this.isPlay;
    if (this.isPlay) {
      this.autoPlayFn();
    } else {
      clearInterval(this.autoPlay);
    }
  }
  // 点击播放条指定位置
  private nextFn(item: any, index: any) {
    this.isPlay = false;
    this.timeSteps.map((timeItem: any, itemIndex: number) => {
      timeItem.checked = false;
      if (itemIndex <= index) {
        timeItem.checked = true;
      }
    });
    this.activeIndex = index;
    this.getComponent().configLayer.SatelliteCloud._play(this.activeIndex);
    clearInterval(this.autoPlay);
  }
  // 播放定时器
  private autoPlayFn() {
    this.timeSteps[0].checked = true;
    this.autoPlay = setInterval(() => {
      this.activeIndex++;
      if (this.activeIndex > this.timeSteps.length - 1) {
        this.activeIndex = 0;
        clearInterval(this.autoPlay);
        this.isPlay = false;
        this.timeSteps.map((item: any) => {
          item.checked = false;
        });
      } else {
        this.timeSteps[this.activeIndex].checked = true;
      }
      this.getComponent().configLayer.SatelliteCloud._play(this.activeIndex);
    }, 2000);
  }
  // 清除定时器以及恢复默认值
  private clearPlay(): void {
    if (this.autoPlay) {
      clearInterval(this.autoPlay);
    }
    this.isPlay = false;
    this.activeIndex = 0;
    this.timeSteps.map((item: any, index: number) => {
      item.checked = index === 0 ? true : false;
    });
    this.getComponent().unload();
  }

  private created(): void {
    this.getComponent()
      .configLayer.SatelliteCloud._getServerData()
      .then((res: any) => {
        res.map((item: any, index: number) => {
          this.timeSteps.push({
            id: index,
            value: item.time,
            checked: false,
          });
        });
      });
  }
  // 页面销毁
  private destroyed() {
    this.clearPlay();
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../assets/img/gisModule/legendPlanel';
.playShaftBox {
  color: #fff;

  .legend_palyer {
    width: 40px;
    height: 20px;
    background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .timeSteps {
    width: 100%;
    display: flex;
    margin-top: 30px;
    .closeBtn {
      display: inline-block;
      width: 65px;
      height: 60px;
      background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
      background-size: 100% 100%;
      cursor: pointer;
      margin-top: -8px;
    }
    .openBtn {
      display: inline-block;
      width: 65px;
      height: 60px;
      background: url('@{imgPath}/legend_stop.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      margin-top: -8px;
    }
    ul {
      display: flex;
      width: 87%;
      margin: 20px 0 0 20px;
      li {
        width: 48%;
        background: rgba(106, 209, 246, 0.4);
        height: 5px;
        position: relative;
        i {
          display: inline-block;
          width: 22px;
          height: 20px;
          background: url('@{imgPath}/dot02.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: -1px;
          top: -7px;
          cursor: pointer;
        }
        span {
          position: absolute;
          top: 15px;
          right: -41px;
          color: #ffffff;
          font-size: 20px;
          cursor: pointer;
          // display: none;
          text-align: center;
          line-height: 32px;
          width: 105px;
          padding: 3px;
        }
        &:nth-child(odd) {
          span {
            top: 15px;
          }
        }
        &:nth-child(even) {
          span {
            top: -45px;
          }
        }
      }
      .active {
        background: #9eff6f;
      }
      .activei {
        background: url('@{imgPath}/dot01.png') no-repeat;
        background-size: 100% 100%;
        transform: translateX(-1px);
      }
      .activeIndex {
        display: block;
        // background: url('@{imgPath}/wordBg.png') no-repeat;
        // background-size: 100% 100%;
        width: 105px;
        padding: 3px;
        // height: 35px;
        color: #9eff6f;
      }
      li:nth-of-type(1) {
        width: 2%;
      }
    }
  }
}
</style>
