<template>
  <div class="systemTimeBox">
    <div class="systemTime">
      <span class="systemTime_YMD">距事发</span>
      <span class="systemTime_hms">{{ newDate }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({})
export default class SystemTime extends Vue {private dataTime: string = '';
  private newDate: any = '00 : 00 : 00';
  private nowDate: any = new Date();
  private interval: any = null;
  private eventTimes: any = new Date(
    this.$store.state.eventPushStore.eventLocation.EventTimes,
  );
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
    this.newDate =
      days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分 ' + seconds + ' 秒 ';
  }
  private created() {
    this.interval = setInterval(() => {
      console.log('距事发时间');
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
  private destroyed() {
    clearInterval(this.interval);
  }
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.systemTimeBox {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 40px;
  font-size: 30px;
  z-index: 10;
  border-radius: 9px;
  cursor: pointer;
  .systemTime {
    width: 480px;
    line-height: 50px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    &_YMD {
      display: inline-block;
      vertical-align: middle;
      color: #fff;
      padding-right: 20px;
    }
    &_hms {
      display: inline-block;
      vertical-align: middle;
      color: #45ff77;
    }
  }
}
</style>
