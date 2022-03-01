<!--灾情统计下-受灾情况容器组件-->
<template>
  <div>
    <div class="tempRight-title  f-tit-h2">
      <span>
        {{ curCompParam.title }}
      </span>
      <span class="echartIcon" @click="openDailog()"></span>
    </div>

    <div class="DiscussList">
      <div class="influenceList_innr">
        <div class="influenceList_innr_before curContainer">
          <div
            v-for="(item, index) of curList"
            :key="item.key"
            class="curContainer_item"
            @click.stop="clickItem(item, index)"
          >
            <div class="disaster_catgory">
              <span
                class="icon item_icon item_icon-left"
                :class="'item_icon_' + item.icon"
              ></span>
              <span class="text">{{ item.text }}</span>
            </div>
            <div class="disaster_catgory_1">
              <span>{{ item.value }}</span> <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { pushDataRequestServe } from '@/api/installServer';
import { disasterSituationServer } from '@/api/feature/disasterStatistics/installServer';
// import {
//   getFormatData,
//   formadResultValue,
//   formadResultUnit,
// } from '@/util/filter/CommonFilter';
@Component({
  name: 'DisasterSituation',
  components: {},
  //   filters: {
  //     formatData: getFormatData, // null
  //     getValue: formadResultValue,
  //     gettUnit: formadResultUnit,
  //   },
})
export default class DisasterSituation extends Vue {
  @Prop() private compParam: any; // 父组件带过来的子组件需要的参数
  @Prop() private handleClick: any; // 父组件处理子组件点击的方法
  @Prop() private getCacheData: any; // 父组件可以获得子组件的数据的方法
  private data: any;
  private compParamData: any;
  private curCompParam: any = {}; // compParam的转换
  private curDataCache: any = {};
  private counties: any = [];
  private curList: any = [
    {
      key: 'estimatedNum',
      text: '区县',
      value: '1',
      unit: '个',
      icon: 'qx',
      counties: '',
      nextCompName: 'DisasterSituationContainer',
    },
    {
      key: 'practicalNum',
      text: '乡镇',
      value: '1',
      unit: '个',
      icon: 'xz',
      counties: '',
      nextCompName: 'DisasterSituationContainer',
    },
  ];

  private clickItem(item: any, index: number) {
    const param: any = {
      ...item,
      //   nextCompParam: JSON.parse(JSON.stringify(this.curDataCache)),
    };
    this.handleClick(item.nextCompName, param);
  }

  private openDailog() {
    this.messsageBus.$emit('DisasterOpen', true, this.data, this.compParamData);
  }

  // 通过接口拿到数据
  private async getDataByServ() {
    const resData: any = await disasterSituationServer.getStatistics(
      this.$store.state.eventPushStore.eventId,
    );
    console.log(resData, 'resData');
    this.curList[0].value = resData.townNum;
    this.curList[1].value = resData.floodUrbanNum;
    this.curList[0].counties = resData.counties;
    this.curList[1].counties = resData.counties;
    // const result = this.handleResData(resData);
    // this.getCacheData('PersonnelTransfer', result);
    this.data = resData;
    return resData;
  }
  private async getDisasterData() {
    const resData: any = await disasterSituationServer.getDisasterData(
      this.$store.state.eventPushStore.eventId,
    );
    this.compParamData = resData;
    // const result = this.handleResData(resData);
    // this.getCacheData('PersonnelTransfer', result);
  }

  // 处理从接口拿回的数据，将两个不同的接口返回的不同的数据格式做个处理，处理成页面上原来需要的那种数据格式，类似于一个中间的转换处理
  // private handleResData(resData: any) {
  //   let newResData: any = {};
  //   if (resData.data.content) {
  //     const targetJsonStr = JSON.parse(resData.data.content)[0].data;
  //     const targetDataObj = JSON.parse(targetJsonStr);
  //     newResData = targetDataObj.data;
  //   }
  //   return newResData;
  // }

  // 将接口拿到的数据进行处理，并且赋值给本页面需要的数据
  // 人员转移有新的数据推送
  // 这个变成了对象，所以不用在监听eventId
  @Watch('$store.state.eventPushStore.personnel_transfer')
  private async handleResultData() {
    this.curDataCache = await this.getDataByServ();
  }

  // @Watch('compParam')
  private updateCurCompParam() {
    this.curCompParam = JSON.parse(JSON.stringify(this.compParam));
  }

  private async created() {
    this.updateCurCompParam();
    this.getDisasterData();
    await this.handleResultData();
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../../assets/css/decisionSupport/Statistic.half.less';

* {
  margin: 0;
  padding: 0;
}
.tempRight-title {
  justify-content: space-between;
  .echartIcon {
    float: right;
    width: 32px;
    height: 32px;
    background: url('../../../../../assets/img/monitorWarning/echart.png')
      no-repeat 0 0;
    background-size: 100% 100%;
    cursor: pointer;
    margin-top: 8px;
  }
}

.DiscussList {
  width: 100%;
  margin-top: 20px;
  .influenceList {
    width: 100%;
    &_innr {
      &_before {
        background: url('../../../../../assets/img/discuss/bg.png') no-repeat
          50% 0px;
        padding: 11px 16px;
        height: 110px;
        box-sizing: border-box;
        background-size: 100% 100%;
        margin: 0px -5px 0 5px;
        &:hover {
          background-image: url('../../../../../assets/img/discuss/bg_h.png');
        }
      }
      //   &_after{
      //     background:url('../../../../../assets/img/discuss/hover2.png') no-repeat 50% 0px;
      //     padding: 15px 16px;
      //     box-sizing: border-box;
      //     background-size: 100% 100%;
      //     margin:0px -5px 0 5px;
      //     &:hover{
      //     background-image:url('../../../../../assets/img/discuss/hover2_h.png') ;
      //     }
      //     .influenceList_innr_item:last-child{
      //       //width:100%;
      //       margin-bottom:0px;
      //     }

      //   }
    }
  }
}

.curContainer {
  display: flex;
  &_item {
    width: 50%;
    cursor: pointer;
    // &_content{

    // }
    &_tip {
      color: #daf2ff;
    }
    .textClass {
      color: #6ae7fc;
    }
  }
  &_item:hover {
    .textClass {
      color: #fbee50;
    }
  }
}
.disaster_catgory {
  display: flex;
  .icon {
    width: 54px;
    height: 54px;
    line-height: 60px;
    display: inline-block;
  }
  .text {
    font-size: 28px;
    letter-spacing: 1px;
    margin-top: 9px;
    color: #ffffff;
    display: block;
  }
}
.disaster_catgory_1 {
  span {
    &:nth-child(1) {
      font-size: 32px;
      letter-spacing: 1px;
      line-height: 36px;
      color: #fff55d;
      font-family: 'Impact';
      font-weight: 400;
      margin-left: 22px;
      margin-right: 10px;
    }
    &:nth-child(2) {
      font-size: 22px;
      letter-spacing: 1px;
      line-height: 24px;
      color: #bbd0dc;
    }
  }
}
</style>
