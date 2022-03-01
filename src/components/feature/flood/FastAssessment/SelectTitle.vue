<template>
  <div class="select_container">
    <div @click="selected" class="down_title">
      <span :title="selectedTitle">{{ selectedTitle }}</span>
      <i :class="selectedIsShow ? ' arrow-up' : 'arrow-down'"></i>
    </div>
    <!-- <div v-show="selectedIsShow" @click="selected" class="top_corner"></div>
    <div v-show="!selectedIsShow" @click="selected" class="bottom_corner"></div> -->
    <div
      class="drop-down-box"
      v-show="selectedIsShow"
      @mouseleave.stop.self="mouseLeave"
    >
      <el-scrollbar>
        <div class="select_box">
          <div v-if="selectedData[0].name">
            <span
              :key="index"
              @click="selectTitle(item)"
              v-for="(item, index) in selectedData"
              :title="item.name"
            >
              {{ item.name }}
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'SelectTitle',
  components: {},
})
export default class SelectTitle extends Vue {
  // 父组件调用模板
  /**
   * <Select :selectdata="selectedData" @select="selectChange" :selectedtitle="selectedTitle"></Select>
   *
   * 参数说明：selectedData：下拉框的数据
   *          selectedTitle：默认选择的
   *          selectChange：接收下拉框改变后的值
   */
  // 父组件传过来的默认选择项

  // 下拉框显示与隐藏
  private selectedIsShow: boolean = false;
  // 下拉框数据
  private selectedData: any = [
    { name: '当前10分钟', id: '10', state: '0' },
    { name: '当前30分钟', id: '30' , state: '0'},
    { name: '当前60分钟', id: '60', state: '0' },
    { name: '当前90分钟', id: '90' , state: '0'},
    { name: '当前120分钟', id: '120' , state: '0'},

    { name: '未来1小时', id: '60', state: '1' },
    { name: '未来2小时', id: '120', state: '1' ,
    },
    // {gbCode: "370602", level: "3", name: "芝罘区", pinyin: "ZFQ", longitude: 121.3982},{gbCode: "370611", level: "3", name: "福山区", pinyin: "FSQ", longitude: 121.2549},
    // {gbCode: "370613", level: "3", name: "莱山区", pinyin: "LSQ", longitude: 121.4429}
  ];
  // 选择项
  private selectedTitle: any = '';

  private created() {
    // this.selectedData = this.selectdata;
    this.selectedTitle = this.selectedData[0].name;
  }
  // 点击显示隐藏选择框
  private selected(): void {
    this.selectedIsShow = !this.selectedIsShow;
  }

  // 击切换显示不同数据事件
  private selectTitle(item: any): void {
    this.selectedTitle = item.name;
    this.selectedIsShow = false;
    // 选择值修改后将值传给父组件
    this.$emit('select', item);
  }
  // 鼠标离开下拉框时隐藏下拉框
  private mouseLeave(): void {
    this.selectedIsShow = false;
  }
}
</script>
<style lang="less" scoped>
@icon: "../../../../assets/img/gisModule/gisLayerPanel";
// @imgUrl: '../../assets/img/forestFire';
// @publicUrl: '../../assets/img/publicIcon';
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
      background: url("@{icon}/sanjiao.png") no-repeat 0 0;
      background-size: 100% 100%;
    }
    &.arrow-up {
      background: url("@{icon}/sanjiao.png") no-repeat 0 0;
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
      height: 100%;
      width: 155px;
      display: block;
      color: #c4d8da;
      font-size: 22px;
      padding-left: 10px;
    }
    &:hover {
      background: url("@{icon}/selectactive.png") no-repeat 0 0;
      background-size: 100% 100%;
      border: none;
      height: 36px;
      > span {
        line-height: 36px;
        padding-left: 11px;
      }
    }
  }
  .drop-down-box {
    // width: 110px;
    width: 100%;
    height: 203px;
    background: url("../../../../assets/img/halfScreen/eventAndTopics/select_bg.png")
      no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: 37px;
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
      font-size: 22px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      &:nth-child(1) {
        margin-top: 5px;
      }
    }

    span:hover {
      background: url("@{icon}/selectactive.png") no-repeat 0 0;
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
}
</style>
