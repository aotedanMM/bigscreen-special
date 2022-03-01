<template>
  <div class="WindCircleSearch" v-show="isShow">
    <div>
      <p class="title">
        <span>查询方式</span>
        <i class="closePanel" @click="isShow = !isShow"></i>
      </p>
      <ul>
        <li
          v-for="(item, index) in btnList"
          :class="{checkedLi:tabChooseValue === item.id}"
          :key="index"
          @click="tabFn(item)"
        >{{item.name}}</li>
      </ul>
      <span class="confirmBtn" @click="isOk">确认</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'WindCircleSearch',
})
export default class WindCircleSearch extends Vue {
  private isShow: boolean = false;
  private tabChooseValue: any = '1';
  private btnList: any = [
    {
      id: '1',
      name: '行政区划查询',
      isChecked: false,
    },
    {
      id: '2',
      name: '风圈查询',
      isChecked: false,
    },
    {
      id: '3',
      name: '周边查询',
      isChecked: false,
    },
  ];
  private mounted() {
    this.messsageBus.off('WindCircleSearch');
    this.messsageBus.on('WindCircleSearch', () => {
      // 重新打开的时候获取现在的id值
      if (!this.isShow) {
        this.tabChooseValue = this.$store.state.TyphoonModule.viewConfig.tabChooseValue;
      }
      this.isShow = !this.isShow;
    });
  }

  private destroyed() {
    this.messsageBus.off('WindCircleSearch');
  }

  // 圈的台风
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('typhoon');
    return component;
  }

  // 行政区划
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent('typhoonDistricts');
    return component;
  }

  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private watchEventType(val: string) {
    if (val !== '10') {
      this.isShow = false;
    }
  }

  private isOk() {
    const self: any = this;
    if (self.tabChooseValue === '1') { // 行政区划
      self.getComponent1().showhideDistricts(true);
      self.getComponent1().showhideCircle(false);
      self.messsageBus.emit('updateAreaInfluenceList' , true);
    } else if (self.tabChooseValue === '2') { // 风圈查询
      self.getComponent().getTyphoonInfluence(this.$store.state.TyphoonModule.id).then((data: any) => {
        /**
         * 点击进入处置按钮
         * @param isCollection- 是否收藏
         * @param selecttypecode - 事件类型
         */
        // self.$store.dispatch('eventPushStore/UpdateGeometry', data);
        self.messsageBus.emit('updateAreaInfluenceList', false);
        self.getComponent1().showhideDistricts(false);
        self.getComponent1().showhideCircle(true);
        self.$store.commit('panelPositionChangeModule/setrightPanelPosition', {TyphoonLocation: 'right: 500px;'} );
        self.$nextTick(() => {
          self.messsageBus.emit('updateData');
        });
      });
    } else {
      // 周边查询
    }
    // 修改成确认的id
    self.$store.dispatch('TyphoonModule/setTabChooseValue', self.tabChooseValue);
    self.isShow = false;
  }

  private tabFn(item: any) {
    this.tabChooseValue = item.id;
  }
}
</script>
<style lang="less" scoped>
@url: '../../../../assets/img/navGis';
.WindCircleSearch {
  width: 460px;
  height: 250px;
  position: absolute;
  top: 20%;
  right: 115px;
  z-index: 201;
  background: url('../../../../assets/img/nav/searchBg.png') no-repeat;
  background-size: 100% 100%;
  .title {
    span {
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: 30px;
      color: #00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
      margin-left: 30px;
    }
    i {
      display: inline-block;
      width: 90px;
      height: 48px;
      background: url('../../../../assets/img/gisModule/PopulationFeverBox/closeBtn.png')
        no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 1px;
      top: 0px;
      &:hover {
        background-image: url('../../../../assets/img/gisModule/PopulationFeverBox/closeHover.png');
      }
    }
  }
  ul {
    display: flex;
    justify-content: space-around;
    height: 52px;
    line-height: 52px;
    width: 91%;
    margin-left: 20px;
    /*border: 1px solid #002a51;*/
    /*border-image-slice: 1;*/
    background-image: linear-gradient(180deg, #002a51 0%, #002240 100%);
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(
      -80deg,
      #00efff 0%,
      #9af2ff 50%,
      #229fff 100%
    );
    border-image-slice: 1;
    margin-top: 10px;
    /*opacity: 0.4;*/
    li {
      color: #e5f4ff;
      font-size: 26px;
      cursor: pointer;
    }
    .checkedLi {
      background: url('../../../../assets/img/nav/searchTypeH.png') no-repeat;
      background-size: 100% 100%;
      color: #fffabe;
      padding: 0 5px;
      cursor: pointer;
    }
  }
  .confirmBtn {
    display: inline-block;
    width: 117px;
    height: 62px;
    line-height: 62px;
    text-align: center;
    background: url('../../../../assets/img/nav/searchTypeSure.png') no-repeat;
    background-size: 100% 100%;
    color: #a0f4fd;
    box-shadow: 0px 2px 4px 0px rgba(23, 55, 95, 0.53);
    font-size: 24px;
    position: absolute;
    bottom: 31px;
    right: 35px;
    cursor: pointer;
  }
}
</style>
