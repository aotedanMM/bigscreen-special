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
    status: 'add', // 状态
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
    this.dataCol = {};
  },
  unload() {
    console.debug('unload');
    this.clear();
    this.dataCol = {};
    this.options.status = 'remove';
    componentBase.prototype.unload.call(this);
  },

  /**
   * 分页获取物资列表数据
   * @param {Array} typeArr
   * @param opts.keyWord
   */
  showResource(typeArr: any, opts: any) {
    this.options.status = 'add';
    return new Promise(async (resolve, reject) => {
      this._getDataCol(typeArr, opts).then((dataCol: any) => {
        dataCol.list = this._classRepData(dataCol.list);
        // typeArr.forEach(async (type: any) => {
        //   if (dataCol.list[type]) {
        //       const dataCol1 = JSON.parse(JSON.stringify(dataCol));
        //       dataCol1.list = dataCol.list[type];
        //       if (this.options.status === 'add') {
        //         this._addResource(type, dataCol1);
        //       }
        //     }
        // });
        resolve(dataCol);
      });
    });
  },
  /**
   * 分页获取物资列表数据
   * @param {Array} typeArr
   * @param opts.pageSize
   * @param opts.pageIndex
   * @param opts.keyWord
   */
  getRepositoryDataList(typeArr: any, opts: any) {
    return this._getDataCol(typeArr, opts);
  },
  // 按类型拆分储备库数据
  _classRepData(data: any) {
    // 拆分数据类型
    const maps = [];
    const dest = {} ;
    // const citydest = [];
    if (!!data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const ai = data[key];
                // const ai = data[i];
                if (!!ai.REPERTORYTYPECODE) {
                    const repertorytypecode = ai.REPERTORYTYPECODE; // 省
                    if (maps.indexOf(repertorytypecode) < 0) {
                      (dest as any)[repertorytypecode] = [ai];
                      maps.push(repertorytypecode);
                    } else {
                      for (const dj of Object.keys(dest)) {
                        const repertorytypecode1 = ai.REPERTORYTYPECODE;
                        if (dj === repertorytypecode1) {
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
  clear() {
    this.options.status = 'remove';
    this._clearLayers();
    this.closePopup();
  },
  _addResource(type: any, dataCol: any) {
    const featureType = this._getFeatureType(type);
    const self = this;
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.repository;
    this.currrentRescueTeamData = null;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        let symbolObj: any = null;
        symbolObj = Util.toJSON(symbolMapper.symbol);
        data = this._rescueTeamTrans(data);
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
          const element: any = dataObj.element;
          const attrObj: any = Util.attributeSet2Object(element.attributeSet);
          this._addPopup(dataObj.featureType, element, false);
          this._showHighlight(type, [element.geometry.x, element.geometry.y], attrObj);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[featureType] = true;
  },

  _removeResource(typeArr: any) {
    typeArr.forEach(async (type: any) => {
      const featureType = this._getFeatureType(type);
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    });
  },

  _getFeatureType(type: any) {
    const featureType = `disaster_judge_resource__${type}`;
    return featureType;
  },
/**
 * 获取物资数据
 * @param typeArr
 * @param opts.pageSize
 * @param opts.pageIndex
 * @param level
 */
  _getDataCol(typeArr: any, opts: any, level?: any) {
    return new Promise(async (resolve, reject) => {
      if (!this.options.eventInfo) {
        const ranges = this.options.eventInfo.getRanges();
        const point = this.options.eventInfo.getPoint();
        const rangeType = this.options.eventInfo.getCurrentRangeType() + '';
        for (const item of ranges) {
          if (item.level.toString() === level.toString()) {
            const optMap = {
              point,
              level: item.level,
              geometry: item.geometry,
              // fields: ['name', 'REPERTORYTYPECODE'],
              repositoryTypecodes: typeArr,
              };
            this.options.service.getRepositoryDataList(Object.assign(optMap, opts)).then((data: any) => {
                resolve(data);
            });
          }
        }
      } else {
        const optMap = {
          point: [117, 35],
          level: 9,
          // fields: ['name', 'REPERTORYTYPECODE'],
          repositoryTypecodes: typeArr,
          };
        this.options.service.getRepositoryDataList(Object.assign(optMap, opts)).then((data: any) => {
            resolve(data);
            });
      }

  });
  },
  /**
   * 显示资源的弹框
   * @param type 资源类型
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
        attrObj.x = attrObj.geom.coordinates[0];
        attrObj.y = attrObj.geom.coordinates[1];
        this.fire(this.options.fireAddPopupEventId, {
            featureType,
            type: 'materialPopup',
            attrObj,
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
    const symbolMapper: any = this._getSymbolMapper('repository');
    symbolObj = Util.toJSON(symbolMapper.hlSymbol);
    data = this._rescueTeamTrans(data);
    // if (data.teamtypecode.indexOf('forward') > -1) {
    //     symbolObj = Util.toJSON(symbolMapper.fwHlSymbol(Type, data, 'teamtypecode'));
    //   }
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
});
export default component;
