<template>
  <div class="select_container">
    <div @click="selected" class="down_title">
      <span :title="selectedTitle">{{ selectedTitle || selectedTitleData }}</span>
      <i :class="selectedIsShow ? ' arrow-up' : 'arrow-down'"></i>
    </div>
    <!-- <div v-show="selectedIsShow" @click="selected" class="top_corner"></div>
    <div v-show="!selectedIsShow" @click="selected" class="bottom_corner"></div>-->
    <div
      class="drop-down-box"
      :style="[{width: width + 'px'},{height: height + 'px'},{left: left + 'px'}]"
      v-show="selectedIsShow"
      @mouseleave.stop.self="mouseLeave"
    >
      <el-scrollbar style="height: 100%">
        <div class="select_box">
          <div v-if="selectedData.length&&selectedData[0].name && !showCheckBox">
            <span
              :class="{'active' : item.checked}"
              :key="index"
              @click="selectTitle(item)"
              v-for="(item, index) in selectedData"
              :title="item.name"
            >{{ item.name}}</span>
          </div>
          <div v-if="selectedData.length&&selectedData[0].name && showCheckBox" class="elCheckbox">
            <el-checkbox
              v-if="showCheckAll"
              v-model="isCheckAll"
              :checked="isCheckAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <el-checkbox
              :class="{'active' : item.checked}"
              v-for="(item, index) in selectedData"
              :key="index"
              v-model="item.checked"
              :checked="item.checked"
              @change="checkedChange(item)"
              :title="item.name"
            >{{ item.name }}</el-checkbox>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'Select',
  components: {},
})
export default class Select extends Vue {
  // 父组件调用模板
  /**
   * <Select :selectdata="selectedData" @select="selectChange" :selectedtitle="selectedTitle"></Select>
   *
   * 参数说明：selectedData：下拉框的数据
   *          selectedTitle：默认选择的
   *          selectChange：接收下拉框改变后的值
   * 多选示例
   *        <Select
              :selectdata="list"  // 下拉列表数据
              @select="change"  // 选项变化触发事件
              :selectedtitle="title"  // 默认显示title
              :isCheckbox="true"  // 是否为多选
              :checkAll="true"  // 是否显示全选
              :width="270"  // 下拉列表宽
              :height="203"  // 下拉列表宽
            ></Select>
   * 数据格式：
   *        [
              {
                name: '',  // 名称 必需
                type: '',   // 值
                checked: true, // 是否选中
              },
            ]
   */
  // 父组件传过来是否是多选数据
  @Prop({ default: false }) public isCheckbox!: boolean;
  // 父组件传过来是否是全选数据
  @Prop({ default: false }) public checkAll!: boolean;
  // 父组件传过来的默认选择项
  @Prop() public selectedtitle: any;
  // 父组件传过来的下拉框的数据
  @Prop() public selectdata: any;
  @Prop({ default: 200 }) public width!: number;
  @Prop({ default: 203 }) public height!: number;
  @Prop({ default: 0 }) public left!: number;
  // 下拉框显示与隐藏
  private selectedIsShow: boolean = false;
  // 显示多选的下拉框
  private showCheckBox: boolean = false;
  // 下拉框数据
  private selectedData: any = [];
  // 选择项
  private selectedTitle: any = '';
  // 用来储存默认值
  private selectedTitleData: any = '';
  // 显示全选
  private showCheckAll: boolean = false;
  // 全选
  private isCheckAll: boolean = false;
  @Watch('selectdata', {immediate: true})
  public getData(val: any) {
    // console.log(val);
    this.selectedData = val;
  }
  @Watch('selectedtitle')
  public getDefault(val: any) {
    // console.log(val);
    this.selectedTitle = val;
  }
  private created() {
    this.showCheckBox = this.isCheckbox;
    this.selectedData = this.selectdata;
    this.selectedTitle = this.selectedtitle;
    this.selectedTitleData = this.selectedtitle;
    this.showCheckAll = this.checkAll;
    let num: number = 0;
    this.selectedData.forEach((v: any, i: number) => {
      if (v.checked) {
        num++;
        if (!i) {
          this.selectedTitle = v.name;
        } else {
          this.selectedTitle = this.selectedTitle + ',' + v.name;
        }
      }
    });
    this.isCheckAll = this.selectedData.length === num;
    // }
  }
  // 点击显示隐藏选择框
  private selected(): void {
    this.selectedIsShow = !this.selectedIsShow;
  }

