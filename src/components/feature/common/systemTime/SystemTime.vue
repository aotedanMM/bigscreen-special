<template>
  <div class="systemTime">
    <span class="systemTime_YMD">事故已发生</span>
    <span class="systemTime_hms"
      >{{ dateObj.days }}<span> 天 </span>{{ dateObj.hours }}<span> 小时 </span
      >{{ dateObj.minutes }}<span> 分 </span>{{ dateObj.seconds
      }}<span> 秒</span></span
    >
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({})
export default class SystemTime extends Vue {
  private dataTime: string = '';
  private newDate: any = '00 : 00 : 00';
  private nowDate: any = new Date();
  private interval: any = null;
  private eventTimes: any = new Date(
    this.$store.state.eventPushStore.eventLocation.EventTimes,
  );
  private dateObj: any = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };
  // 转换时间
  private formatDuring(mss: any) {
    const daysFC: any = mss / (1000 * 60 * 60 * 24);
    const days: any = parseInt(daysFC, 10);
    const hoursFC: any = (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
    const hours: any = parseInt(hoursFC, 10);
    const minutesFC: any = (mss % (1000 * 60 * 60)) / (1000 * 60);
    const minutes: any = parseInt(minutesFC, 10);
    const secondsFC: any = (mss % (1000 * 60)) / 1000;
    const seconds: any = parseInt(secondsFC, 10);
    this.dateObj = {
      days,
      hours,
      minutes,
      seconds,
    };
  }
  private created() {
    this.interval = setInterval(() => {
      this.nowDate = new Date();
      const leadTime: any = this.nowDate - this.eventTimes;
      this.formatDuring(leadTime);
    }, 1000);
  }
  // 监听为常态还是非常态
  @Watch('$store.state.eventPushStore.eventId')
  private changeNormalState() {
    this.eventTimes = new Date(
      this.$store.state.eventPushStore.eventLocation.EventTimes,
    );
  }
  private beforeDestroy() {
    clearInterval(this.interval);
  }
}
</script>

<style lang="less" scoped>
.systemTime {
  width: 49%;
  height: 98px;
  // padding-left: 60px;
  padding-top: 29px;
  box-sizing: border-box;
  // background: url('../../../../assets/img/decisionSupport/head/head2bg.png')
  //   no-repeat 0 -5px;
  // background-size: 100% 100%;
  &_YMD {
    display: inline-block;
    font-size: 26px;
    vertical-align: middle;
    color: #fff;
    padding-right: 20px;
  }
  &_hms {
    display: inline-block;
    font-size: 26px;
    vertical-align: middle;
    color: #45ff77;
    background-color: black;
    padding: 2px 10px;
    span {
      display: inline-block;
      color: #fff;
      font-size: 22px;
      padding: 4px;
    }
  }
}
</style>
