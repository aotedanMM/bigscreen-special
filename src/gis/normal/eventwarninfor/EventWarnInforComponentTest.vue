<template>
  <div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import DXisasterJudgeDistrictComponent from './EventWarnInforComponent';
import {
  warningInfoServer,
  managementOnDutyServer,
  weatherServer,
} from '@/api/installServer';
import {commonDistrictServer} from '@/api/feature/normal/installNormalServer';


@Component({
  name: 'DXisasterJudgeDistrictComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {

  private mapId: string = '';

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
    // const component = new DXisasterJudgeDistrictComponent({
    //   map,
    //   mapConfig,
    //   symbolConfig,
    //   GISComponents,
    //   service: warningInfoServer,
    //   commonDistrictServer,
    // });
    // component.load();

    // warningInfoServer
    //   .getTypeData({
    //     type: '11B16',
    //     startTime: '2019-12-11 15:28:55',
    //     endTime: '2019-12-14 09:28:55',
    //   })
    //   .then((res: any) => {
    //     console.log('res=>', res);
    //     component.addResource(res.data);
    //   });
  }
}
</script>
<style lang="less" scoped>
</style>