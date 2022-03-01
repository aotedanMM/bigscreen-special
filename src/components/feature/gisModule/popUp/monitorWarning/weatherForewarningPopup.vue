<template>
  <!-- 雨情弹框 -->
  <div class="weather-monitor-popup">
    <div class="titleBox">
      <span class="icon" :class="getClass(data)"></span>
      <span class="title" :title="data.sender">{{ data.sender }}</span>
      <i @click="close()"></i>
    </div>
    <div class="contentbox">
      <el-scrollbar style="height:330px;">
      <p class="time">
        <span>时间：</span>
        <span>{{data.time}}</span>
      </p>
      <p class="content">
        {{data.cont}}
      </p>
      </el-scrollbar>
    </div>
    <!-- <div class="btn">
      <p>综合研判 </p>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 监测预警
 */
@Component({
  name: 'WeatherForewarningPopup',
})
export default class WeatherForewarningPopup extends Vue {
  private data: any = {};
  public mounted() {
    const self: any = this;
    this.data = self.event.data;
    console.log( this.data, 'self.event'); // 传入的信息
  }
  private getClass(data: any) {
      const mapLevel: any = {
      红色: 'red',
      橙色: 'orange',
      黄色: 'yellow',
      蓝色: 'blue',
    };
      const typeCodeList: any = {
      '11B25': 'senhuo',
      '11B06': 'dafeng',
      '11B03': 'baoyu',
      '11B01': 'taifeng',
      '11B14': 'leidian',
      '11B15': 'bingbao',
      '11B37': 'dizhai',
    };
      const nameClass = mapLevel[data.signallevel] + typeCodeList[data.typeCode];
      return nameClass;
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../assets/img/gisModule/PopulationFeverBox';
@imgUrl: '../../../../../assets/img/weatherForewarning';
@titleH: 60px;
.weather-monitor-popup {
  width: 390px;
  height: 380px;
  color: #fff;
  overflow: hidden;
  background: url('@{imgUrl}/popditu.png') no-repeat 0 0;
  background-size: 100% 100%;
  padding-bottom: 40px;
  .titleBox {
    padding: 10px 30px 0;
    display: flex;
    align-items: center;
    height: @titleH;
    box-sizing: border-box;
    font-size: 20px;
    .title {
      width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: calc(20px * 1.2);
      margin-left: 8px;
      color: 00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .icon{
           display: inline-block;
           width:44px;
           height: 34px;
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
  .contentbox {
    padding: 0px 24px;
    box-sizing: border-box;
    overflow: hidden;
    .time{
      font-size: 23px;
      letter-spacing: 1px;
      line-height: 36px;
      color: #ffffff;
      font-family: "Microsoft Ya Hei";
      span{
        &:nth-child(2){
          color: yellow;
        }
      }
    }
  .content{
    font-size: 26px;
    letter-spacing: 1px;
    line-height: 36px;
    color: #ffffff;
    font-family: "Microsoft Ya Hei";
    // overflow : hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 7;
    // -webkit-box-orient: vertical;
    }
  }
  .btn{
    width: 100%;
    display: flex;
    justify-content: flex-end;
    p{
      width: 114px;
      font-size: 26px;
      line-height: 48px;
      color: #a0f4fd;
      text-align: center;
      font-family: "Microsoft Ya Hei";
      box-shadow: 0px 2px 4px rgba(23,55,95,0.53);
      cursor: pointer;
      background: url('@{imgUrl}/zhyp.png') no-repeat 0 0;
      background-size: 100% 100%;
      margin-right: 30px;
      padding:10px;
    }
  }
  .echartContent {
    box-sizing: border-box;
    // width: 720px;
    height: 100%;
    padding: 0px 10px;
    background: #091120;
    border: 1px solid #2b5461;
    border-radius: 8px;
    color: #8de5eb;
    font-size: 20px;
    .nodata {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .echarts {
    height: 100%;
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%;
  }
    .redbaoyu{
    background: url('@{imgUrl}/redbaoyu.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yellowbaoyu{
    background: url('@{imgUrl}/yellowbaoyu.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .orangebaoyu{
    background: url('@{imgUrl}/orangebaoyu.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .bluebaoyu{
    background: url('@{imgUrl}/bluebaoyu.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .reddafeng{
    background: url('@{imgUrl}/reddafeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yellowdafeng{
    background: url('@{imgUrl}/yellowdafeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .orangedafeng{
    background: url('@{imgUrl}/orangedafeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .bluedafeng{
    background: url('@{imgUrl}/bluedafeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .redtaifeng{
    background: url('@{imgUrl}/redtaifeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yellowtaifeng{
    background: url('@{imgUrl}/yellowtaifeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .orangetaifeng{
    background: url('@{imgUrl}/orangetaifeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .bluetaifeng{
    background: url('@{imgUrl}/bluetaifeng.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .redleidian{
    background: url('@{imgUrl}/redleidian.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yellowleidian{
    background: url('@{imgUrl}/yellowleidian.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .orangeleidian{
    background: url('@{imgUrl}/orangeleidian.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .blueleidian{
    background: url('@{imgUrl}/blueleidian.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .redbingbao{
    background: url('@{imgUrl}/redbingbao.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yellowbingbao{
    background: url('@{imgUrl}/yellowbingbao.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .orangebingbao{
    background: url('@{imgUrl}/orangebingbao.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .bluebingbao{
    background: url('@{imgUrl}/bluebingbao.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .reddizhai{
    background: url('@{imgUrl}/reddizhai.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yellowdizhai{
    background: url('@{imgUrl}/yellowdizhai.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .orangedizhai{
    background: url('@{imgUrl}/orangedizhai.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .bluedizhai{
    background: url('@{imgUrl}/bluedizhai.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .redsenhuo {
  background: url('@{imgUrl}/redsenhuo.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.yellowsenhuo {
  background: url('@{imgUrl}/yellowsenhuo.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.orangesenhuo {
  background: url('@{imgUrl}/orangesenhuo.png') no-repeat 0 0;
  background-size: 100% 100%;
}
.bluesenhuo {
  background: url('@{imgUrl}/bluesenhuo.png') no-repeat 0 0;
  background-size: 100% 100%;
}
}
</style>
