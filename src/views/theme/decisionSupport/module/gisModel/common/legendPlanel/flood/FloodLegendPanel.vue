<template>
    <div class="legendPlanel-block">
        <div class="trigger-btn" @click="showPopups" v-show="!popupsStatus">
        </div>
        <div :class="['popups-planel', popupsStatus ? 'show' : '']">
            <div class="popups-planel-close" @click="hidePopups">
                <img class="img" src="@/assets/img/gisModule/legendPlanel/legendhide.png" alt/>
            </div>
            <LegendPanel :legendList="legendList" :visible = "visible" @click="itemClickFn"></LegendPanel>
            <!--<LegendPanel :legendList="legendList" :visible = "visible" ></LegendPanel>-->
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import FloodLegendEvent from '@/util/FloodLegendEvent';
import LegendPanel from '@/components/common/Legend/LegendPanel.vue';

@Component({
    name: 'FloodLegendPanel',
    components: {LegendPanel},
    mixins: [FloodLegendEvent],
})
export default class FloodLegendPanel extends Vue {
    // 显示隐藏图例
    private popupsStatus: boolean = true;

    private visible: boolean = false;

    private legendList: any =
        {
            legends: [

                {
                    clickFn: 'openLakeSurface',
                    title: '库湖水面',
                    checked: false,
                    iconName: 'lakeSurface',
                    isShow: true,
                    layerName: 'ReservoirLakeLayer',
                    mapCircleQueryType: 6,
                },
                {
                    clickFn: 'openRiverNetwork',
                    title: '河网水系',
                    checked: true,
                    iconName: 'riverNetwork',
                    isShow: true,
                    layerName: 'RiverLayer',
                    mapCircleQueryType: 7,
                },
                {
                    clickFn: 'openFloodwaterArea',
                    title: '蓄滞洪区',
                    checked: false,
                    iconName: 'floodwaterArea',
                    isShow: true,
                    layerName: '',
                    mapCircleQueryType: 8,
                },
                {
                    clickFn: 'openWatershed',
                    title: '流域',
                    checked: true,
                    iconName: 'watershed',
                    isShow: true,
                    layerName: 'WatershedLayer',
                    mapCircleQueryType: 9,
                },
            ],
        };

    private showPopups() {
        this.popupsStatus = true;
    }
    private hidePopups() {
        this.popupsStatus = false;
    }

    private itemClickFn(data: any) {
        // 调取对应的地图方法
        this.openLegendEvent(data.checked, data.layerName);
    }

    private created() {
        // 初始化显示图例中的河网水系和流域
        this.openLegendEvent(true, ['RiverLayer', 'WatershedLayer']);
        const self: any = this;
        // 切换专题时，将图层隐藏
        this.messsageBus.on('closeMap', (isClose: boolean): void => {
            if (isClose) {
                self.openLegendEvent(false, ['RiverLayer', 'WatershedLayer', 'ReservoirLakeLayer']);
            }

        });
    }
}
</script>

<style lang="less" scoped>
    @imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel';
    @import url('../../../../../../../../components/common/Legend/LegendPanel.less');

    .legendPlanel-block {
        position: relative;
        display: inline-block;
        z-index: 3;
        .trigger-btn {
            width: 63px;
            height: 63px;
            cursor: pointer;
            background-image: url('@{imgPath}/legend.png');
            background-size: contain;
            position: absolute;
            bottom: -35px;
            // right: -60px;
            z-index: 3;
            &:hover {
                background-image: url('@{imgPath}/legendhover.png');
                z-index: 3;
            }
        }
        .popups-planel {
            display: none;
            position: absolute;
            bottom: -79px;
            right: -62px;
            width: 230px;
            // height: 160px;
            // z-index: 20;
            background: url('@{imgPath}/legendbg.png') no-repeat 0 0;
            background-size: 100% 100%;
            &.show {
                display: block;
            }
            .popups-planel-close {
                position: absolute;
                right: 23px;
                top: -14px;
                width: 33px;
                height: 33px;
                cursor: pointer;
                .img {
                    &:extend(.popups-planel-close);
                }
            }

        }
    }

</style>
