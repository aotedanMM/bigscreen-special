<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import { messsageBus } from '@/util/message';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import enterpriseCrisisPop from '@/components/feature/gisModule/popUp/enterpriseCrisisPop.vue';
import EventInfoPop1 from '@/components/feature/gisModule/popUp/eventInfoPop.vue';
import rescueForcesPop from '@/components/feature/gisModule/popUp/rescueForcesPop.vue';
import realtimeTeam from '@/components/feature/gisModule/popUp/realtimeTeam.vue';
import allRealTeamPopup from '@/components/feature/gisModule/popUp/allRealTeamPopup.vue';
import RainMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/RainMonitorPopup.vue'; // 雨情监测预警点位详情
import weatherForewarningPopup from '@/components/feature/gisModule/popUp/monitorWarning/weatherForewarningPopup.vue'; // 预警点位弹框
import FirePointPopup from '@/components/feature/gisModule/popUp/forestFireYantai/firePointPopup.vue'; // 火点监测点位弹框
import OnlineMapPop from '@/components/feature/gisModule/popUp/monitorWarning/OnlineMapPop.vue'; // 在线终端点位详情
import WindMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/WindMonitorPopup.vue'; // 风情监测预警点位详情
import ReservoirPopup from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirPopup.vue'; // 水库详情专题
import ReservoirBriefPopup from '@/components/feature/gisModule/popUp/monitorWarning/ReservoirPopup/ReservoirBriefPopup.vue'; // 水库详情
import WaterMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/WaterMonitorPopup.vue'; // 水情监测预警点位详情
import EngineeringMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/EngineeringMonitorPopup.vue'; // 工情监测预警点位详情
import warningPopup from '@/components/feature/gisModule/popUp/flood/warningPopup.vue'; // 监测预警点位详情
import FirePointSatelliteMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/FirePointSatelliteMonitorPopup.vue';
import FirePointVideoMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/FirePointVideoMonitorPopup.vue';
import FirePointGroundMonitorPopup from '@/components/feature/gisModule/popUp/monitorWarning/FirePointGroundMonitorPopup.vue';
import FireBanPopup from '@/components/feature/gisModule/popUp/monitorWarning/FireBanPopup.vue';
import RiskHiddenPointPopup from '@/components/feature/gisModule/popUp/DefensivePreparation/RiskHiddenPointPopup.vue'; // 风险隐患点详情
import CountyPopup from '@/components/feature/gisModule/popUp/DefensivePreparation/CountyPopup.vue'; // 首页区县详情
import PersonnelTransferPopup from '@/components/feature/gisModule/popUp/DefensivePreparation/PersonnelTransferPopup.vue'; // 人口转移详情
import ShipToHarbourPopup from '@/components/feature/gisModule/popUp/DefensivePreparation/ShipToHarbourPopup.vue'; // 船舶转移详情
import materialPopup from '@/components/feature/gisModule/popUp/materialPopup.vue';
import historyEarthQuake from '@/components/feature/gisModule/popUp/mapHistoricalEarthquake.vue';
import zhanbaoBasePop from '@/components/feature/gisModule/popUp/zhanbaoBasePop.vue';
import repersityDetailPop from '@/components/feature/gisModule/popUp/repersityDetailPop.vue';
import weatherPop from '@/components/feature/gisModule/popUp/weatherPop.vue';
import eventInfoBluePop from '@/components/feature/gisModule/popUp/eventInfoBluePop.vue';
import DisinfoperPopup from '@/components/feature/gisModule/popUp/DisinfoperPopup.vue';
import eventInfoAreaCounties from '@/components/feature/gisModule/popUp/eventInfoAreaCounties.vue'; // 区县弹框模板
import siteTeamPopup from '@/components/feature/gisModule/popUp/siteTeamPopup.vue'; // 现场指挥部
// import conmnotitlePop from '@/components/feature/gisModule/popUp/conmnotitlePop.vue';
import searchCommonPop from '@/components/feature/gisModule/popUp/searchCommonPop.vue';
import carPop from '@/components/feature/gisModule/popUp/CarPop.vue';
import { eventInfoServer } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
//
import MapCommon from '@/util/MapCommon';
import { messsageBus } from '@/util/message';
import publishObjectPath from '@/util/configRegistry';
// 防御准备 ship ais
import AisPopup from '@/components/feature/gisModule/popUp/DefensivePreparation/AisPopup.vue';
// 防御准备 首页行政区划
import DefensiveDistrictPopup from '@/components/feature/gisModule/popUp/DefensivePreparation/CountyPopup.vue';
import HazardousPopUpTypesFilterPop from '@/components/feature/gisModule/popUp/HazardousPopUpTypesFilterPop.vue';
import {
  hazardousPopUpTypesFilter,
  hazardousTypesPopUpRule,
} from './dataDeal/hazardousTypesFilter';
import {
  firePointPopUpTypesFilter,
  firePointTypesPopUpRule,
} from './dataDeal/firePointFilter';
import {
  derivePopUpTypesFilter,
  deriveTypesPopUpRule,
} from './dataDeal/deriveFilter';
import {
  emResourcePopUpTypesFilter,
  emResourceTypesPopUpRule,
} from './dataDeal/emResourceTypesFilter';
import {
  NearbyRescueTeamTypesFilter,
  NearbyRescueTeamTypesPopUpRule,
} from './dataDeal/NearbyRescueTeamTypesFilter';
// 物资储备库
import MaterialTypesFilterPop from '@/components/feature/gisModule/popUp/materialTypesFilterPop.vue';
// 次生衍生弹框
import deriveFilterPop from '@/components/feature/gisModule/popUp/deriveFilterPop.vue';
import {
  materialTypesFilter,
  materialTypesPopUpRule,
} from './dataDeal/materialReserveTypeFilter';
import {
  defenseObjectTypesFilter,
  defenseObjectTypesPopUpRule,
  // monitorWarningTypesPopUpRule,
} from './dataDeal/defenseObjectTypesFilter';
import store from '@/store/index';
import countweirGateWater from '@/components/feature/gisModule/popUp/countweirGateWater.vue';

