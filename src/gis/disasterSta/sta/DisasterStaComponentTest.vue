<template>
  <div>
    <div class="btn" style="zIndex: 9999; position: absolute;">
      <button @click="distric1()">行政区划1</button>
      <button @click="distric2()">行政区划2</button>
      <button @click="clear()">清空图层</button>
      <button @click="showAll()">显示所有</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import DisasterStaComponent from './DisasterStaComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {dizhenServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import installDisasterStaServer from '@/api/feature/disasterSta/installDisasterStaServer';
import ProvinceData from './data';

@Component({
  name: 'DisasterStaComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class DisasterStaComponentTest extends Vue {

  private mapId: string = 'map';
  private disCom: any = null;

  private mounted() {
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
    const disasterStaComponent = new DisasterStaComponent({
        map,
        districtServer: installDisasterStaServer.districtServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        featureHighlight: GISComponents.featureHighlight,
        featureLocate: GISComponents.featureLocate,
        popupManager: GISComponents.popupManager,
        symbolConfig,
        eventInfo,
    });
    this.disCom = disasterStaComponent;
    const districtList: any = [
      {

        parentName: '西城区',
        death: 87,
        injured: 83,
        miss: 72,
        damage: 79,
        poptotal: 1232757,
        lost: 53,
        x: 116.35581226,
        y: 39.87521582,
        id: '110102',
      },
      {
        parentName: '丰台区',
        death: 75,
        injured: 78,
        miss: 106,
        damage: 97,
        poptotal: 3344919,
        lost: 86,
        x: 116.35984272,
        y: 39.86261546,
        id: '110106',
      },
    ];
    // disasterStaComponent.load({
    //   list: districtList,
    // });
    disasterStaComponent.load({
      list: ProvinceData.data.data,
    });

    disasterStaComponent.on('disasterSta_popup', (data: any) => {
      console.log('测试tooltip');
      console.log(data);
      jQuery('#disaster_sta_popup_id').append('<b>省分发付付付付付付付付付付付付付</b>');
    });
    disasterStaComponent.on('disasterSta_district_code', (data: any) => {
      console.log('测试行政区划分发');
      console.log(data);
      jQuery('#disaster_sta_feature_type').append('<b>省分发付付付付付付付付付付付付付</b>');
    });
    (window as any).disasterStaComponent = disasterStaComponent;
  }
  private distric1() {
    this.disCom.privinceClick(this.disCom.list[0].id);
  }
  private distric2() {
    this.disCom.privinceClick(this.disCom.list[1].id);
  }
  private clear() {
    this.disCom.unload();
  }
  private showAll() {
    this.disCom.showAll();
  }
}
</script>
<style lang="less" scoped>
</style>