<template>
    <div class="RainstormArea" v-mutex:[eventComp]="isShow">
        <div class="rangeSelect" v-show="showRangeSelect">
            <div class="rs-head">
                <p class="title">选择查询范围</p>
            </div>
            <i class="rs-close" @click="closePanel"></i>
            <div class="rs-content">
                <div class="content">
                    <li
                            class="row"
                            v-for="(item,index) in searchRangeData"
                            @click="searchRain(item,index)"
                            :class="[resultNum === index && item.checked? 'itemHover':'']"
                            :key="item.id">
                        <span class="name">{{item.name}}</span>
                    </li>
                </div>
                <div class="submit">
                    <el-button class="csmMySlider" @click="plotsClick()">已保存的标绘</el-button>
                    <el-button class="csmMySlider" @click="paintingClick()">开始绘制</el-button>
                </div>
            </div>

            <div class="rs-bottom"></div>
        </div>
        <!--弹窗-->
        <div class="rs-prop">
            <PaintEdit
                    v-show="this.paintPanelShow"
                    :pageSize="pageSize"
                    @paintClose="closePaintPanel">
            </PaintEdit>
            <SavedPlots
                    v-show="this.plotPanelShow"
                    :pageSize="pageSize"
                    @plotClose="plotsClick">
            </SavedPlots>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import PaintEdit from './PaintEdit.vue';
import SavedPlots from './SavedPlots.vue';
import FloodLegendEvent from '@/util/FloodLegendEvent';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';

@Component({
    name: 'RainstormArea',
    components: {PaintEdit, SavedPlots},
    mixins: [FloodLegendEvent, GisAreaSelectEvent],
})
export default class RainstormArea extends Vue {
    @Prop() public visible: any;
    public isShow: any = this.visible;
    @Prop({default: 'RainstormArea'})public eventComp: any;

    private showRangeSelect: boolean = true;
    private plotPanelShow: boolean = false;
    private paintPanelShow: boolean = false;
    private num: number = -1;
    private pageSize: number = 5;

    private searchRangeData: any = [
        {
            name: '24小时降水预报',
            id: 1,
            layerName: 'Rainfall24Layer',
            checked: false,
        },
        {
            name: '48小时降水预报',
            id: 2,
            layerName: 'Rainfall48Layer',
            checked: false,
        },
        {
            name: '72小时降水预报',
            id: 3,
            layerName: 'Rainfall72Layer',
            checked: false,
        },
        {
            name: '过去24小时面降水实况',
            id: 4,
            layerName: 'RainfallBefore24Layer',
            checked: false,
        },
        {
            name: '今日面降水实况',
            id: 5,
            layerName: 'RainfallLayer',
            checked: false,
        },
    ];

    get resultNum() {
        return this.num;
    }


    // 查询
    private searchRain(item: any, index: number) {
        // 查询结果
        if (this.num > -1) {
            this.openLegendEvent(false, this.searchRangeData[this.num].layerName);
        }
        this.num = index;
        item.checked = !item.checked;
        this.openLegendEvent(item.checked, item.layerName);
    }

    // 已保存的标绘
    private plotsClick(val: any) {
        if (val === undefined) { // 当前页面打开
            this.showRangeSelect = false;
            this.plotPanelShow = true;
        } else { // 孩子传入
            this.showRangeSelect = val.parent;
            this.plotPanelShow = val.current;
        }
        // messageBus调用plot，拿所有的symbol
    }

    // 开始绘制
    private paintingClick() {
        this.messsageBus.emit('startBusinessPlot', {
            businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
            options: {
                name: '多边形',
                type: 'Polygon',
                key: 'polygon',
                symbol: {
                    type: 'SimpleFillSymbol',
                    options: {
                        borderColor: { a: 255, r: 21, g: 147, b: 255 },
                        fillColor: { a: 255, r: 255, g: 137, b: 21 },
                        borderThickness: 3,
                    },
                },
            },
        });
    }

    private closePaintPanel(val: boolean) {
        this.paintPanelShow = val;
    }

    @Watch('visible')
    private watchVisible() {
        this.isShow = this.visible;
    }

    // 关闭暴雨落区查询面板
    private closePanel() {
        this.isShow = false;
        this.$emit('compClick');
        if (this.num > -1) {
            this.openLegendEvent(false, this.searchRangeData[this.num].layerName);
        }
        // 关闭面板清除地图上的标绘
        this.messsageBus.emit('businessPlotClear', {businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a'});
    }

    private created() {
        // 关闭河网水系和流域查询
        this.getComponent_AreaSelectJudgement().unload();
    }
}
</script>

<style lang="less" scoped>
    @imgUrl: '../../../../assets/img/areaSelect';

    .RainstormArea {
        width: 100%;
        color: #fff;
    }

    .rangeSelect {
        width: 100%;
        height: 100%;
    }

    /*头*/
    .rs-head {
        background: url("@{imgUrl}/bg_head.png") no-repeat;
        background-size: 100% 100%;
        height: 60px;
        & > .title {
            padding-left: 35px;
            padding-top: 5px;
            line-height: 60px;
            font-family: Microsoft YaHei, serif;
            font-weight: bold;
            margin: 0;
            letter-spacing: 3px;
            font-size: 30px;

            /*字体颜色渐变*/
            background-image: -webkit-linear-gradient(bottom, #00f, #00e4ff, #d6c83d 80%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .rs-content {
        background: url("@{imgUrl}/bg_content.png") no-repeat;
        background-size: 100% 100%;
        padding: 10px 20px 6px 20px;

        & > .content {
            padding: 20px 20px 1px 20px;
            box-shadow: 0 0 4px 1px rgba(10, 60, 77, 1);
            border-radius: 1px;

            & > .row {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5px;
                background: url("@{imgUrl}/rainItem.png") no-repeat;
                background-size: 100% 100%;
                font-family: Microsoft YaHei, serif;
                font-size: 26px;
                margin-bottom: 10px;
                cursor: pointer;

                .name {
                    font-family: Microsoft YaHei, serif;
                    padding: 10px 0;
                }

                &:hover {
                    background: url("@{imgUrl}/rainItem_hover.png") no-repeat;
                    background-size: 100% 100%;
                }

                &.itemHover {
                    background: url("@{imgUrl}/rainItem_hover.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
        }

        & > .submit {
            display: flex;
            margin-top: 20px;
            justify-content: center;
        }
    }

    /*关闭按钮*/
    .rs-close {
        background: url("@{imgUrl}/close.png") no-repeat;
        background-size: 100% 100%;
        width: 90px;
        height: 48px;
        position: absolute;
        display: block;
        right: 0;
        top: -3px;
        cursor: pointer;

        &:hover {
            background: url("@{imgUrl}/close_hover.png") no-repeat;
        }
    }

    .rs-prop {
        position: absolute;
        right: 500px;
        top: 0;
        width: 470px;
    }

    /*底*/
    .rs-bottom {
        background: url("@{imgUrl}/bg_bottom.png") no-repeat;
        background-size: 100% 100%;
        height: 31px;
    }
</style>
