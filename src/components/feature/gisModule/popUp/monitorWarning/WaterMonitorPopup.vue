<template>
  <!-- 水情弹框 -->
  <div class="water-monitor-popup">
    <div class="title">
      <span>{{ data.name }}</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <!-- 河流监测站详情 -->
      <ul class="listDetail">
        <li v-for="(item, index) in listDetail" :key="index">
          <span class="name">{{ item.name }}：</span
          ><span>{{ item.value }}</span>
        </li>
      </ul>
      <div class="echartContent">
        <div v-if="xData.length" class="echartTitle">
          <span>近7天监测趋势</span>
          <div class="titleBg"></div>
        </div>
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
/**
 * 监测预警
 */
@Component({
  name: 'WaterMonitorPopup',
})
export default class WaterMonitorPopup extends Vue {
  // 河流详情list
  private listDetail: any = [
    {
      name: '监测站名称',
      value: '',
      key: 'name',
    },
    {
      name: '所在河流',
      value: '',
      key: 'belongRiver',
    },
    // {
    //   name: '所在流域',
    //   value: '',
    //   key: 'riverBasini',
    // },
    // {
    //   name: '详情位置',
    //   value: '',
    //   key: 'address',
    // },
    // {
    //   name: '设备型号',
    //   value: '',
    //   key: 'equipment',
    // },
    // {
    //   name: '设站时间',
    //   value: '',
    //   key: 'stationSetTime',
    // },
  ];
  // echarts对象
  private echartsObj: any = null;
  private data: any = {};
  private xData: any = []; // x轴数据
  private yData: any = []; // y轴数据
  private maxNum: any;
  private minNum: any;
  private maxWarning: any;
  private minWarning: any;
  public mounted() {
    const self: any = this;
    this.data = self.event.data;
    console.log(self.event, 'rerwerwe'); // 传入的信息
    Object.keys(this.data).map((key: any) => {
      this.listDetail.map((v: any) => {
        if (key === v.key) {
          v.value = this.data[key];
        }
      });
    });

    this.xData = (self.event.data.list || [])
      .map((v: any) => v.dateTime.substring(5, 16))
      .reverse();
    this.yData = (self.event.data.list || [])

      .map((v: any) => {
        if (!v.outwater && v.outwater !== 0) {
          v.outwater = 0;
        }
        return v.outwater;
      })
      .reverse();
    console.log(this.yData, 'this.yData this.yData ');
  }

