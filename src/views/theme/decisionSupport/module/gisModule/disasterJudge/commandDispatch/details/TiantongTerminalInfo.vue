
<!--天通终端 详情页-->
<template>
 <div class="dispatchInfoDefault">
    <div class="dispatchInfoDefault_hd">
      <h3 class="dispatchInfoDefault_hd_tit">天通终端</h3>
      <div class="dispatchInfoDefault_hd_opt">
        <span class="dispatchInfoDefault_hd_back" @click="returnBack"></span>
      </div>
    </div>
    <div class="dispatchInfoDefault_bd">
      <div class="nothingData--bg" v-if="false"></div>   
      <div class="dispatchInfoDefault_bd_cnt">    
      
        <div class="" type="baseInfo">
          <el-row class="infoText-bg">
            <el-col :span="12">
              <div class="infoText">
                <span class="infoText_title">卡号</span>
                <p class="infoText_text">{{currentChildObj.data.simInfoId}}</p>
              </div>
              <div class="infoText">
                <span class="infoText_title">持有人</span>
                <p class="infoText_text">{{currentChildObj.data.ownerName}}</p>
              </div>
            </el-col>
            <el-col :span="12">              
              <div class="infoText">
                <span class="infoText_title" @click="toCallPhone(currentChildObj.data.terminalNumber)">手机号</span>
                <p class="infoText_text">{{currentChildObj.data.terminalNumber}}  <span class="info-icon-phone"></span></p>
              </div>
            </el-col>
          </el-row>            
          <div class="infoText">
            <span class="infoText_title">所在位置</span>
            <p class="infoText_text">{{currentChildObj.data.departmentName}}，经度：{{currentChildObj.data.longitude}}，纬度：{{currentChildObj.data.latitude}}</p>
          </div>      
          <div class="infoText infoText-bg">
            <span class="infoText_title">更新时间</span>
            <p class="infoText_text">{{currentChildObj.data.updateTime}}</p>
          </div>
          <div class="infoText">
            <span class="infoText_title">历史轨迹 </span>
            <p class="infoText_text"  v-if="!currentChildObj.data.trackhistory||currentChildObj.data.trackhistory.length == 0">
             <span class="text-bg">
              暂无数据</span></p>
              <p class="infoText_text" v-else>
                <span class="info-icon-play"  @click="historyPlay" v-show="palyFlag"></span>
                  <span class="info-icon-pause" @click="historyPause" v-show="!palyFlag"></span>
                  <span class="info-icon-stop" @click="historyStop" > </span>
                    <span class="text-bg"> 有数据 </span></p>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MyMixin from './detailsMinx';

@Component({
  name: 'TiantongTerminalInfo',
})
export default class TiantongTerminalInfo extends mixins(MyMixin) {

    @Prop() private currentChildObj: any ;

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
           return false ;
        }
        this.loadTrack();
    }
    private toCallPhone(phone: string) {
      // 调用拔打电话
      // parame phone手机号
    }
}
</script>
<style lang="less">
  @import url('../../../../../../../../assets/css/decisionSupport/CommandDispatchInfo.less');
  @commandDispatchInfoImg: '../../../../../../../../assets/img/CommandDispatch.less';
</style>