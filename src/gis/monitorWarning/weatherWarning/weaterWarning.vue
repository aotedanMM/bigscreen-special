<!--
 * @Descripttion:  气象监测测试
 * @Date: 2020-05-06 15:55:31
 * @LastEditors: tande
 * @LastEditTime: 2020-05-06 17:56:15
 -->
<template> 
<div class="zhdd">
      <ul>
        <li>
         <button @click="addPointLayer()">显示</button>
        </li>
      </ul>
      <ul>
        <li>
         <button @click="remove()">移除</button>
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WeatherWarning from './weatherWarning';
import MapCommon from '@/util/MapCommon';
import { warningInfoServer } from '@/api/installServer';
@Component({
  name: 'WeatherWarningTest',
  components: {},
  mixins: [MapCommon],
})
export default class WeatherWarningTest extends Vue {
  private mapId: string = '';
  private commandDispatch: any;

  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
    });
  }

  // 地图加载完成后，初始化
  private init(map: any) {
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 通用的地图组件实例
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);

    this.commandDispatch = new WeatherWarning({
      map,
      service: warningInfoServer,
      symbolConfig,
      GISComponents,
    });
    this.commandDispatch.load();
    this.commandDispatch.on('weatherWarningLayer_popup', this.popupData, this);
  }

  // 渲染点位
  private addPointLayer() {
    this.commandDispatch.addResource({});
  }
  private remove() {
    this.commandDispatch.removeResource();
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
</style>
