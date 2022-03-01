<template>
  <div style="position:absolute;z-index:9999">
    <button class="el-button" @click="testWMS()">添加房屋分布</button>
    <button class="el-button" @click="testJson()">添加房屋结构</button>
    <button class="el-button" @click="deleteWMS()">删除房屋分布</button>
    <button class="el-button" @click="deleteJson()">删除房屋结构</button>
    <button class="el-button" @click="closePop()">关闭tooltip</button>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import QueryHouseComponent from './QueryHouseComponent';
import { districtServer } from '@/api/installServer';
import SearchResourceServices from '@/api/feature/searchresource/installSearchReosurce';
@Component({
  name: 'QueryHouseComponentTest',
  mixins: [MapCommon],
})
export default class QueryHouseComponentTest extends Vue {
  private mapId: any = 'map';
  private queryHouseComponent: any = null;
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
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const queryHouseComponent = new QueryHouseComponent({
      map,
      symbolConfig,
      GISComponents,
      districtServer,
      buildingServer: SearchResourceServices.buildingServer,
    });
    this.queryHouseComponent = queryHouseComponent;
    this.queryHouseComponent.load();
    this.queryHouseComponent.on('housePopup', (data: any) => {
      console.log('测试弹出框');
      console.log(data);
      jQuery('#house_popup_id').append('<b>省分发付付付付付付付付付付付付付</b>');
    });
  }
  private testWMS(type: string) {
    this.queryHouseComponent.addHouseDistr();
  }
  private testJson() {
  //  const code = '532529'; // 县
    const code = '532501'; // 市
    this.queryHouseComponent.addHouseStruc(code);
  }
  private deleteWMS() {
    this.queryHouseComponent.deleteHouseDistr();
  }
  private deleteJson() {
    this.queryHouseComponent.deleteHouseStruc();
  }
  private closePop() {
    this.queryHouseComponent.closePopup();
  }

}
</script>
<style lang="less">
</style>
