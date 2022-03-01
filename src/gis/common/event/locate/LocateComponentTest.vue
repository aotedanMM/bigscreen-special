<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import LocateComponent from './LocateComponent';
import EarthQuakeEventInfo from '../../../event/EarthQuakeEventInfo';
import {dizhenServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'LocateComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class LocateComponentTest extends Vue {

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
    const locateComponent = new LocateComponent({
        map,
        featureLocate: GISComponents.featureLocate,
        eventInfo,
    });
    (window as any).locateComponent = locateComponent;

  }
}
</script>
<style lang="less" scoped>
</style>