<template>
  <!-- 事件列表 -->
  <div class="mapPrint" >  
    <div class="mapPrint_title">
      <span class="mapPrint_title_txt">地图打印</span>
      <span class="mapPrint_title_close" @click="closeEve"></span>
    </div>
    <div class="mapPrint_content">
        <el-form class="mapPrint_content_form" :label-position="'left'"  ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="标题："  prop="title"> 
              <el-input v-model="form.title" placeholder="请输入专题图名称，不超过30字" maxlength="30"></el-input>
            </el-form-item>
            <!-- <el-form-item label="扩大打印范围：" label-width="300px">
              <el-switch active-color="#0a86d7"  inactive-color="#0a86d7" active-text="off"  inactive-text="on" @change="switchChange" v-model="form.range"></el-switch>
            </el-form-item> -->
            <el-form-item label="纸张：">
              <el-select @change="selectChange" v-model="form.paper" placeholder="A0 landscape">
                <el-option label="A0 landscape" value="A0 landscape"></el-option>
                <el-option label="A1 landscape" value="A1 landscape"></el-option>
                <el-option label="A2 landscape" value="A2 landscape"></el-option>
                <el-option label="A3 landscape" value="A3 landscape"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分辨率：" >
              <el-select  v-model="form.dpi" placeholder="200dpi">
                <el-option label="96dpi" value="96dpi"></el-option>
                <el-option label="150dpi" value="150dpi"></el-option>
                <el-option label="200dpi" value="200dpi"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="制作单位：" prop="unit" label-width="130px"> 
              <el-input v-model="form.unit" placeholder="请输入制作单位，不超过30字" maxlength="30"></el-input>
            </el-form-item>
            <!-- <el-form-item label="最佳DPI：" label-width="120px">
                <el-tooltip placement="top">
                  <div slot="content">根据地图的级别、范围以及纸张自动计算</div>
                  <i class="tips"></i>
                </el-tooltip>
                <span class="dpiSpan">{{form.dpi}}</span>
            </el-form-item> -->
            <el-form-item v-if="isDrawingOut" label="正在出图：" label-width="120px">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
            </el-form-item>
            <el-form-item>
              <el-button class="previewBtn" @click="previewBtn('ruleForm')">预览</el-button>
              <el-button :class="drawingOutClass" :disabled="drawingOutClass === 'mapDown_outNew'" type="primary" @click="drawingOut('ruleForm')">出图</el-button>
            </el-form-item>
        </el-form>  
    </div>
    <div v-if="drawingOutSuccess" class="mapPrint_remove_div" >出图完成</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getDateFormat } from '@/util/tools';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'MapPrint',
  mixins: [MapCommon],
})
export default class MapPrint extends Vue {
  // 是否进行显示boolean
  @Prop({default: false}) public value?: boolean;
  private drawingOutClass = 'drawingOut';
  private isDrawingOut = false;
  private drawingOutSuccess = false;
  private percentage = 0;
  private percentageVal = 0;
  private timer: any = null;
  private form = {
      title: '专题图',
      paper: 'A0 landscape',
      dpi: '200dpi',
      unit: '',
  };

