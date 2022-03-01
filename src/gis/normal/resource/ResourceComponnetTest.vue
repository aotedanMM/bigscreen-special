<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import ResourceComponent from './ResourceComponent';
import historyEarthQuakeComponent from '../histroyEarthQuake/historyEarthQuakeComponent';
import {normalResourceServer} from '@/api/installServer';
import {commonDistrictServer , historyEarthQuakeServer} from '@/api/feature/normal/installNormalServer';
@Component({
  name: 'ResourceComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {

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
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    //
    const component = new ResourceComponent({
      map,
      service: normalResourceServer,
      GISComponents,
      symbolConfig,
      PointGeometryBuilder: GISComponents.PointGeometryBuilder,
    });
    // component.on('data-loaded', (event: any) => {
    //   console.log('event 地图数据加载完成！', event.key);
    // });
    // component.showResource('metalnonmetal').then(() => {
    //   console.log('promise 地图数据加载完成！');
    // });

    const historyEarthQuakeComp = new historyEarthQuakeComponent({
            map,
            mapConfig,
            symbolConfig,
            GISComponents,
            service: historyEarthQuakeServer,
            PointGeometryBuilder: GISComponents.PointGeometryBuilder,
            // simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            // popupManager: this.options.GISComponents.popupManager,
            // featureLocate: this.options.GISComponents.featureLocate,
            // featureHighlight: this.options.GISComponents.featureHighlight,
        });
    (historyEarthQuakeComp as any).load();
  }
}
</script>
<style lang="less" scoped>
</style>
