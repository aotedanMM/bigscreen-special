<template>
  <!-- 受灾情况详情页面 -->
  <div class="disasterStu">
    <div class="rescueTeamsHome_hd title-panel">
      <p>区市县受灾</p>
      <span class="halflist-back" @click="handleBackParent"></span>
    </div>
    <!-- <div class="nodata" v-if="!compParam.counties">
      <img src="../../../../assets/img/default/panel/noData.png" />
    </div> -->
    <!-- v-else -->
    <div class="disaster_list panelPublicDefault_bd">
      <ul class="statisticList">
        <li
          class="statisticList_li f-tit-h2"
          v-for="(item, index) in compParam.counties"
          :key="index"
          @click.stop="clickItem(item, index)"
        >
          <!-- @click="changeRainType(item, index)"
          :class="rainTypeIndex == index ? 'checkSty' : ''" -->
          <span>{{ item.name }}</span>
          <span>
            <span class="statisticList_li_textWarning f-number">{{
              item.townNum || 0
            }}</span
            >乡镇
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
  name: 'DisasterSituationContainer',
  components: {},
})
export default class DisasterSituationContainer extends Vue {
  @Prop() private compParam: any;
  @Prop() private handleClick: any;
  private compParamNew: any = {
    counties: '',
    countiesBottom: '',
  };
  private disasterList = [];
  private curActiveComp = {
    // 当前激活的下钻组件
    compName: '',
    compParam: {},
  };

  private handleClickFn(compName: any, compParam: any) {
    this.curActiveComp = {
      compName: compName === 'DisasterStatisticsHome' ? '' : compName,
      compParam: JSON.parse(JSON.stringify(compParam)),
    };
  }
  // 返回一级页面
  private handleBackParent() {
    this.$emit('backParent');
    this.handleClick('DisasterStatisticsHome', JSON.parse(JSON.stringify({})));
  }
  //  数据
  // this.$store.state.eventPushStore.eventId,
  private async getDataByServ() {
    const resData: any = await disasterSituationServer.getStatistics(
      this.$store.state.eventPushStore.eventId,
    );
    this.compParamNew.counties = resData.counties;
  }
  // 接口数据  救灾工作
  private async getDisasterData() {
    const resData: any = await disasterSituationServer.getDisasterData(
      this.$store.state.eventPushStore.eventId,
    );
    this.compParamNew.countiesBottom = resData.counties;
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
  private mounted() {
    if (!this.compParam.counties) {
      this.getDataByServ();
      this.getDisasterData();
      this.compParam = this.compParamNew;
    }
    console.log(this.compParam, 'compParam');
  }
  private clickItem(item: any, index: number) {
    this.getComponent().locateBycode(item.code);
    const param: any = {
      ...item,
      countiesBottom: this.compParam.countiesBottom
        ? this.compParam.countiesBottom.filter((v: any) => v.name === item.name)
        : 0,
      nextCompParamData: JSON.parse(JSON.stringify(this.compParam)),
    };
    this.handleClick('DisasterSituationTown', param);
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
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
.nodata {
  display: flex;
  justify-content: center;
  margin-top: 50%;
}
</style>
