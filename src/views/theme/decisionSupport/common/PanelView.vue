<template>
  <PanelRander
    ref="panelRander"
    :id="id"
    :type="type"
    :isShow="isShow"
    :showTwoPage="showTwoPage"
    :title="title"
    v-slot="{id, type, isShow, title, fnClosePanel, fnShrinkPanel, fnOpenPanel, showTwoPage, showTwoPageHandler}"
  >
    <div class="cmp-panel-wrap">
      <div class="cmp-panel-shrink" v-if="type===2 && !isShow" @click="fnShrinkPanel"></div>
      <div v-if="isShow" style="height:100%">
        <div class="cmp-panel-cnt"  >
          <div class="cmp-panel-cnt-hd">
            <div class="cmp-panel-cnt-tool">
              <span v-if="type===1" @click="fnClosePanel" class="cmp-panel-btn cmp-panel-close">X</span>
              <span class="cmp-panel-btn cmp-panel-shrink" v-if="type===2" @click="fnShrinkPanel"></span>
              <span v-if="type === 3" class="cmp-panel-change-btn" @click="showTwoPageHandler"></span>
            </div>
            <div  :class="['cmp-panel-cnt-title title-panel',{title_hover:titleType}]" @click='handleMap'>{{title}}</div>
            <!-- <div class="flicker-cube-box">
              <div class="flicker-cube"></div>
              <div class="flicker-cube flicker-cube_a"></div>
              <div class="flicker-cube flicker-cube_b"></div>
            </div> -->
          </div>
          <div class="cmp-panel-cnt-bd">
            <slot v-if="showTwoPage && type === 3" name="twoPage"></slot>
            <slot v-else></slot>
          </div>
          <!-- <div class="panel_animate_top shine1 animated fadeOutRightBig slow"></div>
          <div class="panel_animate_left shine4 animated fadeInUpBig slow"></div> -->
        </div>
      </div>
    </div>
  </PanelRander>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PanelRander from '@/components/common/rander/PanelRander.vue';
const str: string = ' ';
//  'background: url("../../../../assets/img/decisionSupport/panel/panelbg.png") no-repeat -37px -15px;';
@Component({
  name: 'PanelView',
  components: {
    PanelRander,
  },
})
export default class PanelView extends Vue {
  /**面板属性
   * @type:   type：number; 0(无关闭无收缩)|1（带关闭按钮的面板）|2（带收缩按钮的面板）
   * @isShow: type: boolean; dis: 面板的显示状态;
   * @title:  type: String ;窗口的标题；
   */
  // @Prop() private originData!: IPanelData;
  @Prop() private id?: string;
  @Prop({ default: 0 }) private type?: number;
  @Prop({ default: true }) private isShow?: boolean;
  @Prop({ default: false }) private showTwoPage?: boolean;
  @Prop() private title!: string;
  @Prop({ default: str}) private replaceBg?: string;
  @Prop() private titleType?: string;
  private flagMap: boolean = true;
  /* @Prop() private randerData: any;*/
  public openPanel() {
    (this.$refs as any).panelRander.fnOpenPanel();
  }

  // 点击常态左侧 '事件信息' 四个字地图标记显隐藏
  public handleMap() {
    if (this.titleType === 'eventInfo') {
      this.flagMap = !this.flagMap;
      this.messsageBus.emit('eventInfoMapShow', this.flagMap);
    }
  }
}
</script>
<style>
@import url(../../../../assets/css/animate.min.css);
</style>
<style lang="less" scoped>
@panelHeadWidth: 30px;
@panelHeadHeight: 30px;
@panelHeadTitleFontSize: 28px;
@decisionSupportUrl:'../../../../assets/img/decisionSupport';
@panelUrl:'../../../../assets/img/default/panel';
.cmp-panel-wrap {
  height: 100%;
  /* background-color:#fff;*/
  .cmp-panel-shrink {
    /*position:absolute;*/
    width: @panelHeadWidth;
    height: @panelHeadHeight;
    cursor: pointer;
    text-align: center;
    user-select: none;
    // background: url('@{panelUrl}/panel_shrink.png') no-repeat  50% 50%;
  }
}
/*.cmp-panel-cnt--bg{  
  background: url('@{decisionSupportUrl}/panel/panelbg.png') no-repeat -37px -15px;
}*/
.cmp-panel-cnt {
  position: relative;
  width: 100%;
  height: 100%;
  /*  background-attachment: scroll;
    background-size: 100% 100%;*/
  .cmp-panel-cnt-hd {
    // padding: 0px 0 0 @panelHeadWidth;
    padding-left:10px;
    height: @panelHeadHeight;
    color: #00e4ff;
    /* background:url("../../../assets/img/panel/panel_title_bg.png") no-repeat 5px 15px;*/
  }
  .cmp-panel-cnt-title {
    padding-left:0px;
    line-height:@panelHeadHeight;
    user-select:none;
    font-style: italic;
  }
  .title_hover:hover{
    cursor: pointer;
  }
  .cmp-panel-cnt-tool {
    float: right;
    width: auto;
    height: @panelHeadHeight;
    /*margin-right:-@panelHeadWidth;*/
    .cmp-panel-change-btn {
      cursor: pointer;
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid #00e4ff;
      border-radius: 50%;
      position: absolute;
      right: 174px;
      top: 27px;
    }
  }
  .cmp-panel-btn {
    display: inline-block;
    width: @panelHeadWidth;
    height: @panelHeadHeight;
    line-height: @panelHeadHeight;
    text-align: center;
    user-select: none;
    cursor: pointer;
  }
  .cmp-panel-close {
    cursor: pointer;
    font-size: 16px;
    color: inherit;
    transform: scale(1, 0.7);
    &:hover {
      color: #f0bc54;
    }
  }

  .cmp-panel-cnt-bd {
    // padding-left: 60px;
    // padding-top: 18px;
    // padding-right: 18px;
    // height: calc(100% - 68px);
    // box-sizing: border-box;
    // outline: 1px solid red;
    
    // padding-left: 36px;
    padding-top: 10px;
    height: calc(100% - 40px);
    // padding-right:14px;
    box-sizing: border-box;
    
  }
}
</style>