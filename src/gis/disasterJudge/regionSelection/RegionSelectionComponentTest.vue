<template>
  <div>
    <div class="zhdd">
      <ul>
        <li v-for="item in zhddList" :key="item.name">
          {{ item.name }}<button @click="add(item.code)">显示</button
          ><button @click="remove(item.code)">移除</button>
        </li>
      </ul>
      <ul>
        <li>
         <button @click="search()">显示</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RegionSelectionComponent2 from './RegionSelectionComponent';
import { districtServer } from '@/api/installServer';
@Component({
  name: 'WindWaterRainWorkTest',
  components: {},
  mixins: [MapCommon],
})
export default class WindWaterRainWorkTest extends Vue {
  private mapId: string = '';
  private zhddList: any = [
    { id: 1, name: '福山区', code: '370611'}, // 370686
    { id: 2, name: '莱阳市', code: '370681' },
    { id: 3, name: '海阳市', code: '370682' },
    { id: 4, name: '莱州市', code: '370612' },
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
    this.commandDispatch = new RegionSelectionComponent2({
        map,
        service: districtServer,
        symbolConfig,
        GISComponents,
    });
    (window as any).commandDispatch = this.commandDispatch;
    this.commandDispatch.load();
  }

  private add(code: any) {
    this.commandDispatch.drawRegion(code);
  }
  private remove(code: any) {
    this.commandDispatch.removeRegin(code);
  }
}
</script>
<style lang="less" scoped>
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
