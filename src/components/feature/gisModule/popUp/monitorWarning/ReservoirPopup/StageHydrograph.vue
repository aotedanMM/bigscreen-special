<template>
  <!-- 水位过程线 -->
  <div class="StageHydrograph">
    <!-- <div class="tab">
      <span :class="{ active: activeIndex === 0 }" @click="tab(1)">24h</span>
      <span :class="{ active: activeIndex === 1 }" @click="tab(0)">近30天</span>
    </div> -->
    <div class="echarts" v-if="activeIndex == 0" ref="echarts"></div>
    <div class="echarts" v-if="activeIndex == 1" ref="echarts"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
@Component({
  name: 'StageHydrograph',
})
export default class StageHydrograph extends Vue {
  @Prop() public data!: any; // 接受数据
  private echartsObj: any = null; // echarts对象
  private activeIndex: number = 0; // 0 : 24小时  1： 30天
  private dataList: any = [];
  private xData: any = [];
  private yData: any = [];
  public mounted() {
    // console.log(this.data, 'dddd');
    // this.getwaterLevelInfo(1);
    // this.renderEcharts();
    this.getwaterLevelInfoTwo();
  }
  private async getwaterLevelInfo(type: any) {
    const res = await reservoirServer.getwaterLevelInfo({
      id: this.data.id,
      type,
    });
    // console.log(res, '水位过程线');
    this.dataList = res.data.data.dataList;
    if (type === 1) {
      this.xData = this.dataList
        .map((item: any) => {
          return item.dateTime.substring(10, 16);
        })
        .reverse();
    } else {
      this.xData = this.dataList
        .map((item: any) => {
          return item.dateTime.substring(0, 11);
        })
        .reverse();
    }
    this.yData = this.dataList
      .map((item: any) => {
        return item.outwater.toFixed(2);
      })
      .reverse();
    // console.log(this.xData, this.yData, 'xData');
    this.$nextTick(() => {
      this.renderEcharts(1);
    });

    this.$forceUpdate(); // 强制刷新页面效果
  }
  private async getwaterLevelInfoTwo() {
    const res = await reservoirServer.getwaterLevelInfoTwo({
      id: this.data.id,
    });
    this.dataList = res.data.data.dataList;
    this.xData = this.dataList
      .map((item: any) => {
        return item.dateTime.substring(0, 11);
      })
      .reverse();
    this.yData = this.dataList
      .map((item: any) => {
        return item.outwater.toFixed(2);
      })
      .reverse();
    // console.log(this.xData, this.yData, 'xData');
    // this.$forceUpdate(); // 强制刷新页面效果
    this.$nextTick(() => {
      this.renderEcharts(2);
    });
  }
  private renderEcharts(index: any) {
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    // const min = Math.min(...this.yData)
    const start: any =
      100 - (12 / this.xData.length) * 100 > 0
        ? Math.ceil(100 - (12 / this.xData.length) * 100)
        : 0;
    const option: any = {
      grid: {
        left: '10%',
        right: '10%',
        // top: '25%',
        top: '20%',
        bottom: '10%',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          return '水位：' + params[0].value + 'm<br/>时间：' + params[0].name;
        },
      },
      dataZoom: [
        {
          show: true,
          type: 'slider',
          top: '98%',
          bottom: '0%',
          // start: 75,
          start: start + 1,
          end: 100,
          backgroundColor: '#04080f',
          borderColor: '#04080f',
          borderRadius: '5',
          handleStyle: {
            color: 'transparent',
          },
          showDetail: false,
          showDataShadow: false,
          fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            {
              offset: 0,
              color: '#6be7d5',
            },
            {
              offset: 1,
              color: '#367cc6',
            },
          ]),
        },
      ],
      xAxis: {
        type: 'category',
        // boundaryGap: true,
        data: this.xData,
        axisLine: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          formatter: (v: any, str: any) => {
            if (
              Math.ceil(this.xData.length * (100 - start) / 100) % (index + 1) ===
              (str + 1) % (index + 1)
            ) {
              return v;
            } else {
              return;
            }
          },
          fontSize: 26,
          textStyle: {
            color: '#ccd6e7',
          },
        },
      },
      yAxis: {
        name: '(m)',
        type: 'value',
        // min: min,
        max: Math.ceil(
          Math.max(...this.yData, this.data.fldctrlWaterLevel) * 1.05,
        ),
        nameTextStyle: {
          padding: [0, 50, 0, 0],
          fontSize: 26,
          color: '#ccd6e7',
        },
        splitLine: {
          // 网格线
          show: true,
          lineStyle: {
            color: '#4b5463',
          },
        },
        position: [0, 0, 0, 100],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ccc',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          fontSize: 26,
          textStyle: {
            color: '#ccd6e7',
          },
        },
      },
      series: [
        {
          data: this.yData,
          padding: [0, 0, 0, 20],
          type: 'line',
          symbol: 'circle',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0,186,255,0.8)',
              },
              {
                offset: 1,
                color: 'rgba(0,0,0,0)',
              },
            ]),
          },
          itemStyle: {
            normal: {
              color: '#0772b6',
              backgroundColor: '#26a0ed',
              lineStyle: {
                color: '#26a0ed',
              },
            },
          },
          lineStyle: {
            color: '#26a0ed',
          },
          symbolSize: 8,
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: {
              normal: {
                color: '#333',
              },
            },
            label: {
              position: 'end',
              distance: [-60, 10],
              formatter: '汛限水位\n' + this.data.fldctrlWaterLevel + 'mm',
              fontSize: 16,
            },
            data: [
              {
                name: '汛限水位',
                yAxis: this.data.fldctrlWaterLevel,
                lineStyle: {
                  normal: {
                    color: 'red', // 这儿设置安全基线颜色
                  },
                },
              },
            ],
          },
        },
      ],
    };
    this.echartsObj.setOption(option, true);
  }
  private tab(index: number) {
    console.log(index, 'index');
    if (index === 0) {
      this.activeIndex = 1;
      this.getwaterLevelInfoTwo();
    } else {
      this.activeIndex = 0;
      this.getwaterLevelInfo(1);
    }
  }
}
</script>

