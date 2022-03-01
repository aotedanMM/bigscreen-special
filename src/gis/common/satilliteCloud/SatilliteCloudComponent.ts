const componentBase = (G as any).base.ComponentBase;
const SatilliteCloudComponent = componentBase.extend({
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
    load() {
        componentBase.prototype.load.call(this);
        this.whiteCountry();
        // this.map.fullExtent();
        const time = new Date();
        time.setMinutes(time.getMinutes() - 30);
        const Timestr = this.dateFtt('yyyy-MM-dd', time) + 'T02:00:00Z';

        // 创建WMS服务
        this.wmsLayer = new (window as any).egis.carto.TileLayer({
            layers: 'satellite_china',
            projection: 'EPSG:' + this.map.spatialReference,
            format: 'image/png',
            url: this.weatherMms + '/?STYLES=&time=' + Timestr,
            tileType: (window as any).egis.carto.TileType.WMS,
        });
        this.map.addLayer(this.wmsLayer);
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
        if (this.wmsLayer) {
            this.map.removeLayer(this.wmsLayer);
        }
        if (this.whiteLayer) {
            this.map.removeLayer(this.whiteLayer);
        }
    },
});
export default SatilliteCloudComponent;

