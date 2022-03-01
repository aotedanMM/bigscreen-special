import BaseLayer from './BaseLayer';
import { mapServer } from '../../../../api/installServer';
import Axios from 'axios';
import { ajax } from 'jquery';
import publishObjectPath from '@/util/configRegistry';

/**
 * 风场图层
 */
export default class WindField extends BaseLayer {
    public load(params: any): void {
        // this.addwindFieldData(params);
        this.addOldData();
    }
    public addwindFieldData(params: any) {
        const self = this;
        const sourceList: any[] = []; // 保存风场数据
        const clientid = '79a1db417ab0411eb02b2409fdaec354'; // 用户id
        const clientsecret = '142b31dcd4e948e882bfa1c47b9029df'; // 用户密码
        const weatherServiceUrl = params.serviceConfig.mapservice.weatherServiceUrl; // 气象风场服务
        const weatherService = new g2.ews.RestWWQSService({
            clientId: clientid,
            clientSecret: clientsecret,
            url: weatherServiceUrl,
        });
        const startTime = new Date('2020-04-05 00:00:00').getTime();
        const endTime = new Date().getTime();
        this.unload(); // 清除数据
        const typeArr = 'CLDAS/WIN_JSON'.split('/');
        weatherService.query(startTime, endTime).then((result: any) => {
            for (const i of Object.keys(result)) {
                const source = result[i];
                if ((source.type1 + '/' + source.type2) === (typeArr[0].toUpperCase() + '/' + typeArr[1].toUpperCase())) {
                    sourceList.push(source);
                }
            }
            // if (sourceList.length === 0) {
            //     //alert('该类型无数据');
            //     mask();
            //     return;
            // }
            const sources = sourceList[sourceList.length - 1];
            self.createLayer(sources); // 创建风向图层
            // createWindTemplate.call(that);// 填充options
            // createWindLenged.call(that);// 显示风向图例
        });
    }
    public createLayer(source: any) {
        const self = this;
        const urls = source.url;
        function getJSON(this: any, url: any, success: any, error: any) {
            const that = this;
            const xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if (xhr.status === 204) {
                    success();
                    return;
                }
                const response = xhr.response;
                if (xhr.status < 200 || xhr.status >= 300) {
                    error(response);
                    return;
                }
                if (xhr.status === 200) {
                    success(response, that.map);
                    return;
                }
            };
            xhr.onerror = function() {
                const response = xhr.response;
                error(response);
            };
            xhr.send(null);
        }

        function asuccess(data: any, map: { addLayer: (arg0: any) => void; }) {
            if (data) {
                if (self.isLoaded()) {
                    self.addWindField(data);
                }
            }
        }

        getJSON.call(this, urls, asuccess, function(error: any) {
            console.error(error);
            // self.addOldData();
        });
    }
    /**
     * 加载的死数据
     */
    public addOldData() {
        $('.layoutMain').append('<div id="windLegend"></div>');
        $.ajax(publishObjectPath.value.misServerPath + 'natural-display/api/gsemergency/natural/autostation/getWindFlowField').then((res: any) => {
            if (this.isLoaded()) {
                this.addWindField(JSON.parse(res.data.content));
            }
        });
    }
    public addWindField(datas: any) {
        $('.layoutMain').append('<div id="windLegend"></div>');
        const domLegend: any = document.getElementById('windLegend');
        // for (let i = 0; i < newColor.length; i++) {
        //     const liDom = document.createElement('li');
        //     liDom.style.backgroundColor = newColor[i];
        //     liDom.innerHTML = '<span style=\'color: white\'>' + Math.round(i * 10 * 1000 / 3600) + '</span>';
        //     domLegend.appendChild(liDom);
        // }
        this.unload(); // 清除数据
        const windfield = new g2.carto.WindLayer({
            data: datas,
            id: 'wind_layer',
            projection: 'EPSG:4326',
            // devicePixelRatio: window.devicePixelRatio,
            colorScale: [
                'rgb(36,104, 180)',
                'rgb(60,157, 194)',
                'rgb(128,205,193 )',
                'rgb(151,218,168 )',
                'rgb(198,231,181)',
                'rgb(238,247,217)',
                'rgb(255,238,159)',
                'rgb(252,217,125)',
                'rgb(255,182,100)',
                'rgb(252,150,75)',
                'rgb(250,112,52)',
                'rgb(245,64,32)',
                'rgb(237,45,28)',
                'rgb(220,24,32)',
                'rgb(180,0,35)',
            ],
            minVelocity: 0,
            maxVelocity: 10,
            velocityScale: 0.05,
            particleAge: 30,
            lineWidth: 1,
            particleMultiplier: 0.001,
            paths: 400,
            map: this.map,
        });
        // this.layer = null;
        this.layer = windfield;
        this.map.addLayer(windfield);
    }

    public unload(): void {
        //
        if (this.layer) {
            this.map.removeLayer(this.layer);
        }

        const OldMaplayers = this.map.layers;
        console.log(OldMaplayers);
        for (const i of Object.keys(OldMaplayers)) {
            const windfield = OldMaplayers[i];
            if (windfield.id && windfield.id === 'windfield') {
                this.map.removeLayer(windfield);
            }
        }
        const windfieldLayer = this.map.getLayerById('windfield');
        if (!!windfieldLayer) {
            this.map.removeLayer(windfieldLayer);
        }
    }

    public setVisible(visible: boolean): void {
        //
        if (this.layer) {
            this.layer.setVisible(visible);
        }
    }
}
