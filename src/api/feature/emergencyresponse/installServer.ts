const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
import EmergencyResponseServer from './EmergencyResponseServer';
import EmergencyResponseEventServer from './EmergencyResponseEventServer';
import EmergencyResponseUserServer from './EmergencyResponseUserServer';
import EmergencyResponseTypeServer from './EmergencyResponseTypeServer';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath = publishObjectPath.value && publishObjectPath.value.misServerPath;
// 之前的配置pushAPi,现在对应的就是pushApiServer
// const eventApiServer = publishObjectPath.value && publishObjectPath.value.misServerPath;
// const eventIdSever = publishObjectPath.value && publishObjectPath.value.eventId;
// const userApiServer = publishObjectPath.value && publishObjectPath.value.userApiServer;
const typeApiServer = publishObjectPath.value && publishObjectPath.value.serverPath;


const emergencyResponseServer = new EmergencyResponseServer({ baseURL: configServerPath });
const emergencyResponseEventServer = new EmergencyResponseEventServer({ baseURL: configServerPath});
const emergencyResponseUserServer = new EmergencyResponseUserServer({ baseURL: configServerPath });
const emergencyResponseTypeServer = new EmergencyResponseTypeServer({
  baseURL: typeApiServer,
});



/**
 * // 应急响应服务
 */
export {
  emergencyResponseServer,
  emergencyResponseEventServer,
  emergencyResponseUserServer,
  emergencyResponseTypeServer,
};
