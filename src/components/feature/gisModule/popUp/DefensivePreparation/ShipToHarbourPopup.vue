<template>
  <!-- 船舶转移弹框 -->
  <div class="risk-hidden-popup">
    <div class="title">
      <span :title="data.districtname">{{ data.districtname }}</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <div class="pandect" v-show="dataType.type == 'ship'">
        <div>
          <span>受影响船只：</span
          ><span class="yellow">{{
            data.shipsAffectedNum.value ? data.shipsAffectedNum.value : 0
          }}</span
          ><span>{{ data.shipsAffectedNum.unit }}只</span>
        </div>
        <div>
          <span>已归港船只：</span
          ><span class="yellow">{{
            data.shipsBackPortNum.value ? data.shipsBackPortNum.value : 0
          }}</span
          ><span>{{ data.shipsBackPortNum.unit }}只</span>
        </div>
        <div>
          <span>归港率：</span
          ><span class="yellow">{{
            toPercent(data.shipRatio ? data.shipRatio : 0)
          }}</span
          ><span>%</span>
        </div>
      </div>
      <div class="pandect" v-show="dataType.type == 'ashore'">
        <div>
          <span>受影响人员：</span
          ><span class="yellow">{{
            data.personnelAffectedNum.value
              ? data.personnelAffectedNum.value
              : 0
          }}</span
          ><span>{{ data.personnelAffectedNum.unit }}人</span>
        </div>
        <div>
          <span>已上岸人员：</span
          ><span class="yellow">{{
            data.personnelAshoreNum.value ? data.personnelAshoreNum.value : 0
          }}</span
          ><span>{{ data.personnelAshoreNum.unit }}人</span>
        </div>
        <div>
          <span>上岸率：</span
          ><span class="yellow">{{
            toPercent(data.peopleRatio ? data.peopleRatio : 0)
          }}</span
          ><span>%</span>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 防御准备
 */
@Component({
  name: 'ShipToHarbourPopup',
})
export default class ShipToHarbourPopup extends Vue {
  private data: any = {};
  private dataType: any = {};
  public mounted() {
    const self: any = this;
    console.log(self.event, 'datapopup');
    this.data = self.event.data;
    this.dataType = self.event;
  }
  //  转换 百分比
  private toPercent(point: any) {
    if (point === 0) {
      return 0;
    }
    const str = Number(point * 100).toFixed(2);
    return str;
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../assets/img/gisModule/PopulationFeverBox';
@titleH: 70px;
.risk-hidden-popup {
  width: 480px;
  // height: 290px;
  font-size: 20px;
  color: #fff;
  border-radius: 5px;
  overflow: hidden;
  .title {
    font-size: 28px;
    position: relative;
    padding: 10px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    height: @titleH;
    background: url('@{url}/topbg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    span {
      width: 370px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
    }
    i {
      position: absolute;
      top: 5px;
      right: 0px;
      width: 90px;
      height: 48px;
      background: url('@{url}/closeBtn.png') no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url('@{url}/closeHover.png') no-repeat;
      }
    }
  }
  .content {
    height: calc(100% - @titleH - 130px);
    padding: 10px 18px;
    // box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .yellow {
      &:hover {
        color: #fff000 !important;
      }
    }
    .pandect {
      div {
        padding: 0 15px;
        width: 100%;
        height: 60px;
        &:nth-child(2) {
          width: 92%;
          background-color: rgba(82, 183, 234, 0.13);
        }
        span {
          display: inline-block;
          height: 100%;
          font-size: 28px;
          color: #00eaff;
          line-height: 60px;
          vertical-align: middle;
          &:nth-child(2) {
            font-family: 'Impact';
            font-weight: 400;
            font-size: 32px;
            line-height: 55px;
          }
          &:nth-child(3) {
            color: #fff;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
