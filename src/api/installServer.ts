const publicPath = require('../config/index').jsonPath;
import publishObjectPath from '@/util/configRegistry';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =
    publishObjectPath.value && publishObjectPath.value.serverPath;

const videoServerPath = publishObjectPath.value && publishObjectPath.value.video;
const tokenPath = publishObjectPath.value && publishObjectPath.value.arcgisToken.url;
// 数据来源
const dataApiServer =
    publishObjectPath.value && publishObjectPath.value.serverPath;
// 传一线操作屏数据
const oneLineServer =
    publishObjectPath.value && publishObjectPath.value.socketRestUrl;
import { DizhenServer } from './feature/dizhenServer';
import { PathServer } from './feature/normal/path/PathServer';
import { EventInfoServer } from './feature/eventInfoServer';
import { LeftMenuServer } from '@/api/service/LeftMenuServer';
import { WarningInfoServer } from './feature/warningInfoServer';
import { WeatherServer } from './feature/weather/weatherServer';
import { NewWeatherServer } from './feature/weather/newWeatherServer';
import { RiverWaterSystemServe } from './feature/riverWaterSystem/riverWaterSystemServe';
import { DataSourcesServer } from './feature/disasterJudge/dataSourcesServer';
import { RiskHazardServerServer } from './feature/riskHazard/riskHazardServer';
import { DispatchTeamServer } from './feature/dispatchTeam/dispatchTeamServer';
import { GoodsNeedServer } from './feature/goodsNeed/GoodsNeedServer';
import { SeverelyAffectedAreaServer } from './feature/severelyAffectedAreaServer';
import injectFilter from '@/filter/RequireFilter';
import { ProgressSituationServer } from './feature/progressSituationServer';
import { MapServer } from './feature/mapServer';
import { StaticDataRequestServer } from './feature/staticDataRequestServer';
import { RescueTeamServerTeamout } from './feature/disasterJudge/RescueTeamServerTeamout';
import { GisToolServer } from '@/api/feature/gisMapTool/gisMapToolServer';
import { PictureServer } from '@/api/feature/pictureServer';
import { MultiuleInterfaceServer } from '@/api/feature/MultiuleInterfaceServer';
import { EventServer } from '@/api/feature/EventServer';
import { PlotServer } from './feature/plot/plotServer';
import { PlotNoSqlService } from './feature/plot/plotPgService';
import { DisasterJudgeServer } from './feature/disasterJudge/disasterJudgeServer';
import { HazServer } from './feature/disasterJudge/server/HazServer';
import { HazServerShip } from './feature/disasterJudge/server/HazServerShip';
import { NormalResourceServer } from './feature/normal/resourceServer';
import { KnownDisasterServer } from './feature/knownDisasterServer';
import { SuppliesAllocateServer } from './feature/suppliesAllocateServer';
import { LeaderInstructionServer } from './feature/leaderInstructionServer';
import { ManagementOnDutyServer } from './feature/managementOnDutyServer';
import { HistoricalEarthquakeServer } from './feature/historicalEarthquakeServer'; // 历史地震接口
import { AirStationServer } from './feature/airStationServer'; // 航空护林站接口
import { TreeDetailServerServer } from './feature/treeDetailServerServer';
import { PushDataRequestServe } from './feature/PushDataRequestServe'; // 根据事件id、组件位置id，请求推送的数据
import { DisposalAdviceServer } from './feature/disposalAdviceServer';
import { DistrictServer } from './feature/disasterJudge//DistrictServer';
import { BaseDataServer } from './feature/RiskResource//BaseDataServer';
import { DetailInfoServer } from './feature/RiskResource/DetailInfoServer';
import { EmerSourceServer } from './feature/RiskResource/EmerSourceServer';
import { RiskSourceServer } from './feature/RiskResource/RiskSourceServer';
import { RescueTeamServer } from './feature/disasterJudge/RescueTeamServer';
import { RescueTeamFakeServer } from './feature/disasterJudge/RescueTeamFakeServer';
import { RescueSuppliesServer } from './feature/disasterJudge/RescueSuppliesServer';
import { GeocodeServer } from './feature/GeocodeServer';
import { ESSearchServer } from './feature/ESSearchServer';
import { DisasterRightEcahrs } from './feature/disasterJudge/disasterRightEcahrs';
import { NomalLeftServer } from './feature/normal/normalLeft';
import { CommunicationServer } from './feature/disasterJudge/CommunicationServer';
import { DownloadCompanyDetail } from './feature/downloadCompanyDetail'; // 下载企业详情
import { LocationServer } from './feature/locationServer';
import { GisStaticServer } from './service/GisStaticServer';
import { RescueSituationServer } from './feature/rescueSituation/RescueSituationServer'; // 调度态势查询
import { HazardoubaseinfoServer } from './feature/hazardoubaseinfoServer'; // 危化企业基本信息
import { WebsoketServer } from './feature/websoketServer'; // 传一线操作屏数据
import { RealtimeTeam } from './feature/realtimeTeam';
import { FirePointServer } from './feature/firePoint';  // 火点数据
import { EventPushServer } from './feature/normal/eventPushServer'; // 事件回显到新的支撑屏
import { RegionSelectionServer } from './feature/regionSelectionServer'; // 事件回显到新的支撑屏
import { EarlyWarningServer } from './feature/EarlyWarningServer'; // 事件回显到新的支撑屏
import { LoginServer } from '@/api/service/LoginServer';
import { ChooseScreen } from '@/api/feature/chooseScreen';
import { GetEvemtInfoOrCreatedInfo } from '@/api/feature/getEvemtInfoOrCreatedInfo';
import { UpdateEadsEaffectRange } from '@/api/feature/UpdateEadsEaffectRange';
import { UserToken } from '@/api/feature/UserToken';
import { JiesiruiServer } from '@/api/feature/jiesirui/jiesiruiServer'; // 捷思锐语音
import { EadsWebPlot } from '@/api/feature/plot/eadsWebPlot';
import { GisStorageTankServer } from '@/api/feature/GisStorageTank/GisStorageTankServer'; // 储罐模型服务
import { GisDangerSpreadServer } from '@/api/feature/GisDangerSpread/GisDangerSpreadServer'; // 危化品大气扩散模型服务
import { GisChemicalBlastServer } from '@/api/feature/GisChemicalBlast/GisChemicalBlastServer'; // 危化品爆炸模型服务
import { GisEarthQuakeIntensity } from '@/api/feature/GisEarthQuakeIntensity/GisEarthQuakeIntensity'; // 地震烈度模型服务
import { SubstanceInfo } from '@/api/feature/substanceInfo/substanceInfo'; // 物资信息模型服务
import { TokenServer } from '@/api/feature/token/tokenServer'; // 服务token获取
import { CompanyVideoServer } from './feature/companyVideoList/companyVideoServer';
const dizhenServer = new DizhenServer({ baseURL: publicPath });
const pathServer = new PathServer({ baseURL: publicPath });
const chooseScreen = new ChooseScreen({ baseURL: publicPath });
const eventInfoServer = new EventInfoServer(
    { baseURL: configServerPath },
    injectFilter,
);
const eadsWebPlot = new EadsWebPlot({
    baseURL: configServerPath,
},
    injectFilter,
);
const progressSituationServer = new ProgressSituationServer(
    { baseURL: publicPath },
    injectFilter,
);

