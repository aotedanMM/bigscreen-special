<template>
 <LegendView :originData="tags" v-if="tags.data.length>0"></LegendView>
</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import LegendView from '@/components/feature/gisModle/gisLegend/LegendView.vue';
import MapCommon from '@/util/MapCommon';
@Component({
    name: 'MapLegendView',
    components: {
        LegendView,
    },
    mixins: [MapCommon],
})
export default class MapLegendView extends Vue {
    public tags = {
        isShow: false,
        title: '图例',
        data: [
          // {
          //   src: 'iphone.png',
          //   title: '救援力量',
          // },
          // {
          //   src: 'iphone.png',
          //   title: '医疗保障',
          // },
        ],
  };

  public mounted() {
    this.resolveMap('map').then(async (map: any) => {
      // this.getComponent().off('legend-change');
      this.getComponent().on('legend-change', this.onChange, this);
      //
      const data: any = await this.getComponent().getLegends();
      this.onChange(data);
    });
  }

  public beforeDestroy() {
      this.getComponent().off('legend-change');
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('commonInteract');
    return component;
  }

  private onChange(data: any) {
    this.tags.data = data.list;
  }
}
</script>
