<template>
    <div class="emap_control_eMapPanelEdit" id="eMapPanelEdit" :style="options.editorStyle" >

        <div class="plotCtrlTop eMapPanelEditTop">
            <div class="topTitle">编辑</div>
            <div class="topClose" @click.stop="closeClick($event)"></div>
        </div>
        <div class="emap_control_eMapPanelEdit_inner">
            <el-scrollbar view-style="max-height:420px">
                <div class="panelEditMain" v-show="editSymbolType==0">
                    <div class="panelEditMain_item">
                        <span>线宽(0~150)</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="150"
                                    v-model.number="linewidth"
                                    @input="inputLinewidth"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>边框色</span>
                        <div class="panelInput">
                            <!-- <el-input size="mini"
                                    type="color"
                                    id="borderColor"
                                    v-model="editObj0.borderColor"
                                    class="el-input-color"
                            >
                            </el-input> -->
                            <el-color-picker
                                    id="borderColor"
                                    v-model="editObj0.borderColor"
                                    show-alpha
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item" v-show="isShowFill">
                        <span>填充色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    id="fillColor"
                                    v-model="editObj0.fillColor"
                                    color-format="hex"
                                    show-alpha
                                    >
                            </el-color-picker>
                            <!-- <el-input size="mini"
                                    type="color"
                                    id="fillColor"
                                    v-model="editObj0.fillColor"
                                    class="el-input-color"
                            >
                            </el-input> -->
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span v-show="!isShowFill">线样式</span>
                        <span v-show="isShowFill">边框样式</span>
                        <div class="panelInput">
                            <el-select size="mini"
                                    placehoder="请选择"
                                    v-model="editObj0.lineStyle"
                                    class="el-input-color"
                            >
                                <el-option  value="0"><span style="font-size:12px!important;">虚线</span></el-option>
                                <el-option value="5"><span style="font-size:12px!important;">实线</span></el-option>
                                <el-option value="3"><span style="font-size:12px!important;">点状</span></el-option>
                                <el-option value="1"><span style="font-size:12px!important;">点划线</span></el-option>
                                <el-option value="2"><span style="font-size:12px!important;">双点划线</span></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="panelEditMain_item" v-show="isShowOpacity">
                        <span>透明度(0~100)</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="100"
                                    v-model.number="iconOpacity"
                                    @input="inputIconOpacity"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>

                    </div>
                    <div class="panelEditMain_item">
                        <span>说明</span>
                        <div class="panelInput panelTextarea customTextarea" >
                            <div class="customTextarea_wrap">
                                <el-input size="medium "
                                        type="textarea"
                                        maxlength = 100
                                        :autosize="{minRows:3,maxRows:3}"
                                        v-model="inputDesc"
                                        @input="inputDescWatch"
                                        class="el-input-color"
                                >
                                </el-input>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="panelEditMain " v-show="editSymbolType==1">
                    <div class="panelEditMain_item">
                        <span class="fontEditCont">文本</span>
                    <div class="panelInput fontTextarea customTextarea">
                            <div class="customTextarea_wrap">
                                <el-input size="medium "
                                        type="textarea"
                                        maxlength = 100
                                        :autosize="{minRows:3,maxRows:3}"
                                        v-model="editObj1.inputFont"
                                        class="el-input-color2"
                                >
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span class="fontEditCont">字体</span>
                        <div class="panelInput">
                            <el-select size="mini"
                                    placehoder="请选择"
                                    v-model="editObj1.fontFamilyLi"
                                    @change="fontFamilyChange"
                                    class="el-input-color"

                            >
                                <el-option value="SimSun"><span style="font-size:12px!important;">宋体</span></el-option>
                                <el-option value="SimHei"><span style="font-size:12px!important;">黑体</span></el-option>
                                <el-option value="FangSong"><span style="font-size:12px!important;">仿宋</span></el-option>
                                <el-option value="KaiTi"><span style="font-size:12px!important;">楷体</span></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span class="fontEditCont">字体颜色</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="color"
                                    id="textColor"
                                    v-model="editObj1.textColor"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">

                        <span class="fontEditCont">字体大小</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="255"
                                    id="fontSizeLi"
                                    v-model.number="editObj1.fontSizeLi"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>

                    </div>
                    <div class="panelEditMain_item">
                        <span class="fontEditCont">说明</span>
                        <div class="panelInput fontTextarea customTextarea">
                            <div class="customTextarea_wrap" >
                                <el-input size="medium "
                                        type="textarea"
                                        maxlength = 50
                                        :autosize="{minRows:3,maxRows:3}"
                                        v-model="inputDesc"
                                        @input="fontDescWatch"
                                        class="el-input-color2"
                                >
                                </el-input>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="panelEditMain " v-show="editSymbolType==2">
                    <div class="panelEditMain_item">
                        <span >文本</span>

                    
                        <div class="panelInput fontTextarea customTextarea">
                                <div  class="customTextarea_wrap" >

                                <el-input size="medium "
                                        type="textarea"
                                        :autosize="{minRows:3,maxRows:3}"
                                        maxlength = 100
                                        v-model="editObj2.inputFont"
                                        class="el-input-color2"
                                >
                                </el-input>
                                    </div> 
                        </div>

                    </div>
                    <div class="panelEditMain_item">
                        <span >字体</span>
                        <div class="panelInput">
                            <el-select size="mini"
                                    placehoder="请选择"
                                    v-model="editObj2.fontFamilyLi"
                                    @change="fontFamilyChange"
                                    class="el-input-color"

                            >
                                <el-option  value="宋体"><span style="font-size:12px!important;">宋体</span></el-option>
                                <el-option value="黑体"><span style="font-size:12px!important;">黑体</span></el-option>
                                <el-option  value="隶书"><span style="font-size:12px!important;">隶书</span></el-option>
                                <el-option  value="楷体"><span style="font-size:12px!important;">楷体</span></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span >字体颜色</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="color"
                                    id="text2Color"
                                    v-model="editObj2.textColor"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">

                        <span >字体大小</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="255"
                                    id="font2SizeLi"
                                    v-model.number="editObj2.fontSizeLi"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>

                    </div>
                    <div class="panelEditMain_item">
                        <span>线宽(0~150)</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="150"
                                    v-model.number="text2Linewidth"
                                    @input="inputText2Linewidth"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>线条颜色</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="color"
                                    id="text2LineColor"
                                    v-model="editObj2.lineColor"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>边框宽(0~150)</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="150"
                                    v-model.number="text2BorderWidth"
                                    @input="inputText2BorderWidth"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>边框色</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="color"
                                    id="text2borderColor"
                                    v-model="editObj2.borderColor"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>填充色</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="color"
                                    id="text2FillColor"
                                    v-model="editObj2.fillColor"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>透明度(0~255)</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="255"
                                    v-model.number="text2Opacity"
                                    @input="inputText2Opacity"
                                    class="el-input-color"
                            >
                            </el-input>
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
                                        v-model="text2Desc"
                                        @input="text2DescWatch"
                                        class="el-input-color"
                                >
                                </el-input>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="panelEditMain " v-show="editSymbolType==3">
                    <div class="panelEditMain_item">
                        <span>比例(0~10]</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="10"
                                    v-model.number="scale"
                                    @input="inputTextScale"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>旋转角度[0~360]</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="360"
                                    v-model.number="rotation"
                                    @input="inputTextRotation"
                                    class="el-input-color"
                            >
                            </el-input>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>透明度(0~255)</span>
                        <div class="panelInput">
                            <el-input size="mini"
                                    type="number"
                                    min="0"
                                    max="255"
                                    v-model.number="text3Opacity"
                                    @input="inputText3Opacity"
                                    class="el-input-color"
                            >
                            </el-input>
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
                                        v-model="text3Desc"
                                        @input="text3DescWatch"
                                        class="el-input-color"
                                >
                                </el-input>
                            </div>
                        </div>
                    </div>

                </div>
                <button @click="remove()">删除</button>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop , Watch, Emit} from 'vue-property-decorator';
