<template>
  <!-- 受灾情况详情页面 -->
  <div class="disasterStu">
    <div class="rescueTeamsHome_hd title-panel">
      <p>{{ compParam.name }}灾情统计</p>
      <span class="halflist-back" @click="handleBackParent"></span>
    </div>
    <div class="tempRight-title f-tit-h2">
      <span>受灾情况</span>
      <span class="echartIcon" @click="openDailog1()"></span>
    </div>
    <div class="DiscussList disasterTown">
      <div class="influenceList_innr">
        <div class="influenceList_innr_before curContainer">
          <div
            v-for="item of curList"
            :key="item.key"
            class="curContainer_item"
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
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { disasterSituationServer } from '@/api/feature/disasterStatistics/installServer';
/**
 * 灾情统计
 */
@Component({
  name: 'DisasterSituationTown',
  components: {},
})
export default class DisasterSituationTown extends Vue {
  @Prop() private compParam: any;
  @Prop() private handleClick: any;
  private data: any;
  private compParamData: any;
  private code: any;
  private curList: any = [
    {
      key: 'practicalNum',
      text: '受灾乡镇',
      value: '1',
      unit: '个',
      icon: 'xz',
      counties: '',
    },
  ];
  private disasterCatgory: any = [
    {
      name: '人口情况',
      icon: 'rk',
      unit: '人',
      value: '',
      key: 'renkou',
      keyValue: 'shouzai',
      detail: '',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '房屋情况',
      icon: 'fw',
      unit: '户',
      value: '',
      key: 'fangwu',
      keyValue: 'daotahu',
      detail: '',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '农业情况',
      icon: 'ny',
      unit: '公顷',
      value: '',
      key: 'nongye',
      keyValue: 'nongzuowu',
      detail: '',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '经济情况',
      icon: 'jj',
      unit: '万元',
      value: '',
      key: 'jingji',
      keyValue: 'zhijie',
      detail: '',
      nextCompName: 'CommonDisasterContainer',
    },
  ];
  private disasterCatgoryRelief: any = [
    {
      name: '',
      icon: 'yantai',
      unit: '万元',
      value: '',
      key: 'benji',
      detail: '',
      keyValue: 'shenghuobuzhuzijin',
      nextCompName: 'CommonDisasterContainer',
    },
    {
      name: '下级单位',
      icon: 'qx',
      unit: '万元',
      value: '',
      key: 'xiaji',
      detail: '',
      keyValue: 'shenghuobuzhuzijin',
      nextCompName: 'CommonDisasterContainer',
    },
  ];
  private disasterList = [];

  // 返回一级页面
  private handleBackParent() {
    this.$emit('backParent');
    this.handleClick(
      'DisasterSituationContainer',
      JSON.parse(JSON.stringify(this.compParam)),
    );
  }
  // 数据 总数计算
  private sum(arr: any) {
    var s = 0;
    arr.forEach(function(val: any, idx: any, arr2: any) {
      s += val;
    }, 0);
    return s;
  }

  // 灾情弹窗
  private openDailog1() {
    let data = {};
    if (this.compParam.countiesBottom && this.compParam.countiesBottom[0]) {
      data = JSON.parse(JSON.stringify(this.compParam.countiesBottom[0]));
    }
    this.messsageBus.$emit('DisasterOpen', true, this.compParam, data);
  }
  // 进入下钻页
  private clickItem(item: any, index: number) {
    const param: any = {
      ...item,
      status: 'town',
      nextCompParam: JSON.parse(JSON.stringify(this.compParam)),
    };
    this.handleClick(item.nextCompName, param);
  }
  //  数据
  // this.$store.state.eventPushStore.eventId,
  private async getDataByServ() {
    const resData: any = await disasterSituationServer.getStatistics(
      this.$store.state.eventPushStore.eventId,
    );
    const that = this;
    resData.counties.map((item: any) => {
      if (this.code === item.code) {
        this.curList[0].value = item.townNum;
        Object.keys(item).forEach(function(key: any) {
          that.disasterCatgory.map((v: any) => {
            if (key === v.key) {
              // v.value = that.sum(Object.values(item[key]));
              v.value = item[key][v.keyValue];
              v.detail = item[key];
            }
          });
        });
      }
    });
  }
  // 接口数据  救灾工作
  private async getDisasterData() {
    const resData: any = await disasterSituationServer.getDisasterData(
      this.$store.state.eventPushStore.eventId,
    );
    const that = this;
    if (Object.keys(resData).length !== 0) {
      resData.counties.map((item: any) => {
        if (this.code === item.code) {
          Object.keys(item).forEach(function(key: any) {
            that.disasterCatgoryRelief.map((v: any) => {
              if (key === v.key) {
                v.value = item[key][v.keyValue];
                // const arr = Object.values(item[key]);
                // arr.splice(1, 2);
                // v.value = that.sum(arr);
                v.detail = item[key];
              }
            });
          });
        }
      });
    }
  }

