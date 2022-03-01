<!--力量调度的出动队伍的列表-->
<template>
  <div class="listDistrict">
    <div class="listDistrict-flex-box">
      <div class="listDistrict-input">
        <div class="listDistrict-input-content">
          <el-input class="csmMyInput" type="text" placeholder="队伍名称、装备名称" v-model.trim="inputWord">
            <i slot="suffix" class="iconSelf_search"></i>
          </el-input>
        </div>
      </div>
      <div class="listDistrict-select">
        <div>
          <div class="listDistrict-input-content" @click="isSelectBolFn2">
            <el-input
              class="csmMyInput"
              type="text"
              :class="{' csmMyInput-cur': isSelectBol2 }"
              readonly
              placeholder="队伍类型"
              v-model.trim="selectWordType"
            >
              <i slot="suffix" :class="isSelectBol2? 'selcetIconBot':  'selcetIconTop'"></i>
            </el-input>
          </div>
        </div>
        <el-scrollbar class="cmp-scrollbar-y selectList selectListType" v-show="isShowSelect2">
          <DropDownBox
            :selectData="selectDataType"
            @canclehandlebox="canclehandle"
            @data="getWordType"
          ></DropDownBox>
        </el-scrollbar>
      </div>
    </div>
    <!-- 列表每一行-->

    <div class="tempRight-title f-tit-h2">
      <!--只有当前选中且数据大于0的时候才会高亮-->
      <span class="itemName-active">队伍合计</span>
      <span class="tempRight-total">
        <span class="f-number">{{listDataAll.length}}</span>
      </span>
      <span class="tempRight-unit">支</span>
      <i
        :class="showSub? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
        @click.stop="expandSublist()"
      ></i>
    </div>
    <div v-show="showSub" class='listDataAll-outbox'>
      <div class="nodata" v-if="!listDataAll.length">
        <img src="../../../assets/img/default/panel/noData.png" alt srcset />
      </div>
      <div class="listBoxScrollbar" v-else>
        <ul class="listBoxSingle">
          <li
            class="f-txt-com listBoxSingle_li"
            v-for="(item, index) in listDataAll"
            :key="index"
            @click="clickHandler(item,index)"
            :class="[listBgClick === index ? 'classList' : '']"
          >
            <p class="teamName"> <span>{{index + 1 }}</span><span>{{item.teamName}}</span></p>
            <p class="teamDistance">
              <span>
                <span>
                  <span style="color:#80adcf">类型：</span>
                  <span
                    style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                    :title="item.teamtypename"
                  >{{item.teamtypename?item.teamtypename:'- -'}}</span>
                </span>
              </span>
            </p>
            <!-- <p class="teamDistance">
              <span>
                <span style="color:#80adcf">距离目的地</span>
                <span
                  style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                  :title="item.address"
                >{{item.address?item.address:'- -'}}</span>
              </span>
            </p>-->

            <p class="teamDistance">
              <span>
                <span style="color:#80adcf">负责人：</span>
                <span
                  style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                  :title="item.leaderName"
                >{{item.leaderName?item.leaderName:'- -'}}</span>
              </span>
            </p>
            <p class="teamDistance">
              <span>
                <span style="color:#80adcf">电话：</span>
                <span
                  style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                  :title="item.conactTel"
                >{{item.conactTel?item.conactTel:'- -'}}</span>
              </span>
                  <b
                  v-if="item.conactTel"
                  class="callphonebgimg"
                  :title="item.conactTel? item.conactTel : ''"
                  @click.stop="handleClickCallup(item.conactTel,item.conactTel,$event)"
                ></b>
            </p>
          </li>
        </ul>
      </div>
      <!-- 分页-->
      <!-- @size-change="handleSizeChange" -->
      <!-- <el-pagination
        v-if="listDataAll.length"
        class="constomMyElPage"
        small
        :pager-count="5"
        :current-page.sync="paginationObj.currentPage"
        @current-change="handleCurrentChange"
        :page-size="paginationObj.pageSize"
        layout="prev, pager, next"
        :total="paginationObj.total"
      ></el-pagination>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer, rescueTeamServer } from '@/api/installServer';
