<!-- 16比9 右侧的功能性工具条 -->
<template>
<div>
    <div class="switchShrinkPanel-btn" @click="smallButtonBox">
        <span class="rightPanelShrink-btn shrinkPanel-btn_bg" v-if="smallButtonBoxShow">
        </span>
        <span  class="rightPanelShrink-btn reserve shrinkPanel-btn_bg"  v-else >
        </span>
    </div>
    <div class="right_side_function"  v-show="smallButtonBoxShow">
      <!-- 此处高度auto是防止弹窗最小化时标题没有背景图片，高度100% 是防止弹窗完整显示时没有底部边框-->
        <div class="right_function_box right_function_box_w" v-show='this.checkedNum!==0 ' :style="{'height': isMinimize ? '40px' : '95%', 'backgroundSize': isMinimize ? '100% auto' : '100% 100%'}">
            <template v-for="(item) of arrFromConfigNew">
              <component :key="item.key" 
                v-if="item.checked"  
                :is="item.componetName" 
                :componentParam="item.componentParam?item.componentParam:{}"
                :style="{'height': isMinimize ? '40px' : '95%'}"
              ></component>
            </template>
            <!-- <el-scrollbar class="cmp-scrollbar-y" style="height:100%"> -->

                <!-- <div class="right_function_box_item" :class="enlargeHeight ? 'right_function_box_item_enlarge' : ''" v-for="(item) of arrFromConfigNew" :key="item.key" :data-type="item.key" v-if="item.checked" >
                    <div class="zbxy">
                        <PanelView v-if="item.componetName !== 'EmergencyResource'" :title="item.name" class="cmp-panel-cnt--bg" :class="enlargeHeight?' toBigBg' :' '">
                            <component :is="item.componetName" :componentParam="item.componentParam?item.componentParam:{}"></component>
                        </PanelView>
                        <component v-else :is="item.componetName" :componentParam="item.componentParam?item.componentParam:{}"></component>
                        <span v-if="item.enlarge" class="enlarge_button" :class="enlargeHeight ? 'toSmallBtn' : 'toBigBtn'" @click="enlargeButton(item)"></span>
                    </div>
                </div> -->
            <!-- </el-scrollbar> -->
        </div>
        <!--{{arrFromConfig}}-->
        <div class="right_sidebar">
            <el-scrollbar style="height:calc(100% - 120px)">
                <!-- <span style="color:red; position:absolute;top:40px;left:0;font-size:30px;">{{checkedNum}}<br>{{smallButtonBoxShow}}</span> -->
                <div class="right_sidebar_itme" @click="changeChecked(item,index)" v-for="(item,index) of arrFromConfigNew"
                    :key="item.key"
                    :class="{testChecked:item.checked,'alertDataImg': isReload&&(item.componetName==='MonitorWarningNormal' || item.componetName==='MonitorWarningForestFire'|| item.componetName==='MonitorWarningEarthQuake' )}">
                    <span class="halfScreenNav_icon" :class="'halfScreenNav_'+item.icon"></span>
                    <span class="right_sidebar_txt  f-txt-com">{{item.name}}</span>
                </div>
            </el-scrollbar>
        </div>

    </div>
