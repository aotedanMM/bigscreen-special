import { RequestServerClass } from '../../../util/request';

export class DisasterRightEcahrs {
  public rSerivce: any;
  public HazardQueryService: any;
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
  }

  /**
  * 获取人员密集场所数据
  * @param opts
  * @param opts.geometry {GeoJSON}
  * @param opts.point [point]
  */
  public getCrowded(opts: any) {
    return new Promise((resolve, reject) => {
      (window as any).EMapServerV2.queryservice.getProctectObjectDatacount((data: any) => {
        resolve(data);
      }, opts.geometry, opts.point);
    });
  }


  /**
 * 获取严重受灾区域数据
 * @param opts
 * @param opts.geometry {GeoJSON}
 * @param opts.point [point]
 */
  public getDisaster(opts: any) {
    return new Promise((resolve, reject) => {
      (window as any).EMapServerV2.queryservice._queryDistrictPolygon(opts.point, opts.geometry, (data: any) => {
        resolve(data);
      });
    });
  }



  /**
   * 地震烈度范围的地质隐患统计
   * @param opts
   */
  public getEqStatistics(opts: any) {
    if (!this.HazardQueryService) {
      this.HazardQueryService = new (window as any).EMapServerV2.HazardQueryService({});
    }
    return new Promise((resolve, reject) => {
      this.HazardQueryService.getEqStatistics(opts, (data: any) => {
        resolve(data);
      });
    });
  }
}
