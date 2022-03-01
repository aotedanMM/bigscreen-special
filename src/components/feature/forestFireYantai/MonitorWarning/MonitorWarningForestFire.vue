<template>
  <!-- 监测预警常态 -->
  <div>
    <div v-show="!collapsed" class="monitor-warning-panel">
      <!---导航面板--->
      <div class="panelPublicDefault" v-show="!currentTab">
        <ZoomBtn></ZoomBtn>
        <div class="panelPublicDefault_hd">
          <span class="title-panel">监测预警</span>
        </div>
        <!--顶部导航-->
        <div class="monitor-tab">
          <div
            :class="item.class"
            v-for="item in monitorTabs"
            v-bind:key="item.value"
          >
            <span
              class="monitorTab-icon"
              :class="'monitorTab-icon-' + item.icon"
              @click="iconClick(item)"
            >
            </span>
            <div class="monitor-tab_itm_txt" @click="tabClick(item)">
              <span class="title f-tit-h2">{{ item.label }}</span>
              <span class="inner f-txt-small" v-if="item.staType === 'warning'"
                >共
                <b
                  class="f-number txt-warn"
                  :class="{ ytZoomInOn: item.count > 0 }"
                  >{{ item.count }}</b
                >
                处监测站点</span
              >
              <span class="inner f-txt-small" v-if="item.staType === 'fireban'"
                >禁火期区/县
                <b
                  class="f-number txt-warn"
                  :class="{ ytZoomInOn: item.count > 0 }"
                  >{{ item.count }}</b
                >
              </span>
              <span
                class="inner f-txt-small"
                v-if="item.staType === 'firepoint'"
                >共
                <b
                  class="f-number txt-warn"
                  :class="{ ytZoomInOn: item.count > 0 }"
                  >{{ item.count }}</b
                >
                处火点信息
              </span>
              <span
                class="inner f-txt-small"
                v-if="item.staType === 'forewarning'"
                >共
                <b
                  class="f-number txt-warn"
                  :class="{ ytZoomInOn: item.count > 0 }"
                  >{{ item.count }}</b
                >
                处预警信息
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!!currentTab" style="height:100%;">
        <span @click="backCurrentTab" class="panelPublicDefault_toBack"></span>
        <component :is="currentTab" :count="currentCount" :isShowModal='isShowModal'/>
      </div>
    </div>
    <div
      v-show="collapsed"
      class="monitor-warning-btn monitor-warning-btn--open"
      @click="expand"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {
  monitorWarningServer,
  firePointMonitorServer,
} from '@/api/feature/monitorwarning/installServer';
import WaterMonitor from '../../flood/MonitorWarning/WaterMonitor.vue';
import WindMonitor from '../../flood/MonitorWarning/WindMonitor.vue';
import RainMonitor from '../../flood/MonitorWarning/RainMonitor.vue';
import FireBan from './FireBan.vue';
import FirePointMonitor from './FirePointMonitor.vue';
import EnterpriseMonitoring from './EnterpriseMonitoring.vue';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import FireWeatherForewarning from './FireWeatherForewarning.vue';
import { getDateFormat } from '@/util/tools';
import publishObjectPath from '@/util/configRegistry';
import ZoomBtn from '../../flood/ZoomBtn.vue'; // 导入最小化组件
/**
 * 监测预警
 */
