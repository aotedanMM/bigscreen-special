<template>
<div class="secondary-liveVideo-wrap">
    <div class="secondary-liveVideo">
        <!--<video :src="url" width="100%" height="100%" autoplay="autoplay" controls="controls"></video>-->
        <video-player  class="video-player-box"
                width="100%" height="100%" controls="controls"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline = "true"
                 @play="onPlayerPlay($event)"
                 @ready="playerReadied">
            </video-player>
    </div>
    <span class="close-secondary-liveVideo" @click="close()"></span>
</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'VideoPreview',
  components: {},
})
export default class VideoPreview extends Vue {
    @Prop() public previewUrl: any;
    private playerOptions: any = {
          muted: true,
          language: 'zh-CN',
          aspectRatio: '16:9',
          autoplay: true,
          sources: [{
            type: 'application/x-mpegURL',
            src: this.previewUrl,
          }],
        //  poster: "/static/images/author.jpg",
    };
    private close() {
        this.messsageBus.emit('miniScreen', true);
        this.$emit('previewVideoEmit', true);
    }

    private playerReadied() {
        // debugger
    }
    private onPlayerPlay() {
        // debugger
    }
}
</script>
<style lang="less" scoped>
@url: '../../../assets/img/halfScreen/eventAndTopics';
.secondary-liveVideo-wrap{
    left: 0px;
    top: 0px;
    /* right: 14px; */
    /* bottom: 66px; */
    overflow: hidden;
    position: absolute;
    width: 1920px;
    height: 1080px;
    background:url(../../../assets/img/iframeKuan/bg.png) no-repeat;
    z-index:99;
}
.secondary-liveVideo {
    position: absolute;
    top: 110px;
    left: 138px;
    /* right: 31px; */
    /* bottom: 101px; */
    z-index: 4;
    width: 1645px;
    height: 858px;
    overflow: hidden;
    
}
.close-secondary-liveVideo {
    position: absolute;
    top: 50PX;
    right: 80px;
    width: 90px;
    height: 48px;
    line-height: 50px;
    background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
    cursor: pointer;
    &:hover{
        background-image: url('@{url}/eventAndTopics_close_h.png');
    }
}
</style>