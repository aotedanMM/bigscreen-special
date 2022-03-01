<template>
  <div class="resource-query" @click="showResourcefn"></div>
  <!--<div :class="['resource-query',{'resource-active':lastKey === 'resourceQuery'}]" @click="showResourcefn"></div>-->
</template>

<script lang='ts'>
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class GisMapResource extends Vue {
  /*@Prop({
    default: '',
  }) public lastKey?: string;*/
  public isShowActive = false;
  @Emit('isShowPopupResouce')
  public showResourcefn() {
    this.isShowActive = !this.isShowActive;
    // 这里的事件自己定一下
    this.$emit('clickHandler', {
      key: 'resourceQuery',
    });
  }
  public hideResourcefn() {
    this.isShowActive = false;
  }
}
</script>
<style scoped lang='less'>
.resource-query {
  width: 60px;
  height: 60px;
  cursor: pointer;
  background: url('../../../../assets/img/gisUI/gisMapTool/zhoubianfenxi.png')
    no-repeat 0 0;
  background-size: 100% 100%;
  margin-left: -11px;
}
.resource-query:hover {
  background: url('../../../../assets/img/gisUI/gisMapTool/zhoubianfenxihover.png')
    no-repeat 0 0;
  background-size: 100% 100%;
}
.resource-query.resource-active {
  background: url('../../../../assets/img/gisUI/gisMapTool/zhoubianfenxihover.png')
    no-repeat 0 0;
  background-size: 100% 100%;
}
</style>
