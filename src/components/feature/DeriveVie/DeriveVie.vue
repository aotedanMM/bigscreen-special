<template>
  <div class="DerivativeEvents-warp">
    <p class="title">
      衍生事件
      <ZoomBtn></ZoomBtn>
    </p>
    <div class="content" v-if="!flagLoading && derivativeData.length > 0">
      <ul class="container">
        <li
          v-for="(item, index) in derivativeData"
          :key="index"
          @click="deriveClick(item,index)"
          :class="{ active: activeIndex === index }"
        >
          <div class="li_left">
            <span class="series">
              <i>{{ index + 1 }}</i>
            </span>
          </div>
          <div class="li_right">
            <div class="top">
              <p class="textoverflow">{{ item.eventdesc?item.eventdesc:item.eventDesc?item.eventDesc:'' }}</p>
            </div>
            <div class="bottom">
              <span>{{item.submittedunit?item.submittedunit:item.submittedUnit?item.submittedUnit:''}}</span>
              <span>{{
                item.eventtime
                  ? item.eventtime.slice(0, 16)
                  : item.eventTime
                  ? item.eventTime.slice(0, 16)
                  : ""
              }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      v-else-if="flagLoading && derivativeData.length == 0"
      class="loading"
    ></div>
    <div
      v-else-if="!flagLoading && derivativeData.length == 0"
      class="no_data_tip"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
  name: 'DeriveVie',
  components: {
    ZoomBtn,
  },
  mixins: [MapCommon],
})
export default class DeriveVie extends Vue {
  @Prop() private deriveViewList: any;
  private flagLoading: boolean = true;
  private derivativeData: any = [];
  private activeIndex: any = -1;
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private deriveClick(item: any, index: any) {
    // 衍生事件列表点击事件
    this.activeIndex = index;
    this.getComponent().load({
      x: item.longitude,
      y: item.latitude,
      autoPan: true, // 推送时不定位视野
      type: '16',
      item: [item],
    });
  }
    // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'push_event_popup',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 推送屏推送修改数据监听事件
  @Watch('$store.state.eventPushStore.eventPushData.derivativeEvents', {
    deep: true,
    immediate: true,
  })
  private getDerivative(val: any) {
    this.derivativeData = [];
    if (val && val.length > 0) {
      const list = [].concat(val);
      this.derivativeData = val.reduce(
        (all: any, next: any) =>
          all.some((item: any) => item.id === next.id) ? all : [...all, next],
        [],
      );
      const obj = {
        x: this.derivativeData[0].longitude,
        y: this.derivativeData[0].latitude,
        autoPan: true, // 推送时不定位视野
        type: '16',
        item: this.derivativeData,
      };
      this.getComponent().load(obj); // 全部上图
    }
    this.sortDataArray(this.derivativeData);
  }
  private sortDataArray(dataArray: any) {
    return dataArray.sort((a: any, b: any) => {
      const aTime = a.eventtime ? a.eventtime : a.eventTime;
      const bTime = b.eventtime ? b.eventtime : b.eventTime;
      return (
        Date.parse(bTime.replace(/-/g, '/')) -
        Date.parse(aTime.replace(/-/g, '/'))
      );
    });
  }
  // 大屏点击衍生事件列表触发点击事件
  @Watch('deriveViewList', { deep: true, immediate: true })
  private changItem(val: any) {
    const self = this;
    if (val) {
      this.activeIndex = val.index;
      this.getComponent().load({
        x: val.item.longitude,
        y: val.item.latitude,
        autoPan: true, // 推送时不定位视野
        type: '16',
        item: [val.item],
      });
    }
  }
  private created() {
    this.flagLoading = false;
    this.changItem(this.deriveViewList);
  }
  private mounted() {
   this.getComponent().on('push_event_popup', this.popupData, this);
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('locateComp');
    return component;
  }
  private beforeDestroy() {
    this.getComponent()._clearLayers();
  }
}
</script>
<style scoped lang="less">
@imgUrl: "../../../assets/img/earthquake";
.DerivativeEvents-warp {
  width: 100%;
  height: 726px;
  .title {
    font-weight: 600;
    font-family: "myHeiti";
    font-size: calc(20px * 1.5);
    color: #00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
    font-style: italic;
    line-height: 30px;
  }
  .content {
    width: 100%;
    height: 90%;
    padding: 0 10px;
    box-sizing: border-box;
    .container {
      width: 100%;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-image: linear-gradient(
          0deg,
          #0a7ccc 0%,
          #06b4d1 52%,
          #02ebd5 100%
        );
      }
      &::-webkit-scrollbar-track {
        border-radius: 0;
        border-radius: inherit;
        background-color: transparent;
      }
      > li {
        width: 100%;
        height: 124px;
        background: url("@{imgUrl}/row_bg.png") no-repeat 0 0;
        background-size: 100% 100%;
        display: flex;
        padding: 10px 15px 5px 5px;
        box-sizing: border-box;
        margin-bottom: 5px;
        cursor: pointer;
        &.active {
          background: url("../../../assets/img/halfScreen/halflist/boxListBgIcon_h.png")
            no-repeat 0 0;
        }
        .li_left {
          width: 50px;
          height: 100%;
          padding-top: 3px;
          box-sizing: border-box;
          .series {
            display: inline-block;
            width: 30px;
            height: 30px;
            font-size: 24px;
            line-height: 30px;
            text-align: center;
            color: #c3e9ff;
            position: relative;
            background: rgba(71, 215, 162, 0.2);
            border: 1px #47d7a2 solid;
            border-radius: 5px;
            i {
              position: absolute;
              left: 50%;
              transform: translateX(-60%);
            }
          }
        }
        .li_right {
          width: calc(100% - 60px);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .top,
          .bottom {
            display: flex;
            justify-content: space-between;
            color: #fff;
            span {
              white-space: nowrap;
            }
          }
          .top {
            font-size: 20px;
          }
          .bottom {
            font-size: 18px;
            span {
              display: block;
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              &:nth-child(1) {
                width: 50%;
              }
              &:nth-child(2) {
                width: 50%;
                text-align: left;
              }
            }
          }
          .textoverflow {
            width: 100%;
            display: block;
            height: 78px;
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
      }
    }
  }
  // .no_data_tip {
  //   width: 100%;
  //   height: 100%;
  //   background-image: url(../../../../../assets/img/publicIcon/not_found.png);
  //   background-position: center center;
  //   background-repeat: no-repeat;
  //   position: relative;
  // }
  // .loading {
  //   width: 100%;
  //   height: 95%;
  //   background: url('@{publicIcon}/loading_02.gif') no-repeat 0 0;
  //   background-position: center;
  // }
}
</style>
