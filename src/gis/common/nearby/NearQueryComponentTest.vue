<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import NearQueryComponent from './NearQueryComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {resourceanalysisServer} from '@/api/feature/normal/installNormalServer';

@Component({
  name: 'NearQueryComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class NearQueryComponentTest extends Vue {

  private mapId: string = '';
  private disCom: any = null;

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
    const nearQueryComponent = new NearQueryComponent({
        map,
        service: resourceanalysisServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        bufferDraw: GISComponents.bufferDraw,
        popupManager: GISComponents.popupManager,
        featureHighlight: GISComponents.featureHighlight,
        featureLocate: GISComponents.featureLocate,
        PointGeometryBuilder: GISComponents.PointGeometryBuilder,
        symbolConfig,
    });
    nearQueryComponent.load({
      point: [116, 39],
      // radius: 80000,
    });
    (window as any).nearQueryComponent = nearQueryComponent;
  }
}
</script>
<style lang="less" scoped>
</style>