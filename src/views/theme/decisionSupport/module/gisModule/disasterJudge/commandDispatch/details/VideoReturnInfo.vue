
<!--视频回传 详情页-->
<template>
  <div class="dispatchInfoDefault">
    <div class="dispatchInfoDefault_hd">
      <h3 class="dispatchInfoDefault_hd_tit">视频回传</h3>
      <div class="dispatchInfoDefault_hd_opt">
        <span class="dispatchInfoDefault_hd_back" @click="returnBack"></span>
      </div>
    </div>
    <div class="dispatchInfoDefault_bd">
      <div class="nothingData--bg" v-if="false"></div>
      <div class="dispatchInfoDefault_bd_nav">
        <span
          :class="[(index === infoTabsCur) ? 'cur': '' ,' dispatchInfoDefault_bd_btn']"
          v-for="(item,index) of infoTabs"
          :key="index"
          @click="infoTab(index)"
        >{{item.title}}</span>
        <!-- <span class="dispatchInfoDefault_bd_btn">
          基本信息
        </span>-->
        <span class="dispatchInfoDefault_bd_btn routePlan" @click="toPathPlan">路径规划</span>
      </div>
      <div class="dispatchInfoDefault_bd_cnt">
        <div type="shortMessage" v-show="infoTabsCur===0">
          <div class="nothingData--bg" v-if="false"></div>
          <el-scrollbar style="height:100%;">
            <div v-for="(item , index ) in messageInfo" :key="index" style="height:100%">
              <div class="infoText">
                <span class="infoText_title">发报时间</span>
                <p class="infoText_text">{{item.feedbacktime}}</p>
              </div>
              <div class="infoText infoText-bg">
                <span class="infoText_title">报文内容</span>
                <p class="infoText_text">{{item.feedbackcon}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">发报位置</span>
                <p
                  class="infoText_text"
                >{{item.address}}，经度：{{item.longitude}}，纬度：{{item.longitude}}</p>
              </div>
              <div
                class="infoText infoText-bg"
                v-if="item.filetype == 'mp4'"
                @click="openDialog(item,true)"
              >
                <span class="infoText_title">附件</span>
                <p class="infoText_text">
                  <span class="info-icon-video"></span>
                </p>
              </div>
              <div
                class="infoText infoText-bg"
                v-if="item.filetype == 'jpg'"
                @click="openDialog(item,true)"
              >
                <span class="infoText_title">附件</span>
                <p class="infoText_text">
                  <span class="info-icon-picture"></span>
                </p>
              </div>
              <div class="infoText infoText-bg" v-if="item.filetype == 'mp3'">
                <span class="infoText_title">附件</span>
                <p class="infoText_text">
                  <span class="info-icon-pause" @click="openAudio(item,true)"></span>
                </p>
                <div>
                  <audio :src="getAudioUrl(item.fileid)" controls="controls" v-if="isShowAudio"></audio>
                </div>
              </div>
            </div>
            <div
              v-for="(item , index ) in unMessageInfo"
              :key="index"
              style="height:100%"
              @click="resultDataClick(item)"
            >
              <div class="infoText">
                <span class="infoText_title">发报时间</span>
                <p class="infoText_text">{{item.feedbacktime}}</p>
              </div>
              <div class="infoText infoText-bg">
                <span class="infoText_title">报文内容</span>
                <p class="infoText_text">{{item.feedbackcon}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">发报位置</span>
                <p
                  class="infoText_text"
                >{{item.address}}，经度：{{item.longitude}}，纬度：{{item.longitude}}</p>
              </div>
              <div
                class="infoText infoText-bg"
                v-if="item.filetype == 'mp4'"
                @click="openDialog(item,false)"
              >
                <span class="infoText_title">附件</span>
                <p class="infoText_text">
                  <span class="info-icon-video"></span>
                </p>
              </div>
              <div
                class="infoText infoText-bg"
                v-if="item.filetype == 'jpg'"
                @click="openDialog(item,false)"
              >
                <span class="infoText_title">附件</span>
                <p class="infoText_text">
                  <span class="info-icon-picture"></span>
                </p>
              </div>
              <div class="infoText infoText-bg" v-if="item.filetype == 'mp3'">
                <span class="infoText_title">附件</span>
                <p class="infoText_text">
                  <span class="info-icon-pause" @click="openAudio(item,false)"></span>
                </p>
                <div>
                  <audio :src="getAudioUrl(item.fileid)" controls="controls" v-if="isShowAudio"></audio>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div type="baseInfo" v-show="infoTabsCur===1">
          <el-scrollbar style="height:100%;">
            <el-row class="infoText-bg">
              <div class="infoText">
                <span class="infoText_title">用户名</span>
                <p class="infoText_text">{{currentChildObj.data.username}}</p>
              </div>
            </el-row>
            <div class="infoText">
              <span class="infoText_title">所在位置</span>
              <p
                class="infoText_text"
              >{{currentChildObj.data.address}}，经度：{{currentChildObj.data.longitude}}，纬度：{{currentChildObj.data.longitude}}</p>
            </div>
            <div class="infoText infoText-bg">
              <span class="infoText_title">更新时间</span>
              <p class="infoText_text">{{ currentChildObj.data.updatetime}}</p>
            </div>
            <div class="infoText">
              <span class="infoText_title">历史轨迹</span>
              <p
                class="infoText_text"
                v-if="!currentChildObj.data.trackhistory||currentChildObj.data.trackhistory.length == 0"
              >
                <span class="text-bg">暂无数据</span>
              </p>
              <p class="infoText_text" v-else>
                <span class="info-icon-play" @click="historyPlay" v-show="palyFlag"></span>
                <span class="info-icon-pause" @click="historyPause" v-show="!palyFlag"></span>
                <span class="info-icon-stop" @click="historyStop"></span>
                <span class="text-bg">有数据</span>
              </p>
            </div>
            <p class="noVideo-text">尚未回传视频</p>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MyMixin from './detailsMinx';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'VideoReturnInfo',
})
export default class VideoReturnInfo extends mixins(MyMixin) {
  @Prop() private currentChildObj: any;
  private configServerPath =  publishObjectPath.value && publishObjectPath.value.serverPath;
  private infoTabs = [
    {
      title: '查看附件',
    },
    {
      title: '基本信息',
    },
  ];
  private messageInfo: any;
  private unMessageInfo: any;
  private infoTabsCur = 0;
  private isShowAudio = false;

