<!-- 列表-->
<template>
  <div class="commonListBody">
    <div :class="btnPlace? 'minimizeActive': 'minimize'" v-show="miniShow" @click="miniShow = false"></div>
    <div v-show="!miniShow" class="riskListPanel">
      <div :class="EventTitValue? 'gis-panel': 'gis-panelActvie'">
        <div class="gis-panel-title">
          <span :title="listTitle"  v-if="listTitleFlag" class="gis-panel-title-names">{{listTitle}}</span>
          <div class="lestDistrict-select" v-if="!listTitleFlag">
            <!--value-key-->
            <el-select class="constomMySelect" v-model="selectValue"  @change="selectChange" placeholder="请选择" value-key="name">
              <el-option
                v-for="item of SelectClass"
                :key="item.name"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="input-container" v-if="searchInput">
            <el-input type="text" v-model="inputData" class="search-out-line" @change="inputhange">
              <el-button slot="append" icon="el-icon-search" @click.stop="getDataByKeywords(inputData)"></el-button>
            </el-input>
          </div>
          <span class="gis-panel-title-btns">
            <a class="gis-panel-title-close" @click="closeList">
              ✖
              <b class="true"></b>
            </a>
          </span>

        </div>
        <div class="gis-panel-tableContainer">
          <a class="gis-panel-tableContainer-bottom" @click="miniShow = true"></a>
          <el-table
            v-loading = 'loading'
            :data="curTableData"
            stripe
            @row-click="handleRowClick"
            size="small"
            :header-row-class-name="headerRowStyleFunc"
            :row-class-name="rowStyleFunc"
            highlight-current-row
            style="width: 100%"
            class="tabBox"
          >
            <template slot="empty">
              <div class="nothingData--bg nothingData-size"></div>
            </template>
            <el-table-column
              align="center"
              width="100"
              type="index"
              :index="indexMethod"
              label="序号"
            ></el-table-column>

            <el-table-column
              v-for="(titem) of tableConfig"
              :key="titem.key"
              :width="titem.width"
              :label="titem.title"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row[titem.key] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="hasPage">
          <el-pagination
            class="full-list-page"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="curPageSize"
            layout="total, prev, pager, next"
            :total="totalNum"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'CommonList',
  components: {
  },
})
export default class CommonList extends Vue {

