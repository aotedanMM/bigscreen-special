<!--物资保障的总控制页面，也是入口页面-->
<template>
  <div class="materialSupportContainer">
    <MaterialSupport v-show="rescueTeamHomeShow"
                     :parentHandleClickNumFn="handleClickNumFn"></MaterialSupport>
    <MaterialSupportDetail v-show="!rescueTeamHomeShow"
                           v-on:backParents="backParents"
                           :rescueTeamHomeData="rescueTeamHomeData"
                           class="animated flipInY"></MaterialSupportDetail>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MaterialSupport from '@/components/feature/materialsupport/MaterialSupport.vue';
import MaterialSupportDetail from '@/components/feature/materialsupport/MaterialSupportDetail.vue';
import { dataSourcesServer } from '@/api/installServer';

@Component({
  name: 'MaterialSupportContainer',
  components: {
    MaterialSupport, // 物资保障首页
    MaterialSupportDetail, // 物资保障详情页
  },
})
export default class MaterialSupportContainer extends Vue {
  private rescueTeamHomeData: any = {};
  private rescueTeamHomeShow: boolean = true;
  public mounted() {
    this.getComponent().on('popup', this.getPop, this);
    this.messsageBus.on('rescueTeamHomeData', (data: any) => {
        this.rescueTeamHomeData = data;
        this.rescueTeamHomeShow = false;
    });

  }
  // 监听地图上的点击事件
  private getPop(event: any) {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: { showFlag: true },
    });
    this.rescueTeamHomeData = event.attrObj;
    this.rescueTeamHomeShow = false;
  }

  private handleClickNumFn(resultData: any) {
    this.rescueTeamHomeData = resultData;
    this.rescueTeamHomeShow = false;
  }
  // 详情页返回主页面
  private backParents() {
    this.rescueTeamHomeShow = true;
  }
  // 公用GIS方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewRepertory',
    );
    return component;
  }
  // 页面销毁后清除地图的点位
  private destroyed() {
    this.getComponent().unload();
    this.getComponent().off('popup', this.getPop, this);
  }
}
</script>
<style lang="less" scoped>
.materialSupportContainer{
    width: 100%;
    height: 100%;
}
</style>
<style lang="less">
.materialSupportContainer
  .MaterialSupport
  .el-pagination
  .el-pagination__total {
  font-size: 18px !important;
  vertical-align: bottom !important;
  line-height: 1 !important;
}
.materialSupportContainer .MaterialSupport .el-pagination .el-pager li,
.materialSupportContainer
  .MaterialSupport
  .el-pagination
  .el-pager
  li:last-child {
  font-size: 20px !important;
}
// .materialSupportContainer
//   .MaterialSupport
//   .constomMyElPage.el-pagination
//   .el-pager
//   li {
//   width: 27px !important;
// }
</style>
