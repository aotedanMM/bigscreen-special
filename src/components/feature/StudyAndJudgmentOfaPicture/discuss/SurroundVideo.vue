<template>
  <div class="MonitorWarningContainer">
    <div class="tempRight-title  f-tit-h2" @click="isShowOpenFn">
      <span
        :class="curcontList.isChecked ? 'itemName-active' : ''"
        @click="addPoint(curcontList)"
        >{{ curcontList.title }}</span
      >
      <span class="tempRight-total" style="right:4px">
        <span
          class="f-number"
          :style="curcontList.sum>0?'':'padding:0 10px;'"
          :class="curcontList.sum === 0 ? 'gray' : ''"
        >
          {{ curcontList.sum }}</span
        >
       <i class="instake_cont" @click="tabClick(curcontList)" v-show="curcontList.sum>0"></i>
        </span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { monitorWarningServer } from '@/api/feature/monitorwarning/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { videoSituationServer } from '@/api/feature/monitorwarning/installServer';
@Component({
  name: 'SurroundVideo',
  components: {},
})
export default class SurroundVideo extends Vue {
  @Prop() private defaultExpand: any;
  // 选中的视频数据
  private checkList: any = [];
  // 点击地图时存储的数据
  private mapId: any = [];
  private curcontList: any = {
    title: '周边视频',
    sum: 0,
    isChecked: false,
    component: 'SurroundVideoList',
  };
  private currentTab: any;

  private geoJsonData: any;
  private opts: any = {
    districtCode: '',
  };
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  // 列表展开收起
  private isShowOpenFn() {
    // this.defaultExpand = !this.defaultExpand;
  }

  @Watch('$store.state.dataFilterControl.filter')
  private changeGeometry() {
    this.curcontList.isChecked = false;
    // this.updataStatistics();
    this.opts.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;

    if (this.$store.state.dataFilterControl.filter.geometry) {
      this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
      this.getSum();
    } else {
      this.getSum();
      this.curcontList.isChecked = false;
    }
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent('videoLayer');
    return component;
  }

  // 列表文字点击
  private addPoint(item: any) {
    this.messsageBus.emit('closePawn', true); // 关闭在线单兵
    this.messsageBus.emit('GisonlinePawn', 'onlinePawn', true); // 关闭在线单兵-高亮
    this.messsageBus.emit('closeVideoMonitorPop', false); // 关闭视频监控
    item.isChecked = !item.isChecked;
    if (item.isChecked === true) {
      const obj: any = {
        keyWord: '',
        districtCode:
          this.$store.state.dataFilterControl.filter.districtCode === '370600'
            ? ''
            : this.$store.state.dataFilterControl.filter.districtCode,
        type: '',
      };
      if (
        this.$store.state.dataFilterControl.filter.geometry ||
        this.$store.state.dataFilterControl.filter.geometry === ''
      ) {
        obj.geometry = this.$store.state.dataFilterControl.filter.geometry;
      }
      this.getComponent().load();
      setTimeout(() => {
        this.getComponent().addResource(obj);
      }, 1000);
    } else if (item.isChecked === false) {
      this.getComponent().unload();
      this.getComponent().removeResource();
    }
  }
  // 列表数字点击跳转
  private tabClick(item: any) {
    this.messsageBus.emit('closePawn', true); // 关闭在线单兵
    this.messsageBus.emit('GisonlinePawn', 'onlinePawn', true); // 关闭在线单兵-高亮
    this.messsageBus.emit('closeVideoMonitorPop', false);
    this.messsageBus.emit('moreDetails', item);
    this.messsageBus.emit('showRain', item);
    this.currentTab = item.component;
  }
  // 求和
  private sum(arr: any) {
    var s = 0;
    arr.forEach(function(val: any, idx: any, arr2: any) {
      s += val;
    }, 0);
    return s;
  }

