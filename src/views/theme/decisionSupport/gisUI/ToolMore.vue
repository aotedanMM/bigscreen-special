<!--导航的地图工具箱-->
<template>
  <GisMapToolMore :originData="originDatas" @clickHandler="clickToolItem"></GisMapToolMore>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import {IMapToolItem} from '@/interface/feature/common/mapTool/MapTool.interface';
import GisMapToolMore from '@/components/feature/gisModle/gisMapTool/GisMapToolMore.vue';
import { staticDataRequestServer } from '@/api/installServer';

@Component({
  name: 'GisMapToolViewHelp',
  components: {
    GisMapToolMore,
  },
})
export default class GisMapToolViewHelp extends Vue {
  @Prop() private toolMoreConfigData!: any;
  private originDatas: any[] = [];
  private originDataFlag = true;

  @Watch('toolMoreConfigData')
  public changeToolMoreConfigData(val: any) {
    if (val) {
      this.originDatas = JSON.parse(JSON.stringify(val));
    }
  }

  public clickToolItem(toolItem: any) {
    // this.$emit('clickToolItemPush', toolItem);
    // console.log('========>',toolItem)
    // this.$emit('clickHandler', toolItem);
  }

  public created() {
    this.changeToolMoreConfigData(this.toolMoreConfigData);
  }
}
</script>
<style lang="less" scoped>
</style>