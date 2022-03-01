<template>
  <div class="InfluenceCircleContainer">
    <!-- 这里之所以在写一个div就是为以后做扩展，直接挂在根节点下， -->
      <div  class="nameLayout"
            @click.stop="clickNameBtn(curCompParam.checked)">
        <slot name="styleContainer"
            :item="JSON.parse(JSON.stringify(curCompParam))"></slot>
      </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
@Component({
    name: 'InfluenceCircle',
})
export default class InfluenceCircle extends Vue  {
  @Prop() private compParam: any;
  private curCompParam: any = {};
  private influenceOver = false;

    // 监听 当前正在研判的类型，是全国还是河流、行政区划、缓冲区、搜索缓冲区
    @Watch('$store.state.dataFilterControl.zhypGeoType')
    private handleZhypGeoTypeUpdated(val: any, oldVal: any) {
        val = val || {};
        oldVal = oldVal || {};
        if (val.key === oldVal.key) { // 虽然引用地址变了，但是真实的值没有改变
          return ;
        }
        // 现在目前只用处理旧的为jyqYp,但是新的为其他研判，要清除地图上的圈
        if (val.key === 'jyqYp') {
          return ;
        } else if ( val.key === 'ldqYp') {
          this.curCompParam.checked = false;
        } else {
          this.getComponent_Influence().unload(0);
          this.getComponent_Pop().unload(0);
          this.curCompParam.checked = false;
          return ;
        }
    }

  private clickNameBtn(checkedState: any) {
    // this.curCompParam.checked = !checkedState;
    // this.getComponent_Influence().load(0);
    if (!checkedState) {
      window.setTimeout(this.drawInfluence, 100);
      // this.drawInfluence();
    } else {
      this.cleanInfluence();
    }
  }

  // 经验圈发生改变，包括从常态进入处置态
  // res.eventInfo = {}
  // res.type 0为经验圈，1为烈度圈
  private handleRangesRefresh(res: any) {
    // 进入经验圈
    if (res && res.type === 0 ) {
      this.drawInfluence();
    }
  }

  private initListener() {
    // influence-ready先暂时不用，因为influence-ready和ranges-refresh是同时触发的，且ranges-refresh还多了一个type字段
    // this.messsageBus.on('influence-ready', this.handleInfuenceChange);
    this.messsageBus.off('ranges-refresh', this.handleRangesRefresh);
    this.messsageBus.on('ranges-refresh', this.handleRangesRefresh);
  }

  private removeListener() {
    // this.messsageBus.off('influence-ready', this.handleInfuenceChange);
    // this.messsageBus.off('model-executed');
    this.messsageBus.off('ranges-refresh', this.handleRangesRefresh);
  }

  private getComponent_Influence() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('influence');
    return component;
  }
 private getComponent_Pop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('disasterJudgePop');
    return component;
  }
  // 在地图上绘制经验圈
  private drawInfluence() {
    // 清空gis数据，切换事件态回时，ranges（经验圈）还原
    this.$ioc.resolve('eventInfo').setCurrentStatus(1);
    this.getComponent_Influence().load(0); // 必选先画圈
    this.getComponent_Pop().load(0);
    this.$store.commit('mapTools/changeNearbyQueryVisible', false);
    this.messsageBus.emit('zhypClosedHlyp'); // 通知图层进行关闭河流
    this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
    // this.messsageBus.emit("InfluenceCircleShow", false); // 关闭互斥的烈度圈
    this.curCompParam.checked = true;
    const tmpParam = {
        ranges: this.$ioc.resolve('eventInfo').getRanges(),
        type: 0,
      };
    // 拿出当前affectRanges找那个的数组的最后一个用来做研判用
    const selectedIndex = tmpParam.ranges.length - 1; // 当前选中的经验圈的数组的下标
    const selectedRange = tmpParam.ranges[selectedIndex];
    // 往DataFilterControl.ts 的geometry中存放数据
    const geoStrObj = {
      filter: {
        districtCode: '', // "370686"
        geometry: JSON.stringify(selectedRange.geometry),
      },
      zhypGeoType: {
        key: 'jyqYp',
        value: {
          indexArr: [selectedIndex],
          rangeArr: [JSON.parse(JSON.stringify(selectedRange))],
          // affectRanges:
        },
      },
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
  }

  // 取消地图上绘制的经验圈
  private cleanInfluence() {
    // 清空gis数据，事件态切换回常态是，ranges（经验圈）清空
    this.$ioc.resolve('eventInfo').setCurrentStatus(0);
    this.curCompParam.checked = false;
    this.getComponent_Influence().unload(0);
    this.getComponent_Pop().unload(0);
    const geoStrObj = {
      filter: {
        districtCode: '', // "370686"
        geometry: '',
      },
      zhypGeoType: {},
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
    // if (this.$store.state.dataFilterControl.zhypGeoType && this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp') {
    //   this.initVuexFilter();
    // }
  }
  private created() {
    this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
     // 烈度圈点击后，取消经验圈选中状态，互斥
    this.messsageBus.on('InfluenceCircleShow', (isShow: boolean) => {
      this.curCompParam.checked = false;
    });
  }

  private mounted() {
    // 这些方法放在monted中，是因为，在事件变换的时候，这个组件会被销毁一次，但是，beforedestroy会在created后执行
    this.initListener();
    this.clickNameBtn(false);

    // 经验圈触发设置的时候，也需要打开经验圈
    this.messsageBus.on('ExperienceInCircleSetting', () => {
      this.clickNameBtn(false);
    });
  }

  private beforeDestroy() {
    // 这句话执行的时机应该是，当前的key为hcqyp
    if (this.$store.state.dataFilterControl.zhypGeoType && this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
      this.cleanInfluence();
    }
  }
}
</script>
<style lang="less" scoped>
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.InfluenceCircleContainer{
  width: 100%;
  height: 100%;
}
</style>
