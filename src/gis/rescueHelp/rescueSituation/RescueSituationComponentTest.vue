<template>
  <div>
    <div class="btn cccccc" style="zIndex: 9999;position: fixed;top: 200px; left: 350px;">
      <button @click="load()">加载</button>
      <button @click="removepoint()">删除数据</button>
      <button @click="queryStaticData()">统计面板数据</button>
      <button @click="load('typecodes')">点击单类数据</button>
      <button @click="queryhis()">获取gps车辆历史轨迹</button>
      <button @click="playhis()">播放历史轨迹</button>
      <button @click="pausehis()">暂停历史轨迹</button>
      <button @click="finishhis()">结束历史轨迹</button>
      <button @click="openRoute1()">打开路径导航</button>
      <button @click="closeRoute1()">关闭路径导航</button>
      <button @click="openpop()">弹窗</button>
      <button @click="closePopup()">关闭弹窗</button>
      <button @click="unload()">清除</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RescueSituationComponent from './RescueSituationComponent';
import SimpleRouterPlanComponent from '../../common/routeplan/SimpleRouterPlanComponent';
import HistoryTrackComponent from '../../common/histroyTrack/HistoryTrackComponent';
import { rescueSituationServer } from '@/api/installServer';
// import {rescueAssistanceServer} from '@/api/feature/RescueAssistance/installRescueAssistanceServer' ;
import publishObjectPath from '@/util/configRegistry';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';

