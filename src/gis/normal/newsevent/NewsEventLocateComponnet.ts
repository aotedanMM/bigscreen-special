// 模块的GIS逻辑
import { SymbolMap } from '../../SymbolConfig';
import Util from '../../Util';
import EventTypeMap from '../../event/EventTypeMap';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        highLightId: 'newsEventLocateHL', // 高亮id
        popupId: 'popup_EventPoints', // 弹窗唯一标识
        fireAddPopupEventId: 'EventPointspopup', // 添加弹窗后执行事件id
        featureType: 'eventpoint', // 图层标识
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
        this.popupManager = options.GISComponents.popupManager;
        this.PointGeometryBuilder = options.GISComponents.PointGeometryBuilder;
        this.autoPanFlag = true;
        // 图层是否显示
        this.layerVisible = true;
    },
    //  销毁
    destroy() {
        this.simpleRenderMgr = null;
        this.featureLocate = null;
        this.featureHighlight = null;
        componentBase.prototype.destroy.call(this);
    },

    unload() {
        this.clear();
    },

    setVisible(visible: any) {
        this.layerVisible = !!visible;
        if (this.simpleRenderMgr && this.simpleRenderMgr.getLayer(this.options.featureType)) {
            this.simpleRenderMgr.setVisible(this.options.featureType, this.layerVisible);
        }
        this.closePopup();
        this.hideHighlight();
    },

    addPopup(data: any, coordinate: any, mapClick: boolean) {
        this.closePopup();
        this.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: 'EventPoints-tooltip',
            autoPan: mapClick,
            autoPanTimeout: 200,
        }).then((content: any) => {
            if ($('#popup_EventPoints').length === 0) {
                this.addPopup(data, coordinate , mapClick);
                return;
            }
            data.x = parseFloat(data.longitude);
            data.y = parseFloat(data.latitude);
            this.fire(this.options.fireAddPopupEventId, {
                data,
                containerId: content.containerId,
            });
        });
    },

    closePopup() {
        this.popupManager.remove(this.options.popupId);
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    clear() {
        this.simpleRenderMgr.remove(this.options.featureType);
        this.closePopup();
        this.hideHighlight();
    },

    /**
     * 显示事件
     * @param eventList
     */
    showEvents(eventList: any) {
        this.simpleRenderMgr.remove(this.options.featureType);
        console.debug('>>>>>>>>地图加载事件信息');
        console.debug(eventList);
        // 处理typeCode
        for (const item of eventList) {
            item.typeCode = EventTypeMap[item.eventType] ? EventTypeMap[item.eventType] : item.eventType;
            item.longitude = item.longitude * 1;
            item.latitude = item.latitude * 1;
        }
        const opt11: any = {};
        opt11.featureType = this.options.featureType; // 指定数据类型
        opt11.featureName = '事件点'; // 数据类型说明
        opt11.idField = 'id'; // 数据唯一标识的属性
        opt11.list = eventList; // 数据列表
        opt11.type = 1; // 使用feature渲染
        opt11.geometryBuilder = new this.PointGeometryBuilder({
            geometryField: ['longitude', 'latitude'],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const symbolObj: any = Util.toJSON(SymbolMap.EVENT.symbol);
                symbolObj.options.source = this.options.symbolConfig.icons[SymbolMap.EVENT.iconFn(null, {
                    typeCode: data.typeCode,
                })];
                return G.utils.RenderUtil.object2Symbol(symbolObj);
            },
        });
        opt11.symbolBuilder = new SymbolBuilder();
        opt11.listeners = {
            click: (clickdata: any) => {
                const element = clickdata[0].element;
                let eventType = null;
                for (let i = 0; i < element.attributeSet.getCount(); i++) {
                    const attribute = element.attributeSet.getItem(i);
                    if (attribute.name === 'eventType') {
                        eventType = attribute.value;
                        break;
                    }
                }
                // const geom = {
                //     type: 'Point',
                //     coordinates: [parseFloat(element.geometry.x), parseFloat(element.geometry.y)],
                // };
                // self.featureLocate.fit({
                //     type: 'geojson',
                //     geom,
                // }, {
                //     maxZoom: this.map.getZoomLevel(),
                // });
                this._showHighlight(eventType, [element.geometry.x, element.geometry.y]); // 高亮显示
                // this指向监听时的context变量
                const attributeSet: any = element.attributeSet;
                const data: any = {};
                for (let i = 0; i < attributeSet.getCount(); i++) {
                    const attribute = attributeSet.getItem(i);
                    data[attribute.name] = attribute.value;
                }
                this.autoPanFlag = false;
                this.addPopup(data, [element.geometry.x, element.geometry.y], true);
            },
        };
        this.simpleRenderMgr.add(opt11);
        // 更新显示状态
        this.setVisible(this.layerVisible);
    },

    /**
     * @param opts
     * @param opts.eventType
     * @param opts.longitude
     * @param opts.latitude
     */
    locateEvent(opts: any) {
        // (console as any).debug('事件定位 >>>', JSON.stringify(opts));
        const geom = {
            type: 'Point',
            coordinates: [parseFloat(opts.longitude), parseFloat(opts.latitude)],
        };
        const geometry = new g2.sfs.Point({
            x: geom.coordinates[0],
            y: geom.coordinates[1],
        });
        const geometryBuilder = new this.PointGeometryBuilder();
        if (geometryBuilder.check(geometry)) {
            this.featureLocate.fit({
                type: 'geojson',
                geom,
            }, {
                maxZoom: Math.ceil(this.map.getZoomLevel()),
                duration: { move: 500 },
            }); // 实现定位
            const eventType: string = opts.eventType;
            const coordinate: any = [opts.longitude, opts.latitude];
            setTimeout(() => {
                this._showHighlight(eventType, coordinate); // 显示动画
              }, 1000);
            this.addPopup(opts, [geom.coordinates[0], geom.coordinates[1]], false); // 添加弹出框
        } else {
            (console as any).warn('事件信息坐标无效！');
        }
    },

    _showHighlight(eventType: string, coordinate: any) {
        const symbolObj: any = Util.toJSON(SymbolMap.EVENT.hlSymbol);
        const typecode = EventTypeMap[eventType] ? EventTypeMap[eventType] : eventType;
        symbolObj.options.source = this.options.symbolConfig.icons[SymbolMap.EVENT.iconHlFn(null, {
            typeCode: typecode,
        })];
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + parseFloat(coordinate[0]) + ' ' + parseFloat(coordinate[1]) + ')',
            },
            style: symbolObj,
            blink: {
                enable: false,
            },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
    },
});

export default component;
