
import { RequestServerClass } from '../../../util/request';
import publishObjectPath from '@/util/configRegistry';
// 灾情研判服务
export class QuickJudgeServer {

  public rSerivce: any;
  public localSerivce: any;
  public sService: any;
  public emapServiceFilter: any;
  private baseURL: any;
  private resourceConfig: any;
  private blankGeom = {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 90],
        [180, 90],
        [180, 0],
        [0, 0],
      ],
    ],
  };
  constructor(opt: any, axiosFilterFn?: any) {
    this.rSerivce = new RequestServerClass(opt);
    this.localSerivce = new RequestServerClass({ baseURL: '' });
    this.baseURL = opt.baseURL;
    this.emapServiceFilter = publishObjectPath.value.district;
    this.sService = publishObjectPath.value.floodServerPath;
  }
  /**
   * 资源-code对照：

    学校: school
    医院: hospital
    机场: airport
    火车站: railwaystation

    危化企业: hazardous
    煤矿企业: coalMine
    非煤矿山: mine
    烟花爆竹企业: explosive

    水库大坝: reservoir
    码头: portwharf
    核设施: nuclear

    滑坡: landslide
    泥石流: debrisflow
    山体崩塌: mountaincollapse
    地面塌陷: bottomcollapse
    地裂缝: groundfissure
    地面沉降: landsubsidence
    不稳定斜坡: unstableslopes
   */

  /**
   * 获取资源统计
   * @param opts
   * @param opts.resourceKeys [Array]
   * @param opts.ranges [Array]  //[{level:"Ⅵ级", geometry:{}},{level:"Ⅶ级", geometry:{}}}
   */
  public getResourceStat(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
      opts.districtCode = this.emapServiceFilter.root;
    }
    const self = this;
    const servicemodule = new (window as any).EMapServerV2.ServiceModule({
      server: (window as any).EMAP_CONFIG.common.mongoService,
    });
    return new Promise((resolve, reject) => {
      this.getResourceConfig().then((config: any) => {
        const queries = self.getQueries(opts.resourceKeys, config);
        const result: any = {};
        let counter = 0;
        for (const range of opts.ranges) {
          const level = range.level;
          const geometry = range.districtCode ? null : range.geometry; // 存在编码筛选则不走空间查询-待优化逻辑
          const queryOpts = {
            districtCode: range.districtCode || opts.districtCode,
            querys: queries,
            bufferList: geometry ? [geometry] : [this.blankGeom],
          };
          servicemodule.bufferStatistics(queryOpts, function(err: any, data: any) {
            if (err) {
              reject(err);
            }
            if (data) {
              result[level] = data[0];
            }
            if (counter === opts.ranges.length - 1) {
              resolve(result);
            }
            counter++;
          });

        }
      }).catch((err: any) => {
        reject(err);
      });
    });
  }
  /**
   * 获取救援队统计
   * @param opts
   * @param opts.point [Array]
   * @param opts.ranges [Array]  //[{level:"Ⅵ级", geometry:{}},{level:"Ⅶ级", geometry:{}}}
   */
  public getRescueTeamStat(opts: any) {
    // if (!opts.point) {
    //   const geoJson = opts.ranges[0].geometry;
    //   const geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geoJson, 4326);
    //   const center = geom.getBaryCenter();
    //   opts.point = [center.x, center.y];
    // }
    const resourceKey = 'RescueTeam※03';
    return new Promise((resolve, reject) => {
      const result: any = {};
      let counter = 0;
      try {
        for (const range of opts.ranges) {
          const level = range.level;
          const geometry = range.geometry;
          const param: any = {};
          param.typecode = resourceKey;
          param.dataA = geometry;
          param.point = opts.point;
          (window as any).EMapServerV2.queryservice.getCurrencyData(param, (data: any) => {
            result[level] = this.processRescueTeamData(data);
            if (counter === opts.ranges.length - 1) {
              resolve(result);
            }
            counter++;
          });
        }
      } catch (error) {
        reject(error);
      }

    });
  }
  /**
   * 获取区划人口统计
   * @param opts
   * @param opts.point [Array]
   * @param opts.ranges [Array]  //[{level:"Ⅵ级", geometry:{}},{level:"Ⅶ级", geometry:{}}}
   */
  public getRegionPopStat(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
      opts.districtCode = this.emapServiceFilter.root;
    }
    if (!opts.point) {
      const geoJson = opts.ranges[0].geometry;
      const geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geoJson, 4326);
      const center = geom.getBaryCenter();
      opts.point = [center.x, center.y];
    }
    const self = this;
    return new Promise((resolve, reject) => {
      const result: any = {};
      let counter = 0;
      for (const range of opts.ranges) {
        const level = range.level;
        const geometry = range.geometry;
        result[level] = {};
        const area: number = self.getArea(geometry);
        // result[level].totalArea = area;
        result[level].totalArea = 0;
        const param = {
          point: opts.point,
          geometry,
          level,
          baseURL: this.baseURL,
          districtCode: opts.districtCode,
        };
        self.getCountiesInfo(param).then((countyData: any) => {
          const countyCode: any = [];
          countyData.forEach((item: any) => {
            countyCode.push(item.tag.adcode);
            result[level].totalArea += item.tag.arear / 1000000;
          });
          result[param.level].countyCode = countyCode;
          result[param.level].countyCount = countyData.length;
          if (opts.districtCode === '370600' && JSON.stringify(geometry) === JSON.stringify(this.blankGeom)) {
            result[param.level].countyCount = 16;
          }
          self.getTownsInfo(param).then((townData: any) => {
            result[param.level].townCount = townData.length;
            self.bufferStatistics(param).then((data: any) => {
              result[param.level].population = data[0].POPU_DISTPOPU.POPTOTAL;
              result[param.level].populationDensity = parseFloat((result[param.level].population / result[param.level].totalArea).toFixed(3));
              result[param.level].totalArea = parseFloat(result[param.level].totalArea.toFixed(3));
              if (counter === opts.ranges.length - 1) {
                resolve(result);
              }
              counter++;
            }).catch((err1: any) => {
              reject(err1);
            });
          }).catch((err2: any) => {
            reject(err2);
          });
        }).catch((err3: any) => {
          reject(err3);
        });
      }
    });
  }
  // 获取区县信息
  public getCountiesInfo(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = '/api/public/dlgbouaxian/bypac/v1';
    const data: any = {
      returnXiangNum: !!opts.returnXiangNum,
      returnWKT: !!opts.returnWKT,
    };
    if (opts.point && opts.point.length) {
      const center = opts.point[0] + ' ' + opts.point[1];
      data.center = center;
    }
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    // if (!opts.notNeedXiangNum) { // 默认需要，当为true的时候，就是不需要
    //   data.returnXiangNum = true;
    // }
    // else if (JSON.stringify(opts.geometry) === JSON.stringify(this.blankGeom)) {
    //   delete data.polygon;
    // }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取乡镇信息
  public getTownsInfo(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = 'api/public/dlgbouaxiang/bypac/v1';
    // const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
    // const polygon = Geometry.asWkt();
    // const center = opts.point[0] + ' ' + opts.point[1];
    const data: any = {
      // polygon,
      // center,
      returnWKT: !!opts.returnWKT,
    };
    if (opts.point && opts.point.length) {
      const center = opts.point[0] + ' ' + opts.point[1];
      data.center = center;
    }
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    // if (JSON.stringify(opts.geometry) === JSON.stringify(this.blankGeom)) {
    //   delete data.polygon;
    // }
    // if (!opts.noneReturnWKT) { // 当为true时，不返回wkt
    //   data.returnWKT = true;
    // }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取村庄信息
  public getCunInfo(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = 'api/public/dlgboupCun/bypac/v1';
    // const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
    // const polygon = Geometry.asWkt();
    // const center = opts.point[0] + ' ' + opts.point[1];
    const data: any = {
      // polygon,
      // center,
      returnWKT: !!opts.returnWKT,
    };
    if (opts.point && opts.point.length) {
      const center = opts.point[0] + ' ' + opts.point[1];
      data.center = center;
    }
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    // if (JSON.stringify(opts.geometry) === JSON.stringify(this.blankGeom)) {
    //   delete data.polygon;
    // }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 人口统计
  public bufferStatistics(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    if (!opts.districtCode && this.emapServiceFilter && this.emapServiceFilter.root) {
      opts.districtCode = this.emapServiceFilter.root;
    }
    const queryservice = (window as any).EMapServerV2.queryservice;
    // if (JSON.stringify(opts.geometry) === JSON.stringify(this.blankGeom)) {
    //   opts.geometry = null;
    // }
    return new Promise((resolve, reject) => {
      try {
        // queryservice.bufferStatistics((data: any) => {
        //   resolve(data);
        // }, opts.geometry, opts.districtCode);
      } catch (error) {
        reject(error);
      }

    });
  }

  // 面积统计
  public areaStatistics(opts: any) {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        // 北半球 取默认的行政区划的geometry
        if (!opts.geometry) {
          this.emapServiceFilter = publishObjectPath.value.district;
          if (!opts.code && this.emapServiceFilter && this.emapServiceFilter.root) {
            opts.code = [this.emapServiceFilter.root];
          }
          this.getCityArea(opts).then(async (res: any) => {
            let area: number = 0;
            if (res.data.data.districtArea) {
              area = res.data.data.districtArea;
            } else {
              const optsKey = {
                pac: opts.code.join(','),
                keyWord: '',
                pageSize: 5,
                nowPage: 1,
                returnXiangNum: true,
              };
              const arearList: any = await self.getQxPageList(optsKey);
              arearList.list.forEach((item: any) => {
                area += (item.tag.arear / 1000000);
              });
            }
            resolve(area);
          });
        } else {
          const area: number = self.getArea(opts.geometry);
          resolve(area);
        }
      } catch (error) {
        reject(error);
      }

    });
  }

  // 地震区县影响
  /**
  * 地震区县影响 根据行政区划查询房屋数据
  * @param opts
  * @param opts.pac: "370672",
  * @returns {Promise}
  */
  public getEarthquakeHouseInfo(opts: any) {
    const url = '/api/earthquake/ear/district/house';
    return new Promise((resolve, reject) => {
      const rSerivce = new RequestServerClass({ baseURL: publishObjectPath.value.floodServerPath });
      rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }

  // 林火相关区县弹框私有内容
  /**
  * @param opts
  * @param opts.pac: "370672",
  * @returns {Promise}
  */
  public getForestFireDetail(opts: any) {
    const url = '/api/forestfire/district/info?districtCode=' + opts.districtCode;
    return new Promise((resolve, reject) => {
      const rSerivce = new RequestServerClass({ baseURL: publishObjectPath.value.floodServerPath });
      rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }

  // 震中设防烈度
  /**
  * 根据经纬度查询震中设防烈度
  * @param opts
  * @param opts.lat: ,
  * @param opts.lon: ,
  * @returns {Promise}
  */
  public getEarthquakeDistrictIntensity(opts: any) {
    const url = '/api/earthquake/ear/district/intensity';
    return new Promise((resolve, reject) => {
      const rSerivce = new RequestServerClass({ baseURL: publishObjectPath.value.floodServerPath });
      rSerivce.serverObj.post(url, opts).then((res: any) => {
        resolve(res.data);
      });
    });
  }

  // 获取行政区划的统计数据
  public getXzqhStatistics(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = '/api/public/getDlgBouaCount/bypac/v1';
    // const center = opts.point[0] + ' ' + opts.point[1];
    const data: any = {
      // center,
    };
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取市面积
  public getCityArea(opts: any) {
    const url = publishObjectPath.value.floodServerPath + 'api/earthquake/dlgbou/district/area?districtCode=' + opts.code[0];
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url).then((response: any) => {
        resolve(response);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取区县列表分页数据
  public getQxPageList(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = '/api/public/v1/page/dlgbouaxian';
    // const center = opts.point[0] + ' ' + opts.point[1];
    const data: any = {
      keyWord: opts.keyWord || '',
      pageSize: opts.pageSize || 5,
      nowPage: opts.nowPage || 1,
      returnXiangNum: !!opts.returnXiangNum,
      returnWKT: !!opts.returnWKT,
    };
    if (opts.point && opts.point.length) {
      data.center = opts.point[0] + ' ' + opts.point[1];
    }
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取乡镇列表分页数据
  public getTownPageList(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = '/api/public/v1/page/dlgbouaxiang';
    // const center = opts.point[0] + ' ' + opts.point[1];
    const data: any = {
      keyWord: opts.keyWord || '',
      pageSize: opts.pageSize || 5,
      nowPage: opts.nowPage || 1,
      returnWKT: !!opts.returnWKT,
    };
    if (opts.point && opts.point.length) {
      data.center = opts.point[0] + ' ' + opts.point[1];
    }
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取村庄列表分页数据
  public getCunPageList(opts: any) {
    this.emapServiceFilter = publishObjectPath.value.district;
    const self = this;
    if (!opts.pac && self.emapServiceFilter && self.emapServiceFilter.root) {
      opts.pac = self.emapServiceFilter.root;
    }
    const url = '/api/public/v1/page/dlgboupCun';
    // const center = opts.point[0] + ' ' + opts.point[1];
    const data: any = {
      keyWord: opts.keyWord || '',
      pageSize: opts.pageSize || 5,
      nowPage: opts.nowPage || 1,
      returnWKT: !!opts.returnWKT,
    };
    if (opts.point && opts.point.length) {
      data.center = opts.point[0] + ' ' + opts.point[1];
    }
    if (opts.pac) {
      data.pac = self.getMatchCode(opts.pac);
    }
    if (opts.geometry) {
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
      const polygon = Geometry.asWkt();
      data.polygon = polygon;
    }
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, data).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 地震方案烈度导出
  public getIntensityExport(opts: any) {
    if (opts.pac) {
      opts.pac = this.getMatchCode(opts.pac);
    }
    const url = publishObjectPath.value.floodServerPath + 'api/earthquake/scheme/intensity/export';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts, { responseType: 'blob' }).then((response: any) => {
        resolve(response);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 辅助决策物资模型导出
  public GetFileForSubstance(opts: any) {
    if (opts.pac) {
      opts.pac = this.getMatchCode(opts.pac);
    }
    const url = publishObjectPath.value.floodServerPath + 'api/earthquake/genFileByTemplate';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts, { responseType: 'blob' }).then((response: any) => {
        resolve(response);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  public getFileDownload(params: any) { // 地址速报
    const url = publishObjectPath.value.pushServerPath + '/flashReport/v1/genWordReport';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, params).then((response: any) => {
        resolve(response.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 根据缓冲区和行政区划统计影响区市人口总数
  public countyCountPromiseTotal(opts: any) {
    if (opts.pac) {
      opts.pac = this.getMatchCode(opts.pac);
    }
    const url = publishObjectPath.value.floodServerPath + 'api/earthquake/popu/xian/total';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }

  // 根据缓冲区和行政区划统计影响乡镇人口总数
  public townCountPromiseTotal(opts: any) {
    if (opts.pac) {
      opts.pac = this.getMatchCode(opts.pac);
    }
    const url = publishObjectPath.value.floodServerPath + 'api/earthquake/popu/xiang/total';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }

  // 根据缓冲区和行政区划统计影响村庄人口总数
  public cunCountPromiseTotal(opts: any) {
    if (opts.pac) {
      opts.pac = this.getMatchCode(opts.pac);
    }
    const url = publishObjectPath.value.floodServerPath + 'api/earthquake/popu/cun/total';
    return new Promise((resolve, reject) => {
      this.rSerivce.serverObj.post(url, opts).then((response: any) => {
        resolve(response.data.data);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }
  // 获取区县信息
  private getCountiesInfoOld(opts: any) {
    const queryservice = (window as any).EMapServerV2.queryservice;
    return new Promise((resolve, reject) => {
      try {
        queryservice._queryDistrictPolygon(opts.point, opts.geometry, (dataCounty: any) => {
          resolve(dataCounty);
        });
      } catch (error) {
        reject(error);
      }

    });
  }
  // 获取乡镇信息
  private getTownsInfoOld(opts: any) {
    const queryservice = (window as any).EMapServerV2.queryservice;
    return new Promise((resolve, reject) => {
      try {
        queryservice._queryTownPolygon(opts.baseURL, opts.point, opts.geometry, (dataTown: any) => {
          resolve(dataTown);
        });
      } catch (error) {
        reject(error);
      }

    });
  }
  // 获取资源查询配置
  private getResourceConfig() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (!this.resourceConfig) {
        const url = './json/oldserver/queryservice.json';
        this.localSerivce.serverObj.get(url).then((response: any) => {
          self.resourceConfig = response.data;
          resolve(self.resourceConfig);
        }).catch((err: any) => {
          reject(err);
        });
      } else {
        resolve(this.resourceConfig);
      }
    });
  }
  private getQueries(resourceKeys: any, config: any) {
    config = {
      config,
    };
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
  // 面积计算
  private getArea(geom: any) {
    const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(geom, '4326');
    const projectService = new g2.sfs.CoordinateTransform();
    const measureService = new g2.sfs.MeasureService({ projectService });
    const areatotal: number = measureService.area(Geometry);
    const areaData = (areatotal / 1000000);
    return areaData;
  }
  /**
     * 获取行政区划(多个)
     * @param opts
     * @param opts.code {Array}
     * @param opts.returnGeom {Boolean} 是否返回边界，默认为true
     */
  private getDistrictsByCodes(opts: any) {
    const httpRequest = new (G as any).base.HttpRequest();
    const service = new (G as any).servicev2.DistrictServiceImpl({
      httpRequest,
      url: publishObjectPath.value.emapService,
    });
    return service.getDistrict({
      code: opts.code,
      returnGeom: opts.returnGeom === false ? false : true,
    });
  }
  // 救援队信息处理
  private processRescueTeamData(data: any) {
    data = data['RescueTeam※03'];
    const total = data.length;
    const xiaofang: any = {}; // 消防
    const senfang: any = {}; // 森防
    const zhuanye: any = {}; // 专业
    xiaofang.title = '消防救援队';
    senfang.title = '森防救援队';
    zhuanye.title = '专业救援队';
    xiaofang.teamnum = 0;
    senfang.teamnum = 0;
    zhuanye.teamnum = 0;
    xiaofang.peoplenum = 0;
    senfang.peoplenum = 0;
    zhuanye.peoplenum = 0;
    for (const kk in data) {
      // 消防救援队  T003
      // 森林消防救援队T004
      if (data[kk].tag.rescuetypecode === 'T003') {
        xiaofang.teamnum++;
        xiaofang.peoplenum += data[kk].tag.peoplenum;
      } else if (data[kk].tag.rescuetypecode === 'T004') {
        senfang.teamnum++;
        senfang.peoplenum += data[kk].tag.peoplenum;
      } else {
        zhuanye.teamnum++;
        zhuanye.peoplenum += data[kk].tag.peoplenum;
      }
    }

    const final: any = {};
    final.data = [xiaofang, senfang, zhuanye];
    final.total = total;
    return final;
  }
  private getMatchCode(districtCode: string) {
    const code = districtCode.replace(/(0+)$/g, '').replace(/,/g, '|');
    return code;
  }

}

