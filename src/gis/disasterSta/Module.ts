import BaseModule from '../BaseModule';
import commonComponents from './index';
import installDisasterStaServer from '@/api/feature/disasterSta/installDisasterStaServer';
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
        const disasterStaComponent = new components.DisasterStaComponent({
            map: this.options.map,
            districtServer: installDisasterStaServer.districtServer,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            featureHighlight: this.options.GISComponents.featureHighlight,
            featureLocate: this.options.GISComponents.featureLocate,
            popupManager: this.options.GISComponents.popupManager,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
            nearbyQuery: this.options.GISComponents.nearbyQuery,
        });
        this.components.disasterSta = disasterStaComponent;
        const typhoonDistrictsComp = new components.typhoonDistrictsComponent({
            map: this.options.map,
            service: installDisasterJudgeServer.districtServer,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            featureHighlight: this.options.GISComponents.featureHighlight,
            featureLocate: this.options.GISComponents.featureLocate,
            popupManager: this.options.GISComponents.popupManager,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
        });
        this.components.typhoonDistricts = typhoonDistrictsComp;
    }
}
