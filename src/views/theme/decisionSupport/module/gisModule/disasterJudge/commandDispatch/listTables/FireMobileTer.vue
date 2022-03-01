<!-- 消防移动终端 -->
<template>
  <div style="height:100%;">
    <el-table
      class="customMyElTable"
      :data="tableData"
      style="width: 100%;height:100%;"
      @row-click="rowClick"
      max-height="440"
      highlight-current-row>
      
      <template slot="empty">
        <div class="nothingData--bg nothingData-size" style="padding-top:360px;"></div>
      </template>
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="ryxm" label="姓名"></el-table-column>
      <el-table-column prop="distance" label="事发地距离"></el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'FireMobileTer',
})
export default class FireMobileTer extends Vue {
  public tableData: any;
  @Prop() private currentObj: any;

  private rowClick(data: any) {
    // 改变显示与key ，以及根据id请求服务
    this.messsageBus.emit(
      this.currentObj.emitType,
      data.perlocationid,
      'perlocationid',
    );
  }

  // 数据赋值
  private setListData() {
    this.tableData = this.currentObj.resultData;
  }
  private mapClick() {
    const temp = 'gis_' + this.currentObj.emitType;
    this.messsageBus.on(temp, (data: any) => {
      this.rowClick(data);
    });
  }
  private created() {
    this.setListData();
    this.mapClick();
  }
}
</script>