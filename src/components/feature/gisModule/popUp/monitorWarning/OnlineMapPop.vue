<template>
  <div>
    <!-- 图层 -->
    <div class="layer-panel">
      <div class="title">
        <span>{{ OnlineData.userName }}</span>
        <div class="btn">
          <i class="close" @click="close"></i>
        </div>
      </div>
      <div class="content">
        <div class="contentText">
          <p>
            <span>联系电话：</span>
            <span>{{ OnlineData.telnumber?OnlineData.telnumber:'- -' }}</span>
          </p>
          <p>
            <span>所属单位：</span>
            <span :title="OnlineData.orgName">{{ OnlineData.orgName }}</span>
          </p>
          <p>
            <span>所在位置：</span>
            <span :title="OnlineData.address">{{ OnlineData.address }}</span>
          </p>
        </div>
        <ul class="contentBtn">
          <li
            v-for="(item, index) in tabList"
            :key="index"
            @click="changeTab(item, index)"
            :class="[activeIndex === index&&'active',!OnlineData.telnumber&&item.name==='语音通话'&&'gray']"
          >
            <span :class="item.icon" class="iconBox"></span>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { onlineTerminalServer } from '@/api/feature/monitorwarning/installServer';
/**
 * 图层
 */
@Component({
  name: 'OnlineMapPop',
  components: {},
})
export default class OnlineMapPop extends Vue {
  private OnlineData: any = {};
  private activeIndex: any = -1;
  private tabList: any = [
    {
      name: '语音通话',
      icon: 'yuyintonghua',
    },
    {
      name: '视频通话',
      icon: 'shipintonghua',
    },
    {
      name: '历史轨迹',
      icon: 'lishiguiji',
    },
  ];
  public mounted() {
    const self: any = this;
    this.OnlineData = self.event.data;
    console.log(this.OnlineData, 'self.event'); // 传入的信息
  }
  private close() {
    this.messsageBus.emit('closeOnlineMapPop', false);
  }
  private changeTab(item: any, index: any) {
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false});
    switch (item.name) {
      case '语音通话':
        this.messsageBus.emit('showCallup', true, this.OnlineData, this.OnlineData.telnumber, {}, this.OnlineData.userName);
        break;
      case '视频通话':
          const path = 'anyChat/index.html?id=' + this.OnlineData.userId;
          this.messsageBus.emit('showVideoCallBox', path);
          break;
      case '历史轨迹':
        this.getHistoricalRoute(this.OnlineData.userId);
        break;

      default:
        break;
    }
    if (index === 2 && index === this.activeIndex) {
      this.activeIndex = '';
      this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false});
    } else {
      this.activeIndex = index;
    }
  }
  // 历史轨迹接口
  private async getHistoricalRoute(id: any) {
    const playParams = {
      isShow: true,
      param: {
          id,
      },
    };
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', playParams);
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'terminalLayer',
    );
    return component;
  }
  private beforeDestroy() {
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', {isShow: false});
  }
  private created() {
    // 视频通话挂断监听
    this.messsageBus.on('closeVideoCallBox', (data: any) => {
        this.activeIndex = -1;
    });
    // 语音通话挂断监听
    this.messsageBus.on('showCallup', (data: any) => {
        if (!data) {
          this.activeIndex = -1;
        }
    });
  }
}
</script>
<style lang="less" scoped>
@url: "../../../../../assets/img/gisModule/PopulationFeverBox";
@btn: "../../../../../assets/img/gisPlot";
@icon: "../../../../../assets/img/gisModule/gisLayerPanel";
.layer-panel {
  width: 488px;
  height: 298px;
  background: url("@{url}/onlinePopdk.png") no-repeat;
  background-size: 100% 100%;
  .title {
    position: relative;
    padding: 0px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: 600;
    height: 60px;
    box-sizing: border-box;
    span {
      display: block;
      width: 340px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
    }
    .btn {
      position: absolute;
      display: flex;
      top: 5px;
      right: 0;
      .close {
        position: absolute;
        right: -5px;
        top: -10px;
        width: 78px;
        height: 48px;
        cursor: pointer;
        background: url("@{url}/closeBtn.png") no-repeat center / 100% 100%;
        &:hover {
          top: -6px;
          background: url("@{url}/closeHover.png") no-repeat center / 100% 100%;
        }
      }
    }
  }
  .content {
    width: 94%;
    height: 480px;
    margin-top: 16px;
    padding: 0 16px;
    .contentText {
      p {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          line-height: 45px;
          font-size: 26px;
          &:nth-child(1) {
            color: #92edf6;
            font-family: "Microsoft Ya Hei";
          }
          &:nth-child(2) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 310px;
            color: #cee6ea;
          }
        }
      }
    }
    .contentBtn {
      display: flex;
      align-items: center;
      margin-top: 16px;
      padding: 0 14px;
      li {
        width: 150px;
        height: 46px;
        background: url("@{url}/tabBj.png") no-repeat center center / 100% 100%;
        line-height: 46px;
        font-size: 22px;
        color: #cee6ea;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.active {
          width: 138px;
          margin-left: 12px;
          background: url("@{url}/tabBjactive.png") no-repeat center center /
            100% 100%;
          .iconBox {
            display: inline-block;
            margin-left: 0px;
            &.yuyintonghua {
              width: 32px;
              height: 39px;
              background: url("@{url}/vicoeactive.png") no-repeat center center /
                100% 100%;
            }
            &.shipintonghua {
              width: 36px;
              height: 36px;
              background: url("@{url}/videoactive.png") no-repeat center center /
                100% 100%;
            }
            &.lishiguiji {
              width: 35px;
              height: 35px;
              background: url("@{url}/llishiactive.png") no-repeat center center /
                100% 100%;
            }
          }
          span {
            &:nth-child(2) {
              margin-left: 0px;
            }
          }
        }
        .iconBox {
          display: inline-block;
          margin-left: 20px;
          &.yuyintonghua {
            width: 16px;
            height: 23px;
            background: url("@{url}/vicoe.png") no-repeat center center / 100%
              100%;
          }
          &.shipintonghua {
            width: 20px;
            height: 20px;
            background: url("@{url}/video.png") no-repeat center center / 100%
              100%;
          }
          &.lishiguiji {
            width: 19px;
            height: 19px;
            background: url("@{url}/llishi.png") no-repeat center center / 100%
              100%;
          }
        }
        span {
          &:nth-child(2) {
            margin-left: 6px;
          }
        }
      }
    }
  }
}
</style>
