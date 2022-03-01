<template>
  <div class="panelPublicDefault rainCont" style="padding: 0px 15px">
    <div class="panelPublicDefault_hd">
      <span class="title-panel">历史地震</span>
    </div>
    <ul class="statisticCount f-tit-h2">
      <li>
        共
        <span class="f-number">{{ total || 0 }} 条</span>
        <!-- <slot name="unit"></slot> -->
      </li>
    </ul>
    <ul class="statisticList" v-if="$store.state.eventPushStore.eventLocation.EventType&&showInit">
      <li
        class="statisticList_li f-tit-h2"
        v-for="(i, index) in viewRenderData"
        :key="i.level"
        :class="{ checkSty: currenRadiuIndex === index }"
        @click="selectRadiuChangeData(i, index)"
      >
        <span>
          <span class="statisticList_li_textWarning f-number">{{ i.title }}</span>
          <span v-show="$store.state.dataFilterControl.zhypGeoType.key!=='ldqYp'">{{'km'}}</span>
        </span>
        <span>
          <span class="statisticList_li_textWarning f-number">{{ radiuNumList[index] || 0 }}</span>
          <span>条</span>
          <!-- <slot name="unit"></slot> -->
        </span>
      </li>
    </ul>
    <div
      class="listDistrict popupPanelRight_bg"
      v-show="closeFlag"
      :style="$store.state.eventPushStore.eventLocation.EventType&&showInit ? 'height: 460px' : 'height: 730px'"
    >
      <div class="closed-container-box">
        <div class="listDistrict_title">
          <span class="f-tit-h2">历史地震列表</span>
          <i
            @click="FnMinimize"
            :class="
              minimize ? 'panel_switch' : 'panel_switch panel-switch-reverse'
            "
          ></i>
        </div>
      </div>
      <div v-show="minimize" style="height: calc(100% - 154px)">
        <div class="listDistrict-flex-box">
          <div class="listDistrict-input">
            <div class="listDistrict-input-content">
              <el-input
                class="csmMyInput"
                type="text"
                placeholder="请输入历史地震名称"
                v-model.trim="inputWord"
                @input="search(inputWord)"
                @keyup.enter="search(inputWord)"
              >
                <i slot="suffix" class="iconSelf_search" @click="search(inputWord)"></i>
              </el-input>
            </div>
          </div>
        </div>
        <!-- 列表每一行-->
        <div class="nodata" v-if="noData === true || !listDataAll.length">
          <img
            style="margin-top: -20%"
            src="../../../../assets/img/default/panel/noData.png"
            alt
            srcset
          />
        </div>
        <div
          v-show="!(noData === true || !listDataAll.length)"
          style="margin-bottom: 5px; height: calc(100% - 46px)"
        >
          <el-scrollbar class="cmp-scrollbar-y" style=" height: calc(100% - 90px)">
            <ul class="listBox">
              <li
                class="listBox_li f-txt-com"
                v-for="(item, index) in listDataAll"
                :key="index"
                :title="item.position"
                @click="clickList(item)"
                :class="
                  item.isOnline * 1 === 0
                    ? 'gray'
                    : item.checked
                    ? 'active'
                    : ''
                "
              >
                <span>
                  <em class>{{ indexMethod(index) }}</em>
                </span>
                {{ (item.originTime ? item.originTime.substring(0,11) : '') + ' ' + item.position }}
              </li>
            </ul>
          </el-scrollbar>
          <!-- 分页-->
          <div class="pagingBox">
            <!-- class="constomMyElPage"
            small-->
            <el-pagination
              background
              :pager-count="5"
              @current-change="handlePageChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { historicalEarthquakeServer } from '@/api/installServer';

@Component({
  name: 'HistoryEarthquakeList',
  mixins: [MapCommon],
  components: {},
})
export default class HistoryEarthquakeList extends Vue {
  public paginationObj!: any;
  private showInit: any = false; // 统计总数
  private currenRadiuIndex = 0; // 默认进入半径
  private radiuNumList: any = []; // 每个半径圈总条数
  private listDataAll: any = []; // 当前页的表格数据
  private cacheListTotalData: any = []; // 当前分页的总数据
  // 最小化判断
  private minimize: any = true;
  private noData: any = true;
  private closeFlag: any = true;
  private inputWord: string = '';
  // 分页总数量
  private total: any = 0;
  // 显示条数
  private pageSize: any = 10;
  // 当前页码
  private currentPage: any = 1;
  // 分页查询条件
  private opts: any = {
    pageSize: 10,
    nowPage: 1,
    keyWord: this.inputWord,
    districtCode: '',
    type: '',
    // geometry: '',
  };
  // 图上点请求数据
  private requestData: any = {
    geometry: null,
  };
  private viewRenderData: any = [];
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private optsSum: any = {
    // geometry: '',
  };
  public indexMethod(index: number) {
    return (this.currentPage - 1) * this.pageSize + (index + 1);
  }

