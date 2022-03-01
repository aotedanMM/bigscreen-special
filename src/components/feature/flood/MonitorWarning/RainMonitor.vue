<template>
  <!-- 雨情监测 -->
  <div class="panelPublicDefault rainCont">
    <div class="panelPublicDefault_hd">
      <span class="title-panel">
        雨情监测
        <!-- ({{ count }}) -->
      </span>
    </div>
    <div class="panelPublicDefault_bd">
      <ul class="statisticList">
        <li
          class="statisticList_li f-tit-h2"
          v-for="(item, index) in rainType"
          :key="index"
          @click="changeRainType(item, index)"
          :class="rainTypeIndex == index ? 'checkSty' : ''"
        >
          <span
            ><span class="listName">{{ item.rainTypeName }}</span>
            <span class="rainTooltip">{{ item.tip }}</span></span
          >
          <span>
            <span class="statisticList_li_textWarning f-number">{{
              item.rainNum || 0
            }}</span
            >处
          </span>
        </li>
      </ul>
      <div class="statisticList-title">
        <!-- <span class="f-tit-h2"> 雨量站列表 </span> -->
        <!-- 预警信息报告按钮 -->
        <span
          v-if="isShowModal"
          class="reportIcon"
          @click="openDialogWarning"
          title="预警信息报告"
          style="right:190px;"
        ></span>
        <span
          v-if="isShowModal"
          class="echartIcon"
          @click="openDialog"
          title="累计降水量分析"
        ></span>
      </div>
      <!-- <div class="riverSelect"> -->
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
        </div>
      </div> -->
      <!-- 搜索 -->
      <!-- <div class="list">
        <el-input
          class="csmMyInput"
          type="text"
          v-model.trim="rainSearchValue"
          @input="searchTable(rainSearchValue)"
        >
          <i
            slot="suffix"
            class="iconSelf_search"
            style="cursor:pointer;"
            @click="searchTable(rainSearchValue)"
          ></i>
        </el-input>
        <div
          class="nodata"
          v-if="!tableData.length"
          :class="{ nodataleft: !isShowModal }"
        >
          <img
            src="../../../../assets/img/default/panel/noData.png"
            v-if="isShowModal"
          />
          <p v-else class="text">暂无数据</p>
        </div>
        <div class="listBox" v-else :class="{ listBoxLeft: !isShowModal }">
          <el-scrollbar>
            <ul class="listBoxSingle">
              <li
                class="f-txt-com listBoxSingle_li"
                :class="{ checkSty: listIndex === item.id }"
                v-for="(item, index) in tableData"
                :key="item.id"
                @click="openProp(item.id, index)"
              >
                <p class="teamName">{{ item.name }}</p>
                <p class="teamDistance">
                  <span>
                    <span v-if="changeTitle" class="title">
                      24H累计降水量:</span
                    >
                    <span v-if="!changeTitle" class="title">降雨量:</span>
                    <span>{{
                      item.rainfall || item.rainfall == 0
                        ? item.rainfall + 'mm'
                        : '- -'
                    }}</span>
                  </span>
                  <span
                    class="level"
                    :class="[
                      { red: item.level == '特大暴雨' },
                      { orange: item.level == '大暴雨' },
                      { yellow: item.level == '暴雨' },
                    ]"
                  >
                    {{ changeTitle ? item.level : '' }}
                  </span>
                </p>
              </li>
            </ul>
            <div class="pagination">
              <el-pagination
                class="constomMyElPage"
                small
                :pager-count="5"
                :current-page.sync="searchDto.nowPage"
                @current-change="handleCurrentChange"
                :page-size="searchDto.pageSize"
                layout="prev, pager, next, total"
                :total="total"
              ></el-pagination>
            </div>
          </el-scrollbar>
        </div>
        <div class="rainSearchTableBox"></div>
      </div> -->
    </div>
    <!-- 预警信息报告 -->
    <WarningReport
      v-show="dialogVisibleWarning"
      :visible.sync="dialogVisibleWarning"
      :title="title"
      :propdata="propdata"
      :lineHead="lineHead"
      :searchDto="searchDto"
      @changeHight="changeHight"
    ></WarningReport>
    <!-- 图表弹窗 -->
    <el-dialog
      title="累计降水量分析"
      v-if="dialogType === 'analysisChart' && dialogVisible"
      :visible.sync="dialogVisible"
      width="47%"
      height="300px"
      :modal-append-to-body="true"
      top="10%"
      :modal="false"
      class="dialogMr"
    >
      <!-- <span class='dialog_title'>累计降水量分析</span> <br /> -->
      <div style="display:flex">
        <!-- 图表 -->
        <div class="rainCont_echart">
          <div class="echartTitle">
            <ul class="rain_checkTime">
              <li
                v-for="(item, index) in checkTime"
                :key="index"
                @click="changeEchart(item, index)"
                :class="activeIndex == index ? 'active' : ''"
              >
                {{ item }}
              </li>
            </ul>
            <span class="updateTime"
              >更新时间：<span>{{
                dateFormat('YYYY-mm-dd HH:MM:SS', new Date())
              }}</span></span
            >
            <!-- rainWebData.updateTime -->
            <div class="btnBox">
              <span
                :class="[
                  'chartBtn',
                  { active: dialogType === 'analysisChart' },
                ]"
                @click="tabDialog('analysisChart')"
              ></span>
              <span class="line"></span>
              <span
                :class="[
                  'tableBtn',
                  { active: dialogType === 'statisticalTable' },
                ]"
                @click="tabDialog('statisticalTable')"
              ></span>
            </div>
          </div>
          <div class="echartContent">
            <div class="rain_checkValue" v-if="rainWebData">
              <!-- <div>
                <span :class="originTime == '24H' ? 'hidden' : ''"
                  >超阀值监测点：<span
                    >{{ rainWebData.overThresholdNum }}个</span
                  ></span
                >&nbsp;&nbsp;
                <span
                >更新时间：<span>{{ rainWebData.updateTime }}</span></span
              >
              </div> -->
              <div>
                <span
                  >最大监测站点：<span class="redWord">{{
                    rainWebData.maxRainfallStation
                  }}</span></span
                >&nbsp;&nbsp;
                <span
                  >{{ originTime }}降雨量：
                  <span class="redWord">
                    {{ rainWebData.rainfall }}mm</span
                  ></span
                >
              </div>
            </div>
            <!-- echart图 -->
            <div>
              <div :id="echartsID" style="width: 100%;height:260px;"></div>
            </div>
          </div>
        </div>
        <!-- <el-scrollbar style="height: 270px" class="rain_list_addr">
          <ul v-if="rainDistrictList">
            <li v-for="(item, index) in rainDistrictList" :key="index">
              {{ item.name }}
            </li>
            <div class="clearfix"></div>
          </ul>
        </el-scrollbar> -->
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 降雨量统计表格 -->
    <el-dialog
      class="statisticalTable"
      title="累计降雨量统计表"
      v-if="dialogType === 'statisticalTable' && dialogVisible"
      :visible.sync="dialogVisible"
      width="1920px"
      :modal-append-to-body="false"
      top="74px"
      :modal="false"
      @close="changeHight"
    >
      <!-- @open="stopSrcoll()"
      @close="openSrcoll()" -->
      <!-- <span class='dialog_title'>累计降水量分析</span> <br /> -->
      <!-- <span class="updateTime"
        >更新时间：<span>{{ rainWebData.updateTime }}</span></span
      > -->
      <div>
        <div class="tableContent">
          <div class="bg-box" v-if="!loadingState">
            <div class="title">
              <!-- <span class="statisticalTime">{{
                `统计时间：${statTime.startTime}——${statTime.endTime}`
              }}</span> -->
              <!-- <span class="statisticalTime">{{
                `统计时间：${dateFormat('mm-dd HH:MM', new Date((new Date).getTime() - 24*60*60*1000))}——${dateFormat('mm-dd HH:MM', new Date())}`
              }}</span> -->
              <el-date-picker
                v-model="rainBytime"
                popper-class="ytDateTimePicker"
                class="ytDateTimePicker"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                :default-time="[startTime, endTime]"
                @change="selectTimeChange"
              >
              </el-date-picker>
              <span class="unit">单位：mm</span>
              <div class="btnBox">
                <span
                  :class="[
                    'chartBtn',
                    { active: dialogType === 'analysisChart' },
                  ]"
                  @click="tabDialog('analysisChart')"
                ></span>
                <span class="line"></span>
                <span
                  :class="[
                    'tableBtn',
                    { active: dialogType === 'statisticalTable' },
                  ]"
                  @click="tabDialog('statisticalTable')"
                ></span>
                <span class="exportBtn" @click="download()"> 导出Excel</span>
              </div>
            </div>
            <div class="rainStatistical">
              <div>
                全市平均：<span>{{
                  statisticalData.wholeCityAvg ||
                  statisticalData.wholeCityAvg === 0
                    ? statisticalData.wholeCityAvg + 'mm'
                    : '--'
                }}</span>
              </div>
              <div>
                入汛以来：<span>{{
                  statisticalData.wholeFloodAvg || statisticalData.wholeFloodAvg
                    ? statisticalData.wholeFloodAvg + 'mm'
                    : '--'
                }}</span>
              </div>
              <div>
                县市区最大：
                <span class="name">{{
                  statisticalData.pacValueMax.name || ''
                }}</span>
                <span>{{
                  statisticalData.pacValueMax.value
                    ? statisticalData.pacValueMax.value + 'mm'
                    : '--'
                }}</span>
              </div>
              <div>
                本年累计：<span>{{
                  statisticalData.wholeYearAvg ||
                  statisticalData.wholeYearAvg === 0
                    ? statisticalData.wholeYearAvg + 'mm'
                    : '--'
                }}</span>
              </div>
            </div>
            <el-scrollbar style="height: 690px">
              <div class="tableBox">
                <div
                  class="nodata"
                  v-if="!statisticalTableData.tableData1.length"
                >
                  <img src="../../../../assets/img/default/panel/noData.png" />
                </div>
                <table
                  v-else
                  v-for="(v, k, i) in statisticalTableData"
                  :key="i"
                >
                  <!-- cellspacing="3" -->
                  <tr>
                    <th>县市区</th>
                    <th>乡镇</th>
                    <th>降水量</th>
                  </tr>
                  <tr v-for="(item, index) in v" :key="index" >
                    <td
                      class="distName"
                      v-if="item.rowspan > 0"
                      :rowspan="item.rowspan"
                    >
                      {{ item.distName }}
                    </td>
                    <td class="townName">{{ item.townName }}</td>
                    <td class="rainAvg">
                      {{ item.rainAvg ? item.rainAvg : 0 }}
                    </td>
                  </tr>
                </table>
              </div>
            </el-scrollbar>
          </div>
          <div v-else class="loading_box">
            <div class="loading"></div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { monitorWarningServer } from '@/api/feature/monitorwarning/installServer';
