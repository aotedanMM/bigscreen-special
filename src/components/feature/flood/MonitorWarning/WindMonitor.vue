<template>
  <!--风情监测  -->
  <div class="panelPublicDefault windMonitor">
    <div class="panelPublicDefault_hd">
      <!-- ({{ count }}) -->
      <span class="title-panel">风情监测</span>
    </div>
    <div class="panelPublicDefault_bd">
      <div class="statisticList">
        <div
          class="statisticList_li f-tit-h2"
          :class="[{ checkSty: activeType == item.name }, 'item']"
          v-for="(item, index) in nameInfo"
          :key="index"
          @click="tabMonitoring(item.name)"
        >
          <div>
            <span>{{ item.name }}</span>
            <!-- <span>/{{ item.unit }}</span> -->
          </div>
          <div>
            <span class="statisticList_li_textWarning f-number">
              {{
              item.total
              }}
            </span>
            {{ item.unit }}
          </div>
        </div>
      </div>
      <div class="statisticList-title">
        <span class="f-tit-h2">监测站列表</span>
        <span v-if="isShowModal" class="echartIcon" @click="openDialog" title="各区市平均风速"></span>
      </div>
      <div class="riverSelect" v-if="showSelect">
        <!-- 区市下拉 -->
        <div>
          <Select
            :selectdata="cityCodeList"
            @select="changeCity"
            :selectedtitle="currentCity"
            :width="190"
            :left="-6"
          ></Select>
        </div>

        <!-- 乡镇下拉 -->
        <div>
          <Select
            :selectdata="townCodeList"
            @select="changeTown"
            :selectedtitle="currentTown"
            :width="190"
            :left="-6"
          ></Select>
        </div>
      </div>
      <div class="dataList" :class="{ dataListleft: !isShowModal }">
        <el-input
          class="csmMyInput"
          type="text"
          v-model.trim="inputValue"
          @input="search(inputValue)"
        >
          <i slot="suffix" class="iconSelf_search" @click="search(inputValue)"></i>
        </el-input>
        <div class="nodata" v-if="!tableData.length" :class="{ nodataleft: !isShowModal }">
          <img src="../../../../assets/img/default/panel/noData.png" />
        </div>
        <div v-else style=" height: calc(100% - 40px);">
          <el-scrollbar style="height:100%;">
            <ul class="listBoxSingle">
              <li
                class="f-txt-com listBoxSingle_li"
                v-for="(item, index) in tableData"
                :key="item.id"
                @click="openProp(item, index)"
                :class="{ checkSty: activeIndex === item.id }"
              >
                <p class="teamName">{{ item.name }}</p>
                <p class="teamDistance">
                  <span>
                    实际风速:&nbsp;
                    <span>
                      {{
                      item.windSpeed || item.windSpeed == 0
                      ? item.windSpeed + 'm/s'
                      : '- -'
                      }}
                    </span>
                  </span>
                  <span>{{ item.windDirection }}</span>
                </p>
              </li>
            </ul>
          </el-scrollbar>
          <div class="pagination">
              <el-pagination
                class="constomMyElPage"
                small
                :pager-count="5"
                :current-page.sync="paginationObj.currentPage"
                @current-change="handleCurrentChange"
                :page-size="paginationObj.pageSize"
                layout="prev, pager, next, total"
                :total="paginationObj.total"
              ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 图表弹窗 -->
    <el-dialog
      title="各区市平均风速"
      :visible.sync="dialogVisible"
      width="45%"
      :modal-append-to-body="false"
      top="10%"
      :modal="false"
    >
      <span class="updateTime">
        更新时间：
        <span>{{ windData.updateTime }}</span>
      </span>
      <!-- <div style="display:flex"> -->
      <div class="echartsBox">
        <div class="barChart" id="barChart"></div>
      </div>
      <!-- <el-scrollbar style="height: 270px" class="rain_list_addr">
          <ul v-if="winDistrictList">
            <li v-for="(item, index) in winDistrictList" :key="index">
              {{ item }}
            </li>
          </ul>
      </el-scrollbar>-->
      <!-- </div> -->
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { windSituationServer } from '@/api/feature/monitorwarning/installServer';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import Select from './Select.vue';
import { districtServer } from '@/api/installServer';
import { nomalLeftServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
// import echarts from 'echarts';
/**
 * 监测预警
 */
@Component({
  name: 'WindMonitor',
  mixins: [MapCommon],
  components: {
    Select,
  },
})
export default class WindMonitor extends Vue {
  // 接收 检测总数
  @Prop() private count!: number;
  @Prop() private isShowModal: any;
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
  private currentCity: any = '';
  private currentCityCode: any = '';
    // 是否显示下拉组件
  private showSelect: any = true;
  // 乡镇下拉
  private townCodeList: any = [
    {
      shortname: '',
      districtcode: '',
    },
  ];
  private currentTown: any = '全部乡镇';
  private currentTownCode: any = this.townCodeList[0].code;
  private nameInfo: any = [
    { name: '监测站', unit: '处', total: 0 },
    // { name: '监测阈值', unit: 'm/s', total: 0 },
    { name: '超阈值监测站', unit: '处', total: 0 },
  ];
  private windData: any = {};
  private activeType: any = '超阈值监测站';
  // private activeType: any = '';
  private activeIndex: any = false;
  private tableData: any = [];
  private inputValue: any = '';
  // 分页
  private paginationObj: any = {
    currentPage: 1, // 页码
    pageSize: 10, // 单页条数
    total: 0, // 总条数
  };
  private parameter: any = {
    // 获取风情站点列表
    keyWord: '', // 非必填，
    overThreshold: true, // 非必填，是否筛选超阈值站点
    nowPage: 1, // 非必填
    pageSize: 10, // 非必填
    districtCode: '',
    townCode: '',
    geometry: this.isShowModal
      ? ''
      : this.$store.state.eventPushStore.eventLocation.geometry ===
        '{"type":"Polygon","coordinates":[[[0,0],[0,90],[180,90],[180,0],[0,0]]]}'
      ? ''
      : this.$store.state.eventPushStore.eventLocation.geometry,
  };
  private firstData: any = {}; // 统计图第一页的数据
  private chartsData: any = []; // 统计图其他页的数据
  private chartsPages: any = []; // 统计图页码数组
  private searchValue: string = '';
  private dialogVisible: boolean = false; // dialog
  private winDistrictList: any = []; // dialog里地区
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private timer: any = ''; // 延时搜索
  private threshold: any = 15; // 统计图刻度最大值

  // 显示 图例
  private showJsl(val: any) {
    // const data = {
    //   key: val,
    //   isShow: true,
    // };
    // this.$store.dispatch('configModel/updateLegendItem', data);
    this.$store.commit('mapTools/addSelectedLayer', {
      id: val,
      name: '风力监测站',
      play: false,
      legend: { component: val },
    });
  }
  private showWindLegend(val: any) {
    if (val.visible === true) {
      this.showJsl('WindThwartwise');
    } else if (val.visible === false) {
      this.showJsl('WindMonitoring');
    }
  }
  private created() {
    this.getDistrictStat();
    this.getComponent().on('RainWindLengend', this.showWindLegend, this);
    this.changeGeometry(); // 监听 geometry
  }
  private mounted() {
    if (this.isShowModal) {
      this.getCurrentInfo();
      this.getStationsList();
      this.city();
      this.town(this.cityCodeList[0]);
    }
    this.getComponent().on('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().load();
  }
  private beforeDestroy() {
    //  清除风情图层
    this.getComponent().removeResource('wind');
    this.getComponent().off('WindWaterRainWork_popup', this.popupData, this);
    this.getComponent().unload();
    this.getComponent().off('RainWindLengend', this.showWindLegend, this);
    this.$store.commit('mapTools/removeSelectedLayer', {id: 'WindThwartwise'});
    this.$store.commit('mapTools/removeSelectedLayer', {id: 'WindMonitoring'});
    // 清除延时搜索
    clearTimeout(this.timer);
  }
  private async getCurrentInfo() {
    // 获取风情描述信息
    const obj: any = {
      limitValue: 13.8,
      districtCode:
        this.$store.state.dataFilterControl.filter.districtCode === '130400'
          ? this.parameter.districtCode
          : this.$store.state.dataFilterControl.filter.districtCode,
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      obj.geometry = this.$store.state.dataFilterControl.filter.geometry;
    }
    const res: any = await windSituationServer.getCurrentInfo(
      this.isShowModal ? {} : obj,
    );
    this.windData = res.data.data;
    this.nameInfo[0].total = res.data.data.totalNum;
    // this.nameInfo[1].total = res.data.data.threshold;
    this.nameInfo[1].total = res.data.data.overThresholdNum;
  }
  private async getDistrictStat() {
    // 获取风情分区县统计
    const res: any = await windSituationServer.getDistrictStat();
    this.firstData.name = res.data.data.map((v: any) => v.name);
    this.firstData.value = res.data.data.map((v: any) => {
      if (!v.value && v.value !== 0) {
        v.value = 0;
      }
      if (v.value > this.threshold - 2) {
        this.threshold = v.value + 2;
      }
      return v.value;
    });
    this.initData();
  }
  private async getStationsList(flag: boolean = true) {
    // 加载图层
    if (flag) {
      const param: any = {
        keyWord: this.parameter.keyWord,
        geometry: this.parameter.geometry,
        districtCode: this.parameter.districtCode,
        townCode: this.parameter.townCode,
      };
      if (
        this.parameter.overThreshold === true ||
        this.parameter.overThreshold === false
      ) {
        param.overThreshold = this.parameter.overThreshold;
      }
      if (this.isShowModal) {
        param.geometry = '';
      }
      this.getComponent().addResource_Wind(param);
    }
    const res: any = await windSituationServer.getStationsList(this.parameter);
    this.tableData = res.data;
    this.paginationObj.total = res.total ? res.total : 0;
  }
  private initData() {
    const chartDom = document.getElementById('barChart');
    if (!chartDom) {
      return;
    }
    const myChart = (this as any).$echarts.init(chartDom);
    // 指定图表的配置项和数据
    // const option = {
    //   timeline: {
    //     data: this.chartsPages,
    //     label: {
    //       show: false,
    //       // normal: {
    //       //     color: '#fff',
    //       //     position: 'auto',
    //       // },
    //     },
    //     axisType: 'category',
    //     padding: [2, 90],
    //     autoPlay: false,
    //     playInterval: 1000,
    //     // tooltip:{formatter : function(s: any) {return "第"+s.value+"页"; }},
    //     controlStyle: {
    //       showPlayBtn: false,
    //       showPrevBtn: false,
    //       showNextBtn: false,
    //     },
    //     lineStyle: {
    //       show: false,
    //     },
    //     // itemStyle: {
    //     //     normal: {
    //     //     },
    //     // },
    //   },
    //   options: [
    //     {
    //       title: {
    //         text: ' \n \n \n \n风\n速',
    //         textStyle: {
    //           color: '#9e9fae',
    //           fontSize: 16,
    //           fontWeight: 400,
    //           // padding: [-80, 0, 0, 40],
    //         },
    //       },
    //       tooltip: { trigger: 'axis' },
    //       calculable: true,
    //       // grid: {
    //       //   x: 45,
    //       //   y: 30,
    //       //   x2: 30,
    //       //   y2: 80,
    //       // },
    //       xAxis: [
    //         {
    //           type: 'category',
    //           name: '区\n划',
    //           axisLine: {
    //             lineStyle: {
    //               color: '#fff',
    //               type: 'dotted',
    //             },
    //           },
    //           axisLabel: {
    //             show: true,
    //             inside: false,
    //             interval: 0,
    //             rotate: 45,
    //             lengt: 1,
    //             textStyle: {
    //               color: '#fff',
    //               fontSize: '16',
    //             },
    //           },
    //           nameTextStyle: {
    //             color: '#9e9fae',
    //             padding: [0, 0, 0, 40], // 四个数字分别为上右下左与原位置距离
    //           },
    //           nameGap: -30,
    //           data: this.firstData.name,
    //         },
    //       ],
    //       yAxis: [
    //         {
    //           type: 'value',
    //           name: '（m/s）',
    //           nameRotate: 90,
    //           nameGap: -60,
    //           minInterval: 1,
    //           boundaryGap: [0, 0.1],
    //           splitNumber: 6,
    //           nameTextStyle: {
    //             color: '#9e9fae',
    //             padding: [-130, 0, 0, -20], // 四个数字分别为上右下左与原位置距离
    //           },
    //           axisLabel: {
    //             show: true,
    //             inside: false,
    //             interval: 0,
    //             lengt: 1,
    //             textStyle: {
    //               color: '#fff',
    //               fontSize: '16',
    //             },
    //           },
    //           axisLine: {
    //             show: false,
    //             lineStyle: {
    //               type: 'solid',
    //               color: '#ccc',
    //               width: '1',
    //             },
    //           },
    //           splitLine: {
    //             lineStyle: {
    //               color: '#ccc',
    //               type: 'dotted',
    //             },
    //           },
    //         },
    //       ],
    //       series: [
    //         {
    //           name: '风量',
    //           type: 'bar',
    //           data: this.firstData.value,
    //           barWidth: 15, // 柱图宽度
    //           itemStyle: {
    //             color: '#61A5E8',
    //             borderColor: '#00deb7',
    //             borderType: 'solid',
    //             normal: {
    //               color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //                 {
    //                   offset: 0,
    //                   color: 'rgba(0,158,120)',
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: 'rgba(0,158,120,.2)',
    //                 },
    //               ]),
    //               borderColor: '#00deb7',
    //               borderType: 'solid',
    //             },
    //           },
    //           markLine: {
    //             data: [
    //               {
    //                 type: 'max',
    //                 name: '最大值',
    //                 lineStyle: {
    //                   normal: {
    //                     color: 'red', // 这儿设置安全基线颜色
    //                   },
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //     ...this.chartsData,
    //   ],
    // };
    const option = {
      title: {
        text: ' \n \n \n \n风\n速',
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
        x: 125,
        y: 30,
        x2: 90,
        y2: 80,
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
          data: this.firstData.name,
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 22,
            formatter(params: any) {
              let newParamsName = ''; // 最终拼接成的字符串
              const paramsNameNumber = params.length; // 实际标签的个数
              const provideNumber = 6; // 每行能显示的字的个数
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
            padding: [0, 0, 0, 20], // 四个数字分别为右下左上
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '（m/s）',
          max: this.threshold,
          nameRotate: 90,
          nameGap: 30,
          minInterval: 1,
          boundaryGap: [0, 2],
          splitNumber: 6,
          nameTextStyle: {
            fontSize: 24,
            color: '#9e9fae',
            padding: [-210, 0, 0, -230], // 四个数字分别为右下左上
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
          data: this.firstData.value,
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
                // type: 'max',
                name: 'Y 轴值为 13.8 的水平线',
                yAxis: 13.8,
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

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.paginationObj.currentPage = val;
    this.parameter.nowPage = val;
    this.getStationsList(false);
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  private tabMonitoring(name: any) {
    // 监测点和超阀值监测点 切换
    // if (name === '监测阈值' || name === this.activeType) {
    //   return;
    // }
    this.activeType = name;
    this.parameter.keyWord = '';
    this.parameter.name = '';
    if (name === '超阈值监测站') {
      this.parameter.overThreshold = true;
      this.parameter.nowPage = 1;
      this.paginationObj.currentPage = 1;
    } else {
      // this.parameter.overThreshold = false;
      this.parameter.nowPage = 1;
      this.paginationObj.currentPage = 1;
      if (
        this.parameter.overThreshold === true ||
        this.parameter.overThreshold === false
      ) {
        delete this.parameter.overThreshold;
      }
    }
    this.getStationsList();
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
      moduleTypeID: 'windMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  private search(val: any) {
    // 搜索
    if (this.parameter.keyWord === val) {
      return;
    }
    this.parameter.keyWord = val;
    this.parameter.name = val;
    this.parameter.nowPage = 1;
    this.paginationObj.currentPage = 1;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getStationsList();
    }, 800);
  }
  private openProp(item: any, index: any) {
    this.activeIndex = item.id;
    this.getComponent().locate('wind', 'id', item.id);
  }
  // 打开图表弹窗
  private openDialog() {
    this.dialogVisible = true;
    this.$nextTick(() => {
      this.initData();
    });
  }

  // change city
  private changeCity(item: any, index: any) {
    // this.activeIndex = idebuggerndex;
    this.currentCity = item.name;
    this.currentCityCode = item.gbCode;
    this.parameter.districtCode =
      item.gbCode === this.rootDistrictCode ? '' : item.gbCode;
    this.town(item);
    this.currentTown = '全部乡镇';
    // this.inputValue = '';
    this.parameter.townCode = '';
    // this.parameter.keyWord = '';
    this.getStationsList();
    this.getCurrentInfo(); // 面板统计
  }
  // change Town
  private changeTown(item: any, index: any) {
    // this.activeIndexTown = index;
    this.currentTown = item.name;
    this.currentTownCode = item.districtcode;
    // this.inputValue = '';
    // this.parameter.keyWord = '';

    this.parameter.townCode = item.tag.adcode;
    if (item.name === '全部乡镇') {
      this.parameter.districtCode =
        this.currentCityCode === this.rootDistrictCode
          ? ''
          : this.currentCityCode;
    }
    this.getStationsList();
  }

  // 行政区划
  private city() {
    // 获取城市信息
    const self = this;
    nomalLeftServer.getCitySelected().then((res: any) => {
      if (!res || !res.data) {
        return;
      }
      const allObj: any = {
        gbCode: this.rootDistrictCode,
        name: '全部市区',
        longitude: '121.37990',
        latitude: '37.53560',
      };
      res.data.unshift(allObj);
      self.cityCodeList = res.data;
      self.currentCity = this.cityCodeList[0].name;
      self.currentCityCode = this.cityCodeList[0].gbCode;
      if (self.$store.state.dataFilterControl.filter.districtCode === '130400') {
        return;
      }
      const checkedList: any = [];
      self.cityCodeList.forEach((item: any) => {
        if (self.$store.state.dataFilterControl.filter.districtCode.split(',')) {
          const codeKey = self.$store.state.dataFilterControl.filter.districtCode.split(',');
          codeKey.forEach((code: any) => {
            if (item.gbCode === code) {
              checkedList.push(item);
             }
          });
        } else {
          if (item.gbCode === self.$store.state.dataFilterControl.filter.districtCode) {
           checkedList.push(item);
          }
        }
      });
      // self.cityCodeList = checkedList;
      if (!self.cityCodeList.length) {
        return;
      }
      self.currentCity =  self.cityCodeList[0].name;
    });
  }
  // 乡镇
  private town(item: any) {
    districtServer
      .getTownListByCounty({
        code: item.districtcode || item.gbCode,
        point: [item.longitude, item.latitude],
      })
      .then((data: any) => {
        const allObj: any = {
          gbCode: '',
          tag: {
            adcode: '',
          },
          name: '全部乡镇',
        };
        data.data.unshift(allObj);
        this.townCodeList = data.data;
        this.townCodeList.map((v: any, index: any) => {
          if (v.name) {
            v.shortname = v.name;
          }
        });
      });
  }

  // 监听 geometry
  @Watch('$store.state.dataFilterControl.filter')
  private changeGeometry() {
    if (this.isShowModal === false) {
      this.parameter.districtCode =
        this.$store.state.dataFilterControl.filter.districtCode === '130400'
          ? ''
          : this.$store.state.dataFilterControl.filter.districtCode;
      if (this.$store.state.dataFilterControl.filter.geometry) {
        this.parameter.geometry = this.$store.state.dataFilterControl.filter.geometry;
      } else {
        this.parameter.geometry = '';
      }
      this.city();
      this.getCurrentInfo(); // 面板统计
      this.getStationsList(); // 列表
    }
    if (this.$store.state.dataFilterControl.filter.geometry) {
      this.showSelect = false;
    } else {
       this.showSelect = true;
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../assets/css/decisionSupport/Statistic.half.less');
@import url('../../../../assets/css/popUp/statistic.less');
@import url('../../../../assets/css/popUp/statistic.list.less');
@imgPath: '../../../../assets/img/monitorWarning';
@url: '../../../../assets/img/halfScreen/firePoint';
.dataList {
  height: calc(100% - 282px);
  div + div {
    .el-scrollbar {
      height: calc(100% - 8px);
    }
  }
}
.dataListleft {
  height: calc(100% - 295px);
}
.panelPublicDefault {
  height: 99% !important;
}
.riverSelect {
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  div + div {
    margin-left: 25px;
  }
}
.windMonitor {
  width: 100%;
  .el-scrollbar {
    width: 100%;
    height: 610px;
  }
  .nodata {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nodataleft {
    height: 386px !important;
  }
  .echartsBox {
    width: 94%;
    height: 280px;
    margin: 0 auto;
    background: #091120;
    border: 1px solid #2b5461;
    border-radius: 8px;
    margin-top: 35px;
    padding-bottom: 20px;
    .barChart {
      width: 100%;
      height: 100%;
    }
  }

  .rain_list_addr {
    color: #fff;
    width: 20%;
    height: 100%;
    ul {
      li {
        height: 30px;
        width: 75px;
        float: left;
      }
    }
  }
  .updateTime {
    color: #abbfcb;
    float: right;
    margin-right: 27px;
    font-size: 20px;
    display: block;
    margin-top: 0px;
  }
}
</style>
<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
.windMonitor {
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
    width: 104.7%;
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
