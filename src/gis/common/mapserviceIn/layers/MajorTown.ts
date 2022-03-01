import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';
import { RequestServerClass } from '../../../../util/request';
import Util from '../../../Util';

/**
 * 流域图层
 */
export default class MajorTown extends SimpleRenderMgrLayer {
    public load(params: any): void {
        // this.majorTown = params;
        // this.rSerivce = new RequestServerClass(this.options.serviceConfig);
        // this.addDistrict();
        // this.getdem(['120', '37']);
        const conf = this.options.serviceConfig.MajorTownLayer.tileLayer || {};
        this.featureType = conf.featureType;
        this.clickEventName = params.clickEventName;
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
        this.initLayer(conf);
        this.map.getLayerById(conf.id).setZIndex(9);
        if (params.clickEventName) {
            this.clickEventName = params.clickEventName;
            this.initEvent();
        }
    }
    public addDistrict() {
        const self = this;
        this.options.service.getTowns({ districtcode: this.options.serviceConfig.district.root }).then((res: any) => {
            self._showDistrictCountry(res);
            // self._showDistrictCountryLabel(res);
        });
    }
    // 绘制行政区划标注
    public _showDistrictCountryLabel(res: any) {
        const geometryBuilder = new G.utils.GeometryBuilder({ geometryType: 'polygon' });
        const symbolBuilder = new G.utils.SymbolBuilder({});
        const featureBuilder = new G.utils.FeatureBuilder({
            geometryBuilder,
            symbolBuilder,
        });
        const list: any = [];
        const arr = res.entities;
        arr.forEach((element: any) => {
            element = featureBuilder.buildElementFromGFeature(element);
            if (element) {
                element.geometry.spatialReference = this.map.spatialReference;
                const geom = element.geometry.asGeoJson();
                const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                const data = Object.assign({}, { geom }, attributeObj);
                list.push(data);
            }
        });
        this.districtsList = list;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.name,
                    fontFamilyName: 'Microsoft Yahei',
                    fontSize: 20,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textBackgroundBorderThickness: 2,
                    textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 24, g: 62, b: 80 }),
                    textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 255, r: 55, g: 224, b: 245 }),
                    foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
                    padding: [2, 10, 2, 10],
                });

                const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                    textSymbol: textSym,
                });
                return currencySymbol;
            },
        });
        const opts = {
            featureType: 'majorTown_label',
            featureName: 'majorTown_label',
            idField: 'districtcode',
            list,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
                geometryType: 'polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.options.simpleRenderMgr.add(opts);
    }
    // 绘制行政区划面
    public _showDistrictCountry(res: any) {
        const self = this;
        const geometryBuilder = new G.utils.GeometryBuilder({ geometryType: 'polygon' });
        const symbolBuilder = new G.utils.SymbolBuilder({});
        const featureBuilder = new G.utils.FeatureBuilder({
            geometryBuilder,
            symbolBuilder,
        });
        const list: any = [];
        const arr = res.entities;
        arr.forEach((element: any) => {
            element = featureBuilder.buildElementFromGFeature(element);
            if (element) {
                element.geometry.spatialReference = this.map.spatialReference;
                const geom = element.geometry.asGeoJson();
                const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                const data = Object.assign({}, { geom }, attributeObj);
                list.push(data);
            }
        });
        this.districtsList = list;
        const borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const symbol = new (g2 as any).sfs.SimpleFillSymbol({
                    borderColor,
                    fillColor: self.getFillColor(data),
                    // opacity: 0.9,
                    borderThickness: 1,
                    style: 5,
                });
                return symbol;
                // const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                //     fillSymbol: symbol,
                // });
                // return currencySymbol;
            },
        });
        const opts = {
            featureType: 'majorTown',
            featureName: 'majorTown',
            idField: 'districtcode',
            list,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['geom'],
                geometryType: 'polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.options.simpleRenderMgr.add(opts);
    }
    public getFillColor(data: any) {
        let fillColor = new (g2 as any).sfs.Color({ r: 0, g: 0, b: 255, a: 100 });
        for (const key of Object.keys(this.majorTown)) {
            if (this.majorTown[key].townCode) {
                const townCode = this.majorTown[key].townCode + '000';
                if (townCode === data.pac) {
                    fillColor = new (g2 as any).sfs.Color({ r: 205, g: 149, b: 12, a: 100 });
                    return fillColor;
                }
            }
        }
        return fillColor;
    }
    public removeLayer() {
        this.options.simpleRenderMgr.remove('majorTown');
    }

}
