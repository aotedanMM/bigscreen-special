<template>
  <div class="YJ-headWeather-panel weather-animate">
    <div class="weatherClose" @click="weatherCloseClick">×</div>
    <el-scrollbar class="my-scrollbar" style="height:100%">
        <div style="padding-right: 15px">
            <div class="administrativeSearch">
                <administrative-search-paln :FnClickCode="FnClickCode" :currentPosition="currentPosition"></administrative-search-paln>
            </div>
            <div class="module-item">
                <weather-panel-frame title="当前实况" v-if="weatherDQSKFlag">
                    <weather-dqsk :weatherDQSKObj="weatherDQSKObj"></weather-dqsk>
                </weather-panel-frame>
            </div>
            <div class="module-item">
                <weather-panel-frame title="气温和降水趋势图">
                    <bar-and-line-chart :JXYBData="JXYBData"></bar-and-line-chart>
                </weather-panel-frame>
            </div>
            <div class="module-item">
                <weather-panel-frame title="各项空气质量">
                    <weather-gxkqzl :weatherGxkqzlKQ="weatherGxkqzlKQ" :weatherGxkqzlQT="weatherGxkqzlQT"></weather-gxkqzl>
                </weather-panel-frame>
            </div>
            <div class="module-item">
                <weather-tab-frame v-if="tabFlag" :weatherCode='weatherCode'></weather-tab-frame>
            </div>
            <div class="module-item">
                <weather-panel-frame title="气象要素图">
                    <weather-meteorological :WeatherMeteorologicalDatas="WeatherMeteorologicalDatas"></weather-meteorological>
                </weather-panel-frame>
            </div>
        </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { weatherServer } from '@/api/installServer.ts';
import { districtServer } from '@/api/installServer';
import {
  IWeatherImageListItem,
  IWeatherListItem,
  IMeteorologicalElementMapListItem,
  IAirQualityLabelListItem,
  IAirQualityDataListItem,
} from '@/interface/feature/common/weather/Weather.interface.ts';
import AdministrativeSearchPaln from '@/views/common/weatherDisasterArea/administrativeSearchPlan.vue';
import WeatherPanelFrame from '@/components/feature/common/weatherDisasterArea/weatherPanelFrame/WeatherPanelFrame.vue';
import WeatherDqsk from '@/components/feature/common/weatherDisasterArea/weatherDQSK/WeatherDQSK.vue';
import WeatherGxkqzl from '@/components/feature/common/weatherDisasterArea/weatherGXKQZL/WeatherGXKQZL.vue';
import BarAndLineChart from '@/views/common/weatherDisasterArea/BarAndLineChart.vue';
import WeatherTabFrame from '@/views/common/weatherDisasterArea/WeatherTabFrame.vue';
import WeatherMeteorological from '@/components/feature/common/weatherDisasterArea/WeatherMeteorological/WeatherMeteorological.vue';
@Component({
  components: {
    WeatherPanelFrame,
    WeatherDqsk,
    WeatherGxkqzl,
    BarAndLineChart,
    WeatherTabFrame,
    WeatherMeteorological,
    AdministrativeSearchPaln,
  },
})
export default class WeatherDisasterAreaPanel extends Vue {
  private administrativePlanning: any = '';
  private currentPosition: any = '110000';
  private weatherCode: any = '';
  private tabFlag: any = true;
  private weatherDQSKObj: any = {
    dayms: '',
    dq: '',
    dqqw: '',
    fl: '',
    fx: '',
    icon: '',
  };
  private weatherDQSKFlag: boolean = false;

  private weatherGxkqzlKQ: IAirQualityLabelListItem[] = [
    {
      title: '空气质量',
      value: '3',
      key: 'aqitext',
    },
    {
      title: '空气质量指数',
      value: '2',
      key: 'aqi',
    },
  ];
  private weatherGxkqzlQT: IAirQualityDataListItem[] = [];

  private WeatherMeteorologicalDatas: IMeteorologicalElementMapListItem[] = [
    {
      label: '卫星<br>云图',
      iconclass: 'icon1',
      activeclass: 'activeClass1',
      checked: false,
    },
    {
      label: '降水<br>预报图',
      iconclass: 'icon2',
      activeclass: 'activeClass2',
      checked: false,
    },
    {
      label: '高温<br>预报图',
      iconclass: 'icon3',
      activeclass: 'activeClss3',
      checked: false,
    },
    {
      label: '低温<br>预报图',
      iconclass: 'icon3',
      activeclass: 'activeClass4',
      checked: false,
    },
    {
      label: '降温大风<br>预报图',
      iconclass: 'icon4',
      activeclass: 'activeClass5',
      checked: false,
    },
  ];
  private JXYBData: any = [];
  private weatherRN: any = '';
  private weatherCloseClick() {
    this.$store.commit('updateShowWeatherPanel', false);
    this.messsageBus.emit('closeSatelliteCloudPicture');
  }
  // 利用计算属性返回当前行政区划CODE
  get COMreturnCode(): any {
    return this.administrativePlanning;
  }
  // 传给行政规划组件
  private FnClickCode(val: any): void {
    this.$store.commit('updateCode', val.id);
    this.administrativePlanning = this.$store.getters.getCode;
    this.currentPosition = val;
  }