import { rainSituationServer } from '@/api/feature/monitorwarning/installServer';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import Select from './Select.vue';
import { districtServer } from '@/api/installServer';
import { nomalLeftServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import WarningReport from './WarningReport.vue';
//
/**
 * 监测预警
 */
@Component({
  name: 'RainMonitor',
  components: {
    Select,
    WarningReport,
  },
  mixins: [MapCommon],
})
export default class RainMonitor extends Vue {
  // 接收 检测总数
  @Prop() private count!: number;
  @Prop() private isShowModal: any;
  private loadingState: boolean = false;
  private rootDistrictCode: any = publishObjectPath.value.district.root;
  // 区市下拉
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
  private changeTitle: boolean = false;
  private dialogVisible: boolean = false;
  private dialogVisibleWarning: boolean = false;
  private heightItem: any = null; // 当前选中元素
  private rainDistrictList: any = [];
  private chartAddrData: any = []; // 统计表
  private chartAddrDataValue: any = [];
  private originTime: any = '24H';
  private activeIndex: any = 0;
  private checkTime: any = ['24H', '48H', '近一周', '近一月'];
  private rainTypeIndex: any = -1;
  private rainLevel: any = '';
  private nowTime: any = new Date();
  private rainWebData: any = {
    overThresholdNum: '',
    maxRainfallStation: '',
    rainfall: '',
    totalNum: '',
    rainNum: '',
    heavyRainNum: '',
    superRainNum: '',
    updateTime: '',
  };

  private rainType: any = [
    { rainTypeName: '全部雨量站', rainNum: '', level: '', key: 'totalNum' },
    // {
    //   rainTypeName: '橙色告警',
    //   rainNum: '',
    //   level: 'orangeWarning',
    //   key: 'orangeWarningNum',
    //   tip: '累计降雨量1h≧30mm或2h≧50mm',
    // },
    // {
    //   rainTypeName: '红色告警',
    //   rainNum: '',
    //   level: 'redWarning',
    //   key: 'redWarningNum',
    //   tip: '累计降雨量1h≧50mm或3h≧100mm',
    // },
    {
      rainTypeName: '1h≧30mm',
      rainNum: '',
      level: 'sum1h',
      key: 'sum1hNum',
      tip: '',
    },
    {
      rainTypeName: '2h≧50mm',
      rainNum: '',
      level: 'sum2h',
      key: 'sum2hNum',
      tip: '',
    },
    {
      rainTypeName: '3h≧100mm',
      rainNum: '',
      level: 'sum3h',
      key: 'sum3hNum',
      tip: '',
    },
    {
      rainTypeName: '暴雨',
      rainNum: '',
      level: 'rain',
      key: 'rainNum',
      tip: '累计降雨量24h≧50mm且<100mm',
    },
    {
      rainTypeName: '大暴雨',
      rainNum: '',
      level: 'heavyRain',
      key: 'heavyRainNum',
      tip: '累计降雨量24h≧100mm且<250mm',
    },
    {
      rainTypeName: '特大暴雨',
      rainNum: '',
      level: 'superRain',
      key: 'superRainNum',
      tip: '累计降雨量24h≧250mm',
    },
  ];
  private searchDto: any = {
    // dataTime: '2020-05-09T02:24:20.767Z',
    type: 1,
    keyWord: '',
    level: '',
    nowPage: 1,
    pageSize: 10,
    name: '',
    districtCode: '',
    townCode: '',
    // geometry: this.isShowModal
    //   ? ''
    //   : this.$store.state.eventPushStore.eventLocation.geometry,
  };
  // 预警报告弹窗内容
  private title: any = '雨情监测预警';
  private lineHead = [
    {
      name: '1小时累计降雨量≧30mm站点：',
      value: '0',
      unit: '处',
      key: 'count1h',
    },
    {
      name: '2小时累计降雨量≧50mm站点：',
      value: '0',
      unit: '处',
      key: 'count2h',
    },
    {
      name: '3小时累计降雨量≧100mm站点：',
      value: '0',
      unit: '处',
      key: 'count3h',
    },
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
        label: '站点',
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
        label: '所在乡镇',
        width: '/',
        prop: 'belongTown',
      },
      {
        type: 'string',
        label: '1小时累计降雨量 （mm）',
        width: '350',
        prop: 'sum1h',
      },
      {
        type: 'string',
        label: '2小时累计降雨量 （mm）',
        width: '350',
        prop: 'sum2h',
      },
      {
        type: 'string',
        label: '3小时累计降雨量 （mm）',
        width: '350',
        prop: 'sum3h',
      },
    ],
    data: [],
  };
  private rainEchartObj: any;
  private rainSearchValue: string = '';
  private echartsID =
    'rainEchart' + +new Date() + Math.floor(Math.random() * 1000);
  private tableData: any = []; // 列表数据
  // 列表选中
  private listIndex: any = -1;
  // 分页列表总数
  private total: any = 0;

  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();

  private timer: any = ''; // 延时搜索

  private dialogType: string = 'statisticalTable'; // 分析图 analysisChart  统计表： statisticalTable

  private rainBytime: any = []; // 时间选择器的值
  private pickerMinDate: any = '';
  private startTime: string = '12:00:00'; // 默认开始时间
  private endTime: string = '12:00:00'; // 默认结束时间
  private statisticalTableData: any = {
    tableData1: [],
    tableData2: [],
    tableData3: [],
  };
  private statisticalData: any = {
    pacValueMax: {
      name: '',
      value: '',
    },
    wholeCityAvg: '',
    wholeFloodAvg: '',
    wholeYearAvg: '',
  };
  private pickerOptions = {
    onPick: ({ maxDate, minDate }: any) => {
      this.pickerMinDate = minDate.getTime();
      if (maxDate) {
        this.pickerMinDate = '';
      }
    },
    disabledDate: (time: any) => {
      // 查询时间跨度为3天
      const times = Date.now();
      // if (this.pickerMinDate !== '') {
      //   let one = 2 * 24 * 3600 * 1000
      //   let minTime = this.pickerMinDate - one
      //   let maxTime = this.pickerMinDate + one
      //   if (maxTime > times) {
      //     maxTime = times - 8.64e7
      //   }
      //   return time.getTime() < minTime || time.getTime() > maxTime
      // }
      return time.getTime() >= times;
    },
  };
  private changeHight() {
    this.rainType.forEach((item: any, index: any) => {
      if (this.heightItem.key === item.key) {
        this.rainTypeIndex = index;
      }
    });
    this.changeRainType(this.heightItem, this.rainTypeIndex);
  }

  // 列表点击
  private openProp(id: any, index: any) {
    this.listIndex = id;
    this.getComponent().locate('rain', 'id', id);
  }

  // 分页点击
  private handleCurrentChange(val: number) {
    this.searchDto.nowPage = val;
    this.getStationsList(false);
  }
  // 24H 48H 近一周 近一月 点击切换数据
  private changeEchart(time: any, index: any) {
    this.originTime = time;
    this.activeIndex = index;
    let opt;
    if (time === '24H') {
      opt = 1;
    } else if (time === '48H') {
      opt = 2;
    } else if (time === '近一周') {
      opt = 3;
    } else if (time === '近一月') {
      opt = 4;
    }
    // 点击切换地区
    rainSituationServer.getDistrictStat({ type: opt }).then((res: any) => {
      // this.tableData = res.data;
      // this.rainDistrictList = res.data.data;
      // console.log(res, 'chartAddrData');
      const data = res.data.data;
      this.chartAddrData = data.map((v: any) => v.name);
      this.chartAddrDataValue = data.map((v: any) => v.value);
      // this.rainWebData.rainfall = Math.max(...data.map((v: any) => v.value));
      // this.rainWebData.maxRainfallStation = data.reduce((p: any, v: any) =>
      //   p.value < v.value ? v : p,
      // ).name;
      this.$nextTick(() => {
        this.inintChart();
      });
    });
    // 点击切换获取页面信息
    rainSituationServer.getCurrentInfo({ type: opt }).then((res: any) => {
      this.rainWebData = res.data.data;
    });
  }
  private changeRainType(item: any, index: any) {
    this.heightItem = item;
    this.rainSearchValue = '';
    this.searchDto.keyWord = '';
    this.searchDto.name = '';
    this.rainTypeIndex = index;
    this.searchDto.level = item.level;
    this.searchDto.nowPage = 1;
    this.getStationsList();
    if (
      this.rainTypeIndex === 3 ||
      this.rainTypeIndex === 4 ||
      this.rainTypeIndex === 5
    ) {
      this.changeTitle = true;
    } else {
      this.changeTitle = false;
    }
  }

  private inintChart() {
    const rainEchart = document.getElementById(
      this.echartsID,
    ) as HTMLDivElement;
    if (!rainEchart) {
      return;
    }
    this.rainEchartObj = echarts.init(rainEchart);
    const arr = this.chartAddrDataValue;
    let max = arr[0] * 1;
    for (let i = 1; i < arr.length; i++) {
      const cur: any = arr[i] * 1;
      if (cur > max) {
        max = cur;
      }
    }
    const option = {
      title: {
        text: '\n累\n计\n降\n雨\n量\n',
        subtext: '',
        textStyle: {
          color: '#9e9fae',
          fontSize: 24,
          fontWeight: 400,
        },
        subtextStyle: {
          color: '#9e9fae',
        },
      },
      grid: {
        left: 100,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['', ''],
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          name: '区\n划',
          data: this.chartAddrData,
          axisLabel: {
            inside: false,
            interval: 0,
            rotate: 45,
            fontSize: 20,
            formatter(params: any) {
              let newParamsName = ''; // 最终拼接成的字符串
              const paramsNameNumber = params.length; // 实际标签的个数
              const provideNumber = 4; // 每行能显示的字的个数
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''; // 表示每一次截取的字符串
                  const start = p * provideNumber; // 开始截取的位置
                  const end = start + provideNumber; // 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    tempStr = params.substring(start, end) + '\n';
                  }
                  newParamsName += tempStr; // 最终拼成的字符串
                }
              } else {
                newParamsName = params;
              }
              return newParamsName;
            },
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
              type: 'dotted',
            },
            show: false,
          },
          nameTextStyle: {
            color: '#9e9fae',
            fontSize: 24,
            // padding: max < 10 ? [0, 0, 0, 10] : [0, 0, 0, -10], // 四个数字分别为右下左上
            padding: [0, 0, 0, 30], // 四个数字分别为右下左上
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          // name: (item ? item : '') + '降雨量（ml）',
          // nameRotate: 90,
          name: '（mm）',
          nameRotate: 90,
          nameGap: -60,
          minInterval: 1,
          boundaryGap: [0, 0.1],
          splitNumber: 4,
          nameTextStyle: {
            color: '#9e9fae',
            fontSize: 24,
            padding: [-172, 0, 0, -110], // 四个数字分别为右下左上
          },
          axisLabel: {
            fontSize: 22,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dotted',
            },
          },
        },
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: 25,
          // barGap:'-80%',
          // barCategoryGap:'50%',
          data: this.chartAddrDataValue,
          itemStyle: {
            color: '#61A5E8',
            borderColor: '#00deb7',
            borderType: 'solid',
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0,158,120)',
                },
                {
                  offset: 1,
                  color: 'rgba(0,158,120,.2)',
                },
              ]),
              borderColor: '#00deb7',
              borderType: 'solid',
            },
          },
          markLine: {
            data: [
              {
                type: 'max',
                name: '最大值',
                lineStyle: {
                  normal: {
                    color: 'red', // 这儿设置安全基线颜色
                  },
                },
              },
            ],
          },
        },
      ],
    };

    this.rainEchartObj.setOption(option);
  }

  // 页面统计数据
  private getData() {
    const obj: any = {
      districtCode:
        this.$store.state.dataFilterControl.filter.districtCode === '130400'
          ? ''
          : this.$store.state.dataFilterControl.filter.districtCode,
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      obj.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }

    // const obj = {
    //   geometry: this.searchDto.geometry,
    // };

    rainSituationServer
      .getCurrentInfo(this.isShowModal ? {} : obj)
      .then((res: any) => {
        this.rainWebData = res.data.data;
        this.rainType.map((v: any) => {
          Object.keys(res.data.data).map((key: any) => {
            if (v.key === key) {
              v.rainNum = res.data.data[key];
            }
          });
        });
        // if (!this.rainType[3].rainNum && !this.rainType[2].rainNum) {
        //   this.searchDto.level = 'sum1h';
        //   this.rainTypeIndex = 1;
        //   this.getStationsList();
        // } else if (!this.rainType[3].rainNum) {
        //   this.searchDto.level = 'sum2h';
        //   this.rainTypeIndex = 2;
        //   this.getStationsList();
        // } else {
        //   this.searchDto.level = 'sum3h';
        //   this.rainTypeIndex = 3;
        //   this.getStationsList();
        // }
        this.rainTypeIndex = 0;
        this.getStationsList();
        this.heightItem = this.rainType[this.rainTypeIndex];
      });
  }
  // 初始化 地区数据
  private getStrictData() {
    rainSituationServer.getDistrictStat({ type: 1 }).then((res: any) => {
      this.rainDistrictList = res.data.data;
      const data = res.data.data;
      this.chartAddrData = data.map((v: any) => v.name ? v.name : '');
      this.chartAddrDataValue = data.map((v: any) => v.value);
      this.$nextTick(() => {
        this.inintChart();
      });
    });
  }
  // 列表数据
  private getStationsList(flag: boolean = true) {
    // 如果页面已经关闭
    // if (this.$store.state.mapTools.showRainMonitorList.destroy) {
    //   return;
    // }
    // 打开列表弹窗
    const params: any = {
      isShow: true,
      level: this.searchDto.level,
      filter: {},
      isShowModal: this.isShowModal,
      // geometry: this.searchDto.geometry,
    };
    // if (this.isShowModal === false) {
    params.filter.districtCode =
      this.$store.state.dataFilterControl.filter.districtCode === '130400'
        ? ''
        : this.$store.state.dataFilterControl.filter.districtCode;
    if (this.$store.state.dataFilterControl.filter.geometry) {
      params.filter.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    // }

    this.$store.commit('mapTools/changeShowRainMonitorList', params);
    // if (flag) {
    //   this.getComponent().addResource_Rain({
    //     level: this.searchDto.level,
    //     keyWord: this.searchDto.keyWord,
    //     districtCode: this.searchDto.districtCode,
    //     townCode: this.searchDto.townCode,
    //     geometry: this.searchDto.geometry,
    //   });
    // }
    // rainSituationServer.getStationsList(this.searchDto).then((res: any) => {
    //   this.tableData = res.data;
    //   this.total = res.total;
    //   // console.log(res.total,'res.totalres.total')
    //   // this.rainType[1].rainNum=res.total
    // });
  }
  // 显示 图例
  private showJsl(val: any) {
    // const data = {
    //   key: val,
    //   isShow: true,
    // };
    // this.$store.dispatch('configModel/updateLegendItem', data);
    this.$store.commit('mapTools/addSelectedLayer', {
      id: val,
      name: '雨量站',
      play: false,
      legend: { component: val },
    });
  }
  // 隐藏 图例
  private hideJsl(val: any) {
    const data = {
      key: val,
      isShow: false,
    };
    this.$store.dispatch('configModel/updateLegendItem', data);
  }
  //
  private showLegend(val: any) {
    if (val.visible === true) {
      this.showJsl('RainfallThwartwise');
    } else if (val.visible === false) {
      this.showJsl('RainStation');
    }
  }

  private mounted() {
    const params = {
      isShow: false,
      level: '',
      geometry: '',
      destroy: false,
    };
    this.$store.commit('mapTools/changeShowRainMonitorList', params);
    this.getData(); // 页面数据
    this.getStrictData(); // 统计表  地区数据
    // this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    // this.getComponent().load();
    this.getComponent().on('RainWindLengend', this.showLegend, this);
    this.messsageBus.on('colseRainMonitorList', () => {
     this.rainTypeIndex = -1;
    });
    // 实时刷新
    this.timer = window.setInterval(() => {
      this.getData();
    }, 360000);
  }
  private beforeDestroy() {
    //  清除雨情图层
    // this.getComponent().removeResource('rain');
    // this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    // this.getComponent().unload();
    this.getComponent().off('RainWindLengend', this.showJsl, this);
    clearTimeout(this.timer); // 清除延时搜索
    clearInterval(this.timer); // 清除定时刷新
    this.$store.commit('mapTools/removeSelectedLayer', {id: 'RainfallThwartwise'});
    this.$store.commit('mapTools/removeSelectedLayer', {id: 'RainStation'});
    const params = {
      isShow: false,
      level: '',
      // geometry: '',
      destroy: true,
    };
    this.$store.commit('mapTools/changeShowRainMonitorList', params);
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
  // private popupData(event: any) {
  //   if (!event.type && event.featureType) {
  //     event.type = event.featureType;
  //     const eventType = event.featureType;
  //   }
  //   const param = {
  //     that: this,
  //     popupId: 'popup', // 监听id，必须
  //     moduleTypeID: 'rainMonitor',
  //     styleObj: {
  //       // 选填
  //       'margin-bottom': '66px',
  //       'margin-left': '-205px',
  //     },
  //   };
  //   this.popUpTemplate.getParams(param);
  //   this.popUpTemplate.onShowPopup(event);
  // }
  private searchTable(value: any) {
    if (this.searchDto.name === value) {
      return;
    }
    this.searchDto.name = value;
    this.searchDto.keyWord = value;
    this.searchDto.nowPage = 1;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getStationsList();
    }, 800);
  }

  // 打开预警报告弹窗 列表
  private async getDialogDetail() {
    const obj = {
      nowPage: this.propdata.nowPage,
      pageSize: 10,
    };
    const res: any = await rainSituationServer.getWarningInfo(obj);
    this.$set(this.propdata, 'data', res.data.list);
    this.propdata.total = res.data.total;
  }
  // 打开预警报告弹窗
  private async openDialogWarning() {
    // 当预警报告弹出- 关闭雨情列表弹窗
    const params = {
      isShow: false,
      level: '',
      geometry: '',
      destroy: true,
    };
    this.$store.commit('mapTools/changeShowRainMonitorList', params);

    this.dialogVisibleWarning = true; // 显示预警报告 弹窗
    this.loadingState = true;
    // if (!this.propdata.config || !this.propdata.config.length) {
    //   this.getDialogDetail(); // 获取预警报告列表数据
    // } else {
    //   this.loadingState = false;
    // }
    this.getDialogDetail();

    const statRes: any = await rainSituationServer.getWarningStatInfo();
    console.log(statRes.data.data, 'statRes');
    this.lineHead.map((item: any) => {
      Object.keys(statRes.data.data).map((key: any) => {
        if (key === item.key) {
          item.value = statRes.data.data[key];
        }
      });
    });
  }
  // 打开图表弹窗
  private openDialog() {
        // 当预警报告弹出- 关闭雨情列表弹窗
    const params = {
      isShow: false,
      level: '',
      geometry: '',
      destroy: true,
    };
    this.$store.commit('mapTools/changeShowRainMonitorList', params);
    this.dialogVisible = true;
    this.loadingState = true;
    this.dialogType = 'statisticalTable';
    if (!this.statisticalData.list || !this.statisticalData.list.length) {
      this.getStatTownSum(); // 获取降雨量数据
    } else {
      this.loadingState = false;
    }
    // this.$nextTick(() => {
    //   this.inintChart();
    // });
  }
  private tabDialog(item: any) {
    // 切换降雨量分析和统计表
    this.dialogType = item;
    if (item === 'analysisChart') {
      this.$nextTick(() => {
        this.inintChart();
      });
    }
  }
  private getStatTownSum() {
    // 获取降雨量统计表的数据
    rainSituationServer
      .getStatSum({
        startTime: this.rainBytime ? this.rainBytime[0] : '',
        endTime: this.rainBytime ? this.rainBytime[1] : '',
      })
      .then((res: any) => {
        // const dataInfo: any = {};
        console.log(res, '1312312312');
        // this.statTime.startTime = res.data.data.startTime || '';
        // this.statTime.endTime = res.data.data.endTime || '';
        // if (res.data.data.statInfo && res.data.data.statInfo.length) {
        //   res.data.data.statInfo.forEach((item: any, index: any) => {
        //     const { distName } = item;
        //     if (!dataInfo[distName]) {
        //       dataInfo[distName] = {
        //         distName,
        //         child: [],
        //       };
        //     }
        //     dataInfo[distName].child.push(item.dataList);
        //   });
        // }
        // if (Object.keys(dataInfo).length) {
        //   this.statisticalData = Object.values(dataInfo); // 转换成功的数据
        // }
        if (res.data.data.list.length) {
          this.statisticalData = res.data.data;
          this.statisticalTableData.tableData1 = [];
          this.statisticalTableData.tableData2 = [];
          this.statisticalTableData.tableData3 = [];
          // .sort((a: any, b: any) => {
          //   return b.townList.length - a.townList.length;
          // });
        }
        this.setStatisticalData();
      });
  }
  private setStatisticalData() {
    // 处理降雨量统计表的数据
    this.statisticalData.list.forEach((item: any) => {
      const arr: any = [];
      item.townList.forEach((v: any, i: any) => {
        const obj: any = {
          distName: item.pacName,
          townName: v.townName,
          rainAvg: v.value,
          index: i,
          subTotal: item.townList.length,
          rowspan: 0,
        };
        if (i === 0) {
          obj.rowspan = item.townList.length > 1 ? item.townList.length : 1;
        }
        arr.push(obj);
      });
      const num1: number = this.statisticalTableData.tableData1.length;
      const num2: number = this.statisticalTableData.tableData2.length;
      const num3: number = this.statisticalTableData.tableData3.length;
      if (num1 <= num2 && num1 <= num3) {
        this.statisticalTableData.tableData1.push(...arr);
      } else if (num2 <= num1 && num2 <= num3) {
        this.statisticalTableData.tableData2.push(...arr);
      } else if (num3 <= num2 && num3 <= num1) {
        this.statisticalTableData.tableData3.push(...arr);
      }
      this.loadingState = false;
    });
  }
  // 时间选择器选择时间
  private selectTimeChange() {
    this.loadingState = true;
    this.getStatTownSum();
  }
  // change city
  private changeCity(item: any, index: any) {
    // this.activeIndex = index;
    this.currentCity = item.name;
    this.currentCityCode = item.gbCode;
    this.searchDto.districtCode =
      item.gbCode === this.rootDistrictCode ? '' : item.gbCode;
    this.searchDto.townCode = '';
    // this.town(item);
    this.currentTown = '全部乡镇';
    // this.rainSearchValue = '';
    // this.searchDto.keyWord = '';
    this.getStationsList();
  }
  // change Town
  // private changeTown(item: any, index: any) {
  //   // this.activeIndexTown = index;

  //   this.currentTown = item.name;
  //   this.currentTownCode = item.districtcode;
  //   // this.rainSearchValue = '';
  //   // this.searchDto.keyWord = '';
  //   this.searchDto.townCode = item.tag.adcode;
  //   if (item.name === '全部乡镇') {
  //     this.searchDto.districtCode =
  //       this.currentCityCode === this.rootDistrictCode
  //         ? ''
  //         : this.currentCityCode;
  //   }
  //   this.getStationsList();
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

  // 监听 geometry
  @Watch('$store.state.dataFilterControl.filter')
  private changeGeometry() {
    if (this.isShowModal === false) {
      this.searchDto.districtCode = this.$store.state.dataFilterControl.filter.districtCode;
      if (this.$store.state.dataFilterControl.filter.geometry) {
        this.searchDto.geometry = this.$store.state.dataFilterControl.filter.geometry;
      }
      this.getData();
      // this.getStationsList();
    }
  }
  private created() {
    this.changeGeometry();
    this.rainBytime = [
      // 设置默认时间
      this.dateFormat(
        'YYYY-mm-dd HH:MM:SS',
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      ),
      this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
    ];
    this.startTime = this.rainBytime[0].toString().slice(11, 19);
    this.endTime = this.rainBytime[1].toString().slice(11, 19);
  }
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

  // 导出Excel
  private download() {
    rainSituationServer
      .getDownload({
        startTime: this.rainBytime[0],
        endTime: this.rainBytime[1],
      })
      .then((res: any) => {
        const a = document.createElement('a');
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        const dom = document.createElement('a');
        dom.download =
          '降雨统计' + this.rainBytime[0] + '~' + this.rainBytime[1] + '.xlsx';
        dom.href = URL.createObjectURL(blob);
        dom.style.display = 'none';
        document.body.appendChild(dom);
        dom.click();
        document.body.removeChild(dom);
      });
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
@tabUrl: '../../../../assets/img/discuss';
@urlBtn: '../../../../assets/img/gisModule/PopulationFeverBox';
.panelPublicDefault_bd {
  height: calc(100% - 40px);
}
.statisticList_li {
  position: relative;
  padding: 6px 12px;
  // &:nth-of-type(4) {
  //   .listName {
  //     color: red !important;
  //   }
  // }
  .rainTooltip {
    font-size: 10px;
    color: #4fb4e7;
    display: block;
  }
}
.panelPublicDefault {
  height: 99% !important;
}
.riverSelect {
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  div + div {
    margin-left: 30px;
  }
}
.rainCont {
  // position: relative;
  .red {
    color: #fa5826;
  }
  .orange {
    color: #ffa627;
  }
  .yellow {
    color: yellow;
  }
  .rainCont_echart {
    .echartTitle {
      display: flex;
      height: 49px;
      justify-content: space-between;
      align-items: center;
    }
    .rain_checkTime {
      display: flex;
      margin-left: 10px;
      font-size: 18px;
      li {
        width: 70px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 6px;
        margin-left: 5px;
        cursor: pointer;
        padding: 0 5px;
        color: #9fe3f5;
        white-space: nowrap;
        background: url('@{tabUrl}/dengjibglan.png') 50% 100% no-repeat;
        background-size: 100% 100%;
        &:not(:first-child) {
          margin-left: -11px;
        }
      }
      .active {
        color: #faffa5;
        background-image: url('@{tabUrl}/dengjihoverbglan.png');
      }
    }
    .rain_checkValue {
      div {
        color: #8de5eb;
        margin-top: 4px;
      }
      .redWord {
        color: #abbfcb;
      }
      .hidden {
        visibility: hidden;
      }
    }
    .echartContent {
      width: 850px;
      margin-left: 14px;
      padding: 0px 10px;
      // margin-top: 13px;
      background: #091120;
      border: 1px solid #2b5461;
      border-radius: 8px;
      color: #8de5eb;
      font-size: 20px;
      padding-bottom: 20px;
    }
    .reportContent {
      width: 96%;
    }
  }

  .list {
    height: calc(100% - 498px);
    .listBox {
      height: calc(100% - 60px);
      .el-scrollbar {
        height: 100%;
      }
    }
    .listBoxLeft {
      height: calc(100% - 252px);
      .el-scrollbar {
        height: 100%;
      }
    }
  }

  .nodata {
    // height: 100%;
    height: calc(100% - 40px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text {
    color: #fff;
    font-size: 24px;
  }
  .nodataleft {
    height: calc(100% - 272px) !important;
  }

  .rain_list_addr {
    color: #fff;
    width: 20%;
    ul {
      li {
        height: 30px;
        width: 70px;
        float: left;
      }
    }
  }
  .updateTime {
    color: #abbfcb;
    float: right;
    margin-right: 20px;
    font-size: 20px;
  }
  .statisticalTable {
    .el-dialog__header {
      background: url('@{imgPath}/top-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
    }
    .tableContent {
      box-sizing: border-box;
      padding: 0 4px;
      .echartIcon {
        float: right;
        width: 32px;
        height: 32px;
        background: url('@{imgPath}/echart.png') no-repeat 0 0;
        background-size: 100% 100%;
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          background: url('@{imgPath}/echart_hover.png') no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
      .bg-box {
        position: relative;
        height: 730px;
        padding: 10px 5px 0 0;
        .title {
          position: absolute;
          top: -61px;
          left: 400px;
          padding-top: 11px;
          width: 70%;
          height: 61px;
          font-size: 26px;
          .statisticalTime {
            display: inline-block;
            padding: 0 15px;
            height: 38px;
            color: #ffde00;
            line-height: 38px;
            border: 1px solid #0e89a1;
            border-radius: 5px;
            background: #17546d;
          }
          .unit {
            margin-left: 20px;
            line-height: 43px;
            color: #6fe4fb;
            vertical-align: top;
          }
        }
        .rainStatistical {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 0 20px;
          width: 100%;
          height: 30px;
          div {
            font-size: 24px;
            color: #68a9ca;
            span {
              color: #e6e7ea;
              &.name {
                color: #68a9ca;
                margin-right: 10px;
              }
            }
          }
        }
        .tableBox {
          display: flex;
          justify-content: flex-start;
          position: relative;
          .nodata {
            width: 100%;
            height: 638px;
          }
        }
        table tr th,
        table tr td {
          border-right: 3px solid #0a162a;
          border-bottom: 3px solid #0a162a;
        }
        table {
          position: absolute;
          color: #fff;
          border-collapse: collapse;
          border-right: 3px solid #26486a;
          &:nth-child(1) {
            margin-right: -2px;
            top: 0;
            left: 0;
            .distName {
              &::after {
                content: '';
                position: absolute;
                left: 0px;
                bottom: -4px;
                width: 622px;
                height: 3px;
                background: #26486a;
              }
            }
          }
          &:nth-child(2) {
            top: 0;
            right: 0;
            left: 0;
            margin: auto;
            display: block;
            width: 627px;
            &::after {
              content: '';
              position: absolute;
              right: -6px;
              bottom: 0px;
              width: 3px;
              height: 100%;
              background: #26486a;
            }
          }
          &:nth-child(3) {
                top: 0;
                right: 0
          }
          &:nth-child(2),
          &:nth-child(3) {
            &::before {
              display: none!important;
              content: '';
              position: absolute;
              left: 0px;
              top: 0px;
              width: 3px;
              height: calc(100% + 2px);
              background: #26486a;
            }
          }
          th {
            font-size: 26px;
            color: #6fe4fb;
            background: rgba(33, 181, 234, 0.1);
            &:nth-child(1) {
              width: 198px;
            }
            &:nth-child(2) {
              width: 228px;
            }
            &:nth-child(3) {
              width: 160px;
            }
          }
          tr {
            height: 55px;
            // border-bottom: 1px solid #fff;
            td {
              text-align: center;
            }
            .distName {
              position: relative;
              width: 188px;
              font-size: 30px;
              color: #92edf6;
              background: rgba(6, 14, 53, 0.2);
              &::after {
                content: '';
                position: absolute;
                left: -3px;
                bottom: -3px;
                width: 627px;
                height: 3px;
                background: #26486a;
              }
            }
            .townName {
              width: 244px;
              font-size: 26px;
              color: #bbd0dc;
              background: rgba(2, 64, 126, 0.2);
            }
            .rainAvg {
              width: 180px;
              font-size: 26px;
              color: #fffabe;
              background: rgba(2, 64, 126, 0.2);
            }
          }
        }
        .el-scrollbar {
          // margin-top: 10px;
          box-sizing: border-box;
          border: 1px solid #1784c1;
          background-color: rgba(2, 12, 35, 0.2);
          ::-webkit-scrollbar {
            display: none;
          }
        }
      }
      .loading_box {
        height: 900px;
        padding: 10px 5px 0 0;
        .loading {
          background: url(../../../../assets/img/halfScreen/halflist/loading.gif)
            no-repeat 33px 255px;
          color: #d2e1ec;
          background-position: 50% 50%;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .btnBox {
    height: 40px;
    // width: 102px;
    float: right;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .chartBtn {
      width: 43px;
      height: 40px;
      background: url('@{imgPath}/chartBtn.png') no-repeat 0 0;
      background-size: 100% 100%;
      &.active,
      &:hover {
        background: url('@{imgPath}/chartBtn-active.png') no-repeat 0 0;
      }
    }
    .line {
      width: 2px;
      height: 31px;
      background-color: #005760;
    }
    .tableBtn {
      width: 40px;
      height: 40px;
      background: url('@{imgPath}/tableBtn.png') no-repeat 0 0;
      background-size: 100% 100%;
      &.active,
      &:hover {
        background: url('@{imgPath}/tableBtn-active.png') no-repeat 0 0;
      }
    }
    .exportBtn {
      padding-left: 10px;
      width: 150px;
      height: 46px;
      background: url('@{urlBtn}/tabBj.png') no-repeat center center / 100% 100%;
      line-height: 46px;
      font-size: 22px;
      color: #cee6ea;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
// 预警信息报告
.reportContent {
  width: 96%;
}
</style>
<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
@url: '../../../../assets/img/monitorWarning';

.dialogMr {
  .el-dialog {
    margin-right: 30%;
  }
}

.rainCont {
  .el-dialog__wrapper {
    width: 1920px !important;
  }
  .el-dialog {
    background: transparent;
    box-shadow: none;
  }
  .el-dialog__body {
    background: url('@{imgPath}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-dialog__header {
    background: url('@{imgPath}/topbg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
  }
  .el-dialog__footer {
    background: url('@{imgPath}/botBg.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 38px;
    box-sizing: content-box;
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
      color: transparent;
    }
    .el-dialog__close {
      display: none;
      &:hover {
        color: transparent;
      }
    }
  }
  .statisticalTable {
    * {
      box-sizing: border-box;
    }
    overflow: visible !important;
    width: 1920px !important;
    .el-dialog__wrapper {
      overflow: visible !important;
      width: 1920px !important;
    }
    .el-dialog__header {
      background: url('@{url}/top-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 71px;
      .el-dialog__title {
        line-height: 40px;
      }
    }
    .el-dialog__headerbtn {
      right: -4px;
    }
    .el-dialog__body {
      background: url('@{url}/center-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      padding-bottom: 0px;
      padding-top: 0px;
    }
    .el-dialog__footer {
      background: url('@{url}/bot-bg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 36px;
      box-sizing: content-box;
      padding: 0;
    }
  }
}

// .rainSearchTable.el-table,
// .rainSearchTable.el-table:before {
//   background: transparent;
// }
// .rainSearchTableBox {
//   .el-table th,
//   .el-table tr {
//     background: transparent;
//   }
//   .el-table .el-table__header {
//     background-color: rgba(3, 48, 95, 0.7);
//   }
//   .el-table thead {
//     color: #04daec;
//   }
//   .el-table__body {
//     color: #fff;
//   }
//   .el-table tbody tr:hover > td {
//     background-color: transparent;
//   }
//   .el-table td,
//   .el-table th.is-leaf,
//   .el-table--group {
//     border-color: rgba(3, 48, 95, 0.7);
//   }
// }

// 预警信息报告
.reportDailog {
  .el-table {
    color: #fff;
    margin-top: 10px;
    background: transparent;
    border: none;
    tr,
    th {
      color: #fff;
      background: transparent;
    }
  }
}
</style>
