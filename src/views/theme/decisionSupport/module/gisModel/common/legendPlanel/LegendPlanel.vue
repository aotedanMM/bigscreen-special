<template>
  <div class="legendPlanel-block">
    <div class="trigger-btn" @click="showPopups" v-show="!popupsStatus">
      <!-- {{ $store.state.configModel.lengendLayout.vertical.hasNum }} -->
      <!-- <img class="trigger-img" @click="showPopups" src="@/assets/img/gisModule/legendPlanel/legend.png" alt /> -->
    </div>
    <div :class="['popups-planel', popupsStatus ? 'show' : '']">
      <div
        class="popups-planel-close"
        @click="hidePopups"
        :class="[
          $store.state.configModel.lengendLayout.vertical.hasNum
            ? ''
            : 'transferTop',
        ]"
      >
        <img
          class="img"
          src="@/assets/img/gisModule/legendPlanel/legendhide.png"
          alt
        />
      </div>
      <div
        class="popups-planel-main"
        :class="[
          $store.state.configModel.lengendLayout.vertical.hasNum
            ? ''
            : 'noneHeight',
        ]"
      >
        <div
          v-for="(item, index) of legendList"
          class="item"
          @click="listItemClickFn(item)"
          :key="index"
          v-show="item.isShow"
        >
          <span class="img" :class="item.iconName"></span>
          <span
            class="text f-txt-com"
            :class="{ legend_sign_class: item.checked }"
            :title="item.title"
            >{{ item.title }}</span
          >
          <span
            v-show="item.DayBtnclick"
            :class="{
              DayBtnclickDayNighticon: item.DayBtnclick,
              DayNightShow: item.DayNightShow,
              DayNightHide: item.DayNightHide,
            }"
            @click.stop="DayBtnclickDayNight"
          ></span>
        </div>

        <!--防汛专题图例 -->
        <div
          v-if="
            false &&
              ['3', '24', '10', '16', '17', '18', '19', '20', '21', '25', '26', '27', '28'].includes(
                $store.state.eventPushStore.eventLocation.EventType,
              )
          "
        >
          <!--<div v-if="$store.state.eventInfoType.eventInfoType.includes($store.state.eventPushStore.eventLocation.EventType)">-->
          <LegendPanel
            :legendList="floodLegendList"
            :visible="visible"
            @click="itemClickFn"
          ></LegendPanel>
        </div>

        <!-- 新的图例走这个数组newLegendList -->
        <template v-for="(nlItem, nlIndex) of newLegendList">
          <div v-if="nlItem.isShow" :key="nlItem.key">
            <component
              :is="nlItem.componentName"
              :componentParam="nlItem.componentParam"
            ></component>
          </div>
        </template>
      </div>
    </div>
    <!-- 风场图例 -->
    <ul
      class="windLegend_cl"
      v-if="windLegend"
      :style="windFieldLegendLocation"
    >
      <li v-for="(item, index) in newColor" :key="index">
        <span class="newColor_bg" :style="{ 'background-color': item }"></span>
        <span>{{ Math.round((index * 10 * 1000) / 3600) }}</span>
      </li>
    </ul>
    <div
      class="Earthquake_planel"
      v-show="isShowEarthquakeList"
      :style="historicalEarthquakeLocation"
    >
      <!-- <div class="popups-planel-close" @click="hideEarthquakeList">
        <img class="img" src="@/assets/img/gisModule/legendPlanel/legendhide.png" alt />
      </div> -->
      <!--            @click="EarthquakelistItemClickFn(item)" 历史地震图例点击-->
      <div class="popups-planel-main">
        <div
          v-for="(item, index) of EarthquakeList"
          class="item"
          :key="index"
          v-show="item.isShow"
        >
          <span class="img" :class="item.iconName"></span>
          <span
            class="text f-txt-com"
            :class="{ legend_sign_class: item.checked }"
            :title="item.title"
            >{{ item.title }}</span
          >
          <span></span>
        </div>
      </div>
    </div>
    <div class="TyphoonLocation_planel" v-if="false && isShowTyphoonLocation" :style='TyphoonLocation'>
        
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import FloodLegendEvent from '@/util/FloodLegendEvent';
import LegendPanel from '@/components/common/Legend/LegendPanel.vue';
import Rainfall from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Rainfall.vue';
import RainStation from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/RainStation.vue';
import Wind from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Wind.vue';
import WindMonitoring from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/WindMonitoring.vue';
import Reservoir from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Reservoir.vue';
import Riverway from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Riverway.vue';
import WindThwartwise from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/WindThwartwise.vue';
import RainfallThwartwise from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/RainfallThwartwise.vue';
import LiftMonitoring from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/LiftMonitoring.vue';
import Disaster from '@/views/theme/decisionSupport/module/gisModel/common/legendPlanel/monitoringWarning/Disaster.vue';