@Component({
  name: 'MonitorWarningForestFire',
  components: {
    WaterMonitor,
    WindMonitor,
    RainMonitor,
    FirePointMonitor,
    EnterpriseMonitoring,
    FireBan,
    FireWeatherForewarning,
    ZoomBtn,
  },
  mixins: [MapCommon],
})
export default class MonitorWarningForestFire extends Vue {
  private isShowModal: any = true;  // 区分左右侧进入雨晴时判断条件
  private currentTab: string = '';
  // 选中的图标
  private selectedIcon: any = {};
  private monitorTabs: any = [
    {
      label: '火点信息',
      value: 'FirePointMonitor',
      count: 0,
      icon: 'fire',
      staType: 'firepoint',
      class: {
        'monitor-tab_itm': true,
        'cur': false,
      },
    },
    {
      label: '雨情监测',
      value: 'RainMonitor',
      count: 0,
      icon: 'rain',
      staType: 'warning',
      class: {
        'monitor-tab_itm': true,
         'cur': false,
      },
    },
    // {
    //   label: '风情监测',
    //   value: 'WindMonitor',
    //   count: 0,
    //   icon: 'windy',
    //   staType: 'warning',
    //   class: {
    //     'monitor-tab_itm': true,
    //     'cur': false,
    //   },
    // },
    {
      label: '预警信息',
      value: 'FireWeatherForewarning',
      count: 0,
      icon: 'weatherMessage',
      isWarning: 'WeatherForewarning',
      staType: 'forewarning',
      class: {
        'monitor-tab_itm': true,
        'cur': false,
      },
    },
    {
      label: '企业监测',
      value: 'EnterpriseMonitoring',
      count: 0,
      icon: 'weatherMessage',
      isWarning: 'WeatherForewarning',
      staType: 'forewarning',
      class: {
        'monitor-tab_itm': true,
        'cur': false,
      },
    },
  ];
  private optsData: any = {
    type: [
      {
          code: '11B01',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B03',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B09',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B25',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11D00',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B04',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B56',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B05',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B16',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B21',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B17',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B22',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11A01',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B14',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B19',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B15',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B51',
          level: '红色,橙色,黄色,蓝色',
        },
        {
          code: '11B06',
          level: '红色,橙色,黄色,蓝色',
        },
    ],
    nowPage: 1,
    pageSize: 10,
    startTime: getDateFormat({ last: 'week' }), //  oneDay
    endTime: getDateFormat(),
    districtCode: publishObjectPath.value.district.root,
  };
  private monitorTimer: any = null; // 定时器
  private service: any = '';
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private collapsed: boolean = false;
  private closeAndbackFn() {
    this.messsageBus.emit('closeAndBack', true);
  }
  private setInTervalMethod() {
    // 定时刷新
    this.monitorTimer = setInterval(() => {
      this.initData();
    }, 1000 * 60 * 10);
  }
  // 获取统计数据
  private initData() {
    monitorWarningServer.getWarningStatistics({}).then((result: any) => {
      // console.log(result.data,'result.dataresult.dataresult.dataresult.dataresult.data')
      const data: any = result.data;
      const keyMap: any = {
        FirePointMonitor: 'fireTotalNum',
        WindMonitor: 'windWarningNum',
        RainMonitor: 'rainWarningNum',
        FireWeatherForewarning: 'fireWeatherWarningNum',
      };
      for (const item of this.monitorTabs) {
        const key: any = keyMap[item.value];
        if (data.hasOwnProperty(key)) {
          item.count = data[key] || 0;
        }
      }
    });
  }
  //
  private showLegend(val: any) {
    if (val.visible === true) {
      this.showJsl('RainfallThwartwise');
    } else if (val.visible === false) {
      // this.showJsl('RainStation');
      return;
    }
  }

  // 显示 图例
  private showJsl(val: any) {
    const data = {
      key: val,
      isShow: true,
    };
    this.$store.dispatch('configModel/updateLegendItem', data);
  }

  // 收起
  private collapse() {
    this.collapsed = true;
  }
  // 展开
  private expand() {
    this.collapsed = false;
  }
  // 隐藏 图例
  private hideJsl(value: any) {
    // const data = {
    //   key: value,
    //   isShow: false,
    // };
    // this.$store.dispatch('configModel/updateLegendItem', data);
    this.$store.commit('mapTools/removeSelectedLayer', {
      id: value,
    });
  }

  // 点击返回
  private backCurrentTab() {
    this.currentTab = '';
    this.clearLegend();
    this.addlayerMap();
    this.setInTervalMethod();
    this.initData();
    const params = {
        isShow: false,
        title: '',
      };
    this.$store.commit('mapTools/changeShowFireList', params);
  }
  private addlayerMap() {
    (this as any).resolveMap('map').then((map: any) => {
      // 默认叠加火点信息
      this.addLayer(this.monitorTabs[0]);
    });
  }
  private clearLegend() {
    this.hideJsl('Rainfall');
    this.hideJsl('RainfallThwartwise');
    this.hideJsl('RainStation');
    this.hideJsl('Reservoir');
    this.hideJsl('Riverway');
    this.hideJsl('Wind');
    this.hideJsl('WindThwartwise');
    this.hideJsl('WindMonitoring');
    this.hideJsl('LiftMonitoring');
    this.hideJsl('bigReservoir');
    this.hideJsl('middleReservoir');
    this.hideJsl('smallOneTopReservoir');
    this.hideJsl('smallOneReservoir');
    this.hideJsl('warning');
    this.hideJsl('allReservoir');
    this.hideJsl('normalReservoir');
  }

  private tabClick(item: any) {
    this.currentTab = item.value;
    clearInterval(this.monitorTimer);
    this.removeAllLayers();
  }

  private iconClick(item: any) {
    if (this.selectedIcon[item.value]) {
      this.removeLayer(item);
    } else {
      this.addLayer(item);
    }
  }

