<!--队伍出动情况-->
<template>
  <div class="rescueTeamsHome halflist ">
    <span class="halflist-back" @click="backParent"></span>
    <div class="rescueTeamsHome_hd title-panel">
      <!-- <div class="loading" v-if="loading"> -->
      <p>队伍出动情况</p>
    </div>
    <!-- <div class="videoBox" v-if="showVideoBox">
        <div class="close" @click="showVideoBox = false"></div>
        <iframe :src="path" frameborder="0" id="iframeId" style="width: 100%; height: 100%"></iframe>
    </div> -->
    <!-- <VideoCallPop v-if="showVideoBox" :path="path" :clickClose="clickClose"></VideoCallPop> -->

    <el-scrollbar>
      <div class="rescueTeamsHome_cnt" v-if="!loading">
        <div class="rescueTeamItem" v-for="(item, index) of data" :key="index">
          <div class="tempRight-title  f-tit-h2">
            <!--只有当前选中且数据大于0的时候才会高亮-->
            <span :title="item.orgName ? item.orgName : '- -'">
              {{item.orgName ? item.orgName : '- -'}}
            </span>
            <i :class="item.showSub? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'" @click.stop="expandSublist(item, index)"></i>
          </div>
          <template v-if="item.showSub">
            <div class="tempRight-cont">
              <div class="teamConfiguration">
                <div><span>出动人数:</span><span>{{item.dispatchNum ? item.dispatchNum + ' 人' : '- -'}}</span></div>
                <div><span>带队领导:</span><span>{{item.leaderName ? item.leaderName : '- -'}}</span></div>
                <div><span>联系电话:</span><span>{{item.conactTel ? item.conactTel : '- -'}}</span></div>
                <div><span>出动车辆:</span><span>{{item.carNum ? item.carNum : '- -'}}</span></div>
                <div>
                  <span>携带装备:</span>
                  <span v-if="!item.equipliststr || !item.equipliststr.length">- -</span>
                  <span v-else v-for="(k, v) in item.equipliststr" :key="v">{{k.equipName ? k.equipName : '- -'}}</span>
                </div>
                <div><span>当前位置：</span><span>{{item.address ? item.address : '- -'}}</span></div>
              </div>
              <div class="journey">
                <div>距离目的地<span class="distance">{{item.distance}}</span>KM</div>
                <div>预计<span>{{item.estimated}}</span>到达</div>
                <div v-if="item.duration < 60">所需时间<span>{{item.duration}}</span>分钟</div>
                <div v-else>所需时间<span>{{Math.floor(item.duration / 60) ? Math.floor(item.duration / 60) : 0}}</span>小时<span v-if="item.duration % 60">{{item.duration % 60 ? item.duration % 60 : 0}}<span>分钟</span></span></div>
              </div>
            </div>
          </template>
          <div class="communication">
            <div class="voice" @click="callPhone(item)"></div>
            <div class="video" @click="videoCall(item)"></div>
            <div class="feedback" @click="openFeedback(item)">
              <i v-if="item.backState"></i>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <div class="loading"></div>
      </template>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import publishObjectPath from '@/util/configRegistry';
