<template>
  <div class="ReservoirWaterLevelInfo">
    <!-- 水库水位信息 -->
    <div class="ReservoirWaterLevelInfo-body">
      <p>
        距离汛限水位:
        <span>{{ currentData.distanceWaterLevel }}</span
        >米
      </p>
      <p>
        1h降水量:
        <span>{{ currentData.sum1h || 0 }}</span
        >mm
      </p>
      <p>
        3h降水量:
        <span>{{ currentData.sum3h || 0 }}</span
        >mm
      </p>
      <p>
        24h降水量:
        <span>{{ currentData.sum24h || 0 }}</span
        >mm
      </p>
      <p>
        库水水势:
        <span
          :class="[
            { zhang: currentData.trend === '涨' },
            { ping: currentData.trend === '平' },
            { luo: currentData.trend === '落' },
          ]"
        >
          {{ currentData.trend }}
          <i></i>
        </span>
      </p>
      <p>
        更新时间：
        <span>{{ currentData.updateTime || '--' }}</span>
      </p>
      <div
        :class="['damInfo', { overrun: currentData.distanceWaterLevel < 0 }]"
      >
        <div class="damInfo-left">
          <p>当前水位</p>
          <p>
            <span class="water-level">{{
              currentData.waterLevel || currentData.waterLevel === 0
                ? currentData.waterLevel
                : '--'
            }}</span
            >米
          </p>
          <p>当前蓄水量</p>
          <p>
            <span class="water-storage">{{
              currentData.pondAge || currentData.pondAge === 0
                ? currentData.pondAge
                : '--'
            }}</span
            >万m³
          </p>
        </div>
        <div class="damInfo-right">
          <p>汛限水位</p>
          <p>
            <span class="water-level">{{
              currentData.fldctrlWaterLevel ||
              currentData.fldctrlWaterLevel === 0
                ? currentData.fldctrlWaterLevel
                : '--'
            }}</span
            >米
          </p>
        </div>
        <div class="damInfo-bottom">
          <p>
            总库容：
            <span class="water-storage">{{
              currentData.pondageTotal || currentData.pondageTotal === 0
                ? currentData.pondageTotal
                : '--'
            }}</span
            >万m³
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
@Component({
  name: 'ReservoirWaterLevelInfo',
  components: {},
})
export default class ReservoirWaterLevelInfo extends Vue {
  @Prop() public data!: any; // 接受数据
  private currentData: any = {};
  /**
   * 获取水库降雨量
   */
  @Watch('data.id', { immediate: true })
  private async statRainfallInfo() {
    if (!this.data.id) {
      return;
    }
    this.currentData = { ...this.data };
    const distanceWaterLevel =
      this.data.fldctrlWaterLevel && this.data.waterLevel
        ? (this.data.fldctrlWaterLevel - this.data.waterLevel).toFixed(2)
        : '--';
    this.$set(this.currentData, 'distanceWaterLevel', distanceWaterLevel);
    const res = await reservoirServer.statRainfallInfo({ id: this.data.id });
    this.$set(this.currentData, 'sum1h', res.data.sum1h || 0);
    this.$set(this.currentData, 'sum3h', res.data.sum3h || 0);
    this.$set(this.currentData, 'sum24h', res.data.sum24h || 0);
  }
}
</script>

<style lang="less" scoped>
@reservations: '../../../../../../assets/img/reservoirPopup';
.ReservoirWaterLevelInfo {
  padding-top: 50px;
  width: 100%;
  height: 100%;
  .ReservoirWaterLevelInfo-body {
    position: relative;
    padding: 0 35px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    // background: url('@{reservations}/reservoir-bg.png') no-repeat;
    // background-size: 100% 100%;
    > p {
      margin-bottom: 10px;
      text-align: left;
      line-height: 40px;
      font-size: 26px;
      color: #c3e9ff;
      &:nth-child(1) {
        margin-top: 145px;
        span {
          color: #fdef4f;
        }
      }
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        span {
          color: #3de5ff;
        }
      }
      &:nth-child(6) {
        margin-top: 67px;
      }
      span {
        position: relative;
        margin-right: 5px;
        font-family: Impact;
        font-size: 26px;
        i {
          position: absolute;
          top: 2px;
          right: -13px;
          width: 9px;
          height: 5px;
        }
      }
      .zhang {
        color: #ec5b39;
        i {
          background: url('@{reservations}/min-zhang.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .ping {
        color: #3b9fe5;
        i {
          background: url('@{reservations}/min-ping.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .luo {
        color: #3be5b7;
        i {
          background: url('@{reservations}/min-luo.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .damInfo {
      position: absolute;
      bottom: -45px;
      right: 0;
      // width: 354px;
      // height: 340px;
      width: calc(354px * 1.4);
      height: calc(340px * 1.4);
      background: url('@{reservations}/shuiba-1.png') no-repeat;
      background-size: 100% 100%;
      &.overrun {
        background: url('@{reservations}/shuiba-2.png') no-repeat;
        background-size: 100% 100%;
        .damInfo-left {
          top: 35px;
        }
        .damInfo-right {
          top: 140px;
        }
      }
      &-left,
      &-right,
      &-bottom {
        box-sizing: border-box;
        p {
          text-align: left;
          line-height: 32px;
          font-size: 22px;
          color: #fff;
          white-space:nowrap span {
            margin-right: 5px;
            font-size: 24px;
            font-family: Impact;
            vertical-align: bottom;
          }
          .water-level {
            margin-right: 5px;
            color: #fdef4f;
          }
          .water-storage {
            margin-right: 5px;
            color: #3de5ff;
          }
        }
      }
      &-left {
        position: absolute;
        top: 108px;
        right: 472px;
        padding: 8px 12px;
        min-width: calc(132px * 1.1);
        height: calc(122px * 1.2);
        background: url('@{reservations}/dqsw-bg.png') no-repeat;
        background-size: 100% 100%;
      }
      &-right {
        position: absolute;
        top: 68px;
        left: 314px;
        padding: 8px 12px;
        min-width: calc(99px * 1.3);
        height: calc(63px * 1.3);
        background: url('@{reservations}/xxsw-bg.png') no-repeat;
        background-size: 100% 100%;
      }
      &-bottom {
        position: absolute;
        top: 350px;
        left: 136px;
        padding: 0 8px;
        min-width: 220px;
        height: 36px;
        background: url('@{reservations}/zkr-bg.png') no-repeat;
        background-size: 100% 100%;
        p {
          text-align: center !important;
          line-height: 36px;
        }
      }
    }
  }
}
</style>
