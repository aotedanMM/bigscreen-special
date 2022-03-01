<template>
  <!-- 水情面板 -->
  <div class="panelPublicDefault water-monitor-panel">
    <div class="panelPublicDefault_hd">
      <!-- ({{ count }}) -->
      <span class="title-panel">水情监测</span>
    </div>
    <!-- <div class="title-line"></div> -->
    <!-- 数据统计 -->
    <div class="panelPublicDefault_bd">
      <!-- <div class="count-container"> -->
      <div class="statisticList">
        <div
          class="statisticList_li f-tit-h2"
          :class="{ checkSty: currentTab === 0 }"
          @click="changeTab(0, '')"
        >
          <span>全部</span>
          <div>
            <span class="statisticList_li_textWarning f-number">{{
              countData.totalNum
            }}</span
            >个
          </div>
        </div>
        <div
          class="statisticList_li f-tit-h2"
          :class="{ checkSty: currentTab === 2 }"
          @click="changeTab(2, 'reservoir')"
        >
          <span>水库测站</span>
          <div>
            <span class="statisticList_li_textWarning f-number">{{
              countData.reservoirStaionNum
            }}</span
            >个
          </div>
        </div>
        <div
          class="statisticList_li f-tit-h2"
          :class="{ checkSty: currentTab === 1 }"
          @click="changeTab(1, 'river')"
        >
          <span>河流站</span>
          <div>
            <span class="statisticList_li_textWarning f-number">{{
              countData.riverStaionNum
            }}</span
            >个
          </div>
        </div>
      </div>
      <div class="statisticList-title">
        <span class="f-tit-h2"> 监测站列表 </span>
        <span class="echartIcon" @click="openDialog"></span>
      </div>
      <!-- <div class="count-item">
          <span class="count-item-title">超警戒水位:</span>
          <span class="count-item-content"
            >{{ countData.overWarningdNum }}个</span
          >
          <span class="count-item-title">更新时间:</span>
          <span class="count-item-content">{{ countData.updateTime }}</span>
        </div>
      <div class="count-item">
        <span class="count-item-title">最大涨势站点:</span>
        <span class="count-item-content"
          >{{ countData.overHighestdNum }}个</span
        >
      </div>
      <div class="count-item">
        <span class="count-item-title">城市内涝积水点:</span>
        <span class="count-item-content"
          >{{ countData.waterloggingNum }}个</span
        >
      </div>-->
      <!-- <div class="echarts" ref="pieEcharts"></div> -->
      <!-- </div> -->
      <!-- 搜索 start-->
      <el-input
        class="csmMyInput"
        type="text"
        v-model.trim="inputValue"
        @input="serach(inputValue)"
      >
        <i
          slot="suffix"
          class="iconSelf_search"
          @click="serach(inputValue)"
        ></i>
      </el-input>
      <!-- 搜索 end-->
      <div class="list">
        <div class="nodata" v-if="!siteList.length">
          <img src="../../../../assets/img/default/panel/noData.png" />
        </div>
        <div v-else>
          <el-scrollbar>
            <ul class="listBoxSingle">
              <li
                class="f-txt-com listBoxSingle_li"
                :class="{ checkSty: activeIndex === item.id }"
                v-for="item in siteList"
                :key="item.id"
                @click="openProp(item.id)"
              >
                <div>
                  <p class="teamName">{{ item.name }}</p>
                  <p>
                    <span class="title">水位：</span>
                    <span>{{
                      item.waterLevel || item.waterLevel == 0 ? item.waterLevel + 'm' : '暂无数据'
                    }}</span>
                  </p>
                </div>
                <div class="teamDistance">
                  <span class="level"
                    >水势：<span>{{ item.trend }}</span></span
                  >
                  <span :class="[
                      { 'c-sky': item.warning === '超汛限' },
                      {
                        'c-orange':
                          item.warning === '超正常' || item.warning === '超警戒',
                      },
                      {
                        'c-tomato':
                          item.warning === '超设计' || item.warning === '超保证',
                      },
                      { 'c-red': item.warning === '超历史最高' }
                    ]">{{ item.warning }}</span>
                </div>
                <!-- <p>
                  <span>
                  </span> -->

                <!-- <span :class="[
                      { 'c-sky': item.warning === '超汛限' },
                      {
                        'c-orange':
                          item.warning === '超正常' || item.warning === '超警戒',
                      },
                      {
                        'c-tomato':
                          item.warning === '超设计' || item.warning === '超保证',
                      },
                      { 'c-red': item.warning === '超历史最高' }
                    ]">
                    {{ item.warning }}
                  </span> -->
                <!-- </p> -->
              </li>
            </ul>
          </el-scrollbar>
          <div class="pagination">
            <el-pagination
              class="constomMyElPage"
              small
              :pager-count="5"
              :current-page.sync="searchData.nowPage"
              @current-change="handleCurrentChange"
              :page-size="searchData.pageSize"
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 图表弹窗 -->
    <el-dialog
      title="水情监测点分析"
      :visible.sync="dialogVisible"
      width="40%"
      :modal-append-to-body="false"
      top="10%"
      :modal="false"
    >
      <span class="updateTime"
        >更新时间：<span>{{ countData.updateTime }}</span></span
      >
      <div class="waterDialog_word">
        <span class="spanDot"
          >最大涨势站点：
          <span class="redWord">{{
            maxWaterData.name ? maxWaterData.name : '暂无数据'
          }}</span></span
        >&nbsp;&nbsp;
        <span>
          <span class="redWord">
            {{ maxWaterData.outWater ? maxWaterData.outWater + 'm' : '0m' }}</span
          ></span
        >

        <div class="count-container">
          <div class="echarts" ref="pieEcharts"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { waterSituationServer } from '@/api/feature/monitorwarning/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
