<!--力量调度的首页-->
<template>
  <div class="rescueTeamsHome">
    <div class="rescueTeamsHome_hd title-panel">
      <p>应急力量</p>
      <ZoomBtn></ZoomBtn>
      <span
        v-if="
          isCloseAndback &&
            $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
        "
        class="closeAndback"
        @click="closeAndbackFn"
      ></span>
    </div>
    <template v-if="true">
      <div
        class="DiscussTab"
        v-if="
          (this.$store.state.configModel.config.RescueTeamsContainer
            .notShowTabFlag &&
            !this.$store.state.eventPushStore.eventLocation.geometry) ||
            (this.$store.state.eventPushStore.eventId &&
              !this.$store.state.eventPushStore.eventLocation.geometry)
        "
      >
        <div v-show="isEnterDispose">
          <span
            class="DiscussTab_span"
            v-for="(item, index) of tabList"
            :class="{ dengjihoverbglan: item.checked }"
            @click.stop="handleTabClick(item, index)"
            :key="item.txt"
          >
            <font class="f-tit-h2"> {{ item.txt }}</font></span
          >
        </div>
      </div>
      <!--统计-->
      <div id="MapDialog">
        <!--这里是面的统计-->
        <ul class="statisticCount f-tit-h2">
          <li style="color: #fff;">
            共计<span>{{ nteamtotal }}</span
            >支队伍<span>{{ numtotal }}</span
            >人
          </li>
          <li style="color: #fff;" v-if="isshowEquipCompNum">
            重型装备<span>{{ statisticData.EquipCompNum }}</span
            >{{ statisticData.EquipCompUnit }}
          </li>
        </ul>
      </div>
      <el-scrollbar :style="{ height: isshowEquipCompNum ? '664px' : '600px' }">
        <div class="rescueTeamsHome_cnt">
          <div
            class="rescueTeamItem"
            v-for="(slItem, slIndex) of statisticsList"
            :key="slItem.key"
          >
            <div class="tempRight-title  f-tit-h2">
              <!--只有当前选中且数据大于0的时候才会高亮-->
              <span
                :title="slItem.title"
                @click.stop="
                  handleClickStatisticsTitle(slItem, slIndex, statisticsList)
                "
                :class="
                  curActiveStatistics.key === slItem.key && slItem.teamnum
                    ? 'itemName-active'
                    : ''
                "
              >
                {{ slItem.title }}
              </span>
              <span class="tempRight-total">
                <span class="f-number">{{ nteamtotal }}</span></span
              >
              <span class="tempRight-unit">{{ slItem.teamUnit }}</span>
              <i
                :class="
                  slItem.showSub
                    ? 'tempRight-switch'
                    : 'tempRight-switch tempRight-switch-reverse'
                "
                @click.stop="expandSublist(slItem, slIndex, statisticsList)"
              ></i>
            </div>
            <template v-if="slItem.showSub">
              <div class="tempRight-cont">
                <div class="team-ul">
                  <div
                    class="tempRight-itemTitle"
                    :class="{ gray: !slsItem.teamnum }"
                    v-for="(slsItem, slsIndex) of statisticsList[0].subList"
                    :key="slsItem.codeType"
                  >
                    <div class="tempRight-icon_bg" :class="slsItem.icon_bg">
                      <i
                        class="teamIcon"
                        :class="'teamIcon-' + slsItem.icon"
                      ></i>
                    </div>
                    <div
                      class="tempRight-itemName"
                      :title="slsItem.name"
                      :class="slsItem.active ? 'itemName-active' : ''"
                      @click.stop="
                        handleClickSubitemTitle(
                          slsItem,
                          slsIndex,
                          slItem.subList,
                          slItem,
                          slIndex,
                          statisticsList
                        )
                      "
                    >
                      <span class="f-txt-com">{{ slsItem.name }}</span>
                    </div>
                    <div class="tempRight-itemNum f-txt-com">
                      <em class="text-number f-number slsItemName">{{
                        slsItem.teamnum
                      }}</em>
                      <i class="text-unit slsItemUnit">{{
                        slsItem.teamUnit
                      }}</i>
                      <span
                        class="instake_cont"
                        @click.stop="
                          handleClickSubitemNum(
                            slsItem,
                            slsIndex,
                            slItem.subList,
                            slItem,
                            slIndex,
                            statisticsList
                          )
                        "
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!--航空护林站-->
        <div class="AirStation" v-if="isShow">
          <div class="rescueTeamsHome_cnt">
            <div class="rescueTeamItem">
              <div class="AirStation_title">
                <h2 class="f-tit-h2">{{ hankongData.provinces }}</h2>
              </div>
              <div class="tempRight-title  f-tit-h2">
                <!--只有当前选中且数据大于0的时候才会高亮-->
                <span
                  :title="hankongData.title"
                  @click="hankongMapshiye"
                  :class="hankongMapshiyeIsshow ? 'itemName-active' : ''"
                >
                  {{ hankongData.title }}
                </span>
                <span class="tempRight-total">
                  <span class="f-number">{{ hankongData.total }}</span></span
                >
                <span class="tempRight-unit">{{ hankongData.util }}</span>
                <i
                  :class="
                    hankongData.showSub
                      ? 'tempRight-switch'
                      : 'tempRight-switch tempRight-switch-reverse'
                  "
                  @click.stop="expandSublist(hankongData)"
                ></i>
              </div>
            </div>
            <template v-if="true">
              <div class="tempRight-cont">
                <el-scrollbar
                  :wrap-style="
                    'max-height:' + 535 / statisticsList.length + 'px;'
                  "
                >
                  <div class="team-ul">
                    <div
                      class="tempRight-itemTitle"
                      :class="{ gray: !slsItem.distance }"
                      v-for="(slsItem, slsIndex) of statisticsList[0].subList"
                      :key="slsIndex"
                      @mouseenter="handerAddTerminalPoint(slsItem)"
                      @mouseleave="handerClearTerminalPoint"
                      @click="TerminalDetails(slsItem)"
                    >
                      <div class="tempRight-itemName" :title="slsItem.name">
                        <span class="f-txt-com">{{ slsItem.name }}</span>
                      </div>
                      <div class="tempRight-itemNum  f-txt-com">
                        <em class="text-number f-number" style="right:65px">{{
                          slsItem.distance
                        }}</em>
                        <i class="text-unit">{{ slsItem.teamUnit }}</i>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
    </template>
    <template v-else>
      <div class="loading"></div>
    </template>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import serverApi from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import {
  airStationServer,
  rescueTeamServerTeamout,
  districtServer,
  rescueTeamServer,
} from '@/api/installServer';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
// import { RealTimeCar } from '../../../api/feature/searchresource/RealTimeCar';
import { initGeometry } from './gemoJson';
@Component({
  name: 'RescueTeamsHome',
  components: {
    ZoomBtn,
  },
})
export default class RescueTeamsHome extends Vue {
@Prop() private parentHandleClickNumFn?: any; // 父 组件处理点击数字的方法