@Component({
  components: {
    LegendPanel,
    Rainfall,
    RainStation,
    Wind,
    WindMonitoring,
    Reservoir,
    Riverway,
    WindThwartwise,
    RainfallThwartwise,
    LiftMonitoring,
    Disaster,
  },
  mixins: [MapCommon, FloodLegendEvent],
})
export default class LegendPlanel extends Vue {
  public eventTypeCache: any = ''; // 缓存事件类型
  public eventIdCache: any = ''; // 缓存事件id
  public visible: boolean = true;
  // 图例数组，这个数组将在initCurData方法中进行赋值，这里的数据将会变得没有用了，但是为了以前的代码，还是不删除不注释
  private legendList: any[] = [
    {
      clickFn: 'openIntensity',
      title: '烈度圈',
      checked: false,
      iconName: 'InfluenceCircle',
      isShow: false,
      mapCircleQueryType: 1,
    },
    {
      clickFn: 'openInfluence',
      title: '经验圈',
      checked: false,
      iconName: 'intensityCircle',
      isShow: true,
      mapCircleQueryType: 0,
    },
    {
      clickFn: 'openThermodynamiTc',
      title: '人口热力',
      checked: false,
      iconName: 'populationFever',
      isShow: true,
      mapCircleQueryType: 2,
      DayNightShow: true,
      DayNightHide: false,
      DayBtnclick: true,
    },
    {
      clickFn: 'openRiverSystem',
      title: '水系',
      checked: false,
      iconName: 'riverSystem',
      isShow: true,
      mapCircleQueryType: 3,
    },
    // {
    //   clickFn: 'openWindField',
    //   title: '风场',
    //   checked: false,
    //   iconName: 'windField',
    //   isShow: false,
    //   mapCircleQueryType: 4,
    // },
    {
      clickFn: 'openHistoricalEarthquake',
      title: '历史地震',
      checked: false,
      iconName: 'historicalEarthquake',
      isShow: true,
      mapCircleQueryType: 4,
    },
  ];
  private newLegendList: any = [];
  // 防汛专题图例
  private floodLegendList: any = {
    legends: [
      {
        clickFn: 'openRainfall',
        title: '降雨实况图',
        checked: false,
        iconName: 'rainfall',
        isShow: true,
        layerName: 'RainfallLayer',
        mapCircleQueryType: 5,
      },
      // {
      //     clickFn: 'openLakeSurface',
      //     title: '库湖水面',
      //     checked: true,
      //     iconName: 'lakeSurface',
      //     isShow: true,
      //     layerName:'ReservoirLakeLayer',
      //     mapCircleQueryType: 6,
      // },
      // {
      //     clickFn: 'openRiverNetwork',
      //     title: '河网水系',
      //     checked: true,
      //     iconName: 'riverNetwork',
      //     isShow: true,
      //     layerName:'RiverLayer',
      //     mapCircleQueryType: 7,
      // },
      {
        clickFn: 'openFloodwaterArea',
        title: '蓄滞洪区',
        checked: false,
        iconName: 'floodwaterArea',
        isShow: true,
        layerName: '',
        mapCircleQueryType: 8,
      },
      {
        clickFn: 'openWatershed',
        title: '流域',
        checked: false,
        iconName: 'watershed',
        isShow: true,
        layerName: 'WatershedLayer',
        mapCircleQueryType: 9,
      },
    ],
  };
  private EarthquakeList: any = [
    {
      EarthquakeclickFn: 'openEarthquakeSeven',
      title: '7.0级以上',
      checked: false,
      iconName: 'EarthquakeSeven',
      isShow: true,
      mapCircleQueryType: 1,
    },
    {
      EarthquakeclickFn: 'openEarthquakeSix',
      title: '6.0 - 7.0',
      checked: false,
      iconName: 'EarthquakeSix',
      isShow: true,
      mapCircleQueryType: 2,
    },
    {
      EarthquakeclickFn: 'openEarthquakeFive',
      title: '5.0 - 6.0',
      checked: false,
      iconName: 'EarthquakeFive',
      isShow: true,
      mapCircleQueryType: 3,
    },
    {
      EarthquakeclickFn: 'openEarthquakeFivebelow',
      title: '5.0级以下',
      checked: false,
      iconName: 'EarthquakeFivebelow',
      isShow: true,
      mapCircleQueryType: 4,
    },
  ];
  private isShowEarthquakeList: boolean = false; // 判断历史地震图例
  private isShowTyphoonLocation: boolean = false; // 判断台风图例
  private isEarthquakeListRight: boolean = false; // 判断历史地震图例样式控制
  private EarthquakeListMap: string[] = ['1', '2', '3', '4'];
  private isEarthquakeListLeft: boolean = false; // 判断历史地震图例样式控制
  private DayNight: boolean = false; // 判断黑夜和白天
  // 风场图例显隐
  private windLegend = false;
  private windFieldLegendLocation = '';
  private historicalEarthquakeLocation = '';
  private TyphoonLocation = '';
  // 风场图例色值
  private newColor = [
    'rgb(131,81,205)',
    'rgb(61,72,255)',
    'rgb(57,168,255)',
    'rgb(57,255,234)',
    'rgb(25,213,158)',
    'rgb(79,255,55)',
    'rgb(187,253,29)',
    'rgb(237,229,15)',
    'rgb(255,184,82)',
    'rgb(255,141,87)',
    'rgb(255,72,129)',
    'rgb(247,20,100)',
    'rgb(210,4,94)',
    'rgb(185,4,7)',
    'rgb(127,8,12)',
  ];

