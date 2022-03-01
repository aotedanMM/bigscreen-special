<template>
  <div>
    <div class="btn" style="zIndex: 9999;position: fixed;top: 200px; left: 350px;">
      <button @click="load()">加载</button>
      <button @click="need1()">需求点1</button>
      <button @click="need2()">需求点2</button>
      <button @click="team1()">消防队</button>
      <button @click="removeTeam1()">删除消防队</button>
      <button @click="team2()">危化队</button>
      <button @click="removeTeam2()">删除危化队</button>
      <button @click="openRoute1()">开启路径1</button>
      <button @click="closeRoute1()">关闭路径1</button>
      <button @click="openRoute2()">开启路径2</button>
       <button @click="closeRoute2()">关闭路径2</button>
      <button @click="closePopup()">关闭tooltip</button>
      <button @click="unload()">卸载</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RescueNeedComponent from './RescueNeedComponent';
import SimpleRouterPlanComponent from '../../common/routeplan/SimpleRouterPlanComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {rescueTeamServer} from '@/api/installServer';
import {rescueAssistanceServer} from '@/api/feature/RescueAssistance/installRescueAssistanceServer' ;
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'RescueNeedComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class RescueNeedComponentTest extends Vue {

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    this.rescueNeedComponent = null;
    this.needData = [{
        x: '116.330323',
        y: '39.887448',
        district: '广安门中队',
        id: 'need_0',
        workers: [
          {typeCode: 'T005', typeName: '地震救援队', typetitle: '广安门中队', num: '100'},
          {typeCode: 'T003', typeName: '消防救援队', typetitle: '广安门中队', num: '50'}],
  }, {
        x: '116.340323',
        y: '39.897448',
        district: '西城支队',
        id: 'need_1',
        workers: [
          {typeCode: 'T004', typeName: '森林(草原)消防救援队', typetitle: '广安门中队', num: '40'},
          {typeCode: 'T002', typeName: '危化救援队', typetitle: '西城支队', num: '100'}],
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
    const eventInfo = new EarthQuakeEventInfo([], []);
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const simpleRouterComponent = new SimpleRouterPlanComponent({
        map,
        server: publishObjectPath.value.egis,
    });
    simpleRouterComponent.load();
    const rescueNeedComponent = new RescueNeedComponent({
        map,
        rescueNeedServer: rescueAssistanceServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        featureHighlight: GISComponents.featureHighlight,
        featureLocate: GISComponents.featureLocate,
        popupManager: GISComponents.popupManager,
        symbolConfig,
        eventInfo,
        simpleRouter: simpleRouterComponent,
    });
    this.rescueNeedComponent = rescueNeedComponent;

    (window as any).rescueNeedComponent = rescueNeedComponent;
    rescueNeedComponent.load(this.needData);
    this.rescueNeedComponent.needPointClick(this.needData[0].id);
    rescueNeedComponent.on('popup', (data: any) => {
      console.log('测试tooltip');
      console.log(data);
      jQuery('#rescue_need_popup').append('<b>省分发付付付付付付付付付付付付付</b>');
    });
    rescueNeedComponent.on('query_team_point', (data: any) => {
      console.log('测试query_team_point');
      console.log(data);
    });
    rescueNeedComponent.on('need_point', (data: any) => {
       console.log('测试need_point');
       console.log(data);
       rescueNeedComponent.needPointClick(data.id);
    });
    rescueNeedComponent.on('team_point', (data: any) => {
       console.log('测试team_point');
       console.log(data);
    });
    rescueNeedComponent.on('need_route', (data: any) => {
       console.log('测试路径规划');
       console.log(data);
    });
  }
   private load() {
     this.rescueNeedComponent.load(this.needData);
    // this.rescueNeedComponent.load(this.typeList, this.limit);
  }
  private unload() {
    this.rescueNeedComponent.unload();
  }
   private closePopup() {
    this.rescueNeedComponent.closePopup();
  }
  private need1()  {
    this.rescueNeedComponent.needPointClick(this.needData[0].id);
  }
  private need2() {
    this.rescueNeedComponent.needPointClick(this.needData[1].id);
  }
  // 消防
  private team1() {
      this.rescueNeedComponent.addRescureTeamByCode('T003');
  }
  private removeTeam1() {
     this.rescueNeedComponent.removeRescureTeamByCode('T003');
  }
  // 危化
  private team2() {
     this.rescueNeedComponent.addRescureTeamByCode('T002');
  }
  private removeTeam2() {
     this.rescueNeedComponent.removeRescureTeamByCode('T002');
  }
  private openRoute1() {
     this.rescueNeedComponent.teamPointClick('beijing20', 'T003');
     this.rescueNeedComponent.openRoutePlan('beijing20', 'T003');
  }
  private openRoute2() {
     this.rescueNeedComponent.teamPointClick('guojiaweihua_bu_5', 'T002');
     this.rescueNeedComponent.openRoutePlan('guojiaweihua_bu_5', 'T002');
  }
  private closeRoute1() {
     this.rescueNeedComponent.closeRoutePlan('beijing20');
  }
  private closeRoute2() {
     this.rescueNeedComponent.closeRoutePlan('guojiaweihua_bu_5');
  }

}
</script>
<style lang="less" scoped>
</style>