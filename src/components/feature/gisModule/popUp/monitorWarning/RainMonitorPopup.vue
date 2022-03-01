<template>
  <!-- 雨情弹框 -->
  <div class="water-monitor-popup">
    <div class="title">
      <span>{{ data.name }}</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <div class="content-title">
        <span>当前降水：{{ currentData }}mm</span>
        <span>24H累计降水量：{{ data.prec24h ? data.prec24h : '- -' }}mm</span>
        <span>更新时间：{{
            data.updateTime ? data.updateTime.substring(5, 16) : '- -'
          }}</span>
      </div>
      <div class="echartContent">
        <div class="nodata"
             v-if="!xData.length">
          <img src="../../../../../assets/img/default/panel/noData.png" />
        </div>
        <div v-else
             class="echarts"
             ref="echarts"></div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 监测预警
 */
@Component({
  name: 'RainMonitorPopup',
})
export default class RainMonitorPopup extends Vue {
  // echarts对象
  private echartsObj: any = null;
  private data: any = {};
  private xData: any = []; // x轴数据
  private yData: any = []; // y轴数据
  private currentData: string = '0';
  private addUpData: any = []; // 24小时累计降水
  private max: any = 1;

  public mounted() {
    const self: any = this;
    console.log(self, 'self.event'); // 传入的信息
    this.data = self.event.data;
    this.xData = (self.event.data.list || [])
      .map((v: any) => v.dateTime.substring(5, 16))
      .reverse();
    this.yData = (self.event.data.list || [])
      .map((v: any) => {
        if (!v.hourrf || isNaN(v.hourrf)) {
          v.hourrf = 0;
        }
        if (this.max < v.hourrf) {
          this.max = Math.ceil(v.hourrf);
        }
        return v.hourrf;
      })
      .reverse();
    this.currentData = this.yData[this.yData.length - 1] ? (this.yData[this.yData.length - 1] * 1).toFixed(1) === 'NaN' ? '- -' : (this.yData[this.yData.length - 1] * 1).toFixed(1) : '- -';
    const num: number = this.yData.length - 25;
    let total: number = 0;
    this.addUpData = this.yData.map((item: any, index: any) => {
      if (index > num) {
        total += item * 1;
        return (item = total);
      } else {
        return (item = null);
      }
    });
  }

  // 绘制echarts
  private renderEcharts() {
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    const option: any = {
      title: {
        text: '近7天监测趋势',
        left: '20',
        top: '10',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: '26',
        },
      },
      tooltip: {
        trigger: 'axis',
        // formatter: '累计降水<br>' + '{c}' + 'mm',
        formatter(params: any) {
          let str = '';
          str = params[0].name;
          params.forEach((v: any) => {
            str =
              str +
              '<br >' +
              v.seriesName +
              '：' +
              Number(v.value).toFixed(1) +
              'mm';
          });
          return str;
          // const arr = params.filter((v:any) => {
          //   return v.seriesIndex === 1;
          // })
          // if (arr && arr.length ) {
          //   return '累计降水<br>' + arr[0].value.toFixed(1) + 'mm';
          // }
        },
      },
      legend: {
        data: ['降水', '累计降水'],
        top: '10',
        right: '130',
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: '24',
        },
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
          //   interval: 2,
          //   rotate: 25,
          margin: 20,
          fontSize: 22,
          textStyle: {
            color: '#fff',
          },
          formatter(params: any) {
            const date = params.split(' ');
            const str = date[0] + '\n' + date[1];
            return str;

            // let newParamsName = ''; // 最终拼接成的字符串
            // const paramsNameNumber = params.length; // 实际标签的个数
            // const provideNumber = 10; // 每行能显示的字的个数
            // const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            // if (paramsNameNumber > provideNumber) {
            //   /** 循环每一行,p表示行 */
            //   for (var p = 0; p < rowNumber; p++) {
            //     var tempStr = ''; // 表示每一次截取的字符串
            //     const start = p * provideNumber; // 开始截取的位置
            //     const end = start + provideNumber; // 结束截取的位置
            //     // 此处特殊处理最后一行的索引值
            //     if (p === rowNumber - 1) {
            //       // 最后一次不换行
            //       tempStr = params.substring(start, paramsNameNumber);
            //     } else {
            //       tempStr = params.substring(start, end) + '\n';
            //     }
            //     newParamsName += tempStr; // 最终拼成的字符串
            //   }
            // } else {
            //   newParamsName = params;
            // }
            // return newParamsName;
            // return params
          },
        },
      },
      yAxis: [
        {
          name: 'mm',
          type: 'value',
          nameTextStyle: {
            color: '#ccc',
            fontSize: 24,
            padding: [0, 0, 0, -90],
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            padding: [0, 20, 0, 0],
            textStyle: {
              color: '#fff',
              fontSize: '24',
            },
          },
          axisLine: {
            lineStyle: {
              width: 0,
            },
          },
          splitLine: {
            // 网格线
            lineStyle: {
              type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
            },
            show: true,
          },
          min: 0,
          max: this.max,
          splitNumber: 5,
          minInterval: 1,
          interval: this.max / 5,
        },
        {
          name: '累计mm',
          type: 'value',
          nameTextStyle: {
            color: '#ccc',
            fontSize: 24,
            padding: [0, 0, 0, 30],
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            padding: [0, 0, 0, 20],
            textStyle: {
              color: '#fff',
              fontSize: 24,
            },
          },
          axisLine: {
            lineStyle: {
              width: 0,
              fontSize: 24,
            },
          },
          splitLine: {
            // 网格线
            lineStyle: {
              type: 'dashed', // 设置网格线类型 dotted：虚线   solid:实线
            },
            show: true,
          },
          min: 0,
          max: Math.ceil(this.addUpData.slice(-1)[0] * 2) / 2,
          splitNumber: 5,
          interval: Math.ceil(this.addUpData.slice(-1)[0] * 2) / 10,
        },
      ],
      grid: {
        top: '20%',
        bottom: '23%',
        left: '10%',
        right: '10%',
      },
      dataZoom: [
        {
          show: true,
          type: 'slider',
          top: '93%',
          bottom: '5%',
          start:
            100 -
            ((5 / this.xData.length) * 100 > 100
              ? 100
              : (5 / this.xData.length) * 100),
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
          name: '降水',
          data: this.yData,
          type: 'bar',
          barWidth: 40,
          yAxisIndex: 0,
          itemStyle: {
            color: '#61A5E8',
            borderColor: '#00deb7',
            borderType: 'solid',
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0,158,120)',
                },
                {
                  offset: 1,
                  color: 'rgba(0,158,120,.2)',
                },
              ]),
              borderColor: '#00deb7',
              borderType: 'solid',
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
                yAxis: 1000,
                lineStyle: {
                  type: 'dashed',
                  color: 'red',
                },
              },
            ],
          },
        },
        {
          name: '累计降水',
          data: this.addUpData,
          yAxisIndex: 1,
          type: 'line',
          // smooth: true,
          // symbol: 'circle',
          // symbolSize: 10,
          // stack: '总量',
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
                yAxis: 1000,
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
  width: 1010px;
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
      right: 15px;
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
    padding: 0 45px 15px;
    box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .content-title {
      display: flex;
      height: 55px;
      justify-content: space-between;
      align-items: center;
      font-size: 26px;
      color: #bbd0dc;
    }
  }
  .echartContent {
    box-sizing: border-box;
    // width: 720px;
    height: calc(100% - 50px);
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
