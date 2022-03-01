<template>
  <div>
    <div class="btn" style="zIndex: 9999; position: absolute;">
      <button @click="load()">加载</button>
      <button @click="play()">播放</button>
      <button @click="pause()">暂停</button>
      <button @click="finish()">结束</button>
      <button @click="unload()">卸载</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import RealtimeTrackComponent from './RealtimeTrackComponent';
import ITrackUpdater from './ITrackUpdater';
import ITrackRouter from './ITrackRouter';
import TrackUpdaterTest from './test/TrackUpdaterTest';
import TrackRouterTest from './test/TrackRouterTest';

@Component({
  name: 'RealtimeTrackComponentTest',
  components: {},
  mixins: [MapCommon],
})
export default class RealtimeTrackComponentTest extends Vue {
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
    const trackUpdater: ITrackUpdater = new TrackUpdaterTest(5 * 1000);
    const trackRouter: ITrackRouter = new TrackRouterTest();
    const realtimeTrack = new RealtimeTrackComponent({
      map,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      featureHighlight: GISComponents.featureHighlight,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      trackUpdater,
      trackRouter,
    });
    (window as any).realtimeTrack = realtimeTrack;
    realtimeTrack.load();
  }
}
</script>
<style lang="less" scoped>
</style>