  // 击切换显示不同数据事件
  private selectTitle(item: any): void {
    // if (!this.isCheckbox) {
    this.selectedTitle = item.name;
    this.selectedIsShow = false;
    // 选择值修改后将值传给父组件
    this.$emit('select', item);
  }
  private checkedChange(item: any) {
    const arr = this.selectedData.filter((item2: any) => {
      return item2.checked;
    });
    this.isCheckAll = arr.length === this.selectedData.length;
    if (arr.length < 1) {
      item.checked = true;
      return false;
    }
    this.upData();
  }
  // 生成selectedTitle，并传值给父组件
  private upData() {
    this.selectedTitle = '';
    this.selectedData.forEach((v: any, i: number) => {
      if (v.checked) {
        if (!this.selectedTitle) {
          this.selectedTitle = v.name;
        } else {
          this.selectedTitle = this.selectedTitle + ',' + v.name;
        }
      }
    });
    this.$emit('select', this.selectedData);
  }
  private handleCheckAllChange(val: any) {
    this.selectedData.forEach((v: any) => {
      v.checked = val;
    });
    this.upData();
  }
  // 鼠标离开下拉框时隐藏下拉框
  private mouseLeave(): void {
    this.selectedIsShow = false;
  }
}
</script>
<style lang="less" scoped>
@icon: '../../../../assets/img/gisModule/gisLayerPanel';
// @imgUrl: '../../assets/img/forestFire';
// @publicUrl: '../../assets/img/publicIcon';
.elCheckbox {
  /deep/.el-checkbox__inner {
    margin-left: 10px;
  }
  .el-checkbox {
    margin-right: 0 !important;
    margin-top: 23px;
    display: flex;
    align-items: center;
  }
  /deep/.el-checkbox__label {
    padding-left: 10px;
    font-size: 26px;
    line-height: 25px;
    color: #fff;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 334px;
  }
  .el-checkbox__inner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 0px !important;
    background: url('@{icon}/checked.png') no-repeat center center;
    background-size: 100% 100%;
    &::after {
      border: 0 !important;
    }
  }
  /deep/.is-checked {
    .el-checkbox__inner {
      background: url('@{icon}/checked_active.png') no-repeat center center !important;
      background-size: 100% 100%;
    }
    .el-checkbox__label {
      color: #fffabe;
    }
  }
}
/*下拉选择*/
.select_container {
  position: relative;
  width: 100%;
  // height: 100%;
  // width: 160px;
  // height: 203px;
  user-select: none;
  z-index: 1;
  i {
    position: absolute;
    right: 1px;
    top: 2px;
    display: block;
    width: 38px;
    height: 33px;
    &.arrow-down {
      background: url('@{icon}/sanjiao.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
    &.arrow-up {
      background: url('@{icon}/sanjiao.png') no-repeat 0 0;
      background-size: 100% 100%;
      transform: rotate(180deg);
    }
  }
  .top_corner,
  .bottom_corner {
    position: absolute;
    // left: 86px;
    right: 0px;
    width: 0; /*  宽高设置为0，很重要，否则达不到效果 */
    height: 0;
    border: 6px solid transparent;
  }

  .bottom_corner {
    top: 15px;
    border-top-color: #ffffff;
  }

  .top_corner {
    top: 7px;
    border-bottom-color: #ffffff;
  }
  .down_title {
    position: absolute;
    color: #fff;
    // top: -31px;
    font-size: 18px;
    line-height: 34px;
    cursor: pointer;
    width: 100%;
    padding-left: 10px;
    // background-image: url('@{publicUrl}/drop_down.png');
    // background-position: -5px -5px;
    background-repeat: no-repeat;
    border-radius: 2px;
    background-color: rgba(118, 242, 251, 0.16862745);
    border: 1px solid #76f2fb;
    height: 34px;
    overflow: hidden;
    > span {
      // margin-left: -25px;
      padding-right: 38px;
      height: 100%;
      width: 100%;
      display: block;
      color: #c4d8da;
      font-size: 22px;
      box-sizing: border-box;
    }
    &:hover {
      background: url('@{icon}/selectactive.png') no-repeat 0 0;
      background-size: 100% 100%;
      border: none;
      height: 36px;
      > span {
        line-height: 36px;
        padding-left: 1px;
      }
    }
  }
  .drop-down-box {
    width: 200px;
    height: 203px;
    background: url('../../../../assets/img/halfScreen/eventAndTopics/select_bg.png')
      no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: 37px;
    left: -6px;
    // background-position: -5px -5px;
    transition: all 2s;
    padding: 6px 0px;
    padding-bottom: 10px;
  }
  .select_box {
    line-height: 38px;
    text-align: left;
    color: #fff;
    font-size: 18px;
    width: 100%;
    height: 203px;
    // height: 100%;

    span {
      display: inline-block;
      padding-left: 8px;
      width: 95%;
      font-size: 20px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      &:nth-child(1) {
        margin-top: 5px;
      }
    }

    span.active,
    span:hover {
      background: url('@{icon}/selectactive.png') no-repeat 0 0;
      background-size: 100% 100%;
      // background-image: url('@{imgUrl}/left_selected_frame.png');
      background-repeat: no-repeat;
      // box-shadow: inset 0 0 20px 5px rgba(227, 255, 95, 0.32),
      //   0px -1px 0 0px #ffd870, 0px 1px 0 0px #ffd870;
      // border-left: 1px solid #ffd870;
      // border-right: 1px solid #ffd870;
      // border-radius: 2px;
    }
    // span:last-child {
    // padding-bottom: 17px;
    // }
  }
  .isCheckbox {
    width: 270px;
    height: 203px;
  }
}
</style>
