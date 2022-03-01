<template>
  <!-- 图层图例 -->
  <div class="radar_legend">
    <div class="legend_play">
      <div class="timeSteps">
        <i :class="isPlay ? 'openBtn' : 'closeBtn'" @click="playFn"></i>
        <ul>
          <li
            v-for="(item, index) in timeSteps"
            :key="index"
            :class="item.checked ? 'active' : ''"
          >
            <span :class="activeWord == index ? 'activeWord' : ''">{{
              item.value
            }}</span>
            <i
              @click="nextFn(item, index)"
              :class="item.checked ? 'activei' : ''"
            ></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="legend_color">
      <span class="subtext">反射率（dBZ）</span>
      <ul>
        <li v-for="(item, index) in colorList" :key="index">
          <span :style="{ background: item.color }"></span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {} from '@/api/feature/monitorwarning/installServer';
/**
 * 图层
 */
@Component({
  name: 'Radar',
})
export default class Radar extends Vue {
  private isShow: any = true;
  private colorList: any = [
    {
      color: '#d3fdbc',
      value: '10',
    },
    {
      color: '#a5f094',
      value: '20',
    },
    {
      color: '#3fa30a',
      value: '30',
    },
    {
      color: '#57baff',
      value: '40',
    },
    {
      color: '#0101fa',
      value: '50',
    },
    {
      color: '#04704e',
      value: '60',
    },
    {
      color: '#fc03f3',
      value: '70',
    },
  ];
  private isPlay: boolean = false;
  private activeWord: any = 0;
  private active: any = '';
  private activei: any = '';
  private autoPlay: any = '';
  private timeSteps: any = [
    { id: '0', value: '15时15分', checked: true },
    { id: '1', value: '15时30分', checked: false },
    { id: '2', value: '15时45分', checked: false },
    { id: '1', value: '16时0分', checked: false },
    { id: '2', value: '16时15分', checked: false },
  ];
  public getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('rainForecast');
    return component;
  }
  // 点击开始/关闭按钮
  private playFn() {
    this.isPlay = !this.isPlay;
    if (this.isPlay === true) {
      this.autoPlayFn();
    } else {
      clearInterval(this.autoPlay);
    }
  }
  private autoPlayFn() {
    let index = 0;
    this.autoPlay = setInterval(() => {
      if (
        this.timeSteps[1].checked === true &&
        this.timeSteps[2].checked === true
      ) {
        this.timeSteps[1].checked = false;
        this.timeSteps[2].checked = false;
      } else {
        index++;
        if (index > 2) {
          index = 0;
        }
        this.timeSteps[index].checked = true;
        // this.getComponent().load(index);
        this.activeWord = index;
      }
    }, 2000);
  }

  private nextFn(item: any, index: any) {
    this.activeWord = index;
    item.checked = true;
    if (item.value === '48h' && item.checked === true) {
      // this.getComponent().load(1);
      this.timeSteps[2].checked = false;
    } else if (item.value === '24h' && item.checked === true) {
      this.timeSteps[2].checked = false;
      this.timeSteps[1].checked = false;
      // this.getComponent().load(0);
    } else if (item.value === '72h') {
      // this.getComponent().load(2);
    }
  }
  private created(): void {
    // this.getComponent().load(0);
  }
  private beforeDestroy(): void {
    clearInterval(this.autoPlay);
    // this.getComponent().unload();
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../assets/img/gisModule/legendPlanel';
.radar_legend {
  .legend_play {
    height: 100px;
    .legend_palyer {
      width: 40px;
      height: 20px;
      background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 20px;
      background: url('@{imgPath}/legend_line.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
    .timeSteps {
      z-index: 99999;
      width: 90%;
      height: 78px;
      display: flex;
      margin: 0 auto;
      margin-top: 50px;
      .closeBtn {
        display: inline-block;
        width: 65px;
        height: 60px;
        background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
        background-size: 100% 100%;
        cursor: pointer;
        margin-top: 16px;
      }
      .openBtn {
        display: inline-block;
        width: 65px;
        height: 60px;
        background: url('@{imgPath}/legend_stop.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        margin-top: 16px;
      }
      ul {
        display: flex;
        width: 69%;
        margin: 45px 0 0 30px;
        li {
          width: 48%;
          background: rgba(106, 209, 246, 0.4);
          height: 5px;
          position: relative;
          i {
            display: inline-block;
            width: 22px;
            height: 20px;
            // background: #6ad1f6;
            background: url('@{imgPath}/dot02.png') no-repeat;
            background-size: 100% 100%;
            // border-radius: 50%;
            position: absolute;
            right: -1px;
            top: -7px;
            cursor: pointer;
          }
          span {
            position: absolute;
            top: -57px;
            right: -41px;
            color: #ffffff;
            font-size: 20px;
            cursor: pointer;
            display: none;
            text-align: center;
            line-height: 32px;
          }
        }
        .active {
          background: #9eff6f;
        }
        .activei {
          background: url('@{imgPath}/dot01.png') no-repeat;
          background-size: 100% 100%;
          // background: #9eff6f;
          transform: translateX(-6px);
        }
        .activeWord {
          display: block;
          background: url('@{imgPath}/wordBg.png') no-repeat;
          background-size: 100% 100%;
          width: 105px;
          padding: 3px;
          height: 35px;
        }
        li:nth-of-type(1) {
          width: 2%;
        }
      }
    }
  }
  .legend_color {
    height: 100px;
    width: 96%;
    margin-left: 30px;
    .subtext {
      font-size: 22px;
      color: #bbd0dc;
      margin-left: 10px;
    }
    ul {
      display: flex;
      margin-top: 10px;
      margin-left: 6px;
      li {
        span {
          &:nth-child(1) {
            width: 55px;
            height: 15px;
            display: block;
            margin-bottom: 4px;
          }
          &:nth-child(2) {
            font-size: 18px;
            width: 39px;
            display: block;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