  private updataStatistics() {
    this.getComponent().unload();
    // const obj = {
    //   geometry: !this.$store.state.eventPushStore.eventLocation.geometry
    //     ? ''
    //     : this.$store.state.eventPushStore.eventLocation.geometry,
    // };
  }
  // 统计数值
  private async getSum() {
    // this.getComponent().unload();
    this.opts.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;

    if (
      this.$store.state.dataFilterControl.filter.geometry ||
      this.$store.state.dataFilterControl.filter.geometry === ''
    ) {
      this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    const res: any = await videoSituationServer.getVideoStatisticsNew(
      this.opts,
    );
    const totalNum = res.data.map((item: any) => {
      return item.value;
    });
    this.curcontList.sum = this.sum(totalNum);
  }

  private created() {
    // this.getSum();
    this.changeGeometry();
  }
  private mounted() {

    this.getComponent().on('VideoLayer_popup', this.showVideoPlayer, this);
    const that = this;
    // 监听地图弹框视频组件点击删除同步信息
    this.messsageBus.on('delectList', (data: any) => {
      // 删去数据
      that.checkList.forEach((key: any, index: any) => {
        if (key.id === data.id) {
          that.checkList.splice(index, 1);
          // Array
          this.mapId.splice(this.mapId.indexOf(data.id), 1);
        }
      });
    });
    // 弹窗关闭清空数据
    this.messsageBus.on('closeVideoMapPop', (data: any) => {
      that.checkList = [];
      this.mapId = [];
      this.getComponent().removeHighlight();
    });
  }

  // 地图点击事件
  private showVideoPlayer(event: any) {
    if (!this.mapId.includes(event.data.id)) {
      this.mapId.push(event.data.id);
      this.searchVideoUrl(event.data);
    } else {
      this.messsageBus.emit('minimizeVideoMapPopShow', true); // 弹出视频播放最小化按钮
      this.getComponent().removeHighlight();
    }
  }
  // 根据id查视频
  private searchVideoUrl(item: any) {
    if (this.checkList.length > 3) {
      this.$message({
        message: '最多只能播放四路视频，请关闭一路视频后再次点击播放',
        type: 'warning',
        duration: 1000,
      });
      this.mapId.splice(this.mapId.indexOf(item.id), 1);
      this.getComponent().removeHighlight();
      return;
    }
    if (item.x !== null && item.y !== null) {
      this.getComponent().locatResource('id', item.id);
    }
    this.checkList.push(item);
    this.messsageBus.emit('showVideoMapPop', this.checkList);
    this.messsageBus.emit('minimizeVideoMapPopShow', true); // 最小化弹窗按钮隐藏
  }

  private beforeDestroy() {
    this.getComponent().off('VideoLayer_popup', this.showVideoPlayer, this);
    if (!this.$store.state.configModel.videoShow) {
        this.getComponent().removeResource();
    }
    this.messsageBus.emit('closeVideoMapPop');
  }
}
</script>
<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@imgUrl: '../../../../assets/img/discuss/';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.tempRight-cont {
  .tempRight-itemNum1 {
    display: flex;
    justify-content: flex-end;
    .text-unit {
      color: #fff000;
      font-family: Impact;
      margin-right: 10px;
    }
    .text-number {
      color: #3ef7fe;
      font-family: Impact;
      padding-left: 15px;
    }
  }
}
.instake_cont {
  margin-left: 14px;
    display: inline-block;
    cursor: pointer;
    width: 32px;
    height: 32px;
    background: url("../../../../assets/img/discuss/icon_cont.png") 0 50% no-repeat;

    &:hover {
        background: url("../../../../assets/img/discuss/icon_cont_hover.png") 0 50% no-repeat;
    }
}
.MonitorWarningContainer {
  width: 104%;
  padding-bottom: 20px;
  .teamIcon {
    background: url('@{imgUrl}moniter.png') no-repeat;
    &-river {
      background-position: 2px 8px;
    }
    &-rain {
      background-position: 2px -52px;
    }
    &-wind {
      background-position: 2px -111px;
    }
  }
}
</style>
