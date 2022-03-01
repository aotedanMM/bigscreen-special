// 灾情研判指挥调度
import Util from '../../Util';
import SymbolMap from './SymbolMap';
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    service: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    // 300公里 查询范围
    radius: 300,
    highLightId: 'disaster_judge_command_dispatch', // 高亮id
    clickEventId: 'mapclick',
    // popupEventId: 'popup', // 添加弹窗后执行事件id
    // 数据查询完成后的事件，发送给前端查询的结果数据
    dataEventId: 'dataready',
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.symbolConfig = options.symbolConfig;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureTypeSet = {};
  },
  //  销毁
  destroy() {
    this.unload();
    this.simpleRenderMgr = null;
    this.symbolConfig = null;
    this.featureLocate = null;
    this.featureHighlight.clearHighlight();
    this.featureHighlight = null;
    this.featureTypeSet = null;
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load() {
    ComponentBase.prototype.load.call(this);
  },

  /**
   * 卸载
   */
  unload() {
    this._clear();
    ComponentBase.prototype.unload.call(this);
  },
  /**
   * 获取设备数据
   * @param opts.point [Array]
   * @param opts.radius [Number] 单位千米
   */
  fitToExtent(opts: any) {
    const centerGeom = new (g2 as any).sfs.Point({
        x: opts.point[0],
        y: opts.point[1],
        spatialReference: 4326,
    });
    const jstsGeom = (G as any).utils.GeometryUtil.toJstsGeometry(centerGeom);
    const bufferWkt = (G as any).utils.SpatialOPUtil.getBuffer({
        geometry: jstsGeom.toString(),
        radius: opts.radius,
        spatialReference: 4326,
    });
    const g2geom = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(bufferWkt);
    const circleBufferZone = g2geom.asGeoJson();
    const locateObj = {
      type: 'geojson',
      geom: circleBufferZone,
    };
    this.featureLocate.fit([locateObj]);
  },
  /**
   * 新增图层
   * @param opts.type 业务类型类型标识
   * @param opts.list 数据列表
   * @param opts.autoPan {Boolean}
   */
  addResource(opts: any) {
    this._clear();
    const featureInfo = this._getFeatureInfo(opts.type, opts.list);
    this._showResourcesOnMap(opts.type, featureInfo);
    if (!(opts.autoPan === false)) {
      this.locateTerminaldata(featureInfo.featureType);
    }
  },
  /**
   * 移除图层
   * @param opts
   */
  removeResource(opts: any) {
    const featureType = this._getFeatureInfo(opts.type).featureType;
    this.simpleRenderMgr.remove(featureType);
    this._removeHighlight();
    delete this.featureTypeSet[featureType];
  },

  /**
   * 列表点击地图定位时调用
   * @param type 类型
   * @param field
   * @param value
   */
  locate(type: any, field: any, value: any) {
    const featureType = this._getFeatureInfo(type).featureType;
    const layer = this.simpleRenderMgr.getLayer(featureType);
    if (!layer) {
      return;
    }
    if (layer.getLayerType() === 4 || layer.getLayerType() === 8) {
      for (const element of layer.elements) {
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        if (attributeObj[field] === value) {
          const locateObj = {
            type: 'wkt',
            geom: element.geometry.asWkt(),
          };
          // this.featureLocate.fit([locateObj]);
          this._addHighlight(element);
          break;
        }
      }
    }
  },

  clearHighlight() {
    this._removeHighlight();
  },

  _clear() {
    for (const featureType of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    }
    this._removeHighlight();
  },

  /**
   * 获取设备数据
   * @param opts.point [Array]
   * @param opts.radius [Number] 单位千米
   * @param opts.type [String] 北斗终端：1；|天通终端：2；|视频回传：3；|短波电台：4；|消防车辆：5；|消防移动终端：6；|全部（1,2,3,4,5,6）：0
   * @param [opts.order] [String] 默认为空
   */
  _getTerminalList(opts: any) {
    this.options.service.getTerminalList(opts).then((res: any) => {
      console.log('res', res);
      const featureInfo = this._getFeatureInfo(opts.type, res);
      // console.log(key, data, icon);
      this._showResourcesOnMap(opts.type, featureInfo);
      this.locateTerminaldata(featureInfo.featureType);
    });
  },
  /**
   * 添加数据到图层
   * @param dataCol
   * @param type
   */
  _showResourcesOnMap(type: any, featureInfo: any) {
    // this.removeResource(type);
    const self = this;
    const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource.cluster;
    console.log(featureInfo.icon);
    console.log(featureInfo.data);
    let symbolMapper: any = null;
    if (SymbolMap[type]) {
        symbolMapper = SymbolMap[type];
    } else {
        symbolMapper = SymbolMap.default;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        // 根据数据属性控制不同的显示效果 communicationEquiphcLayer01_img
        // const icon = this.symbolConfig.icons[('communicationEquiphcLayer' + type + '_img') as any];
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = this.symbolConfig.icons[symbolMapper.iconFn(featureInfo.icon)];
        return G.utils.RenderUtil.object2Symbol(symbolObj);
      },
      buildClusterStyle: (data: any) => {
        return clusterSymbol;
      },
    });
    const opts = {
      featureType: featureInfo.featureType,
      featureName: '指挥调度-装备图层',
      idField: '_id',
      list: featureInfo.data,
      type: 0,   // 使用元素图层
      // type: 3,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        // 注册点击事件
        click: (data: any) => {
          // 清除上一次的高亮
          self._removeHighlight();
          self._addHighlight(data[0].element);
          //
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          // 处理坐标，属性名统一为x y，提供周边查询、路径规划使用
          attributeObj.x = element.geometry.x;
          attributeObj.y = element.geometry.y;
          this.locate(type, attributeObj.id);
          this.fire(this.options.clickEventId, {
            data: attributeObj,
            type,
          });
        },
      },
    };
    // if (type === 5 || type === 6) {
    //   opts.type = 3;  // 使用g2聚类图层
    // }
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
    // 记录展示的数据类型
    this.featureTypeSet[opts.featureType] = {};
    // this._fitMap({type});
  },
  // 设置图层名称
  _getFeatureInfo(type: any, data: any) {

    const featureType = 'communicationEquiphcLayer0' + type;

    if (!data) {
      return {
        featureType,
      };
    }

    // const key = Object.keys(res.data)[0];
    // const data = res.data[key];
    const icon = 'communicationEquiphcLayer0' + type + '_img';
    return {
      featureType,
      data,
      icon,
    };
  },

  _addHighlight(element: any) {
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + element.geometry.x + ' ' + element.geometry.y + ')',
      },
      style: {
        type: 'Custom',
        options: {
          content: this._hightLightContent(element),
          offsetX: 0,
          offsetY: 0,
        },
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
  },

  // 移除高亮
  _removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
  },
  // 高亮ovleryLay内容
  _hightLightContent(data: any, BFS: any) {
    const id = data.id + '1';
    let classname = 'wave_container_point_communication wave_red';
    if (BFS) {
      classname = 'wave_container_point_communicationBFS wave_red';
    }

    const content = '<div id="' + id + '" class="' + classname + '">' +
      '<div class="_wave_point _wave1"></div>' +
      '<div class="_wave_point _wave2"></div>' +
      '<div class="_wave_point _wave3"></div>' +
      '</div>' +
      '</div>';
    return content;
  },

  // 定位
  locateTerminaldata(type: string) {
    const layer = this.simpleRenderMgr.getLayer(type);
    if (!layer) {
      return;
    }
    const arr = [];
    // 处理组合图层中的要素图层
    if (layer.getLayerType() === 99) {
      // console.log(layer);
      if (!!layer.groupLayers[0] && layer.groupLayers[0].getLayerType() === 3) {
        const features = layer.groupLayers[0].features;
        for (const feature of features) {
          if (!!feature.geometry && !!feature.geometry.x && !!feature.geometry.y) {
            const sim = {
              type: 'wkt',
              geom: feature.geometry.asWkt(),
            };
            arr.push(sim);
          }
        }
      }
      // return;
      // 处理元素图层或聚类图层
    } else if (layer.getLayerType() === 8 || layer.getLayerType() === 4) {
      for (const k of layer.elements) {
        if (!!k.geometry && !!k.geometry.x && !!k.geometry.y) {
          const sim = {
            type: 'wkt',
            geom: k.geometry.asWkt(),
          };
          arr.push(sim);
        }
      }
    }
    if (arr.length > 0) {
      this.featureLocate.fit(arr);
    }
  },
});
export default component;
