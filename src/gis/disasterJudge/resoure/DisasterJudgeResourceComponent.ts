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
    popupId: 'disasterJudge_resource_popup', // 弹窗唯一标识
    highLightId: 'disasterJudge_resource_hl', // 高亮id
    fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id
    popUpfeatureType: null,
    popUptype: null,
    popUpelement: null,
    popUpattrObj: null,
  },
  blankGeom: {
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
  * @param typeArr
  */
  load(typeArr: any, level: any) {
    componentBase.prototype.load.call(this);
    this.map.setClusterScatter(false);
    // do sth
    if (level) {
      return new Promise(async (resolve, reject) => {
        const result: any = [];
        for (const type of typeArr) {
          if (this.dataCol[type]) {
            result.push(this.dataCol[type]);
          } else {
            const dataCol = await this._loadTypeDataCol(type);
            this.dataCol[type] = dataCol;
            result.push(dataCol);
          }
        }
        resolve(result);
      });
    } else {
      this.dataCol = {};
      return this._loadDataCol(typeArr);
    }
  },
  unload() {
    console.debug('unload');
    this.clear();
    this.dataCol = {};
    //
    componentBase.prototype.unload.call(this);
  },

  addListeners() {
    // 监听周边查询打开关闭
    if (this.options.nearbyQuery || this.options.nearbyVideoLayer) {
      this.options.nearbyQuery.off('load', this._onNearByLoad, this);
      this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
      this.options.nearbyQuery.off('closeNearByClick', this._onNearBycloseClick, this);
      this.options.nearbyQuery.on('load', this._onNearByLoad, this);
      this.options.nearbyQuery.on('unload', this._onNearByUnLoad, this);
      this.options.nearbyQuery.on('closeNearByClick', this._onNearBycloseClick, this);
      this.options.nearbyVideoLayer.on('load', this._onNearByLoad, this);
      this.options.nearbyVideoLayer.on('unload', this._onNearByUnLoad, this);
      this.options.nearbyVideoLayer.on('closeNearByClick', this._onNearBycloseClick, this);
    }
    if (this.options.routerPlan) {
      this.options.routerPlan.off('closePathByClick', this._onNearBycloseClick, this);
      this.options.routerPlan.on('closePathByClick', this._onNearBycloseClick, this);
    }
  },
  removeListeners() {
    // 监听周边查询打开关闭
    if (this.options.nearbyQuery || this.options.nearbyVideoLayer) {
      // this.options.nearbyQuery.off('load', this._onNearByLoad, this);
      // this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
      // this.options.nearbyQuery.off('closeNearByClick', this._onNearBycloseClick, this);
      this.options.nearbyVideoLayer.off('load', this._onNearByLoad, this);
      this.options.nearbyVideoLayer.off('unload', this._onNearByUnLoad, this);
      this.options.nearbyVideoLayer.off('closeNearByClick', this._onNearBycloseClick, this);
    }
    if (this.options.routerPlan) {
      this.options.routerPlan.off('closePathByClick', this._onNearBycloseClick, this);
    }
  },
  /**
   * 获取资源统计
   * @param opts
   * @param [opts.districtCode]
   * @param [opts.geometry]
   * @param opts.ranges
   * @param opts.ranges[i].level
   * @param opts.ranges[i].geometry
   */
  getResourceStatistics(opts: any) {
    return;
  },

  /**
   * 根据filter条件查询并资源上图
   * @param opts
   * @param [opts.districtCode]
   * @param [opts.geometry]
   */
  queryAddResource(opts: any) {
    this.addResource();
    return;
  },
  /**
   * 资源数据上图
   * @param opts
   * @param opts.data
   */
  addResource(opts: any) {
    this._addResource(opts.layerName, 0, { list: opts.list });
    return;
  },
  /**
   * 显示对应级别的数据
   * @param type 资源类型
   * @param levelArr
   */
  showResource(type: any, levelArr: string[]) {
    // const self = this;
    console.debug('show ', type, '   ', JSON.stringify(levelArr));
    const levelMap: any = {
      Ⅴ: 5,
      Ⅵ: 6,
      Ⅶ: 7,
      Ⅷ: 8,
      Ⅸ: 9,
    };
    levelArr.forEach((item) => {
      if (levelMap[item]) {
        item = levelMap[item];
      }
      const dataCol = this._getDataCol(type, item);
      this._addResource(type, item, dataCol);
    });
    // this._adjustView(levelArr);
    this._adjustView(); // 恢复到以前的状态
  },

  /**
  * 隐藏对应级别的数据
  * @param type 资源类型
  * @param levelArr
  */
  hideResource(type: any, levelArr: string[]) {
    console.debug('hide ', type, '   ', JSON.stringify(levelArr));
    if (!levelArr) {
      this._removeResource(type);
    } else {
      levelArr.forEach((item) => {
        this._removeResource(type, item);
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
      for (const type of typeArr) {
        const dataCol = await this._loadTypeDataCol(type);
        this.dataCol[type] = dataCol;
        result.push(dataCol);
      }
      resolve(result);
    });
  },

  _loadTypeDataCol(type: any) {
    return new Promise(async (resolve, reject) => {
      let ranges = this.options.eventInfo.getRanges();
      if (ranges.length === 0) {
        ranges = [{
          level: '0',
          geometry: this.blankGeom,
        }];
      }
      const point = this.options.eventInfo.getPoint() || [117, 37];
      const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
      let dataCol = {};
      const dataList = new Array(ranges.length);
      let total = 0;
      const countArr: any = [];
      // 修改串行查询为并行
      let finishCount = 0;
      const queryCallback = (item: any, dataObj: any, idx: any) => {
        dataObj.count = dataObj.list.length;
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
      };
      let index: any = 0;
      for (const item of ranges) {
        const opts = {
          earthLevel: item.level,
          point,
          typecode: type,
          dataA: item.geometry,
        };
        const indexTemp: any = index;
        this.options.service.queryResourceByRanges(opts).then((dataObj: any) => {
          queryCallback(item, dataObj, indexTemp);
        });
        index++;
      }
    });
  },
  // 获取聚类点像素聚类
  _getDistance(type: any, level: any) {
    const envelope: any = new g2.sfs.Envelope({ spatialReference: this.map.spatialReference || 4326 });
    for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
      const clusterLayer = this.simpleRenderMgr.getLayer(featureTypeKey);
      const extent = clusterLayer.getExtent();
      if (extent) {
        envelope.union(extent);
      }
    }
    const minxPixel = this.map.getPixelFromCoordinate([envelope.minx, envelope.maxy]);
    const maxxPixel = this.map.getPixelFromCoordinate([envelope.maxx, envelope.miny]);
    const Distance = maxxPixel[0] - minxPixel[0];
    return Distance;
    // const featureType = this._getFeatureType(type, level);
    // const clusterLayer = this.simpleRenderMgr.getLayer(featureType);
    // const envelope = clusterLayer.getExtent();
    // const minxPixel = this.map.getPixelFromCoordinate([envelope.minx, envelope.maxy]);
    // const maxxPixel = this.map.getPixelFromCoordinate([envelope.maxx, envelope.miny]);
    // const Distance = maxxPixel[0] - minxPixel[0];
    // return Distance;
  },
  // 创建聚类符号
  _addclusterSymbol(size: number, radius: number, strokecolor: any, fillcolor: any, flag: boolean) {
    let image;
    if (flag) {
      image = new g2.sfs.SimpleMarkerSymbol({
        style: 'square',
        fillColor: fillcolor,
        size: radius,
        borderColor: strokecolor,
        borderThickness: 3,
      });
    } else {
      image = new g2.sfs.SimpleMarkerSymbol({
        size: radius,
        style: 'circle',
        fillColor: fillcolor,
        borderColor: strokecolor,
        borderThickness: 3,
      });
    }
    const style = new g2.sfs.CurrencySymbol({
      markerSymbol: image,
      textSymbol: new g2.sfs.TextSymbol({
        text: size.toString(),
        foreground: new g2.sfs.Color({ r: 255, g: 255, b: 255, a: 255 }),
        borderColor: new g2.sfs.Color({ r: 255, g: 255, b: 255, a: 255 }),
        fontFamilyName: '黑体',
        fontSize: 20,
        borderThickness: 1,
      }),
    });
    return style;
  },
  _addResource(type: any, level: any, dataCol: any) {
    const featureType = this._getFeatureType(type, level);
    console.log('RescueTeam※03');
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    this.currrentRescueTeamData = null;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        let symbolObj: any = null;
        if (type === 'RescueTeam※03' || this.currrentRescueTeamData) {
          data = this._rescueTeamTrans(data);
          if (data.notReadCount && data.notReadCount > 0) {
            symbolObj = Util.toJSON(symbolMapper.fwSymbolReal(type, data, 'teamtypecode'));
          } else {
            symbolObj = Util.toJSON(symbolMapper.fwSymbol(type, data, 'teamtypecode'));
          }
          symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(type, data, 'teamtypecode')];
        } else {
          symbolObj = Util.toJSON(symbolMapper.symbol);
          symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(type, data, 'teamtypecode')];
        }
        return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      },
      // buildClusterStyle: (data: any) => {
      //   return {
      //     clusterScatterSize: 10,
      //     clusterScatterLineSymbol: new g2.sfs.SimpleLineSymbol({
      //       color: new g2.sfs.Color({r: 255, g: 255, b: 0}),
      //       width: 3,
      //     }),
      //     // 是否点击散开
      //     clusterScatterOnClick: true,
      //     // 是否鼠标滑过散开
      //     clusterScatterOnMousemove: true,
      //     clusterLevel: 16,
      //     distance: 50,
      //   };
      // },
      // buildClusterStyleFn: () => {
      //   return (radius: any, size: any, maxFeatureCount: any, eles: any) => {
      //     // 创建通用符号
      //     const Distance = self._getDistance(type, level);
      //     let newRadius;
      //     let strokecolor;
      //     let fillcolor;
      //     if (Distance <= 160) {
      //       if (size > 1) {
      //         newRadius = 15;
      //         strokecolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 }); // 0.6
      //         fillcolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 }); // 0.6
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, true);
      //       } else {
      //         // const style = feature.get('features')[0].getStyle();
      //         // style.image_.anchor_ = ['17','15'];
      //         // return [style];
      //       }
      //     } else {
      //       if (size > 1 && size <= 10) {
      //         newRadius = 15;
      //         strokecolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 });
      //         fillcolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 102 }); // 0.4
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 10 && size <= 50) {
      //         newRadius = 18;
      //         strokecolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 });
      //         fillcolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 128 }); // 0.5
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 50 && size <= 100) {
      //         newRadius = 21;
      //         strokecolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 });
      //         fillcolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 });  // 0.6
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 100 && size <= 200) {
      //         newRadius = 24;
      //         strokecolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 }); // 0.6
      //         fillcolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 179 }); // 0.7
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else if (size > 200) {
      //         newRadius = 30;
      //         strokecolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 153 });
      //         fillcolor = new g2.sfs.Color({ r: 200, g: 0, b: 0, a: 204 }); // 0.8
      //         return self._addclusterSymbol(size, newRadius, strokecolor, fillcolor, false);
      //       } else {
      //         // const style = feature.get('features')[0].getStyle();
      //         // style.image_.anchor_ = ['17','15'];
      //         // return [style];
      //         // // return [feature.get('features')[0].getStyle()];
      //       }
      //     }
      //   };
      // },
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
          if (attribute && featureType.indexOf('RescueTeam※03') !== -1) {
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
          this.options.popUpfeatureType = featureType;
          this.options.popUptype = type;
          this.options.popUpelement = element;
          this.options.popUpattrObj = attrObj;
          this._addPopup(dataObj.featureType, element, false);
          //
          this._showHighlight(type, [element.geometry.x, element.geometry.y], attrObj);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[featureType] = true;
    const poiArr: any = [];
    dataCol.list.map((item: any) => {
      poiArr.push({
        type: 'wkt',
        geom: 'POINT(' + item.geom.coordinates[0] + ' ' + item.geom.coordinates[1] + ')',
      });
    });
    this.featureLocate.fit(poiArr);
  },
  getQueryResourcePoint(geometry: any) {
    let point: any = null;
    if (geometry) {
      const geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geometry, this.map.spatialReference);
      const center = geom.getBaryCenter();
      point = [center.x, center.y];
    } else {
      point = [117, 37];
    }
    return point;
  },
  _removeResource(type: any, level: any) {
    if (!level) {
      for (const featureTypeKey of Object.keys(this.featureTypeSet)) {
        if (featureTypeKey.indexOf(type) !== -1) {
          this.simpleRenderMgr.remove(featureTypeKey);
          delete this.featureTypeSet[featureTypeKey];
        }
      }
    } else {
      const featureType = this._getFeatureType(type, level);
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
  },

  _getFeatureType(type: any, level: any) {
    const featureType = `disaster_judge_resource__${type}__${level}`;
    return featureType;
  },

  _getTypeByFeatureType(featureType: any) {
    return featureType.split('__')[1];
  },

  _getDataCol(type: any, level: any) {
    const dataCols = this.dataCol[type];
    let dataCol = null;
    for (const item of dataCols.data) {
      if (item.level === level) {
        dataCol = item;
        break;
      }
    }
    return dataCol;
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
      if (JSON.stringify(this.options.eventInfo.getMaxRangeGeometry()) === JSON.stringify(this.blankGeom)) {
        return;
      }
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
      this.options.popUpfeatureType = featureType;
      this.options.popUptype = type;
      this.options.popUpelement = element;
      this.options.popUpattrObj = attrObj;
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
        // 设置周边查询当前要素
        const symbolMapper: any = this._getSymbolMapper(type);
        this.options.nearbyQuery.setTargetFeature({
          type,
          featureType,
          data: attrObj,
          symbol: G.utils.RenderUtil.object2Symbol(Util.toJSON(symbolMapper.hlSymbol)),
        });
        this.fire(this.options.fireAddPopupEventId, {
          featureType,
          type: this._getTypeByFeatureType(featureType),
          data: attrObj,
          content,
        });
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
    const symbolMapper: any = this._getSymbolMapper(Type);
    symbolObj = Util.toJSON(symbolMapper.hlSymbol);
    if (Type === 'RescueTeam※03') {
      data = this._rescueTeamTrans(data);
      if (data.teamtypecode.indexOf('forward') > -1) {
        symbolObj = Util.toJSON(symbolMapper.fwHlSymbol(Type, data, 'teamtypecode'));
      }
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
    const self = this;
    const point = new g2.sfs.Point({
      x: coordinate[0],
      y: coordinate[1],
      spatialReference: this.map.spatialReference,
    });
    this.map.pan(point);
    this.map.zoomTo(13);
    this.timeout = setTimeout(() => {
      _setbink();
    }, 3500);
    function _setbink() {
      clearTimeout(self.timeout);
      self.timeout = null;
      self.featureHighlight.removeHighlight(self.options.highLightId);
      const options2 = options;
      options2.blink.enable = false;
      self.featureHighlight.addHighlight(self.options.highLightId, options2);
    }
  },
  // 隐藏高亮
  hideHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 定位中心
  _locationCenter(element: any) {
    this.featureLocate.fit({
      type: 'wkt',
      geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
    });
  },
  _onNearByLoad() {
    console.debug('监听周边查询加载！');
    this._clearPopup();
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.setVisible(featureType, false);
    }
  },
  _onNearByUnLoad() {
    console.debug('监听周边查询卸载！');
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.setVisible(featureType, true);
    }
    // this.hideHighlight();

  },
  _onNearBycloseClick() {
    this._addPopup(this.options.popUpfeatureType, this.options.popUpelement, false);
    this._showHighlight(this.options.popUptype, [this.options.popUpelement.geometry.x, this.options.popUpelement.geometry.y], this.options.popUpattrObj);
  },
});
export default component;
