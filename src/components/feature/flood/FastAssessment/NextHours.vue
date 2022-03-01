<!--未来1小时的列表-->
<template>
  <div class="listDistrict">
    <div class="listDistrict-title">
      共有
      <span class="tempRight-prepare">{{ num }}</span
      >个村庄预警
    </div>
    <div class="listDistrict-flex-box">
      <div class="transfer" @click="changeSate('0')">
        <p class="transfer-immediately"><span></span>立即转移</p>
        <div
          :class="[
            flagIm === true
              ? 'transfer_innr_beforeDown'
              : 'transfer_innr_before',
          ]"
        >
          <div>
            <p>
              <span class="tempRight-number">
                {{ statistics[1] ? statistics[1].cun : 0 }} </span
              >个
            </p>
            <p class="desc">村庄</p>
          </div>
          <div>
            <p>
              <span class="tempRight-number">
                {{ statistics[1] ? statistics[1].people : 0 }} </span
              >人
            </p>
            <p class="desc">影响人数</p>
          </div>
          <div>
            <p>
              <span class="tempRight-number">
                {{ statistics[1] ? statistics[1].house : 0 }}
              </span>
            </p>
            <p class="desc">影响房屋数</p>
          </div>
        </div>
      </div>
      <div class="transfer" @click="changeSate('1')">
        <p class="transfer-ma"><span></span>准备转移</p>
        <div
          :class="[
            flagTh === true
              ? 'transfer_innr_beforeDown'
              : 'transfer_innr_before',
          ]"
        >
          <div>
            <p>
              <span class="tempRight-number">
                {{ statistics[0] ? statistics[0].cun : 0 }} </span
              >个
            </p>
            <p class="desc">村庄</p>
          </div>
          <div>
            <p>
              <span class="tempRight-number">
                {{ statistics[0] ? statistics[0].people : 0 }} </span
              >人
            </p>
            <p class="desc">影响人数</p>
          </div>
          <div>
            <p>
              <span class="tempRight-number">
                {{ statistics[0] ? statistics[0].house : 0 }}
              </span>
            </p>
            <p class="desc">影响房屋数</p>
          </div>
        </div>
      </div>
    </div>

    <div class="tempRight-title f-tit-h2">
      <!--只有当前选中且数据大于0的时候才会高亮-->
      <span>山洪风险区列表</span>
      <span class="tempRight-total">
        <span class="f-number">{{ paginationObj.total }}</span>
      </span>
      <span class="tempRight-unit">个</span>
      <i
        :class="
          showSub
            ? 'tempRight-switch'
            : 'tempRight-switch tempRight-switch-reverse'
        "
        @click.stop="expandSublist()"
      ></i>
    </div>
    <div v-show="showSub" class="listDataAll-box">
      <div class="listDistrict-select">
        <div class="inputStyle">
          <div class="listDistrict-input-content" @click="isSelectBolFn">
            <el-input
              class="csmMyInput"
              type="text"
              :class="{ 'csmMyInput-cur': isSelectBol }"
              readonly
              placeholder="区县选择"
              v-model.trim="selectWord"
            >
              <i
                slot="suffix"
                :class="isSelectBol ? 'selcetIconBot' : 'selcetIconTop'"
              ></i>
            </el-input>
          </div>
        </div>
        <div class="selectBox">
          <el-scrollbar
            class="cmp-scrollbar-y selectList selectListType"
            v-show="isShowSelect"
          >
            <DropDownBox
              :resetSelect="resetSelect"
              :selectData="selectData"
              @canclehandlebox="canclehandle"
              @data="getWord"
            ></DropDownBox>
          </el-scrollbar>
        </div>
      </div>
      <div class="nodata" v-if="!listDataAll.length">
        <img src="../../../../assets/img/default/panel/noData.png" alt srcset />
      </div>
      <div class="listBoxScrollbar" v-else>
        <ul class="listBoxSingle">
          <li
            class="f-txt-com listBoxSingle_li"
            v-for="(item, index) in listDataAll"
            :key="index"
            @click="clickHandler(item, index)"
            :class="[listBgClick === index ? 'classList' : '']"
          >
            <p class="teamName">
              {{ item.name }}
              <span :class="[item.state === '0' ? 'prepare' : 'immediately']">
                {{ item.state === '0' ? '准备转移' : '立即转移' }}
              </span>
            </p>
            <p class="teamDistance">
              <span>
                <span>
                  <span style="color:#80adcf">影响人数：</span>
                  <span
                    style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                    :title="item.people"
                    >{{ item.people ? item.people : '暂无数据' }}人</span
                  >
                </span>
              </span>
            </p>
            <p class="teamDistance">
              <span>
                <span style="color:#80adcf">影响房屋数:</span>
                <span
                  style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block;vertical-align: bottom;"
                  :title="item.house"
                  >{{ item.house ? item.house : '暂无数据' }}</span
                >
              </span>
            </p>
            <p class="teamDistance">
              <span>
                <span style="color:#80adcf">责任人：</span>
                <span>
                  {{ item.personAndTel ? item.personAndTel : '暂无数据' }}
                </span>
                <!-- <span
                  style="max-width: 240px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;display: inline-block"
                  :title="item.telephone"
                >{{item.telephone?item.telephone:'暂无数据'}}</span>-->
                <b
                  v-if="item.personAndTel && item.personAndTel !== '--'"
                  class="callphonebgimg"
                  :title="item.personAndTel ? item.personAndTel : ''"
                  @click.stop="
                    handleClickCallup(
                      item.personAndTel,
                      item.personAndTel,
                      $event
                    )
                  "
                ></b>
              </span>
            </p>
          </li>
        </ul>
      </div>
      <!-- 分页-->
      <!-- @size-change="handleSizeChange" -->
      <el-pagination
        v-if="listDataAll.length"
        class="constomMyElPage"
        small
        :pager-count="5"
        :current-page.sync="paginationObj.currentPage"
        @current-change="handleCurrentChange"
        :page-size="paginationObj.pageSize"
        layout="prev, pager, next"
        :total="paginationObj.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { districtServer } from '@/api/installServer';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer, rescueTeamServer } from '@/api/installServer';
