<template>
  <div>
    <div class="zhdd">
      <ul>
        <li v-for="item in zhddList" :key="item.name">
          {{ item.name }}<button @click="add()">显示</button
          ><button @click="remove()">移除</button>
        </li>
      </ul>
      <ul>
        <li>
         <button @click="locat()">定位</button>
        </li>
      </ul>
      <ul>
        <li>
         <button @click="removelocat()">移除高亮</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import WindWaterRainWork from './videoLayer';
import {communicationServer, disasterJudgeServer, districtServer , hazServer} from '@/api/installServer';
import { regionSelectionServer } from '@/api/installServer';
import {
  windSituationServer,
  rainSituationServer,
  waterSituationServer,
  engineeringSituationServer,
  warningInfoServer,
  videoSituationServer,
} from '@/api/feature/monitorwarning/installServer';
@Component({
  name: 'WindWaterRainWorkTest',
  components: {},
  mixins: [MapCommon],
})
export default class WindWaterRainWorkTest extends Vue {
  private mapId: string = '';
  private zhddList: any = [
    { id: 1, name: '视频监控', featureType: 'videoPoint' },
    { id: 2, name: '视频监控', featureType: 'videoPoint' },
    { id: 3, name: '视频监控', featureType: 'videoPoint' },
    { id: 4, name: '视频监控', featureType: 'videoPoint' },
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
    this.commandDispatch = new WindWaterRainWork({
        map,
        service: videoSituationServer,
        symbolConfig,
        GISComponents,
    });
    (window as any).commandDispatch = this.commandDispatch;
    this.commandDispatch.load();

    this.commandDispatch.on('WindWaterRainWork_popup', (data: any) => {
      console.log(data);
      jQuery('#WindWaterRainWork_popup_id').append(
        '<b>省分发付付付付付付付付付付付付付</b>',
      );
    });
  }

  private add() {
    this.commandDispatch.addResource('video', {});
  }
  private remove() {
    this.commandDispatch.removeResource();
  }
  private locat() {
    this.commandDispatch.locatResource('id', '1');
  }
  private removelocat() {
    this.commandDispatch.removeHighlight();
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
