<template>
  <div :class="{'no-select-all': noSelectAll}" class="typhoonInfo-table">
    <div class='tableWrap-height' v-if="tableInfo.class==='workTable'">
      <el-table
        :height="tableInfo.height"
        :data="tableInfo.data"
        @selection-change="handleSelectionChange"
        @row-click="handlerRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
        v-if="showTable"
        @sort-change="sortChange"
        header-row-class-name="table_header"
      >
        <el-table-column
          :type="tableInfo.selection===false?'index':'selection'"
          width="55"
          v-if="selection"
        ></el-table-column>
        <el-table-column v-if="tableInfo.isSingle" label=""
          width="65">
          <template slot-scope="scope">
            <el-radio v-model="tableInfo.defSel" :label="scope.row[tableInfo.radioId]" @change.native="getTemplateRow(scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        
        <el-table-column
          v-for="(item,index) in tableInfo.config"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </div>
     <div class='tableWrap-height' v-else>
      <el-table
        :height="tableInfo.height"
        :data="tableInfo.data"
        @selection-change="handleSelectionChange"
        @row-click="handlerRowClick"
        @select="handleSelect"
        @select-all="handleSelectAll"
        v-if="showTable"
        @sort-change="sortChange"
        header-row-class-name="table_header"
        highlight-current-row
      >
        <el-table-column
          :type="tableInfo.selection===false?'index':'selection'"
          v-if="selection"
        ></el-table-column>
        <el-table-column v-if="tableInfo.isSingle"
          label=""
          width='25'
          >
          <template slot-scope="scope">
            <el-radio v-model="tableInfo.defSel" 
              :label="scope.row[tableInfo.radioId]" 
              @change.native="getTemplateRow(scope.row)">
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        
        <el-table-column
          v-for="(item,index) in tableInfo.config"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
          :sortable="item.sortable"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
/**
 *  表格组件
 */
