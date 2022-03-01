const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import injectFilter from '@/filter/RequireFilter';
import publishObjectPath from '@/util/configRegistry';
import MonitorWarningServer from './MonitorWarningServer';
import WindSituationServer from './WindSituationServer';
import RainSituationServer from './RainSituationServer';
import ReservoirServer from './ReservoirServer';
import WaterSituationServer from './WaterSituationServer';
import EngineeringSituationServer from './EngineeringSituationServer';
import VideoSituationServer from './VideoSituationServer';
import OnlineTerminalServer from './OnlineTerminalServer';
import WarningInfoServer from './WarningInfoServer';
import FireBanServer from './FireBanServer';
import FirePointMonitorServer from './FirePointMonitorServer';
import EarlyWarningServer from './EarlyWarningServer';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.floodServerPath;
const warningInfoServer = new WarningInfoServer({ baseURL: configServerPath }, injectFilter);
const monitorWarningServer = new MonitorWarningServer({baseURL: configServerPath});
const windSituationServer = new WindSituationServer({baseURL: configServerPath});
const rainSituationServer = new RainSituationServer({baseURL: configServerPath});
const reservoirServer = new ReservoirServer({baseURL: configServerPath});
const waterSituationServer = new WaterSituationServer({baseURL: configServerPath});
const engineeringSituationServer = new EngineeringSituationServer({baseURL: configServerPath});
const videoSituationServer = new VideoSituationServer({baseURL: configServerPath});
const onlineTerminalServer = new OnlineTerminalServer({baseURL: publishObjectPath.value.onlineTerminalServerPath});
const fireBanServer = new FireBanServer({baseURL: configServerPath});
const firePointMonitorServer = new FirePointMonitorServer({baseURL: configServerPath});
const earlyWarningServer = new EarlyWarningServer({baseURL: configServerPath});
/**
 * 监测预警服务
 */
export {
  // 综合统计
  monitorWarningServer,
  // 气象监测
  warningInfoServer,
  // 风情
  windSituationServer,
  // 雨情
  rainSituationServer,
  // 水情
  waterSituationServer,
  // 工情
  engineeringSituationServer,
  // 视频监控
  videoSituationServer,
  // 在线终端
  onlineTerminalServer,
  // 禁火令
  fireBanServer,
  // 火点监测
  firePointMonitorServer,
  // 预警
  earlyWarningServer,
  // 水库详情
  reservoirServer,
};
