<template>
  <div>
    <input type="button" value="添加" @click="showRoute"/>
    <input type="button" value="移除" @click="clearRoute"/>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import SimpleRouterPlanComponent from './SimpleRouterPlanComponent';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'SimpleRouterPlanComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class SimpleRouterPlanComponentTest extends Vue {

  private mapId: string = '';
  private simpleRouterPlanComp: any = null;
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
    //
    const simpleRouterPlanComp: any = new SimpleRouterPlanComponent({
      map,
      server: publishObjectPath.value.egis,
    });
    simpleRouterPlanComp.load();
    this.simpleRouterPlanComp = simpleRouterPlanComp;
    (window as any).simpleRouterPlan = simpleRouterPlanComp;
    //

  }

  private showRoute() {
    this.simpleRouterPlanComp.addRoute({
      id: 'test',
      startPoint: [116, 39],
      endPoint: [115, 40],
      showStartPoint: true,
      showEndPoint: true,
    });
  }

  private clearRoute() {
    this.simpleRouterPlanComp.removeRoute('test');
  }
}
</script>
