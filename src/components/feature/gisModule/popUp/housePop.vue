<template>
  <div id="HousePop" class="house-pop"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'HousePop',
})
export default class OtherPop extends Vue {
  @Prop() public rescueData: any;
  private mounted() {
    const rescueData: any = this.rescueData;
    const myChart = this.$echarts.init(document.getElementById('HousePop'));
    const chartData: any = {
      series: [
        {
          name: '访问来源',
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['50%', '80%'],
          label: {
            fontSize: 28,
          },
          data: [
            // { value: rescueData.CITYNAME, name: '行政区划名称（市）'},
            // { value: rescueData.BUILDAREA, name: '建筑总面积（万㎡）'},
            // { value: rescueData.DISTCODE, name: '行政区划编码'},
            // { value: rescueData.COUNTRYNAME, name: '行政区划名称（区/县）'},
            // { value: rescueData.PROVINCENAME, name: '行政区划名称（省）'},
            // { value: rescueData.HOUSESTAID, name: '房屋结构编号'},
            { value: rescueData.MASONRYSTR, name: '砌体结构' + rescueData.MASONRYSTR + '%'},
            { value: rescueData.STONEWOODSTR, name: '石木结构' + rescueData.STONEWOODSTR + '%'},
            { value: rescueData.TIMBERSTR, name: '木结构' + rescueData.TIMBERSTR + '%'},
            { value: rescueData.MULMIXEDSTR, name: '多层砖混结构' + rescueData.MULMIXEDSTR + '%'},
            { value: rescueData.MULSTEELSTR, name: '多层钢混结构' + rescueData.MULSTEELSTR + '%'},
            { value: rescueData.DAMHOUSE, name: '破损房屋' + rescueData.DAMHOUSE + '%'},
            { value: rescueData.ANTIDEATHCOE, name: '抗致死性系数' + rescueData.ANTIDEATHCOE + '%'},
            { value: rescueData.NOANTIMIXEDSTR, name: '砖混结构(无抗震措施)' + rescueData.NOANTIMIXEDSTR + '%'},
            { value: rescueData.LASTNINTHS, name: '90年代前房屋' + rescueData.LASTNINTHS + '%'},
            { value: rescueData.CIVILSTR, name: '土木结构' + rescueData.CIVILSTR + '%'},
            { value: rescueData.ANTIMIXEDSTR, name: '砖混结构(有抗震措施)' + rescueData.ANTIMIXEDSTR + '%'},
            { value: rescueData.SINMIXEDSTR, name: '单层砖木、砖混、砖钢结构' + rescueData.SINMIXEDSTR + '%'},
            { value: rescueData.BRICIVILSTR, name: '砖、土木结构' + rescueData.BRICIVILSTR + '%'},
            { value: rescueData.TOWER, name: '高层建筑' + rescueData.TOWER + '%'},
            { value: rescueData.MIXEDSTR, name: '多层砖混结构' + rescueData.MIXEDSTR + '%'},
            { value: rescueData.PEMB, name: '轻钢结构' + rescueData.PEMB + '%'},
            { value: rescueData.TIBETANWOODSTR, name: '藏式木结构' + rescueData.TIBETANWOODSTR + '%'},
            { value: rescueData.POSTPANELSTR, name: '砖木结构' + rescueData.POSTPANELSTR + '%'},
            { value: rescueData.OTHERSTR, name: '其它结构' + rescueData.OTHERSTR + '%'},
            { value: rescueData.SINSTORYRES, name: '单层民宅' + rescueData.SINSTORYRES + '%'},
            { value: rescueData.SINSTONEWOODSTR, name: '单层砖木（不抗震结构）' + rescueData.SINSTONEWOODSTR + '%'},
            { value: rescueData.FRAMESTR, name: '框架结构' + rescueData.FRAMESTR + '%'},
            { value: rescueData.STEELSTR, name: '钢架结构' + rescueData.STEELSTR + '%'},
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    myChart.setOption(chartData);
  }
}
</script>
<style lang="less" scoped>
.house-pop {
  width: 1000px;
  height: 400px;
}
</style>
