<template>
    <div id="RiverNetwork" v-show="isShow">
        <div class="ws-head">
            <p class="title"> 河网水系查询</p>
        </div>
        <i class="ws-close" @click="closePanel(false)"></i>
        <div class="ws-content">
            <div class="content" @mouseleave="handleMouseleave">
                <li class="row">
                    <span class="name">河流</span>
                    <span class="value">
                       <el-input class="csmMyInput-noBg"
                                 ref="input_opt"
                                 type="text"
                                 v-model="keyWord"
                                 @input="getSearchFn"
                                 placeholder="请输入河流名称" >
                           <i slot="suffix" class="search-icon" @click="searchClick()"></i>
                       </el-input>
                    </span>
                    <span class="search-results" v-if="isShowHistorical">
                        <el-scrollbar class="cmp-scrollbar-y"  >
                            <div class="row">
                                <div class="item" v-for="res in riverData" @click="resultItemClick(res)">
                                    <span class="child-item">{{res.name}}</span>
                                     <span class="child-item">{{res.level}}级</span>
                                </div>
                            </div>
                        </el-scrollbar>
                    </span>
                </li>
                <li class="row">
                    <span class="name">流经区域</span>
                    <div class="listDistrict-input-content" @click="isSelectBolFn()">
                        <el-input class="csmMyInput" type="text" :class="{' csmMyInput-cur': isSelectBol }" readonly
                                  v-model.trim="selectWord"
                                  :title="selectWord.trim()">
                            <i v-if="false" slot="suffix" :class="isSelectBol? 'selcetIconBot':  'selcetIconTop'"></i>
                        </el-input>
                    </div>
                    <span class="search-results" v-show="showResult">
                        <el-scrollbar class="cmp-scrollbar-y" >
                            <div class="row">
                                <div class="item" v-for="res in area" @click="areaItemClick(res)">
                                    <span  class="child-item">{{res.districtName}}</span>
                                 </div>
                          </div>
                        </el-scrollbar>
                    </span>
                </li>
                <li class="row">

                    <span class="name">河流两边范围</span>
                    <div class="listDistrict-input" >
                        <el-input class="csmMyInput-noBg" type="text" v-model="radius">
                        </el-input>
                    </div>
                    <span class="kilometer">KM</span>
                </li>
            </div>

            <div class="submit">
                <el-button class="csmMySlider" @click="queryClickFn">查询</el-button>
                <el-button class="csmMySlider" :disabled="!isSelectRiver"  @click="disposalClick()" >进入处置</el-button>
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
    name: 'RiverNetwork',
    mixins: [GisAreaSelectEvent, FloodLegendEvent],
    components: {},
})
export default class RiverNetwork extends Vue {
    // @Prop() public visible: any;
    // public isShow: any = this.visible;
    @Prop({default: 'RiverNetwork'}) public eventComp: any;

    private isShow: any = false;
    private isShowHistorical = false; // 河流弹框
    private isSelectBol: boolean = false; // 流经区域按钮样式
    private isSelectRiver: boolean = false; // 是否显示处置按钮
    private selectWord = '';
    private keyWord: string = '';
    private radius: string = '';
    private showResult: boolean = false;
    private riverId: string = '';   // 河流id
    private districtCode: string = ''; // 流经区域编码
    private area: any  = [];
    private riverData: any = [];
    private isCollection: number = 0;  // 是否收藏
    private selecttypecode: string = '24';  // 洪水事件
    private consecutiveInputTimer: any = null; // 输入框防抖
    private timestamp: any = null;
    @Watch('radius')
    private formatRadius(radius: any) {
        const str = radius;
        // 验证为非负浮点数
        const pattern = /^\d+(\.\d+)?$/; // 非负浮点数
        const flag = pattern.test(str);
        if ( flag ) {
            this.radius = str;
            return str;
        }
        // 验证整数，但是恰好以.为结尾
        const patternPoint =  /^\d+(\.)$/; // 例如12.
        const flagPoint = patternPoint.test(str);
        if ( flagPoint ) {
            this.radius = str;
            return str;
        }

        const floatVal = parseFloat(str);
        const nanFlag = isNaN(floatVal);
        if (!nanFlag) {
            this.radius = floatVal + '';
            return floatVal;
        }
        this.radius = '';
        return '';
    }

