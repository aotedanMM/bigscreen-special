<template>
  <div>
    <div class="btn" style="zIndex: 9999; position: absolute;">
      <button @click="load()">加载</button>
      <button @click="play()">播放</button>
      <button @click="pause()">暂停</button>
      <button @click="finish()">结束</button>
      <button @click="unload()">卸载</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import HistoryTrackComponent from './HistoryTrackComponent';

@Component({
  name: 'HistoryTrackComponentTest',
  components: {},
  mixins: [MapCommon],
})
export default class HistoryTrackComponentTest extends Vue {
  private mapId: string = '';

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    this.fireCom = null;
    this.fireData = null;
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
    const historyTrackComp = new HistoryTrackComponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      featureHighlight: GISComponents.featureHighlight,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
    });
    this.fireCom = historyTrackComp;
    (window as any).historyTrackComp = historyTrackComp;
  }
  // private load() {
  //   // 获取轨迹数据
  //   installSearchReosurce.realTimeCar
  //     .getFireEnginesInfoHistory({
  //       //  gpsid: '11725040530',
  //       gpsid: '01725030016',
  //       starttime: '2019-11-11 11:52:00',
  //       endtime: '2019-11-11 17:36:00',
  //     })
  //     .then((data: any) => {
  //       // todo
  //       console.log('轨迹数据');
  //       console.log(data);
  //       this.fireData = data;
  //       this.fireCom.load(data);
  //       this.listner();
  //     });
  // }
  private load() {
    // 获取轨迹数据
    const data = this.getTrack();
    this.fireData = data;
    this.fireCom.load(data);
    this.listner();
  }

  private getTrack() {
    const data = [{
      id: '8a55d1fff3ef4d478b5bf565dcba86e3',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-02-21 13:02:06',
      longitude: '102.738583',
      latitude: '30.753638',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '362978878f264b5aa7d4e1e572b77463',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-02-21 13:07:53',
      longitude: '102.737666',
      latitude: '30.759555',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '6aed1f42414149baa79b9ea7898df5c4',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-02-21 13:08:53',
      longitude: '102.736972',
      latitude: '30.759111',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '2733b28d262b4896a91a7071c481a9e9',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-02-21 13:10:53',
      longitude: '102.737305',
      latitude: '30.759166',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: 'a765782d50da4cf797c7f5e5896c8076',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-02-21 14:34:43',
      longitude: '102.692138',
      latitude: '30.686750',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '925b5d44fe63431ba37f88040a595316',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-03-09 14:35:43',
      longitude: '102.692138',
      latitude: '30.686777',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '352023409f9f43bd84ac0d14c4179d45',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-03-10 14:36:43',
      longitude: '102.692138',
      latitude: '30.686805',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '797c2d3bf9e444b7a2770c15d041a2ed',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-03-10 14:57:36',
      longitude: '102.666833',
      latitude: '30.680833',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }, {
      id: '51d7ca2a828f4970b65741baa2dadbd1',
      sourceAddress: '343124',
      destAddress: '',
      time: '2020-03-10 14:58:36',
      longitude: '102.666972',
      latitude: '30.680833',
      high: '',
      azimuth: '0',
      speed: '0',
      satChoose: '',
      rtdType: '1',
    }];
    return data;
  }
  // 开始
  private play() {
    this.fireCom.play(this.fireData);
  }
  // 暂停
  private pause() {
    this.fireCom.pause();
  }
  // 停止
  private finish() {
    this.fireCom.finish();
  }
  // 卸载
  private unload() {
    this.fireCom.unload();
  }

  private listner() {
    this.fireCom.on('carTrackMoveEvent', (data: any) => {
      console.log(data);
    });
    this.fireCom.on('finish', (data: any) => {
      alert('finished');
    });
  }
}
</script>
<style lang="less" scoped>
</style>