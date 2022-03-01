<template>
  <!-- 水库详情弹框 -->
  <div class="reservoir-popup">
    <div class="title">
      <span>水库详情</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <div class="nodata" v-if="false">
        <img src="../../../../../../assets/img/default/panel/noData.png" />
      </div>
      <!-- 左侧 -->
      <ReservoirBrief :data="ReservoirDetail"></ReservoirBrief>
      <!-- 中间区域 -->
      <div class="middle">
        <div class="middle-body">
          <!-- <ul class="chartTab" v-if="ReservoirDetail.scale === '大（2）型'">
            <li
              :class="{ active: index === activeIndex }"
              v-for="(item, index) in tabList"
              :key="index"
              @click="chartTab(index)"
            >
              {{ item.name }}
            </li>
          </ul> -->
          <!-- 四个tab页时 -->
          <ul class="chartTab-4">
            <li
              :class="{ active: index === activeIndex }"
              v-for="(item, index) in tabList"
              :key="index"
              @click="chartTab(index)"
            >
              {{ item.name }}
            </li>
          </ul>
          <div class="echartsBox">
            <component :is="tabList[activeIndex].components" :data="ReservoirDetail"></component>
            <!-- <RainfallDistribution
              v-if="activeIndex === 0"
              :data="ReservoirDetail"
            ></RainfallDistribution>
            <DischargeCurve
              :data="ReservoirDetail"
              v-if="activeIndex === 1"
            ></DischargeCurve>
            <StageHydrograph
              :data="ReservoirDetail"
              v-if="activeIndex === 2"
            ></StageHydrograph> -->
          </div>
        </div>
        <div class="middle-bottm">
          <p>
            日期
            <span>{{
              (chartInfo[0].value && chartInfo[0].value.substring(0, 11)) ||
                '--'
            }}</span>
          </p>
          <ul class="middle-information">
            <li v-for="(item, index) in chartInfo" :key="index">
              <span class="name">{{ item.name }}</span>
              <i
                v-if="item.icon && item.value"
                :class="
                  item.icon + (Number(item.value) > 0 ? '-rise' : '-decline')
                "
              ></i>
              <span
                >{{ item.value || item.value === 0 ? item.value : '--'
                }}<span
                  v-if="
                    (item.value && item.value !== '满库') || item.value === 0
                  "
                  >{{ item.unit }}</span
                ></span
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <div
          class="trend"
          :class="[
            { zhang: ReservoirDetail.trend && ReservoirDetail.trend === '涨' },
            { ping: ReservoirDetail.trend && ReservoirDetail.trend === '平' },
            { tui: ReservoirDetail.trend && ReservoirDetail.trend === '落' },
          ]"
        >
          <span>{{ ReservoirDetail.trend }}</span
          ><i></i>
        </div>
        <div class="right-chart">
          <div class="right-chart-title">降水情况</div>
          <Rainfall :id="data.id"></Rainfall>
        </div>
        <div class="right-chart">
          <div class="right-chart-title">当前水位</div>
          <WaterLevel :data="waterLevelData"></WaterLevel>
        </div>
        <div class="right-chart">
          <div class="right-chart-title">当前蓄水量</div>
          <div class="right-chart-body">
            <p v-if="ReservoirDetail.pondAge">
              <span>{{ ReservoirDetail.pondAge }}</span
              >万m³
            </p>
            <p class="zwsj" v-if="!ReservoirDetail.pondAge"></p>
            <!-- <p >
              <span>{{
                ReservoirDetail.pondAge / ReservoirDetail.pondageTotal || 4729
              }}</span
              >万m³
            </p> -->
            <p>
              <!-- 蓄水量除以汛限库容 -->
              <span>{{ capacity || '--' }}</span
              >%
            </p>
            <!-- <p v-if="ReservoirDetail.pondAge > 0">
              <span>{{
                ((ReservoirDetail.pondAge / ReservoirDetail.pondageTotal) * 100).toFixed(2)
              }}</span
              >%
            </p>
            <p v-else>
              <span>4729</span
              >万m³
            </p> -->
            <!-- <p v-if="!ReservoirDetail.totalStorage">
              17.29%
            </p> -->
            <p class="krzt">汛限库容状态</p>
            <p class="krzt"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
