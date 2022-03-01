<template>
  <!-- 企业监测 -->
  <div class="FirePointMonitorBox">
    <div class="enterContainer" v-show="enterTotal > 0">
      今日报警企业
      <span class="ytZoomInOn" @click="showEnterList">{{ enterTotal }}</span> 起
    </div>
    <div class="RiverListBoxMain" v-show="enterListVisible">
      <div class="listDistrict_body popupPanelBottom_bg">
        <div class="header">
          <div class="title">今日报警企业</div>
          <div class="headerRightBox">
            <span
              class="minimize"
              @click="enterListVisible = !enterListVisible"
            ></span>
            <span class="close" @click="handleClosePop"></span>
          </div>
        </div>
        <el-scrollbar class="enter_scrollbar">
          <div class="tableContainerTwo">
            <el-table
              :data="enterListData"
              stripe
              size="small"
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
                label="序号"
              ></el-table-column>

              <el-table-column align="center" width="450" label="名称">
                <template slot-scope="scope">
                  <span class="f-txt-com fontHeight">
                    {{ scope.row.name }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column align="center" width="450" label="时间">
                <template slot-scope="scope">
                  <span class="f-txt-com fontHeight">
                    {{ scope.row.time }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
/**
 * 火点监测
 */
@Component({
  name: 'EnterpriseAlert',
  components: {},
  mixins: [MapCommon],
})
export default class EnterpriseAlert extends Vue {
  @Prop() private enterTotal: any;
  @Prop() private enterListData: any; // 企业监测弹窗列表
  private enterListVisible: boolean = false;
  private showEnterList() {
    this.enterListVisible = true;
  }
  private handleClosePop() {
    this.enterListVisible = false;
  }
}
</script>


<style lang="less" scoped>
@import url("../../../../assets/css/variable.less");
@imgPath: "../../../../assets/img/halfScreen/halflist";
@popPath: "../../../../assets/img/gisModule/gisLayerPanel/layerPopup";
@tableTdHover: "../../../../assets/img/default/table/tableTdHover_bg.png";
@commonPath: "../../../../assets/img/gisModule/common"; // 定义路径
@path: "../../../../assets/img/gisModule/districtDialog/"; // 定义路径
@url: "../../../../assets/img/darkgreen";
.FirePointMonitorBox {
  .enterContainer {
    font-size: 26px;
    width: 300px;
    height: 50px;
    line-height: 50px;
    position: absolute;
    top: 90px;
    left: 600px;
    z-index: 999;
    padding: 0 20px;
    background: url(/img/searchIcons.95fe9b08.png) left center no-repeat;
    background-size: 100% 114%;
    box-sizing: border-box;
    color: #fff;
    span {
      font-weight: normal;
      font-style: italic;
      color: #fff000;
      cursor: pointer;
      font-family: "Impact" !important;
      padding: 0 5px;
    }
    .ytZoomInOn {
      display: inline-block;
      animation: zoom 2s infinite;

      @keyframes zoom {
        0% {
          transform: scale(1);
        }

        50% {
          transform: scale(1.4);
        }

        100% {
          transform: scale(1);
        }
      }
    }
  }
  .RiverListBoxMain {
    position: absolute;
    left: 15%;
    bottom: 36px;
    width: 1000px;
    height: 380px;
    z-index: 999;
    box-sizing: border-box;
    .header {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 50px;
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
        background: url("@{popPath}/listCloseBtn.png") no-repeat 0 0;
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
            content: "\2014";
            width: 100%;
          }
        }
        .close::after {
          content: "\2716";
          width: 100%;
        }
      }
    }
    .enter_scrollbar {
      height: 300px;
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
}
</style>
