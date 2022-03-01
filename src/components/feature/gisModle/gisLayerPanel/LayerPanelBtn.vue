<template>
  <!-- 图层 -->
  <div :class="['layer-panel-btn', {'active': $store.state.mapTools.showLayerPanel}]"  @click="click" title="图层"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { } from '@/api/feature/monitorwarning/installServer';
/**
 * 图层
 */
@Component({
  name: 'LayerPanelBtn',
})
export default class LayerPanelBtn extends Vue {
  private show: boolean = false;
  public click() {
    this.show = this.$store.state.mapTools.showLayerPanel;
    this.change(!this.show);
  }

  public beforeDestroy() {
    this.change(false);
  }

  private change(show: any) {
    this.show = show;
    this.$store.commit('mapTools/changeShowLayerPanel', !!show);
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../assets/img/gisModule/gisLayerPanel';
.layer-panel-btn {
  background: #fff;
  position: relative;
  top: -1px;
  width: 60px;
  height: 60px;
  text-align: center;
  cursor: pointer;
  background: url('@{url}/tc-btn.png') no-repeat center / 100% 100%;
  &.active {
    background: url('@{url}/tc-btn-active.png') no-repeat center / 100% 100%;
  }
}
</style>