    // 搜索查询
    private searchClick() {
        this.showResult = false;
        const optsRiverList = {
            keyWord: this.keyWord,
            pageSize: 5,
            pageIndex: 1,
        };
        const self: any = this;
        // 河流列表查询
        server.floodServer.getRiversList(optsRiverList).then((res: any) => {
            if (res && res.data && res.data.length > 0) {
                this.isShowHistorical = true;
                self.riverData = res.data;
            }

        });
    }

    // 输入查询
    private getSearchFn() {
        const timestamp = new Date().getTime();
        this.timestamp  = timestamp;
        this.riverData = [];
        this.isShowHistorical = false;
        this.showResult = false;
        const optsWatershedList = {
            keyWord: this.keyWord,
            pageSize: 5,
            pageIndex: 1,
        };
        const self: any = this;
        clearTimeout(this.consecutiveInputTimer);

        this.consecutiveInputTimer = setTimeout(function() {
            self.getRiversList(optsWatershedList, timestamp);
        }, 500);
    }

    // 原来的查询方法
    private async getRiversList(optsWatershedList: any, timestamp: number) {
        if (timestamp < this.timestamp) {
            return;
        }
        const self: any = this;
        await server.floodServer.getRiversList(optsWatershedList).then((res: any) => {
            if (timestamp === this.timestamp && res && res.data && res.data.length > 0) {
                this.isShowHistorical = true;
                self.riverData = res.data;
            }
        });
    }

    // 下拉列表点击
    private resultItemClick(res: any) {
        this.keyWord = res.name;
        this.riverId = res.id;
        this.isShowHistorical = false;
        // this.selectWord = '';
        if (res.provinces) {
            const districtNameArr = res.provinces.map((mitem: any, mindex: any) => {
                return mitem.districtName;
            });
            this.selectWord = districtNameArr.join(',');
        }
    }

    // 流经区域选择
    private areaItemClick(res: any) {
        this.selectWord = res.districtName;
        this.districtCode = res.districtCode;
        this.showResult = false;
        this.isSelectBol = !this.isSelectBol;
    }

    // 下拉框展开/收起
    private isSelectBolFn() {
        return ;
        // this.riverData.forEach((item: any) => {
        //     if (item.id === this.riverId) {
        //         this.showResult = true;
        //         this.isSelectBol = !this.isSelectBol;
        //         this.area = item.provinces;
        //         this.radius = item.radius;
        //     }
        // });
    }

    // 处理鼠标移出事件
    private  handleMouseleave() {
        this.isShowHistorical = false;
        this.showResult = false;
        (this.$refs as any).input_opt.blur();
    }

    // 点击查询按钮
    private queryClickFn() {
        this.radius = this.radius + '';
        // 空串
        if (!this.radius) {
            return ;
        }
        // 12.这种
        if (this.radius.charAt(this.radius.length - 1) === '.') {
            return ;
        }
        // 大于0,这段代码可以不写，因为负数输不上
        if (parseFloat(this.radius) <= 0) {
            return ;
        }
        const optsRiverDetail = {
            id: this.riverId,
            districtCode: this.districtCode,
        };
        const self: any = this;
        // 河流详情查询
        server.floodServer.getRiver(optsRiverDetail).then((res: any) => {
            if (res && res.geom) {
                self.isSelectRiver = true;
                self.keyWord = res.name;
                // self.selectWord = res.provinces[0].districtName;
                self.drawAndLocate1(res.geom, res, 'RiverLayer', true, Number(self.radius) * 1000);
            }

        });
    }

    // @Watch('visible')
    // private watchVisible() {
    //     this.isShow = this.visible;
    // }

