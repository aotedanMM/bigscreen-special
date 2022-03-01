// import {Inject} from 'prism-web'
// import {PlotNoSqlService} from '../service/PlotNoSqlService';
import Util from './PlotUtil';
export class PlotManagerMapComponent extends window.G.base.ComponentBase {
    // @Inject(PlotNoSqlService) mapservices;
    // tslint:disable-next-line: member-ordering
    public opt: any;
    // tslint:disable-next-line: member-ordering
    public options: any;
    // tslint:disable-next-line: member-ordering
    public PlotComponent: any;
    // tslint:disable-next-line: member-ordering
    public plotLayer: any;
    // tslint:disable-next-line: variable-name
    public _isWhiteBoard: any;
    public noSave: any;
    public plotMap: any;
    public plotUtil: any;
    public mapservices: any;
    public plotListjson: any;
    public plotIconsBase64: any;
    public selectPlotElement: any;
    public copiedPlotElement: any;
    public mapDemension: any;
    public plotComponent2D: any;
    public plotComponent3D: any;
    public plotSchemas: any = {};

    constructor(opt: any) {
        super(opt);
        this.opt = opt;
    }

    public initialize(opts: any) {
        this.options = opts;
        this.options.PlotServiceUrl = null; // sql标绘服务
        this.options.PlotConfigService = null;
        this.options.PlotNoSqlService = null;
        this.options.textBorder = {
            borderColor: {
                alpha: 1,
                r: 255,
                g: 255,
                b: 255,
            },
            borderThickness: 0,
        };
        this.mapDemension = '2d';
    }
    public loadSchema(schema: any, id: string) {
        const schemaObj = this.getPlotComponent().parseSchema({schema});
        this.getPlotComponent().loadPlotSchema({ schema: schemaObj, flag: true, id});
        const plotArray: any = [];
        for (let i = 0; i < schemaObj.getCount(); ++i) {
            const element = schemaObj.getElement(i);
            const obj: any = {};
            obj.id = element.id;
            element.reset();
            plotArray.push(element);
        }
        this.plotSchemas[id] = plotArray;
    }
    public removeSchema(schema: any, id: any) {
        const elements = this.plotSchemas[id];
        if (elements) {
            for (const obj of elements) {
                const eleId = obj.id;
                this.getPlotComponent().removePlotElement(eleId);
            }
            delete this.plotSchemas[id];
        }
    }
    public switchMap(obj: any) {
        if (obj.type !== this.mapDemension) {
            const opts: any = {};
            opts.id = window.G.utils.CommonUtil.newUUID32();
            opts.name = name;
            opts.userId = this.options.businessId;
            const schema = this.createSchema(opts);
            // for (let i = 0; i < count; ++i) {
            //     const ele = self.getPlotComponent().getLayer().get(i);
            //     self.removeFromUnsaved(ele.id);
            // }
            this.cleanScreenCallBack();
            const schemaList: any = [];
            schema.elements.forEach((ele: any) => {
                ele.tag = ele.tag || {};
                ele.tag.businessId = ele.tag.businessId || this.options.businessId;
                if (ele.schemaId && schemaList.indexOf(ele.schemaId) < 0) {
                    schemaList.push(ele.schemaId);
                }
            });
            this.mapDemension = obj.type;
            if (obj.map) {
                this.options.map3D = obj.map;
            }
            this.getPlotComponent().loadPlotSchema({ schema, flag: true });
            this.scanSchema(schema, true);
            // 刷新列表
            this.updateUnsavedView();
            this.highlightSavedView(schemaList);
        }
    }
    public createSchema(opts: any) {
        const schema = new (G as any).plot.PlotSchema(opts);
        const count = this.getPlotComponent().getLayer().getCount();
        for (let i = 0; i < count; ++i) {
            const ele = this.getPlotComponent().getLayer().get(i);
            if (ele.tag.businessId !== opts.userId) {
                continue;
            }
            const cpy = ele.copy();
            cpy.unReset();
            cpy.id = ele.id;
            cpy.schemaId = ele.schemaId;
            // cpy.plot.isClose = true;
            if (cpy.kind === 'tailedtext') {
                const leadLabel = this.getPlotComponent().getTailedLabelbyId(ele.id);
                if (leadLabel) {
                    cpy.tailedLabelAttr = this.getPlotComponent().serializeTailedLabel(leadLabel);
                    schema.addElement(cpy);
                }
            } else if (cpy.kind === 'overlay') {
                const overlayObj = this.getPlotComponent()._plotOverlayTool.getOverlayObjById(ele.id);
                if (overlayObj) {
                    cpy.overlayAttr = this.getPlotComponent()._plotOverlayTool.serialize(overlayObj);
                    schema.addElement(cpy);
                }
            } else if (cpy.kind === 'point') {
                let index: any = 0;
                for (const subEle of cpy.elements) {
                    if (subEle.symbol instanceof g2.sfs.VectorMarkerSymbol) {
                        subEle.symbol.scale = ele.elements[index].symbol.scale;
                        subEle.symbol.rotation = ele.elements[index].symbol.rotation;
                    } /* else if (subEle.symbol instanceof g2.sfs.PictureMarkerSymbol) {
                        const oSymbol = ele.elements[index].symbol;
                        const symbolObj = Object.assign({}, oSymbol);
                        delete symbolObj.$type;
                        symbolObj.width = oSymbol.width / oSymbol.scale;
                        symbolObj.height = oSymbol.height / oSymbol.scale;
                        const symbol = new g2.sfs.VectorMarkerSymbol(symbolObj);
                        subEle.symbol = symbol;
                        subEle.symbol.scale = ele.elements[index].symbol.scale;
                        subEle.symbol.rotation = ele.elements[index].symbol.rotation;
                    } */
                    index++;
                }
                schema.addElement(cpy);
            } else if (cpy.kind === 'polyline' && cpy.elements[0].geometry.paths[0].points.length < 1 ) {
                console.log('无效polyline');
            } else {
                schema.addElement(cpy);
            }
        }
        const extent = this.getMap().getExtent();
        schema.extent = extent;
        if (this.mapDemension === '3d') {
            const camera = this.getMap().camera;
            schema.camera = {
                heading: camera.heading,
                pitch: camera.pitch,
                roll: camera.roll,
                position: camera.position,
            };
        }
        return schema;
    }
    public getPlotComponent() {
        let plotComponent: any = null;
        const layerId = 'plot-layer';
        switch (this.mapDemension) {
            case '2d':
                if (this.plotComponent2D) {
                    plotComponent = this.plotComponent2D;
                } else {
                    const plotLayer = new g2.carto.CanvasLayer({
                        map: this.options.map,
                        id: layerId,
                        zIndex: 20,
                        controlSymbol: new g2.sfs.SimpleMarkerSymbol({
                            fillColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 220,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 220,
                            }),
                        }),
                        centerSymbol: new g2.sfs.SimpleMarkerSymbol({
                            size: 8,
                            fillColor: new g2.sfs.Color({
                                r: 255,
                                g: 0,
                                b: 0,
                                a: 220,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 255,
                                g: 0,
                                b: 0,
                                a: 220,
                            }),
                        }),
                        rotateSymbol: new g2.sfs.SimpleMarkerSymbol({
                            size: 8,
                            fillColor: new g2.sfs.Color({
                                r: 255,
                                g: 255,
                                b: 0,
                                a: 220,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 255,
                                g: 255,
                                b: 255,
                                a: 220,
                            }),
                        }),
                        middleSymbol: new g2.sfs.SimpleMarkerSymbol({
                            fillColor: new g2.sfs.Color({
                                r: 255,
                                g: 255,
                                b: 255,
                                a: 200,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 255,
                            }),
                            borderThickness: 2,
                        }),
                        rotatelineSymbol: new g2.sfs.SimpleLineSymbol({
                            color: new g2.sfs.Color({
                                r: 100,
                                g: 34,
                                b: 234,
                                a: 200,
                            }),
                            width: 2,
                        }),
                    });
                    const tailedLayer = new g2.carto.LeadLabelLayer({
                        map: this.options.map,
                        id: layerId + '_tailed',
                        zIndex: 20,
                    });
                    this.options.map.addLayer(plotLayer);
                    this.options.map.addLayer(tailedLayer);
                    this.plotComponent2D = new window.G.plot.PlotComponent({
                        map: this.options.map,
                        layerId,
                    });
                    // 创建地图监听
                    this.plotComponent2D.on(window.G.misc.AppEvents.PLOT_CLICKED, this._plotClickListener, this);
                    // 标绘完成
                    this.plotComponent2D.on(window.G.misc.AppEvents.PLOT_CREATED, this._plotCompleteListener, this);
                    this.plotComponent2D.on('openTailedLabelEdit', this._openTailedLabelEdit, this);
                    plotComponent = this.plotComponent2D;
                }
                break;
            case '3d':
                if (this.plotComponent3D) {
                    plotComponent = this.plotComponent3D;
                } else {
                    const plotLayer = new g2.carto.CanvasLayer3D({
                        map: this.options.map3D,
                        id: layerId,
                        zIndex: 20,
                        controlSymbol: new g2.sfs.SimpleMarkerSymbol({
                            fillColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 220,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 220,
                            }),
                        }),
                        centerSymbol: new g2.sfs.SimpleMarkerSymbol({
                            size: 8,
                            fillColor: new g2.sfs.Color({
                                r: 255,
                                g: 0,
                                b: 0,
                                a: 220,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 255,
                                g: 0,
                                b: 0,
                                a: 220,
                            }),
                        }),
                        rotateSymbol: new g2.sfs.SimpleMarkerSymbol({
                            size: 8,
                            fillColor: new g2.sfs.Color({
                                r: 255,
                                g: 255,
                                b: 0,
                                a: 220,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 255,
                                g: 255,
                                b: 255,
                                a: 220,
                            }),
                        }),
                        middleSymbol: new g2.sfs.SimpleMarkerSymbol({
                            fillColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 50,
                            }),
                            borderColor: new g2.sfs.Color({
                                r: 0,
                                g: 0,
                                b: 255,
                                a: 150,
                            }),
                            borderThickness: 2,
                        }),
                        rotatelineSymbol: new g2.sfs.SimpleLineSymbol({
                            color: new g2.sfs.Color({
                                r: 100,
                                g: 34,
                                b: 234,
                                a: 200,
                            }),
                            width: 2,
                        }),
                    });
                    const tailedLayer = new g2.carto.LeadLabelLayer3D({
                        map: this.options.map3D,
                        id: layerId + '_tailed',
                        zIndex: 20,
                    });
                    this.options.map3D.addLayer(plotLayer);
                    this.options.map3D.addLayer(tailedLayer);
                    this.plotComponent3D = new window.G.plot.PlotComponent3D({
                        map: this.options.map3D,
                        layerId: 'plot-layer',
                    });
                    // 创建地图监听
                    this.plotComponent3D.on(window.G.misc.AppEvents.PLOT_CLICKED, this._plotClickListener, this);
                    // 标绘完成
                    this.plotComponent3D.on(window.G.misc.AppEvents.PLOT_CREATED, this._plotCompleteListener, this);
                    this.plotComponent3D.on('openTailedLabelEdit', this._openTailedLabelEdit, this);
                    plotComponent = this.plotComponent3D;
                }
                break;
        }
        return plotComponent;
    }
    public getMap() {
        let map: any = null;
        switch (this.mapDemension) {
            case '2d':
                map = this.options.map;
                break;
            case '3d':
                map = this.options.map3D;
                break;
        }
        return map;
    }
    // 添加Control
    public addControl(options: any) {
        // 创建标绘组件
        this.options.map = options.map;
        this.options.map3D = options.map3D;
        this.options.spatialReference = this.options.map.spatialReference;
        this.mapDemension = options.mapDemension;
        this.getPlotComponent().enableEdit(true);
        this.plotLayer = this.getPlotComponent().getLayer();
        // this.highlightLayer = this.PlotComponent.getHighlightLayer();
        // 标绘工具
        // this.plotUtil = this.options.PlotManagerUtil.getCacheInstance(this.options.map.namespace);
        // 是否是白板标绘
        this._isWhiteBoard = false;
        // 用户id模拟的用户
        //
        // this._initService();
        // 未保存的标绘变量
        this.noSave = {
            data: [],
        };
        this.plotMap = {};
        // 监听清屏
        // if (this.options.map) {
        this.options.map.listen(window.G.misc.AppEvents.CLEAR_MAP, this.cleanScreenCallBack, this);
        // }
    }

    public destroy() {
        this.plotComponent2D.off(window.G.misc.AppEvents.PLOT_CREATED, this);
        this.plotComponent2D.off(window.G.misc.AppEvents.PLOT_CLICKED, this);
        this.plotComponent3D.off(window.G.misc.AppEvents.PLOT_CREATED, this);
        this.plotComponent3D.off(window.G.misc.AppEvents.PLOT_CLICKED, this);
        this.options.map.off(window.G.misc.AppEvents.CLEAR_MAP, this);
        this.plotUtil.reset();
        // PureComponent.prototype.destroy.call(this);

        // this.getPlotComponent().options.tailedLabelComponent.onClose();
    }
    public setIcons(icons: any) {
        this.plotIconsBase64 = icons;
    }

    public setService(service: any) {
        this.mapservices = service;
    }

    // // 初始化服务
    // public _initService() {

    //     // console.log(this.mapservices);
    //     // let deserializer = new window.g2.core.Deserializer();
    //     // let ajaxhttp = new window.g2.core.RestHttp({token: 'Bearer d277145'});
    //     // let createPlotService = {
    //     //     'SQL': function (options) {
    //     //         options.plotService = new window.g2.plot.RestPlotService({
    //     //             url: options.PlotServiceUrl,
    //     //             deserializer: deserializer,
    //     //             http: ajaxhttp
    //     //         });
    //     //     },
    //     //     'NOSQL': function (options) {
    //     //         options.plotService = this.options.PlotNoSqlService;
    //     //     }
    //     // };
    //     // createPlotService[this.options.RestPlotService](this.options);
    // }


    // 开启绘制
    public startPlot() {
        return false;
    }

    /**
     * 接收绘制应急标绘事件
     * @param opts
     * @param opts.code: "PT110101"
     * @param opts.desc: "洪水、内涝、水库险情、堤防险情、凌汛灾害、山洪、农业干旱、城镇缺水、生态干旱、饮水困难等"
     * @param opts.name {String} 绘制符号名称类型 "水旱灾害"
     * @param opts.symbol {String} svg符号地址 "自然灾害/水旱灾害.svg"
     */
    public emergencyPlot(opts: any, businessId: string) {
        const t = opts.symbol.split('.')[0].split('/');
        const name = t[t.length - 1];
        const opt = {
            icons: this.plotIconsBase64[name],
            name: opts.name,
            tit: opts.code,
            type: 'Point',
            key: 'point',
        };
        this.draw(opt, businessId);
    }

    /**
     * 绘制标绘
     * @method
     * @param opts {Object} - 必填
     * @param opts.type {String} - 必填，标绘的类型，G.plot.TYPES下的枚举值;
     * @param opts.base {String} - 可选，base64;
     * @param opts.width {String} - 可选，宽度;
     * @param opts.height {String} - 可选，height;
     * @param opts.callback {Function} - 可选，绘制完成的回调，回调参数为当前标绘的元素;
     * @param opts.context {Object} - 可选，绘制完成的回调上下文;
     */
    public draw(opts: any, businessId: string) {
        const self: any = this;
        const paramObj: any = {};
        paramObj.callback = opts.callback;
        paramObj.context = opts.context;
        paramObj.name = opts.name;
        paramObj.businessId = businessId;
        if (opts.type === window.G.plot.TYPES.Point) {
            paramObj.type = opts.type;
            if (opts.base64) {
                // 标绘的符号
                paramObj.symbol = {
                    type: 'PictureMarkerSymbol',
                    options: {
                        source: 'data:image/png;base64,' + opts.base64,
                        width: opts.width || 42,
                        height: opts.height || 42,
                        scale: opts.scale || 1,
                        offsetX: 0,
                        offsetY: 0,
                        opacity: 1,
                    },
                };
                self.getPlotComponent().plot(paramObj);
            } else {
                const type = 'VectorMarkerSymbol';
                // if (this.mapDemension === '3d') {// TODO 三维不支持Vector 先用Picture
                //     type = 'PictureMarkerSymbol';
                // }
                paramObj.symbol = {
                    type,
                    options: {
                        source: opts.icons,
                        width: opts.width || 30,
                        height: opts.height || 30,
                        offsetX: 0.5,
                        offsetY: 0.5,
                        scale: opts.scale || 1,
                        opacity: 1,
                        rotation: opts.rotation || 0,
                    },
                };
                // 常用工具 走的是svg文件url，在这里截取一下
                if (opts.icons.indexOf('.svg') > -1) {
                    const t = opts.icons.split('.')[1].split('/');
                    const name = t[t.length - 1];
                    paramObj.symbol.options.source = this.plotIconsBase64[name];
                }
                self.getPlotComponent().plot(paramObj);
            }
        } else if (opts.type === window.G.plot.TYPES.Text) {
            paramObj.type = opts.type;
            if (opts.symbol) {
                paramObj.symbol = opts.symbol;
                paramObj.text = opts.symbol.options.text.toString();
                paramObj.symbol.options.borderColor = self.options.textBorder.borderColor;
                paramObj.symbol.options.borderThickness = self.options.textBorder.borderThickness;
            } else {
                paramObj.text = '自定义文本';
            }
            // paramObj.text = Util.addTextLineSeperator(paramObj.text, this.opt.textLineLimit);
            self.getPlotComponent().plot(paramObj);
        } else if (opts.type === window.G.plot.TYPES.TAILEDTEXT) {
            paramObj.type = opts.type;
            paramObj.text = '自定义文本';
            paramObj.tailedtext_symbol = opts.tailedtext_symbol;
            // paramObj.text = Util.addTextLineSeperator(paramObj.text, this.opt.textLineLimit);
            self.getPlotComponent().plot(paramObj);
        } else if (opts.type === window.G.plot.TYPES.Overlay) {
            paramObj.type = opts.type;
            paramObj.overlayOpt = opts.overlayOpt;
            self.getPlotComponent().plot(paramObj);
        } else {
            paramObj.type = opts.type;
            paramObj.size = opts.size;
            paramObj.symbol = opts.symbol;
            self.getPlotComponent().plot(paramObj);
        }
    }

    public startKeyboardListener() {
        const self: any = this;
        this.keydownListener = ((event: any) => {
            if (event.srcElement.className === 'ol-viewport' || event.srcElement.className === 'cesium-widget' || event.srcElement.className.indexOf('constom-select') > -1) {
                if (event.keyCode === 46) {
                    console.log('走入键盘删除监听');
                    // document.removeEventListener('keydown', self.keydownListener);
                    self.deleteElement(self.selectPlotElement);
                } else if (event.ctrlKey && event.keyCode === 67) {
                    console.log('走入键盘ctrl+c监听');
                    self.copyElement();
                } else if (event.ctrlKey && event.keyCode === 86) {
                    console.log('走入键盘ctrl+v监听');
                    self.pasteElement();
                }
            }
        });
        document.addEventListener('keydown', this.keydownListener);
    }
    public endKeyboardListener() {
        document.removeEventListener('keydown', this.keydownListener);
    }
    public deleteElement(ele: any) {
        this.fire('deletePlotElement', { id: ele.id, businessId: ele.tag.businessId });
        // for (let i = 0; i < this.noSave.data.length; i++) {
        //     if (this.noSave.data[i].id === ele.id) {
        //         this.fire('deletePlotElement', { ele, idx: i, index: 0 });
        //     }
        // }
    }
    public copyElement() {
        this.copiedPlotElement = JSON.parse(this.circularFix(this.selectPlotElement)); // 去除parent循环引用
    }
    public pasteElement() {
        // 元素深拷贝
        const neoPlot = JSON.parse(JSON.stringify(this.copiedPlotElement));
        // 修改id等属性
        this.modifyAttribute(neoPlot);
        // plot宽高
        const coordRange = this.getPlotExtent(neoPlot);
        // 取宽高较小的作为移动方向
        const direction = coordRange.x > coordRange.y ? 'y' : 'x';
        const moveDistance = coordRange[direction];
        // 递归更改所有坐标（x或y，增加固定值）
        this.modifyCoordRecursively(neoPlot, direction, moveDistance);
        if (this._plotEffective(neoPlot)) {
            this.plotLayer.add(neoPlot);
        }
    }
    // 去除循环引用
    public circularFix(data: any) {
        let cache: any = [];
        const str = JSON.stringify(data, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        });
        cache = null;
        return str;
    }
    // 获取标注元素范围
    public getPlotExtent(plot: any) {
        const ctrlPoints = plot.plot.controlPoints;
        let width = 30;
        let height = 30;
        if (ctrlPoints.length === 1) {
            const symbol = plot.elements[0].symbol;
            width = symbol.width * symbol.scale || 30;
            height = symbol.height * symbol.scale || 30;
        } else if (ctrlPoints.length > 1) {
            width = this.getKeyRangeFromArr(ctrlPoints, 'x');
            height = this.getKeyRangeFromArr(ctrlPoints, 'y');
        }
        const mapRes = this.options.map.getResolution();
        return {
            x: width * mapRes,
            y: height * mapRes,
        };
    }
    public getKeyRangeFromArr(arr: any, key: string) {
        arr.sort(function(obj1: any, obj2: any) {
            return obj1.x - obj2.y;
        });
        return Math.abs(arr[0][key] - arr[arr.length - 1][key]);
    }

    public modifyCoordRecursively(obj: any, direction: string, delta: any) {
        if (!obj) {
            return;
        }
        if (Array.isArray(obj)) {
            obj.forEach((res) => {
                this.modifyCoordRecursively(res, direction, delta);
            });
        } else if (typeof obj === 'object') {
            Object.keys(obj).forEach((key) => {
                if (key === direction) {
                    const newCoord = obj[key] + delta;
                    obj[key] = newCoord;
                } else if (typeof obj[key] === 'object') {
                    this.modifyCoordRecursively(obj[key], direction, delta);
                }
            });
        }
    }
    public modifyAttribute(neoPlot: any) {
        const eleUUID = G.utils.CommonUtil.newUUID();
        const eleName = neoPlot.kind + '_' + eleUUID.split('-')[0];
        neoPlot.name = eleName;
        neoPlot.id = eleUUID;
        if (neoPlot.elements) {
            for (const key in neoPlot.elements) {
                if (neoPlot.elements.hasOwnProperty(key)) {
                    const element = neoPlot.elements[key];
                    element.name = eleName;
                    element.id = G.utils.CommonUtil.newUUID();
                    if (element.parent) {
                        element.parent.id = eleUUID;
                        element.parent.name = eleName;
                        delete element.parent.elements;
                    }
                }
            }
        }
    }
    /**
    * 判断元素是普通标绘还是引线标注
    * @param ele 元素
    */
    public isTailedLabel(ele: any) {
        let flag = false;
        if (ele.$type && ele.$type.indexOf('LeadLabel') > -1) {
            flag = true;
        }
        return flag;
    }
    /**
     * 标绘元素点击回调
     * @method
     */
    public _plotClickListener(event: any) {
        const plotElement: any = event.element;
        if (plotElement != null) {
            if (this._plotEffective(plotElement)) {
                this.selectPlotElement = plotElement;
                let schemaId = '';
                if (plotElement.schemaId) {
                    schemaId = plotElement.schemaId;
                }
                const businessId = plotElement.tag.businessId;
                this.endKeyboardListener();
                this.startKeyboardListener();
                const isTailedLabel = this.isTailedLabel(plotElement);
                const symbolHex: any = {};
                let descStr: any = '';
                if (isTailedLabel) {
                    if (plotElement.attributeSet.attributes.length > 0) {
                        descStr = plotElement.attributeSet.getItem(0).value;
                    }
                    // const tailedLabelAttr: any = JSON.parse(plotElement.tailedLabelAttr);
                    symbolHex.type = 'TailedText';
                    symbolHex.inputFont = plotElement.label;
                    symbolHex.linewidth = plotElement.lineWidth;
                    symbolHex.lineColor = this._color2Hex(plotElement.lineColor);
                    symbolHex.borderWidth = plotElement.textBackgroundBorderThickness;
                    symbolHex.borderColor = this._color2Hex(plotElement.textBackgroundBorderColor);
                    symbolHex.fontFamilyLi = plotElement.fontFamilyName;
                    symbolHex.fontSizeLi = plotElement.fontSize;
                    symbolHex.fillColor = this._color2Hex(plotElement.backgroundColor);
                    symbolHex.textColor = this._color2Hex(plotElement.foregroundColor);
                    symbolHex.iconOpacity = plotElement.foregroundColor.a;
                    symbolHex.inputDesc = descStr;
                    this.firePlotClickEvent({
                        id: plotElement.id,
                        schemaId,
                        businessId,
                        symbol: symbolHex,
                        plotProperty: descStr,
                    });
                } else if (plotElement.kind === 'overlay') {
                    this.fireClearEditPanelEvent();
                } else {
                    // 获取点击元素
                    const element: any = plotElement.elements[0];
                    if (element.attributeSet.attributes.length > 0) {
                        descStr = element.attributeSet.getItem(0).value;
                    }
                    const symbol: any = element.symbol;
                    const obj: any = window.G.utils.RenderUtil.symbol2Object(symbol);
                    const type: any = obj.type;
                    if (type === 'SimpleFillSymbol') {
                        const borderColor = obj.options.borderColor;
                        const borderThickness = obj.options.borderThickness;
                        const opacity = obj.options.opacity;
                        const fillColor = obj.options.fillColor;
                        const style = obj.options.style;
                        symbolHex.type = type;
                        symbolHex.borderColor = this._color2Hex(borderColor);
                        symbolHex.linewidth = borderThickness;
                        symbolHex.fillColor = this._color2Hex(fillColor);
                        symbolHex.lineStyle = style.toString();
                        symbolHex.borderOpacity = borderColor.a;
                        symbolHex.fillOpacity = fillColor.a;
                        symbolHex.inputDesc = descStr;
                    } else if (type === 'SimpleLineSymbol') {
                        const color = obj.options.color;
                        const width = obj.options.width;
                        const style = obj.options.style;
                        symbolHex.type = type;
                        symbolHex.borderColor = this._color2Hex(color);
                        symbolHex.linewidth = width;
                        symbolHex.lineStyle = style.toString();
                        symbolHex.iconOpacity = color.a;
                        symbolHex.inputDesc = descStr;
                    } else if (type === 'TextSymbol') {
                        const fontFamilyName = obj.options.fontFamilyName;
                        const text = obj.options.text.toString();
                        const fontSize = obj.options.fontSize;
                        const foreground = obj.options.foreground;
                        symbolHex.fontFamilyLi = fontFamilyName;
                        symbolHex.type = type;
                        symbolHex.inputFont = text;
                        symbolHex.fontSizeLi = fontSize;
                        symbolHex.textColor = this._color2Hex(foreground);
                        symbolHex.inputDesc = descStr;
                    } else if (type === 'SimpleMarkerSymbol') {
                        if (plotElement.kind === 'tailedtext') {
                            /*  TODO
                             const tailedLabelAttr: any = JSON.parse(plotElement.tailedLabelAttr);
                             symbolHex.type = 'TailedText';
                             symbolHex.inputFont = tailedLabelAttr.domHtml;
                             symbolHex.linewidth = tailedLabelAttr.symbol.options.width;
                             const lineColorTem = tailedLabelAttr.symbol.options.color;
                             symbolHex.lineColor = this._color2Hex(lineColorTem);
                             symbolHex.borderWidth = parseInt(tailedLabelAttr.domStyle.border.split('px')[0], 10);
                             symbolHex.borderColor = '#' + tailedLabelAttr.domStyle.border.split('#')[1];
                             symbolHex.fontFamilyLi = tailedLabelAttr.domStyle.fontFamily;
                             symbolHex.fontSizeLi = parseInt(tailedLabelAttr.domStyle['font-size'].split('px'), 10);
                             symbolHex.fillColor = tailedLabelAttr.domStyle.background;
                             symbolHex.textColor = tailedLabelAttr.domStyle.color;
                             symbolHex.iconOpacity = tailedLabelAttr.domStyle.opacity * 255;
                             symbolHex.inputDesc = descStr; */
                        }
                    } else if (type === 'VectorMarkerSymbol') {
                        symbolHex.options = obj.options;
                        symbolHex.scale = obj.options.scale;
                        symbolHex.iconOpacity = obj.options.opacity * 255;
                        symbolHex.inputDesc = descStr;
                        symbolHex.rotation = obj.options.rotation;
                        symbolHex.type = type;
                    } else if (type === 'PictureMarkerSymbol') {
                        symbolHex.options = obj.options;
                        symbolHex.scale = obj.options.scale;
                        symbolHex.iconOpacity = obj.options.opacity * 255;
                        symbolHex.inputDesc = descStr;
                        symbolHex.rotation = obj.options.rotation;
                        symbolHex.type = type;
                        // this.fireClearEditPanelEvent();
                        // self.firePlotClickEvent({
                        //     id: plotElement.id
                        // });
                    }
                    // if (type !== 'PictureMarkerSymbol') {
                    this.firePlotClickEvent({
                        id: plotElement.id,
                        schemaId,
                        businessId,
                        symbol: symbolHex,
                        plotProperty: descStr,
                    });
                    // }
                }
            }
        } else {
            this.selectPlotElement = null;
            document.removeEventListener('keydown', this.keydownListener);
            this.fireClearEditPanelEvent();
        }
    }

    /**
     * 判断标绘是否有效
     * @method
     */
    public _plotEffective(element: any) {
        let exist = true;
        const plotAlgorithmTwo: any = ['PolygonAlgorithm', 'RectangleAlgorithm', 'DoubleArrowAlgorithm', 'SwallowTailArrowAlgorithm',
            'SimpleArrowAlgorithm', 'ArsenalAlgorithm', 'ExpertProtectAlgorithm', 'PowerRepairAlgorithm',
            'ArmyAlgorithm', 'FireProtectAlgorithm', 'MedicalCureAlgorithm', 'PowerRepairAlgorithm', 'ProChymicAlgorithm',
            'ProSuccorAlgorithm', 'CannonAlgorithm', 'ArtilleryManenCampmentAlgorithm', 'LeadLabel'];
        let typeAlgorithm: string = '';
        if (element.algorithm) {
            typeAlgorithm = element.algorithm.$type;
            const controlPoints = element.plot.controlPoints;
            for (const index in plotAlgorithmTwo) {
                if (typeAlgorithm.indexOf(plotAlgorithmTwo[index]) > -1 && controlPoints.length < 3) {
                    exist = false;
                }
            }
        } else if (element.$type) {
            // TODO 这里需要怎么判断
            typeAlgorithm = element.$type;
        }
        return exist;
    }

    /**
     * 标绘完成处理方法
     * @method
     * @param data
     * @param data.type {String} - 必填，标绘类型
     * @param data.element {Object} - 必填，标绘元素
     */
    public _plotCompleteListener(data: any) {
        const self = this;

        if (self._plotEffective(data.element)) {
            // self.plotUtil.add(data.element);
            const opts = self.noSave.data;
            const plot: any = {};
            plot.id = data.element.id;
            plot.content = data.element.name;
            plot.businessId = data.element.tag.businessId;
            opts.push(plot);
            self.updateUnsavedView();
        }
    }

    public _openTailedLabelEdit(data: any) {
        this._plotClickListener({ element: data });
    }


    /**
     * 更新未保存的标绘
     * @method
     */
    public updateUnsavedView() {
        this.fire('updateUnsavedView', this.noSave);
    }

    /**
     * 清屏-清除未保存的标绘和地图上的标绘
     * @method
     * @param
     */
    public cleanScreenCallBack() {
        if (this.plotComponent2D) {
            const layer = this.plotComponent2D.getLayer();
            const plotArr = layer.elements || layer._elements;
            for (let i = plotArr.length - 1; i >= 0; i--) {
                this.removeFromUnsaved(plotArr[i].id);
                // 2020年3月24日 修复清屏时引线标绘事件问题
                // this.PlotComponent.removePlotElement(plotArr[i].id);
            }
            this.plotComponent2D.clearPlotElements();
        }
        if (this.plotComponent3D) {
            const layer = this.plotComponent3D.getLayer();
            const plotArr = layer.elements || layer._elements;
            for (let i = plotArr.length - 1; i >= 0; i--) {
                this.removeFromUnsaved(plotArr[i].id);
                // 2020年3月24日 修复清屏时引线标绘事件问题
                // this.PlotComponent.removePlotElement(plotArr[i].id);
            }
            this.plotComponent3D.clearPlotElements();
        }
        this.firstSchemaShow = false;
        this.noSave = {
            data: [],
        };
        this.plotSchemas = {};
        this.updateUnsavedView();
        this.refreshPlotSchemaList(this.options.businessId, 1, 9, '');
        this.removeHighlightSchema();
    }
    public cancelPlot() {
        this.getPlotComponent().cancelPlot();
    }
    /**
     * *****************************************************************************
     */
    /**
     * 删除未保存的标绘，地图上也清空
     * @method
     * @param id {String} - 必填，元素id
     */
    public removeUnsaved(id: any) {
        const self = this;
        this.selectPlotElement = null;
        document.removeEventListener('keydown', this.keydownListener);
        self.removeFromUnsaved(id);
        self.getPlotComponent().removePlotElement(id);
        // //
        // const plotArr = self.plotLayer.elements;

        // // for ( let j = 0; j < plotArr.length; j++ ) {
        // //     if (plotArr[j].id === id) {
        // //         self.plotUtil.remove(plotArr[j]);
        // //     }
        // // }
        // for (const obj of plotArr) {
        //     if (obj.id === id) {
        //         self.plotUtil.remove(obj);
        //     }
        // }
    }

    /**
     * 从未保存的标绘缓存中移除
     * @method
     * @param id {String} - 必填，元素id
     */
    public removeFromUnsaved(id: any) {
        const data = this.noSave.data;
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].id === id) {
                data.splice(i, 1);
                break;
            }
        }
    }

    public removeHighlightSchema() {
        this.fireRemoveHighlightSchema();
    }
    /**
     * *****************************************************************************
     */
    /**
     * 刷新标绘方案列表
     * @method
     */
    public refreshPlotSchemaList(businessId: string, page?: number, limit?: number, name?: any) {
        const self = this;
        const querypage = page ? page : 1;
        const userid = businessId ? businessId : this.options.businessId;
        self.mapservices.list(userid, '1900-01-01 00:00:00', '2100-01-01 00:00:00', querypage, limit ? limit : 9, name ? name : '').then((callbackdata: any) => {
            // 如果查的是最后一页，但是没有内容，则再查一遍倒数第二页
            if (querypage > 1 && callbackdata.array.length === 0) {
                self.mapservices.list(userid, '1900-01-01 00:00:00', '2100-01-01 00:00:00', querypage - 1, limit ? limit : 9).then((callbackdata2: any) => {
                    self.readSchemaInfo(userid, callbackdata2);
                }).catch((error: any) => {
                    self.dealWithSchemaError(userid, error);
                });
            } else {
                self.readSchemaInfo(userid, callbackdata);
            }
        }).catch((error: any) => {
            self.dealWithSchemaError(userid, error);
        });

        // self.mapservices.list(self.businessId, '1900-01-01 00:00:00', '2100-01-01 00:00:00',
        //     function (summaries) {
        //         var data = [];
        //         for (var i = 0; i < summaries.length; i++) {
        //             var plot = {};
        //             plot.id = summaries[i].id;
        //             plot.val = summaries[i].name;
        //             plot.createTime = summaries[i].createTime;
        //             data.push(plot)
        //         }
        //         data.sort(compare('createTime'));
        //
        //         function compare(property) {
        //             return function (obj1, obj2) {
        //                 var value1 = obj1[property];
        //                 var value2 = obj2[property];
        //                 return value2 > value1 ? 1 : -1;
        //             }
        //         };
        //         var json = {};
        //         json.data = data;
        //         self.plotListjson = json;
        //         self.fireRefreshSchemaListEvent(json);
        //     },
        //     function (error) {
        //         if (error.status == '404') {
        //             var json = {};
        //             json.data = [];
        //             self.plotListjson = json;
        //             self.fireRefreshSchemaListEvent(json);
        //         }
        //         //G.utils.LoggerUtil.warn(error);
        //     });
    }
    public dealWithSchemaError(businessId: any, error: any) {
        if (error.status === '404') {
            const json: any = {};
            json.data = [];
            this.plotListjson = json;
            this.fireRefreshSchemaListEvent(businessId, json);
        }
    }
    public readSchemaInfo(businessId: any, callbackdata: any) {
        const summaries = callbackdata.array;
        const data: any = [];
        // for (let i = 0; i < summaries.length; i++) {
        //     const plot: any = {};
        //     plot.id = summaries[i].id;
        //     plot.val = summaries[i].name;
        //     plot.createTime = summaries[i].createTime;
        //     data.push(plot)
        // }
        for (const obj of summaries) {
            const plot: any = {};
            plot.id = obj.id;
            plot.val = obj.name;
            plot.createTime = obj.createTime;
            data.push(plot);
        }
        data.sort(compare('createTime'));
        function compare(property: any) {
            return (obj1: any, obj2: any) => {
                const value1 = obj1[property];
                const value2 = obj2[property];
                return value2 > value1 ? 1 : -1;
            };
        }
        const json: any = {};
        json.data = data;
        json.listTotal = callbackdata.totalCount;
        this.plotListjson = json;
        this.fireRefreshSchemaListEvent(businessId, json);
    }

    /**
     * 白板标绘
     * @method
     * @param bool {Boolean} - 必填，是否白板标绘
     */
    public whiteBoardClick(bool: any) {
        const layers = this.getMap().layers;
        const visible = !(!!bool);
        this._isWhiteBoard = !visible;
        if (visible) {
            // for (let i = 0; i < layers.length; i++) {
            //     const layer = layers[i];
            //     if (layer) {
            //         if (layer._type === '_base_layer_tag' &&
            //             layer.hasOwnProperty('_used2beVisible')) {
            //             layer.setVisible(true);
            //             delete layer._used2beVisible;
            //         }
            //     }
            // }
            for (const obj of layers) {
                const layer = obj;
                if (layer) {
                    if (layer._type === '_base_layer_tag' &&
                        layer.hasOwnProperty('_used2beVisible')) {
                        layer.setVisible(true);
                        delete layer._used2beVisible;
                    }
                }
            }
        } else {
            // for (let i = 0; i < layers.length; i++) {
            //     const layer = layers[i];
            //     if (layer) {
            //         if (layer._type === '_base_layer_tag' &&
            //             layer.visible) {
            //             layer.setVisible(false);
            //             layer._used2beVisible = true;
            //             break;
            //         }
            //     }
            // }
            for (const obj of layers) {
                const layer = obj;
                if (layer) {
                    if (layer._type === '_base_layer_tag' &&
                        layer.visible) {
                        layer.setVisible(false);
                        layer._used2beVisible = true;
                        // break;
                    }
                }
            }
        }
    }
    /**
     * 获取当前绘制图形个数
     */
    public getPlotCount() {
        return this.getPlotComponent().getLayer().getCount();
    }
    /**
     * 保存标绘方案成功回调
     * @method
     * @param name {String} - 必填，方案名称
     * @param businessId -
     * @param name 名称
     * @param page 页码
     * @param pageSize 每页个数
     * @param flag 是否加载 false则不加载
     */
    public savePlotSchema(businessId: string, name: any, page: any, pageSize: any, flag: boolean) {
        const self = this;
        const opts: any = {};
        opts.id = window.G.utils.CommonUtil.newUUID32();
        opts.name = name;
        opts.userId = businessId;
        const querypage = page ? page : 1;
        const querypageSize = pageSize ? pageSize : 9;
        const count = self.getPlotComponent().getLayer().getCount();
        const schema = this.createSchema(opts);
        self.mapservices.save(schema).then((data: any) => {
            if (data.success) {
                window.G.utils.LoggerUtil.info('保存标绘成功!');
                if (!flag) {
                    self.planShowBack(schema.id);
                }
                // self.scanSchema(schema);
                for (let i = 0; i < count; ++i) {
                    const ele = self.getPlotComponent().getLayer().get(i);
                    if (ele && ele.tag && ele.businessId) {
                        if (ele.tag.businessId === businessId) {
                            self.removeFromUnsaved(ele.id); // 从nosave中移除
                        }
                    }
                }
                // 清空方案
                self.planCleanBack(schema.id);
                // 刷新列表
                self.firstSchemaShow = true;
                self.refreshPlotSchemaList(businessId, querypage, querypageSize, '');
                self.updateUnsavedView();
                self.fire('schemaSaveSuccess', businessId);
            } else {
                window.G.utils.LoggerUtil.info('保存失败');
            }
        }).catch((error: any) => {
            let msg = '保存失败！';
            if (error) {
                const data = error.responseJSON;
                if (data) {
                    msg = data.message;
                    if (msg && msg.indexOf('SchemaNameIsExitError') >= 0) {
                        msg = '标绘方案名称不能重复！';
                    }
                }
            }
            self.fire('schemaSaveFail', msg, businessId);
            window.G.utils.LoggerUtil.info(msg);
        });
    }

    /**
     * 调整视野状态参数更新
     * @method
     * @param schema {Object} - 必填，方案对象
     * @param flag {Object} - 选填，是否是未保存标绘（决定是否更新进nosave）
     */
    public scanSchema(schema: any, flag: boolean) {
        const self = this;
        const data: any = [];
        const plotArray: any = [];
        for (let i = 0; i < schema.getCount(); ++i) {
            const element = schema.getElement(i);
            const obj: any = {};
            obj.id = element.id;
            element.reset();
            data.push(obj);
            plotArray.push(element);
            if (flag && !element.schemaId) {
                this.noSave.data.push({
                    id: element.id,
                    content: element.name,
                    businessId: element.tag.businessId,
                });
            } else {// 不是未保存标绘，则需要从未保存标绘中删去，避免一个图形同时存在于方案和未保存中
                this.removeFromUnsaved(element.id);
            }
        }
        self.plotMap[schema.id] = data;
        // 调整视野
        if (this.mapDemension === '2d') {
            let extentEnv = false;
            if (schema.extent) {
                if (schema.extent.minx === -180 && schema.extent.miny === -90 && schema.extent.maxx === 180 && schema.extent.maxy === 90) {
                    extentEnv = true;
                } else {
                    schema.extent.spatialReference = self.getMap().getSrid();
                    this.getMap().pan(schema.extent);
                }
            } else {
                extentEnv = true;
            }
            if (extentEnv) {
                const envlop = window.G.utils.GeometryUtil.getPlotEnvlop(plotArray, self.getMap().getSrid());
                if (envlop) {
                    envlop.spatialReference = self.getMap().getSrid();
                    if (envlop.$type.indexOf('Point') >= 0) {
                        self.getMap().setCenter(envlop);
                    } else {
                        const offset = 100;
                        self.getMap().pan(envlop, [offset, offset, offset, offset]);
                    }
                }
            }
        } else if (this.mapDemension === '3d') {
            if (schema.camera) {
                self.getMap().camera.flyTo(schema.camera.position, schema.camera.heading, schema.camera.pitch, schema.camera.roll);
            } else if (schema.extent) {
                schema.extent.spatialReference = self.getMap().getSrid();
                this.getMap().camera.setView(schema.extent);
            } else {
                const envlop = window.G.utils.GeometryUtil.getPlotEnvlop(plotArray, self.getMap().getSrid());
                if (envlop) {
                    envlop.spatialReference = self.getMap().getSrid();
                    if (envlop.$type.indexOf('Point') >= 0) {
                        self.getMap().flyTo(envlop);
                    } else {
                        this.getMap().pan(envlop);
                    }
                }
            }
        }
    }
    /**
     * 获取schema 图形 Geometry
     * @param schema 方案
     */
    public getGeometryfromSchema(schema: any) {
        const element = schema.getElement(0);
        let geometry = null;
        if (element) {
            geometry = element.elements[0].geometry;
        }
        return geometry;
    }
    /**
     * 查询方案
     * @method
     * @param schemaId {String} - 必填，方案id
     */
    public planQueryBack(schemaId: any) {
        return new Promise((resolve, reject) => {
            this.mapservices.load(schemaId).then((schema: any) => {
                resolve(schema);
            }).catch((error: any) => {
                console.log(error);
                window.G.utils.LoggerUtil.info('查询失败！');
            });
          });
    }
    /**
     * 显示方案
     * @method
     * @param schemaId {String} - 必填，方案id
     */
    public planShowBack(schemaId: any) {
        this.mapservices.load(schemaId).then((schema: any) => {
            const optSchema: any = {};
            optSchema.schema = schema;
            this.getPlotComponent().loadPlotSchema(optSchema);
            this.scanSchema(schema, false);
            this.updateUnsavedView();
        }).catch((error: any) => {
            console.log(error);
            window.G.utils.LoggerUtil.info('加载失败！');
        });
    }

    /**
     * 方案列表关键字搜索的回调
     * @method
     * @param name {String} - 必填，方案名称关键字
     */
    public planSearchBack(businessId: string, name: any, page: any, limit: any) {
        const self = this;
        const userid = businessId;
        self.mapservices.list(userid, '1900-01-01 00:00:00', '2100-01-01 00:00:00', page ? page : 1, limit ? limit : 9, name).then((callbackdata: any) => {
            const summaries = callbackdata.array;
            const data: any = [];
            for (const obj of summaries) {
                const plot: any = {};
                plot.id = obj.id;
                plot.val = obj.name;
                plot.createTime = obj.createTime;
                data.push(plot);
            }
            data.sort(compare('createTime'));
            function compare(property: any) {
                return (obj1: any, obj2: any) => {
                    const value1 = obj1[property];
                    const value2 = obj2[property];
                    return value2 > value1 ? 1 : -1;
                };
            }
            const json: any = {};
            json.data = data;
            json.listTotal = callbackdata.totalCount;
            self.plotListjson = json;
            self.firePlanSearchBackEvent(businessId, json);
        }).catch((error: any) => {
            if (error.status === '404') {
                const json: any = {};
                json.data = [];
                self.plotListjson = json;
                self.firePlanSearchBackEvent(businessId, json);
            }
        });
    }

    /**
     * 地图上清除方案
     * @method
     * @param schemaId {String} - 必填，方案id
     */
    public planCleanBack(schemaId: any) {
        const self = this;
        const data = self.plotMap[schemaId];
        if (window.G.utils.CommonUtil.isArray(data)) {
            // for(let i = 0; i < data.length; i++) {
            //     const eleId = data[i].id;
            //     self.PlotComponent.removePlotElement(eleId);
            // }
            for (const obj of data) {
                const eleId = obj.id;
                self.getPlotComponent().removePlotElement(eleId);
            }
        }
        delete self.plotMap[schemaId];
    }

    /**
     * 更新方案
     * @param opts
     * @param opts.id
     * @param opts.schemaName
     */
    public updateSchema(businessId: string, opts: any) {
        const self = this;
        const options: any = {};
        options.id = opts.id;
        options.name = opts.schemaName;
        options.userid = businessId;
        const schema = new (G as any).plot.PlotSchema(options);
        const count = self.getPlotComponent().getLayer().getCount();
        for (let i = 0; i < count; ++i) {
            const ele = self.getPlotComponent().getLayer().get(i);
            const cpy = ele.copy();
            cpy.unReset();
            cpy.id = ele.id;
            if (cpy.kind === 'tailedtext') {
                const leadLabel = self.getPlotComponent().getTailedLabelbyId(ele.id);
                cpy.tailedLabelAttr = self.getPlotComponent().serializeTailedLabel(leadLabel);
                // const tailedLabel = self.PlotComponent.options.tailedLabelComponent._getTailedLabel(ele.id);
                // cpy.tailedLabelAttr = tailedLabel.serialize();
            }
            schema.addElement(cpy);
        }
        schema.extent = this.options.map.getExtent();
        self.mapservices.edit(schema).then((data: any) => {
            if (data) {
                window.G.utils.LoggerUtil.info('保存标绘成功!');
                self.planShowBack(schema.id);
                // self.scanSchema(schema);
                for (let i = 0; i < count; ++i) {
                    const ele = self.getPlotComponent().getLayer().get(i);
                    self.removeFromUnsaved(ele.id); // 从nosave列表中删除
                }
                // 清空方案（从地图上清除）
                self.planCleanBack(schema.id);
                this.firstSchemaShow = true;
                // 刷新列表
                self.refreshPlotSchemaList(businessId, 1, 9, '');

                self.updateUnsavedView();
                self.fire('schemaSaveSuccess', businessId);
            } else {
                window.G.utils.LoggerUtil.info('保存失败');
            }
        }).catch((error: any) => {
            let msg = '保存失败！';
            if (error) {
                const data = error.responseJSON;
                if (data) {
                    msg = data.message;
                    if (msg && msg.indexOf('SchemaNameIsExitError') >= 0) {
                        msg = '标绘方案名称不能重复！';
                    }
                }
            }
            window.G.utils.LoggerUtil.info(msg);
        });
    }

    /**
     * 方案列表删除方案
     * @method
     * @param schemaId {String} - 必填，方案id
     */
    public planDeleteBack(businessId: string, schemaId: any, page: any, limit: any) {
        const self = this;
        self.mapservices.delete(schemaId).then((d: any) => {
            // 清除该方案的标绘
            self.planCleanBack(schemaId);
            window.G.utils.LoggerUtil.info('删除成功!');
            this.firstSchemaShow = false;
            self.refreshPlotSchemaList(businessId, page, limit, '');

        }).catch((error: any) => {
            window.G.utils.LoggerUtil.info('删除失败!');
        });
    }

    // /**
    //  * 更新标绘方案列表
    //  * @method
    //  */
    // updataPlotSchemaList(){
    //
    // }
    /**
     * 点击方案时加载标绘列表
     * @method
     * @param id {String} - 必填，方案id
     */
    public planEleListBack(id: any) {
        const self = this;
        self.mapservices.load(id).then((schema: any) => {
            const list: any = [];
            const eles = schema.elements;
            for (let k = 0, len = eles.length; k < len; k++) {
                const ele: any = eles[k];
                list.push({
                    id: ele.id,
                    name: ele.name || 'freePlot',
                });
            }
            const json: any = {};
            json.data = list;
            json.schema = schema;
            //
            self.firePlanEleListEvent(json);

        }).catch((error: any) => {
            window.G.utils.LoggerUtil.warn(error);
        });

    }

    public queryUserPlotSchema() {
        return false;
    }

    /**
     * *****************************************************************************
     */
    /**
     * 更新标绘
     * @method
     * @param data
     */
    public plotElementUpdate(opts: any) {
        const self = this;
        const plotId = opts.id;
        if (plotId) {
            //
            // const element = this.PlotComponent.getPlotElementById(plotId);
            // this.plotUtil.update(element);
            const descStr: any = opts.symbol.inputDesc || '';
            //
            const symbol = opts.symbol;
            const type = symbol.type;
            let symbolColor: any = {};
            if (type === 'SimpleFillSymbol') {
                const option: any = {};
                symbolColor.type = type;
                option.borderThickness = symbol.linewidth;
                const borderColorTem = this._hex2ColorObj(symbol.borderColor);
                borderColorTem.a = parseInt(symbol.borderOpacity, 10);
                const fillColorTem = this._hex2ColorObj(symbol.fillColor);
                fillColorTem.a = parseInt(symbol.fillOpacity, 10);
                option.borderColor = window.G.utils.RenderUtil.color2Object(borderColorTem);
                option.fillColor = window.G.utils.RenderUtil.color2Object(fillColorTem);
                // option.opacity = 1;
                // if (symbol.lineStyle=='dashed'){
                //     option.style=0;
                // }else{
                //     option.style = parseInt(symbol.lineStyle);
                // }
                option.style = parseInt(symbol.lineStyle, 10);
                symbolColor.options = option;
            } else if (type === 'SimpleLineSymbol') {
                const option: any = {};
                symbolColor.type = type;
                option.width = symbol.linewidth;
                const lineColorTem = this._hex2ColorObj(symbol.borderColor);
                lineColorTem.a = parseInt(symbol.iconOpacity, 10);
                option.color = window.G.utils.RenderUtil.color2Object(lineColorTem);
                option.style = parseInt(symbol.lineStyle, 10);
                // if (symbol.lineStyle=='dashed'){
                //     option.style=0;
                // }else{
                //     option.style = parseInt(symbol.lineStyle);
                // }
                // option.opacity = parseInt(symbol.iconOpacity)/255;
                symbolColor.options = option;
            } else if (type === 'TextSymbol') {
                const option: any = {};
                symbolColor.type = type;
                // option.text = Util.addTextLineSeperator(symbol.inputFont.toString(), this.opt.textLineLimit);
                option.text = symbol.inputFont.toString();
                option.fontSize = parseInt(symbol.fontSizeLi, 10);
                const foregroundTem = this._hex2ColorObj(symbol.textColor);
                option.foreground = window.G.utils.RenderUtil.color2Object(foregroundTem);
                option.fontFamilyName = symbol.fontFamilyLi;
                option.textAlign = 'center';
                option.rotation = 0;
                option.offsetX = 0;
                option.offsetY = 0;
                option.borderColor = { alpha: 1, r: 255, g: 255, b: 255 };
                option.borderThickness = 0;
                symbolColor.options = option;
            } else if (type === 'TailedText') {
                const option: any = {};
                option.backgroundColor = this._hex2ColorObj(symbol.fillColor);
                option.textBackgroundBorderThickness = parseInt(symbol.borderWidth, 10);
                option.textBackgroundBorderColor = this._hex2ColorObj(symbol.borderColor);
                option.fontFamilyName = symbol.fontFamilyLi;
                option.fontSize = symbol.fontSizeLi;
                option.foregroundColor = this._hex2ColorObj(symbol.textColor);
                option.opacity = symbol.iconOpacity;
                option.label = symbol.inputFont.toString();
                option.lineWidth = parseInt(symbol.linewidth, 10);
                option.lineColor = this._hex2ColorObj(symbol.lineColor);
                option.padding = option.padding;
                // option.padding = [padding, padding, padding, padding];
                // option.padding = [10, 10, 10, 10];
                // const lineColorTem = this._hex2ColorObj(symbol.lineColor);
                // option.symbol = {
                //     type: 'SimpleLineSymbol',
                //     options: {
                //         color: {
                //             alpha: 200,
                //             r: lineColorTem.r,
                //             g: lineColorTem.g,
                //             b: lineColorTem.b,
                //         },
                //         style: '5',
                //         width: parseInt(symbol.linewidth, 10),
                //     },
                // },
                // .color = lineColorTem;//G.utils.RenderUtil.color2Object(lineColorTem);
                // option.symbol.width = parseInt(symbol.linewidth);
                symbolColor.options = option;
            } else if (type === 'VectorMarkerSymbol' || type === 'PictureMarkerSymbol') {
                // let symbolType = 'VectorMarkerSymbol';
                // if (this.mapDemension === '3d') {// TODO 三维不支持Vector 先用Picture
                //     symbolType = 'PictureMarkerSymbol';
                // }
                const options: any = {
                    type,
                    options: symbol.options,
                };
                options.options.opacity = symbol.iconOpacity / 255;
                options.options.scale = symbol.scale;
                options.options.rotation = symbol.rotation;
                symbolColor = options;
            }
            self.getPlotComponent().updatePlotElement({
                id: plotId,
                symbol: symbolColor,
                plotProperty: descStr,
            });
        } else {
            window.G.utils.LoggerUtil.warn('当前无选择的标绘！');
        }
    }

    /**
     * 切换未保存的标绘的显示
     * @method
     * @param id {String} - 必填，元素id
     * @param visible {Boolean} - 必填，是否显示
     */
    public toggleUnsavedPlot(id: any, visible: any) {
        const self = this;
        const ele = self.getPlotComponent().getPlotElementById(id);
        if (ele) {
            self.getPlotComponent().getLayer().showElement(ele, visible);
            if (ele.kind === 'tailedtext') {
                self.getPlotComponent().toggleElement(id, visible);
            } else if (ele.kind === 'overlay') {
                self.getPlotComponent()._plotOverlayTool.showElement(id, visible);
            }
            if (visible) {
                if (this.mapDemension === '2d') {
                    const center = ele.plot.centerPoint;
                    self.getMap().setCenter(center);
                }
            }
        }
    }
    /**
     * 高亮保存的标绘
     * @method
     */
    public highlightSavedView(schemaList: any) {
        this.fire('highlightUnsavedView', schemaList);
    }
    /**
     * 高亮标绘
     * @param id 标绘id
     */
    public addHighlightPlot(id: any) {
        this.getPlotComponent().addHighlight(id);
    }
    /**
     * 高亮标绘
     * @param id 标绘id
     */
    public removeHighlightPlot(id: any) {
        this.getPlotComponent().removeHighlight(id);
    }
    // 清除地图显示的结果点
    public clearResults() {
        if (this.layer) {
            this.layer.clear();
        }
        if (this.toolTipWare) {
            this.toolTipWare.clear();
        }
        this.getPlotComponent().clearHighlights();
    }

    // 移除Control
    public removeControl() {
        this.clearResults();
        if (this.layer) {
            this.options.map.removeLayer(this.layer);
        }
    }
    /**
     * 根据businessId移除标绘图形
     */
    public removeByBusinessId(businessId: any) {
        this.getPlotComponent().removeByBusinessId(businessId);
    }
    /**
     * 根据businessId 获取geometry
     * @param businessId -
     */
    public getBusinessPlotGeometry(businessId: any) {
        const list = this.getPlotComponent().getPlotElementsByBusinessId(businessId);
        let geometry = null;
        if (list.length > 0) {
            geometry =  list[0].elements[0].geometry;
        }
        return geometry;
    }
    /**
     * 绑定地图元素点击回调
     * @method
     * @param data
     * @param data.id {String} - 必填，元素id
     * @param data.symbol {Object} - 必填，样式符号
     */
    public firePlotClickEvent(data: any) {
        if (data.symbol &&
            (data.symbol.type === 'TextSymbol' || data.symbol.type === 'TailedText')) {
            data.symbol.inputFont = Util.removeTextLineSeperator(data.symbol.inputFont);
        }
        if (data.symbol.type !== 'overlay') {
            this.fire('plotElementClick', data);
        }
    }

    /**
     * 绑定地图点击空白回调
     * @method
     * @param data
     */
    public fireClearEditPanelEvent() {
        this.fire('clearEditPanel');
    }

    /**
     * 白板标绘切换回调
     * @method
     */
    public fireWhiteBoardChangeEvent() {
        this.fire('whiteBoardChange');
    }

    /**
     * 标绘方案列表回调
     * @method
     * @param data
     * @param data.data {Array} - 必填，标绘方案id和name对象数组
     */
    public fireRefreshSchemaListEvent(businessId: any, data: any) {
        const flag = this.firstSchemaShow;
        this.fire('refreshSchemaList', {businessId, data, flag});
    }

    public fireRemoveHighlightSchema() {
        this.fire('removeHighlightSchema');
    }
    /**
     * 标绘方案详细元素信息列表回调
     * @method
     * @param data
     * @param data.data {Array} - 必填，标绘方案详细元素id和name对象数组
     */
    public firePlanEleListEvent(data: any) {
        this.fire('planEleList', data);
    }

    /**
     * 标绘方案检索回调
     * @method
     * @param data
     * @param data.data {Array} - 必填，标绘方案id和name对象数组
     */
    public firePlanSearchBackEvent(businessId: any, data: any) {

        this.fire('planSearchBack', {businessId, data});
    }

    /**
     * 更新未保存的标绘
     * @method
     * @param data
     * @param data.data {Array} - 必填，标绘元素id和content名称对象数组
     */
    public fireUpdateUnsavedViewEvent(data: any) {
        this.fire('updateUnsavedView', data);
    }

    /**
     * 查询标绘常用和工具箱数据
     * @method
     * @param data
     * @param data.common {Object} - 必填，常用标绘数据
     * @param data.normal {Object} - 必填，标绘工具箱数据
     */
    public firePlotDataQueryEvent(data: any) {
        this.fire('plotDataQuery', data);
    }

    /**
     * 标绘方案列表回调
     * @method
     * @param data
     * @param data.data {Array} - 必填，标绘方案id和name对象数组
     */
    public fireUpdataPlotSchemaListEvent(data: any) {
        this.fire('updataPlotSchemaList', data);
    }
    /**
     * rgb转16进制颜色
     * @param obj {r,g,b}
     */
    private _color2Hex(obj: any) {
        // 如果转16进制后是个位数的值，需要在前面加0
        let color: string = '';
        obj.r = obj.r || 0;
        let r = obj.r.toString(16).toUpperCase();
        if (r.length === 1) {
            r = '0' + r;
        }
        color += r;
        obj.g = obj.g || 0;
        let g = obj.g.toString(16).toUpperCase();
        if (g.length === 1) {
            g = '0' + g;
        }
        color += g;
        obj.b = obj.b || 0;
        let b = obj.b.toString(16).toUpperCase();
        if (b.length === 1) {
            b = '0' + b;
        }
        color += b;
        return '#' + color;
    }
    /**
     * 16进制颜色转rgb
     * @param colorHex 16进制颜色
     */
    private _hex2ColorObj(colorHex: string) {
        // console.log(colorHex);
        const str: string = colorHex.substr(1);
        const opts: any = {
            a: 255,
            r: 0,
            g: 0,
            b: 0,
        };
        if (str.length === 3) {
            opts.r = parseInt(str[0] + str[0], 16);
            opts.g = parseInt(str[1] + str[1], 16);
            opts.b = parseInt(str[2] + str[2], 16);
        } else {
            opts.r = parseInt(str[0] + str[1], 16);
            opts.g = parseInt(str[2] + str[3], 16);
            opts.b = parseInt(str[4] + str[5], 16);
        }
        // console.log(opts);
        return new (g2 as any).sfs.Color(opts);
    }
}




