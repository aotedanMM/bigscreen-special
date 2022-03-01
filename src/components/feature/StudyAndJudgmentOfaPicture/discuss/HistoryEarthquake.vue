<template>
  <div class="HistoryEarthquakeContainer">
    <div class="tempRight-title f-tit-h2" @click="isShowOpenFn">
      <span
        :class="curcontList.active ? 'itemName-active' : ''"
        @click="addPoint(curcontList)"
      >{{ curcontList.title }}</span>
      <span class="tempRight-total" style="right:4px">
        <span
          class="f-number"
          :style="curcontList.sum>0?'':'padding:0 10px;'"
          @click="tabClick(curcontList)"
          :class="curcontList.sum === 0 ? 'gray' : ''"
        >{{ curcontList.sum }}</span>
        <i class="instake_cont" @click="tabClick(curcontList)" v-show="curcontList.sum>0"></i>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { historicalEarthquakeServer } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
  name: 'HistoryEarthquake',
  components: {},
})
export default class HistoryEarthquake extends Vue {
  @Prop() private defaultExpand: any;
  // 选中的历史地震数据
  private checkList: any = [];
  // 点击地图时存储的数据
  private mapId: any = [];
  private curcontList: any = {
    title: '历史地震',
    name: '历史地震',
    bg: 'groundCollapse',
    num: 0,
    danwei: '处',
    key: 'EAR_HISTORY',
    commonKey: 'EAR_HISTORY',
    clickKey: 'EAR_HISTORY',
    active: false,
    sum: 0,
    component: 'HistoryEarthquakeList',
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
    this.curcontList.active = false;
    this.getComponentEarthQuake().clearAll();
    this.opts.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;

    if (this.$store.state.dataFilterControl.filter.geometry) {
      this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
      this.getSum();
    } else {
      this.getSum();
      this.curcontList.active = false;
    }
  }

  // 地图定点回调
  private popupData(event: any) {
    event.type = 'hisPointspopup';
    event.containerId = event.id;
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }

  //  获取地图功能
  private getComponentEarthQuake() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('historyEarthQuake');
    return component;
  }

  // 列表文字点击
  private async addPoint(item: any) {
    this.opts.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode || '370600';

    if (
      this.$store.state.dataFilterControl.filter.geometry ||
      this.$store.state.dataFilterControl.filter.geometry === ''
    ) {
      this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    const res: any = await historicalEarthquakeServer.getEarthquakeList(
      this.opts,
    );

    // 点击文字地图上点
    if (item.sum === 0) {
      return;
    }
    item.active = !item.active;
    if (item.active === true) {
      // 地图上点
      this.getComponentEarthQuake().addResource(res.data);
    } else if (item.active === false) {
      // 地图清除点位
      this.getComponentEarthQuake().clearAll();
    }
  }
  // 列表数字点击跳转
  private tabClick(item: any) {
    this.currentTab = item.component;
    this.messsageBus.emit('showHistoryEarthquake', item);
  }

  // 统计数值
  private async getSum() {
    // 烟台市370600  山东省的370000
    this.opts.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode || '370600';

    if (
      this.$store.state.dataFilterControl.filter.geometry ||
      this.$store.state.dataFilterControl.filter.geometry === ''
    ) {
      this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    const res: any = await historicalEarthquakeServer.getEarthquake(this.opts);
    this.curcontList.sum = res.data[0].value;
  }

  private created() {
    // this.getSum();
    this.changeGeometry();
  }
  private mounted() {
    this.getComponentEarthQuake().off('hisPointspopup');
    this.getComponentEarthQuake().on('hisPointspopup', this.popupData);
  }

  private beforeDestroy() {
    // 清除地图点位
    this.getComponentEarthQuake().clearAll();
    this.getComponentEarthQuake().off('hisPointspopup');
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
.instake_cont {
  margin-left: 14px;
    display: inline-block;
    cursor: pointer;
    width: 34px;
    height: 32px;
    background: url("../../../../assets/img/discuss/icon_cont.png") 0 50% no-repeat;

    &:hover {
        background: url("../../../../assets/img/discuss/icon_cont_hover.png") 0 50% no-repeat;
    }
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
.HistoryEarthquakeContainer {
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
  .tempRight-total {
    overflow: hidden;
  }
}
</style>
