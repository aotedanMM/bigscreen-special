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
import ResourceAnalysisCmponent from './ResourceAnalysisCmponent';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer';

@Component({
  name: 'DResourceAnalysisCmponentTest',
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
    this.component = new ResourceAnalysisCmponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      featureHighlight: GISComponents.featureHighlight,
    });
    this.component.load();
  }

  private getpoint() {
    const ss: any = {
            level: 1,
            name: '',
            adcode: '',
            sub: 2,
            polygon: false,
            eId: 'siptea',
    };
    resourceanalysisServer.getDistrict(ss).then((res: any) => {
       console.log('qqq', res);
    });
    const self = this;
    this.component.DrawPoint(100, (res: any) => {
      const opts: any = {
          Keyword: '',
          districtCode: '',
          resourceKeys: ['floodteam'],
          flatTag: true,
      };
      const opts2: any = {
          Keyword: '',
          districtCode: '',
          resourceKeys: ['floodteam'],
          buffer: res,
          flatTag: true,
          point: [115.21554243779553, 30.9149354518662],
          radius: 50,
        };
      resourceanalysisServer.getNearbyList(opts2).then((res2: any) => {
          console.log(res2);
          self.component.addPointsOnMap(res2.list);
      });
     });
    //  this.component().on('EventPointspopup',(res: any)=>{
    //     console.log('1',res);
    //  });
  }
}
</script>
<style lang="less" scoped>
.btn{
  position: absolute;
  z-index: 1000;
}
</style>
