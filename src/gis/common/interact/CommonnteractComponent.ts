// 所有资源类的统一交互处理
import HoverConfig from './HoverConfig';
import LegendConfig from './LegendConfig';
import Util from '../../Util';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        simpleRenderMgr: null,
        eventDispatcher: null,
        // 鼠标滑过的弹出框Id
        hoverPopupId: 'common-hover-pupup',
        //
        hoverHighlightId: 'common-highlight',
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        // 保存所有弹出数据的信息，key为数据id
        this.popupDataIdSet = {};
    },
    //  销毁
    destroy() {
        //
        componentBase.prototype.destroy.call(this);
    },
    load() {
        componentBase.prototype.load.call(this);
    },

    addListeners() {
        this.options.simpleRenderMgr.on('mouseover', this._onMouseOver, this);
        this.options.simpleRenderMgr.on('mouseout', this._onMouseOut, this);
        this.options.simpleRenderMgr.on('click', this._onMouseClick, this);
        this.options.simpleRenderMgr.on('noclick', this._onMouseNoClick, this);
        this.options.simpleRenderMgr.on('feature-change', this._onFeatureChange, this);
        //
        this.options.popupManager.on('add', this._onAddPopup, this);
        this.options.popupManager.on('remove', this._onRemovePopup, this);
        this.options.popupManager.on('clear', this._onClearPopup, this);
    },

    removeListeners() {
        this.options.simpleRenderMgr.off('mouseover', this._onMouseOver, this);
        this.options.simpleRenderMgr.off('mouseout', this._onMouseOut, this);
        this.options.simpleRenderMgr.off('click', this._onMouseClick, this);
        this.options.simpleRenderMgr.off('noclick', this._onMouseNoClick, this);
        this.options.simpleRenderMgr.off('feature-change', this._onFeatureChange, this);
        //
        this.options.popupManager.off('add', this._onAddPopup, this);
        this.options.popupManager.off('remove', this._onRemovePopup, this);
        this.options.popupManager.off('clear', this._onClearPopup, this);
    },

    unload() {
        //
        componentBase.prototype.unload.call(this);
    },

    /**
     * 显示提示
     * @param featureType 类型
     * @param featureId 数据id
     */
    addHover(featureType: any, featureId: string) {
        const layer: any = this.options.simpleRenderMgr.getLayer(featureType);
        if (layer) {
            const element: any = this._getElementFromLayer(layer, featureId);
            if (element) {
                this._clearHoverTip();
                this._addHoverTip(featureType, element);
            }
        }
    },

    /**
     * 清除提示
     */
    clearHover() {
        this._clearHoverTip();
        this._clearHighLight();
    },

    /**
     * 获取图例数据
     */
    getLegends() {
        return this._getLegendData();
    },

    /**
     * 调整详情框视野
     * @param opts
     * @param opts.id {String} id 弹出框ID
     */
    panPopup(opts: any) {
        this.options.popupManager.updatePosition(opts.id);
    },

    _onMouseOver(event: any) {
        // 点击清除提示效果
        this._clearHoverTipAndHighlight();
        const data = event.list[0];
        this._addHoverTip(data.featureType, data.element, event.event);
    },

    _onMouseOut(event: any) {
        // 点击清除提示效果
        this._clearHoverTipAndHighlight();
    },

    _onMouseNoClick() {
        // 点击清除提示效果
        this._clearHoverTipAndHighlight();
    },
    _onMouseClick(event: any) {
        //
    },

    _clearHoverTipAndHighlight() {
        this._clearHoverTip();
        this._clearHighLight();
    },

    _addHoverTip(featureType: any, element: any, event: any) {
        if (!this._shouldShowHoverTip(featureType, element)) {
            return;
        }
        if ($('.TeamPanelForestFireProtection_wrap').length > 0) {
            this.options.popupManager.remove('hover-pupupNew');
        }
        // 获取名称字段，显示名称的提示
        const featureConfig = this._getFeatureConfig(featureType);
        if (featureConfig != null) {
            const name: any = featureConfig.nameFn(featureType, Util.attributeSet2Object(element.attributeSet));
            if (name) {
                // 特殊处理森防
                if (featureType.indexOf('communicationEquiphcLayer') !== -1 ||
                    featureType.indexOf('__true') !== -1) {
                    const point: any = element.geometry;
                    if ($('.TeamPanelForestFireProtection_wrap').length > 0) {
                        this.options.popupManager.remove('hover-pupupNew');
                    }
                    this.options.popupManager.addSimple({
                        id: 'hover-pupupNew',
                        anchor: [point.x, point.y],
                        className: '',
                        zIndex: 20,
                        autoPan: false,
                    }).then((content: any) => {
                        const attrObj = Util.attributeSet2Object(element.attributeSet);
                        // 处理坐标，属性名统一为x y，提供周边查询、路径规划使用
                        // attrObj.x = attrObj.geom.coordinates[0];
                        // attrObj.y = attrObj.geom.coordinates[1];
                        this.fire('popup', {
                            featureType,
                            type: 'birdge',
                            data: attrObj,
                            content,
                        });
                    });
                } else {
                    if (featureConfig.marginbottom) {
                        if (featureType.indexOf('T180') >= 0 || featureType === 'influence') {// 特殊处理油气管线
                            let point;
                            if (event) { // 兼容从列表hover的
                                point = new g2.sfs.Point({
                                    x: event.mapX,
                                    y: event.mapY,
                                    spatialReference: 4326,
                                });
                            } else {
                                if (element.geometry.geometries) {
                                    point = element.geometry.geometries[0];
                                } else {
                                    point = element.geometry;
                                }
                            }
                            this._doAddHoverTip(point, name, featureConfig.marginbottom, featureType);
                        } else {
                            this._doAddHoverTip(element.geometry, name, featureConfig.marginbottom);
                        }
                    } else {
                        this._doAddHoverTip(element.geometry, name);
                    }
                }
                if (featureConfig.highlight.show === true) {
                    const data: any = Util.attributeSet2Object(element.attributeSet);
                    let symbol: any = null;
                    if (Object.prototype.toString.call(featureConfig.highlight.symbol) === '[object Object]') {
                        symbol = featureConfig.highlight.symbol;
                    } else {
                        symbol = featureConfig.highlight.symbol(featureType, data);
                    }
                    const symbolOptions = symbol.options;
                    // TODO
                    // 处理非图标符号的情况
                    if (featureConfig.highlight.iconFn) {
                        const iconKey: any = featureConfig.highlight.iconFn(featureType, data);
                        symbolOptions.source = this.options.symbolConfig.icons[`${iconKey}`];
                        if (symbolOptions.source) {
                            this._showHighlight(element.geometry, {
                                symbol,
                                blink: featureConfig.highlight.blink,
                            });
                        }
                    } else { // 处理非图标符号的情况
                        this._showlineHighlight(element.geometry.asWkt(), {
                            symbol,
                            blink: featureConfig.highlight.blink,
                        });
                    }
                }
                this._fitIfNeeded(element);
            }
        }
    },
    _shouldShowHoverTip(featureType: any, element: any) {
        let flag: any = true;
        if (Object.keys(this.popupDataIdSet).length > 0) { // 如果滑过的数据与弹出框锚点位置一样，则忽略
            if (element.geometry instanceof g2.sfs.Point) {
                for (const popupId of Object.keys(this.popupDataIdSet)) {
                    const anchor: any = this.popupDataIdSet[popupId].anchor;
                    if (anchor && anchor[0] === parseFloat(element.geometry.x) && anchor[1] === parseFloat(element.geometry.y)) {
                        flag = false;
                        break;
                    }
                }
            }
        }
        return flag;
    },
    // 获取要素配置
    _getFeatureConfig(featureType: any) {
        let featureConfig = HoverConfig[featureType];
        if (featureConfig != null) {
            return featureConfig;
        }
        for (const key of Object.keys(HoverConfig)) {
            if (key && featureType.indexOf(key) === 0) {
                featureConfig = HoverConfig[key];
                break;
            }
        }
        return featureConfig || null;
    },
    // 从图层中获取元素
    _getElementFromLayer(layer: any, featureId: any) {
        const visitLayer: any = (l: any, id: any) => {
            let ele: any = null;
            if (l instanceof g2.carto.GroupLayer) {
                for (const l1 of l.groupLayers) {
                    ele = visitLayer(l1, id);
                    if (ele) {
                        break;
                    }
                }
            } else if (l instanceof g2.carto.ElementLayer || l instanceof g2.carto.ClusterLayer) {
                ele = l.find(id);
            } else if (l instanceof g2.carto.FeatureLayer) {
                const findResult: any = l.find(id);
                if (findResult) {
                    ele = findResult.Feature;
                }
            }
            return ele;
        };
        const element: any = visitLayer(layer, featureId);
        return element || null;
    },
    // 添加提示文本
    _doAddHoverTip(geometry: any, name: string, marginbottom: string) {
        const point: any = geometry.getBaryCenter();
        this.options.popupManager.addSimple({
            id: this.options.hoverPopupId,
            anchor: [point.x, point.y],
            className: '',
            zIndex: 20,
            autoPan: false,
        }).then((content: any) => {
            const dom: any = document.getElementById(content.containerId);
            if (marginbottom) {
                dom.innerHTML = `<div class="hover-title"><div style="transform: translateY(-${marginbottom}%);"><span class="hover-title_txt"><i>${name}</i></span></div></div>`;
            } else {
                dom.innerHTML = `<div class="hover-title"><div><span class="hover-title_txt"><i>${name}</i></span></div></div>`;
            }
        });
    },
    _clearHoverTip() {
        this.options.popupManager.remove(this.options.hoverPopupId);
    },

    _showHighlight(geometry: any, opts: any) {
        const options: any = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + geometry.x + ' ' + geometry.y + ')',
            },
            style: opts.symbol,
        };
        if (opts.blink) {
            options.blink = opts.blink;
        }
        this.options.featureHighlight.addHighlight(this.options.hoverHighlightId, options);
    },
    _showlineHighlight(geometry: any, opts: any) {
        const options: any = {
            data: {
                type: 'wkt',
                geom: geometry,
            },
            style: opts.symbol,
        };
        if (opts.blink) {
            options.blink = opts.blink;
        }
        this.options.featureHighlight.addHighlight(this.options.hoverHighlightId, options);
    },
    _clearHighLight() {
        this.options.featureHighlight.removeHighlight(this.options.hoverHighlightId);
    },
    // 视野调整
    _fitIfNeeded(element: any) {
        // todo
    },

    /**
     * 资源展示变化
     * @param event
     */
    _onFeatureChange(event: any) {
        this._getLegendData().then((data: any) => {
            this.fire('legend-change', data);
        });
        // 点击清除提示效果
        this._clearHoverTipAndHighlight();
    },

    _getLegendData() {
        return new Promise((resolve, reject) => {
            const simpleRenderMgr: any = this.options.simpleRenderMgr;
            const featureNames: any = simpleRenderMgr.getFeatureTypeNames();
            let list: any = [];
            for (const featureType of featureNames) {
                if (!simpleRenderMgr.getVisible(featureType)) { // 可见
                    continue;
                }
                if (LegendConfig[featureType]) { // 图例配置
                    const symbolConfig: any = LegendConfig[featureType].symbol;
                    if (symbolConfig.key) { // 按数据来匹配显示的图例
                        const tempMap: any = {};
                        for (const item of symbolConfig.list) {
                            tempMap[item.value] = true;
                        }
                        const keyMap: any = {};
                        // 遍历数据
                        const visitFn = (ele: any, l: any) => {
                            const attrs: any = Util.attributeSet2Object(ele.attributeSet);
                            if (tempMap[attrs[symbolConfig.key]]) {
                                keyMap[attrs[symbolConfig.key]] = true;
                            }
                        };
                        this.options.simpleRenderMgr.visitFeature(featureType, {
                            visit: visitFn,
                        });
                        // 按照配置的顺序处理图例
                        for (const item of symbolConfig.list) {
                            if (keyMap[item.value]) {
                                list.push({
                                    src: item.src,
                                    title: item.title,
                                    width: item.width,
                                    height: item.height,
                                });
                            }
                        }
                    } else {
                        list = list.concat(symbolConfig.list);
                    }
                }
            }
            resolve({
                list: [],
            });
        });
    },
    //
    _onAddPopup(opts: any) {
        if (!opts) {
            return;
        }

        if (opts.id === this.options.hoverPopupId || opts.id === 'popup_EventPoints') {
            return;
        }
        // 2022/2/8刘云梦-解决打开详情弹窗，关闭原有面板的的问题
        // this.options.eventDispatcher.dispatch('leftMapPanelMutex', false);
        // 清除提示效果
        this._clearHoverTipAndHighlight();
        //
        this.popupDataIdSet[opts.id] = opts;
    },
    _onRemovePopup(opts: any) {
        if (!opts) {
            return;
        }
        delete this.popupDataIdSet[opts.id];
    },
    _onClearPopup() {
        this.popupDataIdSet = {};
    },
    clearHighlightAndPopup() {
        this.options.popupManager.clear();
        this.options.featureHighlight.clearHighlight();
    },
});
export default component;
