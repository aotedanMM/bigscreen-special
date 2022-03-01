import {RequestServerClass} from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 防汛服务
export class ForestFireServer {
    public rSerivce: any;
    constructor(opt: any, axiosFilterFn?: any) {
        this.rSerivce = new RequestServerClass(opt);
        if (axiosFilterFn) {
            axiosFilterFn.call(this, this.rSerivce.serverObj);
        }
    }
    /**
     * 查询森林火灾预报信息列表
     * @param opts
     * @param [opts.queryType] {number} // 快捷查询，D 当天，W 一周，Y 本年，默认当天
     * @param [opts.nowPage] {number}
     * @param [opts.pageSize] {number}
     * @param [opts.sortDesc] {number} // 排序方式
     * @param [opts.sortField] {number} // 排序字段
     * @param [opts.startTime] {number} // 手动选择开始时间(格式：yyyy-MM-dd)
     * @param [opts.endTime] {number} // 手动选择结束时间(格式：yyyy-MM-dd)
     */
    public getForecastList(opts?: any) {
      const url = '/api/fire/info/list?queryType=W';
      return this.rSerivce.serverObj.get(url, opts);
    }
    /**
     * 查询森林火灾预报信息列表-查询预警信息列表
     * @param opts
     * @param [opts.typeCode] {number} // 预警类型编号（必传，森林火险预警(94)）
     * @param [opts.cityCode] {number} // 城市编号（非必传）
     * @param [opts.nowPage] {number}
     * @param [opts.pageSize] {number}
     * @param [opts.sortDesc] {number} // 排序方式
     * @param [opts.sortField] {number} // 排序字段
     * @param [opts.startTime] {number} // 手动选择开始时间(格式：yyyy-MM-dd)
     * @param [opts.endTime] {number} // 手动选择结束时间(格式：yyyy-MM-dd)
     */
    public getForecastWarnList(opts?: any) {
      const url = '/api/weather/info/list?typeCode=94';
      return this.rSerivce.serverObj.get(url, opts);
    }
    /**
   * 获取气象预警
   * @param opt
   */
  public getWarningList(opts: any) {
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.foshanEgisDataServer
        + `/wrms/pageQuery?layer=mon_guangdong_warn&page=${opts.page}&size=${opts.size}`;
      const res: any = await this.rSerivce.serverObj.post(url, opts);
      const data: any = res.data;
      const dataResult: any = data.result;
      console.log(opts.dataConverter, '8989888');
      const result: any = this.parseWrmsResult(dataResult, opts.dataConverter);
      resolve(result);
    });
  }
  // 解析结果
  private parseWrmsResult(dataResult: any, dataConverter: any) {
    const result: any = {};
    result.count = dataResult.count;
    if (dataResult.hasOwnProperty('pageIndex')) {
      result.pageIndex = dataResult.pageIndex;
    }
    if (dataResult.hasOwnProperty('pageSize')) {
      result.pageSize = dataResult.pageSize;
    }
    result.list = [];
    result.fields = null;
    if (dataResult.entities) {
      const fields: any = dataResult.entities.featureFields.fields;
      if (dataResult.entities.businessFields) {
        fields.contact(dataResult.entities.businessFields.fields);
      }
      for (const item of dataResult.entities.resourceEntities) {
        let tempObj: any = {};

        let fieldsValue: any = [];
        fieldsValue = item.feature.properties;
        result.fields = result.fields || fields;
        let i = 0;
        for (const field of fields) {
          tempObj[field.name] = fieldsValue[i].name || fieldsValue[i].value;
          i++;
        }
        if (dataConverter) {
          tempObj = dataConverter(tempObj);
        }
        // todo 处理关联
        result.list.push(tempObj);
      }
    }
    return result;
  }
}

