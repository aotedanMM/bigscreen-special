<template>
  <!-- 降水情况 -->
  <div class="Rainfall">
    <!-- <div class="nodata" v-if="!xData || !xData.length">
      <img src="../../../../../../assets/img/default/panel/noData.png" />
    </div> -->
    <div class="body">
      <div class="echarts" ref="echarts"></div>
    </div>
    <div class="foot">
      <span class="item"
        >日降雨量:<span class="value">{{ dailyAverage }}</span
        ><i>mm</i></span
      >
      <span class="item"
        >月降雨量:<span class="value">{{ monthAverage }}</span
        ><i>mm</i></span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
import { parse } from 'qs';
@Component({
  name: 'Rainfall',
})
export default class Rainfall extends Vue {
  @Prop() public id!: any; // 接受数据
  private echartsObj: any = null;
  private data: any = [];  // 前四个小时降雨情况的数据
  private xData: any = [];
  private yData: any = [];
  private dailyAverage: any = 0; // 日均值
  private monthAverage: any = 0; // 月均值
  public mounted() {
    this.getHours();
    this.getStatRainfallInfo(this.id);
  }
  private getHours() {  // 制作前四个小时降雨情况的数据
    const hours: any = new Date().getHours();
    for (let i = 3; i >= 0; i--) {
      let num: any = 0;
      if (hours - i >= 0) {
        num = hours - i;
        num = num.toString().padStart(2, '0');
      } else {
        num = 24 + hours - i;
        num = num.toString().padStart(2, '0');
      }
      const obj = {
        time: num,
        value: 0,
      };
      this.data.push(obj);
    }
  }
  private async getStatRainfallInfo(id: any) {
    const res: any = await reservoirServer.getStatRainfallInfo({ id });
    this.monthAverage = res.data.data.monthAverage || 0;
    this.dailyAverage = res.data.data.dailyAverage || 0;
    if (res.data.data.list && res.data.data.list.length) {
      this.data.forEach((item: any) => {  // 获取到的数据赋值给制作的前四个小时降雨情况的数据
        res.data.data.list.forEach((v: any) => {
          if (v.time.substring(11, 13) === item.time) {
            item.value = v.value || 0;
          }
        });
      });
    }
    this.xData = this.data.map((v: any) => {
      return v.time + '时';
    });
    this.yData = this.data.map((v: any) => {
      return v.value;
    });
    this.$nextTick(() => {
      this.renderEcharts();
    });
  }
  private renderEcharts() {
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    const option: any = {
      grid: {
        left: '14%',
        right: '10%',
        top: '15%',
        bottom: '15%',
      },
      tooltip: {
        trigger: 'axis',
        formatter(params: any) {
          return '降水<br>' + params[0].data + 'mm';
        },
        axisPointer: {
          type: 'none',
        },
      },
      xAxis: {
        type: 'category',
        data: this.xData,
        axisLabel: {
          inside: false,
          interval: 0,
          fontSize: 16,
          color: '#ccd6e8',
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        name: '(mm)',
        type: 'value',
        axisLabel: {
          inside: false,
          interval: 0,
          fontSize: 16,
          color: '#b7c1d3',
        },
        nameTextStyle: {
          fontSize: 18,
          color: '#ccd6e8',
          padding: [0, 25, -157, 0],
        },
        axisLine: {
          show: true,
          padding: [0, 0, 0, 10],
          lineStyle: {
            type: 'solid',
            color: '#b7c1d3',
          },
        },
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: '#3d4555',
          },
        },
      },
      series: [
        {
          data: this.yData,
          type: 'bar',
          // showBackground: true,
          // backgroundStyle: {
          //     color: 'rgba(220, 220, 220, 0.8)'
          // },
          barWidth: '20px',
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
        },
      ],
    };
    this.echartsObj.setOption(option, true);
  }
}
</script>

<style lang="less" scoped>
.Rainfall {
  width: 100%;
  height: 210px;
  padding: 0 10px;
  // background: #4A717D;
  .nodata {
    width: 100%;
    height: 170px;
    img {
      margin-left: 145px;
      margin-top: 10px;
    }
  }
  .body {
    width: 100%;
    height: 170px;
    .echarts {
      width: 100%;
      height: 100%;
    }
  }
  .foot {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 0px;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    .item {
      display: flex;
      // align-items: flex-end;
      // width: 50%;
      height: 100%;
      line-height: 45px;
      font-size: 22px;
      color: #92edf6;
    }
    .value {
      margin-left: 5px;
      font-size: 30px;
      font-family: 'Impact';
      color: rgb(251, 238, 80);
    }
    i {
      margin-left: 5px;
      font-size: 18px;
      font-style: normal;
      color: #e8f4fe;
      line-height: 55px;
    }
  }
}
</style>