/**
 * 事件信息组件View层
 * name值的定义方式：组件名+View
 */
@Component({
  name: 'RenderpopUpTemplate',
  mixins: [MapCommon],
})
export default class RenderpopUpTemplate extends Vue {
  // @Prop(Array) public dataArr: any;
  // public $messageBus: any = messageBus;
  public isPathPlanningClick: any = true;
  public eventLocation: any;
  public geometry: any;
  public geoPoint: any = [];
  public styleObj: any;
  public contextThis: any;
  public componenContext: any = null;
  public dataSchama: any = {};
  public paramItem: any;
  // public popInfodataList: any;
  public popupId: string = 'popup';
  public moduleTypeID: string = 'NewResourceComponent '; // ResourceComponent,newsEventLocate,districtComp
  public containerId: any;
  public currentId: any;
  public currentComponet: any;
  public otherData: any = {};
  public otherMethods: any = {};
  public companyNames: any;
  public hazardousPopUpTypesFilter: any = hazardousPopUpTypesFilter; // 风险隐患详情弹窗PopUp
  public emResourcePopUpTypesFilter: any = emResourcePopUpTypesFilter; // 应急资源救援队PopUp
  public defenseObjectTypesFilter: any = defenseObjectTypesFilter; // 防护目标弹窗PopUp
  public NearbyRescueTeamTypesFilter: any = NearbyRescueTeamTypesFilter; // 防护目标弹窗PopUp
  public firePointPopUpTypesFilter: any = NearbyRescueTeamTypesFilter; // 防护目标弹窗PopUp
  public derivePopUpTypesFilter: any = derivePopUpTypesFilter; // 次生衍生PopUp
  //   public popupTypesFilter1: any = ['RescueTeam※03']; // 救援队等
  public popupTypesFilter4: any = ['RescueTeam']; // 应急物资 救援队伍等
  //   public popupTypesFilter2: any = ['ANJIAN_REPERTORY※01'] // 物资储备等
  public materialTypesFilter: any = materialTypesFilter; // 物资储备库
  public popupTypesFilter3: any = ['v_equipment']; // 救援装备
  public popupTypesFilter5: any = [
    'riverStation',
    'limitOfReservoir',
    'superRainMeasuringStation',
    'heavyRainMeasuringStation',
    'rainMeasuringStation',
  ]; // 监测预警
  public popupTypesFilter6: any = ['rain', 'wind', 'water', 'work']; // 风水雨工情

