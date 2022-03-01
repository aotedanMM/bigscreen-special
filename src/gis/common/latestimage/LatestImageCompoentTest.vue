<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import LatestImageComponent from './LatestImageComponent';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'LatestImageCompoentTest',
  components: {},
  mixins: [MapCommon],
})
export default class LatestImageCompoentTest extends Vue {
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

    const eventInfo: any = new EarthQuakeEventInfo(null, null);
    const lastestedImages = new LatestImageComponent({
        map,
        service: installDisasterJudgeServer.latestImage,
        wmsUrl: publishObjectPath.value.lastedImageServer,
        featureLocate: GISComponents.featureLocate,
        eventInfo,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
    });
    const locateOps = {
      lon: eventInfo.getPoint()[0],
      lat: eventInfo.getPoint()[1],
    };
    GISComponents.featureLocate.fit({
      type: 'geojson',
      geom: {
        type: 'Point',
        coordinates: [locateOps.lon, locateOps.lat],
      },
    });
    (window as any).lastestedImages = lastestedImages;
    lastestedImages.load();
  }
}
</script>
<style lang="less" scoped>
</style>