  // 绘制echarts
  private renderEcharts() {
    this.minNum = Math.min(
      ...this.yData.map((v: any) => {
        return v;
      }),
    );
    this.maxNum = Math.max(
      ...this.yData.map((v: any) => {
        return v;
      }),
    );
    // if () {
    //   this.data.analogtopwa = 0;
    // }
    // if () {
    //   this.data.analogalertwa = 0;
    // }
    if (!this.data.analogalertwa || this.maxNum > this.data.analogalertwa) {
      this.maxWarning = this.maxNum + 3;
    } else {
      this.maxWarning = this.data.analogalertwa + 3;
    }
    if (!this.data.analogtopwa || this.minNum < this.data.analogalertwa) {
      this.minWarning = (this.minNum - 3).toFixed(2);
    } else {
      this.minWarning = (this.data.analogalertwa - 3).toFixed(2);
    }
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    const option: any = {
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: ' #67e1fb',
          fontWeight: 'normal',
          fontSize: 28,
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}  <br/>水位：{c}',
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
            // fontSize: 14,
          },
          formatter(params: any) {
            const date = params.split(' ');
            const str = date[0] + '\n' + date[1];
            return str;
            //   let newParamsName = ''; // 最终拼接成的字符串
            //   const paramsNameNumber = params.length; // 实际标签的个数
            //   const provideNumber = 10; // 每行能显示的字的个数
            //   const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            //   if (paramsNameNumber > provideNumber) {
            //     /** 循环每一行,p表示行 */
            //     for (var p = 0; p < rowNumber; p++) {
            //       var tempStr = ''; // 表示每一次截取的字符串
            //       const start = p * provideNumber; // 开始截取的位置
            //       const end = start + provideNumber; // 结束截取的位置
            //       // 此处特殊处理最后一行的索引值
            //       if (p === rowNumber - 1) {
            //         // 最后一次不换行
            //         tempStr = params.substring(start, paramsNameNumber);
            //       } else {
            //         tempStr = params.substring(start, end) + '\n';
            //       }
            //       newParamsName += tempStr; // 最终拼成的字符串
            //     }
            //   } else {
            //     newParamsName = params;
            //   }
            //   return newParamsName;
          },
        },
      },
      yAxis: {
        min: this.minWarning,
        max: this.maxWarning,
        name: '水位(m)',
        type: 'value',
        nameTextStyle: {
          color: '#fff',
          fontSize: 20,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: 14,
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
        bottom: '20%',
        x: 55,
        x2: 70,
      },
      dataZoom: [
        {
          show: this.xData.length > 8 ? true : false,
          type: 'slider',
          top: '93%',
          bottom: '5%',
          start: 60,
          // 100 -
          // ((5 / this.xData.length) * 100 > 100
          //   ? 100
          //   : (5 / this.xData.length) * 100),
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
            label: {
              show: !!this.data.analogtopwa,
              formatter: '最高水位' + this.data.analogtopwa || 0,
              fontSize: 16,
              padding: [-15, -20, 15, -110],
              position: 'end',
            },
            data: [
              {
                // type: 'max',
                name: '最高水位',
                yAxis: this.data.analogtopwa || 0,
                lineStyle: {
                  normal: {
                    color: 'orange', // 这儿设置安全基线颜色
                  },
                },
              },
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
          data: [],
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
            silent: false,
            symbol: ['none', 'arrow'],
            lineStyle: {
              normal: {
                color: '#333',
              },
            },
            label: {
              show: !!this.data.analogalertwa,
              formatter: '警戒水位\n' + this.data.analogalertwa || 0,
              padding: [-20, 0, 0, 0],
              fontSize: 16,
            },
            data: [
              {
                name: '警戒水位',
                yAxis: this.data.analogalertwa || 0,
                lineStyle: {
                  normal: {
                    color: 'red', // 这儿设置安全基线颜色
                  },
                },
              },
            ],
          },
        },
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
            label: {
              formatter:
                '最低水位' +
                Math.min(
                  ...this.yData.map((v: any) => {
                    return v;
                  }),
                ),
              fontSize: 16,
              padding: [-15, -20, 15, -230],
              position: 'end',
            },
            data: [
              {
                // type: 'max',
                name: '最低水位',
                yAxis: Math.min(
                  ...this.yData.map((v: any) => {
                    return v;
                  }),
                ),
                lineStyle: {
                  normal: {
                    color: 'skyblue', // 这儿设置安全基线颜色
                  },
                },
              },
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
    if (!this.data.analogalertwa) {
      option.series.map((item: any, index: number) => {
        if (item.markLine.data[0].name === '警戒水位') {
          option.series.splice(index, 1);
        }
      });
    }
    if (!this.data.analogtopwa) {
      option.series.map((item: any, index: number) => {
        if (item.markLine.data[0].name === '最高水位') {
          option.series.splice(index, 1);
        }
      });
    }
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
  width: 750px;
  // height: 850px;
  height: 710px;
  color: #fff;
  overflow: hidden;
  // 刘云梦2022/2/21-左侧面板默认不关闭，详情弹窗右移
  margin-left: 500px;

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
    padding: 15px 35px;
    box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .listDetail {
      box-sizing: border-box;
      padding: 5px 0px;
      margin-bottom: 20px;
      li {
        font-size: 26px;
        height: 30px;
        line-height: 30px;
        margin: 10px 0px;
        .name {
          color: #92edf6;
        }
      }
    }
  }
  .echartContent {
    box-sizing: border-box;
    // width: 460px;
    // height: 100%;
    height: 390px;
    // padding: 0px 10px;
    // background: #091120;
    // border: 1px solid #2b5461;
    border-radius: 8px;
    color: #8de5eb;
    font-size: 20px;
    .nodata {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .echartTitle {
      span {
        font-size: 28px;
        color: #92edf6;
      }
      .titleBg {
        width: 90%;
        height: 44px;
        background: url('@{url}/titleBg.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
      }
    }
  }
  .echarts {
    height: 100%;
    margin-top: 10px;
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