@Component({
  name: 'RescueSituationComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class RescueSituationComponentTest extends Vue {

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    this.rescueSituationComponent = null;
    this.hisdata = null;
    // 调度态势统计
    this.TeamStaticData = [
      {
        typename: '计划队伍',
        typecode: 'Plannum',
        teamnum: 300,
        teamtypesnum: 20,
        peoplenum: 21500,
      },
      {
  typename: '集结队伍',
        typecode: 'Awaitnum',
        teamnum: 11,
        teamtypesnum: 10,
        peoplenum: 2000,
      },
      {
  typename: '赶赴队伍',
        typecode: 'Hurrynum',
        teamnum: 11,
        teamtypesnum: 10,
        peoplenum: 2000,
      },
      {
  typename: '现场队伍',
        typecode: 'Scenenum',
        teamnum: 11,
        teamtypesnum: 10,
        peoplenum: 2000,
      },
    ];
    // 计划投入兵力
    this.PlanData = [];
    // 现场队伍
    this.SceneData = [
      {
        typeCode: 'Plan',
        data:  [{
      name: '北京市矿山应急救援大队',
      typeCode: 'T002',
      typeName: '危化',
      num: 480,
      teamleader: '安凤玉',
     leadermtel: '13911120989',
      address: '北京市门头沟区大台镇',
      x: 115.938485,
      y: 39.962997,
      id: 'RESCYQ0001',
      distance: 36628.45540292062,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '现场救援队',
      tox: 116.35,
      toy: 39.87,
    }],
  }];
    // 赶赴队伍
    this.HurryData = [{
      name: '国家矿山应急救援大地特勘队',
      typeCode: 'T003',
      typeName: '消防',
      num: 85,
      teamleader: '黄勇',
      leadermtel: '15311096106',
      address: '北京市石景山区',
      x: 116.196607,
      y: 39.921735,
      id: 'RESZGS0032',
      distance: 14310.608854754626,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '赶赴救援队',
      tox: 116.35,
      toy: 39.87,
    },
    {
      name: '国家矿山应急救援大地特勘队',
      typeCode: 'T003',
      typeName: '消防',
      num: 85,
      teamleader: '黄勇',
      leadermtel: '15311096106',
      address: '北京市石景山区',
      x: 116.296607,
      y: 39.951735,
      id: 'RESZGS0033',
      distance: 14310.608854754626,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '赶赴救援队',
      tox: 116.35,
      toy: 39.87,
    },
    ];
    // 集结队伍
    this.AwaitData = [{
      name: '国家地震灾害紧急救援队（中国国际救援队）',
      typeCode: 'T005',
      typeName: '地震',
      num: 480,
      teamleader: '庄乾江',
     leadermtel: '15331009958',
      address: '北京市昌平区阳坊镇',
      x: 116.145055,
      y: 40.14065,
      id: 'RESDZSJ0001',
      distance: 34829.9236002479,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '待命救援队',
      tox: 116.35,
      toy: 39.87,
    }, {
      name: '国家地震灾害紧急救援队（中国国际救援队）',
      typeCode: 'T005',
      typeName: '地震',
      num: 480,
      teamleader: '庄乾江',
     leadermtel: '15331009958',
      address: '北京市昌平区阳坊镇',
      x: 116.155055,
      y: 40.15065,
      id: 'RESDZSJ0002',
      distance: 34829.9236002479,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '待命救援队',
      tox: 116.35,
      toy: 39.87,
    }];
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
    });
  }

  //  地图加载完成后，初始化
  private init(map: any) {
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 通用的地图组件实例
    //
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const simpleRouterComponent = new SimpleRouterPlanComponent({
        map,
        server: publishObjectPath.value.egis,
    });
    simpleRouterComponent.load();
    // 历史轨迹
    const historyTrackComp = new HistoryTrackComponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      featureHighlight: GISComponents.featureHighlight,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
    });
    const rescueSituationComponent = new RescueSituationComponent({
        map,
        rescueServer: rescueSituationServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        featureHighlight: GISComponents.featureHighlight,
        featureLocate: GISComponents.featureLocate,
        popupManager: GISComponents.popupManager,
        symbolConfig,
        simpleRouter: simpleRouterComponent,
        historyTracker: historyTrackComp,
    });
    this.rescueSituationComponent = rescueSituationComponent;

    (window as any).rescueSituationComponent = rescueSituationComponent;
    // todo 查询到集结队伍数据，默认进行展示
    // (this.AwaitData as any) = rescueSituationComponent.queryAwaitData('await');
    // rescueSituationComponent.load(this.AwaitData);
    // this.rescueSituationComponent.needPointClick(this.needData[0].id);
    rescueSituationComponent.on('popup', (data: any) => {
      console.log('测试tooltip');
      console.log(data);
      jQuery('#rescue_situation_popup').append('<b>省分发付付付付付付付付付付付付付</b>');
    });
    rescueSituationComponent.on('listData', (data: any) => {
      console.log('测试列表数据');
      console.log(data);
    });
    rescueSituationComponent.on('staticData', (data: any) => {
      console.log('测试统计数据');
      console.log(data);
    });
    rescueSituationComponent.on('situation_route', (data: any) => {
       console.log('测试路径规划');
       console.log(data);
    });
    // rescueSituationComponent.historyTracker.on('carTrackMoveEvent', (data: any) => {
    //   console.log('测试历史轨迹播放');
    //   console.log(data);
    // });
  }

  private queryStaticData() {
    this.rescueSituationComponent.queryStaticData();
  }
   private load() {
      (this.AwaitData as any) = this.rescueSituationComponent.queryAwaitData('await');
      this.rescueSituationComponent.load(this.AwaitData);
  }
  private unload() {
    this.rescueSituationComponent.unload();
  }
   private closePopup() {
    this.rescueSituationComponent.closePopup();
  }
  // 消防
  private team1() {
      this.rescueSituationComponent.addRescureTeamByCode('T003');
  }
  private removeTeam1() {
     this.rescueSituationComponent.removeRescureTeamByCode('T003');
  }
  // 危化
  private team2() {
     this.rescueSituationComponent.addRescureTeamByCode('T002');
  }
  private removeTeam2() {
     this.rescueSituationComponent.removeRescureTeamByCode('T002');
  }
  private openpop() {
     this.rescueSituationComponent.teamPointClick('RESDZSJ0001', 'T005');
  }
  private openRoute1() {
    //  this.rescueSituationComponent.teamPointClick('RESDZSJ0001', 'T005');
     this.rescueSituationComponent.openRoutePlan('RESDZSJ0001', 'T005');
  }
  private closeRoute1() {
     this.rescueSituationComponent.closeRoutePlan('RESDZSJ0001');
  }
  private queryhis() {

    // 获取所有车辆数据
    // installSearchReosurce.realTimeCar.getFireEnginesMapData({}).then((res: any) => {
    //             console.log(res.data);
    //         });
            // 获取轨迹数据
    installSearchReosurce.realTimeCar
      .getFireEnginesInfoHistory({
        //  gpsid: '11725040530',
        gpsid: '11725040636',
        starttime: '2019-11-01 11:52:00',
        endtime: '2019-12-24 17:36:00',
      })
      .then((data: any) => {
        // todo
        console.log('轨迹数据');
        console.log(data);
        this.hisdata = data;
        this.rescueSituationComponent.openHistoryTrack(data);
      });
  }
  private playhis() {
    this.rescueSituationComponent.historyPlay();
  }
  private pausehis() {
    this.rescueSituationComponent.historyPause();
  }
  private finishhis() {
    this.rescueSituationComponent.historyFinish();
  }
  private removepoint() {
    this.rescueSituationComponent.removePoint();
  }
}
</script>
<style lang="less" scoped>
</style>