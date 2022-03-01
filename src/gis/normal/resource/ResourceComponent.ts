import SymbolMap from './SymbolMap';
import Util from '../../Util';
import { filter } from 'vue/types/umd';
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    // 资源类型
    type: null,
    map: null,
    service: null,
    eventInfo: null,
    clusterlevel: 11,
    vilagelevel: 8,
    symbolConfig: null,
    popupId: 'normal_resource', // 弹窗唯一标识
    highLightId: 'disaster_judge_district_hl', // 高亮id
    fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id
    fireGetListData: 'listdata', // 获取数据后执行事件id
    dataLoadedEventId: 'data-loaded', // 地图数据加载完成
    fields: ['DISTRICT', 'name'], // 地图渲染所需字段
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    // do sth
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.cacheData = null;
    this.keysNotShow = {};
    this.symbolConfig = options.symbolConfig;
    this.provincelayer = new g2.carto.ElementLayer({
      id: 'resProvinceDistrictDataLayer',
      name: 'resProvinceDistrictDataLayer',
      map: this.map,
    });
    this.map.addLayer(this.provincelayer);

    this.citylayer = new g2.carto.ElementLayer({
      id: 'resCityDistrictDataLayer',
      name: 'resCityDistrictDataLayer',
      map: this.map,
    });
    this.map.addLayer(this.citylayer);
    this.addListeners();
  },
  load() {
    componentBase.prototype.load.call(this);
    // do sth
  },
  addListeners() {
    // 监听周边查询打开关闭
    if (this.options.nearbyQuery) {
      this.options.nearbyQuery.off('load', this._onNearByLoad, this);
      this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
      this.options.nearbyQuery.on('load', this._onNearByLoad, this);
      this.options.nearbyQuery.on('unload', this._onNearByUnLoad, this);
      this.options.nearbyVideoLayer.on('load', this._onNearByLoad, this);
      this.options.nearbyVideoLayer.on('unload', this._onNearByUnLoad, this);
      this.options.nearbyVideoLayer.on('closeNearByClick', this._onNearByUnLoad, this);

    }
    this.bindZoomLevel();
  },
  removeListeners() {
    // 监听周边查询打开关闭
    if (this.options.nearbyQuery) {
      this.options.nearbyQuery.off('load', this._onNearByLoad, this);
      this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
      this.options.nearbyVideoLayer.off('load', this._onNearByLoad, this);
      this.options.nearbyVideoLayer.off('unload', this._onNearByUnLoad, this);
      this.options.nearbyVideoLayer.off('closeNearByClick', this._onNearByUnLoad, this);
    }
  },
  unload() {
    // todo
    // 清理所有地图数据，地图监听
    this.cacheData = null;
    this.clearPopup();
    this._clearLayers();
    this.key = null;
    //
    componentBase.prototype.unload.call(this);
  },

  /**
   * 显示对应级别的数据
   * @param key 类型code
   */
  getListData(key: string) {
    const self = this;
    this.options.service.getDataList(key).then((data: any) => {
      self.fire(this.options.fireGetListData, {
        data,
      });
    });
  },
  /**
   * 显示对应级别的数据
   * @param key 类型code
   */
  showResourceTip(key: string, districtCode?: string, keyWord?: string) {
    const self = this;
    self.keysNotShow[key] = false;
    return new Promise((resolve, reject) => {
      this.key = key;
      this.map.fullExtent();
      const param = {
        resourceKey: key,
        fields: this.options.fields,
        districtCode,
        keyWord,
      };
      this.options.service.getMapDataList(param).then((dataCol: any) => {
        if (self.keysNotShow[key]) {
          return;
        }
        self._showResourcesOnMap(key, dataCol);
        self.keysNotShow[key] = false;
        // self.cacheData = dataCol;
        // // 查询城市
        // self.options.service.queryCity().then((data: any) => {
        //   if (key === this.key) {
        //     self.CityData = data;
        //     self.CityDataArr = [];
        //     for (const k of Object.keys(data)) {
        //       self.CityDataArr.push(data[k].tag.DISTRICTCODE);
        //     }
        //     self.provinceCityCountMark(dataCol);
        //     self._showResourcesOnMap(key, dataCol);
        //     self.bindZoomLevel();
        //     self.bindMapClick();
        //   }
        //   self.fire(this.options.dataLoadedEventId, {
        //     key,
        //   });
        //   resolve();
        // });
      }).catch((err: any) => {
        reject(err);
      });
    });
  },

  // 绑定监听
  bindZoomLevel() {
    this.event = () => {
      const level = this.map.getZoomLevel();
      // const layer = this.simpleRenderMgr.getLayer('resource_' + this.key);
      // if (
      //   level < this.options.clusterlevel &&
      //   level > this.options.vilagelevel
      // ) {
      //   this.citylayer.setVisible(true);
      //   this.provincelayer.setVisible(false);
      //   // layer.setVisible(false);
      //   this.simpleRenderMgr.setVisible('resource_' + this.key, false);
      // } else if (level <= this.options.vilagelevel) {
      //   this.citylayer.setVisible(false);
      //   this.provincelayer.setVisible(true);
      //   // layer.setVisible(false);
      //   this.simpleRenderMgr.setVisible('resource_' + this.key, false);
      // } else if (level >= this.options.clusterlevel) {
      //   this.citylayer.setVisible(false);
      //   this.provincelayer.setVisible(false);
      //   // layer.setVisible(true);
      //   this.simpleRenderMgr.setVisible('resource_' + this.key, true);
      // }

      if (level.toFixed() >= 13) {
        this.simpleRenderMgr.setVisible('resource_' + this.key + '_polygon', true);
      } else {
        this.simpleRenderMgr.setVisible('resource_' + this.key + '_polygon', false);
      }
    };
    this.map.on('resolutionchanged', this.event);
  },

  bindMapClick() {
    this.click_event = (button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) => {
      let ele = this.provincelayer.hitTest(screenX, screenY);
      if (!!ele) {
        this.map.pan(ele.element.geometry);
        this.map.zoomTo(9);
      } else {
        ele = this.citylayer.hitTest(screenX, screenY);
        if (!!ele) {
          this.map.pan(ele.element.geometry);
          this.map.zoomTo(12);
        }
      }
    };
    this.map.on('click', this.click_event);
  },

  // 地图上叠加数据
  _showResourcesOnMap(key: string, dataCol: any) {
    const self: any = this;
    this.bindZoomLevel();
    this.simpleRenderMgr.remove('resource_' + key);
    this.simpleRenderMgr.remove('resource_' + key + '_polygon');
    let symbolMapper: any = null;
    if (SymbolMap[key]) {
      symbolMapper = SymbolMap[key];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource.cluster;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        const symbolObj: any = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(key, data)];
        if (!symbolObj.options.source) {
          symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn('mechanical', data)];
        }
        return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    if (key.indexOf('Oce_pasture') !== -1) {
      dataCol.map((item: any) => {
        const Geometry1 = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(item.geom, '4326');
        const center1 = Geometry1.getBaryCenter();
        item.Polygon = item.geom;
        item.geom = {
          type: 'Point',
          coordinates: [
            center1.x,
            center1.y,
          ],
        };
      });
      const PolygonSymbol = this.options.symbolConfig.symbols.common[key + '_polygon'];
      const SymbolBuilder1 = (G as any).utils.SymbolBuilder.extend({
        build: (content: any) => {
          return G.utils.RenderUtil.object2Symbol(PolygonSymbol);
        },
      });
      const opts1 = {
        featureType: 'resource_' + key + '_polygon',
        featureName: 'resource_' + key + '_polygon',
        idField: '_id',
        list: dataCol,
        type: 1,
        geometryBuilder: new (G as any).utils.GeometryBuilder({
          geometryField: ['Polygon'],
        }),
        symbolBuilder: new SymbolBuilder1(),
      };
      this.simpleRenderMgr.add(opts1);
      if (this.map.getZoomLevel() < 13) {
        this.simpleRenderMgr.setVisible('resource_' + key + '_polygon', false);
      }
    }
    const opts = {
      featureType: 'resource_' + key,
      featureName: 'resource_' + key,
      idField: '_id',
      list: dataCol,
      type: 1,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          // this指向监听时的context变量
          self.clearPopup();
          self.locationCenter(key, data[0].elementId, true);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
  },
  // 创建聚类符号扩展
  _addclusterSymbol(size: number, radius: number, strokecolor: any, fillcolor: any, flag: any) {
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
  // 获取聚类点像素聚类
  _getDistance(featureType: any) {
    const envelope: any = new g2.sfs.Envelope({ spatialReference: this.map.spatialReference || 4326 });
    const clusterLayer = this.simpleRenderMgr.getLayer(featureType);
    const extent = clusterLayer.getExtent();
    if (extent) {
      envelope.union(extent);
    }
    const minxPixel = this.map.getPixelFromCoordinate([envelope.minx, envelope.maxy]);
    const maxxPixel = this.map.getPixelFromCoordinate([envelope.maxx, envelope.miny]);
    const Distance = maxxPixel[0] - minxPixel[0];
    return Distance;
  },
  /**
   * 隐藏对应级别的数据
   * @param idarr 资源id
   */
  hideResource(idarr: string[]) {
    // this.removeListeners();
    this.map.un('resolutionchanged', this.event);
    this.map.un('click', this.click_event);
    this.clearPopup();
    idarr.forEach((item) => {
      this.simpleRenderMgr.remove('resource_' + item);
      this.simpleRenderMgr.remove('resource_' + item + '_polygon');
    });
    this.citylayer.clear();
    this.provincelayer.clear();
    this.clearPopup();
    this.key = null;
  },

  /**
   * 显示对应级别的数据
   * @param idarr 资源id
   */
  showResource(idarr: string) {
    return this.showResourceTip(idarr);
  },

  _showHighlight(key: string, data: any) {
    let symbolMapper: any = null;
    if (SymbolMap[key]) {
      symbolMapper = SymbolMap[key];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(key, data)];
    if (key.indexOf('Oce_pasture') !== -1) {
      const Geometry1 = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(data.geom, '4326');
      const center1 = Geometry1.getBaryCenter();
      data.geom = {
        type: 'Point',
        coordinates: [
          center1.x,
          center1.y,
        ],
      };
    }
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + data.geom.coordinates[0] + ' ' + data.geom.coordinates[1] + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
    const self = this;
    const point = new g2.sfs.Point({
      x: data.geom.coordinates[0],
      y: data.geom.coordinates[1],
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

  /**
   * 显示资源的弹框
   * @param id 资源id
   */
  showPopup(id: any) {
    // todo
    // 弹出框，视野定位，高亮
  },

  /**
   * 清除弹出框
   */
  clearPopup() {
    this.popupManager.remove(this.options.popupId);
    this.popupManager.clear();
    this._clearHighlight();
  },
  closePopup() {
    this.popupManager.remove(this.options.popupId);
    this.popupManager.clear();
  },
  _clearHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  /**
   * 页面取消选中时的方法
   */
  _clearLayers() {
    // todo
    const resource = this.simpleRenderMgr.featureTypeList.filter((itme: any) => {
      return itme.featureType.indexOf('resource_') !== -1;
    });
    resource.forEach((item: any) => {
      const featureType = item.featureType;
      this.simpleRenderMgr.remove(featureType);
      this.simpleRenderMgr.remove(featureType + '_polygon');
    });
    G.utils.LayerUtil.getLayerById(
      this.map,
      'resCityDistrictDataLayer',
    ).clear();
    G.utils.LayerUtil.getLayerById(
      this.map,
      'resProvinceDistrictDataLayer',
    ).clear();
    this.map.un('resolutionchanged', this.event);
    this.map.un('click', this.click_event);
    this.cacheData = null;
    this.clearPopup();
  },
  _clearLayerByID(key: any) {
    this.keysNotShow[key] = true;
    this.simpleRenderMgr.remove('resource_' + key);
    this.simpleRenderMgr.remove('resource_' + key + '_polygon');
    this.clearPopup();
  },
  // 地图上数据变化时，需要重新调整地图视野，适配数据
  _fitMap(id: string) {
    const layer = this.simpleRenderMgr.getLayer('resource' + id);
    if (layer) {
      // layer.setVisible(true);
      this.simpleRenderMgr.setVisible('resource' + id, true);
      const arr = [];
      for (const k of layer.elements) {
        const sim = {
          type: 'wkt',
          geom: k.geometry.asWkt(),
        };
        arr.push(sim);
      }
      this.featureLocate.fit(arr);
    }
  },

  /**
   * 定位、弹出框架、高亮
   * @param id
   * @param noneMouseClick 是否非地图点击触发，点击地图触发时不居中定位；
   */
  locationCenter(key: string, id: string, noneMouseClick: any = true) {
    const self = this;
    const opt = {
      resourceKey: key,
      id,
    };
    this.options.service.getDetailInfo(opt).then((res: any) => {
      const data = res;
      if (!data) {
        return;
      }
      if (key.indexOf('Oce_pasture') !== -1) {
        const Geometry1 = new g2.sfs.GeometryFactory.createGeometryFromGeoJson(data.geom, '4326');
        const center1 = Geometry1.getBaryCenter();
        data.geom = {
          type: 'Point',
          coordinates: [
            center1.x,
            center1.y,
          ],
        };
      }
      if (noneMouseClick) {
        // this.featureLocate.fit({
        //   type: 'wkt',
        //   geom:
        //     'POINT(' +
        //     data.geom.coordinates[0] +
        //     ' ' +
        //     data.geom.coordinates[1] +
        //     ')',
        // }, {
        //   maxZoom: this.map.getZoomLevel(),
        // });
      }
      this.clearPopup();
      data.x = data.geom.coordinates[0];
      data.y = data.geom.coordinates[1];
      const popupOptions: any = {
        id: this.options.popupId,
        anchor: [data.geom.coordinates[0], data.geom.coordinates[1]],
        className: 'g2-tooltip',
      };
      if (noneMouseClick) {
        // 点击列表触发时，设置自动调整视野的延迟
        popupOptions.autoPanTimeout = 1200;
        popupOptions.autoPanMargin = 60;

      }
      console.debug(`popup  type = ${this.key}`);
      this.popupManager
        .addSimple(popupOptions)
        .then((content: any) => {
          this.fire(this.options.fireAddPopupEventId, {
            data,
            content,
            type: key,
          });
        });
      this._showHighlight(key, data);
    });
  },
  locationCenterOld(id: string, noneMouseClick: any = true) {
    if (!this.cacheData) {
      return;
    }
    this.cacheData.forEach((item: any) => {
      if (item._id === id) {
        if (noneMouseClick) {
          this.featureLocate.fit({
            type: 'wkt',
            geom:
              'POINT(' +
              item.geom.coordinates[0] +
              ' ' +
              item.geom.coordinates[1] +
              ')',
          }, {
            maxZoom: this.map.getZoomLevel(),
          });
        }
        this.clearPopup();
        item.x = item.geom.coordinates[0];
        item.y = item.geom.coordinates[1];
        const popupOptions: any = {
          id: this.options.popupId,
          anchor: [item.geom.coordinates[0], item.geom.coordinates[1]],
          className: 'g2-tooltip',
        };
        if (noneMouseClick) {
          // 点击列表触发时，设置自动调整视野的延迟
          popupOptions.autoPanTimeout = 1200;
          popupOptions.autoPanMargin = 60;
        }
        console.debug(`popup  type = ${this.key}`);
        this.popupManager
          .addSimple(popupOptions)
          .then((content: any) => {
            this.fire(this.options.fireAddPopupEventId, {
              data: item,
              content,
              type: this.key,
            });
          });
        this._showHighlight(this.key, item);
      }
    });
  },

  provinceCityCountMark(data: any) {
    const dataCount = this.districtStatistics(data);
    const provinceDataCount = dataCount.dest;
    const provinceDataStr = JSON.stringify(
      EMapServerV2.provinceDistrictData.province,
    );
    const provinceData = JSON.parse(provinceDataStr);
    for (const i of Object.keys(provinceDataCount)) {
      for (const j in provinceData) {
        if (provinceDataCount[i].DISTRICT === provinceData[j].code) {
          provinceData[j].count = provinceDataCount[i].count;
        }
      }
    }
    // 去除统计结果为0的
    const dataResult = [];
    for (const k in provinceData) {
      if (provinceData[k].count !== 0) {
        dataResult.push(provinceData[k]);
      }
    }
    // MapMarkerDisplay.clearLayerinfo();
    this.addProvinceCountOnMap(dataResult);

    // 查询城市
    const cityDataCount = dataCount.citydest;
    for (const l of Object.keys(cityDataCount)) {
      for (const m in this.CityData) {
        if (cityDataCount[l].DISTRICT === this.CityData[m].tag.DISTRICTCODE) {
          this.CityData[m].count = cityDataCount[l].count;
        }
      }
    }
    // 去除统计结果为0的
    const dataResultCity = [];
    for (const n in this.CityData) {
      if (this.CityData[n].count && this.CityData[n].count !== 0) {
        dataResultCity.push(this.CityData[n]);
      }
    }
    this.addCityCountOnMap(dataResultCity);
  },
  // 行政区划统计
  districtStatistics(data: any) {
    // 拆分数据类型
    const maps: any = {};
    const dest: any = [];
    const citydest: any = [];
    if (!!data) {
      for (const i of data) {
        const ai = i;
        if (!!ai.DISTRICT) {
          const district = ai.DISTRICT.substring(0, 2) + '0000'; // 省
          let citydistrict = ai.DISTRICT.substring(0, 4) + '00'; // 市
          if (this.CityDataArr.indexOf(ai.DISTRICT) !== -1) {
            citydistrict = ai.DISTRICT;
          }
          if (!maps[district]) {
            dest.push({
              DISTRICT: district,
              count: 1,
            });
            maps[district] = ai;
          } else {
            for (const j of dest) {
              const dj = j;
              const dis = ai.DISTRICT.substring(0, 2) + '0000';
              if (dj.DISTRICT.substring(0, 2) + '0000' === dis) {
                dj.count++;
                break;
              }
            }
          }
          // if(citydistrict.indexOf('0000')!=-1)//数据如果没有区分城市
          // {
          //     citydistrict=citydistrict.substring(0,2)+"0100";
          // }
          if (!maps[citydistrict]) {
            citydest.push({
              DISTRICT: citydistrict,
              count: 1,
            });
            maps[citydistrict] = ai;
          } else {
            for (const j of citydest) {
              const dj = j;
              // const citydistrict=ai.DISTRICT.substring(0,4)+"00";
              // if(dj.DISTRICT.indexOf('0000')!=-1)
              // {
              //     dj.DISTRICT=dj.DISTRICT.substring(0,2)+"0100";
              // }
              if (dj.DISTRICT.substring(0, 4) + '00' === citydistrict) {
                dj.count++;
                break;
              } else if (dj.DISTRICT === citydistrict) {
                dj.count++;
                break;
              }
            }
          }
        }
      }
    }
    const alldest = {
      dest,
      citydest,
    };
    // 分好的组
    return alldest;
  },

  /**
   * 加载省级统计数据
   * @method
   */
  addProvinceCountOnMap(dataArr: any) {
    const self = this;
    const layer = this.provincelayer;
    const level = this.map.getZoomLevel();
    if (level <= this.options.vilagelevel) {
      layer.setVisible(true);
    } else {
      layer.setVisible(false);
    }

    layer.clear();

    const elements = [];
    for (const i of Object.keys(dataArr)) {
      const point = new g2.sfs.Point({
        x: parseFloat(dataArr[i].lng),
        y: parseFloat(dataArr[i].lat),
        spatialReference: 4326,
      });
      const symbol = new g2.sfs.SimpleMarkerSymbol({
        offsetX: 0,
        offsetY: 0,
        fillColor: new g2.sfs.Color({ a: 150, r: 200, g: 0, b: 0 }),
        borderColor: new g2.sfs.Color({ a: 150, r: 200, g: 0, b: 0 }),
        borderThickness: 4,
        size: 16,
      });
      const textSymbol = new g2.sfs.TextSymbol({
        text: dataArr[i].count + '',
        borderColor: new g2.sfs.Color({ a: 255, r: 255, g: 255, b: 255 }),
        borderThickness: 1,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamilyName: '宋体',
        foreground: new g2.sfs.Color({ a: 255, r: 255, g: 255, b: 255 }),
        offsetX: 0,
        offsetY: 0,
      });
      // 复合符号
      const currencySymbol = new g2.sfs.CurrencySymbol({
        markerSymbol: symbol,
        textSymbol,
      });
      const ele = new g2.sfs.Element({
        geometry: point,
        symbol: currencySymbol,
      });
      elements.push(ele);
    }
    layer.addElements(elements);
  },
  /**
   * 加载市级统计数据
   * @method
   */
  addCityCountOnMap(dataArr: any) {
    const self = this;
    const layer = this.citylayer;
    const level = this.map.getZoomLevel();
    if (level < this.options.clusterlevel && level > this.options.vilagelevel) {
      layer.setVisible(true);
    } else {
      layer.setVisible(false);
    }
    layer.clear();
    const elements: any = [];
    for (const i of dataArr) {
      const point = new g2.sfs.Point({
        x: parseFloat(i.tag.LONGITUDE),
        y: parseFloat(i.tag.LATITUDE),
        spatialReference: 4326,
      });
      const symbol = new g2.sfs.SimpleMarkerSymbol({
        offsetX: 0,
        offsetY: 0,
        fillColor: new g2.sfs.Color({ a: 150, r: 200, g: 0, b: 0 }),
        borderColor: new g2.sfs.Color({ a: 150, r: 200, g: 0, b: 0 }),
        borderThickness: 4,
        size: 16,
      });
      const textSymbol = new g2.sfs.TextSymbol({
        text: i.count + '',
        borderColor: new g2.sfs.Color({ a: 255, r: 255, g: 255, b: 255 }),
        borderThickness: 1,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamilyName: '宋体',
        foreground: new g2.sfs.Color({ a: 255, r: 255, g: 255, b: 255 }),
        offsetX: 0,
        offsetY: 0,
      });
      // 复合符号
      const currencySymbol = new g2.sfs.CurrencySymbol({
        markerSymbol: symbol,
        textSymbol,
      });
      const ele = new g2.sfs.Element({
        geometry: point,
        symbol: currencySymbol,
      });
      elements.push(ele);
    }
    layer.addElements(elements);
  },
  _onNearByLoad() {
    console.debug('监听周边查询加载！');
    this.provincelayer.setVisible(false);
    this.citylayer.setVisible(false);
    // this.simpleRenderMgr.setVisible('resource_' + this.key, false);
    if (this.event) {
      this.map.un('resolutionchanged', this.event);
    }
    if (this.click_event) {
      this.map.un('click', this.click_event);
    }
    // this.popupManager.remove(this.options.popupId);
  },
  _onNearByUnLoad() {
    console.debug('监听周边查询卸载！');
    if (this.event) {
      this.map.on('resolutionchanged', this.event);
    }
    if (this.click_event) {
      this.map.on('click', this.click_event);
    }
    this.map.zoomOut();
    this.map.zoomIn();
    this._clearHighlight();
  },
});
export default component;
