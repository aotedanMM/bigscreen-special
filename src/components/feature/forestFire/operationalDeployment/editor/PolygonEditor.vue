<template>
    <div class="emap_control_eMapPanelEdit_inner">
            <el-scrollbar view-style="max-height:420px">
                <div class="panelEditMain">
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
                        <span>线颜色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    id="borderColor"
                                    v-model="data.data.symbol.borderColor"
                                    color-format="hex"
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>线透明度</span>
                        <div class="sliderClass slider">
                            <el-slider 
                                :min=0
                                :max=100
                                v-model.number="borderOpacity"
                                :show-input="true"
                                :show-tooltip="false"
                                :show-input-controls="false"
                            ></el-slider>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>线样式</span>
                        <div class="panelInput">
                            <el-select size="mini"
                                    placehoder="请选择"
                                    v-model="data.data.symbol.lineStyle"
                                    class="el-input-color"
                            >
                                <el-option value="0" label="虚线"><span class="f-small">虚线</span></el-option>
                                <el-option value="5" label="实线"><span  class="f-small">实线</span></el-option>
                                <el-option value="3" label="点状"><span  class="f-small">点状</span></el-option>
                                <el-option value="1" label="点划线"><span class="f-small">点划线</span></el-option>
                                <el-option value="2" label="双点划线"><span  class="f-small">双点划线</span></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>填充色</span>
                        <div class="panelInput">
                            <el-color-picker
                                    id="fillColor"
                                    v-model="data.data.symbol.fillColor"
                                    color-format="hex"
                                    >
                            </el-color-picker>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>填充透明度</span>
                        <div class="sliderClass slider">
                            <el-slider 
                                :min=0
                                :max=100
                                v-model.number="fillOpacity"
                                :show-input="true"
                                :show-tooltip="false"
                                :show-input-controls="false"
                            ></el-slider>
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
export default class PolygonEditor extends Vue {
    @Prop()  public data?: any;
    private borderOpacity = 70;
    private fillOpacity = 70;
    private mounted() {
        this.borderOpacity = Math.round(this.data.data.symbol.borderOpacity * 100 / 255);
        this.fillOpacity = Math.round(this.data.data.symbol.fillOpacity * 100 / 255);
    }
    private updated() {
        this.data.data.symbol.borderOpacity = Math.round(this.borderOpacity * 255 / 100);
        this.data.data.symbol.fillOpacity = Math.round(this.fillOpacity * 255 / 100);
    }
}
</script>