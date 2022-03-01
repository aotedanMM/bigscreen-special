/*
 * @Descripttion:
 * @Date: 2020-05-11 09:38:45
 * @LastEditors: tande
 * @LastEditTime: 2020-05-11 11:43:28
 */
import BaseModule from '../BaseModule';
import commonComponents from './index';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import {
  resourceServer,
  riskServer,
  protectTargetServer,
  realtimeShipServer,
} from '@/api/feature/defensiveprepation/installServer';
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
    // 行政区划
    const defensiveDistrictComponent = new components.DefensiveDistrictComponent(
      {
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
        districtHome: this.options.GISComponents.districtHome,
      },
    );
    this.components.defensiveDistrictComponent = defensiveDistrictComponent;
    // 资源查询
    const ResourceQuery = new components.ResourceQuery({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: { resourceServer, riskServer, protectTargetServer },
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
    });
    this.components.ResourceQuery = ResourceQuery;

    // 防御准备--船舶、人员转移
    const PopulationShip = new components.PopulationShip({
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
      districtHome: this.options.GISComponents.districtHome,
    });

    this.components.PopulationShip = PopulationShip;
    // ais船舶
    const realtimeShipComponent = new components.RealtimeShip({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: realtimeShipServer,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
      PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
    });
    this.components.realtimeShip = realtimeShipComponent;
  }
}
