<template>
  <div>
    <div class="btn" style="zIndex: 9999; position: absolute;">
      <button @click="distric1()">更新数据1</button>
      <button @click="distric2()">更新数据2</button>
      <button @click="clear()">清空图层</button>
      <button @click="showAll()">显示所有</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import PopHeatCompnent from './PopHeatCompnent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {disasterJudgeServer, districtServer , hazServer} from '@/api/installServer';

@Component({
  name: 'PopHeatCompnentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class PopHeatCompnentTest extends Vue {

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
    //
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const popHeatCompnent = new PopHeatCompnent({
        map,
        service: disasterJudgeServer,
        GISComponents,
        symbolConfig,
    });
    this.disCom = popHeatCompnent;
    const geometry1 = { type: 'Polygon',
                coordinates: [[[116.35831890646219, 40.172020480604466], [116.07267429139316, 40.12514544148892], [116.25285008940696, 39.88491108604669], [116.6688657367587, 39.77797736377418], [116.67472502235174, 40.15737201516479], [116.35831890646219, 40.172020480604466]]],
                 };
    const geometry3 = { type: 'MultiPolygon',
                coordinates: [
                [[[116.35831890646219, 40.172020480604466], [116.07267429139316, 40.12514544148892], [116.25285008940696, 39.88491108604669], [116.6688657367587, 39.77797736377418], [116.67472502235174, 40.15737201516479], [116.35831890646219, 40.172020480604466]]],
                [[[116.60148294661045, 40.129539989502724], [116.54435390625, 40.11196188126653], [116.6249204242587, 39.97866108045876], [116.71574069205522, 40.09877827913463], [116.60148294661045, 40.129539989502724]]],
                ],
                 };
    popHeatCompnent.load(geometry1);


    // setTimeout(function() {
    //   popHeatCompnent.getHeats(geometry2);
    // }, 5000);

    (window as any).popHeatCompnent = popHeatCompnent;

  }
  private distric1() {
     const geometry2 = { type: 'Polygon',
                coordinates: [ [ [ 116, 40 ], [ 116, 39.8 ], [ 115.9, 39.8 ], [ 115.9, 40 ], [116, 40]] ],
                 };
     this.disCom.getHeats(geometry2);
  }
  private  distric2() {
    const geometry3 = { type: 'MultiPolygon',
                coordinates: [
                [[[116.35831890646219, 40.172020480604466], [116.07267429139316, 40.12514544148892], [116.25285008940696, 39.88491108604669], [116.35831890646219, 40.172020480604466]]],
                [[[116.60148294661045, 40.129539989502724], [116.54435390625, 40.11196188126653], [116.6249204242587, 39.97866108045876], [116.71574069205522, 40.09877827913463], [116.60148294661045, 40.129539989502724]]],
                ],
                 };
    this.disCom.getHeats(geometry3);
  }
  private clear() {
    this.disCom.unload();
  }
  private showAll() {
    const geometry3 = { type: 'MultiPolygon',
                coordinates: [
                [[[116.35831890646219, 40.172020480604466], [116.07267429139316, 40.12514544148892], [116.25285008940696, 39.88491108604669], [116.35831890646219, 40.172020480604466]]],
                [[[116.60148294661045, 40.129539989502724], [116.54435390625, 40.11196188126653], [116.6249204242587, 39.97866108045876], [116.71574069205522, 40.09877827913463], [116.60148294661045, 40.129539989502724]]],
                ],
                 };
    this.disCom.load(geometry3);
  }
}
</script>
<style lang="less" scoped>
</style>