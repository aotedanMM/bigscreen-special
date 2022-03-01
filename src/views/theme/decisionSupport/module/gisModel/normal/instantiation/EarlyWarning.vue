<template>
    <EarlyWarning :list="asyncData" @showWarning="showWarning"/>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import EarlyWarning from '@/components/feature/flood/EarlyWarning/EarlyWarning.vue';
import {EarlyWarningInterface, EarlyWarningDataField} from '@/interface/feature/flood/EarlyWarning/EarlyWarningInterface';
import { earlyWarningServer } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';

@Component({
    name: 'EarlyWarningInstantiation',
    components: {
        EarlyWarning,
    },
})
export default class EarlyWarningInstantiation extends Vue {
    private asyncData: any = [];
    private warningData: any = [];
    private experienceCircle: any;
    private popUpTemplate = new renderpopUpTemplate();
    private data: EarlyWarningDataField = {
        riverStation: 0,
        limitOfReservoir: 0,
        superRainMeasuringStation: 0,
        heavyRainMeasuringStation: 0,
        rainMeasuringStation: 0,
        arrow1: 0,
        arrow2: 0,
        arrow3: 0,
        arrow4: 0,
        arrow5: 0,
    };

   private watchExperienceType(val: any) {
       const that: any = this;
       this.getComponent_EarlyWarningJudgement().clear();
       this.warningData.forEach((item: any) => {
            if (item.level === val.level) {
                that.asyncData = [
                    {
                        class: 'riverStation',
                        name: '超警河道站',
                        value: item.data.riverStation.count,
                        checked: false,
                    },
                    {
                        class: 'limitOfReservoir',
                        name: '超汛限水库',
                        value: item.data.limitOfReservoir.count,
                        checked: false,
                    },
                    {
                        class: 'superRainMeasuringStation',
                        name: '特大暴雨雨量站',
                        value: item.data.superRainMeasuringStation.count,
                        checked: false,
                    },
                    {
                        class: 'heavyRainMeasuringStation',
                        name: '大暴雨雨量站',
                        value: item.data.heavyRainMeasuringStation.count,
                        checked: false,
                    },
                    {
                        class: 'rainMeasuringStation',
                        name: '暴雨雨量站',
                        value: item.data.rainMeasuringStation.count,
                        checked: false,
                    },
                ];
            }
        });
    }

    private mounted() {
        const that = this;
        const opts = ['riverStation', 'limitOfReservoir', 'superRainMeasuringStation', 'heavyRainMeasuringStation', 'rainMeasuringStation'];
        setTimeout(() => {
            this.getComponent_EarlyWarningJudgement().load(opts).then((result: any) => {
                if (result && result.data) {
                    that.warningData = result.data;
                    result.data.forEach((item: any) => {
                        if (item.level === that.experienceCircle) {
                            that.asyncData = [
                                {
                                    class: 'riverStation',
                                    name: '超警河道站',
                                    value: item.data.riverStation.count,
                                    checked: false,
                                },
                                {
                                    class: 'limitOfReservoir',
                                    name: '超汛限水库',
                                    value: item.data.limitOfReservoir.count,
                                    checked: false,
                                },
                                {
                                    class: 'superRainMeasuringStation',
                                    name: '特大暴雨雨量站',
                                    value: item.data.superRainMeasuringStation.count,
                                    checked: false,
                                },
                                {
                                    class: 'heavyRainMeasuringStation',
                                    name: '大暴雨雨量站',
                                    value: item.data.heavyRainMeasuringStation.count,
                                    checked: false,
                                },
                                {
                                    class: 'rainMeasuringStation',
                                    name: '暴雨雨量站',
                                    value: item.data.rainMeasuringStation.count,
                                    checked: false,
                                },
                            ];
                        }
                    });
                }
            });
        });
    }


    // 注册组件
    private getComponent_EarlyWarningJudgement() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.disasterJudgeFactory.getComponent('disasterJudgeEarlyWarning');
        return component;
    }

    private showWarning(item: any) {
        if (item.checked) {
            // 加载地图点位
            this.getComponent_EarlyWarningJudgement().showResource([item.class], [this.experienceCircle]);
        } else {
            // 隐藏地图点位
            this.getComponent_EarlyWarningJudgement().hideResource([item.class], [this.experienceCircle]);
        }

    }

    private onShowPopup(event: any) {
        if (!event.type && event.featureType) {
            event.type = event.featureType;
            const eventType = event.featureType;
        }
        const param = {
            that: this,
            popupId: 'popup', // 监听id，必须
            moduleTypeID: 'warningPopup', // 实体类资源模块id，必须
            styleObj: {// 选填
                'margin-bottom': '66px',
                'margin-left': '-205px',
            },
            // getComponenContext: this.getComponent(),
        };
        this.popUpTemplate.getParams(param);
        this.popUpTemplate.onShowPopup(event);
    }

    private created() {
        const that: any = this;
        this.messsageBus.on('tabListAll', (item: any) => {
            that.experienceCircle = item[item.length - 1].level;
        });
        this.messsageBus.on('tabItem', (item: any) => {
            that.experienceCircle = item.level;
            that.watchExperienceType(item);
        });
        this.getComponent_EarlyWarningJudgement().on('popup', this.onShowPopup, this);


    }

    private beforeDestroy() {
        this.getComponent_EarlyWarningJudgement().off('popup', this.onShowPopup, this);
        this.getComponent_EarlyWarningJudgement().clear();
        this.getComponent_EarlyWarningJudgement().unload();
    }

}
</script>

<style scoped>

</style>