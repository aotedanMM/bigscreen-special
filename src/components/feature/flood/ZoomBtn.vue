<template>
  <div class="zoomBtn">
    <i v-if="expanded" class="narrow-on" @click="expanded = !expanded"></i>
    <i v-else class="narrow" @click="expanded = !expanded"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'ZoomBtn',
})
export default class ZoomBtn extends Vue {
  // 缩小按钮
  private expanded: boolean = false;

  @Watch('expanded')
  private submitZoomEvent() {
    this.messsageBus.emit('submitZoomEvent', this.expanded);
  }

}
</script>
<style lang="less" scoped>
@btn: "../../../assets/img/gisPlot";
.zoomBtn {
  position: absolute;
  display: flex;
  top: 0;
  right: -0;
  
  .narrow {
    position: absolute;
    right: 0;
    top: 3px;
    width: 68px;
    height: 48px;
    cursor: pointer;
    background: url("@{btn}/eventAndTopics_down_normal.png") no-repeat center /
      100% 100%;
    &:hover {
      top: 3px;
      background: url("@{btn}/eventAndTopics_down_highlight.png") no-repeat
        center / 100% 100%;
    }
  }
  .narrow-on {
    position: absolute;
    top: 3px;
    right: 0;
    width: 68px;
    height: 48px;
    cursor: pointer;
    background: url("@{btn}/eventAndTopics_up_normal.png") no-repeat center /
      100% 100%;
    &:hover {
      top: 3px;
      background: url("@{btn}/eventAndTopics_up_highlight.png") no-repeat center /
        100% 100%;
    }
  }
}
</style>