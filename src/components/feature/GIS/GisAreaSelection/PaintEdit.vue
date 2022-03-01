<template>
    <div class="PaintEidt">
        <div class="ws-head">
            <p class="title">编辑</p>
        </div>
        <i class="ws-close" @click="closePanel"></i>
        <div class="ws-content">
            <div class="content" :class="showTip ? 'tip' : ''">
                <li class="row">
                    <span class="name">线宽</span>
                    <span class="value">
                       <span class="pre">1</span>
                       <span class="center">
                           <el-slider class="csmMySlider"
                                      :min="1"
                                      :max="5"
                                      @change="editPlot('linewidth', symbol.linewidth)"
                                      v-model="symbol.linewidth">
                           </el-slider>
                       </span>
                       <span class="next">5</span>
                    </span>
                </li>
                <li class="row">
                    <span class="name">边框色</span>
                    <span class="value">
                       <span class="color-chose">
                           <el-color-picker
                                   class="csmMyColorPicker"
                                   @change="editPlot('borderColor', symbol.borderColor)"
                                   v-model="symbol.borderColor">
                           </el-color-picker>
                       </span>
                       <span class="color-value">
                           <el-input class="csmMyInput-noBg"
                                     @change="editPlot('borderColor', symbol.borderColor)"
                                     v-model="symbol.borderColor">
                           </el-input>
                       </span>
                    </span>
                </li>
                <li class="row">
                    <span class="name">边框透明度</span>
                    <span class="value">
                       <span class="pre">0</span>
                       <span class="center">
                           <el-slider class="csmMySlider"
                                      :min="0"
                                      :max="255"
                                      @change="editPlot('borderOpacity', symbol.borderOpacity)"
                                      v-model="symbol.borderOpacity">
                           </el-slider>
                       </span>
                       <span class="next">255</span>
                    </span>
                </li>
                <li class="row">
                    <span class="name">填充色</span>
                    <span class="value">
                       <span class="color-chose">
                           <el-color-picker
                                   class="csmMyColorPicker"
                                   @change="editPlot('fillColor', symbol.fillColor)"
                                   v-model="symbol.fillColor">
                           </el-color-picker>
                       </span>
                       <span class="color-value">
                           <el-input class="csmMyInput-noBg"
                                     @change="editPlot('fillColor', symbol.fillColor)"
                                     v-model="symbol.fillColor">
                           </el-input>
                       </span>
                    </span>
                </li>
                <li class="row">
                    <span class="name">填充透明度</span>
                    <span class="value">
                       <span class="pre">0</span>
                       <span class="center">
                           <el-slider class="csmMySlider"
                                      :min="0"
                                      :max="255"
                                      @change="editPlot('fillOpacity', symbol.fillOpacity)"
                                      v-model="symbol.fillOpacity">
                           </el-slider>
                       </span>
                       <span class="next">255</span>
                    </span>
                </li>
                <li class="row">
                    <span class="name">名称</span>
                    <span class="value">
                       <el-input class="csmMyInput-noBg input-value"
                                 placeholder="请输入"
                                 @change="editPlot('inputDesc', symbol.inputDesc)"
                                 v-model="symbol.inputDesc">
                       </el-input>
                    </span>
                </li>
            </div>
            <div class="submit">
                <el-button class="csmMySlider" @click="storePaintClick()">保存绘制</el-button>
                <el-button class="csmMySlider" :disabled="!isSelected" @click="disposalClick()">进入处置</el-button>
            </div>
        </div>

        <div class="ws-bottom"></div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

@Component({
    name: 'PaintEdit',
    components: {},
})
export default class PaintEidt extends Vue {

    @Prop({default: 5}) private pageSize: any;
    private symbol: any = {};
    private id: string = '';
    private businessId: string = '';

    private isSelected: boolean = false;
    private showTip: boolean = false;

    private editPlot() {
        this.messsageBus.emit('businessPlotEdit', {
            id: this.id,
            symbol: this.symbol,
        });
    }


    // 保存绘制
    private storePaintClick() {
        // 保存绘制
        this.isSelected = true;

        // 是否显示输入名称提示
        if (this.symbol.inputDesc.trim().length) {
            this.showTip = false;

            // 保存绘制
            this.messsageBus.emit('businessPlotSave', {
                businessId: this.businessId,
                name: this.symbol.inputDesc,
                page: 1,
                pageSize: this.pageSize,
            });
        } else {
            this.showTip = true;
        }
    }

    // 进入处置
    private disposalClick() {
        // 是否显示输入名称提示
        if (this.symbol.inputDesc.trim().length) {
            this.showTip = false;

            // 进入处置
            this.messsageBus.emit('businessPlotStartDisposal', {
                businessId: this.businessId,
                name: this.symbol.inputDesc,
                flag: true, // 如果flag=true 自动保存 则name必须传值
            });
        } else {
            this.showTip = true;
        }
    }

    // 关闭当前窗口
    private closePanel() {
        this.$emit('paintClose', false);
        this.showTip = false;
    }


    private created() {
        // 地图绘制完成后打开编辑面板
        const that = this;
        this.messsageBus.on('businessPlotStartEdit', (plot: any) => {
            that.$emit('paintClose', true);
            that.symbol = plot.symbol;
            that.id = plot.id;
            that.businessId = plot.businessId;
        });
    }

}
</script>

<style lang="less" scoped>

    @imgUrl: '../../../../assets/img/areaSelect';

    .PaintEidt {
        position: absolute;
        width: 100%;
        color: #fff;
    }

    .tip:after {
        position: relative;
        content: "请输入名称!";
        left: 36%;
        font-family: Microsoft YaHei, serif;
        color: #F44336;
        font-size: 21px;
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
            padding: 7px 7px 1px 7px;
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
                margin-bottom: 7px;

                .name {
                    width: 35%;
                    padding-left: 5px;
                    font-family: Microsoft YaHei, serif;
                }

                .value {
                    width: 65%;
                    font-weight: 200;
                    display: flex;
                    font-size: 22px;

                    /deep/ .el-input__inner {
                        font-family: Microsoft YaHei, serif;
                        font-size: 22px;
                    }

                    & .pre {
                        width: 8%;
                        text-align: left;
                        color: #cccccc;
                        line-height: 38px;
                    }
                    & .center {
                        width: 74%;
                    }
                    & .next {
                        width: 18%;
                        text-align: center;
                        color: #cccccc;
                        line-height: 38px;
                    }

                    & .color-chose {
                        width: 40%;
                        position: relative;
                    }
                    & .color-value {
                        width: 60%;
                        border: 1px solid #01BBF6;
                        border-radius: 5px;
                    }

                    & .input-value {
                        border: 1px solid #01BBF6;
                        border-radius: 5px;
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
