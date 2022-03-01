<template>
  <div class="HlypBtnContainer">
    <!-- 这里之所以在写一个div就是为以后做扩展，直接挂在根节点下， -->
      <div  class="nameLayout"
            @click.stop="clickNameBtn(curCompParam.isChecked)">
        <slot name="nameContainer" 
              :nameArr="curCompParam.nameLayout.arr" 
              :isChecked="curCompParam.isChecked"></slot>
      </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import FloodLegendEvent from '@/util/FloodLegendEvent';
import EventConfigRegistry from '@/util/eventConfigRegistry';
@Component({
    name: 'HlypBtnContainer',
    mixins: [GisAreaSelectEvent, FloodLegendEvent],
})
export default class HlypBtnContainer extends Vue  {
  @Prop() private compParam: any;
  @Prop() private handleClick?: any; // 父组件处理按钮点击方法

  private curCompParam: any = {};

  @Watch('compParam')
  private updateCompParam(val: any, oldVal?: any) {
    if ((val.isChecked === this.curCompParam.isChecked)) {// 当前选中和之前的选中是一样的
      return ;
    }
    this.curCompParam = JSON.parse(JSON.stringify(val));
    if (!this.curCompParam.isChecked) { // 从高亮到不亮
      this.messsageBus.emit('zhypClosedHlyp'); // 通知图层进行关闭河流
    }
  }
  @Watch('$store.state.mapTools.showRiverList.isShow')
  private updateShowRiverListIsshow(val: any) {
    const zhypGeoType = this.$store.state.dataFilterControl.zhypGeoType || {};
    // 当点击面板的关闭，且地图上没有河流
    if (!val && (val.key !== this.curCompParam.key)) {
      this.curCompParam.isChecked = false;
    }
  }
  // 监听 当前正在研判的类型，是全国还是河流、行政区划、缓冲区
  @Watch('$store.state.dataFilterControl.zhypGeoType')
  private handleZhypGeoTypeUpdated(val: any, oldVal: any) {
    val = val || {};
    oldVal = oldVal || {};
    const isCheckedKey = val && val.key && (val.key === this.curCompParam.key);
    if (val.key === oldVal.key) { // 虽然引用地址变了，但是真实的值没有改变
      // if ( !isCheckedKey ) { // 此场景会出现在，通过按钮打开了河流目录，但是没有任何操作，之后又打开了缓冲区分析
      //   this.curCompParam.isChecked = false;
      // }
      return ;
    }
    // 旧的为河流、新的不为河流，则只要取消高亮就可以了
    if ( oldVal && oldVal.key && (oldVal.key === this.curCompParam.key) && (!isCheckedKey) ) {
      this.curCompParam.isChecked = false;
    } else if (isCheckedKey) { // 需要高亮
      this.curCompParam.isChecked = true;
      // if (this.handleClick && this.curCompParam.isChecked) { // 因为只有当前控制按钮是高亮的才需要去让父级处理另外的两个，去掉高亮
      //     this.handleClick(this.curCompParam);
      // }
    }
  }

  // 通过列表显隐和zhypGeoType的情况，判断按钮的高亮情况
  private updateListAndGeometry() {
    // 在组件初始化的时候，是不用关心和父级和同级兄弟按钮之间的关系的
    // 因为外层列表不会控制,这个按钮的高亮，在外控制这个按钮的高亮的情况只有点击河流研判
    // 在点击河流研判的时候，zhypGeoType.key === hlyp
    const val = this.$store.state.dataFilterControl.zhypGeoType;
    const isCheckedKey = val && val.key && (val.key === this.curCompParam.key);
    if (isCheckedKey) { // 表示处于河流研判中
      this.curCompParam.isChecked = true;
    }
  }

  // 点击按钮
  private clickNameBtn(curChecked: boolean) {
      this.curCompParam.isChecked = !curChecked;
      // 当从高亮到不亮的情况，要关闭地图的河流、详情和列表
      if (!this.curCompParam.isChecked) {
        this.messsageBus.emit('zhypClosedHlyp'); // 通知图层进行关闭河流
      } else {
          // 当从不亮到亮
          const params = {
            isShow: true,
            isMajorRiver: null,
            name: '',
          };
          this.$store.commit('mapTools/changeShowRiverList', params);
          if (this.handleClick && this.curCompParam.isChecked) { // 因为只有当前控制按钮是高亮的才需要去让父级处理另外的两个，去掉高亮
              this.handleClick(this.curCompParam);
          }
      }
  }
  private created() {
    this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
    this.updateListAndGeometry();
  }
}
</script>
<style lang="less" scoped>
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.HlypBtnContainer{
  width: 100%;
  height: 100%;
}
</style>
