<template>
    <div class="legendPlanel-layout" :class="{flood_legend_class:visible}">
        <div
                v-for="(item, index) of getList"
                class="item" v-show="item.isShow">
            <Legend :iconName="getImgUrl(item.iconName)" :title="item.title"  @click="listItemClickFn(item)" :checked="item.checked"></Legend>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {ILegendPanel} from './ILegendPanel';
import Legend from './Legend.vue';
@Component({
    name: 'LegendPanel',
    components: {Legend},
})
export default class LegendPanel extends Vue {


    get getList() {
        return this.legendList.legends;
    }


    @Prop() public legendList!: ILegendPanel;
    @Prop() public visible!: boolean;


    public listItemClickFn(item: any) {
        item.checked = !item.checked;
        this.$emit('click', item); // 交给父亲的更改

        // 调取对应的地图方法
        // (this as any)[item.clickFn](item.checked);
    }

    private getImgUrl(name: string) {
        return require('@/assets/img/gisModule/legendPlanel/' + name + '.png');
    }

    //
    // // 流域水系
    // private getComponent_WatershedJudgement() {
    //     const factory = this.$ioc.resolve('GISFactory-map');
    //     const component = factory.commonFactory.getComponent('mapserviceIn');
    //     return component;
    // }



    // // 降雨实况图
    // private openRainfall(checked: boolean) {
    //     if (checked) {
    //
    //     }
    // }
    //
    // // 库湖水面
    // private openLakeSurface(checked: boolean) {
    //     // if (checked) {
    //     //
    //     // }
    // }
    //
    // // 河网水系
    // private openRiverNetwork(checked: boolean) {
    //     if (checked) {
    //         this.getComponent_RiverNetworkJudgement().addLayer('RiverLayer');
    //     } else {
    //         this.getComponent_RiverNetworkJudgement().removeLayer('RiverLayer');
    //     }
    // }
    //
    // // // 蓄滞洪区
    // // private openFloodwaterArea(checked: boolean) {
    // //
    // // }
    //
    // // 流域水系
    // private openWatershed(checked: boolean) {
    //     if (checked) {
    //         this.getComponent_RiverNetworkJudgement().addLayer('WatershedLayer');
    //     } else {
    //         this.getComponent_RiverNetworkJudgement().removeLayer('WatershedLayer');
    //     }
    // }
    //
    // // 创建组件
    // private getComponent_RiverNetworkJudgement() {
    //     const factory = this.$ioc.resolve('GISFactory-map');
    //     const component = factory.commonFactory.getComponent('mapserviceIn');
    //     return component;
    // }
    //
    //
    //
    //
    // private created() {
    //     // 初始化显示图例中的河网水系和流域
    //     if (this.$store.state.eventPushStore.eventId === '') {
    //         this.openWatershed(true);
    //     } else {
    //         this.openWatershed(false);
    //         this.openLakeSurface(true);
    //     }
    //     this.openRiverNetwork(true);
    //     // const clickFn;
    //     // const param = this.legendList.legends.find((item: any) => {
    //     //     return<< item.clickFn === clickFn;
    //     // });
    //     // if (param) {
    //     //     this.listItemClickFn(param);
    //     // }
    //     const self: any = this;
    //     this.messsageBus.on('closeMap', (isClose: boolean): void => {
    //         self.openRiverNetwork(false);
    //         self.openWatershed(false);
    //     });
    // }

}
</script>

<style lang="less" scoped>
@import url("./LegendPanel.less");
</style>