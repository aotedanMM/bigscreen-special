// 灾损统计行政区划
import Util from '../../Util';
import publishObjectPath from '@/util/configRegistry';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    options: {
        map: null,
        service: null,
        currentHlId: null, // 最
        simpleRenderMgr: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        symbolConfig: null,
        featureType: 'defensive_district',
        featureName: '烟台市行政区划图层',
        popupId: 'defensive_district_popup_id', // 弹窗唯一标识
        highLightId: 'defensive_district_hl', // 高亮id
        popupEventId: 'defensive_district_popup', // 添加弹窗后执行事件id
        status: 'add', // add|remove，此时是添加数据状态还是移除数据状态。
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.toolTipWare = new g2.widget.TooltipWare({
            map: this.map,
        });
        this.service = options.service;
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
        this.eventInfo = options.eventInfo;
        this.districtsList = [];
    },
      //  销毁
    destroy() {
        this.unload();
        this.simpleRenderMgr = null;
        this.symbolConfig = null;
        this.featureLocate = null;
        this.featureHighlight.clearHighlight();
        this.featureHighlight = null;
        componentBase.prototype.destroy.call(this);
    },

    /**
     * 加载
     */
    load() {
        componentBase.prototype.load.call(this);
        this.simpleRenderMgr.off('click', this._onMouseClick, this);
        this.simpleRenderMgr.on('click', this._onMouseClick, this);
        this.addDistrict();
    },

    /**
     * 卸载
     */
    unload() {
        componentBase.prototype.unload.call(this);
        this.simpleRenderMgr.off('click', this._onMouseClick, this);
        this.removeDistrict();
    },
    // 添加烟台市行政区划
    addDistrict() {
        this.options.status = 'add';
        this.service.getDistrictTreeByCode({districtcode: [publishObjectPath.value.district.root] }).then((res: any) => {
            if (this.options.status === 'add') {
                const districts = res.data.children;
                this._showDistrict(districts);
                // this.options.districtHome.setCountyVisible(false);
            }
        });
    },
    // 移除行政区划
    removeDistrict() {
        this.options.status = 'remove';
        this.simpleRenderMgr.remove(this.options.featureType);
        this.closePopup();
        // this.options.districtHome.setCountyVisible(true);
    },
    // 绘制行政区划
    _showDistrict(district: any) {
        const self = this;
        this.districtsList = district;
        const borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 1 });
        const symbol = new (g2 as any).sfs.SimpleFillSymbol({
            borderColor,
            fillColor: new (g2 as any).sfs.Color({ r: 0, g: 255, b: 255, a: 1}),
            opacity: 0.9,
            borderThickness: 2,
            style: 5,
        });
        const updateSymbolObj = {
            borderColor,
            fillColor: { r: 0, g: 240, b: 255, a: 30 },
            opacity: 1,
            borderThickness: 3,
            style: 5,
        };
        const hlSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', updateSymbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.districtname,
                    fontFamilyName: 'Microsoft Yahei',
                    fontSize: 24,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textBackgroundBorderThickness: 2,
                    textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 24, g: 62, b: 80 }),
                    textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 255, r: 55, g: 224, b: 245 }),
                    foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
                    padding: [2, 10, 2, 10],
                });
                if (data.districtcode === self.currentHlId) {
                    const h1CurrencySymbol = new (g2 as any).sfs.CurrencySymbol({
                        textSymbol: textSym,
                        fillSymbol: hlSymbol,
                    });
                    return h1CurrencySymbol;
                } else {
                    // const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                    //     textSymbol: textSym,
                    //     fillSymbol: symbol,
                    // });
                    // return currencySymbol;
                    return symbol;
                }
            },
        });
        const opts = {
            featureType: this.options.featureType,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list: district,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['wkt'],
                geometryType: 'Polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                mouseover: (data: any) => {
                    self._clearHighlight();
                    self._highlight(data[0].element);
                },
                // click: (data: any) => {
                    // const result: any = data[0];
                    // const element: any = result.element;
                    // self._removeHighlight();
                    // self._addHighlight(element);
                    // const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                    // self.addPopup(attributeObj, [attributeObj.longitude, attributeObj.latitude], false);
                // },
            },
        };
        this.simpleRenderMgr.add(opts);
        this._fitBounds();
    },
    _onMouseClick(event: any) {
        const self = this;
        console.log(event);
        const list = event.list;
        let flag: boolean = false; // 记录是否有点图层
        for (const item of list) {
            const element: any = item.element;
            if (element.geometry.getGeometryType() === 1) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            list.forEach((item: any) => {
                const element: any = item.element;
                if (item.featureType === this.options.featureType) {
                    self._removeHighlight();
                    self._addHighlight(element);
                    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                    self.addPopup(attributeObj, [attributeObj.longitude, attributeObj.latitude], false);
                }
            });
        }

    },
    // 关闭信息框
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this._removeHighlight();
        this._clearHighlight();
    },
    // 添加弹窗
    addPopup(data: any, coordinate: any, noneMouseClick: any = true) {
        this.popupManager
        .addSimple({
            id: this.options.popupId,
            anchor: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
            className: '',
            autoPan: !noneMouseClick,
        })
        .then((content: any) => {
            this.fire(this.options.popupEventId, {
            data,
            containerId: content.containerId,
            id: content.containerId,
            });
        });
    },
    // 视野定位
    _fitBounds() {
        if (this.eventInfo.getEventInfo() === null) {
            const extent: any = this.simpleRenderMgr.getExtent(this.options.featureType);
            this.options.featureLocate.fit({
                type: 'geojson',
                geom: extent.asGeoJson(),
            });
        }
    },
    // 面高亮
    _highlight(element: any) {
        this.currentHlId = element.id;
        this._updateForHl(element.id);
    },
    // 清除面高亮，恢复图层原有的渲染
    _clearHighlight() {
        if (this.currentHlId) {
            const id: any = this.currentHlId;
            this.currentHlId = null;
            this._updateForHl(id);
        }
    },

    // 更新面
    _updateForHl(id: any) {
        let data: any = null;
        for (const item of this.districtsList) {
            if (item.districtcode === id) {
                data = item;
                break;
            }
        }
        const opts: any = {};
        opts.featureType = this.options.featureType;
        opts.list = [data];
        this.simpleRenderMgr.update(opts);
    },
    // 添加高亮
    _addHighlight(element: any) {
        const borderColor = new (g2 as any).sfs.Color({r: 0, g: 255, b: 219, a: 128});
        const updateSymbolObj = {
        type: 'SimpleFillSymbol',
        borderColor,
        fillColor: { r: 46, g: 239, b: 255, a: 70 },
        opacity: 1,
        borderThickness: 3,
        style: 5,
        };
        const options = {
        data: {
            type: 'geojson',
            geom: element.geometry.asGeoJson(),
        },
        style: updateSymbolObj,
        blink: {
            enable: false,
        },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
        this.featureHighlight.layer.setZIndex(7);
    },
    // 移除高亮
    _removeHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
});
export default component;
