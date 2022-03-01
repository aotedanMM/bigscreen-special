import Util from '../../Util';
import SymbolMap from './SymbolMap';
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
    popupId: 'equip_popup', // 弹窗唯一标识
    highLightId: 'equip_hl', // 高亮id
    fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id
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
  },
  /**
  * 加载数据
  * @param typeArr 物资类型[1,2,3,4,5]
  */
  load(typeArr: any) {
    componentBase.prototype.load.call(this);
    // do sth
    this.dataCol = {};
    // return this._loadDataCol(typeArr);
  },
  unload() {
    console.debug('unload');
    this.clear();
    this.dataCol = {};
    //
    componentBase.prototype.unload.call(this);
  },

  /**
   * 显示对应级别的数据
   * @param type 资源类型
   * @param levelArr
   */
  async showResource(typeArr: any) {
    const dataCol = await this._getDataCol(typeArr);
    if (dataCol) {
       const dataCol1 = JSON.parse(JSON.stringify(dataCol));
       this._addResource(typeArr[0], dataCol1);
    }
    // this._adjustView(levelArr);
    this._adjustView(); // 恢复到以前的状态
  },
  async getStatics(typeArr: any) {
    return await this._loadDataCol(typeArr);
  },
  /**
   * 查询储备库列表
   * @param optt 查询列表
   */
  getDataList(optt: any) {
    return new Promise((resolve, reject) => {
      const ranges = this.options.eventInfo.getRanges();
      const typeArr = optt;
      const dataCol = {total: 0, list: []};
      const queryCallback = (dataObj: any ) => {
        const dataLast: any = dataObj.data;
        for (const item of dataLast) {
          item._distance = (item.distance / 1000).toFixed(2);
        }
        resolve(dataLast);
      };
      const opts = {
            center: this.options.eventInfo.getPoint()[0] + ' ' +
            this.options.eventInfo.getPoint()[1],
            equiptypecode: typeArr,
            polygon: '',
          };
      const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(ranges[0].geometry, '4326');
      const polygon = Geometry.asWkt();
      opts.polygon = polygon;
      this.options.service.getequiplist(opts).then((dataObj: any) => {
            queryCallback(dataObj);
          });
    });
  },
  /**
  * 隐藏对应级别的数据
  * @param typeArr 资源类型
  * @param levelArr
  */
  hideResource(typeArr: any, levelArr: string[]) {
    if (!levelArr) {

      this._removeResource(typeArr);
    } else {
      levelArr.forEach((item) => {
        this._removeResource(typeArr, item);
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
  _loadDataCol(typeArr: any) {
    return new Promise(async (resolve, reject) => {
      const result: any = [];
      const dataCol = await this._loadTypeDataCol(typeArr);
      this.dataCol = dataCol;
      result.push(dataCol);
      // }
      resolve(result);
    });
  },
// 物资统计
  _loadTypeDataCol(typeArr: any) {
    return new Promise(async (resolve, reject) => {
      let ranges = this.options.eventInfo.getRanges();
      const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
      let dataCol = {};
      let dataList = new Array(ranges.length);
      let total = 0;
      const countArr: any = [];
      // 修改串行查询为并行
      let finishCount = 0;
      const queryCallback = (item: any, dataObj: any, idx: any) => {
        for (const dd of dataObj) {
          total += dd.count;
        }
        dataObj.count = total;
        dataObj.level = item.level;
        dataObj.title = item.title;
        countArr.push(dataObj.count);
        dataList[idx] = dataObj;
        finishCount ++;
        if (finishCount === ranges.length) {
          if (rangeType === '0') {
            total = Math.max.apply(null, countArr);
          }
          dataCol = {
            total,
            data: dataList,
          };
          resolve(dataCol);
          dataCol = {};
          dataList = [];
          ranges = null;
        }
      };
      let index: any = 0;
      for (const item of ranges) {
        const opts = {
          equiptypecode: typeArr,
          level: item.level,
          polygon: item.geometry,
        };
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.polygon, '4326');
        const polygon = Geometry.asWkt();
        opts.polygon = polygon;
        const indexTemp: any = index;
        this.options.service.getequipcount(opts).then((dataObj: any) => {
              queryCallback(item, dataObj, indexTemp);
            });
        index++;
      }
    });
  },
  _addResource(type: any, dataCol: any) {
    const featureType = this._getFeatureType(type);
    // console.log('RescueTeam※03');
    const self = this;
    let symbolMapper: any = null;
    // if (SymbolMap[type]) {
    symbolMapper = SymbolMap.v_equip;
    // } else {
    //   symbolMapper = SymbolMap.default;
    // }
    this.currrentRescueTeamData = null;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        let symbolObj: any = null;
        symbolObj = Util.toJSON(symbolMapper.symbol);
        // data = this._rescueTeamTrans(data);
        // if (forward) {
        // }
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(type, data)];
        return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType,
      featureName: '装备',
      idField: 'equipmentid',
      list: dataCol,
      type: 0,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['longitude', 'latitude'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const dataObj = data[0];
          this._clearPopup(dataObj.featureType);
          const element: any = dataObj.element;
          const attrObj: any = Util.attributeSet2Object(element.attributeSet);
          this._addPopup(dataObj.featureType, element, false);
          //
          this._showHighlight(type, [element.geometry.x, element.geometry.y], attrObj);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[featureType] = true;
  },

  _removeResource(typeArr: any, level: any) {
    typeArr.forEach(async (type: any) => {
    if (!level) {
      for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
        if (featureTypeKey.indexOf(type) !== -1) {
          this.simpleRenderMgr.remove(featureTypeKey);
          delete this.featureTypeSet[featureTypeKey];
        }
      }
    } else {
      const featureType = this._getFeatureType(type);
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
  });
  },

  _getFeatureType(type: any) {
    const featureType = `equip__${type}`;
    return featureType;
  },

  _getTypeByFeatureType(featureType: any) {
    return featureType.split('__')[1];
  },
// 地图数据
  _getDataCol(typeArr: any, level: any) {
    return new Promise(async (resolve, reject) => {
    const ranges = this.options.eventInfo.getRanges();
    for (const item of ranges) {
    //   if (item.level.toString() === level.toString()) {
        const opts = {
            center: this.options.eventInfo.getPoint()[0] + ' ' +
            this.options.eventInfo.getPoint()[1],
            equiptypecode: typeArr,
            polygon: '',
          };
        const Geometry = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(item.geometry, '4326');
        const polygon = Geometry.asWkt();
        opts.polygon = polygon;
        this.options.service.getequiplist(opts).then((data: any) => {
            resolve(data.data);
            });
    //   }
    }
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
        this.featureLocate.fit({
          type: 'geojson',
          geom: this.options.eventInfo.getMaxRangeGeometry(),
        }, {
          maxZoom: this.map.getZoomLevel(),
        });
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
            const attrObjItem: any = Util.attributeSet2Object(ele.attributeSet);
            if (attrObjItem.rescueid === id) {
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
    console.log(' clearPopup ');
    this.hideHighlight();
    this._clearPopup();
  },

  /**
   *详情框数据
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
        if (attrObj.geom) {
          attrObj.x = attrObj.geom.coordinates[0];
          attrObj.y = attrObj.geom.coordinates[1];
        } else {
          attrObj.x = attrObj.longitude;
          attrObj.y = attrObj.latitude;
        }
        const type: any = this._getTypeByFeatureType(featureType);
        const point = this.options.eventInfo.getPoint();
        let teamId: any;
        if (attrObj._id) {
          teamId = attrObj._id;
        } else if (attrObj.rescueid) {
          teamId = attrObj.rescueid;
        }
        const optDetail = {
          point,
          id: teamId,
          };
        this.options.serviceTeam.getDetailInfo(optDetail).then((data: any) => {
          this.fire(this.options.fireAddPopupEventId, {
            featureType,
            type: 'EquipComp',
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
    const symbolMapper: any = SymbolMap.v_equip;
    symbolObj = Util.toJSON(symbolMapper.hlSymbol);
    // data = this._rescueTeamTrans(data);
    // if (data.teamtypecode.indexOf('forward') > -1) {
    //     symbolObj = Util.toJSON(symbolMapper.fwHlSymbol(Type, data, 'teamtypecode'));
    //   }
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(Type, data)];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
      },
      style: symbolObj,
      // 不闪烁
      blink: {
        enable: false,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },
  // 隐藏高亮
  hideHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
});
export default component;
