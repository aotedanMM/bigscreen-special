<template>
  <!-- 水库面板 -->
  <div class="panelPublicDefault water-monitor-panel">
    <div class="panelPublicDefault_hd">
      <!-- ({{ count }}) -->
      <span class="title-panel">水库监测</span>
    </div>
    <!-- <div class="title-line"></div> -->
    <!-- 数据统计 -->
    <div class="panelPublicDefault_bd">
      <!-- <div class="count-container"> -->
      <div class="statisticList">
        <div
          v-for="(item, index) in resevoirType"
          :key="index"
          class="statisticList_li f-tit-h2"
          :class="item.checked ? 'checkSty' : ''"
          @click="changeTab(item)"
        >
          <!-- :class="{ checkSty: currentTab === 0 }" -->
          <span>{{ item.name }}</span>
          <div>
            <span class="statisticList_li_textWarning f-number">{{
              item.num || 0
            }}</span
            >个
          </div>
        </div>
      </div>
      <div class="statisticList-title">
        <!-- <span class="f-tit-h2"> 水库列表 </span> -->
        <!-- 预警信息报告按钮 -->
        <span
          class="reportIcon"
          @click="openDialogWarning"
          title="预警信息报告"
          style="right:190px;"
        ></span>
        <span
          class="echartIcon"
          @click="openDialog"
          title="水库监测点趋势分析"
        ></span>
      </div>
      <div class="riverSelect">
        <!-- 区市下拉 -->
        <!-- <div>
          <Select
            :selectdata="cityCodeList"
            @select="changeCity"
            :selectedtitle="currentCity"
          ></Select>
        </div> -->

        <!-- 乡镇下拉 -->
        <!-- <div>
          <Select
            :selectdata="townCodeList"
            @select="changeTown"
            :selectedtitle="currentTown"
          ></Select>
        </div> -->
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
      <!-- <el-input
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
      </el-input> -->
      <!-- 搜索 end-->
      <!-- <div class="list">
        <div class="nodata" v-if="!siteList.length">
          <img src="../../../../assets/img/default/panel/noData.png" />
        </div>
        <div v-else>
          <el-scrollbar style="height:100%">
            <ul class="listBoxSingle">
              <li
                class="f-txt-com listBoxSingle_li"
                :class="{ checkSty: activeIndex === item.id }"
                v-for="item in siteList"
                :key="item.index"
                @click="openProp(item.id)"
              >
                <div>
                  <p class="teamName">{{ item.name }}</p>
                  <p style="display: flex;justify-content: space-between;">
                    <span>
                      <span class="title">水位：</span>
                      <span v-if="item.waterLevel === '满库'">{{
                        item.waterLevel
                      }}</span>
                      <span v-else>{{
                        item.waterLevel || item.waterLevel == 0
                          ? Number(item.waterLevel).toFixed(1) + 'm'
                          : '暂无数据'
                      }}</span>
                    </span>
                    <span class="level"
                      >水势：<span>{{ item.trend }}</span></span
                    >
                  </p>
                </div>
                <div class="teamDistance">
                  <span class="level"><span></span></span>
                  <span
                    :class="[
                      { 'c-sky': item.warning === '超汛限' },
                      {
                        'c-orange':
                          item.warning === '超正常' ||
                          item.warning === '超警戒',
                      },
                      {
                        'c-tomato':
                          item.warning === '超设计' ||
                          item.warning === '超保证',
                      },
                      { 'c-red': item.warning === '超历史最高' },
                    ]"
                    >{{ item.warning }}</span
                  >
                </div> -->

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

      <!-- </li>
            </ul>
            <div class="pagination">
              <el-pagination
                class="constomMyElPage"
                small
                :pager-count="5"
                :current-page.sync="searchData.nowPage"
                @current-change="handleCurrentChange"
                :page-size="searchData.pageSize"
                layout="prev, pager, next, total"
                :total="total"
              ></el-pagination>
            </div>
          </el-scrollbar>
        </div>
      </div> -->
    </div>
    <!-- 预警信息报告 -->
    <div class="warningReport">
      <WarningReport
        v-if="dialogVisibleWarning"
        :visible.sync="dialogVisibleWarning"
        :title="title"
        :propdata="propdata"
        :lineHead="lineHead"
        :searchData="searchData"
      ></WarningReport>
    </div>
    <!-- 图表弹窗 -->
    <el-dialog
      title="水库监测点趋势分析"
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
            {{
              maxWaterData.outWater ? maxWaterData.outWater + 'm' : '0m'
            }}</span
          ></span
        >

        <div class="count-container">
          <div class="echarts" ref="pieEcharts"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- <ReservoirPopup v-if="resevoirPopupShow" class="ReservoirPopup"></ReservoirPopup> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { waterSituationServer } from '@/api/feature/monitorwarning/installServer';
