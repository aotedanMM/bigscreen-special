<template>
    <div class="emap_control_eMapPanelEdit_inner">
            <el-scrollbar view-style="max-height:420px">
                <div class="panelEditMain ">
                    <div class="panelEditMain_item">
                        <span>比例</span>
                        <div class="panelInput">
                            <div class="sliderClass slider">
                                <el-slider 
                                    :min=1
                                    :max=10
                                    :step=0.01
                                    v-model.number="data.data.symbol.scale"
                                    :show-input="true"
                                    :show-tooltip="false"
                                    :show-input-controls="false"
                                ></el-slider>
                            </div>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>旋转角度</span>
                        <div class="panelInput">
                            <div class="sliderClass slider">
                                <el-slider 
                                    :min=0
                                    :max=360
                                    :step=0.01
                                    v-model.number="data.data.symbol.rotation"
                                    :show-input="true"
                                    :show-tooltip="false"
                                    :show-input-controls="false"
                                ></el-slider>
                            </div>
                        </div>
                    </div>
                    <div class="panelEditMain_item">
                        <span>透明度</span>
                        <div class="panelInput">
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
export default class IconEditor extends Vue {
    @Prop()  public data?: any;
    private iconOpacity = 70;
    private mounted() {
        this.iconOpacity = Math.round(this.data.data.symbol.iconOpacity * ( 100 / 255 ));
    }
    private updated() {
        this.data.data.symbol.iconOpacity = Math.round(this.iconOpacity * ( 255 / 100 ));
    }
}
</script>