  private palyFlag = true;

  public mounted() {
    this.loadTrack();
  }
  public beforeDestroy() {
    this.updataFun(null);
  }

  @Watch('currentChildObj', { deep: true })
  private updataFun(data: any) {
    this.getComponent().off('finish', this.onPlayFinished, this);
    this.getComponent().unload();
    if (!data) {
      return false;
    }
    this.loadTrack();
    this.messageInfo = this.currentChildObj.defaultData.read;
    this.unMessageInfo = this.currentChildObj.defaultData.notRead;
  }

  private resultDataClick(data: any) {
    // 从列表更视频短报文
    this.messsageBus.emit('sendShortUpdateVideo', data);
  }
  private infoTab(idx: number) {
    this.infoTabsCur = idx;
  }
  private toPathPlan() {
    // 调用路径规划方法
    this.messsageBus.emit('Open_Router', {
      endPoint: [
        this.$store.state.eventPushStore.eventLocation.EventLon,
        this.$store.state.eventPushStore.eventLocation.EventLat,
      ],
      startPoint: [
        this.currentChildObj.data.longitude,
        this.currentChildObj.data.latitude,
      ],
      type: 1,
    });
  }
  private created() {
    // 附件列表需要循环
    this.messageInfo = this.currentChildObj.defaultData.read;
    this.unMessageInfo = this.currentChildObj.defaultData.notRead;
  }
  private openDialog(data: any, flag: any) {
    const slef: any = window;
    const tempData = {
      type: data.filetype,
      url:
        slef.configServerPath +
        '/api/mobileapp/downloadfeedbackattach/v1?id=' +
        data.fileid,
    };
    this.messsageBus.emit('openDialog', tempData);
    if (!flag) {
      this.resultDataClick(data);
    }
  }
  private getAudioUrl(id: string) {
    const self: any = window;
    return (
      self.EMAP_CONFIG.common.urlWeb + '/shortWave/downloadShortWave?id=' + id
    );
  }
  private openAudio(data: any, flag: any) {
    this.isShowAudio = !this.isShowAudio;
    if (!flag) {
      this.resultDataClick(data);
    }
  }
}
</script>
<style lang="less">
@import url('../../../../../../../../assets/css/decisionSupport/CommandDispatchInfo.less');
</style>