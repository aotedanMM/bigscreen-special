<template>
  <!-- 灾情统计首页 -->
  <div class="disaster_main">
    <div class="rescueTeamsHome_hd title-panel">
      <p>灾情统计</p>
      <span
        v-if="
          $store.state.eventPushStore.eventLocation.EventType === '10' &&
            $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
        "
        class="closeAndback"
        @click="closeAndbackFn"
      ></span>
    </div>
    <div class="tempRight-title f-tit-h2">
      <span>受灾情况</span>
      <span class="echartIcon" @click="openDailog()"></span>
    </div>
    <!-- 区县 乡镇 -->
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
              <span>{{ item.value || 0 }}</span>
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自然灾害损失情况 -->
    <div class="disasterStu">
      <div class="tempRight-title f-tit-h2">
        <span>自然灾害损失情况</span>
      </div>
      <div class="disaster_list panelPublicDefault_bd">
        <ul class="statisticList">
          <li
            class="statisticList_li f-tit-h2"
            v-for="(item, index) in disasterCatgory"
            :key="index"
            @click.stop="clickItem(item, index)"
          >
            <span>
              <span :class="item.icon"></span>
              {{ item.name }}
            </span>
            <span>
              <span class="statisticList_li_textWarning f-number">
                {{ item.value || 0 }}
                <span class="unit">{{ item.unit }}</span>
              </span>
            </span>
          </li>
        </ul>
      </div>
      <div class="tempRight-title f-tit-h2">
        <span>救灾工作情况</span>
      </div>
      <div class="disaster_list panelPublicDefault_bd">
        <ul class="statisticList">
          <li
            class="statisticList_li f-tit-h2"
            v-for="(item, index) in disasterCatgoryRelief"
            :key="index"
            @click.stop="clickItem(item, index)"
          >
            <span>
              <span :class="item.icon"></span>
              {{ item.name }}
            </span>
            <span>
              <span class="statisticList_li_textWarning f-number">
                {{ item.value || 0 }}
                <span class="unit">{{ item.unit }}</span>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { disasterSituationServer } from '@/api/feature/disasterStatistics/installServer';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
/**
 * 灾情统计
 */
@Component({
  name: 'DisasterStatisticsHome',
  components: {},
})
export default class DisasterStatisticsHome extends Vue {
  @Prop() private handleClick: any; // 父组件处理子组件的点击的方法
  @Prop() private showState: any;
  private data: any;
  private compParamData: any;
  private tuliData: any;
  private code: any;
  // 受灾情况
  private curList: any = [
    {
      key: 'counties',
      text: '区县',
      value: '0',
      unit: '个',
      icon: 'qx',
      counties: '',
      countiesBottom: '',
      nextCompName: 'DisasterSituationContainer',
    },
    {
      key: 'townNum',
      text: '乡镇',
      value: '0',
      unit: '个',
      icon: 'xz',
      counties: '',
      countiesBottom: '',
      nextCompName: 'DisasterSituationContainer',
    },
  ];
  // 自然灾害
  private disasterCatgory: any = [
    {
      name: '人口情况',
      icon: 'rk',
      unit: '人',
      value: '0',
      detail: '',
      key: 'renkou',
      keyValue: 'shouzai',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '房屋情况',
      icon: 'fw',
      unit: '户',
      value: '',
      detail: '',
      key: 'fangwu',
      keyValue: 'daotahu',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '农业情况',
      icon: 'ny',
      unit: '公顷',
      value: '',
      detail: '',
      key: 'nongye',
      keyValue: 'nongzuowu',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '经济情况',
      icon: 'jj',
      unit: '万元',
      value: '',
      detail: '',
      key: 'jingji',
      keyValue: 'zhijie',
      nextCompName: 'CommonDisasterContainer',
    },
  ];
  // 救灾工作
  private disasterCatgoryRelief: any = [
    {
      name: '烟台市',
      icon: 'yantai',
      unit: '万元',
      value: '',
      detail: '',
      key: 'benji',
      keyValue: 'shenghuobuzhuzijin',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '各区市县',
      icon: 'qx',
      unit: '万元',
      value: '',
      detail: '',
      key: 'xiaji',
      keyValue: 'shenghuobuzhuzijin',
      nextCompName: 'CommonDisasterContainer',
    },
  ];
  private closeAndbackFn() {
    this.messsageBus.emit('closeAndBack', true);
  }
  // 灾情弹窗
  private openDailog() {
    this.messsageBus.$emit('DisasterOpen', true, this.data, this.compParamData);
  }
  private openDailogtl(item: any) {
    console.log(item, 'openDailogHome');
    this.messsageBus.$emit('DisasterOpentuli', true, item);
  }
  // 后台返回数据 总数计算
  private sum(arr: any) {
    var s = 0;
    arr.forEach(function(val: any) {
      s += val;
    }, 0);
    return s;
  }
  // 通过接口拿到数据  受灾情况、自然灾害
  // cce069357cb042e0b8c9ef637bcf6c21
  // this.$store.state.eventPushStore.eventId,
  private async getDataByServ() {
    const self = this;
    const resData: any = await disasterSituationServer.getStatistics(
      this.$store.state.eventPushStore.eventId,
    );
    if (Object.keys(resData).length !== 0) {
      this.curList[0].value = resData.counties.length;
      this.curList[1].value = resData.townNum;
      this.code = resData.code;
      self.data = resData;
      this.getComponent().addDistrict(resData);
      const tuliData = this.getComponent().addDistrict(resData);
      this.messsageBus.emit('tuliDataA', tuliData.reverse());
      const that = this;
      Object.keys(resData).forEach(function(key: any) {
        that.disasterCatgory.map((v: any) => {
          if (key === v.key) {
            v.detail = resData[key];
            // v.value = that.sum(Object.values(resData[key]));
            v.value = resData[key][v.keyValue];
          }
        });
        that.curList.map((v: any, index: any) => {
          v.counties = resData.counties;
          // if (key == v.key) {
          //   v.value = resData[key];
          // }
        });
      });
    }
  }
  // 接口数据  救灾工作
  // @Watch('$store.state.eventPushStore.rescue_disaster')
  private async getDisasterData() {
    const resData: any = await disasterSituationServer.getDisasterData(
      this.$store.state.eventPushStore.eventId,
    );
    if (resData) {
      this.compParamData = resData;

      const that = this;
      Object.keys(resData).forEach(function(key: any) {
        that.curList.map((v: any) => {
          v.countiesBottom = resData.counties;
        });
        that.disasterCatgoryRelief.map((v: any) => {
          if (key === v.key) {
            v.detail = resData[key];
            v.value = resData[key][v.keyValue];
            // let arr = Object.values(resData[key]);
            // arr.splice(1, 2);
            // v.value = that.sum(arr);
          }
        });
      });
    }
  }

