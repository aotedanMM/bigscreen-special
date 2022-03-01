<template>
  <!-- 预警信息报告 -->
  <!-- dialogType === 'statisticalTable' &&  -->
  <el-dialog
    :visible.sync="visible"
    class="statisticalTable warningReport"
    :title="title"
    width="1900px"
    :modal-append-to-body="false"
    top="74px"
    :modal="false"
    :before-close="modalClose"
  >
    <div>
      <div class="tableContent">
        <div class="bg-box" v-if="!loadingState">
          <div class="title">
            <div class="btnBox">
              <span class="" @click="download()"></span>
            </div>
          </div>
          <div class="rainStatistical">
            <div v-for="(item, index) in lineHead" :key="index">
              {{ item.name }}
              <span>{{ item.value || 0 }} {{ item.unit }}</span>
            </div>
          </div>
          <el-scrollbar style="height: 692px">
            <div :class="!propdata.config.length?'flexBox_nodata':''" >
              <div class="nodata" v-if="!propdata.config.length">
              </div>
              <!-- table 表 -->
              <div v-else class="reportDailog">
                <ListTable
                  ref="warningReport"
                  v-if="propdata"
                  :propdata="propdata"
                  unsortable="false"
                  hiddenpag="false"
                  border="true"
                  :strip="false"
                  :showoverflowtooltip="false"
                  @tablecallback="tablecallback"
                  :listHeight="listHeight"
                ></ListTable>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-else class="loading_box">
          <div class="loading"></div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer"></span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import ListTable from './ListTable.vue';
import { rainSituationServer } from '@/api/feature/monitorwarning/installServer';
import { waterSituationServer } from '@/api/feature/monitorwarning/installServer';
/**
 *
 */
@Component({
  name: 'WarningReport',
  components: {
    ListTable,
  },
})
export default class WarningReport extends Vue {
  @Prop() private visible: any;
  @Prop() private title: any;
  @Prop() private propdata: any;
  @Prop() private lineHead: any;
  @Prop() private searchDto: any;
  @Prop() private searchData: any;
  private listHeight: any = '628px';
  private loadingState: boolean = false;
  private pageParams: any = {
    nowPage: 1,
    pageSize: 10,
  };
  private mounted() {
    console.log(this.propdata, 'propdata');
  }
  private tablecallback(data: any) {
    const self: any = this;
    self[data.type](data);
  }
  private modalClose() {
    if (this.title === '雨情监测预警') {
      const params = {
        isShow: true,
        level: this.searchDto.level,
        geometry: this.searchDto.geometry,
        destroy: true,
      };
      this.$store.commit('mapTools/changeShowRainMonitorList', params);
    } else if (this.title === '水库监测预警') {
      const params = {
        isShow: true,
        type: JSON.parse(JSON.stringify(this.searchData.type)),
      };
      this.$store.commit('mapTools/changeShowReservoirList', params);
    }
    this.$emit('update:visible', false); // 直接修改父组件的属性
    this.$emit('changeHight');
  }

  // 河道
  private async getDialogDetail() {
    const obj = {
      nowPage: this.propdata.nowPage,
      pageSize: 10,
    };
    const res: any = await waterSituationServer.getWarningInfo(obj);
    console.log(res.data.list, 'res');
    this.$set(this.propdata, 'data', res.data.list);
    this.$set(this.propdata, 'nowPage', res.data.nowPage);
    this.$set(this.propdata, 'pagesize', res.data.pageSize);
    this.$set(this.propdata, 'total', res.data.total);
    this.propdata.total = res.data.total;
  }

  // 水库
  private async getReservoirDialogDetail() {
    const obj = {
      nowPage: this.propdata.nowPage,
      pageSize: 10,
    };
    const res: any = await waterSituationServer.getReservoirWarningInfo(obj);
    console.log(res.data.list, 'res');
    this.$set(this.propdata, 'data', res.data.list);
    this.$set(this.propdata, 'nowPage', res.data.nowPage);
    this.$set(this.propdata, 'pagesize', res.data.pageSize);
    this.$set(this.propdata, 'total', res.data.total);
    this.propdata.total = res.data.total;
  }

  // 雨情
  private async getRainDialogDetail() {
    const obj = {
      nowPage: this.propdata.nowPage,
      pageSize: 10,
    };
    const res: any = await rainSituationServer.getWarningInfo(obj);
    this.$set(this.propdata, 'data', res.data.list);
    this.$set(this.propdata, 'nowPage', res.data.nowPage);
    this.$set(this.propdata, 'pagesize', res.data.pageSize);
    this.$set(this.propdata, 'total', res.data.total);
    this.propdata.total = res.data.total;
  }

