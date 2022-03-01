<!--风险隐患、应急资源-->
<template>
    <div class="studyAndJudgmentOfaPicture_half" id="studyAndJudgmentOfaPicture_half">
        <div class="title-t title-panel">
            <p>
                {{title}}
                <ZoomExportBtn @handleEmitExport="downloadFile" v-if="showZoomExportBtn"></ZoomExportBtn>
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
        basicInformationConfig.ControlBtnContainer &&
          basicInformationConfig.ControlBtnContainer.isShow &&
          basicInformationConfig.ControlBtnContainer.componentParam.btnList.length > 0
      "
        >
            <ControlBtnContainer :compParam="basicInformationConfig.ControlBtnContainer"></ControlBtnContainer>
        </div>
        <DiscussTab ref="DiscussTab" @tabList="tabList" v-show="isEnterDispose"></DiscussTab>
        <!-- :style="{height: (basicInformationConfig.contListScrollHeight || isEnterDispose ? '688px' : '730px')}" -->
        <div class="cont">
            <el-scrollbar
                    class="cmp-scrollbar-y"
                    style="height:calc(100% - 16px);"
            >
                <!-- 风险隐患面板中关闭行政区划与人口 -->
                <!-- <div class="list">
                  <DiscussList
                    v-if="true"
                    :levelArr="levelArr"
                    :tabShow="tabShow"
                    @changeKuang="changeKuang"
                  ></DiscussList>
                </div>-->
                <div style="padding:0 10px;box-sizing:border-box">
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
                                    @changeKuang="changeKuang"
                                    @dealKey="dealKey"
                                    :historyEarthquakeNum="historyEarthquakeNum"
                                    :is="item.componentName"
                                    :key="index"
                                    :unit="item.unit"
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
import HistoryEarthquake from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/HistoryEarthquake.vue';
import SurroundVideo from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/SurroundVideo.vue';
import ReservoirMonitorLeft from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/ReservoirMonitorLeft.vue'; // 左侧水库
import EventConfigRegistry from '@/util/eventConfigRegistry';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
import ZoomExportBtn from '@/components/feature/flood/ZoomExportBtn.vue'; // 最小化下载组件
import {downloadFile} from '@/util/tools';

@Component({
  name: 'StudyAndJudgmentInformationHalf',
  components: {
    DiscussList,
    DiscussTab,
    DiscussCont,
    ControlBtnContainer, //  控制按钮的组件，河流研判、缓冲区研判、行政区划研判
    MonitorWarningContainer, // 监测预警
    HistoryEarthquake, // 历史地震
    SurroundVideo, // 周边视频
    ReservoirMonitorLeft, // 左侧水库
    ZoomBtn, // 最小化组件
    ZoomExportBtn, // 最小化下载组件
  },
})
export default class StudyAndJudgmentInformationHalf extends Vue {
  @Prop() private getJsonKey: any;

  private title: any = '';
  private currentTabAllData: any = null;
  private levelArr: any[] = []; // 可能存放的是当前选中的tab数组
  private tabShow: any = {};
  private level: string = '';
  private personnelKey: any = [];
  private contList: any = {};
  private radius: any = '50';
  private keyArr: any = [];
  private pmaxlevel: any;
  private historyEarthquakeNum = 0;
  private showZoomExportBtn: boolean = false;
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
  private basicInformationConfig: any = {};

  @Watch('getJsonKey', {deep: true, immediate: true})
  private getDataList(val: any) {
    this.getShowFlag();
    this.getComponent().clear();
    if (val.key === 'basicInformation') {
      this.title = val.name;
    } else {
      this.title = val.name;
    }

    this.basicInformationConfig = this.$store.state.configModel.config[val.key];
    this.personnelKey = this.$store.state.configModel.config[
      val.key
      ].personnelKey;
    this.tabShow = this.$store.state.configModel.config[val.key].tabShow;
    this.level = this.$store.state.configModel.config[val.key].level;
    this.contList = this.$store.state.configModel.config[val.key].contList;
    // 保证数据是对应经验圈内得
    this.getResourceStat(this.personnelKey);
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
  }

  private getShowFlag() {
    const typecode = ['0', '6', '7', '12', '13', '2', '4', '5'];
    if (typecode.includes(this.$store.state.eventPushStore.eventLocation.EventType)) {
      this.showZoomExportBtn = false;
    } else {
      this.showZoomExportBtn = true;
    }
  }

