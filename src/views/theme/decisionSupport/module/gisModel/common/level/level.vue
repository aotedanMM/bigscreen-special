<template>
  <div class="coordinate-block">
    <div class="coordinate-level">级别: {{level}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  mixins: [MapCommon],
})
export default class Level extends Vue {
  private level: string = '';

  private mounted() {
    (this as any).resolveMap('map').then((data: any) => {
      this.getComponent().on('levelChanged', this.showLevel, this);
    });
  }

  private beforeDestroy() {
  this.getComponent().on('levelChanged', this.showLevel, this);
  }
  private showLevel(event: any) {
    this.level = event.level;
  }

  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('gisToolComp');
      this.level = component.getCurrentLevel();
    }
    return component;
  }
}
</script>

<style lang="less" scoped>
.coordinate-block {
  .coordinate-level{
    // width: 86px;
    // height: 14px;
    // line-height: 14px;
    position: absolute;
    color: #dfdfdf;
    border: 1px solid #eee;
    border-top: none;
    background: rgba(0,60,136,.5);
    font-size:26px;
    line-height: 1;
    text-align: center;
    margin: 1px;
    will-change: contents, width;
    left: 160px;
    bottom: 31px;
    padding:0 5px;
    white-space: nowrap;
  }
}
</style>
