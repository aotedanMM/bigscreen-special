import BaseModule from '../BaseModule';
import commonComponents from './index';
import AccidentsServer from '@/api/feature/disasterJudge/AccidentsServer';
import publishObjectPath from '@/util/configRegistry';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import {
    warningInfoServer,
    managementOnDutyServer,
    weatherServer,
    multiuleInterfaceServer,
    normalResourceServer,
} from '@/api/installServer';
import { commonDistrictServer, historyEarthQuakeServer } from '@/api/feature/normal/installNormalServer';

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
        // 事件定位
        const newsEventLocateComponnet = new components.NewsEventLocateComponnet({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            symbolConfig: this.options.symbolConfig,
            popupManager: this.options.GISComponents.popupManager,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
        });
        this.components.newsEventLocate = newsEventLocateComponnet;


        // 常态右侧事件树
        const queryAndShowAccidentComponent = new components.QueryAndShowAccident({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            service: installDisasterJudgeServer.accidentsServer,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            popupManager: this.options.GISComponents.popupManager,
            featureLocate: this.options.GISComponents.featureLocate,
            featureHighlight: this.options.GISComponents.featureHighlight,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
        });
        this.components.queryAndShowAccident = queryAndShowAccidentComponent;

        // 历史地震
        const historyEarthQuakeComp = new components.historyEarthQuakeComponent({
            map: this.options.map,
            mapConfig: this.options.mapConfig,
            symbolConfig: this.options.symbolConfig,
            GISComponents: this.options.GISComponents,
            service: historyEarthQuakeServer,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            // simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            // popupManager: this.options.GISComponents.popupManager,
            // featureLocate: this.options.GISComponents.featureLocate,
            // featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.historyEarthQuake = historyEarthQuakeComp;

        const eventWarnInforComponent = new components.EventWarnInforComponent({
            map: this.options.map,
            mapConfig: this.options.mapConfig,
            symbolConfig: this.options.symbolConfig,
            GISComponents: this.options.GISComponents,
            service: warningInfoServer,
            commonDistrictServer,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            // simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            // popupManager: this.options.GISComponents.popupManager,
            // featureLocate: this.options.GISComponents.featureLocate,
            // featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.eventWarnInfor = eventWarnInforComponent;

        // 应急资源
        const ResourceComponent = new components.ResourceComponent({
            map: this.options.map,
            service: normalResourceServer,
            GISComponents: this.options.GISComponents,
            symbolConfig: this.options.symbolConfig,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            nearbyQuery: this.options.GISComponents.nearbyQuery,
            nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
        });
        this.components.ResourceComponent = ResourceComponent;

        // 应急资源 基于mongo的查询
        const NewResourceComponent = new components.NewResourceComponent({
            map: this.options.map,
            service: multiuleInterfaceServer,
            GISComponents: this.options.GISComponents,
            symbolConfig: this.options.symbolConfig,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            nearbyQuery: this.options.GISComponents.nearbyQuery,
            publishObjectPath: installDisasterJudgeServer.publishObjectPath,
            nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
            eventDispatcher: this.options.GISComponents.eventDispatcher,
            comname: 'NewResourceComponent',
            eventInfo: this.options.eventInfo,
            mapConfig: this.options.mapConfig,
            routerPlan: this.options.GISComponents.routerPlan,
            historyTrack: this.options.GISComponents.historyTrack,
            featureLocate: this.options.GISComponents.featureLocate,
        });
        this.components.NewResourceComponent = NewResourceComponent;
        // 应急资源 基于pg的查询（左侧）
        // tslint:disable-next-line:variable-name
        const NewResourceComponent_left = new components.NewResourceComponent_left({
            map: this.options.map,
            service: multiuleInterfaceServer,
            GISComponents: this.options.GISComponents,
            symbolConfig: this.options.symbolConfig,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            nearbyQuery: this.options.GISComponents.nearbyQuery,
            publishObjectPath: installDisasterJudgeServer.publishObjectPath,
            nearbyVideoLayer: this.options.GISComponents.nearbyVideoLayer,
            eventDispatcher: this.options.GISComponents.eventDispatcher,
            comname: 'NewResourceComponent_left',
            eventInfo: this.options.eventInfo,
            mapConfig: this.options.mapConfig,
            routerPlan: this.options.GISComponents.routerPlan,
            historyTrack: this.options.GISComponents.historyTrack,
            featureLocate: this.options.GISComponents.featureLocate,
        });
        this.components.NewResourceComponent_left = NewResourceComponent_left;
        // 火点
        const firepointinforemationComponent = new components.firepointinforemationComponent({
            map: this.options.map,
            service: normalResourceServer,
            GISComponents: this.options.GISComponents,
            symbolConfig: this.options.symbolConfig,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            nearbyQuery: this.options.GISComponents.nearbyQuery,
        });
        this.components.firepointinforemationComponent = firepointinforemationComponent;
        // 防汛专题区域选择工具
        const floodSelectionComp: any = new components.FloodSelectionComponent({
            map: this.options.map,
            featureLocate: this.options.GISComponents.featureLocate,
            featureHighlight: this.options.GISComponents.featureHighlight,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
        });
        this.components.floodSelection = floodSelectionComp;
    }
}
