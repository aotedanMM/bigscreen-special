const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
import DisasterSituationServer from './DisasterSituationServer';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =
  publishObjectPath.value && publishObjectPath.value.serverPath;
const disasterSituationServer = new DisasterSituationServer({
  baseURL: configServerPath,
});
/**
 * 灾情统计 服务
 */
export {
  // 受灾情况
  disasterSituationServer,
};
