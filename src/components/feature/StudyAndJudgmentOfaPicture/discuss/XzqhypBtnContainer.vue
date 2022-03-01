<template>
  <div class="XzqhypBtnContainer">
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
@Component({
    name: 'XzqhypBtnContainer',
})
export default class XzqhypBtnContainer extends Vue  {
  @Prop() private compParam: any;
  @Prop() private handleClick?: any; // 父组件处理按钮点击方法

  private curCompParam: any = {};

  // 父组件传过来的参数，主要是处理，别的兄弟组件被点击的时候，这里要进行相应的显隐操作
  @Watch('compParam')
  private updateCompParam(val: any, oldVal?: any) {
    // 这个目前的使用场景1，自己本身是亮的，但是此时点击了兄弟按钮，要从亮到不亮
    // 这个目前的使用场景2，自己本身是不亮的，但是通过工具条等把行政区划点出来了，此时点击了缓冲区研判，要把工具条点出来的弹窗给灭掉
    if ((val.isChecked !== oldVal.isChecked)
        &&
        (val.isChecked !== this.curCompParam.isChecked)) {
      this.curCompParam = JSON.parse(JSON.stringify(val));
      this.messsageBus.emit('CitySelectShow', this.curCompParam.isChecked);
    }
  }

  @Watch('$store.state.mapTools.citySelectVisible')
  private updateCitySelectVisible(val: any) {
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
    if (val.key === oldVal.key) { // 虽然引用地址变了，但是真实的值没有改变
      return ;
    }
    const isCheckedKey = val && val.key && (val.key === this.curCompParam.key);
    // 旧的为行政区划、新的不为行政区划，则只要取消高亮就可以了
    if ( oldVal && oldVal.key && (oldVal.key === this.curCompParam.key) && (!isCheckedKey) ) {
      this.curCompParam.isChecked = false;
    } else if (isCheckedKey) { // 需要高亮
      this.curCompParam.isChecked = true;
    }
  }

  // 点击按钮,这里通过主动点击控制高亮与不亮，和弹窗的显隐
  private clickNameBtn(curChecked: boolean) {
      this.curCompParam.isChecked = !curChecked;
      this.messsageBus.emit('CitySelectShow', this.curCompParam.isChecked);
      // 当为选中的时候才会进行触发
      if (this.handleClick && this.curCompParam.isChecked) {
          this.handleClick(this.curCompParam);
      }
  }

  // 判断当前是否需要高亮
  private getDefaultCheckedState() {
    // 其实这个按钮的高亮情况只有一种，就是主动点击（需求说的）
    // 在组件初始化的时候，是不用关心和父级和同级兄弟按钮之间的关系的
    // 可以使得这个按钮高亮的情况有，行政区划面板出现
    // zhypGeoType.key === xzqhyp
    const xzqhmbIsShow = this.$store.state.mapTools.citySelectVisible; // 行政区划面板是否显示
    const val = this.$store.state.dataFilterControl.zhypGeoType;
    const isCheckedKey = val && val.key && (val.key === this.curCompParam.key); // 当前地图上是否有行政区划的研判
    if (isCheckedKey && xzqhmbIsShow) { // 表示处于行政区划研判研判中
      this.curCompParam.isChecked = true;
    }
  }

  private created() {
    this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
    this.getDefaultCheckedState();
    // this.updateCitySelectVisible(this.$store.state.mapTools.citySelectVisible);
  }
}
</script>
<style lang="less" scoped>
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.XzqhypBtnContainer{
  width: 100%;
  height: 100%;
}
</style>
