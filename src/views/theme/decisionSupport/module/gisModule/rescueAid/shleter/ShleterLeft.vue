<template>
  <div class="shelterRightBox">    
     <span
      class="showModule"
      v-show="!moduleIsShow"
      @click="changeModuleIsShow"
    ></span>
    <div v-show="moduleIsShow">      
      <div class="Accordion_title">
        <span>安置点</span>
          <span class="closeModule" @click="changeModuleIsShow"></span>
      </div>
      <div class="shelter">
        <div class="left">
          <div :title="'安置点:' + totalPlace + '个'">安置点：{{totalPlace}}个</div>
          <div :title="'剩余:' + totalCapacityLeft + '人'">剩余：{{totalCapacityLeft}}人</div>
        </div>
        <div class="right">
          <div id="myEchart" style="width:180px; height:180px;"></div>
        </div>
      </div>
      <div class="shelter" style="margin-top:10px;">
        <div class="left">
          <div :title="'总灾民:' + totalPlacement + '人'">总灾民：{{totalPlacement}}人</div>
          <div :title="'待安置:' + totalPlacementLeft + '人'">待安置：{{totalPlacementLeft}}人</div>
        </div>
        <div class="right">
          <div id="myEchart1" style="width:180px; height:180px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { pushDataRequestServe } from '@/api/installServer';
import Shleter from '@/views/theme/decisionSupport/module/gisModule/rescueAid/shleter/Shleter.vue';
const knownDisasterSituation = ['SEND_PERSONNELPLACEMENT']; // 队伍需求（需求队伍人数）
@Component({
  name: 'ShelterRightBox',
  components: {},
})

export default class ShelterRightBox extends Vue {
  // 安置点echarts的option
  private option: any = null;
  // 安置点echarts的ecarts
  private myChart: any = null;
  // 总灾民echarts的option
  private option1: any = null;
  // 总灾民echarts的ecarts
  private myChart1: any = null;
  // 安置点个数
  private totalPlace = 0;
  // 安置点总安置数
  private totalCapacity = 0;
  // 安置点待安置的个数
  private totalCapacityLeft = 0;
  // 安置点已经安置的个数
  private totalCapacityPlaced = 0;
  // 总灾民的数量
  private totalPlacement = 0;
  // 待安置灾民的数量
  private totalPlacementLeft = 0;
  // 已经安置灾民的数量
  private totalPlacementVictims = 0;
  private Shleter: any = null; // 弹窗
  // 安置点百分比
  private capacityPercent: any = 0;
  // 安置人数百分比
  private placementPercent: any = 0;
  private moduleIsShow: boolean = true;
  private changeModuleIsShow() {
    this.moduleIsShow = !this.moduleIsShow;
  }
  private mounted() {
    this.capacityecharts();
    this.placementecharts();
    this.getComponent().off(
      'firePopup_rescue_people_arrangement',
      this.onShowPopup,
      this,
    );
    this.getComponent().on(
      'firePopup_rescue_people_arrangement',
      this.onShowPopup,
      this,
    );
  }
  // 重新加载地图方法展示地图
  private beforeDestroy() {
    this.getComponent().unload();
  }
  private onShowPopup(event: any) {
    const data = event.data;
    const self = this;
    this.Shleter = new Shleter({
      el: '#' + event.containerId,
      data() {
        return {
          type: 'path',
          data,
        };
      },
      methods: {
        close() {
          self.getComponent().closePopup();
        },
      },
    });
  }
  // 安置点echarts
  private capacityecharts() {
    this.myChart = (this as any).$echarts.init(document.getElementById('myEchart'));
    this.option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{d}%',
      },
      title: {
        // text:this.capacityPercent + '%',
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          color: '#f2f2f2',
          fontSize: '24',
        },
      },
      series: [
        {
          // name: 'Line 1',
          type: 'pie',
          clockWise: true,
          color: ['#01e3fd', '#f2f2f2'],
          radius: ['50%', '66%'],
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
          hoverAnimation: false,
          data: [
            {
              value: this.totalCapacityPlaced,
              name: '已用安置容量',
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              name: '剩余安置容量',
              value: this.totalCapacityLeft,
            },
          ],
        },
      ],
    };
    this.myChart.setOption(this.option);
  }
  // 安置灾民echarts
  private placementecharts() {
    this.myChart1 = (this as any).$echarts.init(document.getElementById('myEchart1'));
    this.option1 = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{d}%',
      },
      title: {
        // text: this.placementPercent + '%',
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          color: '#f2f2f2',
          fontSize: '24',
        },
      },
      series: [
        {
          // name: 'Line 1',
          type: 'pie',
          clockWise: true,
          radius: ['50%', '66%'],
          color: ['#01e3fd', '#f2f2f2'],
          itemStyle: {
            normal: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
          hoverAnimation: false,
          data: [
            {
              value: this.totalPlacementVictims,
              name: '已安置灾民',
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
            },
            {
              name: '待安置人数',
              value: this.totalPlacementLeft,
            },
          ],
        },
      ],
    };
    this.myChart1.setOption(this.option1);
  }
  // 处理推送屏数据
  private async setData() {
    const tsData: any = await this.getData(0);
    // 调用gis方法加载面地图
    this.getComponent().load(tsData);
    const data = tsData.event.list;
    // 将数据传给右边列表
    this.messsageBus.emit('shleterRight', data);
    data.forEach((item: any) => {
      this.totalCapacity = 0;
      this.totalCapacityLeft = 0;
      this.totalPlacement = 0;
      this.totalPlacementVictims = 0;
      this.capacityPercent = 0;
      this.placementPercent = 0;
      this.totalPlace = 0;
      this.totalPlacementLeft = 0;
      this.totalPlace = data.length;
      this.totalCapacity += item.totalCapacity;
      this.totalCapacityPlaced += item.totalCapacityPlaced;
      this.totalCapacityLeft = item.totalCapacity - item.totalCapacityPlaced;
      this.totalPlacement += item.totalPlacement;
      this.totalPlacementVictims += item.totalPlacementVictims;
      this.totalPlacementLeft =
        item.totalPlacement - item.totalPlacementVictims;
      this.capacityPercent = (
        ((this as any).moreCapacityPlaced / this.totalCapacity) *
        100
      ).toFixed(0);
      this.placementPercent = (
        ((this as any).moretotalPlacementVictims / this.totalPlacement) *
        100
      ).toFixed(0);
      this.capacityecharts();
      this.placementecharts();
    });
  }
  // 联动gis方法 开始
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.rescueHelpFactory.getComponent(
      'peopleArrangement',
    );
    return component;
  }
  // 通过事件id和位置定位到地图面数据
  private async getData(indexId: number) {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = knownDisasterSituation[indexId]; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    const tsData = JSON.parse(res.data.content);
    const tsDataLast = JSON.parse(tsData[0].data);
    return tsDataLast;
  }
  private created() {
    if (this.$store.state.eventPushStore.SEND_PERSONNELPLACEMENT > -1) {
      this.setData();
    }
  }
}
</script>
<style lang="less" space>