  //  预警报告弹窗 分页
  private handlePageChange(data: any) {
    console.log(data, 'val');
    this.$set(this.pageParams, 'nowPage', data.rowVal);
    this.$set(this.propdata, 'nowPage', data.rowVal);
    if (this.title === '河道监测预警') {
      this.getDialogDetail();
    } else if (this.title === '水库监测预警') {
      this.getReservoirDialogDetail();
    } else if (this.title === '雨情监测预警') {
      this.getRainDialogDetail();
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
.reportContent {
  width: 96%;
}
.flexBox_nodata{
  display: flex;
  align-items: center;
  justify-content: center;
  .nodata {
      width: 165px;
      height: 163px;
  }
}
.warningReport {
  .tableContent .bg-box table th:nth-child(1) {
    width: 100px;
  }
  .tableContent .bg-box {
    height: 730px;
  }
  .lodingTwo {
    height: 277px;
    width: 100%;
    position: absolute;
    background: url('../../../../assets/img/default/panel/half_bg1.png')
      no-repeat;
    background-size: 100% 100%;
    text-align: center;
    z-index: 20;
    margin-top: -30px;
    span {
      display: inline-block;
      width: 300px;
      height: 220px;
      background: url('../../../../assets/img/halfScreen/halflist/loading.gif')
        no-repeat;
      background-size: 100% 100%;
      margin-top: 29px;
    }
  }
}
</style>
<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
@url: '../../../../assets/img/monitorWarning';
.statisticalTable {
  .el-table tbody tr:hover > td {
    background-color: transparent !important;
  }
  .el-dialog__header {
    background: url('@{url}/top-bg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }
  .el-dialog__body {
    background: url('@{url}/center-bg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-dialog__footer {
    background: url('@{url}/bot-bg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 36px;
    box-sizing: content-box;
    padding: 0;
  }
  .tableContent {
    box-sizing: border-box;
    padding: 0 4px;
    .echartIcon {
      float: right;
      width: 32px;
      height: 32px;
      background: url('@{url}/echart.png') no-repeat 0 0;
      background-size: 100% 100%;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        background: url('@{url}/echart_hover.png') no-repeat 0 0;
      }
    }
    .reportIcon {
      float: right;
      width: 32px;
      height: 32px;
      background: url('@{url}/reportIcon.png') no-repeat 0 0;
      background-size: 100% 100%;
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        background: url('@{url}/reportIcon_hover.png') no-repeat 0 0;
      }
    }
    .bg-box {
      position: relative;
      height: 900px;
      padding: 10px 5px 0 0;
      .title {
        position: absolute;
        top: -61px;
        left: 400px;
        padding-top: 11px;
        width: 70%;
        height: 61px;
        font-size: 26px;
        .statisticalTime {
          display: inline-block;
          padding: 0 15px;
          height: 38px;
          color: #ffde00;
          line-height: 38px;
          border: 1px solid #0e89a1;
          border-radius: 5px;
          background: #17546d;
        }
        .unit {
          margin-left: 20px;
          line-height: 43px;
          color: #6fe4fb;
          vertical-align: top;
        }
      }
      .rainStatistical {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 0 20px;
        width: 100%;
        height: 30px;
        div {
          font-size: 24px;
          color: #68a9ca;
          span {
            color: #e6e7ea;
            &.name {
              color: #68a9ca;
              margin-right: 10px;
            }
          }
        }
      }
      .tableBox {
        display: flex;
        justify-content: flex-start;
      }
      table tr th,
      table tr td {
        border-right: 3px solid #0a162a;
        border-bottom: 3px solid #0a162a;
        text-align: center;
      }
      table {
        position: relative;
        color: #fff;
        border-collapse: collapse;
        border-right: 3px solid #26486a;
        &:nth-child(1) {
          margin-right: -2px;
          &::after {
            content: '';
            position: absolute;
            right: -4px;
            bottom: 0px;
            width: 3px;
            height: 100%;
            background: #26486a;
          }
          .distName {
            &::after {
              content: '';
              position: absolute;
              left: 0px;
              bottom: -4px;
              width: 622px;
              height: 3px;
              background: #26486a;
            }
          }
        }
        &:nth-child(2) {
          &::after {
            content: '';
            position: absolute;
            right: -6px;
            bottom: 0px;
            width: 3px;
            height: 100%;
            background: #26486a;
          }
        }
        &:nth-child(2),
        &:nth-child(3) {
          &::before {
            content: '';
            position: absolute;
            left: 0px;
            top: 0px;
            width: 3px;
            height: calc(100% + 2px);
            background: #26486a;
          }
        }
        th {
          font-size: 26px;
          color: #6fe4fb;
          background: rgba(33, 181, 234, 0.1);
          &:nth-child(1) {
            width: 198px;
          }
          &:nth-child(2) {
            width: 228px;
          }
          &:nth-child(3) {
            width: 160px;
          }
        }
        tr {
          height: 55px;
          // border-bottom: 1px solid #fff;
          td {
            text-align: center;
            font-size: 24px;
          }
          .distName {
            position: relative;
            width: 188px;
            font-size: 30px;
            color: #92edf6;
            background: rgba(6, 14, 53, 0.2);
            &::after {
              content: '';
              position: absolute;
              left: 3px;
              bottom: -3px;
              width: 622px;
              height: 3px;
              background: #26486a;
            }
          }
          .townName {
            width: 244px;
            font-size: 26px;
            color: #bbd0dc;
            background: rgba(2, 64, 126, 0.2);
          }
          .rainAvg {
            width: 180px;
            font-size: 26px;
            color: #fffabe;
            background: rgba(2, 64, 126, 0.2);
          }
        }
      }
      .el-scrollbar {
        // margin-top: 10px;
        box-sizing: border-box;
        border: 1px solid #1784c1;
        background-color: rgba(2, 12, 35, 0.2);
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .loading_box {
      height: 900px;
      padding: 10px 5px 0 0;
      .loading {
        background: url(../../../../assets/img/halfScreen/halflist/loading.gif)
          no-repeat 33px 255px;
        color: #d2e1ec;
        background-position: 50% 50%;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.dialogMr {
  .el-dialog {
    margin-right: 30%;
  }
}

.rainCont {
  .el-dialog__wrapper {
    width: 1920px !important;
  }
  .el-dialog {
    background: transparent;
    box-shadow: none;
  }
  .el-dialog__body {
    background: url('@{imgPath}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-dialog__header {
    background: url('@{imgPath}/topbg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }
  .el-dialog__footer {
    background: url('@{imgPath}/botBg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 38px;
    box-sizing: content-box;
  }
  .el-dialog__title {
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.2);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
  }
  .el-dialog__headerbtn {
    background: url('@{imgPath}/closeBtn.png') no-repeat;
    background-size: 100% 100%;
    width: 86px;
    height: 41px;
    background-size: 100% 100%;
    right: -30px;
    top: 3px;
    &:hover {
      background: url('@{imgPath}/closeHover.png') no-repeat;
      background-size: 100% 100%;
      color: transparent;
    }
    .el-dialog__close {
      display: none;
      &:hover {
        color: transparent;
      }
    }
  }
  .statisticalTable {
    * {
      box-sizing: border-box;
    }
    overflow: visible !important;
    width: 1920px !important;
    .el-dialog__wrapper {
      overflow: visible !important;
      width: 1920px !important;
    }
    .el-dialog__header {
      background: url('@{url}/top-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 71px;
      .el-dialog__title {
        line-height: 40px;
      }
    }
    .el-dialog__headerbtn {
      right: -4px;
    }
    .el-dialog__body {
      background: url('@{url}/center-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      padding-bottom: 0px;
      padding-top: 0px;
    }
    .el-dialog__footer {
      background: url('@{url}/bot-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 36px;
      box-sizing: content-box;
      padding: 0;
    }
  }
}

// .rainSearchTable.el-table,
// .rainSearchTable.el-table:before {
//   background: transparent;
// }
// .rainSearchTableBox {
//   .el-table th,
//   .el-table tr {
//     background: transparent;
//   }
//   .el-table .el-table__header {
//     background-color: rgba(3, 48, 95, 0.7);
//   }
//   .el-table thead {
//     color: #04daec;
//   }
//   .el-table__body {
//     color: #fff;
//   }
//   .el-table tbody tr:hover > td {
//     background-color: transparent;
//   }
//   .el-table td,
//   .el-table th.is-leaf,
//   .el-table--group {
//     border-color: rgba(3, 48, 95, 0.7);
//   }
// }

// 预警信息报告
.reportDailog {
   height: 628px;
  .el-table {
    color: #fff;
    margin-top: 10px;
    background: transparent;
    tr,
    th {
      color: #fff;
      background: transparent;
    }
  }
  .el-table .cell {
    line-height: 26px;
  }
}
.warningReport {
  .statisticalTable {
    * {
      box-sizing: border-box;
    }
    overflow: visible !important;
    width: 1920px !important;
    .el-dialog__wrapper {
      overflow: visible !important;
      width: 1920px !important;
    }
    .el-dialog__header {
      background: url('@{url}/top-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 71px;
      .el-dialog__title {
        line-height: 40px;
      }
    }
    .el-dialog__headerbtn {
      right: -4px;
    }
    .el-dialog__body {
      background: url('@{url}/center-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      padding-bottom: 0px;
      padding-top: 0px;
    }
    .el-dialog__footer {
      background: url('@{url}/bot-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 36px;
      box-sizing: content-box;
      padding: 0;
    }
  }
}
.el-table::before {
  height: 0px !important;
}
</style>
