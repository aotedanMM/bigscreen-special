<!-- 16比9 左侧的功能性工具条 -->
<template>
  <div>
    <!--当左侧只有一个标签时  :class="{' right_box_hide--single ' : arrFromConfigNew.length===1}" -->
    <div class="right_box_hide" @click.stop="switchShinkPanel">
      <!-- {{isShow}}<br/>{{$store.state.configModel.fastSearchPosition}} -->

      <span class="rightPanelShrink-btn reserve shrinkPanel-btn_bg" v-if="isShow"></span>
      <span class="rightPanelShrink-btn shrinkPanel-btn_bg" v-else></span>
    </div>
    <div class="right_side_function" v-show="isShow">
      <!--{{arrFromConfig}}-->
      <!--当左侧只有一个标签时  :class="{' right_sidebar--single' : arrFromConfigNew.length===1}" -->
      <div class="right_sidebar" v-show="arrFromConfigNew.length>0">
        <el-scrollbar style="height:calc(100% - 120px)">
          <div
            class="right_sidebar_itme"
            @click="changeChecked(item, index)"
            v-for="(item, index) of arrFromConfigNew"
            :key="item.key"
            :class="{ testChecked: changeItem.key == item.key }"
          >
            <span class="halfScreenNav_icon" :class="'halfScreenNav_' + item.icon"></span>
            <span class="right_sidebar_txt f-txt-com">{{ item.name }}</span>
          </div>
          <!-- <span class="right_box_show" v-show="!isShow" @click.stop="switchShinkPanel">
        <img src="../../../assets/img/halfScreen/nav/nav_open.png" />
          </span>-->
        </el-scrollbar>
      </div>
      <!-- 此处高度auto是防止弹窗最小化时标题没有背景图片，高度100% 是防止弹窗完整显示时没有底部边-->
      <div
        class="right_function_box right_function_box_w"
        v-if="changeItem.componetName"
        id="right_function_box"
        :style="{'height': isMinimize ? '40px' : 'calc(100% - 120px)', 'backgroundSize': isMinimize ? '100% auto' : '100% 100%'}"
      >
        <component
          :is="changeItem.componetName"
          :isShow="isShow"
          :sourceObj="changeItem"
          :getJsonKey ="changeItem"
          :deriveViewList ="deriveViewList"
          :style="{'height': isMinimize ? '40px' : '100%'}"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { messsageBus } from '@/util/message';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import StudyAndJudgmentContainer from '@/components/feature/StudyAndJudgmentOfaPicture/StudyAndJudgmentContainer.vue';
