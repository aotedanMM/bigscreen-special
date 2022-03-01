// 资源分析公共组件
import drawUtils from './DrawUtils';
const componentBase = (G as any).base.ComponentBase;
const ResourceAnalysisCmponent = componentBase.extend({
    options: {
        symbolConfig: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.popupManager = options.popupManager;
        this.featureLocate = options.featureLocate;
        this.featureHighlight = options.featureHighlight;
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
        this.initSimpleRenderMgr();
    },
    // 销毁
    destroy() {
        this.destroySimpleRenderMgr();
        this.drawUtil.destroy();
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
    },
    // 初始化渲染工具
    initSimpleRenderMgr() {
        this.simpleRenderMgr = new (G as any).render.SimpleRenderMgr({
            map: this.map,
        });
        this.simpleRenderMgr.load();
        // 绘图工具初始化
        this.drawUtil = new drawUtils({
            map: this.map,
        });
        this.drawUtil.load();
    },
    // 加载数据
    addPointsOnMap(datalist: any) {
        this.simpleRenderMgr.removeAll();
        for (const item of datalist) {
            const data = item.data;
            const codeKey = item.codeKey;
            this._addPoint(data, codeKey);
        }
    },
    _addPoint(data: any, codeKey: any) {
        const self = this;
        const opts1: any = {
            featureType: codeKey + '_layer',
            featureName: codeKey + '_layer',
            idField: '_id',
            list: data,
            type: 1,
            geometryBuilder: null,
            symbolBuilder: null,
        };
        opts1.geometryBuilder = new (G as any).utils.GeometryBuilder({
            geometryField: ['geom'],
        });
        opts1.listeners = {
            click: (clickdata: any) => {
                const element = clickdata[0].element;
                this._showHighlight(codeKey, [element.geometry.x, element.geometry.y] );
                // this指向监听时的context变量
                const attributeSet: any = element.attributeSet;
                const data2: any = {};
                for (let i = 0 ; i < attributeSet.getCount(); i++) {
                    const attribute = attributeSet.getItem(i);
                    data2[attribute.name] = attribute.value;
                }
                this.addPopup(data2, [element.geometry.x, element.geometry.y]);
            },
        };
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build() {
                // 根据数据属性控制不同的显示效果
                const iconKey = self.options.symbolConfig.icons[codeKey + '_img'];
                const symbolObj = {
                    width: 34,
                    height: 34,
                    offsetX: '17',
                    offsetY: '17',
                    opacity: '1',
                    rotation: '0',
                    source: iconKey,
                };
                return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', symbolObj);
            },
        });
        opts1.symbolBuilder = new SymbolBuilder();
        this.simpleRenderMgr.add(opts1);
    },
    addPopup(data: any, coordinate: any) {
        this.closePopup();
        this.popupManager.addSimple({
            id: 'popup_ResourcePoints',
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: 'popup_ResourcePoints',
        }).then((content: any) => {
            this.fire('ResourcePointsPopup', {
                data,
                containerId: content.containerId,
                id: content.containerId,
            });
        });
    },
    closePopup() {
        this.popupManager.remove('popup_ResourcePoints');
    },
     /**
     * 清除弹出框
     */
    clearPopup() {
        // todo
        this.popupManager.remove('popup_ResourcePoints');
    },
    _showHighlight(codeKey: string, coordinate: any) {
        const iconKey = this.options.symbolConfig.icons[codeKey + '_img_hover'];
        const id = 'pointClink';
        const options = {
            data: {
                type: 'geojson',
                geom: {
                    type: 'Point',
                    coordinates: [ parseFloat(coordinate[0]), parseFloat(coordinate[1])],
                },
            },
            style: {
                type: 'PictureMarkerSymbol',
                options: {
                    width : 64,
                    height : 70,
                    offsetX : 32,
                    offsetY: 35,
                    opacity: '1',
                    rotation: '0',
                    source: iconKey,
                },
            },
        };
        this.featureHighlight.addHighlight(id, options);
    },
    // 清除数据
    clearResourceLayer() {
        this.simpleRenderMgr.removeAll();
        this.clearPopup();
        this.drawUtil.ClearDrawLayer();
    },
    // 销毁组件
    destroySimpleRenderMgr() {
        this.clearResourceLayer();
        this.clearPopup();
        this.simpleRenderMgr.destroy();
    },
    // 绘制点
    DrawPoint(distance: number = 50, callback: any) {
        this.drawUtil.DrawPoint(distance * 1000, (res: any) => {
            if (callback) {
                callback(res);
            }
        });
    },
    // 根据事件点生成缓冲区
    pointBuffer(distance: number = 50, element: any, callback: any) {
        this.drawUtil.pointBuffer(element, distance * 1000, (res: any) => {
            if (callback) {
                callback(res);
            }
        });
    },
    // 绘制线
    DrawPolyline(distance: number = 50, callback: any) {
        this.drawUtil.DrawPolyline(distance * 1000, (res: any) => {
            if (callback) {
                callback(res);
            }
        });
    },
    // 绘制面
    DrawPolygon(distance: number = 50, callback: any) {
        this.drawUtil.DrawPolygon(distance * 1000, (res: any) => {
            if (callback) {
                callback(res);
            }
        });
    },
    // 监听事件
    clickListener(callback: any) {
        this._eventListen = function(event: any) {
            if (callback) {
                callback(event);
            }
        };
        this.simpleRenderMgr.on('click', this._eventListen);
    },
    // 移除监听事件
    removeClickListen() {
        this.simpleRenderMgr.off('click', this._eventListen);
    },
    // 取消激活
    deactivateDrawUtil() {
        this.drawUtil.deactivateDrawUtil();
    },
    // 定位
    location(geojson: any) {
        const arr = [];
        const sim = {
            type: 'wkt',
            geom: g2.sfs.GeometryFactory.createGeometryFromGeoJson(geojson).asWkt(),
        };
        arr.push(sim);
        this.featureLocate.fit(arr);
    },

});
export default ResourceAnalysisCmponent;
