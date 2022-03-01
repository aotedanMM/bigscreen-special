<template>
    <div style="width:100%;height:100%">
        <div v-if="id !== 'ChartDemoContianer'" :id='id' style='width :100%;height:100%'> 
        </div>
        <div class="nothingData--bg" v-if="id === 'ChartDemoContianer'"></div>
    </div>
    
</template>

<script lang='ts'>
import { Component, Vue , Prop } from 'vue-property-decorator';
import BaseChart from './BaseChart';
  /**
    *  折线图组件
    */
@Component({
    name : 'LineChart',
})
export default class LineChart extends BaseChart {
    // 容器id
    @Prop() public id!: string ;
    //  传入的option ，参考echarts option
    @Prop() public option: any ;
    private noData = false;

    public mounted() {
        this.getLineData();
    }
    private getLineData() {
        if (this.id !== 'ChartDemoContianer') {
            this.init(this.id);
            this.setOption(this.option);
        }
    }
}
</script>