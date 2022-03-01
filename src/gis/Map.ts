
import Modules from './index';
// 地图
export default class Map2D {
    private map: any = null;
    private opts: any = null;
    private components: any = null;
    private modules: any = null;
    /**
     * @param opts
     * @param opts.targetId
     * @param opts.mapConfig
     * @param opts.serviceConfig
     * @param opts.symbolConfig
     * @param opts.eventDispatcher 事件派发器
     */
    constructor(opts: any) {
        //
        this.opts = opts || {};
    }

    /**
     * 设置参数
     * @param opts
     */
    public setOptions(opts: any) {
        if (opts) {
            for (const key of Object.keys(opts)) {
                this.opts[key] = opts[key];
            }
        }
    }


    public initMap(): void {
        const map = new G.Map(this.opts.mapConfig.map);
        map.init({
            targetId: this.opts.targetId,
        });
        this.map = map;
        this.map.setClusterScatter(false);
        // test
        (window as any).map = map;
    }

    public init() {
        this.initMap();
        this.initBaseLayers();
        this.initControls();
    }

    public initBaseLayers() {
        const baseLayers = this.opts.mapConfig.baseLayers;
        const serviceConfig = this.opts.serviceConfig;
        const clientId = serviceConfig.egis.clientId;
        const clientSecret = serviceConfig.egis.clientSecret;
        const resthttp = new g2.core.RestHttp({
            client_id: clientId,
            client_secret: clientSecret,
        });
        const conf = baseLayers[0];
        /* const originLayers = conf.layers;
        if ( Array.isArray(originLayers)) {
            originLayers.forEach((item, index) => {
                if (item.tileType === 102 && !item.restHttp) {
                    item.restHttp = resthttp;
                }
            });
        } else {
            conf.restHttp = resthttp;
        } */
        const baseLayer = G.utils.LayerUtil.createBaseLayer(conf, resthttp);
        this.getMap().addLayer(baseLayer);
        // console.log(baseLayer);
        // 初始化点线面图层组
        this.map.initialGroupLayers();
    }

    public initControls() {
        this.getMap().addScaleLineControl();
    }

