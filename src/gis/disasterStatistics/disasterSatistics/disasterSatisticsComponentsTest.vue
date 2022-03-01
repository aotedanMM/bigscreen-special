<template>
  <div>
    <div class='zhdd'>
      <ul>
        <li v-for='item in zhddList' :key='item.name'>
          {{ item.name }}
          <button @click='add()'>显示</button>
          <button @click='remove()'>移除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import { pushDataRequestServe } from '@/api/installServer';
import DisasterJudgeDistrictComponent from './disasterSatisticsComponent';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
@Component({
  name: 'DisasterJudgeDistrictComponentTest',
  components: {},
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {
  private mapId: string = '';
  private zhddList: any = [{ id: 1, name: '行政区划', featureType: 'dis' }];
  private commandDispatch: any;
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

    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    this.commandDispatch = new DisasterJudgeDistrictComponent({
      map,
      service: installDisasterJudgeServer.districtServer,
      symbolConfig,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
      GISComponents,
    });
    (window as any).commandDispatch = this.commandDispatch;
    this.commandDispatch.load();
  }
  //  监听
  // @Watch('$store.state.eventPushStore.nature_disaster')
  // private async getDataByServ() {
  //   const resData = await pushDataRequestServe.getPushDataByIds(
  //     this.$store.state.eventPushStore.eventId,
  //     'nature_disaster'
  //   );
  //   return resData;
  // }
  private add() {
    // const data: any = disaststerData;
    this.commandDispatch.addDistrict({});
  }
  private remove() {
    this.commandDispatch.removeDistrict();
  }
}
</script>
<style lang='less' scoped>
.zhdd {
  background-color: yellow;
  position: absolute;
  top: 200px;
  left: 30%;
  z-index: 99999;
}
</style>