  // @Watch('$store.state.configModel.config')
  // private getBasicInformation(val: any) {
  //   // 数据更新以后 重新获取下数据
  //   if (this.$refs.DiscussTab && (this.$refs.DiscussTab as any).changeQuan) {
  //     (this.$refs.DiscussTab as any).changeQuan();
  //   }
  //   if (
  //     this.$store.state.eventPushStore.eventLocation.EventType.toString() ===
  //     '10'
  //   ) {
  //     this.isCloseAndback = true;
  //   }
  // }

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

  private created() {
    // this.getQuickStudy(this.$store.state.configModel.config);
    if (this.$store.state.eventPushStore.eventId) {
      // 监听改变经验圈范围
      this.messsageBus.off('ranges-refresh');
      this.messsageBus.on('ranges-refresh', this.drawInfluence);
    }
  }

  private getComponent_Pop() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent('disasterJudgePop');
    return component;
  }

  // 重新监听经验圈发生变化，并与经验圈设置和经验圈图层进行联动
  private drawInfluence() {
    this.getComponent_Pop().load(0);
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
      JSON.stringify(
        this.$store.state.configModel.config.basicInformation.tabShow,
      ),
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
      ...param,
      districtCode: sourceOpt.districtCode, // 人口用
    };
    const rkPromise = installDisasterJudgeServer.quickJudgeServer.bufferStatistics(
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
              populationResData = values[1][0].POPU_DISTPOPU.POPTOTAL;
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
      },
    );
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
    if (this.$store.state.dataFilterControl.zhypGeoType.key === 'hcqyp') {
      geo = JSON.parse(this.$store.state.dataFilterControl.filter.geometry);
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


    this.getComponent_new()
      .getMultiuleAllNum(optKey.toString(), '', geo ? geo : null)
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

  // 获取经纬度
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
    this.getRegionPopStat();
    this.getResourceStat(this.personnelKey, itemAll);
    this.clearPoint();
  }

  // 文字叠加key处理 。子组件中调用
  private dealKey(item: any) {
    const self = this;
    if (item.active) {
      this.keyArr.push(item.key);
      // const queryParam: any = {
      //   districtCode: this.$store.state.dataFilterControl.filter.districtCode,
      //   typecode: item.key,
      // };
      // point,
      // dataA: item.geometry,
      // if (this.$store.state.dataFilterControl.filter.geometry) {
      //   const jsonObj = JSON.parse(
      //     this.$store.state.dataFilterControl.filter.geometry
      //   );
      //   queryParam.dataA = jsonObj;
      // }
      // queryParam.point = this.getComponent().getQueryResourcePoint(
      //   queryParam.dataA
      // );
      // 添加标点
      this.getComponent_new().getMultiuleOneNum(item.key).then((dataTemp: any) => {
        let data: any = this.handleListRes(dataTemp);
        if (this.$store.state.dataFilterControl.zhypGeoType.key) {
          data = data.list;
        }
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
    let schemeType: string = '2';
    if (this.getJsonKey.key === 'basicInformation') {
      schemeType = '2';
    } else if (this.getJsonKey.key === 'basicInformationTwo') {
      schemeType = '4';
    }
    // TODO：缺少震中设防烈度
    const params: any = {
      eqLevel: String(eventPushData.EqLevel), // 震级
      eventAddr: eventPushData.EventAddr, // 事发地点
      eventLat: String(eventPushData.EventLat), // 纬度
      eventLon: String(eventPushData.EventLon), // 经度
      eventTime: eventPushData.EventTime, // 发震时间，格式：yyyy年MM月dd日HH时mm分
      eventTit: eventPushData.EventTit, // 地震事件标题
      isList: type, // 0-无列表，1-带列表-完整模式，2-带列表-精简模式（列表最多显示50条）
      schemeType, // 方案类型，1-基本信息，2-风险隐患，3-应急力量，4-应急资源
      modelResult: JSON.stringify(
        this.$store.state.earthQuake.earthQuakeIntensityData,
      ), // 模型数据
      fortifyLevel: '5', // 震中设防烈度
      pac: sourceOpt.districtCode || '370600', // 行政区划编码
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
          `${title} - ${this.title}-烈度-` +
          (type === '2' ? `精简版` : `完整版`) +
          `.docx`;
        downloadFile(fileName, res.data);
      });
  }

  // 清除点文字出的点位 + 高亮。子组件中调用
  private clearPoint() {
    const self = this;
    this.keyArr.forEach(function(key: any) {
      self.getComponent().hideResource(key);
    });
    this.keyArr = [];
    this.contList.contListAll.forEach(function(e: any) {
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
            height: calc(100% - 108px);
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

                .downloadBox {
                    float: right;
                    display: flex;
                    align-items: center;
                    margin-right: 105px;
                }
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
