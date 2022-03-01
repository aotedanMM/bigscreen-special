<template>
  <div class="MonitorWarningContainer">
    <div class="tempRight-title f-tit-h2" @click="isShowOpenFn">
      <span
        :class="{
          'itemName-active': curcontList.clickKey && curcontList.active,
        }"
      >{{ curcontList.title }}</span>
      <span class="tempRight-total" style="right:45px">
        <span class="f-number">{{ curcontList.sum + (historyEarthquake.num || 0) }}</span>
        <span class="unit-text" v-show="unit">{{unit}}</span>
      </span>
      <i
        :class="
          curcontList.showExpand
            ? 'tempRight-switch'
            : 'tempRight-switch tempRight-switch-reverse'
        "
      ></i>
    </div>
    <div v-if="curcontList.showExpand">
      <ul class="team-ul">
        <li
          v-for="(item, index) in tabList"
          :key="index"
          class="tempRight-itemTitle f-txt-com"
          :class="item.num === 0 ? 'gray' : ''"
        >
          <div class="tempRight-icon_bg icon_bg_normal" :class="item.icon_bg">
            <i class="teamIcon" :class="'teamIcon-' + item.type"></i>
          </div>
          <div
            class="tempRight-itemName"
            :class="item.isChecked ? 'itemName-active' : ''"
            @click="addPoint(item)"
          >
            <span class="f-txt-com">{{ item.label }}</span>
          </div>
          <div class="tempRight-itemNum">
            <em class="f-number text-number" >{{ item.num || 0 }}</em>
            <i class="text-unit">{{ item.unit }}</i>
            <i class="instake_cont" @click="tabClick(item)"></i>
          </div>
        </li>
        <!--  历史地震读取mongo配置，单独抽离出来的一行 -->
        <li
          v-if="$store.state.configModel.config.type === 1"
          class="tempRight-itemTitle f-txt-com"
          :class="historyEarthquake.num === 0 ? 'gray' : ''"
        >
          <div class="tempRight-icon_bg icon_bg_normal">
            <i class="teamIcon" :class="'teamIcon-'+historyEarthquake.bg"></i>
          </div>
          <div
            :class="{'tempRight-itemName':true , 'itemName-active':historyEarthquake.active}"
            @click="addMapdot(historyEarthquake)"
          >
            <span class="f-txt-com" :title="historyEarthquake.name">{{historyEarthquake.name}}</span>
          </div>
          <div
            class="tempRight-itemNum"
            v-if="historyEarthquake.team===undefined"
          >
            <em class="f-number text-number">{{historyEarthquake.num}}</em>
            <i class="text-unit">{{historyEarthquake.danwei?historyEarthquake.danwei:''}}</i>
            <i class="instake_cont"  @click="changeKuang(historyEarthquake)"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { monitorWarningServer } from '@/api/feature/monitorwarning/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { clearPeripheral } from '@/views/common/nvaUtil/nvaUtil';

@Component({
  name: 'MonitorWarningContainer',
  components: {},
})
export default class MonitorWarningContainer extends Vue {
  @Prop() private defaultExpand: any;
  @Prop() private unit: any;
  @Prop() private historyEarthquakeNum: any;
  private curcontList: any = {
    title: '监测站点',
    sum: 0,
    showExpand: true,
  };

  // 复制监测预警其他走mongo数据的配置
  private historyEarthquake = {
    title: '地震监测台站',
    name: '地震监测台站',
    bg: 'dzjct',
    num: 0,
    danwei: '处',
    key: 'MON_MONITORSTATION_EARTHQUAKE',
    commonKey: 'hiddendisastersites',
    clickKey: 'hiddendisastersites',
    active: false,
  };

  private tabList: any = [
    {
      label: '河流监测站',
      num: 0,
      unit: '处',
      component: 'RiverMonitor',
      key: 'riverNum',
      isChecked: false,
      type: 'river',
      icon_bg: '',
      icon: '',
      gray: false,
    },
    {
      label: '雨情监测站',
      num: 0,
      unit: '处',
      component: 'RainMonitor',
      key: 'rainNum',
      isChecked: false,
      type: 'rain',
      icon_bg: '',
      icon: '',
      gray: false,
    },
    // {
    //   label: '风情监测站',
    //   num: 0,
    //   unit: '处',
    //   component: 'WindMonitor',
    //   key: 'windNum',
    //   isChecked: false,
    //   type: 'wind',
    //   icon_bg: '',
    //   icon: '',
    //   gray: false,
    // },
  ];
  private currentTab: any;