import StudyAndJudgmentContainerInformation from '@/components/feature/StudyAndJudgmentOfaPicture/StudyAndJudgmentContainerInformation.vue';
import RescueTeamsContainer from '@/components/feature/RescueTeams/RescueTeamsContainer.vue';
import MaterialContainer from '@/components/feature/materialLogistics/MaterialContainer.vue';
import DefensivePreparation from '@/components/feature/flood/DefensivePreparation/DefensivePreparation.vue';
import MonitorWarningNormal from '@/components/feature/flood/MonitorWarning/MonitorWarningNormal.vue'; // 监测预警防汛
import MonitorWarningForestFire from '@/components/feature/forestFireYantai/MonitorWarning/MonitorWarningForestFire.vue'; // 监测预警森火
import DisasterStatistics from '@/components/feature/flood/DisasterStatistics/DisasterStatistics.vue';
import FastAssessment from '@/components/feature/flood/FastAssessment/FastAssessment.vue'; // 快速评估
import RescueTeamContainer from '@/components/feature/rescueTeamModule/rescueTeamContainer.vue'; //  救援队伍
import EmergencyPowerView from '@/components/feature/EmergencyPower/RescueTeamsContainer.vue'; //  事件态救援力量
// import LeftTestContainer from '@/components/feature/leftTest/LeftTestContainer.vue';
import MaterialSupportContainer from '@/components/feature/materialsupport/materialSupportContainer.vue'; // 物资保障
import LeftTestContainer from '@/components/feature/leftTest/LeftTestContainer.vue';
import SpreadAnalysis from '@/components/feature/forestFireYantai/spreadAnalysis/spreadAnalysis.vue'; // 蔓延分析
import Progress from '@/views/theme/decisionSupport/module/unNormalLeft/progress.vue'; // 进展情况
import OperationalDeploymentContainer from '@/components/feature/forestFire/operationalDeployment/operationalDeploymentContainer.vue'; // 作战部署
import DeriveVie from '@/components/feature/DeriveVie/DeriveVie.vue'; // 衍生事件
import {
  clearPeripheral,
  clearPathPlanning,
  closeRightVideo,
  clearTrack,
  mapUtilFun,
} from '@/views/common/nvaUtil/nvaUtil';
@Component({
  name: 'StudyToolHalf',
  components: {
    StudyAndJudgmentContainer, // 原来的一键研判
    StudyAndJudgmentContainerInformation, // 地震事件态，复制原来的意见研判，作为区别
    RescueTeamsContainer, // 力量调度
    MaterialContainer, // 物资保障
    DefensivePreparation, // 防御准备
    MonitorWarningNormal,
    MonitorWarningForestFire,
    EmergencyPowerView,
    Progress, // 进展情况
    DisasterStatistics, // 灾情统计
    FastAssessment, // 快速评估
    RescueTeamContainer, // 救援队伍
    SpreadAnalysis, // 蔓延分析
    // LeftTestContainer, // 左侧测试
    MaterialSupportContainer, // 物资保障
    LeftTestContainer, // 左侧测试
    DeriveVie, // 衍生事件
    OperationalDeploymentContainer,
  },
})
export default class StudyToolHalf extends Vue {
  private isMinimize: boolean = true; // 控制窗口展开和隐藏
  private deriveViewList: any = ''; // 衍生事件列表数据用于16：9衍生事件列表高亮
  private arrFromConfigNew: any[] = [];
  private changeItem: any = {};
  private isShow: boolean = true;
  private isEarthQuake: boolean = true;
  private lengedLoca: any = '';
  private leftPanelShowRight = {
    windFieldLegendLocation: 'right: 1207px;', // 风场图例的位置
    historicalEarthquakeLocation: 'right: 1500px;', // 历史地震图例的位置
    TyphoonLocation: 'right: 1386px;', // 台风图例的位置
  };
  private leftPanelShowLeft = {
    windFieldLegendLocation: 'right: 1615px;', // 风场图例的位置
    historicalEarthquakeLocation: 'right: 1095px;', // 历史地震图例的位置
    TyphoonLocation: 'right: 990px;', // 台风图例的位置
  };
  /*private safetyProductionList: any = {
    2: 'colliery', // 煤矿,属于安全生产事故
    4: 'noncoalMine', // 非煤矿山,属于安全生产事故
    5: 'dangerousChemicalTradeAccident', // 危险品和工贸,属于安全生产事故
  };
  private safetyProductionArr: string[] = [
    'productionindustry', // 危化企业
    'coal', // 煤矿企业
    'tailingpond', // 尾矿库
    'ANJIAN_FIREWORKENT※01', //  烟花爆竹企业
    'ANJIAN_ENT_WHSMYHBZ※01', // 工贸企业
  ];*/
  // 监听如果不是地震专题 就隐藏行政区划的图层
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private hideearthquekPoint(val: any) {
    if (val !== '1' || val !== 1) {
      this.hideaddDistricts(); // 去掉行政区划的图层
    }
  }
  @Watch('changeItem')
  private resetMinimize(val: any) {
   this.isMinimize = false;
  }

