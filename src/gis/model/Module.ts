/*
 * @Descripttion:
 * @Date: 2020-05-11 09:38:45
 * @LastEditors: tande
 * @LastEditTime: 2020-05-11 11:43:28
 */
import BaseModule from '../BaseModule';
import commonComponents from './index';
import publishObjectPath from '@/util/configRegistry';
import {
  floodRiskServer, gsemergencyServer,
} from '@/api/feature/model/installServer';
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
    // 洪水灾害
    const FloodModel = new components.FloodModel({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: { floodRiskServer },
      serviceConfig: publishObjectPath.value,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
    });
    this.components.FloodModel = FloodModel;
    // 风险评估
    const RiskModel = new components.RiskModel({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: { floodRiskServer },
      serviceConfig: publishObjectPath.value,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
    });
    this.components.RiskModel = RiskModel;
    // 山洪预警
    const mountainFlood = new components.MountainFlood({
      map: this.options.map,
      mapConfig: this.options.mapConfig,
      symbolConfig: this.options.symbolConfig,
      service: gsemergencyServer ,
      eventInfo: this.options.eventInfo,
      GISComponents: this.options.GISComponents,
      simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
      popupManager: this.options.GISComponents.popupManager,
      featureLocate: this.options.GISComponents.featureLocate,
      featureHighlight: this.options.GISComponents.featureHighlight,
    });
    this.components.mountainFlood = mountainFlood;
  }
}
