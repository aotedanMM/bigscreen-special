const componentBase = (G as any).base.ComponentBase;
import { RequestServerClass } from '@/util/request';
const RainForecastComponent = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        publishObjectPath: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.rSerivce = new RequestServerClass(options.serviceConfig);
        this.serviceConfig = options.serviceConfig;
        this.arrData = [];
    },
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
    load() {
        componentBase.prototype.load.call(this);
        this.loadPreImg();
    },
    // 卸载
    unload() {
        this._clear();
        componentBase.prototype.unload.call(this);
    },
    loadPreImg() {
        const self = this;
        this._getServerData().then((res: any) => {
            self._add_ImageLayer();
        });
    },
    _getServerData() {
        const self = this;
        this.arrData = [];
        const url = this.serviceConfig.floodServer + '/api/gsemergency/natural/autostation/gpSumMessageList/v1';
        return new Promise(async (resolve, reject) => {
            const res: any = await this.rSerivce.serverObj.get(url);
            const result: any = res.data.data;
            result.reverse();
            result.forEach((item: any) => {
                if (item.time === '24小时' || item.time === '48小时' || item.time === '72小时') {
                    self.arrData.push(item);
                }
            });
            self._add_ImageLayer();
            resolve(result);
        });
    },
    // 添加imagelayer、
    _add_ImageLayer() {
        const exTend: any = [119.426, 36.433, 122.08, 38.559];
        const imgUrl: any = this.options.serviceConfig.floodServer + '/' + this.arrData[0].img;
        let imageLayer = this.map.findLayer('rain_Layer');
        if (!imageLayer) {
            imageLayer = new g2.carto.ImageLayer({
                id: 'rain_Layer',
                name: 1,
                imageType: 702,
                extent: this.arrData[0].pahe,
                url: imgUrl,
                opacity: 0.8,
                crossOrigin: null, // 跨域
            });
            this.map.addLayer(imageLayer);
            imageLayer.zIndex = 25;
        }

    },
    play(index: any) {
        const self = this;
        const exTend: any = [119.426, 36.433, 122.08, 38.559];
        const imgUrl: any = this.options.serviceConfig.floodServer + '/' + this.arrData[index].img;
        const imageLayer = self.map.findLayer('rain_Layer');
        if (imageLayer) {
            imageLayer.setSource(new g2.carto.ImageStatic({
                extent: this.arrData[index].pahe,
                url: imgUrl,
                opacity: 0.8,
            }));
        } else {
            // 加载图片
            const newImageLayer = new g2.carto.ImageLayer({
                id: 'rain_Layer',
                name: '图片图层',
                imageType: 702,
                extent: this.arrData[index].pahe,
                url: imgUrl,
                opacity: 0.8,
                crossOrigin: null, // 跨域
            });
            this.map.addLayer(newImageLayer);
        }
    },
    _clear() {
        const tempLayer = this.map.getLayerById('rain_Layer');
        if (tempLayer) {
            this.map.removeLayer(tempLayer);
        }
    },
});
export default RainForecastComponent;

