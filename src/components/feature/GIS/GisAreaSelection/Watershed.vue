<template>
    <div class="Watershed" v-mutex:[eventComp]="isShow">
        <div class="ws-head">
            <p class="title">流域查询</p>
        </div>
        <i class="ws-close" @click="closePanel"></i>
        <div class="ws-content">
            <div class="content" @mouseleave="handleMouseleave">
                <li class="row">
                    <span class="name">流域</span>
                    <span class="value">
                       <el-input class="csmMyInput-noBg"
                                 ref="input_opt"
                                 type="text"
                                 v-model="keyWord"
                                 @input="getSearchFn"
                                 placeholder="请输入流域">
                           <i slot="suffix" class="search-icon" @click="searchClick()"></i>
                       </el-input>
                    </span>
                    <span class="search-results" v-show="showResult">

                        <el-scrollbar class="cmp-scrollbar-y">
                            <div class="row">
                                 <div class="item" v-for="res in waterShedData" @click="resultItemClick(res)">
                                    <span class="child-item">{{res.name}}</span>
                                    <span class="child-item">{{res.level}}级</span>
                                </div>
                            </div>
                        </el-scrollbar>
                    </span>
                </li>
            </div>
            <div class="submit">
                <el-button
                        class="csmMySlider"
                        :disabled="!isSelectRiver"
                        @click="disposalClick()">进入处置
                </el-button>
            </div>
        </div>
        <div class="ws-bottom"></div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import server from '@/api/feature/flood/installFloodServer';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import FloodLegendEvent from '@/util/FloodLegendEvent';

@Component({
    name: 'Watershed',
    mixins: [GisAreaSelectEvent, FloodLegendEvent],
    components: {},
})
export default class Watershed extends Vue {
    @Prop({default: 'Watershed'}) public eventComp: any;
    @Prop() public visible: any;
    public isShow: any = this.visible;
    private keyWord: string = '';
    private showResult: boolean = false;
    private isSelectRiver: boolean = false; // 是否显示处置按钮
    private waterShedData: any = [];
    private waterId: string = '';   // 流域id
    // 搜索查询
    private searchClick() {
        const optsWatershedList = {
            keyWord: this.keyWord,
            pageSize: 5,
            pageIndex: 1,
        };
        const self: any = this;
        server.floodServer.getWatershedsList(optsWatershedList).then((res: any) => {
            if (res && res.data && res.data.length > 0) {
                this.showResult = !this.showResult;
                self.waterShedData = res.data;
            }
        });
    }

    // 输入查询
    private getSearchFn() {
        const optsWatershedList = {
            keyWord: this.keyWord,
            pageSize: 5,
            pageIndex: 1,
        };
        const self: any = this;
        server.floodServer.getWatershedsList(optsWatershedList).then((res: any) => {
            if (res && res.data && res.data.length > 0) {
                this.showResult = !this.showResult;
                self.waterShedData = res.data;
            }
        });
    }

    // 处理鼠标移出事件
    private  handleMouseleave() {
        this.showResult = false;
        (this.$refs as any).input_opt.blur();
    }

    // 下拉列表点击
    private resultItemClick(res: any) {
        this.showResult = !this.showResult;
        this.keyWord = res.name;
        this.waterId = res.id;
        // 流域详情查询
        const optsWatershedDetail = {
            id: this.waterId,
        };
        const self: any = this;
        server.floodServer.getWatershed(optsWatershedDetail).then((data: any) => {
            if (data && data.geom) {
                self.isSelectRiver = true;
                self.drawAndLocate(data.geom, data.name, 'WatershedLayer', true);
            }
        });
    }

    // 进入处置
    private disposalClick() {
        // 地图
    }

    @Watch('visible')
    private watchVisible() {
        this.isShow = this.visible;
    }

    // 关闭流域查询面板
    private closePanel() {
        this.isShow = false;
        this.$emit('compClick');
        this.getComponent_AreaSelectJudgement().unload();
    }