  private geoJsonData: any;
  private districtCode: any;
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  // 列表展开收起
  private isShowOpenFn() {
    this.curcontList.showExpand = !this.curcontList.showExpand;
  }

  // 文字点击
  private addMapdot(item: any) {
    if (item.noneParam === true) {
      // 没有配置参数，但是又要显示的那种
      return;
    }
    if (item.num === 0 || item.sum === 0) {
      return;
    }
    item.active = !item.active;
    this.$emit('dealKey', item);
    this.$store.commit('resetAllDefaultData');
    clearPeripheral(this);
  }
  // 数字点击
  private changeKuang(item: any) {
    // 清除点文字出的点位 + 高亮
    this.$emit('clearPoint');
    // 列表+点位
    if (!item.clickKey) {
      return;
    } else {
      if (item.num === 0 || item.sum === 0) {
        return;
      }
      this.$emit('changeKuang', item);
      this.$store.commit('resetAllDefaultData');
      clearPeripheral(this);
    }
  }

  @Watch('historyEarthquakeNum')
  private updatehistoryEarthquake() {
    this.historyEarthquake.num = this.historyEarthquakeNum || 0;
  }

  // 数据过滤条件发生更改
  @Watch('$store.state.dataFilterControl.filter')
  private changeGeometry() {
    this.updataStatistics();
    this.geoJsonData = this.$store.state.dataFilterControl.filter.geometry;
    this.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '130400'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;
  }
  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'rainMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 列表文字点击
  private addPoint(item: any) {
    item.isChecked = !item.isChecked;
    if (item.isChecked === true) {
      switch (item.key) {
        case 'rainNum':
          this.getComponent().addResource_Rain(
            { geometry: this.geoJsonData, districtCode: this.districtCode },
            false,
          );
          break;
        case 'windNum':
          this.getComponent().addResource_Wind(
            { geometry: this.geoJsonData, districtCode: this.districtCode },
            false,
          );
          break;
        case 'riverNum':
          this.getComponent().addResource_River(
            { geometry: this.geoJsonData, districtCode: this.districtCode },
            false,
          );
          break;
      }
    } else if (item.isChecked === false) {
      this.getComponent().removeResource(item.type);
    }
  }
  // 列表数字点击跳转
  private tabClick(item: any) {
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
    this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().unload();
    this.tabList.map((item: any) => {
      item.isChecked = false;
    });
    const obj: any = {
      districtCode:
        this.$store.state.dataFilterControl.filter.districtCode === '130400'
          ? ''
          : this.$store.state.dataFilterControl.filter.districtCode,
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      obj.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    // 统计数值
    monitorWarningServer.getStatistics(obj).then((result: any) => {
      Object.keys(result.data).map((key: any) => {
        this.tabList.map((item: any) => {
          if (key === item.key) {
            item.num = result.data[key];
            if (item.num === 0) {
              item.gray = true;
            }
          }
        });
      });
      const totalNum = this.tabList.map((item: any) => {
        return item.num;
      });
      this.curcontList.sum = this.sum(totalNum);
    });
  }

  private created() {
    this.curcontList.showExpand = this.defaultExpand;
    this.changeGeometry();
    // this.tabList.map((item: any) => {
    //   if (item.num === 0) {
    //     item.gray = true;
    //   }
    // });
  }
  private mounted() {
    this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().load();
  }

  private beforeDestroy() {
    //  清除风情图层
    this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().unload();
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
.tempRight-itemNum{
    display: flex;
    align-items: center;
    padding-left: 28px;
    .text-number {
      cursor: none!important;
      right: 76px!important;
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
  .instake_cont {
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
  margin-top: 16px;
  .unit-text{
    color: #bacfdc!important;
    padding-right: 5px;
    padding-left: 15px;
    float: right;
    font-style: normal;
  }
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
    &-dzjct{
      background-position: -3px -1px;
      background-image: url(data:image/png;base64,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)!important
}
  }
}
</style>