import DropDownBox from '@/components/feature/rescueTeamModule/DropDownBox.vue';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
@Component({
  name: 'DispatchTeam',
  components: {
    DropDownBox,
  },
})
export default class DispatchTeam extends Vue {
  @Prop() public rescueTeamHomeData: any;
  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法

  private loading: boolean = true;
  // 定义 input关键字
  private inputWord: string = '';
  private listDataAll: any = [

  ]; // 列表数据

  private factoryKey = '';
  private isSelectBol2: boolean = false;
  private showSub = true; // 列表得展开收起
  private listData = [
    {
      num: '- -',
      name: '- -',
      typecode: '- -',
      level: '- -',
      _distance: '- -',
    },
  ];
  private listBgClick: any = -1;
  private isShowSelect: boolean = false;
  private isShowSelect2: boolean = false; // 队伍类型

  private selectWord = ''; // 选中得行政区划
  private selectWordType = ''; // 选中得队伍类型
  private selectData: any = []; // 全部行政区划数据
  private selectDataType: any = []; // 全部得队伍类型得数据

  private opts: any = {
    teamType: '', // 队伍类型
    keyword: '',
  };
  // 分页
  private paginationObj: any = {
    currentPage: this.opts.pageIndex,
    pageSize: this.opts.pageSize,
    total: 0,
  };
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    const self: any = this;
    self.messsageBus.emit('showCallup', true, listObj, val, event);
  }
  private getWordType(data: any) {
    this.selectWordType = data.selectWord;
    this.opts.teamType = data.selectId.length > 0 ? data.selectId.toString() : ''; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
  }

  // gis方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('teamDispatch');
    return component;
  }
  private expandSublist() {
    this.showSub = !this.showSub;
  }
  // 列表点击
  private clickHandler(data: any) {
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(JSON.parse(JSON.stringify(data)), 'DispatchTeamDetail');
    }
  }
  // 取消下拉弹窗
  private canclehandle() {
    this.isShowSelect2 = false;
    this.isSelectBol2 = false;
    // this.isSelectBol = !this.isSelectBol;
  }

  /*---------------列表相关------------*/
  // 队伍类型
  private getRescueteamTypeList() {
    installDisasterJudgeServer.rescueTeamServer
      .getDispatchTeamType()
      .then((data: any) => {
        this.selectDataType = data.data;
        if (this.selectDataType.length > 0) {
          this.selectDataType.forEach((element: any, i: any) => {
            for (const j of Object.keys(this.selectDataType[i])) {
              if (j === 'resourceTypeName') {
                this.selectDataType[i].name = this.selectDataType[i][j];
              }
              if (j === 'resourceTypeCode') {
                this.selectDataType[i].id = this.selectDataType[i][j];
              }
            }
          });
        }
      });
  }
  // 搜索框
  @Watch('inputWord')
  private getInputWordListData() {
    this.opts.keyword = this.inputWord;
   // this.opts.pageIndex = 1;
  }

  // 分页点击
  private handleCurrentChange(val: number) {
    this.opts.pageIndex = val;
  }

  // 列表数据变化时更新状态
  @Watch('opts', { deep: true })
  private updateList(): void {
    this.FnListData(JSON.parse(JSON.stringify(this.opts)));
  }
  // 获取列表数据
  private FnListData(opts: any) {
    // this.getComponent().clear();
    // for (let i = 0; i < opts.levelArr.length; i++) {
    //   opts.levelArr[i] = opts.levelArr[i] + "";
    // }
    this.getComponent().status = 'goTeam';
    this.getComponent()
      .getDispatchTeamList({opts})
      .then((res: any) => {
        this.listDataAll = res.data;
        this.paginationObj.total = res.data.length;
      });
  }

  // 下拉框展开/收起
  private isSelectBolFn2() {
    this.isShowSelect2 = !this.isShowSelect2;
    this.isSelectBol2 = !this.isSelectBol2;
  }

  //   private mounted() {}
  private mounted() {
    // 调用队伍类型
    this.getRescueteamTypeList();
    // this.opts.pageIndex = 1;
    this.FnListData(JSON.parse(JSON.stringify(this.opts)));
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../assets/css/decisionSupport/Statistic.half.less";
@import "../../../assets/css/decisionSupport/DiscussTab.less";
.tempRight-cont {
  padding-right: 6px;
}

.DisasterPowerDispatch {
  width: 365px;
  height: 855px;
  padding: 5px 15px;
  border-radius: 5px;
  position: relative;
  * {
    margin: 0;
    padding: 0;
  }
  .loading {
    color: #fff;
    background: url(../../../assets/img/halfScreen/halflist/loading.gif)
      no-repeat 33px 255px;
    color: #d2e1ec;
    height: 100%;
    p {
      padding-left: 5px;
      margin: 0;
      transform: translateY(-8px);
    }
    center {
      margin-top: 120%;
    }
  }
  /* 统计列表样式  start*/
  .statisticList {
    padding-top: 5px;
    &_li {
      display: flex;
      justify-content: space-between;
      color: #ffffff;
      background: url("../../../assets/img/halfScreen/halflist/listbg.png")
        no-repeat -5px 50%;
      background-size: 100% 100%;
      padding: 10px;
      box-sizing: border-box;
      margin: 5px 0;
      cursor: pointer;
      &.checkSty,
      &:hover {
        background-image: url("../../../assets/img/halfScreen/halflist/listbghover.png");
      }
      & + & {
        margin-top: 5px;
      }
      &_textWarning {
        color: yellow;
        padding-right: 5px;
      }
    }
  }
  /* 统计列表样式  end*/

  .halflist-back {
    width: 61px;
    height: 25px;
    position: absolute;
    top: 10px;
    right: 6px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url("../../../assets/img/default/panel/toBack.png") no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url("../../../assets/img/default/panel/toBack_h.png");
    }
  }
}
// 统计面板
#MapDialog {
  height: auto;
  .half-title {
    height: 37px;
    font-style: italic;
    margin-top: -10px;
  }
}
// 列表
.listDistrict {
  .callphonebgimg {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: url("../../../assets/img/realtimeTeam/phone.png") no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-left: 10px;
    cursor: pointer;
  }
  .listDistrict-flex-box {
    display: block;
    width: 100%;
    .selcetIconTop {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/select2bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
    }
    .selcetIconBot {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/selcet1bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
      transform: rotate(180deg);
    }
    input::-webkit-input-placeholder {
      color: #c4d7da;
    }
    input:-moz-placeholder {
      color: #c4d7da;
    }
    input:-ms-input-placeholder {
      color: #c4d7da;
    }
    .listDistrict-input-content {
      clear: both;
      margin-bottom: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .listDistrict-icon {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      cursor: pointer;
    }
  }
  .listDistrict-input {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    background-size: 100% 100%;
    color: #3cc0ec;
    margin: 10px 0;
  }
  .listDistrict-input-choose {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    background: url(../../../assets/img/halfScreen/halflist/selcetHoverbg.png)
      no-repeat;
    background-size: 100% 100%;
    color: #3cc0ec;
    margin: 10px 0;
    .selcetIconTop {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/select2bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
    }
    .selcetIconBot {
      display: inline-block;
      width: 35px;
      height: 30px;
      background: url("../../../assets/img/halfScreen/halflist/selcet1bg.png")
        no-repeat;
      background-size: 100% 100%;
      margin: 5px 5px 0 0;
      cursor: pointer;
      transform: rotate(180deg);
    }
    input::-webkit-input-placeholder {
      color: #c4d7da;
    }
    input:-moz-placeholder {
      color: #c4d7da;
    }
    input:-ms-input-placeholder {
      color: #c4d7da;
    }
    .listDistrict-input-content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .listDistrict-icon {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .selectListDis {
    height: 319px !important;
    position: absolute;
    top: 105px;
    z-index: 20;
    background-color: #071022 !important;
    box-shadow: 4px 6px 16px 0px #001931;
    background: url("../../../assets/img/halfScreen/eventAndTopics/select_bg.png")
      no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .selectListType {
    height: 319px !important;
    position: absolute;
    top: 155px;
    z-index: 20;
    background-color: #071022 !important;
    box-shadow: 4px 6px 16px 0px #001931;
    background: url("../../../assets/img/halfScreen/eventAndTopics/select_bg.png")
      no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .listDistrict-option {
    padding: 5px 0 0 10px;
    line-height: 30px;
    .selectBtn {
      display: flex;
      justify-content: space-around;
      li {
        width: 104px;
        height: 38px;
        font-family: MicrosoftYaHei;
        text-align: center;
        line-height: 38px;
        cursor: pointer;
      }
      li:nth-of-type(1) {
        background-image: linear-gradient(
            180deg,
            rgba(249, 216, 72, 0.54) 0%,
            rgba(243, 177, 61, 0.54) 100%
          ),
          linear-gradient(#061418, #061418);
        background-blend-mode: normal, normal;
        box-shadow: 0px 2px 4px 0px rgba(95, 59, 16, 0.45);
        border-radius: 3px;
        border: solid 1px #fbe663;
        opacity: 0.8;
        color: #fefefe;
      }
      li:nth-of-type(2) {
        background-image: linear-gradient(
            -3deg,
            #357ac1 0%,
            rgba(72, 161, 204, 0.29) 53%,
            rgba(91, 199, 214, 0.55) 100%
          ),
          linear-gradient(#061418, #061418);
        background-blend-mode: normal, normal;
        box-shadow: 1px 2px 4px 0px rgba(91, 199, 214, 0.82);
        border-radius: 3px;
        border: solid 1px #5bc7d6;
        color: #a0f4fd;
      }
    }
  }
}
.el-tree-node__content {
  padding-left: 0 !important;
}
.listDistrict_title {
  color: #67e1fb;
  letter-spacing: 1px;
  font-weight: normal;
  line-height: 60px;
  display: flex;
  &:after {
    content: "";
    background: url(../../../assets/img/halfScreen/halflist/titlexian.png) 50% 0
      no-repeat;
    // background: url(../../../assets/img/halfScreen/halflist/titlebg.png) 50% 0 no-repeat;
    position: absolute;
    width: 100%;
    height: 23px;
    top: 54px;
    left: 0;
  }
  .panel_switch {
    width: 34px;
    height: 29px;
    background-size: 100% 100%;
    position: absolute;
    right: 0px;
    top: 15px;
    cursor: pointer;
    background: url("../../../assets/img/halfScreen/halflist/open.png") 50% 50%
      no-repeat;
    transition: transform 0.3s;
  }
  .panel_switch.panel-switch-reverse {
    transform: scale(1, -1);
  }
}
.classList {
  color: yellow;
}
.nodata {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 210px;
}
.felx_box_statistics {
  width: 100%;
  display: block;
  color: #8cafd0;
  font-weight: 500;
  bottom: 40px;
  top: unset;
  position: unset;
}
.listDataAll-outbox{
  height:calc(100% - 170px);
}
.listBoxScrollbar {
  height: calc(100% - 180px);
  overflow: hidden;
  overflow-y: scroll;
}

.listBoxSingle {
  &_li {
    cursor: pointer;
    color: #ffffff;
    padding: 10px 0px;
    margin: 10px 0 0 0;
    background: url("../../../assets/img/halfScreen/halflist/boxListBgIcon.png")
      no-repeat 0 0;
    background-size: 100% 100%;

    .teamName {
      font-family: MicrosoftYaHei;
      font-weight: normal;
      font-stretch: normal;
      color: #e8f4fe;
      padding-bottom: 10px;
      font-size:26px;
        span:first-child{
          background: rgba(71,215,162,.2);
          border: 1px solid #47d7a2;
          border-radius: 5px;
          color: #fff;
          font-size: 24px;
          padding: 0 5px;
          display: inline-block;
          font-style: normal;
          margin-right: 10px;
      }
    }

    .teamDistance {
      font-weight: normal;
      color: #e8f4fe;
      font-size:26px;
      font {
        font-family: Impact;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1;
        color: #27e8ff;
        padding-right: 10px;
      }
    }
    .teamType {
      font-weight: normal;
      color: #f7fdff;
      font {
        height: 23px;
        font-family: MicrosoftYaHei;
        font-weight: normal;
        font-stretch: normal;
        color: #8cafd0;
      }
    }
  }
  .checkSty {
    background: url(../../../assets/img/halfScreen/halflist/listbghover.png)
      no-repeat;
  }
}
</style>
<style lang="less">
