<template>
  <div class="board-layout">
    <div class="board-title" :class="'bg' + boardId"></div>
    <div class="board-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Board extends Vue {
  @Prop({default: '02010001'}) private boardId!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  /*.board-layout {
    width: 705px;
    height: 430px;
    background: url(../../../assets/img/board/board-border.png) no-repeat;
    position: absolute;
    color:#fff;
  }
  .board-title {
    width: 706px;
    height: 68px;
    position: absolute;
    left:17px;
    top:0px;
    background: url(../../../assets/img/board/title-accid-simulation.png) no-repeat;
  }  
  .board-content {
    position: absolute;
    left:30px;
    right:30px;
    bottom:24px;
    top:60px;
  }
  .board-title.bg02010001,.board-title.bg02030001 {
    background-image: url(../../../assets/img/board/title-moni-alarm.png);
  }
  .board-title.bg02010002 {
    background-image: url(../../../assets/img/board/title-alarm-trend.png);
  }
  .board-title.bg02010003 {
    background-image: url(../../../assets/img/board/title-alarm-disposal.png);
  }
  .board-title.bg02010004 {
    background-image: url(../../../assets/img/board/title-surve-video.png);
  }
  .board-title.bg02010005 {
    background-image: url(../../../assets/img/board/title-city-Industry.png);
  }
  .board-title.bg02010006 {
    background-image: url(../../../assets/img/board/title-public-facilities.png);
  }
  .board-title.bg02010007 {
    background-image: url(../../../assets/img/board/title-natural-disaster.png);
  }
  .board-title.bg02010008 {
    background-image: url(../../../assets/img/board/title-dense-place.png);
  }

  .board-title.bg02020101 {
    background-image: url(../../../assets/img/board/title-enterprise-info.png);
  }
  .board-title.bg02020102 {
    background-image: url(../../../assets/img/board/title-comp-indicator.png);
  }
  
  .board-title.bg02020103 {
    background-image: url(../../../assets/img/board/title-obj-association.png);
  }
  .board-title.bg02020104 {
    background-image: url(../../../assets/img/board/title-focus-on.png);
  }
  .board-title.bg02020201 {
    background-image: url(../../../assets/img/board/title-disposal-schedule.png);
  }
  .board-title.bg02020202 {
    background-image: url(../../../assets/img/board/title-moni-real.png);
  }
  .board-title.bg02020203 {
    background-image: url(../../../assets/img/board/title-accid-simulation.png);
  }
  .board-title.bg02020204 {
    background-image: url(../../../assets/img/board/title-video-linkage.png);
  }
    

  .board-title.bg02020001 {
    background-image: url(../../../assets/img/board/title-danger-alarm-trend.png);
  }
  .board-title.bg02020002 {
    background-image: url(../../../assets/img/board/title-danger-alarm-disposal.png);
  }
  .board-title.bg02020003 {
    background-image: url(../../../assets/img/board/title-danger-focus-on.png);
  }
  .board-title.bg02020004 {
    background-image: url(../../../assets/img/board/title-danger-moni-radar.png);
  }
  .board-title.bg02020005 {
    background-image: url(../../../assets/img/board/title-surve-video.png);
  }

  .board-title.bg01000001	{
    background-image: url(../../../assets/img/board/title-risk-profile.png);
  }
  .board-title.bg01000002	{
    background-image: url(../../../assets/img/board/title-risk-constitute.png);
  }
  .board-title.bg01000003	{
    background-image: url(../../../assets/img/board/title-risk-manage.png);
  }
  .board-title.bg01000004	{
    background-image: url(../../../assets/img/board/title-risk-analysis.png);
  }*/
</style>
