<template>
  <div class="weatherPop">
    <div class="weatherPop_close" @click="close()"></div>
    <weather-tab-frame :weatherCode="weatherCode" v-if="isShowWeather"></weather-tab-frame>
    
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { rescueTeamServer } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import WeatherTabFrame from '@/views/common/weatherDisasterArea/WeatherTabFrame.vue';
@Component({
  name: 'WeatherPop',
  components: {
      WeatherTabFrame,
    },
})
export default class WeatherPop extends Vue {
private weatherCode: any = '';
private isShowWeather: boolean = false;
private mounted() {
  const that: any = this;
  this.weatherCode = that.data.districtCode;
  if (this.weatherCode) {
    this.isShowWeather = true;
  }
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/weatherPopImg';
@closeurl: '../../../../assets/img/eventInfo';
.weatherPop{
  padding: 10px;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  background: rgba(7, 25, 65, 0.8);
  border-radius: 1px;
  box-shadow: 0 0 15px #071941;
  color: #fff;
  position: absolute;
  // left:48%;
  // top: 20%;
  // transform: translate3d(-50%,-50%,0);
  // background: #000519;
  width: 800px;
  &_close {
      position: absolute;
      right: 10px;
      background: url('@{closeurl}/maptooltipclose.png') no-repeat center / 100% 100%;
      width: 15px;
      height: 14px;
      margin-right: 10px;
      cursor: pointer;
      flex-shrink: 0;
      margin-right: 10px;
      margin-left: 10px;
      margin-top: 10px;
    }
}
</style>
