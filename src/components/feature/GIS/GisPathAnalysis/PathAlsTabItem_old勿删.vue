<template>
  <div class="tabItemClass">
      <div class="tabListItemWrap" 
          v-for="(item, index) in pathAlslistDatas" 
          :key = "index" 
          @click="toSinglePathNode(item)">
          <div :class="item.iconClass" ></div>
          <p class="tabListItem" v-html="item.strguide"></p>
      </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  name: 'PathAlsTabItem',
  components: {},
})
export default class PathAlsTabItem extends Vue  {



  public pathAlslistDatas: any = [];
  public iconObj: any = {
      右转: 'right',
      左转: 'left',
      直行: 'straight',
  };
  public mapComponent: any = null;

  @Prop()
  private pathanalysislist: any;

  @Prop()
  private getComponent: any;

  public toSinglePathNode(item: any) {
      this.getComponent().showSingleRoad(item);
  }
  @Watch('pathanalysislist')
  private handler(val: any) {
      this.pathAlslistDatas = [];
      if (val.length) {
          val.map((item: any) => {
              const temp = this.iconObj[item.direct] ? this.iconObj[item.direct] : 'straight';
              item.iconClass = temp;
              this.pathAlslistDatas.push(item);
          });
      }
  }
  private created() {
    console.log('111111');
  }
}
</script>
<style lang='less' scoped>
  @imgPath: '../../../../assets/img/gisModule/pathAnalysis';
  .tabItemClass {
    margin: 2px 0;
    height: 300px;
    padding: 0 10px;
    overflow-y: auto;
    .tabListItemWrap {
      box-sizing: border-box;
      width: 100%;
      position: relative;
      border: 1px solid #4af4ff;
      margin-top: 7px;
      padding: 8px 0;
      cursor: pointer;
      div {
        position: absolute;
        left: 0px;
        top: 8px;
        width: 45px;
        height: 33px;
        z-index: 30;
        background-repeat: no-repeat;
        background-size: 12px 14px;
        background-position: center center;
      }
      .right {
        background-image: url("@{imgPath}/right.png");
      }
      .left {
        background-image: url("@{imgPath}/left.png");
      }
      .straight {
        background-image: url("@{imgPath}/straight.png");
      }
      .tabListItem {
        width: 100%;
        line-height: 33px;
        text-indent: 45px;
        color: #fff;
        font-size: 26px;
        b {
          font-weight: normal;
          color: #4af4ff;
        }
      }
    }
  }
</style>
