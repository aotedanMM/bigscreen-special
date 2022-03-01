// 视频监控组件
import SymbolMap from '../windWaterRainWork/SymbolMap';
import Util from '../../Util';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import publishObjectPath from '@/util/configRegistry';
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    map: null,
    eventInfo: null,
    symbolConfig: null,
    service: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    featureType: 'VideoFeaturelayer', // VideoFeaturelayer
    highLightId: 'VideoLayerHL', // 高亮id
    popupId: 'VideoLayer_popup_id', // 弹窗id
    popupEventId: 'VideoLayer_popup', // 添加弹窗后执行事件id
    status: 'add', // 状态
    bufferId: 'nearbyVideoQuery',
    selectDistrictCode: null, // 选择的是否是烟台
    defaultExtentWkt: 'polygon((0 0,0 90,180 90,180 0,0 0))', // 默认全范围
  },

  /**
   * 初始化
   * @param options 参数
   */
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    this.map = options.map;
    this.symbolConfig = options.symbolConfig;
    this.service = options.service;
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.bufferDraw = options.GISComponents.bufferDraw;
    this.timeout = null;
    this.featureTypeSet = {};
    this.params = {};
    this.toolTipWare = new g2.widget.TooltipWare({ map: this.map });
  },
  /**
   * 加载
   */
  load() {
    componentBase.prototype.load.call(this);
    // this.map.listen('resolutionchanged', this._mapResolutionchanged, this);
    this.map.listen('extentchanged', this._mapExtentchanged, this);
  },
  destroy() {
    this.timeout = null;
    this.featureTypeSet = {};
    componentBase.prototype.destroy.call(this);
  },
  // 卸载
  unload() {
    this.clearAll();
    // this.map.off('resolutionchanged', this._mapResolutionchanged, this);
    this.map.off('extentchanged', this._mapExtentchanged, this);
    componentBase.prototype.unload.call(this);
  },

  /**
   * 新增图层
   * @param opts 配置参数
   * @param opts.keyWord: '视频', //非必填，关键字
   * @param opts.districtCode: '370686', // 非必填，行政区划编码
   * @param opts.type: 'gongan' // 非必填，统计接口返回的类型code
   * @param opts.geometry
   */
  addResource(opts: any) {
    this.clearAll();
    this.params = opts;
    if (opts.keyWord === '' && opts.districtCode === '' && opts.type === '' && opts.geometry === '') {
      this.notCluster = false;
    } else if (opts.districtCode !== '' || opts.district === 'district') {
      this.notCluster = false;
    } else {
      this.notCluster = true;
      // tslint:disable-next-line:no-shadowed-variable
      const opts: any = JSON.parse(JSON.stringify(this.params));
      const geometry = this.map.getExtent().asWkt();
      if (!opts.geometry) {
        opts.geometry = geometry;
      } else {
        opts.geometry = JSON.parse(opts.geometry);
        const geo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, 4326);
        const wkt = geo.asWkt();
        if (wkt === this.options.defaultExtentWkt) {
          opts.geometry = geometry;
        } else {
          opts.geometry = wkt;
        }
      }
      this.queryResource('video', opts);
    }
    this.options.selectDistrictCode = opts.districtCode;
    this.bufferDraw.removeBuffer(this.options.bufferId); // 清除周边视频
    if (opts.districtCode === '') {
      this.SaveAllListData(opts, 'county').then((res: any) => {
        this.showYanTaiLayer(res, 'county');
      });
      this.SaveAllListData(opts, 'town').then((res: any) => {
        this.showYanTaiLayer(res, 'town');
      });
    } else if (opts.districtCode !== '') {
      this.queryClusterResource(opts, 'county');
    }
    // this.queryResource('video', opts);
    this._setLayerVisibleBylevel();
  },
  addResourceSPJK(opts: any) {
    this.clearAll();
    this.params = opts;
    if (opts.type === 'gongan' && opts.keyWord === '') {
      this.notCluster = false;
    } else {
      this.notCluster = true;
      const opts1: any = JSON.parse(JSON.stringify(this.params));
      // const geometry = this.map.getExtent().asWkt();
      // if (!opts.geometry) {
      //   opts.geometry = geometry;
      // } else {
      //   opts.geometry = JSON.parse(opts.geometry);
      //   const geo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, 4326);
      //   const wkt = geo.asWkt();
      //   if (wkt === this.options.defaultExtentWkt) {
      //     opts.geometry = geometry;
      //   } else {
      //     opts.geometry = wkt;
      //   }
      // }
      this.queryResource('video', opts1);
    }
    this.options.selectDistrictCode = opts.districtCode;
    this.bufferDraw.removeBuffer(this.options.bufferId); // 清除周边视频
    if (opts.districtCode === '') {
      this.SaveAllListData(opts, 'county').then((res: any) => {
        this.showYanTaiLayer(res, 'county');
      });
      this.SaveAllListData(opts, 'town').then((res: any) => {
        this.showYanTaiLayer(res, 'town');
      });
    } else if (opts.districtCode !== '') {
      this.queryClusterResource(opts, 'county');
    }
    // this.queryResource('video', opts);
    this._setLayerVisibleBylevel();
  },
  removeResource() {
    this.options.status = 'remove';
    this.clearAll();
    // this.map.off('resolutionchanged', this._mapResolutionchanged, this);
    this.map.off('extentchanged', this._mapExtentchanged, this);
  },
  /**
   * 列表点击定位
   * @param field 字段名
   * @param value 字段值
   */
  locatResource(field: any, value: any) {
    const self = this;
    const type = 'video';
    const featureType = this._getFeatureInfo(type).featureType;
    const layer = this.simpleRenderMgr.getLayer(featureType);
    let flag: boolean = false;
    if (!layer) {
      setExtent();
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj[field] === value) {
          flag = true;
          this._changeExtent(element);
          this._addHighlight(type, element);
          break;
        }
      }
      if (!flag) {
        setExtent();
      }
    }
    function setExtent() {
      self.service.getVideoStationDetail({ id: value }).then((res: any) => {
        const geometry = new g2.sfs.Point({ x: res.data.x, y: res.data.y, spatialReference: g2.sfs.EnumSpatialReference.EPSG4326 });
        const ele = new g2.sfs.Element({
          geometry,
        });
        ele.tag = res.data;
        self._changeExtent(ele);
        self._addHighlight(type, ele);
      });
    }
  },
  // 显示点数据
  showPointOnMapDB(featureInfo: any) {
    const self = this;
    featureInfo.forEach((item: any) => {
      item.isDB = true;
      // const html = '';
      // const tooltip = new g2.widget.Tooltip({
      //     id: 'search_popup_EventPoints',
      //     anchor: new g2.sfs.Point({
      //         x: item.x,
      //         y: item.y,
      //     }),
      //     content: `<div id='${item.id}'><div class="hover-title"><div><span class="hover-title_txt"><i>${item.name}</i></span></div></div></div>`,
      //     layerId: 'search_result',
      //     offset: [3, -20],
      //     className: '',
      //     // 新增tooltip参数
      //     autoPan: false,
      //     autoPanMargin: 10,
      // });
      // this.toolTipWare.add(tooltip);
    });
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource.cluster;
    this.notCluster = true;
    const symbolMapper: any = SymbolMap.video;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.symbolConfig.icons[symbolMapper.iconFn('videoFeaturelayer', builddata)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
      buildClusterStyle: (builddata: any) => {
        return clusterSymbol;
      },
    });
    const opts = {
      featureType: 'VideoFeaturelayervideo',
      featureName: '视频监控图层',
      idField: 'id',
      list: featureInfo,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          self._addHighlightDB('video', element, attributeObj);
          self.fire(this.options.popupEventId, { type: 'video', data: attributeObj, visible: true });
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['x', 'y'] });
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[opts.featureType] = {};
    const poiArr: any = [];
    featureInfo.map((item: any) => {
      poiArr.push({
        type: 'wkt',
        geom: 'POINT(' + item.x + ' ' + item.y + ')',
      });
    });
    // 因为列表定时刷新 所以不控制视野
    // this.featureLocate.fit(poiArr);
  },
  /**
   * 列表点击定位
   * @param field 字段名
   * @param value 字段值
   */
  locatResource1(field: any, value: any, arr: any) {
    const self = this;
    const type = 'video';
    this.notCluster = true;
    const featureType = this._getFeatureInfo(type).featureType;
    const layer = this.simpleRenderMgr.getLayer(featureType);
    let flag: boolean = false;
    if (!layer) {
      setExtent();
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj[field] === value) {
          flag = true;
          this._changeExtent(element);
          this._addHighlightDB(type, element, value);
          break;
        }
      }
      if (!flag) {
        setExtent();
      }
    }
    function setExtent() {
      self.service.getVideoStationDetail({ id: value }).then((res: any) => {
        const geometry = new g2.sfs.Point({ x: res.data.x, y: res.data.y, spatialReference: g2.sfs.EnumSpatialReference.EPSG4326 });
        const ele = new g2.sfs.Element({
          geometry,
        });
        ele.tag = res.data;
        self._changeExtent(ele);
        self._addHighlightDB(type, ele, value);
      });
    }
  },
  // 移除高亮
  removeHighlight() {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 移除高亮
  removeHighlightById(id: any) {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.featureHighlight.removeHighlight(id);
    $('#' + id).remove();
  },
  clearHighlight() {
    this.featureHighlight.clearHighlight();
    this.toolTipWare.clear();
  },
  queryResource(type: any, opts: any) {
    this.options.status = 'add';
    const self = this;
    this.service.getAllVideoStations(opts).then((res: any) => {
      const result = res.data;
      const list: any = [];
      result.forEach((item: any) => {
        const obj = {
          _id: item.id,
          longitude: item.x,
          latitude: item.y,
          ...item,
        };
        list.push(obj);
      });
      if (self.options.status === 'add') {
        const featureInfo = this._getFeatureInfo(type, list);
        self.showPointOnMap(type, featureInfo);
      }
    });
  },
  // 查询聚合数据
  queryClusterResource(opts: any, districtType: any) {
    this.options.status = 'add';
    const self = this;
    const opt: any = opts;
    opt.districtType = districtType;
    this.service.getVideoStatistics2map(opt).then((res: any) => {
      const result = res.data;
      const list: any = [];
      result.forEach((item: any) => {
        const obj = {
          _id: item.districtCode,
          longitude: item.x,
          latitude: item.y,
          ...item,
        };
        list.push(obj);
      });
      this.showCountyTownLayer(list, opts.districtCode, districtType);
    });
  },
  //  区分一下，选中烟台市时候
  showYanTaiLayer(list: any, type: any) {
    const featureInfo = this._getFeatureInfo(type, list);
    if (this.options.status === 'add') {
      this.showClusterPointOnMap(featureInfo);
    }
  },
  // 选中区县的时候
  showCountyTownLayer(list: any, districtCode: any, districtType: any) {
    const countyList: any = [];
    const townList: any = [];
    const arrDistrict = districtCode.split(',');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < arrDistrict.length; i++) {
      list.forEach((item: any) => {
        if (arrDistrict[i] === item.districtCode) {
          countyList.push(item);
        } else if (arrDistrict[i] !== item.districtCode && item.districtCode.indexOf(arrDistrict[i]) >= 0) {
          townList.push(item);
        }
      });
      this.options.selectDistrictCode = arrDistrict[i];
    }
    if (this.options.status === 'add') {
      const featureInfo = this._getFeatureInfo('county', countyList);
      this.showClusterPointOnMap(featureInfo);
      const featureInfo1 = this._getFeatureInfo('town', townList);
      this.showClusterPointOnMap(featureInfo1);
    }
  },
  // 显示点数据
  showPointOnMap(type: any, featureInfo: any) {
    const self = this;
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource.cluster;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.symbolConfig.icons[symbolMapper.iconFn(builddata.type, builddata)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
      buildClusterStyle: (builddata: any) => {
        return clusterSymbol;
      },
    });
    const opts = {
      featureType: featureInfo.featureType,
      featureName: '视频监控图层',
      idField: '_id',
      list: featureInfo.data,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          // 在线
          if (attributeObj.isOnline === '1') {
            self._addHighlight(type, data[0].element);
            self.fire(this.options.popupEventId, { type, data: attributeObj, visible: true });
          }
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
    // this.simpleRenderMgr.setVisible(opts.featureType, false);
    this.featureTypeSet[opts.featureType] = {};
    // this._fitBounds(opts.featureType);
    if (!this.notCluster) {
      if (this.map.getZoomLevel() >= 14) {
        this.simpleRenderMgr.setVisible(opts.featureType, true);
      } else {
        this.simpleRenderMgr.setVisible(opts.featureType, false);
      }
    }
    if (this.notCluster) {
      const poiArr: any = [];
      featureInfo.data.map((item: any) => {
        poiArr.push({
          type: 'wkt',
          geom: 'POINT(' + item.longitude + ' ' + item.latitude + ')',
        });
      });
      if (poiArr.length !== 0) {
        this.featureLocate.fit(poiArr);
      }
    }
    // if (this.notCluster) {
    //   this._fitBounds(opts.featureType);
    // } else {
    //   const level = this.map.getZoomLevel();
    //   const video = this._getFeatureInfo('video').featureType;
    //   const town = this._getFeatureInfo('town').featureType;
    //   const county = this._getFeatureInfo('county').featureType;
    //   // 区县聚合
    //   if (level <= 11) {
    //     this.simpleRenderMgr.setVisible(county, true);
    //     this.simpleRenderMgr.setVisible(town, false);
    //     this.simpleRenderMgr.setVisible(video, false);
    //   } else if (11 <= level && level <= 14) {
    //     this.simpleRenderMgr.setVisible(county, false);
    //     this.simpleRenderMgr.setVisible(town, true);
    //     this.simpleRenderMgr.setVisible(video, false);
    //   } else if (level >= 14) {
    //     this.simpleRenderMgr.setVisible(county, false);
    //     this.simpleRenderMgr.setVisible(town, false);
    //   }
    // }

  },
  // 显示聚合图层
  showClusterPointOnMap(featureInfo: any) {
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        return this._setClusterSymbolSize(builddata);
      },
    });
    const opts = {
      featureType: featureInfo.featureType,
      featureName: '视频监控聚合图层',
      idField: '_id',
      list: featureInfo.data,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
    this.simpleRenderMgr.setVisible(opts.featureType, false);
    this.featureTypeSet[opts.featureType] = {};
    if (!this.params.district || this.params.district !== 'district') {
      this._fitBounds(opts.featureType);
    }
    this._setLayerVisibleBylevel();
  },
  // 初始化查询保存烟台市区县统计和乡镇统计数据
  SaveAllListData(opts: any, districtType: any) {
    this.options.status = 'add';
    const opt: any = {
      districtCode: opts.districtCode,
      districtType,
      keyWord: opts.keyWord,
      type: opts.type,
      themeCode: opts.themeCode,
    };
    if (opts.geometry) {
      const geo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(JSON.parse(opts.geometry), 4326);
      opt.geometry = geo.asWkt();
    }
    return new Promise((resolve, reject) => {
      this.service.getVideoStatistics2map(opt).then((res: any) => {
        const result = res.data;
        const list: any = [];
        result.forEach((item: any) => {
          const obj = {
            _id: item.districtCode,
            longitude: item.x,
            latitude: item.y,
            ...item,
          };
          list.push(obj);
        });
        resolve(list);
      });
    });

  },
  // 监听地图等级变化
  _mapResolutionchanged(e: any) {
    this._setLayerVisibleBylevel();
  },
  _mapExtentchanged(e: any) {
    this._setLayerVisibleBylevel();
  },
  // 根据地图等级设置地图显隐
  _setLayerVisibleBylevel() {
    if (this.notCluster) {
      const town = this._getFeatureInfo('town').featureType;
      const county = this._getFeatureInfo('county').featureType;
      const video = this._getFeatureInfo('video').featureType;
      this.simpleRenderMgr.setVisible(county, false);
      this.simpleRenderMgr.setVisible(town, false);
      this.simpleRenderMgr.setVisible(video, true);
    } else {
      const level = this.map.getZoomLevel();
      const video = this._getFeatureInfo('video').featureType;
      const town = this._getFeatureInfo('town').featureType;
      const county = this._getFeatureInfo('county').featureType;
      // 区县聚合
      if (level <= 11) {
        this.simpleRenderMgr.setVisible(county, true);
        this.simpleRenderMgr.setVisible(town, false);
        this.simpleRenderMgr.setVisible(video, false);
      } else if (11 <= level && level <= 14) {
        this.simpleRenderMgr.setVisible(county, false);
        this.simpleRenderMgr.setVisible(town, true);
        this.simpleRenderMgr.setVisible(video, false);
      } else if (level >= 14) {
        this.simpleRenderMgr.setVisible(county, false);
        this.simpleRenderMgr.setVisible(town, false);
        const opts = JSON.parse(JSON.stringify(this.params));
        const geometry = this.map.getExtent().asWkt();
        if (!opts.geometry) {
          opts.geometry = geometry;
        } else {
          opts.geometry = JSON.parse(opts.geometry);
          const geo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(opts.geometry, 4326);
          const wkt = geo.asWkt();
          if (wkt === this.options.defaultExtentWkt) {
            opts.geometry = geometry;
          } else {
            opts.geometry = wkt;
          }
        }
        this.queryResource('video', opts);
        // if (this.map.getZoomLevel()>= 14) {
        //   this.simpleRenderMgr.setVisible(video, true);
        // }
      }
    }
  },
  // 设置聚合图层的符号，根据点的数量来设置大小
  _setClusterSymbolSize(builddata: any) {
    const count: any = builddata.total;
    const countLevel: any = [[0, 99], [100, 500], [501, 1000], [1001, 2000], [2001, 4000], [4001, 6000], [6001, 8000], [8001, 10000], [10001, 15000], [15001, 30000], [30000, 100000]];
    const size: any = [19, 23, 27, 30, 34, 38, 42, 45, 48, 51, 54];
    let circleSize: any = null;
    for (let i = 0; i < countLevel.length; i++) {
      if (countLevel[i][0] <= count && count <= countLevel[i][1]) {
        circleSize = size[i];
        break;
      }
    }
    const SymbolObj = {
      borderColor: { a: 127, r: 200, g: 0, b: 0 },
      fillColor: { a: 127, r: 200, g: 0, b: 0 },
      borderThickness: 2,
      size: circleSize,
      style: 'circle',
    };
    const simpSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleMarkerSymbol', SymbolObj);
    const textSym = new (g2 as any).sfs.TextSymbol({
      text: builddata.total,
      fontFamilyName: 'Microsoft Yahei',
      fontSize: 20,
      textAlign: 'center',
      foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
    });
    const CurrencySymbol = new (g2 as any).sfs.CurrencySymbol({
      textSymbol: textSym,
      markerSymbol: simpSymbol,
    });
    return CurrencySymbol;
  },
  _addHighlightDB(type: any, element: any, id: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    let attributeObj: any = null;
    if (element.tag) {
      attributeObj = element.tag;
    } else {
      attributeObj = Util.attributeSet2Object(element.attributeSet);
    }

    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn('videoFeaturelayer', attributeObj)];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(id, options);
    const point = new g2.sfs.Point({
      x: element.geometry.x,
      y: element.geometry.y,
      spatialReference: this.map.spatialReference,
    });
    // this.map.pan(point);
    // this.map.zoomTo(10);
    this.timeout = setTimeout(() => {
      _setbink();
    }, 3500);
    function _setbink() {
      // self.removeHighlight();
      const options2 = options;
      options2.blink.enable = false;
      self.featureHighlight.addHighlight(id, options2);
    }
  },
  _addHighlight(type: any, element: any) {
    const self = this;
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
      symbolMapper = SymbolMap[type];
    } else {
      symbolMapper = SymbolMap.default;
    }
    const symbolObj: any = Util.toJSON(symbolMapper.hlSymbol);
    let attributeObj: any = null;
    if (element.tag) {
      attributeObj = element.tag;
    } else {
      attributeObj = Util.attributeSet2Object(element.attributeSet);
    }

    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconHlFn(attributeObj.type, attributeObj)];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
    const point = new g2.sfs.Point({
      x: element.geometry.x,
      y: element.geometry.y,
      spatialReference: this.map.spatialReference,
    });
    // this.map.pan(point);
    // this.map.zoomTo(10);
    this.timeout = setTimeout(() => {
      _setbink();
    }, 3500);
    function _setbink() {
      self.removeHighlight();
      const options2 = options;
      options2.blink.enable = false;
      self.featureHighlight.addHighlight(self.options.highLightId, options2);
    }
  },
  // 清除所有
  clearAll() {
    this.clearLayers();
    this.removeHighlight();
  },
  // 清除图层
  clearLayers() {
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
  },
  // 设置图层名称
  _getFeatureInfo(type: any, data: any) {
    const featureType = 'VideoFeaturelayer' + type;
    if (!data) {
      return {
        featureType,
      };
    }
    return {
      featureType,
      data,
    };
  },
  // 视野定位
  _changeExtent(element: any) {
    const level = this.map.getZoomLevel();
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
    if (level <= 14) {
      const locateObj = {
        type: 'wkt',
        geom: element.geometry.asWkt(),
      };
     // this.featureLocate.fit([locateObj]);
    } else {
      this.map.setCenter(element.geometry);
    }
  },
  // 视野定位
  _fitBounds(featureType: any) {
    if (this.options.selectDistrictCode === '') {
      this.setView(publishObjectPath.value.district.root);
    } else {
      this.setView(this.options.selectDistrictCode);
    }
  },
  // 视野定位
  setView(districtcode: any) {
    if (this.notCluster) {
      return;
    }
    installDisasterJudgeServer.districtServer.getDistrictByCode({ districtcode }).then((res: any) => {
      const wkt = res.data.wkt;
      this.options.featureLocate.fit({
        type: 'wkt',
        geom: wkt,
      });
      this.map.zoomTo(this.map.getZoomLevel());
    });
  },
});
export default component;
