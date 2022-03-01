<!--北斗终端-->
<template>
  <div style="height:100%;">
    <el-table
      class="customMyElTable"
      :data="tableData"
      style="width: 100%;height:100%;"
      @row-click="rowClick"
      max-height="440"
       highlight-current-row
    >
      <!-- 
        <el-table-column type="index" width="80" label="序号">
            
        </el-table-column>
      -->
      
      <template slot="empty">
        <div class="nothingData--bg nothingData-size" style="padding-top:200px;"></div>
      </template>
      <el-table-column prop="souce_addr" label="卡号"></el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <div>{{scope.row.souceName || "暂无数据" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="distance" label="事发地距离"></el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'BeidouTerminal',
})
export default class BeidouTerminal extends Vue {
  public tableData: any;
  @Prop() private currentObj: any;

  private rowClick(data: any) {
    // 改变显示与key ，以及根据id请求服务
    this.messsageBus.emit(
      this.currentObj.emitType,
      data.souce_addr,
      'souce_addr',
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