/**
 * 监测预警
 */
@Component({
  name: 'WaterMonitor',
})
export default class WaterMonitor extends Vue {
  // 接收 检测总数
  @Prop() private count!: number;

  // 选中的tab  0-全部  1-河道  2-水库
  private currentTab: number = 0;

  // 统计数据
  private countData: any = {};

  // 饼图对象
  private echartsObj: any = null;

  // 饼图数据
  private pieData: any[] = [];

  // 监测点列表数据
  private siteList: any[] = [];

  // 搜索框数据
  private inputValue: any = '';

  // 列表查询
  private searchData: any = {
    keyWord: '',
    nowPage: 1,
    pageSize: 10,
    sortDesc: '',
    sortField: '',
    type: '',
    scalename: '',
  };
  private maxWaterData: any = {}; // 最大涨势站点信息

  // dailog
  private dialogVisible: boolean = false;
  // 分页
  private total: any = 0;

  // 列表选中的项
  private activeIndex: any = -1;

  // 延时搜索
  private timer: any = '';

  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private showJsl() {
    const data = {
      key: 'Riverway',
      isShow: true,
    };
    this.$store.dispatch('configModel/updateLegendItem', data);
  }
  private showJsl1() {
    const data = {
      key: 'Reservoir',
      isShow: true,
    };
    this.$store.dispatch('configModel/updateLegendItem', data);
  }
  private created() {
    this.getCountData();
    this.getWaterLevel();
    this.getSiteList();
    this.showJsl();
    this.showJsl1();
    this.getMaxWaterInfo();
  }

  private mounted() {
    this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().load();
  }

  // 离开页面清理地图
  private beforeDestroy() {
    this.getComponent().removeResource('water');
    this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().unload();
    clearTimeout(this.timer); // 清除延时搜索
  }

  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
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
      moduleTypeID: 'waterMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }

  // 展示地图定点
  private updateGIS(opts: any = {}) {
    //  移除图层
    this.getComponent().removeResource('water');
    //  加载图层
    this.getComponent().addResource_Water(opts);
  }

  // 获取河道水库统计数据
  private async getCountData() {
    const res: any = await waterSituationServer.getCurrentInfo({});
    console.log(res.data, 'res.data');
    this.countData = res.data.data;
  }
  // 获取最大涨势站点信息
  private async getMaxWaterInfo() {
    const res: any = await waterSituationServer.getMaxWaterInfo({});
    this.maxWaterData = res.data.data;
    console.log(res.data, 'res.data.data');
  }

  // 获取水位统计数据
  private async getWaterLevel() {
    const res: any = await waterSituationServer.getStat({});
    console.log(res.data.data, '566666');
    this.pieData = [
      { value: res.data.data.increase, name: '涨' },
      { value: res.data.data.stable, name: '平' },
      { value: res.data.data.decrease, name: '退' },
    ];
    this.initPieData();
  }

  // 获取监测点列表数据
  private async getSiteList(flag: boolean = true) {
    const res: any = await waterSituationServer.getStationsList(
      this.searchData,
    );
    console.log(res, 'ressss');
    this.siteList = res.data;
    this.total = res.total;
    if (flag) {
      this.updateGIS({
        type: this.searchData.type,
        keyWord: this.searchData.keyWord,
      });
    }
  }

