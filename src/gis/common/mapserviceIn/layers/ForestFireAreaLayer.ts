import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';
import { RequestServerClass } from '../../../../util/request';
import comMutexState from '@/store/module/comMutexState/comMutexState';

/**
 * 森林防火区域图层
 */
export default class ForestFireAreaLayer extends SimpleRenderMgrLayer {
    public load(params: any): void {
        const self = this;
        const conf = this.options.serviceConfig.mapservice.forestFireAreaLayer.tileLayer || {};
        this.featureType = conf.featureType;
        this.featureType_city = 'feature_city';
        this.featureType_county = 'feature_county';
        this.featureType_key_county = 'feature_key_county';
        this.featureName = '森火重点区域';
        this.clickEventName = params.clickEventName;
        this.simpleRenderMgr = this.createRenderer();
        this.simpleRenderMgr.load();
        this.initLayer(conf);
        this.map.getLayerById(conf.id).setZIndex(11);
        this.serviceConfig = params.serviceConfig;
        this.rSerivce = new RequestServerClass(this.serviceConfig);
        if (params.clickEventName) {
            this.clickEventName = params.clickEventName;
            this.initEvent();
        }
        this.getLayerNote().then((data: any) => {
            self._showCityLabel(data.city, self.featureType_city);
            self._showCityLabel(data.county, self.featureType_county);
            self._showCityLabel(data.keys, self.featureType_key_county);
        });
        this.addListeners();
    }
    public getLayerNote() {
        const self = this;
        const url = this.serviceConfig.floodServerPath + '/api/forestfire/fire/getImportantAreaPoints';
        return new Promise(async (resolve, reject) => {
            const res: any = await this.rSerivce.serverObj.post(url);
            const result: any = res.data;
            resolve(result);
        });
    }
    // 绘制行政区划标注
    public _showCityLabel(list: any, type: any) {
        this.cityList = list;
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.name,
                    fontFamilyName: 'Microsoft Yahei',
                    fontSize: 18,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textBackgroundBorderThickness: 2,
                    textBackgroundColor: new (g2 as any).sfs.Color({ a: 152, r: 24, g: 62, b: 80 }),
                    textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 1, r: 55, g: 224, b: 245 }),
                    foreground: new (g2 as any).sfs.Color({ a: 200, r: 254, g: 0, b: 0 }),
                    padding: [2, 10, 2, 10],
                });

                const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                    textSymbol: textSym,
                });
                return currencySymbol;
            },
        });
        const opts = {
            featureType: type,
            featureName: this.featureName,
            idField: '',
            list,
            type: 0,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['x', 'y'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.simpleRenderMgr.add(opts);
        this.setVisibleByleve(9);
    }
    private addListeners() {
        //
        this.map.listen('resolutionchanged', this._onResolutionChanged, this);
    }
    private removeListeners() {
        this.map.off('resolutionchanged', this._onResolutionChanged, this);
    }
    // 分辨率变化
    private _onResolutionChanged(event: any) {
        const level: number = Math.round(event.level);
        this.setVisibleByleve(level);
    }
    private setVisibleByleve(level: any) {
        if (level >= 12.5) {
            this.simpleRenderMgr.setVisible(this.featureType_city, false);
            this.simpleRenderMgr.setVisible(this.featureType_county, true);
            this.simpleRenderMgr.setVisible(this.featureType_key_county, true);
        } else if (level > 9 && level <= 12.5) {
            this.simpleRenderMgr.setVisible(this.featureType_city, true);
            this.simpleRenderMgr.setVisible(this.featureType_county, false);
            this.simpleRenderMgr.setVisible(this.featureType_key_county, false);
        } else {
            this.simpleRenderMgr.setVisible(this.featureType_city, false);
            this.simpleRenderMgr.setVisible(this.featureType_county, false);
            this.simpleRenderMgr.setVisible(this.featureType_key_county, false);
        }
    }
    // 移除森火图层
    private removeLayer() {
        this.removeListeners();
        this.simpleRenderMgr.remove(this.featureType_city);
        this.simpleRenderMgr.remove(this.featureType_county);
        this.simpleRenderMgr.remove(this.featureType_key_county);
    }
}