// import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import ReservoirPopup from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirPopup.vue'; // 水库详情
// import Select from './Select.vue';
import { districtServer } from '@/api/installServer';
import { nomalLeftServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import WarningReport from './WarningReport.vue';
/**
 * 监测预警
 */
@Component({
  name: 'ReservoirMonitor',
  components: {
    ReservoirPopup,
    WarningReport,
    // Select,
  },
})
export default class ReservoirMonitor extends Vue {
  // 接收 检测总数
  @Prop() private count!: number;
  // private resevoirPopupShow: boolean = false;
  // 区市下拉
  private rootDistrictCode: any = publishObjectPath.value.district.root;
  private cityCodeList: any = [
    {
      shortname: '全部市区',
      districtcode: this.rootDistrictCode,
      longitude: '121.37990',
      latitude: '37.53560',
    },
  ];
  //
  private currentCity: any = this.cityCodeList[0].shortname;
  private currentCityCode: any = this.cityCodeList[0].districtcode;
  // 乡镇下拉
  private townCodeList: any = [
    {
      shortname: '',
      districtcode: '',
    },
  ];
  private currentTown: any = '全部乡镇';
  private currentTownCode: any = this.townCodeList[0].code;
  // 水库类型
  private resevoirType: any = [
    {
      name: '全部',
      num: '',
      key: 'totalNum',
      type: '',
      checked: false,
    },
    {
      name: '告警水库',
      num: '',
      key: 'warningNum',
      type: 'warning',
      checked: false,
    },
    {
      name: '大型水库',
      num: '',
      key: 'bigReservoirNum',
      type: 'bigReservoir',
      checked: false,
    },
    {
      name: '中型水库',
      num: '',
      key: 'middleReservoirNum',
      type: 'middleReservoir',
      checked: false,
    },
    {
      name: '小（1）型头顶库',
      num: '',
      key: 'smallOneTopReservoirYesNum',
      type: 'smallOneTopReservoir',
      checked: false,
    },
    {
      name: '小（1）型非头顶库',
      num: '',
      key: 'smallOneTopReservoirNoNum',
      type: 'smallOneReservoir',
      checked: false,
    },
    {
      name: '小（2）型头顶库',
      num: '',
      key: 'smallTwoTopReservoirYesNum',
      type: 'smallTwoTopReservoir',
      checked: false,
    },
    {
      name: '小（2）型非头顶库',
      num: '',
      key: 'smallTwoTopReservoirNoNum',
      type: 'smallTwoReservoir',
      checked: false,
    },
  ];
  // 选中的
  // private resevoirTypeIndex: any = 0;

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
    type: [{ type: 'warning' }],
    districtCode: '',
    townCode: '',
  };
  private maxWaterData: any = {}; // 最大涨势站点信息

  // dailog
  private dialogVisible: boolean = false;
  // 预警信息报告弹窗
  private dialogVisibleWarning: boolean = false;
  private title: any = '水库监测预警';
  private lineHead = [
    { name: '全市水库：', value: '0', unit: '座', key: 'total' },
    { name: '满库水库：', value: '0', unit: '座', key: 'reservoirWarnNum' },
    { name: '更新时间：', value: '', unit: '', key: 'updateTime' },
  ];
  private propdata = {
    nowPage: 1,
    pageSize: 10,
    total: 0,
    title: '',
    config: [
      {
        type: 'string',
        label: '水库名称',
        width: '/',
        prop: 'name',
      },
      {
        type: 'string',
        label: '所在区县市',
        width: '/',
        prop: 'belongCounty',
      },
      {
        type: 'string',
        label: '总库容（万m²）',
        width: '/',
        prop: 'totaltopacity',
      },
      {
        type: 'string',
        label: '兴利库容（万m²）',
        width: '240',
        prop: 'regulatstopacity',
      },
      {
        type: 'string',
        label: '汛限库容（万m²）',
        width: '240',
        prop: 'floodstopacity',
      },
      {
        type: 'string',
        label: '汛限水位（m）',
        width: '/',
        prop: 'fldCtrlWaterLevel',
      },
      {
        type: 'string',
        label: '是否达到汛限水位',
        width: '/',
        prop: 'isOver',
      },
      {
        type: 'string',
        label: '水库类型',
        width: '/',
        prop: 'grade',
      },
    ],
    data: [],
  };
  // 分页
  private total: any = 0;

  // 列表选中的项
  private activeIndex: any = -1;

  // 延时搜索
  private timer: any = '';

  // 弹框模板
  // private popUpTemplate = new renderpopUpTemplate();

  private showJsl1(val: any) {
    // const data = {
    //   key: 'Reservoir',
    //   isShow: true,
    // };
    // this.$store.dispatch('configModel/updateLegendItem', data);
    this.$store.commit('mapTools/addSelectedLayer', {
      id: val,
      name: '水库测站',
      play: false,
      legend: { component: val },
    });
  }
  @Watch('$store.state.dataFilterControl.filter')
  private closePopReservoirList(val: any) { // 周边查询面板打开时关闭水库列表
    if (this.$store.state.mapTools.nearbyQueryVisible && this.$store.state.dataFilterControl.filter.geometry) {
      this.resevoirType.forEach((item: any) => {
        item.checked = false;
      });
      // 销毁 水库图例
      this.$store.commit('mapTools/removeSelectedLayer', {
            id: 'normalReservoir',
          });
      const params = {
        // 关闭列表
        isShow: false,
        type: null,
        name: '',
      };
      this.$store.commit('mapTools/changeShowReservoirList', params);
    }
  }
  private created() {
    this.getCountData();
    this.getWaterLevel();
    // this.getSiteList();
    this.getMaxWaterInfo();
    this.showJsl1('normalReservoir'); // 初始new 水库图例
  }

  private mounted() {
    // this.city();
    // this.town(this.cityCodeList[0]);
    // this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    // this.getComponent().load();
    this.changeTab(this.resevoirType[1]);
    // 清空选中
    this.messsageBus.on('colseReservoirList', () => {
      this.resevoirType.forEach((v: any) => {
        v.checked = false;
      });
    });
  }

  // 离开页面清理地图
  private beforeDestroy() {
    // this.getComponent().removeResource('water');
    // this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    // this.getComponent().unload();
    // clearTimeout(this.timer); // 清除延时搜索
    this.$store.commit('mapTools/removeSelectedLayer', {
          id: 'normalReservoir',
        });
    const params = {
      // 关闭列表
      isShow: false,
      type: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowReservoirList', params);
  }

  // // 获取地图功能
  // private getComponent() {
  //   const factory = this.$ioc.resolve('GISFactory-map');
  //   const component = factory.monitorWarningFactory.getComponent(
  //     'WindWaterRainWork',
  //   );
  //   return component;
  // }

  // // 地图定点回调
  // private popupData(event: any) {
  //   if (!event.type && event.featureType) {
  //     event.type = event.featureType;
  //     const eventType = event.featureType;
  //   }
  //   const param = {
  //     that: this,
  //     popupId: 'popup', // 监听id，必须
  //     moduleTypeID: 'waterMonitor',
  //     styleObj: {
  //       // 选填
  //       'margin-bottom': '66px',
  //       'margin-left': '-205px',
  //     },
  //   };
  //   if (!event.data.waterLevel || event.data.waterLevel === '满库') {
  //     event.type = 'reservoirBrief'
  //   }
  //     this.popUpTemplate.getParams(param);
  //     this.popUpTemplate.onShowPopup(event);
  //   // }
  // }

  // 展示地图定点
  // private updateGIS(opts: any = {}) {
  //   //  移除图层
  //   this.getComponent().removeResource('water');
  //   //  加载图层
  //   this.getComponent().addResource_Water(opts);
  // }
  // 时间格式化
  private dateFormat(fmt: any, date: any) {
    let ret;
    const opt: any = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString(), // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (const k of Object.keys(opt)) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
        );
      }
    }
    return fmt;
  }
  // 获取河道水库统计数据
  private async getCountData() {
    const res: any = await waterSituationServer.getCurrentReservoirInfo({});
    this.countData = res.data.data;
    this.countData.updateTime = this.dateFormat('YYYY-mm-dd', new Date());
    this.resevoirType.map((v: any) => {
      Object.keys(this.countData).map((key: any) => {
        if (v.key === key) {
          v.num = this.countData[key];
        }
      });
    });
  }
  // 获取最大涨势站点信息
  private async getMaxWaterInfo() {
    const res: any = await waterSituationServer.getMaxReservoirInfo({});
    this.maxWaterData = res.data.data;
  }

  // 获取水位统计数据
  private async getWaterLevel() {
    const res: any = await waterSituationServer.getStat({});
    this.pieData = [
      { value: res.data.data.increase, name: '涨' },
      { value: res.data.data.stable, name: '平' },
      { value: res.data.data.decrease, name: '落' },
    ];
    this.initPieData();
  }

  // // 获取监测点列表数据
  // private async getSiteList(flag: boolean = true) {
  //   const res: any = await waterSituationServer.getStationsList(
  //     this.searchData,
  //   );
  //   this.siteList = res.data;
  //   this.total = res.total;
  //   if (flag) {
  //     this.updateGIS({
  //       type: this.searchData.type,
  //       keyWord: this.searchData.keyWord,
  //       districtCode: this.searchData.districtCode,
  //       townCode: this.searchData.townCode,
  //     });
  //   }
  // }

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
              formatter: '{b}:{d}%',
              fontSize: 26,
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
  private changeTab(item: any) {
    // this.resevoirTypeIndex = index;
    // totalNum
    // warningNum
    if (item.type === 'warning' || !item.type) {
      if (item.checked) {
        item.checked = false;
      } else {
        this.resevoirType.forEach((v: any) => {
          v.checked = false;
        });
        item.checked = true;
      }
    } else {
      this.resevoirType[0].checked = false;
      this.resevoirType[1].checked = false;
      item.checked = !item.checked;
    }
    this.searchData.type = this.resevoirType.filter((v: any) => {
      return v.checked;
    });
    if (this.searchData.type.length === 0) {
      // this.resevoirType[0].checked = true;
      const params = {
        isShow: false,
      };
      this.$store.commit('mapTools/changeShowReservoirList', params);
      return;
    }
    this.searchData.nowPage = 1;
    this.searchData.keyWord = '';
    // this.getSiteList();
    const params1 = {
      isShow: true,
      type: JSON.parse(JSON.stringify(this.searchData.type)),
    };
    this.$store.commit('mapTools/changeShowReservoirList', params1);

    // 水库各种图例
    // switch (item.type) {
    //   case '':
    //     this.showJsl1('allReservoir');
    //     break;
    //   case 'warning':
    //     this.showJsl1('warning');
    //     break;
    //   case 'bigReservoir':
    //     this.showJsl1('bigReservoir');
    //     break;
    //   case 'middleReservoir':
    //     this.showJsl1('middleReservoir');
    //     break;
    //   case 'smallOneTopReservoir':
    //   case 'smallTwoTopReservoir':
    //     this.showJsl1('smallOneTopReservoir');
    //     break;
    //   case 'smallOneReservoir':
    //   case 'smallTwoReservoir':
    //     this.showJsl1('smallOneReservoir');
    //     break;
    //   default :
    //     return false;
    // }
  }

  // 关键字搜索
  // private serach(value: any) {
  //   if (this.searchData.keyWord === value) {
  //     return;
  //   }
  //   this.searchData.nowPage = 1;
  //   this.searchData.keyWord = value;
  //   if (this.timer) {
  //     clearTimeout(this.timer);
  //   }
  //   this.timer = setTimeout(() => {
  //     this.getSiteList();
  //   }, 800);
  // }

  // 分页点击
  // private handleCurrentChange(val: number) {
  //   this.searchData.nowPage = val;
  //   this.getSiteList(false);
  // }
  // 列表点击
  // private openProp(id: any) {
  //   this.activeIndex = id;
  //   // this.resevoirPopupShow = true;
  //   this.getComponent().locate('water', 'id', id);
  // }
  // 打开图表弹窗
  private openDialog() {
    this.dialogVisible = true;
    const pieLegendList = this.pieData.map((item) => item.name);
    this.$nextTick(() => {
      this.renderEcharts(pieLegendList);
    });
  }

  // change city
  // private changeCity(item: any, index: any) {
  //   // this.activeIndex = index;
  //   this.currentCity = item.name;
  //   this.currentCityCode = item.gbCode;
  //   this.searchData.districtCode =
  //     item.gbCode === this.rootDistrictCode ? '' : item.gbCode;
  //   this.searchData.townCode = '';
  //   this.town(item);
  //   this.currentTown = '全部乡镇';
  //   // this.inputValue = '';
  //   // this.searchData.keyWord = '';
  //   this.getSiteList();
  // }
  // change Town
  // private changeTown(item: any, index: any) {
  //   // this.activeIndexTown = index;
  //   this.currentTown = item.name;
  //   this.currentTownCode = item.districtcode;
  //   // this.inputValue = '';
  //   // this.searchData.keyWord = '';
  //   this.searchData.townCode = item.tag.adcode;
  //   if (item.name === '全部乡镇') {
  //     this.searchData.districtCode =
  //       this.currentCityCode === this.rootDistrictCode
  //         ? ''
  //         : this.currentCityCode;
  //   }
  //   this.getSiteList();
  // }
  // 行政区划
  // private city() {
  //   // 获取城市信息
  //   nomalLeftServer.getCitySelected().then((res: any) => {
  //     if (!res || !res.data) {
  //       return;
  //     }
  //     const allObj: any = {
  //       gbCode: this.rootDistrictCode,
  //       name: '全部市区',
  //       longitude: '121.37990',
  //       latitude: '37.53560',
  //     };
  //     res.data.unshift(allObj);
  //     this.cityCodeList = res.data;
  //   });
  // }
  // 乡镇
  // private town(item: any) {
  //   districtServer
  //     .getTownListByCounty({
  //       code: item.districtcode || item.gbCode,
  //       point: [item.longitude, item.latitude],
  //     })
  //     .then((data: any) => {
  //       const allObj: any = {
  //         gbCode: '',
  //         tag: {
  //           adcode: '',
  //         },
  //         name: '全部乡镇',
  //       };
  //       data.data.unshift(allObj);
  //       this.townCodeList = data.data;
  //       this.townCodeList.map((v: any, index: any) => {
  //         if (v.name) {
  //           v.shortname = v.name;
  //         }
  //       });
  //     });
  // }
  // 打开预警报告弹窗 列表
  private async getDialogDetail() {
    const obj = {
      nowPage: this.propdata.nowPage,
      pageSize: 10,
    };
    const res: any = await waterSituationServer.getReservoirWarningInfo(obj);
    console.log(res.data.list, 'res');
    this.$set(this.propdata, 'data', res.data.list);
    this.propdata.total = res.data.total;
  }
  // 打开预警报告弹窗
  private async openDialogWarning() {
    const params = {
      // 关闭 列表
      isShow: false,
      type: null,
      name: '',
    };
    this.$store.commit('mapTools/changeShowReservoirList', params);
    this.dialogVisibleWarning = true;
    this.getDialogDetail();

    const statRes: any = await waterSituationServer.getReservoirWarningStatInfo();
    console.log(statRes.data.data, 'statRes');
    this.lineHead.map((item: any) => {
      Object.keys(statRes.data.data).map((key: any) => {
        if (key === item.key) {
          item.value = statRes.data.data[key];
        }
      });
    });
  }

  //  预警报告弹窗 分页
  private handlePageChange(val: number) {
    this.propdata.nowPage = val;
    this.getDialogDetail();
  }
}
</script>

