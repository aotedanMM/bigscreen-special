<template>
  <div class="MapDialogTitle">
    <slot name="title"></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
@Component({
  name: 'mapDialogTitle',
})
export default class MapDialogTitle extends Vue {
}
</script>
<style lang="less" scoped>
@path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径
   .MapDialogTitle {
      width: 100%;
    height: 100px;
    z-index:-1;
    cursor: pointer;
    color: #91f5ff;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    position: relative;
    width: 344px; 
    height: 75px;
    line-height: 75px;
    margin:0 auto 15px;
  
    &::before{
      content: '';
      position: absolute;
      top:-12px;
      right:-25px;
      bottom:-10px;
      left:-25px;
      background: url('@{path}/tankuangtitlebg.png') center top no-repeat;
      background-size: 100% 100%;
      z-index: -1;
      pointer-events: none;
    }
    }
</style>
