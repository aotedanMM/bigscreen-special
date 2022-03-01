<!--防御准备的首页变成弹窗的子组件-->
<template>
    <div class="DefensiveHome_cnt">
        
            <div class="rescueTeamsHome_cnt">
                <template v-for="(pitem) of panelList">
                    <component   :key="pitem.key"
                                :is="pitem.subCompName"
                                :compParam="pitem.subCompParam" 
                                :handleClick='handleChildClick'
                                :handleTitleClick='handleTitleClick'
                                :handleSubTitleClick='handleSubTitleClick'>
                    </component>
                </template>
            </div>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
    Prop,
    Watch,
} from 'vue-property-decorator';
import CommonList from '@/components/feature/flood/DefensivePreparation/children/CommonList.vue';
@Component({
    name: 'CountyPopupChild',
    components: {
        CommonList, // 风险隐患点
    },
})
export default class CountyPopupChild extends Vue {
    @Prop() private districtcode: any; // 行政区划
    private panelList: any = [
        {
            title: '风险隐患点',
            key: 'RiskPoint',
            mutex: [ // 互斥
                    {
                        title: '防护目标',
                        key: 'ProtectiveGoal',
                        index: 1,
                    },
            ],
            subCompName: 'CommonList',
            subCompParam: {
                title: '风险隐患点', // 名称,这个在组件一开始形成后就不可以变
                key: 'RiskPoint', // 关键字,,这个在组件一开始形成后就不可以变
                unit: '处', // 单位,,这个在组件一开始形成后就不可以变
                serveName: 'riskServer', // 子组件用到的服务,,这个在组件一开始形成后就不可以变
                serveParam: {  // 子组件需要的服务参数
                    curDisCode: '', // 当前的行政区划
                },
                index: 0, // 当前对象在panelList中的数组下标,这个在组件一开始形成后就不可以变
                thermodynamicLayerParam: 'fxyh', // 热力图的参数,,这个在组件一开始形成后就不可以变
                updateTitleChecked: false, // 当前是否需要更新一级标题的高亮
                updateSubTitleChecked: false, // 当前是否需要完全更新二级标题的高亮
                titleClickDisabled: true, // 一级标题不可以点击
                subTitleClickDisabled: true, // 二级标题不可以点击
                subNumClickDisabled: true, // 二级数字不可以点击
            },
        },
        {
            title: '防护目标',
            key: 'ProtectiveGoal',
            mutex: [ // 互斥
                    {
                        title: '风险隐患点',
                        key: 'RiskPoint',
                        index: 0,
                    },
            ],
            subCompName: 'CommonList',
            subCompParam: {
                title: '防护目标',
                key: 'ProtectiveGoal',
                unit: '处',
                serveName: 'protectTargetServer',
                serveParam: {  // 子组件需要的服务参数
                    curDisCode: '', // 当前的行政区划
                },
                index: 1,
                thermodynamicLayerParam: 'fhmb', // 热力图的参数
                updateTitleChecked: false, // 当前是否需要更新一级标题的高亮
                updateSubTitleChecked: false, // 当前是否需要完全更新二级标题的高亮
                titleClickDisabled: true, // 一级标题不可以点击
                subTitleClickDisabled: true, // 二级标题不可以点击
                subNumClickDisabled: true, // 二级数字不可以点击
            },
        },
    ];

    /**
     * 处理子组件的点击事件
    */
    private handleChildClick(compName: string, compParam: any) {
        //
    }

    /**
     * 处理子组件的一级标题的点击
    */
   private handleTitleClick(childCompParam: any) {
       //
   }

   /**
    * 处理子组件的二级标题的点击事件
   */
  private handleSubTitleClick(childItem: any, childIndex: number, childList: any, childCompParam: any) {
      //
  }

  private setDistrictcode() {
        const disCodeOri = this.districtcode;
        const finalCode = disCodeOri.replace(/(00){1,2}/gi, '%');
        this.panelList.forEach((item: any, index: number) => {
            if (item.subCompParam.serveParam && item.subCompParam.serveParam ) {
                item.subCompParam.serveParam.curDisCode = finalCode; // 当前的行政区划
            }
        });
  }
  private created() {
       this.setDistrictcode();
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../../assets/css/decisionSupport/Statistic.half.less';
    .DefensiveHome{
        height: 848px;
        &_cnt{
            height: calc(100% - 35px);
        }
    }

</style>