import './gisEmapPanelEdit.less';
import { Drag } from './toDrag';
import Editors from './editor/index';
@Component({
    components: Editors,
})
export default class EmapPanelEdit extends Vue {
    @Prop()  public eMapPanelEditObj?: any;
    @Prop()  public options?: any;

    public timer1: any;
    public timer2: any;
    public timer3: any;
    public timer4: any;
    public timer11: any;
    public timer12: any;
    public timer13: any;
    public timer14: any;
    private id: string = '';
    private editObj0: any = {
        /*         type:"",
                 linewidth:1,
                 iconOpacity:20,
                 borderColor:'#0000ff',
                 fillColor:'#0000ff',
                 inputDesc:'',
                 lineStyle:5,*/
    };
    private editObj1: any = {
        /*  type:"",
          textColor:'#555',
          fontDesc:'',
          inputFont:'文字示例',
          fontFamilyLi:'宋体',
          fontSizeLi:14,*/
    };
    private editObj2: any = {
        /*    type:"",
            inputFont:'文字示例',
            fontFamilyLi:'宋体',
            fontSizeLi:14,
            fontDesc:'',
            textColor:'#555',

            linewidth:1,
            lineColor:'#ffaeaa',
            iconOpacity:20,
            borderWidth:1,
            borderColor:'#13b5b1',
            fillColor:'#ffeda2',*/
    };
    private editObj3: any = {
        // scale :1,
        // iconOpacity:20,
        // inputDesc:'',
    };
    private linewidth = 1;
    private iconOpacity = 20;
    private inputDesc = '';
    private fontDesc = '';

