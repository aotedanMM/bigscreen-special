<template>
  <div class="IntensityCircleContainer" v-show="modelOver">
    <!-- 这里之所以在写一个div就是为以后做扩展，直接挂在根节点下， -->
    <div class="nameLayout" @click.stop="clickNameBtn(curCompParam.checked)">
      <slot
        name="styleContainer"
        :item="JSON.parse(JSON.stringify(curCompParam))"
      ></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'IntensityCircle',
})
export default class IntensityCircle extends Vue {
  @Prop() private compParam: any;
  private curCompParam: any = {};
  private modelOver: any = false; // 当地震模型没有计算完成后，是不显示的

  // 监听 当前正在研判的类型，是全国还是河流、行政区划、缓冲区、搜索缓冲区
  @Watch('$store.state.dataFilterControl.zhypGeoType')
  private handleZhypGeoTypeUpdated(val: any, oldVal: any) {
    val = val || {};
    oldVal = oldVal || {};
    if (val.key === oldVal.key) {
      // 虽然引用地址变了，但是真实的值没有改变
      return;
    }
    // 现在目前只用处理旧的为ldqYp,但是新的为其他研判，要清除地图上的圈
    if (val.key === 'ldqYp') {
      return;
    } else if (val.key === 'jyqYp') {
      this.curCompParam.checked = false;
    } else {
      this.getComponent_Influence().unload(1);
      this.curCompParam.checked = false;
      return;
    }
  }

  private clickNameBtn(checkedState: any) {
    if (!checkedState) {
      this.drawIntensity();
    } else {
      this.cleanIntensity();
    }
  }
  private handleModelExecuted(res: any) {
    this.modelOver = true;
  }

  // 烈度圈发生改变，包括从常态进入处置态
  // res.eventInfo = {}
  // res.type 0为经验圈，1为烈度圈
  private handleRangesReported(res: any) {
    // 进入烈度圈
    this.drawIntensity();
  }

  private initListener() {
    this.messsageBus.on('model-executed', this.handleModelExecuted);
    this.messsageBus.on('ranges-reported', this.handleRangesReported);
  }

  private removeListener() {
    this.messsageBus.off('model-executed', this.handleModelExecuted);
    // this.messsageBus.off('model-executed');
    this.messsageBus.off('ranges-reported', this.handleRangesReported);
  }

  private getComponent_Influence() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('influence');
    return component;
  }
  private getComponent_Pop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgePop',
    );
    return component;
  }
  // 在地图上绘制烈度圈，必须先画圈在查数据
  private drawIntensity() {
    this.getComponent_Influence().load(1); // 必选先画圈
    this.getComponent_Pop().load(0);
    this.$store.commit('mapTools/changeNearbyQueryVisible', false);
    this.messsageBus.emit('zhypClosedHlyp'); // 通知图层进行关闭河流
    this.messsageBus.emit('CitySelectShow', false); // 关闭行政区划
    this.messsageBus.emit('InfluenceCircleShow', false); // 关闭互斥的经验圈
    this.curCompParam.checked = true;
    // 拿出当前affectRanges找那个的数组的最后一个用来做研判用
    const geometryList: any = [];
    const selectedIndexArr: any = [];
    const tmpParam = {
      // 查回来的烈度圈是6、7这样的顺序，但是要求逆序展示，所以要把数组翻转下
      ranges: this.$ioc.resolve('eventInfo').getRanges(),
      type: 1,
    };
    tmpParam.ranges.forEach((range: any, index: any) => {
      geometryList.push(range.geometry);
      selectedIndexArr.push(index);
    });
    const unionGeometry = this.getComponent_Influence().unionGeometry(
      geometryList,
    );
    // 往DataFilterControl.ts 的geometry中存放数据
    const geoStrObj = {
      filter: {
        districtCode: '', // '370686'
        geometry: JSON.stringify(unionGeometry),
      },
      zhypGeoType: {
        key: 'ldqYp',
        value: {
          indexArr: selectedIndexArr,
          rangeArr: tmpParam.ranges,
          // affectRanges:
        },
      },
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
  }

  // 取消地图上绘制的烈度圈
  private cleanIntensity() {
    this.curCompParam.checked = false;
    this.getComponent_Influence().unload();
    const geoStrObj = {
      filter: {
        districtCode: '', // '370686'
        geometry: '',
      },
      zhypGeoType: {},
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
  }
  private created() {
    this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
    this.initListener();
    // 经验圈点击后，取消烈度圈选中状态，互斥
    this.messsageBus.on('InfluenceCircleShow', (isShow: boolean) => {
      this.curCompParam.checked = false;
    });
  }
  private beforeDestroy() {
    // 这句话执行的时机应该是，当前的key为hcqyp
    if (
      this.$store.state.dataFilterControl.zhypGeoType &&
      this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
    ) {
      this.cleanIntensity();
    }
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.InfluenceCircleContainer {
  width: 100%;
  height: 100%;
}
</style>
