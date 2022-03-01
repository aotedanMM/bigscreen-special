<template>
  <div id="DangerSource" class="geology-hidden">
    <el-scrollbar style="height:100%;">
    <ul class="pop-data-head" style="outline:1px soldi red">
      <li>
        <div class="text-title">危险源类型：</div>
        <div class="text-inner">{{rescueData.dangertypename || '暂无数据'}}</div>
      </li>
      <li>
        <div class="text-title">危险源等级：</div>
        <div class="text-inner">{{rescueData.dangerlevelname || '暂无数据'}}</div>
      </li>
      <li>
        <div class="text-title">所属区域：</div>
        <div class="text-inner">{{rescueData.districtname || '暂无数据'}}</div>
      </li>
      <li>
        <div class="text-title">地址：</div>
        <div class="text-inner">{{rescueData.address || '暂无数据'}}</div>
      </li>
      <li>
        <div class="text-title">隶属单位：</div>
        <div class="text-inner">{{rescueData.parentunit || '暂无数据'}}</div>
      </li>
    </ul>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'DangerSource',
})
export default class DangerSource extends Vue {
  @Prop() public rescueData: any;
}
</script>
<style lang="less" scoped>
.geology-hidden {
  color: #2cf8ff;
  max-height: 280px;
  height:280px;
  // overflow: hidden;
}
.pop-data-head li {
  // border: 1px solid #2cf8ff;
  overflow: hidden;
  margin-bottom: -2px;
  // height: 40px;
  line-height: 40px;
  font-size: 26px;
  vertical-align: top;
  div {
    // float: left;
    display: table-cell;
    color:#0edbe4;
    padding-left: 10px;
  }
  .text-title{
    // text-overflow: hidden;
    white-space: nowrap;
  }
  .text-inner{
    color:#fff;
  }
  div:nth-child(2) {
    // border-left: 1px solid #2cf8ff;
  }
}
.pop-data-content {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  td {
    border: 1px solid #2cf8ff;
    padding-left: 10px;
    div {
      height: 40px;
      line-height: 40px;
      float: left;
    }
  }
  .text-wrap {
    width: calc(100% - 130px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>