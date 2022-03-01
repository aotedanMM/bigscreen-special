<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import InfluenceComponent from './InfluenceComponent';
import EventInfoWapper from '../../../event/EventInfoWapper';
import EarthQuakeEventInfo from '../../../event/EarthQuakeEventInfo';
import {dizhenServer} from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'InfluenceComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class InfluenceComponentTest extends Vue {

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
    const eventInfo = new EventInfoWapper();
    const eventInfoInstance = new EarthQuakeEventInfo('8a808b9c701d6cc701702dcdf95a10f4', {});
    eventInfo.bind(eventInfoInstance);
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const influenceComponent = new InfluenceComponent({
        map,
        service: dizhenServer,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        featureLocate: GISComponents.featureLocate,
        symbolConfig,
        eventInfo,
    });
    // influenceComponent.load(0);
    (window as any).influenceComponent = influenceComponent;
  }
}
</script>
<style lang="less" scoped>
</style>