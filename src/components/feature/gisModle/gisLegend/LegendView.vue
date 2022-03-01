<!--地图上的图例-->
<template>
    <LegendRender :legendData="originData" v-slot="{ legendData, FnIsHideLegend}">
        <div class="cmp-legend cmp-legend--default">
            <div class="cmp-legend_bd"  v-if="legendData.isShow">
                <el-scrollbar class="cmp-scrollbar-y" style="height:100%">
                    <ul class="cmp-legend_bd_nr">
                        <li class="cmp-legend_bd_item" v-for="(item) of legendData.data" :key="item.title" @click='clickItem(item)'>                      
                            <!-- <i class="cmp-legend-icon" :class="item.iconClass"></i> -->
                            <img :src="item.src" class="cmp-legend-picture" :width="(item.width || 20) +'px'" :height="(item.height || 20) +'px'"/> 
                            <span>{{item.title}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
            <div class="cmp-legend_btn" @click="FnIsHideLegend(legendData.isShow)">                     
                <span>  </span>
            </div>
        </div>
    </LegendRender>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import LegendRender from '@/components/common/render/RenderLegend.vue';
import {ILegend, ILegendItem} from '@/interface/feature/common/legend/Legend.interface.ts';
@Component({
    name: 'LegendView',
    components: {
        LegendRender,
    },
})
export default class LegendView extends Vue {
    @Prop() private originData!: ILegend;
     public clickItem(tag: ILegendItem) {
            alert(tag.title);
          //  this.$emit('clickItem',tag);
        }
}
</script>
<style lang="less" scoped>
  @imgLegendUrl:'../../../../assets/img/legend';
.cmp-legend {
        position:relative ;
        width:100%;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        border-radius: 5px;
        z-index: 5;
        text-align: center;
    .cmp-legend_btn { 
        position:relative;        
        display:inline-block;
        white-space: nowrap;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .cmp-legend-picture{
        display: inline-block;
    }
    .cmp-legend_bd {
        height:200px;
        overflow: hidden;
        margin-bottom: -35px;
        text-align: left;
    }
    .cmp-legend_bd_nr{   
            margin: 0;
            padding: 0;
            list-style: none;
    }
    .cmp-legend_bd_item {
        margin: 0;
        padding:0;
        white-space: nowrap;
        cursor: pointer;
        &:last-child{
            box-shadow:none;
        }
        &:hover {
            background: ~'url(@{imgLegendUrl}/legend_hove.png)' 50% 50%;
        }
    }
}


.cmp-legend--default {
    .cmp-legend_btn{
        color: #fff;
        width: 120px;
        height: 40px;
        line-height: 40px;
        background:~'url(@{imgLegendUrl}/legend_btn.png)' no-repeat 0 0;
    }
    .cmp-legend_bd{
        padding: 17px 10px 44px;
        background: ~'url(@{imgLegendUrl}/legend_bg.png)' no-repeat  50% 100%;
    }
    .cmp-legend_bd_item{
        color: #fff;
        font-size: 16px;
        line-height: 23px;
        padding:6px 10px;   
    }
}


.cmp-legend-icon{
    display:inline-block;
    width:24px;
    height:24px;
    background-repeat:no-repeat;
    vertical-align:middle;
    margin:0 10px;
    background-position:50% 50%;
}
/*.cmp-legend-icon-A{
    background-image: ~'url(@{imgLegendUrl}/icon_bncs.png)';
}
.cmp-legend-icon-B{
    background-image: ~'url(@{imgLegendUrl}/icon_dl.png)';
}
.cmp-legend-icon-C{
    background-image: ~'url(@{imgLegendUrl}/icon_jyll.png)';
}
.cmp-legend-icon-D{
    background-image: ~'url(@{imgLegendUrl}/icon_txss.png)';
}
.cmp-legend-icon-E{
    background-image: ~'url(@{imgLegendUrl}/icon_wzck.png)';
}
.cmp-legend-icon-F{
    background-image: ~'url(@{imgLegendUrl}/icon_ylbz.png)';
}*/

</style>
<style>
.cmp-scrollbar-y .el-scrollbar__wrap{
    overflow-x:hidden;
  /* margin-right: -18px!important;  */
}
</style>