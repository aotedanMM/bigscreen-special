<!--综合研判、地震基础信息-->
<template>
    <div
            class="studyAndJudgmentOfaPicture_half"
            id="studyAndJudgmentOfaPicture_half"
    >
        <div class="title-t title-panel">
            <p>
                {{ title }}
                <ZoomExportBtn
                        v-if="title === '基础信息' && showZoomExportBtn"
                        @handleEmitExport="downloadFile"
                ></ZoomExportBtn>
                <ZoomBtn v-else></ZoomBtn>
                <!-- <ZoomBtn></ZoomBtn> -->
            </p>
            <!--当是台风事件, 且不是风圈查询的时候有返回按钮-->
            <span
                    v-if="
          $store.state.eventPushStore.eventLocation.EventType === '10' &&
          $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
        "
                    class="closeAndback"
                    @click="closeAndbackFn"
            ></span>
        </div>
        <!-- 存放控制按钮的组件，河流研判、缓冲区研判、行政区划研判 -->
        <div
                class="control-btn-container"
                v-if="
        quickStudyConfig.ControlBtnContainer &&
        quickStudyConfig.ControlBtnContainer.isShow &&
        quickStudyConfig.ControlBtnContainer.componentParam.btnList.length > 0
      "
        >
            <ControlBtnContainer
                    :compParam="quickStudyConfig.ControlBtnContainer"
            ></ControlBtnContainer>
        </div>
        <DiscussTab
                ref="DiscussTab"
                @tabList="tabList"
                v-show="isEnterDispose"
        ></DiscussTab>
        <div class="cont">
            <!-- :style="{
                height:
                  quickStudyConfig.contListScrollHeight || isEnterDispose
                    ? '688px'
                    : '730px',
            }"-->
            <el-scrollbar class="cmp-scrollbar-y" style="height: calc(100% - 16px)">
                <div class="list">
                    <DiscussList
                            v-if="true"
                            :levelArr="levelArr"
                            :tabShow="tabShow"
                            @changeKuang="changeKuang"
                    ></DiscussList>
                </div>
                <div style="padding: 0 10px; box-sizing: border-box">
                    <template v-for="(item, index) of contList.contListAll">
                        <template v-if="!item.isSpecialComponent">
                            <DiscussCont
                                    @changeKuang="changeKuang"
                                    :key="index"
                                    :contList="item"
                                    :radius="radius"
                                    :keyArr="keyArr"
                                    @dealKey="dealKey"
                            ></DiscussCont>
                        </template>
                        <template v-else>
                            <component
                                    :is="item.componentName"
                                    :key="index"
                                    :defaultExpand="item.defaultExpand"
                            ></component>
                        </template>
                    </template>
                    <DiscussCont
                            @changeKuang="changeKuang"
                            v-if="contList.contList3"
                            :contList="contList.contList3"
                            :radius="radius"
                            :keyArr="keyArr"
                            @dealKey="dealKey"
                    ></DiscussCont>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import {messsageBus} from '@/util/message';
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import DiscussCont from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/DiscussCont.vue';
import DiscussTab from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/DiscussTab.vue';
import DiscussList from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/DiscussList.vue';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import ControlBtnContainer from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/ControlBtnContainer.vue';
import MonitorWarningContainer from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/MonitorWarningContainer.vue';
import ReservoirMonitorLeft from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/ReservoirMonitorLeft.vue'; // 左侧水库
import HistoryEarthquake from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/HistoryEarthquake.vue';
import SurroundVideo from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/SurroundVideo.vue';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
import ZoomExportBtn from '@/components/feature/flood/ZoomExportBtn.vue'; // 最小化下载组件
import {downloadFile} from '@/util/tools';

