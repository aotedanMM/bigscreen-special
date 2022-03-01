
import {RequestServerClass} from '../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 定位服务
export class RegionSelectionServer {

    public rService: any;
    private regionService: any;
    private urlWeb: any = publishObjectPath.value.urlWeb;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rService = new RequestServerClass(opt);
        const optRegion = {baseURL: this.urlWeb};
        this.regionService = new RequestServerClass(optRegion);
    }
    /**
     * 根据code获取地区(单个)
     * @param opts {Object}
     * @param opts.districtcode {String}
     *
     */
    public getDistrictByCode(opts: any) {
      const self = this;
      const url = '/api/district/' + opts.districtcode + '/selectonedis/v1';
      return new Promise((resolve, reject) => {
          self.rService.serverObj.get(url).then((response: any) => {
              const result = response.data;
              resolve(result);
              }, (err: any) => {
                  reject(err);
          });
      });
    }
    /**
     * 获取全国数据
     * @param opts {Object}
     *
     */
    public getRegionData(opts: any) {
      const self = this;
      const url = '/api/district/selectdisforlevel/v1';
      return new Promise((resolve, reject) => {
          self.rService.serverObj.post(url, opts).then((response: any) => {
              const result = response.data;
              resolve(result);
              }, (err: any) => {
                  reject(err);
          });
      });
    }
    /**
     * 获取全国数据
     * @param opts {Object}
     *
     */
    public getRegionDataOld(opts: any) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: this.urlWeb + '/district/selectDisForLevel',
          type: 'POST',
          data: {},
          success: (res) => {
              resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
      });
    }
}
