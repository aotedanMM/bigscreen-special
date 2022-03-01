<template>
  <!-- 弹框 -->
  <div class="risk-hidden-popup">
    <div class="title">
      <span :title="name">{{ name }}</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <el-scrollbar>
        <div class="item" v-for="(item, index) in dataList" :key="index">
          <span :title="item.alias">{{ item.alias }}</span>
          <span :title="item.value">{{ item.value }}</span>
        </div>
      </el-scrollbar>
      <div class="zbVideobtn" @click="aroundVideoAnalysisClick(zbVideo.xy)">
        周边视频
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
  name: 'RiskHiddenPointPopup',
})
export default class RiskHiddenPointPopup extends Vue {
  private name: any = '';
  private dataList: any = [];
  private zbVideo: any = {};
  public mounted() {
    const self: any = this;
    console.log(self, 'datapopup');
    self.event.data.forEach((item: any) => {
      if (item.value && item.value !== null) {
        if (item.name === 'name') {
          this.name = item.value;
        } else {
          this.dataList.push(item);
        }
      } else {
        item.value = '暂无数据';
        this.dataList.push(item);
      }
    });
    this.zbVideo = this.dataList.pop();
    console.log(this.dataList, 'this.dataList');
    console.log(this.zbVideo, 'this.zbVideo');
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../assets/img/gisModule/PopulationFeverBox';
@titleH: 70px;
.risk-hidden-popup {
  // width: 480px;
  width: 533px;
  height: 510px;
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
    background: url('@{url}/topbg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    span {
      display: block;
      width: 340px;
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
      top: 6px;
      right: 0px;
      width: 90px;
      height: 48px;
      background: url('@{url}/closeBtn.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      &:hover {
        background: url('@{url}/closeHover.png') no-repeat;
      }
    }
  }
  .content {
    height: calc(100% - @titleH - 56px);
    padding: 10px 30px;
    // box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .el-scrollbar {
      // height: 350px;
      height: calc(100% - 51px);
    }
    .item {
      display: flex;
      width: 100%;
      height: 48px;
      line-height: 48px;
      font-size: 26px;
      span {
        padding-left: 10px;
        min-height: 30px;
        font-family: 'PingFangSC-Regular', 'PingFang SC';
        font-weight: 400;
        font-style: normal;
        color: #ffffff;
        text-align: left;
        line-height: 48px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-child(1) {
          width: 180px;
          margin-right: 10px;
          vertical-align: top;
        }
        &:nth-child(2) {
          flex: 1;
          color: #fdff00;
        }
      }
      &:nth-child(2n) {
        background: url('@{url}/list-bg2.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .zbVideobtn {
    float: right;
    width: 118px;
    height: 40px;
    border: solid 1px #02e9d5;
    color: white !important;
    padding: 0 5px;
    margin: 10px 1px 1px 10px;
    font-size: 28px;
    line-height: 40px;
    cursor: pointer;
    background: transparent;
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
