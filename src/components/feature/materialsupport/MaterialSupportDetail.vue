<template>
  <div class="rescueTeamsHome MaterialSupport">
    <div class="rescueTeamsHome_hd title-panel">
      <p>物资库详情</p>
      <!-- <span class="closeDetail"
      @click="closeAndbackFn"></span>-->
      <span class="halflist-back"
            @click="closeAndbackFn"></span>
    </div>
    <div class="detail_container"
         v-if="!loadingState">
      <div class="rescueTeamsHome_title">
        <span>{{defaultData.name}}</span>
      </div>
      <div class="rescueTeamsHome_content">
        <el-scrollbar class="scrollbar">
          <div class="content_box">
            <p class="content_title">
              <span>储备物资类型：</span>
              <span>{{defaultData.repertorytypename || '- -'}}</span>
            </p>
            <p class="content_title">
              <span>管理机构：</span>
              <span>{{defaultData.chargedept || '- -'}}</span>
            </p>
            <p class="content_title">
              <span>级别：</span>
              <span>{{defaultData.levelname || '- -'}}</span>
            </p>
            <p class="content_title address_box">
              <span>地址：</span>
              <span class="address">{{defaultData.address || '- -'}}</span>
            </p>
            <p class="content_title">
              <span>负责人：</span>
              <span>{{defaultData.concateper || '- -'}}</span>
              <span class="call">
                <!-- <span class="callNumber">{{defaultData.CONCATEMOBTEL || '- -'}}</span>
                <i class="phone_icon"
                   v-if="defaultData.CONCATEMOBTEL"></i> -->
                <span v-if="defaultData.concatemobtel"
                      @click.stop="makingACall(defaultData)">
                  <span class="callNumber">{{defaultData.concatemobtel}}</span>
                  <i class="phone_icon"></i>
                </span>
                <span v-else>{{defaultData.concateper ? '- -' : ''}}</span>
              </span>
            </p>
          </div>
        </el-scrollbar>
      </div>
      <div class="rescueTeamsHome_chart">
        <div class="listDistrict_title">
          <span class="f-tit-h2">物资类型</span>
          <i @click="FnMinimize"
             :class="minimize? 'panel_switch': 'panel_switch panel-switch-reverse'"></i>
        </div>
        <!--  -->
        <div class="tableList"
             v-show="minimize&&tableData.length>0">
          <el-scrollbar class="scrollbar">
            <div class="goodsDetails"
                 v-for="(item,index) in tableData"
                 :key="index">
              <p>
                <span class="title">物资名称：</span>
                <span class="content">{{item.name}}</span>
              </p>
              <p>
                <span class="title">物资类型：</span>
                <span class="content">{{defaultData.repertorytypename}}</span>
              </p>
              <p>
                <span class="title">数量：</span>
                <span class="num">{{item.materialnum}}</span>
                <span class="content">{{item.measureunit}}</span>
              </p>
            </div>
          </el-scrollbar>
          <div class="page">
            <el-pagination class="constomMyElPage"
                           small
                           :pager-count="5"
                           :current-page.sync="paginationObj.currentPage"
                           @current-change="handleCurrentChange"
                           :page-size="paginationObj.pageSize"
                           layout="prev, pager, next,total"
                           :total="paginationObj.total"></el-pagination>
          </div>
        </div>
        <div v-show="minimize&&tableData.length<=0"
             class="nodata"></div>
      </div>
    </div>
    <div v-else>
      <div class="loading"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import { nomalLeftServer, multiuleInterfaceServer } from '@/api/installServer';

