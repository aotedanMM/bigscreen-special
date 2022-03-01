<template>
  <div class="typhoon-timer-shaft">
    <div class="time-btn-nav">
      <div v-for="(item, index) in timeDataArr" :key="index" class="time-btn">
        <div class="time-btn-name">
          {{item.text}}
        </div>
        <div :class="index === timeNum ? 'btn-triangle' : ''">

        </div>
      </div>
    </div>
    <div class="mySlider">
      <span class="firstDot" v-if="!isShow"></span>
      <span class="lastDot"  v-if="!isHide"></span>
      <el-slider
          v-model="timeNum"
          @change="changeTimeSlider"
          :step="1"
          :max="3"
          :show-tooltip="false"
          :format-tooltip="formatTooltip"
          show-stops>
      </el-slider>
    </div> 
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Watch} from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'TyphoonTimerShaft',
  components: {
  },
  mixins: [MapCommon],
})
export default class TyphoonTimerShaft extends Vue {
  private timeNum: number = 0;
  private isHide: boolean = false;
  private isShow: boolean = false;

  // 是否需要触发, 切换事件的时候不触发当前
  private isClick: boolean = false;
  private timeDataArr: any[] = [
    {
      text: '当前',
      value: 0,
    },
    {
      text: '12H后',
      value: 1,
    },
    {
      text: '24H后',
      value: 2,
    },
    {
      text: '48H后',
      value: 3,
    },
  ];
  // 地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('typhoon');
    return component;
  }

  @Watch('$store.state.eventPushStore.eventId')
  private init(): void {
    this.timeNum = 0;
    this.isClick = true;
  }

  private changeTimeSlider(val: any) {
    if (this.isClick) {
      this.isClick = false;
      return;
    }
    let time: number = 0;
    switch (val) {
      case 0:
        time = 0;
        this.isHide = false;
        this.isShow = true;
        break;
      case 1:
        time = 12;
        this.isHide = false;
        this.isShow = false;
        break;
      case 2:
        time = 24;
        this.isHide = false;
        this.isShow = false;
        break;
      case 3:
        time = 48;
        this.isHide = true;
        this.isShow = false;
        break;
    }
    this.getComponent().changeTimeSlider(time);
  }

  private formatTooltip(val: any): string {
    let btnName: string = '';
    switch (val) {
      case 0:
        btnName = '当前';
        break;
      case 1:
        btnName = '12H后';
        break;
      case 2:
        btnName = '24H后';
        break;
      case 3:
        btnName = '48H后';
        break;
    }
    return btnName;
  }

  private mounted() {
    const self: any = this;
    self.resolveMap('map').then((res: any) => {
      self.getComponent().off('nodata');
      self.getComponent().on('nodata', () => {
        this.$message.error('目前没有此预测数据');
      });
    });
  }

  private destroyed() {
    this.getComponent().off('nodata');
  }
}
</script>
<style lang="less" scoped>
@imgUrl: '../../../assets/img/typhoonInfo';
  .typhoon-timer-shaft{
    width: 400px;
    height: 100px;
    box-sizing: border-box;
    margin-left:-15px;
    .time-btn-nav{
      margin: 0 auto;
      font-size: 26px;
      line-height: 1;
      overflow: hidden;
      .time-btn{
        float: left;
        width: 25%;
        &-name{
          color: #fff;
          width: 100%;
          text-align: center;
          margin-bottom: 4px;
          white-space: nowrap;
        }
        .btn-triangle{
          margin: 0 auto;
          width: 22px;
          height: 17px;
          background: url("../../../assets/img/typhoonInfo/time-triangle.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
</style>
<style lang="less">
  .typhoon-timer-shaft{
    padding-top:15px;
    margin-left:-25px;
    .mySlider{
      position: relative;
      // outline: 1px solid red;;
      .firstDot{
        position: absolute;
        display: inline-block;
        background-color: #9eff6f;
        box-shadow: 0 0 0px 6px rgba(158, 255, 111, 0.3);
        width: 16px;
        height: 16px;
        // margin-left: -16px;
        margin-top: -5px;
        border-radius:50%;
        left:40px;;
        top:16px;
        pointer-events: none;

      }
      .lastDot{
        position: absolute;
            display: inline-block;
            background-color: #6ad1f6;
            box-shadow: 0 0 0px 6px rgba(106, 246, 234, 0.3);
            width: 16px;
            height: 16px;
            margin-left: -16px;
            margin-top: -5px;
            border-radius:50%;
            right:50px;;
            top:16px;
            pointer-events: none;
      }
    .el-slider{
      // width: %;
      margin: -10px 12% 0 12%;
    //   &::after{
    //     content:'';
    //     display: inline-block;
    //     background-color: #FFF;
    //     background-color: #6ad1f6;
    //     box-shadow:0 0 0px 6px rgba(106,246,234,.3);
    //     width:16px;
    //     height:16px;
    // margin-left: -16px;
    // margin-top: -5px;
    //   }
      .el-slider__runway{
        background-color: rgba(106,209,246,.4);
        box-shadow: inset 0 0 3px rgba(75,174,211.4);
      }
      .el-slider__bar{
        background-color: #9eff6f;
        box-shadow:none

      }
      .el-slider__button{
        border:none ;
        background-color: #9eff6f;
        box-shadow:0 0 0px 6px rgba(158,255,111,.3)

      }
      .el-slider__stop{
    background-color: #FFF;
        background-color: #6ad1f6;
        box-shadow:0 0 0px 6px rgba(106,246,234,.3);
        width:16px;
        height:16px;
    margin-left: -16px;
    margin-top: -5px;
      }
    }}
  }
</style>