<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
.water-monitor-panel {
  position: relative;

  .ReservoirPopup {
    position: absolute;
    top: -80px;
    left: -75px;
  }
  .el-scrollbar__thumb {
    background-color: rgba(0, 0, 0, 0.7);
    &:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
  .el-dialog__wrapper {
    width: 1920px !important;
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
.panelPublicDefault {
  margin-bottom: 20px;
  height: calc(100% - 50px) !important;
}
.riverSelect {
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  div + div {
    margin-left: 30px;
  }
}
.c-sky {
  color: #28dbee;
}
.c-orange {
  color: #eac60d;
}
.c-tomato {
  color: #fa6400;
}
.c-red {
  color: #d90c0c;
}
.water-monitor-panel {
  //  .echartIcon {
  //   float: right;
  //   width: 32px;
  //   height: 32px;
  //   background: url('../../../../assets/img/monitorWarning/echart.png')
  //     no-repeat 0 0;
  //   background-size: 100% 100%;
  //   margin-right: 155px;
  //   cursor: pointer;
  //   margin-top: 3px;
  // }
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
  .list {
    // height: calc(100% - 438px);
    height: calc(100% - 625px);
    > div {
      height: 100%;
    }
  }
  .nodata {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-scrollbar {
    height: calc(100% - 20px);
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
