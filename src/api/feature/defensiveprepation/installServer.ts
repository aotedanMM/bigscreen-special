const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
import DefensivePreparationServer from './DefensivePreparationServer';
import RiskServer from './RiskServer';
import ProtectTargetServer from './ProtectTargetServer';
import ResourceServer from './ResourceServer';
import RealtimeShipServer from './RealtimeShipServer';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.serverPath;
const realtimeShipServer = new RealtimeShipServer({baseURL: configServerPath});
const defensivePreparationServer = new DefensivePreparationServer({baseURL: configServerPath});
const resourceServer = new ResourceServer({baseURL: configServerPath});
const riskServer = new RiskServer({baseURL: configServerPath});
const protectTargetServer = new ProtectTargetServer({baseURL: configServerPath});
riskServer.setResourceServer(resourceServer);
protectTargetServer.setResourceServer(resourceServer);
/**
 * 防御准备 服务
 */
export {
    // 防御准备>人员迁移 船舶归港
    defensivePreparationServer,
    // 资源服务
    resourceServer,
    // 风险点
    riskServer,
    // 防护目标
    protectTargetServer,
    // 船舶实时数据（ais）
    realtimeShipServer,
};
