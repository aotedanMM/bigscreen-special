<!-- 视频回传 -->
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
      <template slot="empty">
        <div class="nothingData--bg nothingData-size" style="padding-top:360px;"></div>
      </template>
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="distance" label="事发地距离"></el-table-column>
      <el-table-column label="查看">
        <template slot-scope="scope">
          <!-- {{scope.row.checkSee}}  slot-scope="scope"-->
          <span :title="scope.row.checkSee" class="info-icon-video" @click="openDialog(scope.row)"></span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'VideoReturn',
})
export default class VideoReturn extends Vue {
  public tableData: any;
  @Prop() private currentObj: any;
  private configServerPath =  publishObjectPath.value && publishObjectPath.value.serverPath;
  private rowClick(data: any) {
    // 改变显示与key ，以及根据id请求服务
    this.messsageBus.emit(this.currentObj.emitType, data.id, 'id', data.userid);
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
  private openDialog(data: any) {
    const self: any = window;
    const tempData = {
      type: 'mp4',
      url:
        this.configServerPath +
        '/api/mobileapp/downloadfeedbackattach/v1?id=' +
        data.id,
    };
    this.messsageBus.emit('openDialog', tempData);
  }
  private created() {
    this.setListData();
    this.mapClick();
  }
}
</script>
<style lang="less" scoped>
@dispathImg: '../../../../../../../../assets/img/CommandDispatch/';
.info-icon-video {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url('@{dispathImg}/tab_video_return_view.png') no-repeat 0 0;
  margin-left: 15px;
  cursor: pointer;
  vertical-align: middle;
}
</style>