  // 进入下钻页
  private clickItem(item: any, index: number) {
    const param: any = {
      ...item,
      status: 'home',
      code: this.code,
      //   nextCompParam: JSON.parse(JSON.stringify(this.curDataCache)),
    };
    this.handleClick(item.nextCompName, param);
  }

  // 显示 图例
  private showJsl(val: any) {
    const data = {
      key: val,
      isShow: true,
    };
    this.$store.dispatch('configModel/updateLegendItem', data);
  }
  // 隐藏 图例
  private hideJsl(val: any) {
    const data = {
      key: val,
      isShow: false,
    };
    this.$store.dispatch('configModel/updateLegendItem', data);
  }

  // 获取地图方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStatisticsFactory.getComponent(
      'disasterSatistics',
    );
    return component;
  }
  //  地图定位
  private showPopup(event: any) {
    const self = this;
    event.type = 'disasterStatics_popup';
    const list = this.data.counties;
    list.forEach((res: any, index: any) => {
      if (res.code === event.data.districtcode) {
        let param: any = {};
        if (JSON.stringify(self.compParamData) !== '{}') {
          param = {
            ...res,
            countiesBottom: JSON.parse(
              JSON.stringify(self.compParamData.counties),
            ),
          };
        } else {
          param = {
            ...res,
            countiesBottom: self.compParamData,
          };
        }
        self.handleClick('DisasterSituationTown', param);
      }
    });
  }

  // 初始化监听的事件
  private initEventListener() {
    // 行政区划的点位点击事件监听
    this.getComponent().on('disasterStatics_popup', this.showPopup, this);
  }
  // 监听推送
  @Watch('$store.state.eventPushStore.nature_disaster')
  private async handleResultData() {
    this.getDataByServ();
  }
  // 监听推送
  @Watch('$store.state.eventPushStore.rescue_disaster')
  private async handleResultData1() {
    this.getDisasterData();
  }

  private async created() {
    // this.handleResultData();
    // this.handleResultData1();
    this.getComponent().load();
    this.showJsl('Disaster'); // 放到这里是为了让图例先出来。
    this.initEventListener();
    await this.handleResultData();
    await this.handleResultData1();
  }
  // private mounted() {}
  private beforeDestroy() {
    this.getComponent().unload();
    this.hideJsl('Disaster');
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@urlPath: '../../../../assets/img/flood/disasterStatistics';
* {
  margin: 0;
  padding: 0;
}
.disaster_main {
  padding: 0px 10px;
}
.tempRight-title {
  justify-content: space-between;
  .echartIcon {
    float: right;
    width: 32px;
    height: 32px;
    background: url('../../../../assets/img/monitorWarning/echart.png')
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
        background: url('../../../../assets/img/discuss/bg.png') no-repeat 50%
          0px;
        padding: 11px 16px;
        height: 110px;
        box-sizing: border-box;
        background-size: 100% 100%;
        &:hover {
          background-image: url('../../../../assets/img/discuss/bg_h.png');
        }
      }
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
.disaster_list {
  margin-top: 15px;
  .unit {
    color: #bbd0dc;
    font-size: 26px;
  }
  .rk {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/rk.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .fw {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/fw.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .ny {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/ny.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .jj {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/jj.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .yantai {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/yantai.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
  .qx {
    width: 45px;
    height: 30px;
    display: inline-block;
    background: url('@{urlPath}/qx.png') no-repeat 0 0;
    background-size: 100% 100%;
  }
}
</style>
