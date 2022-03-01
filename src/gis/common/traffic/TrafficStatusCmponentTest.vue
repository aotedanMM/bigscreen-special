<template>
  <div>
    <div class="btn">
      <button @click="getpoint()">点</button>
      <button @click="getline()">线</button>
      <button @click="getpolygon()">面</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import TrafficStatusCmponent from './TrafficStatusCmponent';

@Component({
  name: 'TrafficStatusCmponentTest',
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
    const component = new TrafficStatusCmponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
    });
    // this.component.on('popup',(data: any) => {
    //    console.log(data);
    // })
    //
    const testDataLineString: any = {key: 'traffic', data: [{count: 1, geom: {type: 'LineString', coordinates: [[116.34027008, 39.8484956], [116.34251312, 39.888247]]}, dealStatus: 0}, {count: 1, geom: {type: 'LineString', coordinates: [[117.34027008, 39.8484956], [116.34251312, 39.888247]]}, dealStatus: 0}, {count: 1, geom: {type: 'LineString', coordinates: [[116.39394133, 39.85569184],  [116.3457099, 39.85002979]]}, dealStatus: 1}]};
    const testData: any = {key: 'traffic', data: [{count: 1, geom: {type: 'MultiLineString', coordinates: [[[116.34027008, 39.8484956], [116.34251312, 39.888247]]]}, dealStatus: 0}, {count: 1, geom: {type: 'MultiLineString', coordinates: [[[117.34027008, 39.8484956], [116.34251312, 39.888247]]]}, dealStatus: 0}, {count: 1, geom: {type: 'MultiLineString', coordinates: [[[116.39394133, 39.85569184],  [116.3457099, 39.85002979]]]}, dealStatus: 1}]};
    const testData1: any = {key: 'traffic', data: [{name: '南三环中路', isblock: '2', blocksit: null, isResume: '0', selectid: '2', startDotted: '', endDotted: '', distance: '5506.14', type: '公路', count: 1, geom: {type: 'MultiLineString', coordinates: [[[116.39394133, 39.85569184], [116.3457099, 39.85002979]]]}, dealStatus: 1}]};
    const testData2: any = {key: 'traffic', data: [{type: '公路', geom: {type: 'MultiLineString', coordinates: [[[116.34027008, 39.8484956], [116.34251312, 39.888247]]]}}]};
    const lstdData: any = {key: 'traffic', data: [{name: '南三环中路', isblock: '0', blocksit: null, isResume: '0', selectid: '0', startDotted: '', endDotted: '', distance: '494.20', type: '公路', count: 1, geom: {type: 'MultiLineString', coordinates: [[[116.34027008, 39.8484956], [118.335957, 39.84771247]]]}, dealStatus: 1}]};
    const dlshData: any = {key: 'traffic', data: [{name: '北京-广州', isblock: '1', blocksit: null, isResume: '0', selectid: '1', startDotted: '', endDotted: '', distance: '5758.72', type: '公路', count: 1, geom: {type: 'MultiLineString', coordinates: [[[116.34027008, 39.8484956], [116.34027583, 39.84853718], [116.34031136, 39.84887721], [116.34034098, 39.84920116], [116.34040715, 39.84992484], [116.34056152, 39.85119248], [116.34163206, 39.86009346], [116.34166909, 39.86040128], [116.34211644, 39.86420976], [116.34229721, 39.8667709], [116.3423726, 39.86759223], [116.3424, 39.86802543], [116.34255208, 39.86910922], [116.34256661, 39.86921789], [116.34299703, 39.8724375], [116.34311139, 39.87329293], [116.34311977, 39.87388497], [116.34308925, 39.87466281], [116.34306802, 39.87627659], [116.34306575, 39.87644855], [116.34278154, 39.87943524], [116.34257905, 39.88374357], [116.34256882, 39.88546045], [116.34256873, 39.88625885], [116.34251312, 39.888247]]]}, dealStatus: 0}, {name: '南三环中路', isblock: '1', blocksit: null, isResume: '0', selectid: '1', startDotted: '', endDotted: '', distance: '5506.14', type: '公路', count: 1, geom: {type: 'MultiLineString', coordinates: [[[116.39394133, 39.85569184], [116.39247943, 39.8556988], [116.38833546, 39.85566334], [116.38787609, 39.8556635], [116.38537825, 39.85567903], [116.38419154, 39.85567938], [116.38059055, 39.85570072], [116.37717056, 39.85572352], [116.37670118, 39.85572496], [116.3766647, 39.85572507], [116.3731815, 39.85575923], [116.36934419, 39.85575993], [116.36838304, 39.85569881], [116.36739299, 39.85565441], [116.36547381, 39.85540816], [116.36544176, 39.85540405], [116.36437218, 39.85517026], [116.3619006, 39.85450775], [116.35884411, 39.85366297], [116.35763687, 39.85332927], [116.3568868, 39.85312652], [116.35406072, 39.85234953], [116.35354885, 39.85220902], [116.35306646, 39.85207712], [116.3508795, 39.85147788], [116.34793174, 39.8506593], [116.34771816, 39.85059879], [116.34769835, 39.85059318], [116.3457099, 39.85002979]]]}, dealStatus: 0}]};
    component.load('lstd', dlshData);

    (window as any).trafficStatus = component;
  }
}
</script>
<style lang="less" scoped>
.btn{
  position: absolute;
  z-index: 1000;
}
</style>