    private text2Linewidth = 1;
    private text2Desc = '';
    private text2BorderWidth = 1;
    private text2Opacity = 20;

    // svg
    private scale = 1;
    private rotation = 0;
    private text3Desc = '';
    private text3Opacity = 0;

    private isShowOpacity = true;
    private isShowFill = false;
    private editSymbolType = -1;

    @Emit('deletPlot')
    public remove() {
        return this.id;
        // this.$confirm('是否删除标绘？?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning',
        // })
        // .then(() => {
        //     this.mapComponent.removeUnsaved(;
        //     this.$message({
        //         type: 'success',
        //         message: '删除成功!',
        //     });
        // })
        // .catch(() => {
        //     this.$message({
        //         type: 'info',
        //         message: '已取消删除',
        //     });
        // });
    }

    public colorRGBA(color: any) {
        if (color.indexOf('rgba') === -1) {
            return color;
        }
        const rgb = color.split(',');
        const r = parseInt(rgb[0].split('(')[1], 10);
        const g = parseInt(rgb[1], 10);
        const b = parseInt(rgb[2], 10);
        const a = parseInt(rgb[3].split(')')[0], 10);
        return {
            r,
            g,
            b,
            a,
        };
    }

    @Watch('editObj0', {deep: true})
    public onChange0(val: any) {
        val.fillColor = this.colorRGBA(val.fillColor);
        val.borderColor = this.colorRGBA(val.borderColor);
        const temp: any = {
            id: this.id,
            symbol: jQuery.extend(true, {}, val),
        };
        this.send(temp);

    }

    @Watch('editObj1', {deep: true})
    public onChange1(val: any) {
        const temp: any = {
            id: this.id,
            symbol: jQuery.extend(true, {}, val),
        };
        this.send(temp);
    }

    @Watch('editObj2', {deep: true})
    public onChange2(val: any) {
        const temp: any = {
            id: this.id,
            symbol: jQuery.extend(true, {}, val),
        };
        this.send(temp);
    }

    @Watch('editObj3', {deep: true})
    public onChange3(val: any) {
        const temp: any = {
            id: this.id,
            symbol: jQuery.extend(true, {}, val),
        };
        this.send(temp);
    }

    @Watch('eMapPanelEditObj', {deep: true})
    public onChange4(val: any) {
        if (val && val.data && val.data.id) {
            this.id = val.data.id;
            if (val.data.symbol.lineStyle) {
                val.data.symbol.lineStyle = val.data.symbol.lineStyle.toString();
            }
            if (val.key === 'SimpleLineSymbol') {
                this.editObj0 = Object.assign({}, val.data.symbol);
                this.linewidth = val.data.symbol.linewidth;
                this.iconOpacity = val.data.symbol.iconOpacity;
                this.inputDesc = val.data.symbol.inputDesc;
                this.editSymbolType = 0;
                this.$nextTick(() => {
                    this.isShowOpacity = true;
                    this.isShowFill = false;
                });
            } else if (val.key === 'SimpleFillSymbol' || val.key === 'composite' ) {
                this.editObj0 = Object.assign({}, val.data.symbol);
                this.linewidth = val.data.symbol.linewidth;
                this.iconOpacity = val.data.symbol.iconOpacity;
                this.inputDesc = val.data.symbol.inputDesc;
                this.$nextTick(() => {
                    this.isShowOpacity = true;
                    this.isShowFill = true;
                    this.editSymbolType = 0;
                });
            } else if (val.key === 'TextSymbol' ) {
                this.editObj1 = Object.assign({}, val.data.symbol);
                this.inputDesc = val.data.symbol.inputDesc;
                this.$nextTick(() => {
                    this.isShowOpacity = true;
                    this.editSymbolType = 1;
                });

            } else if (val.key === 'TailedText' ) {
                this.editObj2 = Object.assign({}, val.data.symbol);
                this.text2Linewidth = val.data.symbol.linewidth;
                this.text2BorderWidth = val.data.symbol.borderWidth;
                this.text2Opacity = val.data.symbol.iconOpacity;
                this.text2Desc = val.data.symbol.inputDesc;
                this.$nextTick(() => {
                    this.isShowOpacity = true;
                    this.editSymbolType = 2;
                });
            } else if (val.key === 'VectorMarkerSymbol') {
                // this.editObj3 = Object.assign({}, val.data.symbol);
                this.editObj3 = jQuery.extend(true, {}, val.data.symbol);
                this.scale = val.data.symbol.scale;
                this.rotation = val.data.symbol.rotation;
                this.text3Opacity = val.data.symbol.iconOpacity;
                this.text3Desc = val.data.symbol.inputDesc;
                this.$nextTick(() => {
                    this.isShowOpacity = true;
                    this.editSymbolType = 3;
                });
            }
        }
    }