    private created() {
        // 关闭暴雨查询图层
        this.openLegendEvent(false, ['Rainfall24Layer', 'Rainfall48Layer', 'Rainfall72Layer', 'RainfallBefore24Layer', 'RainfallLayer']);
        // 关闭河网水系查询
        this.getComponent_AreaSelectJudgement().unload();
        const self: any = this;
        this.getComponent_RiverNetworkJudgement().on('watershedClick', (res: any) => {
            if (res && self.isShow) {
                self.keyWord = res.name;
                self.drawAndLocate(res.geom, res.name, 'WatershedLayer', false);
            }
        });

    }
    private beforeDestroy() {
        this.getComponent_RiverNetworkJudgement().off('watershedClick');
    }
}
</script>

<style lang="less" scoped>

    @imgUrl: '../../../../assets/img/areaSelect';

    .WatershedTest {
        width: 100%;
        color: #fff;
    }

    /*头*/
    .ws-head {
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

    .ws-content {
        background: url("@{imgUrl}/bg_content.png") no-repeat;
        background-size: 100% 100%;
        padding: 10px 20px 6px 20px;

        & > .content {
            padding: 7px;
            box-shadow: 0 0 4px 1px rgba(10, 60, 77, 1);
            border-radius: 1px;

            & > .row {
                position: relative;
                display: flex;
                align-items: center;
                padding: 5px;
                border: 1px solid rgba(10, 60, 77, 1);
                border-radius: 3px;
                font-family: Microsoft YaHei, serif;
                font-size: 26px;

                .name {
                    width: 40%;
                    padding-left: 5px;
                    font-family: Microsoft YaHei, serif;
                }

                .value {
                    width: 60%;
                    font-weight: 200;
                    border: 1px solid #01BBF6;
                    border-radius: 5px;

                    /deep/ .el-input__inner {
                        font-family: Microsoft YaHei, serif;
                        font-size: 22px;
                    }

                    &:hover {
                        border: 1px solid rgb(238, 231, 80);
                        background: rgba(238, 231, 80, 0.2);
                    }

                    & .search-icon {
                        display: inline-block;
                        background: url("@{imgUrl}/search.png") no-repeat;
                        background-size: 100% 100%;
                        height: 39px;
                        width: 39px;
                        cursor: pointer;

                        &:hover {
                            background: url("@{imgUrl}/search_hover.png") no-repeat;
                        }
                    }
                }

                .search-results {
                    position: absolute;
                    background: url("../../../../assets/img/halfScreen/eventAndTopics/select_bg.png") no-repeat;
                    background-size: 100% 100%;
                    width: 60%;
                    top: 48px;
                    left: 40%;
                    font-size: 22px;
                    height: 200px;

                    .item {
                        display: flex;
                        justify-content: space-between;
                        cursor: pointer;
                        margin-top: 10px;

                        .child-item {
                            padding: 5px 10px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }

                        &:hover {
                            background: url("@{imgUrl}/seleted.png") no-repeat;
                            background-size: 100% 100%;
                            color: rgb(238, 231, 80);
                        }

                    }

                    /*滚动条样式*/
                    /deep/ .el-scrollbar {
                        height: 200px;
                    }
                    /deep/ .el-scrollbar__bar.is-vertical > div {
                        background-image: linear-gradient(0deg,
                        #0a7ccc 0%,
                        #06b4d1 52%,
                        #02ebd5 100%);
                    }
                    /deep/ .el-scrollbar__thumb:hover {
                        background-image: linear-gradient(0deg,
                        #0a7ccc 0%,
                        #06b4d1 52%,
                        #02ebd5 100%);
                    }
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
    .ws-close {
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

    /*底*/
    .ws-bottom {
        background: url("@{imgUrl}/bg_bottom.png") no-repeat;
        background-size: 100% 100%;
        height: 31px;
    }
</style>