  // 饼图数据初始化
  private initPieData() {
    const pieLegendList = this.pieData.map((item) => item.name);
    this.$nextTick(() => {
      this.renderEcharts(pieLegendList);
    });
  }

  // 绘制饼图
  private renderEcharts(pieLegendList: any[]) {
    if (!this.$refs.pieEcharts) {
      return;
    }
    this.echartsObj = (this as any).$echarts.init(this.$refs.pieEcharts);
    const option: any = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        top: 'middle',
        right: '160',
        textStyle: {
          color: '#fff',
          fontSize: 26,
        },
        itemGap: 30,
        formatter: (name: string) => {
          const legend = this.pieData.find((item) => item.name === name);
          // : ${legend.value}
          return `${name}`;
        },
      },
      color: ['#ff6049', '#00e2e4', '#49a5ee'],
      series: [
        {
          type: 'pie',
          radius: [20, 110],
          center: ['35%', '50%'],
          roseType: 'radius',
          label: {
            normal: {
              position: 'outer',
              fontSize: 28,
            },
          },
          // hoverAnimation: false,
          data: this.pieData,
        },
      ],
    };
    this.echartsObj.setOption(option);
  }

  // 改变选中tab
  private changeTab(val: number, item: any) {
    this.currentTab = val;
    this.searchData.type = item;
    this.searchData.nowPage = 1;
    this.searchData.keyWord = '';
    this.getSiteList();
  }

  // 关键字搜索
  private serach(value: any) {
    if (this.searchData.keyWord === value) {
      return ;
    }
    this.searchData.nowPage = 1;
    this.searchData.keyWord = value;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getSiteList();
    }, 800);
  }

  // 分页点击
  private handleCurrentChange(val: number) {
    this.searchData.nowPage = val;
    this.getSiteList(false);
  }
  // 列表点击
  private openProp(id: any) {
    this.activeIndex = id;
    this.getComponent().locate('water', 'id', id);
  }
  // 打开图表弹窗
  private openDialog() {
    this.dialogVisible = true;
    const pieLegendList = this.pieData.map((item) => item.name);
    this.$nextTick(() => {
      this.renderEcharts(pieLegendList);
    });
  }
}
</script>

<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';

.water-monitor-panel {
  .el-scrollbar__thumb {
    background-color: rgba(0, 0, 0, 0.7);
    &:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
  .el-dialog__wrapper {
    width: 1920px!important;
  }
  .el-dialog {
    background: transparent;
    box-shadow: none;
  }
  .el-dialog__body {
    background: url('@{imgPath}/centerBg-.png') no-repeat center / 100% 100%;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 10px;
  }
  .el-dialog__header {
    background: url('@{imgPath}/topbg-.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }
  .el-dialog__footer {
    background: url('@{imgPath}/botBg-.png') no-repeat;
    background-size: 100% 100%;
    width: 105.3%;
    height: 38px;
  }
  .el-dialog__title {
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.2);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
  }
  .el-dialog__headerbtn {
    background: url('@{imgPath}/closeBtn.png') no-repeat;
    background-size: 100% 100%;
    width: 86px;
    height: 41px;
    background-size: 100% 100%;
    right: -30px;
    top: 3px;
    &:hover {
      background: url('@{imgPath}/closeHover.png') no-repeat;
      background-size: 100% 100%;
    }
    .el-dialog__close {
      display: none;
      &:hover {
        color: transparent;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
// @imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
@panel-padding: 10px;
.c-sky {
  color: #28DBEE;
}
.c-orange {
  color: #EAC60D;
}
.c-tomato {
  color: #FA6400;
}
.c-red {
  color: #D90C0C;
}
.water-monitor-panel {
  .waterDialog_word {
    width: 93%;
    margin-left: 3%;
    .spanDot {
      margin-left: 20px;
      margin-top: 15px;
      display: inline-block;
    }
    background: #091120;
    border: 1px solid #2b5461;
    border-radius: 8px;
    margin-top: 30px;
    font-size: 20px;
    color: #8de5eb;
    .redWord {
      color: #abbfcb;
    }
  }
  .count-container {
    width: 94%;
    margin: 0 auto;
    .echarts {
      // padding: 28px @panel-padding 0;
      height: 350px;
    }
  }
  .nodata {
    height: 463px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-scrollbar {
    height: 463px;
  }
  .updateTime {
    color: #abbfcb;
    position: absolute;
    right: 0px;
    margin-right: 20px;
    font-size: 20px;
  }
}
</style>
