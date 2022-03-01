<template>
  <div>
    <div class='zhdd'>
      <ul>
        <li v-for='item in zhddList' :key='item.name'>
          {{ item.name }}
          <button @click='add(item.featureType)'>显示</button>
          <button @click='remove(item.featureType)'>移除</button>
        </li>
      </ul>
      <ul>
        <li>
          <button @click='search()'>显示</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import ResourceQuery from './ResourceQuery';
import {
  communicationServer,
  disasterJudgeServer,
  districtServer,
  hazServer,
} from '@/api/installServer';
import { regionSelectionServer } from '@/api/installServer';
import {
  resourceServer,
  riskServer,
  protectTargetServer,
} from '@/api/feature/defensiveprepation/installServer';
@Component({
  name: 'ResourceQueryTest',
  components: {},
  mixins: [MapCommon],
})
export default class ResourceQueryTest extends Vue {
  private mapId: string = '';
  private zhddList: any = [
    { id: 1, name: '危险建筑', featureType: 'wxjz' },
    { id: 2, name: '地灾隐患', featureType: 'dzyh' },
    { id: 2, name: '山洪隐患', featureType: 'shyh' },
    { id: 3, name: '易涝路段', featureType: 'ylld' },
    { id: 4, name: '建筑工地', featureType: 'jzgd' },
    { id: 1, name: '涵闸', featureType: 'hz' },
    { id: 2, name: '内涝点', featureType: 'nld' },
    { id: 3, name: '电力设施', featureType: 'dlss' },
    { id: 4, name: '通讯设施', featureType: 'txss' },
  ];
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
    // 通用的地图组件实例

    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    this.commandDispatch = new ResourceQuery({
      map,
      service: {
        resourceServer,
        riskServer,
        protectTargetServer,
      },
      symbolConfig,
      GISComponents,
    });
    (window as any).commandDispatch = this.commandDispatch;
    this.commandDispatch.load();

    this.commandDispatch.on('ResourceQuery_popup', (data: any) => {
      console.log(data);
      jQuery('#ResourceQuery_popup_id').append('<b>toolTip显示</b>');
    });
  }

  private add(featureType: any) {
    const self = this;
    const opt: any = {
      layerId: 'bas_geologichazard',
      keyword: '',
      districtCode: '',
    };
    this.commandDispatch._addHeatMap('fxyh');
    // this.commandDispatch.service.resourceServer
    //   .getPageList(opt)
    //   .then(function(data: any) {
    //      data.type = featureType;
    //      self.commandDispatch._addResource(data);
    //   });
  }
  private search() {
    this.commandDispatch.locate('wxjz', 'objectid', 557);
  }
  private remove(featureType: any) {
    this.commandDispatch.removeResoureByType('wxjz');
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
.wave_container_point_communication {
  position: absolute;
  width: 120px;
  height: 120px;
  margin-left: -97px;
  margin-top: -25px;
}
.wave_container_point_communicationBFS {
  position: absolute;
  width: 120px;
  height: 120px;
  margin-left: -97px;
  margin-top: -25px;
}

.wave_red ._wave_point {
  /*border: 5px solid rgba(184, 20, 29, 1);*/
  background: rgba(184, 20, 29, 1);
}
</style>