<style lang="less" scoped>
.StageHydrograph {
  position: relative;
  width: 100%;
  height: 100%;
  .tab {
    position: absolute;
    // margin-top: 20px;
    // margin-left: 715px;
    top: 70px;
    left: 715px;
    z-index: 2;
    display: flex;
    width: 196px;
    height: 38px;
    cursor: pointer;
    span {
      width: 98px;
      height: 38px;
      font-size: 20px;
      color: #64d4f8;
      text-align: center;
      line-height: 38px;
      border: 1px solid #2e5a77;
      // background: url('../../../../../../assets/img/reservoirPopup/water-tab-left.png') no-repeat;
      // background-size: 100% 100%;
      &:nth-child(1) {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        &:hover,
        &.active {
          width: 100px;
          height: 40px;
          color: #e8f4fe;
          line-height: 40px;
          background: url('../../../../../../assets/img/reservoirPopup/water-tab-left-hover.png')
            no-repeat;
          background-size: 100% 100%;
          border: none;
          border-radius: 0;
        }
      }

      &:nth-child(2) {
        margin-left: -1px;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        &:hover,
        &.active {
          width: 100px;
          height: 40px;
          color: #e8f4fe;
          line-height: 40px;
          background: url('../../../../../../assets/img/reservoirPopup/water-tab-right-hover.png')
            no-repeat;
          background-size: 100% 100%;
          border: none;
          border-radius: 0;
        }
      }
    }
  }
  .echarts {
    width: 100%;
    height: calc(100%);
    div {
      z-index: 1;
    }
  }
}
</style>
