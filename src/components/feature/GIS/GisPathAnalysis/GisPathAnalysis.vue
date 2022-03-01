<template>
  <div class="path-analysis-box">
    <!-- 缩小后的按钮 -->
    <div
      v-show="showRouteIcon"
      class="path-analysis-icon"
      id="path-analysis-icon-id"
      @click="showPopView"
    ></div>

    <div v-show="showRoutePopup" id="path-analysis-main">
      <div class="path-title">
        <!-- 显示的标题备注 
                如果是前突队伍 显示行动轨迹(点击按钮的名称) 其他的是路径规划
                ps: 应急资源救援队伍那里的前突按钮显示的路径规划 所以走的也是路径规划
        -->
        <div class="title-name">{{ realTeamHistoryInfo.isRealTeame ? '行动轨迹' : '路径规划' }}</div>
        <div class="toBack" @click="closePopView"></div>
        <!-- <div class="title-icon-mini" @click="miniPopView"></div>
        <div class="title-icon-close" @click="closePopView"></div>-->
      </div>
      <div class="path-detail" ref="pathDetail">
        <div class="path-detail-title">{{ realTeamHistoryInfo.realTeamName }}</div>
        <!--  中间起点,途径点.终点  -->
        <div class="pathMainWrap compComp-mapComponent-bodyContainer">
          <!--互换按钮右侧的input和搜索按钮-->
          <!--start历史轨迹-->
          <div class="playTrack" v-if="realTeamHistoryInfo.isRealTeame && isShowHistory">
            <!--判断是否是前途队伍-->
            <span class="city-text" :title="realTeamHistoryInfo.realTeamHistoryName">
              <span class="city-text_inner">{{ realTeamHistoryInfo.realTeamHistoryName }}</span>
            </span>
            <div class="time-flex">
              <span class="time-flex_item">{{ realTeamHistoryInfo.realTeamHistoryStartTime }}</span>
              <span class="time-flex_icon"></span>
              <span
                class="time-flex_item time-flex_right"
                style="padding-right:10px;"
              >{{ realTeamHistoryInfo.realTeamHistoryEndTime }}</span>
            </div>
            <!--<div class="time-flex" v-if="realTeamHistoryInfo.historyOrbit && realTeamHistoryInfo.historyOrbit.length">
                        &lt;!&ndash;<span class="time-flex_item default">共 <span class="warn">{{realTeamHistoryInfo.realTeamHistoryHour}}</span> 小时</span>&ndash;&gt;
                          &lt;!&ndash; <span class="time-flex_icon"></span>  &ndash;&gt;
                        &lt;!&ndash; <span class="time-flex_item time-flex_right">
                          <span class="time-flex_btn" @click="playHistory">播放轨迹</span>
                        </span> &ndash;&gt;
            </div>-->
          </div>
          <div class="pathRight">
            <!--end历史轨迹-->
            <!-- 最左侧起点终点互换按钮按钮-->
            <div class="pathLeftIcon">
              <div class="leftIcon" :class="toReverseFlag ? 'reverseIcon' : ''" @click="toReverse"></div>
            </div>
            <div class="pathLeftInput">
              <div
                class="pathMainItem"
                v-for="(item, index) in pathMainDatas"
                :key="index"
                @mouseover="mouseOverShowBtn(index)"
                @mouseleave="mouseLeaveCancelBtn(index)"
              >
                <!--在地图取点的图标-->
                <div :class="item.iconClass" @click="toClickPreIcon(item, index)"></div>

                <input
                  v-model.trim="item.inputKey"
                  clearable
                  class="inputKeyClass"
                  :placeholder="item.placeholder"
                  @change="inputWatch(item, index)"
                  @input="inputWatch(item, index)"
                  @oninput="inputWatch(item, index)"
                  @focus="toClickPreIcon(item, index)"
                  :title="item.inputKey ? item.inputKey : item.placeholder"
                />
                <!--删除按钮-->
                <span
                  v-show="curInputIndex === index ? true : false"
                  class="cancelInput"
                  @click="cancelInputValue(item, index)"
                ></span>
                <!--添加途径点或删除途径点-->
                <!--v-if 的解释 当有途径点的时候 判断是不是途径的输入框位置, 途径点位置才显示, 目前只支持添加一个途径点-->
                <i
                  class="add-icon"
                  v-if="
                    pathMainDatas.length === 7
                      ? item.clickClass === 'icon-remove'
                        ? true
                        : false
                      : true
                  "
                  v-show="typeIndex === 'driving' && addButtonFlag"
                  :class="item.clickClass"
                  slot="suffix"
                  @click="handleIconClick(item, index)"
                ></i>
                <!--搜索按钮-->
                <i
                  v-if="pathMainDatas.length - 1 === index"
                  class="search-icon"
                  @click="toSearchPath(false)"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 头部tab页按钮 , 摩托化推进, 铁路 , 航空-->
        <div class="alsTabForTool">
          <div
            class="alsTabForTool_tab"
            v-for="(item, index) in typeTabList1"
            :key="'m' + index"
            :class="{ tabItemActive: typeIndex === item.value }"
            @click="toTypeTabItemClick(item)"
            @mouseover="mouseOverShowIconBg(item)"
            @mouseleave="mouseLeaveCancelIconBg()"
          >
            <!-- <i :class="{active: (typeIndex === item.value || (showTabActiveIcon && hoverTabActiveIcon === item.value))}"></i> -->
            {{ item.title }}
          </div>
        </div>
      </div>
      <!-- 输入框模糊搜索匹配的结果列表 -->
      <ul class="inputOptions">
        <li
          v-for="(item, index) in inputOptions"
          :key="index"
          @click="inputOptionClick(item)"
          :title="item.name + '  ' + item.address"
        >
          <span class="inputOptionsName">{{ item.name }}</span>
          <span class="inputOptionsAddress">{{ item.address }}</span>
        </li>
      </ul>
      <!-- 下部分列表-->
      <div class="path-bottom" v-show="showBottomPathDetailFlag">
        <div class="errPanel-container" v-if="errPanel">
          暂无线路信息
          <!-- <span class="address">{{ sendPathNodeInfo[0] && sendPathNodeInfo[0].inputKey }}</span>
          到
          <span class="address">
            {{ sendPathNodeInfo[ pathMainDatas.length && pathMainDatas.length - 1].inputKey }}
          </span>
          的相应
          <span class="type">{{ typeTabList[typeIndex] && typeTabList[typeIndex].title }}</span
          >-->
        </div>
        <div class="pathAnalysisWrap" v-else-if="typeIndex !== 'bus' && typeIndex !== 'bus_air'">
          <div class="alsTab" v-if="tabList.length">
            <div
              class="alsTab_Item"
              v-for="(item, index) of tabList"
              :key="index"
              :class="{ tabItemActive: tabIndex == item.value }"
              @click="toTabItemClick(item, item.value)"
            >{{ item.title }}</div>
          </div>

          <div class="resultLength">
            <p class="resultLength_text">
              总里程约
              <span class="resultLength_number">
                {{
                resultLength > 10000
                ? (resultLength / 1000).toFixed(2)
                : resultLength
                }}
              </span>
              {{ resultLength > 10000 ? '公里' : '米' }}
              <span
                class="resultLength_number"
              >{{ resArriveTime }}</span>
            </p>
            <p class="resultLength_text">
              所需时间
              <span class="resultLength_time" v-if="resNeedHour > 0">
                <span class="resultLength_timevalue">{{ resNeedHour }}</span>小时
              </span>
              <span class="resultLength_time">
                <span class="resultLength_timevalue">{{ resNeedMinute }}</span>分钟
              </span>
            </p>
          </div>

          <PathAlsTabItem
            :pathanalysislist="pathanalysislist"
            :getComponent="getComponent"
            :height="listHeight"
          ></PathAlsTabItem>'
        </div>

        <div class="pathAnalysisWrap busPanelContainer" v-else>
          <!--跨城 火车飞机大巴选项卡-->
          <!-- <template v-if="!curBusObjData.isCityCross">
                        <div class="alsCrossTab">
                            <div v-for="(item, index) of curBusObjData.parentTabList"
                                class="alsCrossTabItem"
                                :key="index"
                                :class="{tabCrossItemActive:curBusObjData.curParentTabItem.value===item.value}"
                                @click.stop="clickCrossTypeTabItem(item, index)"
                            >
                                {{item.title}}
                            </div>
                        </div>
          </template>-->
          <!--用时最短等tab-->
          <div
            class="busTabContainer"
            v-if="
              !curBusObjData.isCityCross &&
                (curBusObjData.curSamePathObj.pathResult.length ||
                  curBusObjData.curCrossPathObj.pathResult.length)
            "
          >
            <div
              v-for="(item, index) of curBusObjData.tabList"
              class="busTabItem"
              :key="index"
              :class="{
                busTabItemActive: curBusObjData.curTabItem.value == item.value,
              }"
              @click="toBusTabItemClick(item, index)"
            >{{ item.title }}</div>
          </div>
          <!--同城-->
          <!-- <template v-if="curBusObjData.isCityCross">
                        <div class="pathResult-container">
                            <div v-for="(item, index) of curBusObjData.curSamePathObj.pathResult"
                                  :key = "index"
                                  class="pathResultItem-container">
                                <div class="overview-container"
                                      @click.stop="clickSameCityOverviewItem(item, index)"
                                    :class="{overviewContainerIsactive:curBusObjData.curSamePathObj.curPathIndexForHover===index}">
                                    <div class="overview-line1">
                                        <div class="price-container" v-if="item.price>0">票价￥{{item.price}}</div>
                                        <template v-for="(busItem,busIndex) of item.busArr">
                                            <div :key='busIndex'>{{busItem}}</div>
                                            <div v-if="busIndex<(item.busArr.length-1)" :key="busIndex">→</div>
                                        </template>
                                    </div>
                                    <div class="overview-line2">
                                        <span class="txt">
                                            <template v-if="Math.floor(Math.floor(item.duration/60)/60)">{{Math.floor(Math.floor(item.duration/60)/60)}}小时</template>{{Math.floor(item.duration/60)%60}}分钟{{item.duration%60}}秒
                                        </span>
                                        <span class="interval">|</span>
                                        <span class="txt">
                                            {{item.distance/1000}}公里
                                        </span>
                                        <span class="interval">|</span>
                                        <span class="txt">
                                            步行{{item.walkDis/1000}}公里
                                        </span>
                                    </div>


                                </div>

                                <div class="detail-container" v-if="curBusObjData.curSamePathObj.curPathIndex===index">
                                    <template v-for="(stepItem, stepIndex) of item.steps">
                                        <template v-for="(schemesItem,schemesIndex) of stepItem.schemes">
                                            <div class="item"
                                                v-if="schemesItem.instruction"
                                                :key= "stepIndex || schemesIndex"
                                                @click.stop="clikSchemesItem(schemesItem,schemesIndex)">{{schemesItem.instruction}}</div>
                                        </template>
                                    </template>

                                </div>
                            </div>
                        </div>
          </template>-->
          <!--跨城-->
          <template>
            <div class="cross-pathResult-container">
              <div
                v-for="(item, index) of curBusObjData.curCrossPathObj
                  .pathResult"
                :key="index"
                class="cross-pathResultItem-container"
              >
                <div class="routeItem-overview" @click.stop="clickRouteItemOverview(item, index)">
                  <div v-if="index === 0" class="tj-icon"></div>
                  <div class="routeItem-overview-top">
                    <div class="num">{{ index + 1 }}</div>
                    <div
                      class="operate"
                      :class="{
                        operateIsactive:
                          curBusObjData.curCrossPathObj.curPathIndex === index,
                      }"
                    ></div>
                  </div>
                  <div class="tool-container">
                    <template v-for="(stepsItem, stepsIndex) of item.steps">
                      <template v-for="(schemesItem, schemesIndex) of stepsItem.schemes">
                        <div
                          class="toolItem-container"
                          v-if="
                            [1, 2, 6].includes(schemesItem.vehicle_info.type)
                          "
                          :key="schemesIndex || stepsIndex"
                        >
                          <span class="tool-name">{{ schemesItem.vehicle_info.detail.name }}</span>
                          <span class="tool-time">
                            <template>
                              {{
                              [
                              '',
                              '次日',
                              '第三日',
                              '第四日',
                              '第五日',
                              '第六日',
                              ][
                              parseInt(
                              schemesItem.vehicle_info.detail.departure_time.substring(
                              0,
                              1,
                              ),
                              )
                              ]
                              }}
                            </template>
                            {{
                            schemesItem.vehicle_info.detail.departure_time.substring(
                            1,
                            )
                            }}
                          </span>
                          <span class="tool-timeInterval">-</span>
                          <span class="tool-time">
                            <template>
                              {{
                              [
                              '',
                              '次日',
                              '第三日',
                              '第四日',
                              '第五日',
                              '第六日',
                              ][
                              parseInt(
                              schemesItem.vehicle_info.detail.arrive_time.substring(
                              0,
                              1,
                              ),
                              )
                              ]
                              }}
                            </template>
                            {{
                            schemesItem.vehicle_info.detail.arrive_time.substring(
                            1,
                            )
                            }}
                          </span>
                        </div>
                      </template>
                    </template>
                  </div>
                  <div class="total-container">
                    全里程约
                    <template
                      v-if="Math.floor(Math.floor(item.duration / 60) / 60)"
                    >{{ Math.floor(Math.floor(item.duration / 60) / 60) }}小时</template>
                    {{ Math.floor(item.duration / 60) % 60 }}分钟
                  </div>
                </div>
                <div
                  v-if="curBusObjData.curCrossPathObj.curPathIndex === index"
                  class="stepItem-overview-container"
                >
                  <template v-for="(stepsItem, stepsIndex) of item.steps">
                    <div
                      class="stepItem-overview"
                      @click.stop="clickStepItemDiv(stepsItem, stepsIndex)"
                      :key="'k' + stepsIndex"
                      :class="{
                        stepItemoverviewIsactive:
                          curBusObjData.curCrossPathObj.curPathIndex ===
                            index &&
                          curBusObjData.curCrossPathObj.curStepIndex ===
                            stepsIndex,
                      }"
                    >
                      从
                      <span class="location">{{ stepsItem.stepOverviewObj.start_location }}</span>
                      到
                      <span
                        class="location"
                      >{{ stepsItem.stepOverviewObj.end_location }}</span>
                      <span class="duration">
                        <template
                          v-if="
                            Math.floor(
                              Math.floor(
                                stepsItem.stepOverviewObj.duration / 60,
                              ) / 60,
                            )
                          "
                        >
                          {{
                          Math.floor(
                          Math.floor(
                          stepsItem.stepOverviewObj.duration / 60,
                          ) / 60,
                          )
                          }}小时
                        </template>
                        {{
                        Math.floor(stepsItem.stepOverviewObj.duration / 60) %
                        60
                        }}分钟
                      </span>
                      <span
                        class="operate"
                        @click.stop="clickStepItemSpan(stepsItem, stepsIndex)"
                        v-if="
                          stepsItem.schemes &&
                            stepsItem.schemes[0] &&
                            stepsItem.schemes[0].instruction
                        "
                      >详情</span>
                    </div>
                    <div
                      class="stepItem-detail"
                      v-if="
                        curBusObjData.curCrossPathObj.curPathIndex === index &&
                          curBusObjData.curCrossPathObj.curStepIndex ===
                            stepsIndex
                      "
                      :key="stepsIndex"
                    >
                      <template v-for="(schemesItem, schemesIndex) of stepsItem.schemes">
                        <div
                          class="item"
                          v-if="schemesItem.instruction"
                          :key="'n' + schemesIndex"
                          @click.stop="
                            clikSchemesItem(schemesItem, schemesIndex)
                          "
                        >{{ schemesItem.instruction }}</div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import pathInfoPop from '@/components/feature/gisModule/popUp/pathInfoPop.vue';
