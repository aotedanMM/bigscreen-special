<template>
    <div style="width:100%;">
        <LegendRender :legendData="originData"   v-slot="{legendData}">
            <div class="ca-legend"  v-if="legendData.isShow">
                <!--<div class="ca-legend-static" v-for="(item,index) of legendData.data" @click='clickItem(item)'>
                    <i class='icon' :class='item.iconClass'></i> 
                    <span class='text'>{{item.title}}</span>
                </div>-->
            </div>
        </LegendRender>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import LegendRender from '@/components/common/render/RenderLegend.vue';
import {IHouseDamagedOption} from '@/interface/feature/earthquake/HouseDamaged.interface.ts';
@Component({
    name: 'ChartLegend',
    components: {
        LegendRender,
    },
})
export default class ChartLegend extends Vue {
    /**
    * 房屋毁损的图例数据
    */
    @Prop() private originData!: IHouseDamagedOption;
}
</script>
<style lang="less" scoped>
 .ca-legend{
        padding:0 10px 15px;
        white-space: nowrap;
        text-align: center;
    }
    .ca-legend-static{
        display:inline-block;
        padding-left:30px;
        vertical-align:middle;
        cursor:pointer;
        width: 30%;
    }
    .text{        
        display: inline-block;
        vertical-align:middle;     
        font-size: 23px;
        line-height:1;
        color: #c2f4fa;
        padding:0 30px 0 10px;
        }
    .icon{
        margin-left:-30px;
        display: inline-block;
        width: 17px;
        height: 17px;
        line-height:1;
        vertical-align: -3px;
        &::before {
            content: '';
            display: inline-block;
            margin-right: 10px;
            width: 100%;
            height: 100%;
        }
    }
    .icon.primary:before{
    background: #17b472;
    }
    .icon.warning:before{
    background: #01deff;
    }
    .icon.danger:before{
    background: #c48607;
    }
</style>