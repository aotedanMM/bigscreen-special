<template>
  <div>
    <div class="zhdd">
      <ul>
        <li v-for="(item) in zhddList" :key="item.name">
          {{item.name}}<button @click="add(item.id)">显示</button><button @click="remove(item.id)">移除</button>
        </li>
      </ul>
      
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import CommandDispatch from './CommandDispatch';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import {communicationServer, disasterJudgeServer, districtServer , hazServer} from '@/api/installServer';

@Component({
  name: 'CommandDispatchTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class CommandDispatchTest extends Vue {

  private mapId: string = '';
  private zhddList: any = [
    {id: 1, name: '北斗终端', featureType: '01'},
    {id: 2, name: '天通终端', featureType: '02'},
    {id: 3, name: '视频回传', featureType: '03'},
    {id: 4, name: '短波台', featureType: '04'},
    {id: 5, name: '消防车辆', featureType: '05'},
    {id: 6, name: '消防移动终端', featureType: '06'},
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
    //
    const eventInfo = new EarthQuakeEventInfo([], []);
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    this.commandDispatch = new CommandDispatch({
        map,
        service: communicationServer,
        symbolConfig,
        eventInfo,
        GISComponents,
    });

    (window as any).commandDispatch = this.commandDispatch;
    this.commandDispatch.load();
    (this as any).resolveMap.call(this, 'map').then(() => {
      (window as any).commandDispatch.on('command_dispatch_icon_click', this.testClickEvent, this);
    });
  }

  private testClickEvent(event: any) {
      console.log(event);
  }

  private add(featureType: any) {
    console.log('featureType', featureType);
    const opts = {
      type: featureType,
    };
    this.commandDispatch.addResource(opts);
  }

  private remove(id: any) {
    this.commandDispatch.removeResource({type: id});
  }
}
</script>
<style lang="less" scoped>
  .zhdd{
    background-color: yellow;
    position: absolute;
    top: 200px;
    left: 50%;
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
      background:rgba(184, 20, 29, 1);
  }
</style>