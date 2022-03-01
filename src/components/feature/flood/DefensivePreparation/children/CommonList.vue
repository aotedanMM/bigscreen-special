<!--防御准备下风险隐患点容器组件-->
<template>
<div>
    <div class="tempRight-title  f-tit-h2">
        <span @click.stop="handleClickStatisticsTitle(curCompParam)" 
              :class="[((curCompParam.titleActive) && (curCompParam.count))? 'itemName-active' : '',
                        curCompParam.titleClickDisabled ? 'titleClickDisabledStyle' : '']">
            {{curCompParam.title}}
        </span>
        <span class="tempRight-total"> <span class="f-number">{{curCompParam.count || 0}}</span></span>
        <span class="tempRight-unit">{{curCompParam.unit}}</span>
        <i :class="curCompParam.showSub? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'" 
            @click.stop="expandSublist(curCompParam)"></i>
    </div>
    <div class="DefensiveCommonList"
        v-show="curCompParam.showSub">
        <div class="team-ul">
            <div  class="tempRight-itemTitle"
                   v-for="(item,index) of curList" 
                   :key="item.code"
                   :class="{'gray':!item.value}" >
                    <div class="tempRight-icon_bg" :class="item.icon_bg">
                        <i class="teamIcon" :class="'teamIcon-'+item.icon"></i>
                    </div>
                    <div class="tempRight-itemName"
                        :class="item.isChecked? 'itemName-active' : ''"
                        @click.stop="handleClickSubitemTitle(item,index)">
                        <span class="f-txt-com">{{item.name}}</span>
                    </div>
                    <div class="tempRight-itemNum  f-txt-com" 
                        @click.stop="clickItem(item,index)">
                        <em class="text-number f-number" 
                            :class="curCompParam.subNumClickDisabled? 'text-number-activeNone' : ''"
                            >
                            {{item.value}}
                        </em>
                        <i class="text-unit">{{item.unit}}</i>
                    </div>
            </div>
        </div>
    </div>
</div>                  
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {
    riskServer,
    protectTargetServer,
} from '@/api/feature/defensiveprepation/installServer';
@Component({
    name: 'CommonList',
    components: {},
})
export default class CommonList extends Vue {
    @Prop() private compParam: any; // 从父级拿到的当前组件需要的参数
    @Prop() private handleClick: any; // 父组件处理子组件点击的方法
    @Prop() private handleTitleClick: any; // 父组件处理子组件一级标题的点击事件
    @Prop() private handleSubTitleClick: any; // 父组件处理子组件二级标题的点击事件
    private curCompParam: any = {
    }; // compParam的转换
    private curList = []; // 当前列表
    private servObj: any = {
        riskServer,
        protectTargetServer,
    };
    private dictMap: any = {
                    prh_dangerbuliding: {
                        name: '危险建筑',
                        icon_bg: 'icon_bg_normal',
                        icon: 'dangerousBuilding',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'wxjz',
                    },
                    // bas_geologichazard
                    100103000000: {
                        name: '地灾隐患',
                        icon_bg: 'icon_bg_normal',
                        icon: 'potentialHazards',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'dzyh',
                    },
                    nah_fld_waterlogroad: {
                        name: '易涝路段',
                        icon_bg: 'icon_bg_normal',
                        icon: 'easyFloodingSection',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'ylld',
                    },
                    acd_prh_buildingsite: {
                        name: '建筑工地',
                        icon_bg: 'icon_bg_normal',
                        icon: 'constructionSite',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'jzgd',
                    },
                    puf_wcf_culvertgate: {
                        name: '涵闸',
                        icon_bg: 'icon_bg_normal',
                        icon: 'culvertGate',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'hz',
                    },
                    nah_fld_waterlogsite: {
                        name: '内涝点',
                        icon_bg: 'icon_bg_normal',
                        icon: 'floodPoint',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'nld',
                    },
                    puf_powerfacilities: {
                        name: '电力设施',
                        icon_bg: 'icon_bg_normal',
                        icon: 'powerFacility',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'dlss',
                    },
                    puf_comfacilities: {
                        name: '通讯设施',
                        icon_bg: 'icon_bg_normal',
                        icon: 'commnunicationFacilities',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'txss',
                    },
                    nah_fld_mountainflood: {
                        name: '山洪隐患',
                        icon_bg: 'icon_bg_normal',
                        icon: 'hiddenDanger',
                        unit: '处',
                        nextCompName: 'CommonStatisticsContainer',
                        mapLayerType: 'shyh',
                    },
                };

