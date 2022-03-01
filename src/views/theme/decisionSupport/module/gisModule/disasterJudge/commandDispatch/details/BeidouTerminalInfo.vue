
<!--北斗终端 详情页-->
<template>
  <div class="dispatchInfoDefault">
    <div class="dispatchInfoDefault_hd">
      <h3 class="dispatchInfoDefault_hd_tit">北斗终端</h3>
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
        <!-- <span class="dispatchInfoDefault_bd_btn ">
          基本信息
        </span>-->
        <span class="dispatchInfoDefault_bd_btn routePlan" @click="toPathPlan">路径规划</span>
      </div>
      <div class="dispatchInfoDefault_bd_cnt">
        <div v-show="infoTabsCur===0">
          <!-- <div class="nothingData--bg"></div> -->
          <!-- <div class="shortMessage">
            <p class="shortMessage_txt" v-for="(item,index) in messageInfo" :key="index">
              <span class="shortMessage_txt_icon el-icon-message"></span>
              <span class="shortMessage_txt_time">{{timeToText(item.sendTime)}}</span>
              <span class="shortMessage_txt_type">{{item.souceName}}</span>
              <span class="shortMessage_txt_cnt">#P[{{item.longitude}},{{item.latitude}}]#{{item.content}}</span>
            </p>
          </div>-->
          <el-scrollbar style="height:100%;">
            <div class="shortMessage_info" v-for="(item,index) in messageInfo" :key="index">
              <div class="infoText">
                <span class="infoText_title">发报时间</span>
                <p class="infoText_text">{{item.sendTime.slice(0,item.sendTime.indexOf('.'))}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">报文内容</span>
                <p class="infoText_text">{{item.content}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">发报位置</span>
                <p class="infoText_text">{{item.address || '暂无数据'}}</p>
              </div>
            </div>
            <div class="shortMessage_info" v-for="(item,index) in unMessageInfo" :key="index" @click="resultDataClick(item)">
              <div class="infoText">
                <span class="infoText_title">发报时间</span>
                <p class="infoText_text">{{item.sendTime}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">报文内容</span>
                <p class="infoText_text">{{item.content}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">发报位置</span>
                <p class="infoText_text">{{item.address || '暂无数据'}}</p>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-show="infoTabsCur===1">
          <el-scrollbar style="height:100%;">
            <el-row class="infoText-bg">
              <el-col :span="12">
                <div class="infoText">
                  <span class="infoText_title">卡号</span>
                  <p class="infoText_text">{{currentChildObj.data.souceAddr}}</p>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="infoText">
                  <span class="infoText_title">名称</span>
                  <p class="infoText_text">{{currentChildObj.data.souceName || '暂无数据'}}</p>
                </div>
              </el-col>
            </el-row>
            <div class="infoText">
              <span class="infoText_title">所在位置</span>
              <p
                class="infoText_text"
              >{{currentChildObj.data.destAddr}}<template v-if="currentChildObj.data.destAddr">，</template>经度：{{currentChildObj.data.longitude}}，纬度：{{currentChildObj.data.latitude}}</p>
            </div>
            <div class="infoText infoText-bg">
              <span class="infoText_title">更新时间</span>
              <p class="infoText_text">{{currentChildObj.data.reportTime}}</p>
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

@Component({
  name: 'BeidouTerminalInfo',
})
export default class BeidouTerminalInfo extends mixins(MyMixin) {
  @Prop() private currentChildObj: any;
  private messageInfo: any;
  private unMessageInfo: any;
  private infoTabs = [
    {
      title: '短报文',
    },
    {
      title: '基本信息',
    },
  ];
  private infoTabsCur = 0;

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
    if (this.currentChildObj && this.currentChildObj.defaultData) {
      this.messageInfo = this.currentChildObj.defaultData.read;
      this.unMessageInfo = this.currentChildObj.defaultData.notRead;
    }
  }

  private infoTab(idx: number) {
    this.infoTabsCur = idx;
  }
  // 未读点击事件
  private resultDataClick(data: any) {
      // 从列表更新短报文
    this.messsageBus.emit('sendShortUpdate', data);
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
  private timeToText(odata: string) {
    return this.$moment()
      .startOf('hour')
      .fromNow(odata);
  }
  private created() {
    // 默认显示一条
    this.messageInfo = this.currentChildObj.defaultData.read;
    this.unMessageInfo = this.currentChildObj.defaultData.notRead;
  }
}
</script>
<style lang="less">
@import url('../../../../../../../../assets/css/decisionSupport/CommandDispatchInfo.less');
</style>