  /**
   * 加载人口热力的类型
   * */
  private defaultOpenPopulationFever: any = {
    // 0: 'other', //其他
    1: 'earthQuake', // 地震
    2: 'colliery', // 煤矿,属于安全生产事故
    4: 'noncoalMine', // 非煤矿山,属于安全生产事故
    5: 'dangerousChemicalTradeAccident', // 危险品和工贸,属于安全生产事故
    24: 'flood', // 洪涝
    9: 'forestFire', // 森林火灾
    10: 'typhoon', // 台风
    11: 'caoyuanhuozai', // 草原火灾
    16: 'rainstorm', // 暴雨
    17: 'nishiliu', // 泥石流事件
    18: 'huapo', // 滑坡事件
    // 19: 'yansehu', // 堰塞湖
    20: 'shuikukuiba', // 水库溃坝
    21: 'neilao', // 内涝
    25: 'shuikuzhongda', // 水库重大险情
    26: 'difangzhongda', // 堤防重大险情
    27: 'lingxun', // 凌汛
    28: 'shanhong', // 山洪
  };
  // private influenceMapComponent: any = '';
  // private peopleMapComponent: any = '';
  // 显示隐藏图例
  private popupsStatus: boolean = true;

  // 重新加载人口热力
  public unLoadRkrl() {
    if (this.legendList[2].checked) {
      this.openThermodynamiTc(this.legendList[2].checked);
    }
  }

  /**
   * 监听经验圈大小是否发生改变
   * 当改变的时候看是否现在是打开经验圈的状态, 如果是打开的
   * */
  @Watch('$store.state.eventPushStore.eventLocation.radius')
  public watchRadiusChange(): void {
    // 判断现在是不是打开的状态 是的话重新加载
    if (this.legendList[2].checked) {
      // 上来先卸载一下, 防止经验圈变更, 然后重新计算加载人口热力
      this.legendList[2].checked = false;
      this.getComponent_DisasterJudgePop().reload();
      this.listItemClickFn(this.legendList[2]);
    }
  }

  /**
   * 监听事件类型
   * */
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  public updateEventType() {
    const eventId = this.$store.state.eventPushStore.eventId;
    const eventType = this.$store.state.eventPushStore.eventLocation.EventType;
    if (this.eventIdCache === eventId && this.eventTypeCache !== eventType) {
      // 只有事件id不变，事件类型改变才会触发
      this.watchIsDefaultOpenPopulationFever();
    }
  }

