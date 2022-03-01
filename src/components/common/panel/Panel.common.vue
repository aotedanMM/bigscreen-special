<template>
  <div class="panel">
    <div
      :class="['title', 'titleEmergency']"
      @click="childMethod"
      v-if="title.constructor == Array && title.length > 0"
    >
      <button
        @click="clickMethodEmergency(item)"
        :class="['resourceTrouble-tab1', { currentTab: item.ativeClass }]"
        v-for="item of title"
        :data-mark="item.key"
        :key="item.key"
      >
        {{ item.name }}
      </button>
    </div>
    <div class="title" @click="childMethod" v-else>
      {{ title }}
    </div>
    <div class="main"><slot></slot></div>
    
    <div class="panel_animate_top shine1 animated fadeOutRightBig slow"></div>                    
    <div class="panel_animate_left  shine4 animated fadeInUpBig slow"></div>

    <!-- 下拉框 -->
    <div class="LiveMonitor-videoList">
      <i :class="{i_click:flagClick}" @click="handleSelect"></i>
      <ul v-show="flagClick">
      <el-scrollbar style="height:100%;">
        <li @click="handleCommand(item)" v-for="(item, index) in selectData" :key="index">{{item.name}}</li>
      </el-scrollbar>
      </ul>        
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import baseMapComponent from '../../../components/common/baseMap/misc/gisMethodNew';
@Component
export default class Panel extends Vue {
  @Prop() private title!: string;
  @Prop() private selectData!: any;
  private flagClick: boolean = false;
  private childMethod() {
    // this.$store.dispatch('clickEventInfoTitle', this.closeGisMapEventInfo);
  }
  private closeGisMapEventInfo() {
    // baseMapComponent.clearEventAll();
  }
  private clickMethodEmergency(item: any) {
    this.$emit('fatherMethodEmergency', item);
    // this.$store.dispatch('titleWarningInfo', item);
  }

  // 下拉框箭头显示
  private handleSelect() {
    this.flagClick = !this.flagClick;
  }
  // 点击下拉框
  private handleCommand(command: any) {
    (this.$parent as any).handleVideo(command);
    this.flagClick = !this.flagClick;
  }
}
</script>

<style scoped lang="less">
@panelImgUrl:'../../../assets/img/default/panel/';
.panel {
  width: 100%;
  height: 100%;
  text-align: left;
  position: relative;
  .title {
    line-height: 55px;
    padding-left:0px;
    font-size: 28px;
    color: #00e4ff;
    display: inline-block;
    font-family: 'myHeiti';
    font-style: italic;
    font-weight: bold;
    cursor: pointer;
    z-index: 4;
  }
  .main {
    //width: 100%;
    margin-right: 3px;
    height: calc(100% - 55px);
    //height: calc(100% - 40px);
  }
  .resourceTrouble-tab1 {
    cursor: pointer;
    width: 50%;
    text-align: center;
    font-family: 'HanYi';
  }
  button.currentTab {
    // background: url('@{panelImgUrl}ziyuanfengxianactive.png')0 50%  no-repeat;
    background-size: 100% 100%;
    color: #00e4ff;
    font-size: 28px;
    font-weight: bold;
  }
  .titleEmergency {
    display: flex;
    width: 330px;
    margin-left: 30px;
  }
  // 下拉菜单
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  /deep/.el-dropdown{
    position: absolute;
    top: 5%;
    left: 32%;
  }
  .LiveMonitor-videoList{
      position: absolute;
      top: 15px;
      left: 55px;
      width: 130px;
    i{
      display: block;
      width: 25px;
      height: 19px;
      // background: url(../../../assets/img/disaster/listbtnhide.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: -10px;
      cursor: pointer;
    }
    .i_click{
      display: block;
      width: 25px;
      height: 19px;
      // background: url(../../../assets/img/disaster/listbtnshow.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 0;
      cursor: pointer;
    }
    ul{
      width: 120px;
      height: 150px;
      background: url(../../../assets/img/disaster/listbtnhide.png) no-repeat;
      background-size: 100% 100%;
      background: rgba(0,33,74,0.7);
      border-radius: 3px;
      border: 1px solid rgba(0,227,255,0.49);
      // overflow-y: scroll;
      margin-top: 31px;
      li{
        color: #bde9ee;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        list-style: none;
        &:hover{
            cursor: pointer;
            background: url(../../../assets/img/disaster/hover.png) no-repeat;
        }
      }
    }
  }
}
</style>