import WaterLevel from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/WaterLevel.vue'; // 水位仪表盘
import Rainfall from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/Rainfall.vue'; // 降雨情况
import ReservoirBrief from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirBrief.vue'; // 左侧详情信息
import StageHydrograph from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/StageHydrograph.vue'; // 水位仪表盘
import DischargeCurve from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/DischargeCurve.vue'; // 水位仪表盘
import RainfallDistribution from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/RainfallDistribution.vue'; // 水位仪表盘
// import RainfallTrend from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/RainfallTrend.vue'; // 未来三天降雨量
import ReservoirWaterLevelInfo from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirWaterLevelInfo.vue'; // 水库水位

/**
 * 监测预警
 */
@Component({
  name: 'ReservoirPopup',
  components: {
    WaterLevel,
    Rainfall,
    StageHydrograph,
    DischargeCurve,
    RainfallDistribution,
    ReservoirBrief,
    ReservoirWaterLevelInfo,
  },
})
export default class RainMonitorPopup extends Vue {
  private data: any = {};
  private name: any = '';
  private ReservoirDetail: any = {};
  private ReservoirLast: string = '';
  private capacity: any = 0;
  private tabList: any = [
    // 中间图表切换
    {
      name: '当前状态',
      components: ReservoirWaterLevelInfo,
    },
    {
      name: '降水分布图',
      components: RainfallDistribution,
    },
    {
      name: '未来24h降雨趋势',
      components: DischargeCurve,
    },
    {
      name: '水位过程线',
      components: StageHydrograph,
    },
    // {
    //   name: '入库流量过程线',
    // },
  ];
  private chartInfo: any = [
    // 中间区域下方的表格的数据
    {
      name: '时间',
      value: '',
      code: 'updateTime',
    },
    {
      name: '当前水位',
      value: '',
      unit: '米',
      code: 'waterLevel',
    },
    {
      name: '蓄水量',
      value: '',
      unit: '万m³',
      code: 'pondAge',
    },
    {
      name: '汛限水位',
      value: '',
      unit: '米',
      code: 'fldctrlWaterLevel',
    },
    {
      name: '去年同期蓄水量',
      value: '',
      code: 'reservoirLast',
      unit: '万m³',
    },
    {
      name: '比汛限水位',
      value: '',
      code: '',
      icon: 'level',
      unit: '米',
    },
    {
      name: '比去年同期蓄水量',
      value: '',
      code: 'lastTrend',
      icon: 'trend',
      unit: '万m³',
    },
  ];
  private waterLevelData: any = {
    // 当前水位
    type: 'waterLevel',
    name: '米', // 仪表盘标题
    num: 0, // 仪表盘示数
    fldctrlWaterLevel: 100, // 最大值
  };
  private impoundageData: object = {
    // 当前蓄水量
    type: 'impoundage',
    name: '库容状态',
    num: 0,
    value: 0,
    title: '当前蓄水量',
    unit: '万方',
  };
  private trend: any = {
    涨: '涨',
    不变: '平',
    退: '落',
  };
  private activeIndex: number = 0; // 右侧三个图表的切换
  private playIndex: number = 0;
  private playList: any = []; // 播放的视频
  private created() {
    const self: any = this;
    console.log(self, 'self.event'); // 传入的信息
    this.getReservoirDetail(self.data.id);
  }
  // public mounted() {
  //   const self: any = this;
  //   console.log(self, 'self.event'); // 传入的信息
  //   this.getReservoirDetail(self.data.id);
  // }
  private async getReservoirDetail(id: any) {
    const res = await reservoirServer.getReservoirDetail({ id });
    console.log(res.data.data, 'resresresres');
    this.ReservoirDetail = res.data.data; // 储存返回的数据
    // if (this.ReservoirDetail.scale !== '大（2）型') {
    //   this.tabList.unshift({
    //     name: '当前状态',
    //     components: ReservoirWaterLevelInfo,
    //   });
    // }
    this.ReservoirDetail.flag = true;
    this.ReservoirDetail.display = 'flex';
    this.chartInfo.forEach((item: any) => {
      item.value = this.ReservoirDetail[item.code] || '';
      if (item.name === '比汛限水位') {
        if (
          this.ReservoirDetail.waterLevel &&
          this.ReservoirDetail.fldctrlWaterLevel
        ) {
          item.value = (
            this.ReservoirDetail.waterLevel -
            this.ReservoirDetail.fldctrlWaterLevel
          ).toFixed(2);
        } else {
          item.value = '';
        }
        if (isNaN(item.value)) {
          item.value = '';
        }
      }
    });
    this.capacity = (
      (this.ReservoirDetail.pondAge / this.ReservoirDetail.controlCapacity) *
      100
    ).toFixed(2);
    if (isNaN(this.capacity)) {
      this.capacity = 0;
    }
    this.getReservoirLast(id);
    // this.chartInfo[2].value = this.ReservoirDetail.totalStorage;
    // 库水水势 "涨" "不变" "退"  转为 "涨" "平" "落"
    this.ReservoirDetail.trend = this.trend[this.ReservoirDetail.trend] || '';
    this.waterLevelData.num = res.data.data.waterLevel || 0; // 当前水位
    this.waterLevelData.fldctrlWaterLevel = Math.max(
      res.data.data.fldctrlWaterLevel,
      res.data.data.waterLevel,
    ); // 汛限水位
    // console.log(this.waterLevelData, 'this.waterLevelData.overrunWaterStage');
  }
  // 获取去年同期蓄水量
  private async getReservoirLast(id: string) {
    const res = await reservoirServer.getReservoirLast(id);
    let pondAgeValue = 0;
    let reservoirLastValue = 0;
    this.chartInfo.map((item: any) => {
      if (item.code === 'pondAge') {
        pondAgeValue = item.value;
      }
      if (item.code === 'reservoirLast') {
        item.value = res.data.data;
        reservoirLastValue = res.data.data;
      }
      if (item.code === 'lastTrend') {
        if (!reservoirLastValue) {
          item.value = '';
        } else {
          item.value = (pondAgeValue * 1 - reservoirLastValue * 1).toFixed(2);
        }
      }
    });
  }
  private chartTab(index: number) {
    // 中间四个图切换
    this.activeIndex = index;
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../../assets/img/gisModule/PopulationFeverBox';
@reservations: '../../../../../../assets/img/reservoirPopup';
@icon: '../../../../../../assets/img/gisModule/gisLayerPanel';
@titleH: 60px;
* {
  box-sizing: border-box;
}
.reservoir-popup {
  position: absolute;
  top: -87px;
  left: -73px;
  width: 1920px;
  height: 1000px;
  color: #fff;
  overflow: hidden;
  background: url('@{reservations}/border-bg.png') no-repeat;
  background-size: 100% 100%;
  .title {
    padding: 10px 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @titleH;
    // background: url('@{url}/topbg.png') no-repeat;
    // background-size: 100% 100%;
    box-sizing: border-box;
    font-size: 30px;
    span {
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: 30px;
      color: 00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    i {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 90px;
      height: 48px;
      cursor: pointer;
      background: url('@{url}/closeBtn.png') no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url('@{url}/closeHover.png') no-repeat;
      }
    }
  }
  .content {
    display: flex;
    height: calc(100% - @titleH - 69px);
    padding: 0 10px;
    box-sizing: border-box;
    // background: url('@{url}/centerBg.png') no-repeat;
    // background-size: 100% 100%;
    .nodata {
      width: 100%;
      height: 100%;
      img {
        margin: 20% 0 0 45%;
        transform: translate(-50% -50%);
      }
    }
    .middle {
      margin-top: 5px;
      width: 926px;
      height: 100%;
      background: url('@{reservations}/middle-chart-bg.png') no-repeat;
      background-size: 100% 100%;
      &-body {
        position: relative;
        height: 590px;
        width: 100%;
        .echartsBox {
          width: 100%;
          // height: calc(100% - 30px);
          height: calc(100%);
        }
        .chartTab {
          position: absolute;
          top: 0;
          left: 146px;
          display: flex;
          width: 799px;
          height: 49px;
          line-height: 42px;
          z-index: 3;
          // background-image: url("@{reservations}/tab_bg.png");
          // background-size: 100% 100%;
          &::before {
            content: '';
            position: absolute;
            top: 1px;
            left: 183px;
            width: 46px;
            height: 5px;
            background-image: url('@{reservations}/kuai.png');
            background-size: 100% 100%;
          }
          &::after {
            content: '';
            position: absolute;
            top: 1px;
            right: 351px;
            width: 54px;
            height: 5px;
            background-image: url('@{reservations}/kuai.png');
            background-size: 100% 100%;
          }
          li {
            height: 49px;
            font-size: 20px;
            text-align: center;
            color: #fff;
            cursor: pointer;
            &:nth-child(1) {
              width: 234px;
              background-image: url('@{reservations}/jsfbt-bg.png');
              background-size: 100% 100%;
              &.active,
              &:hover {
                background-image: url('@{reservations}/jsfbt-hover.png');
                background-size: 100% 100%;
              }
            }
            &:nth-child(2) {
              margin-left: -34px;
              width: 232px;
              background-image: url('@{reservations}/wlstjyqs-bg.png');
              background-size: 100% 100%;
              &.active,
              &:hover {
                background-image: url('@{reservations}/wlstjyqs-hover.png');
                background-size: 100% 100%;
              }
            }
            &:nth-child(3) {
              margin-left: -34px;
              width: 234px;
              background-image: url('@{reservations}/swgcx-bg.png');
              background-size: 100% 100%;
              &.active,
              &:hover {
                background-image: url('@{reservations}/swgcx-hover.png');
                background-size: 100% 100%;
              }
            }
          }
        }
        .chartTab-4 {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 3;
          width: calc(799px * 1.1);
          height: 49px;
          display: flex;
          margin-left: 50%;
          transform: translateX(-50%);
          background: url('@{reservations}/tab-bg.png') no-repeat;
          background-size: 100% 100%;
          li {
            width: 202px;
            height: 100%;
            font-size: 20px;
            text-align: center;
            line-height: 38px;
            cursor: pointer;
            &:nth-child(1) {
              margin-left: 11px;
              width: 239px;
              height: 100%;
              &:hover,
              &.active {
                background: url('@{reservations}/jyfbt.png') no-repeat;
                background-size: 100% 100%;
              }
            }
            &:nth-child(2) {
              margin-left: -21px;
              padding-left: 10px;
              width: 217px;
              height: 100%;
              &:hover,
              &.active {
                background: url('@{reservations}/wlstjyqs.png') no-repeat;
                background-size: 100% 100%;
              }
            }
            &:nth-child(3) {
              margin-left: 0px;
              padding-right: 5px;
              width: 202px;
              height: 100%;
              &:hover,
              &.active {
                background: url('@{reservations}/swgcx.png') no-repeat;
                background-size: 100% 100%;
              }
            }
            &:nth-child(4) {
              margin-left: -18px;
              // margin-right: 10px;
              width: 242px;
              height: 100%;
              &:hover,
              &.active {
                background: url('@{reservations}/rkllgcx.png') no-repeat;
                background-size: 100% 100%;
              }
            }
          }
        }
      }
      &-bottm {
        width: 100%;
        height: 190px;
        margin-top: 20px;
        padding: 10px 40px;
        p {
          padding-left: 40px;
          width: 100%;
          height: 47px;
          font-size: 26px;
          color: #fff;
          line-height: 47px;
          background: url('@{reservations}/th-bg.png') no-repeat center / 100%
            100%;
        }
      }
      &-information {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 141px;
        border: 1px solid rgba(39, 163, 242, 0.3);
        li {
          display: flex;
          width: 50%;
          // padding-left: 20px;
          height: 47px;
          .name {
            padding: 0;
            padding-right: 20px;
            width: 228px;
            text-align: right;
            font-size: 26px;
            color: #92edf6;
            height: 100%;
          }
          i {
            margin-top: 12px;
            margin-right: 10px;
          }
          .trend-rise {
            display: inline-block;
            width: 18px;
            height: 20px;
            background: url('@{reservations}/trend-rise.png') no-repeat;
            background-size: 100% 100%;
          }
          .trend-decline {
            display: inline-block;
            width: 14px;
            height: 20px;
            background: url('@{reservations}/trend-decline.png') no-repeat;
            background-size: 100% 100%;
          }
          .level-decline {
            display: inline-block;
            width: 14px;
            height: 20px;
            background: url('@{reservations}/level-decline.png') no-repeat;
            background-size: 100% 100%;
          }
          .level-rise {
            display: inline-block;
            width: 14px;
            height: 20px;
            background: url('@{reservations}/level-rise.png') no-repeat;
            background-size: 100% 100%;
          }
          > span {
            // width: 50%;
            height: 100%;
            line-height: 45px;
            vertical-align: middle;
            font-size: 26px;
            color: #e8f4fe;
          }
          &:nth-child(1) {
            display: none;
            width: 100%;
            background: url('@{reservations}/th-bg.png') no-repeat center / 100%
              100%;
          }
          &:nth-child(4n -2),
          &:nth-child(4n -1) {
            background-color: rgb(14, 28, 51, 0.4);
          }
          &:nth-child(4n),
          &:nth-child(4n + 1) {
            background-color: rgba(100, 219, 251, 0.1);
          }
        }
      }
      // &-videoBox {
      //     position: relative;
      //     display: flex;
      //     padding: 20px 160px;
      //     height: 280px;
      //     width: 100%;
      //     // background: red;
      //     .viewing {
      //         display: flex;
      //         width: 100%;
      //         height: 100%;
      //         overflow: hidden;
      //         &-item {
      //             position: relative;
      //             margin-right: 55px;
      //             height: 100%;
      //             width: 275px;
      //             video {
      //                 width: 100%;
      //                 height: 100%;
      //             }
      //             &:hover {
      //                 .topBar {
      //                 display: block;
      //                 }
      //             }
      //             &:nth-child(2) {
      //                 margin-right: 0;
      //             }
      //             .topBar {
      //                 width: 98px;
      //                 height: 52px;
      //                 display: none;
      //                 position: absolute;
      //                 right: -5px;
      //                 top: -4px;
      //                 z-index: 999;
      //                 background: url('@{icon}/bg_icon.png') no-repeat center / 100% 100%;
      //                 .closeBtn {
      //                     width: 18px;
      //                     height: 18px;
      //                     cursor: pointer;
      //                     background: url('@{icon}/qx_btn.png') no-repeat center / 100% 100%;
      //                     display: inline-block;
      //                     margin: 17px 0px 0px 20px;
      //                     }
      //                 .amplifier {
      //                     width: 18px;
      //                     height: 18px;
      //                     cursor: pointer;
      //                     background: url('@{icon}/fd_btn.png') no-repeat center / 100% 100%;
      //                     display: inline-block;
      //                     margin: 17px 0px 0px 20px;
      //                 }
      //                 .shrink {
      //                     width: 18px;
      //                     height: 18px;
      //                     cursor: pointer;
      //                     background: url('@{icon}/sx_btn.png') no-repeat center / 100% 100%;
      //                     display: inline-block;
      //                     margin: 17px 0px 0px 20px;
      //                 }
      //             }
      //             .text {
      //                 font-size: 16px;
      //                 color: #fff;
      //                 width: 100%;
      //                 height: 100%;
      //                 display: flex;
      //                 align-items: center;
      //                 justify-content: center;
      //                 border: 1px solid #059ece;
      //             }
      //         }
      //     }
      //     &-leftBtn {
      //         position: absolute;
      //         top: 105px;
      //         left: 98px;
      //         width: 24px;
      //         height: 71px;
      //         background: url('@{reservations}/video_tabBtn.png') no-repeat;
      //         background-size: 100% 100%;
      //         transform: rotate(180deg);
      //         &:hover {
      //             background: url('@{reservations}/video_tabBtn_hover.png') no-repeat;
      //             background-size: 100% 100%;
      //         }
      //     }
      //     &-rightBtn {
      //         position: absolute;
      //         top: 105px;
      //         right: 98px;
      //         width: 24px;
      //         height: 71px;
      //         background: url('@{reservations}/video_tabBtn.png') no-repeat;
      //         background-size: 100% 100%;
      //         // transform: rotate(180deg);
      //         &:hover {
      //             background: url('@{reservations}/video_tabBtn_hover.png') no-repeat;
      //             background-size: 100% 100%;
      //         }
      //     }
      // }
    }
    .right {
      width: 460px;
      height: 100%;
      padding-left: 20px;
      background: url('@{reservations}/right-bg.png') no-repeat;
      background-position: left center;
      .trend {
        position: relative;
        // margin-top: 30px;
        padding-top: 40px;
        padding-left: 335px;
        width: 434px;
        height: 100px;
        font-size: 28px;
        font-weight: bold;
        background: url('@{reservations}/ksss.png') no-repeat;
        background-size: 100% 100%;
        span {
          position: absolute;
          top: 39px;
          right: 64px;
          width: 100px;
          height: 35px;
          text-align: right;
          font-size: 28px;
          font-weight: bold;
        }
        i {
          position: absolute;
          top: 36px;
          right: 30px;
          width: 27px;
          height: 54px;
          // background-size: 100% 100%;
          background-position: center center;
        }
        &.zhang {
          color: #f44f4f;
          i {
            top: 44px;
            background: url('@{reservations}/zhang.png') no-repeat;
          }
        }
        &.ping {
          color: #67e1fb;
          i {
            top: 32px;
            background: url('@{reservations}/ping.png') no-repeat;
          }
        }
        &.tui {
          color: #4cde9b;
          i {
            top: 38px;
            background: url('@{reservations}/tui.png') no-repeat;
          }
        }
      }
      &-chart {
        margin-top: 15px;
        &-title {
          padding-left: 20px;
          font-size: 28px;
          color: #67e1fb;
          line-height: 30px;
        }
        &-body {
          position: relative;
          margin-top: 14px;
          width: 100%;
          height: 196px;
          background: url('@{reservations}/waterDrop.png') no-repeat;
          // background-size: 100% 100%;
          background-position: center center;
          overflow: hidden;
          .zwsj {
            position: absolute;
            top: 105px;
            left: 155px;
            text-align: center;
          }
          p {
            font-size: 18px;
            color: #e8f4fe;
            span {
              margin-right: 5px;
              font-size: 32px;
              font-family: 'Impact';
              color: #fbee50;
            }
            &:nth-child(1) {
              margin-top: 18px;
              padding-left: 30px;
            }
            &:nth-child(2) {
              position: absolute;
              top: 105px;
              left: 305px;
            }
            &:nth-child(3) {
              position: absolute;
              top: 135px;
              left: 305px;
            }
          }
          .krzt {
            font-size: 22px;
            color: #e5f8fd;
          }
        }
        width: 440px;
        height: 242px;
        background: url('@{reservations}/right-chart-bg.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  //   .bottom {
  //     width: 100%;
  //     height: 49px;
  //     background: url('@{url}/botBg-.png') no-repeat;
  //     background-size: 100% 100%;
  //   }
}
</style>
