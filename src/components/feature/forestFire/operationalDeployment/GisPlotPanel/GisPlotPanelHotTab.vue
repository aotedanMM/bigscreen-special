<template>
  <ul class="hotTab">
    <p>{{hotTabDatas}}</p>
    <p>{{localPic}}</p>
    <li
      v-for="(item, index) in hotTabDatas"
      :key="item.name"
      @click="hotIconClick(item, index)"
      :class="{ iconLiActive: index == hotIconIndex }"
    >
      <img :src="item.icons" alt />
      <div>{{ item.name }}</div>
    </li>
    <gis-panel-local-pic v-if="localPic"
      ref="gisPanelLocalPic"
      :mapComponent="mapComponent"
      :mapOpts="mapOpts"
      :plotIcons="plotIcons"
    ></gis-panel-local-pic>
  </ul>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { plotServer, plotNoSqlService } from '@/api/installServer';
import GisPanelLocalPic from './GisPlotPanelLocalPic.vue';
@Component({
  name: 'GisPlotPanelHotTab',
  components: {
    GisPanelLocalPic,
  },
})
export default class GisPlotPanelHotTab extends Vue {
  @Prop() public leftTabValue?: any;
  @Prop() public hotIconIndex?: any;
  // @Prop() public commonIconIndex?: any;
  @Prop() public options?: any;
  @Prop() public mapComponent?: any;
  @Prop() public mapOpts?: any;
  @Prop() public eventType?: any;
  @Prop() public plotIcons?: any;
  private localPic = false;
  private hotTabDatas = [];

  /**
   * plotIcons 有值时 再进行加载
   */
  @Watch('plotIcons')
  private updateplotIcons(val: any) {
    if (val) {
      this.gethotDatas(this.eventType);
    }
  }

  private created() {
    this.updateplotIcons(this.plotIcons);
  }
  private mounted() {
    //
  }
    // 图标点击事件;
  private hotIconClick(item: any, index: any) {
    this.mapComponent.draw(item, this.mapOpts.businessId);
  }
  // 请求常用标绘数据;
  private gethotDatas(eventType: any) {
    const type = eventType || this.eventType;
    return new Promise((resolve, reject) => {
      // 1 service.hotTabDats 更换了请求方法，已替换成返回正确的请求
      plotServer
        .getFrequentPlotSymbol({eventType: type})
        .then((res: any) => {
          const temp: any = res;
          const plotIconObj: any = this.plotIcons;
          const dataList = temp[0].data;
          const lastData = dataList[dataList.length - 1];
          if (lastData.boxName && lastData.visible) {
            this.localPic = true;
            dataList.pop();
            this.hotTabDatas = dataList;
          } else {
            this.hotTabDatas = temp[0].data;
          }
          if (this.hotTabDatas && this.hotTabDatas.length) {
            this.hotTabDatas.map((item: any) => {
            const obj: any = item;
            obj.icons = this.options.iconImageDir + '/' + obj.icons;
            obj.base64 = plotIconObj[obj.tit];
          });
          }
          resolve();
        });
    });
  }
   private refreshLocalPic() {
    if ((this.$refs as any).gisPanelLocalPic) {
      if ((this.$refs as any).gisPanelLocalPic instanceof Array) {
        (this.$refs as any).gisPanelLocalPic[0].refreshLocalPic();
      } else {
        (this.$refs as any).gisPanelLocalPic.refreshLocalPic();
      }
    }
  }
}
</script>