  private isShowFirePoint() {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: { showFlag: true },
    });
  }

  // 判断当前点击的是哪一个key
  private changeChecked(item: any, index?: number) {
    // 可能存在路径规划,所以需要关闭
    this.messsageBus.emit('Close_Router', {});
    if (index === 0) {
      this.messsageBus.emit('clickFromToolNav', 'openThermodynamiTc'); // 打开人口热力
    } else {
      this.hideaddDistricts(); // 去掉行政区划的图层
      this.messsageBus.emit('clickFromToolNav', 'closeThermodynamiTc'); // 关闭人口热力
    }
    this.getComponentAirTeam().unload(); // 清除航空护林站的点位

    // 判断当前工具条所点击的按钮是那个 暂时解决切换过快 点走了才加载点位问题 还有计时器(暂时只有救援队伍使用了)
    this.messsageBus.emit('disasterDecideBtnList', this.arrFromConfigNew);
    this.messsageBus.emit('moreDetails', ''); // 清空学校那样的面板
    clearPeripheral(this); // 清除周边分析
    // this.arrFromConfigNew[index].checked = item.checked;
    if (this.changeItem.key === item.key) {
      this.changeItem = {};
      this.$store.commit(
        'panelPositionChangeModule/setrightPanelPosition',
        this.leftPanelShowRight,
      );
      this.messsageBus.emit('EarthQuakePlanel', true);
      this.isEarthQuake = false;
    } else {
      this.changeItem = item;
      this.$store.commit(
        'panelPositionChangeModule/setrightPanelPosition',
        this.leftPanelShowLeft,
      );
      this.messsageBus.emit('EarthQuakePlanel', false);
      this.isEarthQuake = true;
    }
    if (index === 0 && this.changeItem !== item) {
      this.hideaddDistricts(); // 去掉行政区划的图层
    }
    // 清除播放图层
    this.$store.commit('mapTools/changeShowLayerPlay', false);
  }

  // 隐藏行政区划图层
  private hideaddDistricts() {
    // 行政区划组件
    const factory = this.$ioc.resolve('GISFactory-map');
    const districtComp = factory.disasterJudgeFactory.getComponent(
      'districtComp',
    );
    districtComp.unload();
  }

  /**
   * 护林站地图方法初始化
   */
  private getComponentAirTeam() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeAirTeam',
    );
    return component;
  }

  @Watch('$store.state.configModel.config')
  private arrFromConfigNewFun(val: any) {
    const data: any = JSON.parse(JSON.stringify(val));
    if (!data.researchPanel.length) {
      return;
    }
    this.arrFromConfigNew = data.researchPanel;

    // 当前已经有选中，获得当前的选中的index，还是默认选中这个
    const targetIndex = data.researchPanel.findIndex(
      (item: any, index: number) => {
        return item.key === this.changeItem.componetName;
      },
    );

    // 当前没有选中，获得配置文件中默认选中的那个
    const targetConfigIndex = data.researchPanel.findIndex(
      (item: any, index: number) => {
        return item.checked;
      },
    );

    // targetConfigIndex = targetConfigIndex === -1 ? 0 : targetConfigIndex;

    // 如果没有值才做赋值
    // if (!this.changeItem.componetName) {
    // 台风默认展开综合研判
    if (
      this.$store.state.eventPushStore.eventLocation.EventType.toString() ===
      '10'
    ) {
      const zhypIndex = this.arrFromConfigNew.findIndex(
        (fitem: any, findex: number) => {
          return fitem.key === 'quickStudy';
        },
      );
      if (zhypIndex === -1) {
        return;
      }
      // 高亮综合研判；
      this.changeChecked(this.arrFromConfigNew[zhypIndex], zhypIndex);
    } else {
      this.changeItem =
        this.arrFromConfigNew[targetIndex] ||
        this.arrFromConfigNew[targetConfigIndex] ||
        {};
    }
    // }
  }

  // 监听图例的位置
  @Watch('$store.state.panelPositionChangeModule.botLegendLocation')
  private changeLegendLocation() {
    this.lengedLoca = this.$store.state.panelPositionChangeModule.botLegendLocation;
  }

  // 从配置文件中，拿到当前灾种的右侧按钮数组
  // private get arrFromConfig() {
  //     return EventConfigRegistry.config.researchPanel;
  // }
  private updatedFastSearchPosition() {
    this.$store.state.configModel.fastSearchPosition = this.isShow ? 75 : 0;
  }

  private switchShinkPanel() {
    this.isShow = !this.isShow;
    if (this.isShow === true) {
      // clearPeripheral(this);
      // 当左侧面板出现是地图弹窗面板、以及右侧面板要隐藏
      this.messsageBus.emit('leftMapPanelMutexContrary', false);
      // 当左侧大面板存在时，将值存到vuex里面，与其他面板做互斥
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
        largeLeftPanel: { showFlag: true },
      });
      // 判断历史地震图例位置
      if (this.isEarthQuake === true) {
        this.messsageBus.emit('EarthQuakePlanel', false);
      } else {
        this.messsageBus.emit('EarthQuakePlanel', true);
      }
      this.messsageBus.emit('weatherPanelOpen', true);
    } else {
      // 当左侧大面板不存在时，将值存到vuex里面，与其他面板做互斥
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
        largeLeftPanel: { showFlag: false },
      });
      this.messsageBus.emit('EarthQuakePlanel', true);
    }
  }

  // 监听左侧大面板的显隐
  @Watch('$store.state.panelMutualExclusionMudule.panelMutualExclusion', {
    deep: true,
  })
  private changelargeRightPanel(val: any) {
    val = JSON.parse(JSON.stringify(val));
    this.isShow = val.largeLeftPanel.showFlag;

    this.updatedFastSearchPosition();
    if (this.isShow && this.changeItem.componetName) {
      this.$store.commit(
        'panelPositionChangeModule/setrightPanelPosition',
        this.leftPanelShowLeft,
      );
      this.messsageBus.emit('updateVillageDetails', { show: false });
    } else {
      if (this.lengedLoca === 'right: 540px;') {
        this.$store.commit(
          'panelPositionChangeModule/setrightPanelPosition',
          this.leftPanelShowLeft,
        );
      } else {
        this.$store.commit(
          'panelPositionChangeModule/setrightPanelPosition',
          this.leftPanelShowRight,
        );
      }
    }
    if (this.$store.state.firePointInfo.clickFirePoint) {
      this.arrFromConfigNew.forEach((items: any, sindex: any) => {
        if (items.name === '蔓延分析') {
          this.changeChecked(items, sindex);
        }
      });
    }
  }

  // 监听到 对应 eventId 变化，切换到战时屏
  @Watch('$store.state.eventPushStore.eventId')
  private switchModelNormal(eventId: string) {
    // if (eventId) {
    this.changeItem = {};
    // 当左侧大面板存在时，将值存到vuex里面，与其他面板做互斥
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: { showFlag: true },
    });
    this.arrFromConfigNewFun(this.$store.state.configModel.config);
    // }
  }

  // 监听到 切换烈度圈经验圈的时候  显示左侧面板
  @Watch('$store.state.controlMoudle.mapCircleQueryType')
  private watchModelNormal() {
    if (!this.isShow) {
      // 可能存在路径规划,所以需要关闭
      this.messsageBus.emit('Close_Router', {});
      this.isShow = !this.isShow;
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
        largeLeftPanel: { showFlag: true },
      });
    }
  }

  // 监听 当前正在研判的类型，是全国还是河流、行政区划、缓冲区
  @Watch('$store.state.dataFilterControl.zhypGeoType')
  private handleZhypGeoTypeUpdated(val: any, oldVal: any) {
    if ((val.key === 'jyqYp' && oldVal.key === 'ldqYp') || (val.key === 'ldqYp' && oldVal.key === 'jyqYp')) {
      // 在经验圈和烈度圈切换的时候不产生变化
      return;
    }
    val = val || {};
    if (val.key === (oldVal && oldVal.key)) {
      // 虽然引用地址变了，但是真实的值没有改变
      return;
    }
    const isCheckedKey = val && val.key;
    if (isCheckedKey) {
      // 表示处于还是河流、行政区划、缓冲区，则要展开，且选中综合研判
      if (!this.isShow) {
        // 当前没有展开，则要展开
        this.switchShinkPanel();
      }
      // 判断当前高亮的标签，如果高亮是综合研判，则不作处理，如果高亮的不是，则要选中综合研判
      // const zhypIndex = -1; // 综合研判在数组中的位置
      const zhypIndex = this.arrFromConfigNew.findIndex(
        (fitem: any, findex: number) => {
          return fitem.key === 'quickStudy';
        },
      );
      if (zhypIndex === -1) {
        return;
      }
      // 代表综合研判已经高亮，不用处理
      if (this.arrFromConfigNew[zhypIndex].key === this.changeItem.key) {
        return;
      }
      // 高亮综合研判
      this.changeChecked(this.arrFromConfigNew[zhypIndex], zhypIndex);
    }
  }

  private created() {
    const that: any = this;
    this.changeLegendLocation();
    this.getComponentAirTeam().unload(); // 清除航空护林站的点位
    this.changelargeRightPanel(
      this.$store.state.panelMutualExclusionMudule.panelMutualExclusion,
    ); // 监听当前面板的显隐
    this.arrFromConfigNewFun(this.$store.state.configModel.config);
    this.switchModelNormal(this.$store.state.eventPushStore.eventId);
    // 判断该面板是否隐藏
    // this.messsageBus.on('leftPanel', (data: any) => {
    //   this.changeItem = {};
    // });
    // 当地图弹窗存在时判断该面板要隐藏
    this.messsageBus.on('leftMapPanelMutex', (data: any) => {
      this.isShow = data;
      if (this.isShow === true) {
        this.$store.commit(
          'panelMutualExclusionMudule/setpanelMutualExclusion',
          { largeLeftPanel: { showFlag: true } },
        );
      } else {
        this.$store.commit(
          'panelMutualExclusionMudule/setpanelMutualExclusion',
          { largeLeftPanel: { showFlag: false } },
        );
      }
    });
    this.messsageBus.on('fireCreepPoint', (curPoint: any) => {
      this.$store.commit('firePointInfo/setClickFirePoint', true);
      this.$store.commit('firePointInfo/setFirePointXY', curPoint);
      that.isShowFirePoint(curPoint);
    });
  }

  /*private getComponent() { // 安全生产专题 危化品出详情窗版
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent(
      'locateComp',
    );
    return component;
  }*/

  private mounted(): void {
    // 接收左侧面板最小化
    this.messsageBus.on('submitZoomEvent', (isZoomBtn: boolean) => {
      this.isMinimize = isZoomBtn;
    });
    // 当气象弹窗出现左侧面板收起
    this.messsageBus.on('queryWeatherMore', (showflag: any) => {
      if (showflag) {
        this.$store.commit(
          'panelMutualExclusionMudule/setpanelMutualExclusion',
          { largeLeftPanel: { showFlag: false } },
        );
      }
    });
    this.messsageBus.on('openDeriveVie', (data: any) => {
      if (this.changeItem.componetName === data.data.componetName) {
        this.deriveViewList = data.visible;
      } else {
        this.deriveViewList = data.visible;
        this.changeChecked(data.data);
      }
    });
    /*const self: any = this; // 安全生产专题 危化品出详情窗版
    /!**
     * 这里判断vuex里面有没有值 来判断安全生产事件需要展开详情窗
     * 弹出窗后清空vuex 里面的数据 防止下次换弹窗儿不需要vuex的数据没有清空 再次打开
     * 如果有数据 那么isShow需要是false
     * 调用gis 的openpopup方法 传详情框信息过去 , 然后去layoutMain里面接收 this.messsageBus 接收
     * *!/
    const inEventData: any = self.$store.state.eventPushStore.eventLocation.inEventInfoPopup;
    const eventType: any = self.$store.state.eventPushStore.eventLocation.EventType;
    if (inEventData && inEventData.popupData && inEventData.popupType && self.safetyProductionList[eventType] && this.safetyProductionArr.includes(inEventData.popupType)) {
      self.getComponent().openPopup(inEventData.popupType, inEventData.popupData);
      self.$store.state.eventPushStore.eventLocation.inEventInfoPopup = {
        popupData: null,
        popupType: '',
      };
      self.$nextTick(() => {
        self.isShow = false;
      });
    }*/
  }
}
</script>
<style scoped lang="less">
@import url('../../../assets/css/decisionSupport/halfScreen.icon.less');
@url: '../../.././assets/img/halfScreen/nav';
* {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 6px;
  border-radius: 5px;
  opacity: 0.64;
}