  private isshowEquipCompNum: boolean = false; // 是否显示重要装备统计数据
  private statisticData: any = {
    // 渲染统计数据
    teamNum: 0,
    teamUnit: '支',
    peopleNum: 0,
    personUnit: '人',
    EquipCompNum: 0,
    EquipCompUnit: '件',
  };
  // 航空护林站
  private hankongData: any = {};
  private isShow: any = false;
  private hankongMapshiyeIsshow: any = false;
  private isShowOutTeam: boolean = false;

  // 航空护林队给后台传的参数
  private SendOutHankongData: any = {
    latitude: '',
    longitude: '',
    typeCode: '',
  };

  private curCacheResData: any = {}; // 调用地图方法拿到的当前数据的汇总cache
  // 判断是否进入处置模式，显示经验圈和列表高度配置
  get isEnterDispose() {
    return (
      this.$store.state.dataFilterControl.zhypGeoType &&
      (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
        this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp')
    );
  }
  private curMapType: number = 0; // 当前类型：经验圈还是烈度圈 1是烈度圈，0是经验圈
  private curTitle: string = ''; // 本组件面板的title
  private loadingState: boolean = false;
  /** 5,10,20,50 */
  private tabList: any = []; // [5km,10km,20km,50km]
  private geometryArr: any = []; // 经验圈或者烈度圈的geometryArr

  /** statisticsList 统计面板 */
  private statisticsList: any = [];
  private curActiveStatistics: any = {
    // 当前选中的统计，例如队伍分布
    key: 'vue-created', // 专门给初始化用的key，用来和取消选中后，切换tab区分开
  };
  private statisticsListCache: any = []; // 用来缓存当前二级标题被点击的状态，用来做经验圈、烈度圈数据还原用的。
  private isCloseAndback: boolean = false; // 是否显示返回按钮
  private numtotal: number = 0;
  private nteamtotal: number = 0;
  private dataTeam: any = [
    {
      fxkhd: 0, // '防汛抗旱队'
      xfjyd: 0, // '消防救援队'
      slxfjyd: 0, // '森林消防救援队'
      whpjyd: 0, // '危化品救援队'
      mkjyd: 0, // '煤矿救援队'
      fmksjyd: 0, // '非煤矿山救援队'
      smltjud: 0, // '商贸流通救援队'
      jtysjyd: 0, // '交通运输救援队'
      yjgdjyd: 0, // '应急供电救援队'
      ydtxjyd: 0, // '移动通讯救援队'
      rqjyd: 0, // '燃气救援队'
      hjjyd: 0, // '环境救援队'
      dljyd: 0, // '打捞救援队'
      hsjyd: 0, // '海上救援队'
      cpyyjyd: 0, // '船舶溢油救援队'
      ylwsd: 0, // '医疗卫生队'
      gkmtqxd: 0, // '港口码头抢险队'
      gkkyzyjd: 0, // '港口客运场站应急队'
      gksgaqd: 0, // '港口施工安全队'
      jzyjjyd: 0, // '建筑应急救援队'
      kyyjjyd: 0, // '客运应急救援队'
      yjyld: 0, // '应急运力队'
      jxsbshll: 0, // '机械设备社会力量'
      mjjyd: 0, // '民间救援队'
    },
  ];
  /**
   * 更新当前选中（上图）的情况，针对一级标题
   */
  private handleClickStatisticsTitle(
    slItem: any,
    slIndex: number,
    statisticsList: any,
  ) {
    if (!slItem.teamnum) {
      // 没有数据，不执行点击
      return;
    }
    this.statisticsListCache = []; // 清空二级标题选中的缓存
    this.getComponent().clear();
    this.getComponentEquipComp().clear();
    // 相等反选，否则为true
    slItem.active = this.curActiveStatistics.key === slItem.key ? false : true;
    // this.statisticsList[slIndex] = slItem;
    // 利用引用地址
    this.statisticsList.forEach((slfItem: any, slfIndex: number) => {
      slfItem.active = slfIndex === slIndex ? slItem.active : false;
      slfItem.subList.forEach((slfsubItem: any, slfsubIndex: number) => {
        slfsubItem.active = false;
      });
    });

    if (slItem.active) {
      // 当前选中
      this.curActiveStatistics = JSON.parse(JSON.stringify(slItem));
      const codeTypeArr = this.getTypeArr(this.curActiveStatistics);
      const levelArr = this.getActiveTablistArr();
      if (slItem.key === '') {
        this.getComponent().showResource(
          codeTypeArr,
          levelArr,
          slItem.qiantuFlag,
        );
      } else {
        this.getComponentEquipComp().showResource(codeTypeArr, levelArr);
      }
    } else {
      this.curActiveStatistics = {};
    }
  }

  // 获取航空护林队的数据
  private gitAirStationData() {
    const self: any = this;
    self.longitude = self.$store.state.eventPushStore.eventLocation.EventLon;
    self.latitude = self.$store.state.eventPushStore.eventLocation.EventLat;
    self.SendOutHankongData.longitude = self.longitude;
    self.SendOutHankongData.latitude = self.latitude;
    airStationServer.getData(self.SendOutHankongData).then((res: any) => {
      if (res.data) {
        this.isShow = true;
        self.hankongData = res.data;
        self.hankongData.showSub = false;
        this.getComponentAirTeam().load();
      } else {
        this.isShow = false;
      }
    });
  }

  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private gitAirStationDataSwitch(): void {
    const eventType: number | string = this.$store.state.eventPushStore
      .eventLocation.EventType;
    // 如果EventType 等于9航空护林站显示
    if (eventType === 9 || eventType === '9') {
      this.isShow = true;
      this.gitAirStationData(); // 获取航空护林站的数据
    } else if (eventType === 10 || eventType === '10') {
      this.isCloseAndback = true;
    } else {
      this.isShow = false;
    }
  }

  // 航空护林队列表点击事件
  private TerminalDetails(data: any) {
    this.getComponentAirTeam().showPopup(data.id);
  }
  // 航空护林队列表点击事件
  private hankongMapshiye() {
    if (this.hankongMapshiyeIsshow) {
      this.getComponentAirTeam().hideResource();
    } else {
      this.getComponentAirTeam().showResource();
    }
    this.hankongMapshiyeIsshow = !this.hankongMapshiyeIsshow;
  }
  // 添加护林站列表点击地图点位hover效果
  private handerAddTerminalPoint(data: any) {
    this.getComponent1().addHover('airteam', data.id);
  }
  // 清除护林站列表点击地图点位hover效果
  private handerClearTerminalPoint(data: any) {
    this.getComponent1().clearHover();
  }
  /**
   * 获得当前选中的tablist的level的字符串数组 ['20']或者 ['9','8']
   */
  private getActiveTablistArr() {
    const arr: any = [];
    this.tabList.forEach((item: any, index: number) => {
      if (item.checked) {
        arr.push(item.level);
      }
    });
    return arr;
  }

  private emeitSchedulingdynamics() {
    this.messsageBus.emit('emeitSchedulingdynamics', false);
  }

  /**
   * 更新当前选中（上图）的情况，针对二级标题
   * 这里把父级的数据也拿到了，为了以后扩展用
   */
  private handleClickSubitemTitle(
    slsItem: any,
    slsIndex: number,
    subList: any,
    slItem: any,
    slIndex: number,
    statisticsList: any,
  ) {
    if (!slsItem.teamnum) {
      // 没有数据，不执行点击
      return;
    }
    this.getComponent_new()._clearLayerByID(slsItem.mapkey);
    this.getComponent_new()
      .getMultiuleOneNum(slsItem.mapkey)
      .then((res: any) => {
        const temp: any = [];
        const tempTotal: any = [];
        Object.keys(res).forEach((item) => {
          temp.push({
            codeKey: item,
            tabNumber: res[item],
          });
        });
        temp.map((item: any) => {
          // this.nteamtotal = item.tabNumber.count+this.nteamtotal
          tempTotal.push(...item.tabNumber.list);
        });

        this.getComponent_new()._showPoint(tempTotal, slsItem.mapkey, '');
      });
    this.emeitSchedulingdynamics();
    const levelArr = this.getActiveTablistArr();
    // 由于一级标题互斥，且二级标题选中的时候，相应的一级标题要反选，所以这里要处理下
    if (this.curActiveStatistics.key) {
      // 有一级标题选中
      this.curActiveStatistics = {};
      this.getComponent().clear();
      this.getComponentEquipComp().clear();
      // this.statisticsList.forEach((slfItem: any, slfIndex: number)=>{ // 所有二级标题高亮取消，但是理论上，有一级选中的时候，也不会有二级标题选中
      //     slfItem.active =  false;
      //     slfItem.subList.forEach((slfsubItem: any, slfsubIndex: number)=>{
      //         slfsubItem.active = false;
      //     })
      // })
    } else if (this.statisticsList.length > 1) {
      // 例如，当前点击的是第一个二级标题，但是，前突队伍的二级标题已经有高亮的了，要取消掉的
      // this.getComponent().clear();
      this.statisticsList.forEach((slfItem: any, slfIndex: number) => {
        // 所有二级标题高亮取消，但是理论上，有一级选中的时候，也不会有二级标题选中
        if (slfIndex !== slIndex) {
          slfItem.subList.forEach((slfsubItem: any, slfsubIndex: number) => {
            if (slfsubItem.active) {
              if (slItem.key === 'TeamDistribution') {
                this.getComponent().hideResource(
                  [slfsubItem.codeType],
                  levelArr,
                  slfItem.qiantuFlag,
                );
              } else {
                this.getComponentEquipComp().hideResource(
                  [slfsubItem.codeType],
                  levelArr,
                );
              }
            }
            slfsubItem.active = false;
          });
        }
      });
    }

    slsItem.active = !slsItem.active;
    if (slsItem.active) {
      // 由未选中到选中，点位上图
      if (slItem.key === 'TeamDistribution') {
        if (
          this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
          this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
        ) {
          // 当是缓冲圈查询时的情况传入空间参数
          this.getComponent().showResource(
            [slsItem.codeType],
            levelArr,
            slItem.qiantuFlag,
          );
        } else {
          if (this.$store.state.dataFilterControl.filter.geometry) {
            this.getComponent().showResource(
              [slsItem.codeType],
              levelArr,
              slItem.qiantuFlag,
              JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
            );
          } else {
            this.getComponent().showResource(
              [slsItem.codeType],
              levelArr,
              slItem.qiantuFlag,
              initGeometry,
            );
          }
        }
      } else {
        this.getComponentEquipComp().showResource([slsItem.codeType], levelArr);
      }
    } else {
      // 清除该点位
      if (slItem.key === 'TeamDistribution') {
        if (
          this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
          this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
        ) {
          // 当是缓冲圈查询时的情况传入空间参数
          this.getComponent().hideResource(
            [slsItem.codeType],
            levelArr,
            slItem.qiantuFlag,
          );
        } else {
          if (this.$store.state.dataFilterControl.filter.geometry) {
            this.getComponent().hideResource(
              [slsItem.codeType],
              null,
              slItem.qiantuFlag,
              JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
            );
          } else {
            this.getComponent().hideResource(
              [slsItem.codeType],
              null,
              slItem.qiantuFlag,
              initGeometry,
            );
          }
        }
      } else {
        this.getComponentEquipComp().hideResource([slsItem.codeType], levelArr);
      }
    }

    this.statisticsListCache = JSON.parse(JSON.stringify(this.statisticsList));
  }

  /**
   * 点击二级标题的数字
   * 这里把父级的数据也拿到了，为了以后扩展用
   */
  private handleClickSubitemNum(
    slsItem: any,
    slsIndex: number,
    subList?: any,
    slItem?: any,
    slIndex?: number,
    statisticsList?: any,
  ) {
    if (!slsItem.teamnum) {
      return;
    }
    // const tabIndex = this.tabList.findIndex((tfItem: any, tfIndex: number) => {
    //     return tfItem.txt === this.curActiveTab.txt;
    // });
    const paramObj = {
      curNumItem: slsItem, // 当前选中的数字那一个对象
      curActiveTab: this.tabList, // 当前的队伍首页上边的那个tablist数组
      curMapParam: 'disasterJudgeNewTeam', // 地图的参数
      unit: '支', // 单位
      curStatisticsItem: slItem, // 当前选中的队伍分布或者前突队伍的那个大的对象
      curActiveStatistics: this.curActiveStatistics, // 当前高亮的一级标题
      curStatisticsListCache: this.statisticsListCache, // 缓存二级标题的高亮
      notShowTabFlag: Boolean(
        this.$store.state.configModel.config.RescueTeamsContainer.notShowTabFlag,
      ), // 是否显示上边的列表
    };
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(JSON.parse(JSON.stringify(paramObj)));
    }
  }

