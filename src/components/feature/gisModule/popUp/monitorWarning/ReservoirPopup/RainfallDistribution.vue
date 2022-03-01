<template>
  <!-- 降雨分布图 -->
  <div class="RainfallDistribution">
    <!-- 视频按钮 -->
    <!-- <div
      class="videoBtn"
      :class="{ active: playList.length && checked }"
      @click="videoBtnClick()"
    ></div> -->
    <!-- 视频列表 -->
    <div class="videoBox" v-if="playList.length">
      <div class="viewing-item" v-for="(item, index) in playList" :key="index">
        <div class="topBar">
          <i class="closeBtn" @click="delect(item)"></i>
          <i
            :class="amplifierShow ? 'amplifier' : 'shrink'"
            @click="amplifier(item)"
          ></i>
        </div>
        <video autoplay muted :src="item.url" v-if="item"></video>
        <p>{{ item.name }}</p>
      </div>
    </div>
    <!-- 大屏播放 -->
    <div class="amplifier" v-if="amplifierShow">
      <div class="amplifier-title">
        <span>{{ activeVideo.name }}</span>
        <i @click="amplifierShow = false"></i>
      </div>
      <div class="amplifier-body">
        <video autoplay muted :src="activeVideo.url"></video>
      </div>
    </div>
    <div class="echarts" ref="echarts"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { reservoirServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
import { rainSituationServer } from '@/api/feature/monitorwarning/installServer'; // 水库服务
@Component({
  name: 'RainfallDistribution',
})
export default class RainfallDistribution extends Vue {
  @Prop() public data!: any; // 接受数据
  private yantaiJson: any = null;
  private echartsObj: any = null; // echarts对象
  private rainDistrictData: any = []; // 降雨分布数据
  private amplifierShow: boolean = false;
  private checked: boolean = false; // 视频按钮选中
  private videoList: any = [
    // 全部视频
    // {
    //   name: '视频1',
    //   url: 'https://v-cdn.zjol.com.cn/277001.mp4',
    // },
    // {
    //   name: '视频2',
    //   url: 'https://v-cdn.zjol.com.cn/277002.mp4',
    // },
  ];
  private playList: any = []; // 显示的视频列表
  private activeVideo: any = {}; // 大屏显示的视频
  public mounted() {
    // console.log(this.data, 'RainfallDistribution');
    // this.getJson();
    this.getDistrictStat();
  }
  @Watch('data.flag')
  private async getDistrictStat() {
    if (!this.data.flag) {
      return;
    }
    const res = await rainSituationServer.getDistrictStat({ type: 1 });
    // console.log(res, '降雨分布数据');
    this.rainDistrictData = res.data.data;
    // console.log(this.rainDistrictData, 'this.rainDistrictData');
    this.getJson();
  }
  private async getJson() {
    // 引入地图json
    const res = await reservoirServer.getJsonCallback();
    this.yantaiJson = res;
    this.$nextTick(() => {
      this.renderEcharts();
    });
  }
  private renderEcharts() {
    (this as any).$echarts.registerMap('yantai', this.yantaiJson);
    this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
    const min = 0;
    const max = 100;
    let city: any = [
      { name: '芝罘区', value: 0 },
      { name: '福山区', value: 0 },
      { name: '牟平区', value: 0 },
      { name: '莱山区', value: 0 },
      { name: '长岛县', value: 0 },
      { name: '龙口市', value: 0 },
      { name: '莱阳市', value: 0 },
      { name: '莱州市', value: 0 },
      { name: '蓬莱市', value: 0 },
      { name: '招远市', value: 0 },
      { name: '栖霞市', value: 0 },
      { name: '海阳市', value: 0 },
    ];
    if (this.rainDistrictData && this.rainDistrictData.length) {
      city = this.rainDistrictData;
    }
    console.log(city, 'city');
    const geoCoordMap: any = {
      芝罘区: [121.38, 37.53],
      福山区: [121.25, 37.5],
      牟平区: [121.6, 37.38],
      莱山区: [121.43, 121.43],
      长岛县: [120.73, 37.92],
      龙口市: [120.52, 37.65],
      莱阳市: [120.7, 36.98],
      莱州市: [119.93, 37.18],
      蓬莱市: [120.75, 37.82],
      招远市: [120.4, 37.37],
      栖霞市: [120.83, 37.3],
      海阳市: [121.15, 36.78],
    };
    const convertData = function(data: any) {
      const res: any = [];
      // for (var i = 0; i < data.length; i++) {
      //   const geoCoord = geoCoordMap[data[i].name];
      //   if (geoCoord) {
      //     const num = geoCoord.concat(data[i].value);
      //     res.push({
      //       name: data[i].name,
      //       value: num || 0,
      //     });
      //   }
      // }
      data.forEach((item: any) => {
        const geoCoord = geoCoordMap[item.name];
        if (geoCoord) {
          const num = geoCoord.concat(item.value);
          res.push({
            name: item.name,
            value: num || 0,
          });
        }
      });
      console.log(res, 'resres');
      return res;
    };
    const option = {
      geo3D: {
        map: 'yantai',
        roam: true,
        regionHeight: 1,
        itemStyle: {
          color: 'rgb(0, 45, 76)',
          opacity: 0.8,
          borderWidth: 0.6,
          borderColor: '#00d7f7',
        },
        label: {
          show: true,
          distance: 0,
          formatter(data: any) {
            // const obj = city.find((item: any) =>{
            //     return item.name === data.name
            // })
            // if (obj) {
            //     var res = obj.name + ' ' + obj.value + 'mm';
            // } else {
            const res = data.name;
            // }
            return res;
          },
          textStyle: {
            color: '#fff', // 地图初始化区域字体颜色
            fontSize: 14,
            opacity: 1,
            backgroundColor: 'rgba(0,23,11,0)',
          },
        },
        emphasis: {
          // 当鼠标放上去  地区区域是否显示名称
          label: {
            show: true,
            distance: 0,
            formatter(data: any) {
              // console.log(data, 'data')
              // const obj = city.find((item: any) =>{
              //     return item.name === data.name
              // })
              // if (obj) {
              //     var res = obj.name + ' ' + obj.value + 'mm';
              // } else {
              const res = data.name;
              // }
              return res;
            },
            textStyle: {
              color: '#fff',
              fontSize: 14,
              backgroundColor: 'rgba(0,23,11,0)',
            },
          },
        },
        light: {
          // 光照阴影
          main: {
            color: '#fff', // 光照颜色
            intensity: 1.2, // 光照强度
            // shadowQuality: 'high', //阴影亮度
            shadow: false, // 是否显示阴影
            alpha: 50,
            beta: 50,
          },
          ambient: {
            intensity: 0.3,
          },
        },
        viewControl: {
          alpha: 45,
          beta: 5,
          distance: 100,
        },
      },
      backgroundColor: 'rgba(0, 0, 0, 0)',
      series: [
        {
          name: 'bar3D',
          type: 'bar3D',
          minHeight: 1,
          // maxHeight: 1000,
          coordinateSystem: 'geo3D',
          barSize: 3, // 柱子粗细
          shading: 'realistic',
          opacity: 0.1,
          //                bevelSize: 0.3,
          itemStyle: {
            // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //             offset: 0,
            //             color: 'rgba(0,186,255,0.8)',
            //         }, {
            //             offset: 1,
            //             color: 'rgba(0,186,255,0.8)',
            //         }]),
            color: 'rgb(255,240,0)',
          },
          label: {
            show: true,
            formatter(data: any) {
              const res = data.data.value[2] || 0;
              return res + 'mm';
            },
            textStyle: {
              color: '#fdff4b',
              fontSize: 16,
              backgroundColor: 'rgba(0,23,11,0)',
            },
          },
          emphasis: {
            label: {
              show: true,
              formatter(data: any) {
                const res = data.data.value[2] || 0;
                return res + 'mm';
              },
              textStyle: {
                color: '#fdff4b',
                fontSize: 16,
                backgroundColor: 'rgba(0,23,11,0)',
              },
            },
          },
          data: convertData(city),
        },
        {
          name: '弱',
          type: 'scatter3D',
          coordinateSystem: 'geo3D',
          // symbol: 'round',
          symbolSize: 20,
          // zoomScale: 0.002,
          // blendMode: 'lighter',
          itemStyle: {
            shadowBlur: 5,
            shadowColor: 'rgba(255, 255, 255, 0.8)',
            color: 'red',
          },
          zlevel: -10,
          // data: convertData(city),
          data: [[this.data.x, this.data.y, 0]],
        },
      ],
    };
    this.echartsObj.setOption(option, true);
  }
  private videoBtnClick() {
    // 点击视频按钮
    this.checked = !this.checked;
    if (this.videoList && this.videoList.length && this.checked) {
      this.playList = JSON.parse(JSON.stringify(this.videoList));
    } else {
      this.playList = [];
    }
  }
  private delect(item: any) {
    this.playList.splice(
      this.playList.findIndex((v: any) => {
        return (v.url = item.url);
      }),
      1,
    );
  }
  private amplifier(item: any) {
    this.activeVideo = item;
    this.amplifierShow = true;
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../../../assets/img/gisModule/PopulationFeverBox';
@icon: '../../../../../../assets/img/gisModule/gisLayerPanel';
.RainfallDistribution {
  background: url('../../../../../../assets/img/reservoirPopup/map-bg.png')
    no-repeat;
  background-position: center 110px;
  position: relative;
  width: 100%;
  height: 100%;
  .videoBtn {
    position: absolute;
    top: 0;
    left: 20px;
    width: 120px;
    height: 120px;
    cursor: pointer;
    z-index: 2;
    background: url('../../../../../../assets/img/reservoirPopup/video-btn.png')
      no-repeat;
    background-size: 100% 100%;
    &:hover,
    &.active {
      background: url('../../../../../../assets/img/reservoirPopup/video-btn-hover.png')
        no-repeat;
      background-size: 100% 100%;
    }
  }
  .videoBox {
    position: absolute;
    top: 100px;
    left: 30px;
    z-index: 11;
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 130px);
    width: 400px;
    // background: red;
    .viewing {
      &-item {
        position: relative;
        // margin-right: 55px;
        width: calc(100% - 15px);
        height: 220px;
        margin-bottom: 10px;
        video {
          width: 100%;
          height: 100%;
          border: 2px solid #0477a2;
        }
        &:hover {
          .topBar {
            display: block;
          }
        }
        &:nth-child(2) {
          margin-right: 0;
        }
        .topBar {
          width: 98px;
          height: 52px;
          display: none;
          position: absolute;
          right: -15px;
          top: -13px;
          z-index: 999;
          background: url('@{icon}/bg_icon.png') no-repeat center / 100% 100%;
          .closeBtn {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url('@{icon}/qx_btn.png') no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
          }
          .amplifier {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url('@{icon}/fd_btn.png') no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
          }
          .shrink {
            width: 18px;
            height: 18px;
            cursor: pointer;
            background: url('@{icon}/sx_btn.png') no-repeat center / 100% 100%;
            display: inline-block;
            margin: 17px 0px 0px 20px;
          }
        }
        p {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 45px;
          text-align: center;
          font-size: 30px;
          color: #e8f4fe;
        }
      }
    }
  }
  .amplifier {
    position: absolute;
    top: 0;
    left: -50px;
    z-index: 15;
    width: 1030px;
    height: 640px;
    &-title {
      padding: 10px 50px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      background: url('@{url}/topbg.png') no-repeat;
      background-size: 100% 100%;
      // box-sizing: border-box;
      font-size: 30px;
      span {
        font-weight: 600;
        font-family: 'myHeiti';
        font-size: 30px;
        color: 00e4ff;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      i {
        position: absolute;
        top: 4px;
        right: 15px;
        width: 90px;
        height: 48px;
        background: url('@{url}/closeBtn.png') no-repeat;
        background-size: 100% 100%;
        &:hover {
          background: url('@{url}/closeHover.png') no-repeat;
        }
      }
    }
    &-body {
      padding: 0 40px 35px;
      width: 100%;
      height: calc(100% - 60px);
      background: url('@{url}/centerBg.png') top center no-repeat,
        url('@{url}/botBg-.png') center bottom no-repeat;
      background-size: 100% calc(100% - 49px), 100% 49px;
      box-sizing: border-box;
      // background: url('@{url}/centerBg.png') no-repeat;
      // background-size: 100% 100%;
      // background: url('@{url}/botBg-.png') no-repeat;
      // background-size: 100% 100%;
      video {
        width: 100%;
        height: 100%;
      }
    }
  }
  .echarts {
    width: 100%;
    height: calc(100%);
    div {
      z-index: 1;
    }
  }
}
</style>
