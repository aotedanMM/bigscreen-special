
// 通用工具:测距、测面、鼠标位置、添加百度街景图层、实时交通图层
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        bdPanoCtrl: null,
        panoCoverageLayer: null,
        trfficLayer: null,
        simpleRenderMgr: null,
        popupManager: null,
        featureHighlight: null,
        config: null,
        baseMapColor: 'dark',
    },

    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        //
        this._initMeasure(this.map); // 测量工具
        this._initMousePosition(this.map); // 获取鼠标位置
        //
        this.currentLevel = this.getCurrentLevel();
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
        this.removeBaiDuLayer();
        this.removeTrfficLayer();
        this.removeBaiDuControl();
    },

    load() {
        componentBase.prototype.load.call(this);
        //
        this.mousePosition.load();
    },

    addListeners() {
        //
        this.map.listen('resolutionchanged', this._onResolutionChanged, this);
        this.map.listen('dblclick', this.onBaseMapSwitch, this);
        this.map.listen('click', this.onBaseMapSwitch, this);
    },

    removeListeners() {
        this.map.listen('resolutionchanged', this._onResolutionChanged, this);
        this.map.listen('dblclick', this.onBaseMapSwitch, this);
        this.map.listen('click', this.onBaseMapSwitch, this);
    },

    unload() {
        //
        this.mousePosition.unload();
        this.removeBaiDuLayer(); // 移除百度全景图层
        this.removeTrfficLayer(); // 移除实时交通图层
        this.removeBaiDuControl(); // 移除百度全景按钮
        componentBase.prototype.unload.call(this);
    },

    // 修改地图的宽高
    resize(width: any = 0, height: any = 0) {
        width = width || $('#map').width();
        height = height || $('#map').height();
        console.debug('update map width >', width);
        this.map.setViewSize(width, height);
    },

    // 获取当前级别
    getCurrentLevel() {
        return Math.round(this.map.getZoomLevel());
    },

    // 添加百度全景图层与按钮到地图
    addbdLayerCtol() {
        this._initPanoCoverageLayer(); // 初始化
        this._initbdPanoCtrl(this.map); // 初始化控件
        this.map.addLayer(this.options.panoCoverageLayer); // 添加图层
        this.map.addPanoramaControl(this.options.bdPanoCtrl); // 添加控件
    },

    // 初始化百度全景覆盖图层
    _initPanoCoverageLayer() {
        this.options.panoCoverageLayer = new g2.carto.BDPanoCoverageLayer({
            name: '百度全景覆盖图层',
            id: 'panoCoverageLayer',
            visible: true,
            opacity: 1,
            zIndex: 10,     // 图层置于底图上方
            projection: 'baidu',
        });
    },
    // 初始化百度全景按钮
    _initbdPanoCtrl(map: any) {
        this.options.bdPanoCtrl = new g2.control.BaiduPanoramaControl({
            map: this.map,
            heading: 40,
            pitch: 6,
            offset: [-8, -44],
        });
    },
    // 添加腾讯全景图层与按钮到地图
    addtencentLayerCtol() {
        this._inittencentPanoCoverageLayer(); // 初始化
        this._inittencentPanoCtrl(this.map); // 初始化控件
        this.map.addLayer(this.options.tencentpanoCoverageLayer); // 添加图层
        this.map.addPanoramaControl(this.options.tencentPanoCtrl); // 添加控件
    },
    // 初始化腾讯全景覆盖图层
    _inittencentPanoCoverageLayer() {
        this.options.tencentpanoCoverageLayer = new g2.carto.TencentLayer({
            name: '腾讯街景',
            type: 3,
            crossOrigin: null, // 不跨域处理，服务端已做跨域处理。
            url: 'https://sv0.map.qq.com/hlrender',
        });
    },

    // 初始化腾讯全景按钮
    _inittencentPanoCtrl(map: any) {
        this.options.tencentPanoCtrl = new g2.control.TencentPanoramaControl({
            map: this.map,
            heading: 40,
            pitch: 6,
            offset: [-8, -44],
        });
    },

    // 初始化实时交通图层
    _initTrafficlayer(config: any) {
        const url = config.shishilukuang;
        this.options.trfficLayer = new g2.carto.TrafficLayer({
            id: 'baidulukuang',
            name: '实时路况',
            url: '' + url,
            projection: 'baidu',
            clientId: config.egis.clientId,
            clientSecret: config.egis.clientSecret,
        });
    },
    // 移除百度街景覆盖范围图层与按钮
    removebduLayerCtro() {
        // 移除百度图层
        const panoCoverageLayerRe = this.map.findLayer('panoCoverageLayer');
        if (!!panoCoverageLayerRe) {
            this.map.removeLayer(panoCoverageLayerRe);
        }
        if (!!this.options.bdPanoCtrl) {
            this.map.removePanoramaControl(this.options.bdPanoCtrl);
        }
    },
    // 移除腾讯街景覆盖范围图层与按钮
    removetencentLayerCtro() {
        // 移除腾讯图层
        if (!!this.options.tencentpanoCoverageLayer) {
            this.map.removeLayer(this.options.tencentpanoCoverageLayer);
        }
        if (!!this.options.tencentPanoCtrl) {
            this.map.removePanoramaControl(this.options.tencentPanoCtrl);
        }
    },
    // 移除实时交通图层
    removeTrfficLayer() {
        const trafficlayerRemove = this.map.findLayer('baidulukuang');
        if (!!trafficlayerRemove) {
            this.map.removeLayer(trafficlayerRemove);
        }
    },

    // 添加实时交通图层
    addTafficLayer() {
        this._initTrafficlayer(this.options.config);
        this._checkLoaded();
        this.map.addLayer(this.options.trfficLayer);
    },

    // 控制图层显隐
    setTrafficLayerVisible(visible: boolean) {
        if (!!this.options.layer) {
            this.options.trfficLayer.setVisible(visible);
        }
    },

    // 设置图层透明度
    setTrafficLayerCapacity(capacity: number) {
        if (!!this.options.layer) {
            this.options.trfficLayer.setCapacity(capacity);
        }
    },

    getMousePositionComponent() {
        // 获得鼠标位置
        return this.mousePosition;
    },

    measureLength() {
        this.measureComponent.cancel();
        // 距离测量
        this.measureComponent.measureLength();
    },

    measureArea() {
        this.measureComponent.cancel();
        // 面积面积
        this.measureComponent.measureArea();
    },

    cancelMeasure() {
        // 取消测量
        this.measureComponent.cancel();
    },

    clearMeasure() {
        this.measureComponent.clear();
    },

    clearAll() {
        // 清屏
        this.map.clear({
            filterFn: (layer: any) => {
                return false;
            },
        });
        this.popupManager = null;
        this.options.eventDispatcher.dispatch('clear_map', {});
        // 取消测量
        this.cancelMeasure();
        this.clearMeasure();
    },

    /**
     * 截屏
     * @param domId {String} domid，默认为地图容器
     */
    screenShot(domId: any) {
        const screenShot = new G.common.ScreenShot({
            map: this.map,
        });
        screenShot.downloadImage(domId || null, '截屏');
    },

    // 全图
    fullExtent() {
        this.map.fullExtent();
    },
    // 全屏
    fullScreen(domId: any) {
        const fullScreenComponent = this._getFullScreenComponent(domId);
        fullScreenComponent.fullScreen();
    },

    /**
     * 获取屏幕截图
     * @param domId {String} domid，默认为地图容器
     */
    getScreenShot(domId: any) {
        const screenShot = new G.common.ScreenShot({
            map: this.map,
        });
        return screenShot.getImage(domId);
    },


    _initMeasure(map: any) {
        const lengthTipFn: any = (type: any, length: any) => {
            if (!isNaN(length)) {
                length = (length / 1000).toFixed(2);
            }
            const createHtmlFn: any = {
                // 起点
                start() {
                    return '起点';
                },
                // 中间点
                node(length1: any) {
                    return '<span style="color:orange">' + length1 + '</span>公里';
                },
                // 终点
                end(length1: any) {
                    return '总长:<span style="color:orange">' + length1 + '</span>公里';
                },
            };
            const fn = createHtmlFn[type];
            if (Object.prototype.toString.call(fn) === '[object Function]') {
                return createHtmlFn[(type)](length);
            }
        };
        // 测面积的显示内容，需返回要显示的html字符串
        const areaTipFn: any = (length: any, area: any) => {
            length = (length / 1000).toFixed(2);
            area = (area / 1000000).toFixed(2);
            return '周长:<span style="color:orange">'
            + length + '</span>公里 <br/>面积:<span style="color:orange">'
            + area + '</span>平方公里';
        };

        // 预先创建测量图层-可选
        const measureLayerId: string = 'measure-layer';
        // 测量组件
        this.measureComponent = new G.common.Measure({
            layerId: measureLayerId,
            map,
            styleName: ['emap-measure-node-tooltip', 'emap-measure-tooltip'],
            lengthTipFn,
            areaTipFn,
        });
        const measureLayer = map.getLayerById(measureLayerId);
        const drawLayer = map.getLayerById(measureLayerId + '-draw');
        measureLayer.setZIndex(101);
        drawLayer.setZIndex(101);
    },
    /**
     * 底图切换处理
     * @param data
     * @param data.layerId
     * @param data.style {String} dark 深色 light 浅色
     */
    onBaseMapSwitch(data: any) {
        // const baseMapColorTem = data.style ? data.style : this.options.baseMapColor;
        // 这里写更新测量样式的逻辑
        // if (baseMapColorTem === 'dark') {
        //     this.options.baseMapColor = 'dark';
        // } else {
        //     this.options.baseMapColor = 'light';
        // }

        // const arrEle = this.measureComponent._toolTipWare.elements;
        // for (const item of arrEle) {
        //     if (baseMapColorTem === 'dark') {
        //         item.firstElementChild.className = 'popup-content popup-content-dark';
        //     } else {
        //         item.firstElementChild.className = 'popup-content popup-content-light';
        //     }
        // }
    },
    _initMousePosition(map: any) {
        const mousePosition = new G.common.MousePosition({
            map,
            eventName: 'mousePosition',
            format: '{x}|{y}',
            precision: 6,
            formatType: '1', // 展示类型，1：带方向，如：E 117, N 43
            lnglatFormat: 'DD', // 坐标格式，DD：经纬度小数，DMS：度分秒
        });
        this.mousePosition = mousePosition;
    },
    // 分辨率变化
    _onResolutionChanged(event: any) {
        const level: number = Math.round(event.level);
        if (!(this.currentLevel === level)) {
            this.currentLevel = level;
            this.fire('levelChanged', {
                level,
            });
        }
    },
});

export default component;
