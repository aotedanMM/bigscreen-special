<template>
  <div class="coordinate-block">
    <div class="coordinate-item">
      空间数据来源：{{dataSource}}
    </div>
    <div class="coordinate-item">
      海拔:{{elevation}}米
    </div>
    <div class="coordinate-item">
      <div >E {{longitude}}</div>
      <div >N {{latitude}}</div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  mixins: [MapCommon],
})
export default class Coordinate3d extends Vue {
  private longitude: string = '114';
  private latitude: string = '41';
  private elevation: string = '';
  private dataSource: string = '科达的地图服务';
  private mounted() {
    (this as any).resolveMap('map').then((data: any) => {
    //
    this.getComponent().on('mousePosition', this.onMousePosition, this);
    this.dataSource = this.getComponent().dataSource;
// this.getComponent().on('addTerrianLayer', this.onAddTerrianLayer, this);
    });
  }

  private beforeDestroy() {
  this.getComponent().off('mousePosition', this.onMousePosition, this);
  }

  private onMousePosition(event: any) {
    this.longitude = parseFloat(event.x).toFixed(6);
    this.latitude = parseFloat(event.y).toFixed(6);
    this.elevation = parseFloat(event.z).toFixed(2);
  }
  // private onAddTerrianLayer(event: any) {
  //   this.dataSource = event.description;
  // }
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('map3d');
    }
    return component;
  }
}
</script>

<style lang="less" scoped>
.coordinate-block {
  width: max-content;;
  .coordinate-item {
    background-color: #2c507d;
    font-size: 26px;
    color: #fff;
    line-height: 30x;
    text-align: center;
    & + .coordinate-item {
      margin-top: 9px;
    }
  }
}
</style>
