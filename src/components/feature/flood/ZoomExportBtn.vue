<template>
  <div class="ZoomExportBtn">
    <span @click="handleEmitExport('2')" title="精简版下载"></span>
    <span @click="handleEmitExport('1')" title="完整版下载"></span>
    <span v-show="!expanded" @click="expanded = !expanded"></span>
    <span v-show="expanded" @click="expanded = !expanded"></span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'ZoomExportBtn',
})
export default class ZoomExportBtn extends Vue {
  // 缩小按钮
  private expanded: boolean = false;

  @Watch('expanded')
  private submitZoomEvent() {
    this.messsageBus.emit('submitZoomEvent', this.expanded);
  }
  // 点击下载精简版和完整版触发父窗口方法
  private handleEmitExport(type: any) {
    this.$emit('handleEmitExport', type);
  }
}
</script>
<style lang="less" scoped>
@btn: '../../../assets/img/gisPlot';
.ZoomExportBtn {
  position: absolute;
  display: flex;
  top: 0px;
  right: 0px;
  span {
    cursor: pointer;
    &:nth-child(1) {
      width: 66px;
      height: 29px;
      background: url('@{btn}/iconStreamline.png') no-repeat 100% 100%;
      &:hover {
        background: url('@{btn}/iconStreamline_hover.png') no-repeat 100% 100%;
      }
    }
    &:nth-child(2) {
      width: 46px;
      height: 29px;
      background: url('@{btn}/iconComplete.png') no-repeat 100% 100%;
      &:hover {
        background: url('@{btn}/iconComplete_hover.png') no-repeat 100% 100%;
      }
    }
    &:nth-child(3) {
      width: 46px;
      height: 29px;
      background: url('@{btn}/iconMin.png') no-repeat 100% 100%;
      &:hover {
        background: url('@{btn}/iconMin_hover.png') no-repeat 100% 100%;
      }
    }
    &:nth-child(4) {
      width: 46px;
      height: 29px;
      background: url('@{btn}/iconMax.png') no-repeat 100% 100%;
      &:hover {
        background: url('@{btn}/iconMax_hover.png') no-repeat 100% 100%;
      }
    }
  }
}
</style>