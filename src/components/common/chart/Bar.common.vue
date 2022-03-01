<template>
  <div style="width:100%;height:100%">
    <div :id='id' v-show ='!nodata' style='width :100%;height:100%'> 
    </div>
    <div v-show='nodata' class="nothingData--bg"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue , Prop, Watch } from 'vue-property-decorator';
import BaseChart from './BaseChart';
  /**
    *  柱状图组件
    */
@Component({
    name : 'BarChart',
})
export default class BarChart extends BaseChart {
  /**
    *  容器id
    */
    @Prop() public id!: string ;
  /**
    *  传入的option ，参考echarts option
    */
    @Prop() public option: any;
    /**
    *  暂无数据
    */
    @Prop() public nodata!: boolean;

    public echartsObj: any;

    public mounted() {
        if (!this.nodata) {
           this.getLineData();
        }
    }
    @Watch('option')
    private getLineData() {
        this.init(this.id);
        this.setOption(this.option);
        this.echartsObj = this.getEchartsObj();
    }
}
</script>