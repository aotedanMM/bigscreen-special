import BaseModule from '../BaseModule';
import commonComponents from './index';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import {
  communicationServer,
  airStationServer,
  earlyWarningServer,
  regionSelectionServer,
  dataSourcesServer,
  multiuleInterfaceServer,
} from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
export default class Module extends BaseModule {
  constructor(opts: any) {
    super(opts);
    this.componentClazzes = commonComponents;
  }
  /**
   * 创建组件
   * @param opts {Object}
   */
  public createComponents(opts: any) {
    const components: any = commonComponents;
    // 路径规划
    const simpleRouterComponent = new components.SimpleRouterPlanComponent({
      map: this.options.map,
      server: publishObjectPath.value.egis,
    });
    simpleRouterComponent.load();
    // 行政区划
    const districtComp = new components.DisasterJudgeDistrictComponent({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: installDisasterJudgeServer.districtServer,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
      nearbyQuery: this.options.GISComponents.nearbyQuery,
      nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
    });
    this.components.districtComp = districtComp;
    // dem
    const getDem = new components.GetDemComponent({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: this.options.serviceConfig,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
      nearbyQuery: this.options.GISComponents.nearbyQuery,
      nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
    });
    this.components.getDem = getDem;
    // 行政区划
    const districtCompYT = new components.YTDisasterJudgeDistrictComponent({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: installDisasterJudgeServer.districtServer,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
      nearbyQuery: this.options.GISComponents.nearbyQuery,
      nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
    });
    this.components.districtCompYT = districtCompYT;
    // 人口热力
    const disasterJudgePopComp = new components.DisasterJudgePopComponent({
      map: this.options.map,
      service: multiuleInterfaceServer,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      symbolConfig: this.options.symbolConfig,
      featureLocate: this.options.GISComponents.featureLocate,
      eventInfo: this.options.eventInfo,
    });
    this.components.disasterJudgePop = disasterJudgePopComp;
    // 资源
    const disasterJudgeResourceComp = new components.DisasterJudgeResourceComponent(
      {
        map: this.options.map,
        service: installDisasterJudgeServer.hazServer,
        GISComponents: this.options.GISComponents,
        symbolConfig: this.options.symbolConfig,
        eventInfo: this.options.eventInfo,
        nearbyQuery: this.options.GISComponents.nearbyQuery,
        eventDispatcher: this.options.GISComponents.eventDispatcher,
        routerPlan: this.options.GISComponents.routerPlan,
        nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
      },
    );
    this.components.disasterJudgeResource = disasterJudgeResourceComp;
    // 力量调度
    const disasterJudgeNewTeamComp = new components.DisasterJudgeNewTeamComponent(
      {
        map: this.options.map,
        service: installDisasterJudgeServer.rescueTeamServer,
        GISComponents: this.options.GISComponents,
        symbolConfig: this.options.symbolConfig,
        eventInfo: this.options.eventInfo,
        nearbyQuery: this.options.GISComponents.nearbyQuery,
        eventDispatcher: this.options.GISComponents.eventDispatcher,
        routerPlan: this.options.GISComponents.routerPlan,
        historyTrack: this.options.GISComponents.historyTrack,
      },
    );
    this.components.disasterJudgeNewTeam = disasterJudgeNewTeamComp;
    // 物资保障
    const disasterJudgeNewRepertoryComp = new components.DisasterJudgeNewRepertoryComponent(
      {
        map: this.options.map,
        service: installDisasterJudgeServer.repositoryServer,
        GISComponents: this.options.GISComponents,
        symbolConfig: this.options.symbolConfig,
        eventInfo: this.options.eventInfo,
        nearbyQuery: this.options.GISComponents.nearbyQuery,
        eventDispatcher: this.options.GISComponents.eventDispatcher,
        routerPlan: this.options.GISComponents.routerPlan,
      },
    );
    this.components.disasterJudgeNewRepertory = disasterJudgeNewRepertoryComp;
    // 防汛监测预警
    const disasterJudgeEarlyWarningComp = new components.DisasterJudgeEarlyWarningComponent(
      {
        map: this.options.map,
        service: earlyWarningServer,
        GISComponents: this.options.GISComponents,
        symbolConfig: this.options.symbolConfig,
        eventInfo: this.options.eventInfo,
        nearbyQuery: this.options.GISComponents.nearbyQuery,
        eventDispatcher: this.options.GISComponents.eventDispatcher,
        routerPlan: this.options.GISComponents.routerPlan,
      },
    );
    this.components.disasterJudgeEarlyWarning = disasterJudgeEarlyWarningComp;
    // 历史地震
    const disasterJudgeAirTeamComp = new components.DisasterJudgeAirTeamComponent(
      {
        map: this.options.map,
        eventInfo: this.options.eventInfo,
        mapConfig: this.options.mapConfig,
        symbolConfig: this.options.symbolConfig,
        GISComponents: this.options.GISComponents,
        service: airStationServer,
        PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
        // simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
        // popupManager: this.options.GISComponents.popupManager,
        // featureLocate: this.options.GISComponents.featureLocate,
        // featureHighlight: this.options.GISComponents.featureHighlight,
      },
    );
    this.components.disasterJudgeAirTeam = disasterJudgeAirTeamComp;
    // 船舶
    const disasterJudgeShipComp = new components.DisasterJudgeShipComponent({
      map: this.options.map,
      service: installDisasterJudgeServer.hazServerShip,
      GISComponents: this.options.GISComponents,
      symbolConfig: this.options.symbolConfig,
      eventInfo: this.options.eventInfo,
      nearbyQuery: this.options.GISComponents.nearbyQuery,
    });
    this.components.disasterJudgeShip = disasterJudgeShipComp;
    // 指挥调度
    const commandDispatch: any = new components.CommandDispatch({
      map: this.options.map,
      service: communicationServer,
      symbolConfig: this.options.symbolConfig,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      eventDispatcher: this.options.GISComponents.eventDispatcher,
    });
    this.components.commandDispatch = commandDispatch;
    // 前突队伍实时刷新
    const disasterJudgeRealTimeTeamComp = new components.DisasterJudgeRealTimeTeamComponent(
      {
        map: this.options.map,
        service: installDisasterJudgeServer.hazServerShip,
        GISComponents: this.options.GISComponents,
        symbolConfig: this.options.symbolConfig,
        eventInfo: this.options.eventInfo,
        nearbyQuery: this.options.GISComponents.nearbyQuery,
      },
    );
    this.components.disasterJudgeRealTimeTeam = disasterJudgeRealTimeTeamComp;
    // 防汛专题-力量调度
    const teamDispatchComponent = new components.TeamDispatchComponent({
      map: this.options.map,
      service: installDisasterJudgeServer.rescueTeamServer,
      GISComponents: this.options.GISComponents,
      symbolConfig: this.options.symbolConfig,
      eventInfo: this.options.eventInfo,
      nearbyQuery: this.options.GISComponents.nearbyQuery,
      eventDispatcher: this.options.GISComponents.eventDispatcher,
      routerPlan: this.options.GISComponents.routerPlan,
      historyTrack: this.options.GISComponents.historyTrack,
      simpleRouter: simpleRouterComponent,
    });
    this.components.teamDispatch = teamDispatchComponent;
    // 综合研判-行政区划选择
    const regionSelectionComponent = new components.RegionSelectionComponent({
      map: this.options.map,
      service: regionSelectionServer,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      district: publishObjectPath.value.district,
    });
    this.components.regionSelection = regionSelectionComponent;
    const EquipComp = new components.EquipComponent({
      map: this.options.map,
      eventInfo: this.options.eventInfo,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      GISComponents: this.options.GISComponents,
      service: dataSourcesServer,
      serviceTeam: installDisasterJudgeServer.rescueTeamServer,
      PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
    });
    this.components.EquipComp = EquipComp;
  }
}