  public watchIsDefaultOpenPopulationFever(): void {
    /**
     * 如果类型有值说明是需要选中的
     * */
    const eventType: number | string = this.$store.state.eventPushStore
      .eventLocation.EventType;
    /**
     * 监听事件类型,改变时判断是否加载人口热力
     * 只管人口热力的开关
     * */
    if (this.defaultOpenPopulationFever[eventType]) {
      // 上来先卸载一下, 防止经验圈变更, 然后重新计算加载人口热力
      this.legendList[2].checked = false;
      this.getComponent_DisasterJudgePop().reload();
      // 类型中需要打开 且 现在是关闭状态 那么打开
      // 2020年4月22日 by yangxinxin
      // 进入处置时，默认叠加人口热力添加延迟处理，解决因为人口热力叠加导致的视野动画效果终止问题。
      setTimeout(() => {
        this.listItemClickFn(this.legendList[2]);
      }, 1000);
      this.legendList[1].checked = false;
      this.listItemClickFn(this.legendList[1]);
    } else if (
      !this.defaultOpenPopulationFever[eventType] &&
      this.legendList[2].checked
    ) {
      // 类型中没有 但是打开了 需要关闭
      this.listItemClickFn(this.legendList[2]);
    }
    this.openLegendEvent(false, [
      'RiverLayer',
      'WatershedLayer',
      'ReservoirLakeLayer',
    ]);

    /**
     * 监听事件类型,改变水系的开关
     * 只管水系的开关
     * */
    // 如果EventType 等于9 选中水系
    if (eventType === 9 || eventType === '9') {
      this.getComponent_RiverSystemJudgement().removeLayer('WaterLayer');
      // this.legendList[3].isShow = true;
      // this.legendList[4].isShow = true;
      this.listItemClickFn(this.legendList[3]);
      // this.listItemClickFn(this.legendList[4]);
    } else {
      this.getComponent_RiverSystemJudgement().removeLayer('WaterLayer');
      // this.legendList[3].isShow = true;

      // this.legendList[4].isShow = false;
    }

    /**
     * 监听事件类型,历史地震只在地震专题
     * 只管地震专题
     * */
    // 如果EventType 等于1 地震事件
    if (eventType === 1 || eventType === '1') {
      this.legendList[4].isShow = true;
      this.getComponent_HistoricalEarthquakeJudgement().unload();
      this.isShowEarthquakeList = false;
    } else {
      this.legendList[4].isShow = false;
      this.getComponent_HistoricalEarthquakeJudgement().unload();
      this.isShowEarthquakeList = false;
      // this.legendList[4].isShow = false;
    }

    // 判断台风图例
    if ((eventType === 10) || (eventType === '10')) {
      this.isShowTyphoonLocation = true;
    } else {
      this.isShowTyphoonLocation = false;
    }
  }

  // 监听风场、历史地震图例的位置
  @Watch('$store.state.panelPositionChangeModule.rightPanelPosition', {
    deep: true,
  })
  private windFieldLegendLocationFun() {
    this.historicalEarthquakeLocation = this.$store.state.panelPositionChangeModule.rightPanelPosition.historicalEarthquakeLocation; // 历史地震图例的位置
    this.TyphoonLocation = this.$store.state.panelPositionChangeModule.rightPanelPosition.TyphoonLocation; // 台风图例的位置
    this.windFieldLegendLocation = this.$store.state.panelPositionChangeModule.rightPanelPosition.windFieldLegendLocation;
  }

  private showPopups() {
    this.popupsStatus = true;
  }
  private hidePopups() {
    this.popupsStatus = false;
  }
  // 历史地震
  private hideEarthquakeList() {
    // this.popupsStatus = false;
  }

  // 点击切换防汛图例选中状态
  private itemClickFn(data: any) {
    // 调取对应的地图方法
    this.openLegendEvent(data.checked, data.layerName);
  }

  // 点击切换选中状态
  private listItemClickFn(item: any) {
    // 当这个图例本身就不用展示的时候，那么就不继续执行
    if (!item.isShow) {
      return;
    }

    // 当为经验圈且要展示，但是为面处置的时候，不用继续执行的。
    if ( (item.title === '经验圈') && (this.$store.state.eventPushStore.eventLocation.geometry)) {
      item.checked = false;
      item.isShow = false;
      return ;
    }

    item.checked = !item.checked;
    // 调取对应的地图方法
    (this as any)[item.clickFn](item.checked);
    if (
      item.iconName !== 'populationFever' &&
      item.iconName !== 'riverSystem' &&
      item.iconName !== 'windField' &&
      item.iconName !== 'historicalEarthquake'
    ) {
      this.$store.commit(
        'controlMoudle/setMapCircleQueryType',
        item.mapCircleQueryType,
      );
      this.legendList.forEach((forItem: any, forIndex: any, forData: any) => {
        if (
          forItem.iconName !== item.iconName &&
          forItem.iconName !== 'populationFever' &&
          forItem.iconName !== 'riverSystem' &&
          forItem.iconName !== 'windField' &&
          forItem.iconName !== 'historicalEarthquake'
        ) {
          forItem.checked = false;
        }
      });
    }
  }

  // 历史地震点击切换
  private EarthquakelistItemClickFn(item: any) {
    item.checked = !item.checked;
    (this as any)[item.EarthquakeclickFn](item.checked);
    if (
      item.iconName !== 'EarthquakeSeven' &&
      item.iconName !== 'EarthquakeSix' &&
      item.iconName !== 'EarthquakeFive' &&
      item.iconName !== 'EarthquakeFivebelow'
    ) {
      this.EarthquakeList.forEach(
        (forItem: any, forIndex: any, forData: any) => {
          if (
            forItem.iconName !== item.iconName &&
            forItem.iconName !== 'EarthquakeSeven' &&
            forItem.iconName !== 'EarthquakeSix' &&
            forItem.iconName !== 'EarthquakeFive' &&
            forItem.iconName !== 'EarthquakeFivebelow'
          ) {
            forItem.checked = false;
          }
        },
      );
    }
  }

