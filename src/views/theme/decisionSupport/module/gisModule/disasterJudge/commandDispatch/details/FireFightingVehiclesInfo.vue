
<!--消防车 详情页-->
<template>
 <div class="dispatchInfoDefault">
    <div class="dispatchInfoDefault_hd">
      <h3 class="dispatchInfoDefault_hd_tit">消防车</h3>
      <div class="dispatchInfoDefault_hd_opt">
        <span class="dispatchInfoDefault_hd_back" @click="returnBack"></span>
      </div>
    </div>
    <div class="dispatchInfoDefault_bd">
      <div class="nothingData--bg" v-if="false"></div>   
      <div class="dispatchInfoDefault_bd_cnt">    
      
        <div class="" type="baseInfo">
          <div class="infoText infoText-bg">
            <span class="infoText_title">车牌号码</span>
            <p class="infoText_text">{{currentChildObj.data.cphm}}</p>
          </div>
          <div class="infoText">
            <span class="infoText_title">行驶方向</span>
            <p class="infoText_text">{{currentChildObj.data.direction}}</p>
          </div>      
          <div class="infoText">
            <span class="infoText_title">所在位置</span>
            <p class="infoText_text">经度：{{ currentChildObj.data.longitude}}，纬度：{{currentChildObj.data.latitude}}</p>
          </div>      
          <div class="infoText infoText-bg">
            <span class="infoText_title">更新时间</span>
            <p class="infoText_text">{{currentChildObj.data.time}}</p>
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
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MyMixin from './detailsMinx';

@Component({
  name: 'FireFightingVehiclesInfo',
})
export default class FireFightingVehiclesInfo extends mixins(MyMixin) {
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
}
</script>
<style lang="less">
  @import url('../../../../../../../../assets/css/decisionSupport/CommandDispatchInfo.less');
</style>