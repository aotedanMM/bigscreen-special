<template>
  <div id="OtherPop" class="other-pop">
    <ul class="pop-data-head">
      <li>
        <div class="text-title">地址：</div>
        <div class="text-inner address-wrap">{{rescueData.address || '暂无数据'}}</div>
      </li>
      <li>
        <div class="text-title">行政区划：</div>
        <div  class="text-inner">{{rescueData.districtname || '暂无数据'}}</div>
      </li>
      <li>
        <div class="text-title">联系电话：</div>
        <div class="text-inner">{{rescueData.phone || '暂无数据'}}</div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'OtherPop',
})
export default class OtherPop extends Vue {
  @Prop() public rescueData: any;
}
</script>
<style lang="less" scoped>
.pop-data-head li {
  overflow: hidden;
  margin-bottom: -2px;
  height: 40px;
  line-height: 40px;
  div {
    float: left;
    padding-left: 10px;
  }
  .address-wrap {
        width: 270px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>