    private clickItem(item: any, index: number) {
        // 地图弹窗也需要这个组件，且不能点击
        if ( (!item.value) || this.curCompParam.subNumClickDisabled ) {
            return ;
        }
        const param: any = {
            ...item,
        };
        this.handleClick(item.nextCompName, param);
    }

     /**
     * 展开或者收起当前的子数组面板
     */
    private expandSublist(curCompParam: any) {

        this.curCompParam.showSub = !curCompParam.showSub;
    }


    // 通过服务获得数据，因为风险隐患和防护目标公用一个vue，所以这里要做参数等处理
    private async getDataByServ() {
        const opts = {
            distCode: this.curCompParam.serveParam.curDisCode,
        };
        const result = await this.servObj[this.compParam.serveName].getStatistics(opts);
        const statisticsObj = this.handleResResult(JSON.parse(JSON.stringify(result)));
        this.curList = statisticsObj.curListTmp;
        this.curCompParam.count = statisticsObj.statisticNum;
    }

    // 处理从接口返回的结果，并且计算总数
    private handleResResult(resResult: any) {
        const statisticNum = resResult.total || 0;
        const curListTmp: any = [];
        resResult.list.forEach((item: any, index: number) => {
            if ( item.code ) {
                // statisticNum += item.value;
                const obj = {
                    ...item,
                    parentParam : this.compParam,
                    ...this.dictMap[item.code],
                    isChecked: false, // 子标题高亮
                };
                curListTmp.push(JSON.parse(JSON.stringify(obj)));
            }
        });
        return {
            statisticNum,
            curListTmp,
        };
    }

    /**
     * 更新当前选中（上图）的情况，针对一级标题
     */
    private handleClickStatisticsTitle(curCompParam: any) {
        // 因为地图弹窗也用到这个组件了，是不需要点击事件的
        if ( (!curCompParam.count) || curCompParam.titleClickDisabled) { // 当统计值为0的时候，点击没有任何意义
            return ;
        }
        const curCompParamTmp = JSON.parse(JSON.stringify(curCompParam));
        this.curCompParam.titleActive = !curCompParamTmp.titleActive;

        if (this.curCompParam.titleActive) { // 当前标题是从不高亮到高亮，那么要清除当前子标题的高亮状态
            const a = this.curList;
            this.curList.forEach((item: any, index: number) => {
                item.isChecked = false;
            });
        }

        this.handleTitleClick(JSON.parse(JSON.stringify(this.curCompParam)));
    }

    /**
     * 点击二级标题
    */
    private handleClickSubitemTitle(item: any, index: number) {
        // 地图弹窗也用到了这个组件，在地图弹窗二级标题是不需要点击的。
        if ( (!item.value) || this.curCompParam.subTitleClickDisabled ) {
            return ;
        }
        item.isChecked = !item.isChecked; // 反选
        // 要把一级高亮去掉
        this.curCompParam.titleActive = false;
        const itemTmp = JSON.parse(JSON.stringify(item));
        const subList = JSON.parse(JSON.stringify(this.curList));
        const curCompParamTpm = JSON.parse(JSON.stringify(this.curCompParam));
        this.handleSubTitleClick(itemTmp, index, subList , curCompParamTpm);
    }


    // 主要是为了应对防护目标和危险隐患的互斥
    @Watch('compParam')
    private updateCurCompParam(val: any) {
        const compParamNew = JSON.parse(JSON.stringify(val));
        if (compParamNew.updateTitleChecked) { // 例如： 防护目标的被点击成了高亮，那么危险隐患的要取消高亮
            this.curCompParam.titleActive = false;
            // this.curList.forEach((item: any, index: number) => {
            //     item.isChecked = false;
            // });
        }
        if (compParamNew.updateSubTitleChecked) {
            this.curList.forEach((item: any, index: number) => {
                item.isChecked = false;
            });
        }
    }

    private initCurCompParam() {
        this.curCompParam = {
            showSub: false, // 默认展开二级
            titleActive: false, // 当前子组件的一级标题是否选中
            ...JSON.parse(JSON.stringify(this.compParam)),
        };
    }

    private async created() {
        this.initCurCompParam();
        await this.getDataByServ();
    }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../../assets/css/decisionSupport/Statistic.half.less';
    .titleClickDisabledStyle{
        cursor: default!important;
    }

    .DefensiveCommonList{
        .team-ul .tempRight-itemNum .text-number{
            color:#7cf3fc;
            &:hover{
                color: #fbee06;
            }
        }
        .text-number-activeNone:hover{
            color:#7cf3fc!important;
        }
    }
</style>