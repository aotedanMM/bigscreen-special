<!-- 短波台 -->
<template>
  <div style="height:100%;">
    <el-table
      class="customMyElTable"
      :data="tableData"
       highlight-current-row
      style="width: 100%;height:100%;"
      max-height="440"
    >
      <!-- <el-table-column type="index" width="60" label="序号">

      </el-table-column>-->
      <el-table-column prop="shortid" label="设备号" width="120"></el-table-column>
      <el-table-column prop="updatetime" label="上传时间" width="120"></el-table-column>
      <el-table-column label="事发地距离" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.distance || "暂无数据" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="播放">
        <template slot-scope="scope">
          <audio :src="scope.row.audioUrl" controls="controls"></audio>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'ShortwaveStation',
})
export default class ShortwaveStation extends Vue {
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
    this.tableData.forEach((item: any) => {
      const sleft: any = window;
      item.audioUrl =
        sleft.EMAP_CONFIG.common.urlWeb +
        '/shortWave/downloadShortWave?id=' +
        item.id;
    });
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