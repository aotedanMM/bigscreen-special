<template>
  <div class="shleter" v-if="showShleter">
    <div class="shleter_top">
      <span>{{data.district}}</span>
      <span>待安置{{data.totalPlacement - data.totalPlacementVictims}}人</span>
      <span class="close" @click="close()">X</span>
    </div>
    <div class="shleter_bottom">
      <div class="total_capacity">
        <span>已安置/总容量：</span>
        <span>{{data.totalCapacityPlaced}}/{{data.totalCapacity}}</span>
      </div>
      <div class="graph">
        <span class="graph_left">
          <span class="num" :style="{'width':computedWidth(data.totalCapacityPlaced,data.totalCapacity)+'px'}"></span>
        </span>
        <span class="percent">{{((data.totalCapacityPlaced/data.totalCapacity) * 100).toFixed(0)}}%</span>
      </div>
      <div class="total_victims">
        <span>已安置/总灾民：</span>
        <span>{{data.totalPlacementVictims}}/{{data.totalPlacement}}</span>
      </div>
      <div class="graph">
        <span class="graph_left">
          <span class="num" :style="{'width':computedWidth(data.totalPlacementVictims,data.totalPlacement)+'px'}"></span>
        </span>
        <span class="percent">{{((data.totalPlacementVictims/data.totalPlacement) * 100).toFixed(0)}}%</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';

@Component({
  name: 'Shleter',
  components: {
  },
})
export default class Shleter extends Vue {

  private showShleter: any = true;
  private computedWidth(a: any, b: any) {
    const villeage = ((a / b) * 100).toFixed(0);
    return villeage;
  }
  private close() {
    this.showShleter = false;
  }
  // 联动gis方法 开始
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('Shleter');
        return component;
    }
    private onShowPopup(event: any) {
        const  self = this;
        const param = {
            that: self,
            popupId: 'popup',  //  监听id，必须
            moduleTypeID: 'Shleter', //  实体类资源模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
    }
    private mounted() {
        // this.getComponent().off('popup', this.onShowPopup, this);
        // this.getComponent().on('popup', this.onShowPopup, this);
    }
}
</script>
<style lang="less" space>
@url: '../../../../../../../assets/img/eventInfo';
@tableHead: '../../../../../../../assets/img/default/table/tableHead_bg.png';
.shleter {
  position: absolute;
  // top: 220px;
  // left: 60px;
  z-index: 9999;
  height: 360px;
  width: 530px;
  background: rgba(0, 0, 0, 0.5);
  color: #bad3e1;
  font-size: 20px;
  .shleter_top {
    width: 100%;
    height: 60px;
    background: url(@tableHead)  no-repeat;
    background-size: 100% 100%;
    line-height: 60px;
    position: relative;
    display: flex;
    &::before{
       content: '';
        width: 54px;
        height: 54px;
        background: url('@{url}/dotdefault.png') no-repeat center / 100% 100%;
        flex-shrink: 0;
    }
    & span {
      &:nth-child(1) {
        font-size: 30px;
        font-weight: 700;
        color:#fff;
      }
      &:nth-child(2) {
        margin-left: 10px;
      }
    }
    .close {
      position: absolute;
      top: 0;
      right: 16px;
      cursor: pointer;
    }
  }
  .shleter_bottom {
    .total_capacity {
      width: 350px;
      // background: red;
      margin: 0px auto;
      margin-top: 66px;
      margin-bottom: 20px;
    }
    .graph {
      width: 320px;
      height: 30px;
      margin-left: 160px;
      .graph_left {
        width: 250px;
        height: 20px;
        border-radius: 30px;
        background: #f2f2f2;
        display: inline-block;
        position: relative;
        .num {
          height: 20px;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 30px;
          background: #01e3fd;
        }
      }
      .percent {
        margin-left: 10px;
      }
    }
    .total_victims {
      width: 350px;
      // background: red;
      margin: 23px auto;
    }
  }
}
</style>
