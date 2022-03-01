<template>
<div class="yj-nav-wrap">

  <template v-if="isShrink" >
    <div class=" yj-nav-btn-shrink-btn" @click="toShrink()"></div>
  </template>  
  <nav v-else>
    <span v-show = "!isShrink" class="yj-nav-btn-shrink" @click="toShrink()"></span>
    <ul class="yj-navBtn">
      <li
        :class="{ curMenuNav: current === index }"
        v-for="(item, index) of list"
        :key="item.key"
        @click="changeNav(index, item.componentname)"
      >
        <div v-if="item.total !== 0" class="dot-total">{{ item.total }}</div>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </li>
    </ul>
    <div class="yj-childNav">
      <span :class="{ right_tab1: true, tabactive: !childindex }" @click="changePanel('0')">
        <i>视频信息</i>
      </span>
      <span :class="{ right_tab2: true, tabactive: childindex }" @click="changePanel('1')">
        <i>图表信息</i>
      </span>
    </div>
  </nav>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { messsageBus } from '@/util/message';
import {disasterDecideMap} from '@/views/disasterDecide/disasterDecideMap' ;
import {rescueHelpMap} from '@/views/rescueHelp/rescueHelpMap' ;
import {disasterStatisticsMap} from '@/views/disasterStatistics/disasterStatisticsMap';
import { clearPeripheral , clearPathPlanning , closeRightVideo , mapUtilFun } from '@/views/common/nvaUtil/nvaUtil' ;
@Component
export default class Right extends Vue {
  // 全屏地图隐藏nva 按钮  //  勿删
  private isShrink = true;

  // 把工具条的数据进行存储
  private toolConfigCache: any = {
    toolIndexCache: '', // 这个我也不知道是啥，反正半屏全屏切换的时候，刷新工具条要用的。
    toolCommonArr: [], // 这个是存放的那几列工具条,那三列
    toolSpecArr: [], // 灾情研判的那列，其实就是最后一列
  };