  private FnMinimize() {
    this.minimize = !this.minimize;
  }

  // 经验圈半径选择
  private selectRadiuChangeData(item: any, index: number) {
    if (this.currenRadiuIndex === index) {
      this.currenRadiuIndex = -1;
      this.listDataAll = [];
      this.getComponentEarthQuake().off('hisPointspopup'); // 清除地图弹框
      this.getComponentEarthQuake().clearAll(); // 清除地图弹框
      return;
    }
    this.currentPage = 1;
    this.opts.nowPage = 1;
    this.currenRadiuIndex = index; // 保存当前选中半径索引
    this.opts.geometry = JSON.stringify(item.geometry);
    this.requestData.geometry = JSON.stringify(item.geometry);
    this.clearOpts();
    this.getHistoryEarthquakeList(); // 重新获取分页数据
    this.addPoint();
  }

  // 统计每个半径的数值
  private async getNumList() {
    // 上点查询条件
    if (!this.$store.state.dataFilterControl.filter.geometry) {
      this.requestData.geometry = '';
      this.viewRenderData = [];
    } else {
      this.requestData.geometry =
        JSON.stringify(
          this.viewRenderData[this.viewRenderData.length - 1] &&
            this.viewRenderData[this.viewRenderData.length - 1].geometry,
        ) || '';
    }

    // 烟台市370600  山东省的370000
    this.optsSum.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode || '370600';

    for (let i = 0; i < this.viewRenderData.length; i++) {
      if (this.$store.state.eventPushStore.eventLocation.EventType) {
        this.optsSum.geometry = JSON.stringify(
          this.viewRenderData[i].geometry || {},
        );
        this.optsSum.i = i;
      }
      const res: any = await historicalEarthquakeServer.getEarthquake(
        this.optsSum,
      );
      if (i === this.viewRenderData.length - 1) {
        this.total = res.data[0].value;
      }
      Vue.set(this.radiuNumList, i, res.data[0].value);
    }
    this.addPoint();
  }
  // 查询当前页
  private async getHistoryEarthquakeList() {
    if (this.requestData.geometry) {
      this.opts.geometry = this.requestData.geometry;
    }
    // 烟台市370600  山东省的370000
    const res: any = await historicalEarthquakeServer.getEarthquakePageList(
      this.opts,
    );
    this.listDataAll = res.data.list;
    if (this.listDataAll) {
      this.noData = false;
    }
    this.total = res.data.total;
    this.currentPage = res.data.nowPage;
  }

  // 分页事件
  private handlePageChange(val: any) {
    this.currentPage = val;
    this.opts.nowPage = val;
    this.getHistoryEarthquakeList();
  }

