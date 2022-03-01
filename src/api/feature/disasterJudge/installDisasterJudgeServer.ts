const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.serverPath;
import {DisasterJudgeServer } from './disasterJudgeServer';
import { DistrictServer } from './DistrictServer';
import AccidentsServer from './AccidentsServer';
import { WeatherServer } from './WeatherServer';
import { RiskTroubleQueryServer } from './riskTroubleQueryServer';
import { HazServer } from './server/HazServer';
import { HazServerShip } from './server/HazServerShip';
import {LatestImageServer} from './LatestImageServer';
import { CommunicationServer } from './CommunicationServer';
import { QuickJudgeServer } from './QuickJudgeServer';
import { RescueTeamServer } from './RescueTeamServer';
import { RescueTeamFakeServer } from './RescueTeamFakeServer';
import { RepositoryServer } from './RepositoryServer';
import { GeologicHazardServer } from './GeologicHazardServer';
import { DisasterJudgeResourceServer } from './resourceServer';
//
const districtServer = new DistrictServer({baseURL: configServerPath});
const accidentsServer = new AccidentsServer({baseURL: configServerPath});
const weatherServer = new WeatherServer({baseURL: configServerPath});
const disasterJudgeServer = new DisasterJudgeServer({baseURL: publicPath});
const riskTroubleServer = new RiskTroubleQueryServer({baseURL: publicPath});
const hazServer = new HazServer({baseURL: publicPath});
const hazServerShip = new HazServerShip({baseURL: publicPath});
const latestImage = new LatestImageServer({url: publishObjectPath.value.latestimage});
const communicationServer = new CommunicationServer({baseURL: configServerPath});
const quickJudgeServer: any = new QuickJudgeServer({baseURL: configServerPath});
const rescueTeamServer = new RescueTeamServer({baseURL: configServerPath});
const rescueTeamFakeServer = new RescueTeamFakeServer({baseURL: configServerPath});
const repositoryServer = new RepositoryServer({baseURL: configServerPath});
const geologicHazardServer = new GeologicHazardServer({baseURL: configServerPath});
const disasterJudgeResourceServer = new DisasterJudgeResourceServer({baseURL: configServerPath});
export default {
  districtServer,
  accidentsServer,
  weatherServer,
  disasterJudgeServer,
  riskTroubleServer,
  hazServer,
  hazServerShip,
  latestImage,
  communicationServer,
  quickJudgeServer,
  rescueTeamServer,
  rescueTeamFakeServer,
  repositoryServer,
  geologicHazardServer,
  disasterJudgeResourceServer,
  publishObjectPath,
};