import PathAlsTabItem from '@/components/feature/GIS/GisPathAnalysis/PathAlsTabItem.vue';
import MapCommon from '@/util/MapCommon';
import { geocodeServer, districtServer } from '@/api/installServer';
import trafficTrafficControlVue from '../../gisModule/static/traffic.TrafficControl.vue';
@Component({
  name: 'GisPathAnalysis',
  components: { PathAlsTabItem },
  mixins: [MapCommon],
})
export default class GisPathAnalysis extends Vue {
  /**
   * 前突救援队伍历史轨迹起点信息
   * realTeamHistoryStart: 历史轨迹 起点名称
   * */
  public realTeamHistoryInfo: any = {
    realTeamName: '', // 救援队伍名称
    isRealTeame: false, // 是否是前突队伍显示历史轨迹信息 默认是false (开发暂时是true)
    realTeamHistoryName: '', // 前途队伍的历史起点
    // realTeamHistoryHour: 0, // 经过多少小时
    realTeamHistoryStartTime: '', // 起始时间
    realTeamHistoryEndTime: '', // 结束时间
    historyOrbit: [], // 历史轨迹数组 信息
  };
  private pathInfoPop: any = null; // 弹窗
  private showRouteIcon: boolean = false; // 显示或隐藏路径规划弹出框缩小后的小图标
  private showRoutePopup: boolean = false; // 路径规划弹出框的显示
  private showTabActiveIcon: boolean = false; // 展出hover时的高亮图标
  private hoverTabActiveIcon: any = ''; // hover时的index
  private tabIndex: any = 0; // // 摩托化推进二级导航index
  private tabList: any = [
    // 摩托化推进二级导航
    {
      title: '常规路线',
      value: 0,
    },
    {
      title: '最短路径',
      value: 3,
    },
    {
      title: '不走高速',
      value: 1,
    },
  ];

  // 起点、终点输入区域
  private pathMainDatas: any = [
    {
      iconClass: 'preIcon startIcon',
      clickClass: 'icon-circle-plus',
      placeholder: '请输入起点或在地图上选点',
      inputKey: '',
      isClickOptions: false,
    },
    {
      iconClass: 'preIcon endIcon',
      clickClass: '',
      placeholder: '请输入终点或在地图上选点',
      inputKey: '',
      isClickOptions: false,
    },
  ];
  private backupDatas: any = [];

  // 交通工具一级tab区域
  private typeIndex: string = 'driving';
  private typeTabList1: any = {
    driving: {
      title: '驾车',
      value: 'driving',
      getPathDataFun: 'getData_driving', // 获得路径数据（点击按钮时调用的方法名）
      doWithResultPathDataFun: 'doWithPathResultData', // 对getPathDataFun返回数据处理的方法名
      tabList: [
        {
          title: '常规路线',
          value: 0,
        },
        {
          title: '最短路径',
          value: 3,
        },
        {
          title: '不走高速',
          value: 1,
        },
      ],
    },
  };
  private typeTabList: any = {
    driving: {
      title: '驾车',
      value: 'driving',
      getPathDataFun: 'getData_driving', // 获得路径数据（点击按钮时调用的方法名）
      doWithResultPathDataFun: 'doWithPathResultData', // 对getPathDataFun返回数据处理的方法名
      tabList: [
        {
          title: '常规路线',
          value: 0,
        },
        {
          title: '最短路径',
          value: 3,
        },
        {
          title: '不走高速',
          value: 1,
        },
      ],
    },
    bus: {
      title: '铁路',
      value: 'bus',
      getPathDataFun: 'getData_bus',
      doWithResultPathDataFun: 'doWithPathResultData_bus',
      strategy_incity: [
        // 同城
        {
          title: '推荐',
          value: 0,
        },
        {
          title: '少换乘',
          value: 1,
        },
        {
          title: '少步行',
          value: 2,
        },
        {
          title: '不坐地铁',
          value: 3,
        },
        {
          title: '时间短',
          value: 4,
        },
        {
          title: '地铁优先',
          value: 5,
        },
      ],
      strategy_intercity: [
        // 跨城
        {
          title: '推荐',
          value: 0,
        },
        {
          title: '出发早',
          value: 1,
        },
        // {
        //     title: '价格低',
        //     value: 2
        // }
      ],
      Trans_type_intercity: [
        // 	跨城交通方式策略
        {
          title: '火车优先',
          value: 0,
        },
        {
          title: '飞机优先',
          value: 1,
        },
        // {
        //     title: '大巴优先',
        //     value: 2
        // }
      ],
    },
    bus_air: {
      title: '航空',
      value: 'bus_air',
      getPathDataFun: 'getData_bus',
      doWithResultPathDataFun: 'doWithPathResultData_bus',
      strategy_intercity: [
        // 跨城
        {
          title: '推荐',
          value: 0,
        },
        {
          title: '出发早',
          value: 1,
        },
        // {
        //     title: '价格低',
        //     value: 2
        // }
      ],
      Trans_type_intercity: [
        // 	跨城交通方式策略
        {
          title: '火车优先',
          value: 0,
        },
        {
          title: '飞机优先',
          value: 1,
        },
        // {
        //     title: '大巴优先',
        //     value: 2
        // }
      ],
    },
  }; // 除前突队伍的tablist
  private realTeamTypeTabList: any = {
    driving: {
      title: '驾车',
      value: 'driving',
      getPathDataFun: 'getData_driving', // 获得路径数据（点击按钮时调用的方法名）
      doWithResultPathDataFun: 'doWithPathResultData', // 对getPathDataFun返回数据处理的方法名
      tabList: [
        {
          title: '常规路线',
          value: 0,
        },
        {
          title: '最短路径',
          value: 3,
        },
        {
          title: '不走高速',
          value: 1,
        },
      ],
    },
    walking: {
      title: '驮行',
      value: 'walking',
      getPathDataFun: 'getData_walking',
      doWithResultPathDataFun: 'doWithPathResultData',
    },
  }; // 针对前突队伍的tablist
  private sendPathNodeInfo: any = []; // 路径节点信息
  private loadingState: boolean = false; // 查询状态
  private errPanel: boolean = false; // 是否展示查无路线面板
  private clickMoreState: boolean = false; // 点击查看更多
  private addButtonFlag: boolean = true; // 增加路径点按钮标志位
  private showBottomPathDetailFlag: boolean = false; // 展出底部路径详情数据
  private addPathNodeNum: any = 0; // 增加的中间点路径的数量
  private currentIndex: any = -1; // 当前选择的输入框的index
  private resultLength: any = 0; // 总里程数
  private resNeedHour: any = ''; // 预计所需小时数
  private resNeedMinute: any = ''; // 预计所需分钟数
  private resArriveTime: any = ''; // 预计到达时间
  private pathanalysislist: any = []; // 路径的列表数据
  private inputOptions: any = []; // input框模糊搜索匹配的列表
  private msg: any = '';
  private curInputIndex: number = -1; // 哪个input框显示关闭按钮
  private toReverseFlag = true;
  private listHeight: number = 0;
  private isHave: boolean = false;
  // 公交专用数据
  private curBusObjData: any = {
    isCityCross: true, // 是否同城,true 同城
    tabList: this.typeTabList.bus.strategy_incity,
    parentTabList: [],
    curTabItem: this.typeTabList.bus.strategy_incity[0],
    curParentTabItem: this.typeTabList.bus.Trans_type_intercity[0],
    curSamePathObj: {
      // 同城
      pathResult: [], // 列表数据
      curPathIndex: -1, // 当前点开的详情的数组下标索引,
      curPathIndexForHover: 0, // 因为详情有展开收起状态，但是hover需要一直保持，所以特意写一个标志位，操作当前方案的急活状态。和地图的路线一致
    },
    curCrossPathObj: {
      pathResult: [], // 列表数据
      curPathIndex: 0, // 当前点开的路径方案总览的路线数组下标索引
      curStepIndex: -1, // 当前方案下的第几个step，和curPathIndex结合用来展示详情
    },
  };
  private isShowHistory: boolean = false; // 是否显示历史轨迹信息

  public showPopView() {
    // 点击路径规划icon显示弹框
    this.showRoutePopup = true;
    this.showRouteIcon = false;
  }

