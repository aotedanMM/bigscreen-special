<!--天通终端-->
<template>
<div style="height:100%;">
    <el-table
      class="customMyElTable"
      :data="tableData"
      style="width: 100%;height:100%;"
      @row-click="rowClick"
       highlight-current-row
      max-height="440">
      
      <template slot="empty">
        <div class="nothingData--bg nothingData-size" style="padding-top:360px;"></div>
      </template>
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>
        <el-table-column
          prop="sim_info_id"
          label="卡号">
        </el-table-column>
        <el-table-column
          prop="owner_name"
          label="持有人">
        </el-table-column>
        <el-table-column
          prop="distance"
          label="事发地距离">
        </el-table-column>
        <el-table-column
          label="手机号">
          <template slot-scope="scope">
           <p class="info-phone-text">{{scope.row.terminal_number}}<span class="info-icon-phone" @click="toCallPhone(scope.row)"></span></p>
          </template>
        </el-table-column>
    </el-table>
</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'TiantongTerminal',
})
export default class TiantongTerminal extends Vue {
    public tableData: any;
    @Prop() private currentObj: any;

    private rowClick(data: any ) {
        // 改变显示与key ，以及根据id请求服务
        this.messsageBus.emit(this.currentObj.emitType, data.sim_info_id, 'sim_info_id') ;
    }
    // 数据赋值
    private setListData() {
        this.tableData = this.currentObj.resultData ;
    }
    // 打电话
    private toCallPhone(obj: any) {
      //
    }

    private mapClick() {
      const temp = 'gis_' + this.currentObj.emitType ;
      this.messsageBus.on(temp, (data: any) => {
          this.rowClick(data);
      });
    }

    private created() {
        this.setListData();
        this.mapClick() ;
    }
}
</script>
<style lang="less" scoped>
  @commandDispatchImg: '../../../../../../../../assets/img/CommandDispatch';
  .info-icon-phone{
    display:inline-block;
    width:22px;
    height:22px;
    background: url('@{commandDispatchImg}/iphone.png') no-repeat 0 0;
    margin-left:15px;
    cursor:pointer;
    vertical-align: middle
  }
  .info-phone-text{
    white-space: nowrap;
    margin:0;
    padding:0;
    vertical-align: middle
  }

</style>