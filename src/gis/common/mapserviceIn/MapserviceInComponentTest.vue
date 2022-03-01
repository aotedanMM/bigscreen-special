<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import MapserviceInComponent from './MapserviceInComponent';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'MapserviceInComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class MapserviceInComponentTest extends Vue {

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
    const mapserviceInComponent = new MapserviceInComponent({
        map,
        serviceConfig: publishObjectPath.value,
    });
    mapserviceInComponent.load();
    (window as any).mapserviceInComponent = mapserviceInComponent;
    // 叠加水域图层
    mapserviceInComponent.addLayer('WaterLayer');
  }
}
</script>
<style lang="less" scoped>
</style>