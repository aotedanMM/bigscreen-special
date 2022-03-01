import Util from '../../Util';
const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        // 资源类型
        map: null,
        mapConfig: null,
        symbolConfig: null,
        service: null,
        rescueTeamServer: null,
        rescueSuppliesServer: null,
        popupId: 'popup_ResourceTeamPoints', // 弹窗唯一标识
        highLightId: 'hl_ResourceTeamPoints', // 高亮id
        rescueTeam: ['floodteam', 'fireteam', 'forestfireteam', 'hazardousteam',
            'mineteam', 'nonmineteam', 'corecompetenceteam', 'transportationteam'],
        fireAddPopupEventId: 'popup', // 添加弹窗后执行事件id
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);

        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.service = options.service;
        this.rescueTeamServer = options.rescueTeamServer;
        this.rescueSuppliesServer = options.rescueSuppliesServer;
        // do sth
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
    },
    load() {
        componentBase.prototype.load.call(this);

        //  this.getServerData({districtCode: '110000', resourceKey: 'fireteam'});
        //  this.getRescueTeamDetail({id: 'beijing194'});
        //  this.getRescueSuppliesList({point: [116.35, 39.87]});
        //  this.getRescueSupplyDetail({id: 'J026'});
    },
    unload() {
        // todo
        // 清理所有地图数据，地图监听
        this.closePopup();
        this.clearAll();
        //
        componentBase.prototype.unload.call(this);
    },
    /**
     * 新增图层
     * @param opts.districtCode 行政区划code
     * @param opts.resourceKey 救援队伍类型标识
     */
    addResource(opts: any) {
        // 判断是否存在该图层数据,存在则直接显示,不存在则新增
        this._getRescueTeamList(opts);
    },
    // 移除图层
    removeResource(opts: any) {
        this.simpleRenderMgr.remove(opts.resourceKey);
    },
    // 清空救援队伍相关的图层
    clearAll() {
        this.options.rescueTeam.forEach((element: any) => {
            this.simpleRenderMgr.remove(element);
        });
        this.closePopup();
        this.hideHighlight();
    },
    /**
     * 地图点击事件,触发显示弹窗
     * @param featureType
     * @param element
     */
    addPopup(featureType: any, element: any) {
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
                jQuery('#' + content.containerId).append('<b>队伍名称：' + attrObj.NAME + '</b>');
                this.fire('popup', {
                    featureType,
                    type: this._getTypeByFeatureType(featureType),
                    data: attrObj,
                    content,
                });
            });
    },
    // 清除弹窗
    closePopup() {
        this.popupManager.remove(this.options.popupId);
    },
    /**
    * 根据经纬度高亮
    * @param Type 类型
    * @param coordinate 经纬度数组
    */
    showHighlight(Type: string, coordinate: number[]) {
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
                    source: this.options.symbolConfig.icons[Type + '_img_hover'],
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
    /**
     * 根据行政区划、救援队伍类型标识获取救援队伍列表
     * @param opts.districtCode 行政区划code
     * @param opts.resourceKey 救援队伍类型标识
     * { id: 1000, pId: 1, name: "矿山隧道救援队", code: "floodteam" },
     * { id: 1001, pId: 1, name: "危险化学品救援队", code: "fireteam" },
     * { id: 1002, pId: 1, name: "消防救援队", code: "transportationteam" },
     * { id: 1003, pId: 1, name: "森林消防救援队", code: "forestfireteam" },
     * { id: 1004, pId: 1, name: "地震灾害救援队", code: "hazardousteam" },
     * { id: 1005, pId: 1, name: "医疗防疫救援队", code: "mineteam" },
     * { id: 1006, pId: 1, name: "安全水上救援队", code: "nonmineteam" },
     * { id: 1007, pId: 1, name: "社会救援队", code: "corecompetenceteam" }
     */
    _getRescueTeamList(opts: any) {
        this.rescueTeamServer.getRescueTeamList(opts).then((data: any) => {
            console.log('救援队列表', data);
            this._showResourcesOnMap(data, opts.resourceKey);
        });
    },
    /**
     * 根据id获取单个救援队伍
     * @param opts.id 救援队伍标识
     */
    _getRescueTeamDetail(opts: any) {
        console.log('opts.id', opts.id);
        this.rescueTeamServer.getRescueTeamDetail(opts).then((data: any) => {
            console.log('救援队详情');
            console.log(data);
        });
    },
    /**
     * 根据位置获取救援物资列表
     * @param opts.point 位置
     */
    _getRescueSuppliesList(opts: any) {
        this.rescueSuppliesServer.getRescueSuppliesList(opts).then((data: any) => {
            console.log('救援物资列表');
            console.log(data);
        });
    },
    /**
     * 根据id获取救援物资详情
     * @param opts
     */
    _getRescueSupplyDetail(opts: any) {
        this.rescueSuppliesServer.getRescueSupplyDetail(opts).then((data: any) => {
            console.log('救援物资详情');
            console.log(data);
        });
    },
    /**
     * 添加数据到图层
     * @param dataCol
     * @param type
     */
    _showResourcesOnMap(dataCol: any, type: string) {
        this.removeResource(type);
        const clusterSymbol: any = this.symbolConfig.symbols.disasterJudge.resource.cluster;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                // 根据数据属性控制不同的显示效果
                const icon = this.symbolConfig.icons[(type + '_img') as any];
                const symbolObj = {
                    width: 44,
                    height: 44,
                    offsetX: '22',
                    offsetY: '22',
                    opacity: '1',
                    rotation: '0',
                    source: icon,

                };
                return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', symbolObj);
            },
            buildClusterStyle: (data: any) => {
                return clusterSymbol;
            },
        });
        const opts = {
            featureType: type,
            featureName: '救援队',
            idField: '_id',
            list: dataCol[type],
            // type: 1,
            type: 3,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                // 注册点击事件
                click: (data: any) => {
                    console.log('地图点击 fire popup事件');
                    // 1.移除已存在的弹窗
                    this.closePopup();
                    // 2.获取该元素,显示弹窗
                    const dataObj: any = data[0];
                    const element: any = dataObj.element;
                    this.addPopup(dataObj.featureType, element);
                    // 3,显示高亮图层
                    this.showHighlight(type, [element.geometry.x, element.geometry.y]);
                },
            },
        };
        this.simpleRenderMgr.add(opts);
        this._fitMap({ type });
    },
    _getTypeByFeatureType(featureType: any) {
        return featureType.split('__')[1];
    },
    // 地图上数据变化时，需要重新调整地图视野，适配数据
    _fitMap(opts: any) {
        // todo
        // 根据展示的资源数据调整地图视野
        const layer = this.simpleRenderMgr.getLayer(opts.type);
        const arr = [];
        for (const k of layer.elements) {
            const sim = {
                type: 'wkt',
                geom: k.geometry.asWkt(),
            };
            arr.push(sim);
        }
        this.featureLocate.fit(arr);
    },
});
export default component;
