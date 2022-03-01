<template>
  <div id="DistrictPopModule">
    <!-- <slot name="title"></slot> -->
    挖佛哈
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
@Component({
  name: 'DistrictPopModule',
})
export default class DistrictPopModule extends Vue {
}
</script>
<style lang="less" scoped>
    #DistrictPopModule{
      text-align: center;
      font-size: 36px;
      color: #91f5ff;
      background: url(../../../../assets/img/gisModule/tankuangtitlebg.png) no-repeat;
      background-size: 103% 128%;
      background-position-y: -19px;
      width: 100%;
      height: 98px;
      line-height: 102px;
      border-radius: 3px;
      font-weight: bolder;
      cursor: pointer;
    }
</style>
