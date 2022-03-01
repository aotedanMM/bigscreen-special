import { ResourceanalysisServer } from './resourceanalysisServer';
import { CommonDistrictServer } from './CommonDistrictServer';
import {SocketRestServer} from './socketRestServer';
import {HistoryEarthQuakeServer} from './historyEarthQuakeServer';
import publishObjectPath from '@/util/configRegistry';
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.serverPath;

//
const resourceanalysisServer = new ResourceanalysisServer({baseURL: ''});
const commonDistrictServer = new CommonDistrictServer({baseURL: ''});
const socketRestServer = new SocketRestServer({baseURL: ''});
const historyEarthQuakeServer = new HistoryEarthQuakeServer({baseURL: configServerPath});

export {
  resourceanalysisServer,
  commonDistrictServer,
  socketRestServer,
  historyEarthQuakeServer,
};