  // 添加指定图层
  private addLayer(item: any) {
    if (this.selectedIcon[item.value]) {
      return;
    }
    this.selectedIcon[item.value] = true;
    console.debug(`>>>>>>>叠加${item.label}`);
    switch (item.label) {
      case '火点信息':
        this.getFireListPonit(); // 默认叠加火点信息
        break;
      case '预警信息':
        this.getComponentTwo().addResource(this.optsData);
        break;
      case '风情监测':
        this.getComponent().addResource_Wind();
        break;
      case '雨情监测':
        this.getComponent().addResource_Rain();
        break;
      case '企业监测':
        this.getComponent().addResource_Rain();
        break;
    }
    if (item.label !== '工情监测') {
      this.updateIconStyle();
    }
    // todo
  }

  // 移除指定
  private removeLayer(item: any) {
    if (!this.selectedIcon[item.value]) {
      return;
    }
    delete this.selectedIcon[item.value];
    console.debug(`>>>>>>>移除${item.label}`);
    switch (item.label) {
      case '火点信息':
        this.getComponentFire()._clearAll();
        break;
      case '预警信息':
        this.getComponentTwo().removeResource();
        break;
      case '风情监测':
        this.getComponent().removeResource('wind');
        break;
      case '雨情监测':
        this.getComponent().removeResource('rain');
        break;
    }
    this.updateIconStyle();
    //
    if (item.value === 'RainMonitor') {
      this.hideJsl('RainfallThwartwise');
    }
  }
  // 移除所有
  private removeAllLayers() {
    this.selectedIcon = {};
    console.debug(`>>>>>>>移除所有`);
    this.updateIconStyle();
    // todo
    this.getComponent().removeAll();
    this.hideJsl('RainfallThwartwise');
  }

  private updateIconStyle() {
    for (const item of this.monitorTabs) {
      item.class.cur = !!this.selectedIcon[item.value];
    }
  }