  // 七级历史地震图例点击
  private openEarthquakeSeven(checked: boolean) {
    if (checked === true) {
      // true
      this.EarthquakeListMap.push('4');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    } else {
      // false
      this.Earthquakegetarr('4');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    }
  }

  // 6.0 - 7.0历史地震图例点击
  private openEarthquakeSix(checked: boolean) {
    if (checked === true) {
      // true
      this.EarthquakeListMap.push('3');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    } else {
      // false
      this.Earthquakegetarr('3');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    }
  }

  // 5.0 - 6.0历史地震图例点击
  private openEarthquakeFive(checked: boolean) {
    if (checked === true) {
      // true
      this.EarthquakeListMap.push('2');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    } else {
      // false
      this.Earthquakegetarr('2');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    }
  }
  // 五级以下历史地震图例点击
  private openEarthquakeFivebelow(checked: boolean) {
    if (checked === true) {
      // true
      this.EarthquakeListMap.push('1');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    } else {
      // false
      this.Earthquakegetarr('1');
      this.getComponent_HistoricalEarthquakeJudgement().showResource(
        this.EarthquakeListMap,
      );
    }
  }

  // 历史地震图例方法
  private Earthquakegetarr(index: any) {
    for (let i = 0; i < this.EarthquakeListMap.length; i++) {
      if (this.EarthquakeListMap[i] === index) {
        this.EarthquakeListMap.splice(i, 1);
      }
    }
    return this.EarthquakeListMap;
  }

  // 监听如果是行政区划并且是经验圈时取消选中
  private watchSetMapCircle() {
    this.messsageBus.on('setMapCircle', (key: any) => {
      if (
        key === '_district' &&
        this.$store.state.controlMoudle.mapCircleQueryType === 0
      ) {
        this.legendList[1].checked = true;
        this.listItemClickFn(this.legendList[1]);
      } else if (
        key !== '_district' &&
        this.$store.state.controlMoudle.mapCircleQueryType === 0
      ) {
        this.legendList[1].checked = false;
        this.listItemClickFn(this.legendList[1]);
      }
    });
  }
  // 点击是否选中烈度圈
  private openIntensity(checked: boolean) {
    if (checked) {
      this.getComponent_Influence().load(1);
      // this.unLoadRkrl();
    } else {
      this.getComponent_Influence().unload(1);
    }
  }
  // 点击是否选中经验圈
  private openInfluence(checked: boolean) {
    if (checked) {
      this.getComponent_Influence().load(0);
      // this.unLoadRkrl();
    } else {
      this.getComponent_Influence().unload(0);
    }
  }
  // 点击是否选中人口热力
  private openThermodynamiTc(checked: boolean) {
    if (checked) {
      this.AcquisitionTime();
      console.log(this.DayNight);
      if (this.DayNight === true) {
        this.legendList[2].DayNightShow = false;
        this.legendList[2].DayNightHide = true;
      } else {
        this.legendList[2].DayNightShow = true;
        this.legendList[2].DayNightHide = false;
      }
      this.getComponent_DisasterJudgePop().load({ isNight: this.DayNight });
    } else {
      this.AcquisitionTime();
      this.getComponent_DisasterJudgePop().unload({ isNight: this.DayNight });
      this.legendList[2].DayNightShow = false;
      this.legendList[2].DayNightHide = false;
    }
  }
  // 点击切换人口热力icon的图例(黑夜和白天)
  private DayBtnclickDayNight() {
    if (this.legendList[2].DayNightShow === true) {
      this.legendList[2].DayNightShow = false;
      this.legendList[2].DayNightHide = true;
      this.getComponent_DisasterJudgePop().load({ isNight: true });
    } else {
      this.legendList[2].DayNightShow = true;
      this.legendList[2].DayNightHide = false;
      this.getComponent_DisasterJudgePop().load({ isNight: false });
    }
  }
  // 点击是否选中水系
  private openRiverSystem(checked: boolean) {
    if (checked) {
      this.getComponent_RiverSystemJudgement().addLayer('WaterLayer');
    } else {
      this.getComponent_RiverSystemJudgement().removeLayer('WaterLayer');
    }
  }

  // 点击是否选中历史地震
  private openHistoricalEarthquake(checked: boolean) {
    console.log(this.isShowEarthquakeList);
    if (checked) {
      this.getComponent_HistoricalEarthquakeJudgement().load();
      // this.getComponent_HistoricalEarthquakeJudgement().showResource()
      this.isShowEarthquakeList = true;
      this.EarthquakeList[0].checked = true;
      this.EarthquakeList[1].checked = true;
      this.EarthquakeList[2].checked = true;
      this.EarthquakeList[3].checked = true;
    } else {
      this.getComponent_HistoricalEarthquakeJudgement().unload();
      this.isShowEarthquakeList = false;
    }
  }

