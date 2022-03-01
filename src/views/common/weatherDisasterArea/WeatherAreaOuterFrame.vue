<template>
  <div class="weatherAreaOuterFrameClass" v-if="weatherFlag">
    <weather-disaster-area :weatherObj="weatherObj"></weather-disaster-area>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { weatherServer } from '@/api/installServer.ts';
import {
  IWeatherImageListItem,
  IWeatherListItem,
} from '@/interface/feature/common/weather/Weather.interface.ts';
import WeatherDisasterArea from '@/components/feature/common/weatherDisasterArea/weatherDisasterAreaOne/WeatherDisasterArea.feature.vue';

@Component({
  name: 'WeatherAreaOuterFrame',
  components: {
    WeatherDisasterArea,
  },
})
export default class WeatherAreaOuterFrame extends Vue {
  private weatherFlag = false;
  private weatherObj: any = {
    dayms: '',
    dq: '',
    dqqw: '',
    fl: '',
    fx: '',
    icon: '',
  };
  private imgMap: IWeatherImageListItem[] = [];

  @Watch('$store.state.eventPushStore.eventId')
  private FnMonitor(): void {
    console.log('推送过来的行政ID' , this.$store.state.eventPushStore.district);
    this.$store.commit('updateCode', this.$store.state.eventPushStore.district.code);
  }

  // 监听CODE的值有没有改变，如果有就重新查一遍。
  @Watch('$store.state.eventPushStore.district.code')
  private requestJsonDatas(): void {
    let curIndex = 0;
    const that = this;
    weatherServer.getImgConfigData().then((res: IWeatherImageListItem[]) => {
      that.imgMap = res;
      weatherServer
        .getWeatherData({
          type: '3D',
          code: this.$store.state.eventPushStore.district.code ? this.$store.state.eventPushStore.district.code : this.$store.getters.getCode,
        })
        .then((data: any) => {
          if (JSON.stringify(data.data) !== '{}') {
            that.weatherObj = JSON.parse(data.data.data)[0];
            curIndex = that.findIndexFromImgMap(
                    that.weatherObj.dayms,
                    that.imgMap,
            );
            that.weatherObj.icon = that.imgMap[curIndex].value;
            this.weatherFlag = true;
          }
        });
    });
  }

  private findIndexFromImgMap(str: string, arr: IWeatherImageListItem[]) {
    let curIdex = 0;
    arr.forEach((item, index) => {
      if (str === item.label) {
        curIdex = index;
      }
    });
    return curIdex;
  }

  private created() {
    this.requestJsonDatas();
  }
}
</script>
<style scoped lang="less">
.weatherAreaOuterFrameClass {
  width: 100%;
  height: 100%;
}
</style>