@path: '../../../../../../../assets/img/gisModule/districtDialog'; // 定义路径
.shelterRightBox {
  // position: absolute;
  // top: 220px;
  // left: 60px;
  // z-index: 9999;
  // height: 430px;
  // width: 410px;
  // font-size: 20px;
    position: absolute !important;
    top: 225px;
    left: 75px;
    z-index: 5;
    color: #fff;
    font-size: 20px;
  .showModule {
    position: absolute;
    // top: 25px;
    // left: 15px;
    background: url('@{path}/zhankaibutton.png') center top no-repeat;
    width: 44px;
    height: 54px;
    display: inline-block;
    position: absolute;
    cursor: pointer;
  }
   .closeModule {
      background: url('@{path}/iconClose.png') center top no-repeat;
      width: 37px;
      height: 33px;
      display: inline-block;
      position: absolute;
      cursor: pointer;
      right:17px;
      top: -12px;
    }
  .Accordion_title {
    width: 100%;
      height: 100px;
      z-index: 4;
      cursor: pointer;
      color: #91f5ff;
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      position: relative;
      width: 344px; 
      height: 75px;
      line-height: 75px;
      margin:25px auto 15px;  
      &::before{
        content: '';
        position: absolute;
        top:-12px;
        right:-25px;
        bottom:-10px;
        left:-25px;
        background: url('@{path}/tankuangtitlebg.png') center top no-repeat;
        background-size: 100% 100%;
        z-index: -1;
        pointer-events: none;
      }
  }
  .shelter {
    width: 100%;
    height: 206px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    overflow: hidden;
    .left {
      width: 215px;
      height: 100px;
      // background: red;
      margin-top: 56px;
      font-size: 30px;
      margin-left: 18px;
      float: left;
      & div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-child(2) {
          margin-top: 20px;
        }
      }
    }
    .right {
      width: 160px;
      height: 200px;
      float: left;
      margin-top: 14px;
      // background:red;
    }
  }
}
.PeopleArrangement-default-tooltip {
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 0 15px;
  p {
    margin: 0;
    height: 35px;
  }
}
.PeopleArrangement-default-tooltip span {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}
.ol-overlay-container .popup-content {
  line-height: 37px;
}
</style>