    // 关闭河网水系查询面板
    private closePanel(showFlag: boolean) {
        this.isShow = showFlag;
        if (!showFlag) {
           this.getComponent_AreaSelectJudgement()._colseButton();
        }
        // 初始化表单
        // this.selectWord = '';
        // this.keyWord = '';
        // this.radius = '';
        // this.riverData = [];
        // this.$emit('compClick');
        // this.getComponent_AreaSelectJudgement().unload();
    }

    // 进入处置
    private disposalClick() {
        this.isShow = false;
        // 初始化表单
        this.selectWord = '';
        this.keyWord = '';
        this.radius = '';
        this.riverData = [];
        this.$emit('compClick');
        // 处置方法
        this.disposeHandler(this.isCollection, this.selecttypecode);
    }


    private created() {
        // 关闭暴雨查询图层
        this.openLegendEvent(false, ['Rainfall24Layer', 'Rainfall48Layer', 'Rainfall72Layer', 'RainfallBefore24Layer', 'RainfallLayer']);
        // 关闭流域查询
        this.getComponent_AreaSelectJudgement().unload();
        const self: any = this;
        this.getComponent_RiverNetworkJudgement().on('riverClick', (res: any) => {
            if (res) {
                self.isSelectRiver = true;
                self.keyWord = res.name;
                if (res.provinces) {
                    const districtNameArr = res.provinces.map((mitem: any, mindex: any) => {
                        return mitem.districtName;
                    });
                    // self.selectWord = res.provinces[0].districtName;
                    self.selectWord = districtNameArr.join(',');
                }
                self.radius = res.radius;
                self.riverId = res.id;
                self.drawAndLocate1(res.geom, res, 'RiverLayer', false, Number(res.radius) * 1000);
            }
        });

        this.getComponent_AreaSelectJudgement().on('showRiverPanel', (flagRes: any) => {
            // 1表示显示，2表示隐藏
            self.closePanel(flagRes === 1);
        });
    }
    private beforeDestroy() {
        this.getComponent_RiverNetworkJudgement().off('riverClick');
        this.getComponent_AreaSelectJudgement().off('showRiverPanel');
        // 初始化表单
        this.selectWord = '';
        this.keyWord = '';
        this.radius = '';
        this.riverData = [];
        // this.$emit('compClick');
        this.getComponent_AreaSelectJudgement().unload();
    }

}
</script>

<style lang="less" scoped>
    @imgUrl: '../../../../assets/img/areaSelect';

    .RiverNetwork {
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
                    /*border: 1px solid #01BBF6;*/
                    border: 1px solid  rgba(43,246,254,.5);
                    border-radius: 5px;
                    margin-left: 33px;

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

                .listDistrict-input-content {
                    width: 62%;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: -7px;
                    padding-left: 33px;

                    .selcetIconTop {
                        display: inline-block;
                        width: 35px;
                        height: 30px;
                        background: url("../../../../assets/img/halfScreen/halflist/select2bg.png") no-repeat;
                        background-size: 100% 100%;
                        margin: 5px -7px 0 0;
                        cursor: pointer;
                    }
                    .selcetIconBot {
                        display: inline-block;
                        width: 35px;
                        height: 30px;
                        background: url("../../../../assets/img/halfScreen/halflist/selcet1bg.png") no-repeat;
                        background-size: 100% 100%;
                        margin: 5px -7px 0 0;
                        cursor: pointer;
                    }

                }
                .listDistrict-input{
                    width: 40%;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: 18px;
                    border: 1px solid  rgba(43,246,254,.5);
                    /*border: 1px solid  #01BBF6;*/
                }
                .kilometer{
                    padding-left: 12px;
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
                    z-index: 5;

                    .item {
                        display: flex;
                        justify-content: space-between;
                        cursor: pointer;
                        margin-top: 10px;

                        .child-item{
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
            margin-top: 6px;
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
        height: 8px;
    }
</style>