  // 监听推送
  @Watch('$store.state.eventPushStore.nature_disaster')
  private async handleResultData() {
    await this.getDataByServ();
  }
  // 监听推送
  @Watch('$store.state.eventPushStore.rescue_disaster')
  private async handleResultData1() {
    this.getDisasterData();
  }
  // 监听推送
  private async created() {
    await this.handleResultData();
    await this.handleResultData1();
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
    event.type = 'disasterStatics_popup';
    this.code = event.data.districtcode;
    this.getDataByServ();
    this.getDisasterData();
  }
  //
  private mounted() {
    this.getComponent().on('disasterStatics_popup', this.showPopup, this);
    console.log(this.compParam);
    if (this.compParam.status) {
      this.compParam = this.compParam.nextCompParam;
    }
    // 自然灾害数据
    this.data = this.compParam;
    this.compParamData = this.compParam.countiesBottom;
    this.disasterCatgoryRelief[0].name = this.compParam.name;
    this.curList[0].value = this.compParam.townNum;
    this.code = this.compParam.code;
    const that = this;
    Object.keys(this.compParam).forEach(function(key: any) {
      that.disasterCatgory.map((v: any) => {
        if (key === v.key) {
          // v.value = that.sum(Object.values(that.compParam[key]));
          v.detail = that.compParam[key];
          v.value = that.compParam[key][v.keyValue];
        }
      });
    });
    // 救灾数据
    if (this.compParam.countiesBottom && this.compParam.countiesBottom[0]) {
      Object.keys(this.compParam.countiesBottom[0]).forEach(function(key: any) {
        that.disasterCatgoryRelief.map((v: any) => {
          if (key === v.key) {
            v.value = that.compParam.countiesBottom[0][key][v.keyValue];
            // const arr = Object.values(that.compParam.countiesBottom[0][key]);
            // arr.splice(1, 2);
            // v.value = that.sum(arr);
            v.detail = that.compParam.countiesBottom[0][key];
          }
        });
      });
    }
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
.tempRight-title {
  justify-content: space-between;
  padding: 0px 15px;
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
.halflist-back {
  width: 61px;
  height: 25px;
  position: absolute;
  top: 10px;
  right: 0px;
  color: #338af8;
  cursor: pointer;
  z-index: 1;
  background: url('../../../../assets/img/default/panel/toBack.png') no-repeat
    0px 70%;
  background-size: 100% 100%;
  &:hover {
    background-image: url('../../../../assets/img/default/panel/toBack_h.png');
  }
}
.unit {
  color: #bbd0dc;
  font-size: 26px;
}
.disasterStu {
  .statisticList {
    font-size: 26px;
    margin-top: 20px;
  }
  .curContainer_item {
    padding-left: 20px;
  }
  .disasterTown {
    .text {
      color: #fff;
      font-size: 26px;
    }
  }
  .disaster_catgory {
    display: flex;
    margin-top: 10px;
    span {
      display: block;
      &:nth-child(2) {
        margin-top: 10px;
      }
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
}
</style>
