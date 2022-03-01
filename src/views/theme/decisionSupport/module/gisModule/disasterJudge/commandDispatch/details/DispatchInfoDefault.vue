
<!--默认 详情页-->
<template>
  <div class="dispatchInfoDefault">
    <div class="dispatchInfoDefault_hd">
      <h3 class="dispatchInfoDefault_hd_tit">北斗终端最新短报文</h3>
      <div class="dispatchInfoDefault_hd_opt">
        <span class="dispatchInfoDefault_hd_arrow dispatchInfoDefault_hd_arrow_left"></span>
        <span class="dispatchInfoDefault_hd_total">0/0</span>
        <span class="dispatchInfoDefault_hd_arrow dispatchInfoDefault_hd_arrow_right"></span>
      </div>
    </div>
    <div class="dispatchInfoDefault_bd">
      <!-- <div class="nothingData--bg" v-if="!messageInfo"></div> v-else -->
      <!-- <div class="dispatchInfoDefault_bd_cnt">        
      </div>-->
      <div class="shortMessage">
        <p
          class="shortMessage_txt"
          v-for="(item,index) in currentCurrent"
          :key="index"
          @click="sendClick(item)"
            :title='item.content'
        >
          <span :class="[item.receive=='1' ? 'info-icon-emailRead' : 'info-icon-email',' shortMessage_txt_icon ']"></span>
          <span class="shortMessage_txt_time">{{timeToText(item.sendTime)}}</span>
          <span class="shortMessage_txt_type">{{item.souceName}}</span>
          <span
            class="shortMessage_txt_cnt"
          >#P[{{item.longitude}},{{item.latitude}}]#{{item.content}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'DispatchInfoDefault',
})
export default class DispatchInfoDefault extends Vue {
  @Prop() private currentCurrent: any;
  private messageInfo: any;
  @Watch('currentCurrent', { deep: true })
  // private updataFun() { }
  private timeToText(odata: string) {
    return this.$moment()
      .startOf('hour')
      .fromNow(odata);
  }
  // 短报文详情
  private sendClick(item: any) {
    this.messsageBus.emit('sendChangeItem', item);
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../../../../../assets/css/decisionSupport/CommandDispatchInfo.less');
</style>