  public miniPopView() {
    // 最小化路径规划弹框
    // // 如果是半屏
    // if (this.$store.state.controlMoudle.screen2rdFlag)
    // {

    // }
    this.showRouteIcon = true;
    this.showRoutePopup = false;
  }

  // ----------tab切换事件----------------
  public toTabItemClick(item: any, index: any) {
    this.tabIndex = index;
    this.toSearchPath(true);
  }

  public closePopView() {
    // 关闭路径规划弹框视图
    // 显示救援队伍详情窗, 点击路径规划的时候隐藏的
    this.messsageBus.emit('showRescueTeam', true);
    // this.messsageBus.off('showRescueTeam');
    this.messsageBus.emit('showTeamInfo', true);
    this.messsageBus.off('showTeamInfo');
    (this.getTrackComponent() as any).off('finish');
    // 关闭的时候清空历史轨迹
    this.stophistory();
    this.clearRealTimeRoute(); // 清空实时轨迹
    // 如果没有完整的路径就清除
    if (!this.pathMainDatas[this.pathMainDatas.length - 1].inputKey) {
      this.getComponent().clearRouteById(this.realTeamHistoryInfo.id, 0);
      this.backupDatas.forEach((item: any, index: number) => {
        if (item.realTeamHistoryInfo.id === this.realTeamHistoryInfo.id) {
          this.backupDatas.splice(index, 1);
        }
      });
    }
    if (!this.pathMainDatas[0].inputKey) {
      this.getComponent().clearRouteById(this.realTeamHistoryInfo.id, 1);
      this.backupDatas.forEach((item: any, index: number) => {
        if (item.realTeamHistoryInfo.id === this.realTeamHistoryInfo.id) {
          this.backupDatas.splice(index, 1);
        }
      });
    }
    if (
      this.pathMainDatas[0].inputKey === ' ' ||
      this.pathMainDatas[1].inputKey === ' '
    ) {
      this.getComponent().clearPopup();
      this.getComponent().clear();
    }
    // 恢复默认数据
    this.initData();
    // G.modules.PathAnalysisModule.onClose(); // 调用gis的关闭方法
    // this.getComponent().clear(); // 调用gis的关闭方法
  }

  public mouseOverShowIconBg(item: any) {
    // 鼠标移入展出active icon
    // if (this.typeIndex === item.value) {
    //   return;
    // }
    this.hoverTabActiveIcon = item.value;
    this.showTabActiveIcon = true; // 展出active icon
  }

  public mouseLeaveCancelIconBg() {
    // 鼠标移出隐藏active icon
    this.hoverTabActiveIcon = '';
    this.showTabActiveIcon = false; // 隐藏active icon
  }

  public mouseLeaveCancelBtn(index: any) {
    // 鼠标移出隐藏input框关闭按钮
    // this.showCancelBtnState = false
    this.curInputIndex = -1;
  }

  public mouseOverShowBtn(index: any) {
    // 鼠标移出显示input框关闭按钮
    // this.showCancelBtnState = true
    this.curInputIndex = index;
  }

  // ----------路径规划类型tab切换事件----------------
  public toTypeTabItemClick(item: any) {
    if (this.typeIndex === item.value) {
      return;
    }
    this.showTabActiveIcon = false;
    this.typeIndex = item.value;
    if (item.title === '铁路') {
      this.$set(this.curBusObjData, 'curParentTabItem', {
        title: '火车优先',
        value: 0,
      });
    } else if (item.title === '航空') {
      this.$set(this.curBusObjData, 'curParentTabItem', {
        title: '飞机优先',
        value: 1,
      });
    }
    this.onChange(this.typeIndex);
    this.toSearchPath(true);
    this.getComponent().removeMidPoints();
  }

  // typeIndex改变，即选项卡切换成功
  public onChange(val: string) {
    const self: any = this;
    this.showBottomPathDetailFlag = false; // 切换按钮时隐藏底部内容框
    this.tabList = [];
    this.tabIndex = 0;
    this.tabList = this.typeTabList[val].tabList
      ? this.typeTabList[val].tabList
      : [];
    if (self['init_' + val]) {
      self['init_' + val](val);
    }
  }

  /**
   * 历史轨迹信息
   * 前突队伍信息全部都是详情窗传下来的  realTeamHistoryInfo 内部包含所有
   * realTeamName 救援队伍名称
   * isRealTeame 是否是前突队伍显示历史轨迹信息 默认是false
   * realTeamHistoryName 前途队伍的历史起点
   * // realTeamHistoryHour 经过多少小时  不显示
   * realTeamHistoryStartTime 起始时间
   * realTeamHistoryEndTime 结束时间
   * historyOrbit 历史轨迹数组 信息
   * */
  // 播放历史轨迹
  public playHistory() {
    const self: any = this;
    const trackComponent: any = self.getTrackComponent();
    trackComponent.play(self.realTeamHistoryInfo.historyOrbit);
    trackComponent.off('finish');
    trackComponent.on('finish', (data: any) => {
      // 播放完成后的接收事件
    });
  }

