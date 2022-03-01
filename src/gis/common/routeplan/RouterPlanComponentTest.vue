<template>
  <div>
    <div class="route-plan">
      <div class="title">路径规划</div>
      <ul>
        <li><button @click="selectStart()">起点</button></li>
        <li><button @click="selectMiddle()">中点</button></li>
        <li><button @click="selectEnd()">终点</button></li>
        <li><button @click="highlight()">高亮一段</button></li>
        <li><button @click="clearAll()">清空所有</button></li>
        <li><button @click="queryPointStart()">查询起点</button></li>
        <li><button @click="queryPointEnd()">查询终点</button></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RouterPlanComponent from './RouterPlanComponent';
import {locationServer} from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'RouterPlanComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class RouterPlanComponentTest extends Vue {

  private mapId: string = '';
  private routeplanComponent: any = null;
  private testPath: any = null; // 测试路径
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
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    this.routeplanComponent = new RouterPlanComponent({
        map,
        locationService: locationServer,
        featureLocate: GISComponents.featureLocate,
        symbolConfig,
        egis: publishObjectPath.value.egis,
    });
    const option  = {
        clickMoreState: false,
        stops: [
            {
                lon: 116.420952,
                lat: 39.9022,
            },
            {
                lon: 116.35,
                lat: 39.87,
            },
        ],
    };
    // const options = {page: 1, keyword: '武汉', page_size: 10};
    // const query = this.routeplanComponent.queryPoi(options);
    // console.log('query', query);
    // query.then((res: any) => {
    //   console.log('queryPoi-res', res);
    // });

    this.routeplanComponent.on('dealPathMainDatasStart', (d: any) => {
      console.log(d);
    });
    // this.routeplanComponent.queryPath_bus(option).then((res: any) => {
    this.routeplanComponent.queryPath(option).then((res: any) => {
      console.log('queryPath', res);
      // const route = res.routes[0];
      // const steps = route.steps;
      // for (const i of steps) {
      //   if (i.schemes[0].instruction) {
      //     for (const n of i.schemes) {
      //       const schema = n;
      //       this.path = schema.path;
      //       // console.log('path', path);
      //     }
      //   } else {
      //     this.showBusSeparateRoutes(steps[i].schemes);
      //     for (const m of i.schemes) {
      //       const schema = m;
      //       const path = schema.path;
      //     }
      //   }
      // }
    });

    // this.routeplanComponent.queryPath_walking(option).then((res: any) => {
    //   console.log('queryPath_walking', res);
    // });

    (window as any).routeplanComponent = this.routeplanComponent;

  }
  // 点选起点
  private selectStart() {
    this.routeplanComponent.startSelectPoint({position: 0, iconClass: 'preIcon startIcon'});
  }
  // 点选起点
  private selectEnd() {
    console.log('start');
    this.routeplanComponent.startSelectPoint({position: 1, iconClass: 'preIcon endIcon'});
  }
  // 点选中点
  private selectMiddle() {
    console.log('middle');
    this.routeplanComponent.startSelectPoint({position: 1, iconClass: 'preIcon stopIcon'});
  }
  // 高亮一段
  private highlight() {
    console.log('高亮');
    this.routeplanComponent.highlightBusRouteScheme(this.path);
  }
  // 清空所有
  private clearAll() {
    // this.routeplanComponent.clearResults(); // 清空起终点
    // this.routeplanComponent.clearRouteResults(); // 清空路径
    this.routeplanComponent.clear();
  }

  private queryPointStart() {
    this.routeplanComponent.queryPoint({lon: 111, lat: 38}, 0);
  }
  private queryPointEnd() {
    this.routeplanComponent.queryPoint({lon: 114, lat: 36}, 1);
  }
}
</script>
<style lang="less" scoped>
  .route-plan{
    position: absolute;
    top: 200px;
    left: 400px;
    background-color: #333;
    .title{
      color: #fff
    }
  }
</style>