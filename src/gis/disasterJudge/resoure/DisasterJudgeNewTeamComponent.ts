import Util from '../../Util';
import SymbolMap from './SymbolMap';
import { realtimeTeam } from '@/api/installServer';
// import { DisasterRealTimeTeamDealDatas } from './disasterRealTimeTeamDealData';
import DisasterRealTimeTeamDealDatas from './DisasterJudgeRealTimeTeamComponent';
/**
 * 灾情研判单类资源展示
 */

const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    // 资源类型
    type: null,
    map: null,
    service: null,
    eventInfo: null,
    symbolConfig: null,
    peoplePolyGon: null,
    popupId: 'disasterJudge_resource_popup', // 弹窗唯一标识
    highLightId: 'disasterJudge_resource_hl', // 高亮id
    fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id
    disasterRealTimeTeamDealData: null,
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    // do sth
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.featureTypeSet = {};
    //
    this.dataCol = {};
    this.forwarddataCol = {};
    this.highlightids = [];
  },
  /**
  * 加载数据
  * @param typeArr
  */
  load(typeArr: any, forward: any, geo?: any) {
    if (this.options.disasterRealTimeTeamDealData) { // 清除上次的定时器
      this.options.disasterRealTimeTeamDealData.clearRealTimeTeamInterval();
    }
    if (!this.options.disasterRealTimeTeamDealData) {
      this.options.disasterRealTimeTeamDealData = new DisasterRealTimeTeamDealDatas();
    }
    componentBase.prototype.load.call(this);
    this.map.setClusterScatter(false);
    // do sth
    this.dataCol = {};
    this.forwarddataCol = {};
    return this._loadDataCol(typeArr, forward, geo);
  },
  unload() {
    console.debug('unload');
    this.clear();
    this.dataCol = {};
    this.forwarddataCol = {};
    this.highlightids = [];
    //
    componentBase.prototype.unload.call(this);
    if (this.options.disasterRealTimeTeamDealData) {
      this.options.disasterRealTimeTeamDealData.clearRealTimeTeamInterval();
    }
  },

  /**
   * 显示对应级别的数据
   * @param type 资源类型
   * @param levelArr
   * @param forward 是否前突
   */
  showResource(typeArr: any, levelArr: string[], forward: boolean, geom?: any) {
    const self = this;
    if (this.options.disasterRealTimeTeamDealData) { // 清除上次的定时器
      this.options.disasterRealTimeTeamDealData.clearRealTimeTeamInterval();
    }
    if (!this.options.disasterRealTimeTeamDealData) {
      this.options.disasterRealTimeTeamDealData = new DisasterRealTimeTeamDealDatas();
    }
    if (geom) {
      this._getDataColByGeo(typeArr, geom).then((dataCol: any) => {
        dataCol.list = self._classTeamData(dataCol.list);
        typeArr.forEach(async (type: any) => {
          if (dataCol.list[type]) {
            const dataCol1 = JSON.parse(JSON.stringify(dataCol));
            dataCol1.list = dataCol.list[type];
            const level = '6';
            this._addResource(type, level, dataCol1, forward);
          }
        });
      });
    } else {
      const levelMap: any = {
        Ⅴ: 5,
        Ⅵ: 6,
        Ⅶ: 7,
        Ⅷ: 8,
        Ⅸ: 9,
      };
      levelArr.forEach(async (item) => {
        if (levelMap[item]) {
          item = levelMap[item];
        }
        const dataCol = await this._getDataCol(typeArr, item, forward);
        dataCol.list = this._classTeamData(dataCol.list);
        const index = typeArr.indexOf('T003');
        if (index !== -1) {
          typeArr.splice(index, 1);
          typeArr.push('T003');
        }
        const index1 = typeArr.indexOf('T004');
        if (index1 !== -1) {
          typeArr.splice(index1, 1);
          typeArr.push('T004');
        }
        typeArr.forEach(async (type: any) => {
          if (dataCol.list[type]) {
            const dataCol1 = JSON.parse(JSON.stringify(dataCol));
            dataCol1.list = dataCol.list[type];
            this._addResource(type, item, dataCol1, forward);
          }
        });
        // []
      });
    }

    // this._adjustView(levelArr);
    this._adjustView(); // 恢复到以前的状态
  },
  /**
   * 查询救援队伍列表
   * @param optt 查询列表
   */
  getDataList(optt: any, forward: any, geom?: any) {
    if (geom) {
      return this.getDataListByGeo(optt, geom);
    } else {
      return new Promise((resolve, reject) => {
        const ranges = this.options.eventInfo.getRanges();
        const point = this.options.eventInfo.getPoint();
        const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
        const selectranges: any = {};
        const keyWord = optt.keyWord;
        const typeArr = optt.typeArr;
        let levelArr = optt.levelArr;
        const pageSize = optt.pageSize ? optt.pageSize : 5;
        const pageIndex = optt.pageIndex ? optt.pageIndex : 1;
        let geometry: any = null;
        const dataCol = { total: 0, list: [] };
        // 修改串行查询为并行
        let finishCount = 0;
        const queryCallback = (dataObj: any, idx: any, maxlength: any) => {
          finishCount++;
          dataCol.total += dataObj.total;
          dataCol.list = dataCol.list.concat(dataObj.list);
          if (finishCount === levelArr.length) {
            const compare = function(a: any, b: any) {
              return (a._distance < b._distance) ? -1 : 0;
            };
            const beforeSorted = dataCol.list;
            const sortedData = beforeSorted.sort(compare);
            if (sortedData.length > maxlength) {
              sortedData.length = maxlength;
            }
            dataCol.list = sortedData;
            resolve(dataCol);
          }
        };
        levelArr = levelArr.map((ele: any) => {
          return ele + '';
        });
        switch (rangeType) {
          case '0': // 经验圈，取选中的
            for (const item of ranges) {
              if (item.level + '' === levelArr[0]) {
                geometry = item.geometry;
                if (geometry.coordinates.length > 0) {
                  geometry = {
                    type: 'Polygon',
                    coordinates: [geometry.coordinates[0]],
                  };
                }
              }
            }
            break;
          case '1': // 烈度圈，合并
            geometry = null;
            const geomArr = [];
            const labelArr = [];
            for (const range of ranges) {
              if (levelArr.includes(range.level + '')) {
                selectranges[range.level + ''] = range.geometry;
                geomArr.push(range.geometry);
                labelArr.push(range.level + '');
              }
            }
            geometry = G.utils.SpatialOPUtil.unionGeometry(geomArr);
            levelArr = [labelArr.join(',')];
            break;
        }

        let index: any = 0;
        levelArr.forEach(async (level: any) => {
          let tmpgeometry: any = null;
          if (geometry.coordinates.length > 0) {
            tmpgeometry = geometry;
          } else {
            tmpgeometry = selectranges[level];
          }
          const opts = {
            point,
            rescueTypecodes: typeArr,
            level,
            geometry: tmpgeometry,
            pageSize,
            pageIndex,
          };
          if (keyWord && keyWord !== '') {
            (opts as any).keyWord = [keyWord];
          }
          const indexTemp: any = index;
          if (forward) {
            const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
            const polygon = Geometry.asWkt();
            (opts as any).geometry = polygon;
            (opts as any).nowPage = pageIndex;
            if (!typeArr || typeArr.length === 0) {
              (opts as any).rescueTypecodes = ['T003', 'T004'];
            }
            if (keyWord && keyWord !== '') {
              (opts as any).keyWord = keyWord;
            }
            this.options.service.getForwardRescueTeamDataList(opts).then((dataObj: any) => {
              queryCallback(dataObj.data, indexTemp, pageSize);
            });
          } else {
            this.options.service.getRescueTeamDataList(opts).then((dataObj: any) => {
              queryCallback(dataObj, indexTemp, pageSize);
            });
          }
          index++;
        });
      });
    }
  },
  getDataListByGeo(optt: any, geom: any) {
    return new Promise((resolve, reject) => {
      const keyWord = optt.keyWord;
      const typeArr = optt.typeArr;
      const pageSize = optt.pageSize ? optt.pageSize : 5;
      const pageIndex = optt.pageIndex ? optt.pageIndex : 1;
      const dataCol = { total: 0, list: [] };
      const point = this.options.eventInfo.getPoint();
      let finishCount = 0;
      const queryCallback = (dataObj: any, idx: any, maxlength: any) => {
        finishCount++;
        dataCol.total += dataObj.total;
        dataCol.list = dataCol.list.concat(dataObj.list);
        const compare = function(a: any, b: any) {
          return (a._distance < b._distance) ? -1 : 0;
        };
        const beforeSorted = dataCol.list;
        const sortedData = beforeSorted.sort(compare);
        if (sortedData.length > maxlength) {
          sortedData.length = maxlength;
        }
        dataCol.list = sortedData;
        resolve(dataCol);
      };
      const opts = {
        point,
        rescueTypecodes: typeArr,
        geometry: geom,
        pageSize,
        pageIndex,
      };
      if (keyWord && keyWord !== '') {
        (opts as any).keyWord = [keyWord];
      }
      this.options.service.getRescueTeamDataList(opts).then((dataObj: any) => {
        queryCallback(dataObj, 0, pageSize);
      });
    });

  },
  /**
  * 隐藏对应级别的数据
  * @param typeArr 资源类型
  * @param levelArr
  */
  hideResource(typeArr: any, levelArr: string[], forward: any) {
    if (this.options.disasterRealTimeTeamDealData) {
      this.options.disasterRealTimeTeamDealData.clearRealTimeTeamInterval();
    }
    if (!levelArr) {
      this._removeResource(typeArr);
    } else {
      levelArr.forEach((item) => {
        this._removeResource(typeArr, item, forward);
      });
    }
    // 隐藏的同时,清除弹窗及高亮
    this.closePopup();
    this.hideHighlight();
  },


  clear() {
    this._clearLayers();
    this.closePopup();
  },

  /**
   * 加载数据
   * @param typeArr
   */
  _loadDataCol(typeArr: any, forward: any, geo?: any) {
    return new Promise(async (resolve, reject) => {
      const result: any = [];
      // for (const type of typeArr) {
      if (!typeArr) {// 前突所有
        typeArr = ['T003', 'T004'];
        const dataCol = await this._loadTypeDataCol(typeArr, forward);
        this.forwarddataCol = dataCol;
        result.push(dataCol);
      } else {
        const dataCol = await this._loadTypeDataCol(typeArr, forward, geo);
        this.dataCol = dataCol;
        result.push(dataCol);
      }
      // }
      resolve(result);
    });
  },

  _loadTypeDataCol(typeArr: any, forward: any, geo?: any) {
    return new Promise(async (resolve, reject) => {
      const ranges = this.options.eventInfo.getRanges();
      const point = this.options.eventInfo.getPoint();
      const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
      let dataCol = {};
      const dataList = new Array(ranges.length);
      let total = 0;
      const countArr: any = [];
      // 修改串行查询为并行
      let finishCount = 0;
      const queryCallback = (item: any, dataObj: any, idx: any) => {
        dataObj.count = dataObj.teamnum;
        dataObj.level = item.level;
        dataObj.title = item.title;
        total += dataObj.count;
        countArr.push(dataObj.count);
        dataList[idx] = dataObj;
        finishCount++;
        if (finishCount === ranges.length) {
          if (rangeType === '0') {
            total = Math.max.apply(null, countArr);
          }
          dataCol = {
            total,
            data: dataList,
          };
          resolve(dataCol);
        }
        if (geo) {
          dataCol = {
            total,
            data: dataObj,
          };
          resolve(dataCol);
        }
      };
      if (geo) {
        const opts = {
          rescueTypecodes: typeArr,
          level: 0,
          geometry: geo,
        };
        // this.options.service.getRescueTeamTypeStatistics(opts).then((dataObj: any) => {
        //   queryCallback('', dataObj, '');
        // });
        return;
      }
      let index: any = 0;
      for (const item of ranges) {
        const opts = {
          rescueTypecodes: typeArr,
          level: item.level,
          geometry: item.geometry,
        };
        const indexTemp: any = index;
        if (typeArr) {
          if (forward) {
            const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
            const polygon = Geometry.asWkt();
            (opts as any).geometry = polygon;
            this.options.service.getForwardRescueTeamTypeStatistics(opts).then((dataObj: any) => {
              queryCallback(item, dataObj, indexTemp);
            });
          } else {
            // this.options.service.getRescueTeamTypeStatistics(opts).then((dataObj: any) => {
            //   queryCallback(item, dataObj, indexTemp);
            // });
          }
        } else {
          const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, '4326');
          const polygon = Geometry.asWkt();
          (opts as any).geometry = polygon;
          this.options.service.getForwardRescueTeamTypeStatistics(opts).then((dataObj: any) => {
            queryCallback(item, dataObj, indexTemp);
          });
        }
        index++;
      }
    });
  },
  _addResource(type: any, level: any, dataCol: any, forward: boolean) {
    const featureType = this._getFeatureType(type, level, forward);
    // console.log('RescueTeam※03');
    if (type === 'T003' || type === 'T004') {
      this.forward = forward;
      if (forward) {
        this.options.disasterRealTimeTeamDealData.load(dataCol, type, this.simpleRenderMgr, featureType, dataCol.list, this);
        dataCol = this.options.disasterRealTimeTeamDealData.deallTeam(dataCol);
      }
    }
    const self = this;
    let symbolMapper: any = null;
    // if (SymbolMap[type]) {
    symbolMapper = SymbolMap['RescueTeam※03'];
    // } else {
    //   symbolMapper = SymbolMap.default;
    // }
    this.currrentRescueTeamData = null;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        let symbolObj: any = null;
        symbolObj = Util.toJSON(symbolMapper.symbol);
        data = this._rescueTeamTrans(data);
        // if (forward) {
        if (data.notReadCount && data.notReadCount > 0) {
          symbolObj = Util.toJSON(symbolMapper.fwSymbolReal(type, data, 'teamtypecode'));
        } else {
          symbolObj = Util.toJSON(symbolMapper.fwSymbol(type, data, 'teamtypecode'));
          if (data.rescuetypecode === 'T004') {
            symbolObj = Util.toJSON(symbolMapper.countrySymbol);
          }
        }
        // }
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(type, data, 'teamtypecode')];
        return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType,
      featureName: dataCol.layerName,
      idField: '_id',
      list: dataCol.list,
      type: 0,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const dataObj = data[0];
          this._clearPopup(dataObj.featureType);
          const layer = this.simpleRenderMgr.getLayer(dataObj.featureType);
          const element: any = dataObj.element;
          let attributeName: string = '';
          const attribute = element.attributeSet.attributes;
          const attrObj: any = Util.attributeSet2Object(element.attributeSet);
          if (attribute) {
            let elementitem: any = null;
            for (const n of Object.keys(attribute)) {
              const attributeitem = attribute[n].name;
              if (attributeitem === 'name') {
                attributeName = attribute[n].value;
              }
            }
            this.simpleRenderMgr.visitFeature(dataObj.featureType,
              {
                visit: (ele: any, layerTmp: any) => {
                  if (ele.id === element.id && attributeName.indexOf('（前突）') !== -1) {
                    elementitem = ele;
                    return false;
                  }
                  return true;
                },
              },
            );
            this.currrentRescueTeamData = elementitem || null;
            let updatelist: any = null;
            for (const m of Object.keys(dataCol.list)) {
              const listid = dataCol.list[m].id || dataCol.list[m]._id;
              if (listid === element.id) {
                dataCol.list[m].notReadCount = 0;
                updatelist = [dataCol.list[m]];
                attrObj.notReadCount = 0;
              }
            }
            if (elementitem) {
              this.simpleRenderMgr.update({// 更新图标
                featureType: dataObj.featureType,
                list: updatelist,
              });
            }
          }
          this._addPopup(dataObj.featureType, element, false);
          //
          this._showHighlight(type, [element.geometry.x, element.geometry.y], attrObj);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[featureType] = true;
    // this.simpleRenderMgr.visitFeature(featureType,
    //   {
    //       visit: (ele: any, layerTmp: any) => {
    //         const attribute = ele.attributeSet.attributes;
    //         const attrObj: any = Util.attributeSet2Object(ele.attributeSet);
    //         if (ele.attributeSet.attributes[9].value.indexOf('forwardReal') !== -1) {
    //               this._blinkHightlight(type, [ele.geometry.x, ele.geometry.y], attrObj);
    //           }
    //       },
    //   },
    // );
  },

  _removeResource(typeArr: any, level: any, forward: any) {
    typeArr.forEach(async (type: any) => {
      if (!level) {
        for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
          if (featureTypeKey.indexOf(type) !== -1) {
            this.simpleRenderMgr.remove(featureTypeKey);
            delete this.featureTypeSet[featureTypeKey];
          }
        }
      } else {
        const featureType = this._getFeatureType(type, level, forward);
        this.simpleRenderMgr.remove(featureType);
        delete this.featureTypeSet[featureType];
      }
    });
  },

  _getFeatureType(type: any, level: any, forward: any) {
    const featureType = `disaster_team__${type}__${level}__${forward}`;
    return featureType;
  },

  _getTypeByFeatureType(featureType: any) {
    return featureType.split('__')[1];
  },

  _getDataCol(typeArr: any, level: any, forward: boolean) {
    return new Promise(async (resolve, reject) => {
      const ranges = this.options.eventInfo.getRanges();
      const point = this.options.eventInfo.getPoint();
      const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
      for (const item of ranges) {
        if (item.level.toString() === level.toString()) {
          const optMap = {
            point,
            level: item.level,
            geometry: item.geometry,
            fields: ['name', 'rescuetypecode', 'peoplenum'],
            rescueTypecodes: typeArr,
          };
          if (forward) {
            const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(optMap.geometry, '4326');
            const polygon = Geometry.asWkt();
            (optMap as any).geometry = polygon;
            if (!typeArr || typeArr.length === 0) {
              (optMap as any).rescueTypecodes = ['T003', 'T004'];
            }
            this.options.service.getForwardRescueTeamMapData(optMap).then((data: any) => {
              resolve(data);
            });
          } else {
            this.options.service.getRescueTeamMapData(optMap).then((data: any) => {
              resolve(data);
            });
          }
        }
      }
    });
  },
  _getDataColByGeo(typeArr: any, geo: any) {
    return new Promise(async (resolve, reject) => {
      const optMap = {
        geometry: geo,
        fields: ['name', 'rescuetypecode', 'peoplenum'],
        rescueTypecodes: typeArr,
      };
      this.options.service.getRescueTeamMapData(optMap).then((data: any) => {
        resolve(data);
      });
    });
  },
  _adjustView(levelArr: any) {
    let currentLevelArr = levelArr;
    if (!currentLevelArr) {
      currentLevelArr = this.options.levelArr;
    }
    if (currentLevelArr) {
      const ranges = this.options.eventInfo.getRangesByLevel(currentLevelArr);
      const type = this.options.eventInfo.getCurrentRangeType();
      let geometry: any = null;
      switch (type) {
        case 0: // 经验圈，取最大的
          geometry = ranges[ranges.length - 1].geometry;
          if (geometry.coordinates.length > 0) {
            geometry = {
              type: 'Polygon',
              coordinates: [geometry.coordinates[0]],
            };
          }
          break;
        case 1: // 烈度圈，合并
          geometry = {
            type: 'MultiPolygon',
            coordinates: [],
          };
          for (const range of ranges) {
            geometry.coordinates.push([range.geometry.coordinates[0]]);
          }
          break;
      }
      if (geometry && geometry.coordinates.length > 0) {
        this.featureLocate.fit({
          type: 'geojson',
          geom: geometry,
        }, {
          maxZoom: this.map.getZoomLevel(),
        });
      }
    } else {
      if (this.options.eventInfo.getMaxRangeGeometry()) {
        this.featureLocate.fit({
          type: 'geojson',
          geom: this.options.eventInfo.getMaxRangeGeometry(),
        }, {
          maxZoom: this.map.getZoomLevel(),
        });
      }

    }
  },

  /**
   * 显示资源的弹框
   * @param type 资源类型school
   * @param id 资源id
   */
  openPopup(type: any, id: any) {
    this._clearPopup();
    let element: any = null;
    let featureType: any = null;
    for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
      const layer = this.simpleRenderMgr.getLayer(featureTypeKey);
      this.simpleRenderMgr.visitFeature(featureTypeKey,
        {
          visit: (ele: any, layerTmp: any) => {
            if (ele.id === id) {
              element = ele;
              return false;
            }
            return true;
          },
        },
      );
      // element = layer.find(id);
      if (element) {
        featureType = featureTypeKey;
        break;
      }
    }
    if (element) {
      const attrObj: any = Util.attributeSet2Object(element.attributeSet);
      if (attrObj.notReadCount > 0) {
        attrObj.notReadCount = 0;
        this.simpleRenderMgr.update({// 更新图标
          featureType, // 图层名
          list: [attrObj], // 需要更新的element,必须是数组
        });
      }
      this._addPopup(featureType, element);
      this._showHighlight(type, [element.geometry.x, element.geometry.y], attrObj);
    }
    // 弹出框，视野定位，高亮
    console.log(' showPopup ', ' type = ' + type, ' id = ' + id);
  },
  /**
   * 清除弹出框
   */
  closePopup() {
    // console.log(' clearPopup ');
    this.hideHighlight();
    this._clearPopup();
  },

  /**
   *
   * @param featureType
   * @param element
   * @param noneMouseClick 是否非地图点击触发
   */
  _addPopup(featureType: any, element: any, noneMouseClick: any = true) {
    const geometry = element.geometry;
    const popupOptions: any = {
      id: this.options.popupId,
      anchor: [geometry.x, geometry.y],
      className: '',
    };
    if (noneMouseClick) {
      // 点击列表触发时，设置自动调整视野的延迟
      popupOptions.autoPanTimeout = 1200;
    }
    this.popupManager.clear();
    this.popupManager
      .addSimple(popupOptions)
      .then((content: any) => {
        const attrObj = Util.attributeSet2Object(element.attributeSet);
        // 处理坐标，属性名统一为x y，提供周边查询、路径规划使用
        attrObj.x = attrObj.geom.coordinates[0];
        attrObj.y = attrObj.geom.coordinates[1];
        const type: any = this._getTypeByFeatureType(featureType);
        const optDetail = {
          id: attrObj._id,
        };
        this.options.service.getDetailInfo(optDetail).then((data: any) => {
          (data as any).forward = this.forward;
          this.fire(this.options.fireAddPopupEventId, {
            featureType,
            type: 'allRealTeamPopup',
            data,
            content,
          });
        });
        // 设置周边查询当前要素
        // const symbolMapper: any = this._getSymbolMapper(type);
        // this.options.nearbyQuery.setTargetFeature({
        //   type,
        //   featureType,
        //   data: attrObj,
        //   symbol: G.utils.RenderUtil.object2Symbol(Util.toJSON(symbolMapper.hlSymbol)),
        // });
      });
  },

  _clearPopup(type: any) {
    if (this.popupManager) {
      this.popupManager.remove(this.options.popupId);
    }
  },


  _clearLayers() {
    for (const key of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(key);
      delete this.featureTypeSet[key];
    }
  },

  /**
   * 根据分析圈重新调整地图视野
   * @param id 分析圈index
   */
  _fitMapFromGeoJson(id: string) {
    const geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(
      this.options.peoplePolyGon[id],
    ).asWkt();
    const sim = {
      type: 'wkt',
      geom,
    };
    this.featureLocate.fit(sim);
  },

  _rescueTeamTrans(data: any) {
    let teamtypecode = '';
    const teamname = data.name;
    const rescuetypecode = data.rescuetypecode;
    teamtypecode = rescuetypecode;
    if ((rescuetypecode === 'T003' || rescuetypecode === 'T004')) {
      if (teamname.indexOf('（前突）') !== -1) {
        if (data.notReadCount && data.notReadCount > 0) {
          teamtypecode += 'forwardReal';
        } else {
          teamtypecode += 'forward';
        }

      }
    }
    data.teamtypecode = teamtypecode;
    return data;
  },
  _classTeamData(data: any) {
    // 拆分数据类型
    const maps = [];
    const dest = {};
    // const citydest = [];
    if (!!data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const ai = data[key];
          // const ai = data[i];
          if (!!ai.rescuetypecode) {
            const rescuetypecode = ai.rescuetypecode; // 省
            if (maps.indexOf(rescuetypecode) < 0) {
              (dest as any)[rescuetypecode] = [ai];
              maps.push(rescuetypecode);
            } else {
              for (const dj of Object.keys(dest)) {
                const rescuetypecode1 = ai.rescuetypecode;
                if (dj === rescuetypecode1) {
                  (dest as any)[dj].push(ai);
                }
              }
            }
          }
        }
      }
    }
    // 分好的组
    return dest;
  },
  _getSymbolMapper(type: any) {
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    return symbolMapper;
  },
  /**
   * 根据经纬度高亮
   * @param Type 类型
   * @param coordinate 经纬度数组
   * @param data
   */
  _showHighlight(Type: string, coordinate: number[], data: any) {
    let symbolObj: any = null;
    const symbolMapper: any = this._getSymbolMapper('RescueTeam※03');
    symbolObj = Util.toJSON(symbolMapper.hlSymbol);
    data = this._rescueTeamTrans(data);
    if (data.teamtypecode.indexOf('forward') > -1) {
      symbolObj = Util.toJSON(symbolMapper.fwHlSymbol(Type, data, 'teamtypecode'));
    }
    if (data.teamtypecode.indexOf('T004forward') > -1) {
      symbolObj = Util.toJSON(symbolMapper.shlSymbol);
    }
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(Type, data, 'teamtypecode')];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
      },
      style: symbolObj,
      // 不闪烁
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },
  _blinkHightlight(Type: string, coordinate: number[], data: any) {
    let symbolObj: any = null;
    const symbolMapper: any = this._getSymbolMapper('RescueTeam※03');
    symbolObj = Util.toJSON(symbolMapper.hlSymbol);
    data = this._rescueTeamTrans(data);
    if (data.rescuetypecode === 'T004') {
      symbolObj = Util.toJSON(symbolMapper.sfhlSymbol);
    }
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(data.rescuetypecode, data, 'teamtypecode')];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
      },
      style: symbolObj,
      // 闪烁
      blink: {
        interval: 500,
        duration: 60000,
      },
    };
    this.featureHighlight.removeHighlight(data._id);
    this.featureHighlight.addHighlight(data._id, options);
    this.highlightids.push(data._id);
  },
  // 隐藏高亮
  hideHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
    this.highlightids.forEach((highlightid: any) => {
      this.featureHighlight.removeHighlight(highlightid);
    });
    this.highlightids = [];
  },
  // 根据id删除某个队伍的闪烁
  stopTeamBlink(id: string) {
    if (this.highlightids && this.highlightids.length > 0) {
      this.highlightids.forEach((highlightid: any) => {
        if (id === highlightid) {
          this.featureHighlight.removeHighlight(highlightid);
        }
      });
    }
  },
  getRealTeamLon(id: string): any {
    return new Promise(async (resolve, reject) => {
      const lastData = {};
      const endTime = this.timeChange(new Date().getTime());
      const startTime = this.timeChange(new Date().getTime() - 86400000 * 23);
      const obj = {
        startTime,
        endTime,
        teamIdArray: [id],
      };
      realtimeTeam.getEquipmentListServer(obj).then((res: any) => {
        if (res.code === 0) {
          const dataArr = res.data;
          if (dataArr.length > 0) {
            const dataArri = dataArr[dataArr.length - 1];
            (lastData as any).longitude = dataArri.longitude * 1;
            (lastData as any).latitude = dataArri.latitude * 1;
          }
        }
        resolve(lastData);
      });
    });
  },
  // 定位中心
  _locationCenter(element: any) {
    this.featureLocate.fit({
      type: 'wkt',
      geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
    });
  },
  /*时间转化类型*/
  timeChange(dates: any) {
    const date = new Date(dates);
    const year: any = date.getFullYear();
    let mouth: any = date.getMonth() + 1;
    mouth = mouth < 10 ? '0' + mouth : mouth;
    let days: any = date.getDate();
    days = days < 10 ? '0' + days : days;
    let hours: any = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let sconds: any = date.getSeconds();
    sconds = sconds < 10 ? '0' + sconds : sconds;
    let miniuts: any = date.getMinutes();
    miniuts = miniuts < 10 ? '0' + miniuts : miniuts;
    const str =
      year +
      '-' +
      mouth +
      '-' +
      days +
      ' ' +
      hours +
      ':' +
      sconds +
      ':' +
      miniuts;
    return str;
  },
  // 实时轨迹标注
  getRealTimeTeamPoi(id: string, data: any, startTime: any) {
    this.getRealTimeTeamPoiInterval = setInterval(() => {
      this._getRealTimeTeamPoi(id, data, startTime);
    }, 60000);
  },
  _getRealTimeTeamPoi(id: string, data: any, startTime: any) {
    const endTime = this.timeChange(new Date().getTime());
    // 实时轨迹图层
    let realLayer: any = null;
    if (this.map.findLayer('realtimerouteLayer')) {
      realLayer = this.map.findLayer('realtimerouteLayer');
    } else {
      realLayer = new g2.carto.ElementLayer({
        id: 'realtimerouteLayer',
        name: '实时轨迹图层',
      });
      this.map.addLayer(realLayer);
    }
    realLayer.clear();
    const obj1 = {
      teamIdArray: [id],
    };
    realtimeTeam.getEquipmentListServer(obj1).then((res: any) => {
      if (res.code === 0 && res.data.length > 0) {
        const souceAddr = res.data[0].souceAddr;
        const objdata = {
          type: '1',
          souceAddr,
          startTime,
          endTime,
        };
        realtimeTeam.getEquipmentHistoryServer(objdata).then((res1: any) => {
          if (res1.code === 0 && res1.data.length > 0) {
            const dataArr = res1.data;
            const polylineSymbol = new g2.sfs.SimpleLineSymbol({
              width: 10,
              style: 1,
              color: new g2.sfs.Color({ a: 255, r: 96, g: 96, b: 255 }),
            });
            const polyline = new g2.sfs.Polyline({
              spatialReference: this.map.spatialReference,
            });
            const path = new g2.sfs.Path({
              spatialReference: this.map.spatialReference,
            });
            if (dataArr.length > 0) {
              const endpoint = new g2.sfs.Point({
                x: dataArr[dataArr.length - 1].longitude * 1,
                y: dataArr[dataArr.length - 1].latitude * 1,
                spatialReference: this.map.spatialReference,
              });
              // 触发更新 路径导航
              // todo 触发更新 路径导航
              this.options.routerPlan.queryPoint({ lon: endpoint.x, lat: endpoint.y }, 0);
              for (let i = dataArr.length - 1; i >= 0; --i) {
                const point1 = new g2.sfs.Point({
                  x: dataArr[i].longitude * 1,
                  y: dataArr[i].latitude * 1,
                  spatialReference: this.map.spatialReference,
                });
                path.addPoint(point1);
              }
              // path.addPoint(point);
              polyline.addGeometry(path);
              realLayer.add(new g2.sfs.Element({ geometry: polyline, symbol: polylineSymbol }));
            }
          }
        });
      }
    });
  },
  clearRealTimeLayer() {
    let realLayer: any = null;
    if (this.map.findLayer('realtimerouteLayer')) {
      realLayer = this.map.findLayer('realtimerouteLayer');
    } else {
      realLayer = new g2.carto.ElementLayer({
        id: 'realtimerouteLayer',
        name: '实时轨迹图层',
      });
      this.map.addLayer(realLayer);
    }
    realLayer.clear();
    if (this.getRealTimeTeamPoiInterval) {
      clearInterval(this.getRealTimeTeamPoiInterval);
      this.getRealTimeTeamPoiInterval = null;
    }
  },
});
export default component;
