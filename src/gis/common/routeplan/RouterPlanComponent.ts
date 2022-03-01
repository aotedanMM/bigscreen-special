import { ServiceMapping } from './ServiceMapping';
import symbols from './symbols';
// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    apiPrefix: '',
    egis: {
      server: '',
      tokenServer: '',
      clientId: '',
      clientSecret: '',
    },
    symbols,
    locationService: null,
    currentId: '',
  },
  // 初始化publicPath
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    //
    this.options.apiPrefix = this.options.egis.server;
    this.LayerUtil = {
      wrapUrl(url: any, apiPrefix: any) {
        if (/^https?\:\/\/.*$/.test(url)) {
          return url;
        } else {
          if (url && url.indexOf(apiPrefix) === 0) {
            return url;
          } else {
            return apiPrefix + url;
          }
        }
      },
    };
    this.serviceMapping = new ServiceMapping(this.options.egis);
    // this.id = options.id || G.utils.CommonUtil.newUUID32();
    // this.map = map;
    // this.options = options;

    // this.currentPosition = null;
    // this.roadInfo = null;
    // this.roadPathEle = null;

    this.GeometryUtil = G.utils.GeometryUtil;
    // this.LayerUtil = {
    //   wrapUrl(url: any, apiPrefix: any) {
    //     if (/^https?\:\/\/.*$/.test(url)) {
    //       return url;
    //     } else {
    //       if (url && url.indexOf(apiPrefix) == 0) {
    //         return url;
    //       } else {
    //         return apiPrefix + url;
    //       }
    //     }
    //   },
    // };
    // //
    this.addTo();
    // this._initService();
  },

  addTo() {
    this._initPathLayers();
    this._initService();
    this._initializePointDrawCommand();
  },
  // 单击列表中路线，在地图高亮对应线路
  showSingleRoad(item: any) {
    const pathPolyline = item.poly;
    if (pathPolyline instanceof g2.sfs.LineString ||
      pathPolyline instanceof g2.sfs.Polyline) {
      if (this.roadPathEle) {
        this.routeLayers.remove(this.roadPathEle);
      }
      let color;
      let pathSymbol;
      if (item.status || item.status === 0) {
        const color2 = this.options.symbols.router.state[item.status];
        color = g2.sfs.Color.fromHex(color2);
        pathSymbol = new g2.sfs.SimpleLineSymbol({
          width: 10,
          color,
          style: 5,
        });
      } else {
        pathSymbol = new g2.sfs.SimpleLineSymbol({
          width: 8,
          color: new g2.sfs.Color({ a: 255, r: 225, g: 40, b: 40 }),
          style: 5,
        });
      }
      this.roadPathEle = new g2.sfs.Element({ geometry: pathPolyline, symbol: pathSymbol });
      this.routeLayers.add(this.roadPathEle);
      this.map.pan(pathPolyline);
      this.map.zoomOut();
    }
  },
  // 初始化图层
  _initPathLayers() {
    const self = this;
    // this.addRealTimeTraffic();//初始化时，加载实时路况图层，设置不可见
    this.routeLayers = new g2.carto.ElementLayer({
      map: this.map,
      zIndex: 20,
    });
    this.map.addLayer(this.routeLayers);

    this.highlightLayer = new g2.carto.ElementLayer({
      map: this.map,
      zIndex: 20,
    });
    this.map.addLayer(this.highlightLayer);

    // 图层参数
    const networkLayerOpts = {
      id: 'networkLayer',
      name: '路径分析图层',
      zIndex: 26,
      opacity: 1.0, // 透明度
      visible: true, // 是否显示
    };
    this.networkLayer = new g2.carto.ElementLayer(networkLayerOpts);
    this.map.addLayer(this.networkLayer);
    if (!this.toolTipWare) {
      this.toolTipWare = new g2.widget.TooltipWare({ map: this.map });
    }
    this.map.on('click', function(button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) {
      const eleDelete = self.networkLayer.hitTest(screenX, screenY);
      if (!!eleDelete && eleDelete.element.id.indexOf('delete') !== -1) {
        const teamId = eleDelete.element.id.split('delete')[1];
        self.clearResultsById(teamId);
        self.clearRouteResultsById(teamId);
        self.fire('closeDialog', teamId);
        return;
      }
      const ele = self.routeLayers.hitTest(screenX, screenY);
      if (!!ele) {
        self.fire('openDialog', ele.element.id);
      }
    });
  },

  // 初始化服务
  _initService() {
    // 路径规划
    this.WRPSService = this.createService('RestWRPSService', {
      url: this.LayerUtil.wrapUrl('/egis/base/v1', this.options.apiPrefix),
    });
    // 地名搜索
    this.wpssService = this.createService('RestWPSSService', {
      url: this.LayerUtil.wrapUrl('/egis/base/v1', this.options.apiPrefix),
      deserializer: new g2.core.Deserializer(),
    });
    this.WRGSService = this.createService('RestWRGSService', {
      url: this.LayerUtil.wrapUrl('/egis/base/v1', this.options.apiPrefix),
    });
    this.WILSService = this.createService('RestWILSService', {
      url: this.LayerUtil.wrapUrl('/egis/base/v1', this.options.apiPrefix),
    });
  },

  /**
   * 初始化地图标点命令
   */
  _initializePointDrawCommand() {
    const self = this;
    // 创建一个命令管理实例，用来管理所有命令（包括标绘命令）
    const commandManager = new g2.gdm.CommandManager();
    this.options.commandNotify = new g2.gdm.CommandNotify({
      manager: commandManager,
    });
    // 创建一个空的点对象
    const markerSymbol = new g2.sfs.SimpleMarkerSymbol({
      offsetX: 0,
      offsetY: 0,
      fillColor: new g2.sfs.Color({ a: 255, r: 0, g: 0, b: 0 }),
      size: 6,
    });
    const point = new g2.sfs.Point({
      spatialReference: this.map.spatialReference,
    });
    const pointEle = new g2.sfs.Element({
      geometry: point,
      symbol: markerSymbol,
    });
    const pointPlot = new g2.plot.PlotTool({
      id: 'pointPlot22',
      drawTemplate: pointEle,
      algorithm: new g2.plot.PointAlgorithm(),
      elements: [pointEle],
      name: '点符号',
      plotLayer: this.networkLayer,
    });
    const nooptool = new g2.interact.NoopTool({
      id: 'NoopTool',
      cursor: 'pointer',
    });
    // 先取消上一个编辑
    if (this.plotEditTool) {
      this.plotEditTool.deactivate();
      this.plotEditTool = null;
    }
    const plotEditTool = new g2.plot.PlotEditTool({
      id: 'plotEditTool',
      layer: this.networkLayer,
    });
    this.plotEditTool = plotEditTool;
    // 将命令放到命令管理中统一管理
    commandManager.add(pointPlot);
    commandManager.add(nooptool);
    commandManager.add(plotEditTool);
    // 标绘编辑采用的选中绘制集合
    const graphicSet = new g2.carto.GraphicSelectionSet();
    // 命令构造器
    commandManager.onCreate({
      map: this.map,
      commandNotify: this.options.commandNotify,
      graphicSelectionSet: graphicSet,
      spatialRef: {
        srid: this.options.spatialReference,
      },
    });
    pointPlot.onEndDraw = function(plotElement: any) {
      self.options.commandNotify.activeCommand('NoopTool');
      const activeButton = this.data_activeButton;
      const id = self._getPointId(
        activeButton.position,
        activeButton.iconClass,
      );
      if (self.networkLayer.contains(id)) {
        self.networkLayer.remove(self.networkLayer.find(id));
      }

      self.networkLayer.remove(plotElement);
      const markerSymbol1 = self._getPointSymbol(activeButton.iconClass);
      const pointEle1 = new g2.sfs.Element({
        id,
        geometry: plotElement.elements[0].geometry,
        symbol: markerSymbol1,
      });
      self.networkLayer.add(pointEle1);
      if (id.indexOf('start') !== -1) {
        self._addDeletePoint(plotElement.elements[0].geometry);
      }
      self
        .request2({
          x: plotElement.elements[0].geometry.x,
          y: plotElement.elements[0].geometry.y,
        })
        .then((res: any) => {
          activeButton.location = {
            lon: res.x,
            lat: res.y,
          };
          activeButton.address = res.address;
          if (id.indexOf('start') !== -1) {
            self.fire('dealPathMainDatasStart', activeButton);
          } else if (id.indexOf('end') !== -1) {
            self.fire('dealPathMainDatasEnd', activeButton);
          } else {
            self.fire('dealPathMainDatasMiddle', activeButton);
          }
          console.log('activeButton', activeButton);
        })
        .catch((errInfo: any) => {
          self.fire('error', errInfo);
        });
      // activeButton.nextElementSibling.value = G.utils.ResourceUtil.getLocaleValue('PathAnalysis').selectLocation || "手动选点";
      // plotElement.elements[0].id = id;
      // activeButton.nextElementSibling.data_user = plotElement.elements[0].geometry;
    };
  },

  /**
   * 创建服务
   * @param {String} className 服务名称
   * @param {Object} opts 服务参数
   */
  createService(className: any, opts: any) {
    const conf = this.serviceMapping.conf;
    if (!conf[className]) {
      throw new Error('服务类型不存在');
    }
    return new conf[className].name(
      $.extend(
        {},
        {
          authType: conf[className].authType,
          tokenUrl: conf[className].tokenUrl,
          clientId: conf[className].clientId,
          clientSecret: conf[className].clientSecret,
        },
        opts,
      ),
    );
  },
  //  销毁
  destroy() {
    this.cache = null;
    componentBase.prototype.destroy.call(this);
  },

  load() {
    componentBase.prototype.load.call(this);
  },

  unload() {
    //
    componentBase.prototype.unload.call(this);
  },

  /**
   * 查询驾车路径
   * @param opts
   * @returns {Promise<any>}
   */
  queryPath(opts: any) {
    this.options.currentId = opts.stops[0].id || opts.stops[1].id;
    return new Promise((resolve, reject) => {
      if (opts.clickMoreState) {
        this.showBriefPopup = false;
      } else {
        this.showBriefPopup = true;
      }
      if (opts.dontpan) {
        this.dontpan = true;
      } else {
        this.dontpan = false;
      }
      if (opts.isShowHistory) { // 是否同时显示历史轨迹
        this.isShowHistory = true;
      } else {
        this.isShowHistory = false;
      }
      // this.clearRouteResults();
      const self = this;
      const origin = [0, 0];
      const destination = [0, 0];
      const wayPoints = [];
      const strategy = isNaN(opts.style) ? 2 : opts.style;
      for (let i = 0; i < opts.stops.length; i++) {
        const x = parseFloat(opts.stops[i].lon);
        const y = parseFloat(opts.stops[i].lat);
        if (i === 0) {
          origin[0] = x;
          origin[1] = y;
        } else if (i === opts.stops.length - 1) {
          destination[0] = x;
          destination[1] = y;
        } else {
          wayPoints.push([x, y].join(','));
        }
      }
      const inputOpts = {
        origin: origin.join(','),
        destination: destination.join(','),
        waypoints: '',
        strategy,
      };
      if (wayPoints.length > 0) {
        inputOpts.waypoints = wayPoints.join('|');
      }
      const routeInput = new g2.ews.DrivingInput(inputOpts);
      if (!opts.hidePath) {
        this._fireInputEvents(opts.stops);
      }
      self.WRPSService.driving(routeInput).then((result: any) => {
        if (result.status === -1) {
          resolve({ error: result.msg });
        } else {
          if (result.routes.length === 0) {
            resolve({ error: '暂无适合导航路线！' });
          } else {
            const data = self.parseRouteResult(result);
            if (!opts.hidePath) {
              self.onRouteResult(data, opts.stops[opts.stops.length - 1]);
            }
            resolve(data);
          }
        }
      }, (err: any) => {
        reject(new Error(err.response.message));
      });
    });
  },

  /**
   * 查询骑行路径
   * @param opts
   * @returns {Promise<any>}
   */
  queryPath_riding(opts: any) {
    return new Promise((resolve, reject) => {
      this.clearRouteResults();
      const self = this;
      const origin = [0, 0];
      const destination = [0, 0];
      for (let i = 0; i < opts.stops.length; i++) {
        const x = parseFloat(opts.stops[i].lon);
        const y = parseFloat(opts.stops[i].lat);
        if (i === 0) {
          origin[0] = x;
          origin[1] = y;
        } else if (i === opts.stops.length - 1) {
          destination[0] = x;
          destination[1] = y;
        }
      }
      const inputOpts = {
        origin: origin.join(','),
        destination: destination.join(','),
        riding_type: opts.style,
      };
      const routeInput = new g2.ews.RidingInput(inputOpts);
      // const deffered = jQuery.Deferred();
      try {
        this._fireInputEvents(opts.stops);
        self.WRPSService.riding(routeInput).then((result: any) => {
          if (result.status === -1) {
            if (
              result.msg ===
              'the straight_line_distance of start and end point exceed limit'
            ) {
              resolve({ error: '起终点距离超过限制，请更改起终点或改换其他出行方式再查询。' });
            } else {
              resolve({ error: result.msg });
            }
          } else {
            const data = self.parseRouteResult(result);
            self.onRouteResult(data);
            resolve(data);
          }
        }, (err: any) => {
          reject(new Error(err.response.message));
        });
      } catch (e) {
        console.log(e);
      }
      // return deffered.promise();
    });
  },

  /**
   * 查询骑行路径
   * @param opts
   * @returns {Promise<any>}
   */
  queryPath_walking(opts: any) {
    return new Promise((resolve, reject) => {
      this.clearRouteResults();
      const self = this;
      const origin = [0, 0];
      const destination = [0, 0];
      for (let i = 0; i < opts.stops.length; i++) {
        const x = parseFloat(opts.stops[i].lon);
        const y = parseFloat(opts.stops[i].lat);
        if (i === 0) {
          origin[0] = x;
          origin[1] = y;
        } else if (i === opts.stops.length - 1) {
          destination[0] = x;
          destination[1] = y;
        }
      }
      const inputOpts = {
        origin: origin.join(','),
        destination: destination.join(','),
      };
      const routeInput = new g2.ews.WalkingInput(inputOpts);
      // const deffered = jQuery.Deferred();
      this._fireInputEvents(opts.stops);
      self.WRPSService.walking(routeInput).then((result: any) => {
        if (result.status === -1) {
          if (result.msg === 'the distance of path must less then 200Km') {
            resolve({ error: '步行距离需要少于200公里，请更改起终点或改换其他出行方式再查询。' });
          } else {
            resolve({ error: result.msg });
          }
        } else {
          const data = self.parseRouteResult(result);
          self.onRouteResult(data);
          resolve(data);
        }
      }, (err: any) => {
        console.error(err);
        reject(new Error(err.response.message));
      });
      // return deffered.promise();
    });
  },

  /**
   * 查询公交路径
   * @param opts
   * @param opts.strategy_incity 市内公交换乘策略：0 推荐,1 少换乘.2 少步行.3 不坐地铁,4 时间短,5 地铁优先
   * @param opts.strategy_intercity 跨域公交换乘策略：0 时间短，1 出发早，2 价格低
   * @param opts.Trans_type_intercity 跨城交通方式策略：0 火车优先，1 飞机优先，2 大巴优先
   * @returns {Promise<any>}
   */
  queryPath_bus(opts: any) {
    return new Promise((resolve, reject) => {
      const self = this;
      this.clearRouteResults();
      const origin = [0, 0];
      const destination = [0, 0];
      // strategy = isNaN(opts.style)?2 :opts.style;
      for (const i of Object.keys(opts.stops)) {
        const x = parseFloat(opts.stops[i].lon);
        const y = parseFloat(opts.stops[i].lat);
        if (i === '0') {
          origin[0] = x;
          origin[1] = y;
        } else if (i === JSON.stringify(opts.stops.length - 1)) {
          destination[0] = x;
          destination[1] = y;
        }
      }
      const inputOpts = {
        origin: origin.join(','),
        destination: destination.join(','),
        strategy_incity: opts.strategy_incity || 2,
        strategy_intercity: opts.strategy_intercity || 0,
        Trans_type_intercity: opts.Trans_type_intercity || 0,
        page_size: 10,
        page_index: 1,
      };
      const Trans_type_intercity = inputOpts.Trans_type_intercity;
      let vehiclInfo: any = null;
      let errorMessage: string = '';
      let resultVerify = false;
      if (Trans_type_intercity === 0) {
        vehiclInfo = 1;
        errorMessage = '暂无适合铁路方案！';
      } else if (Trans_type_intercity === 1) {
        vehiclInfo = 2;
        errorMessage = '暂无适合飞机方案！';
      }
      const routeInput = new g2.ews.TransitInput(inputOpts);
      // const deffered = jQuery.Deferred();
      this._fireInputEvents(opts.stops);
      this.WRPSService.transit(routeInput).then((result: any) => {
        if (result.status === -1) {
          resolve({ error: result.msg });
        } else {
          if (result.routes && result.routes.length > 0) {
            // 判断当前行程中有没有对应所需要的火车方案或者飞机方案，如果没有则返回相应的错误信息
            for (const route of result.routes) {
              for (const step of route.steps) {
                const vehiclType = step.schemes[0].vehicle_info.type;
                if (vehiclType === vehiclInfo) {
                  resultVerify = true;
                  break;
                }
              }
            }
            if (resultVerify) {
              resolve(result);
              self.showRoute_bus(result, 0);
            } else {
              resolve({ error: errorMessage });
            }
            // var data = this.parseRouteResult_bus(result);
            // this.onRouteResult_bus(data);
          } else {
            resolve({ error: '暂无适合公交方案！' });
          }
        }
      }, (err: any) => {
        console.error(err);
        reject(new Error(errorMessage));
      });
      // return deffered.promise();
    });
  },

  // 解析公交结果显示在地图上
  showRoute_bus(result: any, num: any) {
    const route = result.routes[num];
    const steps = route.steps;
    this.showBusRoute(steps);
  },

  // 显示指定公交路线
  showBusRoute(steps: any) {
    this.routeLayers.clear();
    this.toolTipWare.clear();
    this.highlightLayer.clear();
    const geoList: any = [];
    for (const i of steps) {
      if (i.schemes[0].instruction) {
        for (const n of i.schemes) {
          const schema = n;
          const path = schema.path;
          geoList.push(path);
          this.showBusRouteStop(schema);
        }
      } else {
        this.showBusSeparateRoutes(i.schemes);
        for (const m of i.schemes) {
          const schema = m;
          const path = schema.path;
          geoList.push(path);
        }
      }
    }
    this.panToGeoCollection(geoList);
  },

  timeRound(time: any) {
    const minutes = time / 60;
    let timeLabel = '';
    if (minutes < 60) {
      timeLabel = Math.round(minutes).toString() + '分钟';
    } else if (minutes >= 60) {
      const hour = minutes / 60;
      timeLabel = Math.round(hour).toString() + '小时';
    }
    return timeLabel;
  },

  // 显示公交线路和站点及弹窗
  showBusRouteStop(schema: any) {
    const vehicle_info = schema.vehicle_info;
    const colorRamp = this.options.symbols.pathAnalysis.busPathColor;
    if (vehicle_info.type !== 5) {
      // console.log(schema.instruction + "，非步行 开始绘制");
      const time = schema.duration;
      const timeRround = this.timeRound(time);
      const contentTemplate =
        '<div class="compMap-znGeocoding-map-panel" style="padding: 3px;"><label>' +
        '乘坐' +
        vehicle_info.detail.name +
        '</br>' +
        '车程约' +
        timeRround +
        '</br>' +
        '</label></div>';
      let symbol;
      switch (vehicle_info.type) {
        case 1: // 火车
          symbol = new g2.sfs.PictureMarkerSymbol(
            this.options.symbols.pathAnalysis.trainStop,
          );
          break;
        case 2: // 飞机
          symbol = new g2.sfs.PictureMarkerSymbol(
            this.options.symbols.pathAnalysis.planeStop,
          );
          break;
        case 3: // 公交
        case 6: // 大巴
          symbol = new g2.sfs.PictureMarkerSymbol(
            this.options.symbols.pathAnalysis.busStop,
          );
          break;
        default:
          symbol = new g2.sfs.SimpleMarkerSymbol({
            size: 9,
            offsetX: 0,
            offsetY: 0,
            fillColor: new g2.sfs.Color({ a: 255, r: 43, g: 230, b: 34 }),
          });
          break;
      }
      const ele = new g2.sfs.Element({
        geometry: schema.start_location,
        symbol,
      });
      const textSym = new (g2 as any).sfs.TextSymbol({
        text: '乘坐' + vehicle_info.detail.name + '\r\n车程约' + timeRround,
        fontFamilyName: 'Microsoft Yahei',
        fontSize: 18,
        textAlign: 'center',
        textBaseline: 'middle',
        textBackgroundBorderThickness: 2,
        textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 0, g: 0, b: 200 }),
        textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 1, r: 55, g: 224, b: 245 }),
        foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
        padding: [2, 10, 2, 10],
        offsetX: 0,
        offsetY: 45,
      });
      const symbolFill = new (g2 as any).sfs.SimpleFillSymbol({
        borderColor: new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 }),
        fillColor: new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 }),
        opacity: 0.9,
        borderThickness: 0,
        style: 5,
      });
      // 复合符号
      const currencySymbol = new g2.sfs.CurrencySymbol({
        fillSymbol: symbolFill,
        textSymbol: textSym,
      });

      const eleText = new g2.sfs.Element({
        geometry: schema.start_location,
        symbol: currencySymbol,
      });

      this.routeLayers.add(eleText);
      this.routeLayers.add(ele);
      const tooltip = new g2.widget.Tooltip({
        anchor: schema.start_location, // 提示在地图上停靠位置
        content: contentTemplate, // 提示内容
        layerId: this.routeLayers.getLayerId(), // 提示所在图层ID
        offset: [20, 0], // 位置偏移量/
        autoPan: true,
        className: 'egis-tooltip', // tooltip样式
      });
      // this.toolTipWare.add(tooltip);
    }
    const path = schema.path;
    const num = Math.round((colorRamp.length - 1) * Math.random()) || 0;
    const color = g2.sfs.Color.fromHex(colorRamp[num]);
    const pathSymbol = new g2.sfs.SimpleLineSymbol({
      width: 9,
      color,
      style: 5,
    });
    const roadPathEle = new g2.sfs.Element({
      geometry: path,
      symbol: pathSymbol,
    });
    this.routeLayers.add(roadPathEle);
  },

  // 绘制散段路线
  showBusSeparateRoutes(schemes: any) {
    // console.log("散段非步行开始绘制");
    const colorRamp = this.options.symbols.pathAnalysis.busPathColor;
    const num = Math.round((colorRamp.length - 1) * Math.random()) || 0;
    const color = g2.sfs.Color.fromHex(colorRamp[num]);
    // console.log(color);
    const pathSymbol = new g2.sfs.SimpleLineSymbol({
      width: 9,
      color,
      style: 5,
    });
    for (const schema of schemes) {
      const path = schema.path;
      const roadPathEle = new g2.sfs.Element({
        geometry: path,
        symbol: pathSymbol,
      });
      this.routeLayers.add(roadPathEle);
    }
  },

  // 地图定位到指定geometry组
  panToGeoCollection(geoList: any) {
    const geoArr = this.GeometryUtil.getGeometryEnvlop(geoList);
    const oldextent = geoArr.envelope();
    const newextent = new g2.sfs.Envelope({});

    newextent.minx = oldextent.minx - (oldextent.maxx - oldextent.minx) * 0.2;
    newextent.maxx = oldextent.maxx + (oldextent.maxx - oldextent.minx) * 0.2;
    newextent.miny = oldextent.miny - (oldextent.maxy - oldextent.miny) * 0.2;
    newextent.maxy = oldextent.maxy + (oldextent.maxy - oldextent.miny) * 0.2;
    this.map.pan(newextent, [0, 50, 0, 50]);
  },

  getDurationTime(duration: any) {
    const hours = duration / 60 / 60;
    const hours1 = Math.floor(hours);
    const minutes = Math.round((hours - hours1) * 60);
    return { hours: hours1, minutes };
  },

  getDestinationTime(duration: any) {
    const cdate: any = new Date();
    const tdate: any = new Date(cdate.getTime());
    const ctime = cdate.getTime();
    const cday = cdate.getDate();
    tdate.setDate(cday + 1);
    tdate.setHours(0);
    tdate.setMinutes(0);
    tdate.setSeconds(0);
    const leftTime = (tdate - cdate) / 1000; // 今天 24点距离现在的秒数
    // var leftTime = (new Date(cdate.getFullYear(), cdate.getMonth()+1, cdate.getDate()+1, 0, 0, 0)) - (cdate);
    let enddatetext: any;
    if (leftTime > duration) {
      enddatetext = '今天';
    } else {
      const leftSeconds = duration - leftTime; // 从第二天开始的剩余秒
      const leftDays = leftSeconds / (60 * 60 * 24);
      if (leftDays < 1) {
        enddatetext = '明天';
      } else if (leftDays < 2) {
        enddatetext = '后天';
      } else {
        enddatetext = '第' + Math.ceil(leftDays) + '天';
      }
    }
    const edate = new Date(ctime + duration * 1000);
    let ehour = edate.getHours().toString();
    let eminute = edate.getMinutes().toString();
    // var esecond = edate.getSeconds().toString();
    if (ehour.length < 2) {
      ehour = '0' + ehour;
    }
    if (eminute.length < 2) {
      eminute = '0' + eminute;
    }
    // if (esecond.length<2){
    //     esecond = "0"+esecond;
    // }
    return '预计' + enddatetext + ehour + ':' + eminute + '到达';
  },

  parseRouteResult(result: any) {
    const data: any = {};
    const route = result.routes[0];
    data.length = route.distance;
    data.duration = route.duration;
    data.durationHourMinutes = this.getDurationTime(data.duration);
    data.enddate = this.getDestinationTime(data.duration);

    data.route = null;
    data.road = [];
    const lineString = new g2.sfs.LineString({
      spatialReference: this.map.spatialReference,
    });
    for (const i of route.steps) {
      const stepItem = i;
      const roadItem: any = {};
      const strguide = stepItem.instruction + '';
      // strguide=strguide.replace(/\<b\>/g,'');
      // strguide=strguide.replace(/\<\/b\>/g,'');
      roadItem.strguide = strguide;
      roadItem.length = stepItem.distance;
      roadItem.direction = stepItem.direction * 30;
      const direction = stepItem.direction;
      let direct = '';
      if (direction === 0) {
        direct = '正北';
      } else if (direction === 1 || direction === 2) {
        direct = '东北';
      } else if (direction === 3) {
        direct = '正东';
      } else if (direction === 4 || direction === 5) {
        direct = '东南';
      } else if (direction === 6) {
        direct = '正南';
      } else if (direction === 7 || direction === 8) {
        direct = '西南';
      } else if (direction === 9) {
        direct = '正西';
      } else if (direction === 10 || direction === 11) {
        direct = '西北';
      }
      var directStr = '';
      if (i > 0) {
        if (direction * 30 - data.road[i - 1].direction > 10) {
          directStr = '右转';
        } else if (direction * 30 - data.road[i - 1].direction < -10) {
          directStr = '左转';
        } else {
          directStr = '直行';
        }
      } else {
        directStr = '直行';
      }

      if (stepItem.traffic_condition) {
        roadItem.status = stepItem.traffic_condition[0].status;
      }
      roadItem.direct = directStr;
      roadItem.road = stepItem.path;
      roadItem.poly = stepItem.path;
      data.road.push(roadItem);
      for (const j of stepItem.path.points) {
        lineString.addPoint(j);
      }
    }
    data.route = lineString;
    return data;
  },

  onRouteResult(data: any, destination: any) {
    this.roadInfo = data.road;
    // this.routeLayers.clear();
    // this.toolTipWare.clear();
    // this.showRealtimeTrafficLayer(true);
    let color = '';
    for (const i of data.road) {
      const item = i;
      if (item.status || item.status === 0) {
        const colorThis = this.options.symbols.router.state[item.status];
        color = g2.sfs.Color.fromHex(colorThis);
        // color_.a = 170;
      } else {
        // color = new g2.sfs.Color({ a: 255, r: 82, g: 152, b: 255 });
        color = new g2.sfs.Color.fromHex('#990166');
      }

      const pathSymbol = new g2.sfs.SimpleLineSymbol({
        width: 9,
        color,
        style: 5,
      });
      const roadPathEle = new g2.sfs.Element({
        id: this.options.currentId,
        geometry: item.road,
        symbol: pathSymbol,
      });
      this.routeLayers.add(roadPathEle);
    }
    const oldextent = data.route.envelope();
    const newextent = new g2.sfs.Envelope({});

    newextent.minx = oldextent.minx - (oldextent.maxx - oldextent.minx) * 0.2;
    newextent.maxx = oldextent.maxx + (oldextent.maxx - oldextent.minx) * 0.2;
    newextent.miny = oldextent.miny - (oldextent.maxy - oldextent.miny) * 0.2;
    newextent.maxy = oldextent.maxy + (oldextent.maxy - oldextent.miny) * 0.2;

    const point = {
      PopupX: (newextent.maxx + newextent.minx) * 0.5,
      PopupY: newextent.maxy,
    };
    if (!this.dontpan) { // 力量调度不缩放视野
      this.map.pan(newextent, [300, 0, 0, 0]);
      this.map.zoomTo(this.map.getZoomLevel() - 1);
    }
    if (this.showBriefPopup) {
      this.showResultBriefPopup(data, point, '摩托化推进');
    }
  },

  // 在终点显示弹窗
  showResultBriefPopup(data: any, coords: any, title: any) {
    const point = new g2.sfs.Point({
      x: coords.PopupX,
      y: coords.PopupY,
      spatialReference: this.map.spatialReference,
    });
    const tooltip = new g2.widget.Tooltip({
      anchor: point, // 提示在地图上停靠位置
      content: '<div id="routerPlan_toolTip"></div>', // 提示内容
      layerId: this.routeLayers.getLayerId(), // 提示所在图层ID
      offset: [0, 0], // 位置偏移量
      autoPan: false,
      className: 'egis-tooltip', // tooltip样式
    });
    this.toolTipWare.add(tooltip);
    this.fire('querypathPopupOpen', {
      data,
      content: {
        containerId: 'routerPlan_toolTip',
      },
    });
  },
  // 高亮指定线路
  highlightBusRouteScheme(path: any) {
    this.highlightLayer.clear();
    const pathSymbol = new g2.sfs.SimpleLineSymbol({
      width: 11,
      color: new g2.sfs.Color({ a: 255, r: 225, g: 40, b: 40 }),
      style: 5,
    });
    const roadPathEle = new g2.sfs.Element({
      geometry: path,
      symbol: pathSymbol,
    });
    this.highlightLayer.add(roadPathEle);
    this.map.pan(path);
  },

  // 查询poi
  queryPoi(opts: any) {
    return new Promise((resolve, reject) => {
      const self = this;
      const extent = this.map.getExtent();
      const area = this.calAreaByExtent(extent);
      let zoom = this.map.getZoomLevel();
      zoom = parseInt(zoom, 0);
      if (zoom > 10) {
        zoom = 10;
      }
      // const deffered = jQuery.Deferred();
      if (area <= 50) {
        const keywordInput = new g2.ews.SearchKeywordInput({
          keyword: opts.keyword,
          bounds: [extent.minx, extent.miny, extent.maxx, extent.maxy].join(','),
          page_num: opts.page - 1,
          page_size: opts.page_size || 10,
          scope: 1,
          level: zoom,
          query_type: 2,
        });
        self.wpssService.searchKeyWord(keywordInput).then((data: any) => {
          const resultData: any = {};
          const list: any = [];
          // console.log('data', data);
          if (data.type === 3 || data.type === '3') {
            resultData.count = data.total;
            resultData.pois = list;
            const fieldMap: any = {
              address: 'address',
              name: 'name',
              phone: 'phone',
              telphone: 'telphone',
              title: 'name',
              hotPointID: 'uid',
            };
            for (const i of data.pois) {
              const item = i;
              const temp: any = {};
              for (const k of Object.keys(fieldMap)) {
                temp[k] = item[fieldMap[k]];
              }
              temp.location = {
                lon: item.location.x,
                lat: item.location.y,
              };
              temp.lonlat = [temp.location.lon, temp.location.lat].join(' ');
              temp.longitude = temp.location.lon;
              temp.latitude = temp.location.lat;
              list.push(temp);
            }
            // console.log('查询成功');
          } else {
            resultData.count = 0;
            resultData.pois = [];
          }
          resolve(resultData);
        }, (err: any) => {
          console.error(err);
          reject(new Error('地名搜索服务调用失败: ' + err.message));
        });
      } else {
        this.options.locationService.interetIP().then((ip: any) => {
          const thisnew = this;
          if (ip) {
            thisnew.WILSService.locationByIP(ip).then((res: any) => {
              if (res.status !== -1) {
                const x = res.content.location.x;
                const y = res.content.location.y;
                console.log('thisnew.locateToPoint', thisnew.locateToPoint);
                thisnew.locateToPoint(x, y, 12);
                const extent1 = this.map.getExtent();
                const keywordInput = new g2.ews.SearchKeywordInput({
                  keyword: opts.keyword,
                  bounds: [
                    extent1.minx,
                    extent1.miny,
                    extent1.maxx,
                    extent1.maxy,
                  ].join(','),
                  page_num: opts.page - 1,
                  page_size: opts.page_size || 10,
                  scope: 1,
                });
                thisnew.wpssService.searchKeyWord(keywordInput).then((data: any) => {
                  const resultData: any = {};
                  const list: any = [];
                  resultData.count = data.total;
                  resultData.pois = list;
                  const fieldMap: any = {
                    address: 'address',
                    name: 'name',
                    phone: 'phone',
                    telphone: 'telphone',
                    title: 'name',
                    hotPointID: 'uid',
                  };
                  for (const i of data.pois) {
                    const item: any = i;
                    const temp: any = {};
                    for (const k of Object.keys(fieldMap)) {
                      temp[k] = item[fieldMap[k]];
                    }
                    temp.location = {
                      lon: item.location.x,
                      lat: item.location.y,
                    };
                    temp.lonlat = [temp.location.lon, temp.location.lat].join(
                      ' ',
                    );
                    temp.longitude = temp.location.lon;
                    temp.latitude = temp.location.lat;
                    list.push(temp);
                  }
                  console.debug(resultData);
                  resolve(resultData);
                }, (err: any) => {
                  console.error(err);
                  reject(new Error('地名搜索服务调用失败: ' + err.message));
                });
              }
            }, (err: any) => {
              console.error(err);
              reject(new Error('地名搜索服务调用失败: ' + err.message));
            });
          }
        });
      }
      // return deffered.promise();
    });
  },

  locateToPoint(x: any, y: any, zoom: any) {
    console.log(arguments);
    this.map.zoomTo(zoom);
    this.map.setCenter(new g2.sfs.Point({
      x,
      y,
      spatialReference: this.map.spatialReference,
    }));
  },

  calAreaByExtent(extent: any) {
    const ring = new g2.sfs.Ring({
      spatialReference: this.map.spatialReference,
    });
    ring.addPoint(
      new g2.sfs.Point({
        x: extent.minx,
        y: extent.miny,
        spatialReference: this.map.spatialReference,
      }),
    );
    ring.addPoint(
      new g2.sfs.Point({
        x: extent.minx,
        y: extent.maxy,
        spatialReference: this.map.spatialReference,
      }),
    );
    ring.addPoint(
      new g2.sfs.Point({
        x: extent.maxx,
        y: extent.maxy,
        spatialReference: this.map.spatialReference,
      }),
    );
    ring.addPoint(
      new g2.sfs.Point({
        x: extent.maxx,
        y: extent.miny,
        spatialReference: this.map.spatialReference,
      }),
    );
    ring.addPoint(
      new g2.sfs.Point({
        x: extent.minx,
        y: extent.miny,
        spatialReference: this.map.spatialReference,
      }),
    );
    const polygon = new g2.sfs.Polygon({
      spatialReference: this.map.spatialReference,
    });
    polygon.addGeometry(ring);
    const area = polygon.area();
    return area;
  },

  queryPoint(item: any, type: any) {
    const self = this;
    this.request2({
      x: parseFloat(item.lon),
      y: parseFloat(item.lat),
    }).then((res: any) => {
      const activeButton: any = {};
      activeButton.location = {
        lon: res.x,
        lat: res.y,
      };
      activeButton.address = res.address;
      activeButton.position = type;
      let markerSymbolstartIcon;
      let idStart;
      if (type === 0) {
        markerSymbolstartIcon = self._getPointSymbol('preIcon startIcon');
        idStart = self._getPointId(0, 'preIcon startIcon');
        self.fire('dealPathMainDatasStart', activeButton);
      } else {
        markerSymbolstartIcon = self._getPointSymbol('preIcon endIcon');
        idStart = self._getPointId(1, 'preIcon endIcon');
        self.fire('dealPathMainDatasEnd', activeButton);
      }
      if (self.networkLayer.contains(idStart)) {
        self.networkLayer.remove(self.networkLayer.find(idStart));
      }
      const pointEleStart = new g2.sfs.Element({
        id: idStart,
        geometry: new g2.sfs.Point({
          x: res.x,
          y: res.y,
          spatialReference: self.map.spatialReference,
        }),
        symbol: markerSymbolstartIcon,
      });
      self.networkLayer.add(pointEleStart);
    })
      .catch((errInfo: any) => {
        this.fire('error', errInfo);
      });
  },

  _fireInputEvents(stops: any) {
    const self = this;
    this.request2({
      x: parseFloat(stops[0].lon),
      y: parseFloat(stops[0].lat),
    })
      .then((res: any) => {
        const activeButton: any = {};
        activeButton.location = {
          lon: res.x,
          lat: res.y,
        };
        activeButton.address = res.address;
        activeButton.position = 0;
        self.fire('dealPathMainDatasStart', activeButton);
      })
      .catch((errInfo: any) => {
        this.fire('error', errInfo);
      });
    const markerSymbolstartIcon = self._getPointSymbol('preIcon startIcon');
    const idStart = self._getPointId(0, 'preIcon startIcon');
    if (this.networkLayer.contains(idStart)) {
      this.networkLayer.remove(this.networkLayer.find(idStart));
    }
    const pointEleStart = new g2.sfs.Element({
      id: idStart,
      geometry: new g2.sfs.Point({
        x: stops[0].lon,
        y: stops[0].lat,
        spatialReference: 4326,
      }),
      symbol: markerSymbolstartIcon,
    });
    self._addDeletePoint(stops[0]);
    if (!self.isShowHistory) { // 如果没有历史轨迹，才正常标注起点。
      self.networkLayer.add(pointEleStart);
    } else { // 如果有历史轨迹，则标注起点为进行中，终点为新图标
      const newstartsymbol = new g2.sfs.PictureMarkerSymbol({
        source: 'data:image/png;base64,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',
        width: '53',
        height: '66',
        rotation: '0',
        opacity: '1',
        offsetX: '27',
        offsetY: '66',
      });
      pointEleStart.symbol = newstartsymbol;
      self.networkLayer.add(pointEleStart);
    }
    if (!stops[stops.length - 1].lon && !stops[stops.length - 1].lat) {
      return;
    }
    this.request2({
      x: parseFloat(stops[stops.length - 1].lon),
      y: parseFloat(stops[stops.length - 1].lat),
    }).then((res: any) => {
      const activeButton: any = {};
      activeButton.location = {
        lon: res.x,
        lat: res.y,
      };
      activeButton.address = res.address;
      activeButton.position = stops.length - 1;
      self.fire('dealPathMainDatasEnd', activeButton);
    }).catch((errInfo: any) => {
      this.fire('error', errInfo);
    });
    const markerSymbolendIcon = self._getPointSymbol('preIcon endIcon');
    const idEnd = self._getPointId(1, 'preIcon endIcon');
    if (this.networkLayer.contains(idEnd)) {
      this.networkLayer.remove(this.networkLayer.find(idEnd));
    }
    const pointEleEnd = new g2.sfs.Element({
      id: idEnd,
      geometry: new g2.sfs.Point({
        x: stops[stops.length - 1].lon,
        y: stops[stops.length - 1].lat,
        spatialReference: 4326,
      }),
      symbol: markerSymbolendIcon,
    });
    if (!self.isShowHistory) { // 如果没有历史轨迹，才正常标注起点。
      self.networkLayer.add(pointEleEnd);
    } else { // 如果有历史轨迹，则标注起点为进行中，终点为新图标
      const newendsymbol = new g2.sfs.PictureMarkerSymbol({
        source: 'data:image/png;base64,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',
        width: '53',
        height: '66',
        rotation: '0',
        opacity: '1',
        offsetX: '27',
        offsetY: '66',
      });
      pointEleEnd.symbol = newendsymbol;
      self.networkLayer.add(pointEleEnd);
    }
  },

  /**
   * 开启地图选点
   */
  startSelectPoint(data: any) {
    // 地图上标注起点
    if (this.options.commandNotify) {
      this.options.commandNotify.activeCommand('pointPlot22');
      this.options.commandNotify.manager.commands.pointPlot22.data_activeButton = data;
    }
  },
  /**
   *
   * @param t 增加终点
   */
  addEndPoint(data: any) {
    const t = data.t;
    // 地图上标注终点
    if (this.options.commandNotify) {
      this.options.commandNotify.activeCommand('pointPlot22');
      this.options.commandNotify.manager.commands.pointPlot22.data_activeButton = t;
    }
  },

  removeMidPoints(id: any, position: any) {
    console.log('positon:' + position);
    if (this.networkLayer.contains('middle' + position + id)) {
      console.log('positonRemoved:' + position);
      this.networkLayer.remove(this.networkLayer.find('middle' + position + id));
    }
  },

  //  添加起点/途经点/终点
  addPoint(data: any) {
    if (this.options.commandNotify) {
      this.options.commandNotify.activeCommand('NoopTool');
    }
    const x = data.location.lon;
    const y = data.location.lat;
    this.currentPosition = data.position;
    const markerSymbol = this._getPointSymbol(data.iconClass);
    const point = new g2.sfs.Point({
      x,
      y,
      spatialReference: this.map.spatialReference,
    });
    const id = this._getPointId(data.position, data.iconClass);
    const pointEle = new g2.sfs.Element({ id, geometry: point, symbol: markerSymbol });
    if (this.networkLayer.contains(id)) {
      this.networkLayer.remove(this.networkLayer.find(id));
    }
    this.networkLayer.add(pointEle);
    this.map.zoomTo(12);
    this.map.setCenter(point);
  },

  /**
   *逆向地理编码
   * @param params
   * @param params.x
   * @param params.y
   */
  request2(params: any) {
    return new Promise((
      resolve, reject) => {
      const self = this;
      const WRGSInput = new g2.ews.WRGSInput({
        location: [params.x, params.y].join(','),
      });
      self.WRGSService.regeocode(WRGSInput).then((result: any) => {
        const data: any = {};
        data.x = result.location.x;
        data.y = result.location.y;
        data.address = result.formatted_address;
        resolve(data);
      }, (err: any) => {
        console.error(err);
        if (err.message) {
          reject(new Error('逆向地理编码服务调用失败: ' + err.message));
        } else if (err.response.msg) {
          reject(new Error(err.response.msg));
        }
      });
    });
  },
  // 起/终点反转
  reversePoints(dataList: any) {
    this.networkLayer.clear();
    for (var i = 0; i < dataList.length; i++) {
      const data: any = dataList[i];
      if (data.location) {
        const x: any = data.location.lon;
        const y: any = data.location.lat;
        this.currentPosition = i;

        const markerSymbol = this._getPointSymbol(data.iconClass);
        const point = new g2.sfs.Point({
          x,
          y,
          spatialReference: this.map.spatialReference,
        });
        const id = this._getPointId(data.position, data.iconClass);

        const pointEle = new g2.sfs.Element({ id, geometry: point, symbol: markerSymbol });

        //
        // if (this.networkLayer.contains(id)) {
        //     this.networkLayer.remove(this.networkLayer.find(id));
        // }
        this.networkLayer.add(pointEle);
      }
    }
  },
  // 根据类型和位置获取点id
  _getPointId(position: any, iconClass: any) {
    var id = position;
    switch (iconClass) {
      case 'preIcon startIcon':
        id = 'start';
        break;
      case 'preIcon endIcon':
        id = 'end';
        break;
      case 'preIcon stopIcon':
        id = 'middle' + id;
    }
    return id + this.options.currentId;
  },
  // 定位到指定线路
  showBusRouteSchemes(schemes: any) {
    this.highlightLayer.clear();
    const geoList = [];
    for (const schema of schemes) {
      const path = schema.path;
      geoList.push(path);
    }
    this.panToGeoCollection(geoList);
  },
  // 根据类型获取点symbol
  _getPointSymbol(iconClass: any) {
    let symbol;
    let source = '';
    switch (iconClass) {
      case 'preIcon startIcon':
        source =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABICAYAAABiI3xzAAAIRElEQVRogcWaf3CURxnHP5tcDnLJkYT8LoZAYyRzMAUZqXUimTZOZrToiI10rDpAbYdKfzmVopQOmg6jttqx6qDYSG2rk1aFOLVOtC0KSFor1tSIGCtQiSQlCSEkIeQCyd2tf+z9fO/ufffu3qTfv+7dfXb38+7tPvvusytWtGWRgSqBjwBrgGVADVAM5AfzLwMXgf8C/wGOAX8C+jJpVKQBnQdsBD4L1AMijXa7gf3AT4HBVAunAp0PbAfuBRam2lASTQO/AHYDp3UL6RI3AyeBr2EfMIAT9a/9C3gc9S9aygo6F9gHHECN39mSE9iGGjYftDI2gy4GDgF32MOlpfcCR4EvmBklgy5FzfIbbIbSkRN4Cng4mUF2WXPc5HcBLwPvnz0uLTUCXuDPxoxEPf19NMbVHOkx4FPGRCP0BuDOOcHRkwCeRY31sKKh3cATurV53A3sbzrO/qbj1Bc324OYWG7gGaIWMUdU5oPAIt2alubXUVe6HIBCZ3FcvsfdwNL8Oq26/jZymKHpU2Ym9cBngOchAu0G7tMF1tEjN+wJv5SVdhzeSseAKTTAI6il3xeC/jxQZFai3FnLB4pvCj/XFV1n+L0l/Hzm8ltasCmqFlgPHIiGNtVWzy6aPZ9LmLd51daY5/aeNjYcvC6hbUjrKrfw6E17dWCjdQdwIAuoAD6Uaul3SU3AQgdwIxqfly3dG2np3hh+ju4pNSZbZwczVtlAYxbvzlKdiRocqB2H7Sp31rLVsytpflle2h+NKx0YVptEuq36K9zyvti5mueMfPres/qrbJ6+Nyb/mRN7kk7cDLXEAZRZWS0rWmHqc6sKlpiW7xvvZXJ6MiYtz5lnWS6JyhzAAiurN4ZeTZi+vHRV+GXae9qSlv/hm4/FTVSPu4Fba9RnTop+fb4DtU9zmll1DLTSMdBKfXEzi/NruDQ9RsdAKy2rfhaGjvYsoLyLmXomjtLSfTQV2JCuOlDfrKbQITVVfTI8Tjues8fFbfPsoaZoGZ39B3n+f9/WKTKeBZyzpfU05XYuYG11Izvrv6VbpNeBCqR4UmnIO+ONS9vfdDxS69hpjvS/lEqVCetMom4H0AV8XMc65FvPjp2Jy4vzLv16BEsLa5PWmURHHUCnrnWpqzxpXrT3GJjsj/EI667dkLDMAmchdaUrABj2DulidIagx4ECK+vFhUsB1ased0NMntF7AIx4hyl2lbK2upG11Y2mdf/j/Bs6wF3A2SyUy/u1lbXH3YArxxV+frzhacsWHu68h77xXlMb74yX9p42njy107I+4GmI7FyeBG43s15b8dGY56qCJRS7zBfT10baubmjXQdGR1eA5yCysT0GJF72glpZtgaI9AwQ0/NzoGeBUYjd2H4d+GMi63JnbXhMdp37Cy3dGynLq4wZp8c2TPDW8AnOjFnu9ZLqV2/vo2ci4Sp5FfhG6CEa+hBq4xg31RsrI/GSzv6DANz9WhPbRvdw6/JNuHJcuHJcrL7melZfc33a0Ht7difLaiUqEG+MTy8C/o3ancfoyHoV+77xhYqY9HJnLeurb2dl2RpKXeXaO3Cj3jz3VzYdSbjrGwPqgLBPdBgM3gF2Ad+Lg+59hYHJ+BVjaPqUmvnpjworPUQUMCQ+CRBAB/CxWcPQ1+vAh4FAdGKiAKREReffmQMoM00Dd2EAhuTx6QuoMNT0LEJZ6SHgn4kyzE4CXgW+NCs41noZk2Co1ZnLj1Hx6rnUELAZNUwTSud0axvwok1AVvKjzidNzxZ1oP3Abailfra1HbXImUr3HNELfIIUDijTUBuaQf1UzpiHgXWob2+71UV0rNhCqR6MnwRuwV5X2I+KO2tvEtO5gnAIdTiZdHanoHHgZrR3lErp3ptoQx0nZKLQBE+4gJgpk8seu4HU4gSxug/4fToFM4EOAJuAkTTK7gNSPrsIKaNrNcB54MspljlFhp8HmUID/BzlsnT1RVLwFIlkB7REbRx09CIaK56V7IAGNSG7LWwk0GJHY3ZBS+BHFjavAH+3ozG7oAF+iflYte3Mzk7oSyT3uyPAb+1qyE5ogN8kSX8BmLGrEbuhD5L4m+R3djZiN/QgYDyq8gOH7WzEbmiIvyjVRTBwaJdmA9oYHTeNxqYjY1gsJU3srHIIdZyXg7ohkJ175/ne7Guvhm0CFxw9k9+tLBXglwI/khlg2v3NPt+cQY/vWJQlpMwHXBBwBACBRAICwdRLC07n3z3sC9U9cyL3uAwE5gUkCAFINVMv7VjkQ+KVQl4uePRcXBTJNujRBysKEL6FUorg/RCpLooEH6UEzmRL6RMnhUN6CDA82ZE3IvA5FaxACPV6UkonQrgEsnh0e/nFou8Mae89taGHHygpAV+JUJgSpFCxyrCHUzQg5ZToEW7pkVdEV8CvgI02RC7GSKDywgMlOSVPXLhgG/Tg/UVZAn8lSKGaE0gZbNXALYGZvuzOeZ7Ap2fOZv/B7/M7kcHhIwRSRv074XRAUjl4f9HFih+MWg4VLejAjA8pZI6QZClIAcLYWRH6i3vnvV50l9wx+tT8zoDP5xTG/pWo8qE/S1UR0L3zrn1TvW9L7nuAxUZEEewyGUyMtCuCWDELZPBtpeE1BULKs1U/mdLalQvVWnK55+dGegVZiaAGKRygxoeUIraDYoZ8uBwgIklEdbDAJyRvAwOhnIkrU5lBu5w5BOmCTUmHQFSBrJCIfDVaJEIGHV8UTdjHRA+HUM8LcRnkIJI+wCdE8D+REu+M+beVJfT87OzYrjG8E+rmZGHwdy6IeSCzQGQjpR9BAMRVkFOAF8SYQI5KhDdZvOeK32/K9H+3V4Wg3imG4wAAAABJRU5ErkJggg==';
        break;
      case 'preIcon endIcon':
        source =
          'data:image/png;base64,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';
        break;
      case 'preIcon stopIcon':
        source =
          'data:image/png;base64,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';
        break;
    }
    symbol = new g2.sfs.PictureMarkerSymbol({
      source,
      width: '25',
      height: '40',
      rotation: '0',
      opacity: '1',
      offsetX: '23',
      offsetY: '72',
    });
    return symbol;
  },
  _addDeletePoint(start: any) {
    const markerSymbol = new g2.sfs.PictureMarkerSymbol({
      source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADp0lEQVRYR7VXTWhcVRT+vhemEkqVirGCFMSF2mSmEZO8+4YSbAUVF3FT6qIV3bipmEUpCNouLFikm+KilhY3WtBFQRC6s6hBKHn3TafYeVMpFawgjbaBUiJS28zcI3eSF95M359J5i7v+8453/nOOfe+SxRczWr1USPyGkXeITBkRB4nOSQi8w55S4B5iJx3AH+gVKo9d+HC30VcMw8Uet42GDMN8k0Am/Lwy9//EvKMI/JlWetfsmwyCYSu+zHJaQEeLhi4F7Yo5InN5KGts7N3k3ykEmgo9ROByVUG7jWbdUQOjwTBD70fEgmESs0DeGydgsfdvFrR+rv4xgMEmkpdF+CpPgS3Lm/SmKlyrVaL/HcRCJU6C2BPn4JHbi/da7W88Xp90W6sELANB/JQn4N33At5cLvvH18hYEeNIn5Ot88A2FmQYCaWwO8CeBWtb3YUCF33JMj9qc7JXRXfn2koNQbgLIGnk7AC/Abgje1a10PP2wmRH1N9ihyuBMFR/jo5OfTv/fvXAWxMAc9UtN4VfbviecoA5yAy1IUn5x1gasT3dbQfKmUJJKpG4NojjvM8m0q9K8BnWdIKMG6zijl+GaQl8VBnj7wHkamK1ucjjFWLwMXMkonsZxbLyNhKO0DujWd3WandDvCBxRjgk1Gtv4mr1Bb5Oq1UsRH8wirQFGAkt7lIe9nsi2eZZBMqZdX56oESJYHJGhuue8vearkElqU2Ivvi2cbtOqosBV8qTf76x5ZA8nFdiHpF6/GU7G3N7aQUWgQW/p8CS267piIeqUg/xfH2PCjeA/0pwaVCU9Bh3Y8mBL5l6LofgjyaVbSMMXxveQxPrGYMDXCAV1z3JUN+n0XAkN5o9wmXexBd9jzliPiZiRnzIq/u2LFpsdW6BuCJFHC/juI5DA4+27mMGp53jCLvp7JdvoxsVsw44WyphNxr1cq7jIzIkdEg+KhDoKnUsAA/AyhlSLae1/Gc02qND9frf678kDQ87zhFDhQ6QdYIirLvDFfk649qdfCOMbYZq2v0n2lOkXPlIHg9AnX9ExaZiLWQIzBX1vrJntOw22Wo1CsAzgDYspZgCbZXK1pv691PfBc0JyYmxHFOAXhhPUgQ+LSsdWJ/pb6MLo6NlTaUStOOiH2areqdYCVvi3xuxy0tkfzHqVJbYF/E5FsCPFNEkShwqd0+bUctyyaXQNeUtNtvk1RCjkBkmEAbwG0BbkPkBhxHDwB6QSTwtF4oQvY/3By2M7iYuTAAAAAASUVORK5CYII=',
      width: '30',
      height: '30',
      rotation: '0',
      opacity: '1',
      offsetX: '0',
      offsetY: '0',
    });
    const point = new g2.sfs.Point({
      x: start.lon || start.x,
      y: start.lat || start.y,
      spatialReference: this.map.spatialReference,
    });
    if (this.networkLayer.contains('delete' + this.options.currentId)) {
      this.networkLayer.remove(this.networkLayer.find('delete' + this.options.currentId));
    }
    const pointEle = new g2.sfs.Element({ id: 'delete' + this.options.currentId, geometry: point, symbol: markerSymbol });
    this.networkLayer.add(pointEle);
  },
  // 清除地图所有弹窗
  clearPopup() {
    this.toolTipWare.clear();
  },

  clearRouteResults() {
    this.fire('closeRoute', true);
    this.routeLayers.clear();
    if (this.toolTipWare) {
      this.toolTipWare.clear();
    }
    if (this.highlightLayer) {
      this.highlightLayer.clear();
    }
    if (this.networkLayer) {
      this.networkLayer.clear();
    }
  },
  clearRouteResultsById(id: any) {
    if (this.routeLayers) {
      while (this.routeLayers.contains(id)) {
        this.routeLayers.remove(this.routeLayers.find(id));
      }
    }
  },
  clearRouteById(id: any, position: any) {
    if (this.routeLayers) {
      while (this.routeLayers.contains(id)) {
        this.routeLayers.remove(this.routeLayers.find(id));
      }
    }
    if (this.networkLayer) {
      if (position === 0) {
        while (this.networkLayer.contains('delete' + id)) {
          this.networkLayer.remove(this.networkLayer.find('delete' + id));
        }
        while (this.networkLayer.contains('start' + id)) {
          this.networkLayer.remove(this.networkLayer.find('start' + id));
        }
      } else if (position === 1) {
        while (this.networkLayer.contains('end' + id)) {
          this.networkLayer.remove(this.networkLayer.find('end' + id));
        }
      }
    }
  },
  // 清除地图显示的路径
  clearResults() {
    // if (this.routeLayers) {
    //     this.routeLayers.clear();
    // }
    if (this.networkLayer) {
      this.networkLayer.clear();
    }
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
    }
    if (this.toolTipWare) {
      this.toolTipWare.clear();
    }
  },
  clearResultsById(id: any) {
    if (this.networkLayer) {
      let eleNum: any = this.networkLayer.elements.length - 1;
      while (eleNum > -1) {
        if (this.networkLayer.elements[eleNum].id.indexOf(id) !== -1) {
          this.networkLayer.remove(this.networkLayer.elements[eleNum]);
        }
        eleNum--;
      }
    }
  },
  // 移除Control
  remove() {
    this.clear();
    if (this.routeLayers) {
      this.map.removeLayer(this.routeLayers);
    }
    if (this.networkLayer) {
      this.map.removeLayer(this.networkLayer);
    }
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
    }
    // this.realtimeTrafficLayer && this.map.removeLayer(this.realtimeTrafficLayer);
  },
  // 移除起点/途经点/终点
  removePoint(data: any) {
    const id = this._getPointId(data.position, data.iconClass);
    if (this.networkLayer.contains(id)) {
      this.networkLayer.remove(this.networkLayer.find(id));
      this.routeLayers.clear();
    }
    if (this.networkLayer.elements.length === 0) {
      this.routeLayers.clear();
      if (this.toolTipWare) {
        this.toolTipWare.clear();
      }
      if (this.highlightLayer) {
        this.highlightLayer.clear();
      }
    }
  },
  clear() {
    if (this.routeLayers) {
      this.routeLayers.clear();
    }
    if (this.networkLayer) {
      this.networkLayer.clear();
    }
    if (this.toolTipWare) {
      this.toolTipWare.clear();
    }
    if (this.highlightLayer) {
      this.highlightLayer.clear();
    }
    // this.realtimeTrafficLayer.setVisible(false);
    if (this.plotEditTool) {
      // this.plotEditTool.deactivate();
      this.plotEditTool = null;
    }
    if (this.options.commandNotify) {
      this.options.commandNotify.activeCommand('NoopTool');
    }
    if (this.options.legendMgr) {
      this.options.legendMgr.removeByGroup(this.id);
    }
  },

  /**
   * 带有context的事件分发, 最后一个参数是事件回调的context
   * @method
   * @private
   * @param {string} type 事件类型
   */
  fire(type: any) {
    if (!this._$handlers) {
      this._$handlers = {};
    }
    // 执行的返回值
    const results = [];
    if (this._$handlers[type]) {
      const args = arguments;
      const argLen = args.length;

      if (argLen > 3) {
        // todu
        // args = arrySlice.call(args, 1);
      }

      const hh: any = this._$handlers[type];
      let len = hh.length;
      for (let i = 0; i < len;) {
        let result = null;
        // Optimize advise from backbone
        switch (argLen) {
          case 1:
            result = hh[i].h.call(hh[i].ctx);
            break;
          case 2:
            result = hh[i].h.call(hh[i].ctx, args[1]);
            break;
          case 3:
            result = hh[i].h.call(hh[i].ctx, args[1], args[2]);
            break;
          default:
            // have more than 2 given arguments
            result = hh[i].h.apply(hh[i].ctx, args);
            break;
        }
        results.push(result);
        if (hh[i].one) {
          hh.splice(i, 1);
          len--;
        } else {
          i++;
        }
      }
    }
    // 返回所有回调的返回值，不返回this，不能使用链式操作
    return results;
  },
  addStartLocation(sendPathNodeInfo: any, pathanalysislist: any) {
    const staterpoint = sendPathNodeInfo[0];
    const staterpointx = staterpoint.lon;
    const staterpointy = staterpoint.lat;
    const endpoint = sendPathNodeInfo[1];
    const endpointx = endpoint.lon;
    const endpointy = endpoint.lat;
    const staterpointOnes = pathanalysislist[0].road.points[0];
    const staterpointOnesx = staterpointOnes.x;
    const staterpointOnesy = staterpointOnes.y;
    let offset: any = [];
    if (staterpointx >= endpointx) {
      offset = [30, -28];
      // if (staterpointy >= endpointy) { //右
      //   offset = [30, -58];
      // } else {//左
      //   offset = [30, -8];
      // }
    } else if (staterpointx < endpointx) {
      offset = [-70, -28];
      //  if (staterpointy >= endpointy) { //右
      //     offset = [-70, -58];
      //   } else {//左
      //     offset = [-70, -8];
      //   }
    }
    const overlayWare = new g2.widget.OverlayWare({
      map: (window as any).map,
    });
    const contentTemplate11 = document.getElementById('path-analysis-icon-id');
    const positionpoint: any = {
      x: staterpointx * 1,
      y: staterpointy * 1,
    };
    const overlay = new g2.widget.OverLay({
      id: 'earCenterLayer',
      stopEvent: false,
      element: contentTemplate11, // dom元素对象
      position: positionpoint, // 覆盖物在地图上停靠的位置
      offset,
    });
    overlayWare.add(overlay);
    $('#path-analysis-icon-id').parent().parent().css('width', 'unset');
    $('#path-analysis-icon-id').parent().parent().css('height', 'unset');
    $('#path-analysis-icon-id').parent().parent().css('z-index', '1');
  },
});
export default component;
