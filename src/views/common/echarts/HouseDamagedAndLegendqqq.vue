<!--房屋损毁-->
<template>
<div style="width:100%;height:100%;">
  <ChartLegend :originData="legend"></ChartLegend>
  <HouseDamaged :id="HousesDamagedid" :option="option"></HouseDamaged>
</div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
} from 'vue-property-decorator';
import {
  IHouseDamagedOption,
  IdatasetItem,
} from '@/interface/feature/earthquake/HouseDamaged.interface';
import {
  ILegend,
} from '@/interface/feature/common/legend/Legend.interface';
import HouseDamaged from '@/components/feature/earthquake/houseDamaged/HouseDamaged.vue';
import ChartLegend from '@/components/feature/earthquake/chartLegend/ChartLegend.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'LegendView',
  components: {
    HouseDamaged,
    ChartLegend,
  },
})
export default class HouseDamagedAndLegend extends Vue {
  /**
   * 图例
   */
  public legend: ILegend = {
    isShow: true,
    data: [{
      title: '一般受损',
      iconClass: 'primary',
    }, {
      title: '严重受损',
      iconClass: 'warning',
    }, {
      title: '房屋倒塌',
      iconClass: 'danger',
    }],
  };
  public HousesDamagedid: string = 'HousesDamaged-chart';
  public originData: IdatasetItem[] = [{
      parentName: '汶川县',
      yibansunhuai: 20,
      yazhongsunhuai: 10,
      damage: 60,
    },
    {
      parentName: '茂茂县',
      yibansunhuai: 10,
      yazhongsunhuai: 30,
      damage: 50,
    },
    {
      parentName: '安茂县',
      yibansunhuai: 10,
      yazhongsunhuai: 20,
      damage: 60,
    },
    {
      parentName: '平武县',
      yibansunhuai: 20,
      yazhongsunhuai: 30,
      damage: 40,
    },
    {
      parentName: '棉竹县',
      yibansunhuai: 20,
      yazhongsunhuai: 30,
      damage: 40,
    },
  ];
  public option: IHouseDamagedOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: '0%',
      left: '2%',
      bottom: '2%',
      right: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        textStyle: {
          color: '#D8DFEA',
          fontSize: 20,
        },
      },
      interval: 10,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    dataset: {
      source: this.originData,
    },
    series: [{
        type: 'bar',
        barWidth: '12',
        barCategoryGap: '0%',
        stack: 'a',
        name: '一般受损',
        itemStyle: {
          color: '#0d6547',
          barBorderRadius: [3, 0, 0, 3],
        },
      },
      {
        type: 'bar',
        barWidth: '10%',
        stack: 'a',
        name: '严重受损',
        itemStyle: {
          color: '#09839b',
        },
      },
      {
        type: 'bar',
        barWidth: '10%',
        stack: 'a',
        name: '房屋倒塌',
        itemStyle: {
          color: '#946d1a',
          barBorderRadius: [0, 3, 3, 0],
        },
      },
    ],
  };
  @Watch('this.$store.state.eventPushStore.eventId')
  private echartsData: any;
  @Watch('eventChange')
  private eventChange() {
    this.getData();
  }
  // 创建生命周期
  private async created() {
    const data = await this.getData();
    console.log('data', data.data);
    data.data.forEach((item: any) => {
      this. echartsData.push({
        parentName: item.parentName,
        yibansunhuai: item.yibansunhuai,
        yazhongsunhuai: item.yazhongsunhuai,
        damage: item.damage,
      });
    });
    this.originData = data.data;
    // alert(JSON.stringify(this.originData));
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: '0%',
        left: '2%',
        bottom: '2%',
        right: '2%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          textStyle: {
            color: '#D8DFEA',
            fontSize: 20,
          },
        },
        interval: 10,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      dataset: {
        source: this.originData,
      },
      series: [{
          type: 'bar',
          barWidth: '12',
          barCategoryGap: '0%',
          stack: 'a',
          name: '一般受损',
          itemStyle: {
            color: '#0d6547',
            barBorderRadius: [3, 0, 0, 3],
          },
        },
        {
          type: 'bar',
          barWidth: '10%',
          stack: 'a',
          name: '严重受损',
          itemStyle: {
            color: '#09839b',
          },
        },
        {
          type: 'bar',
          barWidth: '10%',
          stack: 'a',
          name: '房屋倒塌',
          itemStyle: {
            color: '#946d1a',
            barBorderRadius: [0, 3, 3, 0],
          },
        },
      ],
    };
  }
  // 数据请求
  private async getData() {
    // 事件id
    const eventId = this.$store.state.eventPushStore.eventId;
    // 房屋id
    const processId = 'housesh';
    const {
      data,
    }: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      processId,
    );
    return JSON.parse(data.content)[0];
    // this.echartsData = JSON.parse(data.content)[0].data;
    // console.log('dataa=>', this.echartsData);
    //   alert(1);
  }
}
</script>

<style lang="less" scoped>
</style>
