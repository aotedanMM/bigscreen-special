<template>
  <!-- 历史轨迹播放 -->
  <div>
    <div
      class="play_shrink"
      v-show="!isShow"
      @click="handleShowLengend"
      :style="
        $store.state.panelPositionChangeModule.topToolbarLocation.playShaftLayer
      "
    ></div>
    <div
      class="play_unfold"
      v-show="isShow"
      :style="
        $store.state.panelPositionChangeModule.topToolbarLocation.playShaftLayer
      "
    >
      <div class="legend_title">
        <span>历史轨迹</span>
      </div>
      <span class="legend_closeBtn" @click="handleShowLengend"></span>
      <div class="legend_play">
        <div class="timeSteps">
          <i :class="isPlay ? 'openBtn' : 'closeBtn'" @click="playFn"></i>
          <div class="palyShaftBar">
            <span class="text" :style="{ left: dateStyle + '%' }">{{
              date
            }}</span>
            <el-progress
              :percentage="percentage"
              :stroke-width="15"
              color="#9eff6f"
              :show-text="false"
            ></el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'OnlyPlayShaft',
})
export default class OnlyPlayShaft extends Vue {
  private isShow: any = true;
  private time: any = '';
  private isPlay: boolean = false;
  private activeIndex: number = 0;
  private autoPlay: any = '';
  private timeSteps: any = [];
  private percentage: number = 0; // 当前进度
  private percentageStemps: any = []; // 每个点进度百分比
  private date: string = '';
  private dateStyle: number = -6;
  private historyId: any = '';
  // 更新历史轨迹参数
  @Watch('$store.state.mapTools.showOnlyLayerPlay.param')
  private updateHistoryParam() {
    this.getHistoryRouteData(
      this.$store.state.mapTools.showOnlyLayerPlay.param,
    );
  }
  // 图层图例播放轴显示，单独播放轴隐藏
  @Watch('$store.state.mapTools.showLayerPlay')
  private changeLayerPlayShow(val: boolean) {
    if (val) {
      this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false });
    }
  }
  @Watch('activeIndex')
  private updatePlayDate() {
    this.date = this.percentageStemps[this.activeIndex].value;
    this.dateStyle = this.percentageStemps[this.activeIndex].percentage - 8;
  }
  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'terminalLayer',
    );
    return component;
  }
  // 获取历史轨迹数据
  private getHistoryRouteData(params: any) {
    this.historyId = params.id;
    this.getComponent()
      .getTimeInfo()
      .then((res: any) => {
        if (!res || !res.length) {
          return;
        }
        res.map((item: any, index: number) => {
          const curPercentage = ((index + 1) / res.length) * 100;
          this.percentageStemps.push({
            id: index,
            percentage: curPercentage,
            value: item.datetime,
          });
        });
        this.date = this.percentageStemps[0].value;
      });
  }

  // 点击开始/关闭按钮
  private playFn() {
    this.isPlay = !this.isPlay;
    this.autoPlayFn();
    if (this.activeIndex > 0) {
      this.getComponent().paused();
    }
  }
  // 播放定时器
  private autoPlayFn() {
    if (this.activeIndex === 0) {
      this.percentage = this.percentageStemps[this.activeIndex].percentage;
      this.autoPlay = setInterval(() => {
        // 暂停
        if (!this.isPlay) {
          return;
        }
        this.activeIndex++;
        if (this.activeIndex > this.percentageStemps.length - 1) {
          this.activeIndex = 0;
          this.percentage = 0;
          clearInterval(this.autoPlay);
          this.isPlay = false;
        } else {
          this.percentage = this.percentageStemps[this.activeIndex].percentage;
        }
      }, 300);
      this.getComponent().showHistoryTrack({ userId: this.historyId });
    }
  }
  // 清除定时器以及恢复默认值
  private clearPlay(): void {
    if (this.autoPlay) {
      clearInterval(this.autoPlay);
    }
    this.isPlay = false;
    this.activeIndex = 0;
    this.percentage = 0;
    this.getComponent().clearHistoryLayer();
  }
  private created(): void {
    this.updateHistoryParam();
  }
  // 页面销毁
  private destroyed() {
    this.clearPlay();
  }
  // 播放收起展开
  private handleShowLengend() {
    this.isShow = !this.isShow;
  }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../assets/img/gisModule/legendPlanel';
.play_unfold {
  color: #fff;
  width: 1000px;
  height: 180px;
  z-index: 1000;
  bottom: 55px;
  position: absolute;
  background: url('@{imgPath}/legendbg.png') no-repeat 0 0;
  background-size: 100% 100%;
  .legend_title {
    color: #67e1fb;
    width: 220px;
    height: 58px;
    line-height: 58px;
    font-size: 24px;
    text-align: center;
    background: url('@{imgPath}/legend_title.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: -18px;
    left: 14px;
  }
  .legend_closeBtn {
    width: 55px;
    height: 32px;
    cursor: pointer;
    background: url('@{imgPath}/legendhide.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    right: 20px;
    top: -5px;
  }
  .legend_play {
    height: 100%;
    box-sizing: border-box;
    padding: 30px 60px 15px 45px;
    .legend_palyer {
      width: 40px;
      height: 20px;
      background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
    .timeSteps {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 65px;
      .closeBtn {
        display: inline-block;
        width: 65px;
        height: 60px;
        background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .openBtn {
        display: inline-block;
        width: 65px;
        height: 60px;
        background: url('@{imgPath}/legend_stop.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .palyShaftBar {
        position: relative;
        flex: 1;
        .el-progress {
          flex: 1;
        }
        .text {
          position: absolute;
          left: -6%;
          bottom: 30px;
          display: inline-block;
          width: 115px;
          text-align: center;
          color: #9eff6f;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
  }
}
.play_shrink {
  width: 63px;
  height: 63px;
  cursor: pointer;
  background-image: url('@{imgPath}/legend_modelplay.png');
  background-size: contain;
  position: absolute;
  right: 600px;
  bottom: 51px;
  z-index: 3;
  &:hover {
    background-image: url('@{imgPath}/legend_modelplay_hover.png');
  }
}
</style>
