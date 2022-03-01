<!--房屋损毁-->
<template>
  <div style="width:92%;height:100%;padding-left: 16px;">
    <!-- <ChartLegend :originData="legend"></ChartLegend> -->
    <HouseDamaged :id="HousesDamagedid" :option="getOption" :nodata="nodata"></HouseDamaged>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  IHouseDamagedOption,
  IdatasetItem,
} from '@/interface/feature/earthquake/HouseDamaged.interface';
import { ILegend } from '@/interface/feature/common/legend/Legend.interface';
import HouseDamaged from '@/components/feature/earthquake/houseDamaged/HouseDamaged.vue';
// import ChartLegend from '@/components/feature/earthquake/chartLegend/ChartLegend.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'HouseDamagedAndLegend',
  components: {
    HouseDamaged,
    // ChartLegend,
  },
})
export default class HouseDamagedAndLegend extends Vue {
  /**
   * 图例
   */
  public legend: ILegend = {
    isShow: true,
    data: [
      {
        title: '一般受损',
        iconClass: 'primary',
      },
      {
        title: '严重受损',
        iconClass: 'warning',
      },
      {
        title: '房屋倒塌',
        iconClass: 'danger',
      },
    ],
  };
  public HousesDamagedid: string = 'HousesDamaged-chart';
  // public originData: IdatasetItem[] = [
  //   { parentName: '汶川县', yibansunhuai: 20, yazhongsunhuai: 10, damage: 60 },
  //   { parentName: '茂茂县', yibansunhuai: 10, yazhongsunhuai: 30, damage: 50 },
  //   { parentName: '安茂县', yibansunhuai: 10, yazhongsunhuai: 20, damage: 60 },
  //   { parentName: '平武县', yibansunhuai: 20, yazhongsunhuai: 30, damage: 40 },
  //   { parentName: '棉竹县', yibansunhuai: 20, yazhongsunhuai: 30, damage: 40 },
  // ];
 public originData: IdatasetItem[] =  [];
  /* 暂无数据 */
  private nodata = true;
  private get getOption() {
    const option = {
      legend: {
      //   formatter: [
      //     '{a|这段文本采用样式a}',
      //     '{b|这段文本采用样式b}这段用默认样式{x|这段用样式x}'
      // ].join('\n'),
      // rich: {
      //     a: {
      //         // color: 'red',
      //         backgroundColor: 'red',
      //         lineHeight: 100,
      //     },
      //     b: {
      //         backgroundColor: {
      //             image: 'xxx/xxx.jpg',
      //         },
      //         height: 40,
      //     },
      //     x: {
      //         fontSize: 18,
      //         fontFamily: 'Microsoft YaHei',
      //         borderColor: '#449933',
      //         borderRadius: 4,
      //     },
      // },
        top: 10,
        left: 10,
        itemHeight: 20,
        itemWidth: 20,
        // selectedMode: 'multiple',
        textStyle: {
            fontSize: 22,
            color: '#fff',
        },
        data: ['一般受损', '严重受损', '房屋倒塌'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: '15%',
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
        axisTick: { show: false },
        splitLine: { show: false },
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
      series: [
        {
          type: 'bar',
          barWidth: '12',
          barCategoryGap: '0%',
          fontSize: 24,
          stack: 'a',
          name: '一般受损',
          itemStyle: {
            color: '#17b472',
            barBorderRadius: [3, 0, 0, 3],
          },
        },
        {
          type: 'bar',
          barWidth: '10%',
          fontSize: 24,
          stack: 'a',
          name: '严重受损',
          itemStyle: {
            color: '#01deff',
          },
        },
        {
          type: 'bar',
          barWidth: '32%',
          stack: 'a',
          name: '房屋倒塌',
          itemStyle: {
            color: '#c48607',
            barBorderRadius: [0, 3, 3, 0],
            fontSize: 24,
          },
        },
      ],
    };
    return option;
  }
  // private get getoriginData() {
  //   console.log(1);
  //   return this.originData;
  // }
  @Watch('$store.state.eventPushStore.housesh')
  private listenerEvent(val: any) {
    if ( val > 0) {
      this.getData();
    } else if (val < 0) {
       this.originData = [];
    }
  }
  // 数据请求
  // @Watch('originData')
  // private eventChange() {
  //   this.getData();
  // }
  // 创建生命周期
  private async created() {
    if (this.$store.state.eventPushStore.housesh > -1) {
      this.getData();
    } else {
      this.nodata = true;
    }
  }
  // 数据请求
  private async getData() {
    // 事件id
    const eventId = this.$store.state.eventPushStore.eventId;
    // 房屋id
    const processId = 'housesh';
    const { data }: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      processId,
    );
    if (JSON.stringify(data) === '{}') {
      this.nodata = true;
      return false;
    } else {
      this.nodata = false;
    }
    const jsonData = JSON.parse(data.content)[0].data;
    const dataList = JSON.parse(jsonData).data;
    this.originData = [];
    dataList.forEach( (item: any) => {
       this.originData.push({parentName: item.parentName, yibansunhuai: item.yazhongsunhuai, yazhongsunhuai: item.yibansunhuai, damage: item.damage });
    });
  }
}
</script>
<style lang="less" scoped>
</style>