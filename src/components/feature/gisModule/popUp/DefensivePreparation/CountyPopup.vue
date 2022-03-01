<template>
  <!-- 区县统计弹框 -->
  <div class="risk-hidden-popup">
    <div class="title">
      <span class="span" :title="data.districtname + '转移情况'"
        >{{ data.districtname }}转移情况</span
      >
      <i @click="close()"></i>
    </div>
    <div class="content">
      <el-scrollbar style="height: 100%;">
        <div class="ScrollbarContent">
          <div class="pandect">
            <div>
              <span>预计转移人数:</span
              ><span class="yellow">{{
                personnelData.estimated ? personnelData.estimated : 0
              }}</span>
              <span v-if="personnelData.estimated.toString().indexOf('.') > 0"
                >万人</span
              >
              <span v-else>人</span>
            </div>
            <div>
              <span>实际转移人数:</span
              ><span class="yellow">{{
                personnelData.practical ? personnelData.practical : 0
              }}</span>
              <span v-if="personnelData.practical.toString().indexOf('.') > 0"
                >万人</span
              >
              <span v-else>人</span>
            </div>
          </div>
          <ul class="detail">
            <li>
              <div>受影响船只</div>
              <div v-if="shipData.shipsAffectedNum.toString().indexOf('.') > 0">
                <span class="yellow">{{ shipData.shipsAffectedNum }}</span
                >万只
              </div>
              <div v-else>
                <span class="yellow">{{ shipData.shipsAffectedNum }}</span
                >只
              </div>
            </li>
            <li>
              <div>已归港船只</div>
              <div v-if="shipData.shipsBackPortNum.toString().indexOf('.') > 0">
                <span class="yellow">{{ shipData.shipsBackPortNum }}</span
                >万只
              </div>
              <div>
                <span class="yellow">{{ shipData.shipsBackPortNum }}</span
                >只
              </div>
            </li>
            <li>
              <div>受影响人员</div>
              <div v-if="shipData.personnelAffectedNum.toString().indexOf('.') > 0">
                <span class="yellow">{{ shipData.personnelAffectedNum }}</span
                >万人
              </div>
              <div v-else>
                <span class="yellow">{{ shipData.personnelAffectedNum }}</span
                >人
              </div>
            </li>
            <li>
              <div>已上岸人员</div>
              <div v-if="shipData.personnelAshoreNum.toString().indexOf('.') > 0">
                <span class="yellow">{{ shipData.personnelAshoreNum }}</span
                >万人
              </div>
              <div>
                <span class="yellow">{{ shipData.personnelAshoreNum }}</span
                >人
              </div>
            </li>
          </ul>
          <div>
            <CountyPopupChild :districtcode="data.districtcode"></CountyPopupChild>
          </div>
        </div>
      </el-scrollbar>  
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import CountyPopupChild from '@/components/feature/gisModule/popUp/DefensivePreparation/CountyPopupChild.vue';
/**
 * 防御准备
 */
@Component({
    name: 'CountyPopup',
    components: {
        CountyPopupChild, // 风险隐患点
    },
})
export default class CountyPopup extends Vue {
  private data: any = {};
  private personnelData: any = {};
  private shipData: any = {};

  private created() {
    const self: any = this;
    this.data = self.event.data;
  }
  // private mounted() {
    // const self: any = this;
    // console.log(self.event.data, 'datapopup11');
    // this.data = self.event.data;
  // }
  private changgeUnit(value: any) {
    if (!value) {
      return 0;
    }
    if (value < 10000) {
      return value;
    } else {
      return (value / 1000).toFixed(2);
    }
  }
  @Watch('data', { immediate: true, deep: true })
  private setData() {
    const personnelData = this.data.cacheData.PersonnelTransfer.targetData;
    const shipData = this.data.cacheData.ShipToHarbour.targetData;
    this.personnelData = {
      estimated: this.changgeUnit(personnelData.estimated),
      practical: this.changgeUnit(personnelData.practical),
    };
    this.shipData = {
      shipsAffectedNum: this.changgeUnit(shipData.shipsAffectedNum),
      shipsBackPortNum: this.changgeUnit(shipData.shipsBackPortNum),
      personnelAffectedNum: this.changgeUnit(shipData.personnelAffectedNum),
      personnelAshoreNum: this.changgeUnit(shipData.personnelAshoreNum),
    };
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../assets/img/gisModule/PopulationFeverBox';
@titleH: 60px;
.risk-hidden-popup {
  width: 480px;
  height: 550px;
  font-size: 20px;
  color: #fff;
  border-radius: 5px;
  overflow: hidden;
  .title {
    position: relative;
    padding: 10px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: 600;
    height: @titleH;
    background: url('@{url}/topbg-.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    .span {
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
      top: 4px;
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
    .yellow {
      &:hover {
        color: #fff000 !important;
      }
    }
    height: calc(100% - @titleH - 69px);
    padding: 10px 18px;
    // box-sizing: border-box;
    background: url('@{url}/centerBg-.png') no-repeat;
    background-size: 100% 100%;

    .ScrollbarContent{
      padding:2px 25px;
    }

    .pandect {
      div {
        padding: 0 15px;
        width: 100%;
        height: 48px;
        span {
          display: inline-block;
          height: 100%;
          font-size: 28px;
          color: #00eaff;
          line-height: 48px;
          vertical-align: middle;
          &:nth-child(2) {
            font-family: 'Impact';
            font-weight: 400;
            margin-left: 5px;
            font-size: 32px;
            line-height: 40px;
          }
          &:nth-child(3) {
            color: #d2e1ec;
            margin-left: 5px;
          }
        }
      }
    }
    .detail {
      height: 192px;
      border: 1px solid #0b4869;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 25px 0 15px;
        height: 48px;
        line-height: 48px;
        font-size: 28px;
        color: #d2e1ec;
        div {
          height: 100%;
          &:nth-child(2) {
            span {
              display: inline-block;
              height: 100%;
              font-weight: 400;
              margin-right: 10px;
              vertical-align: top;
              font-family: 'Impact';
              font-size: 32px;
              color: #00eaff;
            }
          }
        }
        &:nth-child(2n) {
          background: url('@{url}/list-bg2.png') no-repeat;
          background-size: 100% 100%;
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
