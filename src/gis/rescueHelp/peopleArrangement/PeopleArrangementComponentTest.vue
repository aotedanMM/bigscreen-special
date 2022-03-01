<template>
  <div class="ryaz">
    <span>
      <input type="button" value="组件加载" id="load" @click="loadComponent()" />
      <input type="button" value="移除点击popup" id="removepopup" @click="removeClickedPopup()" />
      <input type="button" value="组件卸载" id="unload" @click="unloadComponent()" />
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import PeopleArrangementComponent from './PeopleArrangementComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import { rescueTeamServer } from '@/api/installServer';
import disasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

@Component({
  name: 'PeopleArrangementComponentTest',
  components: {},
  mixins: [MapCommon],
})
export default class TeamDispatchComponentTest extends Vue {
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
    const peopleArrangementComponent = new PeopleArrangementComponent({
      map,
      symbolConfig,
      eventInfo,
      service: disasterJudgeServer.districtServer,
      GISComponents,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
    });

    (window as any).peopleArrangementComponent = peopleArrangementComponent;

    const testPushData = {
      key: 'SEND_PERSONNELPLACEMENT',
      event: {
        list: [
          {
            district: '固安县',
            districtCode: '131022',
            id: '131022',
            x: 116.3003,
            y: 39.4352,
            totalCapacity: 220,
            totalCapacityPlaced: 139,
            totalPlacement: 425,
            totalPlacementVictims: 141,
          },
          {
            district: '永清县',
            districtCode: '131023',
            id: '131023',
            x: 116.4927,
            y: 39.315,
            totalCapacity: 235,
            totalCapacityPlaced: 173,
            totalPlacement: 335,
            totalPlacementVictims: 195,
          },
          {
            district: '涿州市',
            districtCode: '130681',
            id: '130681',
            x: 115.9772,
            y: 39.482,
            totalCapacity: 335,
            totalCapacityPlaced: 131,
            totalPlacement: 443,
            totalPlacementVictims: 182,
          },
          {
            district: '房山区',
            districtCode: '110111',
            id: '110111',
            x: 115.9779,
            y: 39.6982,
            totalCapacity: 405,
            totalCapacityPlaced: 106,
            totalPlacement: 359,
            totalPlacementVictims: 196,
          },
          {
            district: '门头沟区',
            districtCode: '110109',
            id: '110109',
            x: 116.0915,
            y: 39.937,
            totalCapacity: 580,
            totalCapacityPlaced: 134,
            totalPlacement: 341,
            totalPlacementVictims: 188,
          },
          {
            district: '大兴区',
            districtCode: '110115',
            id: '110115',
            x: 116.3332,
            y: 39.727,
            totalCapacity: 675,
            totalCapacityPlaced: 106,
            totalPlacement: 218,
            totalPlacementVictims: 152,
          },
          {
            district: '广阳区',
            districtCode: '131003',
            id: '131003',
            x: 116.7113,
            y: 39.5242,
            totalCapacity: 620,
            totalCapacityPlaced: 143,
            totalPlacement: 422,
            totalPlacementVictims: 136,
          },
        ],
      },
    };
    this.testData = testPushData;
    peopleArrangementComponent.load(testPushData);
    peopleArrangementComponent.on(
      'firePopup_rescue_people_arrangement',
      this.testPopup,
    );
  }

  private testPopup(event: any) {
    // console.log(event);
    jQuery('#' + event.containerId).append(
      '<b>' +
        event.data.district +
        '</br>总容量：' +
        event.data.totalCapacity +
        '</br>总灾民：' +
        event.data.totalPlacement +
        '</b>',
    );
  }

  private removeClickedPopup() {
    (window as any).peopleArrangementComponent.closePopup();
  }

  private unloadComponent() {
    (window as any).peopleArrangementComponent.unload();
  }

  private loadComponent() {
    (window as any).peopleArrangementComponent.load(this.testData);
  }
}
</script>
<style lang="less" scoped>
.ryaz {
  background-color: yellow;
  position: absolute;
  top: 200px;
  left: 50%;
}
</style>