  @Prop() public paramForList: any;
  @Prop() public commonListFlag: any;
  @Prop() public commonListRowClick: any;
  @Prop() public closedThisPanel: any;
  @Prop() public inputSearchFun: any; // 搜索方法
  @Prop() public loading: any;
  public listTitle: string = ''; // 定义title
  public listTitleFlag: boolean = true; // 定义标题是否存在
  public inputData: any = ''; // 定义 input框取过来的值
  @Prop({
    default: true,
  })
  public searchInput?: boolean; // 定义 搜索框取过来的值
  public tableConfig: any[] = [];
  @Prop({
    default: true,
  })
  public hasPage?: boolean;
  public curTableData: any[] = [];
  private SelectClass: any[] = [];
  private curTableTotalArr = [];
  private miniShow = true;
  private selectValue: any = {};
  private curPageSize: number = 5;
  private currentPage: number = 1;
  private totalNum = 0;
  private btnPlace: boolean = true;
  private EventTitValue: any = '';
  private handleRowClick(row: any, rowIndex: any) {
    this.commonListRowClick(row, this.paramForList.curSelectItem.code);
    this.miniShow = true;
  }
  private indexMethod(index: number) {
    return (this.currentPage - 1) * this.curPageSize + (index + 1);
  }
  private inputhange(val: any) {
    if (val === '') {
      this.currentPage = 1;
      this.inputSearchFun('', this.selectValue);
    }
  }
  private getDataByKeywords(inputData: any) {
      this.currentPage = 1;
    // console.log('搜索按钮');
    //   this.selectValue.curSoureData = this.selectValue.detailData; // 为了给前端分页做缓存用的
      this.inputSearchFun(inputData, this.selectValue);
  }
  private selectChange(val: any) {
      this.currentPage = 1;
      this.inputData = '';
      this.selectValue = val;
      this.curTableTotalArr = this.selectValue.detailData;
      this.curTableData = this.curTableTotalArr; // 表格数据
      this.totalNum = val.num; // 总条数
      this.tableConfig = this.selectValue.tableConfig;
      this.inputSearchFun('', this.selectValue);

    // 由前端分页改成后端分页（前端分页代码）
    // this.curTableData = this.curTableTotalArr.slice(this.curPageSize * (this.currentPage - 1), this.curPageSize * this.currentPage);
    // this.totalNum = this.curTableTotalArr.length;
  }
  private closeList() {
    this.closedThisPanel();
    this.inputSearchFun('', '');
  }
  private headerRowStyleFunc(row: any) {
    return 'headerRowStyle';
  }
  private rowStyleFunc(row: any) {
    const rowIndex = row.rowIndex;
    if (rowIndex % 2 === 0) {
      return 'dbRow';
    } else {
      return 'defaultRow';
    }
  }
  private handleCurrentChange(val: number) {
    this.currentPage = val;
    // this.setCurConfig(this.paramForList);
    // 由前端分页改成后端分页（前端分页代码）
    // this.curTableData = this.curTableTotalArr.slice(this.curPageSize * (this.currentPage - 1), this.curPageSize * this.currentPage);
    this.$emit('handleCurrentChange', this.curPageSize, this.currentPage, this.selectValue);
  }
  @Watch('paramForList')
  private setCurConfig(paramForList: any) {
      if (!paramForList.isInputFlag) { // 不是从input关键字查询后的返回
          this.miniShow = false;
      }
      this.listTitleFlag = !paramForList.isHasSelect;
      // this.currentPage = 1;
      this.selectValue = paramForList.curSelectItem;
      if (this.listTitleFlag) {
          this.listTitle = paramForList.curSelectItem.name;
          this.curTableTotalArr = paramForList.curCheckedItemArr[0].detailData;
          this.curTableData = this.curTableTotalArr;
          this.totalNum = paramForList.total;
          this.tableConfig = paramForList.curCheckedItemArr[0].tableConfig;
          // this.selectValue = paramForList.curSelectItem;

          // 由前端分页改成后端分页（前端分页代码）
        // this.curTableData = this.curTableTotalArr.slice(this.curPageSize * (this.currentPage - 1), this.curPageSize * this.currentPage);
        // this.totalNum = this.selectValue.detailData.length;
      } else {
          this.SelectClass = paramForList.curCheckedItemArr;
          // this.selectValue = paramForList.curSelectItem;
          this.curTableTotalArr = this.selectValue.detailData;
          this.totalNum = paramForList.total;
          this.tableConfig = this.selectValue.tableConfig;
          this.curTableData = this.curTableTotalArr;

          // 由前端分页改成后端分页（前端分页代码）
        // this.totalNum = this.selectValue.detailData.length;
        // this.curTableData = this.curTableTotalArr.slice(this.curPageSize * (this.currentPage - 1), this.curPageSize * this.currentPage);
      }
      if (this.listTitle === paramForList.curSelectItem.name) {
      this.miniShow = false;
      }
  }
  @Watch('$store.state.eventPushStore.eventLocation.EventTit')
  private eventTitFn(val: any) {
    if (val) {
      // 监听到有值列表面板上调
      this.EventTitValue = val;
    }
  }
  // 点击左侧checked 页码归1
  private init() {
    this.messsageBus.on('currentPage', () => {
      this.currentPage = 1;
      this.inputData = '';
    });
    this.messsageBus.on('2rd', () => {
      this.btnPlace = true;
    });
    this.messsageBus.on('default', () => {
      this.btnPlace = false;
    });
  }
  private created() {
    this.EventTitValue = this.$store.state.eventPushStore.eventLocation.EventTit;
    this.setCurConfig(this.paramForList);
    this.init();
  }
}
</script>

