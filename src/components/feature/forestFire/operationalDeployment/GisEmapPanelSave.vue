<template>
  <div class="savePlotName" id="savePlotName">
    <div class="plotCtrlTop saveName_top">
      <div class="topTitle title-panel">保存方案</div>
      <div class="topClose-edit" @click="saveNameClose"></div>
    </div>
    <div class="savePlotInput">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label prop="isEmpty" style="margin-bottom:0">
          <el-input
            class="treeInput"
            v-model="ruleForm.inputPlotName"
            clearable
            size="small"
            maxlength="20"
            minlength="1"
            placeholder="方案名称"
            :title="ruleForm.inputPlotName"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="savePlotButton">
      <el-button plain size="small" class="savePlotButton_btn" @click="saveNameClose">取消</el-button>
      <el-button type="primary" class="savePlotButton_btn" size="small" @click="saveNameClick">确定</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { Drag } from './toDrag';
import { plotNoSqlService } from '@/api/installServer';
@Component({})
export default class EmapPanelSave extends Vue {
  @Prop() public mapComponent?: any;
  @Prop() public mapOpts?: any;
  private rules: any = {
    isEmpty: [{ validator: this.valNotempty, trigger: 'blur' }],
  };
  // 表单字段
  private ruleForm = { inputPlotName: '' };
  private mounted() {
    this.updateMapComponent(this.mapComponent);
  }
  /**
   * mapComponent 有值时 再进行加载
   */
  @Watch('mapComponent')
  private updateMapComponent(val: any) {
    if (val) {
      this.mapComponentEvents();
    }
  }
  private mapComponentEvents() {
    const self = this;
  }
  // 点击保存标绘面板的确定按钮
  private saveNameClick() {
    this.submitForm('ruleForm');
  }

  // 表单验证
  private submitForm(formName: any) {
    // const name = this.ruleForm.inputPlotName.trim();
      (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        this.mapComponent.savePlotSchema(
          this.mapOpts.businessId,
          this.ruleForm.inputPlotName,
          1,
          9,
        );
      } else {
        // this.$message({
        //   type: 'info',
        //   message: '名称填写无效！',
        // });
        console.log('error submit!!');
        return false;
      }
    });
  }
  private valNotDuplicate(rule: any, value: any, callback: any) {
    plotNoSqlService.schemaNameValidation(this.ruleForm.inputPlotName, this.mapOpts.businessId)
      .then((flag: any) => {
        if (flag) {
          callback();
        } else {
          callback(new Error('方案名称重复！'));
        }
      });
  }
  private async valNotempty(rule: any, value: any, callback: any) {
    this.ruleForm.inputPlotName = this.ruleForm.inputPlotName.trim();
    if (this.ruleForm.inputPlotName === '') {
      callback(new Error('请输入方案名称！'));
    } else {
      const flag = await plotNoSqlService.schemaNameValidation(
        this.ruleForm.inputPlotName, this.mapOpts.businessId,
      );
      if (flag) {
        callback();
      } else {
        callback(new Error('方案名称重复！'));
      }
    }
  }
  //  关闭事件
  private saveNameClose() {
    this.ruleForm.inputPlotName = '';
    this.resetForm('ruleForm');
    $('.savePlotName').fadeOut();
  }
  // 重置表单验证
  private resetForm(formName: any) {
    (this.$refs[formName] as any).resetFields();
  }
}
</script>