  // 点击是否选中风场
  private openWindField(checked: boolean) {
    if (checked) {
      this.getComponent_RiverSystemJudgement().addLayer('WindField');
      this.windLegend = false;
    } else {
      this.getComponent_RiverSystemJudgement().removeLayer('WindField');
      this.windLegend = false;
    }
  }

  // 监听推送事件显示隐藏烈度圈tooltip
  @Watch('$store.state.eventPushStore.eventLocation.curLocationKey')
  private changeCurLocationKey(newKey: any) {
    if (newKey === 'POPULATIONFEVE') {
      if (this.$store.state.eventPushStore.eventLocation !== '1') {
        console.log('推送非地震事件---');
        this.legendList[0].isShow = false;
        // 默认选中经验圈
        this.listItemClickFn(this.legendList[1]);
      }
    }
  }

  // 监听定位所有取消选中状态
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  private changeInitConfig(): void {
    // 清空三种圈
    this.openIntensity(false);
    this.openInfluence(false);
    this.openThermodynamiTc(false);
    this.openRiverSystem(false);
    this.openWindField(false);
    // 回归默认值
    this.legendList.forEach((item: any): void => {
      item.checked = false;
    });
  }

  // 监听事件id
  @Watch('$store.state.eventPushStore.eventId')
  private changEventId(): void {
    this.eventIdCache = this.$store.state.eventPushStore.eventId;
    this.eventTypeCache = this.$store.state.eventPushStore.eventLocation.EventType;
    this.initCurData();
    // 刷新事件id的时候回归默认只开启经验圈状态
    this.openIntensity(false);
    this.openInfluence(true);
    this.openThermodynamiTc(false);
    this.openRiverSystem(false);
    this.openWindField(false);
    this.legendList[0].isShow = false;
    this.legendList.forEach((item: any, index: number): void => {
      item.checked = false;
      if (index === 1) {
        item.checked = true;
      }
    });
    // 当事件id改变后 调用人口热力  检查是否需要默认打开  水系  地震都在里面  TODO 田磊合并不要同样的监听分那么多类
    this.watchIsDefaultOpenPopulationFever();
  }

  // bus监听是否加载完成烈度圈
  private watchModelExecuted() {
    console.log('开始加载烈度圈');
    this.messsageBus.on('model-executed', (res: any) => {
      console.log('烈度圈加载完毕');
      this.legendList[0].isShow = true;
    });
  }

  private AcquisitionTime() {
    const newDate = new Date();
    const newDateH = newDate.getHours();
    const newDateM = newDate.getMinutes();
    if (newDateH >= 6 && newDateM >= 1 && newDateH < 18) {
      this.DayNight = false;
      this.legendList[2].DayNightShow = true;
      this.legendList[2].DayNightHide = false;
    } else if (newDateH >= 18 && newDateM >= 1) {
      this.DayNight = true;
      this.legendList[2].DayNightShow = false;
      this.legendList[2].DayNightHide = true;
    } else if (newDateH <= 18 && newDateM <= 1 && newDateH >= 6) {
      if (newDateH === 18 && newDateM <= 1) {
        this.DayNight = true;
        this.legendList[2].DayNightShow = false;
        this.legendList[2].DayNightHide = true;
      } else if (newDateH === 6 && newDateM <= 1) {
        this.DayNight = true;
        this.legendList[2].DayNightShow = false;
        this.legendList[2].DayNightHide = true;
      } else {
        this.DayNight = false;
        this.legendList[2].DayNightShow = true;
        this.legendList[2].DayNightHide = false;
      }
    } else if (newDateH <= 6 && newDateM <= 1) {
      this.DayNight = true;
      this.legendList[2].DayNightShow = false;
      this.legendList[2].DayNightHide = true;
    }
  }

  /**
   * 将config的vuex中legend配置对这个组件原来的那些值进行赋值
   */
  // @Watch('$store.state.configModel.config.legend')
  private initCurData() {
    const legendVuexConfig = this.$store.state.configModel.config.legend || [];
    this.legendList = legendVuexConfig.slice(0, 5);
    this.newLegendList = legendVuexConfig.slice(5);
  }

  // 监听新写的这些图例的显隐
  @Watch('$store.state.configModel.legendConfig')
  private updateNewLegendList(val: any) {
    const tmpArr = JSON.parse(JSON.stringify(val));
    this.newLegendList = tmpArr.slice(5) || [];
  }

