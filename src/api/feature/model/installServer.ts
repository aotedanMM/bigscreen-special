const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
import FloodRiskServer from './FloodRiskServer';
import GsemergencyServer from './GsemergencyServer';

// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.floodServer;
// 之前的配置pushAPi,现在对应的就是pushApiServer
const floodRiskServer = new FloodRiskServer({baseURL: configServerPath});
const gsemergencyServer = new GsemergencyServer({baseURL: configServerPath});
/**
 * 防御准备 服务
 */
export {
    // 洪水径流和风险隐患
    floodRiskServer,
    gsemergencyServer,
};
