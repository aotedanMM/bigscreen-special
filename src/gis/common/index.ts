// 所有GIS 逻辑类

import GISToolComponent from './tool/GISToolComponent';
import CommonnteractComponent from './interact/CommonnteractComponent';
import LocateComponent from './event/locate/LocateComponent';
import ResourceOnMap from './resourceOnMap/resourceOnMapComponents';
import DrawEventPolygonComponent from './event/drawEventPolygon/DrawEventPolygonComponent';
import InfluenceComponent from './event/influence/InfluenceComponent';
import NearQueryComponent from './nearby/NearQueryComponent';
import ResourceAnalysisCmponent from './resourceanalysis/ResourceAnalysisCmponent';
import ListClickCmponent from './listClick/ListClickCmponent';
import Map3D from './map3d/Map3D';
import WeatherComponent from './weather/WeatherComponent';
import SearchComponent from './query/search/SearchComponent';
import TrafficStatusCmponent from './traffic/TrafficStatusCmponent';
import AfterShockComponent from './afterShock/AfterShockComponent';
import RouterPlanComponent from './routeplan/RouterPlanComponent';
import SimpleRouterPlanComponent from './routeplan/SimpleRouterPlanComponent';
import FireCarHistoryCmponent from './query/resources/FireCarHistory/FireCarHistoryCmponent';
import HistoryTrackComponent from './histroyTrack/HistoryTrackComponent';
import LatestImageComponent from './latestimage/LatestImageComponent';
import QueryResourceComponent from './query/resources/QueryResourceComponent';
import QueryHouseComponent from './query/resources/QueryHouseComponent';
import PopHeatComponent from './popheat/PopHeatCompnent';
import MapPrintComponent from './mapPrint/MapPrintComponent';
import SatilliteCloudComponent from './satilliteCloud/SatilliteCloudComponent';
import MapserviceInComponent from './mapserviceIn/MapserviceInComponent';
import RainForecastComponent from './rainForecast/RainForecastComponent';
import RegionSelectionComponent from './regionSelection/RegionSelectionComponent';
import BufferDrawComponent from './bufferDraw/BufferDrawComponent';
import LayerManagerComponent from './layermanager/LayerManagerComponent';
import TyphoonComponent from './typhoon/TyphoonComponent';
import DistrictHome from './districtHome/DistrictHome';
import NearbyVideoLayer from './nearby/nearbyVideoLayer';
import importantRiverAndStations from './importantRiverAndStations/RiverAndStations';
import RiskAnalysisComponent from './riskAnalysis/RiskAnalysisComponent';
import ChemicalleakComponent from './riskAnalysis/chemicalleakComponent';
import EarthQuakeIntensity from './riskAnalysis/earthQuakeIntensityComponnets';
import baseMap from './baseMap/baseMap';
export default {
    // GIS常用工具组件
    GISToolComponent,
    // 统一交互处理
    CommonnteractComponent,
    // 事件定位
    LocateComponent,
    // 面状事件绘制
    DrawEventPolygonComponent,
    // 地震影响范围
    InfluenceComponent,
    // 周边查询
    NearQueryComponent,
    // 资源分析
    ResourceAnalysisCmponent,
    //  三维地图
    Map3D,
    // 列表点击组件
    ListClickCmponent,
    // 当地天气
    WeatherComponent,
    // 搜索,缓冲区、行政区划
    SearchComponent,
    // 交通情况
    TrafficStatusCmponent,
    // 余震
    AfterShockComponent,
    // 路径规划
    RouterPlanComponent,
    // 简单路径规划
    SimpleRouterPlanComponent,
    // 实时车辆
    FireCarHistoryCmponent,
    // 最新影像
    LatestImageComponent,
    // 资源搜索
    QueryResourceComponent,
    // 房屋
    QueryHouseComponent,
    // 人口热力
    PopHeatComponent,
    // 地图打印
    MapPrintComponent,
    // 历史轨迹
    HistoryTrackComponent,
    // 卫星云图
    SatilliteCloudComponent,
    // 服务接入
    MapserviceInComponent,
    // 降雨预报
    RainForecastComponent,
    // 区域选择
    RegionSelectionComponent,
    // 缓冲区绘制
    BufferDrawComponent,
    // 图层管理
    LayerManagerComponent,
    // 台风
    TyphoonComponent,
    // 系统首页默认行政区划
    DistrictHome,
    // 周边视频分析组件
    NearbyVideoLayer,
    // 重点河流和监测站点
    importantRiverAndStations,
    // 储罐模型
    RiskAnalysisComponent,
    ChemicalleakComponent,
    EarthQuakeIntensity,
    ResourceOnMap,
    baseMap,
};
