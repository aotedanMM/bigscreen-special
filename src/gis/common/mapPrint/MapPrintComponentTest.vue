<template>
  <div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import MapPrintComponent from './MapPrintComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {rescueTeamServer} from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'MapPrintComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class MapPrintComponentTest extends Vue {

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
    const mapPrintComponent = new MapPrintComponent({
        map,
        serverUrl: publishObjectPath.value.mapPrint,
    });

    (window as any).mapPrintComponent = mapPrintComponent;
    (window as any).testMapPrint = () => {
      mapPrintComponent.load({
        dpi: '360',
        outputFormat: 'pdf',
        layout: 'A4 landscape',
        // mapDownLevel: 5,
        // extent: [49.162825999999995, 8.746835906249999, 161.662826, 63.63453121875],
        title: '专题图',
      }, (pageLayerout: any) => {
        console.log(pageLayerout);
      }).then(() => {
        console.log('打印完成');
      });
    };
  }

}
</script>
<style lang='less' scoped>
</style>