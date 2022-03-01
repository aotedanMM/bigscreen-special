import BaseModule from '../BaseModule';
import RescueHelpComponents from './index';
import commonComponents from '../common/index';
import publishObjectPath from '@/util/configRegistry';
import { rescueTeamServer, rescueSuppliesServer, rescueSituationServer} from '@/api/installServer';
import {rescueAssistanceServer} from '@/api/feature/RescueAssistance/installRescueAssistanceServer' ;
import disasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

export default class Module extends BaseModule {


    constructor(opts: any) {
        super(opts);
        this.componentClazzes = RescueHelpComponents;
    }
    /**
     * 创建组件
     * @param opts {Object}
     */
    public createComponents(opts: any) {
        const components: any = RescueHelpComponents;
        const GISComponents: any = this.options.GISComponents;
        // 路径规划
        const simpleRouterComponent = new commonComponents.SimpleRouterPlanComponent({
            map: this.options.map,
            server: publishObjectPath.value.egis,
        });
        simpleRouterComponent.load();
        // 救援队伍
        const rescueTeamInforComponent = new components.RescueTeamInforComponent({
            map: this.options.map,
            mapConfig: this.options.mapConfig,
            symbolConfig: this.options.symbolConfig,
            GISComponents: this.options.GISComponents,
            rescueTeamServer,
            rescueSuppliesServer,
        });
        this.components.rescueTeamInfo = rescueTeamInforComponent;
        // 救援需求
        const rescueNeedComp = new components.RescueNeedComponent({
            map: this.options.map,
            rescueNeedServer: rescueAssistanceServer,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            featureHighlight: GISComponents.featureHighlight,
            featureLocate: GISComponents.featureLocate,
            popupManager: GISComponents.popupManager,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
            simpleRouter: simpleRouterComponent,
        });
        this.components.rescueNeed = rescueNeedComp;
         // 调度态势
        const rescueSituationComp = new components.RescueSituationComponent({
            map: this.options.map,
            rescueServer: rescueSituationServer,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            featureHighlight: GISComponents.featureHighlight,
            featureLocate: GISComponents.featureLocate,
            popupManager: GISComponents.popupManager,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
            simpleRouter: simpleRouterComponent,
        });
        this.components.rescueSituation = rescueSituationComp;
        // 调度部署
        const teamDispatchComp = new components.TeamDispatchComponent({
            map: this.options.map,
            service: rescueTeamServer,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
            simpleRouter: simpleRouterComponent,
            featureHighlight: GISComponents.featureHighlight,
            featureLocate: GISComponents.featureLocate,
            popupManager: GISComponents.popupManager,
            egisServer: publishObjectPath.value.egis,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
        });
        this.components.teamDispatch = teamDispatchComp;
        // 调派建议
        const teamDispatchAdviceComp = new components.TeamDispatchAdviceComponent({
            map: this.options.map,
            service: rescueTeamServer,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            popupManager: GISComponents.popupManager,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            pointGeometryBuilder: GISComponents.PointGeometryBuilder,
            simpleRouter: simpleRouterComponent,
        });
        this.components.teamDispatchAdvice = teamDispatchAdviceComp;
        // 人员安置
        const peopleArrangementComp = new components.PeopleArrangementComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
            service: disasterJudgeServer.districtServer,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            popupManager: GISComponents.popupManager,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
        });
        this.components.peopleArrangement = peopleArrangementComp;
    }
}
