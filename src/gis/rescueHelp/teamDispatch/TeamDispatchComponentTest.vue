<template>
  <div>
    <div class="btn" style="zIndex: 9999;   position: fixed;top: 200px; left: 120px;">
      <button @click="load1()">加载待命</button> 
      <button @click="load2()">加载赶赴</button>
      <button @click="load3()">加载现场</button>
      <button @click="addByCode1()">添加赶赴消防</button>
      <button @click="clearByCode1()">删除赶赴消防</button>
      <button @click="addByCode2()">添加赶赴地震</button>
      <button @click="clearByCode2()">删除赶赴地震</button>
      <button @click="addRoute1()">开启路径规划1</button>
       <button @click="clearRoute1()">关闭路径规划1</button>
       <button @click="addRoute2()">开启路径规划2</button>
       <button @click="clearRoute2()">关闭路径规划2</button>
      <button @click="pointClick()">界面点击定位</button>
      <button @click="closePopup()">关闭tooltip</button>
      <button @click="unload()">卸载</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import TeamDispatchComponent from './TeamDispatchComponent';
import SimpleRouterPlanComponent from '../../common/routeplan/SimpleRouterPlanComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {rescueTeamServer} from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'TeamDispatchComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class TeamDispatchComponentTest extends Vue {

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    this.teamDispatchComponent = null;
    // 现场队伍
    this.SceneData = [
      {
        typeCode: 'T002',
        data:  [{
      name: '北京市矿山应急救援大队',
      typeCode: 'T002',
      typeName: '危化',
      num: 480,
      teamleader: '安凤玉',
     leadermtel: '13911120989',
      address: '北京市门头沟区大台镇',
      county: {
        id: '110109',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110109',
          DISTRICTNAME: '门头沟区',
          FULLNAME: '北京市门头沟区',
          LATITUDE: 39.937000000000005,
          LONGITUDE: 116.09150000000001,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'MTGQ',
        },
      },
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
    this.HurryXFData = [{
      name: '国家矿山应急救援大地特勘队',
      typeCode: 'T003',
      typeName: '消防',
      num: 85,
      teamleader: '黄勇',
      leadermtel: '15311096106',
      address: '北京市石景山区',
      county: {
        id: '110107',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110107',
          DISTRICTNAME: '石景山区',
          FULLNAME: '北京市石景山区',
          LATITUDE: 39.924600000000005,
          LONGITUDE: 116.1631,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'SJSQ',
        },
      },
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
      county: {
        id: '110107',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110107',
          DISTRICTNAME: '石景山区',
          FULLNAME: '北京市石景山区',
          LATITUDE: 39.924600000000005,
          LONGITUDE: 116.1631,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'SJSQ',
        },
      },
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
    this.HurryDZData = [
      {
      name: '右安门中队',
      typeCode: 'T005',
      typeName: '地震',
      num: 30,
      teamleader: '纪彬彬',
      leadermtel: '15311096106',
      address: '北京市石景山区',
      county: {
        id: '110106',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110106',
          DISTRICTNAME: '石景山区',
          FULLNAME: '北京市石景山区',
          LATITUDE: 39.924600000000005,
          LONGITUDE: 116.1631,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'SJSQ',
        },
      },
      x: 116.358502,
      y: 39.857671,
      id: 'beijing89',
      distance: 552.8623610486104,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '赶赴救援队',
      tox: 116.35,
      toy: 39.87,
    },
     {
      name: '右安门中队',
      typeCode: 'T005',
      typeName: '地震',
      num: 30,
      teamleader: '纪彬彬',
      leadermtel: '15311096106',
      address: '北京市石景山区',
      county: {
        id: '110106',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110106',
          DISTRICTNAME: '石景山区',
          FULLNAME: '北京市石景山区',
          LATITUDE: 39.924600000000005,
          LONGITUDE: 116.1631,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'SJSQ',
        },
      },
      x: 116.368502,
      y: 39.867671,
      id: 'beijing90',
      distance: 552.8623610486104,
      carnum: '',
      teamtask: '',
      sendpeoplenum: 0,
      sendplace: '',
      teamjc: '赶赴救援队',
      tox: 116.35,
      toy: 39.87,
    },
    ];
    this.HurryData = [
     { typeCode: 'T003',
       data: this.HurryXFData,
     },
     {
       typeCode: 'T005',
       data: this.HurryDZData,
     },
    ];
    // 待命队伍
    this.AwaitData = [
      {
        typeCode: 'T005',
        data: [{
      name: '国家地震灾害紧急救援队（中国国际救援队）',
      typeCode: 'T005',
      typeName: '地震',
      num: 480,
      teamleader: '庄乾江',
     leadermtel: '15331009958',
      address: '北京市昌平区阳坊镇',
      county: {
        id: '110114',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110114',
          DISTRICTNAME: '昌平区',
          FULLNAME: '北京市昌平区',
          LATITUDE: 40.2173,
          LONGITUDE: 116.226,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'CPQ',
        },
      },
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
      county: {
        id: '110114',
        createTime: '2018-07-06T13:42:41.763Z',
        isSync: '1',
        tag: {
          DISTRICTCODE: '110114',
          DISTRICTNAME: '昌平区',
          FULLNAME: '北京市昌平区',
          LATITUDE: 40.2173,
          LONGITUDE: 116.226,
          NOTES: null,
          ORDERCOLUM: null,
          PARENTCODE: '110100',
          SHORTNAME: null,
          SPELLING: 'CPQ',
        },
      },
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
    }],
    }];
    const self = this;
    (this as any).resolveMap(this.mapId).then((data: any) => {
      self.init(data.map);
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
    const eventInfo = new EarthQuakeEventInfo([], []);
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const simpleRouterComponent = new SimpleRouterPlanComponent({
        map,
        server: publishObjectPath.value.egis,
    });
    simpleRouterComponent.load();
    const teamDispatchComponent = new TeamDispatchComponent({
        map,
        service: rescueTeamServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        featureHighlight: GISComponents.featureHighlight,
        featureLocate: GISComponents.featureLocate,
        popupManager: GISComponents.popupManager,
        symbolConfig,
        eventInfo,
        egisServer: publishObjectPath.value.egis,
        simpleRouter: simpleRouterComponent,
    });
    this.teamDispatchComponent = teamDispatchComponent;
    this.teamDispatchComponent.load();
    teamDispatchComponent.on('team_popup', (data: any) => {
      console.log('测试tooltip');
      console.log(data);
      jQuery('#rescue_dispatch_popup').append('<b>省分发付付付付付付付付付付付付付</b>');
    });
    teamDispatchComponent.on('route', (data: any) => {
      console.log(data);
    });
    teamDispatchComponent.on('dispatch_team_point', (data: any) => {
       console.log('测试dispatch_team_point');
       console.log(data);
    });

    (window as any).teamDispatchComponent = teamDispatchComponent;
  }
  private load1() {
    this.teamDispatchComponent.addTeam(2, this.AwaitData);
  }
   private load2() {
    this.teamDispatchComponent.addTeam(1, this.HurryData);
  }
   private load3() {
    this.teamDispatchComponent.addTeam(0, this.SceneData);
  }
  // 界面选中一条数据，在地图上定位的接口,传入值为数据的id，待命救援队
  private pointClick() {
    this.teamDispatchComponent.openPopup(this.HurryXFData[0].id, 'T003');
  }
  private unload() {
    this.teamDispatchComponent.unload();
  }
  private closePopup() {
    this.teamDispatchComponent.closePopup();
  }
  // 消防
  private addByCode1() {
    this.teamDispatchComponent.addTeamByTypeCode('T003', 1);
  }
  // 地震
  private addByCode2() {
    this.teamDispatchComponent.addTeamByTypeCode('T005', 1);
  }
  private clearByCode1() {
     this.teamDispatchComponent.removeTeamByTypeCode('T003', 1);
  }
  private clearByCode2() {
     this.teamDispatchComponent.removeTeamByTypeCode('T005', 1);
  }
  private addRoute1() {
    this.teamDispatchComponent.openRoutePlan(this.HurryXFData[0].id, 'T003');
  }
  private clearRoute1() {
    this.teamDispatchComponent.closeRoutePlan(this.HurryXFData[0].id);
  }
  private addRoute2() {
    this.teamDispatchComponent.openRoutePlan(this.HurryXFData[1].id, 'T003');
  }
  private clearRoute2() {
    this.teamDispatchComponent.closeRoutePlan(this.HurryXFData[1].id);
  }
}
</script>
<style lang="less" scoped>
</style>