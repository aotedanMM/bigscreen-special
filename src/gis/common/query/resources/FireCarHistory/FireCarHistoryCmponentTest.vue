<template>
  <div>
    <div class="btn">
      <button @click="addpoint()">加载实时车辆位置</button>
      <button @click="listClick()">列表点击</button>
      <button @click="gethistory()">获取轨迹</button>
      <button @click="remove()">移除实时车辆</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import FireCarHistoryCmponent from './FireCarHistoryCmponent';

@Component({
  name: 'DResourceAnalysisCmponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class DResourceAnalysisCmponentTest extends Vue {

  private mapId: string = '';
  private getComponent: any = '';

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
    const fireCarHistoryCmponent = new FireCarHistoryCmponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      featureHighlight: GISComponents.featureHighlight,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      installSearchReosurce,
    });
    (window as any).fireCarHistoryCmponent = fireCarHistoryCmponent;
    this.getComponent = () => {
      return fireCarHistoryCmponent;
    };
  }

  private addpoint() {
    const opts: any = {};
    const self = this;
    installSearchReosurce.realTimeCar.getFireEnginesInfo(opts).then((res: any) => {
      console.log('car');
      self.getComponent().load(res);
    });
  }
  private gethistory() {
    const num: number = 90; // 之前90天内的数据
    const starttime = this.timeChange(new Date().getTime() - 86400000 * num);
    const endtime = this.timeChange(new Date().getTime());
    const opts: any = {
       gpsid: 16362078819,
       starttime,
       endtime,
    };
    installSearchReosurce.realTimeCar.getFireEnginesInfoHistory(opts).then((res: any) => {
      console.log('carhistory', res);
    });
  }

  private listClick() {
    this.getComponent().openPopup('16362078819');
  }

  private remove() {
    this.getComponent().removeFireCarLayer();
  }
  private timeChange(dates: any) {
      const date = new Date(dates);
      const year = date.getFullYear();
      const mouth: any = date.getMonth() + 1;
      const mouth1 = mouth < 10 ? '0' + mouth : mouth;
      const days: any = date.getDate();
      const days1 = days < 10 ? '0' + days : days;
      const hours: any = date.getHours();
      const hours1 = hours < 10 ? '0' + hours : hours;
      const sconds: any = date.getSeconds();
      const sconds1 = sconds < 10 ? '0' + sconds : sconds;
      const miniuts: any = date.getMinutes();
      const miniuts1 = miniuts < 10 ? '0' + miniuts : miniuts;
      const str = year + '-' + mouth1 + '-' + days1 + ' ' + hours1 + ':' + sconds1 + ':' + miniuts1;
      return str;
  }
}
</script>
<style lang="less" scoped>
.btn{
  position: absolute;
  z-index: 1000;
  top: 300px;
  left:50px;
}
</style>