@Component({
  name: 'StudyAndJudgmentOfaPictureHalf',
  components: {
    DiscussList,
    DiscussTab,
    DiscussCont,
    ControlBtnContainer, //  控制按钮的组件，河流研判、缓冲区研判、行政区划研判
    MonitorWarningContainer, // 监测预警
    ReservoirMonitorLeft, // 左侧水库
    HistoryEarthquake, // 历史地震
    SurroundVideo, // 周边视频
    ZoomBtn, // 最小化组件
    ZoomExportBtn, // 最小化下载组件
  },
})
export default class StudyAndJudgmentOfaPictureHalf extends Vue {
  private levelArr: any[] = []; // 可能存放的是当前选中的tab数组
  private currentTabAllData: any = null;
  private tabShow: any = {};
  private level: string = '';
  private personnelKey: any = [];
  private showZoomExportBtn: any = false;
  private contList: any = {};
  private radius: any = '50';
  private keyArr: any = [];
  private pmaxlevel: any;
  private title: string = '综合研判';
  private opt1: any = {
    resourceKeys: this.personnelKey,
    ranges: [
      {
        level: '',
        geometry: {},
      },
    ],
  };
  private isCloseAndback: boolean = false;
  private quickStudyConfig: any = {};

  @Watch('$store.state.configModel.config')
  private getQuickStudy(val: any) {
    this.getShowFlag();
    const data: any = JSON.parse(JSON.stringify(val));
    this.quickStudyConfig = data.quickStudy;
    this.contList = data.quickStudy.contList;
    this.personnelKey = data.quickStudy.personnelKey;
    this.tabShow = data.quickStudy.tabShow;
    this.level = data.quickStudy.level;
    // 数据更新以后 重新获取下数据
    if (this.$refs.DiscussTab && (this.$refs.DiscussTab as any).changeQuan) {
      (this.$refs.DiscussTab as any).changeQuan();
    }
    if (
      this.$store.state.eventPushStore.eventLocation.EventType.toString() ===
      '10'
    ) {
      this.isCloseAndback = true;
    }
    this.title = data.researchPanel.some((item: any) => {
      return item.name === '基础信息';
    })
      ? '基础信息'
      : '综合研判'; // 当进入地震事件的时候，标题改为基础信息
  }

  private getShowFlag() {
    const typecode = ['0', '6', '7', '12', '13', '2', '4', '5'];
    if (
      typecode.includes(
        this.$store.state.eventPushStore.eventLocation.EventType,
      )
    ) {
      this.showZoomExportBtn = false;
    } else {
      this.showZoomExportBtn = true;
    }
  }

