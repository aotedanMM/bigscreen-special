import SimpleRenderMgrLayer from './SimpleRenderMgrLayer';
import { RequestServerClass } from '../../../../util/request';

/**
 * 流域图层
 */
export default class SatelliteCloud extends SimpleRenderMgrLayer {
    public load(params: any): void {
        this.rSerivce = new RequestServerClass(this.options.serviceConfig);
        // this._add_ImageLayer();
        // this.loadPreImg();
    }
    public loadPreImg() {
        const self = this;
        this._getServerData().then((res: any) => {
            self._add_ImageLayer();
        });
    }
    public _getServerData() {
        const self = this;
        this.arrData = [];
        const url = this.options.serviceConfig.floodServer + '/api/gsemergency/natural/radarAndCloudImg/listOfCloud/v1';
        return new Promise(async (resolve, reject) => {
            const res: any = await this.rSerivce.serverObj.get(url);
            const result: any = res.data;
            result.forEach((item: any) => {
                self.arrData.push(item);
            });
            self._add_ImageLayer();
            resolve(result);
        });
    }
    // 添加imagelayer、
    public _add_ImageLayer() {
        const exTend: any = [70, 17.5, 140, 57.5];
        const imgUrl: any = this.options.serviceConfig.floodServer + '/' + this.arrData[0].img;
        let imageLayer = this.map.findLayer('cloude_Layer');
        if (!imageLayer) {
            imageLayer = new g2.carto.ImageLayer({
                id: 'cloude_Layer',
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
    }
    public _play(index: any) {
        const self = this;
        const exTend: any = [70, 17.5, 140, 57.5];
        const imgUrl: any = this.options.serviceConfig.floodServer + '/' + this.arrData[index].img;
        const imageLayer = self.map.findLayer('cloude_Layer');
        if (imageLayer) {
            imageLayer.setSource(new g2.carto.ImageStatic({
                extent: this.arrData[index].pahe,
                url: imgUrl,
                opacity: 0.8,
            }));
        } else {
            // 加载图片
            const newImageLayer = new g2.carto.ImageLayer({
                id: 'cloude_Layer',
                name: '图片图层',
                imageType: 702,
                extent: this.arrData[index].pahe,
                url: imgUrl,
                opacity: 0.8,
                crossOrigin: null, // 跨域
            });
            this.map.addLayer(newImageLayer);
        }
    }
    public unload() {
        this._clear();
    }
    public _clear() {
        const tempLayer = this.map.getLayerById('cloude_Layer');
        if (tempLayer) {
            this.map.removeLayer(tempLayer);
        }
    }
}