// import VideoCallPop from '@/components/feature/RescueTeams/VideoCallPop.vue';
@Component({
  name: 'DispatchTeamDetail',
  components: {
    // VideoCallPop,
  },
})
export default class DispatchTeamDetail extends Vue {
  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
  @Prop() private rescueTeamHomeData?: any; // 父组件处理点击数字的方法
  private loading: boolean = false;
  private data: any = [];
  private journeyList: any = [];
  private showVideoBox: boolean = false;
  private path: any = '';
  private dispatchServer: any = installDisasterJudgeServer.rescueTeamServer;
  private created() {
    if (publishObjectPath.value.practice === true) {
        this.dispatchServer = installDisasterJudgeServer.rescueTeamFakeServer;
    }
  }
  private mounted() {
    this.dispatchTeamList();
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('teamDispatch');
    return component;
  }
  @Watch('journeyList', { deep: true })
  private journeyData() {
    this.data.forEach((item: any, index: any) => {
      // item.showSub = true;
      this.journeyList.forEach((v: any) => {
        if (v.dispatchcaseId === item.dispatchcaseId) {
          item.distance = (v.route.distance / 1000).toFixed(1);
          const currentTime = new Date(
            new Date().getTime() + v.route.duration * 1000,
          );
          item.estimated =
            currentTime
              .getHours()
              .toString()
              .padStart(2, '0') +
            ':' +
            currentTime
              .getMinutes()
              .toString()
              .padStart(2, '0');
          item.duration = Math.round(v.route.duration / 60);
        }
      });
    });
    this.$forceUpdate(); // 强制刷新页面效果
  }
  private dispatchTeamList() {
    if (!!this.rescueTeamHomeData.TeamsDispatchedData) {
      this.data = this.rescueTeamHomeData.TeamsDispatchedData;
    } else {
      this.loading = true;
      const obj = {
        teamId: this.rescueTeamHomeData.teamId,
      };
      const promise1 = this.getComponent().getDispatchTeamListByteamId(
        obj,
      );
      promise1.then((res1: any) => {
        this.data = res1.data.list;
        console.log( this.data);
        this.data.teamId = this.rescueTeamHomeData.teamId;
        this.loading = false;
        this.data.forEach((item: any, index: any) => {
          item.showSub = true;
        });
        this.journeyList = res1.data.list;
      });
    }
  }
  private expandSublist(item: any, index: any) {
    this.data[index].showSub = !item.showSub;
    this.$forceUpdate(); // 强制刷新页面效果
  }
  // 视频通话
  private videoCall(item: any) {
      this.showVideoBox = true;
      this.path = 'anyChat/index.html?id=' + item.userId;
      this.messsageBus.emit('showVideoCallBox', this.path);
  }
  private clickClose() {
    this.showVideoBox = false;
  }
  // 打开现场回传页面
  private openFeedback(item: any) {
    if (!item.backState) {
      return;
    }
    this.rescueTeamHomeData.parameter = item;
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(
        JSON.parse(JSON.stringify(this.rescueTeamHomeData)),
        'SiteFeedback',
      );
    }
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
  // 返回一级页面
  private backParent() {
    this.getComponent().unload();
    this.$emit('backParent', 'second');
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../assets/css/decisionSupport/Statistic.half.less";
@import "../../../assets/css/decisionSupport/DiscussTab.less";
@import "../../../assets/css/decisionSupport/halfScreen.statistic.less";
@url: "../../../assets/img/RescueTeams";
@imgPath: '../../../assets/img/gisModule/PopulationFeverBox';
.halflist {
  padding: 0;
  height: 100%;
  padding: 0;
  background: none;
}
.rescueTeamsHome {
    // position: relative;
    overflow: visible;
    // .videoBox {
    //     position: absolute;
    //     width: 800px;
    //     height: 700px;
    //     left: 630px;
    //     background-image: url("@{imgPath}/topbg.png"),
    //                 url("@{imgPath}/centerBg.png"),
    //                 url("@{imgPath}/botBg.png");
    //     background-repeat: no-repeat;
    //     background-position: 0 0, 0 60px, 0 100%;
    //     background-size: 100% 60px, 100% calc(100% - 109px), 100% 49px;
    //     padding: 80px 40px 40px 40px;
    //     .close {
    //         position: absolute;
    //         top: 4px;
    //         right: 10px;
    //         background: url("@{imgPath}/closeBtn.png") no-repeat 0 -3px;
    //         background-size: 100% 100%;
    //         width: 90px;
    //         height: 48px;
    //         // margin-top:-5px;
    //         &:hover {
    //         cursor: pointer;
    //         background-image: url("@{imgPath}/closeHover.png");
    //         }
    //     }
    // }
    .el-scrollbar {
        height: 800px;
        .tempRight-title {
            padding-right: 30px;
            height: auto;
            min-height: 45px;
        }
    }
  }
  .tempRight-cont {
    .teamConfiguration {
      padding-top: 20px;
      padding-left: 5px;
      div {
        span {
          // display: inline-block;
          height: 45px;
          line-height: 45px;
          font-size: 26px;
          color: #e8f4fe;
          margin-left: 10px;
          &:nth-child(1) {
            color: #92edf6;
            margin: 0;
          }
        }
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
.loading {
  color: #fff;
  background: url(../../../assets/img/halfScreen/halflist/loading.gif) no-repeat
    33px 255px;
  color: #d2e1ec;
  height: 800px !important;
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