  /**
   * 监听烈度圈：1 ; 经验圈：0
   * 当图例改变时，这个面板要改变
   */
  @Watch('$store.state.dataFilterControl.zhypGeoType.key')
  private async getDataToCache(val?: any) {
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp') {
      return;
    } else if (this.$store.state.dataFilterControl.zhypGeoType.key === '') {
      return;
    }
    this.loadingState = true;
    this.isshowEquipCompNum = false;
    const tmpCacheResData: any = {};
    const vuexStatisticsList = JSON.parse(
      JSON.stringify(
        this.$store.state.configModel.config.RescueTeamsContainer.statisticsList,
      ),
    );
    for (const vslItem of vuexStatisticsList) {
      // 不用forearch的原因是，foreach和async在一起用，是并发。使得前突队伍和队伍分布的顺序会串掉
      const typeCodeArr = this.getTypeArr(vslItem);
      var result: any = {};
      if (vslItem.key === 'TeamDistribution') {
        result = await this.getDataByTeamTypeArr(
          typeCodeArr,
          !!vslItem.qiantuFlag,
        );
      } else {
        this.isshowEquipCompNum = true;
        result = await this.getDataByEquipCompTypeArr(typeCodeArr);
      }
      tmpCacheResData[vslItem.key] = result;
      tmpCacheResData.forTab = result;
    }
    this.curCacheResData = this.getTablistCache(tmpCacheResData); // 获得tablist
    this.loadingState = false;
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
      // 经验圈
      this.tabList = this.setRadiusTablist();
      const curActiveTabIndex = this.setRadiusDefault();
      this.handleTabClick(this.tabList[curActiveTabIndex], curActiveTabIndex);
    } else if (
      this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
    ) {
      // 烈度圈
      this.tabList = this.setLieduTablist();
      const curActiveTabIndex = this.setLieduDefault();
      this.handleTabClick(this.tabList[curActiveTabIndex], curActiveTabIndex);
    }
  }
  @Watch('$store.state.dataFilterControl.filter')
  private async changeList() {
    if (
      this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
      this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
    ) {
      this.getDataToCache();
      return;
    }
    this.loadingState = true;
    this.isshowEquipCompNum = false;
    const tmpCacheResData: any = {};
    const vuexStatisticsList = JSON.parse(
      JSON.stringify(
        this.$store.state.configModel.config.RescueTeamsContainer.statisticsList,
      ),
    );
    for (const vslItem of vuexStatisticsList) {
      // 不用forearch的原因是，foreach和async在一起用，是并发。使得前突队伍和队伍分布的顺序会串掉
      const typeCodeArr = this.getTypeArr(vslItem);
      var result: any = {};
      if (
        vslItem.key === 'TeamDistribution' &&
        this.$store.state.dataFilterControl.filter.geometry
      ) {
        result = await this.getDataByTeamTypeArr(
          typeCodeArr,
          !!vslItem.qiantuFlag,
          JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
        );
        this.loadingState = false;
      } else {
        result = await this.getDataByTeamTypeArr(
          typeCodeArr,
          !!vslItem.qiantuFlag,
          initGeometry,
        ); // initGemo是自己引路的给了一个默认的烟台的geometry
        this.loadingState = false;
      }
      tmpCacheResData[vslItem.key] = result;
      tmpCacheResData.forTab = result;
    }
    if (!this.loadingState) {
      this.getStatisticsList(result, vuexStatisticsList);
    }
  }
  private getStatisticsList(result: any, initlist: any) {
    //   this.statisticData.teamNum = 0;
    //   this.statisticData.peopleNum = 0;
    const list = initlist;
    //   const resultData = result[0].data;
    //   const objkeysArray = Object.keys(resultData.data);
    //   list[0].subList.forEach((item: any) => {
    // const isIn = objkeysArray.some((resultItem: any) => {
    //   return resultItem === item.codeType
    // })
    // if (isIn) {
    //   item.teamnum = resultData.data[item.codeType].teamnum
    //   item.peoplenum = resultData.data[item.codeType].peoplenum
    //   this.statisticData.teamNum += item.teamnum*1;
    //   this.statisticData.peopleNum += item.peoplenum*1;
    // }
    //   })
    //   list[0].teamnum = this.statisticData.teamNum;
    //   list[0].peoplenum = this.statisticData.peopleNum;
    this.statisticsList = list;
    for (const k of this.statisticsList[0].subList) {
      //   k.teamnum =
    }
    let index = 0;
    for (const j of this.statisticsList[0].subList) {
      index++;
      if (j.icon) {
        this.statisticsList[0].subList[index].teamnum = this.dataTeam[0][
          this.statisticsList[0].subList[index].icon
        ];
      }
    }
    // for (let i = 0; i < this.statisticsList[0].subList.length; i++) {
    //   if (this.statisticsList[0].subList[i].icon) {
    //   }
    //   this.statisticsList[0].subList[i].teamnum = this.dataTeam[0][this.statisticsList[0].subList[i].icon];
    // }
    this.DataSorting();
  }
  /**
   * 获得tablist
   */
  private getTablistCache(cacheResData: any) {
    var tablist: any = [];
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
      // 经验圈
      tablist = this.getRadiusTabList(cacheResData.forTab[0].data);
    } else if (
      this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
    ) {
      // 烈度圈
      tablist = this.getLieduTabList(cacheResData.forTab[0].data);
    }
    return this.setTabStatisticsList(cacheResData, tablist);
  }
  /**
   * 获得经验圈的tablist
   */
  private getRadiusTabList(resDataArr: any) {
    const tabList = resDataArr.map((item: any, index: number) => {
      const obj: any = {};
      obj.txt = item.level + 'km';
      obj.level = item.level;
      return obj;
    });
    return tabList;
  }

  /**
   * 获得烈度圈的tablist
   */
  private getLieduTabList(resDataArr: any) {
    const tabList = resDataArr.map((item: any, index: number) => {
      const dictObj: any = {
        5: 'Ⅴ',
        6: 'Ⅵ',
        7: 'Ⅶ',
        8: 'Ⅷ',
        9: 'Ⅸ',
      };
      const obj: any = {};
      obj.txt = dictObj[item.level];
      obj.level = item.level;
      return obj;
    });
    return tabList;
  }

  /**
   * 制作缓存数据，存放的是tablis和相应下所有的数据
   * tablist[{txt:'5km',level:'5'}]
   */
  private setTabStatisticsList(cacheResData: any, tablist: any) {
    this.statisticData.teamNum = 0;
    this.statisticData.peopleNum = 0;
    const cacheData: any = {};
    cacheData.tabList = JSON.parse(JSON.stringify(tablist));
    const vuexStatisticsList = JSON.parse(
      JSON.stringify(
        this.$store.state.configModel.config.RescueTeamsContainer.statisticsList,
      ),
    );
    tablist.forEach((tfItem: any, tfIndex: number) => {
      const circleObj: any = {};
      circleObj.statisticsList = [];
      vuexStatisticsList.forEach((vsfItem: any, vsfIndex: number) => {
        const newItem = JSON.parse(JSON.stringify(vsfItem));
        if (newItem.key === 'TeamDistribution') {
          const targetSourceItem = cacheResData[vsfItem.key][0].data[tfIndex];
          newItem.peoplenum = targetSourceItem.peoplenum;
          newItem.teamnum = targetSourceItem.teamnum;
          if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
            this.statisticData.teamNum = targetSourceItem.teamnum;
            this.statisticData.peopleNum = targetSourceItem.peoplenum;
          } else {
            this.statisticData.teamNum += targetSourceItem.teamnum * 1;
            this.statisticData.peopleNum += targetSourceItem.peoplenum * 1;
          }
          newItem.subList.forEach((mitem: any, mindex: number) => {
            // 利用forEach中的引用地址级联，这样newItem就发生了更改了
            mitem.peoplenum = targetSourceItem.data[mitem.codeType]
              ? targetSourceItem.data[mitem.codeType].peoplenum
              : 0;
            mitem.teamnum = targetSourceItem.data[mitem.codeType]
              ? targetSourceItem.data[mitem.codeType].teamnum
              : 0;
          });
        } else {
          const targetSourceItem = cacheResData[vsfItem.key][0].data[tfIndex];
          newItem.subList.forEach((mitem: any, mindex: number) => {
            // 利用forEach中的引用地址级联，这样newItem就发生了更改了
            const config: any = targetSourceItem.data.find(
              (v: any) => v.equiptypecode === mitem.codeType,
            );
            if (config && config.count > 0) {
              newItem.teamnum += config.count;
              mitem.teamnum = config.count;
            } else {
              mitem.teamnum = 0;
            }
          });
          this.statisticData.EquipCompNum = newItem.teamnum;
        }
        circleObj.statisticsList.push(newItem);
      });
      cacheData[tfItem.txt] = circleObj;
    });
    return cacheData;
  }

  /**
   * 通过地图方法获得所有的数据
   */
  private async getDataByTeamTypeArr(
    typeCodeArr: any,
    qiantuFlag: boolean,
    geo?: any,
  ) {
    const result: any = await this.getComponent().load(
      typeCodeArr,
      qiantuFlag,
      geo,
    );
    return result;
  }

  private async getDataByEquipCompTypeArr(typeCodeArr: any) {
    const result: any = await this.getComponentEquipComp().getStatics(
      typeCodeArr,
    );
    return result;
  }

  /**
   * 制作经验圈的tablist缓存
   */
  private setRadiusTablist() {
    const self = this;
    const tmpTabList = this.curCacheResData.tabList.map(
      (mitem: any, mindex: number) => {
        const obj: any = {};
        obj.level = mitem.level;
        obj.txt = mitem.txt;
        // 因为经验圈的数组可变，所以这里的逻辑要进行改变
        // 在原来的数组tabList中找到txt相等，且选中的的数组item
        const targetItem = self.tabList.find((fitem: any, findex: number) => {
          return fitem.txt === mitem.txt && fitem.checked;
        });
        // obj.checked = ((!!self.tabList[mindex]) && (mitem.txt === self.tabList[mindex].txt) && (self.tabList[mindex].checked));
        obj.checked = !!(targetItem && targetItem.checked);
        return obj;
      },
    );
    return tmpTabList;
  }
  /**
   * 制作烈度圈的tablist缓存
   */
  private setLieduTablist() {
    const self = this;
    const tmpTabList = this.curCacheResData.tabList.map(
      (mitem: any, mindex: number) => {
        const obj: any = {};
        obj.level = mitem.level;
        obj.txt = mitem.txt;
        // const targetItem = self.tabList.find((fitem: any, findex: number) => {
        //     return (fitem.txt === mitem.txt) && (fitem.checked);
        // });
        // obj.checked = ((!!self.tabList[mindex]) && (mitem.txt === self.tabList[mindex].txt) && (self.tabList[mindex].checked));
        // obj.checked = !!(targetItem && targetItem.checked);
        // 这是为了把前三个高亮，这样默认点击第四个就好了
        obj.checked = mindex !== this.curCacheResData.tabList.length - 1;
        return obj;
      },
    );
    return tmpTabList;
  }

  /**
   * 制作经验圈的选中,数组下标，并返回
   */
  private setRadiusDefault() {
    var defautIndex = -1;
    // const tmpTablist = this.curCacheResData.tabList;
    // 这是为了防止curActiveTab在经验圈和烈度圈之间的来回切换
    // const targetIndex = this.tabList.findIndex((item: any, index: number) => {
    //     return (!!item.checked && (item.txt === tmpTablist[index].txt));
    // });
    defautIndex = this.tabList.length - 1;

    // const vuexIndex = this.$store.state.configModel.config.defaultExperienceCircle;
    // if (targetIndex !== -1) { // 取得原来的高亮下标
    //     defautIndex = targetIndex;
    // } else { // 取得数组的最大值
    //     defautIndex = (this.tabList.length - 1);
    // }
    //  else if ( vuexIndex < this.tabList.length) { // 从配置文件中取得默认高亮
    //     defautIndex = vuexIndex;
    // }
    return defautIndex;
  }

  /**
   * 制作烈度圈的选中,数组下标，并返回
   */
  private setLieduDefault() {
    var defautIndex = -1;
    defautIndex = this.curCacheResData.tabList.length - 1;
    return defautIndex;
  }

  /**
   * 处理tab的点击事件
   */
  private async handleTabClick(tabItem: any, index: number) {
    // 点击力量标题范围航空站的列表隐藏，其他列表展示
    this.hankongData.showSub = false; // 航空站列表隐藏
    const j = this.statisticsList.length;
    for (let i = 0; i < j; i++) {
      this.statisticsList[i].showSub = true; // 队伍、前突队伍列表展示
    }
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
      // 经验圈
      this.handleTabClickByRadius(tabItem, index);
    } else if (
      this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
    ) {
      // 烈度圈
      this.handleTabClickByLiedu(tabItem, index);
    }
    this.setDefaultClickStatisticsTitle();
  }

  /**
   * 经验圈的tab点击，这个是单选
   */
  private handleTabClickByRadius(tabItem: any, index: number) {
    if (this.tabList[index].checked) {
      // 当前经验圈已经选中
      return;
    }
    this.tabList.forEach((fitem: any, findex: number) => {
      if (findex === index) {
        fitem.checked = true;
        this.statisticsList = this.updateStatisticsListByRadius(index);
        this.DataSorting();
      } else {
        fitem.checked = false;
      }
    });

    // console.log(this.statisticsList.subList)
  }

  /**
   * 烈度圈的tab点击，这个是多选
   */
  private handleTabClickByLiedu(tabItem: any, index: number) {
    // 如果烈度圈都不选中是不可以的，即烈度圈当前只有一个选中，且选中的恰好为当前点击的
    var checkedLastIndex = -1;
    var checkedCount = 0;
    this.tabList.forEach((fitem: any, findex: number) => {
      if (fitem.checked) {
        checkedCount++;
        checkedLastIndex = findex;
      }
    });

    if (checkedCount === 1 && checkedLastIndex === index) {
      return;
    }
    const checkedArr: any = [];
    this.tabList.forEach((fitem: any, findex: number) => {
      if (findex === index) {
        fitem.checked = !fitem.checked;
      }
      if (fitem.checked) {
        checkedArr.push(findex);
      }
    });
    // 这里要根据tabList的checked的选中状态去进行数据更新
    this.statisticsList = this.updateStatisticsListByLiedu(checkedArr);
    this.DataSorting();
  }

  /**
   * 排序一下数据
   */

  private DataSorting() {
    this.statisticsList.forEach((items: any) => {
      const DataArray: any = [];
      const NoDataArray: any = [];
      for (const itemsList of items.subList) {
        if (itemsList.teamnum > 0) {
          DataArray.push(itemsList);
        } else {
          NoDataArray.push(itemsList);
        }
      }
      items.subList = DataArray.concat(NoDataArray);
    });
  }

  /**
   * 制作默认的上图高亮数据
   */
  private setDefaultClickStatisticsTitle() {
    // 清除地图点位
    this.getComponent().clear();
    this.getComponentEquipComp().clear();
    // 暂存当前选中
    const curActiveStatistics = JSON.parse(
      JSON.stringify(this.curActiveStatistics),
    );
    // 判断当前选中的在统计列表中的状态，例如是否有数据,有数据触发点击，没有则不触发点击
    // 初始加载的时候，当前选中是空数组
    const targetIndex = this.statisticsList.findIndex(
      (fitem: any, findex: number) => {
        return fitem.teamnum && curActiveStatistics.key === fitem.key;
      },
    );

    // 表明之前就没有选中，但是新的tab（经验圈或者烈度圈）标签下有数据
    if (
      curActiveStatistics.key === 'vue-created' &&
      this.statisticsList[0].teamnum
    ) {
      // 清空当前选中
      this.curActiveStatistics = {};
      // this.handleClickStatisticsTitle(this.statisticsList[0], 0, this.statisticsList); // 默认不上图
    } else if (curActiveStatistics.key && targetIndex === -1) {
      // 表明之前就有选中，但是新的tab（经验圈或者烈度圈）标签下没有数据,取消点位和高亮就可以啦
      this.curActiveStatistics.teamnum = 0;
    } else if (curActiveStatistics.key && targetIndex !== -1) {
      // 之前就有选中，且有数值
      this.curActiveStatistics = {};
      // this.handleClickStatisticsTitle(this.statisticsList[targetIndex], targetIndex, this.statisticsList); // 默认不上图
    } else if (this.statisticsListCache.length) {
      // 有二级标题的缓存
      // 还有一张情况就是 之前没选中任何一级标题
      // 此时判断是否有二级标题的选中
      this.statisticsListCache.forEach((slcfItem: any, slcfIndex: number) => {
        slcfItem.subList.forEach((slcsfItem: any, slcsfIndex: number) => {
          if (slcsfItem.active) {
            // 缓存中这个是要选中的
            this.statisticsList[slcfIndex].subList[slcsfIndex].active = false;
            this.handleClickSubitemTitle(
              this.statisticsList[slcfIndex].subList[slcsfIndex],
              slcsfIndex,
              this.statisticsList[slcfIndex].subList,
              this.statisticsList[slcfIndex],
              slcfIndex,
              this.statisticsList,
            );
          }
        });
      });
    }
  }

  /**
   * 更新经验圈下统计面板的数据
   * curCheckedIndex这里存放的是tabList当前选中的下标
   */
  private updateStatisticsListByRadius(curCheckedIndex: number) {
    const statisticsList = this.curCacheResData[
      this.tabList[curCheckedIndex].txt
    ].statisticsList;
    this.statisticData.teamNum = statisticsList[0].teamnum;
    this.statisticData.peopleNum = statisticsList[0].peoplenum;
    return statisticsList;
  }

  /**
   * 更新烈度圈下统计面板的数据
   * checkedArr这里存放的是tabList当前选中的下标的数组
   */
  private updateStatisticsListByLiedu(checkedArr: any) {
    const statisticsList: any = [];
    const vuexStatisticsList = JSON.parse(
      JSON.stringify(this.$store.state.configModel.config.RescueTeamsContainer.statisticsList),
    );
    vuexStatisticsList.forEach((vslItem: any, vslIndex: number) => {
      const newItem = JSON.parse(JSON.stringify(vslItem));
      checkedArr.forEach((cfItem: any, cfIndex: number) => {
        const tmpStatisticsList = JSON.parse(
          JSON.stringify(
            this.curCacheResData[this.tabList[cfItem].txt].statisticsList,
          ),
        );
        newItem.teamnum += tmpStatisticsList[vslIndex].teamnum;
        newItem.peoplenum += tmpStatisticsList[vslIndex].peoplenum;
        newItem.subList.forEach((mitem: any, mindex: number) => {
          // 利用forEach中的引用地址级联，这样newItem就发生了更改了
          mitem.peoplenum +=
            tmpStatisticsList[vslIndex].subList[mindex].peoplenum;
          mitem.teamnum += tmpStatisticsList[vslIndex].subList[mindex].teamnum;
        });
      });
      statisticsList.push(newItem);
    });
    this.statisticData.teamNum = statisticsList[0].teamnum;
    this.statisticData.peopleNum = statisticsList[0].peoplenum;
    return statisticsList;
  }

  /**
   * 制作参数,即将从$store.state.configModel.config.RescueTeamsContainer.statisticsList的队伍分布读到的配置转成队伍数组
   */
  private getTypeArr(oriStatisticsListItem: any) {
    const codeTypeArr = oriStatisticsListItem.subList.map((item: any) => {
      return item.codeType;
    });
    return codeTypeArr;
  }

  /**
   * 展开或者收起当前的子数组面板
   */
  private expandSublist(slItem: any, slIndex: number, statisticsList: any) {
    if (statisticsList) {
      this.statisticsList[slIndex].showSub = !slItem.showSub;
      this.hankongData.showSub = false;
    } else {
      this.hankongData.showSub = !slItem.showSub;
      const j = this.statisticsList.length;
      for (let i = 0; i < j; i++) {
        this.statisticsList[i].showSub = false;
      }
    }
    this.$forceUpdate();
  }

  /**
   * 初始化本组件初渲染的时候，进行的默认数值与方法等的初始化
   */
  private initCreated() {
    this.curTitle = '应急力量';
    this.getDataToCache();
  }
  /**
   * 初始化所有的监听事件
   */
  private initEventListener() {
    // 经验圈到经验圈的变化（重新设置经验圈）
    // 烈度圈到烈度圈的变化（上传烈度圈）
    // 地图先反映，会emit一个事件，之后前端在响应
    // 这里返回没有区分经验圈和烈度圈，所有如果在烈度圈下，进行了经验圈设置也会触发执行页面数据刷新
    // this.messsageBus.off('ranges-refresh');
    this.messsageBus.on('ranges-refresh', (event: any) => {
      this.getDataToCache();
    });
    this.messsageBus.on('emitPowerHight', (data: any) => {
      this.statisticsList.forEach((item: any) => {
        const subList = item.subList;
        subList.forEach((oitem: any) => {
          oitem.active = false;
        });
      });
      this.getComponent().clear();
      this.getComponentEquipComp().clear();
    });
  }

  /**
   * 地图方法初始化
   */
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewTeam',
    );
    return component;
  }

  /**
   * 重要装备地图方法初始化
   */
  private getComponentEquipComp() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('EquipComp');
    return component;
  }

  /**
   * 护林站地图方法初始化
   */
  private getComponentAirTeam() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeAirTeam',
    );
    return component;
  }

  // 护林站列表点击地图点位出hover效果
  private getComponent1() {
    let component1 = null;
    const factory1 = this.$ioc.resolve('GISFactory-map');
    if (factory1) {
      component1 = factory1.commonFactory.getComponent('commonInteract');
    }
    return component1;
  }

  private getComponent_Pop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgePop',
    );
    return component;
  }

  @Watch('$Watchstore.state.eventPushStore.eventLocation.changeInformation')
  private onRangesRefresh(data: any) {
    this.getComponent_Pop().load(0); // 人口人力跟踪经验圈
  }

  private created() {
    // 监听改变经验圈范围
    this.messsageBus.off('ranges-refresh');
    this.messsageBus.on('ranges-refresh', this.onRangesRefresh, this);
    this.gitAirStationDataSwitch();
  }
  private getTotal() {
    const type =
      'floodteam,fireteam,forestfireteam,hazardousteam,mineteam,nonmineteam,corecompetenceteam,transportationteam,powerteam,mobileteam,gasteam,environmentteam,salvageteam,searescueteam,shipspillteam,healthyteam,portrescueteam,portpassengerteam,portconstructionteam,buildingemergencyteam,passengeremergencyteam,emergencytransportteam,snowteam,equipteam,civilianteam';
    const Jsonkey = type.split(',');
    this.getComponent_new()
      .getMultiuleAllNum(type)
      .then((res: any) => {
        const temp: any = [];
        const tempTotal: any = [];
        Object.keys(res).forEach((item) => {
          temp.push({
            codeKey: item,
            tabNumber: res[item],
          });
        });
        temp.map((item: any) => {
          //         'fxkhd':0, //'防汛抗旱队'
          // 'xfjyd':0, //'消防救援队'
          // 'slxfjyd':0, //'森林消防救援队'
          // 'whpjyd':0, //'危化品救援队'
          // 'mkjyd':0, //'煤矿救援队'
          // 'fmksjyd':0, //'非煤矿山救援队'
          // 'smltjud':0, //'商贸流通救援队'
          // 'jtysjyd':0,//'交通运输救援队'
          // 'yjgdjyd':0, //'应急供电救援队'
          // 'ydtxjyd':0, //'移动通讯救援队'
          // 'rqjyd':0, //'燃气救援队'
          // 'hjjyd':0, //'环境救援队'
          // 'dljyd':0, // '打捞救援队'
          // 'hsjyd':0, //'海上救援队'
          // 'cpyyjyd':0, // '船舶溢油救援队'
          // 'ylwsd':0, //'医疗卫生队'
          // 'gkmtqxd':0, //'港口码头抢险队'
          // 'gkkyzyjd':0, //'港口客运场站应急队'
          // 'gksgaqd':0, //'港口施工安全队'
          // 'jzyjjyd':0, //'建筑应急救援队'
          // 'kyyjjyd':0,//'客运应急救援队'
          // 'yjyld':0,//'应急运力队'
          // 'jxsbshll':0, //'机械设备社会力量'
          // 'mjjyd':0, // '民间救援队'
          this.dataTeam[0].jzyjjyd =
            this.dataTeam[0].jzyjjyd + item.tabNumber.buildingemergencyteam;
          this.dataTeam[0].mjjyd =
            this.dataTeam[0].mjjyd + item.tabNumber.civilianteam;
          this.dataTeam[0].smltjud =
            this.dataTeam[0].smltjud + item.tabNumber.corecompetenceteam;
          this.dataTeam[0].yjyld =
            this.dataTeam[0].yjyld + item.tabNumber.emergencytransportteam;
          this.dataTeam[0].hjjyd =
            this.dataTeam[0].hjjyd + item.tabNumber.environmentteam;
          this.dataTeam[0].jxsbshll =
            this.dataTeam[0].jxsbshll + item.tabNumber.equipteam;
          this.dataTeam[0].xfjyd =
            this.dataTeam[0].xfjyd + item.tabNumber.fireteam;
          this.dataTeam[0].fxkhd =
            this.dataTeam[0].fxkhd + item.tabNumber.floodteam;
          this.dataTeam[0].slxfjyd =
            this.dataTeam[0].slxfjyd + item.tabNumber.forestfireteam;
          this.dataTeam[0].rqjyd =
            this.dataTeam[0].rqjyd + item.tabNumber.gasteam;
          this.dataTeam[0].whpjyd =
            this.dataTeam[0].whpjyd + item.tabNumber.hazardousteam;
          this.dataTeam[0].ylwsd =
            this.dataTeam[0].ylwsd + item.tabNumber.healthyteam;
          this.dataTeam[0].mkjyd =
            this.dataTeam[0].mkjyd + item.tabNumber.mineteam;
          this.dataTeam[0].ydtxjyd =
            this.dataTeam[0].ydtxjyd + item.tabNumber.mobileteam;
          this.dataTeam[0].fmksjyd =
            this.dataTeam[0].fmksjyd + item.tabNumber.nonmineteam;
          this.dataTeam[0].kyyjjyd =
            this.dataTeam[0].kyyjjyd + item.tabNumber.passengeremergencyteam;
          this.dataTeam[0].gksgaqd =
            this.dataTeam[0].gksgaqd + item.tabNumber.portconstructionteam;
          this.dataTeam[0].kyyjjyd =
            this.dataTeam[0].kyyjjyd + item.tabNumber.portpassengerteam;
          this.dataTeam[0].gkmtqxd =
            this.dataTeam[0].gkmtqxd + item.tabNumber.portrescueteam;
          this.dataTeam[0].yjgdjyd =
            this.dataTeam[0].yjgdjyd + item.tabNumber.powerteam;
          this.dataTeam[0].dljyd =
            this.dataTeam[0].dljyd + item.tabNumber.salvageteam;
          this.dataTeam[0].hsjyd =
            this.dataTeam[0].hsjyd + item.tabNumber.searescueteam;
          this.dataTeam[0].cpyyjyd =
            this.dataTeam[0].cpyyjyd + item.tabNumber.shipspillteam;
          // this.dataTeam[0].snowteam = this.dataTeam[0].snowteam + item.tabNumber.snowteam
          this.dataTeam[0].jtysjyd =
            this.dataTeam[0].jtysjyd + item.tabNumber.transportationteam;
        });
        console.log(this.dataTeam);
        const vuexStatisticsList = JSON.parse(
          JSON.stringify(
            this.$store.state.configModel.config.RescueTeamsContainer
              .statisticsList,
          ),
        );
        this.getStatisticsList('', vuexStatisticsList);
      });
    this.getComponent_new()
      .getMultiuleOneNum('rescueteam')
      .then((res: any) => {
        const temp: any = [];
        const tempTotal: any = [];
        Object.keys(res).forEach((item) => {
          temp.push({
            codeKey: item,
            tabNumber: res[item],
          });
        });
        temp.map((item: any) => {
          this.nteamtotal = item.tabNumber.count + this.nteamtotal;
          tempTotal.push(...item.tabNumber.list);
        });
        for (const k of tempTotal) {
          this.numtotal = k.totalpernum + this.numtotal;
        }
      });
  }
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
    );
    return component;
  }
  @Watch('$store.state.eventPushStore.eventLocation.changeInformation')
  private initData(val: string) {
    if (val.split(',').indexOf('geometry') >= 0) {
      this.tabList[0].checked = false;
      this.gitAirStationDataSwitch();
      this.initCreated();
      this.initEventListener();
    }
  }
  private closeAndbackFn() {
    this.messsageBus.emit('closeAndBack', true);
  }
  private mounted() {
    if (
      this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
      this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp'
    ) {
      this.initCreated();
    } else {
      this.changeList();
    }
    this.getTotal();
    this.initEventListener();
  }

  private destroyed() {
    this.messsageBus.off('emitPowerHight');
    this.getComponent().clear();
    this.getComponentEquipComp().clear();
    this.getComponentAirTeam().hideResource();
    this.getComponent().unload();
    this.getComponentAirTeam().unload();

    // 取消监听改变经验圈范围
    this.messsageBus.off('ranges-refresh');
  }
}
</script>

<style lang='less' scoped>
@import '../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../assets/css/decisionSupport/Statistic.half.less';
@import '../../../assets/css/decisionSupport/DiscussTab.less';
// 统计面板
#MapDialog {
  height: auto;
  .half-title {
    height: 37px;
    font-style: italic;
    margin-top: -10px;
  }
  .statisticCount {
    padding-left: 20px;
    margin: 5px 0 0 0;
    background: url('../../../assets/img/halfScreen/halflist/totalbg.png') 0 0
      no-repeat;
    background-size: 100% 100%;
    background-size: 100% 100%;
    li {
      list-style: none;
      color: #ffffff;
    }
    span {
      margin: 0 10px;
      color: yellow;
      font-weight: bolder;
      font-size: 30px;
    }
  }
}
</style>

