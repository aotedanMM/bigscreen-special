<template>
  <!-- 入库流量过程线 -->
  <!-- 改为未来24小时降雨趋势 -->
  <div class="DischargeCurve">
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
@Component({
  name: 'DischargeCurve',
})
export default class DischargeCurve extends Vue {
  @Prop() public data!: any; // 接受数据
  private echartsObj: any = null; // echarts对象
  private xData: any = [];
  private yData: any = [];
  public mounted() {
    console.log(this.data, 'dddd');
    this.getFutureRainFall();
    // this.renderEcharts();
  }
  private async getFutureRainFall() {
    const res = await reservoirServer.getFutureRainFall(this.data.districtCode);
    console.log(res, 'getFutureRainFall');
    if (res.data.data && res.data.data.length) {
      this.xData = res.data.data.map((v: any) => {
        return v.name.substring(11, 16);
      });
      this.yData = res.data.data.map((v: any) => {
        return v.value || 0;
      });
      this.renderEcharts();
    }
  }
  private renderEcharts() {
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    const option: any = {
      grid: {
        left: '10%',
        right: '2%',
        top: '20%',
        bottom: '7%',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          return (
            '降雨量：' + params[0].value + 'mm<br/>时间：' + params[0].name
          );
        },
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: this.xData,
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
          formatter: (params: any, str: any) => {
            if (this.xData.length % 3 === (str + 1) % 3) {
              return params;
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
        name: '(mm)',
        type: 'value',
        nameTextStyle: {
          padding: [0, 60, 0, 0],
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
        axisLabel: {
          show: true,
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
                color: 'rgba( 72, 217, 161, 0.8 )',
              },
              {
                offset: 1,
                color: 'rgba(0,0,0,0)',
              },
            ]),
          },
          itemStyle: {
            normal: {
              color: 'rgb( 72, 217, 161 )',
              backgroundColor: '#26a0ed',
              lineStyle: {
                color: 'rgb( 72, 217, 161 )',
              },
            },
          },
          symbolSize: 8,
        },
      ],
    };
    this.echartsObj.setOption(option, true);
  }
}
</script>

<style lang="less" scoped>
.DischargeCurve {
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
