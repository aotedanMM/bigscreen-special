<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import AfterShockComponent from './AfterShockComponent';

@Component({
  name: 'AfterShockComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {

  private mapId: string = '';
   private component: any = '';

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
    const component = new AfterShockComponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
    });
    // 测试数据
    const testData: any = {key: 'SEND_AFTERSHOCK_INFO', event: {str: '共记录到3.0级以上总数为<span>1</span>个.其中7.0~7.9级地震<span>0</span>个,6.0~6.9级地震<span>0</span>个,5.0~5.9级地震<span>0</span>个,4.0~4.9级地震<span>0</span>个,3.0~3.9级地震<span>1</span>个.', list: [{id: '78af133b796c47b3899ad54eb8ea835c', date: '2019-12-23', time: '02:44:02', epiLat: '39.85', epiLon: '117.33', eDeep: '10', eClass: '3.3', address: '天津蓟州区'}, {id: '6ad624291dbf41158edb6aca9e961229', date: '2019-12-10', time: '22:28:00', epiLat: '40.30', epiLon: '116.37', eDeep: '18', eClass: '2.0', address: '北京昌平区'}], mainId: '123424'}};
    (window as any).afterShock = component;
    component.load(testData);
    // component.locate('78af133b796c47b3899ad54eb8ea835c');
  }
}
</script>
<style lang="less" scoped>
.btn{
  position: absolute;
  z-index: 1000;
}
</style>