const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.serverPath;
import injectFilter from '@/filter/RequireFilter';
import { RescueAssistanceServer } from '@/api/feature/RescueAssistance/RescueAssistanceServer';
const rescueAssistanceServer = new RescueAssistanceServer({ baseURL: configServerPath }, injectFilter);
export {
  rescueAssistanceServer,
};
