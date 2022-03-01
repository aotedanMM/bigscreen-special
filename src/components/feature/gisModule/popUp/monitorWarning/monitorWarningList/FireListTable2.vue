<template>
  <div class="RiverListBox2 listDistrict-specil" v-show="mianbanShow">
    <div
      class="minimize-position"
      v-show="!isUnfold"
      @click="isUnfold = !isUnfold"
    ></div>
    <div class="RiverListBoxMain">
      <div class="listDistrict_body popupPanelBottom_bg" v-show="isUnfold">
        <div class="header">
          <div class="title">{{title}}</div>

          <div class="headerRightBox">
            <span class="minimize" @click="isUnfold = !isUnfold"></span>
            <span class="close" @click="handleClosePop"></span>
          </div>
        </div>
        <div class="listDistrict filter" style="height:42px;">
          <div class="inputBox">
            <el-input
              class="csmMyInput"
              type="text"
              placeholder="名称"
              v-model.trim="inputValue"
              @input="serach(inputValue)"
            >
              <i slot="suffix" class="iconSelf_search"></i>
            </el-input>
          </div>
          <div class="timeBox">
            <el-date-picker
              v-model="fireBytime"
              popper-class="ytDateTimePicker"
              class="ytDateTimePicker"
              type="datetimerange"
              range-separator="至"
              :start-placeholder="startTime"
              :end-placeholder="endTime"
              format="MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :default-value="defaultValue"
              @change="selectTimeChange"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="lodingTwo" v-if="loading">
          <span></span>
        </div>
        <div class="tableContainerTwo" v-else>
          <el-table
            :data="tableList"
            stripe
            @row-click="handleShowDetail"
            size="small"
            highlight-current-row
            :header-row-class-name="headerRowStyleFunc"
            :row-class-name="rowStyleFunc"
            style="width: 100%;"
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
              v-for="titem of tableConfig"
              :key="titem.key"
              :width="titem.width"
              :label="titem.title"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span class="f-txt-com fontHeight">
                  {{ scope.row[titem.key] ? scope.row[titem.key] : '' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="!loading">
          <el-pagination
            class="full-list-page"
            :current-page.sync="byValue.nowPage"
            @current-change="handleCurrentChange"
            :page-size="byValue.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import Select from '@/components/feature/flood/MonitorWarning/Select.vue';
import publishObjectPath from '@/util/configRegistry';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { firePointMonitorServer } from '@/api/feature/monitorwarning/installServer';
@Component({
  name: 'FireListTable',
  components: {
    Select,
  },
})
export default class FireListTable extends Vue {
  public mianbanShow: any = true; // 点击表格后隐藏当前列表
  public loading: boolean = true;
  private title: any = '';
  private codeKey: any = '';
  private fireBytime: any = []; // 时间选择器动态绑定的值
  private defaultValue: any = [];
  private startTime: string = ''; // 默认开始时间
  private endTime: string = ''; // 默认结束时间
  private tableConfig: any = '';
  // 控制时间选择选择不能超过当前时间
  private pickerOptions: any = {
          disabledDate(time: any) {
           // 刘云梦2022/02/24修改当前时间前2小时不能选择的bug,这里的disabledDate不要减8.64e6
            return time.getTime() > Date.now();
          },
        };
  private mapList: any = []; // 地图上点数据
  private inputValue: any = ''; // 名称搜索
  private total: number = 0; // 列表总条数
  private isUnfold: boolean = true; // 是否最小化
  private byValue: any = {
    nowPage: 1, // 当前页
    pageSize: 5, // 每页显示多少条
    keyWord: '',
    startTime: '',
    endTime: '',
  };
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private tableList: any = []; // 列表数据
  public indexMethod(index: number) {
    return (this.byValue.nowPage - 1) * this.byValue.pageSize + (index + 1);
  }
  /**
   * 关闭弹框
   */
  public handleClosePop() {
    this.getComponent()._clear('historyFire', this.mapList);
    const params = {
      isShow: false,
    };
    this.$store.commit('mapTools/changeShowFireList2', params);
  }
  // 初始化时间
  private initTime() {
    // 刘云梦2022/02/25判断当前是今日报警还是历史报警,修改时间控件的初始日期
    if (this.title === '今日报警企业') {
      // 时间控件初始值
      this.defaultValue = [this.getNowTime(new Date().getTime(), false, true), new Date()];
      // 开始时间
      this.startTime = this.getNowTime(
        new Date().getTime(),
        true,
        true,
      );
      // 结束时间
      this.endTime = this.getNowTime(new Date(), true);
      // 查询时间
      this.byValue.startTime = this.getNowTime(
        new Date().getTime(),
        null,
        true,
      );
      this.byValue.endTime = this.getNowTime(new Date());
    } else {
      // 时间控件初始值
      this.defaultValue = [
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
        new Date(),
      ];
      // 开始时间
      this.startTime = this.getNowTime(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
        true,
      );
      // 结束时间
      this.endTime = this.getNowTime(new Date(), true);
      // 查询时间
      this.byValue.startTime = this.getNowTime(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
      );
      this.byValue.endTime = this.getNowTime(new Date());
    }
  }
  private headerRowStyleFunc(row: any) {
    return 'headerRowStyle';
  }
  private rowStyleFunc(row: any) {
    // // hasgeo  是否有空间数据 0-无 1-有
    // if (row.row.hasgeo === '0'){
    //   return 'gray';
    // }
    const rowIndex = row.rowIndex;
    if (rowIndex % 2 === 0) {
      return 'defaultRow';
    } else {
      return 'defaultRow';
    }
  }

  private async changeTitle() {
    this.byValue.state = this.$store.state.mapTools.showFireList2.state;
    // 刘云梦2022/02/21 企业监测-获取报警企业列表,时间未按倒序排列,增加参数sortField
    this.byValue.sortField = 'ts';
    const res: any = await firePointMonitorServer.enterpriseAlarmList(this.byValue);
    this.total = res.total;
    this.tableList = res.list;
    this.loading = false;
  }
  @Watch('$store.state.mapTools.showFireList2', { deep: true , immediate: true})
  private initData(val: any) {
    this.tableConfig = [
          {
            key: 'dsc',
            title: '名称',
            // width: 200,
          },
          // {
          //   key: 'address',
          //   title: '地址',
          //   //   width: 300,
          // },
          {
            key: 'ts',
            title: '时间',
            // width: 280,
          },
        ];
    // 每次进来清空数据
    this.fireBytime = []; // 时间选择器动态绑定的值
    this.defaultValue = [];
    this.startTime = ''; // 默认开始时间
    this.endTime = ''; // 默认结束时间
    this.inputValue = '';
    this.mapList = '';
    this.total = 0;
    this.tableList = '';
    this.loading = true;
    this.title = val.title;
    this.initTime();
    this.codeKey = val.codeKey;
    this.changeTitle();
    this.byValue.nowPage = 1;
  }
  /**
   * 名称搜索
   */
  private serach(value: any) {
    const self = this;
    this.loading = true;
    this.byValue.nowPage = 1;
    this.byValue.keyWord = this.inputValue;
    setTimeout(() => {
      self.changeTitle();
    }, 1000);
  }
  /**
   * 列表点击
   */
  private handleShowDetail(e: any) {
    this.$store.commit('mapTools/changeqiyejiance', {qiyejianceShow: true, qiyejianceData: e});
    this.mianbanShow = false;
    // console.log(this.$store.state.mapTools.qiyejiance.qiyejianceShow);
    // console.log(e)
      // e.x = e.longitude;
      // e.y = e.latitude;
      // this.getComponent()._addItemHight('firePointToday', e);
    //   switch (this.codeKey) {
    //   case 'fireMessage':
    //     this.getComponent()._addItemHight('firePointToday', e);
    //     break;
    //   case 'histroyFire':
    //     this.getComponent()._addItemHight('historyFire', e);
    //   default:
    //     break;
    // }
  }

  // 时间选择器选择时间
  private selectTimeChange(val: any) {
    if (val) {
      this.byValue.startTime = val[0];
      this.byValue.endTime = val[1];
    } else {
      this.byValue.startTime = this.getNowTime(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
      );
      this.byValue.endTime = this.getNowTime(new Date());
    }
    this.changeTitle();
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.byValue.nowPage = val;
    this.changeTitle();
  }
  // 获取时间
  // nowdate 时间
  // type 返回值类型
  // today是否返回当日的零时
  private getNowTime(nowdate: any, type?: any, today?: any) {
    const nowDate = new Date(nowdate);
    const year = nowDate.getFullYear();
    const month =
      nowDate.getMonth() + 1 < 10
        ? '0' + (nowDate.getMonth() + 1)
        : nowDate.getMonth() + 1;
    const date =
      nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
    const hour =
      nowDate.getHours() < 10 ? '0' + nowDate.getHours() : nowDate.getHours();
    const minute =
      nowDate.getMinutes() < 10
        ? '0' + nowDate.getMinutes()
        : nowDate.getMinutes();
    const second =
      nowDate.getSeconds() < 10
        ? '0' + nowDate.getSeconds()
        : nowDate.getSeconds();
    if (type) {
      // 返回MM-dd HH:mm
      if (today) {
        // 返回当日的HH:mm 00:00
        return `${month}-${date} 00:00`;
      } else {
        return `${month}-${date} ${hour}:${minute}`;
      }
    } else {
      // 返回yyyy-MM-dd HH:mm:ss
      if (today) {
        // 返回yyyy-MM-dd 00:00:00
        return `${year}-${month}-${date} 00:00:00`;
      } else {
        return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
      }
    }
  }
  private async getFireBehaviorList(opts: any) {
    console.log(opts);
    const res: any = await firePointMonitorServer.getFireBehaviorList(opts);
    this.total = res.total;
    // if(res.list.length) {
    //   res.list.forEach((item: any) => {
    //     item.occurTime = item.occurTime.slice(0,16);
    //   })
    // }
    this.tableList = res.list;
    this.loading = false;
  }
  private async getFireBehaviorAllList(opts: any) {
    const obj = {
      keyWord: opts.keyWord,
      startTime: opts.startTime,
      endTime: opts.endTime,
    };
    const res: any = await firePointMonitorServer.getHistoryFireData(obj);
    this.mapList = res.list;
    this.getComponent()._showResource('historyFire', res.list);
  }
    // 历史火点列表分页信息用
  private async getHistoryFireData(opts: any) {
    const res: any = await firePointMonitorServer.getHistoryFireData(opts);
    this.total = res.total;
    this.tableList = res.list;
    this.loading = false;
  }
  // 历史火点全部信息用于点位上图
  private async getHistoryFireAllData(opts: any) {
    const obj = {
      keyWord: opts.keyWord,
      startTime: opts.startTime,
      endTime: opts.endTime,
    };
    const res: any = await firePointMonitorServer.getHistoryFireData(obj);
    this.mapList = res.list;
    this.getComponent()._showResource('firePointToday', res.list);
  }
  private beforeDestroy() {
    this.$store.commit('mapTools/changeqiyejiance', {qiyejianceShow: false, qiyejianceData: {}});
    this.getComponent()._clear('historyFire', this.mapList);
    this.getComponent()._clearAll();
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'ResourceQuery',
    );
    return component;
  }
}
</script>
<style lang="less" scoped>
/deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color:transparent !important;
}
/deep/.el-table__body tr .current-row>td{
  background-color: transparent !important;
}
/deep/.el-table__body tr.current-row>td{
  background-color: transparent !important;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover{
  background: url('../../../../../../assets/img/default/table/tableTdHover_bg.png');
  background-size:100% 100%;
}
/deep/.el-table--enable-row-hover .el-table__body tr:active{
  background: url('../../../../../../assets/img/default/table/tableTdHover_bg.png');
  background-size:100% 100%;
}
</style>
<style lang="less">
.fontHeight {
  line-height: 1;
  font-size: 22px!important;
}
.el-tooltip__popper {
  // width: 300px;
  font-size: 24px !important;
  // padding:10px 15px!important;
  line-height: 1.25 !important;
}
.el-select__tags {
  white-space: nowrap;
  overflow: hidden;
  flex-wrap: inherit !important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background: none !important;
}
.listDistrict .full-list-page.el-pagination .el-input__inner {
  font-size: 22px;
}
.el-pagination__editor.el-input {
  font-size: 22px;
}
.el-tooltip__popper {
  max-width: 1000px;
  padding-left: 20px !important;
  padding-right: 10px !important;
}
</style>
<style lang="less">
// background-image: url(../../../../../assets/img/gisModule/tankpng.png);
@import url('../../../../../../assets/css/variable.less');
@commonPath: '../../../../../../assets/img/gisModule/common'; // 定义路径
@path: '../../../../../../assets/img/gisModule/districtDialog/'; // 定义路径
@tableTdHover: '../../../../../../assets/img/default/table/tableTdHover_bg.png';
.nothingData-size {
  width: 165px !important;
  height: 165px !important;
  margin-left: 30%;
}
/deep/.el-tooltip__popper {
  font-size: 26px;
  padding: 10px;
}
.listDistrict-specil {
  .closed-container {
    position: absolute;
    right: -30px;
    cursor: pointer;
    font-size: 22px;
    white-space: nowrap;
    vertical-align: top;
    // background: url('@{commonPath}/tablelistbgblue_close_bg.png') no-repeat 0 0;
    height: 45px;
    width: 119px;
    padding-left: 26px;
    margin-top: -3px;
    box-sizing: border-box;
    padding-top: 5px;
  }
}
.RiverListBox2 {
  &_body {
    height: 350px;
    width: 1000px;
    padding: 15px 22px;
  }
  // &_toMinify {
  //   position:absolute;
  //   bottom:-29px;;
  //   left:50%;
  //   width:110px;;
  //   height:36px;
  //   background: url('@{commonPath}/toMinifyBtn.png') no-repeat 50% 0;
  //   background-size:100% 100%;
  //   cursor: pointer;
  // }
  &_close {
    display: inline-block;
    width: 53px;
    height: 30px;
    cursor: pointer;
    vertical-align: top;
    text-align: center;
    &::after {
      content: '\2716';
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  &_minifyBtn {
    display: inline-block;
    width: 53px;
    height: 30px;
    cursor: pointer;
    text-align: center;
    vertical-align: top;
    font-weight: bold;
    &:after {
      content: '\2013';
      display: inline-block;
      width: 100%;
      line-height: 36px;
    }
  }

  .full-list-page.el-pagination {
    margin-top: 38px;
    button,
    button:disabled {
      background-color: transparent;
      color: #fff;
    }
    span {
      color: #fff;
      font-size: 22px;
    }
    /*.el-pager {
            li.active {
                color: #00e4ff;
            }
        }*/
    .el-pager li {
      background: rgba(255, 255, 255, 0);
      color: #fff;
      font-size: 22px;
    }
    .el-pager li.active {
      color: #409eff;
      cursor: default;
      font-size: 22px;
    }
    .el-input__inner {
      background-color: rgba(20, 212, 250, 0);
      color: #fff;
      border: none;
      border-bottom: 1px solid #fff;
    }
  }

  .function-container {
    width: 100%;
    display: flex;
    align-items: center;
    .title-container {
      color: #fda100;
      padding: 0 30px;
      font-size: 30px;
    }
    .select-container {
      margin-left: 5%;
      height: 38px;
      padding: 0;
      border: 1px solid #0ceff5;
      .el-select {
        margin: 0;
        float: left;
        .el-input {
          border-radius: 4px;
        }
        .el-input__inner {
          background: none;
          border-radius: 4px;
          border: none;
          font-size: 20px;
          color: #fff;
        }
      }
      .el-button {
        float: left;
        height: 38px;
        padding: 0 20px;
        background: none;
        border: none;
        font-size: 20px;
        color: #fff;
      }
    }

    .input-container {
      width: 25%;
      display: flex;
      align-items: center;

      .search-out-line {
        border: 1px solid #0ceff5;
        border-radius: 4px;
        .el-input__inner {
          background: none;
          border-radius: 4px;
          border: 1px solid transparent;
          font-size: 20px;
          color: #fff;
        }
      }
      .el-input-group__append {
        background: none;
        border-radius: 4px;
        border: 1px solid transparent;
        color: #fff;
        font-size: 20px;
      }
    }

    .sort-container {
      margin-left: 20px;
      span {
        font-size: 18px;
      }
      .el-button {
        padding: 0;
        width: 80px;
        height: 40px;
        background-color: #fff;
        color: #000;
        border-color: transparent;
      }
      .el-button:focus,
      .el-button:hover {
        background: #0172a1;
        color: #fff;
      }
      .el-button.is-disabled,
      .el-button.is-disabled:focus,
      .el-button.is-disabled:hover {
        background: #0172a1;
        color: #fff;
      }
    }
  }
  .lodingTwo {
    height: 277px;
    width: 100%;
    position: absolute;
    background: url('../../../../../../assets/img/default/panel/half_bg1.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    z-index: 20;
    margin-top: -30px;
    span {
      display: inline-block;
      width: 300px;
      height: 220px;
      background: url('../../../../../../assets/img/halfScreen/halflist/loading.gif')
        no-repeat;
      background-size: 100% 100%;
      margin-top: 29px;
    }
  }
  /deep/.el-table__body tr .current-row>td{
    background-color: red !important;
  }
  /deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: red !important;
  }
  .tableContainerTwo {
    /deep/ .el-table__body tr:hover>td{
      background-color: red !important;
    }
    /deep/ .current-row>td{
      background-color: red !important;
    }
    height: 235px;
    min-height: 235px;

    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background: transparent;
    }
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 0;
      cursor: pointer;
    }
    /deep/ .tabBox {
      background: transparent;
      font-weight: 900;
      text-align: center;
      font-size: 26px;
      color: #fff;
    }
    /deep/ .dbRow {
      background: rgba(1, 35, 62, 0.6) !important;
      border: none;
      td {
        color: #fff;
      }
    }
    /deep/ .defaultRow {
      background: transparent;
      border: none;
      td {
        background: transparent;
        color: #fff;
      }
    }
    /deep/ .gray {
      background: transparent;
      border: none;
      td {
        background: transparent;
        color: gray;
      }
    }
    /deep/ .headerRowStyle {
      background: transparent;
      height: 50px;
      th {
        background: transparent;
        color: #00e4ff;
        font-size: 28px;
        line-height: 1;
        padding: 5px 0;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr {
      background: transparent;
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover,
    .el-table__body tr.current-row {
      background: url(@tableTdHover);
      background-size: 100% 40px;
      td {
        background: transparent;
      }
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:active {
      background: url(@tableTdHover);
      background-size: 100% 40px;
      td {
        background: transparent !important;
      }
    }
    .el-table::before {
      height: 0;
    }
    .el-table .cell {
      line-height: 29px;
    }
  }
}
</style>
<style lang="less" scoped>
@import url('../../../../../../assets/css/variable.less');
@imgPath: '../../../../../../assets/img/halfScreen/halflist';
@popPath: '../../../../../../assets/img/gisModule/gisLayerPanel/layerPopup';
@tableTdHover: '../../../../../../assets/img/default/table/tableTdHover_bg.png';
@commonPath: '../../../../../../assets/img/gisModule/common'; // 定义路径
@path: '../../../../../../assets/img/gisModule/districtDialog/'; // 定义路径
@url: '../../../../../../assets/img/darkgreen';
.RiverListBox2 {
  .minimize-position {
    bottom: 0;
    z-index: 300 !important;
  }
  .tableContainerTwo {
    margin-top: -42px;
  }
}
.listDistrict_body {
  pointer-events: all;
}
.RiverListBoxMain {
  position: absolute;
  left: 15%;
  bottom: 36px;
  width: 1000px;
  pointer-events: none;
  height: 380px;
  z-index: 300;
  box-sizing: border-box;
  .header {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    //  padding: 29px 20px 0 55px;
    .title {
      font-size: 30px;
      color: #fda100;
      margin-left: 12px;
      margin-top: 6px;
    }
    .headerRightBox {
      position: absolute;
      top: -1px;
      right: -8px;
      width: 120px;
      height: 45px;
      background: url('@{popPath}/listCloseBtn.png') no-repeat 0 0;
      background-size: 100% 100%;
      color: #00e4ff;
      cursor: pointer;
      z-index: 1;
      span {
        display: inline-block;
        width: 45px;
        height: 45px;
        line-height: 35px;
        cursor: pointer;
        text-align: center;
        vertical-align: middle;
        font-weight: bold;
        font-size: 20px;
      }
      .minimize {
        margin-left: 25px;
        &::after {
          content: '\2014';
          width: 100%;
        }
      }
      .close::after {
        content: '\2716';
        width: 100%;
      }
    }
  }
  .filter {
    position: relative;
    top: -38px;
    left: 200px;
    display: flex;
    align-items: center;
    width: 620px;
    .timeBox {
      width: 200px;
      margin-left: 16px;
    }
    .inputBox {
      width: 240px;
    }
    > div {
      // flex: 1;
      /deep/.select_container {
        .down_title {
          background-color: transparent;
          border: 1px solid rgba(43, 246, 254, 0.5);
          &:hover {
            width: calc(100% + 2px);
            height: 36px;
            border: none;
            > span {
              line-height: 36px;
              padding-left: 1px;
            }
            > .arrow-down {
              top: 3px;
              right: 2px;
            }
          }
        }
      }
    }
    /deep/.csmMyInput {
      height: 41px;
      .el-input__inner {
        background: transparent !important;
      }
    }
    input::-webkit-input-placeholder {
      color: #c4d7da;
    }
    input:-ms-input-placeholder {
      color: #c4d7da;
    }
  }
  .body {
    width: 100%;
    box-sizing: border-box;
    margin-top: -27px;
    .content {
      height: 252px;
      .tableHeader {
        height: 50px;
        li {
          display: flex;
          align-items: center;
          height: 100%;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #00e4ff;
            font-size: 28px;
            font-weight: 600;
            padding: 0 10px;
            &:nth-child(1) {
              width: 100px;
            }
            &:nth-child(2) {
              width: 450px;
              justify-content: left;
            }
            &:nth-child(3) {
              width: 450px;
              justify-content: left;
            }
          }
        }
      }
      .bodyScroll {
        height: 225px;
      }
      .tableBody {
        li {
          display: flex;
          align-items: center;
          // height: 45px;
          line-height: 45px;
          cursor: pointer;
          &:nth-of-type(odd) {
            background: rgba(1, 35, 62, 0.6);
          }
          &.active,
          &:hover {
            background: url(@tableTdHover);
            background-size: 100% 100%;
          }
          span {
            display: flex;
            align-items: center;
            height: 100%;
            color: #fff;
            font-size: 26px;
            font-weight: 900;
            padding: 0 10px;
            &:nth-child(1) {
              width: 100px;
              justify-content: center;
            }
            &:nth-child(2) {
              width: 450px;
              height: 45px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
              white-space: nowrap;
            }
            &:nth-child(3) {
              width: 450px;
              // width: calc(100% - 300px);
              overflow: hidden;
              text-overflow: ellipsis;
              display: block;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 32px;
    .full-list-page.el-pagination {
      margin-top: 17px;
      margin-left: 22px;
      button,
      button:disabled {
        background-color: transparent;
        color: #fff;
      }
      span {
        color: #fff;
        font-size: 22px;
      }
      .el-pager li {
        background: rgba(255, 255, 255, 0);
        color: #fff;
        font-size: 22px;
      }
      .el-pager li.active {
        color: #409eff;
        cursor: default;
        font-size: 22px;
      }
      .el-input__inner {
        background-color: rgba(20, 212, 250, 0);
        color: #fff;
        border: none;
        border-bottom: 1px solid #fff;
      }
    }
  }
}
</style>