import DropDownBox from '@/components/feature/rescueTeamModule/DropDownBox.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import VillageDetails from '@/components/feature/flood/FastAssessment/VillageDetails.vue'; // 村庄详情页
// import Select from '@/components/feature/flood/MonitorWarning/Select.vue'  //使用监测预警那块封装得下拉组件
import { gsemergencyServer } from '@/api/feature/model/installServer';
import { nomalLeftServer } from '@/api/installServer';

@Component({
  name: 'NextHours',
  components: {
    DropDownBox,
    // Select
  },
})
export default class NextHours extends Vue {
  @Prop() public rescueTeamHomeData: any;
  @Prop() public currentState: any;

  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击切换的方法
  private flagIm: boolean = true; // 立即转移
  private flagTh: boolean = true; // 准备转移
  private num: number = 0;

  private viewResData: any = {
    total: '0',
  };

  private listDataAll: any = []; // 列表数据

  private isSelectBol: boolean = false;
  private showSub = true; // 列表得展开收起
  private listData = [
    {
      num: '暂无数据',
      name: '暂无数据',
      typecode: '暂无数据',
      level: '暂无数据',
      _distance: '暂无数据',
    },
  ];
  private statistics: any = [];
  private listBgClick: any = -1;
  private isShowSelect: boolean = false;

  private selectWord = ''; // 选中得行政区划
  private selectData: any = []; // 全部行政区划数据

