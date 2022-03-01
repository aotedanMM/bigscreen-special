import EventTypeMap from '../../event/EventTypeMap';
import {SymbolMap} from '../../SymbolConfig';
import Util from '../../Util';

// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        service: null,
        highLightId: 'hl_QueryAndShowAccidentData', // 高亮id
        popupId: 'popup_accident', // 弹窗唯一标识
        fireAddPopupEventId: 'AccidentPopup', // 添加弹窗后执行事件id
        // allType: ['社会安全事件', '事故灾难', '自然灾害', '公共卫生事件'],
        featureTypeSet: {},
        // resultdata:{"success":true,"msg":null,"data":[{"id":"ddaecb096ac940a39e2d34a1ce900afe","title":"临沧市临翔区在建临清高速王家寨隧道&ldquo;12.05&rdquo;突泥涌水情况报告","type":"其他","reportMan":"李勇军","reportTime":"2019-12-12 10:21:30","updateDate":"2019-12-07 10:20:43","sendDept":"53600000","signMan":"阙云彩","sendDeptName":"云南省应急厅","eventId":"ddaecb096ac940a39e2d34a1ce900afe","contentid":"8cfd2e637a5e4f5e83e99b8c774f307a","longitude":"100.082523","latitude":"23.895137","province":"云南省","city":"临沧市","county":"临翔区","address":null,"wordContent":null,"district":null},{"id":"6e141079d1df429eb0f77f87d0bb7","title":"吉林省长春市九台区发生1.5级地震（矿震）事件正式报告","type":"地震灾害","reportMan":"黄祖超","reportTime":"2019-12-11 23:49:15","updateDate":"2019-08-04 23:46:15","sendDept":"00670100","signMan":"朱自强","sendDeptName":"地震台网中心","eventId":"6e141079d1df429eb0f77f79d87d0bb7","contentid":"a044d1aba4df4ae199dfa369ebd3c828","longitude":"125.839574","latitude":"44.151742","province":"吉林省","city":"长春市","county":"九台区","address":null,"wordContent":null,"district":null},{"id":"9da5a5fa1556455d806b3c8d8a3b71af","title":"黄冈市发生一起油罐车追尾小车事故，无人员伤亡","type":"危化工贸事故","reportMan":"陈玮","reportTime":"2019-12-11 23:25:10","updateDate":"2019-08-02 23:19:30","sendDept":"42600000","signMan":"杨光武","sendDeptName":"湖北省应急厅","eventId":"9da5a5fa1556455d806b3c8d8a3b71af","contentid":"ee178b0390d74b009b2c185a11ba5d78","longitude":"114.872316","latitude":"30.453905","province":"湖北省","city":"黄冈市","county":"黄州区","address":null,"wordContent":null,"district":null},{"id":"5c8edc0a3ac84d39bd74deb85423","title":"四川省凉山州甘洛县暴雨灾害（续报四）","type":"其他","reportMan":"陈  昆","reportTime":"2019-12-11 19:38:57","updateDate":"2019-08-04 19:38:06","sendDept":"51600000","signMan":"雷治严","sendDeptName":"四川省应急厅","eventId":"5c8edc0a3ac84d39bd535674deb85423","contentid":"3c47dbb74eeb42f895c28f166abad981","longitude":"102.771749","latitude":"28.966069","province":"四川省","city":"凉山彝族自治州","county":"甘洛县","address":null,"wordContent":null,"district":null},{"id":"f1fb55fcda5c4c9ab5ede2e0f0a5c","title":"四川凉山州盐源县发生3.1级地震初步报告","type":"地震灾害","reportMan":"孙丽","reportTime":"2019-12-11 19:16:05","updateDate":"2019-08-03 19:15:32","sendDept":"00670100","signMan":"孙丽","sendDeptName":"地震台网中心","eventId":"f1fb55fcda5c4c9ab5ed376e2e0f0a5c","contentid":"17f3ee55df30468b8bff90ab28a029bf","longitude":"101.509188","latitude":"27.422645","province":"四川省","city":"凉山彝族自治州","county":"盐源县","address":null,"wordContent":null,"district":null}]}
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        const service = this.options.service;
        this.symbolConfig = options.symbolConfig;
        this.service = service;
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.popupManager = options.popupManager;
        this.featureLocate = options.featureLocate;
        this.featureHighlight = options.featureHighlight;
        this.pointGeometryBuilder = options.PointGeometryBuilder;
        this.featureTypeSet = {};
        // do sth
    },
    /**
     * 清除地图叠加的图层和弹窗和高亮
     */
    unload() {
        // 清理所有地图数据，地图监听
        this.closePopup();
        this.hideHighlight();

        // 清空已存在的图层
        for (const type of Object.keys(this.featureTypeSet)) {
            this.simpleRenderMgr.remove(type);
        }
        this.featureTypeSet = {};
        this.simpleRenderMgr.off('click');
        componentBase.prototype.unload.call(this);
    },
    //  销毁
    destroy() {
        // 取消监听事件
        this.simpleRenderMgr.off('click');
        this.simpleRenderMgr = null;
        // 清除弹窗
        this.popupManager.clear();
        this.popupManager = null;
        this.featureLocate = null;
        this.hideHighlight();
        this.featureHighlight = null;
        // dosth
        componentBase.prototype.destroy.call(this);
    },

    addAccidentDataToMap(eventOps: any) {
        // todo
        const self = this;
        this.getAccidentData(eventOps).then((reslut: any) => {
            const data = reslut.data;
            data.forEach((item: any) => {
                self._addIconTypeByEventType(item);
            });
            self.showAccidentdata(reslut, eventOps.eventType);
            // self.locateAccidentdata(eventOps.eventType);
        });
    },

    getAccidentData(eventOps: any) {
        // todo
        return this.service.getAccidents(eventOps);
    },

    removeAccidentdata(type: string) {
        // todo
        this.simpleRenderMgr.remove(type);
        // 清除高亮
        this.hideHighlight();
    },
    // 显示数据
    showAccidentdata(result: any, eventType: string) {
        const self = this;
        const dataList = result.data;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const symbolObj: any = Util.toJSON(SymbolMap.EVENT.symbol);
                symbolObj.options.source = this.options.symbolConfig.icons[SymbolMap.EVENT.iconFn(null, {
                    typeCode: data.typeCode,
                })];
                const symbol: any = G.utils.RenderUtil.object2Symbol(symbolObj);
                symbol.typeCode = data.typeCode;
                return symbol;
            },
        });
        const opts = {
            featureType: eventType,
            featureName: '右侧树事件数据',
            idField: 'id',
            list: dataList,
            geometryBuilder: new this.pointGeometryBuilder({ geometryField: ['longitude', 'latitude'] }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                click: (data: any) => {
                    // this指向监听时的context变量
                    const symbolObj: any = Util.toJSON(SymbolMap.EVENT.hlSymbol);
                    symbolObj.options.source = this.options.symbolConfig.icons[SymbolMap.EVENT.iconHlFn(null, {
                        typeCode: data[0].element.symbol.typeCode,
                    })];
                    const options = {
                        data: {
                            type: 'wkt',
                            geom: 'POINT(' + data[0].element.geometry.x + ' ' + data[0].element.geometry.y + ')',
                        },
                        style: symbolObj,
                        blink: {
                            enable: false,
                        },
                    };
                    // 清除上一次的高亮
                    self.hideHighlight();
                    self.featureHighlight.addHighlight(this.options.highLightId, options);
                    const center = data[0].element.geometry.getBaryCenter();
                    self.popupManager.clear();
                    self.popupManager.addSimple({
                        id: this.options.popupId,
                        anchor: [center.x, center.y],
                        className: 'EventPoints-tooltip',
                    }).then((content: any) => {
                        const ele: any = data[0].element;
                        const attrObj: any = Util.attributeSet2Object(ele.attributeSet);
                        attrObj.x = parseFloat(attrObj.longitude);
                        attrObj.y = parseFloat(attrObj.latitude);
                        self.fire(this.options.fireAddPopupEventId, {
                            data: data[0].element, // data[0].element.attributeSet.find('title').value,
                            data_: attrObj,
                            containerId: content.containerId,
                        });
                    });
                },
            },
        };
        this.simpleRenderMgr.add(opts);
        this.featureTypeSet[eventType] = true;
    },
    // 隐藏高亮
    hideHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    // 关闭弹框
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this.hideHighlight();
    },

    _addIconTypeByEventType(data: any) {
        data.typeCode = EventTypeMap[data.eventType];
        return data;
    },

    // 定位
    locateAccidentdata(type: string) {
        const layer = this.simpleRenderMgr.getLayer(type);
        if (!layer) {
            return;
        }
        const arr = [];
        for (const k of layer.elements) {
            for (const m of k.attributeSet.attributes) {
                if (m.name === 'id' && k.geometry.x && k.geometry.y) {
                    const sim = {
                        type: 'wkt',
                        geom: k.geometry.asWkt(),
                    };
                    arr.push(sim);
                }
            }
        }
        this.featureLocate.fit(arr);
    },
});
export default component;