  private list: any[] = [
    {
      title: '灾损研判',
      key: 'disasterDecide',
      componentname: 'eqT1Rightzqyp',
      navconfigValue: 'DisasterResearchModule',
      total: 0,
    },
    {
      title: '灾损统计',
      key: 'disasterStatistic',
      componentname: 'eqT1Rightzstj',
      navconfigValue: 'DisasterCensusModule',
      total: 0,
    },
    {
      title: '救援救助',
      key: 'rescueHelp',
      componentname: 'eqT1Rightjyhelp',
      navconfigValue: 'RescueAssistanceModule',
      total: 0,
    },
    {
      title: '救援进展',
      key: 'resuceProgress',
      componentname: 'eqT1Rightjyprogress',
      navconfigValue: 'RescueJinZhanModule',
      total: 0,
    },
  ];
  private navconfig: any = {
    DisasterResearchModule: [
      {
        title: '行政区划',
        key: '_district',
        iconName: 'YJ-navIcon-rowA1',
        isMutex: false,
        total: 0,
        leftComponentName: 'DistrictLeftDialog',
        rightComponentName: 'DistrictRightDialog',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '地形地貌',
        key: '_disasterstyle',
        iconName: 'YJ-navIcon-rowA2',
        isMutex: false,
        total: 0,
        leftComponentName: '',
        rightComponentName: '',
        is2d: '3d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '人口分布',
        key: '_popluheat',
        iconName: 'YJ-navIcon-rowA3',
        isMutex: false,
        total: 0,
        leftComponentName: 'PopulationFeverBox',
        rightComponentName: 'PopulationFeverList',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '人员密集场所',
        iconName: 'YJ-navIcon-Proget',
        key: '_PersonnelIntensive',
        leftComponentName: 'CrowdedPlace',
        list: [
          {
            title: '学校',
            key: 'school',
            iconName: 'schoolspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterSchool',
            rightComponentName: 'DisaterSchoolList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '医院',
            key: 'hospital',
            iconName: 'hospitalspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterHospital',
            rightComponentName: 'DisasterHospitalList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '机场',
            key: 'airport',
            iconName: 'airportspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterPlane',
            rightComponentName: 'DisasterPlaneList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '火车站',
            key: 'railwaystation',
            iconName: 'railwaystationspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterTrain',
            rightComponentName: 'DisasterTrainList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
        ],
      },
      {
        title: '企业',
        key: '_company',
        iconName: 'YJ-navIcon-rowA10',
        leftComponentName: 'GeneralCompany',
        list: [
          {
            title: '危化企业',
            key: 'hazardous',
            iconName: 'hazardousspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterCompany',
            rightComponentName: 'DisasterCompanyList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '煤矿企业',
            key: 'coalMine',
            iconName: 'coalMinespan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterCoal',
            rightComponentName: 'DisasterCoalList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '非煤矿山',
            key: 'mine',
            iconName: 'minespan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterNoCoal',
            rightComponentName: 'DisasterNoCoalList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '烟花爆竹',
            key: 'explosive',
            iconName: 'explosivespan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterFireworks',
            rightComponentName: 'DisasterFireworksList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
        ],
      },
      {
        title: '重要设施',
        iconName: 'YJ-navIcon-Facility',
        key: '_ImportantFacilities',
        leftComponentName: 'MajarCompany',
        list: [
          {
            title: '水库大坝',
            key: 'reservoir',
            iconName: 'reservoirspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterReservoir',
            rightComponentName: 'DisasterReservoirList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '码头',
            key: 'portwharf',
            iconName: 'portwharfspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterWharf',
            rightComponentName: 'DisasterWharfList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
          {
            title: '核设施',
            key: 'nuclear',
            iconName: 'nuclearspan',
            isMutex: false,
            total: 0,
            leftComponentName: 'DisasterNucleus',
            rightComponentName: 'DisasterNucleusList',
            is2d: '2d',
            circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
          },
        ],
      },
      {
        title: '力量调度',
        key: 'rescueTeams',
        iconName: 'YJ-navIcon-rescueTeams',
        isMutex: false,
        total: 0,
        leftComponentName: 'DisasterRescueTeams',
        rightComponentName: 'DisasterRescueTeamsList',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '灾情信息员',
        key: 'disinfoper',
        iconName: 'YJ-navIcon-rowB3',
        isMutex: false,
        total: 0,
        leftComponentName: 'DisasterMessenger',
        rightComponentName: 'DisasterMessengerList',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '灾情预估',
        key: '_DisasterJudge',
        iconName: 'YJ-navIcon-DisasterJudge',
        isMutex: false,
        total: 0,
        leftComponentName: 'DisasterPredictionBox',
        rightComponentName: '',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['SIZEUP'],
      },
      {
        title: '应急管理机构',
        key: 'emergencypart',
        iconName: 'YJ-navIcon-emergencypart',
        isMutex: false,
        total: 0,
        leftComponentName: 'DisasterEmergencypart',
        rightComponentName: 'DisasterEmergencypartList',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '指挥调度',
        key: '_CommandDispatch',
        iconName: 'YJ-navIcon-rowB14',
        isMutex: false,
        total: 0,
        leftComponentName: '',
        rightComponentName: 'CommandDispatchView',
        is2d: '2d',
        circleFlag: 'influence',
      },
      // {
      //   title: '住宅区',
      //   key: 'development',
      //   iconName: 'YJ-navIcon-rowA4',
      //   isMutex: false,
      //   total: 0,
      //   leftComponentName: 'DisasterHouse',
      //   rightComponentName: 'DisasterHouseList',
      //   is2d: '2d',
      //   circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      // },

      // {
      //   title: '船舶信息',
      //   key: '_RealShip',
      //   iconName: 'YJ-navIcon-RealShip',
      //   isMutex: false,
      //   total: 0,
      //   leftComponentName: 'DisasterShip',
      //   rightComponentName: '',
      //   is2d: '2d',
      //   circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      // },
      // {
      //   title: '工贸企业',
      //   key: 'industry',
      //   iconName: 'YJ-navIcon-rowA10',
      //   isMutex: false,
      //   total: 0,
      //   leftComponentName: 'DisasterIndustry',
      //   rightComponentName: 'DisasterIndusterList',
      //   is2d: '2d',
      //   circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      // },
      // {
      //   title: '地质灾害隐患点',
      //   key: 'derivativerisk',
      //   iconName: 'YJ-navIcon-rowA11',
      //   isMutex: false,
      //   total: 0,
      //   leftComponentName: 'DisasterGeology',
      //   rightComponentName: 'DisasterGeologyList',
      //   is2d: '2d',
      //   circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      // },
    ],
    DisasterCensusModule: [
      {
        title: '人员伤亡',
        key: '_casualties',
        iconName: 'YJ-navIcon-rowB4',
        isMutex: false,
        total: 0,
        leftComponentName: 'CasualtiesGIS',
        rightComponentName: 'CasualtiesRight', // CasualtiesRight
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['casualties'],
      },
      {
        title: '房屋损毁',
        key: '_housedamage',
        iconName: 'YJ-navIcon-rowB6',
        isMutex: false,
        total: 0,
        leftComponentName: 'HousesDamagedGis',
        rightComponentName: 'HousesDamagedRight', // HousesDamagedRight
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['housesh'],
      },
      {
        title: '失联区域',
        key: '_lostarea',
        iconName: 'YJ-navIcon-rowB5',
        isMutex: false,
        total: 0,
        leftComponentName: 'MissingFlight',
        rightComponentName: 'MissingFlightRight', // MissingFlightRight
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['outofcontact'],
      },
      {
        title: '电力受损',
        key: '_electricdamage',
        iconName: 'YJ-navIcon-rowB7',
        isMutex: false,
        total: 0,
        leftComponentName: 'ElectricDamagedGis',
        rightComponentName: 'ElectricDamagedRight', // ElectricDamagedRight
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['power'],
      },
    ],
    RescueAssistanceModule: [
      {
        title: '力量部署',
        key: 'ForceDeployment',
        iconName: 'YJ-navIcon-rowB8',
        isMutex: false,
        total: 0,
        leftComponentName: '',
        rightComponentName: '',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '救援需求',
        key: 'RescueNeeds',
        iconName: 'YJ-navIcon-rowB9',
        isMutex: false,
        total: 0,
        leftComponentName: 'RescueDemand',
        rightComponentName: 'RescueDemandRight',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['SEND_RESCUEDEMAND'],
      },
      {
        title: '物资需求',
        key: 'MaterialDemand',
        iconName: 'YJ-navIcon-rowB10',
        isMutex: false,
        total: 0,
        leftComponentName: '',
        rightComponentName: '',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
      {
        title: '安置点',
        key: 'ShleterLeft',
        iconName: 'YJ-navIcon-rowB11',
        isMutex: false,
        total: 0,
        leftComponentName: 'ShleterLeft',
        rightComponentName: 'ShelterRight',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['SEND_PERSONNELPLACEMENT'],
      },
      {
        title: '调度部署',
        key: 'Deployment',
        iconName: 'YJ-navIcon-rowB12',
        isMutex: false,
        total: 0,
        leftComponentName: 'Deployment',
        rightComponentName: 'DeploymentRight',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['SEND_HURRYTEAM'],
      },
      {
        title: '物资调拨',
        key: '_MaterialAllot',
        iconName: 'YJ-navIcon-rowB13',
        isMutex: false,
        total: 0,
        leftComponentName: '',
        rightComponentName: '',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
        pushLocationKeyArr: ['equipment_dispatch'],
      },
      {
        title: '调拨建议',
        key: 'DispatchAdvice',
        iconName: 'YJ-navIcon-dbjy',
        isMutex: false,
        total: 0,
        leftComponentName: 'DispatchAdvice',
        rightComponentName: 'DispatchAdviceRightBox',
        is2d: '2d',
        circleFlag: this.$store.state.controlMoudle.mapCircleQueryType,
      },
    ],
    RescueJinZhanModule: [],
  };
  private linkedList: any = {
    0: 'DisasterResearchModule',
    1: 'DisasterCensusModule',
    2: 'RescueAssistanceModule',
    3: 'RescueJinZhanModule',
  };
  private current: number = -1;
  private childindex: number = 0;
  private name: string = 'eqT1Rightzqyp';
  private param = {
    type: 'home',
    leflayout: 'eqT1LeftUnormal',
    rightlayout: 'eqT1RightUnormal',
  };

 /* // 这里后期必须优化，暂时写死
  @Watch('$store.state.eventPushStore.SIZEUP')
  private getSIZEUP(val: any) {
    this.navconfig[this.list[0].navconfigValue][8].total = val;
    if (this.current === 0) {
      this.changeNav(0, this.list[0].componentname);
    }
    this.list[0].total = this.calcListItemTotal(
      this.navconfig[this.list[0].navconfigValue],
    );
  }

  // 这里后期必须优化，暂时写死
  @Watch('$store.state.eventPushStore.casualties')
  private getCasualties(val: any) {
    this.navconfig[this.list[1].navconfigValue][0].total = val;
    if (this.current === 1) {
      this.changeNav(1, this.list[1].componentname);
    }
    this.list[1].total = this.calcListItemTotal(
      this.navconfig[this.list[1].navconfigValue],
    );
  }

  // 这里后期必须优化，暂时写死
  @Watch('$store.state.eventPushStore.outofcontact')
  private getOutofcontact(val: any) {
    this.navconfig[this.list[1].navconfigValue][2].total = val;
    if (this.current === 1) {
      this.changeNav(1, this.list[1].componentname);
    }
    this.list[1].total = this.calcListItemTotal(
      this.navconfig[this.list[1].navconfigValue],
    );
  }

  // 这里后期必须优化，暂时写死
  @Watch('$store.state.eventPushStore.housesh')
  private getHousesh(val: any) {
    this.navconfig[this.list[1].navconfigValue][1].total = val;
    if (this.current === 1) {
      this.changeNav(1, this.list[1].componentname);
    }
    this.list[1].total = this.calcListItemTotal(
      this.navconfig[this.list[1].navconfigValue],
    );
  }

  // 这里后期必须优化，暂时写死
  @Watch('$store.state.eventPushStore.power')
  private getPower(val: any) {
    this.navconfig[this.list[1].navconfigValue][3].total = val;
    if (this.current === 1) {
      this.changeNav(1, this.list[1].componentname);
    }
    this.list[1].total = this.calcListItemTotal(
      this.navconfig[this.list[1].navconfigValue],
    );
  }
  @Watch('$store.state.eventPushStore.SEND_RESCUEDEMAND')
  private getSEND_RESCUEDEMAND(val: any) {
    console.log('SEND_RESCUEDEMAND', val);
    this.navconfig[this.list[2].navconfigValue][1].total = val;
    if (this.current === 1) {
      this.changeNav(2, this.list[2].componentname);
    }
    this.list[2].total = this.calcListItemTotal(
      this.navconfig[this.list[2].navconfigValue],
    );
  }
  @Watch('$store.state.eventPushStore.equipment_dispatch')
  private geteQuipmentDispatch(val: any) {
    this.navconfig[this.list[2].navconfigValue][5].total = val;
    if (this.current === 1) {
      this.changeNav(2, this.list[2].componentname);
    }
    this.list[2].total = this.calcListItemTotal(
      this.navconfig[this.list[2].navconfigValue],
    );
  }
   @Watch('$store.state.eventPushStore.SEND_HURRYTEAM')
  private getSEND_HURRYTEAM(val: any) {
    this.navconfig[this.list[2].navconfigValue][4].total = val;
    if (this.current === 1) {
      this.changeNav(2, this.list[2].componentname);
    }
    this.list[2].total = this.calcListItemTotal(
      this.navconfig[this.list[2].navconfigValue],
    );
  }
  @Watch('$store.state.eventPushStore.SEND_PERSONNELPLACEMENT')
  private getSEND_PERSONNELPLACEMENT(val: any) {
    this.navconfig[this.list[2].navconfigValue][3].total = val;
    if (this.current === 1) {
      this.changeNav(2, this.list[2].componentname);
    }
    this.list[2].total = this.calcListItemTotal(
      this.navconfig[this.list[2].navconfigValue],
    );
  }
*/
  // 这里后期必须优化，暂时写死
  /*private calcListItemTotal(toolNavArr: any) {
    let total = 0;
    toolNavArr.forEach((item: any) => {
      if (item.total > 0) {
        total++;
      }
    });
    return total;
  }*/

  //  地震速报监听
   @Watch('$store.state.eventPushStore.dizhensubao')
  private diZhenSuBaoWatch() {
    this.$store.commit('layoutModule/setChange', {
        type: 'changeTheme',
        index: 0,
      });
  }
    // 收缩导航
  /*private toShrink() {
    this.isShrink = !this.isShrink;
  }*/

  private changeNav(index: number, componentname: string) {
    if (this.current === index) {
      return;
    }
    this.current = index;
    if (index === 0) {
      this.childindex = Number('0');
      this.changePanel(1);
    } else {
      // console.log('开打绘图面板；');
      this.changePanel(1);
    }
    // this.$store.commit('layoutModule/setChange', 'unNormal');
    // 改变工具条内容最后需要push的list
    this.$emit('clickNavItem', this.navconfig[this.list[index].navconfigValue]);
    // 兼容逻辑
    if (this.current === 0) {
       disasterDecideMap.loadData.call(this , this.sendDisasterDecideData , this.current);
    } else if (this.current === 2) {
      rescueHelpMap.loadData.call(this , this.sendDisasterDecideData , this.current);
    } else if (this.current === 1) {
       disasterStatisticsMap.loadData.call(this , this.sendDisasterDecideData , this.current);
    } else {
       this.sendDisasterDecideData(this.navconfig[this.list[index].navconfigValue]);
    }
    this.closeAll();
    // this.messsageBus.emit(
    //   'GisMapToolHandler',
    //   this.list[index].key,
    //   // this.navconfig[this.list[index].navconfigValue],
    //   [
    //     {
    //       component: 'GisSwitchMap',
    //       options: { mapId: 'map', baseLayers: [] },
    //     },
    //     { class: 'tianyan', title: '天眼', key: 'tianyan' },
    //     { class: 'qingpin', title: '清屏', key: 'qingpin' },
    //     { component: 'ToolCompared' },
    //     { component: 'ToolEventOverview' },
    //     ...(index < 3
    //       ? [
    //           {
    //             component: 'GisMapToolMore',
    //             options: this.navconfig[this.list[index].navconfigValue],
    //           },
    //         ]
    //       : []),
    //   ],
    // );
  }
  // 定位清除左侧的列表
  @Watch('$store.state.eventPushStore.eventLocation')
  private eventChange(val: any) {
    // 清空默认选中状态，调用默认的nva为1的导航
    this.changeNav(0, 'eqT1Rightzqyp');
    // 还原默认选中的状态
    this.changePanel(1);
    this.closeAll();
  }
  private sendDisasterDecideData(data: any , i ?: any ) {
      const index = this.current;
      /*let tempData: any = {};
      if (i === 0) {
        tempData = {
                component: 'DisasterDecide',
                options:  data,
        };
      } else if (i === 2) {
        tempData = {
          component: 'RescueHelp',
          options:  data,
        };
      } else if (i === 1) {
        tempData = {
                component: 'DisasterStatistics',
                options:  data,
        };
      }  else {
        tempData = {
                component: 'GisMapToolMore',
                options:  data,
        };
      }*/
      // this.$store.state.controlMoudle.screen2rdFlag
    // 修改的时候传送最新工具条到GisMapUtil.vue
      const tool4Arr = [
              {
                component: 'GisSwitchMap',
                options: { mapId: 'map', baseLayers: [] },
              },
              {
                 component: 'CommonTools',
              },
              // { class: 'tianyan', title: '天眼', key: 'tianyan' },
              // { class: 'qingpin', title: '清屏', key: 'qingpin' },
              { component: 'ToolCompared' },
              { component: 'ToolEventOverview' },
      ];

      // const tool5Arr = JSON.parse(JSON.stringify(tool4Arr));
      // if (!this.$store.state.controlMoudle.screen2rdFlag) { // 表示非半屏,因为半屏要去掉灾情研判那一列
      //         tool5Arr.push(tempData);
      // }

      /*this.toolConfigCache = {
        toolIndexCache: this.list[index].key, // 这个我也不知道是啥，反正半屏全屏切换的时候，刷新工具条要用的。
        toolCommonArr: tool4Arr, // 这个是存放的那几列工具条,那三列
        // toolSpecArr: tempData, // 灾情研判的那列，其实就是最后一列
      };*/

      this.messsageBus.emit(
            'GisMapToolHandler',
            this.list[index].key,
            // this.navconfig[this.list[index].navconfigValue],
            tool4Arr,
    );
  }

// @Watch('$store.state.controlMoudle.screen2rdFlag')
/*@Watch('$store.state.eventPushStore.eventId')
private updateTooConfig(val: any) { // 半屏的时候要把灾情研判工具条没有
  if ( val ) { // 非常态
    return ;
  }

  // this.toolConfigCache = {
  //       toolIndexCache: this.list[index].key, // 这个我也不知道是啥，反正半屏全屏切换的时候，刷新工具条要用的。
  //       toolCommonArr: tool4Arr, // 这个是存放的那几列工具条,那三列
  //       toolSpecArr: tempData, // 灾情研判的那列，其实就是最后一列
  // };

  // const toolArr = JSON.parse(JSON.stringify(this.toolConfigCache.toolCommonArr));


  // if (!this.$store.state.controlMoudle.screen2rdFlag) { // 表示非半屏,因为半屏要去掉灾情研判那一列
  //               toolArr.push(this.toolConfigCache.toolSpecArr);
  // }
  const toolArr = [
    {
      component: 'GisSwitchMap',
      options: { mapId: 'map', baseLayers: [] },
    },
    {
      component: 'CommonTools',
    },
  ];
  this.messsageBus.emit(
            'GisMapToolHandler',
            this.toolConfigCache.toolIndexCache,
            // this.navconfig[this.list[index].navconfigValue],
            toolArr,
  );
}*/

  private changePanel(index: number) {
    this.childindex = Number(index);
    if (Number(index)) {
      this.$store.commit('layoutModule/setChange', {
        type: 'changeTheme',
        index: this.current,
      });
    } else {
      this.$store.commit('layoutModule/setChange', 'unNormal');
      // 切换视频清空左右列表路径规划周边分析
      this.closeAll();
    }
  }

  // 推送后修改nav的total
  /*private changNavTotal() {
    this.messsageBus.on('nvaTotal', (totalNum: any, index: any): void => {
      this.list[index].total = totalNum;
    });
  }*/

  private closeAll() {
    this.messsageBus.emit('clearLeftRight' , true);
    clearPeripheral(this);
    clearPathPlanning(this);
    closeRightVideo(this);
    const closeArr: string[] = ['ToolCompared.' + // 灾情动态
      'aftershock' + // 余震
      ',returnImage' + // 影响回传
      ',internetIntelligence' + // 互联网情报
      ',imageContrast' + // 影响对比
      ',latestImages' + // 最新影像
      ',tianyan' + // 天眼
      ',publicOpinionMonitor', // 舆情监控

      'commonTools.realTimePlotting' + // 标绘
      ',mapPrint', // 地图下载

      'ToolIconEventOverview.' + // 天气交通
      'realTimeTraffic' + // 实时路况
      ',BaiduStreetView' + // 百度街景
      ',tencentStreetView' + // 腾讯街景
      ',surroundingWeather' + // 当地天气
      ',greenChannel' + // 绿色通道
      ',trafficControl' + // 交通管制
      ',roadDamage', // 道路损毁

      'disasterDecide.' + // 灾情研判
      '_district' + // 行政区划
      ',_reserve' + // 物资储备
      ',_disasterstyle' + // 地形地貌
      ',_popluheat' + // 人口分布
      ',_PersonnelIntensive' + // 人员密集场所
      ',_PersonnelIntensive-school' + // 人员密集场所 学校
      ',_PersonnelIntensive-hospital' + // 人员密集场所 医院
      ',_PersonnelIntensive-airport' + // 人员密集场所 机场
      ',_PersonnelIntensive-railwaystation' + // 人员密集场所 火车站
      ',_company' + // 企业
      ',_company-hazardous' + // 企业 危化企业
      ',_company-coalMine' + // 企业 煤矿企业
      ',_company-mine' + // 企业 非煤矿山
      ',_company-explosive' + // 企业 烟花爆竹
      ',_ImportantFacilities' + // 重要设施
      ',_ImportantFacilities-reservoir' + // 重要设施 水库大坝
      ',_ImportantFacilities-portwharf' + // 重要设施 码头
      ',_ImportantFacilities-nuclear' + // 重要设施 核设施
      ',rescueTeams' + // 力量调度
      ',disinfoper' + // 灾情信息员
      ',_DisasterJudge' + // 灾情预估
      ',emergencypart' + // 应急管理机构
      ',_CommandDispatch', // 指挥调度

      'disasterStatistics.' + // 灾损统计
      '_casualties' + // 人员伤亡
      ',_housedamage' + // 房屋损毁
      ',_lostarea' + // 失联区域
      ',_electricdamage', // 电力受损

      'rescueHelp.' + // 救援救助
      'ForceDeployment' + // 力量部署
      ',RescueNeeds' + // 救援需求
      ',MaterialDemand' + // 物资需求
      ',ShleterLeft' + // 安置点
      ',Deployment' + // 调度部署
      ',_MaterialAllot' + // 物资调拨
      ',DispatchAdvice', // 调拨建议
    ];
    closeArr.forEach((val: string) => {
      if (val) {
        const mutexkeyInfo: string[] = val.split('.');
        this.messsageBus.emit(mutexkeyInfo[0], mutexkeyInfo[1]);
      }
    });
  }

 /* /!* 最新影像 *!/
  private getLatestImages() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('latestImage');
    }
    return component;
  }*/

  private created() {
    this.changeNav(0, 'eqT1Rightzqyp');
    // this.changNavTotal();
  }
  private destroyed() {
    const toolArr = [
      {
        component: 'GisSwitchMap',
        options: { mapId: 'map', baseLayers: [] },
      },
      {
        component: 'CommonTools',
      },
    ];
    this.messsageBus.emit(
      'GisMapToolHandler',
      this.toolConfigCache.toolIndexCache,
      // this.navconfig[this.list[index].navconfigValue],
      toolArr,
    );
  }
}
</script>
<style scoped lang="less">
.gisScreen-full.yj-childNav{
    display:none;
  }
.yj-nav-btn-shrink {
  position: absolute;
  left: 92%;
  top: 82px;
  width: 36px;
  height:17px;
  z-index: 2;
  cursor: pointer;
  background: url('../../../../assets/img/nav/shouqi.png') no-repeat center;
  &:hover{
    background-image: url('../../../../assets/img/nav/shouqi_hover.png')
  }
}
.yj-nav-btn-shrink-btn{
  position: absolute;
  left:50%;
  bottom:0;
  width:200px;
  height: 45px;
  margin-left:-98px;
  background: url('../../../../assets/img/nav/zhankai.png') no-repeat center; 
  &:hover{
    background-image: url('../../../../assets/img/nav/zhankai_hover.png');
  }

}
.yj-nav-wrap {
  position: relative;
}
.yj-navBtn {
  z-index: 3;
  background: url('../../../../assets/img/nav/navbg.png') no-repeat center
    bottom;
  width: 1026px;
  height: 128px;
}

.yj-navBtn li {
  font-size: 28px;
  width: 200px;
  height: 70px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
}

.yj-navBtn li:nth-child(1) {
  left: 135px;
  top: 62px;
}

.yj-navBtn li:nth-child(2) {
  left: 335px;
  top: 55px;
}

.yj-navBtn li:nth-child(3) {
  left: 545px;
  top: 55px;
}

.yj-navBtn li:nth-child(4) {
  left: 729px;
  top: 61px;
}

.yj-navBtn li:first-child {
  background: url('../../../../assets/img/nav/nav1.png') no-repeat;
}

.yj-navBtn li:nth-child(2) {
  background: url('../../../../assets/img/nav/nav2.png') no-repeat;
}

.yj-navBtn li:nth-child(3) {
  background: url('../../../../assets/img/nav/nav3.png') no-repeat;
}

.yj-navBtn li:nth-child(4) {
  background: url('../../../../assets/img/nav/nav4.png') no-repeat;
}

.yj-navBtn li:hover {
  cursor: pointer;
}

.yj-navBtn li:nth-of-type(1).curMenuNav,
.yj-navBtn li:nth-of-type(1):hover {
  background-image: url('../../../../assets/img/nav/nav1act.png');
}

.yj-navBtn li:nth-of-type(2).curMenuNav,
.yj-navBtn li:nth-of-type(2):hover {
  background-image: url('../../../../assets/img/nav/nav2act.png');
}

.yj-navBtn li:nth-of-type(3).curMenuNav,
.yj-navBtn li:nth-of-type(3):hover {
  background-image: url('../../../../assets/img/nav/nav3act.png');
}

.yj-navBtn li:nth-of-type(4).curMenuNav,
.yj-navBtn li:nth-of-type(4):hover {
  background-image: url('../../../../assets/img/nav/nav4act.png');
}

.yj-childNav {
  position: absolute;
  top: 58px;
  left: 1196px;
  width: 200px;
  text-align: center;

  & > span {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 70px;
    margin: 0 auto;
    text-align: center;
  }

  & > span i {
    color: #fff;
    position: absolute;
    top: -15px;
    left: 0px;
    font-size: 22px;
    width: 100%;
    font-style: normal;
    white-space: nowrap;
  }
}

.right_tab1 {
  background: url('../../../../assets/img/nav/tab1.png') no-repeat;
  background-size: 70px 100%;
  background-position-x: 15px;
}

.right_tab1:hover {
  cursor: pointer;
  background: url('../../../../assets/img/nav/tab1hover.png') no-repeat;
  background-size: 70px 100%;
  background-position-x: 15px;
}

.right_tab1.tabactive {
  background: url('../../../../assets/img/nav/tab1hover.png') no-repeat;
  background-size: 70px 100%;
  background-position-x: 15px;
}

.right_tab2 {
  background: url('../../../../assets/img/nav/tab2.png') no-repeat;
  background-size: 70px 100%;
  background-position-x: 15px;
}

.right_tab2:hover {
  cursor: pointer;
  background: url('../../../../assets/img/nav/tab2hover.png') no-repeat;
  background-size: 70px 100%;
  background-position-x: 15px;
}

.right_tab2.tabactive {
  background: url('../../../../assets/img/nav/tab2hover.png') no-repeat;
  background-size: 70px 100%;
  background-position-x: 15px;
}

/*闪烁光点动画*/
.dot {
  position: absolute;
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  -webkit-box-shadow: 0px 0px 10px #ffcc00;
  -moz-box-shadow: 0px 0px 10px #ffcc00;
  box-shadow: 0px 0px 10px #ffcc00;
  -webkit-animation: dotMove 2.5s infinite;
  -o-animation: dotMove 2.5s infinite;
  animation: dotMove 2.5s infinite;
}

.dot:nth-of-type(1) {
  right: 3px;
  top: 3px;
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  -o-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.dot:nth-of-type(2) {
  right: 15px;
  top: 10px;
}

.dot:nth-of-type(3) {
  right: 0px;
  top: 16px;
  width: 3px;
  height: 3px;
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  -o-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.dot:nth-of-type(4) {
  right: -1px;
  top: 8px;
  width: 3px;
  height: 3px;
}

.dot:nth-of-type(5) {
  right: 2px;
  top: 12px;
  width: 3px;
  height: 3px;
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  -o-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.dot:nth-of-type(6) {
  right: 33px;
  top: 8px;
  width: 3px;
  height: 3px;
}

.dot:nth-of-type(7) {
  right: 27px;
  top: 18px;
  width: 3px;
  height: 3px;
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  -o-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.dot:nth-of-type(8) {
  right: 65px;
  top: 15px;
  width: 3px;
  height: 3px;
}

.dot:nth-of-type(9) {
  right: 54px;
  top: 3px;
  width: 3px;
  height: 3px;
  -webkit-animation-delay: 0.3s;
  -moz-animation-delay: 0.3s;
  -o-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.dot:nth-of-type(10) {
  right: 94px;
  top: 10px;
  width: 3px;
  height: 3px;
}

@keyframes dotMove {
  0% {
    -webkit-transform: rotate(360deg) scale(1);
    -moz-transform: rotate(360deg) scale(1);
    -ms-transform: rotate(360deg) scale(1);
    -o-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }

  50% {
    -webkit-transform: rotate(0deg) scale(0.5);
    -moz-transform: rotate(0deg) scale(0.5);
    -ms-transform: rotate(0deg) scale(0.5);
    -o-transform: rotate(0deg) scale(0.5);
    transform: rotate(0deg) scale(0.5);
    opacity: 0;
  }

  100% {
    -webkit-transform: rotate(360deg) scale(1);
    -moz-transform: rotate(360deg) scale(1);
    -ms-transform: rotate(360deg) scale(1);
    -o-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
}
.dot-total {
  position: absolute;
  height: 45px;
  line-height: 45px;
  text-align: center;
  width: 45px;
  border-radius: 50%;
  background: rgb(230, 19, 19);
  color: #fff;
  font-size: 32px;
  right: -10px;
  top: -26px;
  z-index: 999;
}
</style>