    /**
     * 通用基础组件
     */
    public createComponents(params: any) {
        const PopupManager: any = G.common.PopupManager.extend({
            // 重新添加详情的方法
            addSimple(opts: any) {
                if (params.marginFn) {
                    opts.autoPanMargin = params.marginFn();
                }
                const ignoreMap: any = {
                    'common-hover-pupup': true, // 鼠标滑过提示
                    'popup_EventPoints': true, // 事件信息
                    'search_popup_EventPoints': true, // 地名地址搜索信息
                    'popup_accident': true, // 历史事件
                };
                // 统一拦截处理，弹出框设置为非地图弹出框
                // 此处会覆盖各处设置的弹框参数
                if (!ignoreMap[opts.id]) {
                    opts.anchor = null;
                }
                // 除了鼠标滑过的提示，其他的弹出框都互斥
                if (opts.id !== 'common-hover-pupup' && opts.id !== 'popup_EventPoints') {
                    // 保证同时只有一个弹框
                    (this as any).clear();
                }
                return G.common.PopupManager.prototype.addSimple.call(this, opts);
            },
        });
        const popupManager: any = new PopupManager({
            map: this.getMap(),
            // 自动调整视野的方式
            // autoPanStretegy: 0,
            autoPanTimeout: 100,
            // [left, top, right, bottom]
            autoPanMargin: new Array(4).fill(100),
            // 默认层级
            zIndex: 9,
            // 像素偏移量
            offset: [0, -30],
            // 默认的无坐标弹框的容器id
            // noneSpatialContainerId: '',
            // 默认的无坐标弹框的容器样式名
            // noneSpatialContainerClass: '',
            // 边距位置计算
            caculator: {
                // 获取计算位置的子元素
                contentEl: (el: any) => {
                    return el.children[0].children[0].children[0];
                    // return el.children[0].children[0];
                },
                // 计算css 位置
                offsetFn: (el: any) => {
                    const jEl = jQuery(el);
                    return jEl.offset();
                },
                // 计算尺寸
                sizeFn: (el: any) => {
                    const jEl = jQuery(el);
                    return [jEl.outerWidth(), jEl.outerHeight()];
                },
            },
        });
        popupManager.load();

        // 定位
        const featureLocate: any = new G.common.FeatureLocate({
            map: this.getMap(),
            // top, right, bottom and left
            padding: [150, 500, 50, 500],
            maxZoom: 16,
            duration: {
                move: 300,
                zoom: 200,
            },
            nexTickTrigger: (args: any, cb: any, ctx: any) => {
                // 视野延迟处理
                return setTimeout(() => {
                    cb.call(ctx);
                }, 0);
                // 视野即时处理
                // cb.call(ctx);
                // return null;
            },
        });
        // featureLocate._fit = (arg1: any, arg2: any) => {
        //     console.warn(arg1, arg2);
        //     return G.common.FeatureLocate.prototype._fit.call(featureLocate, arg1, arg2);
        // };
        featureLocate.load();
        // 要素高亮
        const featureHighlight: any = new G.common.FeatureHighlight({
            id: 'featureHighlight',
            name: 'featureHighlight',
            map: this.getMap(),
            blink: {
                interval: 500,
                duration: 3500,
            },
            zIndex: 25,
        });
        featureHighlight.load();
        // 图层管理器
        const layerManager: any = new G.common.LayerManager({
            map: this.getMap(),
        });
        layerManager.load();
        // 缓冲组件
        const bufferDraw: any = new G.interact.Buffer({
            map: this.getMap(),
            zIndex: 10,
            name: '缓冲区',
            close: {
                visible: true,
                style: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        width: '41',
                        height: '41',
                        rotation: '0',
                        opacity: '1',
                        offsetX: 0,
                        offsetY: 0,
                        source: this.opts.symbolConfig.icons.bufferClose,
                    },
                },
            },
        });
        bufferDraw.load();
        // 简单渲染组件
        const simpleRenderMgr: any = new G.render.SimpleRenderMgr({
            map: this.getMap(),
            layerZIndex: 12,
        });
        simpleRenderMgr.load();
        // 点数据坐标检查的构建器
        const PointGeometryBuilder = G.utils.GeometryBuilder.extend({
            check: (geometry: any) => {
                // 统一进行坐标检查 ，过滤为零的坐标
                const check = G.utils.CoordUtil.verify([geometry.x, geometry.y], 4326);
                if (check) {
                    if (parseFloat(geometry.x) === 0 || parseFloat(geometry.y) === 0) {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            },
        });
        // 共享
        const components: any = {
            popupManager,
            featureLocate,
            featureHighlight,
            layerManager,
            simpleRenderMgr,
            bufferDraw,
            PointGeometryBuilder,
            eventDispatcher: this.opts.eventDispatcher,
        };
        this.components = components;
        // test
        (window as any).GISComponents = components;
        return components;
    }

    /**
     * 业务功能组件
     * @param opts
     * @param opts.eventInfo
     * @param opts.filterInfo
     */
    public createBusinessComponents(opts: any) {
        const GISComponents = this.components;
        const symbolConfig = this.opts.symbolConfig;
        const moduleOpts = {
            map: this.getMap(),
            eventInfo: opts.eventInfo,
            filterInfo: opts.filterInfo,
            GISComponents,
            symbolConfig,
            mapConfig: this.opts.mapConfig,
            serviceConfig: this.opts.serviceConfig,
        };
        //
        const modules: any = {};
        const moduleNames: any = Modules;
        for (const moduleName of Object.keys(moduleNames)) {
            const moduleClazz: any = moduleNames[moduleName];
            modules[moduleName] = new moduleClazz(moduleOpts);
        }
        this.modules = modules;
        // test
        (window as any).modules = modules;
        return modules;
    }

    /**
     * 底图切换的监听处理
     * @param data
     */
    public onBaseMapSwitch(data: any) {
        for (const moduleName of Object.keys(this.modules)) {
            const module = this.modules[moduleName];
            module.forEach((componentId: any, component: any) => {
                console.debug(`${moduleName} > ${componentId}`);
                if (component.onBaseMapSwitch) { // 触发所有组件的处理方法
                    component.onBaseMapSwitch.call(component, data);
                }
            }, this);
        }
    }

    public getMap() {
        return this.map;
    }
}
