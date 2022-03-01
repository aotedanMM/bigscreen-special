<template>
  <div>
    <bar-and-line-common :id="id" :option="option" :flag="flag" v-if="flag"></bar-and-line-common>
      <div :flag="!flag" class="nothingData--bg" v-else></div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import BarAndLineCommon from '@/components/feature/common/weatherDisasterArea/weatherBarAndLine/BarAndLineCommon.vue';
import {
  IchartDatas,
  Ioption,
} from '@/interface/feature/common/weather/WeatherBarAndLine.interface.ts';
// 天气demo
@Component({
  components: {
    BarAndLineCommon,
  },
})
export default class BarAndLineChart extends Vue {
  // 气温和降水趋势图  没有数据
  @Prop() private JXYBData: any;
  private flag: boolean = false;
  private chartDatas: any = {
    xData: [
      '03:00',
      '06:00',
      '09:00',
      '12:00',
      '15:00',
      '18:00',
      '21:00',
      '00:00',
    ],
    yData1: [16, 25, 26, 22, 24, 26, 24, 18],
    yData2: [0.3, 0.5, 0.8, 0.4, 0.7, 0.5, 0.6, 0.4],
  };

  private id: string = 'BarAndLineContainer';
  private option: Ioption = {
    grid: {
      top: '20%',
      left: '6%',
      right: '6%',
      bottom: '12%',
      containLabel: false,
    },
    legend: {
      data: ['气温', '降水量'],
      top: '-2%',
      textStyle: {
        color: '#fff',
        fontSize: 18,
      },
    },
    xAxis: [
      {
        type: 'category',
        show: true,
        boundaryGap: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff',
          },
        },
        axisTick: {
          show: true,
          inside: false,
          length: 5,
          lineStyle: {
            color: '#fff',
          },
        },
        axisLabel: {
          show: true,
          margin: 5,
          color: '#fff',
          fontSize: 18,
        },
        data: this.chartDatas.xData,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '气温(℃)',
        nameGap: 20,
        nameTextStyle: {
          color: '#50c6fc',
          fontSize: 18,
        },

        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          margin: 8,
          color: '#50c6fc',
          fontSize: 18,
        },
      },
      {
        type: 'value',
        name: '降水量(mm)',
        nameGap: 20,
        nameTextStyle: {
          color: '#6dd2d4',
          fontSize: 18,
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          margin: 8,
          color: '#6dd2d4',
          fontSize: 18,
        },
      },
    ],
    series: [
      {
        name: '气温',
        type: 'line',
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 10,
        smooth: true,
        itemStyle: {
          color: '#fbea4e',
        },
        label: {
          show: true,
          position: 'top',
          distance: 10,
          fontSize: 18,
          color: '#fbea4e',
        },
        data: this.chartDatas.yData1,
      },
      {
        name: '降水量',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: '20px',
        itemStyle: {
          color: '#6dd2d4',
        },
        label: {
          show: true,
          position: 'top',
          distance: 10,
          fontSize: 18,
          color: '#6dd2d4',
        },
        data: this.chartDatas.yData2,
      },
    ],
  };
    @Watch('JXYBData')
  private FnJXYBData(): void {
    // this.chartDatas.yData1 = this.JXYBData;
    this.$set(this.chartDatas, 'yData1', this.JXYBData);
    this.$set(this.option.series[0], 'data', this.chartDatas.yData1);
    this.flag = false;
  }
}
</script>
<style scoped lang="less">
.noData{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 17px;
}
    .nothingData--bg{
        height: 200px;
    }
</style>