</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { messsageBus } from '@/util/message';
import EventConfigRegistry from '@/util/eventConfigRegistry';
// 常态下
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import Vedio from '@/components/feature/vedio/realtimeVideo.vue'; // 新闻报道
import EmergencyResource from '@/views/theme/decisionSupport/module/normalLeft/emergencyResources.vue'; // 应急资源
import DutyInfo from '@/components/feature/managementOnDuty/dutyInfo.vue'; // 值班信息
import EarlywarningInfo from '@/components/feature/common/warningInfo/earlywarningInfo.vue'; // 预警信息
import IntelligenceAssistance from '@/components/feature/IntelligenceAssistance/IntelligenceAssistance.vue'; // 情报辅助
import HistoricalEarthquake from '@/components/feature/historicalEarthquake/HistoricalEarthquake.vue'; // 历史地震
// import MonitorWarning from '@/components/feature/flood/MonitorWarning/MonitorWarning.vue'; // 监测预警
import DefensivePreparation from '@/components/feature/flood/DefensivePreparation/DefensivePreparation.vue'; // 防御准备
import RiverWaterSystem from '@/components/feature/flood/RiverWaterSystem/RiverWaterSystem.vue'; // 河网水系
// 地震下
// import KnownDisaster from '@/components/feature/earthquake/knownDisaster/knownDisaster.vue';
import EventInfoDetailHalf from '@/views/theme/decisionSupport/module/gisModule/enentInfo/EventInfoDetailHalf.vue'; // 事件信息
import KnownDisaster from '@/views/theme/decisionSupport/module/unNormalLeft/knownDisasterSituation.vue'; // 实时灾情
import EarlyWarning from '@/views/theme/decisionSupport/module/gisModel/normal/instantiation/EarlyWarning.vue'; // 监测预警
import Progress from '@/views/theme/decisionSupport/module/unNormalLeft/progress.vue'; // 进展情况
// 台风信息
import TyphoonInfoContainer from '@/components/feature/typhoonInfo/TyphoonInfoContainer.vue';
import TyphoonMonitoring from '@/components/feature/typhoonMonitoring/TyphoonMonitoring.vue'; // 台风监测
import RiskHiddenView from '@/components/feature/riskHiddenView/RiskHiddenView.vue'; // 风险隐患
import NewEmergencyResource from '@/components/feature/riskHiddenView/EmergencyResource.vue'; // 新的风险隐患
import EntrenchTarget from '@/components/feature/riskHiddenView/EntrenchTarget.vue'; // 防护目标
import SenResistantLayer from '@/components/feature/riskHiddenView/SenResistantLayer.vue'; // 森防图层
import floodcontroldrought from '@/components/feature/riskHiddenView/floodcontroldrought.vue'; // 防汛抗旱
import geologicalearthquake from '@/components/feature/riskHiddenView/geologicalearthquake.vue'; // 地质地震
import AidDecisionMaking from '@/components/feature/AidDecisionMaking/AidDecisionMaking.vue'; // 辅助决策
import MonitorWarningNormal from '@/components/feature/flood/MonitorWarning/MonitorWarningNormal.vue'; // 监测预警防汛
import MonitorWarningForestFire from '@/components/feature/forestFireYantai/MonitorWarning/MonitorWarningForestFire.vue'; // 森林防火监测预警
import MonitorWarningEarthQuake from '@/components/feature/earthquakeYantai/MonitorWarning/MonitorWarningEarthQuake.vue'; // 森林防火监测预警
import { monitorWarningServer } from '@/api/feature/monitorwarning/installServer';
import { nomalLeftServer } from '@/api/installServer';
// 通用下
@Component({
  name: 'FunToolHalf',
  components: {
    AidDecisionMaking, // 辅助决策
    PanelView,
    DutyInfo, // 值班信息
    EarlywarningInfo, // 预警信息
    EmergencyResource, // 应急资源
    KnownDisaster, // 实时灾情
    EarlyWarning, // 监测预警
    Vedio, // 新闻报道
    Progress, // 进展情况
    EventInfoDetailHalf, // 事件信息
    IntelligenceAssistance, // 情报辅助
    HistoricalEarthquake, // 历史地震
    // MonitorWarning, // 监测预警
    DefensivePreparation, // 防御准备
    RiverWaterSystem, // 河网水系
    TyphoonInfoContainer, // 台风信息
    TyphoonMonitoring, // 台风监测
    RiskHiddenView,
    NewEmergencyResource, // 应急资源
    EntrenchTarget, // 防护目标
    MonitorWarningNormal, // 监测预警
    SenResistantLayer,  // 森防图层
    floodcontroldrought, // 防汛抗旱
    geologicalearthquake, // 地质地震
    MonitorWarningForestFire, // 森林防火监测预警
    MonitorWarningEarthQuake, // 地震下的监测预警
  },
})
export default class FunToolHalf extends Vue {
  private isMinimize: boolean = false;  // 控制窗口展开和隐藏
  private arrFromConfigNew: any[] = [];
  private allShow: boolean = false;
  private smallButtonBoxShow = false;
  private smallButtonBoxShowAll = true;
  private enlargeHeight = false;
  private checkedNum = 0;
  private isShowRight = false;
  private timer: any = null; // 防汛定时器
  private keyMap: any = [];
  private isReload: boolean = false;
  private alertDataNum: number = 0; // 告警总数
  private leftPanelShowRight = {
    windFieldLegendLocation: 'right: 1207px;', // 风场图例的位置
    historicalEarthquakeLocation: 'right: 1500px;', // 历史地震图例的位置
    TyphoonLocation: 'right: 1500px;', // 台风图例的位置
  };
  private leftPanelShowLeft = {
    windFieldLegendLocation: 'right: 1615px;', // 风场图例的位置
    historicalEarthquakeLocation: 'right: 1095px;', // 历史地震图例的位置
    TyphoonLocation: 'right: 990px;', // 台风图例的位置
  };
  private rightPanelShowRight = {
    ToolbarLocation: 'right: 0px;', // 顶部工具条位置
    experienceCirclePosition: 'right: 11.5%;', // 经验圈设置的位置
    cityListLocation: 'right: 160px;', // 城市列表的位置
    onlineBoxAndVideoViewLocation: 'right:160px;', // 周边查询面板的位置
    isShowquanjing: true, // 百度全景按钮
    RegionSelection: 'right: 70px;', // 图层选择的面板的位置
    playShaftLayer: 'right: 490px;', // 播放轴位置
    plottingLocation: '165px',
  };
  private rightPanelShowCenter = {
    ToolbarLocation: 'right: 60px;',
    experienceCirclePosition: 'right: 11.5%;',
    cityListLocation: 'right: 160px;',
    onlineBoxAndVideoViewLocation: 'right: 165px;',
    // peripheralQueryLocation: 'left: 452px;',  // 周边查询位置
    isShowquanjing: true,
    RegionSelection: 'right: 130px;', // 图层选择的面板的位置
    playShaftLayer: 'right: 550px;', // 播放轴位置
    plottingLocation: '165px',
  };
  private rightPanelShowLeft = {
    ToolbarLocation: 'right: 510px;',
    experienceCirclePosition: 'right: 37.5%',
    cityListLocation: 'right: 520px;',
    onlineBoxAndVideoViewLocation: 'right:520px;',
    plottingLocation: '520px',
    isShowquanjing: false,
    RegionSelection: 'right: 545px;', // 图层选择的面板的位置
    playShaftLayer: 'right: 935px;', // 播放轴位置
  };

