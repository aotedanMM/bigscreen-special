// 视频监控组件
import SymbolMap from './SymbolMap';
import Util from '../../Util';
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
    bufferDraw: null,
    featureType: 'VideoFeaturelayer', // VideoFeaturelayer
    highLightId: 'VideoLayerHL', // 高亮id
    popupId: 'VideoLayer_popup_id', // 弹窗id
    popupEventId: 'VideoLayer_popup', // 添加弹窗后执行事件id
    status: 'add', // 状态
    bufferRadius: 1000,
    bufferId: 'nearbyVideoQuery',
    // 缓冲参数
    drag: {
        visible: true,
        style: {
            type: 'PictureMarkerSymbol',
            options: {
                source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzdCRTQ5OTYzRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzdCRTQ5OTczRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDN0JFNDk5NDNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDN0JFNDk5NTNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpA7b9wAAAPDSURBVHjarFZbTxNREJ7d7ba7lbaAgqBUMETEW9OggCYiYIyKJhp+gA/6B4wPhGhMjET9CaivXggxXogkaqLxQXxofCCKFRSjQohRgZa2WLbXXWfWs02tB2ONk3xJe2Z25pvvzDm7Ql9fH3BMQEigaeWQTu8Cw9iB/0sQ1fA3ZhgGCMIs/gojXiGeg8czzwu1cQrbIJWqhETiOOj6YX9LS+X6hga3Q1Gk0rIyB/ylLcZiqaV4PPN5evr7i5GROYhEhpDUFSQS/qVgngJUXIFkcgsWP9dx4IC/pa2t2m63S8bPrqBoEwQzKT5pvHj27Mvj4eGXuHYKSUwWKkBxKmQyjVj8Uld397amnTurdF2HbDYL/8GE5ra2NStcLnloYKAfotFjSOJLPgHZ3F9NO7m3q2uzv7W1KpPJwH81bGaTz1eRTCS2PLx79yKunKBlkaEU9313jdfb3NrevjaLxal7Hvb1BE0U6yNkUE2cqaqtTU17UIUOi4AdUYkE9qCznDon2XkJ9veO5zX0u98yiuOSwLyU37d9+0qcqSMWAdUkoOt1NXV1nmw6bQYW4uDpt7kCDy5s4MbQumUUz4shdau9XjeGNFsEFEQZMnKqTqecpcErwKGz73OJh/vqgRdjgfyW0XOFftoGUZJErFWC2+CysQFUkIAoCoJAAcYfjpxe5KngxRtIRLbbRS2RUMTcMRTFBF4caYPtVT7unfXmHj56foorrQXyW0bPFfpZfiMWiWjgdoeIAFFMIoHw/Oxs3MDLgyft7TNrc4m7L8xwY2jdMornxZC2USouCNMkhmgWx5sTZHn6XTC4INtswFOBcKu36hdpC2EZxfH8lNeG+SffvAkhgadEgGZgCTEHDsfE2Oior76hwbOmtnYVXhjcWRjsqcwdw2J8OF5gk2UIzc1FR548mQRFGbJOASnwDfEVVDVwb2DgYyQcjuKQmHItd6kUA2qEiqeSyaWbV6++B0m6jA2HiIDU2dlJdTLmIEqSDanqrwMBtaa21rGyosJpsARFg3UtoeSKqkIkFIpc6+9/h1t9HUpK7rDGc++CBGLGvBUd+MYVxfjQ4GB8q9+/rtHnK3N7PKq7tFQ1ONIu+/YRRdDi8eRiNKqNjo8vjAYCnzD3DVT5Ptt2I5+Abg4iwAdEClnGaCiDExMbg2Nj61FHD8L9D6/jRWwmhJM3Bi7XI/xN+SPs5P32QUKLMUZiAbEaGU8h3Oy2lIq5f5iq1FTInK+fX0dLzLfsF5HOgpLsASfCweKEIghYc5VCaAzcK/SHAAMA4XIlf6DGCVoAAAAASUVORK5CYII=',
                width: 32,
                height: 20,
                opacity: 1,
                rotation: 0,
            },
        },
    },
    axis: {
        visible: true,
        style: {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 153,
                    r: 123,
                    g: 0,
                    b: 11,
                },
                style: 5,
                width: 2,
            },
        },
    },
    label: {
        visible: true,
        position: 'center',
        style: {
            type: 'TextSymbol',
            options: {
                text: '',
                foreground: {
                    r: 255, g: 0, b: 0, a: 255,
                },
                borderColor: {
                    a: 150, r: 255, g: 255, b: 255,
                },
                borderThickness: 0,
                fontSize: 20,
                fontWeight: 500,
                offsetX: 0,
                offsetY: 0,
            },
        },
    },
    fill: {
        visible: true,
        style: {
            type: 'SimpleFillSymbol',
            options: {
                borderColor: {
                    a: 255, r: 51, g: 255, b: 173,
                },
                fillColor: {
                    a: 38, r: 144, g: 247, b: 227,
                },
                style: 5,
                borderThickness: 2,
            },
        },
    },
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
    this.featureTypeSet = {};
  },
   /**
     * 加载
     * @param opts
     * @param opts.point {Array}
     * @param opts.radius {Number}
     */
  load(opts: any) {
    componentBase.prototype.load.call(this);
    this._load(opts);
  },
  destroy() {
    this.featureTypeSet = {};
    componentBase.prototype.destroy.call(this);
  },
  // 卸载
  unload() {
    this.removeResource();
    componentBase.prototype.unload.call(this);
  },
  // 绘制缓冲区域
  _load(opts: any) {
    return new Promise((resolve, reject) => {
        let radius: any = this.options.bufferRadius;
        if (opts && opts.radius) {
            radius = opts.radius;
        }
        const param = {
            id: this.options.bufferId,
            name: 'bufferPolygon',
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: opts.point,
                },
            },
            buffer: {
                radius,
                callback: async (bufferGeom: any, queryRadius: any) => {
                  this._fit(bufferGeom);
                  const polygon = (g2 as any).sfs.GeometryFactory.createGeometryFromGeoJson(bufferGeom, 4326);
                  this.addResource({geometry: polygon.asWkt()});
                  resolve(polygon.asWkt());
                },
                drag: this.options.drag,
                axis: this.options.axis,
                label: this.options.label,
                fill: this.options.fill,
                // 关闭按钮点击
                onClose: () => {
                  this.fire('closeNearByClick');
                  this.unload();
                },
            },
        };
        this.bufferDraw.buffer(param);
    });
  },
  /**
   * 新增图层
   * @param opts 配置参数
   * @param opts.geometry: 'gongan' // 非必填，统计接口返回的类型code
   */
  addResource(opts: any) {
    this.clearAll();
    const opt: any = {
        keyWord: '',
        districtCode: '',
        type: '',
        geometry: opts.geometry,
    };
    this.queryResource('video', opt);
  },
  removeResource() {
    this.options.status = 'remove';
    this.clearAll();
    this.bufferDraw.removeBuffer(this.options.bufferId);
  },
  // 移除高亮
  removeHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
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
          if (attributeObj.isOnline === '1') {
            self._addHighlight(type, data[0].element);
            self.fire(self.options.popupEventId, {type, data: attributeObj, visible: true});
          }
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[opts.featureType] = {};
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
    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
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
  },
  // 视野变化
  _fit(geometry: any) {
    const data = {
        type: 'geojson',
        geom: geometry,
    };
    this.options.featureLocate.fit(data);
},
  // 清除所有
  clearAll() {
    this.removeHighlight();
    this.clearLayers();
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
});
export default component;
