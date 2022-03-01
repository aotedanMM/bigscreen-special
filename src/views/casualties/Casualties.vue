<!--人员伤亡-->
<template>
  <div class="personal-casualty">  
    <el-scrollbar style="height:100%" class="cmp-scrollbar-y">      
    
    <RadarChart :id="id" :nodata="nodata" :option= "option" ref="echarts"></RadarChart>
    </el-scrollbar>

   <!-- <Casualties :id='id' :option='option' :nodata="nodata"></Casualties> -->
  </div>
   
</template>

<script lang='ts'>
import * as echarts from 'echarts';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {ILegend} from '@/interface/feature/common/legend/Legend.interface';
import {IdataItem, ICasultiesOption} from '@/interface/feature/earthquake/Casualties.interface';
import ChartLegend from '@/components/feature/earthquake/chartLegend/ChartLegend.vue';
// import Casualties from '@/components/feature/earthquake/casualties/Casualties.vue';
import RadarChart from '@/components/common/chart/Radar.common.vue';
import { pushDataRequestServe } from '@/api/installServer';

@Component({
  name: 'Casualties',
  components: {
       // ChartLegend,
        // Casualties,
        RadarChart,
  },
})
export default class CasualtiesAndLegend extends Vue {
  /**
    人员伤亡
  */
  /**
  *图例数据
  *isShow: Boolean; 显示状态;
  *data: Array ; 图例数据。
  *{
  * title:'标题',  //string;
  * iconClass: '标题前的图标'//string;
  *}
  */
  // public legend: ILegend = {
  //   isShow : true,
  //   data: [{
  //           title: '死亡',
  //           iconClass: 'primary',
  //       }, {
  //           title: '受伤',
  //           iconClass: 'warning',
  //       }, {
  //           title: '失踪',
  //           iconClass: 'danger',
  //       }],
  //   };

      public casualtiesData: any = {
         data: [],
        name: ['死亡', '受伤', '失踪'],
     };

