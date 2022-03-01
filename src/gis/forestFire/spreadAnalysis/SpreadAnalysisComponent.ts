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
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.featureHighlight = options.GISComponents.featureHighlight;
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
            const id = 'firePoint';
            if (self.networkLayer.contains(id)) {
                self.networkLayer.remove(self.networkLayer.find(id));
            }

            self.networkLayer.remove(plotElement);
            self.featureHighlight.removeHighlight('firePoint');
            const opts = {
                x: plotElement.elements[0].geometry.x,
                y: plotElement.elements[0].geometry.y,
            };
            self._showFirePoint(opts);
            self
                .request2({
                    x: plotElement.elements[0].geometry.x,
                    y: plotElement.elements[0].geometry.y,
                })
                .then((res: any) => {
                    // tslint:disable-next-line:no-shadowed-variable
                    const opts = {
                        x: res.x,
                        y: res.y,
                        address: res.address,
                    };
                    self.fire('getAddress', opts);
                })
                .catch((errInfo: any) => {
                    self.fire('error', errInfo);
                });
            // activeButton.nextElementSibling.value = G.utils.ResourceUtil.getLocaleValue('PathAnalysis').selectLocation || "手动选点";
            // plotElement.elements[0].id = id;
            // activeButton.nextElementSibling.data_user = plotElement.elements[0].geometry;
        };
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
    _showFirePoint(item: any) {
        const self = this;
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + item.x + ' ' + item.y + ')',
            },
            style: {
                type: 'Custom',
                options: {
                    // 自定义dom结构
                    content: '<div id=\'firePoint\'><img src=\'./imgs/firePoint.gif\'/></div>',
                    offsetx: -17,
                    offsety: -46,
                },
            },
        };
        self.featureHighlight.addHighlight('firePoint', options);
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
    // 清除地图所有弹窗
    clearPopup() {
        this.toolTipWare.clear();
    },
    // 移除Control
    remove() {
        this.clear();
    },
    clear() {
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
        this.featureHighlight.clearHighlight();
    },
    clearPoint() {
        this.featureHighlight.clearHighlight();
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
});
export default component;
