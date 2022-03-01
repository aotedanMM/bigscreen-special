<template>

    <!-- :replaceBg="replaceBg" -->
<PanelRander
    ref="panelRander"
    :id="id" 
    :type="type"
    :isShow="isShow"
    :title="title" 
    v-slot="{id, type, isShow, title, fnClosePanel, fnShrinkPanel,}">
    <div class="cmp-panel-wrap">    
        <div class="cmp-panel-shrink" v-if="type===2 && !isShow" @click="fnShrinkPanel"></div>
        <div v-if="isShow" style="height:100%">
            <!-- <div class="cmp-panel-cnt" :style="replaceBg" > -->
                <div class="cmp-panel-cnt" >
                <div class="cmp-panel-cnt-hd">
                    <div class="cmp-panel-cnt-tool"> 
                        <span  v-if="type===1" @click="fnClosePanel" class="cmp-panel-btn cmp-panel-close">X</span>
                        <span class="cmp-panel-btn cmp-panel-shrink" v-if="type===2" @click="fnShrinkPanel"></span>
                    </div>
                    <div class="cmp-panel-cnt-title title-panel">{{title}}</div>
                </div>
                <div class="cmp-panel-cnt-bd">
                    <slot></slot>
                </div>
            </div>
        </div>        
    </div>    
</PanelRander>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import PanelRander from '@/components/common/rander/PanelRander.vue';
// const str = 'background: url("../../../../assets/img/decisionSupport/panel/panelbg.png") no-repeat -37px -15px;';
@Component({
    name: 'PanelView',
    components: {
        PanelRander,
    },
})
export default class PanelView extends Vue {
    /**面板属性
     * @type:   type：number; 0(无关闭无收缩)|1（带关闭按钮的面板）|2（带收缩按钮的面板）
     * @isShow: type: boolean; dis: 面板的显示状态;
     * @title:  type: String ;窗口的标题；
     */
   // @Prop() private originData!: IPanelData;
    @Prop()  private id?: string;
    @Prop({default: 0})  private type?: number;
    @Prop({default: true}) private isShow?: boolean;
    @Prop()  private title!: string;
    @Prop({ default: ''}) private replaceBg?: string;
   /* @Prop() private randerData: any;*/
    public openPanel() {
         (this.$refs as any).panelRander.fnOpenPanel();
    }

}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/font.css');
@panelHeadWidth: 30px;
@panelHeadHeight: 30px;
@panelHeadTitleFontSize: 25px;
@decisionSupportUrl:'../../../assets/img/emergencyResource/';
@panelImg: '../../../assets/img/default/panel';
.cmp-panel-wrap{
    height:100%;
    /* background-color:#fff;*/  
    *{
      //  outline:1px solid red;
    }  
    .cmp-panel-shrink{
        /*position:absolute;*/
        width:@panelHeadWidth;
        height:@panelHeadHeight;
        cursor:pointer;
        text-align:center;
        user-select:none;
        // background:url('@{panelImg}/panel_shrink.png') no-repeat 50% 50%;    
    }
}

// .cmp-panel-cnt--bg{  
//   background: url('@{panelImg}/panelbg_A.png')
//     no-repeat -37px -15px;
// }
    .cmp-panel-cnt{
        width:100%;
        height:100%;
        .cmp-panel-cnt-hd{
            padding:0px @panelHeadWidth 0 0;
            height:@panelHeadHeight;
            color:#14d4fa;
        }
        .cmp-panel-cnt-title{
            padding-left:18px;
            line-height:@panelHeadHeight;
            user-select:none;
            font-style: italic;
        }
        .cmp-panel-cnt-tool{
            float:right;
            width:auto;
            height:@panelHeadHeight;
            margin-right:-@panelHeadWidth;
        }
        .cmp-panel-btn {
            display:inline-block;
            width:@panelHeadWidth;
            height:@panelHeadHeight;
            line-height:@panelHeadHeight;
            text-align:center;
            user-select:none;
            cursor:pointer;

        }
        .cmp-panel-close{
            cursor:pointer;
            font-size:16px;
            color:inherit;
            transform:scale(1, .7) ;
            &:hover{
                color:#f0bc54;
            }
        }

        .cmp-panel-cnt-bd{
            height:calc(100% - 40px);
            // overflow-y: auto;
            // overflow-x: hidden;
        }
    }
</style>