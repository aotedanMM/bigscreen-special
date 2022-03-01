import Util from '../../Util';
// 风险隐患排查
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
const componentBase = (G as any).base.ComponentBase;
const RiskTroubleCmponent = componentBase.extend({
    options: {
        symbolConfig: null,
        eventInfo: null,
        featureTypeSet: {},
        popupId: 'popup',
        highLightId: 'hl_riskTrouble',
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.featureLocate = options.GISComponents.featureLocate;
        this.popupManager = options.GISComponents.popupManager;
        this.featureHighlight = options.GISComponents.featureHighlight;
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);

        // 初始化渲染工具
        this.simpleRenderMgr = new (G as any).render.SimpleRenderMgr({
            map: this.map,
        });
        this.simpleRenderMgr.load();
    },
    // 销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
        this.featureLocate = null;
        this.popupManager = null;
        this.featureHighlight = null;
    },
    /**
     * 根据业务类型和级别获取数据
     * @param opts.type 业务类型
     * @param opts.levels 等级
     */
    addResource(opts: any) {
        const type = opts.type;
        const levels = opts.levels;
        this._queryRisk(type).then((result: any) => {
            const data: any = Object.values(result)[0];
            this._addPointData(data[levels], levels, type);
        });
    },
    /**
     * 根据业务类型和级别删除图层数据
     * @param opts.type 业务类型
     * @param opts.levels 等级
     */
    removeResource(opts: any) {
        const type = opts.type;
        const levels = opts.levels;
        this.simpleRenderMgr.remove(this._calculFeatureType(type, levels));
        this.closePopup();
    },
    // 清空救援队伍相关的图层
    clearAll() {

        this.closePopup();
        for (const type of Object.keys(this.options.featureTypeSet)) {
            this.simpleRenderMgr.remove(type);
        }
        this.options.featureTypeSet = {};
    },
    /**
     * 地图点击事件,触发显示弹窗
     * @param featureType
     * @param element
     */
    addPopup(featureType: any, element: any ) {
        const geometry = element.geometry;
        this.popupManager
            .addSimple({
                id: this.options.popupId,
                anchor: [geometry.x, geometry.y],
                className: 'g2-tooltip',
            })
            // 弹窗现在完成后,通知前端
            .then((content: any) => {
                const attrObj = Util.attributeSet2Object(element.attributeSet);
                console.log('attrObj', attrObj);
                // jQuery('#' + content.containerId).append('<b>队伍名称：' + attrObj.title + '</b>');
                const featureTypeInfoArray =  this._inverseCalculFeatureType(featureType);
                const type = featureTypeInfoArray[0];
                const levels = featureTypeInfoArray[2];
                this.fire('popup', {
                    featureType,
                    type,
                    levels,
                    data: attrObj,
                    content,
                });
            });
    },
    // 清除弹窗
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this.hideHighlight();
    },
    /**
    * 根据经纬度高亮
    * @param Type 类型
    * @param coordinate 经纬度数组
    */
    showHighlight(Type: string, imgColor: any, coordinate: number[]) {
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
            },
            style: {
                type: 'PictureMarkerSymbol',
                options: {
                    width: 66,
                    height: 80,
                    offsetX: 36,
                    offsetY: 42,
                    opacity: '1',
                    rotation: '0',
                    source: this.options.symbolConfig.icons[imgColor + '_' + Type + '_img_hover'],
                },
            },
        };
        // this.featureHighlight.addHighlight(Type, options);
        this.featureHighlight.addHighlight(this.options.highLightId, options);
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 风险隐患查询 type：dz，qy，ss。地灾隐患点，重点企业，重点设施。
    _queryRisk(type: any) {
        const opts: any = {
            type,
            point: this.options.eventInfo.getPoint(),
            geometry: this.options.eventInfo.getMaxRangeGeometry(),
        };
        const rsult = installDisasterJudgeServer.riskTroubleServer.getRiskTroubleQueryServer(opts);
        return rsult;
    },
     /* 添加图层数据
     * @param result
     * @param levels
     * @param type
     */
    _addPointData(result: any, levels: any, type: any) {
        const mgColor: any = ['RedCount', 'orangeCount', 'yellowCount', 'greenCount'];
        // const result = data[type][levels];
        this._addPoint(result, mgColor[levels], type, levels);
    },
    // 添加图层数据
    _addPoint(data: any, imgColor: any, type: any, levels: any) {
        const featuretypeId = this._calculFeatureType(type, levels);
        const self = this;
        const opts1: any = {
            featureType: featuretypeId,
            featureName: featuretypeId,
            idField: '_id',
            list: data,
            type: 1,
            // type: 3,
            geometryBuilder: null,
            symbolBuilder: null,
            listeners: {
                // 注册点击事件
                click: (eles: any) => {
                    console.log('地图点击 fire popup事件');
                    // 1.移除已存在的弹窗
                    this.closePopup();
                    // 2.获取该元素,显示弹窗
                    const dataObj: any = eles[0];
                    const element: any = dataObj.element;
                    this.addPopup(dataObj.featureType, element);
                    const attrObj = Util.attributeSet2Object(element.attributeSet);
                    // 3,显示高亮图层
                    this.showHighlight(attrObj._type, imgColor, [element.geometry.x, element.geometry.y]);
                },
            },
        };
        opts1.geometryBuilder = new (G as any).utils.GeometryBuilder({
            geometryField: ['geom'],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build(ele: any) {
                // 根据数据属性控制不同的显示效果
                const iconKey = self.options.symbolConfig.icons[imgColor + '_' + ele._type + '_img'];
                const symbolObj = {
                    width: 34,
                    height: 46,
                    offsetX: '17',
                    offsetY: '23',
                    opacity: '1',
                    rotation: '0',
                    source: iconKey,
                };
                return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', symbolObj);
            },
        });
        opts1.symbolBuilder = new SymbolBuilder();
        this.simpleRenderMgr.add(opts1);

        this.options.featureTypeSet[featuretypeId] = true;
        // this._fitMap({type: featuretypeId});
    },
    _getTypeByFeatureType(featureType: any) {
        return featureType.split('__')[1];
    },
    // 地图上数据变化时，需要重新调整地图视野，适配数据
    _fitMap(opts: any) {
        // todo
        // 根据展示的资源数据调整地图视野
        const layer = this.simpleRenderMgr.getLayer(opts.type);
        const arr: any = [];
        for ( const groupLayers of layer.groupLayers) {
            groupLayers.features.forEach((feature: any) => {
                const sim = {
                    type: 'wkt',
                    geom: feature.geometry.asWkt(),
                };
                arr.push(sim);
            });
        }
        this.featureLocate.fit(arr);
    },
    /**
     * 计算图层
     * @param type 业务类型
     * @param levels 等级
     */
    _calculFeatureType(type: any, levels: any) {
        return type + '_layer' + '_' + levels;
    },
    _inverseCalculFeatureType(FeatureType: any) {
        return FeatureType.split('_');
    },
});
export default RiskTroubleCmponent;
