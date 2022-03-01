
<template>
    <div class="vedio-container">
        <div v-if="type=='select' " style="position:absolute;z-index:9999;height:50px;width:80%;"> 
            <el-dropdown  @command="changed">
                <span class="el-dropdown-link">
                    <i :class="downloadIcon">{{downloadText}}</i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item 
                    v-for=" item of selectObj.data" 
                    :command='item.url'
                    :key="item.url"> {{item.label}}</el-dropdown-item>
                </el-dropdown-menu>
           </el-dropdown>
        </div>
        <div class="vid">
            <video-player  class="video-player-box"
                width="100%" height="100%"
                 ref="videoPlayerMini"
                 :options="playerOptions"
                 :playsinline = "true"
                 @play="onPlayerPlay($event)"
                 @ready="playerReadied">
            </video-player>
            <!--<video :src='url' width="100%" height="100%" style="object-fit: fill" autoplay="autoplay" controls="controls"></video>-->

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue , Prop, Watch } from 'vue-property-decorator';
  /**
    *  视频组件
    */
@Component({
    name : 'BaseVideo',
})
export default class BaseVideo extends Vue {

     /**
       * 下拉列表视频切换，默认为普通的video，如果传入select，则为下拉列表视频切换;
       */
    @Prop() public type?: string ;

    /**
      * 视频播放的url,类型：string，必选项
      */
    @Prop() public url!: string   ;

    /**
      * 传入的selectObj时，则为type为select时，传入
      */
    @Prop() public selectObj?: any ;
    /**
      * 下拉的图标
      */
    @Prop({default : 'el-icon-caret-bottom el-icon--right'}) public downloadIcon?: any ;
    /**
      * 下拉的文字
      */
    @Prop({default : ''}) public downloadText?: any ;
    private playerOptions: any = {
          muted: true,
          language: 'zh-CN',
          aspectRatio: '16:9',
          autoplay: true,
          hls: true,
          sources: [{
            type: 'application/x-mpegURL',
            src: this.url, // 你的m3u8地址（必填）
          }],
        //  poster: "/static/images/author.jpg",
    };
    private changed(common: string) {
        this.url =  common;
        this.changedCallback();
    }
    private changedCallback() {
    // do something
    }
    private playerReadied() {
        // debugger
    }
    private onPlayerPlay() {
        // debugger
    }
    private mounted() {
        $('.vjs-big-play-button .vjs-control-text').html('播放视频');
        $('.vjs-big-play-button').attr('title', '播放视频');
        $('.vjs-loading-spinner').hide();
    }

    private created() {
        this.messsageBus.on('miniScreen', (data: boolean) => {
            if (data) {
                ((this.$refs.videoPlayerMini as any).player as any).play();
            } else {
                ((this.$refs.videoPlayerMini as any).player as any).pause();
            }
        });
        const that = this;
        this.$nextTick(function() {
            $('div.vedio-container').find('video').attr('controls', 'controls');
        });
    }
    private beforeDestroy() {
        this.messsageBus.off('miniScreen');
    }
}
</script>

<style>
    .video-js .vjs-tech {
        height: 86% !important;
    }
    .vedio-container{
        width: 100%;
    }
    .video-js {
        background-color: transparent !important;
    }
    .video-player-box .video-js .vjs-big-play-button {
        transform: translate(-50%,-50%);
        left: 50%;
        top: 45%;
    }
    .video-js{
        height: 98% !important;
    }
    .video-player{
        width: 100%;
        height: 100%;
    }
    .video-js .vjs-tech{
            object-fit: inherit !important;
    }
</style>
<style scoped>
    .vedio-container {
        /* position: relative; */
        position: absolute;
        top: 0;
        left: 0;
        /* margin: 0px 10px 0px 10px; */
        margin: 0;
        height :100% ;
    }
    .vid{
        width: 100%;
        height: 100%;
    }
    .el-dropdown{
        position: absolute;
        top: 8px;
        left: 38%;
    }
</style>
