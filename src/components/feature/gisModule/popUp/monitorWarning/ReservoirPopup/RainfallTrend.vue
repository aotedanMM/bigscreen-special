<template>
  <!-- 未来3天降雨趋势 -->
  <div class="RainfallTrend">
    <div class="echarts" ref="echarts" id="rain_map"></div>
    <div class="bottom-tab">
      <div class="btnBox">
        <span :class="isPlay ? 'pause' : 'play'" @click="play"></span>
        <span class="time">{{ tabList[activeIndex].name }}</span>
      </div>
      <ul>
        <li
          v-for="(item, index) in tabList"
          :key="index"
          :class="{ active: activeIndex === index }"
          @click="clickItem(index)"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
import Map from '@/gis/Map';
import { mapServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import RainForecast24_48_72 from '@/gis/common/rainForecast/RainForecast24_48_72';
@Component({
  name: 'RainfallTrend',
  components: {},
})
export default class RainfallTrend extends Vue {
  @Prop() public data!: any; // 接受数据
  private isPlay: boolean = false; // 播放
  private tabList: any = [
    {
      name: '24小时',
      type: '',
    },
    {
      name: '48小时',
      type: '',
    },
    {
      name: '72小时',
      type: '',
    },
  ];
  private activeIndex: number = 0;
  private interval: any = null;
  private map: any = null; // 地图对象
  private RainForecast: any = null; // 降水组件

  public async mounted() {
    // 地图配置
    const mapConfigRes = await mapServer.getConfig('./json/map.json');
    const mapInstance = new Map({
      targetId: 'rain_map',
      mapConfig: mapConfigRes.data,
      serviceConfig: publishObjectPath.value,
    });
    mapInstance.init();
    this.map = mapInstance.getMap();
    this.CreatComponent();
    this.RainForecast.load();
  }
  @Watch('activeIndex', { immediate: true })
  private getData() {
    // 时间切换触发地图方法
    console.log('降雨趋势切换');
    this.RainForecast.play(this.activeIndex);
  }
  private play() {
    // 点击播放/暂停
    this.isPlay = !this.isPlay;
    if (this.isPlay) {
      this.interval = setInterval(() => {
        this.activeIndex += 1;
        if (this.activeIndex >= 3) {
          this.activeIndex = 0;
        }
        // this.RainForecast.play(this.activeIndex);
      }, 3000);
    } else {
      clearInterval(this.interval);
    }
  }
  private clickItem(index: any) {
    clearInterval(this.interval);
    this.activeIndex = index;
  }
  private destroyed() {
    // 销毁定时器
    clearInterval(this.interval);
    this.RainForecast.unload();
  }
  private CreatComponent() {
    this.RainForecast = new RainForecast24_48_72({
      map: this.map,
      serviceConfig: publishObjectPath.value,
    });
  }
}
</script>

<style lang="less" scoped>
@reservations: '../../../../../../assets/img/reservoirPopup';
.RainfallTrend {
  position: relative;
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: calc(100% - 70px);
  }
  .bottom-tab {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 69px;
    border: 1px solid #257490;
    border-top: none;
    .btnBox {
      height: 100%;
      .play {
        display: inline-block;
        width: 69px;
        height: 100%;
        cursor: pointer;
        vertical-align: middle;
        background: url('@{reservations}/play.png') no-repeat;
        background-size: 100% 100%;
      }
      .pause {
        display: inline-block;
        width: 69px;
        height: 100%;
        cursor: pointer;
        vertical-align: middle;
        background: url('@{reservations}/pause.png') no-repeat;
        background-size: 100% 100%;
      }
      .time {
        font-size: 26px;
        color: #e8f4fe;
        line-height: 49px;
      }
    }
    ul {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 27px;
      width: 102px;
      height: 100%;
      li {
        width: 29px;
        height: 8px;
        background-color: #257490;
        border-radius: 4px;
        cursor: pointer;
        &.active {
          background-color: #109cf5;
        }
      }
    }
  }
}
</style>
