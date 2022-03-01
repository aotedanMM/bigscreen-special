
import {RequestServerClass} from '@/util/request';
import publishObjectPath from '@/util/configRegistry';
import MultiuleQueryParamConfigList_yt from '@/gis/normal/resource/MultiuleQueryParamConfigList_yt';
import Qs from 'qs';

export class DataSourcesServer {

    // public rSerivce: any;

    // constructor(opt: any, axiosFilterFn?: any) {
    //     this.rSerivce = new RequestServerClass(opt);
    //     axiosFilterFn.call(this, this.rSerivce.serverObj);
    // }
    // this.rSerivce = new RequestServerClass(opt);
    // this.baseURL = opt.baseURL;
    // this.emapServiceFilter = publishObjectPath.value.district;
    // this.rSerivce2 = new RequestServerClass({ baseURL: publishObjectPath.value.serverPath });
    public rSerivce: any;
    public rSerivce2: any;
    private baseURL: any;
    constructor(opt: any, axiosFilterFn?: any) {
      this.rSerivce = new RequestServerClass(opt);
      this.baseURL = opt.baseURL;
      this.rSerivce2 = new RequestServerClass({baseURL: publishObjectPath.value.floodServerPath} );
    }
    // 数据来源
    public getDataSourceServer(data: any) {
        const url = '/api/vdateSource/v1/getDataSource?typeCode=' + data.typeCode ;
        return this.rSerivce.serverObj.get(url);
    }
     // 列表分页接口
  public getLimitDataList(opts: any) {
    const url = '/api/universal/getUniversalLimitSql/v1';
    return new Promise((resolve, reject) => {
      this.rSerivce2.serverObj.post(url, opts).then((data: any) => {
        resolve(data);
      });
    });
  }
}
