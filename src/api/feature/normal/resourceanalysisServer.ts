import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 资源分析服务
export class ResourceanalysisServer {
  public rSerivce: any;
  public emapServiceFilter: any;
  private BigTypeCountQueryConfig: any;
  private statisticCache: any = {};
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.emapServiceFilter = publishObjectPath.value.district;
  }
  // 行政区划获取
  // data.level: 1,
  // data.name: '',
  // data.adcode: '',
  // data.sub: 2,
  // data.polygon: false,
  // data.eId: 'siptea'
  public getDistrict(data: any) {
    return new Promise((resolve, reject) => {
      (window as any).EMapServerV2.DistrictUtil.search(data, (result: any) => {
        resolve(result);
      });
    });
  }
  // 统计分析
  public getStatistics(resourceKeys: any, filter: any) {
    return new Promise((resolve, reject) => {
      (window as any).EMapServerV2.CommonService.prototype.getStatistics(
        resourceKeys,
        filter,
        function(err: any, data: any) {
          resolve(data);
        },
        this,
      );
    });
  }
  // 获取配置
  public getResourceConfig() {
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.CommonService();
      service.getResourceConfig(function(err: any, data: any) {
        resolve(data);
      }, this);
    });
  }

  /**
   * 根据点、半径进行周边查询
   * @param opts
   * @param opts.resourceKeys: ["floodteam"] 查询的资源的key
   * @param opts.point  Number[2]，[x,y]
   * @param opts.radius 单位m
   */
  public getNearbyListByPointRadius(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
        opts.districtCode = self.emapServiceFilter.root;
    }
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.CommonService();
      const params: any = {};
      params.resourceKeys = opts.resourceKeys;
      params.point = opts.point;
      params.flatTag = true;
      params.config = {};
      params.districtCode = opts.districtCode;
      for (const key of opts.resourceKeys) {
        params.config[key] = {
          radius: opts.radius,
        };
      }
      service.getNearbyList(
        params,
        function(err: any, data: any) {
          (self as any).processResult(data, params).then((response: any) => {
            resolve(data);
          });
        },
        this,
      );
    });
  }

   /**
   * 根据点、半径进行周边查询
   * @param opts
   * @param opts.resourceKeys: ["floodteam"] 查询的资源的key
   * @param opts.point  Number[2]，[x,y]
   * @param opts.geometry
   */
  public getNearbyListByGeometry(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
        opts.districtCode = self.emapServiceFilter.root;
    }
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.CommonService();
      const params: any = {};
      params.resourceKeys = opts.resourceKeys;
      params.point = opts.point;
      params.buffer = opts.geometry;
      params.flatTag = true;
      params.districtCode = opts.districtCode;
      service.getNearbyList(
        params,
        function(err: any, data: any) {
          (self as any).processResult(data, params).then((response: any) => {
            resolve(data);
          });
        },
        this,
      );
    });
  }
   /**
   * 根据行政编码进行查询
   * @param opts
   * @param opts.resourceKeys: ["floodteam"] 查询的资源的key
   * @param opts.districtCode  {String} 行政编码逗号隔开
   */
  public getNearbyListByDistrictCode(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
        opts.districtCode = self.emapServiceFilter.root;
    }
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.CommonService();
      const params: any = {};
      params.resourceKeys = opts.resourceKeys;
      params.districtCode = opts.districtCode;
      params.flatTag = true;
      service.getNearbyList(
        params,
        function(err: any, data: any) {
          (self as any).processResult(data, params).then((response: any) => {
            resolve(data);
          });
        },
        this,
      );
    });
  }
  // opts
  // opts.Keyword: ""
  // opts.districtCode: ""
  // opts.resourceKeys: ["floodteam"]
  // opts.flatTag: true

  // opts.Keyword: ""
  // opts.districtCode: ""
  // opts.point:[111.25802, 36.57948]
  // opts.buffer: {type: "Polygon", coordinates: Array(1)}
  // opts.resourceKeys: ["floodteam"]
  // opts.flatTag: true
  // 资源查询接口

  /**
   * 周边查询
   * @param opts
   * @param opts.resourceKeys: ["floodteam"] 查询的资源的key
   * @param opts.districtCode 以逗号隔开
   * @param opts.point  Number[2]，[x,y]
   * @param opts.buffer Geojson
   * @param opts.keyword
   * @param opts.pageSize
   * @param opts.pageIndex
   */
  public getNearbyList(opts: any) {
    // if (!opts.point) {
    //   opts.point = [106, 34];
    // }
    if (opts.districtCodes && !opts.districtCode) {
      opts.districtCode = opts.districtCodes;
    }
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
        opts.districtCode = self.emapServiceFilter.root;
    }
    if ((!opts.Keyword) && opts.keyword) {
      opts.Keyword = opts.keyword;
    }
    if (!opts.point && opts.buffer) {
      const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(opts.buffer, 4326);
      const center = polygon.getBaryCenter();
      opts.point = [center.x, center.y];
    }
    opts.flatTag = true;
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.CommonService();
      service.getNearbyList(
        opts,
        function(err: any, data: any) {
          (self as any).processResult(data, opts).then((response: any) => {
            resolve(data);
          });
        },
        this,
      );
    });
  }
  // 获取资源树 param=[1,2]
  public queryTree(param: any) {
    return new Promise((resolve, reject) => {
      (window as any).EMapServerV2.queryData.queryTree(param, (res: any) => {
        resolve(res);
      });
    });
  }
  // 获取关键字 和行政区划树 模拟json数据
  public getTreeData() {
    const url = './json/tree.json';
    return this.rSerivce.serverObj.get(url);
  }
  // 获取关缓冲区 模拟json数据
  public getTreeBuffData() {
    const url = './json/treeBuff.json';
    return this.rSerivce.serverObj.get(url);
  }
  /**
   * 查询行政区划内的数据，并计算到指定点距离，由近到远排序
   * @param opts
   * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
   * @param opts.districtCode　{String} 行政区划编码
   * @param opts.distanceField {String} 距离属性名
   * @param opts.keyword　{String} 模糊匹配
   * @param opts.resources {Array} 资源数组
   * @param opts.resources[i].tables {Array} 查询的条件
   * @param opts.resources[i].tables[j].table {String} 查询的表
   * @param opts.resources[i].tables[j].query {Object} 查询条件
   * @param cb
   * @param ctx
   */
  public districtQuery(opts: any) {
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.bufferService();
      service.districtQuery(
        opts,
        function(err: any, data: any) {
          resolve(data);
        },
        this,
      );
    });
  }

  /**
   * 缓冲查或者范围查询
   * @param opts
   * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
   * @param opts.radius　{Number} 缓冲距离，单位公里，与geometry互斥
   * @param opts.geometry　{Number} 查询多边形，优先于radius
   * @param opts.distanceField {String} 距离属性名
   * @param opts.keyword　{String} 模糊匹配
   * @param opts.resources {Array} 资源数组
   * @param cb
   * @param ctx
   */
  public bufferOrPolygonQuery(opts: any) {
    return new Promise((resolve, reject) => {
      const service = new (window as any).EMapServerV2.bufferService();
      service.bufferOrPolygonQuery(
        opts,
        function(err: any, data: any) {
          resolve(data);
        },
        this,
      );
    });
  }
  /**
   * 获取统计
   * @param opts
   * @param opts.geometry {Object} geojson
   * @param opts.resourceKeys {Array}
   * @param opts.districtCode {String} 行政区划编码，逗号隔开
   */
  public getGroupCounts(opts: any) {
    if (opts.districtCodes && !opts.districtCode) {
      opts.districtCode = opts.districtCodes;
    }
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.districtCode && self.emapServiceFilter && self.emapServiceFilter.root) {
        opts.districtCode = self.emapServiceFilter.root;
    }
    return new Promise((resolve, reject) => {
      this.getBigTypeCountQueryConfig().then((response: any) => {
        const queries = this.getQueries(opts.resourceKeys, response);
        let queryOpts: any = {};
        let key = '';
        if (opts.geometry) {
          queryOpts = {
            querys: queries,
            bufferList: [opts.geometry],
            codes: opts.districtCode ? opts.districtCode : '000000',
          };
          key = JSON.stringify(queryOpts.bufferList);
        } else {
          queryOpts = {
            querys: queries,
            codes: opts.districtCode ? opts.districtCode : '000000',
            bufferList: [],
          };
          key = queryOpts.codes;
        }
        const servicemodule = new (window as any).EMapServerV2.ServiceModule({
          server: (window as any).EMAP_CONFIG.common.mongoService,
        });
        // 缓存处理
        if (!self.statisticCache[opts.resourceKeys]) {
          self.statisticCache[opts.resourceKeys] = {};
          servicemodule.bufferStatistics(queryOpts, function(err: any, data: any) {
            if (err) {
              reject(err);
            } else {
              self.statisticCache[opts.resourceKeys][key] = data;
              resolve(data);
            }
          });
        } else {
          if (self.statisticCache[opts.resourceKeys][key]) {
            resolve(self.statisticCache[opts.resourceKeys][key]);
          } else {
            servicemodule.bufferStatistics(queryOpts, function(err: any, data: any) {
              if (err) {
                reject(err);
              } else {
                self.statisticCache[opts.resourceKeys][key] = data;
                resolve(data);
              }
            });
          }
        }
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  /**
   * 获取应急资源树
   * @param opts
   */
  public getEmergeResourceTree(type: string) {
    return new Promise((resolve, reject) => {
      const url = './json/resourceTree/emergerResource-type' + type + '.json';
      this.rSerivce.serverObj.get(url).then((response: any) => {
        // const result = JSON.parse(response);
        if (response.data) {
          resolve(response.data);
        } else {
          this.rSerivce.serverObj.get('./json/resourceTree/emergerResource.json').then((r: any) => {
            resolve(r.data);
          });
        }
      }).catch((error: any) => {
        this.rSerivce.serverObj.get('./json/resourceTree/emergerResource.json').then((r: any) => {
          resolve(r.data);
        });
      });
    });

  }
  /**
   * 获取承灾体树
   * @param opts
   */
  public getDisasterEntitiesTree(type: string) {
    return new Promise((resolve, reject) => {
      // const url = './json/resourceTree/disasterEntities1.json';
      const url = './json/resourceTree/disasterEntities-type' + type + '.json';
      this.rSerivce.serverObj.get(url).then((response: any) => {
        // const result = JSON.parse(response)
        if (response.data) {
          resolve(response.data);
        } else {
          this.rSerivce.serverObj.get('./json/resourceTree/disasterEntities1.json').then((r: any) => {
            resolve(r.data);
          });
        }
      }).catch((error: any) => {
        this.rSerivce.serverObj.get('./json/resourceTree/disasterEntities1.json').then((r: any) => {
          resolve(r.data);
        });
      });
    });
  }

  /**
   * 获取人口热力
   * @param opts
   * @param opts.geometry {Object} geojson
   * @param opts.districtCode {String} 行政区编码，逗号隔开
   */
  public getPopulationHeatmap(opts: any) {
    const districtCodeArr = opts.districtCode.split(',');
    const or: any = [];
    const query: any = {};
    districtCodeArr.forEach((districtCode: any) => {
      if ('000000' === districtCode) { // 全国不过滤
        districtCode = '.*';
      } else if (/^\d{2}0000$/.test(districtCode)) {
        districtCode = districtCode.substr(0, 2) + '.*';
      } else if (/^\d{4}00$/.test(districtCode)) {
        districtCode = districtCode.substr(0, 4) + '.*';
      }
      or.push({
        'tag.DISTCODE': {
          $regex: '^' + districtCode + '$',
        },
      });
    });
    if (or.length > 0) {
      query.$or = or;
    }
    if (opts.geometry) {
      query.geom = {
        $geoIntersects: {
          $geometry: opts.geometry,
        },
      };
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        url: (window as any).EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
        dataType: 'json',
        type: 'POST',
        data: {
          eId: 'safety',
          data: JSON.stringify({
            POPU_FEVER: {
              query,
              select: '_id tag geom',
            },
          }),
        },
        success: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  /**
 * 获取房屋分布
 * @param opts
 * @param opts.geometry {Object} geojson
 * @param opts.districtCode {String} 行政区编码，逗号隔开
 */
  public getHouseDistribution(opts: any) {
    const aggregateList: any = [];
    const aggregateObj: any = {};
    const aggregate: any = [];
    const query: any = {};
    const or: any = [];
    const districtCodeArr = opts.districtCode.split(',');
    districtCodeArr.forEach((districtCode: any) => {
      if ('000000' === districtCode) {// 全国不过滤
        districtCode = '.*';
      } else if (/^\d{2}0000$/.test(districtCode)) {
        districtCode = districtCode.substr(0, 2) + '.*';
      } else if (/^\d{4}00$/.test(districtCode)) {
        districtCode = districtCode.substr(0, 4) + '.*';
      }
      or.push({
        'tag.COUNTRYCODE': {
          $regex: '^' + districtCode + '$',
        },
      });
    });

    aggregate.push(
      {
        $group: {
          _id: {},
          count: {
            $sum: 1,
          },
        },
      },
    );
    aggregateObj.aggregate = aggregate;
    aggregateObj.query = query;
    aggregateObj.searchId = 'BAS_HOUSEDIST';
    aggregateObj.dataSetId = 'BAS_HOUSEDIST';
    aggregateList.push(aggregateObj);
    if (or.length > 0) {
      query.$or = or;
    }
    if (opts.geometry) {
      aggregate.push({
        $match: {
          geom: {
            $geoIntersects: {
              $geometry: opts.geometry,
            },
          },
        },
      });
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        url: (window as any).EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti',
        dataType: 'json',
        type: 'POST',
        data: {
          eId: 'safety',
          data: JSON.stringify(aggregateList),
        },
        success: (data) => {
          resolve(data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  /**
 * 获取人口热力
 * @param opts
 * @param opts.geometry {Object} geojson
 * @param opts.districtCode {String} 行政区编码，逗号隔开
 */
  public getHouseStructure(opts: any) {
    return new Promise((resolve, reject) => {
      resolve({ data: null, msg: '操作成功', success: true });
    });
  }

  /**
   * 装备查询
  * @param opts
  * @param opts.keyWord {String} 关键字
  * @param opts.adcode {String} 行政区编码
  * @param opts.limit {Integer} 每页数量
  * @param opts.page {Integer} 页码
   */
  public getEquipments(opts: any) {
    const self = this;
    const keyWord = opts.keyWord;
    let code = opts.adcode || '';
    if ('000000' === code) {// 全国不过滤
      code = '';
    } else if (/^\d{2}0000$/.test(code)) {
      code = code.substr(0, 2);
    } else if (/^\d{4}00$/.test(code)) {
      code = code.substr(0, 4);
    }
    const url = (window as any).EMAP_CONFIG.common.mongoService + '/dataOperate/query';
    const data: any = {
      eId: 'safety',
      dataSetId: 'V_EQUIPMENT',
      query: JSON.stringify({ 'tag.EQUIPTYPENAME': { $regex: '.*' + keyWord + '.*$' }, 'tag.RESCOUNTY': { $regex: '.*^' + code + '.*$' } }),
      select: 'tag geom',
    };
    if (opts.limit && opts.page) {
      data.limit = opts.limit;
      data.page = opts.page;
    }
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        dataType: 'json',
        type: 'post',
        data,
        success: (res: any) => {
          const result = self.processEquipments(res.data.result);
          res.data.result = result;
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  private processEquipments(data: any) {
    data.forEach((obj: any) => {
      obj = this.extractAttr(obj, 'tag');
    });
    return data;
  }

  private extractAttr(obj: any, attr: string) {
    const target = obj[attr];
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        const attrValue = target[key];
        obj[key.toLowerCase()] = attrValue;
      }
    }
    delete obj[attr];
  }

  /**
   * 列表查询数据处理，增加距离、总数字段
   * @param data
   * @param params
   */
  private processResult(data: any, params?: any) {
    if (!data) {
      return;
    }
    data.total = 0;
    const records = data.list;
    const recLength = records.length;
    let counter = 0;
    return new Promise((resolve, reject) => {
      records.forEach((record: any) => {
        this.addTotalNum(record, params).then((response: any) => {
          const list = response.data;
          list.forEach((element: any) => {
            if (!element._distance) {
              element._distance = parseFloat((element.dis / 1000).toFixed(2));
            }
          });
          data.total += response.total;
          counter ++;
          if (counter === recLength) {
            resolve(data);
          }
        });
      });
    });

  }
/**
 * 增加总数字段
 * @param res
 * @param params
 */
  private addTotalNum(res: any, params: any) {
    return new Promise((resolve, reject) => {
      const opts = JSON.parse(JSON.stringify(params));
      // 分页查询计算总数
      if (opts.pageSize && opts.pageIndex) {
        // 含关键字时无法用统计，故取消分页查询，获取总数（待完善）
        if (opts.keyword) {
          if (!opts.Keyword) {
            opts.Keyword = opts.keyword;
          }
          delete opts.pageSize;
          delete opts.pageIndex;
          opts.resourceKeys = [res.codeKey];
          if (!opts.buffer && opts.geometry) {
            opts.buffer = opts.geometry;
          }
          if (opts.radius) {
            opts.config = {};
            opts.config[res.codeKey] = {
              radius: opts.radius,
            };
          }
          const service = new (window as any).EMapServerV2.CommonService();
          service.getNearbyList(
            opts,
            function(err: any, data: any) {
              if (err) {
                reject(err);
              } else {
                if (data) {
                  res.total = data.total;
                  res.tabNumber = data.total;
                }
                resolve(res);
              }
            },
            this,
          );
        } else {
          const options: any = {};
          options.resourceKeys = [res.codeKey];
          if (params.districtCode) {
            options.districtCode = params.districtCode;
          }
          if (params.buffer) {
            options.geometry = params.buffer;
          }
          this.getGroupCounts(options).then((data: any) => {
            if (data && data.length > 0) {
              res.total = res.tabNumber = data[0][res.codeKey].count;
            }
            resolve(res);
          }).catch((err: any) => {
            reject(err);
          });
        }
      } else {
        res.total = res.data.length;
        resolve(res);
      }
    });

  }
  // 获取资源查询配置
  private getBigTypeCountQueryConfig() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (!this.BigTypeCountQueryConfig) {
        const url = './json/resourceTree/BigTypeCountQueryConfig.json';
        this.rSerivce.serverObj.get(url).then((response: any) => {
          self.BigTypeCountQueryConfig = response.data;
          resolve(self.BigTypeCountQueryConfig);
        }).catch((err: any) => {
          reject(err);
        });
      } else {
        resolve(this.BigTypeCountQueryConfig);
      }
    });
  }
  // 获取查询条件
  private getQueries(resourceKeys: any, config: any) {
    const result: any = {};
    for (const index in resourceKeys) {
      if (resourceKeys.hasOwnProperty(index)) {
        const resourcekey = resourceKeys[index];
        for (const groupkey in config) {
          if (config.hasOwnProperty(groupkey)) {
            const groupKV = config[groupkey];
            for (const key in groupKV) {
              if (groupKV.hasOwnProperty(key)) {
                if (key === resourcekey) {
                  const element = groupKV[key];
                  result[key] = element;
                }
              }
            }
          }
        }
      }
    }
    return result;
  }
}
