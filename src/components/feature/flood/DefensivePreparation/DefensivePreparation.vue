<template>
    <!-- 防御准备入口页面 -->
    <div>
        <DefensiveHome 
            v-show="!curActiveComp.compName" 
            :handleClick="handleClickFn"
            :showState="!curActiveComp.compName">
        </DefensiveHome>
        <component v-if="curActiveComp.compName"
            :is="curActiveComp.compName" 
            :compParam='curActiveComp.compParam'
            :handleClick="handleClickFn">
        </component>
    </div>
</template>

<script  lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import DefensiveHome from '@/components/feature/flood/DefensivePreparation/DefensiveHome.vue';
import PersonnelTransferContainer from '@/components/feature/flood/DefensivePreparation/PersonnelTransferContainer.vue';
import ShipToHarbourContainer from '@/components/feature/flood/DefensivePreparation/ShipToHarbourContainer.vue';
import CommonStatisticsContainer from '@/components/feature/flood/DefensivePreparation/CommonStatisticsContainer.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
/**
 * 防御准备
 */
@Component({
    name: 'DefensivePreparation',
    components: {
        DefensiveHome, // 防御准备首页
        PersonnelTransferContainer, // 人员转移的容器
        ShipToHarbourContainer, // 船舶归港的容器
        CommonStatisticsContainer, // 风险隐患的下钻页
    },
})
export default class DefensivePreparation extends Vue {
    private curActiveComp = { // 当前激活的下钻组件
        compName: '',
        compParam: {},
    };

    private handleClickFn(compName: any, compParam: any) {
        this.curActiveComp = {
            compName: (compName === 'DefensiveHome') ? '' : compName,
            compParam: JSON.parse(JSON.stringify(compParam)),
        };
    }

    /**
     * 防护目标和风险隐患点的地图
    */
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.defensivePreparationFactory.getComponent(
        'ResourceQuery',
        );
        return component;
    }

    // 风险隐患点位和防护目标点位地图定点回调
    private popupData(event: any) {
        if (!event.type && event.featureType) {
            event.type = event.featureType;
        // const eventType = event.featureType;
        }
        const param = {
        that: this,
        popupId: 'ResourceQuery_popup_id', // 监听id，必须
        moduleTypeID: 'riskMonitor',
        // styleObj: {
        //     // 选填
        //     'margin-bottom': '66px',
        //     'margin-left': '-205px',
        // },
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
    }

    private mounted() {
        this.getComponent().off('ResourceQuery_popup');
        this.getComponent().on('ResourceQuery_popup', this.popupData, this);
    }

    private beforeDestroy() {
        this.getComponent().off('ResourceQuery_popup');
    }
}
</script>

<style lang="less" scoped>
    
</style>
