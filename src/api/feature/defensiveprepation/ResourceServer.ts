import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
import { LayerTableMap } from './LayerTableMap';

// 资源服务-对接中台数据服务
export default class ResourceServer {
  public rSerivce: any;

  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    // test
    // (window as any).resourceServer = this;
  }


  /**
   * 获取资源统计
   * @param opts
   * @param opts.layerId
   * @param opts.config []
   * resourceServer.getResourceStatistics({layerId:'test'}).then(function(data){console.log(data);})
   */
  public getResourceStatistics(opts: any) {
    const arrLayer: any = [];
    opts.config.forEach((item: any) => {
      arrLayer.push(item.layer);
    });
    const strLayerId: any = arrLayer.join(',');
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.dataServer
        + `/egis/business/v1/wrms/multiStat?layers=${strLayerId}`;
      const res: any = await this.rSerivce.serverObj.post(url, {
        filter: {
          subFields: opts.subFields || '*',
          where: opts.where || '',
        },
      });
      const dataResult: any = res.data.result || {};
      const statisticsObj: any = dataResult.statistic || {};
      let total: number = 0;
      for (const key of Object.keys(statisticsObj)) {
        total += statisticsObj[key];
      }
      const result: any = {};
      result.list = [];
      for (const configItem of opts.config) {
        const item: any = {};
        item.name = configItem.name;
        item.code = configItem.layer;
        item.value = statisticsObj[configItem.layer] || 0;
        result.list.push(item);
      }
      result.total = total;
      resolve(result);
    });
  }

  /**
   * 根据行政区划统计
   * @param opts
   * @param opts.layerId
   * resourceServer.getStaticByDistrict({layerId:'bas_geologichazard'})
   */
  public getStaticByDistrict(opts: any) {
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.dataServer + `/egis/business/v1/report/groupby1?layer=${opts.layerId}&row=pac`;
      const res: any = await this.rSerivce.serverObj.post(url, {
        filter: {
          where: 'pac like \'37%\'',
          orderBy: 'count(*) desc, pac asc',
        },
      });
      const result1: any = res.data.result || {};
      const result: any = {};
      result.total = 0;
      result.list = result1.list || [];
      for (const item of result.list) {
        result.total += item.count;
      }
      resolve(result);
    });
  }

  /**
   * 获取数据
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.subFields 查询的字段名，多个逗号分隔
   * @param opts.where 查询条件sql
   * @param opts.withRelation 是否返回关联
   * @param opts.dataConverter
   * resourceServer.getList({layerId:'bas_geologichazard',withRelation:false,subFields:'address',where:'districtcode=\'451031\'',}).then(function(data){console.log(data);})
   */
  public getList(opts: any) {
    return new Promise(async (resolve, reject) => {
      if (opts.where) {
        const arr = [];
        for (let index = 0; index < opts.where.length; index++) {
            const word = opts.where.charAt(index);
            if (word === '%') {
                arr.push('\\' + word);
                continue;
            }
            arr.push(word);
        }
        opts.where = arr.join('');
    }
      const url: string = publishObjectPath.value.dataServer
        + `/egis/business/v1/wrms/find?layer=${opts.layerId}&withRelation=${!!opts.withRelation}`;
      const res: any = await this.rSerivce.serverObj.post(url, {
        filter: {
          subFields: opts.subFields || '*',
          where: opts.where || '',
        },
      });
      const data: any = res.data;
      const dataResult: any = {
        entities: data.result,
      };
      const result: any = this.parseWrmsResult(dataResult, opts.dataConverter);
      delete result.count;
      resolve(result);
    });
  }
  /**
   * 根据表名获取所有数据
   * @param layerId 图层id,多个用','分开(nah_fld_mountainflood,100103000000)
   */
  public getAllDataByName(layerId: any) {
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.dataServer
        + `/egis/business/v1/wrms/multiQuery?layers=${layerId}`;
      const res: any = await this.rSerivce.serverObj.post(url, {
        filter: {
          subFields: 'id,name,longitude,latitude',
          where: 'pac like \'37%\'',
        },
      });
      const result: any = [];
      for (const key of Object.keys(res.data.result.entityCollections)) {
        result.push(...res.data.result.entityCollections[key].resourceEntities);
      }
      resolve(result);
    });
  }
  /**
   * 获取分页数据
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.subFields 查询的字段名，多个逗号分隔
   * @param opts.where 查询条件sql
   * @param opts.page 第几页
   * @param opts.size 页码
   * resourceServer.getPageList({layerId:'test',page:0,size:100,subFields:'',where:'districtcode=\'451031\'',}).then(function(data){console.log(data);})
   */
  public getPageList(opts: any) {
    return new Promise(async (resolve, reject) => {
      if (opts.where) {
        const arr = [];
        for (let index = 0; index < opts.where.length; index++) {
            const word = opts.where.charAt(index);
            if (word === '%') {
                arr.push('\\' + word);
                continue;
            }
            arr.push(word);
        }
        opts.where = arr.join('');
    }
      const url: string = publishObjectPath.value.dataServer
        + `/egis/business/v1/wrms/pageQuery?layer=${opts.layerId}&page=${opts.page}&size=${opts.size}`;
      const res: any = await this.rSerivce.serverObj.post(url, {
        filter: {
          subFields: opts.subFields || '*',
          where: opts.where || '',
        },
      });
      const data: any = res.data;
      const dataResult: any = data.result;
      const result: any = this.parseWrmsResult(dataResult, opts.dataConverter);
      resolve(result);
    });
  }


  /**
   * 获取详情
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.dataId 数据id
   * resourceServer.getDetail({layerId:'bas_geologichazard',dataId:95, }).then(function(data){console.log(data);})
   */
  public getDetail(opts: any, config: any = []) {
    return new Promise(async (resolve, reject) => {
      const url: string = publishObjectPath.value.dataServer
        + `/egis/business/v1/wrms/findById?layer=${opts.layerId}&id=${opts.dataId}`;
      const res: any = await this.rSerivce.serverObj.get(url);
      const tempData: any = res.data.result;
      const result: any = {
        name: '',
      };
      result.attirbutes = [];
      let tempConfig: any = {};
      for (const item of config) {
        if (item.layer === opts.layerId) {
          tempConfig = item;
          break;
        }
      }
      const nameField: any = tempConfig.nameField || 'name';
      const ignoreSet: any = {
        id: true,
        wkt: true,
      };
      if (tempData.feature && tempData.feature.fields && tempData.feature.fields.fields) {
        let index: any = 0;
        for (const field of tempData.feature.fields.fields) {
          if (!ignoreSet.hasOwnProperty(field.name)) {
            const item: any = {};
            item.name = field.name;
            item.alias = field.alias || field.name;
            const property: any = tempData.feature.properties[index];
            if (field.dict) {
              item.value = property.name;
            } else {
              item.value = property.value;
            }
            result.attirbutes.push(item);
            if (field.name === nameField) {
              result.name = item.value;
            } else if (field.name === 'id') {
              result.id = item.value;
            }
          }
          index++;
        }
      }
      if (tempData.business && tempData.business.fields && tempData.business.fields.fields) {
        let index: any = 0;
        for (const field of tempData.business.fields) {
          if (!ignoreSet.hasOwnProperty(field.name)) {
            const item: any = {};
            item.name = field.name;
            item.alias = field.alias || field.name;
            item.value = tempData.business.properties[index].value;
            result.attirbutes.push(item);
          }
          index++;
        }
      }
      resolve(result);
    });
  }


  /**
 * 获取分页数据
 * @param opts
 * @param opts.layerId 图层id
 * @param opts.keyword 关键字条件
 * @param opts.districtCode 行政区划过滤条件
 * @param opts.page 第几页
 * @param opts.size 页码
 */
  public getCommonPageList(opts: any, config: any) {
    let tempConfig: any = {};
    for (const item of config) {
      if (item.layer === opts.layerId) {
        tempConfig = item;
        break;
      }
    }
    if (opts.keyword) {
      const arr = [];
      for (let index = 0; index < opts.keyword.length; index++) {
          const word = opts.keyword.charAt(index);
          if (word === '%') {
              arr.push('\\' + word);
              continue;
          }
          arr.push(word);
      }
      opts.keyword = arr.join('');
  }
    const nameField: any = tempConfig.nameField || 'name';
    const params: any = {};
    params.layerId = opts.layerId;
    params.subFields = ['id', nameField].join(',');
    const whereItem: any = [];
    if (opts.keyword) {
      whereItem.push(`${nameField} like \'%${opts.keyword}%\'`);
    }
    if (opts.districtCode) {
      whereItem.push(`pac = \'${opts.districtCode}\'`);
    }
    params.where = whereItem.join(' and ');
    params.page = opts.page;
    params.size = opts.size;
    params.dataConverter = (item: any) => {
      item.name = item[nameField];
      item.id = item.id;
      return item;
    };
    return this.getPageList(params);
  }

  /**
   * 获取数据
   * @param opts
   * @param opts.layerId 图层id
   * @param opts.keyword 关键字条件
   * @param opts.districtCode 行政区划过滤条件
   * riskServer.getList({layerId:'bas_geologichazard',keyword:'',districtCode:'',}).then(function(data){console.log(data);})
   */
  public getCommonList(opts: any, config: any) {
    let tempConfig: any = {};
    for (const item of config) {
      if (item.layer === opts.layerId) {
        tempConfig = item;
        break;
      }
    }
    const nameField: any = tempConfig.nameField || 'name';
    const params: any = {};
    params.layerId = opts.layerId;
    params.subFields = ['id', nameField, 'longitude', 'latitude'].join(',');
    const whereItem: any = [];
    if (opts.keyword) {
      whereItem.push(`${nameField} like \'%${opts.keyword}%\'`);
    }
    if (opts.districtCode) {
      whereItem.push(`pac = \'${opts.districtCode}\'`);
    }
    params.where = whereItem.join(' and ');
    params.dataConverter = (item: any) => {
      item.name = item[nameField];
      // item.id = item.id;
      return item;
    };
    return this.getList(params);
  }

  // 解析结果
  private parseWrmsResult(dataResult: any, dataConverter: any) {
    const result: any = {};
    result.list = [];
    result.fields = null;
    if (!dataResult) {
      return result;
    }
    result.count = dataResult.count;
    if (dataResult.hasOwnProperty('pageIndex')) {
      result.pageIndex = dataResult.pageIndex;
    }
    if (dataResult.hasOwnProperty('pageSize')) {
      result.pageSize = dataResult.pageSize;
    }
    if (dataResult.entities) {
      if (!dataResult.entities.resourceEntities.length) {
        return result;
      }
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
