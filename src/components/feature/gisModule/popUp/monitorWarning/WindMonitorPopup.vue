<template>
  <!-- 风情弹框 -->
  <div class="water-monitor-popup">
    <div class="title">
      <!-- {{ data.name }} -->
      <span>风情观测站监测趋势</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <div class="echartContent">
        <div class="nodata" v-if="!xData.length">
          <img src="../../../../../assets/img/default/panel/noData.png" />
        </div>
        <div v-else class="echarts" ref="echarts"></div>
      </div>
    </div>

    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { windSituationServer } from '@/api/feature/monitorwarning/installServer';
/**
 * 监测预警
 */
@Component({
  name: 'WindMonitorPopup',
})
export default class WindMonitorPopup extends Vue {
  // echarts对象
  private echartsObj: any = null;
  private data: any = {};
  private xData: any = []; // x轴数据
  private yData: any = []; // y轴数据
  private threshold: any = 13.8; // 阈值
  private scaleMax: any = 15; // 阈值

  public mounted() {
    const self: any = this;
    this.data = self.event.data;
    this.xData = (self.event.data.list || [])
      .map((v: any) => v.dateTime.substring(5, 16))
      .reverse();
    this.yData = (self.event.data.list || [])
      .map((v: any) => {
        if (!v.wd10maxdf && v.wd10maxdf !== 0) {
          v.wd10maxdf = 0;
        }
        if (v.wd10maxdf > this.scaleMax - 2) {
          this.scaleMax = v.wd10maxdf + 2;
        }
        return v.wd10maxdf;
      })
      .reverse();
  }

  // 绘制echarts
  private renderEcharts() {
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    const option: any = {
      title: {
        text: this.data.name + (this.data.name.substring(this.data.name.length - 3) === '观测站' ? '' : '观测站') + '近7天风速变化趋势',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}  <br/> 风速：{c}m/s',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.xData,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 0,
          },
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
          },
          formatter(params: any) {
            let newParamsName = ''; // 最终拼接成的字符串
            const paramsNameNumber = params.length; // 实际标签的个数
            const provideNumber = 6; // 每行能显示的字的个数
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              /** 循环每一行,p表示行 */
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = ''; // 表示每一次截取的字符串
                const start = p * provideNumber; // 开始截取的位置
                const end = start + provideNumber; // 结束截取的位置
                // 此处特殊处理最后一行的索引值
                if (p === rowNumber - 1) {
                  // 最后一次不换行
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + '\n';
                }
                newParamsName += tempStr; // 最终拼成的字符串
              }
            } else {
              newParamsName = params;
            }
            return newParamsName;
          },
        },
      },
      yAxis: {
        max: this.scaleMax,
        name: '风速(m/s)',
        type: 'value',
        nameTextStyle: {
          color: '#fff',
          fontSize: 16,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
          },
        },
        axisLine: {
          lineStyle: {
            width: 0,
          },
        },
      },
      grid: {
        top: '15%',
        bottom: '15%',
      },
      // dataZoom: [
      //   {
      //     show: true,
      //     type: 'slider',
      //     top: '89%',
      //     bottom: '5%',
      //     start: 70,
      //     end: 100,
      //     backgroundColor: 'transparent',
      //     borderColor: '#8ecfdd',
      //     handleStyle: {
      //       color: 'transparent',
      //     },
      //     showDetail: false,
      //     showDataShadow: false,
      //     fillerColor: '#8ecfdd',
      //   },
      // ],
      dataZoom: [
        {
          show: true,
          type: 'slider',
          top: '93%',
          bottom: '5%',
          start:
            100 -
            ((10 / this.xData.length) * 100 > 100
              ? 100
              : (10 / this.xData.length) * 100),
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
      series: [
        {
          data: this.yData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: '#63aaf0',
              lineStyle: {
                color: '#63aaf0',
              },
            },
          },
          markLine: {
            silent: true,
            symbol: ['none', 'arrow'],
            lineStyle: {
              normal: {
                color: '#333',
              },
            },
            data: [
              {
                yAxis: this.threshold,
                lineStyle: {
                  type: 'dashed',
                  color: 'red',
                },
              },
            ],
          },
        },
      ],
    };
    this.echartsObj.setOption(option);
  }
  @Watch('xData', { deep: true })
  private setData() {
    if (!this.xData.length) {
      return false;
    }
    this.$nextTick(() => {
      this.renderEcharts();
    });
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../assets/img/gisModule/PopulationFeverBox';
@titleH: 60px;
.water-monitor-popup {
  width: 780px;
  height: 660px;
  color: #fff;
  overflow: hidden;

  .title {
    padding: 10px 45px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @titleH;
    background: url('@{url}/topbg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    font-size: 20px;
    span {
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: calc(20px * 1.2);
      color: 00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    i {
      position: absolute;
      top: 4px;
      right: 0px;
      width: 90px;
      height: 48px;
      background: url('@{url}/closeBtn.png') no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url('@{url}/closeHover.png') no-repeat;
      }
    }
  }
  .content {
    height: calc(100% - @titleH - 69px);
    padding: 15px 45px;
    box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
  }
  .echartContent {
    box-sizing: border-box;
    // width: 460px;
    height: 100%;
    padding: 0px 10px;
    background: #091120;
    border: 1px solid #2b5461;
    border-radius: 8px;
    color: #8de5eb;
    font-size: 20px;
    .nodata {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .echarts {
    height: 100%;
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