  private opts: any = {
    districtCode: '', // 行政区划
    time: '',
    state: '',
    mark: '',
  };
  // 分页
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 5,
    total: 0,
  };
  private resetSelect = '';
  // 获取列表数据(实时)
  private allLists: any = [];
  @Watch('currentState')
  public changeTime(val: any) {
    this.opts.time = val.id;
    this.opts.mark = val.state;
    this.opts.state = '';
    this.flagIm = true;
    this.flagTh = true;
    this.selectWord = '';
    this.opts.districtCode = '';
    this.isShowSelect = false;
    this.resetSelect = val.id;
  }
  @Watch('resetSelect')
  public Selected(val: any) {
    this.canclehandle();
  }

  private changeSate(val: any) {
    this.$emit('backParent');
    if (val === '0') {
      // 立即
      this.flagIm = !this.flagIm;
    }
    if (val === '1') {
      this.flagTh = !this.flagTh;
    }
    if ((this.flagIm && this.flagTh) || (!this.flagIm && !this.flagTh)) {
      this.opts.state = '';
      this.flagIm = true;
      this.flagTh = true;
    } else {
      this.opts.state = val;
    }
  }

  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    const self: any = this;
    self.messsageBus.emit('showCallup', true, listObj, val, event);
  }
  private getWord(data: any) {
    if (data) {
      this.selectWord = data.selectWord;
      const num = data.selectId.length;
      this.opts.districtCode =
        data.selectId.length > 0 ? data.selectId.toString() : ''; // 如果下拉框为全部未选 => 传 ['-']  所有的列表数据为0
    }
  }

  /*------公共------*/

  private expandSublist() {
    this.showSub = !this.showSub;
  }

  private clickHandler(data: any) {
    // if (this.parentHandleClickNumFn) {
    //   this.parentHandleClickNumFn(
    //     JSON.parse(JSON.stringify(data)),
    //     'VillageDetails',
    //   )
    // }
    this.getComponent().locate('id', data.id);
  }
  // 取消下拉弹窗
  private canclehandle() {
    this.isShowSelect = false;
    this.isSelectBol = false;
    // this.isSelectBol = !this.isSelectBol;
  }

  /*---------------列表相关------------*/
  // 行政区划
  private city() {
    nomalLeftServer.getCitySelected().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      this.selectData = res.data;
      this.selectData.forEach((element: any, i: any) => {
        for (const j of Object.keys(this.selectData[i])) {
          if (j === 'gbCode') {
            this.selectData[i].id = this.selectData[i][j];
          }
          if (j === 'name') {
            this.selectData[i].name = this.selectData[i][j]; // 修改属性名为“name”
            // delete this.selectData[i]["districtname"]; //删除“name”
          }
        }
      });
    });
  }

  // 分页点击
  private handleCurrentChange(val: number) {
    this.paginationObj.pageIndex = val;
    const start = (Number(val) - 1) * this.paginationObj.pageSize;
    const end = Number(val) * this.paginationObj.pageSize;
    this.$set(this, 'listDataAll', this.allLists.slice(start, end));
  }

  // 列表数据变化时更新状态
  @Watch('opts', { deep: true })
  private updateList(): void {
    this.paginationObj.pageIndex = 1;
    this.listDataAll = [];
    this.dataList(JSON.parse(JSON.stringify(this.opts)));
    this.FnListData(JSON.parse(JSON.stringify(this.opts)));
  }
  private FnListData(prams: any) {
    this.listDataAll = [];
    const obj = {
      mark: prams.mark,
      time: prams.time, // 必填，时段  ，60 1小时， 120   2小时
      state: prams.state, // 非必填   0准备转移，1立即转移
      districtCode: prams.districtCode ? prams.districtCode : '', // 非必填   行政区划编码
    };
    gsemergencyServer.getModelData(obj).then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      this.allLists = res.data;
      this.paginationObj.total = res.data.length;
      this.listDataAll = res.data.slice((this.paginationObj.pageIndex - 1) * this.paginationObj.pageSize, this.paginationObj.pageSize);
    });
    // 添加点位
    this.getComponent().addResource(prams);
  }
  // 获取村庄个数
  private dataList(prams: any) {
    const opt = {
      time: prams.time,
      mark: prams.mark,
    };
    gsemergencyServer.getRiskCount(opt).then((res: any) => {
      console.log(res, 'res');
      if (!res) {
        return;
      }
      this.statistics = res;
      this.num =
        Number(this.statistics[0].cun) + Number(this.statistics[1].cun);
    });
  }
  private onShowPopup(event: any) {
    // this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
    //   largeLeftPanel: { showFlag: true },
    // })
    const eventParams = {
      id: event.data.id,
      state: event.data.state,
      time: this.currentState.id,
      mark: this.currentState.state,
      show: true,
    };
    this.messsageBus.emit('updateVillageDetails', eventParams);
    // if (this.parentHandleClickNumFn) {
    //   this.parentHandleClickNumFn(
    //     JSON.parse(JSON.stringify(event.data)),
    //     'VillageDetails',
    //   )
    // }
    // 公用弹框
    // const eventInfo = this.eventInfo
    // const self = this
    // this.eventInfoPop = new VillageDetails({
    //   el: '#' + event.containerId,
    //   data() {
    //     return {
    //       data: eventInfo,
    //       config: {
    //         title: 'title',
    //         content: 'eventType',
    //         time: 'reportTime',
    //       },
    //     }
    //   },
    //   methods: {
    //     close() {
    //       self.getComponent().clearAll()
    //     },
    //   },
    // })
  }
  // 下拉框展开/收起
  private isSelectBolFn() {
    this.isShowSelect = !this.isShowSelect;
    this.isSelectBol = !this.isSelectBol;
  }
  private mounted() {
    // 调用行政区划接口
    this.city();
    this.opts.time = this.currentState.id;
    this.opts.mark = this.currentState.state;
    this.getComponent().on('mountainFlood_popup', this.onShowPopup, this);
  }
  // 清除
  private beforeDestroy() {
    this.getComponent().off('mountainFlood_popup', this.onShowPopup, this);
    this.getComponent().removeResource();
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.ModelDisplayFactory.getComponent('mountainFlood');
    return component;
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../assets/img/fastAssessment';
.nodata {
  text-align: center;
  margin-top: 30px;
  position: absolute;
  width: 100%;
  top: 65%;
}
.callphonebgimg {
  display: inline-block;
  width: 22px;
  height: 22px;
  background: url('../../../../assets/img/realtimeTeam/phone.png') no-repeat;
  background-size: 100% 100%;
  vertical-align: middle;
  margin-left: 10px;
  cursor: pointer;
}
.tempRight-cont {
  padding-right: 6px;
}
.prepare {
  float: right;
  color: #fdef4f;
}
.tempRight-prepare {
  font-size: calc(20px * 1.6) !important;
  font-family: 'Impact' !important;
  color: #ec5b39;
  margin: 0 5px;
}
.immediately {
  float: right;
  color: #ec5b39;
}
.listDistrict {
  height: 100%;
}
.listDistrict-title {
  //   color: #00e3ff;
  text-align: center;
  line-height: 52px;
  height: 52px;
  position: relative;
  cursor: pointer;
  font-size: calc(20px * 1.2) !important;
  color: #fff;
  background: url('../../../../assets/img/halfScreen/halflist/boxListBgIcon.png')
    no-repeat 0 0;
  background-size: 100% 100%;
  margin-bottom: 4px;
}
.tempRight-number {
  //   height: 45px;
  //   line-height: 45px;
  //   margin-left: 20px;
  //   font-weight: normal;
  //   font-style: italic;
  //   position: absolute;
  //   right: 70px;
  color: #fff000;
  font-size: calc(20px * 1.6) !important;
  font-family: 'Impact' !important;
}
.tempRight-title {
  color: rgb(0, 227, 255);
  display: flex;
  text-align: center;
  line-height: 40px;
  height: 40px;
  // font-family: 黑体;
  // padding-left:25px;
  position: relative;
  cursor: pointer;
  padding-top: 7px;
  // margin-top: -15px;
  &:after {
    content: '';
    display: inline-block;
    background: url('../../../../assets/img/halfScreen/halflist/titleline.png');
    position: absolute;
    bottom: -26px;
    left: 0px;
    width: 100%;
    height: 26px;
  }
  .itemName-active {
    color: yellow;
  }
  .tempRight-switch {
    width: 34px;
    height: 29px;
    background-size: 100% 100%;
    position: absolute;
    right: 0px;
    top: 8px;
    cursor: pointer;
    background: url('../../../../assets/img/halfScreen/halflist/open.png') 50%
      50% no-repeat;
    transition: transform 0.3s;
  }
  .tempRight-switch-reverse {
    transform: scale(1, -1);
  }
  .tempRight-total {
    margin-left: 20px;
    font-weight: normal;
    font-style: italic;
    position: absolute;
    right: 70px;
    color: #fff000;
  }
  .tempRight-unit {
    position: absolute;
    right: 30px;
    color: #daf2ff;
  }
}
.tempRight-title span {
  line-height: 1;
}
// .tempRight-title {
//   color: #00e3ff;
//   display: flex;
//   text-align: center;
//   line-height: 34px;
//   height: 34px;
//   position: relative;
//   cursor: pointer;

// }
.listDistrict-flex-box {
  .transfer {
    font-size: calc(20px * 1.3) !important;
    margin-bottom: 8px;
    .transfer-immediately {
      line-height: 1;
      span {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url('@{imgPath}/level1Event.png') no-repeat;
        background-size: 100% 100%;
        vertical-align: bottom;
        margin: 0 10px 0 0;
      }
      font-size: calc(20px * 1.3) !important;
      color: #67e1fb;
      margin-bottom: 8px;
    }
    .transfer-ma {
      // margin-top: -15px;
      font-size: calc(20px * 1.3) !important;
      color: #67e1fb;
      margin-bottom: 8px;
      span {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url('@{imgPath}/level3Event.png') no-repeat;
        background-size: 100% 100%;
        vertical-align: bottom;
        margin: 0 10px 0 0;
      }
    }
    &_innr {
      &_before {
        background: url('../../../../assets/img/discuss/bg.png') no-repeat 50%
          0px;
        padding: 10px 16px;
        height: 90px;
        box-sizing: border-box;
        background-size: 100% 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        cursor: pointer;
        // &:hover {
        //   background-image: url("../../../../assets/img/discuss/bg.png");
        //   background-size: 100% 100%;
        // }
      }
      &_beforeDown {
        background: url('../../../../assets/img/discuss/bg_h.png') no-repeat 50%
          0px;
        padding: 10px 16px;
        height: 90px;
        box-sizing: border-box;
        background-size: 100% 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        cursor: pointer;
        // &:hover {
        //   background-image: url("../../../../assets/img/discuss/bg.png");
        //   background-size: 100% 100%;
        // }
      }
    }
  }
}
.transfer div p {
  line-height: 1;
}
.transfer .desc {
  font-size: calc(20px * 1.1) !important;
  margin-top: 12px;
}
.listDataAll-box {
  height: calc(100% - 400px);
  .listDistrict-select {
    height: 100%;
    .inputStyle {
      height: 17%;
    }
    .selectBox {
      height: 82%;
    }
    /deep/.constomMyElPage {
      .el-pagination {
        position: absolute;
        top: 94%;
      }
    }
  }
}
.listBoxScrollbar {
  //height: calc(100% - 230px);
  height: 205px;
  overflow: hidden;
  overflow-y: scroll;
  position: absolute;
  top: 64%;
  width: 100%;
  .listBoxSingle {
    &_li {
      cursor: pointer;
      color: #ffffff;
      padding: 10px 0px;
      margin: 10px 0 0 0;
      background: url('../../../../assets/img/halfScreen/halflist/boxListBgIcon.png')
        no-repeat 0 0;
      background-size: 100% 100%;

      .teamName {
        font-family: MicrosoftYaHei;
        font-weight: normal;
        font-stretch: normal;
        color: #e8f4fe;
        padding-bottom: 10px;
        font-size: calc(20px * 1.2) !important;
      }

      .teamDistance {
        font-weight: normal;
        color: #e8f4fe;
        font-size: calc(20px * 1.1) !important;
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
      background: url(../../../../assets/img/halfScreen/halflist/listbghover.png)
        no-repeat;
    }
  }
}

.selcetIconTop {
  display: inline-block;
  width: 35px;
  height: 30px;
  background: url('../../../../assets/img/halfScreen/halflist/select2bg.png')
    no-repeat;
  background-size: 100% 100%;
  margin: 5px 5px 0 0;
  cursor: pointer;
}
.selcetIconBot {
  display: inline-block;
  width: 35px;
  height: 30px;
  background: url('../../../../assets/img/halfScreen/halflist/selcet1bg.png')
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
  margin: 15px 0 5px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selectListType {
  height: 87%;
  margin-top: 2%;
  z-index: 20;
  background-color: #071022 !important;
  box-shadow: 4px 6px 16px 0px #001931;
  background: url('../../../../assets/img/halfScreen/eventAndTopics/select_bg.png')
    no-repeat;
  background-size: 100% 100%;
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
}
</style>