  @Watch('arrFromConfigNew', {deep: true})
  private resetMinimize(val: any) {
   this.isMinimize = false;
  }

  // 判断当前点击的是哪一个key
  private changeChecked(item: any, index: number) {
    if (this.enlargeHeight) {
      this.enlargeHeight = false;
    }
    if (this.smallButtonBoxShow) {
      // 当面板存在时顶部右侧gis工具容器
      this.$store.commit(
        'panelPositionChangeModule/settopToolbarLocation',
        this.rightPanelShowLeft,
      );
    }
    if (item.checked === true) {
      // 关闭地图弹框
      this.messsageBus.emit('leftMapPanelMutexContrary', false);
      if (item.componetName === 'EarlywarningInfo') {
        // 当取消预警信息面板以后预警弹框也要消失
        this.messsageBus.emit('earlyWarningFrame', false);
      }
      this.arrFromConfigNew[index].checked = !item.checked;
      this.checkedNum--;
      if (this.checkedNum === 0) {
        this.smallButtonBoxShowAll = false;
        // 当面板存在时gis工具容器以及周边查询位置
        this.$store.commit(
          'panelPositionChangeModule/settopToolbarLocation',
          this.rightPanelShowCenter,
        );
      }
    } else {
      this.smallButtonBoxShowAll = true;
      const j = this.arrFromConfigNew.length;
      // if (this.checkedNum === 3) {
      if (this.checkedNum === 1) {
        // 这个地方原来是三，现在改成1，这样最多就只可以选1个了
        for (var k = 0; k < j; k++) {
          if (this.arrFromConfigNew[k].checked === true) {
            this.arrFromConfigNew[k].checked = !this.arrFromConfigNew[k].checked;
            break;
          }
        }
        // this.checkedNum = 3;
        this.checkedNum = 1;
      } else {
        this.checkedNum++;
      }
      this.arrFromConfigNew[index].checked = !item.checked;
    }

    if (item.key === 'jinzhanqk' && item.checked === false) {
      this.messsageBus.emit('closeProgressDetails');
    }
    if (
      this.arrFromConfigNew.findIndex(
        (target: any) => target.checked === true,
      ) === -1
    ) {
      //  在森火专题下如果右侧小窗口全部关闭天气面板出现
      this.messsageBus.emit('isShowWeatherRight', true);
    } else {
      this.messsageBus.emit('isShowWeatherRight', false);
    }
    this.updatedLengedLoca();

    if (this.checkedNum <= 2) {
      this.messsageBus.emit('EarthQuakePlanel', true);
    } else if (this.checkedNum >= 3) {
      this.messsageBus.emit('EarthQuakePlanel', false);
    }
    // 清除播放图层
    this.$store.commit('mapTools/changeShowLayerPlay', false);
  }

