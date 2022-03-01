<template>
  <!-- 工情弹框 -->
  <div class="water-monitor-popup">
    <div class="title">
      <span :title="data.name" :class="data.name&&data.name.length>25?'affterSpan':''">{{data.name ? data.name : '暂无数据'}}</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <div class="content-name">
        <span>名称</span>
        <span class="value" :title="data.name">{{data.name ? data.name : '暂无数据'}}</span>
      </div>
      <div class="content-address">
        <span>所在河道</span>
        <span class="value">{{data.rch ? data.rch : '暂无数据'}}</span>
        <span>所在堤围</span>
        <span class="value">{{data.bnscid ? data.bnscid : '暂无数据'}}</span>
        <span>所在区划</span>
        <span class="value">{{data.address ? data.address : '暂无数据'}}</span>
      </div>
      <div class="engineeringOrder">工程等级<span class="value">{{data.gchdj ? data.gchdj : '暂无数据'}}</span></div>
      <div class="personLiable">
        <div>
          <span>防汛责任人</span>
          <span class="value">暂无数据</span>
        </div>
        <div>
          <span>防汛行政责任单位</span>
          <span class="value">暂无数据</span>
          <span>防汛行政责任人职务</span>
          <span class="value">暂无数据</span>
        </div>
        <div>
          <span>防汛技术责任人</span>
          <span class="value">暂无数据</span>
        </div>
        <div>
          <span>防汛技术责任单位</span>
          <span class="value">暂无数据</span>
          <span>防汛技术责任人职务</span>
          <span class="value">暂无数据</span>
        </div>
        <div>
          <span>管理单位责任人单位</span>
          <span class="value">暂无数据</span>
          <span>管理单位责任人职务</span>
          <span class="value">暂无数据</span>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 监测预警
 */
@Component({
  name: 'EngineeringMonitorPopup',
})
export default class EngineeringMonitorPopup extends Vue {
  private data: any = {};
  public mounted() {
    const self: any = this;
    this.data = self.event.data;
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../assets/img/gisModule/PopulationFeverBox';
@titleH: 60px;
.water-monitor-popup {
  width: 835px;
  height: 437px;
  font-size: 20px;
  color: #fff;
  border-radius: 5px;
  overflow: hidden;
  .title {
    position: relative;
    padding: 10px 50px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @titleH;
    background: url("@{url}/topbg.png") no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    span {
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: calc(20px * 1.2);
      color: #00e4ff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width:650px;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .affterSpan{
      position: relative;
      &::after{
      content:'...';
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      color: #f5f7c3;
      position: absolute;
      right: 20px;
      top: 4px;
      }
    }
    i {
      position: absolute;
      top: 4px;
      right: 10px;
      width: 90px;
      height: 48px;
      background: url("@{url}/closeBtn.png") no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url("@{url}/closeHover.png") no-repeat;
      }
    }
  }
  .content {
    height: calc(100% - @titleH - 69px);
    padding: 10px 50px;
    // box-sizing: border-box;
    background: url("@{url}/centerBg.png") no-repeat;
    background-size: 100% 100%;
    .value {
      font-size: 20px;
      line-height: 21px;
      color: #FFFF00;
    }
    .content-name {
      height: 26px;
      width: 100%;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .value {
        margin-left: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 660px;
        display: inline-block;
      }
    }
    .content-address {
      height: 26px;
      width: 100%;
      margin-bottom: 20px;
      .value {
        margin-left: 30px;
        margin-right: 40px;
      }
    }
    .engineeringOrder {
      height: 26px;
      width: 100%;
      margin-bottom: 20px;
      .value {
        margin-left: 30px;
      }
    }
    .personLiable {
      div {
        height: 35px;
        span {
          vertical-align:top;
          height: 100%;
          line-height: 35px;
          &:nth-child(2n-1) {
            display: inline-block;
            width: 180px;
            height: 35px;
          }
          &:nth-child(2) {
            display: inline-block;
            margin-left: 20px;
            width: 210px;
            height: 35px;
          }
          &:nth-child(2) {
            margin-left: 20px;
          }
          &:nth-child(4) {
            margin-left: 20px;
            display: inline-block;
            width: 120px;
            height: 35px;
          }
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url("@{url}/botBg-.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
