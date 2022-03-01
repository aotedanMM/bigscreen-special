<template>
  <div class="emap_control_testPathAnalysisCtrl" v-show="clickMoreState && isShown">
    <div v-show="showBtnControl" class="test-icon" @click="hidePopView"></div>
      <div v-show="showControl" class="pathAnalysisCtrl_wrap compComp-mapComponentPanel" id="pathAnalysisCtrl_wrap">
        <div class="pathTop compComp-mapComponent-topContainer">
          <div class="min-icon" @click="minPopView"></div>
          <div class="close" @click="closePop"></div>
            <div class="title compComp-pathAnalysisCtrl-drag" >路径规划</div>

            <div class="closedContainer" @click.stop="closePanel" >
                <span class="el-icon-close"></span>
                <div class="load-container" v-loading="loadingState" v-if="loadingState"></div>
            </div>

            <div class="topIcon" @click="toSearchPath(false)">搜索</div>
        </div>

        <div class="alsTabForTool">
            <div class="alsTabItem"
                v-for="(item, index) in typeTabList"
                :key = "index" 
                :class="{tabItemActive:typeIndex==item.value}"
                @click="toTypeTabItemClick(item)"
                @mouseover="mouseOverShowIconBg($event, item.value)"
                @mouseleave="mouseLeaveCancelIconBg($event, item.value)"
            >
            <i :class="{active:typeIndex === item.value}"></i>
                {{item.title}}
            </div>
        </div>

        <div class="pathMainWrap compComp-mapComponent-bodyContainer">
            <div class="pathLeftIcon">
                <div class="leftIcon" @click="toReverse"></div>
            </div>
            <div class="pathRight">
                <div class="pathMainItem" 
                  v-for="(item, index) in pathMainDatas"
                  :key = "index" 
                  @mouseover="mouseOverShowBtn(index)"
                  @mouseleave="mouseLeaveCancelBtn(index)"
                >
                <div :class="item.iconClass"
                    @click="toClickPreIcon(item, index)"></div>
                    <input v-model="item.inputKey"
                        clearable
                        class="inputKeyClass"
                        :placeholder="item.placeholder"
                        @change="inputWatch(item,index)"
                        @input="inputWatch(item,index)"
                        @oninput="inputWatch(item,index)"
                        @focus="inputClick(item,index)"
                        :title="item.inputKey"
                    >
                    
                    <span v-show="curInputIndex == index?true:false" class="cancelInput"
                    @click="cancelInputValue(item, index)"></span>
                    <!-- </input> -->
                    <i
                            v-show="(typeIndex==='driving') && addButtonFlag"
                            :class="item.clickClass"
                            slot="suffix"
                            @click="handleIconClick(item,index)"
                    >
                    </i>
                </div>
            </div>
        </div>

        <!-- 输入框模糊搜索匹配的结果列表 -->
        <ul class="inputOptions">
            <li v-show="isShowOptions" 
                v-for="(item, index) in inputOptions"
                :key = "index" 
                @click="inputOptionClick(item)"
            >{{item.title}}
            </li>

            <li v-show="!isShowOptions" class="nodataLi">{{msg}}</li>
        </ul>

        <template v-if="errPanel">
            <div class="errPanel-container">
                暂无
                <span class="address">{{sendPathNodeInfo[0].inputKey}}</span>
                到
                <span class="address">{{sendPathNodeInfo[pathMainDatas.length-1].inputKey}}</span>
                的相应<span class="type">{{typeTabList[typeIndex].title}}</span>线路信息
            </div>
        </template>

        <template v-if="typeIndex !== 'bus'">
            <div class="pathAnalysisWrap">
                <div class="alsTab" v-if="tabList.length">
                    <div class="alsTabItem"
                          v-for="(item, index) of tabList"
                          :key = "index" 
                          :class="{tabItemActive:tabIndex==item.value}"
                          @click="toTabItemClick(item,item.value)"
                    >
                        {{item.title}}
                    </div>
                </div>

                <div class="resultLength">
                    总里程约
                    <span>{{resultLength>10000?(resultLength/1000).toFixed(2):resultLength}}</span>
                    {{resultLength>10000?'公里':'米'}}
                </div>
                <div class="resultLength">
                  <div class="time-left">
                    总里程约<span>{{resultLength>10000?(resultLength/1000).toFixed(2):resultLength}}</span>
                    {{resultLength>10000?'公里':'米'}}
                  </div>  
                  <div class="time-middle"></div> 
                  <div class="time-right">
                    <p><span>{{resAllHour}}</span>小时<span>{{resAllM}}</span>分钟</p>
                    <p><span>{{resAllEndDate}}</span></p>
                  </div>   
                </div>

                <PathAlsTabItem :pathanalysislist="pathanalysislist" :getComponent="getComponent"></PathAlsTabItem>'
            </div>
        </template>

        <template v-else>
            <div class="pathAnalysisWrap busPanelContainer">

                <!--跨城 火车飞机大巴选项卡-->
                <template v-if="!curBusObjData.isCityCross">
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
                </template>

                <!--用时最短等tab-->
                <div class="busTabContainer" v-if="(curBusObjData.curSamePathObj.pathResult.length) || (curBusObjData.curCrossPathObj.pathResult.length)">
                    <div v-for="(item, index) of curBusObjData.tabList"
                          class="busTabItem"
                          :key = "index" 
                          :class="{busTabItemActive:curBusObjData.curTabItem.value==item.value}"
                          @click="toBusTabItemClick(item, index)"
                    >
                        {{item.title}}
                    </div>
                </div>


                <!--同城-->
                <template v-if="curBusObjData.isCityCross">
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
                </template>
                <!--跨城-->
                <template v-else>
                    <div class="cross-pathResult-container">
                        <div v-for="(item,index) of curBusObjData.curCrossPathObj.pathResult"
                              :key= "index"
                              class="cross-pathResultItem-container"
                        >
                            <div class="routeItem-overview"
                                @click.stop="clickRouteItemOverview(item,index)">
                          <div v-if="index === 0" class="tj-icon"></div>
                                <div class="routeItem-overview-top">
                                    <div class="num">{{index+1}}</div>
                                    <div class="operate" :class="{operateIsactive:curBusObjData.curCrossPathObj.curPathIndex===index}"></div>
                                </div>
                                <div class="tool-container">
                                    <template v-for="(stepsItem, stepsIndex) of item.steps">
                                        <template v-for="(schemesItem, schemesIndex) of stepsItem.schemes" >
                                            <div class="toolItem-container" v-if="[1,2,6].includes(schemesItem.vehicle_info.type)" :key="schemesIndex || stepsIndex">
                                                <span class="tool-name">{{schemesItem.vehicle_info.detail.name}}</span>
                                                <span class="tool-time">
                                                    <template>
                                                        {{["","次日","第三日","第四日","第五日","第六日"][parseInt(schemesItem.vehicle_info.detail.departure_time.substring(0,1))]}}
                                                    </template>
                                                    {{schemesItem.vehicle_info.detail.departure_time.substring(1)}}
                                                </span>
                                                <span class="tool-timeInterval">-</span>
                                                <span class="tool-time">
                                                    <template>
                                                        {{["","次日","第三日","第四日","第五日","第六日"][parseInt(schemesItem.vehicle_info.detail.arrive_time.substring(0,1))]}}
                                                    </template>
                                                    {{schemesItem.vehicle_info.detail.arrive_time.substring(1)}}
                                                </span>

                                            </div>
                                        </template>
                                    </template>
                                </div>
                                <div class="total-container">
                                    全里程约
                                    <template v-if="Math.floor(Math.floor(item.duration/60)/60)">{{Math.floor(Math.floor(item.duration/60)/60)}}小时</template>{{Math.floor(item.duration/60)%60}}分钟
                                </div>
                            </div>
                            <div v-if="curBusObjData.curCrossPathObj.curPathIndex===index" class="stepItem-overview-container">
                                <template v-for="(stepsItem,stepsIndex) of item.steps">
                                    <div class="stepItem-overview"
                                          @click.stop="clickStepItemDiv(stepsItem,stepsIndex)"
                                          :key="stepsIndex"
                                    :class="{stepItemoverviewIsactive:(curBusObjData.curCrossPathObj.curPathIndex===index)&&(curBusObjData.curCrossPathObj.curStepIndex===stepsIndex)}">
                                        从<span class="location">{{stepsItem.stepOverviewObj.start_location}}</span>
                                        到<span class="location">{{stepsItem.stepOverviewObj.end_location}}</span>
                                        <span class="duration">
                                            <template v-if="Math.floor(Math.floor(stepsItem.stepOverviewObj.duration/60)/60)">{{Math.floor(Math.floor(stepsItem.stepOverviewObj.duration/60)/60)}}小时</template>{{Math.floor(stepsItem.stepOverviewObj.duration/60)%60}}分钟
                                        </span>
                                        <span class="operate"
                                              @click.stop="clickStepItemSpan(stepsItem,stepsIndex)"
                                              v-if="stepsItem.schemes && stepsItem.schemes[0] && stepsItem.schemes[0].instruction"
                                        >详情</span>
                                    </div>
                                    <div class="stepItem-detail" v-if="(curBusObjData.curCrossPathObj.curPathIndex===index)&&(curBusObjData.curCrossPathObj.curStepIndex===stepsIndex)" :key="stepsIndex">
                                        <template v-for="(schemesItem,schemesIndex) of stepsItem.schemes">
                                            <div class="item"
                                                  v-if="schemesItem.instruction"
                                                  :key="schemesIndex"
                                                  @click.stop="clikSchemesItem(schemesItem,schemesIndex)"
                                            >{{schemesItem.instruction}}</div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import PathAlsTabItem from './PathAlsTabItem.vue';
