<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RainForecastComponent from './RainForecastComponent';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'RainForecastComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class RainForecastComponentTest extends Vue {

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
    const rainForecastComponent = new RainForecastComponent({
        map,
        publishObjectPath,
    });
    // 未来['24h','48h','72h'] 降雨
    rainForecastComponent.load(0); // 24h
    rainForecastComponent.load(1); // 48h
    rainForecastComponent.load(2); // 72h
    (window as any).rainForecastComponent = rainForecastComponent;

    // 销毁
    // rainForecastComponent.destroy()
  }
}
</script>
<style lang="less" scoped>
</style>