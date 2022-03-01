import publishObjectPath from '@/util/configRegistry';
const configServerPath =   publishObjectPath.value  && publishObjectPath.value.serverPath;
import {DistrictServer } from './DistrictServer';
const districtServer = new DistrictServer({baseURL: configServerPath});
export default {
  districtServer,
};
/**
 * 灾情研判服务
 */
export {
  districtServer,
};
