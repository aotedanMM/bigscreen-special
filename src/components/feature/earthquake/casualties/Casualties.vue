<template>
  <div class="personal-casualty">
    
    <el-scrollbar style="height:100%" class="cmp-scrollbar-y">      
    <!--<p class="DisasterPeople-danwei">单位：&nbsp;&nbsp;{{unit}}</p>-->
    <RadarChart :id="id" :nodata="nodata" :option= "option" ref="echarts"></RadarChart>
    </el-scrollbar>
  </div>
</template>

<script lang='ts'>
import * as echarts from 'echarts';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {ICasultiesOption} from '@/interface/feature/earthquake/Casualties.interface';
import ChartLegend from '@/components/feature/earthquake/chartLegend/ChartLegend.vue';
import RadarChart from '@/components/common/chart/Radar.common.vue';

@Component({
  components: {
    ChartLegend,
    RadarChart,
  },
})
export default class PersonalCasualty extends Vue {
  public echartsObj: any;
  // @Prop() private personalCasualtyData: any;
  @Prop() public id!: string;
  @Prop() public option!: any;
  @Prop() public nodata!: boolean;
  @Prop({default: '人' }) public unit?: string ;

  // @Watch('option')
  // public changeEach(val: any) {
  //       // if (!this.echartsObj) { return false; }
  //        (this.$refs as any).echarts.getLineData(val);
  //   }
  // public mounted() {
  //     //  this.echartsObj = (this.$refs as any).echarts.echartsObj;
  //   }


}
</script>
<style scoped lang='less'>
.personal-casualty {
  height:100%;
  width: 100%;
}
.DisasterPeople-danwei {
  height: 35px;
  padding-top: 0%;
  line-height: 35px;
  font-size: 22px;
  color: #c1f4fa;
  text-align:right;
  padding-right:10%;
  margin:0;
}
</style>