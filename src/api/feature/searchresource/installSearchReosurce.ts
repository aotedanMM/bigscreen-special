import publishObjectPath from '@/util/configRegistry';
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.serverPath;
const publicPath = require('@/config/index').jsonPath;
import {BuildingServer } from './BuildingServer';
import {RealTimeCar } from './RealTimeCar';
import {ResourceServer } from './ResourceServer';
//
const buildingServer = new BuildingServer({baseURL: publicPath});
const realTimeCar = new RealTimeCar({baseURL: configServerPath});
const resourceServer = new ResourceServer({baseURL: ''});
export default {
  buildingServer,
  realTimeCar,
  resourceServer,
};