::-webkit-scrollbar-track {
  width: 6px;
  height: 3px;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  width: 6px;
  height: 3px;
  background: rgba(58, 250, 252, 0.2);
  border-radius: 4px;
}

.rightPanelShrink-btn {
  width: 62px;
  height: 62px;
  display: inline-block;
}
.rightPanelShrink-btn.reserve {
  transform: scale(-1, 1);
}
// .unNormalRight-default{}
.right_box_hide {
  line-height: 33px;
  text-align: center;
  position: absolute;
  bottom: 50px;
  left: 3px;
  color: #9ff5ff;
  cursor: pointer;
  z-index: 10;
}
.right_side_function {
  position: fixed;
  left: 0px;
  z-index: 9;
  top: 70px;
  display: flex;
  bottom: 0px;
  pointer-events: none;
  .right_box_show {
    width: 31px;
    height: 50px;
    position: absolute;
    bottom: 80px;
    left: 35px;
    cursor: pointer;
    transform: rotate(180deg);
  }
  .right_sidebar.right_sidebar--single {
    display: none;
  }
  .right_sidebar.right_sidebar--single + .right_function_box {
    margin-left: 10px;
    overflow: hidden;
  }
  .right_sidebar {
    position: relative;
    margin-right: 5px;
    width: 72px;
    height: 100%;
    background-size: 100% 100%;
    padding-top: 68px;
    box-sizing: border-box;
    text-align: center;
    pointer-events: auto;
    .right_sidebar_txt {
      background-image: -webkit-linear-gradient(left, #7bfaff, #ffffff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .testChecked {
      .right_sidebar_txt {
        background-image: -webkit-linear-gradient(left, #fafba4, #ffffff);
      }
    }
    &:after {
      content: '';
      position: absolute;
      top: 0px;
      bottom: 0;
      width: 100%;
      background: url('@{url}/nav_bg.png') no-repeat 0 0;
      z-index: -1;
      left: 0;
      transform: scale(-1, 1);
      background-size: 100% 100%;
    }

    &_itme {
      // margin-top:5px;
      display: inline-block;
      width: 52px;
      height: 165px;
      color: #fff;
      // border: 1px solid #338af8;
      // outline: 1px solid red;
      background: url('@{url}/nav_item_bg.png') no-repeat 0 0;
      background-size: 100% 100%;
      // overflow-y:auto;
      // background-color: rgba(64, 125, 206, 0.5);
      // box-shadow: inset 0 0 30px #338af8;
      // border-radius: 5px;
      white-space: nowrap;
      overflow: hidden;
      // padding-top:8px;
      box-sizing: border-box;
      cursor: pointer;
      writing-mode: vertical-lr;
      writing-mode: tb-lr;
      text-align: center;
      // font-size: 26px;
      padding-left: 7px;
      &:not(:first-child) {
        margin-top: -5px;
      }

      &.testChecked,
      &:hover {
        background-image: url('@{url}/nav_item_bg_h.png');
      }
    }
  }

  .right_function_box_w {
    position: relative;
    border-radius: 5px;
    background: url('../../../assets/img/default/panel/half_bg.png') no-repeat;
    // background-size: 390px 844px;
    background-size: 100% auto;
  }

  .right_function_box {
    height: calc(100% - 160px);
    box-sizing: border-box;
    margin-top: 85px;
    width: 390px;
    overflow: hidden;
    pointer-events: auto;
    .right_function_box_item {
      width: 400px;
      height: 33%;
      margin-right: 10px;
      // margin-left:-15px;
      > .zbxy {
        height: 100%;
        // transform: scale(.9);
      }
    }
  }
}
</style>
