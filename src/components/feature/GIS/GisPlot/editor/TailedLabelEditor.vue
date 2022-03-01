<template>
    <div class="emap_control_eMapPanelEdit_inner">
            <el-scrollbar view-style="max-height:420px">
                <div class="panelEditMain ">
                    <div class="panelEditMain_item">
                        <span >文本</span>
                        <div class="panelInput fontTextarea customTextarea">
                                <div  class="customTextarea_wrap" >
                                    <el-input size="medium "
                                        type="textarea"
                                        :autosize="{minRows:3,maxRows:3}"
                                        :maxlength = number
                                        v-model="data.data.symbol.inputFont"
                                        @focus='focus'
                                        @blur='blur'
                                        class="el-input-color2"
                                    >
                                    </el-input>
                                    <span>({{data.data.symbol.inputFont.length}}/{{number}})</span>
                                </div> 
                        </div>

                    </div>
                    <div class="panelEditMain_item">
                        <span >字体</span>
                        <div class="panelInput">
                            <el-select size="mini"
                                placehoder="请选择"
                                v-model="data.data.symbol.fontFamilyLi"
                                class="el-input-color"
                            >
                            
                                <el-option  value="宋体"><span class="f-small">宋体</span></el-option>
                                <el-option  value="黑体"><span class="f-small">黑体</span></el-option>
                                <el-option value="隶书"><span class="f-small">隶书</span></el-option>
                                <el-option value="楷体"><span class="f-small">楷体</span></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span >字体颜色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    v-model="data.data.symbol.textColor"
                                    color-format="hex"
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span >字体大小</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="255"
                                    v-model.number="data.data.symbol.fontSizeLi"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>线宽</span>
                        <div class="sliderClass slider">
                            <el-slider 
                                :min=1
                                :max=150
                                v-model.number="data.data.symbol.linewidth"
                                :show-input="true"
                                :show-tooltip="false"
                                :show-input-controls="false"
                            ></el-slider>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>线条颜色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    v-model="data.data.symbol.lineColor"
                                    color-format="hex"
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>边框宽</span>
                        <div class="sliderClass slider">
                            <el-slider 
                                :min=1
                                :max=150
                                v-model.number="data.data.symbol.borderWidth"
                                :show-input="true"
                                :show-tooltip="false"
                                :show-input-controls="false"
                            ></el-slider>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>边框色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    v-model="data.data.symbol.borderColor"
                                    color-format="hex"
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>填充色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    v-model="data.data.symbol.fillColor"
                                    color-format="hex"
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>透明度</span>
                        <div class="sliderClass slider">
                            <el-slider 
                                :min=0
                                :max=100
                                v-model.number="iconOpacity"
                                :show-input="true"
                                :show-tooltip="false"
                                :show-input-controls="false"
                            ></el-slider>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span >说明</span>
                    <div class="panelInput panelTextarea  customTextarea">
                            <div  class="customTextarea_wrap" >
                                <el-input size="medium "
                                        type="textarea"
                                        maxlength = 100
                                        :autosize="{minRows:3,maxRows:3}"
                                        v-model="data.data.symbol.inputDesc"
                                        class="el-input-color"
                                >
                                </el-input>
                            </div>
                        </div>
                    </div>

                </div>
            </el-scrollbar>
        </div>
</template>
<script lang="ts">
import { Vue, Component, Prop , Watch, Emit} from 'vue-property-decorator';
@Component({})
export default class TailedLabelEditor extends Vue {
    @Prop()  public data?: any;
    private iconOpacity = 70;
    private number: any = 100;
    private mounted() {
        this.iconOpacity = Math.round(this.data.data.symbol.iconOpacity * ( 100 / 255 ));
        if (this.data.data.symbol.inputFont === '') {
            this.data.data.symbol.inputFont = '自定义文本内容';
        }
    }
    private updated() {
        this.data.data.symbol.iconOpacity = Math.round(this.iconOpacity * ( 255 / 100 ));
    }

    private focus() {
        if (this.data.data.symbol.inputFont === '自定义文本内容') {
            this.data.data.symbol.inputFont = '';
        }
    }

    private blur() {
        if (this.data.data.symbol.inputFont === '') {
            this.data.data.symbol.inputFont = '自定义文本内容';
        }
    }

    private beforeUpdate() {
        const str: any = this.data.data.symbol.inputFont;
        const arr = str.split(/[\n]/);
        let last: any = arr.splice(arr.length - 1, 1)[0];
        let newStr: any = '';
        if (arr.length > 0) {
            newStr = arr.join('\n');
            newStr += '\n';
        }
        while ( last.length > 20) {
            const substr: any = last.substr(0, 20);
            newStr += substr;
            newStr += '\n';
            last = last.substr(substr.length);
        }
        newStr += last;
        this.data.data.symbol.inputFont = newStr;
    }
}
</script>