  private created() {
    this.eventTypeCache = this.$store.state.eventPushStore.eventLocation.EventType;
    this.eventIdCache = this.$store.state.eventPushStore.eventId;
    this.initCurData();
    this.AcquisitionTime();
    this.watchSetMapCircle();
    this.watchModelExecuted();
    this.windFieldLegendLocationFun();
    this.messsageBus.on('clickFromToolNav', (res: string) => {
      // 查看是否是关闭
      const isClose = res === 'closeThermodynamiTc';
      // 如果是关闭 获取打开的函数名
      const clickFn = isClose ? 'openThermodynamiTc' : res;
      this.legendList = this.legendList.map((item: any) => {
        if (item.clickFn === clickFn) {
          item.checked = isClose;
        }
        return item;
      });
      const param = this.legendList.find((item: any) => {
        return item.clickFn === clickFn;
      });
      if (param) {
        this.listItemClickFn(param);
      }
      // if (res === 'influence') {
      //   param = this.legendList[1] = {
      //     clickFn: 'openInfluence',
      //     title: '影响圈',
      //     checked: true,
      //     iconName: 'intensityCircle',
      //     isShow: true,
      //     mapCircleQueryType: 0,
      //   };
      // } else if (res === 'Intensity') {
      //   param = this.legendList[0] = {
      //     clickFn: 'openIntensity',
      //     title: '烈度圈',
      //     checked: true,
      //     iconName: 'InfluenceCircle',
      //     isShow: true,
      //     mapCircleQueryType: 1,
      //   };
      // }
    });
    this.openLegendEvent(true, ['RiverLayer', 'WatershedLayer']);
    this.openLegendEvent(false, ['RiverLayer', 'WatershedLayer']);
  }
  private getComponent_Influence() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('influence');
    return component;
  }
  private getComponent_DisasterJudgePop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgePop',
    );
    return component;
  }

  private getComponent_RiverSystemJudgement() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
    return component;
  }

  private getComponent_HistoricalEarthquakeJudgement() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('historyEarthQuake');
    return component;
  }

  private mounted() {
    // 默认选中经验圈
    this.listItemClickFn(this.legendList[1]);
    // 加载时 判断当前事件是否需要打开人口热力
    this.$nextTick((): void => {
      this.watchIsDefaultOpenPopulationFever();
    });
    // this.messsageBus.on('EarthQuakePlanel', (isEarthQuake: any) => {
    //   if (isEarthQuake === true) {
    //     this.isEarthquakeListRight = true;
    //     this.isEarthquakeListLeft = false;
    //   } else if (isEarthQuake === false) {
    //     this.isEarthquakeListRight = false;
    //     this.isEarthquakeListLeft = false;
    //   }
    // });
    // this.messsageBus.on('EarthQuakeRight', (EarthQuakeRight: any) => {
    //   if (EarthQuakeRight === true) {
    //     this.isEarthquakeListLeft = true;
    //     this.isEarthquakeListRight = false;
    //   } else if (EarthQuakeRight === false) {
    //     this.isEarthquakeListRight = true;
    //     this.isEarthquakeListLeft = false;
    //   }
    // });
  }

  // 卸载人口热力
  private beforeDestroy() {
    // this.AcquisitionTime();
    this.getComponent_DisasterJudgePop().unload({ isNight: this.DayNight });
    // this.legendList[2].DayNightShow = false;
    // this.legendList[2].DayNightHide = false;
  }
}
</script>
<style lang="less" scoped>
@imgPath: '../../../../../../../assets/img/gisModule/legendPlanel';
.legendPlanel-block {
  position: relative;
  display: inline-block;
  z-index: 3;
  .trigger-btn {
    width: 63px;
    height: 63px;
    cursor: pointer;
    background-image: url('@{imgPath}/legend.png');
    background-size: contain;
    position: absolute;
    bottom: -35px;
    // right: -60px;
    z-index: 3;
    &:hover {
      background-image: url('@{imgPath}/legendhover.png');
      z-index: 3;
    }
  }
  .popups-planel {
    display: none;
    position: absolute;
    bottom: -79px;
    right: -62px;
    width: 230px;
    // height: 160px;
    // z-index: 20;
    background: url('@{imgPath}/legendbg.png') no-repeat 0 0;
    background-size: 100% 100%;
    &.show {
      display: block;
    }
    .noneHeight {
      height: 0px !important;
      padding: 0px !important;
    }
    .popups-planel-close {
      position: absolute;
      right: 23px;
      top: -14px;
      width: 33px;
      height: 33px;
      cursor: pointer;
      .img {
        &:extend(.popups-planel-close);
      }
    }
    .transferTop {
      top: -32px;
    }
    .popups-planel-main {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 15px;
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      .item {
        display: flex;
        align-items: center;
        height: 50px;
        cursor: pointer;
        width: 100%;
        & > .img {
          margin: 0 20px;
          width: 26px;
          height: 26px;
        }
        & > .text {
          color: rgba(255, 255, 255, 0.5);
        }
        .legend_sign_class {
          color: #fff;
        }
        .DayBtnclickDayNighticon {
          position: relative;
          width: 15px;
          height: 24px;
        }
        .DayNightShow::after {
          content: '';
          width: 18px;
          height: 18px;
          background: url('@{imgPath}/Day.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: -6px;
        }
        .DayNightHide::after {
          content: '';
          width: 18px;
          height: 18px;
          background: url('@{imgPath}/Night.png') no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right: -6px;
        }
      }
      .intensityCircle {
        background: url('@{imgPath}/earDis.png') no-repeat;
      }
      .populationFever {
        background: url('@{imgPath}/people.png') no-repeat 12px 0;
      }
      .riverSystem {
        background: url('@{imgPath}/riverSystem.png') no-repeat 0px 0;
      }
      .historicalEarthquake {
        width: 30px !important;
        margin: 0px 17px !important;
        background: url('@{imgPath}/Historicalearthquake.png') no-repeat 0px 0;
      }
      .windField {
        background: url('@{imgPath}/windField.png') no-repeat 0px 0;
      }
      .InfluenceCircle {
        background: url('@{imgPath}/liedu.png') no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }
}
.windLegend_cl {
  width: 134px;
  height: 564px;
  z-index: 10;
  position: absolute;
  bottom: -13px;
  right: 1270px;
  background: url('@{imgPath}/windLegend_bg.png') no-repeat;
  background-size: 100% 100%;
  li {
    margin: 0 auto;
    width: 65px;
    display: flex;
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
    .newColor_bg {
      height: 15px;
      width: 22px;
      border: 1px solid #fff;
    }
    span {
      color: #fff;
      font-size: 22px;
    }
  }
  li:nth-child(1) {
    margin-top: 20px;
  }
}

.Earthquake_planel {
  position: absolute;
  bottom: -19px;
  width: 220px;
  // height: 160px;
  // z-index: 20;
  background: url('@{imgPath}/legendbg.png') no-repeat 0 0;
  background-size: 100% 100%;
  &.show {
    display: block;
  }
  .popups-planel-close {
    position: absolute;
    right: 23px;
    top: -14px;
    width: 33px;
    height: 33px;
    cursor: pointer;
    .img {
      &:extend(.popups-planel-close);
    }
  }
  .popups-planel-main {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    .item {
      display: flex;
      align-items: center;
      height: 50px;
      cursor: pointer;
      width: 100%;
      & > .img {
        margin: 0 20px;
        width: 26px;
        height: 26px;
      }
      & > .text {
        color: rgba(255, 255, 255, 0.5);
        // font-size: 18px;
        // font-weight: 600;
      }
      .legend_sign_class {
        color: #fff;
      }

      .DayNightShow::after {
        content: '';
        width: 18px;
        height: 18px;
        background: url('@{imgPath}/Day.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -20px;
      }
      .DayNightHide::after {
        content: '';
        width: 18px;
        height: 18px;
        background: url('@{imgPath}/Night.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -20px;
      }
    }

    .EarthquakeSeven {
      background: url('@{imgPath}/sevenBgnew.png') no-repeat;
      background-size: 100% 100%;
      width: 44px !important;
      height: 44px !important;
      margin-left: 12px !important;
      margin-right: 10px !important;
    }
    .EarthquakeSix {
      background: url('@{imgPath}/sixBgnew.png') no-repeat;
      background-size: 100% 100%;
      width: 34px !important;
      height: 34px !important;
      margin-left: 18px !important;
      margin-right: 15px !important;
    }
    .EarthquakeFive {
      background: url('@{imgPath}/fineBgnew.png') no-repeat;
      background-size: 100% 100%;
      width: 24px !important;
      height: 24px !important;
      margin-left: 24px !important;
      margin-right: 18px !important;
    }
    .EarthquakeFivebelow {
      background: url('@{imgPath}/finenBgnew.png') no-repeat;
      background-size: 100% 100%;
      width: 14px !important;
      height: 14px !important;
      margin-left: 29px !important;
      margin-right: 23px !important;
    }
  }
}
.TyphoonLocation_planel{
    position: absolute;
    bottom: -23px;
    width: 327px;
    height: 405px;
    // height: 160px;
    // z-index: 20;
    background: url('@{imgPath}/taifenglist.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
// .Earthquake_planel_location{
//   position: absolute;
//   bottom: -19px;
// }
// // .Earthquake_planel_left{
// //   position: absolute;
// //   bottom: -19px;
// //   left: -1708px;
// // }
// // .Earthquake_planel_right{
// //   position: absolute;
// //   bottom: -19px;
// //   left: -1302px;
// // }
</style>