const warningInfoServer = new WarningInfoServer(
    { baseURL: configServerPath },
    injectFilter,
);
// 储罐火辅助决策所用到的模型数据
const gisStorageTankServer = new GisStorageTankServer(
    { baseURL: configServerPath },
    injectFilter,
);
const rescueTeamServerTeamout = new RescueTeamServerTeamout(
    { baseURL: configServerPath },
    injectFilter,
);
// 危化品大气扩散所用到的模型数据
const gisDangerSpreadServer = new GisDangerSpreadServer(
    { baseURL: '' },
    injectFilter,
);
// 地震烈度所用到的模型数据
const gisEarthQuakeIntensity = new GisEarthQuakeIntensity(
    { baseURL: '' },
    injectFilter,
);
// 物资信息模型所用到的模型数据
const substanceInfo = new SubstanceInfo({ baseURL: '' }, injectFilter);
// 危化品爆炸所用到的模型数据
const gisChemicalBlastServer = new GisChemicalBlastServer(
    { baseURL: '' },
    injectFilter,
);
const weatherServer = new WeatherServer({ baseURL: publicPath }, injectFilter);
const newWeatherServer = new NewWeatherServer({ baseURL: publishObjectPath.value.newWeatherServer }, injectFilter);
const riverWaterSystemServe = new RiverWaterSystemServe({ baseURL: configServerPath }, injectFilter);
// 数据来源
const dataSourcesServer = new DataSourcesServer({ baseURL: dataApiServer }, injectFilter);
// 危化企业的基本数据模板
const hazardoubaseinfoServer = new HazardoubaseinfoServer({ baseURL: dataApiServer }, injectFilter);
const websoketServer = new WebsoketServer({ baseURL: oneLineServer }, injectFilter);  // 传一线操作屏数据
const realtimeTeam = new RealtimeTeam({ baseURL: dataApiServer }, injectFilter);
const firePoint = new FirePointServer({ baseURL: dataApiServer }, injectFilter);
const tokenServer = new TokenServer(
    { baseURL: tokenPath },
    injectFilter,
);
const riskHazardServerServer = new RiskHazardServerServer(
    { baseURL: '/mock/' },
    injectFilter,
);
const leftMenuServer = new LeftMenuServer(
    { baseURL: publicPath },
    injectFilter,
);
const dispatchTeamServer = new DispatchTeamServer({ baseURL: publicPath });
const goodsNeedServer = new GoodsNeedServer(
    { baseURL: '/mock/' },
    injectFilter,
);
const severelyAffectedAreaServer = new SeverelyAffectedAreaServer(
    {
        baseURL: publicPath,
    },
    injectFilter,
);