  // 判断是否进入处置模式，显示经验圈和列表高度配置
  get isEnterDispose() {
    return (
      this.$store.state.dataFilterControl.zhypGeoType &&
      (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp' ||
        this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp')
    );
  }

  // 叠加行政区划
  private addDistricts() {
    // 行政区划组件
    const factory = this.$ioc.resolve('GISFactory-map');
    const districtComp = factory.disasterJudgeFactory.getComponent(
      'districtComp',
    );
    districtComp.load(true, true);
  }

  private getComponent_Pop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgePop',
    );
    return component;
  }

  private created() {
    this.getQuickStudy(this.$store.state.configModel.config);
    if (this.$store.state.eventPushStore.eventId) {
      // 监听改变经验圈范围
      this.messsageBus.off('ranges-refresh');
      this.messsageBus.on('ranges-refresh', this.drawInfluence, this);
    }
  }

  // 重新监听经验圈发生变化，并与经验圈设置和经验圈图层进行联动
  private drawInfluence() {
    this.getComponent_Pop().load(0); // 人口人力跟踪经验圈
    const tmpParam = {
      ranges: this.$ioc.resolve('eventInfo').getRanges(),
      type: 0,
    };
    // 拿出当前affectRanges找那个的数组的最后一个用来做研判用
    const selectedIndex = tmpParam.ranges.length - 1; // 当前选中的经验圈的数组的下标
    const selectedRange = tmpParam.ranges[selectedIndex];
    const geoStrObj = {
      filter: {
        districtCode: '', // "370686"
        geometry: JSON.stringify(selectedRange.geometry),
      },
      zhypGeoType: {
        key: 'jyqYp',
        value: {
          indexArr: [selectedIndex],
          rangeArr: [JSON.parse(JSON.stringify(selectedRange))],
          // affectRanges:
        },
      },
    };
    this.$store.dispatch('dataFilterControl/UpdateFilterCondition', geoStrObj);
  }

  private changeKuang(item: any) {
    this.clearPoint();
    this.messsageBus.emit('moreDetails', item);
  }

  // 行政区划，人口统计
  private getRegionPopStat() {
    this.getStatisticsData();
  }

  // 获得行政区划的统计数据
  private getStatisticsData() {
    const self = this;
    const sourceOpt = JSON.parse(
      JSON.stringify(this.$store.state.dataFilterControl.filter),
    );
    // 制作参数
    const param: any = {};
    if (sourceOpt.geometry) {
      param.geometry = JSON.parse(sourceOpt.geometry);
    }
    // 拿到行政区划的配置文件
    const tabShowConfig = JSON.parse(
      JSON.stringify(this.$store.state.configModel.config.quickStudy.tabShow),
    );
    // ['countyCount','townCount','cunCount','population','populationDensity']
    const arrKeys = Object.keys(tabShowConfig);
    // 制作promise all所用到的数组，和对结果进行处理的参数配置
    // 行政区划统计
    const xzqhStatisticsParam = {
      ...param,
      pac: sourceOpt.districtCode, // 区县、乡镇、村庄用
    };
    const xzqhStatisticsPromise = installDisasterJudgeServer.quickJudgeServer.getXzqhStatistics(
      JSON.parse(JSON.stringify(xzqhStatisticsParam)),
    );
    // 人口统计
    const rkParam = {
      geometry: sourceOpt.geometry,
      pac: sourceOpt.districtCode || '3706', // 人口用
    };
    const rkPromise = installDisasterJudgeServer.quickJudgeServer.cunCountPromiseTotal(
      JSON.parse(JSON.stringify(rkParam)),
    );
    // 面积统计
    const mjParam = {
      ...param,
      code: sourceOpt.districtCode.split(','), // 面积用
    };
    const mjPromise = installDisasterJudgeServer.quickJudgeServer.areaStatistics(
      JSON.parse(JSON.stringify(mjParam)),
    );

    Promise.all([xzqhStatisticsPromise, rkPromise, mjPromise]).then(
      (values: any) => {
        let populationResData = 0;
        arrKeys.forEach((kitem: any, kindex: number) => {
          switch (kitem) {
            // 区县统计
            case 'countyCount':
              tabShowConfig.countyCount.num = values[0].countynum || 0;
              break;
            // 乡镇统计
            case 'townCount':
              tabShowConfig.townCount.num = values[0].townnum || 0;
              break;
            // 村庄统计
            case 'cunCount':
              tabShowConfig.cunCount.num = values[0].villagenum || 0;
              break;
            // 人口统计
            case 'population':
              populationResData = values[1].cunTotal;
              tabShowConfig.population.num = (
                populationResData / 10000
              ).toFixed(2);
              break;
            // 人口密度
            case 'populationDensity':
              const areaResData = values[2];
              tabShowConfig.populationDensity.num = (
                populationResData / areaResData
              ).toFixed(2);
              break;
          }
        });
        self.tabShow = JSON.parse(JSON.stringify(tabShowConfig));
        if (this.tabShow.AtTheEpicenter) {
          this.handlePormiseAll(); // 处理合并震中还白，设防烈度
        }
      },
    );
  }

  // 震中海拔，震中设防烈度需要在promise.all之后在回调赋值
  private handlePormiseAll() {
    if (
      this.$store.state.eventPushStore.eventLocation.EventLat &&
      this.$store.state.eventPushStore.eventLocation.EventLon
    ) {
      // 震中坐标
      const zzzbEventLat =
        this.$store.state.eventPushStore.eventLocation.EventLat || '0';
      const zzzbEventLon =
        this.$store.state.eventPushStore.eventLocation.EventLon || '0';

      // 海波获取，参数为震中的坐标[x,y],字符串类型，返回值单位米
      this.getComponent1()
        .getdem([
          zzzbEventLon.toFixed(5).toString(),
          zzzbEventLat.toFixed(5).toString(),
        ])
        .then((res: any) => {
          this.tabShow.AtTheEpicenter.num =
            (res && res.haiba && res.haiba.toFixed(2)) || 0;
        });

      // 震中设防烈度参数
      const zzhbParam = {
        lat: zzzbEventLat,
        lon: zzzbEventLon,
      };

      // 震中设防烈度
      installDisasterJudgeServer.quickJudgeServer
        .getEarthquakeDistrictIntensity(JSON.parse(JSON.stringify(zzhbParam)))
        .then((res: any) => {
          this.tabShow.EpicentralIntensity.num =
            (res.data && res.data.intensity) || 0;
        });
    }
  }

  // 单独处理pg返回数据，对应经验圈，烈度圈，常态不同数据需求
  private handleListRes(data: any) {
    // 改变原有mango-<pg库，一级面板有经验圈，烈度圈，缓冲区和常态不同的数据格式需要
    const eventType = this.$store.state.dataFilterControl.zhypGeoType.key;
    let res: any = null;
    if (eventType && eventType === 'ldqYp') {
      // 烈度圈多选累加数据
      this.currentTabAllData.forEach((item: any) => {
        if (item.checked && !res) {
          res = data[item.level];
        } else if (item.checked) {
          for (const i of Object.keys(res)) {
            res[i] += data[item.level][i];
          }
        }
      });
    } else if (eventType && eventType === 'jyqYp') {
      // 经验圈取当前选中圈层
      const key: any = this.levelArr;
      res = data[key.title];
    } else {
      // 常态默认数据
      res = data;
    }
    return res;
  }

  // 人员密集场所、高危行业企业、重要设施
  private getResourceStat(optKey: any, tabListAll?: any) {
    this.opt1.resourceKeys = optKey;
    const set = this;
    let geo = null;
    let districtCode = null;
    let curSelectCityCodeArr: any =  [];
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp' || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') {
      geo = JSON.parse(this.$store.state.dataFilterControl.filter.geometry);
    }
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'xzqhyp') {
      curSelectCityCodeArr = this.$store.state.dataFilterControl.filter.districtCode.split(',');
      if (curSelectCityCodeArr.length > 1) {
         curSelectCityCodeArr.forEach((element: any, i: any) => {
         curSelectCityCodeArr[i] = '\'' + curSelectCityCodeArr[i] + '\'';
        });
      }
      districtCode = curSelectCityCodeArr.length > 0 ? curSelectCityCodeArr.toString() : '';
    }
    this.currentTabAllData = tabListAll;  // 储存事件态下，当前tab选中情况
    // const type='landslide,debrisflow,mountaincollapse,bottomcollapse,miningcollapse';


    const optIndex: number = optKey.indexOf('monitorstation');
    if (optIndex !== -1) {
      optKey.splice(optIndex, 1); // 单独处理 monitorstation 数据库问题，展示屏蔽
    }
    const optIndex1: number = optKey.indexOf('shelter');
    if (optIndex1 !== -1) {
      optKey.splice(optIndex1, 1); // 单独处理 shelter 数据库问题，展示屏蔽
    }
    // const optIndex2: number = optKey.indexOf('coal');
    // if (optIndex2 !== -1) {
    //   optKey.splice(optIndex2, 1); // 单独处理 coal 数据库问题，展示屏蔽
    // }
    // const optIndex3: number = optKey.indexOf('for_waterport');
    // if (optIndex3 !== -1) {
    //   optKey.splice(optIndex3, 1); // 单独处理 for_waterport 数据库问题，展示屏蔽
    // }
    // const optIndex4: number = optKey.indexOf('for_heliport');
    // if (optIndex4 !== -1) {
    //   optKey.splice(optIndex4, 1); // 单独处理 for_heliport 数据库问题，展示屏蔽
    // }
    // const optIndex5: number = optKey.indexOf('for_watersource');
    // if (optIndex5 !== -1) {
    //   optKey.splice(optIndex5, 1); // 单独处理 for_watersource 数据库问题，展示屏蔽
    // }
    // const optIndex6: number = optKey.indexOf('for_watersourceport');
    // if (optIndex6 !== -1) {
    //   optKey.splice(optIndex6, 1); // 单独处理 for_watersourceport 数据库问题，展示屏蔽
    // }
    // const optIndex7: number = optKey.indexOf('hazardous');
    // if (optIndex7 !== -1) {
    //   optKey.splice(optIndex7, 1); // 单独处理 hazardous 数据库问题，展示屏蔽
    // }
   // "hazardous,coal,for_waterport,for_heliport,for_watersource,for_watersourceport"
    this.getComponent_new()
      .getMultiuleAllNum(optKey.toString(), '', geo ? geo : null, districtCode)
      .then((data: any) => {
        const res = this.handleListRes(data);
        const j = set.contList.contListAll.length;
        for (var i = 0; i < j; i++) {
          // 例如监测站点那种，和学校不一样的。
          if (set.contList.contListAll[i].isSpecialComponent) {
            continue;
          }
          set.contList.contListAll[i].sum = 0;
          if (set.contList.contListAll[i].list) {
            for (const key of Object.keys(set.contList.contListAll[i].list)) {
              if (set.contList.contListAll[i].list[key].noneParam === true) {
                // 没有配置参数，但是又要显示的那种
              } else {
                set.contList.contListAll[i].list[key].num = res[key] || 0;
                // 最外层父级
                set.contList.contListAll[i].sum += res[key] || 0;
                if (set.contList.contListAll[i].list[key].isChild) {
                  for (const ChildKeys of Object.keys(
                    set.contList.contListAll[i].list[key].list,
                  )) {
                    // 数据中没有你自己定义的zyss这个key值
                    const ChildResCount = res[key] || 0;
                    set.contList.contListAll[i].list[key].list[
                      ChildKeys
                      ].num += ChildResCount;
                    set.contList.contListAll[i].list[
                      key
                      ].sum += ChildResCount;
                    // 最外层继续叠加第三层的数量
                    set.contList.contListAll[i].sum += ChildResCount;
                  }
                }
              }
            }
          } else {
            const key = set.contList.contListAll[i].key;
            set.contList.contListAll[i].sum = 0;
            set.contList.contListAll[i].sum += res[key] || 0;
          }
        }
      });
  }

  // // 获取经纬度
  // private getLonAndLat() {
  //   if (this.$store.state.eventPushStore.eventId) {
  //     const eventPushStore = this.$store.state.eventPushStore.eventLocation;
  //     this.opt2.point = [eventPushStore.EventLon, eventPushStore.EventLat];
  //   }
  // }

  // 根据当前选中的5 10 20 50 进行设置eventPushStore中的geometry
  private updateGeometry(selectArr: any) {
    // 这里要经过处理把多个geometry扭成一个，现在暂时不用，写死一个
    const finalGeometryObj =
      selectArr[0].geometry ||
      JSON.parse(EventConfigRegistry.getDefaultGeometryStr());
    const geoStrObj = {
      geometry: JSON.stringify(finalGeometryObj),
      zhypGeoType: {
        key: 'jyq', // 这个位置先临时写死，这里应该是和烈度圈ldq进行变得。但是，地震现在测试不了
      },
    };
    this.$store.commit('eventPushStore/updateGeometry', geoStrObj);
  }

  // 烈度、经验圈变化。子组件中调用
  // 这个item可能代表的是选中的tab数组，itemAll可能代表的是全部的tab数组，包括选中和未选中的。
  // isFilterFlag true 表示要走数据筛选的那个filter条件，这里理论上应该把前两个参数去掉，但是，为了兼容以前的代码，这里先留着了。
  private tabList(item: any, itemAll: any, isFilterFlag: any) {
    this.$emit('tabListAll', itemAll);
    this.messsageBus.emit('tabListAll', itemAll);
    if (item !== undefined && item) {
      this.radius = item.level || item[0].level;
    }
    // if (this.radius !== 0) { // 证明当前不处于面处置，是经验圈或者烈度圈
    //   this.updateGeometry(item);
    // }
    this.levelArr = JSON.parse(JSON.stringify(item));
    this.opt1 = {
      resourceKeys: this.personnelKey,
      ranges: [],
    };
    // 这部分上面是以前的逻辑，现在不好动，先把接口查询参数更改下。
    // 理论上接口查询应该走的是 数据过滤的条件，所以，ranges永远之后有一个，这里先采用临时写死的情况
    const queryParam: any = {
      level: 0,
      districtCode: this.$store.state.dataFilterControl.filter.districtCode,
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      const jsonObj = JSON.parse(
        this.$store.state.dataFilterControl.filter.geometry,
      );
      queryParam.geometry = jsonObj;
    }
    this.opt1.ranges.push(queryParam);
    switch (this.$store.state.dataFilterControl.zhypGeoType.key) {
      case 'jyqYp':
      case 'ldqYp':
        this.informGisEventState(1);
        break;
      default:
        this.informGisEventState(0);
        break;
    }
    this.getRegionPopStat();
    this.getResourceStat(this.personnelKey, itemAll);
    this.clearPoint();
  }

  private informGisEventState(status: number) {
    // 清空gis数据，事件态切换回常态是，ranges（经验圈）清空
    this.$ioc.resolve('eventInfo').setCurrentStatus(status);
  }

  // 文字叠加key处理 。子组件中调用
  private dealKey(item: any) {
    const self = this;
    let geo = null;
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp' || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') {
      geo = JSON.parse(this.$store.state.dataFilterControl.filter.geometry);
    }
    if (item.active) {
      this.keyArr.push(item.key);
      // 添加标点
      const curSelecttypeArrArr: any = this.$store.state.dataFilterControl.filter.districtCode.split(',') || [];
      let districtcode: any = this.$store.state.dataFilterControl.filter.districtCode;
      curSelecttypeArrArr.forEach((element: any, i: any) => {
         curSelecttypeArrArr[i] = '\'' + curSelecttypeArrArr[i] + '\'';
        });
      districtcode = curSelecttypeArrArr.length > 1 ? curSelecttypeArrArr.toString() : districtcode ;
      this.getComponent_new().getMultiuleOneNum(item.key, geo ? geo : null, districtcode).then((dataTemp: any) => {
        let data: any = this.handleListRes(dataTemp);
        if (data.list) {
          data = data.list;
        } else {
          data = data;
        }
        // if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp') {
        //   data = data;
        // } else {
        //   data = data.list;
        // }
        this.getComponent_new()._showPoint(data, item.key, '');
      });
    } else {
      this.getComponent_new()._clearLayerByID(item.key);
      this.keyArr = this.keyArr.filter((key: any) => {
        return key !== item.key;
      });
    }
  }

  // 导出
  private downloadFile(type: any) {
    // 判断是否模型计算以及烈度圈计算，二者都操作之后方可下载
    if (
      !this.$store.state.earthQuake.earthQuakeIntensityData.Model_Infos ||
      this.$store.state.dataFilterControl.zhypGeoType.key !== 'ldqYp'
    ) {
      this.$message('请烈度圈和模型计算之后再导出下载');
      return;
    }
    const eventPushData: any = this.$store.state.eventPushStore.eventLocation;
    const sourceOpt = JSON.parse(
      JSON.stringify(this.$store.state.dataFilterControl.filter),
    );
    // TODO：缺少震中设防烈度
    const params: any = {
      eqLevel: String(eventPushData.EqLevel), // 震级
      eventAddr: eventPushData.EventAddr, // 事发地点
      eventLat: String(eventPushData.EventLat), // 纬度
      eventLon: String(eventPushData.EventLon), // 经度
      eventTime: eventPushData.EventTime, // 发震时间，格式：yyyy年MM月dd日HH时mm分
      eventTit: eventPushData.EventTit, // 地震事件标题
      isList: type, // 0-无列表，1-带列表-完整模式，2-带列表-精简模式（列表最多显示50条）
      schemeType: '1', // 方案类型，1-基本信息，2-风险隐患，3-应急力量，4-应急资源
      modelResult: JSON.stringify(
        this.$store.state.earthQuake.earthQuakeIntensityData,
      ), // 模型数据
      fortifyLevel: '5', // 震中设防烈度
      pac: sourceOpt.districtCode || '130400', // 行政区划编码
      geoJsonArray: JSON.stringify(
        this.$store.state.dataFilterControl.zhypGeoType.value.rangeArr,
      ),
    };
    installDisasterJudgeServer.quickJudgeServer
      .getIntensityExport(params)
      .then((res: any) => {
        const title = `${eventPushData.EventTime.substring(0, 10)}${
          eventPushData.EventAddr
        }${eventPushData.EqLevel}级地震`;
        const fileName =
          `${title} - 基本信息-烈度-` +
          (type === '2' ? `精简版` : `完整版`) +
          `.docx`;
        downloadFile(fileName, res.data);
      });
  }

  // 清除点文字出的点位 + 高亮。子组件中调用
  private clearPoint() {
    const self = this;
    this.keyArr.forEach((key: any) => {
      self.getComponent_new()._clearLayerByID(key);
    });
    this.keyArr = [];
    this.contList.contListAll.forEach((e: any) => {
      if (e.list) {
        for (const key in e.list) {
          if (e.list.hasOwnProperty(key)) {
            e.list[key].active = false;
          }
        }
      } else {
        e.active = false;
      }
    });
  }

  // 联动gis方法 开始
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.disasterJudgeFactory.getComponent(
        'disasterJudgeResource',
      );
    }
    return component;
  }

  //  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
    );
    return component;
  }

  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('getDem');
    return component;
  }

  private destroyed() {
    this.getComponent().clear();
    this.getComponent().unload();
    this.getComponent_new().clear();
    this.getComponent_new().unload();
    this.messsageBus.off('ranges-refresh');
  }

  private closeAndbackFn() {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {
      largeLeftPanel: {showFlag: false},
    });
    this.messsageBus.emit('closeAndBack', true);
    this.getComponent().clear();
    this.getComponent().unload();
    this.getComponent_new().clear();
    this.getComponent_new().unload();
    this.clearPoint();
  }
}
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
    }

    .studyAndJudgmentOfaPicture_half {
        width: 390px;
        height: 100%;
        box-sizing: border-box;
        position: relative;

        .cont {
            clear: both;
            height: calc(100% - 107px);
        }

        .title-t {
            line-height: 35px;
            text-align: left;
            white-space: nowrap;
            font-style: italic;

            p {
                display: block;
                margin: 0;
                padding-left: 10px;
            }
        }

        .control-btn-container {
            height: 77px;
            padding: 10px 14px 4px 10px;
            box-sizing: border-box;
        }
    }
</style>
<style lang="less">
    // 新增小屏样式；
    #studyAndJudgmentOfaPicture_half .ProtectTargetModule_wrap_cont > li {
        cursor: pointer;
    }

    #studyAndJudgmentOfaPicture_half .DiscussCont_key {
        cursor: pointer;
    }

    #studyAndJudgmentOfaPicture_half .DiscussList .influenceList ul {
        width: 383px;
        /*li:nth-child(1),li:nth-child(3){*/
        /*  width:150px;*/
        /*}*/

        li {
            width: 189px;
            padding-top: 18px;
            box-sizing: border-box;
        }
    }
</style>