  //  获取地图功能
  private getComponentEarthQuake() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('historyEarthQuake');
    return component;
  }

  // 获得当前的研判类型，并且触发初步研判首页统计查询数据
  private handleQueryFilterChange() {
    // 获得当前的研判类型
    let curFilterKeyType = '';
    if (
      this.$store.state.dataFilterControl.zhypGeoType &&
      this.$store.state.dataFilterControl.zhypGeoType.key
    ) {
      curFilterKeyType = this.$store.state.dataFilterControl.zhypGeoType.key;
    }
    if (curFilterKeyType === 'jyqYp' || curFilterKeyType === 'ldqYp') {
      // 当前处于经验圈研判或者烈度圈研判
      this.changeQuan();
    }
  }
  // 监听烈度圈：1 ; 经验圈：0
  private changeQuan() {
    const mapType =
      this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ? 0 : 1;
    if (mapType === 0) {
      this.getEventInfoWrapper(mapType);
    } else if (mapType === 1) {
      this.getEventInfoWrapper(mapType);
    }
  }
  // 地图上点
  private async addPoint() {
    const res: any = await historicalEarthquakeServer.getEarthquakeList(
      this.requestData,
    );
    this.getComponentEarthQuake().addResource(res.data);
  }
  // 输入框查询事件
  private search(inputWord: any) {
    this.opts.keyWord = inputWord;
    this.getHistoryEarthquakeList();
  }

  private clearOpts() {
    this.currentPage = 1;
    this.opts.nowPage = 1;
    this.opts.keyWord = '';
  }

  private clickList(item: any) {
    item.checked = !item.checked;
    if (item.checked) {
      // 列表点击上图弹窗
      this.getComponentEarthQuake().locateEvent(item);
    } else {
      // 列表点击取消上图
    }
  }

  // 地图定点回调
  private popupData(event: any) {
    event.type = 'hisPointspopup';
    event.containerId = event.id;
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 获取烈度圈、经验圈对应数值
  private async getEventInfoWrapper(key?: number) {
    const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
    if (eventInfoWrapper) {
      const eventData = eventInfoWrapper.getRanges(); // 这个方法执行之前，地图必须绘制了圈（烈度或者经验）
      this.viewRenderData = [...eventData];
    }
    this.currenRadiuIndex = this.viewRenderData.length - 1;
  }
  private created() {
    if (this.$store.state.dataFilterControl.filter.geometry) {
      // 看空间字段是否有值
      if (this.$store.state.mapTools.nearbyQueryVisible || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') {
        // 确认周边查询是否打开初始化进来的时候
        this.showInit = false;
      } else {
        this.showInit = true;
      }
    }
    // this.getEventInfoWrapper();
    this.changeGeometry();

    // 监听改变经验圈范围
    this.messsageBus.off('ranges-refresh');
    this.messsageBus.on('ranges-refresh', this.changeGeometry, this);
  }

  private getComponent_Pop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgePop',
    );
    return component;
  }

  private mounted() {
    this.getComponentEarthQuake().off('hisPointspopup');
    this.getComponentEarthQuake().on('hisPointspopup', this.popupData);
  }

  private beforeDestroy() {
    this.getComponentEarthQuake().off('hisPointspopup');
    this.getComponentEarthQuake().clearAll();
    this.messsageBus.off('ranges-refresh', this.changeGeometry, this);
  }

  // 监听geometry
  @Watch('$store.state.dataFilterControl.filter')
  private changeGeometry() {
    // 分页查询条件
    this.opts.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;
    if (
      this.$store.state.dataFilterControl.filter.geometry ||
      this.$store.state.dataFilterControl.filter.geometry === ''
    ) {
      // this.opts.geometry = this.$store.state.dataFilterControl.filter.geometry;
      // 上点查询条件
      if (this.viewRenderData.length) {
        this.requestData.geometry = JSON.stringify(this.viewRenderData[this.viewRenderData.length - 1].geometry) || '';
        }
      this.opts.geometry = this.requestData.geometry;
    }

    if (
      this.$store.state.dataFilterControl.filter.geometry &&
      this.$store.state.dataFilterControl.filter.districtCode
    ) {
      this.showInit = false;
    } else if (
      this.$store.state.dataFilterControl.filter.districtCode === '370600' &&
      this.$store.state.dataFilterControl.filter.geometry
    ) {
      this.showInit = false;
    } else if (
      this.$store.state.dataFilterControl.filter.geometry &&
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
    ) {
      this.showInit = true;
    } else if (
      !this.$store.state.dataFilterControl.filter.geometry &&
      this.$store.state.dataFilterControl.filter.districtCode === '370600'
    ) {
      this.showInit = false;
    } else if (
      this.$store.state.dataFilterControl.filter.geometry &&
      this.$store.state.dataFilterControl.filter.districtCode !== ''
    ) {
      this.showInit = true;
    } else if (
      this.$store.state.dataFilterControl.filter.geometry &&
      this.$store.state.dataFilterControl.filter.districtCode === ''
    ) {
      if (this.$store.state.mapTools.nearbyQueryVisible || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') {
        this.showInit = false;
      } else {
        this.getComponent_Pop().load(0); // 人口人力跟踪经验圈
        this.handleQueryFilterChange();
        this.showInit = true;
      }
    } else {
      this.showInit = true;
    }
    this.clearOpts(); // 清除分页参数
    this.getHistoryEarthquakeList(); // 获取分页数据
    this.getComponentEarthQuake().load();
    if (this.$store.state.eventPushStore.eventLocation.EventType) {
      this.getNumList(); // 经验圈每层数据
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
@import '../../../../assets/css/popUp/statistic.less';
@import '../../../../assets/css/popUp/statistic.list.less';
@import '../../../../assets/css/decisionSupport/AreaList.less';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 统计总数 start*/
.statisticCount {
  padding-left: 10px;
  margin: 5px 0 0 0;
  background: url('../../../../assets/img/halfScreen/halflist/totalbg.png') 0 0
    no-repeat;
  background-size: 100% 100%;

  li {
    list-style: none;
    cursor: pointer;
    color: #ffffff;
    font-weight: bolder;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      cursor: pointer;
      margin: 0 10px;
      color: yellow;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
  }
}
.listDistrict_title {
  color: #67e1fb;
  letter-spacing: 1px;
  font-weight: normal;
  line-height: 60px;
  display: flex;
  &:after {
    content: '';
    background: url(../../../../assets/img/halfScreen/halflist/titlexian.png)
      50% 0 no-repeat;
    position: absolute;
    width: 100%;
    height: 23px;
    top: 54px;
    left: 0;
  }
  .panel_switch {
    width: 34px;
    height: 29px;
    background-size: 100% 100%;
    position: absolute;
    right: 0px;
    top: 15px;
    cursor: pointer;
    background: url('../../../../assets/img/halfScreen/halflist/open.png') 50%
      50% no-repeat;
    transition: transform 0.3s;
  }
  .panel_switch.panel-switch-reverse {
    transform: scale(1, -1);
  }
}
.listBox_li {
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 334px;
  &.active {
    color: yellow;
  }
}
</style>
