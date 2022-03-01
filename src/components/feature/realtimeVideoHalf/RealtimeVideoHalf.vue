<template>
<div>
     <div :class="{'temp-liveVideo':true,'temp-liveVideoAct':openVideo}" @click='openVideoShow(false)'></div>
     <div class="modulePanel-style" v-if='openVideo'>
     <PanelView title="新闻报道" class="cmp-panel-cnt--bg">
                <!-- <Vedio :url="url"></Vedio> -->
                <Vedio></Vedio>
              </PanelView>
</div>
</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import Vedio from '@/components/feature/vedio/realtimeVideo.vue';
@Component({
    name: 'RealtimeVideoHalf',
     components: {
    PanelView,
    Vedio,
     },
})
export default class RealtimeVideoHalf extends Vue {
 private openVideo: any = false;
 private openVideoShow() {
    this.openVideo = ! this.openVideo;
 }
}
</script>
<style scoped lang="less">
@videoBtnImg: '../../../assets/img/videoBackhaul';
.temp-liveVideo{
    width: 103px;
    height: 36px;
    position: absolute;
    bottom: -80px;
    left: 0px;
    z-index:99;
    background: url('@{videoBtnImg}/show_listDialog.png') no-repeat;
    // display: block;
}
.temp-liveVideo:hover{
    cursor: pointer;
    background: url('@{videoBtnImg}/show_listDialog_hover.png') no-repeat;
}
.temp-liveVideoAct{
    background: url('@{videoBtnImg}/show_listDialog_hover.png') no-repeat;
}
.modulePanel-style{
    position: absolute;
    left: 100px;
    bottom: 0px;
    width: 400px;
    height: 275px;
    background: rgba(0, 0, 0, 0.45);
    border-radius: 3px;
}
.modulePanel-head {
    padding-top: 15px;
}
.modulePanel-title{
    line-height: 40px;
    margin-left: 25px;
    font-size:28px;
    font-weight:700;
    font-style:italic;
    color:rgba(0,227,255,1);
    font-family: '黑体';
    display: inline-block;
    text-align: center;
    cursor: pointer;
    z-index: 4;
}
.modulePanel-cont{
    padding: 5px 10px;
    height: 270px;
}
</style>
