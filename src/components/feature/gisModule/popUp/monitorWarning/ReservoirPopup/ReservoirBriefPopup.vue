<template>
  <!-- 风情弹框 -->
  <div class="water-monitor-popup">
    <div class="title">
      <!-- {{ data.name }} -->
      <span>{{ReservoirDetail.name ? ReservoirDetail.name + '详情' : ''}}</span>
      <i @click="close()"></i>
    </div>
    <div class="content">
      <ReservoirBrief :data="ReservoirDetail"></ReservoirBrief>
    </div>

    <div class="bottom"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
import ReservoirBrief from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirBrief.vue'; // 左侧详情信息
/**
 * 监测预警
 */
@Component({
  name: 'WindMonitorPopup',
  components: { ReservoirBrief },
})
export default class WindMonitorPopup extends Vue {
  // private data: any = {};
  private ReservoirDetail: any = {};

  public mounted() {
    const self: any = this;
    // this.data = self.event.data;
    this.getReservoirDetail(self.data.id);
  }
  private async getReservoirDetail(id: any) {
    const res = await reservoirServer.getReservoirDetail({ id });
    console.log(res.data.data, 'resresresres');
    this.ReservoirDetail = res.data.data; // 储存返回的数据
    this.ReservoirDetail.display = 'none';
    this.ReservoirDetail.flag = true;
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../../assets/img/gisModule/PopulationFeverBox';
@titleH: 60px;
.water-monitor-popup {
  width: 570px;
  height: 760px;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .title {
    padding: 10px 45px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @titleH;
    background: url('@{url}/topbg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    font-size: 20px;
    span {
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: calc(20px * 1.2);
      color: 00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
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
    height: calc(100% - @titleH - 69px);
    padding: 5px 45px 15px;
    box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .left {
      background: none;
      height: 100%;
      display: flex;
      flex-direction: column;
      .capacity {
        height: 201px;
        overflow: auto;
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
