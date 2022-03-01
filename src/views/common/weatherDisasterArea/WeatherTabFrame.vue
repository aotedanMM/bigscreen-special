<template>
  <div class="weatherPanelFrameWrap">
    <div class="top">
      <div
        v-for="(item,index) in tabDatas"
        :key="index"
        class="labelClass"
        :class="{activeClass:index==myIndex}"
        @click="tabItemClick(item,index)"
      >{{item.label}}</div>
    </div>
    <div class="main">
      <component :is="whichShow" :weatherObj="weatherObj" :weatherList="weatherList"></component>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { weatherServer } from '@/api/installServer';
import {
  IweatherJXYBServer,
  IweatherTabDatas,
  IWeatherListItem,
  IWeatherImageListItem,
  IweatherTqyb,
} from '@/interface/feature/common/weather/Weather.interface.ts';
import WeatherJxyb from '@/components/feature/common/weatherDisasterArea/weatherJXYB/WeatherJXYB.vue';
import WeatherTqyb from '@/components/feature/common/weatherDisasterArea/weatherTQYB/WeatherTQYB.vue';
@Component({
  components: {
    WeatherJxyb,
    WeatherTqyb,
  },
})
export default class WeatherTabFrame extends Vue {
  @Prop() private weatherCode: any;
  private myIndex: number = 0;
  private whichShow: string = '';
  private weatherList: any = [];
  private tabFlag: boolean = true;
  private weatherObj: IweatherTqyb = {
    dealDay: '',
    week: '',
    dayImg: '',
    maxTemp: '',
    minTemp: '',
    direct: '',
    power: '',
    icon: '',
  };
  private weekArr: string[] = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  private tabDatas: IweatherTabDatas[] = [
    {
      label: '24小时精细预报',
      key: 'WeatherJxyb',
    },
    {
      label: '明天预报',
      key: 'WeatherTqyb',
    },
    {
      label: '后天预报',
      key: 'WeatherTqyb',
    },
  ];
  @Watch('weatherCode')
  private weatherCodeFn(val: any) {
    if (val) {
      this.tabItemClick(this.tabDatas[0], 0);
    }
  }
  private tabItemClick(item: IweatherTabDatas, index: number) {
    this.myIndex = index;
    this.getJsonDatas(index, item.key);
  }
  private getDate(num: number, tabName: string) {
    const curDay = new Date();
    curDay.setTime(curDay.getTime() + 24 * 60 * 60 * 1000 * num);
    const year = curDay.getFullYear();
    const month = (curDay.getMonth() + 1).toString().padStart(2, '0');
    const day = curDay
      .getDate()
      .toString()
      .padStart(2, '0');
    this.weatherObj.dealDay = year + '-' + month + '-' + day;
    this.weatherObj.week = this.weekArr[curDay.getDay()];
    this.whichShow = '';
    this.$nextTick(() => {
      this.whichShow = tabName;
    });
  }

  private getJsonDatas(num: number, tabName: string) {
    const that = this;
    that.whichShow = '';
    if (num === 0) {
      // 24小时精细预报数据获取
      weatherServer
        .getJXYBData({ type: '24H', code: that.weatherCode })
        .then((res: any) => {
          if (res.code === 0 && JSON.stringify(res.data) !== '{}') {
            this.$set(this, 'weatherList', JSON.parse(
              res.data[that.weatherCode],
            ) );
            that.whichShow = tabName;
          } else {
            that.whichShow = tabName;
          }
        });
    } else {
      weatherServer.getImgConfigData().then((res: IWeatherImageListItem[]) => {
        const imgMap = res;
        let curIndex = 0;
        // 当前实况数据获取
        weatherServer
          .getImgConfigData()
          .then((resA: IWeatherImageListItem[]) => {
            const imgMapA = resA;
            weatherServer
              .getWeatherData({ type: '3D', code: that.weatherCode})
              .then((resB: any) => {
                const data = [];
                for (const iterator of JSON.parse(resB.data.data)) {
                  if (
                    iterator.rqtj === 'tomorrow' ||
                    iterator.rqtj === 'third'
                  ) {
                    if (iterator.fx === undefined) {
                      iterator.fx = '';
                    }
                    const obj = {
                      dayImg: iterator.dayms,
                      maxTemp: iterator.dayHight,
                      minTemp: iterator.nigHlow,
                      direct: iterator.fx,
                      power: iterator.fl,
                    };
                    data.push(obj);
                  }
                }
                if (data && data.length) {
                  const tempNum = num - 1;
                  that.weatherObj = data[tempNum];
                  curIndex = that.findIndexFromImgMap(
                    that.weatherObj.dayImg,
                    imgMap,
                  );
                  that.weatherObj.icon = imgMap[curIndex].value;
                  that.getDate(num, tabName);
                } else {
                  that.weatherObj = {
                    dealDay: '',
                    week: '',
                    dayImg: '',
                    maxTemp: '',
                    minTemp: '',
                    direct: '',
                    power: '',
                    icon: '',
                  };
                  that.whichShow = tabName;
                }
              });
          });
      });
    }
  }
  private findIndexFromImgMap(str: string, arr: IWeatherImageListItem[]) {
    let curIdex = 0;
    arr.forEach((item: IWeatherImageListItem, index: number) => {
      if (str === item.label) {
        curIdex = index;
      }
    });
    return curIdex;
  }
  private mounted() {
    this.getDate(0, this.tabDatas[0].key);
    this.$nextTick(() => {
      this.tabItemClick(this.tabDatas[0], 0);
    });
  }
}
</script>

<style scoped lang="less">
.weatherPanelFrameWrap {
  width: 100%;
  height: 100%;
  color: white;
  .top {
    box-sizing: border-box;
    text-align: left;
    font-size: 18px;
    padding-left: 35px;
    border-bottom: 1px solid #50c6fc;
    color: #50c6fc;
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    .labelClass {
      box-sizing: border-box;
      padding: 0 10px;
      display: inline-block;
      height: 40px;
      margin-right: 30px;
      cursor: pointer;
    }
    .activeClass {
      background: url('../../../assets/img/weather/biaotitop.png') center bottom
        no-repeat;
      background-size: 100% 100%;
    }
  }
  .main {
    margin-bottom: 10px;
    height: 160px;
  }
}
</style>
