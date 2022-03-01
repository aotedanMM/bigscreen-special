<template>
  <div class="timerbar-box">
    <div class="timerbar-box_hd">
      <span class="title">蔓延趋势</span>
      <div class="zoomBtn">
        <i v-if="expanded" class="narrow-on" @click="expanded = !expanded"></i>
        <i v-else class="narrow" @click="expanded = !expanded"></i>
      </div>
      <!-- <ZoomBtn></ZoomBtn> -->
      <!-- <span class="close" @click.stop="closeTimeBar">
      <i class="el-icon-close"></i>
     </span> -->
    </div>
    <div class="timerbar-box_bd" v-show='expanded'>
      <div class="timebar">
        <div class="timebar_btnWrap" style="display: none;">
          <span
            class="timebar_btn timebar_play"
            :class="{ disabled: isPlayState }"
            @click="timePlay"
            title="播放"
          ></span>
          <span
            class="timebar_btn timebar_stop"
            :class="{ disabled: isPauseState }"
            @click="timePause"
            title="暂停"
          ></span>
          <span
            class="timebar_btn timebar_reset"
            :class="{ disabled: isResetState }"
            @click="timeReset"
            title="重置"
          ></span>
        </div>
        <div class="timebar_content">
          <!-- <span class="timebar_title">蔓延趋势</span> -->
          <!-- <div style="position:relative" class="contentWrap">
          <ul class="timebar_ul" ref="timebar">          
            <li class="timebar_ul_li" v-for="(i, idx) of total" :key="idx">
                
              <span :class="idx % 2 === 0 ? 'line-short' : 'line'" >
                <b></b>         
              </span> 
              <span class="hour-txt"  style="margin-right:-10px;">
                {{i}}h
              </span>    
            </li>  
          </ul>
          <div class="timebar_ul_slider" :style="{width: sliderWidth+'px'}"></div> 
          <span class="time-info" :style="{left: sliderWidth - 52 +'px'}">
              {{currentText}}
          </span> 
        </div> -->
          <div class="contentWrap timeSteps">
            <i
              :class="isPlayState ? 'openBtn' : 'closeBtn'"
              @click="playFn"
            ></i>
            <ul>
              <li
                v-for="(item, index) in timeSteps"
                :key="index"
                :class="item.checked ? 'active' : ''"
              >
                <span :class="item.checked ? 'activeIndex' : ''">{{
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
      </div>
      <div class="weatherbar" v-show="false">
        <span class="weatherbar_title">气象信息</span>
        <div style="position:relative" class="contentWrap">
          <!-- {{JSON.stringify(weatherbarArr,4,4)}} -->
          <ul class="weatherbar_bar" ref="timebar">
            <li
              class="blue"
              v-for="(item, index) of weatherbarArr"
              :key="index"
              :style="{ width: item.width + 'px', left: item.left + 'px' }"
            >
              <span class="time-info">
                风速：{{ item.windSpeed }}米/秒<br />
                风向：{{ item.windType }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ZoomBtn from '../../flood/ZoomBtn.vue';
// import { Injectable, Container } from 'ca-middleware';
// import MapResolver from '../../util/MapResolver';
@Component({
  name: 'Timebar',
  components: { ZoomBtn },
  // mixins: [MapResolver],
})
export default class Timebar extends Vue {
  // @Injectable() public container!: Container;
  private expanded = true;
  private step: any;
  private total: any;
  private startDateTime: any;
  private windArr: any;
  private weatherbarStyle = {}; // 天气预报有风块的style;
  private weatherbarArr: any = [];
  private isPlayState = false; // 点击打开定时器的状态
  private currentIndex = 0; // 当前播放点的下标
  private timer: any = null; // 定时器
  private sliderWidth: number = 0; // 滑块的宽度
  private timebarWidth: number = 0; // 时间轴总刻度的宽度
  private stepWidth: number = 0; // 播放步长
  private IntervalTimes = 0; // 定时器执行的次数
  private isPauseState = false; // 暂停按钮的状态
  private isResetState = false; // 停止按钮的状态
  private currentText = '';
  // 时间轴显示日期
  private timeSteps: any = [];
  constructor() {
    super();
  }
  @Watch('$store.state.forestFireModule.spreadData', { deep: true })
  private initTimeBar(val: any) {
    const orestAnalysisDatas: any = val;
    this.windArr = orestAnalysisDatas.weatherInfo.windInfo.windArrOld;
    this.startDateTime = orestAnalysisDatas.sourceInfo[0].startTime;
    this.step = Number.parseFloat(orestAnalysisDatas.analysisStepH);
    this.total = Number.parseInt(orestAnalysisDatas.analysisTimeH, 10);
    this.timeReset();
    this.getStartDateTime();
    this.timePlay();
    this.getWeatherBar();
  }
  // 天气预报风场信息条
  private getWeatherBar() {
    const that = this;
    this.weatherbarArr = [];
    if (this.windArr.length > 0) {
      this.windArr.forEach((item: any, index: number) => {
        const obj: any = {
          duration: 0,
          windStartTime: '',
          windType: '',
          windSpeed: '',
          width: 0,
          left: 0,
        };
        obj.duration = Math.floor(item.windLast / 60);
        obj.windStartTime = item.windStartTime;
        obj.windType = item.windType;
        obj.windSpeed = item.windSpeed;
        const duraHours: any = this.getInHours(
          item.windStartTime,
          item.windEndTime,
        );
        const leftHours: any = this.getInHours(
          that.startDateTime,
          item.windStartTime,
        );
        const tempOneHoursWidth: any = (that.timebarWidth + 10) / that.total;
        obj.left = leftHours * tempOneHoursWidth;
        obj.width = duraHours * tempOneHoursWidth;
        if (obj.width > that.timebarWidth + 10) {
          obj.width = that.timebarWidth + 10;
        }
        this.weatherbarArr.push(obj);
      });
    }
  }

  // 关闭时间轴
  private async closeTimeBar() {
    console.log('关闭');
    const component: any = await this.getComponent();
    // this.isShowTimebar = false;
    this.$store.commit('forestFireModule/setShowSpreadTimeBar', false);
    clearInterval(this.timer);
    component.show_hide_firepoint(false);
  }
  private timeReset() {
    // 重置
    this.isResetState = true;
    this.isPauseState = false;
    this.isPlayState = false;
    clearInterval(this.timer);
    this.currentIndex = 0;
    this.IntervalTimes = 0;
    this.sliderWidth = 0;
    this.currentText = this.startDateTime;
    this.timeSteps.map((item: any, index: number) => {
      item.checked = index === 0 ? true : false;
    });
    console.log('重置：', this.currentIndex);
    this.getGisMapPicture(-1);
  }
  private timePause() {
    // 暂停
    this.isPlayState = false;
    this.isPauseState = true;
    this.isResetState = false;
    clearInterval(this.timer);
  }
  // 点击开始/关闭按钮
  private playFn() {
    this.isPlayState = !this.isPlayState;
    if (this.isPlayState) {
      this.autoPlayFn();
    } else {
      clearInterval(this.timer);
    }
  }
  // 播放定时器
  private autoPlayFn() {
    this.timeSteps[0].checked = true;
    this.timer = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex > this.timeSteps.length - 1) {
        this.currentIndex = 0;
        clearInterval(this.timer);
        this.isPlayState = false;
        this.timeSteps.map((item: any) => {
          item.checked = false;
        });
      } else {
        this.timeSteps[this.currentIndex].checked = true;
      }
      this.getGisMapPicture(this.currentIndex - 1);
    }, 2000);
  }
  private timePlay() {
    // 点击播放按钮。
    // 滑块宽度（sliderWidth）===时间总长的宽度（timebarWidth），
    // 清空当前下标，滑块宽度归0，定时器执行次数归1。
    this.isPlayState = true;
    this.isPauseState = false;
    this.isResetState = false;
    if (this.sliderWidth === this.timebarWidth) {
      this.currentIndex = 0;
      this.sliderWidth = 0;
      this.IntervalTimes = 0;
    }
    // this.play();
    this.autoPlayFn();
  }
  private onePlay() {
    // 单独播放第一帧
    // this.currentIndex++;
    // liWidth：计算每个刻度的宽度；
    // sliderWidth：动态滑块的宽度；
    // currentIndex: 当前刻度的下标;
    this.sliderWidth += this.step * this.stepWidth;
    this.currentIndex = this.currentIndex + this.step;
    console.log('定时器：', this.currentIndex);
    this.currentText = this.getHoursTime(this.startDateTime, this.currentIndex);
    console.log('currentText::', this.currentText);
    this.getGisMapPicture(0);
  }
  private play() {
    // 播放时间轴。
    if (this.currentIndex === 0) {
      // 去定时器的延迟，先播放第一帧。
      this.onePlay();
    }
    if (this.isPlayState) {
      this.timer = setInterval(() => {
        if (this.currentIndex >= this.total) {
          this.isPlayState = false;
          clearInterval(this.timer);
          return;
        }
        this.IntervalTimes++;
        this.sliderWidth += this.step * this.stepWidth;
        this.currentIndex = this.currentIndex + this.step;
        this.currentText = this.getHoursTime(
          this.startDateTime,
          this.currentIndex,
        );
        console.log('定时器：', this.currentIndex);
        this.getGisMapPicture(this.IntervalTimes);
      }, 3000);
    } else {
      clearInterval(this.timer);
    }
  }

  private async getGisMapPicture(index: number) {
    this.$store.commit(
      'forestFireModule/setCurrentInfo',
      {
        times: index, //  时间轴下标
      },
    );
    this.getComponent().show_result(index);
  }
  // 时间轴数据初始化
  private getStartDateTime() {
    this.timeSteps = [];
    for (let i = 0; i <= this.total; i += this.step) {
      this.timeSteps.push({
        id: i,
        // value: this.getHoursTime(this.startDateTime, len/2),
        value: i + 'h',
        checked: false,
      });
    }
  }

  private mounted() {
    // 计算时间轴的总宽度与单个格子的宽度
    this.timebarWidth = (this.$refs as any).timebar.clientWidth - 10;
    this.stepWidth = this.timebarWidth / this.total;
    this.currentText = this.startDateTime;
    this.timePlay();
    this.getWeatherBar();
  }
  private created() {
    const orestAnalysisDatas: any = this.$store.state.forestFireModule
      .spreadData;
    this.windArr = orestAnalysisDatas.weatherInfo.windInfo.windArrOld;
    this.startDateTime = orestAnalysisDatas.sourceInfo[0].startTime;
    this.step = Number.parseFloat(orestAnalysisDatas.analysisStepH);
    this.total = Number.parseInt(orestAnalysisDatas.analysisTimeH, 10);
    this.getStartDateTime();
  }
  private destroyed() {
    this.closeTimeBar();
    clearInterval(this.timer);
    this.getGisMapPicture(-1);
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'forestFireComponent',
    );
    return component;
  }
  // 获取当前时间time后的num小时的时间
  private getHoursTime(time: any, num: any) {
    const curHours: any = Number.parseInt(time.slice(11, 13), 10);
    const curDate: any = Number.parseInt(time.slice(8, 10), 10);
    if (num.toString().indexOf('.') > -1) {
      const curMins: any = Number.parseInt(time.slice(14, 16), 10);
      const temps: any = num.toString().split('.');
      let tempHours: any = Number.parseInt(temps[0], 10) + curHours;
      let tempMins: any = curMins + Number.parseInt(temps[1], 10) * 6;
      if (tempMins >= 60) {
        tempHours += 1;
        tempMins -= 60;
        tempMins = tempMins < 10 ? '0' + tempMins : tempMins;
        if (tempHours >= 24) {
          tempHours -= 24;
          tempHours = tempHours < 10 ? '0' + tempHours : tempHours;
          return (
            time.slice(0, 8) +
            (curDate + 1) +
            ' ' +
            tempHours +
            ': ' +
            tempMins +
            time.slice(16)
          );
        }
        return time.slice(0, 11) + tempHours + ': ' + tempMins + time.slice(16);
      } else {
        if (tempHours >= 24) {
          tempHours -= 24;
          tempHours = tempHours < 10 ? '0' + tempHours : tempHours;
          return (
            time.slice(0, 8) +
            (curDate + 1) +
            ' ' +
            tempHours +
            ': ' +
            tempMins +
            time.slice(16)
          );
        }
        return time.slice(0, 11) + tempHours + ': ' + tempMins + time.slice(16);
      }
    }
    let temp: any = curHours + num;
    if (temp >= 24) {
      temp -= 24;
      temp = temp < 10 ? '0' + temp : temp;
      return time.slice(0, 8) + (curDate + 1) + ' ' + temp + time.slice(13);
    }
    return time.slice(0, 11) + temp + time.slice(13);
  }
  private getInHours(time1: any, time2: any) {
    const stime = new Date(time1).getTime();
    const etime = new Date(time2).getTime();
    const usedTime = etime - stime; // 两个时间戳相差的毫秒数
    const days = Math.floor(usedTime / (24 * 3600 * 1000));
    // 计算出小时数
    const leave1 = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));
    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));
    // var time = days + "天"+hours+"时"+minutes+"分";
    return days * 24 + hours + minutes / 60;
  }

  // 点击播放条指定位置
  private nextFn(item: any, index: any) {
    this.isPlayState = false;
    this.timeSteps.map((timeItem: any, itemIndex: number) => {
      timeItem.checked = false;
      if (itemIndex <= index) {
        timeItem.checked = true;
      }
    });
    this.currentIndex = index;
    this.getGisMapPicture(this.currentIndex - 1);
    clearInterval(this.timer);
  }
}
</script>
<style lang="less" scoped>
@import url("./Timerbar.less");
@imgPath: "../../../../assets/img/gisModule/legendPlanel";
@btn: "../../../../assets/img/gisPlot";
.zoomBtn {
  position: absolute;
  display: flex;
  top: 0;
  right: -0;
  
  .narrow {
    position: absolute;
    right: 0;
    top: -3px;
    width: 68px;
    height: 48px;
    cursor: pointer;
    background: url("@{btn}/eventAndTopics_down_normal.png") no-repeat center /
      100% 100%;
    &:hover {
      top: -3px;
      background: url("@{btn}/eventAndTopics_down_highlight.png") no-repeat
        center / 100% 100%;
    }
  }
  .narrow-on {
    position: absolute;
    top: -3px;
    right: 0;
    width: 68px;
    height: 48px;
    cursor: pointer;
    background: url("@{btn}/eventAndTopics_up_normal.png") no-repeat center /
      100% 100%;
    &:hover {
      top: -3px;
      background: url("@{btn}/eventAndTopics_up_highlight.png") no-repeat center /
        100% 100%;
    }
  }
}
.timeSteps {
  width: 100%;
  display: flex;
  margin-top: 30px;
  .closeBtn {
    display: inline-block;
    width: 65px;
    height: 60px;
    background: url("@{imgPath}/legend_player.png") no-repeat 0 0;
    background-size: 100% 100%;
    cursor: pointer;
    margin-top: -8px;
  }
  .openBtn {
    display: inline-block;
    width: 65px;
    height: 60px;
    background: url("@{imgPath}/legend_stop.png") no-repeat 0 0;
    background-size: 100% 100%;
    cursor: pointer;
    margin-top: -8px;
  }
  ul {
    display: flex;
    width: 87%;
    margin: 20px 0 0 35px;
    li {
      width: 48%;
      background: rgba(106, 209, 246, 0.4);
      height: 5px;
      position: relative;
      i {
        display: inline-block;
        width: 22px;
        height: 20px;
        background: url("@{imgPath}/dot02.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -7px;
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
      background: url("@{imgPath}/dot01.png") no-repeat;
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
</style>