  private rules: any = {};
  private setRules() {
    this.rules = {
      title: [
        { validator: this.unitText, required: true, trigger: 'blur' },
      ],
      unit: [
        { validator: this.unitText, required: true, trigger: 'blur' },
      ],
    };
  }
  private unitText: any = (rule: any, value: any, callback: any) => {
    if (!value.trim()) {
      return callback(new Error('该字段不能为空'));
    }
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapPrint');
    return component;
  }
  private getDate() {
      const time = new Date();
      const Y = time.getFullYear();
      const M = time.getMonth() + 1;
      const D = time.getHours();
      const S = time.getDate();
      return Y + '年' + M + '月' + S + '日';
  }
  private closeEve() {
    this.messsageBus.emit('mapPrintEmit', {isShow: false});
  }
  // 预览
  private previewBtn(formName: any) {
    this.messsageBus.emit('printPreviewEmit', {isShow: true, data: {title : this.form.title, time : this.getDate(), unit: this.form.unit}});
  }
  // 进度条
  private progress() {
      const self = this;
      let step: number = 200;
      const getStep = (percentage: number) => {
        let ratio: number = 1;
        if (percentage > 9900 ) {
          step = 0;
        } else if (percentage > 8000 ) {
          step = 2;
          ratio = 1;
        } else if (percentage > 7000) {
          ratio = 1;
        } else if (percentage > 6000) {
          ratio = 1.1;
        } else if (percentage > 5000) {
          ratio = 1.05;
        }
        step = parseFloat((step / ratio).toFixed(2));
        return step;
      };
      const update = () => {
        self.timer = requestAnimationFrame(() => {
          const curStep: any = getStep(self.percentageVal);
          self.percentageVal += curStep;
          self.percentage = Math.round(self.percentageVal / 100);
          // console.debug(self.percentage, ' > ', curStep);
          if (self.percentage < 10000) {
            update();
          } else {
            self.percentage = 100;
            self.clearTimer();
          }
        });
      };
      update();
  }
  private clearTimer() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
  }
  private finish() {
    const that = this;
    that.percentage = 100;
    that.drawingOutClass = 'drawingOut';
    that.isDrawingOut = false;
    that.clearTimer();
  }
  // 出图
  private drawingOut(formName: any) {
    const self = this;
    const formstr: string = 'form';
    const dom: any = this.$refs[formstr];
    dom.validate((valid: any) => {
        if (!valid) {
          return;
        }
      });
    if (self.form.title.trim() && self.form.unit.trim()) {
      self.drawingOutClass = 'mapDown_outNew';
      self.isDrawingOut = true;
      self.percentage = 0;
      const params = {
        dpi: self.form.dpi.split('dpi')[0] ,
        outputFormat: 'pdf',
        layout: self.form.paper,
        title: self.form.title,
        unit : self.form.unit,
        useSuggestedDPI: false,
        };
      self.progress();
      // self.getComponent().load(params, function(data: any) {
      //       // self.form.dpi = data.dpi;
      //     }).then(() => {
            // self.drawingOutSuccess = true;
            // self.fastProgress();
              // this.drawingOutClass = 'drawingOut';
              // this.isDrawingOut = false;
              // this.drawingOutSuccess = true;
              // setTimeout(() => {
              //   this.drawingOutSuccess = false;
              //   this.percentage = 0;
              // }, 1000);
              // this.drawingOutClass = 'drawingOut';
          // });
      }
  }
  // 是否扩大打印范围
  private switchChange(val: any) {
    console.log(val);
  }
  // 纸张选择
  private selectChange(val: any) {
    console.log(val);
  }
  private created() {
    this.setRules();
  }
  private mounted() {
    const that = this;
    (this as any).resolveMap('map').then(() => {
      this.getComponent().on('finish', () => {
        that.finish();
      });
    });
  }
  private beforeDestroy() {
    this.clearTimer();
  }
}
</script>
<style lang="less" scoped>
@imgUrl: '../../../assets/img/eventInfo';
.mapPrint {
  position: absolute!important;
  left: 50%;
  top: 53.5%;
  transform: translate(-50%, -47%);
  width: 535px;
  min-height:384px;
  background: url('@{imgUrl}/infolistimg1.png') no-repeat  50% 50%;
  background-size:100% 100%;
  padding: 33px 57px 57px 53px; 
  z-index: 4;
  box-sizing:border-box;
  &_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffde00;
    height: 60px;
    font-size: 28px;
    font-weight: 600;
    padding-left:15px;
    line-height: 60px;;
    margin-bottom:20px;
    &_close {
      cursor: pointer;
      width: 92px;
      height: 66px;
      background: url('@{imgUrl}/infolistclose.png') no-repeat center / 100% 100%;
      position: absolute;
      right: 13px;
      top: 24px;
    }
  }
  &_content {
    height: calc(100% - 100px);
    overflow: hidden;
    margin: 0 1%;
    padding-top: 20px;
    box-sizing: border-box;
    &_form{
        /deep/.el-form-item__label{
          color: #fff;
          font-size:20px;
          &:nth-child(2){
            white-space: nowrap;
          }
        }
        /deep/.el-input__inner{
          background: #1d5683;
          border:1px solid #21b5e6;
          color: #fff;
          /* #0c739f */
        }
        /deep/.el-progress-bar__outer{
          background:none;
          border:1px solid #21b5e6;
        }
        /deep/.el-switch__core{
            background-color: transparent;
            border-color: #21b5e6;
        }
        .tips{
            cursor: pointer;
            position: relative;
            left: -20px;
            top: 4px;
            display: inline-block;  
            width:20px ;
            height:20px ;
            background: url('@{imgUrl}/mapTip.png') no-repeat center / 100% 100%;
            &:hover{
              background: url('@{imgUrl}/mapTipHover.png') no-repeat center / 100% 100%;
            }
        }
        .el-select{
          width: 100%;
        }
        .dpiSpan{
          color:#fff;
        }
        .el-button{
          color: #fff;
          font-size:20px;
          width: 81px;
          height: 38px;
          line-height: 0px;
          text-align: center;
        }
        .el-progress{
          line-height: inherit;
        }
        .previewBtn{
            background: url('@{imgUrl}/mapdownCancle.png') no-repeat center / 100% 100%;
            background-size: 100% 100%;
        }
        .drawingOut{
            background: url('@{imgUrl}/mapdownSure.png') no-repeat center / 100% 100%;
            background-size: 100% 100%;
        }
        .mapDown_outNew{
            background: url('@{imgUrl}/mapDown_outNew.png') no-repeat center / 100% 100%;
            background-size: 100% 100%;
        }
        
    }
  }
  &_remove_div{
      position: absolute;
      left: 32%;
      top: 40%;
      background: rgba(0,0,0,0.5);
      width:200px;
      height: 100px;
      color: #fff;
      font-size: 24px;
      text-align: center;
      line-height:100px;
      border-radius: 9px;
  }
}
</style>
