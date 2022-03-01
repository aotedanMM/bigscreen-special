const publicPath = require('../../../config/index').jsonPath;
const serverPath = require('../../../config/index').servePath;
import publishObjectPath from '@/util/configRegistry';
import injectFilter from '@/filter/RequireFilter';
// 从json中取对应的服务器地址
// 之前的pulicPath 在config/evn.js 修改， 现在json/publishObjectPath.json 里面 serverPath 里面修改
// 之前的serverPath , 现在调用configServerPath
const fireForecastImg =   publishObjectPath.value  && publishObjectPath.value.fireForecastImg;
const siteRescueServerUrl = publishObjectPath.value  && publishObjectPath.value.siteRescueServer;
const forestFireModelUrl: string = publishObjectPath.value && publishObjectPath.value.ForestFireServer;
// 全国森林火险气象预报图
import {ForestFireServer } from './ForestFireServer';
// 静态json文件
import { StaticServer } from './StaticServer';
// 现场扑救
import { SiteRescueServer } from './SiteRescueServer';
// 森火模型服务
import { ForestFireModelServer } from './ForestFireModelServer';
import { WildlandFireServer } from './WildlandFireServer';

const forestFireServer = new ForestFireServer({baseURL: fireForecastImg}, injectFilter);
const staticServer = new StaticServer({baseURL: publicPath});
const siteRescueServer = new SiteRescueServer({baseURL: siteRescueServerUrl}, injectFilter);
const forestFireModelServer = new ForestFireModelServer({baseURL: forestFireModelUrl}, injectFilter);
const wildlandFireServer = new WildlandFireServer({baseURL: publicPath}, injectFilter);
export default {
  forestFireServer,
  staticServer,
  siteRescueServer,
  forestFireModelServer,
  wildlandFireServer,
};
