<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import SatilliteCloudComponent from './SatilliteCloudComponent';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'SatilliteCloudComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class SatilliteCloudComponentTest extends Vue {

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
    const satilliteCloudComponent = new SatilliteCloudComponent({
        map,
        publishObjectPath,
    });
    satilliteCloudComponent.load();
    (window as any).satilliteCloudComponent = satilliteCloudComponent;

    // 销毁
    // satilliteCloudComponent.destroy()
  }
}
</script>
<style lang="less" scoped>
</style>