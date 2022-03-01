<template>
  <div>
    <div style="position:absolute;z-index:9999;left:120px">
      <button @click="showWeather">显示天气</button>
      <button @click="clear">清除天气</button>
      <button @click="locate">定位</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import WeatherComponent from './WeatherComponent';
import publishObjectPath from '@/util/configRegistry';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';

@Component({
  name: 'WeatherTest',
  components: {},
  mixins: [MapCommon],
})
export default class WeatherTest extends Vue {
  private mapId: string = '';
  private map: any = null;
  private getComponent: any = null;
  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
    });
  }

  //  地图加载完成后，初始化
  private init(map: any) {
    this.map = map;
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 通用的地图组件实例
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);

    const eventInfo = new EarthQuakeEventInfo([], []);
    //
    const component = new WeatherComponent({
      map,
      symbolConfig,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
      service: installDisasterJudgeServer.weatherServer,
      eventInfo,
    });
    this.getComponent = () => {
      return component;
    };
    component.on('popup', (event: any) => {
      new Vue({
        render(createElement: any) {
          return createElement('div', '当地天气弹出框');
        },
      }).$mount('#' + event.content.containerId);
    });
  }

  private clear() {
    this.getComponent().unload();
  }
  private showWeather() {
    this.getComponent().load();
  }

  private locate() {
    this.getComponent().openPopup('110102');
  }
}
</script>
<style lang="less" scoped>
</style>