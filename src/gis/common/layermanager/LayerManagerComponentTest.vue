<template>
  <div>
    <LayerListExample :layerList = 'layerListArr' @setLayerVisible='setLayerVisible'></LayerListExample>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import LayerManagerComponent from './LayerManagerComponent';
import LayerListExample from '@/gis/common/layermanager/LayerListExample.vue';

@Component({
  name: 'LayerManagerComponentTest',
  mixins: [MapCommon],
  components: {
    LayerListExample,
  },
})
export default class LayerManagerComponentTest extends Vue {
  private mapId: string = '';
  private layerListArr: any = '';
  // 实时监听
  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
      this.getComponent().load();
      this.getComponent().on('layerManager', this.onLayerChange, this);
    });
  }
  // 图层没有名称赋值
  private onLayerChange(info: any) {
    // for (const [ index, item ] of info.layerList) {
    //   if (item.id && !item.name) {
    //     item.name = '暂无名称';
    //   }
    //   if (!(/.*[\u4e00-\u9fa5]+.*$/.test(item.name))) {
    //     info.layerList.splice(index,1);
    //   }
    // }
    info.layerList.forEach((item: any, index: any) => {
        if (item.id && !item.name) {
          item.name = '暂无名称';
        }
        if (!(/.*[\u4e00-\u9fa5]+.*$/.test(item.name))) {
          info.layerList.splice(index, 1);
        }
    });
    this.layerListArr = info.layerList;
  }
  //  地图加载完成后，初始化
  private init(map: any) {
    const temp: any = this;
    // 地图配置
    const mapConfig = temp.$ioc.resolve(`mapConfig-map`);
    // 符号配置
    const symbolConfig = temp.$ioc.resolve(`symbolConfig-map`);
    // 通用的地图组件实例
    const GISComponents = temp.$ioc.resolve(`GISFactory-map`);
    //
    const layerManager: any = new G.common.LayerManager({
        map,
    });
    const component = new LayerManagerComponent({
      map,
      layerManager,
    });
  }
  // 获取地图功能
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('layerManager');
    return component;
  }

  private load() {
    this.getComponent().load();
  }

  private unload() {
    this.getComponent().unload();
  }

  private setLayerVisible(data: any) {
    this.getComponent().setLayerShow(data.id, !data.visible, data);
  }
}
</script>
<style lang="less" scoped>
</style>
