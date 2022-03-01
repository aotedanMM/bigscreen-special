<template>
<div class="realtimeVidel-wrap">
    <Vedio :url="url" style="" />
    <p class="LiveVideo-button" @click="videoClick(url)"></p>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Vedio from '@/components/feature/vedio/Vedio.common.vue';
@Component({
  name: 'VedioView',
  components: {
    Vedio,
  },
})
export default class VedioView extends Vue {
  // 视频组件
  private url: string = 'http://ivi.bupt.edu.cn/hls/cctv13.m3u8';
  private videoClick(data: any) {
    this.messsageBus.emit('SsspPreview', data);
    this.messsageBus.emit('miniScreen', false);
  }
}
</script>
<style lang="less" scoped>
@panelImg: '../../../assets/img/default/panel';
.realtimeVidel-wrap{
    position: relative;
    height: 100%;
    margin: 0px 0px 0px 0px;
}
  .LiveVideo-button {
    position: absolute;
    right: 2%;
    top: -36px;
    width: 34px;
    height: 28px;
    margin: 0;
    background: url('@{panelImg}/zaiqianhou.png') no-repeat;
    background-size: 100% 100%;
    z-index: 2;
    cursor: pointer;
  }
  .LiveVideo-wrap{
    margin-right:10px;
    box-sizing: border-box;
  }
  </style>