<style lang="less">
.commonListBody {
  /deep/ .menu-search {
    line-height: 40px !important;
  }
}
</style>
<style scoped lang="less">
@imgurl: '../../../../assets/img/popupsborder/';
@tableTdHover : '../../../../assets/img/default/table/tableTdHover_bg.png';
.minimize {
  height: 43px;
  position: absolute;
  bottom: -773px;
  left: 823px;
  color: #fff;
  cursor: pointer;
  display: block;
  background: url('@{imgurl}anc.png') center no-repeat;
  background-size: contain;
  padding: 0px 60px;
  font-size: 20px;
  line-height: 106px;
  transform: translateX(-50%);
  z-index: 4;
  &:hover {
    background: url('@{imgurl}ancHove.png') center no-repeat;
    background-size: contain;
  }
}
.minimizeActive {
  height: 43px;
  position: absolute;
  bottom: -929px;
  left: 598px;
  color: #fff;
  cursor: pointer;
  display: block;
  background: url('@{imgurl}anc.png') center no-repeat;
  background-size: contain;
  padding: 0px 60px;
  font-size: 20px;
  line-height: 106px;
  transform: translateX(-50%);
  z-index: 4;
  &:hover {
    background: url('@{imgurl}ancHove.png') center no-repeat;
    background-size: contain;
  }
}
.gis-panelActvie{
  position: absolute;
  bottom: -940px;
  left: 72%;
  /* margin-left: -465px;*/
  box-sizing: border-box;
  width: 930px;
  /* height: 360px; */
  height: 400px;
  background: url('@{imgurl}tankpng.png') center no-repeat;
  background-size: 100% 100%;
  padding: 11px 22px 20px;
  z-index: 12;
  &-title {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    position: relative;
    overflow: hidden;
    &-names {
      color: #b9d0e1;
      float: left;
      text-align: center;
      width: 170px;
      display: block !important;
      top: 22%;
      left: 2%;
      white-space: nowrap;
      cursor: pointer;
      height: 44px;
      line-height: 44px;
      background-size: 100% 100%;
      font-size: 18px;
      color: #d5e5ff;
      position: relative;
      padding-right: 30px;
    }
    &-btns {
      float: right;
      margin-top: 17px;
      a {
        font-size: 24px;
        color: #11cfea;
        position: absolute;
        right: 34px;
        top: -6px;
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
    }
    .input-container {
      width: 50%;
      display: flex;
      align-items: center;
      .search-out-line {
        border: 1px solid #0ceff5;
        border-radius: 4px;
        width: 40%;
        position: absolute;
        right: 67px;
        top: 14px;
        /deep/ .el-input__inner {
          background: none;
          border-radius: 4px;
          border: 1px solid transparent;
          font-size: 20px;
          color: #fff;
        }
      }
      /deep/ .el-icon-search::before {
        color: #0ceff5;
      }
      /deep/ .el-input-group__append {
        background: none;
        border-radius: 4px;
        border: 1px solid transparent;
        color: #fff;
        font-size: 20px;
      }
    }
    .lestDistrict-select{
      width:20%;
      margin-left:10px;
    }
  }
  &-tableContainer {
    height: 235px;
    min-height: 235px;
    &-bottom {
      font-size: 14px;
      font-weight: 900;
      position: absolute;
      width: 113px;
      margin-right: 10px;
      height: 58px;
      display: inline-block;
      text-align: right;
      background: url('@{imgurl}collapse.png') center no-repeat;
      background-size: 100% 100%;
      top: -16px;
      left: 50%;
      transform: translate(-50%) scale(1,-1);
      cursor: pointer;
      &:hover {
        background: url('@{imgurl}collapse_hover.png') center no-repeat;
        background-size: 100% 100%;
      }
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: transparent;
    }
    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
      border-bottom: 0 !important;
      cursor: pointer;
    }
    .el-table td.is-center,
    .el-table th.is-center {
      border-bottom: 0 !important;
    }
    /deep/ .tabBox {
      background: transparent;
      font-weight: 900;
      text-align: center;
      font-size: 20px;
      color: #b9d0e1;
    }
    /deep/ .dbRow {
      background: rgba(1, 35, 62, 0.6);
      border: none;
    }
    /deep/ .defaultRow {
      background: transparent;
      border: none;
      td {
        background: transparent !important;
      }
    }
    /deep/ .headerRowStyle {
      background: transparent;
      th {
        background: transparent;
        color: #b9d0e1;
        font-size: 20px;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover{
      background: url(@tableTdHover) center no-repeat;
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/  .el-table__body tr.current-row {
      background: url('@{imgurl}selected.png') center no-repeat;
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:active {
      background: url(@tableTdHover) center no-repeat;
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/ .el-table th > .cell {
      display: table;
      line-height: 36px;
    }
    .el-table::before {
      height: 0;
    }
  }
  .full-list-page.el-pagination {
    text-align: center;
    margin-top: 15px;
    /deep/ button,
    /deep/ button:disabled {
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
      margin: 0 2px;
    }
    span {
      color: #fff;
    }
    /deep/ .el-pager li {
      background: rgba(255, 255, 255, 0);
      color: #fff;
      border: 1px solid #fff;
      margin: 0 2px;
      cursor: pointer;
    }
    /deep/ .el-pager li.active {
      color: #00ffff;
      cursor: default;
      border: 1px solid #00ffff;
      margin: 0 2px;
      cursor: pointer;
    }
    .el-input__inner {
      background-color: rgba(20, 212, 250, 0);
      color: #fff;
      border: none;
      border-bottom: 1px solid #fff;
    }
    /deep/ .el-pagination__total,
    /deep/ .el-pagination__jump {
      color: #b9d0e1;
    }
  }
}
.gis-panel {
  position: absolute;
  bottom: -858px;
  left: 72%;
  /* margin-left: -465px;*/
  box-sizing: border-box;
  width: 930px;
  /* height: 360px; */
  height: 400px;
  background: url('@{imgurl}tankpng.png') center no-repeat;
  background-size: 100% 100%;
  padding: 11px 22px 20px;
  z-index: 12;
  &-title {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    position: relative;
    overflow: hidden;
    &-names {
      color: #b9d0e1;
      float: left;
      text-align: center;
      width: 170px;
      display: block !important;
      top: 22%;
      left: 2%;
      white-space: nowrap;
      cursor: pointer;
      height: 44px;
      line-height: 44px;
      background-size: 100% 100%;
      font-size: 18px;
      color: #d5e5ff;
      position: relative;
      padding-right: 30px;
    }
    &-btns {
      float: right;
      margin-top: 17px;
      a {
        font-size: 24px;
        color: #11cfea;
        position: absolute;
        right: 34px;
        top: -6px;
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
    }
    .input-container {
      width: 50%;
      display: flex;
      align-items: center;
      .search-out-line {
        border: 1px solid #0ceff5;
        border-radius: 4px;
        width: 40%;
        position: absolute;
        right: 67px;
        top: 14px;
        /deep/ .el-input__inner {
          background: none;
          border-radius: 4px;
          border: 1px solid transparent;
          font-size: 20px;
          color: #fff;
        }
      }
      /deep/ .el-icon-search::before {
        color: #0ceff5;
      }
      /deep/ .el-input-group__append {
        background: none;
        border-radius: 4px;
        border: 1px solid transparent;
        color: #fff;
        font-size: 20px;
      }
    }
  }
  &-tableContainer {
    height: 235px;
    min-height: 235px;
    &-bottom {
      font-size: 14px;
      font-weight: 900;
      position: absolute;
      width: 113px;
      margin-right: 10px;
      height: 58px;
      display: inline-block;
      text-align: right;
      background: url('@{imgurl}collapse.png') center no-repeat;
      background-size: 100% 100%;
      top: -16px;
      left: 50%;
      transform: translate(-50%) scale(1,-1);
      cursor: pointer;
      &:hover {
        background: url('@{imgurl}collapse_hover.png') center no-repeat;
        background-size: 100% 100%;
      }
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: transparent;
    }
    /deep/ .el-table td,
    /deep/ .el-table th.is-leaf {
      border-bottom: 0 !important;
      cursor: pointer;
    }
    .el-table td.is-center,
    .el-table th.is-center {
      border-bottom: 0 !important;
    }
    /deep/ .tabBox {
      background: transparent;
      font-weight: 900;
      text-align: center;
      font-size: 20px;
      color: #b9d0e1;
    }
    /deep/ .dbRow {
      background: rgba(1, 35, 62, 0.6);
      border: none;
    }
    /deep/ .defaultRow {
      background: transparent;
      border: none;
      td {
        background: transparent !important;
      }
    }
    /deep/ .headerRowStyle {
      background: transparent;
      th {
        background: transparent;
        color: #b9d0e1;
        font-size: 20px;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover{
      background: url(@tableTdHover) center no-repeat;
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/  .el-table__body tr.current-row {
      background: url('@{imgurl}selected.png') center no-repeat;
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:active {
      background: url(@tableTdHover) center no-repeat;
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/ .el-table th > .cell {
      display: table;
      line-height: 36px;
    }
    .el-table::before {
      height: 0;
    }
  }
  .full-list-page.el-pagination {
    text-align: center;
    margin-top: 15px;
    /deep/ button,
    /deep/ button:disabled {
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
      margin: 0 2px;
    }
    span {
      color: #fff;
    }
    /deep/ .el-pager li {
      background: rgba(255, 255, 255, 0);
      color: #fff;
      border: 1px solid #fff;
      margin: 0 2px;
      cursor: pointer;
    }
    /deep/ .el-pager li.active {
      color: #00ffff;
      cursor: default;
      border: 1px solid #00ffff;
      margin: 0 2px;
      cursor: pointer;
    }
    .el-input__inner {
      background-color: rgba(20, 212, 250, 0);
      color: #fff;
      border: none;
      border-bottom: 1px solid #fff;
    }
    /deep/ .el-pagination__total,
    /deep/ .el-pagination__jump {
      color: #b9d0e1;
    }
  }
}
</style>