const mapServer = new MapServer({ baseURL: publicPath });
const staticDataRequestServer = new StaticDataRequestServer({
    baseURL: publicPath,
});
const gisToolServer = new GisToolServer({ baseURL: publicPath });
const plotServer = new PlotServer({ baseURL: publicPath }, injectFilter);
const plotNoSqlService = new PlotNoSqlService(
    { baseURL: publicPath },
    injectFilter,
);
//
const disasterJudgeServer = new DisasterJudgeServer({
    baseURL: configServerPath,
});

const hazServer = new HazServer({ baseURL: publicPath });

const hazServerShip = new HazServerShip({ baseURL: publicPath });

const normalResourceServer = new NormalResourceServer({ baseURL: publicPath });

const pictureServer = new PictureServer({ baseURL: publicPath });
const multiuleInterfaceServer = new MultiuleInterfaceServer({ baseURL: publicPath });
const eventServer = new EventServer({ baseURL: configServerPath }, injectFilter);

const knownDisasterServer = new KnownDisasterServer({ baseURL: publicPath });
const earlyWarningServer = new EarlyWarningServer({ baseURL: publicPath });

const suppliesAllocateServer = new SuppliesAllocateServer({
    baseURL: publicPath,
});

const leaderInstructionServer = new LeaderInstructionServer({
    baseURL: publicPath,
});

const managementOnDutyServer = new ManagementOnDutyServer(
    { baseURL: configServerPath },
    injectFilter,
);

const historicalEarthquakeServer = new HistoricalEarthquakeServer(
    { baseURL: configServerPath },
    injectFilter,
);
const airStationServer = new AirStationServer(
    { baseURL: configServerPath },
    injectFilter,
);

const treeDetailServerServer = new TreeDetailServerServer(
    { baseURL: configServerPath },
    injectFilter,
);
const disasterRightEcahrs = new DisasterRightEcahrs(
    { baseURL: configServerPath },
    injectFilter,
);
// 下载企业详情
const downloadCompanyDetail = new DownloadCompanyDetail(
    { baseURL: configServerPath },
);
const nomalLeftServer = new NomalLeftServer({ baseURL: publicPath }, injectFilter);

// 由之前的配置vue.config.js aip 转成josn配置
const pushDataRequestServe = new PushDataRequestServe(
    { baseURL: configServerPath },
    injectFilter,
);

