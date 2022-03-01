// 重点河流和监测站
import { riverWaterSystemServe } from '@/api/installServer';
import Util from '../../Util';
const componentBase = G.base.ComponentBase;
const MapserviceInComponent = componentBase.extend({
    options: {
        map: null,
        simpleRenderMgr: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.simpleRenderMgr = options.simpleRenderMgr;
        this.imporatantRiver = {}; // 河流图层
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
    },

    unload() {
        componentBase.prototype.unload.call(this);
    },
    /**
     * 添加重点河流
     * @param allowClick 是否允许点击
     */
    addImportantRiver(allowClick: boolean) {
        const self = this;
        const opts = {
            districtCode: '',
            isImportantRiver: '1',
            keyword: '',
        };
        return new Promise((resolve, reject) => {
            riverWaterSystemServe.findeAllRiver(opts).then((res: any) => {
                let idString = '';
                res.forEach((ele: any) => {
                    idString += ele.id + ',';
                    if (ele.geometry !== null) {
                        ele.geometry = JSON.parse(ele.geometry);
                        // const geo = g2.sfs.GeometryFactory.createGeometryFromGeoJson(JSON.parse(ele.geometry), 4326);
                        // ele.geo = geo;
                        // const lineSymbol = new g2.sfs.SimpleLineSymbol({
                        //     color: new g2.sfs.Color({ r: 240, g: 255, b: 0, a: 255 }),
                        //     width: 1,
                        // });
                        // const lineSymbol2 = new g2.sfs.SimpleLineSymbol({
                        //     color: new g2.sfs.Color({ r: 130, g: 116, b: 0, a: 255 }),
                        //     width: 4,
                        // });
                        // const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
                        //     lineSymbols: [lineSymbol2, lineSymbol],
                        // });
                        // const element = new g2.sfs.Element({
                        //     geometry: geo,
                        //     symbol: ploylineCombSymbolRed,
                        // });
                        // self.imporatantRiver.add(element);
                    }
                });
                self.showRiver(res, allowClick);
                resolve(idString);
            });
        });

    },
    // 移除重点河流图层
    removeImportantRiver() {
        this.simpleRenderMgr.remove('imporatantRiver');
    },
    showRiver(list: any, allowClick: boolean) {
        const self = this;
        const geometryBuilder = new (G as any).utils.GeometryBuilder({
            geometryField: ['geometry'],
            geometryType: 'polyline',
        });
        const outlineSymbol = new g2.sfs.SimpleLineSymbol({
            color: new g2.sfs.Color({ r: 240, g: 255, b: 0, a: 255 }),
            width: 1,
        });
        const lineSymbol = new g2.sfs.SimpleLineSymbol({
            color: new g2.sfs.Color({ r: 130, g: 116, b: 0, a: 255 }),
            width: 4,
        });
        const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
            lineSymbols: [lineSymbol, outlineSymbol],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (res: any) => {
                return ploylineCombSymbolRed;
            },
        });
        const opts = {
            featureType: 'imporatantRiver',
            featureName: '河流高亮',
            idField: 'id',
            list,
            geometryBuilder,
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                click: (data: any) => {
                    if (allowClick) {
                        const res: any = data[0];
                        const element: any = res.element;
                        const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                        self.fire('riverClick', attributeObj);
                    }
                },
            },
        };
        this.simpleRenderMgr.add(opts);
    },
});
export default MapserviceInComponent;

