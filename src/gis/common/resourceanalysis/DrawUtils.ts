// 绘图工具
import bufferUtils from './BufferUtils';
const componentBase = (G as any).base.ComponentBase;
const drawUtils = componentBase.extend({
    options: {

    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
        this.initDrawUtils();
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
    },
    // 销毁
    destroy() {
        this.map.removeLayer(this.drawLayer);
        this.map.removeLayer(this.layer);
        this.bufferUtil.destroy();
        componentBase.prototype.destroy.call(this);
    },
    CreatLayer() {
        // 创建绘制图层，用于绘制元素
        this.drawLayer = new (g2 as any).carto.ElementLayer({
            id: 'drawLayer',
            opacity: 1,
            visible: true,
        });
        this.map.addLayer(this.drawLayer); // 将绘制图层添加到地图
        // 创建图层(类型为元素图层)用来保存绘制过程中的元素
        this.layer = new (g2 as any).carto.ElementLayer({
            id: 'layer',
            opacity: 1,
            visible: true,
        });
        this.map.addLayer(this.layer); // 将图层添加到地图
    },
    // 初始化buffer工具
    initDrawUtils() {
        this.CreatLayer();
        this.bufferUtil = new bufferUtils({
            map: this.map,
        });
        this.bufferUtil.load();
        const commandManager = new (g2 as any).gdm.CommandManager();
        // 创建命令通知实例，用来命令之间的相互通知，传入命令管理对象
        this.commandNotify = new (g2 as any).gdm.CommandNotify({
            manager: commandManager,
        });
        this._CreatPoint();
        this._CreatPolyline();
        this._CreatPolygon();
        this._creatNooptool();
        commandManager.add(this.pointDrawTool);
        commandManager.add(this.polylineDrawTool);
        commandManager.add(this.polygonDrawTool);
        commandManager.add(this.nooptool);
        commandManager.onCreate({
            map: this.map,
            commandNotify: this.commandNotify,
        });
    },
    _creatNooptool() {
        this.nooptool = new (g2 as any).interact.NoopTool({
            id: 'NoopTool',
            cursor: 'default',
        });
    },
    _CreatPoint() {
        const point = new (g2 as any).sfs.Point({
            spatialReference: (g2 as any).sfs.EnumSpatialReference.EPSG4490,
        });
        // 创建简单点符号
        const simpleMarkerSymbol = new (g2 as any).sfs.SimpleMarkerSymbol({
            fillColor: new (g2 as any).sfs.Color({r: 255, g: 0, b: 0, a: 255}),
            borderColor: new (g2 as any).sfs.Color({r: 0, g: 0, b: 0, a: 255}),
            size: 6,
            borderThickness: 1,
            style: 'circle',
        });
        // 构造一个空的点元素对象
        const pointEle = new (g2 as any).sfs.Element({
            geometry: point,
            symbol: simpleMarkerSymbol,
        });
        this.pointDrawTool = new (g2 as any).draw.DrawTool({
            id: 'pointDrawTool', // 绘制的ID
            templateElement: pointEle, // 模板
            drawLayer: this.drawLayer, // 绘制图层
        });

    },
    _CreatPolyline() {
        const gsLineSymbol = new (g2 as any).sfs.SimpleLineSymbol({color: new (g2 as any).sfs.Color({a: 255, r: 255, g: 0, b: 0})});
        const path = new (g2 as any).sfs.Path({spatialReference: (g2 as any).sfs.EnumSpatialReference.EPSG4490});
        const polyline = new (g2 as any).sfs.Polyline({spatialReference: (g2 as any).sfs.EnumSpatialReference.EPSG4490});
        polyline.addGeometry(path);
        const polylineEle = new (g2 as any).sfs.Element({geometry: polyline, symbol: gsLineSymbol});
        this.polylineDrawTool = new (g2 as any).draw.DrawTool({
            id: 'polylineDrawTool', // 绘制的ID
            templateElement: polylineEle, // 模板
            drawLayer: this.drawLayer, // 绘制图层
        });

    },
    _CreatPolygon() {
        // 创建简单面符号
        const simpleFillSymbol = new (g2 as any).sfs.SimpleFillSymbol({
            fillColor: new (g2 as any).sfs.Color({a: 200, r: 255, g: 0, b: 0}),
        });
        // 创建一个空的面元素对象
        const ring = new (g2 as any).sfs.Ring({spatialReference: (g2 as any).sfs.EnumSpatialReference.EPSG4490});
        const polygon = new (g2 as any).sfs.Polygon({spatialReference: (g2 as any).sfs.EnumSpatialReference.EPSG4490});
        polygon.addGeometry(ring);
        const polygonEle = new (g2 as any).sfs.Element({
            geometry: polygon,
            symbol: simpleFillSymbol,
        });
        this.polygonDrawTool = new (g2 as any).draw.DrawTool({
            id: 'polygonDrawTool', // 绘制的ID
            templateElement: polygonEle, // 模板
            drawLayer: this.drawLayer, // 绘制图层
        });

    },
    // 绘制点
    DrawPoint(distance: number, callback: any) {
        this.commandNotify.activeCommand('pointDrawTool');  // 激活点绘制命令
        const self = this;
        this.pointDrawTool.onEndDraw = function(element: any) {
            // self.layer.add(element);
            const geo = element.geometry.asWkt('5');
            self.bufferUtil.drawBufferPoint(geo, distance, (res: any) => {
                if (callback) {
                    callback(res);
                }
            });
        };

    },
    // 根据事件点生成缓冲区
    pointBuffer(distance: number, element: any, callback: any) {
        const geo = element.geometry.asWkt('5');
        this.bufferUtil.drawBufferPoint(geo, distance, (res: any) => {
            if (callback) {
                callback(res);
            }
        });
    },
    // 绘制线
    DrawPolyline(distance: number, callback: any) {
        this.commandNotify.activeCommand('polylineDrawTool');  // 激活点绘制命令
        const self = this;
        this.polylineDrawTool.onEndDraw = function(element: any) {
            // self.layer.add(element);
            const geo = element.geometry.asWkt('5');
            self.bufferUtil.drawbufferPolyline(geo, distance, (res: any) => {
                if (callback) {
                    callback(res);
                }
            });
        };

    },
    // 绘制面
    DrawPolygon(distance: number, callback: any) {
        this.commandNotify.activeCommand('polygonDrawTool');  // 激活点绘制命令
        const self = this;
        this.polygonDrawTool.onEndDraw = function(element: any) {
            // self.layer.add(element);
            const geo = element.geometry.asWkt('5');
            self.bufferUtil.drawbufferPolygon(geo, distance, (res: any) => {
                if (callback) {
                    callback(res);
                }
            });
        };
    },
    ClearDrawLayer() {
        this.drawLayer.clear();
        this.layer.clear();
        this.commandNotify.activeCommand('NoopTool'); // 激活无操作状态命令
        this.bufferUtil.clearBuffer();
    },
    deactivateDrawUtil() {
        this.commandNotify.activeCommand('NoopTool'); // 激活无操作状态命令
    },
});
export default drawUtils;