  @Watch('$store.state.eventPushStore')
  // eventInfo默认的初始化数据
  private eventInfo: IEventinfo = {
    id: '',
    title: '',
    eventType: '',
    reportTime: '',
    location: '',
    longitude: '',
    latitude: '',
  };
  private eventInfoData: IEventinfo[] = [];
  /* public getInit() {
            (this as any).resolveMap('map').then(() => {
              this.getComponent().on(this.popupId, this.onShowPopup, this);
            });
            this.init();
          } */
  // 显示弹框,初始化数据
  public onShowPopup(event: any) {
    if (event.type === 'repository' || event.type === 'rescueteam') {
      this.messsageBus.emit('leftMapPanelMutex', true);
    }
    /**
     * 打开弹窗  清除路径规划 (关闭里面包含清空历史轨迹  数据回归默认  详情 v-show 传值true)
     * */
    // this.messsageBus.emit('Close_Router', {});
    const paramItemData = this.paramItem;
    // tslint:disable-next-line:no-debugger
    const self = this;
    // const self = (this.contextThis ) ? this.contextThis : this;
    const eventInfo = this.eventInfo;
    const data: any = (event && event.data) || {};
    data.isEventBtn = (event && event.isEventBtn) || false;
    // 组件类型
    const popType = event && event.type;
    self.geometry = data.geometry ? data.geometry : {};
    self.geoPoint = data.geometry ? [data.geometry.x, data.geometry.y] : [];
    // 样式
    if (event && event.styleObj) {
      self.styleObj = event.styleObj;
    }
    self.containerId =
      event.content && event.content.containerId
        ? event.content.containerId
        : event.containerId
        ? event.containerId
        : '';
    if (this.eventLocation && this.eventLocation.length > 0) {
      data.eventLocation = this.eventLocation.concat();
    }
    // const geom = event && event.geom;
    // self.getComponent().off(self.popupId, self.onShowPopup, self);
    const btnOnOff: boolean = self.moduleTypeID !== 'nearQuery';
    const popRender = {
      el: '#' + self.containerId,
      store,
      data() {
        return {
          event,
          vueThis: self.contextThis,
          data,
          type: popType,
          btnOnOff,
          styleObj: self.styleObj ? self.styleObj : {},
          ...self.otherData,
          // config: self.dataSchama,
        };
      },
      beforeDestroy() {
        self.getComponent().off(self.popupId, self.onShowPopup, self);
      },
      methods: {
        ...self.otherMethods,
        // 这个是关闭操作
        close() {
          // 周边分析出来的弹窗，在进行关闭的时候不执行联动
          // 常态下应急资源的弹窗的关闭，不要进行左侧展开联动
          if (
            self.moduleTypeID !== 'nearQuery' &&
            self.contextThis.$store.state.eventPushStore.eventId
          ) {
            this.messsageBus.emit('leftMapPanelMutex', true); // 弹出详情通知前端  收起面板   前端打开面板 清除详情框和高亮
          }
          // self.getComponent().clearPopup();
          // tslint:disable-next-line:no-debugger
          switch (self.moduleTypeID) {
            case 'NewResourceComponent':
              self.getComponent().clearPopup(); // 应急资源
              break;
            case 'localResource_popup':
              (self.contextThis as any)
                .getresourceOnMapComponent()
                ._closePopup();
              break;
            case 'newsEventLocate':
            case 'teamDispatch':
              (self.contextThis as any).getComponent().closePopup();
              break;
            case 'districtComp':
              // self.componenContext.clearPopup();
              (self.contextThis as any).getComponentNew().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'nearQuery': // 周边分析点出的弹窗
              (self.contextThis as any).getNearQueryComponent().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'locateComp': // 安全生产事故详情窗关闭
              self.getLocateCompComponent().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'disasterJudgeAirTeam': // 航空护林的弹窗
              (self.contextThis as any).getComponentAirTeam().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'hisPointspopup': // 历史地震的窗口
              (self.contextThis as any).gethistoryEarthQuake().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'materialPopup':
              (self.contextThis as any).getComponent().closePopup();
              break;
            case 'FirePointQuery_popup':
              (self.contextThis as any).getComponentFire().closePopup();
              break;
            case 'rainMonitor':
            case 'waterMonitor':
            case 'windMonitor':
            case 'workMonitor':
            case 'riskMonitor':
            case 'weatherMonitor':
            case 'countweirGateWater':
              (self.contextThis as any).getComponent().closePopup();
              self.messsageBus.emit('closeVideoMapPop');
              self.getAroundVideoComponent().unload();
              break;
            case 'push_event_popup':
              (self.contextThis as any).getComponent()._closePopup();
              break;
            case 'onlineTerminal':
              (self.contextThis as any).getComponent().closePopup();
              this.$store.commit('mapTools/changeShowOnlyLayerPlay', {
                isShow: false,
              });
              this.messsageBus.emit('closeOnlineMapPop', false);
              break;
            default:
              (self.contextThis as any).getComponent().closePopup();
            // (self.contextThis as any).getComponent().clearAll();
            // self.getComponent().clearAll();
          }
          // unload start
          // 卸载周边分析 传点位是point 是卸载对应点位的周边分析, 不传是卸载所有
          if (self.moduleTypeID !== 'nearQuery') {
            // 周边分析内的弹窗，不卸载周边分析
            self
              .getAroundComponent()
              .unload(/*{
                point: self.geoPoint,
                // radius: 80000,
              }*/);
          }
          if (self.moduleTypeID === 'disasterJudgeResource') {
            self
              .getAroundVideoComponent().unload();
          }
          // unload end

          // 关闭路径规划
          /*if (self.isPathPlanningClick) {
              self.messsageBus.emit('Close_Router', {});
              self.isPathPlanningClick = false;
          }*/
          // 卸载历史轨迹
          (self.getTrackComponent() as any).unload();
          // 关闭视频监控
          self.messsageBus.emit('openVideoMonitor', '', {});
          // 关闭弹框以后，打开左侧面板；
          // 常态下应急资源的弹窗的关闭，不要进行左侧展开联动
          if (
            self.moduleTypeID !== 'nearQuery' &&
            self.contextThis.$store.state.eventPushStore.eventId
          ) {
            this.messsageBus.emit('leftMapPanelMutex', true); // 弹出详情通知前端  收起面板   前端打开面板 清除详情框和高亮
          }
        },
        // 路径规划
        pathPlanningClick(geoPoint: any, receidata: any) {
          // tslint:disable-next-line:no-debugger
          // debugger;
          // console.log('Open_Router的self.messsageBus：', self.messsageBus);
          // console.log('eventLocation:', self.eventLocation);
          // self.messsageBus.emit('Open_Router', {});
          /* self.messsageBus.emit('Open_Router', {
            startPoint: [116.35, 39.83],
            endPoint: [117, 36.7],
            type: 1, //  判断打开哪个路径弹窗 0:直接打开大弹窗 1:打开小弹窗
          }); */
          const dataobj: any = {
            startPoint: geoPoint, // 当前点位经纬度
            endPoint: self.eventLocation ? self.eventLocation : [], // 当前战时事故点经纬度，startPoint和endPoint均可不填
            type: 1, //  判断打开哪个路径弹窗 0:直接打开大弹窗 1:打开小弹窗
          };
          if (receidata) {
            dataobj.receidata = receidata;
          }
          // console.log('eventLocation.EventLon,eventLocation.EventLat:', self.$store.state.eventPushStore.eventLocation.EventLon, self.$store.state.eventPushStore.eventLocation.EventLat);
          self.messsageBus.emit('Open_Router', dataobj);
          // self.isPathPlanningClick = false; // close()时判断是否路径规划按钮点击时，清掉路径规划弹出层
          // this.close(); // 此处的this是指向popRender自身

          /* self.messsageBus.emit('Open_Router', {
                          startPoint: [self.$store.state.eventPushStore.eventLocation.EventLon, self.$store.state.eventPushStore.eventLocation.EventLat],
                          endPoint: [self.currentChildObj.data.longitude, self.currentChildObj.data.latitude],
                        }); */
        },
        // 加载周边分析gis操作
        aroundAnalysisClick(geoPoint: any) {
          // tslint:disable-next-line:no-debugger
          self.getAroundComponent().load(
            {
              point: geoPoint,
              // radius: 80000,
            },
            this.event.type,
          );
          switch (self.moduleTypeID) {
            case 'NewResourceComponent':
              // self.getComponent().closePopup(); // 应急资源
              break;
            case 'newsEventLocate':
            case 'teamDispatch':
              (self.contextThis as any).getComponent().closePopup();
              break;
            case 'districtComp':
              // self.componenContext.clearPopup();
              (self.contextThis as any).getComponentNew().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'nearQuery': // 周边分析点出的弹窗
              (self.contextThis as any).getNearQueryComponent().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            case 'disasterJudgeAirTeam': // 航空护林的弹窗
              (self.contextThis as any).getComponentAirTeam().closePopup();
              // self.contextThis.getComponent().closePopup(); // 行政区划
              break;
            default:
              (self.contextThis as any).getComponent().closePopup();

            // (self.contextThis as any).getComponent().clearAll();
            // self.getComponent().clearAll();
          }
        },
        // 视频监控按钮事件
        videoMonitoringClick() {
          const iframeCode = data._id ? data._id : '';
          const tempData = {
            type: 'filetype',
            url: '/api/mobileapp/downloadfeedbackattach/v1?id=',
            code: iframeCode,
            istype: this.type,
          };
          self.messsageBus.emit('openVideoMonitor', 'videoMonitor', tempData);
          // self.messsageBus.emit('SsspPreview');
        },
        // 企业视频按钮事件
        companyVideoClick() {
          console.log('我是企业视频的按钮事件');
          // let val: any = $('#eventPopdata').val()
          // console.log(JSON.stringify(val))
          self.messsageBus.emit('openCompanyVideopop', 'companyVideo', {name: '毕东超'});
          // this.$emit('buttonListClick');
        },
        // 危化物联按钮事件
        hazardousChemicalsClick() {
          const iframeName = data.name ? data.name : ''; /* '330170028' */
          function conversionEncode(companyNames: any) {
            return encodeURIComponent(
              encodeURIComponent(encodeURIComponent(companyNames)),
            );
          }
          function getBackDoorTime() {
            return (
              new Date(new Date().toJSON().split('T')[0]).getTime() + ''
            ).replace(/00/g, '');
          }
          const backDoorTime = getBackDoorTime();
          this.companyNames = conversionEncode(iframeName);
          const iframeSrc =
            `nolayout/login?isBackDoor=true&backDoorTime=` +
            backDoorTime +
            `&callback="%252Flayout%252Fcompanyrisksearch%253FcallbackParameter%253D%2522%25257BcompanyName%25253A'` +
            this.companyNames +
            `'%25257D%2522"`;
          window.open(publishObjectPath.value.weihuawulianIframe + iframeSrc);
        },
        switchHanler(bool: boolean) {
          self.contextThis.switchPathPlanningHandler(bool, event);
        },
        // 周边视频分析
        aroundVideoAnalysisClick(geoPoint: any) {
          this.messsageBus.emit('closeVideoMonitorPop', false);
          self.getAroundVideoComponent().load({
            point: geoPoint,
          });
          switch (self.moduleTypeID) {
            case 'riskMonitor':
              break;
            case 'NewResourceComponent ':
              // self.getComponent().closePopup(); // 应急资源
              break;
            case 'newsEventLocate':
            case 'teamDispatch':
              (self.contextThis as any).getComponent().closePopup();
              break;
            case 'districtComp':
              (self.contextThis as any).getComponentNew().closePopup();
              break;
            case 'nearQuery': // 周边分析点出的弹窗
              (self.contextThis as any).getNearQueryComponent().closePopup();
              break;
            case 'disasterJudgeAirTeam': // 航空护林的弹窗
              (self.contextThis as any).getComponentAirTeam().closePopup();
              break;
            // default:
            //   (self.contextThis as any).getComponent().closePopup();
          }
        },
        // 这个是点击按钮的操作
        /* clickHandler() {
                              // self.messsageBus.emit('EventInfoPreview');
                            }, */
      },
    };

    // 当新建弹窗时, 卸载之前打开的周边分析 (除了周边分析点进来)
    // if (!event.noUnloadAround) {
    if (self.moduleTypeID !== 'nearQuery') {
      self.getAroundComponent().unload();
      self.messsageBus.emit('closeVideoMapPop', false);
      self.getAroundVideoComponent().unload();
    }

    let type: any = event.type;
    // 监测预警类型过滤[堤防,电排站,船闸,水电站,水闸]
    if (
      event.data.type &&
      ['bundpitch', 'dianpaizhan', 'chuanzha', 'dianzhan', 'shuizha'].includes(
        event.data.type,
      )
    ) {
      type = event.data.type;
    }
    // 类型使用的模板名称
    const filterEventType = self.getPopupTypesFilter(type); //
    console.log('filterEventType', filterEventType);
    // console.log('sssssss---:', document.getElementById(popRender.el));
    // 根据类型创建对应模板class
    switch (filterEventType) {
      case 'countweirGateWater':
        const countweirGateWaterpop = new countweirGateWater(popRender); // 历史地震
        break;
      case 'hisPointspopup':
        const hisPointspopup = new historyEarthQuake(popRender); // 历史地震
      case 'emResourcePopUpTypesFilter':
      case 'theteam':
        // 应急资源通用过滤
        const emResourcePopUpTypesFilters = new HazardousPopUpTypesFilterPop(
          popRender,
        );
        break;
      case 'rescueteam':
        // 应急资源通用过滤
        const rescueteams = new MaterialTypesFilterPop(popRender);
        break;
      case 'hazardousPopUpTypesFilter':
        // 风险隐患通用过滤
        const hazardousPopUpTypesFilters = new HazardousPopUpTypesFilterPop(
          popRender,
        );
        break;
      case 'defenseObjectTypesFilter':
        // 防护目标通用过滤
        const defenseObjectTypesFilters = new HazardousPopUpTypesFilterPop(
          popRender,
        );
        break;
      case 'NearbyRescueTeamTypesFilter':
        // 防护目标通用过滤
        const nearbyRescueTeamTypesFilter = new HazardousPopUpTypesFilterPop(
          popRender,
        );
        break;
      case 'materialTypesFilter':
        // 物资装备库
        const materialTypesFilters = new MaterialTypesFilterPop(popRender);
        break;
      case 'baseCom':
        // 现场指挥部
        const siteTeamPopupFilters = new siteTeamPopup(popRender);
        break;
      case 'derivePopUpTypesFilter':
        // 物资装备库
        const derivePopUpTypesFilters = new deriveFilterPop(popRender);
        break;
      case 'countyCountAndTownCount':
        // 地震事件态，基础信息，区县弹窗
        const eventInfoAreaCountiesFilter = new eventInfoAreaCounties(
          popRender,
        );
        break;
      case 'teamDispatch':
        self.contextThis.tempatePopUp = new EventInfoPop1(popRender); // 行政区划：镇
        break;
      case 'hazardous':
      case 'metalnonmetal':
      case 'ANJIAN_OILGASFIELD※01':
      case 'ANJIAN_OILGASFIELD※02':
        const popupHazardous = new enterpriseCrisisPop(popRender); // 危化企业等:popType:1
        break;
      //   case 'RescueTeam※03':
      //   case 'NearbyRescueTeam※03':
      //     const popup2 = new rescueForcesPop(popRender); // 救援队:popType:2
      //     break;
      case 'realpopup':
        const realpopup = new realtimeTeam(popRender); // 常态救援队伍
        break;
      case 'airteamPopup':
      case 'allRealTeamPopup':
        const allRealTeam = new allRealTeamPopup(popRender); // 事件救援队伍
        break;
      case 'materialPopup':
        const material = new materialPopup(popRender); // 物资详情窗
        break;
      case 'warningPopup':
        const warning = new warningPopup(popRender); // 监测预警详情窗
        break;
      /* case 'ANJIAN_REPERTORY※01':
                            const popup3 = new repersityDetailPop(popRender); // 物资储备库:popType:3
                            break; */
      case 'localWeather':
        const weatherPop1 = new weatherPop(popRender);
        break;
      case 'BAS_GEOLOGICHAZARD※01': // 承灾体 地质隐患点
      case 'majordanger':
      // 桥梁  发电站 政府机关 住宅区
      case 'tunnel※01':
      // case 'portwharf':  // 港口码头
      // case 'Nuclearinfo※01':  // 核设施
      // case 'powerplant※01':
      case 'government':
      case 'development※01':
      case 'house_struc_type': //  房屋结构
        const popupCommon = new searchCommonPop(popRender);
        break;
      case 'JC_WARBASE※01': //  战保基地
      case 'v_equipment': //  救援装备
        const popup4 = new zhanbaoBasePop(popRender); // 救援队:popType:2
        break;
      //   case 'ANJIAN_REPERTORY※01': // 物资储备库:popType:3
      //   case 'materialTypesFilter':
      //     const popFilter = new MaterialTypesFilterPop(popRender)
      //     break
      case 'repository': // 物资储备库
        const popup3 = new repersityDetailPop(popRender);
        break;
      case 'fireCar':
        const popupFireCar = new carPop(popRender); //
        break;
      case 'rain':
        const rainPopup = new RainMonitorPopup(popRender);
        break;
      // 气象预警
      case 'weatherWarning':
        const weatherPopup = new weatherForewarningPopup(popRender);
        break;
      case 'firePointPopUpTypesFilter':
        const FirePointPopUpTypesFilter = new FirePointPopup(popRender);
        break;
      // 在线终端
      case 'terminal':
        const onlinePopup = new OnlineMapPop(popRender);
        break;
      case 'wind':
        const windPopup = new WindMonitorPopup(popRender);
        break;
      case 'water':
        const reservoirPopup = new ReservoirPopup(popRender);
        break;
      case 'reservoirBrief':
        const reservoirBriefPopup = new ReservoirBriefPopup(popRender);
        break;
      case 'disinfoper':
        const disinfoperPopup = new DisinfoperPopup(popRender);
        break;
      case 'river':
        const waterPopup = new WaterMonitorPopup(popRender);
        break;
      case 'work':
        const workPopup = new HazardousPopUpTypesFilterPop(popRender);
        break;
      case 'firepointsatellite':
        const fpsmPopup = new FirePointSatelliteMonitorPopup(popRender);
        break;
      case 'firepointvideo':
        const fpvmPopup = new FirePointVideoMonitorPopup(popRender);
        break;
      case 'firepointground':
        const fpgmPopup = new FirePointGroundMonitorPopup(popRender);
        break;
      case 'fireban':
        const firebanPopup = new FireBanPopup(popRender);
        break;
      case 'wxjz':
      case 'dzyh':
      case 'shyh':
      case 'ylld':
      case 'jzgd':
      case 'nld':
      case 'hz':
      case 'dlss':
      case 'txss':
        const riskPopup = new RiskHiddenPointPopup(popRender);
        break;
      case 'personnel':
        const personnelPopup = new PersonnelTransferPopup(popRender);
        break;
      case 'county':
        const countyPopup = new CountyPopup(popRender);
        break;
      case 'ship':
      case 'ashore':
        const shipPopup = new ShipToHarbourPopup(popRender);
        break;
      case 'shipAis': // 防御准备首页 ship Ais
        const shipAisPopup = new AisPopup(popRender);
        break;
      case 'defensiveDistrictPopup': // 防御准备首页 ship Ais
        const defensiveDistrictPopup = new DefensiveDistrictPopup(popRender);
        break;
      default:
        // console.log('sssssss---:', document.getElementById(popRender.el));
        // const weatherPop2 = new weatherPop(popRender); //
        const popup = new eventInfoBluePop(popRender);
    }
  }
  // 初始化弹框属性
  public getParams(item: any) {
    // const that = this;
    if (!item) {
      return;
    }
    // 经纬度
    this.eventLocation = item.eventLocation ? item.eventLocation : [];
    this.contextThis = item.that ? item.that : this;
    // 模板
    this.componenContext = item.getComponenContext;
    this.popupId = item.popupId ? item.popupId : this.popupId;
    this.moduleTypeID = item.moduleTypeID
      ? item.moduleTypeID
      : this.moduleTypeID;
    this.paramItem = item || {};
    this.otherData = item.otherData || {};
    this.otherMethods = item.otherMethods || {};
  }
  // 点击事件的处理
  public clickHandler(item: any) {
    // tslint:disable-next-line:no-debugger
    const that = this;
    this.contextThis = item.that;
    this.componenContext = item.getComponenContext;
    this.popupId = item.popupId;
    this.moduleTypeID = item.moduleTypeID;
    this.paramItem = item || {};
    // this.popInfodataList = item.popInfodataList;
    (this as any).resolveMap('map').then(() => {
      // this.getComponent().off(item.popupId);
      this.getComponent().on(
        item.popupId,
        (event: any) => {
          //   debugger;
          //   if (
          //     event.type === 'RescueTeam※03' &&
          //     event.data.name.indexOf('前突') !== -1
          //   ) {
          //     // 如果是 常态应急资源进入的 区分前突和一般
          //     event.type = 'realpopup';
          //   }
          // 物资储备库 社会库弹窗显示不同
          if (event.data.REPERTORYTYPECODE / 1 === 3) {
            event.type = 'jdRepository';
          }
          this.onShowPopup(event);
        },
        this,
      );

      this.getSearchComponent().on(
        'popup',
        (event: any) => {
          this.onShowPopup(event);
        },
        this,
      );
      this.getComponent();
      this.getSearchComponent();
    });
    // this.eventInfo = item;
    // console.log('item=>', item);
    /* if (item) {
                  const locateEventData = item.locateEventData;
                  this.getComponent().locateEvent(locateEventData);
                } */
    //
    // this.showEventInfoPop = true;
  }
  public getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.normalFactory &&
      factory.normalFactory.getComponent(this.moduleTypeID); // newsEventLocate,NewResourceComponent
    return component;
  }

  public getSearchComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component: any = factory.commonFactory.getComponent('search');
    // const component: any = factory.commonFactory.getComponent('commonFactory');
    return component;
  }

  // 周边查询
  public getAroundComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.commonFactory &&
      factory.commonFactory.getComponent('nearQuery'); // newsEventLocate,NewResourceComponent
    return component;
  }
  // 周边视频查询
  public getAroundVideoComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.commonFactory &&
      factory.commonFactory.getComponent('nearbyVideoLayer'); // newsEventLocate,NewResourceComponent
    return component;
  }

  // 周边查询
  public getLocateCompComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.commonFactory &&
      factory.commonFactory.getComponent('locateComp'); // newsEventLocate,NewResourceComponent
    return component;
  }

  // 历史轨迹
  public getTrackComponent(): void {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('historyTrack');
    }
    return component;
  }

  public beforeDestroy() {
    this.getComponent().off(this.popupId);
  }

  // 这里放航空护林队弹窗接收
  private getComponentAirTeam() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeAirTeam',
    );
    return component;
  }

  // 这里放历史地震弹窗弹窗接收
  private gethistoryEarthQuake() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('historyEarthQuake');
    return component;
  }
  /* private beforeDestroy() {
            const component = this.getComponent();
            component.unload();
          } */

  // private showEventInfoPop: boolean = false;
  // 这方法只是获取数据
  private async getData() {
    return await eventInfoServer.getEventInfo({
      startTime: getDateFormat({ last: 'month' }),
      endTime: getDateFormat(),
    });
  }
  // 根据类型使用对应模板
  private getPopupTypesFilter(val: any) {
    if (this.hazardousPopUpTypesFilter.includes(val)) {
      // 风险隐患详情弹窗PopUp过滤位置
      const popupType = 'hazardousPopUpTypesFilter';
      return popupType;
    } else if (this.defenseObjectTypesFilter.includes(val)) {
      // 防护目标详情弹窗PopUp过滤位置
      const popupType = 'defenseObjectTypesFilter';
      return popupType;
    } else if (this.emResourcePopUpTypesFilter.includes(val)) {
      // 应急资源F详情弹窗PopUp过滤位置
      const popupType = 'emResourcePopUpTypesFilter';
      return popupType;
    } else if (this.NearbyRescueTeamTypesFilter.includes(val)) {
      // 应急资源F详情弹窗PopUp过滤位置
      const popupType = 'NearbyRescueTeamTypesFilter';
      return popupType;
    } else if (val.includes(this.popupTypesFilter3)) {
      const popupType = 'v_equipment'; // 救援装备等
      return popupType;
    } else if (this.popupTypesFilter5.includes(val)) {
      const popupType = 'warningPopup';
      return popupType;
    } else if (this.popupTypesFilter6.includes(val)) {
      return val;
    } else if (this.materialTypesFilter.includes(val)) {
      const popupType = 'materialTypesFilter';
      return popupType;
    } else if (val === 'firePointToday' || val === 'historyFire') {
      const popupType = 'firePointPopUpTypesFilter';
      return popupType;
    } else if (val === 'event') {
      const popupType = 'derivePopUpTypesFilter';
      return popupType;
    } else if (['countyCount', 'townCount'].includes(val)) {
      const popupType = 'countyCountAndTownCount';
      return popupType;
    } else {
      const popupType = val;
      return popupType;
    }
  }

  // 这个方式是初始化的时候要干的活
  private async init() {
    /* const res = await this.getData();
                this.eventInfoData = res.data; */
    this.getComponent();
  }
  private created() {
    // 进入事件处置
    //     messsageBus.$on('inEventInfoBtn', (callback: any, param: any) =>{
    // debugger
    //         callback.call(this,param);
    //     })
    // tslint:disable-next-line:no-debugger
    /* debugger;
    if (this.$store.state.eventPushStore.SEND_AFTERSHOCK_INFO > -1) {
            console.log(this.$store.state.eventPushStore);
        } */
    // this.eventLocation = [this.$store.state.eventPushStore.eventLocation.EventLon, this.$store.state.eventPushStore.eventLocation.EventLat];
  }
  private mounted() {
    // console.log('mounted:');
    /* (this as any).resolveMap('map').then(() => {
                  this.getComponent().on(this.popupId, this.onShowPopup, this);
                  this.init();
                }); */
  }
}
</script>
