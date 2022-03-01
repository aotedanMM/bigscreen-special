<template>
  <div>
     <input style="position: fixed;" type="button" value="测试" id="measureline" @click="test()">
     <input style="position: fixed;margin-left:100px;" type="button" value="测试1" id="measureline1" @click="test1()">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import DisasterJudgeResourceComponent from './DisasterJudgeResourceComponent';
import DisasterJudgeNewTeamComponent from './DisasterJudgeNewTeamComponent';
import DisasterJudgeShipComponent from './DisasterJudgeShipComponent';
import DisasterJudgeAirTeamComponent from './DisasterJudgeAirTeamComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import { airStationServer } from '@/api/installServer';

@Component({
  name: 'DisasterJudgeResourceComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class DisasterJudgeResourceComponentTest extends Vue {

  private mapId: string = '';

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
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
    const ResourceTypes = ['school', 'hospital', 'airport', 'portwharf',
    'railwaystation', 'RescueTeam※03', 'hazardous', 'coalMine',
    'mine', 'explosive', 'industry', 'reservoir', '_RealShip',
    'nuclear', 'development', 'derivativerisk', 'disinfoper', 'emergencypart'];
    // const disasterJudgeResourceComponent = new DisasterJudgeResourceComponent({
    //     map,
    //     service: installDisasterJudgeServer.hazServer,
    //     GISComponents,
    //     symbolConfig,
    //     eventInfo,
    // });
    // disasterJudgeResourceComponent.on('popup', (data: any) => {
    //   console.log(data);
    // });
    // (window as any).disasterJudgeResourceComponent = disasterJudgeResourceComponent;
    // const index: any = 0;
    // disasterJudgeResourceComponent.load([ResourceTypes[index]]).then((data: any) => {
    //     console.log(data);
    //     disasterJudgeResourceComponent.showResource(ResourceTypes[index], ['5']);
    // //     // disasterJudgeResourceComponent.hideResource('school', ['20']);
    // //     // disasterJudgeResourceComponent.openPopup('school', '878237');
    // //     // disasterJudgeResourceComponent.closePopup();
    // //     // disasterJudgeResourceComponent.unload();
    // });


    this.map = map;
    this.GISComponents = GISComponents;
    this.symbolConfig = symbolConfig;
    this.eventInfo = eventInfo;

    // ship
    const disasterJudgeShipComponent = new DisasterJudgeShipComponent({
        map,
        service: installDisasterJudgeServer.hazServerShip,
        GISComponents,
        symbolConfig,
        eventInfo,
    });
    (window as any).disasterJudgeShipComponent = disasterJudgeShipComponent;
    // disasterJudgeShipComponent.load(['_RealShip']).then((data: any) => {
    //     console.log(data);
    //     disasterJudgeShipComponent.showResource('_RealShip', ['']);
    // });
  }
  private test() {
    const disasterJudgeAirTeamComp = new DisasterJudgeAirTeamComponent({
            map: this.map,
            symbolConfig: this.symbolConfig,
            GISComponents: this.GISComponents,
            service: airStationServer,
            PointGeometryBuilder: this.GISComponents.PointGeometryBuilder,
        });
    disasterJudgeAirTeamComp.load();
    //  disasterJudgeAirTeamComp.showPopup('70899617-f10b-47c9-9c23-d61c1d740a5e');
//     const eventInfo: any = this.$ioc.resolve('eventInfo');
// // 力量调度
//     const disasterJudgeNewTeamComponent = new DisasterJudgeNewTeamComponent({
//         map : this.map,
//         service: installDisasterJudgeServer.rescueTeamServer,
//         GISComponents: this.GISComponents,
//         symbolConfig: this.symbolConfig,
//         eventInfo,
//     });
//     (window as any).disasterJudgeNewTeamComponent = disasterJudgeNewTeamComponent;
//     const index: any = 0;
//     disasterJudgeNewTeamComponent.load().then((data: any) => {
//         const ranges = eventInfo.getRanges();
//         const maxlevel = ranges[ranges.length - 1].level;
//         disasterJudgeNewTeamComponent.showResource(['T001', 'T002', 'T003', 'T004', 'T005', 'T006'], [maxlevel] , true);
//     });
  }
  private test1() {
    const eventInfo: any = this.$ioc.resolve('eventInfo');
    const ranges = eventInfo.getRanges();
    const maxlevel = ranges[ranges.length - 1].level;
    (window as any).disasterJudgeNewTeamComponent.clear();
  }
}
</script>
<style lang="less" scoped>
</style>