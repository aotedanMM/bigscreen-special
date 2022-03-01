/*
 * @Descripttion:
 * @Date: 2020-05-11 09:38:45
 * @LastEditors: tande
 * @LastEditTime: 2020-05-11 11:43:28
 */
import BaseModule from '../BaseModule';
import commonComponents from './index';
import publishObjectPath from '@/util/configRegistry';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
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
    const spreadAnalysisComponent = new components.SpreadAnalysisComponent(
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
        egis: publishObjectPath.value.egis,
      },
    );
    this.components.spreadAnalysis = spreadAnalysisComponent;
  }
}