@Component({
  name: 'MyElTable',
})
export default class MyElTable extends Vue {
  private curRadio: boolean = false;
  // 表格数据 tableInfo
  @Prop() private tableInfo: any;
  // 是否开启复选框
  @Prop({ default: false }) private selection?: any;
  @Prop({ default: false }) private noSelectAll?: any;
  private showTable: any = true;
  // 选中的参数返回
  @Emit()
  public selectionChange(res: any) {
    return res;
  }
  @Emit()
  public rowClick(res: any) {
    return res;
  }
  @Emit()
  public select(selection: any, row: any) {
    return {
      selection,
      row,
    };
  }
  @Emit()
  public selectAll(selection: any) {
    return selection;
  }
  @Emit()
  public checkStatusBack(status: any, id: any) {
    return {
      check: status,
      id,
    };
  }
  @Watch('tableInfo')
  public onTableInfoChanged(n: any) {
    this.showTable = false;
    this.$nextTick(() => {
      this.showTable = true;
    });
  }
  // 复选之后的数据回调
  private handleSelectionChange(res: any) {
    this.selectionChange(res);
  }
  private handlerRowClick(res: any) {
    this.rowClick(res);
  }
  private handleSelect(selection: any, row: any) {
    this.select(selection, row);
    const result: any = selection.filter((d: any, i: any) => {
      return d.id === row.id;
    });
    this.checkStatusBack(result.length, row.id);
  }
  private handleSelectAll(selection: any) {
    this.selectAll(selection);
  }
  private sortChange(column: any, prop: any, order: any) {
    const tableData = this.tableInfo.data;
    const sortDescData = tableData.sort((a: any, b: any) => {
      if (a.sortType === 'number') {
        return order === 'desc' ? a[prop] - b[prop] : b[prop] - a[prop];
      }
    });
    this.$set(this.tableInfo, 'data', sortDescData);
  }
   // 单选
  private getTemplateRow(row: any) {
    const curRow: any = [...row];
    this.selectionChange(curRow);
    // debugger
    // console.log(this.tableInfo)

  }
}
</script>
<style lang="less">
  .typhoonInfo-table{
    width: 100%;
    background-color: transparent;
    border:rgba(0,246,255,.26) 1px solid;

    .el-table{
      background-color: transparent;
    }


    .el-table::before{
        background-color: transparent;
    }
    .cell{
        line-height: auto;
    }

    .el-table__header {
      background-color: transparent;
      width: 100% !important;
      tr {
        background: url("../../../assets/img/halfScreen/halflist/headerBg.png") repeat-x 0 0;
        background-size: 100% 100%;
        color: #00e8fd;
        font-size: 22px;
        th {
          padding: 6px 0;
          background: none;
          border-color: transparent;
        }
      }
    }

    .el-table__body {
      width: 100% !important;
    }
    .el-table__body-wrapper {

      &::-webkit-scrollbar {
        width: 6px;
        height: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(144,147,153,.3);
        border-radius: 3px;
      }

      .el-table__row {
        color: #ffffff;
        background-color: rgba(44, 70, 97, 0.4);
        td {
          padding: 6px 0;
          border-color: transparent;
          font-size:18px;
          &:nth-child(2){
            cursor: pointer;
          }
        }
        &:nth-child(2n) {
          background-color: rgba(44, 79, 97, 0.2);
          &:hover {
            background: #13344d;
          }
        }
        &:hover {
          color: #ffffff;
          background: #103048;
          td {
            background: none;
          }
        }
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover,
    .el-table__body tr.current-row {
      background: url('../../../assets/img/default/table/tableTdHover_bg.png');
      background-size: 100% 100%;
      td {
        background: transparent;
        color:#fff000;
      }
    }
    .el-table--enable-row-hover .el-table__body tr:active {
      background: url('../../../assets/img/default/table/tableTdHover_bg.png');
      background-size: 100% 100%;
      td {
        background: transparent;
      }
    }
    .sort-caret {
      border-width: 10px !important;
      cursor: pointer;
      &.ascending {
        top: -4px !important;
      }
      &.descending {
        bottom: -4px !important;
      }
    }

    .el-table__empty-block{
      background: url(../../../assets/img/default/panel/noData.png) no-repeat center center;
      
      .el-table__empty-text{
        display: none;
      }
    }

// .el-checkbox__input.is-disabled .el-checkbox__inner
    .el-checkbox{
      width: 100%;
      line-height: 30px;
      .el-checkbox__label{
        color: #f7fdff;
        font-size: 26px !important;
        line-height:1 !important;
        width: 97%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .el-checkbox__inner{
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: solid 1px #cee6ea;
          background: none!important;
          vertical-align: 4px;
      }
      .el-checkbox__inner:hover{
          border: solid 1px #cee6ea !important;
      }
      .el-checkbox__input{
          vertical-align: inherit !important;
          display: flex;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label{
          color: #fffabe !important;
          font-size: 26px;
          width: 97%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
      }
      .el-checkbox__inner::after {
          left: 6px !important;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner{
          background-image: linear-gradient(
                  rgba(215, 185, 64, 0.17),
                  rgba(215, 185, 64, 0.17)),
          linear-gradient(
                  #69690d,
                  #69690d);
          background-blend-mode: normal,
          normal;
          border-radius: 4px;
          border: solid 1px #fef551 !important;
      }
      .el-checkbox__input.is-indeterminate .el-checkbox__inner{
          background-image: linear-gradient(
                  rgba(215, 185, 64, 0.17),
                  rgba(215, 185, 64, 0.17)),
          linear-gradient(
                  #69690d,
                  #69690d);
          background-blend-mode: normal,
          normal;
          border-radius: 4px;
          border: solid 1px #fef551 !important;
      }
    }
  }
</style>

<style scoped lang="less">

.tableWrap-height{
  height: 100%;
}

</style>
