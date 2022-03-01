<template>
  <div class="coordinate-block">
    <div class="coordinate-item">E {{longitude}}</div>
    <div class="coordinate-item">N {{latitude}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  mixins: [MapCommon],
})
export default class Coordinate extends Vue {
  private longitude: string = '114';
  private latitude: string = '41';

  private mounted() {
    (this as any).resolveMap('map').then((data: any) => {
    //
    this.getComponent().on('mousePosition', this.onMousePosition, this);
    });
  }

  private beforeDestroy() {
  this.getComponent().off('mousePosition', this.onMousePosition, this);
  }

  private onMousePosition(event: any) {
    this.longitude = event.x;
    this.latitude = event.y;
  }

  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('gisToolComp').mousePosition;
    }
    return component;
  }
}
</script>

<style lang="less" scoped>
.coordinate-block {
  display: flex;
  width: max-content;
  background-color: rgba(44, 80, 125, 0.5);
  white-space: nowrap;
  .coordinate-item {
    font-size: 26px;
    color: #fff;
    & + .coordinate-item {
      border-left: 1px solid #fff;
      margin-left: 5px;
      padding-left: 5px;
    }
  }
}
</style>