     private optionNoData = {
      legend: {
        show: true,
        data: ['受伤', '死亡', '失踪'],
        // width: 40,
        textStyle: {
          color: '#fff',
          fontSize: 20,
        },
      },
      title : {
        text: '单位：人',
        x: 'right',
        textStyle: {
          color: '#c1f4fa',
          fontSize: 22,
        },
        top: 40,
      },
      tooltip: {
        trigger: 'item',
        padding: 10,
        borderColor: '#51b9ca',
        borderWidth: 1,
        formatter: this.tooltipFormatter,
      },
      color: ['rgba(249,71,4,.9)', 'rgba(249,134,6,.9)', 'rgba(244,166,9,.9)'],
      angleAxis: {
        type: 'category',
        z: 10,
        axisLabel: {
          color: '#c1f4fa',
          fontFamily: 'Microsoft YaHei',
          fontSize: 18,
        },
        data: this.casualtiesData.data.map((item: any, index: any): string  => {
          return item.name;
        }),
      },
      polar: {
        center: ['50%', '60%'],
        radius: 150,
      },
      radiusAxis: {
        zlevel: 99,
        z: 99,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#13fae2',
            type: 'dotted',
          },
        },
        axisLabel: {
          textStyle: {
            fontSize: 20,
            color: '#13f7e0',
            fontFamily: 'Microsoft YaHei',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#4fb8c9',
            type: 'dotted',
          },
        },
        splitArea: {
          areaStyle: {
            color: 'transparent',
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: this.casualtiesData.data.map((item: any, index: number) => {
            return item.value[0];
          }),
          coordinateSystem: 'polar',
          name: this.casualtiesData.name[0],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'bar',
          data: this.casualtiesData.data.map((item: any, index: number)  => {
            return item.value[1];
          }),
          coordinateSystem: 'polar',
          name: this.casualtiesData.name[1],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'bar',
          data: this.casualtiesData.data.map((item: any, index: number) => {
            return item.value[2];
          }),
          coordinateSystem: 'polar',
          name: this.casualtiesData.name[2],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 3,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

  private option = this.optionNoData;
  /* 暂无数据 */
  private nodata = true;
    /**
   *雷达图 ：
   *id：string; 必填项
   *option: echart的option;必填项
   *unit：string; 数据单位；默认为‘人’,非必填。
   *
  */
  private id: string = 'chart01';

  private tooltipFormatter(params: any) {
    const valuesFormatter = [];
    let str = '';
    str += `<div class="toolBoxPersonl">${params.seriesName}
            </div><span style="color:${params.color}">${params.name}</span>: ${params.value}<br>`;
    valuesFormatter.push(str);
    return valuesFormatter;
  }

private created() {
  if (this.$store.state.eventPushStore.casualties > -1) {
    this.getData();
  } else {
    this.nodata = true;
  }
}

private async getData() {
  const eventId = this.$store.state.eventPushStore.eventId; // 事件id
  const processId = 'casualties';  // 伤亡id
  const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
  if (JSON.stringify(data) === '{}') {
    this.nodata = true;
    return false;
  } else {
    this.nodata = false;
  }
  const jsonData = JSON.parse(data.content)[0].data;
  const newData = JSON.parse(jsonData).data.data;
  this.casualtiesData.data = [];
  for (const i of newData) {
    const houseItem: any = {
      name: i.parentName,
      value: [i.death, i.injured, i.miss],
    };
    this.casualtiesData.data.push(houseItem);
  }
  this.option = {
    legend: {
        show: true,
        data: ['受伤', '死亡', '失踪'],
        textStyle: {
          color: '#fff',
          fontSize: 20,
        },
      },
      title : {
        text: '单位：人',
        x: 'right',
        textStyle: {
          color: '#c1f4fa',
          fontSize: 22,
        },
        top: 40,
      },
      tooltip: {
        trigger: 'item',
        padding: 10,
        borderColor: '#51b9ca',
        borderWidth: 1,
        formatter: this.tooltipFormatter,
      },
      color: ['rgba(249,71,4,.9)', 'rgba(249,134,6,.9)', 'rgba(244,166,9,.9)'],
      angleAxis: {
        type: 'category',
        z: 10,
        axisLabel: {
          color: '#c1f4fa',
          fontFamily: 'Microsoft YaHei',
          fontSize: 18,
        },
        data: this.casualtiesData.data.map((item: any, index: any): string  => {
          return item.name;
        }),
      },
      polar: {
        center: ['50%', '60%'],
        radius: 150,
      },
      radiusAxis: {
        zlevel: 99,
        z: 99,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#13fae2',
            type: 'dotted',
          },
        },
        axisLabel: {
          textStyle: {
            fontSize: 20,
            color: '#13f7e0',
            fontFamily: 'Microsoft YaHei',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#4fb8c9',
            type: 'dotted',
          },
        },
        splitArea: {
          areaStyle: {
            color: 'transparent',
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: this.casualtiesData.data.map((item: any, index: number) => {
            return item.value[0];
          }),
          coordinateSystem: 'polar',
          name: this.casualtiesData.name[0],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'bar',
          data: this.casualtiesData.data.map((item: any, index: number)  => {
            return item.value[1];
          }),
          coordinateSystem: 'polar',
          name: this.casualtiesData.name[1],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'bar',
          data: this.casualtiesData.data.map((item: any, index: number) => {
            return item.value[2];
          }),
          coordinateSystem: 'polar',
          name: this.casualtiesData.name[2],
          stack: 'a',
          itemStyle: {
            emphasis: {
              borderWidth: 3,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
}

  @Watch('$store.state.eventPushStore.casualties')
  private eventChange(val: any) {
    if (val > 0) {
      this.getData();
    } else if (val < 0) {
      this.option = this.optionNoData;
    }
  }

}
</script>
<style lang="less">
  .personal-casualty {
    width:100%;
    height:100%;
    box-sizing: border-box;
  }
</style>