const disposalAdviceServer = new DisposalAdviceServer(
    { baseURL: publicPath },
    injectFilter,
);
const districtServer = new DistrictServer(
    { baseURL: configServerPath },
    injectFilter,
);
const baseDataServer = new BaseDataServer(
    { baseURL: configServerPath },
    injectFilter,
);
const detailInfoServer = new DetailInfoServer(
    { baseURL: configServerPath },
    injectFilter,
);
const emerSourceServer = new EmerSourceServer(
    { baseURL: configServerPath },
    injectFilter,
);
const riskSourceServer = new RiskSourceServer(
    { baseURL: configServerPath },
    injectFilter,
);
const rescueTeamServer = new RescueTeamServer(
    { baseURL: configServerPath },
    injectFilter,
);
const rescueTeamFakeServer = new RescueTeamFakeServer(
    { baseURL: configServerPath },
    injectFilter,
);
const rescueSuppliesServer = new RescueSuppliesServer(
    { baseURL: configServerPath },
    injectFilter,
);
const geocodeServer = new GeocodeServer(
    { baseURL: configServerPath },
    injectFilter,
);
const essearchServer = new ESSearchServer({ baseURL: publicPath });
const communicationServer = new CommunicationServer(
    { baseURL: configServerPath },
    injectFilter,
);
const gisStaticServer = new GisStaticServer(
    { baseURL: publicPath },
    injectFilter,
);
const rescueSituationServer = new RescueSituationServer(
    { baseURL: publicPath },
    injectFilter,
);
const locationServer = new LocationServer({ baseURL: publicPath });
// 事件回显到新的操作屏
const eventPushServer = new EventPushServer(
    { baseURL: configServerPath },
);
// 区域选择server
const regionSelectionServer = new RegionSelectionServer(
    { baseURL: configServerPath },
);
// 登录请求
const loginServer = new LoginServer({
    baseURL: publishObjectPath.value.loginserver,
},
    injectFilter,
);
// 事件列表  事件处置  获取事件信息(处置新建)
const getEvemtInfoOrCreatedInfo = new GetEvemtInfoOrCreatedInfo({
    baseURL: configServerPath,
},
    injectFilter,
);
// 展示屏更改经验圈的时候 通知支撑屏 同步信息
const updateEadsEaffectRange = new UpdateEadsEaffectRange({
    baseURL: configServerPath,
},
    injectFilter,
);
// 登陆验证
const userToken = new UserToken({
    baseURL: configServerPath,
},
    injectFilter,
);
// 登陆验证
const jiesiruiServer = new JiesiruiServer(
    { baseURL: configServerPath },
    injectFilter,
);
const companyVideoServer = new CompanyVideoServer(
    { baseURL: publicPath },
    injectFilter,
);
export {
    dizhenServer,
    pathServer,
    eventInfoServer,
    warningInfoServer,
    weatherServer,
    newWeatherServer,
    riverWaterSystemServe,
    dataSourcesServer,
    riskHazardServerServer,
    leftMenuServer,
    dispatchTeamServer,
    goodsNeedServer,
    severelyAffectedAreaServer,
    progressSituationServer,
    mapServer,
    rescueTeamServerTeamout,
    staticDataRequestServer,
    gisToolServer,
    pictureServer,
    multiuleInterfaceServer,
    eventServer,
    plotServer,
    plotNoSqlService,
    disasterJudgeServer,
    hazServer,
    hazServerShip,
    normalResourceServer,
    knownDisasterServer,
    earlyWarningServer, // 监测预警
    suppliesAllocateServer,
    leaderInstructionServer,
    managementOnDutyServer,
    historicalEarthquakeServer,
    airStationServer,
    treeDetailServerServer,
    pushDataRequestServe, // 根据事件id、组件位置id，请求推送的数据
    disposalAdviceServer,
    districtServer,
    baseDataServer,
    detailInfoServer,
    emerSourceServer,
    riskSourceServer,
    rescueTeamServer,
    rescueTeamFakeServer,
    disasterRightEcahrs,
    rescueSuppliesServer,
    geocodeServer,
    essearchServer,
    nomalLeftServer, // 常态左侧应急资源tab的icon
    communicationServer, // 指挥调度设备
    videoServerPath,
    downloadCompanyDetail, // 下载企业详情
    locationServer,
    gisStaticServer,
    rescueSituationServer, // 调度态势查询
    eventPushServer, // 事件回显到新的操作屏
    hazardoubaseinfoServer, // 危化企业的基本信息
    realtimeTeam,  // 实时队伍的数据
    firePoint,  // 火点数据服务
    regionSelectionServer, // 区域选择server
    loginServer,
    chooseScreen,
    websoketServer, // 传一线操作屏数据
    getEvemtInfoOrCreatedInfo, // 事件列表  事件处置  获取事件信息(处置新建)
    updateEadsEaffectRange, // 变更经验圈通知推送屏
    userToken, // token 验证
    eadsWebPlot, // 支撑屏在展示屏中的标绘
    jiesiruiServer, // 捷思锐的语音通话服务
    gisStorageTankServer,
    gisDangerSpreadServer, // 危化品大气扩散服务
    gisChemicalBlastServer, // 危化品爆炸模型服务
    gisEarthQuakeIntensity, // 地震烈度模型服务
    substanceInfo, // 物资信息模型服务
    tokenServer, // arcgis token
    companyVideoServer,
};