  get currentCount() {
    const temp = this.monitorTabs.find(
      (item: any) => item.value === this.currentTab,
    );
    let count = 0;
    if (temp) {
      count = temp.count;
    }
    return count;
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
      moduleTypeID: event.type + 'Monitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 火点信息地图定点回调
  private popupDataFire(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'FirePointQuery_popup',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 预警地图定点回调
  private popupDataFireWeatherForewarning(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'weatherMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWorkLayer',
    );
    return component;
  }
  // 今日与延续的列表数据接口
  private async getFireListPonit() {
    const res: any = await firePointMonitorServer.getFireListPonit();
    // console.log('列表数据11111',res)
    if (res.status === 200) {
      this.getComponentFire()._showResource('firePointToday', res.data.today);
      // this.getComponentFire()._showResource('firePointToday', res.data.continue);
    }
  }
  //  获取地图功能
  private getComponentFire() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent('ResourceQuery');
    return component;
  }
  //  获取地图功能
  private getComponentTwo() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'weatherWarning',
    );
    return component;
  }
  private created() {
    this.initData();
    this.setInTervalMethod();
  }
  private mounted() {
    this.getComponentFire().on('FirePointQuery_popup', this.popupDataFire, this);
    this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().on('weatherWarningLayer_popup', this.popupDataFireWeatherForewarning, this);
    this.addlayerMap();
    this.getComponent().load();
    this.getComponent().on('RainWindLengend', this.showLegend, this);
  }
  // 离开页面清理地图
  private beforeDestroy() {
    const component = this.getComponent();
    this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    component.unload();
    // this.getComponentFire()._clearAll();
    this.getComponentTwo().removeResource();
    //
    this.removeAllLayers();
    this.clearLegend();
    const params = {
        isShow: false,
        title: '',
      };
    this.$store.commit('mapTools/changeShowFireList', params);
    clearInterval(this.monitorTimer);
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@pictureUrl: '../../../../assets/img/monitorWarning';
/* 放大缩小 */
.ytZoomInOn {
  display: inline-block;
  animation: zoom 2s infinite;

  @keyframes zoom {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.4);
    }

    100% {
      transform: scale(1);
    }
  }
}
.monitor-warning-panel {
  position: absolute;
  width: 440px;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  color: #fff;
  border-bottom: 1px solid #059ece;
}
.monitor-warning-btn {
  width: 32px;
  height: 148px;
  transform: translateY(-100%);
  background: url('@{pictureUrl}/switch_btn.png') no-repeat 0 0;
  z-index: 1000;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-image: url('@{pictureUrl}/switch_btn_bg.png');
  }
}
.monitor-warning-btn--close {
  background-position: 0 0;
  position: absolute;
  top: 50%;
  left: 100%;
}
.monitor-warning-btn--open {
  position: absolute;
  left: 0px;
  top: 50%;
  background-position: -32px 0;
  position: absolute;
  top: 50%;
  left: 0;
}
.monitor-tab {
  &_itm {
    color: #fff;
    cursor: pointer;
    margin: 10px 0;
    background: linear-gradient(
        to right,
        transparent 0%,
        rgba(116, 239, 252, 0.1) 50%,
        transparent 100%
      ),
      url('../../../../assets/img/monitorWarning/monitorWarn_bg.png') no-repeat
        50px 50%;
    padding: 15px 5px 15px 120px;
    &.cur,
    &:hover {
      background: linear-gradient(
          to right,
          transparent 0%,
          rgba(209, 215, 67, 0.1) 50%,
          transparent 100%
        ),
        url('../../../../assets/img/monitorWarning/monitorWarn_bg.png')
          no-repeat 50px 50%;
      .monitorTab-icon {
        background-image: url('../../../../assets/img/monitorWarning/monitorWarn_icon_h.png');
      }
      .monitorTab-icon-weather:hover {
        background: url('@{pictureUrl}/weatherHover.png') -18px 0 !important;
      }
      .monitorTab-icon-weather {
        background: url('@{pictureUrl}/weatherHover.png') -18px 0 !important;
      }
      .monitorTab-icon-weatherMessage:hover {
        background: url('@{pictureUrl}/yjxxhover.png') -18px 0 !important;
      }
      .monitorTab-icon-weatherMessage {
        background: url('@{pictureUrl}/yjxxhover.png') -18px 0 !important;
      }
      .monitorTab-icon-fire:hover {
        background: url('@{pictureUrl}/firehover.png') -18px 0 !important;
      }
      .monitorTab-icon-fire {
        background: url('@{pictureUrl}/firehover.png') -18px 0 !important;
      }
    }
    .txt-warn {
      color: #fff55d;
    }
    &::after {
      clear: both;
      content: '';
      display: block;
    }

    &_txt {
      vertical-align: bottom;
      .title {
        padding-bottom: 5px;
        color: #ffffff;
      }
      .inner {
        color: #bbd0dc;
      }
      span {
        display: block;
      }
    }
  }
}
.monitorTab-icon {
  float: left;
  margin-left: -120px;
  width: 112px;
  height: 92px;
  background: url('@{pictureUrl}/monitorWarn_icon.png') 0 0;
}
/*气象预警*/
.monitorTab-icon-weather {
  background: url('@{pictureUrl}/weather.png') -18px 0;
}
.monitorTab-icon-weatherMessage {
  background: url('@{pictureUrl}/yjxx.png') -18px 0;
}
.monitorTab-icon-fire {
  background: url('@{pictureUrl}/fire.png') -18px 0;
}
/*雨情*/
.monitorTab-icon-rain {
  background-position: 0 0;
}
/*水情*/
.monitorTab-icon-water {
  background-position: 0 -132px;
}
/*风情*/
.monitorTab-icon-windy {
  background-position: 0 -264px;
}
/*工情*/
.monitorTab-icon-working {
  // background-position: 0 -396px;
}
.popup {
  position: absolute;
  top: 150px;
  left: 450px;
  z-index: 1000;
}
</style>
<style lang="less">
@pictureUrl: '../../../../assets/img/monitorWarning';
.pointTip1 {
  cursor: default;
  width: 175px;
  height: 70px;
  font-size: 22px;
  text-align: center;
  line-height: 35px;
  color: #fff;
  box-sizing: border-box;
  padding: 13px 21px 28px 11px;
  background: url('@{pictureUrl}/point-tip1.png') no-repeat;
  background-size: 100% 100%;
  transform: translate(30px, 15px);
}
.pointTip2 {
  cursor: default;
  width: 175px;
  height: 70px;
  font-size: 22px;
  text-align: center;
  line-height: 35px;
  color: #fff;
  box-sizing: border-box;
  padding: 13px 21px 28px 11px;
  background: url('@{pictureUrl}/point-tip2.png') no-repeat;
  background-size: 100% 100%;
  transform: translate(30px, 15px);
}
.pointTip3 {
  cursor: default;
  width: 175px;
  height: 70px;
  font-size: 22px;
  text-align: center;
  line-height: 35px;
  color: #fff;
  box-sizing: border-box;
  padding: 13px 21px 28px 11px;
  background: url('@{pictureUrl}/point-tip3.png') no-repeat;
  background-size: 100% 100%;
  transform: translate(30px, 15px);
}
.pointTip4 {
  cursor: default;
  width: 175px;
  height: 70px;
  font-size: 22px;
  text-align: center;
  line-height: 35px;
  color: #fff;
  box-sizing: border-box;
  padding: 13px 21px 28px 11px;
  background: url('@{pictureUrl}/point-tip4.png') no-repeat;
  background-size: 100% 100%;
  transform: translate(30px, 15px);
}
</style>
