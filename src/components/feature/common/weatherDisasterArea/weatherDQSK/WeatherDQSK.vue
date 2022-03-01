<template>
  <div class="DQSK_Wrap">
    <div class="left" v-if="isHaveDatas">
      <div class="icon">
        <img :src="iconSrc" />
      </div>
      <div class="title">{{weatherDQSKObj.dayms}}</div>
    </div>
    <div class="right" v-if="isHaveDatas">
      <div v-for="(item , index) in filterDatas" :key="index + item">
        <div class="top">{{item.value | FiltersNoData}}</div>
        <div class="bottom">
          <i :class="item.iconClass"></i>
          <div>{{item.title}}</div>
        </div>
      </div>
      <div>
        <div class="top">{{weatherDQSKObj.fx+weatherDQSKObj.fl}}</div>
        <div class="bottom">
          <i class="fxfl"></i>
          <div>风向风速</div>
        </div>
      </div>
    </div>
    <div class="nothingData--bg1" v-else></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  ICurrentLiveListItem,
  IWeatherListItem,
} from '@/interface/feature/common/weather/Weather.interface.ts';
@Component({
  name: 'WeatherDqsk',
  filters: {
    // 过滤面积
    FiltersNoData(val: any): any {
      if (val === '' || val === undefined || val === null || val === 0) {
        return '暂无数据';
      } else {
        return val;
      }
    },
  },
})
export default class WeatherDqsk extends Vue {
  @Prop() private weatherDQSKObj!: IWeatherListItem;
  private iconSrc: string = '';
  private isHaveDatas: boolean = false;
  private filterDatas: ICurrentLiveListItem[] = [
    {
      title: '气温',
      key: 'dqqw',
      iconClass: 'qiwen',
    },
    {
      title: '相对湿度',
      key: 'sd',
      iconClass: 'shidu',
    },
    {
      title: '降水',
      key: 'js',
      iconClass: 'jiangshui',
    },
  ];

  private dealDatas(opt: any) {
    if (opt && opt.icon) {
      this.iconSrc = require(`../../../../../assets/img/weather/${opt.icon}.png`);
      this.filterDatas.map((item: any) => {
        item.value = opt[item.key];
      });
      console.log(this.filterDatas);
      this.isHaveDatas = true;
    } else {
      this.isHaveDatas = false;
    }
  }
  @Watch('weatherDQSKObj')
  private FnDispose() {
    const that: any = this;
    this.dealDatas(that.weatherDQSKObj);
    // console.log(that.weatherDQSKObj);
  }
  private created() {
    this.FnDispose();
  }
}
</script>

<style scoped lang="less">
.DQSK_Wrap {
  width: 100%;
  height: 100px;
  display: flex;
  font-size: 18px;
  .left {
    display: flex;
    width: 270px;
    .icon {
      width: 163px;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      width: calc(100% - 163px);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .right {
    width: calc(100% - 270px);
    height: 100%;
    display: flex;
    & > div {
      width: 25%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .top,
      .bottom {
        width: 100%;
        height: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      .bottom {
        color: #6dd2d4;
        font-weight: normal;
        i {
          width: 36px;
          height: 40px;
          background-size: 100% 100%;
        }
        .qiwen {
          background: url('../../../../../assets/img/weather/qiwen.png') center
            center no-repeat;
        }
        .shidu {
          background: url('../../../../../assets/img/weather/shidu.png') center
            center no-repeat;
        }
        .jiangshui {
          background: url('../../../../../assets/img/weather/jiangshui.png')
            center center no-repeat;
        }
        .fxfl {
          background: url('../../../../../assets/img/weather/fengxiang.png')
            center center no-repeat;
        }
      }
    }
  }
  .nodataClass {
    width: 100%;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
}
</style>