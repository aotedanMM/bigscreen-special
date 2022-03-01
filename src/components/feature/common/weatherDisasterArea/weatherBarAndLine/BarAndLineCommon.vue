<template>
    <div :id='id' class='QWHJS_Wrap'>
    </div>
</template>

<script lang='ts'>
import { Component, Vue , Prop , Watch } from 'vue-property-decorator';
import BaseChart from '../../../../common/chart/BaseChart';
import {IchartDatas,
    Ioption } from '@/interface/feature/common/weather/WeatherBarAndLine.interface.ts';
  /**
    *  柱状图加拆线图
    */
@Component({
    name : 'BarAndLineCommon',
})
export default class BarAndLineCommon extends BaseChart {
  /**
    *  容器id
    */
    @Prop() private id!: string ;
  /**
    *  传入的option ，参考echarts option
    */
    @Prop() private option!: Ioption;

    @Prop({default: false}) private flag: any;

    // private mounted() {
    //     this.getBarAndLineData();
    // }

    @Watch('flag')
    private getBarAndLineData() {
        this.init(this.id);
        this.setOption(this.option);
    }
}
</script>
<style scope>
    .QWHJS_Wrap{
        width:100%;
        height:200px;
    }
</style>