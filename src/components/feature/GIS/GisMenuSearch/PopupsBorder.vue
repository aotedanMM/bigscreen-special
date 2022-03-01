<!-- 弹窗边框公共部分 -->
<template>
    <div class="popups-block" v-if="show">
        <transition name="fade">
            <div v-show="aside">
                <div class="popups-head">
                    <div class="popups-title">{{title}}</div>
                    <div class="popups-close" @click="changeStatus(title)">✖</div>
                </div>
                <div class="popups-body">
                    <slot>暂无数据</slot>
                </div>
                <div class="popups-foot">
                    <slot name="foot"></slot>
                </div>
            </div>
        </transition>
<!--        <div :class="['panleChange', aside?'':'close']" @click="aside = !aside"></div>-->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'PopupsBorder',
  components: {},
})
export default class PopupsBorder extends Vue {
  @Prop() public show?: boolean;
  @Prop() private title?: string;
  @Prop() private closedThisPanel: any; // 关闭面板
  private aside: boolean = true;
  private changeStatus(title: string) {
    this.messsageBus.$emit('GisMapMenuSearch-closePopups', title);
    if (this.closedThisPanel) {
        this.closedThisPanel();
    }

  }
}
</script>

<style lang="less" scoped>
@imgurl: '../../../../assets/img/popupsborder/';
.popups-block {
  position: absolute!important;
  width: 382px;
  top: 81px;
  left: 74px;
  z-index: 4;
}
.popups-head {
  display: inline-block;
  padding-left: 60px;
  width: 100%;
  height: 92px;
  line-height: 88px;
  font-size: 22px;
  color: #c8d8f1;
  background: url('@{imgurl}sidebar-head.png') no-repeat;
}
.popups-close {
  position: absolute;
  top: 34px;
  right: 7%;
  line-height: 2;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
}
.popups-body {
  margin-top: -16px;
  margin-bottom: -3px;
  padding-top: 10px;
  padding-left: 18px;
  padding-right: 11px;
  max-height: 727px;
  overflow-y: auto;
  background-image: url('@{imgurl}sidebar-body.png');
  background-size: 100% auto;
  &::-webkit-scrollbar {
    width: 0px;
  }
}
.popups-foot {
  display: inline-block;
  width: 100%;
  height: 45px;
  background: url('@{imgurl}sidebar-foot.png') no-repeat bottom;
}
.panleChange {
  background: url('@{imgurl}sidebar-hide1.png') no-repeat;
  width: 30px;
  height: 106px;
  position: absolute;
  right: -19px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 99;
  transition: all 0.5s;
  &.close {
    background: url('@{imgurl}small-bg.png') no-repeat;
    top: 60px;
    left: 0;
  }
  &.close:hover {
    background: url('@{imgurl}small-bg-hover.png') no-repeat;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
