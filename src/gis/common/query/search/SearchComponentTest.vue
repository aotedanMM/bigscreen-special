<template>
  <div style="position:absolute;z-index:9999;top:100px;">
    <button class="el-button" @click="setRadius(100000)">设置缓冲区半径</button>
    <button class="el-button" @click="queryPoint">经纬度定位</button>
    <button class="el-button" @click="testplot('point')">绘点</button>
    <button class="el-button" @click="testCircleBuffer()">绘圆</button>
    <button class="el-button" @click="testplot('polyline')">绘线</button>
    <button class="el-button" @click="testplot('polygon')">绘多边形</button>
    <button class="el-button" @click="testGetBufferGeom()">获取缓冲区geometry</button>
    <button class="el-button" @click="queryDistrict('110108')">查询行政区划1</button>
    <button class="el-button" @click="queryDistrict('110107')">查询行政区划2</button>
    <button class="el-button" @click="clearDistrict('110108')">清除行政区划1</button>
    <button class="el-button" @click="clearDistrictAll()">清除全部行政区划</button>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import SearchComponent from './SearchComponent';
import FilterInfo from '../FilterInfo';
import publishObjectPath from '@/util/configRegistry';
import { normalResourceServer } from '@/api/installServer';
import { districtServer } from '@/api/installServer';

@Component({
  name: 'SearchComponentTest',
  mixins: [MapCommon],
})
export default class SearchComponentTest extends Vue {
  private mapId: any = 'map';
  private searchComponent: any = null;
  private mounted() {
    // 获取地图，地图加载完成后进入回调
    const self: any = this;
    self.resolveMap(this.mapId).then((event: any) => {
      this.init(event.map);
    });
  }

  private init(map?: any) {
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 过滤条件
    const filterInfo = new FilterInfo();
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const featureLocate = GISComponents.featureLocate;
    const searchComponent = new SearchComponent({
      map,
      filterInfo,
      symbolConfig,
      publishObjectPath,
      featureLocate,
      districtServer,
    });

    this.searchComponent = searchComponent;
    this.searchComponent.load();
  }

  private queryPoint(opts: any) {
    this.searchComponent.queryPoint({ x: '112', y: '39' });
  }
  private testplot(type: string) {
    this.searchComponent.setRadius(100000);
    this.searchComponent.startPlot(type);
  }
  private testCircleBuffer(type: string) {
    const coords = {
      x: 111,
      y: 37.5,
    };
    this.searchComponent.setRadius(100000);
    this.searchComponent.drawBufferPoint(coords);
  }
  private testGetBufferGeom() {
    this.searchComponent.getBufferGeom();
  }
  private setRadius(radius: number) {
    this.searchComponent.setRadius(radius);
  }
  private queryDistrict(code: string) {
    this.searchComponent.queryDistrict(code);
  }
  private clearDistrict(code: string) {
    this.searchComponent.clearDistrict(code);
  }
    private clearDistrictAll() {
    this.searchComponent.clearDistrict();
  }
}
</script>
<style lang="less">
</style>