@Component({
  name: 'GisPathAnalysis',
  components: { PathAlsTabItem },
})
export default class GisPathAnalysis extends Vue  {

  public  curInputIndex: number =  -1;
  public  showCancelBtnState: boolean = false; // 控制input内删除按钮的显示
  public  showBtnControl: boolean = false;  // 显示或隐藏路径规划弹出框缩小后的小图标
  public  showControl: boolean = true; // 路径规划弹出框的显示
  public  isShown: boolean = false;
  public  clickMoreState: boolean = false; // 点击查看更多
  public  loadingState: boolean = false; // 查询状态
  public  errPanel: boolean = false; // 是否展示查无路线面板
    // 交通工具tab区域
  public  typeIndex: string = 'driving';
  public  typeTabList: any = {
      driving: {
          title: '摩托化推进',
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
          title: '公共交通',
          value: 'bus',
          getPathDataFun: 'getData_bus',
          doWithResultPathDataFun: 'doWithPathResultData_bus',
          strategy_incity: [// 同城
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
          strategy_intercity: [// 跨城
              {
                  title: '推荐',
                  value: 0,
              },
              {
                  title: '出发早',
                  value: 1,
              },
              // {
              //     title: "价格低",
              //     value: 2
              // }
          ],
          Trans_type_intercity: [// 	跨城交通方式策略
              {
                  title: '火车优先',
                  value: 0,
              },
              {
                  title: '飞机优先',
                  value: 1,
              },
              // {
              //     title: "大巴优先",
              //     value: 2
              // }
          ],
      },

      // riding: {
      //     title: '骑行',
      //     value: "riding",
      //     getPathDataFun: "getData_riding",
      //     doWithResultPathDataFun: "doWithPathResultData",
      //     tabList: [
      //         {
      //             title: '普通自行车',
      //             value: 0
      //         },
      //         {
      //             title: '电动自行车',
      //             value: 1
      //         }
      //     ]
      // },
      // walking: {
      //     title: '步行',
      //     value: "walking",
      //     getPathDataFun: "getData_walking",
      //     doWithResultPathDataFun: "doWithPathResultData",
      // }
  };

    // 公交专用数据
  public  curBusObjData: any = {
      isCityCross: true, // 是否同城,true 同城
      tabList: this.typeTabList.bus.strategy_incity,
      parentTabList: [],
      curTabItem: this.typeTabList.bus.strategy_incity[0],
      curParentTabItem: this.typeTabList.bus.Trans_type_intercity[0],
      curSamePathObj: {// 同城
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

    // 起点、终点输入区域
  public  pathMainDatas: any = [
      {
          iconClass: 'preIcon startIcon',
          clickClass: 'el-icon-circle-plus',
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

  public  inputOptions: any = [];
  public  currentIndex: any = -1;
  public  addPathNodeNum: any = 0;
  public  sendPathNodeInfo: any = [];
  public  tabIndex: any = 0;
  public  tabList: any = [
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
  public  tabShowFlag: boolean = true;
  public  addButtonFlag: boolean = true;

  public  resAllHour: any = '';
  public  resAllM: any = '';
  public  resAllEndDate: any = '';
  public  resultLength: any = 0;
  public  pathanalysislist: any =  [];
  public  isShowOptions: boolean = true;
  public  msg: any = '';

  @Prop()
  private getComponent: any;

  @Emit('compMapToolBarInit')
  public compMapToolBarInit() {
    console.log('11111');
  }
  public  mouseOverShowIconBg(e: any, value: any) {
      if (this.typeIndex !== value) {
          $(e.currentTarget).find('i').addClass('active');
      }
  }  public  mouseLeaveCancelIconBg(e: any, value: any) {
      if (this.typeIndex !== value) {
          $(e.currentTarget).find('i').removeClass('active');
      }
  }  public  mouseOverShowBtn(index: any) {
      // this.showCancelBtnState = true
      this.curInputIndex = index;
  }  public  mouseLeaveCancelBtn(index: any) {
      // this.showCancelBtnState = false
      this.curInputIndex = -1;
  }  public  hidePopView() {
      this.showControl = true,
      this.showBtnControl = false;
      // G.modules.PathAnalysisModule.onClose()
  }  public  minPopView() {
      this.showControl = false,
      this.showBtnControl = true;
  }  public  cancelInputValue(item: any, index: any) {
      const obj = item;
      obj.inputKey = '';
      // this.getComponent().removePoint(item);
      // this.pathMainDatas[index].inputKey = ''
      // this.pathMainDatas[index].inputKey = '';
      // this.pathMainDatas[index].location = '';
      // this.pathMainDatas[index].isClickOptions = false;
      // this.inputWatch(obj,index);
      this.inputWatch(obj, index);
  }  public  dragstart(event: any, data: any) {
      console.log('drag');
      event.dataTransfer.setData('item', data);
  }  public  dragend(event: any) {
      event.dataTransfer.clearData();
  }  public  setVisible(visible: any) {
      this.isShown = !!visible;
  }  public  closePop() {
      G.modules.PathAnalysisModule.onClose();
      this.clickMoreState = false;
      // this.getComponent()
  }  /* 交通工具tab区域*/

  // ----------路径规划类型tab切换事件----------------
  public  toTypeTabItemClick(item: any) {
      if (this.typeIndex === item.value) {
          return;
      }
      this.typeIndex = item.value;
      this.onChange(this.typeIndex);
      this.toSearchPath(true);
      // this.getComponent().removeMidPoints();
  }
  // typeIndex 改变，即选项卡切换成功
  public  onChange(val: string) {
      const self: any = this;
      this.tabList = [];
      this.tabIndex = 0;
      this.tabList = this.typeTabList[val].tabList ? this.typeTabList[val].tabList : [];
      // self['init_' + val] && self['init_' + val](val);
      if (self['init_' + val]) {
        self['init_' + val](val);
      }
      // self['init_' + val] ? self['init_' + val](val) : '';
  }
  // 还原公交类型的默认参数 回到最初设置
  public  init_bus(val: any) {
      this.init_specailAddPath();

      // 公交专用数据
      this.curBusObjData = {
          isCityCross: true, // 是否同城,true 同城
          tabList: this.typeTabList.bus.strategy_incity,
          parentTabList: [],
          curTabItem: this.typeTabList.bus.strategy_incity[0],
          curParentTabItem: this.typeTabList.bus.Trans_type_intercity[0],
          curSamePathObj: {// 同城
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
  public  init_walking(val: any) {
      this.init_specailAddPath();
  }
  public  init_riding(val: any) {
      this.init_specailAddPath();
  }
  public  init_driving() {
      this.addButtonFlag = true;
  }
  // 因为骑行可以选择途径点，所以在和其它几个进行来回切换的时候，需要将这部分进行处理
  public  init_specailAddPath() {
      this.addButtonFlag = false;
      this.addPathNodeNum = 0;
      if (this.pathMainDatas.length > 2) {
          const list = [this.pathMainDatas[0], this.pathMainDatas[this.pathMainDatas.length - 1]];
          this.pathMainDatas = list;
      }
  }

  // ----------搜索路径事件----------------
  /*
  * clickFlag 为true表示，不是从搜索按钮直接点击
  * */
  public  toSearchPath(clickFlag: any) {
      /*判断input框的路径输入情况*/
      jQuery('.inputOptions').css('display', 'none');
      let goFlag = false;
      let nullFlag = false;
      this.sendPathNodeInfo = [];
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

          if (nullFlag) { return; }

          if (!item.isClickOptions) {

              this.$alert('地址不准确，请输入正确的地址', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
              }).then(() => {
                  this.dealPathMainDatas({}, index, false, '');
              }).catch(() => {
                  console.log('111111111');
              });
              goFlag = true;

          }
          if (goFlag) { return; }

          this.sendPathNodeInfo.push(JSON.parse(JSON.stringify({
              lat: item.location.lat,
              lon: item.location.lon,
              inputKey: item.inputKey,
          })));
      });

      if (!goFlag && !nullFlag) {

          if (!clickFlag) {// 当if为真，代表是从搜索按钮点击进来的，那么要还原默认值
              this.onChange(this.typeIndex);
          }
          this.getPathAnalysisDatas(this.sendPathNodeInfo, this.tabIndex, clickFlag);
      }
  }
  /*关闭面板*/
  public  closePanel() {
      this.compMapToolBarInit();
  }
  // -----------获取路径规划数据------------------------
  // tabClickFlag 公交时，是从搜索按钮点击还是从其他位置点击，即表示，是否需要还原公交的列表的tab激活项
  public  getPathAnalysisDatas(opts: any, tabIndex: any, tabClickFlag: any) {
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
          self[this.typeTabList[this.typeIndex].getPathDataFun](options, tabClickFlag);
      }
  }
  public  getData_driving(options: any) {
      this.getComponent().queryPath(options)
          .then((res: any) => {
              this.loadingState = false;
              this.doWithPathResultData(res);
          })
          .fail( (err: any) => {
              this.loadingState = false;
              console.error(err);
          });
  }
  public  getData_riding(options: any) {
      this.getComponent().queryPath_riding(options)
          .then((res: any) => {
              this.loadingState = false;
              this.doWithPathResultData(res);
          })
          .fail((err: any) => {
              this.loadingState = false;
              console.error(err);
          });
  }

  public  getData_walking(options: any) {
      this.getComponent().queryPath_walking(options)
          .then((res: any) => {
              this.loadingState = false;
              this.doWithPathResultData(res);
          })
          .fail((err: any) => {
              this.loadingState = false;
              console.error(err);
          });
  }
  public  getData_bus(options: any, tabClickFlag: any) {
      const newOptions = this.getBusNewParamFromOldParam(options, tabClickFlag);
      this.getComponent().queryPath_bus(newOptions)
          .then((res: any) => {
              this.doWithPathResultData_bus(res, tabClickFlag);
          });
          // .fail(function (err) {
          //     this.doWithResponeErr(err);
          // });
  }
  // 对查询路线数据时，返回的res.error进行统一处理
  // err，是错误信息或者true
  // routeNullFlag,代表返回来的路线数据为空数组等，暂时用不到，预留
  public  doWithResponeErr(err: any, routeNullFlag: any) {
      this.loadingState = false;
      if (err) {
          jQuery('.pathAnalysisWrap').css('display', 'none');
          this.errPanel = true;
          return true;
      }
      this.errPanel = false;
      return false;
  }
  // 将从通用接口获得的起点终点的数组的options进行重组，以适用公交
  // tabClickFlag 不为true时，表示从搜索按钮点击过来的。要把参数还原到走默认参数
  public  getBusNewParamFromOldParam(options: any, tabClickFlag: any) {
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
  public  doWithPathResultData(res: any) {
      if (!this.doWithResponeErr(res.error, null)) {// res.error为false的时候，执行
          jQuery('.pathAnalysisWrap').css('display', 'block');
          this.pathanalysislist = res.road;
          this.resultLength = res.length;
          this.resAllHour = res.durationHourMinutes.hours;
          this.resAllM = res.durationHourMinutes.minutes;
          this.resAllEndDate = res.enddate;
          // this.resAllLJ = res.durationHourMinutes.hours;
      }
  }

  /**
   * tabClickFlag 为true 表示从路径面板的切换按钮点过来的
   * */
  public  doWithPathResultData_bus(res: any, tabClickFlag: any) {

      if (this.doWithResponeErr(res.error, null)) {
          return;
      }


      if (this.doWithResponeErr(((!res.routes) || (!res.routes.length)), true)) {
          return;
      }

      jQuery('.pathAnalysisWrap').css('display', 'block');
      const crossFlag = res.destination.city_name === res.origin.city_name;
      const tabList = crossFlag ? this.typeTabList.bus.strategy_incity : this.typeTabList.bus.strategy_intercity;
      const parentTabList = crossFlag ? [] : this.typeTabList.bus.Trans_type_intercity;
      this.curBusObjData.isCityCross = crossFlag; // 是否同城
      this.curBusObjData.tabList = tabList;
      this.curBusObjData.parentTabList = parentTabList;
      this.curBusObjData.curTabItem = tabClickFlag ? this.curBusObjData.curTabItem : tabList[0];
      this.curBusObjData.curParentTabItem = (parentTabList.length && tabClickFlag) ? this.curBusObjData.curParentTabItem : parentTabList[0];



      if (crossFlag) {
          this.getSameCityObj(res);
      } else {
          this.getCrossCityObj(res);
      }
  }
    /*得到同城的路径*/
  public  getSameCityObj(res: any) {
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
                  (ssitem.vehicle_info.type === 5) ? (walkDis += ssitem.distance) : (busArr.push(ssitem.vehicle_info.detail.name));
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
  public  getCrossCityObj(res: any) {
      const stepOverviewArr = [];
      res.routes.forEach((ritem: any, rindex: any) => {
          ritem.steps.forEach((rsitem: any, rsindex: any) => {
              if (rsindex === 0) {// step 0
                  const stepOverviewObj = {
                      start_location: this.pathMainDatas[0].address,
                      // 本step的终点，当最后一个schemes的vehicle_info.detail有值，那么就是非步行，则取arrive_station或者off_station（公交和其它交通工具不一样）
                      //
                      end_location: rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail
                          ?
                          (rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail.arrive_station || rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail.on_station)
                          :
                          (ritem.steps[1].schemes[0].vehicle_info.detail.departure_station || ritem.steps[1].schemes[0].vehicle_info.detail.off_station),
                      duration: 0,
                  };
                  rsitem.schemes.forEach((rssitem: any, rssindex: any) => {
                      stepOverviewObj.duration += rssitem.duration;
                  });
                  rsitem.stepOverviewObj = stepOverviewObj;
              } else if (rsindex === (ritem.steps.length - 1)) {
                  const stepOverviewObj2 = {
                      // 先从本step的schemes[0]的detail中拿值，如果是步行，则从上一个step的最后一个scheme拿值
                      start_location: rsitem.schemes[0].vehicle_info.detail
                          ?
                          (rsitem.schemes[0].vehicle_info.detail.arrive_station || rsitem.schemes[0].vehicle_info.detail.arrive_station)
                          :
                          (ritem.steps[ritem.steps.length - 2].schemes[ritem.steps[ritem.steps.length - 2].schemes.length - 1].vehicle_info.detail.arrive_station || ritem.steps[ritem.steps.length - 2].schemes[ritem.steps[ritem.steps.length - 2].schemes.length - 1].vehicle_info.detail.on_station),
                      end_location: this.pathMainDatas[this.pathMainDatas.length - 1].address,
                      duration: 0,
                  };
                  rsitem.schemes.forEach((rssitem: any, rssindex: any) => {
                      stepOverviewObj2.duration += rssitem.duration;
                  });
                  rsitem.stepOverviewObj = stepOverviewObj2;
              } else {
                  const stepOverviewObj3 = {
                      start_location: rsitem.schemes[0].vehicle_info.detail
                          ?
                          (rsitem.schemes[0].vehicle_info.detail.departure_station || rsitem.schemes[0].vehicle_info.detail.off_station)
                          :
                          (ritem.steps[rsindex - 1].schemes[ritem.steps[rsindex - 1].schemes.length - 1].vehicle_info.detail.arrive_station || ritem.steps[rsindex - 1].schemes[ritem.steps[rsindex - 1].schemes.length - 1].vehicle_info.detail.on_station),
                      end_location: rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail
                          ?
                          (rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail.arrive_station || rsitem.schemes[rsitem.schemes.length - 1].vehicle_info.detail.on_station)
                          :
                          (ritem.steps[rsindex + 1].schemes[0].vehicle_info.detail.off_station || ritem.steps[rsindex + 1].schemes[0].vehicle_info.detail.departure_station),
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
    /**
     * 点击公交的tab
     */
  public  toBusTabItemClick(item: any, index: any) {

      if (this.curBusObjData.curTabItem.value === item.value) {
          return;
      }
      this.curBusObjData.curTabItem = item;
      this.toSearchPath(true);

  }

    /**
     * 点击同城结果面板的总览item
     * */
  public  clickSameCityOverviewItem(item: any, index: any) {
      if (this.curBusObjData.curSamePathObj.curPathIndex === index) {
          this.curBusObjData.curSamePathObj.curPathIndex = -1;
          this.curBusObjData.curSamePathObj.curPathIndexForHover = index; // 即使详情关闭了，但是hover的样式还是要的
          return;
      }
      this.curBusObjData.curSamePathObj.curPathIndex = index;
      this.getComponent().showBusRoute(item.steps);
      this.curBusObjData.curSamePathObj.curPathIndexForHover = index; // 即使详情关闭了，但是hover的样式还是要的
  }

    /**
     * 点击跨城方案总览的item
     * */
  public  clickRouteItemOverview(item: any, index: any) {
      if (this.curBusObjData.curCrossPathObj.curPathIndex === index) {
          this.curBusObjData.curCrossPathObj.curPathIndex = -1;
          return;
      }
      this.getComponent().showBusRoute(item.steps);
      this.curBusObjData.curCrossPathObj.curPathIndex = index;
  }
    /**
     * 点击当前展开的方案下，step的详情 Span 文字详情，只展示前端面板
     * */
  public  clickStepItemSpan(stepsItem: any, stepsIndex: any) {

      if (this.curBusObjData.curCrossPathObj.curStepIndex === stepsIndex) {
          this.curBusObjData.curCrossPathObj.curStepIndex = -1;
          return;
      }

      this.curBusObjData.curCrossPathObj.curStepIndex = stepsIndex;
  }
    /**
     * 点击当前展开的方案下，step的详情 地图的事件
     * */
  public  clickStepItemDiv(stepsItem: any, stepsIndex: any) {
      if (this.curBusObjData.curCrossPathObj.curStepIndex === stepsIndex) {
          this.curBusObjData.curCrossPathObj.curStepIndex = -1;
          return;
      }
      this.getComponent().showBusRouteSchemes(stepsItem.schemes);
      this.curBusObjData.curCrossPathObj.curStepIndex = stepsIndex;
  }
    /**
     * 在特定数组中找到某个属性值，并返回索引
     */
  public  findTarget(val: any, arr: any, paramKey: any) {
      return arr.findIndex((item: any, index: any) => {
          return item.paramKey === val;
      });
  }

    /**
     * 切换跨城 tab 火车 飞机的那个
     * */
  public  clickCrossTypeTabItem(item: any, index: any) {
      if (this.curBusObjData.curParentTabItem.value === item.value) {
          return;
      }
      this.curBusObjData.curParentTabItem = jQuery.extend(true, {}, item);
      const tabList = this.curBusObjData.isCityCross ? this.typeTabList.bus.strategy_incity : this.typeTabList.bus.strategy_intercity;
      this.curBusObjData.curTabItem = tabList[0];
      // true 表示不是从搜索按钮点击的
      this.toSearchPath(true);
  }
    /**
     * 点击scheme的那个详情
     * */
  public  clikSchemesItem(schemesItem: any, schemesIndex: any) {
      this.getComponent().highlightBusRouteScheme(schemesItem.path);
  }

    // -----------获取骑行规划数据------------------------
  public  getPathAnalysisDatas_riding(opts: any, tabIndex: any) {
      const options = {
          stops: opts,
          style: tabIndex,
      };
      this.getComponent().queryPath(options)
          .then((res: any) => {
              this.pathanalysislist = res.road;
              this.resultLength = res.length;
          })
          .fail(function(err: any) {
              console.error(err);
          });
  }
    // ---------选中路径节点与地图交事件------------
  public  getSinglePathNode(opt: any, index: any) {
      opt.position = index;
      this.getComponent().addPoint(opt);
  }
    // --------修改节点数据---------
  public  dealPathMainDatas(location: any, index: any, flag: any, inputKey: any) {
      this.pathMainDatas[index].inputKey = inputKey;
      this.pathMainDatas[index].location = location;
      this.pathMainDatas[index].isClickOptions = flag;
  }
    /**
     * 输入框点击监听，开启绘制点事件
     * @param item
     * @param index
     */
  public  inputClick(item: any, index: any) {
      item.position = index;
      this.getComponent().startSelectPoint(item);
  }
  // ---------input监听事件-----------------
  public  inputWatch(item: any, index: any) {
      this.currentIndex = index;
      if (item.inputKey) {
          this.getInputOptionDatas(item.inputKey);

      } else {

          item.position = index;
          this.getComponent().removePoint(item);
          let tempNum = 0;
          jQuery('.inputOptions').fadeOut();
          this.pathMainDatas.map((ele: any, idx: any) => {
              if (!ele.inputKey) {
                  this.dealPathMainDatas({}, idx, false, '');
                  tempNum++;
              }
          });

          if (tempNum === this.pathMainDatas.length) {
              jQuery('.pathAnalysisWrap').fadeOut();
          }
      }
  }
    // ----------input输入请求数据----------------
  public  getInputOptionDatas(val: any) {
      const self = this;
      const options = {page: 1, keyword: val, page_size: 10};
      this.getComponent().queryPoi(options)
          .then((res: any) => {

              jQuery('.inputOptions').css('display', 'block');
              jQuery('.pathAnalysisWrap').css('display', 'none');

              if (res.msg) {
                  this.isShowOptions = false;
                  this.msg = res.msg;
              } else {
                  this.isShowOptions = true;
                  self.inputOptions = res.pois;
              }
          })
          .fail((err: any) => {
              console.error(err);
          });
  }    // -------下拉框点击事件-----------
  public  inputOptionClick(item: any) {
      this.dealPathMainDatas(item.location, this.currentIndex, true, item.title);

      jQuery('.inputOptions').fadeOut();

      // 选中路径节点与地图交事件
      this.getSinglePathNode(this.pathMainDatas[this.currentIndex], this.currentIndex);
  }    // -------路径内部icon添加、删除事件-----------
  public  handleIconClick(item: any, index: any) {
      if (item.clickClass === 'el-icon-circle-plus') {
          if (this.addPathNodeNum === 1) { return; }
          this.addPathNodeNum++;

          this.pathMainDatas.splice(this.pathMainDatas.length - 1, 0,
              {
                  iconClass: 'preIcon stopIcon',
                  clickClass: 'el-icon-remove',
                  placeholder: '请输入途经点',
                  inputKey: '',
                  isClickOptions: false,
              });
          // $('.emap_control_testPathAnalysisCtrl .pathAnalysisWrap .tabItemClass').css('height') = $('.emap_control_testPathAnalysisCtrl .pathAnalysisWrap .tabItemClass').css('height') - 60px;
      }
      if (item.clickClass === 'el-icon-remove') {
          if (this.pathMainDatas[index].isClickOptions) {
              console.log(item, index);
          }
          this.pathMainDatas.splice(index, 1);
          this.addPathNodeNum--;
          this.getComponent().removeMidPoints();
      }
  }
    // -------点击路径节点前面的图标--------
  public  toClickPreIcon(item: any, index: any) {
      item.position = index;
      this.getComponent().startSelectPoint(item);
  }
    // ---------路径节点翻事件--------------
  public  toReverse() {
      let tempFlag = true; // 默认pathMainDatas这个数组的inputkey都有值
      this.pathMainDatas.forEach((item: any) => {
          if (!item.inputKey) {// 只要有一个没有值，就认为没有值
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
      this.pathMainDatas[0].clickClass = 'el-icon-circle-plus';
      this.pathMainDatas[this.pathMainDatas.length - 1].iconClass = 'preIcon endIcon';
      this.pathMainDatas[this.pathMainDatas.length - 1].clickClass = '';
      this.getComponent().reversePoints(this.pathMainDatas);
      // 发请求
      // 这个tabindex参数在公交查询中没什么实质作用，true表示，不是点击那个放大镜的搜索按钮，取当前的参数

      this.toSearchPath(true);
  }

    // ----------tab切换事件----------------
  public  toTabItemClick(item: any, index: any) {
      this.tabIndex = index;

      this.toSearchPath(true);
  }

  public  initMapEvents() {
      const self = this;

      this.getComponent().on('dealPathMainDatasStart', function(data: any) {
          self.dealPathMainDatas(data.location, data.position, true, data.address);
          console.log(data);
      });
      this.getComponent().on('dealPathMainDatasMiddle', function(data: any) {
          self.dealPathMainDatas(data.location, data.position, true, data.address);
          console.log(data);
      });
      this.getComponent().on('dealPathMainDatasEnd', function(data: any) {
          self.dealPathMainDatas(data.location, data.position, true, data.address);
          console.log(data);
      });
      this.getComponent().on('querypathMoreInfo', function(data: any) {
          self.getComponent().clearPopup();
          self.clickMoreState = true;
          self.typeIndex = 'driving';
      });
      this.getComponent().on('querypathPopupOpen', function(data: any) {
        self.clickMoreState = false;
      });
  }
//         * @param {*} opts
// * @param opts.startPoint [x,y]
// * @param opts.endPoint [x,y]
  public  updateCurInput(opts: any) {
      this.doWithPathResultData(opts);
  }  private created() {
      this.initMapEvents();
  }  private mounted() {
      // var pathAlsTabItem = new childCom({
      //     el: '#pathAlsTabItem',  // 容器id
      // })
      const test  = this.getComponent();
      console.log(test);

  }  private destroyed() {
      // this.getComponent() &&
      // this.getComponent().remove();
  }}
</script>
<style lang='less' scoped>
  @imgPath: '../../../../assets/img/gisModule/pathAnalysis';
  .emap_control_testPathAnalysisCtrl {
  font-size: 14px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  color: #666;
  .closedContainer {
    .el-loading-spinner {
      .circular {
        height: 20px;
        width: 20px;
        background: #ffffff;
      }
    }
  }
  .pathAnalysisCtrl_wrap {
    position: absolute;
    left: 2050px;
    top: 198px;
    width: 500px;
    background: url("@{imgPath}/bg.png") no-repeat;
    background-size: 100% 100%;
    min-height: 700px;
    padding-bottom: 20px;
  }
  .pathTop {
    .topIcon {
      position: absolute;
      right: -78px;
      width: 90px;
      height: 53px;
      top: 0;
      bottom: 1px;
      background: url("@{imgPath}/searchbg.png") no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      color: #fff;
      font-size: 24px;
      line-height: 53px;
      text-align: center;
      &:hover {
        position: absolute;
        right: -78px;
        width: 90px;
        height: 53px;
        top: 0;
        bottom: 1px;
        background: url("@{imgPath}/searchbg_hover.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        color: #fff;
        font-size: 24px;
        line-height: 53px;
        text-align: center;
      }
    }
  }
  .alsTabForTool {
    padding: 0;
    display: flex;
    flex-wrap: nowrap;
    background-color: transparent;
    box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
    width: 92%;
    margin: 0 auto;
    .alsTabItem {
      width: 50%;
      text-align: center;
      cursor: pointer;
      color: #ffffff;
      height: 60px;
      line-height: 60px;
      font-size: 28px;
      background: url("@{imgPath}/tabbg.png") no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      &:nth-child(1) {
        i {
          background: url("@{imgPath}/tab1.png") no-repeat;
          background-size: 100% 100%;
          height: 30px;
          width: 30px;
          position: absolute;
          left: 21px;
          top: 74px;
          &.active {
            background: url("@{imgPath}/tab1-hover.png") no-repeat;
            background-size: 100% 100%;
            height: 30px;
            width: 30px;
            position: absolute;
            left: 20px;
            top: 73px;
            font-size: 28px;
          }
        }
      }
      &:nth-child(2) {
        i {
          background: url("@{imgPath}/tab2.png") no-repeat;
          background-size: 100% 100%;
          height: 30px;
          width: 35px;
          position: absolute;
          left: 263px;
          top: 73px;
          &.active {
            background: url("@{imgPath}/tab2-hover.png") no-repeat;
            background-size: 100% 100%;
            height: 30px;
            width: 35px;
            position: absolute;
            left: 262px;
            top: 73px;
          }
        }
      }
    }
  }
  .pathMainWrap {
    display: flex;
    flex-wrap: nowrap;
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
        background: url("@{imgPath}/revert.png") no-repeat 0 0;
        margin-top: 15px;
      }
    }
    .pathRight {
      box-sizing: border-box;
      width: calc(90%);
      margin-left: 1%;
      .pathMainItem {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        border-bottom: 1px solid #1e6077;
        height: 60px;
        .cancelInput {
          width: 23px;
          height: 23px;
          background: url("@{imgPath}/cancel.png") no-repeat 0 0;
          background-size: 100% 100%;
          margin-top: 20px;
          cursor: pointer;
        }
        i {
          &.el-icon-circle-plus {
            width: 27px;
            height: 27px;
            background: url("@{imgPath}/addPath.png") no-repeat 0 0;
            background-size: 100% 100%;
            margin-top: 18px;
            margin-left: 10px;
            cursor: pointer;
          }
          &.el-icon-remove {
            width: 27px;
            height: 27px;
            background: url("@{imgPath}/deletePath.png") no-repeat 0 0;
            background-size: 100% 100%;
            margin-top: 18px;
            margin-left: 10px;
            cursor: pointer;
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
        .preIcon {
          width: 23px;
          height: 59px;
          padding-top: 21px;
          cursor: pointer;
        }
        .startIcon {
          background: url("@{imgPath}/start2.png") no-repeat 0;
        }
        .stopIcon {
          background: url("@{imgPath}/stop2.png") no-repeat 0;
        }
        .endIcon {
          background: url("@{imgPath}/end2.png") no-repeat 0;
        }
        .inputKeyClass {
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
  .inputOptions {
    background: #04152f;
    display: none;
    max-height: 300px;
    overflow-y: auto;
    box-sizing: border-box;
    width: calc(100% - 35px);
    margin:0px 16px 8px 19px;
    li {
      padding: 6px 10PX;
      cursor: pointer;
    }
    .nodataLi {
      background: #fff;
      padding: 20px 10PX;
      text-align: center;
    }
  }
  .errPanel-container {
    background: #ffffff;
    margin-top: 4px;
    width: 95%;
    box-sizing: border-box;
    padding: 10px;
    color: #4c4c4c;
    font-size: 26px;
    margin: 0 auto;
    .address {
      color: #c00;
      font-size: 26px;
    }
    .type {
      color: tomato;
    }
  }
  .pathAnalysisWrap {
    display: none;
    background: transparent;
    margin-top: 4px;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 10px;
    .alsTab {
      padding: 0 10px;
      border-bottom: 1px solid #e1e1e1;
      display: flex;
      flex-wrap: nowrap;
      .alsTabItem {
        line-height: 40px;
        width: 33.3%;
        text-align: center;
        cursor: pointer;
        color: #bbc3c9;
        background-color: #14445e;
        font-size: 26px;
        &.tabItemActive {
          color: #ffffff;
          border-bottom: 3px solid #3C8CE7;
          background-color: #1e6077;
          font-size: 26px;
        }
        &:hover {
          color: #ffffff;
          border-bottom: 3px solid #3C8CE7;
          background-color: #1e6077;
          font-size: 26px;
        }
      }
    }
    .resultLength {
      margin: 0 5%;
      width: 90%;
      padding: 5px;
      background: #144661;
      color: #fff;
      font-size: 16px;
      display: flex;
      box-sizing: border-box;
      align-content: center;
      .time-left {
        flex: 6;
        font-size: 24px;
        padding: 0 5px;
      }
      .time-middle {
        width: 1px;
        background-color: #1e6077;
      }
      .time-right {
        flex: 6;
        font-size: 14px;
        p {
          text-align: center;
          font-size: 24px;
          &:nth-child(2) {
            text-align: center;
            font-size: 12px;
            span {
              color: #fff;
              font-size: 20px;
              font-weight: normal;
            }
          }
          span {
            text-align: center;
            color: tomato;
          }
        }
      }
      span {
        color: tomato;
        font-weight: bold;
      }
    }
    // .tabItemClass {
    //   margin: 2px 0;
    //   height: 300px;
    //   padding: 0 10px;
    //   overflow-y: auto;
    //   .tabListItemWrap {
    //     box-sizing: border-box;
    //     width: 100%;
    //     position: relative;
    //     border: 1px solid #4af4ff;
    //     margin-top: 7px;
    //     padding: 8px 0;
    //     cursor: pointer;
    //     div {
    //       position: absolute;
    //       left: 0px;
    //       top: 8px;
    //       width: 45px;
    //       height: 33px;
    //       z-index: 30;
    //       background-repeat: no-repeat;
    //       background-size: 12px 14px;
    //       background-position: center center;
    //     }
    //     .right {
    //       background-image: url("@{imgPath}/right.png");
    //     }
    //     .left {
    //       background-image: url("@{imgPath}/left.png");
    //     }
    //     .straight {
    //       background-image: url("@{imgPath}/straight.png");
    //     }
    //     .tabListItem {
    //       width: 100%;
    //       line-height: 33px;
    //       text-indent: 45px;
    //       color: #fff;
    //       font-size: 26px;
    //       b {
    //         font-weight: normal;
    //         color: #4af4ff;
    //       }
    //     }
    //   }
    // }
  }
  .busPanelContainer {
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
        background: url("@{imgPath}/trainbg.png") no-repeat 0 0;
        background-size: 100% 100%;
        font-size: 24px;
      }
    }
    .busTabContainer {
      padding: 2px 14px;
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
      padding: 0 10px 15px 10px;
      max-height: 360px;
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
            background: url("@{imgPath}/tj.png") center center no-repeat;
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
              top: 0px;
              right: 0;
              height: 8px;
              width: 17px;
              border-top: 8px solid rgba(17, 191, 234, 8);
              border-bottom: 0px solid rgba(156, 182, 255, 0);
              border-left: 8px solid rgba(156, 182, 255, 0);
              border-right: 8px solid rgba(156, 182, 255, 0);
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
  .test-icon {
    width: 58px;
    height: 58px;
    background: url("@{imgPath}/pathBtn.png") no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: 400px;
    left: 1130px;
    cursor: pointer;
    &:hover {
      width: 58px;
      height: 58px;
      background: url("@{imgPath}/pathBtn-hover.png") no-repeat 0 0;
      background-size: 100% 100%;
      position: absolute;
      top: 400px;
      left: 1130px;
      cursor: pointer;
    }
  }
}
.emap_control_testPathAnalysisCtrl .alsTabForTool .tabItemActive,
.emap_control_testPathAnalysisCtrl .alsTabForTool .alsTabItem:hover {
  color: #ffff86;
  background: url("@{imgPath}/tabbg_hover.png") no-repeat;
  background-size: 100% 100%;
  height: 60px;
  display: inline-block;
  font-size: 28px;
  line-height: 60px;
}
/*.emap_control_testPathAnalysisCtrl .pathMainWrap .pathRight .pathMainItem i{*/
/*    width: 18px;*/
/*    height: 18px;*/
/*    background: url('../../img/closepath.png') no-repeat 0 0;*/
/*    background-size: 100% 100%;*/
/*    margin-top: 6px;*/
/*    margin-left: 5px;*/
/*    cursor: pointer;*/
/*}*/
/*.emap_control_testPathAnalysisCtrl .pathMainWrap .pathRight .pathMainItem .el-icon-circle-plus,*/
/*.emap_control_testPathAnalysisCtrl .pathMainWrap .pathRight .pathMainItem .el-icon-remove {*/
/*    margin-top: 6px;*/
/*    margin-left: 5px;*/
/*    font-size: 18px;*/
/*    cursor: pointer;*/
/*}*/
.emap_control_testPathAnalysisCtrl .pathMainWrap .pathRight .pathMainItem .el-icon-circle-plus:before,
.emap_control_testPathAnalysisCtrl .pathMainWrap .pathRight .pathMainItem .el-icon-remove:before {
  color: #76aeee;
}
.emap_control_testPathAnalysisCtrl .pathAnalysisWrap .alsTab .tabItemActive,
.emap_control_testPathAnalysisCtrl .pathAnalysisWrap .alsTab .alsTabItem:hover {
  color: #ffffff;
  border-bottom: 3px solid #3c8ce7;
  background-color: #1e6077;
  font-size: 26px;
}
.emap_control_testPathAnalysisCtrl .busPanelContainer .alsCrossTab .tabCrossItemActive,
.emap_control_testPathAnalysisCtrl .busPanelContainer .alsCrossTab .alsCrossTabItem:hover {
  color: #ffffff;
  background: url(../../img/trainbg_hover.png) no-repeat 0 0;
  background-size: 100% 100%;
}
.emap_control_testPathAnalysisCtrl .busPanelContainer .busTabContainer .busTabItemActive,
.emap_control_testPathAnalysisCtrl .busPanelContainer .busTabContainer .busTabItem:hover {
  background: #1e6077;
  color: #fff;
}
.emap_control_testPathAnalysisCtrl .busPanelContainer .pathResult-container .pathResultItem-container .overview-container:hover,
.emap_control_testPathAnalysisCtrl .busPanelContainer .pathResult-container .pathResultItem-container .overviewContainerIsactive {
  background: transparent;
}
.compComp-mapComponentPanel {
  position: absolute;
  left: 160px;
  top: 25px;
  border-radius: 3px;
  outline-offset: -2px;
  font-size: 14px;
  z-index: 10;
  -webkit-box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  .inputKeyClass {
    .el-input__inner {
      font-size: 14px;
      border-color: #d8d8d8;
      border-radius: 0;
    }
  }
}
.compComp-mapComponentPanel .el-form-item--small .el-input__inner,
.compComp-mapComponentPanel .el-form-item--small .el-textarea__inner {
  font-size: 14px;
  border-color: #d8d8d8;
  border-radius: 0;
}
.compComp-mapComponentPanel .el-form-item--mini.el-form-item,
.compComp-mapComponentPanel .el-form-item--small.el-form-item {
  margin-bottom: 14px;
}
.compComp-mapComponentPanels {
  position: absolute;
  left: 546px;
  top: 88px;
  border-radius: 3px;
  outline-offset: -2px;
  font-size: 14px;
  z-index: 10;
  -webkit-box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  .inputKeyClass {
    .el-input__inner {
      font-size: 14px;
      border-color: #d8d8d8;
      border-radius: 0;
    }
  }
}
.compComp-mapComponentPanels .el-form-item--small .el-input__inner,
.compComp-mapComponentPanels .el-form-item--small .el-textarea__inner {
  font-size: 14px;
  border-color: #d8d8d8;
  border-radius: 0;
}
.compComp-mapComponentPanels .el-form-item--mini.el-form-item,
.compComp-mapComponentPanels .el-form-item--small.el-form-item {
  margin-bottom: 14px;
}
/*面板上标题部分样式*/
.compComp-mapComponent-topContainer {
  background-color: transparent;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  -webkit-box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
  -moz-box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
  box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
  .close {
    position: absolute;
    width: 23px;
    height: 23px;
    right: 25px;
    top: 18px;
    background: url("@{imgPath}/close.png") center center no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .min-icon {
    position: absolute;
    width: 23px;
    height: 5px;
    right: 65px;
    top: 27px;
    background: url("@{imgPath}/min.png") center center no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .title {
    line-height: 1.375;
    padding: 14px 33px 5px;
    font-size: 28px;
    color: #fda100;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
    width: calc(60%);
  }
  .closedContainer {
    padding: 6px 0;
    margin: 0 4%;
    text-align: center;
    font-size: 16px;
    line-height: 1.375;
    cursor: pointer;
    color: #cecece;
    transform: scale(1.2);
    &:hover {
      color: #333333;
    }
  }
  .el-icon-caret-bottom {
    color: #cecece;
    cursor: pointer;
    &:hover {
      color: #333;
      cursor: pointer;
    }
  }
  .el-icon-caret-top {
    color: #cecece;
    cursor: pointer;
    &:hover {
      color: #333;
      cursor: pointer;
    }
  }
}
/*  border-bottom: 1px solid rgba(26, 30, 38, 0.05);*/
/*简单面板内容包裹层*/
.compComp-mapComponent-bodyContainer {
  background: transparent;
  padding: 3%;
}
.custom-btn {
  &.el-button {
    border-radius: 0;
    border-color: #d8d8d8;
    &:hover {
      border-color: #3c8ce7;
    }
  }
}
/*Tab内容包裹层*/
.compComp-mapComponent-tabContainer {
  .tabNavContainer {
    background-color: #ffffff;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-content: center;
    align-items: center;
    font-size: 16px;
    color: #999999;
    margin-bottom: 5px;
    .item {
      height: 51px;
      line-height: 51px;
      cursor: pointer;
    }
  }
  .tabContentContainer {
    padding: 30px 20px 0px 20px;
    background-color: #ffffff;
    .makePointBtnContainer {
      height: 50px;
      position: relative;
      .makePointBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 98px;
        height: 26px;
        background: #ffffff;
        border: 1px solid #dddddd;
        font-size: 14px;
        color: #999999;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-content: center;
        align-items: center;
        cursor: pointer;
        .btnImg {
          width: 11px;
          height: 14px;
          background: url("@{imgPath}/makePointBtn.png") center center no-repeat;
          background-size: 100% 100%;
        }
        .text {
          padding-left: 5px;
        }
        &:hover {
          color: #333333;
        }
      }
    }
    .queryBtnContainer {
      padding-bottom: 26px;
      .queryBtn {
        margin: 0 auto;
        width: 90px;
        height: 36px;
        text-align: center;
        background: #3c8ce7;
        color: #ffffff;
        line-height: 36px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
.compComp-mapComponent-tabContainer .tabNavContainer .item:hover,
.compComp-mapComponent-tabContainer .tabNavContainer .tabNavActive {
  border-bottom: 3px solid #3c8ce7;
  color: #3c8ce7;
}
.compComp-mapComponentList {
  position: absolute;
  width: 350px;
  z-index: 10;
  background: #ffffff;
  .mainContainer {
    .tableContainer {
      height: 243px;
      .tableRowContainer {
        padding: 0 16px;
        cursor: pointer;
        .tableRow {
          border-bottom: 1px solid #f3f3f3;
          height: 41px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-content: center;
          align-items: center;
          font-size: 14px;
          color: #999999;
          padding: 0 4px;
          .rowName {
            width: 174px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .pageContainer {
      position: relative;
      padding-top: 14px;
      .curPageContainer {
        display: inline-block;
        width: 40px;
        height: 26px;
        text-align: center;
      }
      .pageTotalNum {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 50px;
        color: #999999;
        font-size: 12px;
      }
    }
  }
}
.compComp-mapComponentList .mainContainer .tableContainer .tableRowContainer:hover,
.compComp-mapComponentList .mainContainer .tableContainer .rowActive {
  background: #f5faff;
}
.compComp-mapComponent-operate-container {
  background: #ffffff;
  text-align: center;
  padding-top: 12px;
  padding-bottom: 12px;
  box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.06);
  .makesure-btn {
    margin-right: 13px;
  }
}
.compComp-mapComponent-operate-container .makesure-btn,
.compComp-mapComponent-operate-container .reset-btn {
  width: 90px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border: 1px solid #dddddd;
  display: inline-block;
  cursor: pointer;
  font-size: 14px;
  color: #666666;
}
.compComp-mapComponent-operate-container .makesure-btn:hover,
.compComp-mapComponent-operate-container .reset-btn:hover {
  background: #3c8ce7;
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0);
}
.compMap-znGeocoding-map-panel {
  max-width: 360px;
  border-radius: 3px;
  outline-offset: -2px;
  font-size: 14px;
  z-index: 10;
  -webkit-box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0 6px rgba(0, 0, 0, 0.3);
  background: #ffffff;
  color: #000;
  .curPanel-title {
    background-color: #ffffff;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    -webkit-box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
    -moz-box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
    box-shadow: inset 0px -1px 0px rgba(26, 30, 38, 0.1);
    padding: 12px 15px;
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      white-space: nowrap;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .closed-container {
      white-space: nowrap;
      margin-left: 15px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      color: #cecece;
      &:hover {
        color: #333333;
      }
    }
  }
  .curPanel-content {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 5px;
    max-height: 230px;
    overflow-y: auto;
    .item {
      padding: 8px 0px;
      color: #333333;
      & > span {
        &:first-child {
          color: #000000;
          padding-right: 4px;
        }
        &:nth-child(2) {
          color: #999999;
        }
      }
    }
  }
}
</style>