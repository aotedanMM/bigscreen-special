<template>
    <div  class='barlist-wrap'>
            <ul class='hd'>
                <li class="item" v-for='item in titleData' :key='item.label'  >
                <i :class='item.class' > </i>
                {{item.label}}</li>
            </ul>
            <div class="chart-div">
                
                <dl class="chart-dl" v-for='(each, index) in listData' :key="index">
                    <dt class="chart-dt">{{each.label}}</dt>
                    <dd class="chart-dd">
                        <div :id='each.id' style='width:100% ;height:290px'></div>
                    </dd>
                </dl> 
            </div>  
    </div>
</template>

<script lang='ts'>
import { Component, Vue , Prop } from 'vue-property-decorator';
import BaseChart from './BaseChart';
  /**
    * 柱状图列表
    */

@Component({
    name : 'BarList',
})
export default class BarList extends BaseChart {

  /**
    *   传入标题的data
    */
    @Prop() public titleData: any ;
  /**
    *  传入列表的data
    */
    @Prop() public listData: any;

    public mounted() {
        this.getBarAndLineData();
    }
    private getBarAndLineData() {
        this.listData.forEach((item: any) => {
            this.init(item.id);
            this.setOption(item.option);
        });
    }
}
</script>
<style scope lang="less">
.barlist-wrap{
    height: 100%;
    padding: 0px 14px;
    .hd{
        margin:0;
        padding:0;
        display: flex;
        flex-direction: row;
        flex-wrap:nowrap ;
        justify-content: space-between;
    }
    .item{
        display: inline-block;
        font-size: 22px;
        color: #fff;
        padding:10px 15px;
        align-content: space-between;
    }
    .icon18{
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 10px;
        vertical-align: middle;
    }
    .icon18_danger{
        background-color: #FF0000;
    }
    .icon18_warn{
        background-color: #FFFF00;
    }
    .icon18_primary{
        background-color: #01E3FD;
    }
    .chart-div {
        height: calc(100% - 49px);
    }
    .chart-dl{
        margin: 0;
        position: relative;
        // height: 33.33%;
        background: url("../../../assets/img/barList/botBorderImg.png") no-repeat 0 100%;
    }
    .chart-dt{
        display: block;
        position: absolute;
        bottom: 56px;
        left: 10px;
        padding: 20px 0;
        padding-left: 6px;
        width:30px;
        font-size: 30px;
        writing-mode: tb-rl;
        letter-spacing: .2em;
        background-image: url("../../../assets/img/barList/RiskLeftBoxIMG.png");
        background-size: 100% 100%;
        color: #fff;
    }
    .chart-dd{
        margin-left: 30px;
        display: block;
        height:100%;

    }

}
</style>