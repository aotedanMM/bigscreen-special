
// 房屋情况
import Util from '../../../Util';
import SymbolMap from './SymbolMap';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        districtServer: null,
        buildingServer: null, // 房屋查询
        popupId: 'house_popup_id', // 弹窗唯一标识
        highLightId: 'house_hl', // 高亮id
        fireAddPopupEventId: 'housePopup', // 添加弹窗后执行事件id
        wmsLayerId: 'wmsLayer', // wms图层id，房屋分布图层
        pointType: 'house_struc_type', // 房屋结构图层id
    },
    renderData: null, // 选中展示房屋结构echarts图的数据

    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.currrentStructureData = null;
        this.structureList = null;
        this.currentHlId = null;
        this.buildingServer = options.buildingServer;
        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.popupManager = options.popupManager;
        this.featureLocate = options.featureLocate;
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },

    load() {
        componentBase.prototype.load.call(this);
        //
        this.simpleRenderMgr.on('click', this._onLayerClick, this);
    },
    /**
    * 添加房屋分布
    */
    addHouseDistr(wmsLayers: string, wmsURL: string) {
        this._addWMS(wmsLayers, wmsURL);
    },
    /**
     * 移除房屋分布
     */
    deleteHouseDistr() {
        const layer = this.map.findLayer(this.options.wmsLayerId);
        if (layer) {
            layer.clear();
            this.map.removeLayer(layer);
        }
    },
    /**
    * 添加房屋结构
    */
    addHouseStruc(code: any) {
        this._addJson(code);
    },
    /**
    * 移除房屋结构
    */
    deleteHouseStruc() {
        this.closePopup();
        // 删除房屋结构图层
        this.simpleRenderMgr.remove(this.options.pointType);
    },
    // 关闭信息框,并删除点高亮
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this._clearHighlight();
    },
    unload() {
        this.clearAll();
        this.simpleRenderMgr.off('click', this._onLayerClick, this);
        componentBase.prototype.unload.call(this);
    },
    // 清除图层、tooltip
    clearAll() {
        this.closePopup();
        this.deleteHouseDistr();
        this.deleteHouseStruc();
    },
    // 图层点击事件
    _onLayerClick(features: any) {
        this.closePopup();
        let pointFeature: any = null;
        for (const item of features.list) {
            if (item.featureType === this.options.pointType) {
                pointFeature = item;
                break;
            }
        }
        // 优先处理点
        if (pointFeature) { // 点点击
            const featureObj: any = pointFeature;
            this._addPopup(featureObj.featureType, featureObj.element);
        }
    },
    _addPopup(pointType: string, element: any) {
        this._highlight(element);
        const point: any = element.geometry;
        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
        const type: any = pointType;
        this.popupManager.addSimple({
            id: this.options.popupId,
            anchor: [point.x, point.y],
            className: 'HouseStruc-tooltip',
            autoPanTimeout: 1200,
            autoPanMargin: 90,
        }).then((content: any) => {
            const event: any = {
                type,
                content,
                data: attributeObj,
                renderData: this.renderData,
            };
            this.fire(this.options.fireAddPopupEventId, event);
        });
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
        for (const item of this.structureList) {
            if (item.code === id) {
                data = item;
                break;
            }
        }
        const opts: any = {};
        opts.featureType = this.options.pointType;
        opts.list = [data];
        this.simpleRenderMgr.update(opts);
    },
    // 定位
    _locatePoint(geometry: any) {
        this.map.setCenter(geometry);
    },
    _addWMS() {
        this.buildingServer.getHouseDistributionWms().then((data: any) => {
            // const wmsUrl = 'http://120.52.31.31:590/service/api/egis/base/v1/wms';
            // const wmsLayers = 'puf_publicfacil_p';
            // const id = '28524d8c65844630a3427270c9a16323'; // 用户id
            // const secret = '84bc17650bb04491aa8475b9cbe3d1c4'; // 用户密码
            const wmsLayer = new (g2 as any).carto.TileLayer({
                // restHttp: new (g2 as any).core.RestHttp({
                //     client_id: id,
                //     client_secret: secret,
                // }),
                id: this.options.wmsLayerId,
                //  url: wmsUrl,
                url: data.URL,
                // layers: wmsLayers,
                layers: data.LAYERS,
                projection: 'EPSG:' + this.map.spatialReference,
                format: 'image/png',
                tileType: (g2 as any).carto.TileType.WMS,
                matrix: 22,
                version: data.VERSION,
                tiled: data.TILED,
            });
            this.map.addLayer(wmsLayer);
        });
    },
    _addJson(code: any) {
        this.buildingServer.getHouseStructure({
            districtCode: code,
        }).then((data: any) => {
            // console.log(data);
            const strucData = data.data.data;
            for (const item in strucData) {
                if (strucData[item].tag.DISTCODE === code) {
                    const opt = {
                        code: [code],
                        returnGeom: false,
                    };
                    this.renderData = strucData[item].tag;
                    this.options.districtServer.getDistrictsByCodes(opt).then((pointData: any[]) => {
                        // 创建房屋结构图层
                        this._createHouseStrucLayer(pointData);
                        this.structureList = pointData;
                    });
                }
            }
        });
    },
    _createHouseStrucLayer(data: any) {
        const symbolMapper: any = SymbolMap.housestructure;
        const opts: any = {};
        const self: any = this;
        opts.featureType = this.options.pointType; // 指定数据类型
        opts.featureName = '房屋结构图层'; // 数据类型说明
        opts.idField = 'code'; // 数据唯一标识的属性
        opts.list = data; // 数据列表
        opts.type = 0; // 使用element渲染
        opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['lng', 'lat'] });
        const symbolObj = Util.toJSON(symbolMapper.symbol);
        symbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconFn()];
        const updateSymbolObj = Util.toJSON(symbolMapper.hlSymbol);
        updateSymbolObj.options.source = self.options.symbolConfig.icons[symbolMapper.iconHlFn()];
        // const symbolObj: any = {
        //     width: 142,
        //     height: 105,
        //     offsetX: 71,
        //     offsetY: 105,
        //     opacity: '1',
        //     rotation: '0',
        // };
        // symbolObj.source = this.symbolConfig.icons.HouseStructure_img;
        // const updateSymbolObj: any = {
        //     width: 200,
        //     height: 180,
        //     offsetX: 100,
        //     offsetY: 120,
        //     opacity: '1',
        //     rotation: '0',
        //     source: this.symbolConfig.icons.HouseStructure_img_hover,
        // };
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (buildData: any) => {
                if (buildData.code === self.currentHlId) {
                    return G.utils.RenderUtil.object2Symbol(updateSymbolObj);
                } else {
                    // 根据数据属性控制不同的显示效果
                    return G.utils.RenderUtil.object2Symbol(symbolObj);
                }
            },
        });
        opts.symbolBuilder = new SymbolBuilder();
        this.simpleRenderMgr.add(opts);
        this._locatePoint(this.simpleRenderMgr.getLayer(this.options.pointType).get(0).geometry);
    },
});

export default component;
