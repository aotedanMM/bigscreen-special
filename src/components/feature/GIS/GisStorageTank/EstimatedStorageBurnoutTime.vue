/** author: chenyu time:2020-03-25 **/
<template>
  <div class="EstimatedStorageBurnout">
    <div class="countDown" v-show="leftd !== ''">
      <p class="text">预计储油燃尽时间</p>
      <div class="countDownDiv">
        <i class="cg"></i>
        <div class="all">
            <div class="countDownNUM">{{ leftd }}</div>
          <div class="countDownWORD">{{ BurningTime }}</div>
        </div>
      </div>
    </div>
    <div class="countDown" v-show="leftd1 !== ''">
      <p class="text">预计水层沸溢时间</p>
      <div class="countDownDiv">
        <i class="sc"></i>
        <div class="all">
            <div class="countDownNUM">{{ leftd1 }}</div>
            <div class="countDownWORD">{{ BurningTime1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisStorageTankServer } from '@/api/installServer';
@Component({
  name: 'EstimatedStorageBurnoutTime',
  components: {},
})
export default class EstimatedStorageBurnoutTime extends Vue {
  private msg: any = '预计储油燃尽时间';
  private leftd: any = '';
  private leftd1: any = '';
  private BurningTime: any = '';
  private BurningTime1: any = '';
  private lefttime: any = '';
  private lefttime1: any = '';
  private timesetInterval: any = '';
  private timesetInterval2: any = '';
  private FnLeftTimer(): any {
    let returnMin: any = this.lefttime;
    this.timesetInterval = setInterval(() => {
      returnMin = returnMin - 1000;
      if (returnMin >= 0) {
        const leftd = Math.floor(returnMin / (1000 * 60 * 60 * 24));  // 计算天数
        const lefth = Math.floor(returnMin / (1000 * 60 * 60) % 24);  // 计算小时数
        const leftm = Math.floor(returnMin / (1000 * 60) % 60);  // 计算分钟数
        const lefts = Math.floor(returnMin / 1000 % 60);  // 计算秒数
        this.leftd = leftd + '天';
        this.BurningTime = lefth + ':' + leftm + ':' + lefts;
      } else {
        this.BurningTime = 0;
        this.leftd = '0天';
      }
    }, 1000);
  }

  private FnLeftTimer1(): any {
    let returnMin1: any = this.lefttime1;
    this.timesetInterval2 = setInterval(() => {
      returnMin1 = returnMin1 - 1000;
      if (returnMin1 >= 0) {
        const leftd1 = Math.floor(returnMin1 / (1000 * 60 * 60 * 24));  // 计算天数
        const lefth1 = Math.floor(returnMin1 / (1000 * 60 * 60) % 24);  // 计算小时数
        const leftm1 = Math.floor(returnMin1 / (1000 * 60) % 60);  // 计算分钟数
        const lefts1 = Math.floor(returnMin1 / 1000 % 60);  // 计算秒数
        this.leftd1 = leftd1 + '天';
        this.BurningTime1 = lefth1 + ':' + leftm1 + ':' + lefts1;
      } else {
        this.BurningTime1 = 0;
        this.leftd1 = '0天';
      }
    }, 1000);
  }

  private FnGetCaption(obj: any, state: any): any {
    const index = obj.lastIndexOf('\(');
    if (state === 0) {
      obj = obj.substring(0, index);
    } else {
      obj = obj.substring(index + 1, obj.length);
    }
    return obj;
  }

  private created() {
    this.messsageBus.on('TankFireModel', (data: any) => {
      const timer = data.data.Service_Info.Parms_Return.Fire_Info_1.BurningTime;
      const ReturnTimer = this.FnGetCaption(timer, 0) * 3600000; // Number(this.FnGetCaption(timer, 0));
      this.lefttime = ReturnTimer;
      const leftd = Math.floor(this.lefttime / (1000 * 60 * 60 * 24));  // 计算天数
      const lefth = Math.floor(this.lefttime / (1000 * 60 * 60) % 24);  // 计算小时数
      const leftm = Math.floor(this.lefttime / (1000 * 60) % 60);  // 计算分钟数
      const lefts = Math.floor(this.lefttime / 1000 % 60);  // 计算秒数
      this.leftd = leftd + '天';
      this.BurningTime = lefth + ':' + leftm + ':' + lefts;
      window.clearInterval(this.timesetInterval);
      this.FnLeftTimer();

      this.lefttime1 = 10 * 3600000;
      const leftd1 = Math.floor(this.lefttime1 / (1000 * 60 * 60 * 24));  // 计算天数
      const lefth1 = Math.floor(this.lefttime1 / (1000 * 60 * 60) % 24);  // 计算小时数
      const leftm1 = Math.floor(this.lefttime1 / (1000 * 60) % 60);  // 计算分钟数
      const lefts1 = Math.floor(this.lefttime1 / 1000 % 60);  // 计算秒数
      this.leftd1 = leftd1 + '天';
      this.BurningTime1 = lefth1 + ':' + leftm1 + ':' + lefts1;
      window.clearInterval(this.timesetInterval2);
      this.FnLeftTimer1();
    });
  }
}
</script>
<style scoped lang="less">
.EstimatedStorageBurnout {
  // width: 246px;
  // height: 288px;
  // background: url('../../../../assets/img/gisModule/GisStorageTank/countdown.png');
  // background-position: 0px 0px;
  display:flex;
  align-items:center;
}
.countDown {
  width: 100%;
  height: 96px;
  width:237px;
  height:173px;
  background: url('../../../../assets/img/gisModule/GisStorageTank/BG.png') no-repeat center center;
  background-size: 100% 100%;
  .text{
    color:yellow;
    font-size:22px;
    font-weight:bold;
    text-align:center;
    line-height:46px;
    margin-top: 22px;
  }
}
.countDownDiv {
  // width: 130px;
  height: 85px;
  display: flex;
  align-items: center;
  padding-left: 48px;
  i{
    display: inline-block;
    width: 54px;
    height: 63px;
  }
  .cg{
    background: url('../../../../assets/img/gisModule/GisStorageTank/cyg.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .sc{
    background: url('../../../../assets/img/gisModule/GisStorageTank/weater.png') no-repeat center center;
    background-size: 100% 100%;
  }
  .all{
    width: 130px;
  }
}
.countDownNUM {
  width: 100%;
  font-size: 24px;
  color: #fff72f;
  font-weight: bolder;
  text-align: center;
  margin-top: 6px;
}
.countDownWORD {
  width: 100%;
  font-size: 24px;
  color: #fff72f;
  font-weight: bolder;
  text-align: center;
}
</style>