  // 关闭历史轨迹播放
  public stophistory() {
    const self: any = this;
    if (
      self.realTeamHistoryInfo.historyOrbit &&
      self.realTeamHistoryInfo.historyOrbit.length > 0
    ) {
      const trackComponent: any = self.getTrackComponent();
      trackComponent.finish();
      trackComponent.unload();
    }
  }
  public clearRealTimeRoute() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewTeam',
    );
    component.clearRealTimeLayer();
  }
  public getRealTimeteamCom() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewTeam',
    );
    return component;
  }
  // 历史轨迹地图组件
  public getTrackComponent(): void {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('historyTrack');
    }
    return component;
  }

  // 获取步行数据
  public getData_walking(options: any) {
    this.getComponent()
      .queryPath_walking(options)
      .then((res: any) => {
        this.loadingState = false;
        this.doWithPathResultData(res);
      })
      .catch((err: any) => {
        this.loadingState = false;
        console.error(err);
      });
  }

  // 因为摩托化推进可以选择途径点，所以在和其它几个进行来回切换的时候，需要将这部分进行处理
  public init_specailAddPath() {
    this.addButtonFlag = false;
    this.addPathNodeNum = 0;
    if (this.pathMainDatas.length > 2) {
      const list = [
        this.pathMainDatas[0],
        this.pathMainDatas[this.pathMainDatas.length - 1],
      ];
      this.pathMainDatas = list;
    }
  }

  // 还原步行默认设置
  public init_walking(val: any) {
    this.init_specailAddPath();
  }

  // 还原公交类型的默认参数 回到最初设置
  public init_bus(val: any) {
    this.init_specailAddPath();
    // 公交专用数据
    this.curBusObjData = {
      isCityCross: true, // 是否同城,true 同城
      tabList: this.typeTabList.bus.strategy_incity,
      parentTabList: [],
      curTabItem: this.typeTabList.bus.strategy_incity[0],
      curParentTabItem: this.typeTabList.bus.Trans_type_intercity[0],
      curSamePathObj: {
        // 同城
        pathResult: [], // 列表数据
        curPathIndex: -1, // 当前点开的详情的数组下标索引,
        curPathIndexForHover: 0, // 因为详情有展开收起状态，但是hover需要一直保持，所以特意写一个标志位，操作当前方案的急活状态。和地图的路线一致
      },
      curCrossPathObj: {
        pathResult: [], // 列表数据
        curPathIndex: 0, // 当前点开的路径方案总览的路线数组下标索引
        curStepIndex: -1, // 当前方案下的第几个step，和curPathIndex结合用来展示详情
      },
    };
  }

  // 还原摩托化推进类型的默认参数 回到最初设置
  public init_driving() {
    this.addButtonFlag = true;
  }

  // ---------路径节点翻转事件--------------
  public toReverse() {
    this.toReverseFlag = !this.toReverseFlag;
    let tempFlag = true; // 默认pathMainDatas这个数组的inputkey都有值
    this.pathMainDatas.forEach((item: any) => {
      if (!item.inputKey) {
        // 只要有一个没有值，就认为没有值
        tempFlag = false;
      }
    });

    if (!tempFlag) {
      // this.$alert('请至少输入一个起点或终点', '提示', {
      //     confirmButtonText: '确定',
      //     type: 'warning'
      // }).fail(() => {
      // })
      // return ;
    }
    this.pathMainDatas.reverse(); // 翻转input框
    this.pathMainDatas[0].iconClass = 'preIcon startIcon';
    this.pathMainDatas[0].clickClass = 'icon-circle-plus';
    this.pathMainDatas[this.pathMainDatas.length - 1].iconClass =
      'preIcon endIcon';
    this.pathMainDatas[this.pathMainDatas.length - 1].clickClass = '';
    this.getComponent().reversePoints(this.pathMainDatas);
    // 发请求
    // 这个tabindex参数在公交查询中没什么实质作用，true表示，不是点击那个放大镜的搜索按钮，取当前的参数
    this.toSearchPath(true);
  }

  // ----------搜索路径事件----------------
  /*
   * clickFlag 为true表示，不是从搜索按钮直接点击
   * */
  public toSearchPath(clickFlag: any) {
    /*判断input框的路径输入情况*/
    jQuery('.inputOptions').css('display', 'none');
    let goFlag = false;
    let nullFlag = false;
    this.sendPathNodeInfo = [];
    // 如果有空值 退出
    this.pathMainDatas.forEach((item: any, index: any) => {
      if (!item.inputKey) {
        /*注释掉这部分是因为：当没有 输入路径的时候，直接切换顶部，也会弹出提示框，与需求不符*/
        // this.$alert('请输入位置', '提示', {
        //     confirmButtonText: '确定',
        //     type: 'warning'
        // }).fail(() => {
        //
        // })
        nullFlag = true;
      }
      if (nullFlag) {
        return;
      }

      if (!item.isClickOptions) {
        // 地址不正确
        this.$alert('未找到相关地点', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        })
          .then(() => {
            this.dealPathMainDatas({}, index, false, '');
          })
          .catch(() => {
            console.log('111111111');
          });
        goFlag = true;
      }
      if (goFlag) {
        return;
      }

      this.sendPathNodeInfo.push(
        JSON.parse(
          JSON.stringify({
            lat: item.location.lat,
            lon: item.location.lon,
            inputKey: item.inputKey,
            id: item.id,
          }),
        ),
      );
    });

    if (!goFlag && !nullFlag) {
      if (!clickFlag) {
        // 当if为真，代表是从搜索按钮点击进来的，那么要还原默认值
        this.onChange(this.typeIndex);
      }
      this.getPathAnalysisDatas(
        this.sendPathNodeInfo,
        this.tabIndex,
        clickFlag,
      );
    }
  }

  // 处理起点终点index问题
  public hanldeEndPointIndex(index: number, add: boolean) {
    // 处理GIS返回数据
    if (index === 1 && !add) {
      return this.pathMainDatas.length - 1;  // 返回数据为终点
    } else if (index === this.pathMainDatas.length - 1 && add) {
      return 1; // index为1时，代表终点
    } else if (index !== 0) {
      // 构造GIS请求数据
      return add ? index + 1 : index - 1;
    } else {
      return index;
    }
  }

  // 处理路径的主数据
  public dealPathMainDatas(
    location: any,
    index: any,
    flag: any,
    inputKey: any,
  ) {
    index = this.hanldeEndPointIndex(index, false); // 处理起点终点index问题
    // 更新一次之后更新初始化留下的坐标信息
    this.pathMainDatas[index].lat = location.lat; // 更新老坐标
    this.pathMainDatas[index].lon = location.lon; // 更新老坐标
    this.pathMainDatas[index].inputKey = inputKey.replace('山东省烟台市', ''); // 更新地址
    this.pathMainDatas[index].location = location; // 这个是新坐标
    this.pathMainDatas[index].isClickOptions = flag;
    // 如果有起点、终点就保存数据,没有就清除储存的对应的数据
    if (
      this.pathMainDatas[this.pathMainDatas.length - 1].inputKey &&
      this.pathMainDatas[0].inputKey
    ) {
      this.backup();
    } else {
      this.backupDatas.forEach((item: any, i: number) => {
        if (item.realTeamHistoryInfo.id === this.realTeamHistoryInfo.id) {
          this.backupDatas.splice(i, 1);
        }
      });
    }
  }
  // 保存数据, 点击路径返回面板的时候用
  public backup() {
    const obj: any = {};
    obj.realTeamHistoryInfo = this.realTeamHistoryInfo;
    obj.pathMainDatas = [...this.pathMainDatas];
    if (this.backupDatas.length) {
      const arr = this.backupDatas.filter((item: any) => {
        return item.realTeamHistoryInfo.id !== this.realTeamHistoryInfo.id;
      });
      arr.push(obj);
      this.backupDatas = arr;
    } else {
      this.backupDatas.push(obj);
    }
  }
  // -----------获取路径规划数据------------------------
  // tabClickFlag 公交时，是从搜索按钮点击还是从其他位置点击，即表示，是否需要还原公交的列表的tab激活项
  public getPathAnalysisDatas(opts: any, tabIndex: any, tabClickFlag: any) {
    const self: any = this;
    if (opts && opts.length > 0) {
      let options: any;
      options = {
        stops: opts,
        style: tabIndex,
      };
      this.loadingState = true;
      this.errPanel = false;
      options.clickMoreState = this.clickMoreState;
      self[this.typeTabList[this.typeIndex].getPathDataFun](
        options,
        tabClickFlag,
      );
    }
  }

  // 将从通用接口获得的起点终点的数组的options进行重组，以适用公交
  // tabClickFlag 不为true时，表示从搜索按钮点击过来的。要把参数还原到走默认参数
  public getBusNewParamFromOldParam(options: any, tabClickFlag: any) {
    const newOptions: any = {};
    newOptions.stops = options.stops;
    // 对同城和跨城分别进行参数处理
    const crossFlag = this.curBusObjData.isCityCross; // true代码同城
    if (crossFlag) {
      newOptions.strategy_incity = this.curBusObjData.curTabItem.value;
    } else {
      newOptions.strategy_intercity = this.curBusObjData.curTabItem.value;
      newOptions.Trans_type_intercity = this.curBusObjData.curParentTabItem.value;
    }
    return newOptions;
  }

  /**
   * tabClickFlag 为true 表示从路径面板的切换按钮点过来的
   * */
  public doWithPathResultData_bus(res: any, tabClickFlag: any) {
    if (this.doWithResponeErr(res.error, null)) {
      return;
    }

    if (this.doWithResponeErr(!res.routes || !res.routes.length, true)) {
      return;
    }

    // jQuery('.pathAnalysisWrap').css('display', 'block');
    this.showBottomPathDetailFlag = true;
    const crossFlag = res.destination.city_name === res.origin.city_name;
    const tabList = crossFlag
      ? this.typeTabList.bus.strategy_incity
      : this.typeTabList.bus.strategy_intercity;
    const parentTabList = crossFlag
      ? []
      : this.typeTabList.bus.Trans_type_intercity;
    this.curBusObjData.isCityCross = crossFlag; // 是否同城
    this.curBusObjData.tabList = tabList;
    this.curBusObjData.parentTabList = parentTabList;
    this.curBusObjData.curTabItem = tabClickFlag
      ? this.curBusObjData.curTabItem
      : tabList[0];
    this.curBusObjData.curParentTabItem =
      parentTabList.length && tabClickFlag
        ? this.curBusObjData.curParentTabItem
        : parentTabList[0];
    if (crossFlag) {
      this.getSameCityObj(res);
    } else {
      this.getCrossCityObj(res);
    }
  }

  /*得到同城的路径*/
  public getSameCityObj(res: any) {
    const resultArr: any = [];
    res.routes.forEach((item: any, index: any) => {
      const obj: any = {};
      const busArr: any = [];
      let walkDis: any = 0;
      obj.distance = item.distance;
      obj.duration = item.duration;
      obj.price = item.price;
      obj.steps = item.steps;
      obj.price_detail = item.price_detail;
      obj.realSteps = [];

      item.steps.forEach((sitem: any, sindex: any) => {
        const stepsItem = {
          schemes: [],
        };
        sitem.schemes.forEach((ssitem: any, ssindex: any) => {
          ssitem.vehicle_info.type === 5
            ? (walkDis += ssitem.distance)
            : busArr.push(ssitem.vehicle_info.detail.name);
          // (ssitem.vehicle_info.type === 5) && (walkDis += ssitem.distance);
          // (ssitem.vehicle_info.type !== 5) && (busArr.push(ssitem.vehicle_info.detail.name));
        });
      });
      obj.busArr = busArr;
      obj.walkDis = walkDis;
      resultArr.push(obj);
    });
    this.curBusObjData.curSamePathObj.pathResult = resultArr;
    this.curBusObjData.curSamePathObj.curPathIndex = -1;
    this.curBusObjData.curSamePathObj.curPathIndexForHover = 0;
  }
  /*得到跨城路径*/
  public getCrossCityObj(res: any) {
    const stepOverviewArr = [];
    console.log(res, '跨城res');
    res.routes.forEach((ritem: any, rindex: any) => {
      ritem.steps.forEach((rsitem: any, rsindex: any) => {
        if (rsindex === 0) {
          // step 0
          const stepOverviewObj = {
            start_location: this.pathMainDatas[0].inputKey,
            // 本step的终点，当最后一个schemes的vehicle_info.detail有值，那么就是非步行，则取arrive_station或者off_station（公交和其它交通工具不一样）
            //
            end_location: rsitem.schemes[rsitem.schemes.length - 1].vehicle_info
              .detail
              ? rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail
                  .arrive_station ||
                rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail
                  .on_station
              : ritem.steps[1].schemes[0].vehicle_info.detail
                  .departure_station ||
                ritem.steps[1].schemes[0].vehicle_info.detail.off_station,
            duration: 0,
          };
          rsitem.schemes.forEach((rssitem: any, rssindex: any) => {
            stepOverviewObj.duration += rssitem.duration;
          });
          rsitem.stepOverviewObj = stepOverviewObj;
        } else if (rsindex === ritem.steps.length - 1) {
          const stepOverviewObj2 = {
            // 先从本step的schemes[0]的detail中拿值，如果是步行，则从上一个step的最后一个scheme拿值
            start_location: rsitem.schemes[0].vehicle_info.detail
              ? rsitem.schemes[0].vehicle_info.detail.arrive_station ||
                rsitem.schemes[0].vehicle_info.detail.arrive_station
              : ritem.steps[ritem.steps.length - 2].schemes[
                  ritem.steps[ritem.steps.length - 2].schemes.length - 1
                ].vehicle_info.detail.arrive_station ||
                ritem.steps[ritem.steps.length - 2].schemes[
                  ritem.steps[ritem.steps.length - 2].schemes.length - 1
                ].vehicle_info.detail.on_station,
            end_location: this.pathMainDatas[this.pathMainDatas.length - 1]
              .inputKey,
            duration: 0,
          };
          rsitem.schemes.forEach((rssitem: any, rssindex: any) => {
            stepOverviewObj2.duration += rssitem.duration;
          });
          rsitem.stepOverviewObj = stepOverviewObj2;
        } else {
          const stepOverviewObj3 = {
            start_location: rsitem.schemes[0].vehicle_info.detail
              ? rsitem.schemes[0].vehicle_info.detail.departure_station ||
                rsitem.schemes[0].vehicle_info.detail.off_station
              : ritem.steps[rsindex - 1].schemes[
                  ritem.steps[rsindex - 1].schemes.length - 1
                ].vehicle_info.detail.arrive_station ||
                ritem.steps[rsindex - 1].schemes[
                  ritem.steps[rsindex - 1].schemes.length - 1
                ].vehicle_info.detail.on_station,
            end_location: rsitem.schemes[rsitem.schemes.length - 1].vehicle_info
              .detail
              ? rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail
                  .arrive_station ||
                rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail
                  .on_station
              : ritem.steps[rsindex + 1].schemes[0].vehicle_info.detail
                  .off_station ||
                ritem.steps[rsindex + 1].schemes[0].vehicle_info.detail
                  .departure_station,
            duration: 0,
          };
          rsitem.schemes.forEach((rssitem: any, rssindex: any) => {
            stepOverviewObj3.duration += rssitem.duration;
          });
          rsitem.stepOverviewObj = stepOverviewObj3;
        }
      });
    });
    this.curBusObjData.curCrossPathObj.pathResult = res.routes;
    this.curBusObjData.curCrossPathObj.curPathIndex = 0;
  }

  // -----------获取摩托化推进数据------------------------
  public getData_driving(options: any) {
    this.getComponent().clearRouteById(this.realTeamHistoryInfo.id);
    const self: any = this;
    self
      .getComponent()
      .queryPath(options)
      .then((res: any) => {
        self.loadingState = false;
        // 设置列表高度
        self.listHeight =
          626 - (this.$refs.pathDetail as HTMLElement).offsetHeight;
        // 处理摩托化推进的数据
        self.doWithPathResultData(res);
      })
      .catch((err: any) => {
        self.loadingState = false;
        self.$message.error('路径规划服务调用失败: ' + err.message);
        console.error(err);
      });
  }
  // -----------获取公共交通推进数据------------------------
  public getData_bus(options: any, tabClickFlag: any) {
    this.getComponent().clearRouteById(this.realTeamHistoryInfo.id);
    const newOptions = this.getBusNewParamFromOldParam(options, tabClickFlag);
    this.getComponent()
      .queryPath_bus(newOptions)
      .then((res: any) => {
        this.doWithPathResultData_bus(res, tabClickFlag);
      })
      .catch((err: any) => {
        this.$message.error('路径规划服务调用失败: ' + err.message);
        console.error(err);
      });
    // .fail((err: any) => {
    //     this.doWithResponeErr(err, null);
    // });
  }

  /**
   * 输入框点击监听，开启绘制点事件
   * @param item
   * @param index
   */
  public inputClick(item: any, index: any) {
    item.position = index;
    // item 传给gis 后会直接修改数组内的字段信息  里面的location 坐标会被更新 但是 数组内记录初始化坐标的lat lon 不会改变
    this.getComponent().startSelectPoint(item);
  }

  // -------点击路径节点前面的图标--------
  public toClickPreIcon(item: any, index: any) {
    item.index = this.hanldeEndPointIndex(index, true);  // 处理起点终点index问题
    item.position = item.index;
    if (!item.position && item.position !== 0) {
      item.position = this.realTeamHistoryInfo.count;
      this.realTeamHistoryInfo.count++;
    }
    this.getComponent().startSelectPoint(item);
  }

  // ---------input监听事件-----------------
  public inputWatch(item: any, index: any) {
    this.currentIndex = index;
    // item.inputKey = item.inputKey.trim();
    // 如果修改了input 模糊搜索对应信息
    if (item.inputKey) {
      // 获取搜索的结果
      this.getInputOptionDatas(item.inputKey);
    } else {
      // 否则清空
      // item.position = index;
      // 清空点位
      // this.getComponent().removePoint(item);
      this.getComponent().clearRouteById(
        this.realTeamHistoryInfo.id,
        item.position,
      ); // 清除路径
      // let tempNum = 0;
      // 隐藏模糊搜索结果
      jQuery('.inputOptions').fadeOut();
      // 如果没有信息 清空所有坐标点位信息
      this.pathMainDatas.map((ele: any) => {
        if (!ele.inputKey) {
          this.dealPathMainDatas({}, index, false, '');
          // tempNum++;
        }
      });
      /*
      if (tempNum === this.pathMainDatas.length) {
        // jQuery('.pathAnalysisWrap').fadeOut();
        this.showBottomPathDetailFlag = false;
      }*/
    }
  }

  // ----------input输入请求数据----------------
  public getInputOptionDatas(val: any) {
    const self = this;
    // const options = { page: 1, keyword: val, page_size: 10 };
    const opt = {
      keyWord: val,
    };
    geocodeServer
      .getSearchRecommendation(opt)
      .then((res: any) => {
        jQuery('.inputOptions').css('display', 'block');
        this.showBottomPathDetailFlag = false;
        if (res.result.baidu.suggests) {
          self.inputOptions = res.result.baidu.suggests;
        } else {
          this.msg = res.msg;
        }
      })
      .catch((err: any) => {
        self.$message.error(err.message);
        console.error(err.message);
      });
    // this.getComponent()
    //   .queryPoi(options)
    //   .then((res: any) => {
    //     jQuery('.inputOptions').css('display', 'block');
    //     // jQuery('.pathAnalysisWrap').css('display', 'none');
    //     this.showBottomPathDetailFlag = false;
    //     if (res.msg) {
    //       this.msg = res.msg;
    //     } else {
    //       self.inputOptions = res.pois;
    //     }
    //   })
    //   .catch((err: any) => {
    //     self.$message.error(err.message);
    //     console.error(err.message);
    //   });
  }
  // ----------input点击事件----------------
  public inputOptionClick(item: any) {
    let dataList: any = '';
    geocodeServer
      .getEGISAddressByKeyword({ keyWord: item.address })
      .then((res: any) => {
        if (res.length >= 1) {
          dataList = res[0];
        } else {
          dataList = res;
        }
        if (dataList.type === 3) {
          this.dealPathMainDatas(
            dataList.pathPlanLocation,
            this.currentIndex,
            true,
            dataList.address,
          );
        } else {
          this.dealPathMainDatas(
            dataList.pathPlanLocation,
            this.currentIndex,
            true,
            dataList.cityaddress,
          );
        }
        this.getComponent().clearRouteById(
          this.realTeamHistoryInfo.id,
          this.currentIndex,
        ); // 清除路径
        this.getComponent().addPoint(this.pathMainDatas[this.currentIndex]);
        this.toSearchPath(false);
      });
    jQuery('.inputOptions').fadeOut();
  }

  // -------路径内部icon添加、删除事件-----------
  public handleIconClick(item: any, index: any) {
    if (item.clickClass === 'icon-circle-plus') {
      if (this.addPathNodeNum === 5) {
        return;
      }
      this.addPathNodeNum++;
      this.pathMainDatas.splice(this.pathMainDatas.length - 1, 0, {
        iconClass: 'preIcon stopIcon',
        clickClass: 'icon-remove',
        placeholder: '请输入途经点',
        inputKey: '',
        isClickOptions: false,
      });
    }
    if (item.clickClass === 'icon-remove') {
      if (this.pathMainDatas[index].isClickOptions) {
        console.log(item, index);
      }
      item.index = item.position; // 处理起点终点index问题
      this.getComponent().removeMidPoints(
        this.realTeamHistoryInfo.id,
        item.index,
      );
      this.pathMainDatas.splice(index, 1);
      this.addPathNodeNum--;
    }
    this.$nextTick(() => {
      // 设置列表高度
      this.listHeight =
        626 - (this.$refs.pathDetail as HTMLElement).offsetHeight;
    });
  }

  public cancelInputValue(item: any, index: any) {
    const obj = item;
    obj.inputKey = '';
    // this.inputWatch(obj, index);
  }

  /**
   * 点击跨城方案总览的item
   * */
  public clickRouteItemOverview(item: any, index: any) {
    if (this.curBusObjData.curCrossPathObj.curPathIndex === index) {
      this.curBusObjData.curCrossPathObj.curPathIndex = -1;
      return;
    }
    this.getComponent().showBusRoute(item.steps);
    this.curBusObjData.curCrossPathObj.curPathIndex = index;
  }

  /**
   * 点击公交的tab
   */
  public toBusTabItemClick(item: any, index: any) {
    if (this.curBusObjData.curTabItem.value === item.value) {
      return;
    }
    this.curBusObjData.curTabItem = item;
    this.toSearchPath(true);
  }

  /**
   * 切换跨城 tab 火车 飞机的那个
   * */
  public clickCrossTypeTabItem(item: any, index: any) {
    if (this.curBusObjData.curParentTabItem.value === item.value) {
      return;
    }
    this.curBusObjData.curParentTabItem = Object.assign({}, item); // jQuery.extend(true, {}, item);
    const tabList = this.curBusObjData.isCityCross
      ? this.typeTabList.bus.strategy_incity
      : this.typeTabList.bus.strategy_intercity;
    this.curBusObjData.curTabItem = tabList[0];
    // true 表示不是从搜索按钮点击的
    this.toSearchPath(true);
  }

  /**
   * 点击当前展开的方案下，step的详情 Span 文字详情，只展示前端面板
   * */
  public clickStepItemSpan(stepsItem: any, stepsIndex: any) {
    if (this.curBusObjData.curCrossPathObj.curStepIndex === stepsIndex) {
      this.curBusObjData.curCrossPathObj.curStepIndex = -1;
      return;
    }
    this.curBusObjData.curCrossPathObj.curStepIndex = stepsIndex;
  }

  /**
   * 点击当前展开的方案下，step的详情 地图的事件
   * */
  public clickStepItemDiv(stepsItem: any, stepsIndex: any) {
    if (this.curBusObjData.curCrossPathObj.curStepIndex === stepsIndex) {
      this.curBusObjData.curCrossPathObj.curStepIndex = -1;
      return;
    }
    this.getComponent().showBusRouteSchemes(stepsItem.schemes);
    this.curBusObjData.curCrossPathObj.curStepIndex = stepsIndex;
  }

  /**
   * 点击scheme的详情, 高亮线路
   * */
  public clikSchemesItem(schemesItem: any, schemesIndex: any) {
    this.getComponent().highlightBusRouteScheme(schemesItem.path);
  }

  // -------初始化地图交互的监听事件-----------
  public initMapEvents() {
    const self = this;
    let bStarted = false;
    this.getComponent().on('openDialog', (id: any) => {
      self.showRouteIcon = false;
      self.showRoutePopup = true;
      // 根据id 取出对应的数据，恢复面板
      self.backupDatas.forEach((item: any) => {
        if (item.realTeamHistoryInfo.id === id) {
          self.realTeamHistoryInfo = item.realTeamHistoryInfo;
          self.pathMainDatas = item.pathMainDatas;
        }
      });
      // self.realTeamHistoryInfo = self.backupDatas[0].realTeamHistoryInfo;
      // self.pathMainDatas = self.backupDatas[0].pathMainDatas;
      self.toSearchPath(true);
    });
    this.getComponent().on('closeDialog', (id: any) => {
      self.backupDatas.forEach((item: any, index: number) => {
        if (item.realTeamHistoryInfo.id === id) {
          self.backupDatas.splice(index, 1);
        }
      });
      // 如果删除的是当前面板，关闭面板
      if (self.realTeamHistoryInfo.id === id) {
        this.showRouteIcon = true;
        this.showRoutePopup = false;
        this.closePopView();
        this.pathMainDatas = [
          {
            iconClass: 'preIcon startIcon',
            clickClass: 'icon-circle-plus',
            placeholder: '请输入起点或在地图上选点',
            inputKey: ' ',
            isClickOptions: false,
          },
          {
            iconClass: 'preIcon endIcon',
            clickClass: '',
            placeholder: '请输入终点或在地图上选点',
            inputKey: ' ',
            isClickOptions: false,
          },
        ];
      }
    });
    // 监听清除所有路径事件
    this.getComponent().off('closeRoute');
    this.getComponent().on('closeRoute', function(data: any) {
      self.backupDatas = [];
    });
    // 起始点
    this.getComponent().off('dealPathMainDatasStart');
    this.getComponent().on('dealPathMainDatasStart', function(data: any) {
      /**
       * 写此处的意义  当换定位点后 搜索路径 会重新返回一个data,
       * 此data和之前点击坐标点的信息是一样的,
       * 但是同一坐标点的地点地址名称有很多,
       * 可能会改变input内地址名称,
       * 所以再此处添加阻止,
       * 上来inputkey 是空格,
       * 为了防止加载的时候起点终点回来的数据不是同时的,
       * 触发清空摩托化推进的常规信息 所以加了一个trim() 清除空格
       * */
      // 获取当前点位的信息
      const location: any = self.pathMainDatas[data.position] || null;
      // 此处应该是最新的坐标信息
      const inputLocation: any =
        self.pathMainDatas[data.position].location || null;
      // 当前的input里面的地址
      const inputKey: any = self.pathMainDatas[data.position].inputKey;
      // data传送来的最新的坐标
      const dataLocation: any = data.location;
      if (
        inputLocation && // 当前坐标信息是否存在
        dataLocation.lon === inputLocation.lon && // 新老坐标是否一致
        dataLocation.lon === location.lon && // 新老坐标是否一致
        dataLocation.lat === inputLocation.lat && // 新老坐标是否一致
        dataLocation.lat === location.lat && // 新老坐标是否一致
        inputKey.trim() // input内是否写有地址
      ) {
        // 判断现有的数据的坐标和新的是否一致,名称是否存在, 如果名称存在,且地址一致退出
        return;
      }
      // self.getComponent().clearRouteById(self.realTeamHistoryInfo.id); // 清除路径
      self.dealPathMainDatas(data.location, data.position, true, data.address);
      bStarted = true;
      // console.log(data, '起点')
    });
    // 途径点
    this.getComponent().off('dealPathMainDatasMiddle');
    this.getComponent().on('dealPathMainDatasMiddle', function(data: any) {
      const location: any = self.pathMainDatas[data.index] || null;
      const inputLocation: any =
        self.pathMainDatas[data.index].location || null;
      const inputKey: any = self.pathMainDatas[data.index].inputKey;
      const dataLocation: any = data.location;
      if (
        inputLocation &&
        dataLocation.lon === inputLocation.lon &&
        dataLocation.lon === location.lon &&
        dataLocation.lat === inputLocation.lat &&
        dataLocation.lat === location.lat &&
        inputKey.trim()
      ) {
        // 判断现有的数据的坐标和新的是否一致,名称是否存在, 如果名称存在,且地址一致退出
        return;
      }
      // self.getComponent().clearRouteById(self.realTeamHistoryInfo.id); // 清除路径
      self.dealPathMainDatas(data.location, data.index, true, data.address);
      // console.log(data, '途径点');
    });
    // 终点
    this.getComponent().off('dealPathMainDatasEnd');
    this.getComponent().on(
      'dealPathMainDatasEnd',
      function(data: any) {
        if (data.address === '') {
          return self.$message('地址选择错误，请重新选择！');
        }
        const location: any = self.pathMainDatas[data.position] || null;
        const inputLocation: any =
          self.pathMainDatas[data.position].location || null;
        const inputKey: any = self.pathMainDatas[data.position].inputKey;
        const dataLocation: any = data.location;
        if (
          inputLocation &&
          dataLocation.lon === inputLocation.lon &&
          dataLocation.lon === location.lon &&
          dataLocation.lat === inputLocation.lat &&
          dataLocation.lat === location.lat &&
          inputKey.trim()
        ) {
          // 判断现有的数据的坐标和新的是否一致,名称是否存在, 如果名称存在,且地址一致退出
          return;
        }
        // self
        // .getComponent()
        // .clearRouteById(self.realTeamHistoryInfo.id, data.position); // 清除路径
        if (bStarted) {
          // self.toSearchPath(false);
          self.dealPathMainDatas(
            data.location,
            data.position,
            true,
            data.address,
          );
          // console.log(data, '终点');
          self.toSearchPath(false);
          bStarted = false;
        } else {
          setTimeout(() => {
            // self.toSearchPath(false);
            self.dealPathMainDatas(
              data.location,
              data.position,
              true,
              data.address,
            );
            // console.log(data, '终点');
            self.toSearchPath(false);
            bStarted = false;
          }, 1000);
        }
      }.bind(this),
    );

    this.getComponent().off('querypathMoreInfo');
    this.getComponent().on('querypathMoreInfo', function(data: any) {
      self.getComponent().clearPopup();
      self.clickMoreState = true;
      self.typeIndex = 'driving';
    });

    // 这里打开小弹窗 (gis发来的数据);
    // this.getComponent().off('querypathPopupOpen');
    // this.getComponent().on('querypathPopupOpen', function(event: any) {
    //   // 弹窗打开的监听事件
    //   if (!self.realTeamHistoryInfo.isRealTeame) {
    //     self.onShowPopup(event);
    //   }
    // });
    // this.getComponent().on('Close_Router', function(event: any) { // 弹窗关闭的监听事件
    //   self.closePopView();
    // });
    this.getComponent().off('error');
    this.getComponent().on('error', function(err: any) {
      // 弹窗打开的监听事件
      self.$message.error(err.message);
      // console.error(err);
    });
  }

  // 判断是否展示路径规划面板
  // private get isShowPath() {
  //   return this.$store.getters.getShowPathPanel;
  // }

  /**
   * 初始化所有数据
   * ps: 防止遗留数据对下次造成影响这里没有卸载
   * */
  public initData(): void {
    this.typeTabList = {
      driving: {
        title: '驾车',
        value: 'driving',
        getPathDataFun: 'getData_driving', // 获得路径数据（点击按钮时调用的方法名）
        doWithResultPathDataFun: 'doWithPathResultData', // 对getPathDataFun返回数据处理的方法名
        tabList: [
          {
            title: '常规路线',
            value: 0,
          },
          {
            title: '最短路径',
            value: 3,
          },
          {
            title: '不走高速',
            value: 1,
          },
        ],
      },
      bus: {
        title: '铁路',
        value: 'bus',
        getPathDataFun: 'getData_bus',
        doWithResultPathDataFun: 'doWithPathResultData_bus',
        strategy_incity: [
          // 同城
          {
            title: '推荐',
            value: 0,
          },
          {
            title: '少换乘',
            value: 1,
          },
          {
            title: '少步行',
            value: 2,
          },
          {
            title: '不坐地铁',
            value: 3,
          },
          {
            title: '时间短',
            value: 4,
          },
          {
            title: '地铁优先',
            value: 5,
          },
        ],
        strategy_intercity: [
          // 跨城
          {
            title: '推荐',
            value: 0,
          },
          {
            title: '出发早',
            value: 1,
          },
          // {
          //     title: '价格低',
          //     value: 2
          // }
        ],
        Trans_type_intercity: [
          // 	跨城交通方式策略
          {
            title: '火车优先',
            value: 0,
          },
          {
            title: '飞机优先',
            value: 1,
          },
          // {
          //     title: '大巴优先',
          //     value: 2
          // }
        ],
      },
      bus_air: {
        title: '航空',
        value: 'bus_air',
        getPathDataFun: 'getData_bus',
        doWithResultPathDataFun: 'doWithPathResultData_bus',
        strategy_intercity: [
          // 跨城
          {
            title: '推荐',
            value: 0,
          },
          {
            title: '出发早',
            value: 1,
          },
          // {
          //     title: '价格低',
          //     value: 2
          // }
        ],
        Trans_type_intercity: [
          // 	跨城交通方式策略
          {
            title: '火车优先',
            value: 0,
          },
          {
            title: '飞机优先',
            value: 1,
          },
          // {
          //     title: '大巴优先',
          //     value: 2
          // }
        ],
      },
    };
    this.realTeamHistoryInfo = {
      realTeamName: '', // 救援队伍名称
      isRealTeame: false, // 是否是前突队伍显示历史轨迹信息 默认是false (开发暂时是true)
      realTeamHistoryName: '', // 前途队伍的历史起点
      // realTeamHistoryHour: 0, // 经过多少小时
      realTeamHistoryStartTime: '', // 起始时间
      realTeamHistoryEndTime: '', // 结束时间
      historyOrbit: [], // 历史轨迹数组  信息
    };
    this.isShowHistory = false;
    this.pathInfoPop = null;
    this.showRouteIcon = false;
    this.showRoutePopup = false;
    this.showTabActiveIcon = false;
    this.hoverTabActiveIcon = '';
    this.tabIndex = 0;
    // this.pathMainDatas = [
    //   {
    //     iconClass: 'preIcon startIcon',
    //     clickClass: 'icon-circle-plus',
    //     placeholder: '请输入起点或在地图上选点',
    //     inputKey: ' ',
    //     isClickOptions: false,
    //   },
    //   {
    //     iconClass: 'preIcon endIcon',
    //     clickClass: '',
    //     placeholder: '请输入终点或在地图上选点',
    //     inputKey: ' ',
    //     isClickOptions: false,
    //   },
    // ];
    this.tabList = [
      // 摩托化推进二级导航
      {
        title: '常规路线',
        value: 0,
      },
      {
        title: '最短路径',
        value: 3,
      },
      {
        title: '不走高速',
        value: 1,
      },
    ];
    this.typeIndex = 'driving';
    this.sendPathNodeInfo = [];
    this.loadingState = false;
    this.errPanel = false;
    this.clickMoreState = false;
    this.addButtonFlag = true;
    this.showBottomPathDetailFlag = false;
    this.addPathNodeNum = 0;
    this.currentIndex = -1;
    this.resultLength = 0;
    this.resNeedHour = '';
    this.resNeedMinute = '';
    this.resArriveTime = '';
    this.pathanalysislist = [];
    this.inputOptions = [];
    this.msg = '';
    this.curInputIndex = -1;
    this.curBusObjData = {
      isCityCross: true,
      tabList: this.typeTabList.bus.strategy_incity,
      parentTabList: [],
      curTabItem: this.typeTabList.bus.strategy_incity[0],
      curParentTabItem: this.typeTabList.bus.Trans_type_intercity[0],
      curSamePathObj: {
        pathResult: [],
        curPathIndex: -1,
        curPathIndexForHover: 0,
      },
      curCrossPathObj: {
        pathResult: [],
        curPathIndex: 0,
        curStepIndex: -1,
      },
    };
    this.pathMainDatas = [
      {
        iconClass: 'preIcon startIcon',
        clickClass: 'icon-circle-plus',
        placeholder: '请输入起点或在地图上选点',
        inputKey: '',
        isClickOptions: false,
      },
      {
        iconClass: 'preIcon endIcon',
        clickClass: '',
        placeholder: '请输入终点或在地图上选点',
        inputKey: '',
        isClickOptions: false,
      },
    ];

    // this.getComponent().clearPopup();
    // this.getComponent().clear();
  }
  /**
   * 当事件改变时 关闭当前弹窗恢复默认数据
   * */
  @Watch('$store.state.eventPushStore.eventId')
  public changeEventId() {
    this.closePopView();
  }

  // 在窗口关闭后恢复默认数据
  @Watch('showRoutePopup')
  public initDataList(val: boolean) {
    /**
     * 窗口是隐藏的, 且不是缩小的
     * */
    if (!val && !this.showRouteIcon) {
      this.initData();
    }
  }

  // 监听起点途径点终点数据,如果有空值则隐藏下部信息,清空距离时间
  @Watch('pathMainDatas', { deep: true })
  private isShowDownConfig(val: any[]): void {
    val.forEach((item: any) => {
      if (!item.inputKey) {
        this.showBottomPathDetailFlag = false; // 隐藏底部内容框
        this.resultLength = ''; // 总里程数
        this.resNeedHour = ''; // 预计所需小时数
        this.resNeedMinute = ''; // 预计所需分钟数
        this.resArriveTime = ''; // 预计到达时间
      }
    });
  }

  // 展出弹窗方法 (小弹窗)
  // private onShowPopup(event: any) {
  //   const data = event.data;
  //   const self = this;
  //   this.pathInfoPop = new pathInfoPop({
  //     el: '#routerPlan_toolTip',
  //     data() {
  //       return {
  //         type: 'path',
  //         data,
  //       };
  //     },
  //     methods: {
  //       close() {
  //         self.getComponent().clearPopup();
  //         self.getComponent().clear();
  //       },
  //     },
  //   });
  // }

  // -------处理路径的数据-----------
  private doWithPathResultData(res: any) {
    if (!this.doWithResponeErr(res.error, null)) {
      // res.error为false的时候，执行
      this.showBottomPathDetailFlag = true; // 显示隐藏的底部内容框
      this.pathanalysislist = res.road; // 路径列表数据? 暂时无用
      this.resultLength = res.length; // 总里程数
      this.resNeedHour = res.durationHourMinutes.hours; // 预计所需小时数
      this.resNeedMinute = res.durationHourMinutes.minutes; // 预计所需分钟数
      this.resArriveTime = res.enddate; // 预计到达时间
      // this.getComponent().addStartLocation(this.sendPathNodeInfo, this.pathanalysislist);
    }
  }
  // 对查询路线数据时，返回的res.error进行统一处理
  // err，是错误信息或者true
  // routeNullFlag,代表返回来的路线数据为空数组等，暂时用不到，预留
  private doWithResponeErr(err: any, routeNullFlag: any) {
    this.loadingState = false;
    if (err) {
      this.showBottomPathDetailFlag = true;
      this.errPanel = true;
      return true;
    }
    this.errPanel = false;
    return false;
  }

  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('routerPlan');
    return component;
  }

  private created() {
    // this.initMapEvents(); // 初始化地图的监听事件
    // this.showPathAnalysisModuleListening(); // 监听路径规划页面显示
  }

  private mounted() {
    const self: any = this;
    // 第一步,这里接收更多按钮,显示大弹窗  初始化数据
    self.resolveMap('map').then((data: any) => {
      self.initMapEvents(); // 初始化地图的监听事件
      // 第二步,初始化数据
    });
    // 监听点击路径规划更多按钮
    /*self.messsageBus.on('Show_PathAnalysis', (item: any) => {
      self.showRoutePopup = item; // 显示大弹窗
      /!**
       * 这里重新获取一遍路径信息,有时点小弹窗更多没有路径规划下部分路径信息
       * *!/
      // const data = {
      //   stops: self.pathMainDatas,
      // };
      // xself.getData_driving(data);
      // self.getComponent().clearPopup(); // 清除小弹窗
    });*/
    self.showPathAnalysisModuleListening(); // 监听路径规划页面显示
  }

  // 监听路径规划页面显示 第二部,初始化数据
  private showPathAnalysisModuleListening() {
    const vm = this;
    vm.messsageBus.off('Open_Router');
    vm.messsageBus.on('Open_Router', (item: any) => {
      // 监听bus总线,用来打开路径规划模块
      vm.showRoutePopup = true; // 监听打开路径规划的页面
      if (item.receidata) {
        // 如果已经是打开过保存了的，就直接恢复；
        vm.backupDatas.forEach((v: any) => {
          if (v.realTeamHistoryInfo.id === item.receidata.id) {
            vm.isHave = true;
            vm.realTeamHistoryInfo = { ...v.realTeamHistoryInfo };
            vm.pathMainDatas = v.pathMainDatas;
          }
        });
        if (vm.isHave) {
          vm.toSearchPath(true);
          vm.isHave = false;
          return;
        } else {
          vm.realTeamHistoryInfo = { ...item.receidata };
          vm.realTeamHistoryInfo.count = 1; // 添加计算字段，途经点position 需要使用；
        }
      }
      // console.log(vm.realTeamHistoryInfo, 'realTeamHistoryInfo');
      vm.pathMainDatas = vm.pathMainDatas.map((value: any, index: any) => {
        // 这里记录传过来的起点终点坐标
        // pathMainDatas里面  lat lon 储存的是点击事件后穿过来的初始起点终点坐标
        // 当更新点位后 更新lat lon点位信息 保证同点位不在更新地址名称 防止同点位 名称不同
        if (index === 0) {
          // console.log(item.startPoint[0]);
          // value.location = {'lat': item.startPoint[0], 'lon': item.startPoint[1]};
          value.lat = item.startPoint[1];
          value.lon = item.startPoint[0];
          value.id = vm.realTeamHistoryInfo.id;
          value.index = 0;
          value.position = 0;
        } else {
          // value.location = {'lat': item.endPoint[0], 'lon': item.endPoint[1]};
          // value.lat = item.endPoint[1];
          // value.lon = item.endPoint[0];
          // 路径规划终点暂时暴力写死
          value.lat =
            this.$store.state.eventPushStore.eventLocation.EventLat || '';
          value.lon =
            this.$store.state.eventPushStore.eventLocation.EventLon || '';
          value.id = vm.realTeamHistoryInfo.id;
        }
        return value;
      });
      /**
       * 现在大小弹窗都打开所以屏蔽
       * */
      // 看穿过来的type 判断是否打开大弹窗
      /*if (item.type === 0) { // 直接打开路径规划大窗口
        // vm.getComponent().clearPopup();
      } else if (item.type === 1) {  // 打开小窗口*/
      if (item.startPoint.length !== 0 && item.endPoint.length !== 0) {
        // 如果起点和终点都有
        // 类型恢复默认设置成摩托化推进
        /*vm.typeIndex = 'driving';*/
        this.toSearchPath(true);
        const data = {
          stops: vm.pathMainDatas,
        };
        // 设置路径节点信息, 主要是同城没有铁路航空信息
        vm.sendPathNodeInfo = vm.pathMainDatas;
        /**
         * 上来判断是否是前突队伍
         * 如果是前突队伍 则加载历史轨迹图层 并且判断历史轨迹数据是否存在 取最后一个点位当作路径规划的起点位置
         * 如果不是前突队伍则直接调取路径规划
         * */
        if (vm.realTeamHistoryInfo.isRealTeame) {
          // 如果是前突队伍则进入
          // 如果是前突队伍更换tablist
          vm.typeTabList = vm.realTeamTypeTabList;
          if (vm.realTeamHistoryInfo.historyOrbit.length > 0) {
            // 有数据进入
            const trackComponent: any = vm.getTrackComponent();
            // 加载历史轨迹 灰色的线
            trackComponent.load(
              vm.realTeamHistoryInfo.historyOrbit,
              null,
              'reportTime',
              true,
            );
            // 历史数据最新数据下标
            const index: number =
              vm.realTeamHistoryInfo.historyOrbit.length - 1;
            // 最新数据
            const lastData: any = vm.realTeamHistoryInfo.historyOrbit[index];
            // console.log(lastData, '历史轨迹');
            // 替换坐标点
            // data.stops[0].lon = lastData.longitude;
            // data.stops[0].lat = lastData.latitude;
            // data.stops[0].location = {
            //   lon: lastData.longitude,
            //   lat: lastData.latitude,
            // };
            vm.isShowHistory = true;
          }
          const realtimeteam: any = vm.getRealTimeteamCom();
          realtimeteam
            .getRealTeamLon(vm.realTeamHistoryInfo.teamid)
            .then((res: any) => {
              // 替换坐标点
              if (res.longitude && res.latitude) {
                data.stops[0].lon = res.longitude;
                data.stops[0].lat = res.latitude;
                data.stops[0].location = {
                  lon: res.longitude,
                  lat: res.latitude,
                };
              }
              (data as any).dontpan = true; // 前突队伍不缩放导航
              (data as any).isShowHistory = vm.isShowHistory;
              vm.getData_driving(data);
            });
        } else {
          // 处理摩托化推进的数据,渲染到下部的列表,公里数,剩余时间等
          vm.getData_driving(data);
        }
      } else if (item.startPoint.length === 0 && item.endPoint.length === 0) {
        // 没有起点 没有终点
        // 清空终点起点占位空格
        vm.pathMainDatas[0].inputKey = '';
        vm.pathMainDatas[1].inputKey = '';
      } else if (item.startPoint.length !== 0 && item.endPoint.length === 0) {
        // 有起点 没有终点
        // 没有终点 清空终点默认占位空格
        vm.pathMainDatas[1].inputKey = '';
        // const lonLat = {
        //   x: parseFloat(vm.pathMainDatas[0].lon),
        //   y: parseFloat(vm.pathMainDatas[0].lat),
        // };
        // vm.getComponent().request2(lonLat).then((res: any) => {
        //   vm.dealPathMainDatas({lon: res.x, lat: res.y}, 0, true, res.address);
        // });
        // 通过单点位置获取路径名称
        vm.getComponent().queryPoint(
          {
            lon: parseFloat(item.startPoint[0]),
            lat: parseFloat(item.startPoint[1]),
          },
          0,
        );
      } else if (item.startPoint.length === 0 && item.endPoint.length !== 0) {
        // 有终点 没有起点
        // 没有起点 清空起点默认占位空格
        vm.pathMainDatas[0].inputKey = '';
        // const lonLat = {
        //   x: parseFloat(vm.pathMainDatas[1].lon),
        //   y: parseFloat(vm.pathMainDatas[1].lat),
        // };
        // vm.getComponent().request2(lonLat).then((res: any) => {
        //   vm.dealPathMainDatas({lon: res.x, lat: res.y}, 1, true, res.address);
        // });
        // 通过单点位置获取路径名称
        this.getComponent().queryPoint(
          {
            lon: parseFloat(item.endPoint[0]),
            lat: parseFloat(item.endPoint[1]),
          },
          1,
        );
      }
      // this.initMapEvents(); 里面有监听事件 接收获取的路径名称  上来初始化结束
      // }
    });
    vm.messsageBus.off('Close_Router');
    vm.messsageBus.on('Close_Router', function(event: any) {
      // 弹窗关闭的监听事件
      vm.closePopView();
    });
    vm.messsageBus.off('leftMapPanelMutexContrary');
    vm.messsageBus.on('leftMapPanelMutexContrary', function(event: any) {
      // 左侧列表打开关闭弹窗
      vm.closePopView();
    });
  }
  private beforeDestroy() {
    // 卸载删除监听
    const self: any = this;
    self.messsageBus.off('Close_Router');
    self.messsageBus.off('Open_Router');
    self.messsageBus.off('Show_PathAnalysis');
    self.messsageBus.off('showTeamInfo');
    self.getTrackComponent.off('finish');
  }
}
</script>
<style lang="less" scoped>
@imgPath: '../../../../assets/img/gisModule/pathAnalysis';
@panelImgPath: '../../../../assets/img/default/panel';
.path-analysis-box {
  font-size: 14px;
  position: absolute;
  // left: 0;
  // top: 0;
  z-index: 100;
  color: #666;
  // outline:10px solid green;
  .playTrack {
    position: relative;
    // outline:1px solid red;
    padding: 10px;
    background: url('../../../../assets/img/gisModule/pathAnalysis/path_inner.png')
      no-repeat 50% 0;
    background-size: 100% 100%;
    &::before {
      content: '';
      position: absolute;
      width: 1px;
      top: 30px;
      bottom: 0;
      left: 26px;
      // height:100%;
      border-left: 1px dashed #05d4d6;
    }
  }
  .city-text {
    display: block;
    border: none;
    color: #d2f2ff;
    font-size: 24px;
    outline: none;
    margin-bottom: 10px;
    // width:100%;
    &_inner {
      background: linear-gradient(
        to right,
        rgba(26, 237, 234, 0.3),
        transparent
      );
      padding: 5px 10px;
      border-radius: 8px;
      display: block;
      margin-left: 35px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &::before {
      display: inline-block;
      content: '';
      width: 12px;
      height: 12px;
      background-color: #00fff6;
      box-shadow: 0 0 10px rgba(0, 252, 255, 0.66);
      margin-right: 10px;
      transform: rotate(45deg);
      position: absolute;
      margin-top: 15px;
      margin-left: 10px;
    }
  }
  .time-flex {
    display: flex;
    color: #b3f4ff;
    font-size: 22px;
    margin-left: 35px;
    padding: 8px 0;
    line-height: 1.25;
    .warn {
      font-size: 28px;
      color: #ff8d30;
    }
    .default {
      color: #bbd0dc;
    }
    &_btn {
      display: inline-block;
      width: 113px;
      height: 40px;
      background: url('../../../../assets/img/gisModule/pathAnalysis/paht_btn.png');
      color: #a0f4fd;
      font-size: 24px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      margin-right: 5px;
    }
    &_item {
      flex: 1;
    }
    &_right {
      text-align: right;
    }
    &_icon {
      position: relative;
      display: inline-block;
      width: 33px;
      height: 16px;
      text-align: center;
      // outline:1px solid red;
      // margin-left: -30px;
      // margin-right: 19px;
      &::before {
        position: absolute;
        display: inline-block;
        content: '';
        height: 1px;
        width: 100%;
        left: 0;
        top: 50%;
        background: linear-gradient(
          to left,
          transparent,
          rgba(0, 229, 255, 1),
          transparent
        );
      }
      &::after {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: '';
        width: 10px;
        height: 10px;
        background-color: rgba(0, 229, 255, 1);
        border-radius: 50%;
      }
    }
  }
  .path-analysis-icon {
    width: 58px;
    height: 58px;
    background: url('@{imgPath}/pathBtn.png') no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    // top: 942px;
    // left: 600px;
    cursor: pointer;
    &:hover {
      // width: 58px;
      // height: 58px;
      background: url('@{imgPath}/pathBtn-hover.png') no-repeat 0 0;
      // background-size: 100% 100%;
      // position: absolute;
      // top: 400px;
      // left: 20px;
      // cursor: pointer;
    }
  }

  #path-analysis-main {
    position: absolute;
    top: 104px;
    left: 77px;
    width: 395px;
    height: 735px; // develop分支样式
    // bottom:80px;
    // max-height: 770px;
    z-index: 10000000;
    box-sizing: border-box;
    // outline: 10px solid red;
    background: url('../../../../assets/img/default/panel/half_bg.png')
      no-repeat 0 0;
    background-size: 100% 100%;
    .path-title {
      width: 100%;
      height: 35px;
      box-sizing: border-box;
      // background: url("@{panelImgPath}/path-title-bg.png") no-repeat 0 bottom;
      // background-size: 100% 100%;
      // background:red;
      // outline:1px solid red;
      .title-name {
        font-size: 30px;
        line-height: 35px;
        padding-left: 10px;
        font-weight: bold;
        font-family: 'myHeiti';
        font-size: calc(20px * 1.5);
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -1px;
        font-style: italic;
      }
      .toBack {
        width: 61px;
        height: 25px;
        position: absolute;
        top: 10px;
        right: 0px;
        color: #338af8;
        cursor: pointer;
        z-index: 1;
        background: url('../../../../assets/img/default/panel/toBack.png')
          no-repeat 0px 70%;
        background-size: 100% 100%;
        &:hover {
          background-image: url('../../../../assets/img/default/panel/toBack_h.png');
        }
      }
      .title-icon-close {
        position: absolute;
        width: 23px;
        height: 23px;
        right: 38px;
        top: 33px;
        background: url('@{imgPath}/close.png') center center no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .title-icon-mini {
        position: absolute;
        width: 23px;
        height: 5px;
        right: 85px;
        top: 42px;
        background: url('@{imgPath}/min.png') center center no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
    .path-detail {
      // outline:1px solid red;
      width: 100%;
      min-height: 200px;
      // background: url("@{panelImgPath}/panel_img.png") no-repeat;
      background-size: 100% 100%;
      // margin-top: -15px;
      .path-detail-title {
        // outline:1px solid red;
        color: #bbd0dc;
        padding: 12px;
        font-size: 24px;
        line-height: 1.5;
        max-height: 60px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .alsTabForTool {
        padding: 0;
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        background-color: transparent;
        box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
        // width: 92%;
        // margin: 0 auto;
        margin: 10px 5px 0 9px;
        // outline:1px solid red;
        &_tab {
          // width: 50%;
          text-align: center;
          cursor: pointer;
          color: #ffffff;
          height: 50px;
          line-height: 45px;
          padding-top: 7px;
          font-size: 28px;
          background: url('@{imgPath}/tabbg.png') no-repeat;
          background-size: 100% 100%;
          display: inline-block;
          box-sizing: border-box;
          white-space: nowrap;
          flex: 1;
          // outline:1px solid red;
          &:hover,
          &.tabItemActive {
            color: #ffff86;
            background: url('@{imgPath}/tabbg_hover.png') no-repeat;
            background-size: 100% 100%;
            // height: 60px;
            display: inline-block;
            font-size: 28px;
            // line-height: 60px;
          }
          &:nth-child(1) {
            flex: 1.5;
          }
        }
      }
      .pathMainWrap {
        // display: flex;
        // flex-wrap: nowrap;
        &.compComp-mapComponent-bodyContainer {
          background: transparent;
          // padding: 3% 3% 0 3%;
        }

        .pathRight {
          display: flex;
          box-sizing: border-box;
          // width: calc(90%);
          //  outline:1px solid green;
          // margin-left: 1%;
          .pathLeftInput {
            width: calc(100% - 40px);
          }
          .pathLeftIcon {
            box-sizing: border-box;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            .leftIcon {
              cursor: pointer;
              width: 27px;
              height: 31px;
              background: url('@{imgPath}/revert.png') no-repeat 50% 50%;
              // margin-top: 15px;
              margin-left: 10px;
              // outline:1px solid red;
            }
            .leftIcon.reverseIcon {
              transform: scale(1, -1);
            }
          }
          .pathMainItem {
            // width: calc(100% - 40px);
            display: flex;
            flex-wrap: nowrap;
            border-bottom: 1px solid #1e6077;
            height: 52px;
            position: relative;
            .preIcon {
              width: 40px;
              height: 40px;
              cursor: pointer;
              margin-top: 5px;
              background-size: 100% 100%;
            }
            .startIcon {
              background: url('@{imgPath}/start2.png') no-repeat 50% 50%;
            }
            .stopIcon {
              background: url('@{imgPath}/stop2.png') no-repeat 50% 50%;
            }
            .endIcon {
              background: url('@{imgPath}/end2.png') no-repeat 50% 50%;
            }
            .cancelInput {
              width: 23px;
              height: 23px;
              background: url('@{imgPath}/cancel.png') no-repeat 0 0;
              background-size: 100% 100%;
              margin-top: 20px;
              cursor: pointer;
              margin-left: 6px;
            }
            i {
              &.icon-circle-plus {
                width: 27px;
                height: 27px;
                background: url('@{imgPath}/addPath.png') no-repeat 0 0;
                background-size: 100% 100%;
                // margin-top: 18px;
                // margin-left: 10px;
                cursor: pointer;
              }
              &.icon-remove {
                width: 27px;
                height: 27px;
                background: url('@{imgPath}/deletePath.png') no-repeat 0 0;
                background-size: 100% 100%;
                // margin-top: 18px;
                // margin-left: 10px;
                cursor: pointer;
              }
              &.search-icon {
                width: 24px;
                height: 24px;
                background: url('@{imgPath}/search.png') no-repeat center center;
                cursor: pointer;
                position: absolute;
                right: 20px;
                top: 18px;
              }
              &.add-icon {
                position: absolute;
                right: 20px;
                top: 18px;
              }
            }
            input {
              background-color: transparent;
              color: #fff;
              border: 0;
              outline: 0;
              font-size: 26px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &::-webkit-input-placeholder {
                color: #797f92;
              }
            }
            // &:last-of-type {
            // }

            .inputKeyClass {
              width: calc(100% - 125px);
              .el-input__inner {
                border: 1px solid transparent;
              }
              .el-icon-circle-close {
                font-size: 18px;
              }
            }
          }
          span {
            display: inline-block;
            height: 38px;
            line-height: 38px;
            width: 230px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;
          }
        }
      }
    }
    .path-bottom {
      width: 100%;
      min-height: 180px;
      // background: url("@{imgPath}/path-bottom-bg.png") no-repeat;
      background-size: 100% 100%;
      padding-bottom: 12px;
      // padding-bottom: 50px;
      .errPanel-container {
        // background: #ffffff;
        margin-top: 4px;
        width: 90%;
        box-sizing: border-box;
        padding: 10px;
        color: #bbd0dc;
        font-size: 26px;
        line-height: 1.25;
        margin: 0 auto;
        .address {
          color: #ff8d30;
          font-size: 26px;
        }
        .type {
          color: #ff8d30;
          padding: 0 10px;
        }
      }
      .pathAnalysisWrap {
        // display: none;
        background: transparent;
        // margin-top: 4px;
        width: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        .alsTab {
          padding: 0 10px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
          margin-bottom: 10px;
          &_Item {
            // line-height: 40px;
            // width: 31%;
            // background-color: #14445e;
            // border-bottom: 1px solid #e1e1e1;
            text-align: center;
            cursor: pointer;
            color: #bbc3c9;
            font-size: 22px;
            flex: 1;
            line-height: 40px;
            // padding:10px 0;
            &:hover,
            &.tabItemActive {
              color: #fbfeaf;
              &:after {
                display: block;
                content: '';
                height: 2px;
                width: 100%;
                background: linear-gradient(
                  to left,
                  transparent,
                  #fef551,
                  transparent
                );
              }
            }
          }
        }
        .resultLength {
          padding: 0px 10px 10px;
          background-color: rgba(100, 219, 251, 0.1);
          color: #fff;
          font-size: 22px;
          margin: 5px 10px;
          box-sizing: border-box;
          &_text {
            padding-top: 10px;
            margin: 0;
            color: #bbd0dc;
          }
          &_number {
            color: #ff8d30;
            padding: 0 8px;
            font-size: 24px;
            color: tomato;
            font-weight: bold;
          }
          &_time {
            color: #bbd0dc;
          }
          &_timevalue {
            color: tomato;
            font-weight: bold;
          }
        }
        &.busPanelContainer {
          .alsCrossTab {
            padding: 0 10px;
            display: flex;
            flex-wrap: nowrap;
            .alsCrossTabItem {
              line-height: 60px;
              width: 50%;
              text-align: center;
              cursor: pointer;
              color: #ffffff;
              background: url('@{imgPath}/trainbg.png') no-repeat 0 0;
              background-size: 100% 100%;
              font-size: 24px;
              &:hover {
                color: #ffffff;
                background: url('@{imgPath}/trainbg_hover.png') no-repeat 0 0;
                background-size: 100% 100%;
              }
              &.tabCrossItemActive {
                color: #ffffff;
                background: url('@{imgPath}/trainbg_hover.png') no-repeat 0 0;
                background-size: 100% 100%;
              }
            }
          }
          .busTabContainer {
            padding: 2px 20px;
            display: flex;
            flex-wrap: wrap;
            .busTabItem {
              line-height: 45px;
              width: 50%;
              text-align: center;
              cursor: pointer;
              color: #bbc3c9;
              box-shadow: 0px 0px 1px #e4e6e7;
              background-color: #14445e;
              font-size: 24px;
              &:hover {
                background: #1e6077;
                color: #fff;
              }
              &.busTabItemActive {
                background: #1e6077;
                color: #fff;
              }
            }
          }
          .pathResult-container {
            padding: 0 10px 15px 10px;
            max-height: 300px;
            overflow-y: auto;
            .pathResultItem-container {
              margin-top: 6px;
              border: 1px solid #4af4ff;
              .overview-container {
                border-bottom: 1px solid #4af4ff;
                display: flex;
                flex-wrap: wrap;
                font-size: 26px;
                padding: 4px 8px 4px 8px;
                cursor: pointer;
                .overview-line1 {
                  display: flex;
                  flex-wrap: wrap;
                  color: #4af4ff;
                  .price-container {
                    background: #f55925;
                    color: #ffffff;
                    padding: 0px 2px;
                    margin-right: 6px;
                  }
                }
                .overview-line2 {
                  display: flex;
                  flex-wrap: wrap;
                  color: #fff;
                  font-size: 22px;
                  .interval {
                    color: #4af4ff;
                  }
                }
              }
              .detail-container {
                font-size: 12px;
                color: #666;
                padding-left: 6px;
                padding-right: 6px;
                .item {
                  line-height: 35px;
                  border-top: 1px solid #4af4ff;
                  font-size: 22px;
                  color: #fff;
                  &:hover {
                    background: transparent;
                  }
                }
              }
            }
          }
          .cross-pathResult-container {
            padding: 0 25px 0px 32px;
            max-height: 520px;
            overflow-y: auto;
            .cross-pathResultItem-container {
              border: 1px solid #2bb0cd;
              margin-bottom: 6px;
              .routeItem-overview {
                border-bottom: 1px solid #2bb0cd;
                padding-left: 10px;
                padding-right: 10px;
                position: relative;
                .tj-icon {
                  width: 84px;
                  height: 39px;
                  background: url('@{imgPath}/tj.png') center center no-repeat;
                  background-size: 100% 100%;
                  position: absolute;
                  top: 0;
                  right: 30px;
                }
                .routeItem-overview-top {
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 30px;
                  .num {
                    position: absolute;
                    top: 0px;
                    left: 0;
                    text-align: center;
                    height: 26px;
                    width: 26px;
                    line-height: 26px;
                    background: rgba(17, 191, 234, 8);
                    color: #ffffff;
                    font-size: 18px;
                  }
                  .operate {
                    position: absolute;
                    // top: -11px;
                    right: 5px;
                    // height: 12px;
                    /* width: 1px; */
                    border-top: 12px solid #11bfea;
                    border-bottom: 0px solid rgba(156, 182, 255, 0);
                    border-left: 12px solid rgba(156, 182, 255, 0);
                    border-right: 12px solid rgba(156, 182, 255, 0);
                    cursor: pointer;
                  }
                  .operateIsactive {
                    transform: rotate(180deg);
                  }
                }
                .tool-container {
                  font-size: 12px;
                  color: gray;
                  .toolItem-container {
                    .tool-name {
                      color: #ff1a1a;
                      font-size: 26px;
                      padding-right: 8px;
                      padding-left: 20px;
                      font-weight: bolder;
                    }
                    .tool-time {
                      color: gray;
                      font-size: 22px;
                    }
                    .tool-timeInterval {
                      color: gray;
                      font-size: 22px;
                    }
                  }
                }
                .total-container {
                  color: #a6a8ad;
                  font-size: 26px;
                  line-height: 30px;
                  padding-bottom: 10px;
                  padding-left: 20px;
                  .tool-price {
                    padding-left: 6px;
                    color: #f55925;
                  }
                }
              }
              .stepItem-overview-container {
                .stepItem-overview {
                  color: #ffffff;
                  border-bottom: 1px solid #2bb0cd;
                  font-size: 26px;
                  padding: 4px 8px;
                  line-height: 40px;
                  .location {
                    color: #4af4ff;
                    padding: 0 2px;
                  }
                  .duration {
                    color: #ffffff;
                    text-decoration: underline;
                  }
                  .operate {
                    color: #4af4ff;
                    padding: 0px 2px;
                    cursor: pointer;
                  }
                }
                .stepItemoverviewIsactive {
                  background: transparent;
                }
                .stepItem-detail {
                  background: transparent;
                  font-size: 12px;
                  .item {
                    line-height: 40px;
                    color: #ffffff;
                    padding-left: 20px;
                    border-bottom: 1px solid #2bb0cd;
                    font-size: 22px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
#path-analysis-icon-id {
  width: 58px;
  height: 58px;
  background: url('@{imgPath}/pathBtn.png') no-repeat 0 0;
  background-size: 100% 100%;
  position: absolute;
  cursor: pointer;
  &:hover {
    background: url('@{imgPath}/pathBtn-hover.png') no-repeat 0 0;
  }
}

/*滚动条样式*/
.scroll {
  overflow-y: scroll;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 6px;
  border-radius: 5px;
  opacity: 0.64;
}

::-webkit-scrollbar-track {
  width: 6px;
  height: 3px;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  width: 6px;
  height: 3px;
  background: rgba(58, 250, 252, 0.2);
  border-radius: 4px;
}
.inputOptions {
  background: #04152f;
  display: none;
  max-height: 300px;
  overflow-y: auto;
  box-sizing: border-box;
  width: calc(100% - 37px);
  margin: 0px 18px 8px 19px;
  padding: 5px 10px;
  li {
    padding: 6px 10px;
    cursor: pointer;
    overflow: hidden;
    .inputOptionsName {
      color: #fff;
      display: inline-block;
      max-width: 59%;
      font-size: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .inputOptionsAddress {
      display: inline-block;
      margin-top: 3px;
      font-size: 16px;
      margin-left: 2%;
      max-width: 38%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .nodataLi {
    background: #fff;
    padding: 20px 10px;
    text-align: center;
  }
}
</style>
