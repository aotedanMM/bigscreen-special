<template>
  <!-- 河流名录 -->
  <div class="RiverListBox listDistrict-specil">
    <div
      class="minimize-position"
      v-show="!isUnfold"
      @click="isUnfold = !isUnfold"
    ></div>
    <div class="RiverListBoxMain">
      <div class="listDistrict_body popupPanelBottom_bg" v-show="isUnfold">
        <div class="header">
          <div class="title">{{ title }}</div>

          <div class="headerRightBox">
            <span class="minimize" @click="isUnfold = !isUnfold"></span>
            <span class="close" @click="handleClosePop"></span>
          </div>
        </div>
        <div class="listDistrict filter" style="height:42px;">
          <el-input
            class="csmMyInput"
            type="text"
            placeholder="名称"
            v-model.trim="filter.keyword"
          >
            <i slot="suffix" class="iconSelf_search"></i>
          </el-input>
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
                <span class="f-txt-com fontHeight">{{
                  scope.row[titem.key] ? scope.row[titem.key] : ''
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="!loading">
          <el-pagination
            class="full-list-page"
            :current-page.sync="filter.nowPage"
            @current-change="handleCurrentChange"
            :page-size="filter.pageSize"
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
import { riverWaterSystemServe } from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
@Component({
  name: 'RiverListBox',
  components: {},
  mixins: [EventConfigRegistry, GisAreaSelectEvent],
})
export default class RiverListBox extends Vue {
  public loading: boolean = true;
  private tableConfig: any = [
    {
      key: 'name',
      title: '河流名称',
      width: 300,
    },
    {
      key: 'countys',
      title: '流经县（市、区）',
    },
  ];
  private filter: any = {
    isImportantRiver: '', // 是否为重要河流
    keyword: '', // 名称
    nowPage: 1, // 当前页
    pageSize: 5, // 每页显示多少条
  };
  private title: string = ''; // 标题
  private total: number = 0; // 列表总条数
  private isUnfold: boolean = true; // 是否最小化
  private tableList = []; // 河流列表数据
  private Mapradius: number = 1; // 河流两岸直径数值初始化默认值
  public indexMethod(index: number) {
    return (this.filter.nowPage - 1) * this.filter.pageSize + (index + 1);
  }
  public created() {
    this.$store.commit('mapTools/changeNearbyQueryVisible', false); // 清周边分析
    this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
    this.messsageBus.emit('closedSearchGeometry'); // 关闭搜索出来的那个缓冲面
    this.updateIsMajorRiver();
  }
  public mounted() {
    // 监听是否触发列表里的方法
    this.messsageBus.on('updateRiverList', (data: any) => {
      if (data) {
        // 由最小化改为最大化
        this.isUnfold = true;
      } else {
        // 关闭列表
        this.handleClosePop();
      }
    });
    this.getImportantRiverComponent()
      .addImportantRiver(true)
      .then((riverId: any) => {
        const opts = {
          rivers: riverId,
        };
        this.getComponent().addResource_River(opts);
      });
  }
  // 获取河流列表
  public async getRiverList() {
    const opts: any = JSON.parse(JSON.stringify(this.filter));
    const resData: any = await riverWaterSystemServe.getRiverList(opts);
    resData.list.map((item: any) => {
      const countys = JSON.parse(item.countys).join('、');
      item.countys = countys;
    });
    this.tableList = resData.list;
    this.total = resData.total;
    this.loading = false;
  }
  // 关闭弹框
  public handleClosePop() {
    this.messsageBus.emit('delriver', false);
    const params = {
      isShow: false,
      isMajorRiver: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowRiverList', params);
    this.getImportantRiverComponent().removeImportantRiver();
    this.getComponent().removeResource('river');
  }
  private headerRowStyleFunc(row: any) {
    return 'headerRowStyle';
  }
  private rowStyleFunc(row: any) {
    // hasgeo  是否有空间数据 0-无 1-有
    if (row.row.hasgeo === '0') {
      return 'gray';
    }
    const rowIndex = row.rowIndex;
    if (rowIndex % 2 === 0) {
      return 'dbRow';
    } else {
      return 'defaultRow';
    }
  }
  @Watch('$store.state.mapTools.showRiverList.isMajorRiver')
  private updateIsMajorRiver() {
    this.title = this.$store.state.mapTools.showRiverList.name || '全部河流';
    this.filter.isImportantRiver = this.$store.state.mapTools.showRiverList.isMajorRiver;
    this.filter.nowPage = 1;
  }
  @Watch('filter', { deep: true })
  private updateTableList() {
    this.getRiverList();
  }

  // 点击列表不展示详情弹框，但在详情弹框触发事件
  private handleShowDetail(item: any) {
    this.isUnfold = !this.isUnfold;
    // 记录河流初始化状态值
    this.$store.commit('mapModule/MapSetRiveRadius', this.Mapradius);
    this.getComponent_AreaSelectJudgement().unload();
    const params = {
      isShow: false,
      isEntranceList: true,
      params: item,
    };
    this.messsageBus.emit('updateRiverDetail', params);
    const opts = {
      rivers: item.id,
    };
    // this.getComponent().addResource_River(opts);
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.filter.nowPage = val;
  }
  // 销毁
  private beforeDestroy() {
    this.messsageBus.emit('closeRiverPanel');
    this.getImportantRiverComponent().removeImportantRiver();
    this.getComponent().removeResource('river');
  }
  // 获取河流监测站点组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  // 获取重点河流和站点组件
  private getImportantRiverComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent(
      'importantRiverAndStations',
    );
    return component;
  }
}
</script>

<style lang="less">
.fontHeight {
  line-height: 1;
}
.el-tooltip__popper {
  font-size: 24px !important;
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
@import url('../../../../../assets/css/variable.less');
@commonPath: '../../../../../assets/img/gisModule/common'; // 定义路径
@path: '../../../../../assets/img/gisModule/districtDialog/'; // 定义路径
@tableTdHover: '../../../../../assets/img/default/table/tableTdHover_bg.png';
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
.RiverListBox {
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
    background: url('../../../../../assets/img/default/panel/half_bg1.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    z-index: 20;
    margin-top: -30px;
    span {
      display: inline-block;
      width: 300px;
      height: 220px;
      background: url('../../../../../assets/img/halfScreen/halflist/loading.gif')
        no-repeat;
      background-size: 100% 100%;
      margin-top: 29px;
    }
  }
  .tableContainerTwo {
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
      background: rgba(1, 35, 62, 0.6);
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
        background: transparent;
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
@import url('../../../../../assets/css/variable.less');
@imgPath: '../../../../../assets/img/halfScreen/halflist';
@popPath: '../../../../../assets/img/gisModule/gisLayerPanel/layerPopup';
@tableTdHover: '../../../../../assets/img/default/table/tableTdHover_bg.png';
@commonPath: '../../../../../assets/img/gisModule/common'; // 定义路径
@path: '../../../../../assets/img/gisModule/districtDialog/'; // 定义路径
@url: '../../../../../assets/img/darkgreen';
.RiverListBox {
  .minimize-position {
    bottom: 0;
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
  z-index: 9;
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
      margin-left: 50px;
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
    width: 250px;
    .csmMyInput {
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
    // .filter {
    //   height: auto;
    //   .listDistrict-flex-box {
    //     display: flex;
    //     width: 100%;
    //     .listDistrict-input {
    //       margin-right: 20px;
    //     }
    //     .listDistrict-select {
    //       display: flex;
    //       position: relative;
    //     }
    //     .selectList {
    //       position: absolute;
    //       top: 55px;
    //       z-index: 20;
    //       width: 60%;
    //       height: 400px;
    //       box-shadow: 4px 6px 16px 0px #001931;
    //       background: #071022 url('@{popPath}/select_bg.png') no-repeat;
    //       background-size: 100% 100%;
    //       padding: 15px 0 15px 20px;
    //       box-sizing: border-box;
    //       &.city {
    //         left: -30px;
    //       }
    //       &.town {
    //         left: 225px;
    //       }
    //     }
    //     .listDistrict-input-content {
    //       clear: both;
    //       margin-bottom: 15px;
    //       margin-right: 20px;
    //       width: 100%;
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       cursor: pointer;
    //       &:nth-child(2) {
    //         margin-right: 0;
    //       }
    //     }

    //     .selcetIconTop {
    //       display: inline-block;
    //       width: 35px;
    //       height: 30px;
    //       background: url('@{imgPath}/select2bg.png') no-repeat;
    //       background-size: 100% 100%;
    //       margin: 5px 5px 0 0;
    //       cursor: pointer;
    //     }
    //     .selcetIconBot {
    //       display: inline-block;
    //       width: 35px;
    //       height: 30px;
    //       background: url('@{imgPath}/selcet1bg.png') no-repeat;
    //       background-size: 100% 100%;
    //       margin: 5px 5px 0 0;
    //       cursor: pointer;
    //       transform: rotate(180deg);
    //     }
    //     input::-webkit-input-placeholder {
    //       color: #c4d7da;
    //     }
    //     input:-moz-placeholder {
    //       color: #c4d7da;
    //     }
    //     input:-ms-input-placeholder {
    //       color: #c4d7da;
    //     }
    //   }
    // }
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
