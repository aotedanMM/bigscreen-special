/*
 * @Descripttion:
 * @Date: 2020-05-04 22:39:06
 * @LastEditors: tande
 * @LastEditTime: 2020-05-06 14:21:39
 */
import BaseModule from '../BaseModule';
import commonComponents from './index';
import { regionSelectionServer, warningInfoServer } from '@/api/installServer';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer';
import {
  windSituationServer,
  rainSituationServer,
  waterSituationServer,
  engineeringSituationServer,
  videoSituationServer,
  onlineTerminalServer,
} from '@/api/feature/monitorwarning/installServer';
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
        // 风情雨情水情工情
        const WindWaterRainWork = new components.WindWaterRainWork({
            map: this.options.map,
            mapConfig: this.options.mapConfig,
            symbolConfig: this.options.symbolConfig,
            service: {regionSelectionServer, windSituationServer, rainSituationServer, waterSituationServer, engineeringSituationServer},
            eventInfo: this.options.eventInfo,
            GISComponents: this.options.GISComponents,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            popupManager: this.options.GISComponents.popupManager,
            featureLocate: this.options.GISComponents.featureLocate,
            featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.WindWaterRainWork = WindWaterRainWork;
        // 气象监测
        const weatherWarning = new components.WeatherWarning({
        map: this.options.map,
        mapConfig: this.options.mapConfig,
        symbolConfig: this.options.symbolConfig,
        service: warningInfoServer,
        weatherInfo: this.options.eventInfo,
        GISComponents: this.options.GISComponents,
        simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
        popupManager: this.options.GISComponents.popupManager,
        featureLocate: this.options.GISComponents.featureLocate,
        });
        this.components.weatherWarning = weatherWarning;
        // 风情雨情水情 首页
        const WindWaterRainWorkLayer = new components.WindWaterRainWorkLayer({
          map: this.options.map,
          mapConfig: this.options.mapConfig,
          symbolConfig: this.options.symbolConfig,
          service: {regionSelectionServer, windSituationServer, rainSituationServer, waterSituationServer, engineeringSituationServer},
          eventInfo: this.options.eventInfo,
          GISComponents: this.options.GISComponents,
          simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
          popupManager: this.options.GISComponents.popupManager,
          featureLocate: this.options.GISComponents.featureLocate,
          featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.WindWaterRainWorkLayer = WindWaterRainWorkLayer;
        // 视频监控图层
        const videoLayer = new components.VideoLayer({
          map: this.options.map,
          mapConfig: this.options.mapConfig,
          symbolConfig: this.options.symbolConfig,
          service: videoSituationServer,
          eventInfo: this.options.eventInfo,
          GISComponents: this.options.GISComponents,
          bufferDraw: this.options.GISComponents.bufferDraw,
          simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
          popupManager: this.options.GISComponents.popupManager,
          featureLocate: this.options.GISComponents.featureLocate,
          featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.videoLayer = videoLayer;
        // 在线终端组件
        const terminalLayer = new components.TerminalLayer({
          map: this.options.map,
          mapConfig: this.options.mapConfig,
          symbolConfig: this.options.symbolConfig,
          eventInfo: this.options.eventInfo,
          service: onlineTerminalServer,
          GISComponents: this.options.GISComponents,
          simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
          popupManager: this.options.GISComponents.popupManager,
          featureLocate: this.options.GISComponents.featureLocate,
          featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.terminalLayer = terminalLayer;
        // 火灾蔓延分析模型
        const ForestFireComponent = new components.ForestFireComponent({
          map: this.options.map,
          mapConfig: this.options.mapConfig,
          symbolConfig: this.options.symbolConfig,
          // simpleRenderMgr: this.options.basicComponents.simpleRenderMgr,
          // PointGeometryBuilder: this.options.basicComponents.PointGeometryBuilder,
          service: resourceanalysisServer,
          eventInfo: this.options.eventInfo,
          GISComponents: this.options.GISComponents,
          bufferDraw: this.options.GISComponents.bufferDraw,
          simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
          popupManager: this.options.GISComponents.popupManager,
          featureLocate: this.options.GISComponents.featureLocate,
          featureHighlight: this.options.GISComponents.featureHighlight,
          // service: searchServer,
          serviceConfig: this.options.serviceConfig,
        });
        this.components.forestFireComponent = ForestFireComponent;
        const firePointComponent = new components.FirePoint({
          map: this.options.map,
          mapConfig: this.options.mapConfig,
          symbolConfig: this.options.symbolConfig,
          // simpleRenderMgr: this.options.basicComponents.simpleRenderMgr,
          // PointGeometryBuilder: this.options.basicComponents.PointGeometryBuilder,
          service: resourceanalysisServer,
          eventInfo: this.options.eventInfo,
          GISComponents: this.options.GISComponents,
          bufferDraw: this.options.GISComponents.bufferDraw,
          simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
          popupManager: this.options.GISComponents.popupManager,
          featureLocate: this.options.GISComponents.featureLocate,
          featureHighlight: this.options.GISComponents.featureHighlight,
          // service: searchServer,
          serviceConfig: this.options.serviceConfig,
        });
        this.components.ResourceQuery = firePointComponent;
  }
}
