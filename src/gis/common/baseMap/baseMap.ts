import RealTimeUrlModule from '@/store/module/realTimeUrlModule/RealTimeUrlModule';
import { RequestServerClass } from '../../../util/request';
const componentBase = (G as any).base.ComponentBase;
const baseMap = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        publishObjectPath: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.rSerivce = new RequestServerClass(this.options.serviceConfig);
    },
    // 加载
    load(num: number) {
        componentBase.prototype.load.call(this);
    },
    // 创建底图图层
    createBaseLayer(id: any) {
        const token = this.getToken(id);
        // G.utils.LayerUtil.removeBaseLayer(this.map)
        // const tilelayer = new (window as any).egis.carto.TileLayer({
        //     id: this.options.mapConfig.baseLayers_difang[0].id,
        //     layerType: 1,
        //     wrapX: true,
        //     title: this.options.mapConfig.baseLayers_difang[0].title,
        //     tileType: 104,
        //     crossOrigin: 'anonymous',
        //     projection: 'EPSG:4490',
        //     url: this.options.mapConfig.baseLayers_difang[0].url + '/{z}/{y}/{x}?token=' + this.getToken(),
        //     tileUrlFunction: this.callback,
        // });
        // tilelayer._type = '_base_layer_tag';
        // this.map.addLayer(tilelayer);
    },
    addBaseLayerDom(token: any) {
        const self = this;
        this.url = this.options.mapConfig.baseLayers_difang[1].url;
        G.utils.LayerUtil.removeBaseLayer(this.map);
        const arrDom = ['A', 'B', 'C', 'D', 'E', 'F'];
        arrDom.forEach((item: any) => {
            const tilelayer = new (window as any).egis.carto.TileLayer({
                id: this.options.mapConfig.baseLayers_difang[0].id,
                layerType: 1,
                wrapX: true,
                title: this.options.mapConfig.baseLayers_difang[0].title,
                tileType: 104,
                crossOrigin: 'anonymous',
                projection: 'EPSG:4490',
                token,
                url: this.options.mapConfig.baseLayers_difang[1].url + item + '/MapServer/tile/{z}/{y}/{x}?token=' + token,
                tileUrlFunction: (tileCoord: any) => {
                    const z = tileCoord[0] - 1;
                    const x = tileCoord[1];
                    const y = tileCoord[2];
                    const url = self.options.mapConfig.baseLayers_difang[1].url + item + '/MapServer/tile/' + z + '/' + y + '/' + x + '?token=' + token;
                    return url;
                },
            });
            tilelayer._type = '_base_layer_tag';
            this.map.addLayer(tilelayer);
        });

    },
    addBaseLayer(token: any) {
        const self = this;
        this.url = this.options.mapConfig.baseLayers_difang[0].url;
        G.utils.LayerUtil.removeBaseLayer(this.map);
        const tilelayer = new (window as any).egis.carto.TileLayer({
            id: this.options.mapConfig.baseLayers_difang[0].id,
            layerType: 1,
            wrapX: true,
            title: this.options.mapConfig.baseLayers_difang[0].title,
            tileType: 104,
            crossOrigin: 'anonymous',
            projection: 'EPSG:4490',
            token,
            url: this.options.mapConfig.baseLayers_difang[0].url + '/{z}/{y}/{x}?token=' + token,
            tileUrlFunction: (tileCoord: any) => {
                const z = tileCoord[0] - 1;
                const x = tileCoord[1];
                const y = tileCoord[2];
                const url = self.options.mapConfig.baseLayers_difang[0].url + '/' + z + '/' + y + '/' + x + '?token=' + token;
                return url;
            },
        });
        tilelayer._type = '_base_layer_tag';
        this.map.addLayer(tilelayer);
    },
    // xyz方式加载的回调
    callback(tileCoord: any) {
        const token = this.key_.split('=')[1];
        const z = tileCoord[0] - 1;
        const x = tileCoord[1];
        const y = tileCoord[2];
        const url = this.key_.split('tile')[0] + 'tile/' + z + '/' + y + '/' + x + '?token=' + token;
        return url;
    },
    getToken(id: any) {
        const self = this;
        return new Promise(async (resolve, reject) => {
            const result: any = await this.options.service.getArcgisToken('day');
            self.options.token = result.token;
            if (id === 'vec_road') {
                self.addBaseLayer(result.token);
            } else if (id === 'domimg') {
                self.addBaseLayerDom(result.token);
            }

            resolve(result.token);
        });
    },
    // tslint:disable-next-line:no-empty
    unload() {
    },
});
export default baseMap;

