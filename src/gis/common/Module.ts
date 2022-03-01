import BaseModule from '../BaseModule';
import commonComponents from './index';
import Map3D from './map3d/Map3D';
import VerticalMeasure from './map3d/VerticalMeasure';
import SlopeMeasure from './map3d/SlopeMeasure';
import AreaLengthMeasure from './map3d/AreaLengthMeasure';
import publishObjectPath from '@/util/configRegistry';
import { dizhenServer, districtServer, warningInfoServer, normalResourceServer, disasterJudgeServer, locationServer, multiuleInterfaceServer } from '@/api/installServer';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer';
import { regionSelectionServer, tokenServer } from '@/api/installServer';
import { videoSituationServer } from '@/api/feature/monitorwarning/installServer';
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
        const GISComponents: any = this.options.GISComponents;
        // GIS 工具-默认加载
        const gisToolComp = new components.GISToolComponent({
            map: this.options.map,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            config: publishObjectPath.value,
            eventInfo: this.options.eventInfo,
            eventDispatcher: this.options.GISComponents.eventDispatcher,
        });
        this.components.gisToolComp = gisToolComp;
        // 统一交互处理 默认加载
        const commonInteractComp = new components.CommonnteractComponent({
            map: this.options.map,
            popupManager: GISComponents.popupManager,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            eventInfo: this.options.eventInfo,
            symbolConfig: this.options.symbolConfig,
            eventDispatcher: this.options.GISComponents.eventDispatcher,
        });
        this.components.commonInteract = commonInteractComp;
        // 资源分析
        const resourceAnalysisComp = new components.ResourceAnalysisCmponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            PointGeometryBuilder: this.options.GISComponents.PointGeometryBuilder,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            popupManager: GISComponents.popupManager,
            eventInfo: this.options.eventInfo,
        });
        this.components.resourceAnalysis = resourceAnalysisComp;
        //  周边查询
        const nearQueryComp = new components.NearQueryComponent({
            map: this.options.map,
            service: resourceanalysisServer,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            bufferDraw: GISComponents.bufferDraw,
            popupManager: GISComponents.popupManager,
            featureHighlight: GISComponents.featureHighlight,
            featureLocate: GISComponents.featureLocate,
            PointGeometryBuilder: GISComponents.PointGeometryBuilder,
            symbolConfig: this.options.symbolConfig,
            eventInfo: this.options.eventInfo,
        });
        this.components.nearQuery = nearQueryComp;
        // 事件定位
        const locateComp = new components.LocateComponent({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            eventInfo: this.options.eventInfo,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            popupManager: GISComponents.popupManager,
            symbolConfig: this.options.symbolConfig,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
        });
        this.components.locateComp = locateComp;
        // 点位上图
        const resourceOnMap = new components.ResourceOnMap({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            eventInfo: this.options.eventInfo,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            popupManager: GISComponents.popupManager,
            symbolConfig: this.options.symbolConfig,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
        });
        this.components.resourceOnMap = resourceOnMap;
        // 影响圈
        const influenceComp = new components.InfluenceComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            service: dizhenServer,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            featureLocate: this.options.GISComponents.featureLocate,
            popupManager: this.options.GISComponents.popupManager,
            eventInfo: this.options.eventInfo,
        });
        this.components.influence = influenceComp;
        // 多边形事件绘制
        const drawEventPolygonComp = new components.DrawEventPolygonComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            featureLocate: this.options.GISComponents.featureLocate,
            eventInfo: this.options.eventInfo,
        });
        this.components.drawEventPolygon = drawEventPolygonComp;
        // 地形地貌三维地图
        const mapConfig: any = Object.assign({}, this.options.mapConfig);
        mapConfig.terrainLayer3d = publishObjectPath.value.mapservice.terrainLayer3d;
        const map3d = new Map3D({
            map: this.options.map,
            mapConfig,
            symbolConfig: this.options.symbolConfig,
            mapId: 'map3d',
            eventInfo: this.options.eventInfo,
        });
        this.components.map3d = map3d;
        // 高差测量
        const verticalMeasure = new VerticalMeasure({
            map: this.options.map,
        });
        this.components.verticalMeasure = verticalMeasure;
        // 坡度测量
        const slopeMeasure = new SlopeMeasure({
            map: this.options.map,
        });
        this.components.slopeMeasure = slopeMeasure;
        // 面积和距离测量
        const areaLengthMeasure = new AreaLengthMeasure({
            map: this.options.map,
        });
        this.components.areaLengthMeasure = areaLengthMeasure;
        // 列表点击组件 -- 对应物资列表点击
        const listClickComp = new components.ListClickCmponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            popupManager: GISComponents.popupManager,
            eventInfo: this.options.eventInfo,
        });
        this.components.listClick = listClickComp;
        // 当地天气
        const weatherComp = new components.WeatherComponent({
            map: this.options.map,
            eventInfo: this.options.eventInfo,
            symbolConfig: this.options.symbolConfig,
            popupManager: GISComponents.popupManager,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            service: installDisasterJudgeServer.weatherServer,
        });
        this.components.Weather = weatherComp;
        // 搜索
        const searchComponent = new components.SearchComponent({
            map: this.options.map,
            filterInfo: this.options.filterInfo,
            symbolConfig: this.options.symbolConfig,
            server: normalResourceServer,
            publishObjectPath,
            featureHighlight: GISComponents.featureHighlight,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            popupManager: GISComponents.popupManager,
            featureLocate: GISComponents.featureLocate,
            nearbyQuery: nearQueryComp,
            districtServer,
            normalResourceServer, // server
        });
        this.components.search = searchComponent;
        // 交通情况
        const trafficStatusCmponent = new components.TrafficStatusCmponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            featureLocate: GISComponents.featureLocate,
            popupManager: GISComponents.popupManager,
        });
        this.components.trafficStatus = trafficStatusCmponent;
        // 余震
        const afterShockComponent = new components.AfterShockComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            popupManager: GISComponents.popupManager,
        });
        this.components.afterShock = afterShockComponent;

        // 路径规划
        const routerPlanComp: any = new components.RouterPlanComponent({
            map: this.options.map,
            locationService: locationServer,
            featureLocate: GISComponents.featureLocate,
            symbolConfig: this.options.symbolConfig,
            egis: publishObjectPath.value.egis,
        });
        this.components.routerPlan = routerPlanComp;

        // 实时车辆
        const fireCarHistoryCmp: any = new components.FireCarHistoryCmponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            featureLocate: GISComponents.featureLocate,
            popupManager: GISComponents.popupManager,
            featureHighlight: GISComponents.featureHighlight,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
        });
        this.components.fireCarHistory = fireCarHistoryCmp;

        // 历史轨迹
        const historyTrackComp: any = new components.HistoryTrackComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            featureLocate: GISComponents.featureLocate,
            popupManager: GISComponents.popupManager,
            featureHighlight: GISComponents.featureHighlight,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            eventDispatcher: this.options.GISComponents.eventDispatcher,
        });
        this.components.historyTrack = historyTrackComp;

        // 卫星云图
        const satilliteCloudCmp: any = new components.SatilliteCloudComponent({
            map: this.options.map,
            publishObjectPath,
        });
        this.components.satilliteCloud = satilliteCloudCmp;
        // debugger
        // 地方基础底图服务
        const baseMap: any = new components.baseMap({
            map: this.options.map,
            publishObjectPath,
            mapConfig: this.options.mapConfig,
            service: tokenServer,
            serviceConfig: publishObjectPath.value,
        });
        this.components.baseMap = baseMap;

        // 服务接入
        const mapserviceInCmp: any = new components.MapserviceInComponent({
            map: this.options.map,
            serviceConfig: publishObjectPath.value,
            featureLocate: GISComponents.featureLocate,
            featureHighlight: GISComponents.featureHighlight,
            popupManager: GISComponents.popupManager,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            eventInfo: this.options.eventInfo,
            service: installDisasterJudgeServer.districtServer,
        });
        this.components.mapserviceIn = mapserviceInCmp;

        // 降雨预报
        const rainForecastCmp: any = new components.RainForecastComponent({
            map: this.options.map,
            publishObjectPath,
        });
        this.components.rainForecast = rainForecastCmp;

        // 最新影像
        const latestImageComp: any = new components.LatestImageComponent({
            map: this.options.map,
            service: installDisasterJudgeServer.latestImage,
            wmsUrl: publishObjectPath.value.lastedImageServer,
            featureLocate: GISComponents.featureLocate,
            eventInfo: this.options.eventInfo,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            popupManager: this.options.GISComponents.popupManager,
        });
        this.components.latestImage = latestImageComp;

        // 人口热力
        const popHeatComponent: any = new components.PopHeatComponent({
            map: this.options.map,
            service: multiuleInterfaceServer,
            simpleRenderMgr: GISComponents.simpleRenderMgr,
            symbolConfig: this.options.symbolConfig,
            featureLocate: GISComponents.featureLocate,
        });
        this.components.popHeatComponent = popHeatComponent;
        // 缓冲绘制
        const bufferDrawComp: any = new components.BufferDrawComponent({
            map: this.options.map,
            bufferDraw: this.options.GISComponents.bufferDraw,
            featureLocate: this.options.GISComponents.featureLocate,
        });
        this.components.bufferDraw = bufferDrawComp;
        // 区域选择工具
        const regionSelectionComp: any = new components.RegionSelectionComponent({
            map: this.options.map,
            service: regionSelectionServer,
            featureLocate: this.options.GISComponents.featureLocate,
            featureHighlight: this.options.GISComponents.featureHighlight,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            district: publishObjectPath.value.district,
        });
        this.components.regionSelection = regionSelectionComp;
        // 资源搜索
        const queryResourceComp: any = this.createQueryResourceComp(components, fireCarHistoryCmp, popHeatComponent, nearQueryComp);
        this.components.queryResource = queryResourceComp;
        // 地图打印
        const mapPrintComp: any = new components.MapPrintComponent({
            map: this.options.map,
            serverUrl: publishObjectPath.value.mapPrint,
        });
        this.components.mapPrint = mapPrintComp;

        // 图层管理
        const layerManagerComponent = new components.LayerManagerComponent({
            map: this.options.map,
            layerManager: this.options.GISComponents.layerManager,
        });
        // 图层管理
        this.components.layerManager = layerManagerComponent;
        // 台风信息
        const typhoonServerConf = publishObjectPath.value.typhoonServer;
        typhoonServerConf.httpRequest = new G.base.HttpRequest();
        const typhoonServer = new G.service.TyphoonServiceImpl(typhoonServerConf);
        const typhoonComp: any = new components.TyphoonComponent({
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            featureHighlight: this.options.GISComponents.featureHighlight,
            service: typhoonServer,
        });
        this.components.typhoon = typhoonComp;
        // 系统默认行政区划
        const DistrictHome: any = new components.DistrictHome({
            map: this.options.map,
            service: installDisasterJudgeServer.districtServer,
            featureLocate: this.options.GISComponents.featureLocate,
            symbolConfig: this.options.symbolConfig,
            serviceConfig: publishObjectPath.value,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            district: publishObjectPath.value.district,
        });
        this.components.districtHome = DistrictHome;
        // 周边视频监控图层
        const nearbyVideoLayer = new components.NearbyVideoLayer({
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
        this.components.nearbyVideoLayer = nearbyVideoLayer;
        // 重点河流和监测站点
        const importantRiverAndStations: any = new components.importantRiverAndStations({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
        });
        this.components.importantRiverAndStations = importantRiverAndStations;
        // 风险分析
        const riskAnalysisComponent = new components.RiskAnalysisComponent({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            symbolConfig: this.options.symbolConfig,
            popupManager: this.options.GISComponents.popupManager,
            featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.riskAnalysis = riskAnalysisComponent;
        // 危化品泄露
        const chemicalleakComponent = new components.ChemicalleakComponent({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            symbolConfig: this.options.symbolConfig,
            popupManager: this.options.GISComponents.popupManager,
            featureHighlight: this.options.GISComponents.featureHighlight,
        });
        this.components.chemicalleak = chemicalleakComponent;
        // 地震烈度
        const earthQuakeIntensity = new components.EarthQuakeIntensity({
            map: this.options.map,
            GISComponents: this.options.GISComponents,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            symbolConfig: this.options.symbolConfig,
            popupManager: this.options.GISComponents.popupManager,
            featureHighlight: this.options.GISComponents.featureHighlight,
            egis: publishObjectPath.value.egis,
        });
        this.components.earthQuakeIntensity = earthQuakeIntensity;
    }

    public createQueryResourceComp(components: any, fireCarHistoryCmponent: any, popHeatComponent: any, nearbyQuer: any) {
        // 房屋
        const queryHouseComponent = new components.QueryHouseComponent({
            districtServer,
            map: this.options.map,
            symbolConfig: this.options.symbolConfig,
            buildingServer: installSearchReosurce.buildingServer,
            featureLocate: this.options.GISComponents.featureLocate,
            popupManager: this.options.GISComponents.popupManager,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
        });

        const queryResourceComp: any = new components.QueryResourceComponent({
            map: this.options.map, // 地图
            symbolConfig: this.options.symbolConfig, // 符号配置
            fireCarHistoryCmponent, // 车辆组件
            queryHouseComponent, // 房屋组件
            popHeatComponent, // 人口热力组件
            normalResourceServer, // server
            resourceanalysisServer, // server
            warningInfoServer, // server
            districtServer,
            simpleRenderMgr: this.options.GISComponents.simpleRenderMgr,
            featureLocate: this.options.GISComponents.featureLocate,
            featureHighlight: this.options.GISComponents.featureHighlight,
            popupManager: this.options.GISComponents.popupManager,
            nearbyQuery: nearbyQuer,
        });
        return queryResourceComp;
    }
    // 共享组件
    public shareComponent(components: any) {
        // 挂在到通用功能
        components.nearbyQuery = this.components.nearQuery;
        components.nearbyVideoLayer = this.components.nearbyVideoLayer;
        components.routerPlan = this.components.routerPlan;
        components.historyTrack = this.components.historyTrack;
        // 默认叠加的行政区划
        components.districtHome = this.components.districtHome;
        components.mapserviceIn = this.components.mapserviceIn;
    }
    // 默认加载
    public loadDefault() {
        this.components.gisToolComp.load();
        this.components.commonInteract.load();
        // 三维默认初始化
        // this.components.map3d.load();
        // (window as any).map3d = this.components.map3d;
        // 默认加载系统行政区划
        this.components.districtHome.load();
    }
}
