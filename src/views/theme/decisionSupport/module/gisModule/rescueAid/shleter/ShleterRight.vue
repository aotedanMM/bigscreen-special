<template>
  <!-- <div class="ShleterRight"> -->
    <AreaList
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :definitionWidth="definitionWidth"
      :FnMouserLeave="FnMouserLeave"
    ></AreaList>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AreaList from '@/components/common/render/AreaList.common.vue';
import Shleter from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/Shleter.vue';
@Component({
  name: 'ShleterRight',
  components: {
    AreaList,
  },
})
export default class ShleterRight extends Vue {
   private title = '安置点';
  private filexed = ['num', 'district', 'morePeople'];
  private IsPagination = true;
  private eventInfo: any = {};
  private eventInfoPop: any = null;
  private listData: any = [];
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 110,
  };
  private listCheck: any = '';
 private header = [
    {
      num: '序号',
    },
    {
      district: '名称',
    },
    {
      morePeople: '待安置人数(人)',
    },
  ];
  // 对应的事件对象
  private eventObject = {
    onclick: this.onTableClick,
    hover: this.onTableHover,
  };
  private definitionWidth = {
    district: '30%',
    name: '30%',
    morePeople: '30%',
  };
  private FnMouserLeave(): void {
    // 取消划上
  }
  private onTableHover() {
    return true;
  }
  private onTableClick() {
    return true;
  }
  private mounted() {
    this.messsageBus.on('shleterRight', (val: any) => {
      val.forEach((item: any) => {
      item.morePeople = item.totalPlacement - item.totalPlacementVictims;
      });
      this.listData = val;
    });
  }
  private clickItemEvent(item: any, index: number) {
    this.getComponent().openPopup(item.id);
    this.getComponent().locateSingleDistrict(item.id);
    this.getComponent().highLightDistrict(item.id);
  }
  // 联动gis方法 开始
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.rescueHelpFactory.getComponent('peopleArrangement');
        return component;
    }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
// .ShleterRight {
//   position: absolute;
//   top: -16px;
//   left: 20px;
//   z-index: 9999;
// }
</style>