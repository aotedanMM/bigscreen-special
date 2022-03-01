<!--队伍详情-->
<template>
  <div class="rescueTeamsHome">
    <!-- <span class="halflist-back" @click="backParent"></span> -->
    <div class="rescueTeamsHome_hd title-panel">
      <!-- <div class="loading" v-if="loading"> -->
      <p>小分队详情</p>
      <i @click="backParent()"></i>
    </div>
    <el-scrollbar>
      <div class="detachment_name">{{detailsData.orgName}}</div>
      <div class="teamConfiguration">
        <div><span>出动人数:</span><span>{{detailsData.dispatchNum ? detailsData.dispatchNum + ' 人' : '- -'}}</span></div>
        <div><span>带队领导:</span><span>{{detailsData.leaderName ? detailsData.leaderName : '- -'}}</span></div>
        <div><span>联系电话:</span><span>{{detailsData.conactTel ? detailsData.conactTel : '- -'}}</span></div>
        <div><span>出动车辆:</span><span>{{detailsData.carNum ? detailsData.carNum : '- -'}}</span></div>
        <div>
          <span>携带装备:</span>
          <span v-if="!detailsData.equipliststr.length">- -</span>
          <span v-else v-for="(k, v) in detailsData.equipliststr" :key="v">{{k.equipName ? k.equipName : '- -'}}</span>
        </div>
        <div><span>当前位置:</span><span>{{detailsData.address ? detailsData.address : '- -'}}</span></div>
        <div class="journey">
          <div>距离目的地<span class="distance">{{detailsData.distance}}</span>KM</div>
          <div>预计<span>{{detailsData.estimated}}</span>到达</div>
          <div v-if="detailsData.duration < 60">所需时间<span>{{detailsData.duration}}</span>分钟</div>
          <div v-else>所需时间<span>{{Math.floor(detailsData.duration / 60) ? Math.floor(detailsData.duration / 60) : 0}}</span>小时<span v-if="detailsData.duration % 60">{{detailsData.duration % 60 ? detailsData.duration % 60 : 0}}<span>分钟</span></span></div>
        </div>
        <div class="communication">
          <div class="voice" @click="callPhone(detailsData)"></div>
          <div class="video"></div>
          <div class="feedback" @click="openFeedback(detailsData)">
            <i v-if="detailsData.backState"></i>
          </div>
        </div>
      </div>
      <!-- <template v-else>
            <div class="loading"></div>
        </template> -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'TeamDetailsPopup',
  components: {},
})
export default class SiteFeedback extends Vue {
  @Prop() private parentHandleClickNumFn?: any; // 父组件传递的方法
  @Prop() private rescueTeamHomeData?: any; // 父组件传的数据
  private detailsData: any = {};

  private created() {
    this.detailsData = this.rescueTeamHomeData.parameter;
    if (!this.detailsData.estimated) {
      this.detailsData.distance = (
        this.detailsData.route.distance / 1000
      ).toFixed(1);
      const currentTime = new Date(
        new Date().getTime() + this.detailsData.route.duration * 1000,
      );
      this.detailsData.estimated =
        currentTime
          .getHours()
          .toString()
          .padStart(2, '0') +
        ':' +
        currentTime
          .getMinutes()
          .toString()
          .padStart(2, '0');
      this.detailsData.duration = Math.round(
        this.detailsData.route.duration / 60,
      );
    }
  }
  // 返回首页
  private backParent() {
    // const paramObj = {};
    // if (this.parentHandleClickNumFn) {
    //     this.parentHandleClickNumFn(JSON.parse(JSON.stringify(paramObj)), 'RescueTeamsHome');
    // }
    this.$emit('backParent');
  }
  // 拨打电话面板
  private callPhone(item: any) {
    this.messsageBus.emit(
      'showCallup',
      true,
      item,
      item.conactTel,
      {},
      item.leaderName,
    );
  }
  // 打开现场回传页面
  private openFeedback(detailsData: any) {
    const paramObj: any = {
      parameter: detailsData,
    };
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(
        JSON.parse(JSON.stringify(paramObj)),
        'SiteFeedback',
      );
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../assets/css/decisionSupport/Statistic.half.less";
@import "../../../assets/css/decisionSupport/DiscussTab.less";
@import "../../../assets/css/decisionSupport/halfScreen.statistic.less";
@url: "../../../assets/img/RescueTeams";
@closeUrl: "../../../assets/img/gisModule/PopulationFeverBox";
.halflist {
  padding: 0;
}
.rescueTeamsHome {
  .rescueTeamsHome_hd {
    position: relative;
    i {
      position: absolute;
      top: -3px;
      right: -15px;
      width: 90px;
      height: 48px;
      background: url("@{closeUrl}/closeBtn.png") no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url("@{closeUrl}/closeHover.png") no-repeat;
      }
    }
  }
  .el-scrollbar {
    height: 800px;
    color: #e8f4fe;
    .detachment_name {
      font-size: 28px;
      line-height: 36px;
      padding: 20px 15px 20px;
      text-align: center;
      background: url("@{url}/siteFeedback/detachment_name_bg.png") no-repeat
        100% bottom;
    }
    .teamConfiguration {
      padding: 0 10px 0 20px;
      div {
        span {
          // display: inline-block;
          margin-left: 10px;
          height: 45px;
          line-height: 45px;
          font-size: 26px;
          color: #e8f4fe;
          &:nth-child(1) {
            margin-left: 0;
            color: #92edf6;
          }
          &:nth-child(3) {
            margin-left: 10px;
          }
        }
        .callphonebgimg {
          display: inline-block;
          width: 22px;
          height: 22px;
          background: url("../../../assets/img/realtimeTeam/phone.png")
            no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
          margin-left: 10px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
      .journey {
        padding: 20px;
        font-size: 22px;
        background: url("@{url}/journey-bg.png") no-repeat;
        background-size: 100% 100%;
        div {
          color: #e8f4fe;
          height: 45px;
          line-height: 45px;
          span {
            display: inline-block;
            margin: 0 5px;
            height: 45px;
            line-height: 45px;
            font-size: 26px;
            font-weight: Bold;
            color: #00fffc;
            vertical-align: top;
            span {
              font-size: 22px;
              font-weight: normal;
              color: #e8f4fe;
            }
          }
          .distance {
            color: #fbee50;
          }
        }
      }
      .communication {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        div {
          width: 120px;
          height: 145px;
          padding-top: 100px;
          box-sizing: border-box;
          cursor: pointer;
        }
        .voice {
          background: url("@{url}/voice.png") no-repeat;
          background-size: 100% 100%;
        }
        .video {
          background: url("@{url}/video.png") no-repeat;
          background-size: 100% 100%;
        }
        .feedback {
          position: relative;
          background: url("@{url}/feedback.png") no-repeat;
          background-size: 100% 100%;
          i {
            position: absolute;
            right: 32px;
            top: 25px;
            width: 16px;
            height: 16px;
            border-radius: 14px;
            background-color: #dd2e2e;
          }
        }
      }
    }
  }
}
// serialNumber-bg
.loading {
  color: #fff;
  background: url(../../../assets/img/halfScreen/halflist/loading.gif) no-repeat
    33px 255px;
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
</style>
