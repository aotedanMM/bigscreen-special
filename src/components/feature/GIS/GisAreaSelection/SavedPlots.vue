<template>
    <div class="SavedPlots">
        <div class="sp-head">
            <p class="title">已保存的标绘</p>
        </div>
        <i class="sp-close" @click="closePanel"></i>
        <div class="sp-content">
            <div class="search">
                <el-input class="csmMyInput-noBg"
                          type="text"
                          v-model="keyWord"
                          placeholder="请输入查询内容">
                    <i slot="suffix" class="search-icon" @click="searchPlots()"></i>
                </el-input>
            </div>
            <div class="table">
                <li class="row"
                    v-for="(plot, i) in plots"
                    :class="index === i ? 'itemHover': ''">

                    <span class="name" @click="plotClick(i, plot)">{{plot.val}}</span>
                    <span class="disposal" @click="disposalClick()">进入处置</span>
                    <span class="delete" @click="deleteClick(plot)">删除</span>
                </li>
            </div>
            <el-pagination v-if="paginationObj.total"
                           class="constomMyElPage"
                           small
                           :pager-count="5"
                           @current-change="handleCurrentChange"
                           :current-page.sync="paginationObj.currentPage"
                           :page-size="paginationObj.pageSize"
                           layout="prev, pager, next"
                           :total="paginationObj.total"
            ></el-pagination>
        </div>

        <div class="sp-bottom"></div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import PaintEdit from './PaintEdit.vue';

@Component({
    name: 'SavedPlots',
    components: {PaintEdit},
})
export default class SavedPlots extends Vue {

    @Prop({default: 5}) private pageSize: any;
    private plots: any[] = [];
    private keyWord: string = '';
    private paginationObj: any = {
        currentPage: 1,
        pageSize: this.pageSize,
        total: 110,
    };
    private index: number = -1;

    // 展示标绘信息
    private defaultPlots() {
        this.messsageBus.emit('businessPlotList', {
            businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
            page: this.paginationObj.currentPage,
            pageSize: this.paginationObj.pageSize,
        });
    }

    // 查询展示标绘信息
    private searchPlots() {
        // 隐藏旧条目
        this.clearMapPlot();
        // 通知查询标绘信息
        this.messsageBus.emit('businessPlotListSearch', {
            businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
            name: this.keyWord,
            page: this.paginationObj.currentPage,
            pageSize: this.paginationObj.pageSize,
        });
    }

    private plotClick(i: number, plot: any) {
        if (this.index !== i) {
            // 隐藏旧条目
            this.clearMapPlot();

            // 展示最新的图形
            this.messsageBus.emit('businessPlotSchemaShow', {
                schemaId: plot.id,
            });
            // 高亮新的条目
            this.index = i;
        } else {
            this.clearMapPlot();
        }
    }

    // 进入处置
    private disposalClick() {
        // 进入处置
        const plot = this.plots[this.index];
        this.messsageBus.emit('businessPlotStartDisposal', {
            businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
            name: plot.val,
            flag: false,
        });
    }

    // 删除标绘
    private deleteClick(plot: any) {
        // 通知删除标绘
        this.messsageBus.emit('businessPlotSchemaDelete', {
            businessId: '8512d11e-0093-f75b-4e1c-0933748fba8a',
            schemaId: plot.id,
            page: this.paginationObj.currentPage,
            pageSize: this.paginationObj.pageSize,
        });
    }

    // 分页
    private handleCurrentChange() {
        this.clearMapPlot();
        this.index = -1;
        if (this.keyWord.trim().length) {
            this.searchPlots();
        } else {
            this.defaultPlots();
        }

    }

    // 关闭当前窗口
    private closePanel() {
        this.$emit('plotClose', {
            current: false,
            parent: true,
        });
        this.clearMapPlot();
    }

    // 清除地图上的标绘图形
    private clearMapPlot() {
        if (this.index !== -1) {
            // 清除之前的图形
            this.messsageBus.emit('businessPlotSchemaClean', {
                schemaId: this.plots[this.index].id,
            });
            // 不高亮任何条目
            this.index = -1;
        }
    }

    private created() {
        this.messsageBus.on('refreshBusinessPlotSchemaList', (list: any) => {
            if (list.data.listTotal) {
                this.plots = list.data.data;
                this.paginationObj.total = list.data.listTotal;
                // this.index = list.flag ? 0 : -1;
            }
        });
        this.defaultPlots();
    }
}
</script>

<style lang="less" scoped>
    @imgUrl: '../../../../assets/img/areaSelect';

    .itemHover {
        border: 1px solid rgb(242, 206, 88) !important;
        box-shadow: inset 0 0 10px rgba(242, 206, 88, 0.8);
        color: #F5EDC0;
    }

    .SavedPlots {
        position: absolute;
        right: -100%;
        width: 100%;
        color: #fff;
    }

    /*头*/
    .sp-head {
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

    .sp-content {
        background: url("@{imgUrl}/bg_content.png") no-repeat;
        background-size: 100% 100%;
        padding: 10px 20px 6px 20px;
        height: 460px;
        margin-bottom: -1px;

        & > .search {
            font-weight: 200;
            border: 1px solid #01BBF6;
            border-radius: 3px;

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

        & > .table {
            margin: 15px 0;
            height: 350px;

            & > .row {
                display: flex;
                margin-top: 3px;
                padding: 15px 10px;
                border-radius: 3px;
                background: rgba(10, 60, 77, 0.3);
                border-bottom: 1px solid rgba(10, 60, 77, 0.6);
                font-family: Microsoft YaHei, serif;
                font-size: 26px;

                &:hover {
                    border: 1px solid rgb(242, 206, 88) !important;
                    box-shadow: inset 0 0 10px rgba(242, 206, 88, 0.8);
                    color: #F5EDC0;
                }

                .disposal, .delete {
                    color: #83CBD4;
                    cursor: pointer;
                }

                .name {
                    width: 55%;
                    cursor: default;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .disposal {
                    width: 30%;
                    &:hover {
                        font-weight: bolder;
                    }
                }

                .delete {
                    width: 15%;
                    &:hover {
                        font-weight: bolder;
                    }
                }
            }
        }
    }

    /*关闭按钮*/
    .sp-close {
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

    .sp-prop {
        position: absolute;
        right: 500px;
        top: 100px;
        width: 470px;
    }

    /*底*/
    .sp-bottom {
        background: url("@{imgUrl}/bg_bottom.png") no-repeat;
        background-size: 100% 100%;
        height: 31px;
    }
</style>