@Component({
  name: 'MaterialSupportDetail',
  components: {},
})
export default class MaterialSupportDetail extends Vue {
  @Prop() public rescueTeamHomeData?: any;
  private defaultData: any = {};
  private minimize: any = true;
  private tableData: any = [];
  private totalData: any = [];
  private opts = {
    id: '',
    pageSize: 3,
    pageIndex: 1,
    select: '',
  };
  private loadingState: boolean = true;
  // 分页
  private paginationObj: any = {
    currentPage: this.opts.pageIndex,
    pageSize: 3,
    total: 0,
    roundfirm: [],
  };
  public mounted() {
    this.messsageBus.on('tableData', (item: any) => {
        this.tableData = item;
    });
  }
  private getData() {
    this.tableData = [];
    const data: any = {
      id: this.defaultData.id ? this.defaultData.id : this.defaultData._id,
      pageSize: 3,
      pageIndex: this.opts.pageIndex,
      // districtCode: this.$store.state.dataFilterControl.filter.districtCode,
      resourceKey: 'meterialinfo',
    };
    // multiuleInterfaceServer
    multiuleInterfaceServer.getDataList(data).then((result: any) => {
      this.paginationObj.total = result.total;
      this.paginationObj.pageSize = this.opts.pageSize;
      this.loadingState = false;
      this.totalData = JSON.parse(JSON.stringify(result.list));
      if (this.totalData.length > 0) {
          this.tableData = this.getDetailContent(1, 3, this.totalData);
        }
    });
    // installDisasterJudgeServer.repositoryServer
    //   .getMaterialByReposityId({
    //     id: this.defaultData.id,
    //     pageSize: 3,
    //     pageNo: 1,
    //   })
    //   .then((result: any) => {
    //     // console.log(5555, result)
    //     // this.tableData = JSON.parse(JSON.stringify(result))
    //     this.paginationObj.total = result.length;
    //     this.paginationObj.pageSize = this.opts.pageSize;
    //     this.loadingState = false;
    //     this.totalData = JSON.parse(JSON.stringify(result));
    //     debugger
    //     if (this.totalData.length > 0) {
    //       this.tableData = this.getDetailContent(1, 3, this.totalData);
    //     }
    //   });

  }
  // 拨打电话
  private makingACall(data: any) {
    // console.log(99999, data)
    const items = {
      conactTel: data.CONCATEMOBTEL,
      leaderName: data.CONCATEPER || '- -',
    };
    this.messsageBus.emit(
      'showCallup',
      true,
      items,
      items.conactTel,
      {},
      items.leaderName,
    );
  }
  private created() {
    this.defaultData = JSON.parse(JSON.stringify(this.rescueTeamHomeData));
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.opts.pageIndex = val;
    this.getData();
    // this.tableData = this.getDetailContent(val, 3, this.totalData);
  }
  // 分页数据
  private getDetailContent(num: any, pageSize: any, data: any) {
    const pagedata = [];
    // pageSize 每页条数
    // 设置开始
    const start = pageSize * num - pageSize;
    // 设置结束长度
    let end = pageSize * num;
    end = end > data.length ? data.length : end;
    for (let i = start; i < end; i++) {
      // 所有分页数据 data
      pagedata.push(data[i]);
    }
    // console.log(4444, pagedata)
    return pagedata;
  }
  // 返回上一级
  private closeAndbackFn() {
    this.$emit('backParents');
  }
  // 列表展开收起
  private FnMinimize() {
    this.minimize = !this.minimize;
  }
  @Watch('rescueTeamHomeData', { deep: true })
  private getDetails(val: any): void {
    this.defaultData = JSON.parse(JSON.stringify(this.rescueTeamHomeData));
    // this.opts.id = this.defaultData._id;
    this.getData();
  }
}
</script>
<style lang="less" scoped>
@import '../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../assets/css/decisionSupport/Statistic.half.less';
@realtimeTeam: '../../../assets/img/realtimeTeam';
.scrollbar{ // develop上的样式问题
  height: 276px;
}
.closeDetail {
  position: absolute;
  right: 0;
  top: 4px;
  cursor: pointer;
  width: 75px;
  height: 30px;
  background: url('@{realtimeTeam}/close_team1.png') no-repeat;
  background-size: 100% 100%;
}
.halflist-back {
  width: 60px;
  height: 24px;
  position: absolute;
  top: 10px;
  right: 0px;
  color: #338af8;
  cursor: pointer;
  z-index: 1;
  background: url('../../../assets/img/default/panel/toBack.png') no-repeat 0px
    70%;
  background-size: 100% 100%;
  &:hover {
    background-image: url('../../../assets/img/default/panel/toBack_h.png');
  }
}
span {
  cursor: default;
}
.detail_container {
  height: 100%;
  width: 100%;
  //   padding: 10px;
  .rescueTeamsHome_title {
    justify-content: center;
    width: 100%;
    height: 100px;
    background: url('@{realtimeTeam}/title_bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    > span {
      display: block;
      font-size: 24px;
      padding: 0 15px;
      color: #e8f4fe;
    }
  }
  .rescueTeamsHome_content {
    width: 94%;
    height: 200px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .content_box {
      //   padding-top: 10px;
      box-sizing: border-box;
      width: 100%;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .content_title {
      font-size: 21px;
      line-height: 28px;
      color: #f7fdff;
      > span:nth-of-type(1) {
        color: #92edf6;
      }
      > span:nth-of-type(2) {
        // color: #cfd5d8;
        // margin-left: 10px;
        &.address {
          line-height: 25px;
        }
      }
      &.address_box {
        padding-right: 7px;
        display: flex;
        > span:nth-of-type(1) {
          flex: none;
        }
      }
    }

    .call {
      margin-left: 20px;
      color: #f7fdff;
      .callNumber {
        cursor: pointer !important;
        color: #f7fdff;
      }
      i {
        display: inline-block;
        cursor: pointer !important;
        width: 16px;
        height: 18px;
        background: url(../../../assets/img/CommandDispatch/phone.png) 55% 50%
          no-repeat;
        background-size: contain;
        margin-left: 10px;
      }
    }
  }
  .rescueTeamsHome_chart {
    margin-top: -12px;
    height:calc(100% - 340px);
    width: 100%;
    .listDistrict_title {
      position: relative;
      color: #67e1fb;
      letter-spacing: 1px;
      font-weight: normal;
      line-height: 60px;
      display: flex;
      padding: 0 10px;
      &:after {
        content: '';
        background: url(../../../assets/img/halfScreen/halflist/titlexian.png)
          50% 0 no-repeat;
        position: absolute;
        width: 100%;
        height: 23px;
        top: 50px;
        left: 0;
      }
      .panel_switch {
        width: 34px;
        height: 29px;
        background-size: 100% 100%;
        position: absolute;
        right: 5px;
        top: 15px;
        cursor: pointer;
        background: url('../../../assets/img/halfScreen/halflist/open.png') 50%
          50% no-repeat;
        transition: transform 0.3s;
      }
      .panel_switch.panel-switch-reverse {
        transform: scale(1, -1);
      }
    }
    .tableList {
      width: 100%;
      height: calc(100% - 65px);
      position: relative;
      margin-top: 10px;
      .thead {
        display: flex;
        justify-content: space-between;
        width: 97%;
        color: #67e1fb;
        font-size: 20px;
        font-weight: normal;
      }
      table {
        width: 98%;
        height: 100%;
        text-align: center;
        tr {
          height: 28px;
          line-height: 28px;
          th {
            color: #67e1fb;
            font-size: 20px;
            font-weight: normal;
            text-align: left;
          }
          td {
            text-align: right;
            color: #fff;
            font-size: 17px;
            cursor: default;
            &.tablename {
              text-align: left;
            }
          }
        }
      }
      .goodsDetails {
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 10px;
        height: 135px;
        color: #fffcfc;
        background: url(../../../assets/img/halfScreen/halflist/boxListBgIcon.png)
          50% 0 no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .title {
          color: #82a3c2;
          font-size: 22px;
        }
        .content {
          font-size: 22px;
          color: #cfd6d9;
          //   vertical-align: text-bottom;
        }
        .num {
          font-size: 22px;
          font-weight: 600;
          color: #27e8ff;
          margin-right: 5px;
        }
      }
      .page {
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-47%);
      }
    }
    .nodata {
      width: 100%;
      height: 200px;
      margin-top: 60px;
      background: url(../../../assets/img/default/panel/noData.png) 55% 50%
        no-repeat;
    }
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
}
</style>
<style lang="less">
.scrollbar .el-scrollbar__bar.is-vertical > div {
  background-image: linear-gradient(
    0deg,
    #0a7ccc 0%,
    #06b4d1 52%,
    #02ebd5 100%
  );
}
.tableList .el-scrollbar__view {
  height: 375px;
}
</style>
