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
  name: 'LayerManagerComponentDom',
  components: {
      LayerListExample,
  },
  mixins: [MapCommon],
})
export default class LayerManagerComponentDom extends Vue {
  // 地图容器id
  private mapId: string = '';
  // 图层数组
  private layerListArr: any = '';
  // 实时监听
  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
      this.getComponent().load();
      this.getComponent().on('layerManager', this.onPuppup, this);
    });
  }
  /**
   * 图层列表更新时执行的方法(图层没有名称赋值)
   */
  private onPuppup(info: any) {
    for (const item of info.layerList) {
      if (item.id && !item.name) {
        item.name = '暂无名称';
      }
    }
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
    const component = new LayerManagerComponent({
      map,
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
  /**
    * 设置图层显示隐藏
    * @param data 图层信息
    * @param id 图层id
    * @param visible true:图层是显示的  false:图层是隐藏的
    */
  private setLayerVisible(data: any) {
    this.getComponent().setLayerShow(data.id, !data.visible);
  }
}
</script>
<style lang="less" scoped>
</style>
