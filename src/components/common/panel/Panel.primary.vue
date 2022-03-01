<template>
  <div class="panel">
    <!--<div class="line"></div>-->
    <div
      :class="['title','titleEmergency']"
      @click="childMethod"
      v-if=" title.constructor == Array&& title.length>0"
    >
      <button
        @click="clickMethodEmergency(item)"
        :class="['resourceTrouble-tab1 f-tit-h1', {currentTab:item.ativeClass}]"
        v-for="(item) of title"
        :data-mark="item.key"
        :key="item.key"
      >{{item.name}}</button>
    </div>
    <div class="title" @click="childMethod" v-else>{{title}}</div>
    <div class="main">
      <slot></slot>
    </div>
<!--     
    <div class="panel_animate_top shine1 animated fadeOutRightBig slow"></div>                    
    <div class="panel_animate_left  shine4 animated fadeInUpBig slow"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue} from 'vue-property-decorator';
// 暂时注释
// import baseMapComponent from '../../../components/common/baseMap/misc/gisMethodNew';
// 暂时注释
@Component
export default class Panel extends Vue {
  @Prop() private title!: string;
  private childMethod() {
    // this.$store.dispatch('clickEventInfoTitle', this.closeGisMapEventInfo);
  }
  // 暂时注释
  // private closeGisMapEventInfo() {
  //   baseMapComponent.clearEventAll();
  // }
  // 暂时注释
  private clickMethodEmergency(item: any) {
    this.$emit('fatherMethodEmergency', item);
    // this.$store.dispatch('titleWarningInfo', item);
  }
}
</script>

<style scoped lang="less">
@panelImgUrl:'../../../assets/img/default/panel/';
@titleHeight: 40px;
.panel {
  position: relative;
  width: 100%;
  height: 100%;
  .line {
    border-bottom: 2px solid rgba(0, 227, 255, 0.6);
    position: absolute;
    top: 36px;
    left: 36px;
    width: 93%;
  }
  .unit-svg {
    position: absolute;
    top: 0;
    left: 0px;
    z-index: 0;
    pointer-events: none;
  }
  .title {
    // line-height: 35px;
    height:@titleHeight;
    // margin-left: 30px;
    color: rgba(0, 227, 255, 1);
    display: inline-block;
    cursor: pointer;
    z-index: 4;
  }
  .main {
    height: calc(100% - 5px -  @titleHeight );
   // outline: 1px solid red;
    // margin-top: 2px;
    // margin-left: 18px;
  }
  .resourceTrouble-tab1 {
    cursor: pointer;
    outline: none;
    border: none;
    width: 33%;
    height: 35px;
    // text-align: center;
    font-family:'myHeiti';
    font-style: italic;
    color: #fbfeae;
    background: transparent;
    position: relative;
    // text-indent: -5px;
    white-space: nowrap;
    letter-spacing: -.2rem;
    background-image: -webkit-linear-gradient(top, #fffd73 10%, #1ae7ff);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    // outline: 1px solid red;
    padding-left:0;;
    &::after{
      content: '';
    display: inline-block;
    position: absolute;
    bottom: -11px;
    background: url('@{panelImgUrl}tab_bg.png') 100% 100% no-repeat;
    height: 40px;
    width: 100%;
    background-size: 100% 100%;
    right: -12px;
    }
  }
  button.currentTab {
    font-weight: bold;
    background-image: -webkit-linear-gradient(top, #ffffff 10%, #fffd73);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    &::after{
      content: '';
    display: inline-block;
    position: absolute;
    bottom: -11px;
    background: url('@{panelImgUrl}tab_bg_h.png') 0 100% no-repeat;
    background-size: 100% 100%;
    height: 40px;
    width: 100%;
    background-size: 100% 100%;
    right:-10px;
    }
  }
  
  .titleEmergency {
    display: flex;
    // width: 330px;
    // margin-left: 30px;
    // margin-right:20px;
   // border-bottom:1px solid rgba(0, 227, 255, 0.6)

  }
  .shine1{
    top:41px;
    left:80px;
  }
}
</style>