  @Watch('$store.state.eventPushStore.eventId')
  private FnMonitor(): void {
    weatherServer.getAdministrative().then((data: any) => {
      const res = data.data;
      let codeData = {};
      this.$store.commit('updateCode', this.$store.state.eventPushStore.district.code);
      for (const iterator of res) {
        if (iterator.id === this.$store.getters.getCode) {
          codeData = iterator;
        }
      }
      this.currentPosition = codeData;
    });
  }
  // 监听传来的行政区划CODE有没有改变，如果有改变就重新查新一次天气
  @Watch('$store.getters.getCode')
  private getDatas() {
    let curIndex = 0;
    const that = this;
    this.tabFlag = false;
    this.$nextTick(() => {
      this.tabFlag = true;
    });
    this.weatherCode = this.$store.getters.getCode;
    // 当前实况数据获取
    weatherServer.getImgConfigData().then((res: IWeatherImageListItem[]) => {
      const imgMap = res;
      weatherServer
        .getWeatherData({ type: '3D', code: this.COMreturnCode })
        .then((data: any) => {
          if (data && JSON.stringify(data.data) !== '{}') {
            for (const iterator of JSON.parse(data.data.data)) {
              if (iterator.rqtj === 'today') {
                this.weatherDQSKObj = iterator;
              }
            }
            curIndex = that.findIndexFromImgMap(
              this.weatherDQSKObj.dayms,
              imgMap,
            );
            this.weatherDQSKObj.icon = imgMap[curIndex].value;
          } else {
            // 设置默认值，或是不写。因为接口定义与赋值不匹配
            this.weatherDQSKObj = [];
          }
          this.weatherDQSKFlag = true;
        });
    });
    // 各项空气质量数据获取
    weatherServer
      .getAirQualityDataList()
      .then((data: IAirQualityDataListItem[]) => {
        this.weatherGxkqzlQT = data;
      });
    // 获取全天温度曲线
    weatherServer
      .getJXYBData({ type: '24H', code: this.COMreturnCode })
      .then((res: any) => {
        // console.log(res.data, 'res.data');
        if (JSON.stringify(res.data) === '{}') {
          return false;
        }
        const JXYBJSON = JSON.parse(res.data[this.COMreturnCode]);
        const JXYBData = [];
        for (let index = 0; index < JXYBJSON.length; index++) {
          if (
            index === 2 ||
            index === 5 ||
            index === 8 ||
            index === 11 ||
            index === 14 ||
            index === 17 ||
            index === 20 ||
            index === 23
          ) {
            JXYBData.push(Number(JXYBJSON[index].jb));
          }
        }
        this.JXYBData = JXYBData;
      });
    // 获取降雨量
    weatherServer
      .getHyetologyDataList({ type: 'RN', code: this.COMreturnCode })
      .then((data: any) => {
        if (JSON.stringify(data.data) === '{}') {
          return false;
        }
        const RNJSON = JSON.parse(JSON.parse(data.data.data)[0].content);
        const RNData = [];
        for (const key in RNJSON) {
          if (RNJSON.hasOwnProperty(key)) {
            RNData.push(RNJSON[key]);
          }
        }
        this.weatherRN = JSON.parse(JSON.parse(data.data.data)[0].content);
      });
  }

  private findIndexFromImgMap(str: any, arr: any[]) {
    let curIdex = 0;
    arr.forEach((item: any, index: number) => {
      if (str === item.label) {
        curIdex = index;
      }
    });
    return curIdex;
  }
  private created() {
    this.getDatas();
    this.administrativePlanning = this.$store.getters.getCode;
    // this.FnMonitor();
  }
}
</script>
<style scoped lang="less">
@keyframes weather-animate {
  from {
    right: -1000px;
  }
  to {
    right: 14px;
  }
}
.administrativeSearch {
  width: 70%;
  height: auto;
  position: absolute;
  top: 0;
  left: 30%;
  display: flex;
  justify-content: flex-start;
}
.YJ-headWeather-panel {
  box-sizing: border-box;
  width: 100%;
  height: 96%;
  animation: weather-animate 2s;
  background-color: rgba(0, 5, 25, 1);
  box-shadow: inset 0px 0px 30px 10px #041d47;
  position: absolute;
  top: 30px;
  right: 14px;
  padding: 30px 50px;
  .weatherClose {
    position: absolute;
    top: 10px;
    right: 15px;
    color: white;
    font-size: 28px;
    cursor: pointer;
  }
  .module-item {
    width: 100%;
  }
}
</style>
<style>
.my-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
