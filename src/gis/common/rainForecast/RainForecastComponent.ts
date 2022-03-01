const componentBase = (G as any).base.ComponentBase;
const RainForecastComponent = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        publishObjectPath: null,
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.weatherMms = options.publishObjectPath.value && options.publishObjectPath.value.weatherMms;
        this.countryWhiteService = options.publishObjectPath.value && options.publishObjectPath.value.countryWhiteService;
    },
    // 加载
    load( num: number) {
        componentBase.prototype.load.call(this);
        // this.map.fullExtent();
        this.whiteCountry();
        if (this.arc) {
            this.map.removeLayer(this.arc);
            this.arc = null;
        }

        const time = new Date();
        time.setMinutes(time.getMinutes() - 30);
        const dimbatch = this.dateFtt('yyyyMMdd', time) + '01';

        const tomorrowtime = new Date(time.setDate(time.getDate() + 1));
        const aftertime = new Date(time.setDate(time.getDate() + 1));
        const aftime = new Date(time.setDate(time.getDate() + 1));

        const Timestr0 = this.dateFtt('yyyy-MM-dd', tomorrowtime) + 'T01:00:00Z';
        const Timestr1 = this.dateFtt('yyyy-MM-dd', aftertime) + 'T01:00:00Z';
        const Timestr2 = this.dateFtt('yyyy-MM-dd', aftime) + 'T01:00:00Z';
        const params = [
            {
                LAYERS: 'after_china',
                time: Timestr0,
                dimbatch,
                dim_type: 'after24',
                styles: 'rain24',
            },
            {
                LAYERS: 'after_china',
                time: Timestr1,
                dimbatch,
                dim_type: 'after24',
                styles: 'rain24',
            },
            {
                LAYERS: 'after_china',
                time: Timestr2,
                dimbatch,
                dim_type: 'after24',
                styles: 'rain24',
            },
        ];

        // 创建WMS服务
        this.arc = new (window as any).egis.carto.TileLayer({
            layers: params[num].LAYERS,
            projection: 'EPSG:' + this.map.spatialReference,
            format: 'image/png',
            url: this.weatherMms + '/?STYLES=&time=' + params[num].time + '&dim_batch=' + params[num].dimbatch + '&dim_type=' + params[num].dim_type + '&styles=' + params[num].styles,
            tileType: (window as any).egis.carto.TileType.WMS,
        });
        this.map.addLayer(this.arc);
    },

    dateFtt(fmt: string, date: Date) {
        const o: any = {
            'M+': date.getMonth() + 1,                 // 月份
            'd+': date.getDate(),                    // 日
            'h+': date.getHours(),                   // 小时
            'm+': date.getMinutes(),                 // 分
            's+': date.getSeconds(),                 // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds(),            // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    },

    whiteCountry() {
        // 创建WMS服务
        this.whiteLayer = new (window as any).egis.carto.TileLayer({
            layers: 'shengline:shengpointline',
            projection: 'EPSG:' + this.map.spatialReference,
            format: 'image/png',
            url: this.countryWhiteService + '?',
            tileType: (window as any).egis.carto.TileType.WMS,
            tiled: true,
        });
        this.map.addLayer(this.whiteLayer);
    },

    unload() {
        if (this.arc) {
            this.map.removeLayer(this.arc);
        }
        if (this.whiteLayer) {
            this.map.removeLayer(this.whiteLayer);
        }
    },
});
export default RainForecastComponent;