  // 更新图例的位置。
  private updatedLengedLoca() {
    // 面板选中个数小于3时，当面板存在时图例位置
    // if (this.checkedNum < 3 && !this.enlargeHeight) {
    if (this.checkedNum < 1 && !this.enlargeHeight) {
      // 这里原来是3，现在改成1
      this.$store.commit(
        'panelPositionChangeModule/setbotLegendLocation',
        'right: 135px;',
      );
      this.$store.commit(
        'panelPositionChangeModule/setrightPanelPosition',
        this.leftPanelShowRight,
      );
      // } else if (this.smallButtonBoxShow || this.checkedNum === 3 || this.enlargeHeight) {
    } else if (
      this.smallButtonBoxShow ||
      this.checkedNum === 1 ||
      this.enlargeHeight
    ) {
      this.changeLegendLocation(!this.smallButtonBoxShow);
      this.$store.commit(
        'panelPositionChangeModule/setrightPanelPosition',
        this.leftPanelShowLeft,
      );
    }
  }

  // 点击缩小按钮
  private smallButtonBox() {
    this.smallButtonBoxShow = !this.smallButtonBoxShow;
    if (this.smallButtonBoxShow === true) {
      // 当右侧面板打开头部天气栏隐藏
      this.messsageBus.emit('weatherPanelHide', false);
      // 当右侧大面板存在时，将值存到vuex里面，与其他面板做互斥
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
        largeRightPanel: { showFlag: true },
      });
      // this.messsageBus.emit('EarthQuake', true);
      if (this.checkedNum >= 3) {
        this.messsageBus.emit('EarthQuakeRight', true);
      } else if (this.checkedNum <= 2) {
        this.messsageBus.emit('EarthQuakePlanel', true);
      }
    } else {
      // 如果关闭了右侧面板头部的天气栏展开
      this.messsageBus.emit('weatherPanelOpen', true);
      // 当右侧大面板不存在时，将值存到vuex里面，与其他面板做互斥
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
        largeRightPanel: { showFlag: false },
      });

      if (this.checkedNum >= 3) {
        this.messsageBus.emit('EarthQuakeRight', false);
      } else if (this.checkedNum <= 2) {
        this.messsageBus.emit('EarthQuakeRight', false);
      }
    }
  }

  // 点击放大按钮
  private enlargeButton(data: any) {
    // 当按钮放大以后此时面板只展示一个
    const j = this.arrFromConfigNew.length;
    for (var k = 0; k < j; k++) {
      if (this.arrFromConfigNew[k].checked === true) {
        this.arrFromConfigNew[k].checked = !this.arrFromConfigNew[k].checked;
      }
    }
    data.checked = true;
    this.checkedNum = 1;
    this.enlargeHeight = !this.enlargeHeight; // 判断面板高度的改变
    // 当面板存在时图例位置
    this.changeLegendLocation(!this.enlargeHeight);
  }

  // 从配置文件中，拿到当前灾种的右侧按钮数组
  @Watch('$store.state.configModel.config')
  private arrFromConfigNewFun(val: any) {
    const data: any = JSON.parse(JSON.stringify(val));
    if (!data.funcPanel.length) {
      return;
    }
    this.arrFromConfigNew = data.funcPanel;
    // this.checkedNum = this.arrFromConfigNew.length > 3 ? 3 : this.arrFromConfigNew.length;
    const checkedFilter = this.arrFromConfigNew.filter(
      (item: any, index: number) => {
        return item.checked;
      },
    );
    this.checkedNum = checkedFilter.length > 3 ? 3 : checkedFilter.length;
    clearInterval(this.timer);
    this.alertDataNum = 0;
    this.isReload = false;
    // 切换专题时还原顶部工具栏的位置
    this.$store.commit(
          'panelPositionChangeModule/settopToolbarLocation',
          this.rightPanelShowCenter,
        );
    // 关闭火点信息面板火情信息列表弹框
    this.$store.commit('mapTools/changeShowFireList', {isShow: false});
    this.arrFromConfigNew.forEach((item: any) => {
      if (item.componetName === 'MonitorWarningNormal') {
        this.keyMap = ['weatherWarningNum', 'rainWarningNum', 'reservoirWarningNum', 'riverWarningNum', 'windWarningNum'];
        this.getAlertData();
        this.timerFunction();
      } else if (item.componetName === 'MonitorWarningForestFire') {
          // 请求配置文件对应的初始数据
          nomalLeftServer.getInitDataSenResistant().then((res: any) => {
            this.addMapdotChecked(res.data[0]);
          });
          this.keyMap = ['fireTotalNum', 'fireWeatherWarningNum', 'rainWarningNum', 'windWarningNum'];
          this.getAlertData();
        // 定时刷新
          this.timerFunction();
      }  else if (item.componetName === 'MonitorWarningEarthQuake') {
          this.keyMap = ['fireWeatherWarningNum', 'rainWarningNum'];
          this.getAlertData();
        // 定时刷新
          this.timerFunction();
      } else {
        // 清理地图图层图标
        if (this.getComponent()) {
          this.getComponent()._clearLayers();
        }
      }
    });
  }
  // 定时刷新
  private timerFunction() {
    this.timer = setInterval(() => {
      this.getAlertData();
      }, 1000 * 60 * 10);
  }
  private changeLegendLocation(data: any) {
    if (data) {
      this.$store.commit(
        'panelPositionChangeModule/setbotLegendLocation',
        'right: 135px;',
      );
    } else {
      this.$store.commit(
        'panelPositionChangeModule/setbotLegendLocation',
        'right: 540px;',
      );
    }
  }

  // 监听右侧大面板的显隐
  @Watch('$store.state.panelMutualExclusionMudule.panelMutualExclusion', {
    deep: true,
  })
  private changelargeRightPanel(val: any) {
    this.smallButtonBoxShow = val.largeRightPanel.showFlag;
    this.updatedLengedLoca(); // 图例位置
    if (this.smallButtonBoxShow) {
      const j = this.arrFromConfigNew.length;
      let i = 0;
      for (var k = 0; k < j; k++) {
        if (this.arrFromConfigNew[k].checked === true) {
          i++;
        }
      }
      if (i > 0) {
        this.$store.commit(
          'panelPositionChangeModule/settopToolbarLocation',
          this.rightPanelShowLeft,
        );
      } else {
        this.$store.commit(
          'panelPositionChangeModule/settopToolbarLocation',
          this.rightPanelShowCenter,
        );
      }
    } else {
      this.$store.commit(
        'panelPositionChangeModule/settopToolbarLocation',
        this.rightPanelShowRight,
      );
    }
  }

  // 监听到 对应 eventId 变化，切换到战时屏
  @Watch('$store.state.eventPushStore.eventId')
  private switchModelNormal(eventId: string) {
    if (eventId) {
      // 战时、右侧面板为收起状态
      this.smallButtonBoxShowAll = true;
      // this.checkedNum = this.arrFromConfigNew.length > 3 ? 3 : this.arrFromConfigNew.length;
      const checkedFilter = this.arrFromConfigNew.filter(
        (item: any, index: number) => {
          return item.checked;
        },
      );
      this.checkedNum = checkedFilter.length > 3 ? 3 : checkedFilter.length;
      // 当右侧大面板不存在时，将值存到vuex里面，与其他面板做互斥
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
        largeRightPanel: { showFlag: false },
      });
    }
  }

  private created() {
    this.changelargeRightPanel(
      this.$store.state.panelMutualExclusionMudule.panelMutualExclusion,
    ); // 监听当前面板的显隐
    this.arrFromConfigNewFun(this.$store.state.configModel.config);
    this.switchModelNormal(this.$store.state.eventPushStore.eventId);
  }
  // 防汛专题下
  private getAlertData() {
    const self = this;
    monitorWarningServer.getWarningStatistics({}).then((result: any) => {
      console.log(result.data, 99999999999999999999);
      const data: any = result.data;
      self.alertDataNum = 0;
      self.keyMap.forEach((item: any) => {
       self.alertDataNum += data[item] * 1;
     });
      if (self.alertDataNum > 0) {
      //  alert(1);
      self.isReload = true;
     } else {
       self.isReload = false;
     }
    });
  }
  private beforeDestroy() {
    clearInterval(this.timer);
  }
  // 文字点击多选上图
  private addMapdotChecked(data: any) {
    this.messsageBus.emit('eventInfoMapShow', false);
    // 树种结构
    // this.getComponent1().addLayer('ForestTreeStructureLayer');
    // 森林防火区域
    // this.getComponent1().addLayer('ForestFireAreaLayer');
    // 森林资源图层
    // this.getComponent1().addLayer('ForestResourceLayer');

    // 清除对应图层（ForestTreeStructureLayer、ForestFireAreaLayer、ForestResourceLayer）
    // this.getComponent1().removeLayer('ForestTreeStructureLayer');
    if (
      data.tabTitle === '全市森林防火重点区域' ||
      data.tabTitle === '全市森林资源分布图' ||
      data.tabTitle === '全市树种结构分布图'
    ) {
      this.addSenCoverage(data);
    } else {
      this.getComponent().showResource(data.codeKey);
    }
    // 取消弹窗列表
    this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
  }
  private addSenCoverage(data: any) {
    let key: any;
    let obj: any;
    switch (data.title) {
        case '全市森林防火重点区域':
          key = 'ForestFireAreaLayer';
          break;
        case '全市森林资源分布图':
          key = 'ForestResourceLayer';
          obj = {
            id: 'ForestResources',
            name: '森林资源',
          };
          break;
        case '全市树种结构分布图':
          key = 'ForestTreeStructureLayer';
          obj = {
            id: 'TreeStructure',
            name: '树种结构',
          };
          break;
        default:
          break;
      }
    this.getComponent1().addLayer(key);
    if (obj) {
        this.$store.commit('mapTools/addSelectedLayer', {
          id: obj.id,
          name: obj.name,
          play: false,
          legend: { component: obj.id },
        });
      }
  }
  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    let component: any = null;
    if (factory) {
      component = factory.normalFactory.getComponent('ResourceComponent');
    }
    return component;
  }
  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
    return component;
  }
  private minimizeComponent(e: any) {
    this.isMinimize = !this.isMinimize;
  }

  private mounted(): void {
    // 接收左侧面板最小化
    this.messsageBus.on('submitZoomEvent', (isZoomBtn: boolean) => {
      this.isMinimize = isZoomBtn;
    });
  }
}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/halfScreen.icon.less');
@url: '../../.././assets/img/halfScreen/nav';
@panel: '../../../assets/img/default/panel';
@iconUrl: '../../../assets/img/gisModule/PopulationFeverBox';
@panelProgressBg: '../../../assets/img/default/panel/panel_progress.png';
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
.switchShrinkPanel-btn {
  position: fixed;
  bottom: 50px;
  right: 7px;
  z-index: 10;
  // width:30px;
  // height:30px;
  cursor: pointer;
}
.rightPanelShrink-btn {
  width: 62px;
  height: 62px;
  display: inline-block;
}
.rightPanelShrink-btn.reserve {
  transform: scale(-1, 1);
}
.right_side_function {
  display: flex;
  position: fixed;
  right: 0px;
  z-index: 200;
  top: 70px;
  bottom:0px;
  pointer-events: none;
  // outline:1px solid red;
  // background: #2c3e50;
  .right_function_box_w {
    // margin-right:10px;
    // padding-bottom:8px;
    // border: 1px solid #338af8;
    // overflow-y: auto;
    overflow: hidden;

    // background-color: rgba(64, 125, 206, 0.5);
    // border-radius: 5px;
    // background:url('@{url}/panel_img.png') repeat;
    // box-shadow: inset 0 0 0 2px rgba(2,178,229,.87), 0 0 10px rgba(0,25,75,.5);
  }
  .right_function_box_small_button {
    width: 31px;
    height: 50px;
    position: absolute;
    top: 19px;
    right: 85px;
    float: right;
    color: #9ff5ff;
    z-index: 1;
    pointer-events: auto;
  }
  .right_function_box_small_shink {
    width: 31px;
    height: 50px;
    // background: #00ff00;
    position: absolute;
    bottom: 65px;
    right: 35px;
    cursor: pointer;
    z-index: 1;
    pointer-events: auto;
  }
  .tominiBtn {
    // margin-left:95px;
    margin-top: 0px;
    display: block;
    pointer-events: auto;
  }

  .right_function_box_shink {
    width: 31px;
    height: 50px;
    // background: #00ff00;
    position: absolute;
    z-index: 1;
    pointer-events: auto;
    // outline: 10px solid red;
    display: inline-block;
    z-index: 4;
    right: 0;
  }

  .right_function_box_w {
    pointer-events: auto;
    position: relative;
    border-radius: 5px;
    background: url('../../../assets/img/default/panel/half_bg.png') no-repeat;
    // background-size: 440px 959px;
    background-size: 100% 100%;
  }

  .right_function_box {
    width: 440px;
    height: calc(100% - 25px);
    box-sizing: border-box;
    margin-top: 17px;
    .right_function_box_item.right_function_box_item_enlarge {
      height: calc(100% - 10px);
      .toBigBg {
        background-image: url('@{panelProgressBg}');
        background-position: 50% 0;
      }
    }
    .right_function_box_item {
      pointer-events: auto;
      width: 440px;
      height: calc(33.3333% - 8px);
      // margin-right:10px;
      // margin-left:-23px;
      margin-bottom: 8px;
      > .zbxy {
        height: 100%;
        // transform: scale(.9);
        position: relative;
        .enlarge_button.enlarge_button_small {
          background: #ff0;
          &:hover {
            background: #f0f;
          }
        }
        .enlarge_button {
          cursor: pointer;
          position: absolute;
          top: 8px;
          right: 2px;
          display: inline-block;
          width: 61px;
          height: 23px;
        }
        .toBigBtn {
          background: url('@{panel}/toBig.png') no-repeat 50% 50%;
          background-size: 100% 100%;
          &:hover {
            background-image: url('@{panel}/toBig_h.png');
          }
        }
        .toSmallBtn {
          top: 11px;
          background: url('@{panel}/toSmall.png') no-repeat 50% 50%;
          background-size: 100% 100%;
          &:hover {
            background-image: url('@{panel}/toSmall_h.png');
          }
        }
      }
    }
  }

  .right_sidebar {
    pointer-events: auto;
    position: relative;
    margin-left: 5px;
    width: 72px;
    height: 100%;
    background-size: 100% 100%;
    padding-top: 70px;
    box-sizing: border-box;
    text-align: center;
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
      top: 0;
      bottom: 0;
      width: 100%;
      background: url('@{url}/nav_bg.png') no-repeat 0 0;
      z-index: -1;
      left: 0;
      background-size: 100% 100%;
    }

    &_itme {
      // margin-top:5px;
      display: inline-block;
      user-select: none;
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
      // font-size:26px;
      padding-left: 8px;
      &:not(:first-child) {
        margin-top: -5px;
      }

      &.testChecked,
      &:hover {
        background-image: url('@{url}/nav_item_bg_h.png');
      }
    }
  }
}

// .halfScreenNav_yjxx{
//     background-position: -96px 0;
// }
</style>