    @Emit('eMapPanelEdit')
    public send(val: any) {
        return val;
    }

    @Emit('panelEditClose')
    public sendClose(val: any) {
        return val;
    }

    // input监听事件;
    // 线面线宽;
    public inputLinewidth(val: any) {
        if (val >= 150) {
            val = 150;
        }
        if (val <= 0) {
            val = 0;
        }
        this.linewidth = val;
        clearTimeout(this.timer2);
        this.timer2 = setTimeout(() => {
            this.editObj0.linewidth = val;
        }, 1000);
    }

    // 线面透明度 ;
    public inputIconOpacity(val: any) {
        if (val >= 100) {
            val = 100;
        }
        if (val <= 0) {
            val = 0;
        }
        this.iconOpacity = val * 255 / 100;
        clearTimeout(this.timer3);
        this.timer3 = setTimeout(() => {
            this.editObj0.iconOpacity = val;
        }, 1000);
    }

    // 线面说明 ;
    public inputDescWatch(val: any) {
        clearTimeout(this.timer4);
        this.timer4 = setTimeout(() => {
            this.editObj0.inputDesc = val;
        }, 1000);
    }
    // 字体 ;
    public fontFamilyChange(val: any) {
        if (this.editSymbolType === 1) {
            $('.inputFont .el-textarea__inner').css('font-family', val);
        }
        if (this.editSymbolType === 2) {
            $('.inputFont2 .el-textarea__inner').css('font-family', val);
        }

    }

    // 字体说明 ;
    public fontDescWatch(val: any) {

        clearTimeout(this.timer1);
        this.timer1 = setTimeout(() => {
            this.editObj1.inputDesc = val;
        }, 1000);
    }

    // 线宽 ;
    public inputText2Linewidth(val?: any) {
        if (val >= 150) {
            val = 150;
        }
        if (val <= 0) {
            val = 0;
        }
        this.text2Linewidth = val;
        clearTimeout(this.timer11);
        this.timer11 = setTimeout(() => {
            this.editObj2.linewidth = val;
        }, 1000);
    }

    // 边框宽;
    public inputText2BorderWidth(val: any) {
        if (val >= 150) {
            val = 150;
        }
        if (val <= 0) {
            val = 0;
        }
        this.text2BorderWidth = val;
        clearTimeout(this.timer13);
        this.timer13 = setTimeout(() => {
            this.editObj2.borderWidth = val;
            $('.inputFont2 .el-textarea__inner').css('border-width', `${val}px`);
        }, 1000);
    }

    // 透明度;
    public inputText2Opacity(val: any) {
        if (val >= 255) {
            val = 255;
        }
        if (val <= 0) {
            val = 0;
        }
        this.text2Opacity = val;
        clearTimeout(this.timer14);
        this.timer14 = setTimeout(() => {
            this.editObj2.iconOpacity = val;
        }, 1000);
    }

    // 说明;
    public text2DescWatch(val: any) {

        clearTimeout(this.timer12);
        this.timer12 = setTimeout(() => {
            this.editObj2.fontDesc = val;
        }, 1000);
    }

    // svg符号
    // 缩放比例
    public inputTextScale(val: any) {
        if (val >= 10) {
            val = 10;
        }
        if (val <= 0) {
            val = 1;
        }
        this.scale = val;
        this.editObj3.scale = parseFloat(val);
    }

    // svg符号
    // 旋转角度
    public inputTextRotation(val: any) {
        if (val >= 360) {
            val = 360;
        }
        if (val <= 0) {
            val = 0;
        }
        this.rotation = val;
        this.editObj3.rotation = parseFloat(val);
    }
    // 透明度
    public inputText3Opacity(val: any) {
        if (val >= 255) {
            val = 255;
        }
        if (val <= 0) {
            val = 0;
        }
        this.text3Opacity = val;
        this.editObj3.iconOpacity = val;
    }

    // 说明
    public text3DescWatch(val: any) {
        this.text3Desc = val;
        this.editObj3.inputDesc = val;
    }

    // 关闭事件=;
    public closeClick(event: any ) {

        event.stopPropagation();
        event.preventDefault();
        const temp: any = false;
        this.sendClose(temp);
    }

    private created() {
        return false;
    }

    private mounted() {
        const eMapPanelDrag: any = new Drag('#eMapPanelEdit', '.eMapPanelEditTop', this.options.drag);
        eMapPanelDrag.toDrag();
    }

}
</script>